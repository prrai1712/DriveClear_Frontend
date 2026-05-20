"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function TrackOrdersCta() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="fixed z-50 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))]"
    >
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white pl-5 pr-5 py-3.5 text-sm font-semibold shadow-xl shadow-slate-900/25 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all ring-4 ring-white/80"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Track Your Orders
      </Link>
    </motion.div>
  );
}
