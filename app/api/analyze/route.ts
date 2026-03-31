import { NextResponse } from "next/server";

import { analyzeDocumentTextWithGemini } from "@/lib/compliance-analysis";
import { parseDocumentInput, parseRawText } from "@/lib/document-parser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnalyzeRequestBody = {
  documentText?: unknown;
};

async function extractTextFromRequest(request: Request): Promise<string> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as AnalyzeRequestBody;
    const documentText = typeof body.documentText === "string" ? body.documentText.trim() : "";

    if (!documentText) {
      throw new Error("documentText is required and must be a non-empty string.");
    }

    return parseRawText(documentText).rawText;
  }

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    const rawText = String(formData.get("documentText") ?? "").trim();

    if (file instanceof File) {
      const parsedDocument = await parseDocumentInput({
        fileBuffer: Buffer.from(await file.arrayBuffer()),
        fileName: file.name,
        mimeType: file.type,
      });

      return parsedDocument.rawText;
    }

    if (rawText) {
      return parseRawText(rawText).rawText;
    }

    throw new Error("Provide either a file upload or documentText in multipart form-data.");
  }

  throw new Error("Unsupported content type. Use application/json or multipart/form-data.");
}

export async function POST(request: Request) {
  try {
    const documentText = await extractTextFromRequest(request);
    const parsedData = await analyzeDocumentTextWithGemini(documentText);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error) {
    console.error("[api/analyze] Gemini compliance analysis failed", error);

    const message = error instanceof Error ? error.message : "Unknown error.";
    const lowered = message.toLowerCase();

    if (lowered.includes("missing gemini_api_key")) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing GEMINI_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    if (lowered.includes("timed out")) {
      return NextResponse.json(
        {
          success: false,
          error: "AI analysis request timed out. Please try again.",
        },
        { status: 504 }
      );
    }

    if (lowered.includes("parse") || lowered.includes("json array") || lowered.includes("schema")) {
      return NextResponse.json(
        {
          success: false,
          error: "AI returned an invalid JSON response.",
          details: message,
        },
        { status: 502 }
      );
    }

    if (
      lowered.includes("documenttext is required") ||
      lowered.includes("provide either a file upload") ||
      lowered.includes("unsupported content type") ||
      lowered.includes("unsupported file format") ||
      lowered.includes("doc/docx parsing") ||
      lowered.includes("no readable text")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 400 }
      );
    }

    if (lowered.includes("model") && lowered.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: "Configured Gemini model is not available for this API version.",
          details: message,
        },
        { status: 502 }
      );
    }

    if (lowered.includes("api key") || lowered.includes("permission") || lowered.includes("unauthorized") || lowered.includes("403")) {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini API authentication failed. Check GEMINI_API_KEY.",
          details: message,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze document.",
        details: message,
      },
      { status: 500 }
    );
  }
}
