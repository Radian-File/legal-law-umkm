import { auth, currentUser } from "@clerk/nextjs/server";
import { ComplianceStatus, DocumentType, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { analyzeDocumentTextWithGemini } from "@/lib/compliance-analysis";
import { parseDocumentInput, parseRawText } from "@/lib/document-parser";
import { prisma } from "@/lib/prisma";

const DEFAULT_ORGANIZATION = {
  name: "IndoLegal Workspace",
  slug: "indolegal-workspace",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const explicitTitle = String(formData.get("title") ?? "").trim();
    const typeInput = String(formData.get("type") ?? "OTHER").toUpperCase();
    const rawTextInput = String(formData.get("documentText") ?? "").trim();
    const autoAnalyze = String(formData.get("autoAnalyze") ?? "true").toLowerCase() !== "false";

    if (!(file instanceof File) && !rawTextInput) {
      return NextResponse.json({ error: "Provide either an uploaded file or documentText." }, { status: 400 });
    }

    const title = explicitTitle || (file instanceof File ? stripFileExtension(file.name) : "Pasted Document") || "Untitled Document";
    const documentType = coerceDocumentType(typeInput);

    const parsedDocument =
      file instanceof File
        ? await parseDocumentInput({
            fileBuffer: Buffer.from(await file.arrayBuffer()),
            fileName: file.name,
            mimeType: file.type,
          })
        : parseRawText(rawTextInput);

    const organization = await prisma.organization.upsert({
      where: { slug: DEFAULT_ORGANIZATION.slug },
      update: {},
      create: DEFAULT_ORGANIZATION,
      select: { id: true },
    });

    const { userId } = await auth();
    let uploadedById: string | undefined;

    if (userId) {
      const clerkProfile = await currentUser();
      const email = clerkProfile?.primaryEmailAddress?.emailAddress ?? clerkProfile?.emailAddresses[0]?.emailAddress;

      if (email) {
        const localUser = await prisma.user.upsert({
          where: { clerkUserId: userId },
          update: {
            email,
            firstName: clerkProfile?.firstName ?? null,
            lastName: clerkProfile?.lastName ?? null,
            organizationId: organization.id,
          },
          create: {
            clerkUserId: userId,
            email,
            firstName: clerkProfile?.firstName ?? null,
            lastName: clerkProfile?.lastName ?? null,
            organizationId: organization.id,
          },
          select: { id: true },
        });

        uploadedById = localUser.id;
      }
    }

    const initialStatus: ComplianceStatus = autoAnalyze ? "PROCESSING" : "PENDING";

    const document = await prisma.document.create({
      data: {
        organizationId: organization.id,
        uploadedById,
        title,
        type: documentType,
        mimeType: file instanceof File ? file.type || "application/octet-stream" : "text/plain",
        fileName: file instanceof File ? file.name : null,
        rawText: parsedDocument.rawText,
        chunkCount: parsedDocument.chunks.length,
        complianceStatus: initialStatus,
      },
      select: {
        id: true,
        title: true,
        chunkCount: true,
        createdAt: true,
      },
    });

    if (!autoAnalyze) {
      return NextResponse.json(
        {
          documentId: document.id,
          title: document.title,
          chunkCount: document.chunkCount,
          createdAt: document.createdAt,
          analysisStarted: false,
        },
        { status: 201 }
      );
    }

    try {
      const issues = await analyzeDocumentTextWithGemini(parsedDocument.rawText);
      const riskScore = calculateRiskScore(issues);
      const complianceStatus = deriveComplianceStatus(issues);
      const overallSummary = buildOverallSummary(issues);

      await prisma.$transaction([
        prisma.complianceResult.create({
          data: {
            documentId: document.id,
            modelName: "gemini-3.1-pro-preview",
            promptVersion: "v1-strict-json-array",
            overallSummary,
            risks: issues as unknown as Prisma.InputJsonValue,
            retrievedContext: Prisma.JsonNull,
          },
        }),
        prisma.document.update({
          where: { id: document.id },
          data: {
            complianceStatus,
            riskScore,
          },
        }),
      ]);

      return NextResponse.json(
        {
          documentId: document.id,
          title: document.title,
          chunkCount: document.chunkCount,
          createdAt: document.createdAt,
          analysisStarted: true,
          complianceStatus,
          riskScore,
          issues,
        },
        { status: 201 }
      );
    } catch (analysisError) {
      console.error("[documents/upload] analysis failed", analysisError);

      await prisma.document.update({
        where: { id: document.id },
        data: { complianceStatus: "FAILED" },
      });

      const message = analysisError instanceof Error ? analysisError.message : "Unknown analysis error.";
      const warning = message.toLowerCase().includes("model") && message.toLowerCase().includes("not found")
        ? "Document uploaded successfully, but Gemini model configuration is invalid for the current API version."
        : "Document uploaded successfully, but AI analysis failed.";

      return NextResponse.json(
        {
          documentId: document.id,
          title: document.title,
          chunkCount: document.chunkCount,
          createdAt: document.createdAt,
          analysisStarted: false,
          warning,
          error: message,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("[documents/upload] failed", error);

    const message = error instanceof Error ? error.message : "Failed to upload and parse document.";
    const lowered = message.toLowerCase();
    const status =
      lowered.includes("unsupported file") ||
      lowered.includes("doc/docx") ||
      lowered.includes("no readable text") ||
      lowered.includes("provide either")
        ? 400
        : 500;

    return NextResponse.json(
      {
        error: message,
      },
      { status }
    );
  }
}

function coerceDocumentType(value: string): DocumentType {
  const allowedTypes = new Set<DocumentType>([
    "CONTRACT",
    "AGREEMENT",
    "CORPORATE",
    "EMPLOYMENT",
    "POLICY",
    "REGULATION",
    "OTHER",
  ]);

  return allowedTypes.has(value as DocumentType) ? (value as DocumentType) : "OTHER";
}

function stripFileExtension(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "");
}

function calculateRiskScore(issues: Array<{ riskLevel: "High Risk" | "Medium Risk" | "Compliant" }>): number {
  const total = issues.reduce((score, issue) => {
    if (issue.riskLevel === "High Risk") return score + 35;
    if (issue.riskLevel === "Medium Risk") return score + 15;
    return score + 3;
  }, 0);

  return Math.min(100, total);
}

function deriveComplianceStatus(
  issues: Array<{ riskLevel: "High Risk" | "Medium Risk" | "Compliant" }>
): ComplianceStatus {
  if (issues.some((issue) => issue.riskLevel === "High Risk")) {
    return "HIGH_RISK";
  }

  if (issues.some((issue) => issue.riskLevel === "Medium Risk")) {
    return "REVIEW_REQUIRED";
  }

  return "COMPLIANT";
}

function buildOverallSummary(
  issues: Array<{ riskLevel: "High Risk" | "Medium Risk" | "Compliant"; clauseText: string; reason: string }>
): string {
  if (issues.length === 0) {
    return "Tidak ada temuan yang dikembalikan oleh AI untuk dokumen ini.";
  }

  const highRiskCount = issues.filter((issue) => issue.riskLevel === "High Risk").length;
  const mediumRiskCount = issues.filter((issue) => issue.riskLevel === "Medium Risk").length;

  if (highRiskCount > 0) {
    return `AI menemukan ${highRiskCount} klausul high risk dan ${mediumRiskCount} klausul medium risk yang memerlukan review hukum lanjutan.`;
  }

  if (mediumRiskCount > 0) {
    return `AI menemukan ${mediumRiskCount} klausul medium risk yang sebaiknya direvisi sebelum finalisasi dokumen.`;
  }

  return "Klausul utama yang diperiksa tampak compliant berdasarkan review AI awal.";
}
