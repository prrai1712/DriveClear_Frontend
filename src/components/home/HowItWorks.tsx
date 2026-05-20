"use client";

import { motion } from "framer-motion";
import { STEPS } from "@/lib/home/content";

export function HowItWorks() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-slate-900 text-center">How it works</h2>
      <p className="text-slate-600 text-center text-sm mt-2">Three simple steps to settle your challans</p>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {STEPS.map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-sm font-bold shadow-md shadow-emerald-600/30">
              {item.step}
            </span>
            <h3 className="font-semibold text-slate-900 mt-3">{item.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
            {i < STEPS.length - 1 && (
              <span className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-emerald-200" aria-hidden />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
