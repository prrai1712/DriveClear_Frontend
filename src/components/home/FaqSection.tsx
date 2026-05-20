"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_ITEMS } from "@/lib/home/content";
import { IconChevron } from "./icons";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-xl mx-auto"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Frequently asked questions
        </h2>
        <p className="text-slate-600 text-sm md:text-base mt-2 leading-relaxed">
          Common questions about paying challans, security, and settlement on DriveClear.
        </p>
      </motion.div>

      <div className="mt-8 max-w-2xl mx-auto space-y-2">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          const panelId = `faq-panel-${i}`;
          const buttonId = `faq-button-${i}`;

          return (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
            >
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-start justify-between gap-3 px-4 py-4 md:px-5 md:py-4 text-left hover:bg-slate-50/80 transition touch-manipulation"
              >
                <span className="font-medium text-slate-900 text-sm md:text-base leading-snug pr-1">
                  {item.q}
                </span>
                <IconChevron open={isOpen} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 md:px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
