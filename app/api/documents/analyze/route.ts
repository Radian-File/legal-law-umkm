import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

type RetrievedLawChunk = {
  id: string;
  sourceTitle: string;
  citation: string | null;
  content: string;
};

type ComplianceRisk = {
  severity: "low" | "medium" | "high";
  clause: string;
  explanation: string;
};

type AnalyzeRequestBody = {
  documentId?: string;
};

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequestBody;
    const documentId = body.documentId?.trim();

    if (!documentId) {
      return NextResponse.json({ error: "documentId is required." }, { status: 400 });
    }

    // Step 1: Load the extracted document text that was saved during upload.
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: {
        id: true,
        title: true,
        rawText: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    await prisma.document.update({
      where: { id: document.id },
      data: { complianceStatus: "PROCESSING" },
    });

    // Step 2: Simulate vector retrieval against Indonesian law chunks.
    // In production this would:
    //   a) generate an embedding for the document or relevant chunks,
    //   b) execute a pgvector similarity search,
    //   c) return the most relevant regulatory passages.
    const retrievedLawChunks = await queryVectorDB(document.rawText);

    // Step 3: Build a strict JSON-only prompt for Gemini or another LLM.
    const prompt = buildCompliancePrompt({
      documentTitle: document.title,
      rawText: document.rawText,
      legalContext: retrievedLawChunks,
    });

    // Step 4: Call the LLM endpoint. This is intentionally a placeholder foundation.
    const llmResponseText = await callGeminiForComplianceAnalysis(prompt);
    const parsedResponse = parseComplianceJson(llmResponseText);

    const riskScore = calculateRiskScore(parsedResponse.risks);
    const complianceStatus = deriveComplianceStatus(parsedResponse.risks);

    // Step 5: Persist the structured result and summary back into PostgreSQL.
    const savedResult = await prisma.complianceResult.create({
      data: {
        documentId: document.id,
        modelName: "gemini-placeholder",
        promptVersion: "v1-rag-foundation",
        overallSummary: parsedResponse.summary,
        risks: parsedResponse.risks as unknown as Prisma.InputJsonValue,
        retrievedContext: retrievedLawChunks as unknown as Prisma.InputJsonValue,
      },
    });

    await prisma.document.update({
      where: { id: document.id },
      data: {
        complianceStatus,
        riskScore,
      },
    });

    return NextResponse.json({
      documentId: document.id,
      complianceResultId: savedResult.id,
      complianceStatus,
      riskScore,
      summary: parsedResponse.summary,
      risks: parsedResponse.risks,
      retrievedLawChunks,
    });
  } catch (error) {
    console.error("[documents/analyze] failed", error);

    return NextResponse.json(
      {
        error: "Failed to analyze document.",
      },
      { status: 500 }
    );
  }
}

async function queryVectorDB(text: string): Promise<RetrievedLawChunk[]> {
  // Placeholder retrieval strategy:
  // - This currently fetches a few recent law chunks as stand-ins for semantic hits.
  // - Replace with a raw SQL pgvector query once embeddings are generated.
  // Example production SQL shape:
  // SELECT id, source_title, citation, content
  // FROM "LawReference"
  // ORDER BY embedding <=> $1::vector
  // LIMIT 5;

  const fallbackRows = await prisma.lawReference.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      sourceTitle: true,
      citation: true,
      content: true,
    },
  });

  if (fallbackRows.length > 0) {
    return fallbackRows;
  }

  // Final fallback so the route remains runnable before regulation seeding exists.
  return [
    {
      id: "seed-pdp-001",
      sourceTitle: "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi",
      citation: "Pasal 20-46",
      content:
        "Pengendali data pribadi wajib memastikan dasar pemrosesan yang sah, menjaga keamanan data, dan memenuhi kewajiban notifikasi ketika terjadi kegagalan pelindungan data.",
    },
    {
      id: "seed-oss-001",
      sourceTitle: "PP No. 5 Tahun 2021 tentang Perizinan Berusaha Berbasis Risiko",
      citation: "Ketentuan umum OSS-RBA",
      content:
        "Pelaku usaha wajib memastikan izin berbasis risiko, pelaporan kegiatan usaha, dan kepatuhan administratif sesuai sektor yang relevan.",
    },
  ];
}

