"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TERMS_CLAUSES, TERMS_TITLE } from "@/lib/legal/terms";

type TermsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function TermsModal({ open, onClose }: TermsModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleEscape);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = prev;
    };
  }, [open, handleEscape]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.button
            type="button"
            aria-label="Close terms"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl border border-slate-200"
          >
            <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3 border-b border-slate-100 shrink-0">
              <div>
                <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Legal</p>
                <h2 id="terms-modal-title" className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 pr-2">
                  {TERMS_TITLE}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
              <ol className="space-y-5 text-sm text-slate-700 leading-relaxed">
                {TERMS_CLAUSES.map((clause) => (
                  <li key={clause.number} className="flex gap-3">
                    <span className="shrink-0 font-semibold text-emerald-700 tabular-nums">{clause.number}.</span>
                    <div>
                      <p>{clause.text}</p>
                      {clause.bullets && clause.bullets.length > 0 && (
                        <ul className="mt-2 ml-1 space-y-1 list-disc list-inside text-slate-600">
                          {clause.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <motion.div className="shrink-0 px-5 py-4 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl sm:rounded-b-3xl">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-slate-900 text-white py-3.5 text-sm font-semibold hover:bg-slate-800 transition"
              >
                I understand
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
