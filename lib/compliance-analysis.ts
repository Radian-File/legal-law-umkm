import OpenAI from "openai";

export type ComplianceIssue = {
  clauseText: string;
  riskLevel: "High Risk" | "Medium Risk" | "Compliant";
  reason: string;
  recommendation: string;
};

type ParsedAIResponse = {
  issues: ComplianceIssue[];
};

const DEFAULT_GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
const REQUEST_TIMEOUT_MS = Number.isFinite(Number(process.env.GROQ_TIMEOUT_MS))
  ? Number(process.env.GROQ_TIMEOUT_MS)
  : 60_000;
const MAX_DOCUMENT_CHARS = 18_000;

function getGroqBaseUrl() {
  return (process.env.GROQ_BASE_URL?.trim() || DEFAULT_GROQ_BASE_URL).replace(/\/$/, "");
}

function getGroqModel() {
  return process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL;
}

function cleanJSONString(str: string): string {
  const trimmed = str.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1).trim();
  }

  return trimmed.replace(/^`+|`+$/g, "").trim();
}

function isValidRiskLevel(value: unknown): value is ComplianceIssue["riskLevel"] {
  return value === "High Risk" || value === "Medium Risk" || value === "Compliant";
}

function validateParsedResponse(input: unknown): ParsedAIResponse {
  if (!input || typeof input !== "object" || !Array.isArray((input as { issues?: unknown }).issues)) {
    throw new Error("AI response does not match the required { issues: [...] } schema.");
  }

  const issues = (input as { issues: unknown[] }).issues.map((issue, index) => {
    if (!issue || typeof issue !== "object") {
      throw new Error(`Issue at index ${index} is not an object.`);
    }

    const candidate = issue as Record<string, unknown>;

    if (
      typeof candidate.clauseText !== "string" ||
      !candidate.clauseText.trim() ||
      !isValidRiskLevel(candidate.riskLevel) ||
      typeof candidate.reason !== "string" ||
      !candidate.reason.trim() ||
      typeof candidate.recommendation !== "string" ||
      !candidate.recommendation.trim()
    ) {
      throw new Error(`Issue at index ${index} is missing required ComplianceIssue fields.`);
    }

    return {
      clauseText: candidate.clauseText.trim(),
      riskLevel: candidate.riskLevel,
      reason: candidate.reason.trim(),
      recommendation: candidate.recommendation.trim(),
    } satisfies ComplianceIssue;
  });

  return { issues };
}

function buildSystemPrompt() {
  return `Anda adalah Ahli Hukum Korporat Senior di Indonesia. Tugas Anda adalah mengaudit dokumen hukum. Anda harus sangat objektif. JIKA sebuah pasal sudah sesuai dengan hukum yang berlaku, Anda WAJIB memberikan status 'Compliant'. Jangan mencari-cari kesalahan yang tidak substansial atau mengada-ada. HANYA gunakan 'High Risk' untuk pelanggaran fatal (seperti di bawah UMP, melanggar hak asasi, denda tak wajar) dan 'Medium Risk' untuk ketidakjelasan administratif.
Respons HANYA dalam JSON murni: { "issues": [ { "clauseText": "...", "riskLevel": "High Risk" | "Medium Risk" | "Compliant", "reason": "...", "recommendation": "..." } ] }`;
}

function buildUserPrompt(documentText: string) {
  return `Analisis setiap pasal dalam dokumen hukum berikut. Kelompokkan menjadi maksimal 5 poin analisis utama. Jika dokumen ini dirasa sudah sangat aman dan mematuhi standar hukum ketenagakerjaan atau korporasi Indonesia, pastikan mayoritas atau semua 'riskLevel' bernilai 'Compliant'.
Dokumen: ${documentText.slice(0, MAX_DOCUMENT_CHARS)}`;
}

export async function analyzeDocumentTextWithGroq(documentText: string): Promise<ComplianceIssue[]> {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable.");
  }

  const text = documentText.trim();

  if (!text) {
    throw new Error("documentText is required and must be a non-empty string.");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: getGroqBaseUrl(),
    timeout: REQUEST_TIMEOUT_MS,
  });

  try {
    const completion = await client.chat.completions.create({
      model: getGroqModel(),
      temperature: 0.1,
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(),
        },
        {
          role: "user",
          content: buildUserPrompt(text),
        },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent || typeof rawContent !== "string") {
      throw new Error("Groq returned an empty response.");
    }

    try {
      const cleaned = cleanJSONString(rawContent);
      const parsedData = validateParsedResponse(JSON.parse(cleaned));
      return parsedData.issues;
    } catch (error) {
      console.error("[compliance-analysis] Failed to parse Groq JSON response", {
        rawContent,
        error,
      });

      throw new Error("Failed to parse Groq response as valid JSON.");
    }
  } catch (error) {
    if (error instanceof Error && /401|403|unauthorized|api key/i.test(error.message)) {
      throw new Error("Groq authentication failed. Check GROQ_API_KEY.");
    }

    if (error instanceof Error && /429|rate limit|quota/i.test(error.message)) {
      throw new Error("Groq quota or rate limit exceeded.");
    }

    if (error instanceof Error && /404|not found|model_decommissioned|model/i.test(error.message)) {
      throw new Error(`Groq model \"${getGroqModel()}\" is unavailable. Check GROQ_MODEL.`);
    }

    throw error;
  }
}
