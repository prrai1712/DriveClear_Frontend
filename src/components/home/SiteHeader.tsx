import Link from "next/link";

export function SiteHeader({ ctaHref = "/login", ctaLabel = "Get started" }: { ctaHref?: string; ctaLabel?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20">
            DC
          </span>
          <span className="text-lg font-bold text-slate-900 tracking-tight">DriveClear</span>
        </Link>
        <Link
          href={ctaHref}
          className="shrink-0 rounded-full bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-800 transition shadow-md"
        >
          {ctaLabel}
        </Link>
      </nav>
    </header>
  );
}
