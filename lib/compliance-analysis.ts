import { GoogleGenerativeAI } from "@google/generative-ai";

export type ComplianceIssue = {
  clauseText: string;
  riskLevel: "High Risk" | "Medium Risk" | "Compliant";
  reason: string;
  recommendation: string;
};

const MODEL_NAME = "gemini-3.1-pro-preview";
const REQUEST_TIMEOUT_MS = 45_000;

const SYSTEM_INSTRUCTION = `You are an Elite Indonesian Corporate Lawyer with deep expertise in Indonesian corporate law, contract drafting, employment law, PDPL/PDP compliance, fintech regulation, consumer protection, licensing, and enforceability under Indonesian law.

Your job is to review legal or business documents and identify compliance risks, enforceability problems, ambiguous clauses, missing legal safeguards, and language that may expose the company to regulatory, civil, administrative, or operational risk in Indonesia.

You MUST return ONLY a valid JSON array.
You MUST NOT return markdown.
You MUST NOT return commentary before or after the JSON.
You MUST NOT return an object.
You MUST return an array where every item strictly matches this structure:
[
  {
    "clauseText": "string",
    "riskLevel": "High Risk" | "Medium Risk" | "Compliant",
    "reason": "string",
    "recommendation": "string"
  }
]

Rules:
- clauseText must quote or closely paraphrase the problematic clause from the source text.
- riskLevel must be exactly one of: "High Risk", "Medium Risk", or "Compliant".
- reason must explain the legal issue using Indonesian legal reasoning and mention relevant Indonesian law or legal principle where appropriate.
- recommendation must provide a concrete clause revision suggestion or legal improvement.
- If the document is generally safe, still return findings for important clauses and mark them as "Compliant" where justified.
- Never invent laws. If legal basis is uncertain, say so carefully and stay conservative.
- Keep the analysis factual, professional, and concise.`;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Gemini request timed out after ${timeoutMs}ms.`));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

function buildPrompt(documentText: string) {
  return `Review the following document under Indonesian legal and regulatory standards.

Your task:
1. Identify clauses that create legal, regulatory, enforceability, privacy, employment, licensing, consumer protection, or corporate governance risk in Indonesia.
2. Flag whether each clause is High Risk, Medium Risk, or Compliant.
3. Explain the legal reason clearly.
4. Provide a concrete recommendation to improve the clause.
5. Return ONLY the required JSON array.

Document text:
"""
${documentText}
"""`;
}

function normalizeIssue(input: unknown): ComplianceIssue | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidate = input as Record<string, unknown>;
  const clauseText = candidate.clauseText;
  const riskLevel = candidate.riskLevel;
  const reason = candidate.reason;
  const recommendation = candidate.recommendation;

  const validRiskLevel = riskLevel === "High Risk" || riskLevel === "Medium Risk" || riskLevel === "Compliant";

  if (
    typeof clauseText !== "string" ||
    !clauseText.trim() ||
    !validRiskLevel ||
    typeof reason !== "string" ||
    !reason.trim() ||
    typeof recommendation !== "string" ||
    !recommendation.trim()
  ) {
    return null;
  }

  return {
    clauseText: clauseText.trim(),
    riskLevel,
    reason: reason.trim(),
    recommendation: recommendation.trim(),
  };
}

function parseComplianceIssues(rawText: string): ComplianceIssue[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new Error(`Failed to parse Gemini JSON response: ${(error as Error).message}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Gemini response was not a JSON array.");
  }

  const normalized = parsed.map((item) => normalizeIssue(item)).filter((item): item is ComplianceIssue => Boolean(item));

  if (normalized.length !== parsed.length) {
    throw new Error("Gemini response did not match the required ComplianceIssue[] schema.");
  }

  return normalized;
}

export async function analyzeDocumentTextWithGemini(documentText: string): Promise<ComplianceIssue[]> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  const text = documentText.trim();

  if (!text) {
    throw new Error("documentText is required and must be a non-empty string.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });

  const result = await withTimeout(model.generateContent(buildPrompt(text)), REQUEST_TIMEOUT_MS);
  const responseText = result.response.text();

  if (!responseText || !responseText.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  return parseComplianceIssues(responseText);
}
