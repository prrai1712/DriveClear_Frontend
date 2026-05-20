import Link from "next/link";

export function HomeHeader() {
  return (
    <header className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
      <Link href="/vehicle" className="flex items-center gap-2.5 group">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25">
          DC
        </span>
        <span className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
          DriveClear
        </span>
      </Link>
    </header>
  );
}
