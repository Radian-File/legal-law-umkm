"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText, Gavel, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import type { ComplianceStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { primaryNavigation, uploadNavigationItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type DashboardDocument = {
  id: string;
  title: string;
  type: string;
  complianceStatus: ComplianceStatus;
  createdAt: string;
  riskScore: number | null;
};

type SummaryCard = {
  label: string;
  value: string;
  note: string;
  iconKey: "documents" | "risk" | "green" | "laws";
  accent: "neutral" | "danger" | "success" | "info";
};

type RegulatoryUpdate = {
  type: string;
  title: string;
  detail: string;
  impact: string;
  impactVariant: "danger" | "info";
  updatedAt: string;
};

const iconMap = {
  documents: FileText,
  risk: ShieldAlert,
  green: ShieldCheck,
  laws: Gavel,
};

const statusVariantMap: Record<ComplianceStatus, "success" | "warning" | "danger" | "info" | "neutral"> = {
  COMPLIANT: "success",
  REVIEW_REQUIRED: "warning",
  HIGH_RISK: "danger",
  PROCESSING: "info",
  PENDING: "neutral",
  FAILED: "danger",
};

const statusLabelMap: Record<ComplianceStatus, string> = {
  COMPLIANT: "Compliant",
  REVIEW_REQUIRED: "Review Required",
  HIGH_RISK: "High Risk",
  PROCESSING: "Processing",
  PENDING: "Pending",
  FAILED: "Failed",
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function DashboardContent({
  firstName,
  documents,
  totalDocuments,
  highRiskCount,
  compliantCount,
  healthScore,
  summaryCards,
  regulatoryUpdates,
}: {
  firstName: string;
  documents: DashboardDocument[];
  totalDocuments: number;
  highRiskCount: number;
  compliantCount: number;
  healthScore: number;
  summaryCards: SummaryCard[];
  regulatoryUpdates: RegulatoryUpdate[];
}) {
  return (
    <motion.div className="space-y-8 pb-8" initial="hidden" animate="show" variants={staggerContainer}>
      <motion.section variants={fadeUp} className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium tracking-wider text-teal-400">
                  <Sparkles className="h-3.5 w-3.5" /> TRUSTWORTHY NEO-CORPORATE DASHBOARD
                </div>
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    Selamat datang kembali, {firstName}.
                  </h1>
                  <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                    Dirancang berdasarkan guidance Stitch “Aegis Core”, dashboard ini memusatkan analisis dokumen,
                    sinyal risiko, dan pembaruan regulasi dalam satu workspace yang profesional.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href={uploadNavigationItem.href} className={cn(buttonVariants({ variant: "teal", size: "lg" }), "rounded-2xl px-6 font-semibold transition-transform hover:scale-105 active:scale-95")}>
                  + Unggah Dokumen Baru
                </Link>
                <Link href={primaryNavigation[1].href} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-2xl border-slate-500 bg-white/5 px-6 font-medium text-white hover:bg-slate-800 hover:text-white")}>
                  Lihat Arsip
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-soft">
          <CardHeader>
            <p className="authority-label">Compliance Health</p>
            <CardTitle className="text-4xl tracking-editorial">{healthScore}%</CardTitle>
            <CardDescription className="text-base text-success-foreground">
              {totalDocuments === 0 ? "Mulai unggah dokumen untuk melihat skor kepatuhan." : "Persentase dokumen compliant dari upload yang sudah masuk."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-3 rounded-full bg-surface-high">
              <div className="h-3 rounded-full bg-gradient-to-r from-success to-secondary-teal" style={{ width: `${healthScore}%` }} />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {totalDocuments === 0
                ? "Belum ada dokumen yang diunggah. Masukkan file pertama Anda untuk mulai mengisi dashboard dengan data nyata."
                : `Workspace saat ini berisi ${totalDocuments} dokumen, dengan ${highRiskCount} item berisiko tinggi yang perlu perhatian.`}
            </p>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section variants={staggerContainer} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = iconMap[card.iconKey];
          return (
            <motion.div key={card.label} variants={fadeUp}>
              <Card className="bg-card-elevated transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex items-start justify-between p-6">
                  <div>
                    <p className="authority-label">{card.label}</p>
                    <div className="mt-4 flex items-end gap-3">
                      <span className="text-4xl font-semibold tracking-editorial">{card.value}</span>
                      <Badge variant={card.accent}>{card.note}</Badge>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-surface-low p-3 text-primary-deep">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.section>

      <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <motion.div variants={fadeUp}>
          <Card>
            <CardHeader className="flex flex-col gap-4 border-b border-transparent pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="authority-label">Recent Documents</p>
                <CardTitle className="mt-2">Overview of the latest uploaded documents</CardTitle>
              </div>
              <Link href={primaryNavigation[1].href} className="inline-flex items-center gap-2 px-0 text-sm font-medium text-secondary-teal transition hover:text-secondary-calm">
                View Archive <ArrowUpRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <motion.div className="overflow-x-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.4 }}>
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="px-6 py-4 font-medium">Document Name</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Compliance Status</th>
                      <th className="px-6 py-4 font-medium">Upload Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.length > 0 ? (
                      documents.map((document) => (
                        <tr key={document.id} className="align-middle transition-colors duration-200 hover:bg-slate-100">
                          <td className="px-6 py-4 font-medium text-foreground">{document.title}</td>
                          <td className="px-6 py-4 text-muted-foreground">{document.type}</td>
                          <td className="px-6 py-4">
                            <Badge variant={statusVariantMap[document.complianceStatus]}>{statusLabelMap[document.complianceStatus]}</Badge>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(document.createdAt))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                          Belum ada dokumen yang diunggah. Klik “Unggah Dokumen Baru” untuk memulai.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
              <div className="flex items-center justify-between px-6 py-5 text-sm text-muted-foreground">
                <span>{documents.length > 0 ? `Showing ${documents.length} recent document(s)` : "No uploaded documents yet"}</span>
                <div className="inline-flex items-center gap-2 rounded-full bg-surface-low px-4 py-2 text-foreground">
                  <span>{documents.length}</span>
                  <span>items</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={staggerContainer} className="space-y-4">
          <motion.div variants={fadeUp}>
            <Card className="bg-card-soft">
              <CardHeader>
                <p className="authority-label">AI Insight</p>
                <CardTitle>Upload Summary</CardTitle>
                <CardDescription>{totalDocuments} documents currently in workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {totalDocuments === 0
                    ? "Workspace masih kosong. Setelah dokumen diunggah, Anda akan melihat ringkasan status dan risiko di panel ini."
                    : `Data yang tampil sekarang berasal langsung dari upload nyata. ${highRiskCount} dokumen berstatus high risk dan ${compliantCount} dokumen sudah compliant.`}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="authority-label">Pembaruan Regulasi Penting</p>
                    <CardTitle>Legislative Updates</CardTitle>
                  </div>
                  <Link href={primaryNavigation[2].href} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full")}>
                    Buka Feed
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {regulatoryUpdates.map((item) => (
                  <div key={item.title} className="space-y-3 rounded-2xl bg-surface-low p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="neutral" className="w-fit">{item.type}</Badge>
                      <Badge variant={item.impactVariant}>{item.impact}</Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold leading-6 text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                    </div>
                    <p className="text-xs uppercase tracking-authority text-muted-foreground">Updated {item.updatedAt}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
}
