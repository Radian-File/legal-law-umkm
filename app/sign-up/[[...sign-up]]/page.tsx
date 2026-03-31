import { Gavel, ShieldCheck } from "lucide-react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-6 lg:grid-cols-[minmax(0,1fr)_560px]">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,rgba(10,31,68,0.98),rgba(10,31,68,0.86))] p-8 text-white shadow-ambient md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-white/60">IndoLegal AI</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-editorial">Mulai amankan dokumen hukum Anda.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 md:text-base">
            Bergabunglah dengan standar baru kepatuhan hukum digital di Indonesia — cerdas, berdaulat, dan tidak terbantahkan.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-[1.5rem] bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-secondary-calm">
                <ShieldCheck className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold text-white">Kedaulatan Data</p>
                  <p className="text-sm text-white/68">Penyimpanan terenkripsi kelas militer untuk setiap kontrak dan artefak legal.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-secondary-calm">
                <Gavel className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold text-white">Akurasi AI</p>
                  <p className="text-sm text-white/68">Analisis risiko otomatis berbasis regulasi terbaru dan workflow counsel-ready.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <SignUp forceRedirectUrl="/dashboard" signInUrl="/sign-in" />
        </div>
      </div>
    </div>
  );
}