function buildCompliancePrompt(input: {
  documentTitle: string;
  rawText: string;
  legalContext: RetrievedLawChunk[];
}) {
  return `You are an Indonesian legal compliance analyst for IndoLegal Compliance AI.

TASK:
Compare the uploaded legal document against the provided Indonesian regulatory context.
Identify concrete compliance risks, ambiguous clauses, missing obligations, or suspicious legal language.

STRICT OUTPUT RULES:
- Return valid JSON only.
- Do not wrap the JSON in markdown.
- Follow this exact schema:
{
  "summary": "string",
  "risks": [
    {
      "severity": "low | medium | high",
      "clause": "short clause reference or excerpt",
      "explanation": "clear explanation in Indonesian or English"
    }
  ]
}
- If no risks are found, return an empty array for risks.

DOCUMENT TITLE:
${input.documentTitle}

DOCUMENT TEXT:
"""
${input.rawText.slice(0, 12000)}
"""

RETRIEVED LEGAL CONTEXT:
${input.legalContext
  .map(
    (law, index) => `${index + 1}. ${law.sourceTitle} | ${law.citation ?? "Tanpa sitasi"}\n${law.content}`
  )
  .join("\n\n")}

ANALYSIS REQUIREMENTS:
- Focus on legal obligations, missing safeguards, risky terms, data protection exposure, licensing exposure, and enforceability risks.
- Prefer precise clause-level findings instead of generic summaries.
- Use severity=high only when the clause presents material legal or compliance exposure.
`;
}

async function callGeminiForComplianceAnalysis(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Placeholder behavior for local development before secrets are wired.
  if (!apiKey) {
    return JSON.stringify({
      summary:
        "Dokumen memerlukan telaah lanjutan pada klausul perlindungan data dan kepatuhan administratif sebelum dapat dinyatakan sepenuhnya patuh.",
      risks: [
        {
          severity: "high",
          clause: "Klausul pemrosesan data pribadi belum mendefinisikan dasar pemrosesan dan notifikasi insiden.",
          explanation:
            "Berpotensi tidak selaras dengan kewajiban pengendali data dalam UU PDP apabila terjadi kebocoran data atau sengketa subjek data.",
        },
        {
          severity: "medium",
          clause: "Klausul perizinan operasional belum merujuk mekanisme OSS-RBA yang relevan.",
          explanation:
            "Dokumen dapat menimbulkan risiko administratif bila kewajiban pelaporan atau perizinan sektoral belum dicantumkan dengan tepat.",
        },
      ],
    });
  }

  // Example Gemini REST call shape. Adjust endpoint/model as needed.
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text || typeof text !== "string") {
    throw new Error("Gemini response did not contain JSON text.");
  }

  return text;
}

function parseComplianceJson(raw: string): { summary: string; risks: ComplianceRisk[] } {
  const parsed = JSON.parse(raw) as {
    summary?: unknown;
    risks?: unknown;
  };

  const summary = typeof parsed.summary === "string" ? parsed.summary : "No summary provided.";
  const risks = Array.isArray(parsed.risks)
    ? parsed.risks
        .map((risk) => normalizeRisk(risk))
        .filter((risk): risk is ComplianceRisk => Boolean(risk))
    : [];

  return { summary, risks };
}

function normalizeRisk(input: unknown): ComplianceRisk | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidate = input as Record<string, unknown>;
  const severity = candidate.severity;
  const clause = candidate.clause;
  const explanation = candidate.explanation;

  if (
    (severity === "low" || severity === "medium" || severity === "high") &&
    typeof clause === "string" &&
    typeof explanation === "string"
  ) {
    return { severity, clause, explanation };
  }

  return null;
}

function calculateRiskScore(risks: ComplianceRisk[]): number {
  const total = risks.reduce((score, risk) => {
    switch (risk.severity) {
      case "high":
        return score + 35;
      case "medium":
        return score + 20;
      case "low":
        return score + 8;
      default:
        return score;
    }
  }, 0);

  return Math.min(100, total);
}

function deriveComplianceStatus(risks: ComplianceRisk[]): "COMPLIANT" | "REVIEW_REQUIRED" | "HIGH_RISK" {
  if (risks.some((risk) => risk.severity === "high")) {
    return "HIGH_RISK";
  }

  if (risks.length > 0) {
    return "REVIEW_REQUIRED";
  }

  return "COMPLIANT";
}
