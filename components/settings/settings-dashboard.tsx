import {
  ArrowUpRight,
  BookText,
  Building2,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileCheck2,
  LifeBuoy,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const completenessItems = [
  { label: "Company profile", status: "Lengkap", variant: "success" as const },
  { label: "Dokumen legal inti", status: "4/5 tersedia", variant: "warning" as const },
  { label: "Privacy & PDP controls", status: "Aktif", variant: "success" as const },
  { label: "Audit evidence trail", status: "Perlu review", variant: "danger" as const },
];

const documentGroups = [
  {
    title: "Akta & identitas perusahaan",
    detail: "Akta pendirian, NIB, NPWP, struktur kepemilikan, dan penanggung jawab hukum.",
    status: "Verified",
    variant: "success" as const,
  },
  {
    title: "Kebijakan privasi & consent",
    detail: "Versi publik terakhir, change log, serta referensi ke workflow DSAR dan retensi data.",
    status: "Needs update",
    variant: "warning" as const,
  },
  {
    title: "Kontrak vendor kritikal",
    detail: "Template DPA, SLA keamanan, subprocessor list, dan klausul audit right.",
    status: "In review",
    variant: "info" as const,
  },
];

const activityLog = [
  {
    title: "Perubahan alamat operasional ditandai untuk verifikasi",
    detail: "Sistem meminta sinkronisasi ke NIB dan policy footer publik sebelum dipublikasikan.",
    time: "Hari ini · 10:45",
  },
  {
    title: "Checklist PDP diperbarui setelah upload versi kebijakan terbaru",
    detail: "2 control tambahan terhubung ke respons subjek data dan retensi bukti consent.",
    time: "Kemarin · 16:20",
  },
  {
    title: "Admin meninjau ulang paket dokumen vendor cloud",
    detail: "Status berubah menjadi In review karena lampiran subprocessor list belum final.",
    time: "29 Mar 2026 · 14:05",
  },
  {
    title: "Permintaan bantuan onboarding dikirim ke tim support",
    detail: "Topik terkait impor metadata dokumen legal dari workspace lama.",
    time: "27 Mar 2026 · 09:30",
  },
];

export function SettingsDashboard() {
  return (
    <div className="space-y-8 pb-8">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium tracking-wider text-teal-400">
                  <Sparkles className="h-3.5 w-3.5" /> SETTINGS · STITCH-INSPIRED COMPLIANCE WORKSPACE
                </div>
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    Pengaturan perusahaan dan kesiapan dokumen hukum dalam satu tampilan operasional.
                  </h1>
                  <p className="max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                    Gunakan halaman ini untuk melihat profil entitas, kelengkapan dokumen legal, status compliance, dan jejak aktivitas perubahan tanpa keluar dari dashboard utama.
                  </p>
                </div>
              </div>

              <Button variant="teal" size="lg" className="rounded-2xl px-6 font-semibold transition-transform hover:scale-105 active:scale-95">
                Review Workspace <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-soft">
          <CardHeader>
            <p className="authority-label">Compliance Completeness</p>
            <CardTitle className="text-4xl tracking-editorial">84%</CardTitle>
            <CardDescription className="text-base text-warning-foreground">
              Profil inti lengkap, namun evidence trail dan privacy versioning masih perlu dirapikan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-3 rounded-full bg-surface-high">
              <div className="h-3 w-[84%] rounded-full bg-gradient-to-r from-primary-deep via-secondary-teal to-secondary-calm" />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Lengkapi satu item prioritas tinggi untuk mendorong readiness score ke atas 90% sebelum review kuartalan berikutnya.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="authority-label">Company Profile</p>
                  <CardTitle className="mt-2">Identitas organisasi yang digunakan di seluruh workspace</CardTitle>
                </div>
                <div className="rounded-2xl bg-surface-low p-3 text-primary-deep">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] bg-surface-low p-5">
                <p className="authority-label">Registered Entity</p>
                <h3 className="mt-3 text-xl font-semibold tracking-editorial">PT IndoLegal Teknologi Nusantara</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Fintech compliance operations workspace untuk pengelolaan dokumen, monitoring regulasi, dan koordinasi audit internal.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-[1.5rem] bg-surface-low p-4">
                  <div className="flex items-start gap-3">
                    <UserRound className="mt-0.5 h-4 w-4 text-secondary-teal" />
                    <div>
                      <p className="authority-label">Primary Owner</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">Budi Santoso · Legal Operations Lead</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-surface-low p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-secondary-teal" />
                    <div>
                      <p className="authority-label">Business Email</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">legal.ops@indolegal.ai</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-surface-low p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-secondary-teal" />
                    <div>
                      <p className="authority-label">Operational Address</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">Jakarta Selatan · Indonesia</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="authority-label">Legal Document Info</p>
                  <CardTitle className="mt-2">Kelompok dokumen yang dipantau untuk onboarding dan audit</CardTitle>
                </div>
                <div className="rounded-2xl bg-surface-low p-3 text-primary-deep">
                  <BookText className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {documentGroups.map((group) => (
                <div key={group.title} className="rounded-[1.5rem] bg-surface-low p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{group.detail}</p>
                    </div>
                    <Badge variant={group.variant} className="w-fit">{group.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-card-soft">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="authority-label">Status Overview</p>
                  <CardTitle className="mt-2">Compliance completeness & readiness</CardTitle>
                </div>
                <div className="rounded-2xl bg-white p-3 text-primary-deep shadow-subtle">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {completenessItems.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="mt-1 text-xs uppercase tracking-authority text-muted-foreground">Workspace control</p>
                    </div>
                    <Badge variant={item.variant}>{item.status}</Badge>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-secondary-teal" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    Rekomendasi berikutnya: upload changelog kebijakan privasi terbaru dan sinkronkan bukti persetujuan vendor cloud untuk menaikkan readiness score.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="authority-label">Activity Log</p>
                  <CardTitle className="mt-2">Riwayat perubahan penting di area settings</CardTitle>
                </div>
                <div className="rounded-2xl bg-surface-low p-3 text-primary-deep">
                  <Clock3 className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activityLog.map((entry, index) => (
                <div key={entry.title} className="relative rounded-[1.5rem] bg-surface-low p-5">
                  {index !== activityLog.length - 1 && (
                    <div className="absolute left-8 top-[74px] hidden h-[calc(100%-42px)] w-px bg-surface-high md:block" />
                  )}
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary-deep shadow-sm">
                      <FileCheck2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{entry.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.detail}</p>
                      <p className="mt-3 text-xs uppercase tracking-authority text-muted-foreground">{entry.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(26,201,230,0.12),rgba(10,31,68,0.96))] text-white shadow-ambient">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/12 p-3 text-secondary-calm">
                  <LifeBuoy className="h-5 w-5" />
                </div>
                <div>
                  <p className="authority-label text-white/65">Support & Help</p>
                  <CardTitle className="mt-2 text-white">Butuh bantuan menata metadata dan dokumen legal?</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="flex items-start gap-3">
                  <CircleHelp className="mt-0.5 h-5 w-5 text-secondary-calm" />
                  <p className="text-sm leading-6 text-white/80">
                    Panduan onboarding menyarankan review berkala untuk profil perusahaan, library dokumen, dan bukti audit setiap akhir bulan.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-semibold text-white">Support line</p>
                <p className="mt-2 text-sm leading-6 text-white/78">support@indolegal.ai · SLA respons internal 1 hari kerja</p>
              </div>
              <Button variant="teal" className="w-full justify-center rounded-2xl font-semibold">
                Open Help Checklist <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
