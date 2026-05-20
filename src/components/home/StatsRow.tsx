"use client";

import { motion } from "framer-motion";
import { STATS } from "@/lib/home/content";
import { HomeIcon } from "./icons";

export function StatsRow() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm text-center"
          >
            <HomeIcon name={stat.icon} className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
