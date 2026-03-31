import {
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Clock3,
  Flame,
  Gavel,
  Landmark,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const regulatoryStats = [
  {
    label: "Update Dipantau",
    value: "28",
    note: "+6 minggu ini",
    icon: Gavel,
    variant: "info" as const,
  },
  {
    label: "Perlu Tindakan",
    value: "5",
    note: "Deadline 30 hari",
    icon: Clock3,
    variant: "warning" as const,
  },
  {
    label: "Sudah Selaras",
    value: "19",
    note: "Siap audit internal",
    icon: ShieldCheck,
    variant: "success" as const,
  },
];

const regulations = [
  {
    tag: "OJK",
    title: "Rancangan penguatan tata kelola AI untuk penyelenggara jasa keuangan digital",
    summary:
      "Panduan awal menekankan governance board, human oversight, dan dokumentasi model untuk use case underwriting serta antifraud.",
    date: "31 Mar 2026",
    status: "High Priority",
    statusVariant: "danger" as const,
    impact: ["AI governance", "Model register", "Board approval"],
  },
  {
    tag: "Bank Indonesia",
    title: "Pembaruan standar keamanan data bagi penyedia layanan pembayaran berbasis aplikasi",
    summary:
      "Penekanan pada pelacakan consent, logging insiden, dan retensi bukti audit untuk proses onboarding merchant dan customer support.",
    date: "29 Mar 2026",
    status: "Action Needed",
    statusVariant: "warning" as const,
    impact: ["Consent logging", "Incident trail", "Merchant onboarding"],
  },
  {
    tag: "Kominfo",
    title: "Pedoman operasional pemenuhan respons subjek data untuk platform digital",
    summary:
      "Memperjelas SLA permintaan akses data, penghapusan, dan koreksi; relevan untuk ticketing legal dan workflow verifikasi identitas.",
    date: "26 Mar 2026",
    status: "Relevant",
    statusVariant: "info" as const,
    impact: ["DSAR workflow", "Identity checks", "Response SLA"],
  },
  {
    tag: "PPATK",
    title: "Arah penguatan monitoring transaksi mencurigakan lintas kanal",
    summary:
      "Penyelarasan threshold review dan dokumentasi investigasi internal untuk fintech lending, payment, serta embedded finance.",
    date: "22 Mar 2026",
    status: "Monitor",
    statusVariant: "neutral" as const,
    impact: ["AML review", "Investigation note", "Risk threshold"],
  },
];

const trendingTopics = [
  {
    label: "AI governance & explainability",
    description: "Naik cepat di sektor lending, e-KYC, dan fraud detection.",
  },
  {
    label: "Cross-border data transfer",
    description: "Muncul dalam diskusi vendor cloud dan processor chain.",
  },
  {
    label: "Consumer disclosure simplification",
    description: "Berkaitan dengan ringkasan syarat digital yang lebih mudah dipahami.",
  },
  {
    label: "Audit trail readiness",
    description: "Fokus pada bukti persetujuan, approval, dan change history.",
  },
];

const fintechSignals = [
  {
    title: "Pinjaman digital",
    detail: "Perkuat review bias model, adverse-action reasoning, dan quality gate sebelum policy changes dipublikasikan.",
  },
  {
    title: "Pembayaran & wallet",
    detail: "Pastikan webhook, dispute handling, dan refund records memiliki bukti waktu yang mudah diekspor saat audit.",
  },
  {
    title: "e-KYC & onboarding",
    detail: "Dokumentasikan retensi biometrik, tujuan pemrosesan, serta mekanisme koreksi data pelanggan secara konsisten.",
  },
];

export function RegulatoryDashboard() {
  return (
    <div className="space-y-8 pb-8">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium tracking-wider text-teal-400">
                  <Sparkles className="h-3.5 w-3.5" /> REGULATORY FEED · STITCH-INSPIRED MONITORING HUB
                </div>
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    Sinyal regulasi prioritas untuk operasi fintech yang tetap tenang dan siap audit.
                  </h1>
                  <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                    Halaman ini merangkum update regulasi yang paling relevan, topik yang sedang memanas, dan jalur aksi compliance yang dapat segera diprioritaskan oleh tim legal operations.
                  </p>
                </div>
              </div>

              <Button variant="teal" size="lg" className="rounded-2xl px-6 font-semibold transition-transform hover:scale-105 active:scale-95">
                Review Prioritas <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-soft">
          <CardHeader>
            <p className="authority-label">Coverage Status</p>
            <CardTitle className="text-4xl tracking-editorial">92%</CardTitle>
            <CardDescription className="text-base text-success-foreground">
              Feeds OJK, BI, Kominfo, dan PPATK sudah dipetakan ke control library.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-3 rounded-full bg-surface-high">
              <div className="h-3 w-[92%] rounded-full bg-gradient-to-r from-secondary-teal via-secondary-calm to-success" />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Fokus review berikutnya adalah harmonisasi kebijakan AI internal dengan logging consent dan SLA respons subjek data.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {regulatoryStats.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label} className="bg-card-elevated">
              <CardContent className="flex items-start justify-between p-6">
                <div>
                  <p className="authority-label">{item.label}</p>
                  <div className="mt-4 flex items-end gap-3">
                    <span className="text-4xl font-semibold tracking-editorial">{item.value}</span>
                    <Badge variant={item.variant}>{item.note}</Badge>
                  </div>
                </div>
                <div className="rounded-2xl bg-surface-low p-3 text-primary-deep">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader className="border-b border-transparent pb-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="authority-label">Regulation Timeline</p>
                <CardTitle className="mt-2">Regulatory cards untuk update yang perlu diproses minggu ini</CardTitle>
                <CardDescription className="mt-2 max-w-2xl">
                  Disusun seperti feed keputusan: paling baru di atas, dengan tag regulator, tingkat prioritas, dan area dampak agar tim bisa bergerak cepat.
                </CardDescription>
              </div>
              <Button variant="ghost" className="px-0 text-secondary-teal hover:bg-transparent hover:text-secondary-calm">
                Export watchlist <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            {regulations.map((item, index) => (
              <div key={item.title} className="relative rounded-[1.75rem] bg-surface-low p-5 md:p-6">
                {index !== regulations.length - 1 && (
                  <div className="absolute left-8 top-[92px] hidden h-[calc(100%-56px)] w-px bg-surface-high md:block" />
                )}
                <div className="flex flex-col gap-5 md:flex-row md:gap-6">
                  <div className="flex items-start gap-4 md:w-[148px] md:flex-col md:gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-deep shadow-subtle">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <Badge variant="neutral" className="w-fit">{item.tag}</Badge>
                      <p className="mt-3 text-xs uppercase tracking-authority text-muted-foreground">{item.date}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold tracking-editorial text-foreground">{item.title}</h3>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{item.summary}</p>
                      </div>
                      <Badge variant={item.statusVariant} className="w-fit">{item.status}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.impact.map((pill) => (
                        <div
                          key={pill}
                          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-sm"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-secondary-teal" />
                          {pill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-card-soft">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="authority-label">Trending Topics</p>
                  <CardTitle className="mt-2">Tema regulasi yang sedang meningkat</CardTitle>
                </div>
                <div className="rounded-2xl bg-white p-3 text-primary-deep shadow-subtle">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <div key={topic.label} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-low text-xs font-semibold text-primary-deep">
                      0{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{topic.label}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{topic.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="authority-label">Relevant for Fintech</p>
                  <CardTitle className="mt-2">Bidang yang paling terdampak</CardTitle>
                </div>
                <div className="rounded-2xl bg-surface-low p-3 text-primary-deep">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fintechSignals.map((signal) => (
                <div key={signal.title} className="rounded-2xl bg-surface-low p-4">
                  <p className="text-sm font-semibold text-foreground">{signal.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{signal.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(26,201,230,0.16),rgba(10,31,68,0.96))] text-white shadow-ambient">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/12 p-3 text-secondary-calm">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="authority-label text-white/65">AI Compliance Assistant</p>
                  <CardTitle className="mt-2 text-white">Minta ringkasan aksi yang bisa langsung dijalankan</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm leading-6 text-white/78">
                Gunakan assistant untuk mengubah update regulasi menjadi checklist internal, rekomendasi owner, dan draft pertanyaan klarifikasi untuk tim produk atau risk.
              </p>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="flex items-start gap-3">
                  <BrainCircuit className="mt-0.5 h-5 w-5 text-secondary-calm" />
                  <p className="text-sm leading-6 text-white/80">
                    “Sorot perubahan yang memengaruhi AI underwriting, privacy request SLA, dan dokumentasi audit trail untuk Q2.”
                  </p>
                </div>
              </div>
              <Button variant="teal" className="w-full justify-center rounded-2xl font-semibold">
                Generate Action Brief <Flame className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
