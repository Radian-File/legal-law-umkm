import Link from "next/link";
import { CheckCircle2, ChevronLeft, ShieldCheck, Sparkles } from "lucide-react";

import { UploadForm } from "@/components/documents/upload-form";
import { InsightCard, PageIntro, SectionTitle } from "@/components/documents/shared";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const uploadChecklist = [
  "Pastikan dokumen final atau draft terbaru yang akan direview.",
  "Gunakan judul dokumen yang jelas agar mudah ditemukan di workspace.",
  "Pilih kategori yang paling mendekati agar ringkasan dashboard tetap akurat.",
  "Setelah upload selesai, dokumen akan langsung muncul di halaman Documents dan detail page.",
];

export default function DocumentsUploadPage() {
  return (
    <div className="space-y-8 pb-8 pt-6">
      <PageIntro
        eyebrow="Guided Intake"
        title="Upload dokumen baru dan tampilkan langsung di workspace Anda."
        description="Halaman ini sekarang terhubung ke endpoint upload sungguhan. Setelah file berhasil masuk, data dokumen akan otomatis tersimpan dan tampil di dashboard serta Documents page."
        actions={
          <Link href="/documents" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-2xl px-6" })}>
            <ChevronLeft className="h-4 w-4" /> Back to documents
          </Link>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-6 p-6">
            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white shadow-lg">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium tracking-wider text-teal-400">
                <Sparkles className="h-3.5 w-3.5" /> STRUCTURED INTAKE
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                Bring in a new document without breaking consistency.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Upload sekarang tidak lagi sekadar visual mockup. File yang Anda unggah akan diparsing, disimpan ke database, dan langsung tersedia untuk ditinjau di workspace.
              </p>
            </div>

            <UploadForm />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <InsightCard eyebrow="Intake checklist" title="Yang perlu dicek sebelum upload" description="Panduan singkat agar hasil upload tetap rapi dan mudah ditelusuri.">
            <div className="space-y-4">
              {uploadChecklist.map((item) => (
                <div key={item} className="flex gap-3 rounded-[1.5rem] bg-surface-low p-4">
                  <div className="rounded-full bg-white p-2 text-success shadow-subtle">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-6 text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </InsightCard>

          <Card className="bg-card-soft">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-primary-deep shadow-subtle">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="authority-label">Live data mode</p>
                  <h3 className="text-lg font-semibold text-foreground">Dokumen baru akan langsung muncul</h3>
                </div>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                Setelah upload selesai, Anda akan diarahkan ke halaman detail dokumen. Data yang sama juga langsung masuk ke daftar Documents dan ringkasan dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow="After upload"
          title="Lanjutkan review dari halaman detail"
          description="Setelah dokumen masuk, Anda bisa membuka detail page untuk melihat metadata, status, dan raw text preview hasil parsing."
        />
      </section>
    </div>
  );
}
