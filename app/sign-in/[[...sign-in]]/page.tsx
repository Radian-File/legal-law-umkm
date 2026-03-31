import { ShieldCheck, Lock } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-6 lg:grid-cols-[minmax(0,1fr)_520px]">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,rgba(10,31,68,0.98),rgba(10,31,68,0.84))] p-8 text-white shadow-ambient md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-white/60">Welcome Back</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-editorial">Access the Sovereign Ledger.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 md:text-base">
            Masuk untuk mengelola pipeline kepatuhan hukum Anda dengan workspace IndoLegal AI yang terhubung ke dashboard, dokumen, dan regulatory feed.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-secondary-calm">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium text-white">SOC2 Compliant</span>
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-secondary-calm">
                <Lock className="h-5 w-5" />
                <span className="text-sm font-medium text-white">256-Bit SSL</span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm leading-7 text-white/60">
            Proprietary AI and ledger systems for accredited legal entities only.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <SignIn forceRedirectUrl="/dashboard" signUpUrl="/sign-up" />
        </div>
      </div>
    </div>
  );
}
