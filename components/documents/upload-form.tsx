"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CloudUpload, FileCheck2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const documentTypes = [
  { label: "Contract", value: "CONTRACT" },
  { label: "Agreement", value: "AGREEMENT" },
  { label: "Corporate", value: "CORPORATE" },
  { label: "Employment", value: "EMPLOYMENT" },
  { label: "Policy", value: "POLICY" },
  { label: "Regulation", value: "REGULATION" },
  { label: "Other", value: "OTHER" },
];

const REQUEST_TIMEOUT_MS = 60_000;

export function UploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("OTHER");
  const [file, setFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const inferredTitle = useMemo(() => {
    if (file) return file.name.replace(/\.[^.]+$/, "");
    if (documentText.trim()) return "Pasted Document";
    return "";
  }, [file, documentText]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    setError(null);
    setSuccess(null);

    if (nextFile && !title) {
      setTitle(nextFile.name.replace(/\.[^.]+$/, ""));
    }
  }

  async function safeReadJson(response: Response) {
    const text = await response.text();

    if (!text) {
      return {} as Record<string, unknown>;
    }

    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return { error: text } satisfies Record<string, unknown>;
    }
  }

  async function uploadWithTimeout(formData: FormData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      return await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file && !documentText.trim()) {
      setError("Silakan pilih file atau tempelkan isi dokumen terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("title", title || inferredTitle || "Untitled Document");
      formData.append("type", type);
      formData.append("autoAnalyze", "true");

      if (file) {
        formData.append("file", file);
      }

      if (documentText.trim()) {
        formData.append("documentText", documentText.trim());
      }

      const response = await uploadWithTimeout(formData);
      const payload = (await safeReadJson(response)) as {
        error?: string;
        warning?: string;
        documentId?: string;
        title?: string;
      };

      if (!response.ok || !payload.documentId) {
        throw new Error(payload.error || "Upload gagal diproses.");
      }

      const successMessage = payload.warning
        ? `${payload.warning} Dokumen tetap berhasil diunggah.`
        : `Dokumen “${payload.title ?? title ?? file?.name ?? "tanpa judul"}” berhasil diunggah.`;

      setSuccess(successMessage);

      router.push(`/documents/${payload.documentId}`);
      router.refresh();
    } catch (uploadError) {
      if (uploadError instanceof DOMException && uploadError.name === "AbortError") {
        setError("Permintaan upload terlalu lama dan dihentikan. Coba lagi dengan file yang lebih kecil atau format PDF/TXT.");
      } else {
        setError(uploadError instanceof Error ? uploadError.message : "Terjadi kesalahan saat mengunggah file.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-foreground">
          Document title
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Vendor Data Processing Addendum" />
        </label>

        <label className="space-y-2 text-sm font-medium text-foreground">
          Category
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="flex h-11 w-full rounded-xl border-0 bg-surface-low px-4 py-2 text-sm text-foreground transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary-teal/60"
          >
            {documentTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Card className="rounded-[1.75rem] border border-dashed border-secondary-teal/35 bg-surface-low">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-white p-4 text-primary-deep shadow-subtle">
              <CloudUpload className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-editorial text-foreground">Pilih file dokumen untuk diunggah</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Upload mendukung PDF dan TXT. Untuk teks mentah, Anda juga bisa langsung menempelkan isi dokumen di kolom bawah.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center rounded-xl bg-secondary-teal px-5 py-3 text-sm font-semibold text-slate-950 shadow-subtle transition hover:bg-secondary-calm">
              Choose file
              <input type="file" className="sr-only" accept=".pdf,.txt" onChange={handleFileChange} />
            </label>
            <p className="text-sm text-muted-foreground">{file ? `Selected: ${file.name}` : "Belum ada file dipilih"}</p>
          </div>
        </CardContent>
      </Card>

      <label className="block space-y-2 text-sm font-medium text-foreground">
        Atau tempelkan isi dokumen
        <textarea
          value={documentText}
          onChange={(event) => setDocumentText(event.target.value)}
          rows={8}
          placeholder="Tempelkan isi kontrak, kebijakan, atau dokumen hukum di sini jika tidak ingin upload file."
          className="w-full rounded-[1.5rem] border-0 bg-surface-low px-4 py-3 text-sm leading-6 text-foreground outline-none ring-0 transition-all duration-200 placeholder:text-muted-foreground focus:bg-white focus:ring-2 focus:ring-secondary-teal/60"
        />
      </label>

      {error ? (
        <div className="flex items-start gap-3 rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      {success ? (
        <div className="flex items-start gap-3 rounded-2xl bg-success-soft px-4 py-3 text-sm text-success-foreground">
          <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{success}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="default" size="lg" className="rounded-2xl px-6 font-semibold" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
          {isSubmitting ? "Mengunggah & menganalisis..." : "Unggah dokumen"}
        </Button>
      </div>
    </form>
  );
}
