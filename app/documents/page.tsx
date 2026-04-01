import Link from "next/link";
import { FileSearch, FolderOpenDot, Search, Sparkles, UploadCloud } from "lucide-react";
import { ComplianceStatus } from "@prisma/client";

import { DeleteDocumentButton } from "@/components/documents/delete-document-button";
import { PageIntro, SectionTitle } from "@/components/documents/shared";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";

const statusMap: Record<ComplianceStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
  COMPLIANT: { label: "Compliant", variant: "success" },
  REVIEW_REQUIRED: { label: "Review Required", variant: "warning" },
  HIGH_RISK: { label: "High Risk", variant: "danger" },
  PROCESSING: { label: "Processing", variant: "info" },
  PENDING: { label: "Pending", variant: "neutral" },
  FAILED: { label: "Failed", variant: "danger" },
};

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      type: true,
      complianceStatus: true,
      riskScore: true,
      createdAt: true,
      updatedAt: true,
      uploadedBy: {
        select: {
          firstName: true,
          email: true,
        },
      },
    },
  });

  const totalDocuments = documents.length;
  const highRiskCount = documents.filter((document) => document.complianceStatus === "HIGH_RISK").length;
  const compliantCount = documents.filter((document) => document.complianceStatus === "COMPLIANT").length;
  const processingCount = documents.filter((document) => ["PENDING", "PROCESSING"].includes(document.complianceStatus)).length;

  return (
    <div className="space-y-8 pb-8 pt-6">
      <PageIntro
        eyebrow="Documents Workspace"
        title="Semua dokumen yang Anda unggah tampil di sini secara otomatis."
        description="Halaman ini sekarang mengambil data langsung dari database. Setiap file baru yang diunggah akan muncul di tabel ini tanpa perlu mock data tambahan."
        actions={
          <>
            <Link href="/documents/upload" className={buttonVariants({ variant: "teal", size: "lg", className: "rounded-2xl px-6 font-semibold" })}>
              <UploadCloud className="h-4 w-4" /> Unggah dokumen baru
            </Link>
            <Button variant="outline" size="lg" className="rounded-2xl px-6" disabled>
              Export register
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
        <CardContent className="p-8 md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium tracking-wider text-teal-400">
                <Sparkles className="h-3.5 w-3.5" /> LIVE DOCUMENT REGISTRY
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Registry yang sinkron dengan file yang benar-benar Anda unggah.
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                  Tidak ada lagi normalisasi data mock untuk dokumen. Workspace ini sekarang menampilkan data upload nyata, status pemrosesan, dan waktu pembaruan secara langsung.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/documents/upload" className={buttonVariants({ variant: "teal", size: "lg", className: "rounded-2xl px-6 font-semibold" })}>
                + Unggah Dokumen Baru
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Dokumen", value: totalDocuments, note: "Live from uploads", variant: "neutral" as const },
          { label: "High Risk", value: highRiskCount, note: "Needs counsel review", variant: "danger" as const },
          { label: "Compliant", value: compliantCount, note: "Ready or green", variant: "success" as const },
          { label: "Pending / Processing", value: processingCount, note: "Waiting for review", variant: "info" as const },
        ].map((metric) => (
          <Card key={metric.label} className="bg-card-elevated">
            <CardContent className="p-6">
              <p className="authority-label">{metric.label}</p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-4xl font-semibold tracking-editorial text-foreground">{metric.value}</span>
                <Badge variant={metric.variant}>{metric.note}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <SectionTitle
                eyebrow="Library"
                title="My Documents"
                description="File yang baru diunggah akan langsung tampil di tabel ini."
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-[240px] flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Pencarian visual akan diaktifkan berikutnya" readOnly />
                </div>
              </div>
            </div>

            {documents.length === 0 ? (
              <div className="rounded-[1.5rem] bg-card-soft p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary-deep shadow-subtle">
                  <FolderOpenDot className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Belum ada dokumen</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Mulai dengan mengunggah dokumen pertama agar data langsung muncul di dashboard dan halaman ini.
                </p>
                <Link href="/documents/upload" className={buttonVariants({ variant: "teal", size: "lg", className: "mt-5 rounded-2xl px-6 font-semibold" })}>
                  Unggah dokumen pertama
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-[1.5rem] bg-card-soft">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="px-6 py-4 font-medium">Document</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Uploader</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Updated</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((document) => {
                      const status = statusMap[document.complianceStatus];
                      const uploader = document.uploadedBy?.firstName || document.uploadedBy?.email || "Unknown";

                      return (
                        <tr key={document.id} className="align-top border-t border-black/5 text-sm first:border-t-0">
                          <td className="px-6 py-5">
                            <div>
                              <Link href={`/documents/${document.id}`} className="font-semibold text-foreground transition hover:text-secondary-teal">
                                {document.title}
                              </Link>
                              <p className="mt-1 text-xs uppercase tracking-authority text-muted-foreground">{document.id}</p>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-muted-foreground">{document.type}</td>
                          <td className="px-6 py-5 text-muted-foreground">{uploader}</td>
                          <td className="px-6 py-5">
                            <div className="space-y-2">
                              <Badge variant={status.variant}>{status.label}</Badge>
                              <p className="text-xs text-muted-foreground">
                                Risk score {document.riskScore !== null ? Math.round(document.riskScore) : 0}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-muted-foreground">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(document.updatedAt)}</td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/documents/${document.id}`} className="inline-flex items-center gap-2 rounded-full bg-surface-low px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-high">
                                Open <FileSearch className="h-4 w-4" />
                              </Link>
                              <DeleteDocumentButton documentId={document.id} documentTitle={document.title} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-card-soft">
            <CardContent className="p-6">
              <p className="authority-label">Live Activity</p>
              <h3 className="mt-2 text-xl font-semibold tracking-editorial text-foreground">Upload terbaru</h3>
              <div className="mt-5 space-y-4">
                {documents.slice(0, 3).map((document) => (
                  <div key={document.id} className="rounded-[1.5rem] bg-white p-4 shadow-subtle">
                    <h4 className="text-sm font-semibold text-foreground">{document.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{document.type}</p>
                    <p className="mt-3 text-xs uppercase tracking-authority text-muted-foreground">
                      {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(document.createdAt)}
                    </p>
                  </div>
                ))}
                {documents.length === 0 ? (
                  <p className="text-sm leading-6 text-muted-foreground">Belum ada aktivitas upload karena belum ada file yang dimasukkan.</p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
