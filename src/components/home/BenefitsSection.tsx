"use client";

import { motion } from "framer-motion";
import { BENEFITS } from "@/lib/home/content";
import { HomeIcon } from "./icons";

export function BenefitsSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold text-slate-900 text-center"
      >
        Why users choose DriveClear
      </motion.h2>
      <p className="text-slate-600 text-center mt-2 text-sm max-w-lg mx-auto">
        A trusted platform built for clarity, security, and hassle-free challan settlement.
      </p>
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        {BENEFITS.map((b, i) => (
          <motion.article
            key={b.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
              <HomeIcon name={b.icon} className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">{b.title}</h3>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{b.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
