"use client";

import { useEffect, useState } from "react";
import { TermsModal } from "@/components/legal/TermsModal";

export function TermsSection() {
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#terms") {
        setTermsOpen(true);
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  function openTerms() {
    setTermsOpen(true);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "#terms");
    }
  }

  function closeTerms() {
    setTermsOpen(false);
    if (typeof window !== "undefined" && window.location.hash === "#terms") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  return (
    <>
      <footer id="terms" className="max-w-5xl mx-auto px-4 py-8 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium">
          <button
            type="button"
            onClick={openTerms}
            className="text-emerald-700 hover:text-emerald-800 underline-offset-2 hover:underline"
          >
            Terms &amp; Conditions
          </button>
          <a
            href="mailto:support@driveclear.in"
            className="text-emerald-700 hover:text-emerald-800 underline-offset-2 hover:underline"
          >
            Support
          </a>
        </div>
        <p className="mt-6 text-xs text-slate-400 text-center">
          © {new Date().getFullYear()} DriveClear. Secure payments via Razorpay.
        </p>
      </footer>

      <TermsModal open={termsOpen} onClose={closeTerms} />
    </>
  );
}
