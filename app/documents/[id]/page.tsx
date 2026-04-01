import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronLeft, FileClock, FileSearch, ShieldCheck, Sparkles } from "lucide-react";
import { ComplianceStatus } from "@prisma/client";

import { DeleteDocumentButton } from "@/components/documents/delete-document-button";
import { InsightCard, PageIntro, SectionTitle } from "@/components/documents/shared";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

const statusMap: Record<ComplianceStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
  COMPLIANT: { label: "Compliant", variant: "success" },
  REVIEW_REQUIRED: { label: "Review Required", variant: "warning" },
  HIGH_RISK: { label: "High Risk", variant: "danger" },
  PROCESSING: { label: "Processing", variant: "info" },
  PENDING: { label: "Pending", variant: "neutral" },
  FAILED: { label: "Failed", variant: "danger" },
};

export default async function DocumentDetailPage({ params }: { params: { id: string } }) {
  const document = await prisma.document.findUnique({
    where: { id: params.id },
    include: {
      uploadedBy: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      results: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!document) {
    notFound();
  }

  const latestResult = document.results[0] ?? null;
  const status = statusMap[document.complianceStatus];
  const uploaderName = [document.uploadedBy?.firstName, document.uploadedBy?.lastName].filter(Boolean).join(" ") || document.uploadedBy?.email || "Unknown";
  const healthScore = Math.max(0, 100 - Math.round(document.riskScore ?? 0));
  const summary = latestResult?.overallSummary || "Dokumen berhasil diunggah dan siap untuk dianalisis lebih lanjut.";
  const risks = Array.isArray(latestResult?.risks) ? latestResult?.risks : [];
  const context = Array.isArray(latestResult?.retrievedContext) ? latestResult?.retrievedContext : [];
  const textPreview = document.rawText.split(/\n+/).filter(Boolean).slice(0, 3);

  return (
    <div className="space-y-8 pb-8 pt-6">
      <PageIntro
        eyebrow="Document Detail"
        title={document.title}
        description={summary}
        actions={
          <>
            <Link href="/documents" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-2xl px-6" })}>
              <ChevronLeft className="h-4 w-4" /> Back to library
            </Link>
            <DeleteDocumentButton
              documentId={document.id}
              documentTitle={document.title}
              redirectTo="/documents"
              size="lg"
              variant="outline"
              className="rounded-2xl px-6"
            />
            <Button variant="teal" size="lg" className="rounded-2xl px-6 font-semibold" disabled>
              Download packet
            </Button>
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
          <CardContent className="grid gap-6 p-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
            <div className="space-y-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium tracking-wider text-teal-400">
                <Sparkles className="h-3.5 w-3.5" /> LIVE DOCUMENT BRIEFING
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Status: {status.label}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
                  Halaman ini sekarang menggunakan data asli dari dokumen yang diunggah. Jika analisis AI belum dijalankan, metadata upload dan preview teks tetap akan tampil di sini.
                </p>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-authority text-white/65">Health score</p>
              <p className="mt-3 text-5xl font-semibold tracking-editorial text-white">{healthScore}%</p>
              <div className="mt-4 h-3 rounded-full bg-white/10">
                <div className="h-3 rounded-full bg-gradient-to-r from-secondary-teal to-secondary-calm" style={{ width: `${healthScore}%` }} />
              </div>
              <div className="mt-4">
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-soft">
          <CardContent className="space-y-4 p-6">
            <SectionTitle eyebrow="Registry snapshot" title="Metadata" description="Data ini diambil langsung dari hasil upload saat ini." />
            <dl className="space-y-4 text-sm">
              {[
                ["Uploader", uploaderName],
                ["Type", document.type],
                ["File name", document.fileName ?? "-"],
                ["Mime type", document.mimeType ?? "-"],
                ["Chunks", String(document.chunkCount)],
                ["Risk score", String(document.riskScore ?? 0)],
                ["Uploaded", new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(document.createdAt)],
                ["Updated", new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(document.updatedAt)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4 border-b border-white/40 pb-3 last:border-b-0 last:pb-0">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="max-w-[60%] text-right font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <InsightCard eyebrow="Extracted content" title="Preview hasil parsing" description="Ringkasan teks awal dari dokumen yang berhasil diproses.">
            <div className="grid gap-4">
              {textPreview.length > 0 ? (
                textPreview.map((paragraph, index) => (
                  <div key={index} className="rounded-[1.5rem] bg-surface-low p-5 text-sm leading-7 text-muted-foreground">
                    {paragraph}
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] bg-surface-low p-5 text-sm leading-7 text-muted-foreground">
                  Belum ada preview teks yang tersedia untuk dokumen ini.
                </div>
              )}
            </div>
          </InsightCard>

          <InsightCard eyebrow="Key findings" title="AI summary and risks" description="Jika analisis sudah dijalankan, hasil risiko akan muncul di sini.">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.5rem] bg-surface-low p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-3 text-primary-deep shadow-subtle">
                    <FileSearch className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="authority-label">AI insight</p>
                    <h3 className="text-base font-semibold text-foreground">Summary</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{summary}</p>
              </div>

              <div className="rounded-[1.5rem] bg-surface-low p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-3 text-primary-deep shadow-subtle">
                    <FileClock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="authority-label">Action list</p>
                    <h3 className="text-base font-semibold text-foreground">Risks</h3>
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  {risks.length > 0 ? (
                    risks.map((risk, index) => {
                      const typedRisk = risk as {
                        clauseText?: string;
                        riskLevel?: string;
                        reason?: string;
                        recommendation?: string;
                      };
                      return (
                        <div key={index} className="rounded-2xl bg-white px-4 py-3 shadow-subtle">
                          <p className="font-semibold text-foreground">{typedRisk.clauseText || `Risk ${index + 1}`}</p>
                          <p className="mt-1 text-xs uppercase tracking-authority text-muted-foreground">{typedRisk.riskLevel || "unknown"}</p>
                          <p className="mt-2">{typedRisk.reason || "No explanation provided."}</p>
                          {typedRisk.recommendation ? <p className="mt-2 text-xs text-secondary-teal">Recommendation: {typedRisk.recommendation}</p> : null}
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-subtle">
                      Belum ada hasil analisis risiko. Jalankan analisis AI untuk melihat clause-level findings.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </InsightCard>
        </div>

        <div className="space-y-4">
          <InsightCard eyebrow="Retrieved context" title="Linked legal references" description="Konteks regulasi yang pernah dikembalikan oleh analisis AI akan ditampilkan di sini.">
            <div className="space-y-3">
              {context.length > 0 ? (
                context.map((item, index) => {
                  const typedItem = item as { sourceTitle?: string; citation?: string; content?: string };
                  return (
                    <div key={index} className="rounded-[1.5rem] bg-surface-low p-4">
                      <p className="text-sm font-medium leading-6 text-foreground">{typedItem.sourceTitle || "Untitled reference"}</p>
                      <p className="mt-1 text-xs uppercase tracking-authority text-muted-foreground">{typedItem.citation || "No citation"}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{typedItem.content || "No content available."}</p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[1.5rem] bg-surface-low p-4 text-sm leading-6 text-muted-foreground">
                  Belum ada law reference yang tertaut untuk dokumen ini.
                </div>
              )}
            </div>
          </InsightCard>

          <Card className="bg-card-soft">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-primary-deep shadow-subtle">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="authority-label">Recommended next move</p>
                  <h3 className="text-lg font-semibold text-foreground">Lanjutkan dari dokumen ini</h3>
                </div>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Dokumen yang sudah diunggah bisa langsung dibandingkan dengan hasil analisis AI atau menjadi template untuk intake berikutnya.
              </p>
              <Link href="/documents/upload" className="inline-flex items-center gap-2 text-sm font-medium text-secondary-teal">
                Unggah dokumen lain <ArrowUpRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
