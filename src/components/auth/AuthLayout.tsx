import Link from "next/link";
import { TrustStrip } from "@/components/home/TrustStrip";

type AuthLayoutProps = {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function AuthLayout({ children, backHref = "/", backLabel = "Back to home" }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
      <TrustStrip />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link href={backHref} className="inline-flex items-center gap-2.5 mb-8 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25">
              DC
            </span>
            <span className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
              DriveClear
            </span>
          </Link>
          {children}
          <p className="mt-8 text-center">
            <Link
              href={backHref}
              className="text-sm text-slate-500 hover:text-emerald-700 transition"
            >
              ← {backLabel}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
