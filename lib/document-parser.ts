import pdfParse from "pdf-parse";

export type DocumentChunk = {
  index: number;
  content: string;
  tokenEstimate: number;
};

export type ParsedDocument = {
  rawText: string;
  paragraphs: string[];
  chunks: DocumentChunk[];
};

const PDF_PARSE_TIMEOUT_MS = 20_000;

/**
 * First stage of the ingestion pipeline:
 * 1. Decode the uploaded file into raw text.
 * 2. Normalize whitespace and remove noisy line breaks.
 * 3. Chunk the text into paragraph-like units so downstream embedding / RAG steps
 *    can work with logical legal clauses instead of one giant blob.
 */
export async function parseDocumentInput(input: { fileBuffer: Buffer; fileName?: string | null; mimeType?: string | null }): Promise<ParsedDocument> {
  const fileName = input.fileName?.toLowerCase() ?? "";
  const mimeType = input.mimeType?.toLowerCase() ?? "";

  const isPdf = mimeType.includes("pdf") || fileName.endsWith(".pdf");
  const isPlainText = mimeType.startsWith("text/") || fileName.endsWith(".txt") || fileName.endsWith(".md");
  const isWord =
    mimeType.includes("word") ||
    mimeType.includes("officedocument.wordprocessingml") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx");

  let extractedText = "";

  if (isPlainText) {
    extractedText = input.fileBuffer.toString("utf-8");
  } else if (isPdf) {
    extractedText = await parsePdfBuffer(input.fileBuffer);
  } else if (isWord) {
    throw new Error("DOC/DOCX parsing is not enabled yet. Please upload PDF or TXT, or add DOCX extraction before sending to AI.");
  } else {
    throw new Error("Unsupported file format. Please upload a PDF or TXT file.");
  }

  return buildParsedDocument(extractedText);
}

export async function parseDocumentBuffer(fileBuffer: Buffer): Promise<ParsedDocument> {
  return parseDocumentInput({ fileBuffer, mimeType: "application/pdf" });
}

export function parseRawText(rawInput: string): ParsedDocument {
  return buildParsedDocument(rawInput);
}

async function parsePdfBuffer(fileBuffer: Buffer): Promise<string> {
  const parsed = await withTimeout(pdfParse(fileBuffer), PDF_PARSE_TIMEOUT_MS, "PDF parsing timed out.");
  return parsed.text;
}

function buildParsedDocument(rawInput: string): ParsedDocument {
  const rawText = normalizeExtractedText(rawInput);

  if (!rawText) {
    throw new Error("No readable text could be extracted from the uploaded content.");
  }

  const paragraphs = splitIntoParagraphs(rawText);
  const chunks = paragraphs.map((content, index) => ({
    index,
    content,
    tokenEstimate: estimateTokens(content),
  }));

  return {
    rawText,
    paragraphs,
    chunks,
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);

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

function normalizeExtractedText(text: string): string {
  return text
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\u00A0/g, " ")
    // Merge lines that were broken mid-sentence during PDF extraction.
    .replace(/([^\n])\n([^\n])/g, "$1 $2")
    // Restore paragraph boundaries where there are 2+ line breaks.
    .replace(/\n{2,}/g, "\n\n")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

function splitIntoParagraphs(rawText: string): string[] {
  const paragraphCandidates = rawText
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  // If the extractor produced one large block, fall back to sentence grouping.
  if (paragraphCandidates.length <= 1) {
    return chunkBySentenceWindow(rawText, 4);
  }

  return paragraphCandidates.flatMap((paragraph) => {
    if (paragraph.length > 1800) {
      return chunkBySentenceWindow(paragraph, 4);
    }

    return [paragraph];
  });
}

function chunkBySentenceWindow(text: string, sentencesPerChunk: number): string[] {
  const sentences = text
    .split(/(?<=[.!?;:])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const chunks: string[] = [];

  for (let index = 0; index < sentences.length; index += sentencesPerChunk) {
    const chunk = sentences.slice(index, index + sentencesPerChunk).join(" ").trim();

    if (chunk) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.split(/\s+/).length * 1.3);
}
