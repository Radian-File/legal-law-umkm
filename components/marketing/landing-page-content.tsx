"use client";

import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";
import { ArrowRight, Edit3, Gavel, ShieldAlert, Sparkles, Verified } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ShieldAlert,
    title: "Deteksi Risiko Otomatis",
    description:
      "AI menyoroti klausul berbahaya secara real-time agar tim legal bisa meninjau kontrak kerja, NDA, dan dokumen vendor sebelum ditandatangani.",
  },
  {
    icon: Gavel,
    title: "Sinkronisasi UU Terkini",
    description:
      "Basis data vektor diperbarui dengan PP, Permen, dan regulasi Indonesia terbaru sehingga review tetap relevan terhadap konteks hukum yang berubah.",
  },
  {
    icon: Edit3,
    title: "Saran Revisi Instan",
    description:
      "Bukan sekadar menemukan masalah — IndoLegal AI memberikan arah perbaikan klausul agar lebih selaras dengan standar kepatuhan yang berlaku.",
  },
];

const trustPoints = [
  "Neo-corporate interface berbasis Stitch untuk tim legal modern",
  "Analisis clause-level dengan konteks hukum Indonesia",
  "Audit trail dan workspace yang konsisten untuk operasional harian",
];

const heroVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function LandingPageContent() {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-[1.75rem] bg-white/80 px-6 py-4 shadow-subtle backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-primary-deep/60">IndoLegal</p>
            <h1 className="text-lg font-semibold tracking-editorial text-primary-deep">Compliance AI</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href={"/sign-in" as Route} className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "rounded-2xl px-5 text-primary-deep")}>
              Login
            </Link>
            <Link href={"/sign-up" as Route} className={cn(buttonVariants({ variant: "teal", size: "lg" }), "rounded-2xl px-6 font-semibold")}>
              Buat Akun Gratis
            </Link>
          </div>
        </header>

        <main className="flex-1 py-8 lg:py-12">
          <section className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px]">
            <Card className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
              <CardContent className="p-8 md:p-10 xl:p-12">
                <motion.div initial="hidden" animate="visible" variants={heroVariant} className="space-y-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium tracking-wider text-teal-400">
                    <Sparkles className="h-3.5 w-3.5" /> SOLUSI END-TO-END
                  </div>

                  <div className="space-y-5">
                    <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">
                      Otomatisasi kepatuhan hukum tanpa biaya konsultan mahal.
                    </h2>
                    <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base md:leading-8">
                      Stitch merancang IndoLegal AI sebagai workspace yang tenang, presisi, dan berwibawa — tempat tim legal memeriksa kontrak, memantau regulasi, dan mengurangi risiko sebelum dokumen masuk ke tahap final.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link href={"/sign-up" as Route} className={cn(buttonVariants({ variant: "teal", size: "lg" }), "rounded-2xl px-6 font-semibold transition-transform duration-300 hover:scale-[1.02]")}>
                      Buat Akun Gratis <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href={"/sign-in" as Route} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-2xl border-slate-500 bg-white/5 px-6 font-medium text-white hover:bg-slate-800 hover:text-white") }>
                      Masuk ke Workspace
                    </Link>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {trustPoints.map((item) => (
                      <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            <motion.div initial="hidden" animate="visible" variants={heroVariant} transition={{ delay: 0.08 }}>
              <Card className="bg-card-soft shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="space-y-6 p-8">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-white p-3 text-primary-deep shadow-subtle">
                      <Verified className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="authority-label">Trusted Legal Operations</p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-editorial text-foreground">
                        Amankan kontrak kerja, NDA, dan kebijakan privasi hari ini.
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] bg-white p-5 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <p className="authority-label">Deteksi lebih cepat</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Temukan exposure hukum material sebelum dokumen dikirim ke counterpart atau regulator.
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white p-5 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <p className="authority-label">Operasi lebih rapi</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Satukan intake, review, arsip, dan pembaruan regulasi dalam satu alur kerja yang sinkron.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          <motion.section
            className="mt-8 grid gap-4 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={cardVariant}>
                  <Card className="bg-card-elevated shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="space-y-4 p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-low text-primary-deep">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
                      </div>
                      <Link href={"/sign-up" as Route} className="inline-flex items-center gap-2 text-sm font-medium text-secondary-teal transition hover:text-primary-deep">
                        Pelajari lebih lanjut <ArrowRight className="h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.section>
        </main>

        <footer className="mt-auto flex flex-col gap-4 border-t border-black/5 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 IndoLegal AI — sovereign legal compliance workspace for Indonesian teams.</p>
          <div className="flex items-center gap-5">
            <Link href={"/sign-in" as Route} className="transition hover:text-foreground">Masuk</Link>
            <Link href={"/sign-up" as Route} className="transition hover:text-foreground">Daftar</Link>
            <Link href={"/dashboard" as Route} className="transition hover:text-foreground">Workspace</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
