import { NextResponse } from "next/server";

import { analyzeDocumentTextWithGroq } from "@/lib/compliance-analysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnalyzeRequestBody = {
  documentText?: string;
};

export async function POST(request: Request) {
  try {
    let body: AnalyzeRequestBody;

    try {
      body = (await request.json()) as AnalyzeRequestBody;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON body.",
        },
        { status: 400 }
      );
    }

    const documentText = typeof body.documentText === "string" ? body.documentText.trim() : "";

    if (!documentText) {
      return NextResponse.json(
        {
          success: false,
          error: "documentText is required and must be a non-empty string.",
        },
        { status: 400 }
      );
    }

    const issues = await analyzeDocumentTextWithGroq(documentText);

    return NextResponse.json({ success: true, data: issues });
  } catch (error) {
    console.error("[api/analyze] Groq analysis failed", error);

    const message = error instanceof Error ? error.message : "Unknown error.";
    const lowered = message.toLowerCase();

    if (lowered.includes("documenttext is required")) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 400 }
      );
    }

    if (lowered.includes("authentication") || lowered.includes("groq_api_key")) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 502 }
      );
    }

    if (lowered.includes("quota") || lowered.includes("rate limit") || lowered.includes("429")) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 429 }
      );
    }

    if (lowered.includes("model") && lowered.includes("unavailable")) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 503 }
      );
    }

    if (lowered.includes("parse groq") || lowered.includes("schema")) {
      return NextResponse.json(
        {
          success: false,
          error: "Groq returned an invalid JSON response.",
          details: message,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze document with Groq.",
        details: message,
      },
      { status: 500 }
    );
  }
}
