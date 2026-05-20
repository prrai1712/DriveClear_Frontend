import Link from "next/link";
import { TrustStrip } from "@/components/home/TrustStrip";
import { SiteHeader } from "@/components/home/SiteHeader";
import { StatsRow } from "@/components/home/StatsRow";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FaqSection } from "@/components/home/FaqSection";
import { TermsSection } from "@/components/home/TermsSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
      <TrustStrip />
      <SiteHeader />

      <section className="relative max-w-5xl mx-auto px-4 pt-12 pb-16 md:pt-16 md:pb-20 text-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-gradient-to-b from-emerald-100/40 to-transparent"
          aria-hidden
        />
        <p className="relative inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800">
          Trusted challan settlement in India
        </p>
        <h1 className="relative mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight max-w-4xl mx-auto">
          Check &amp; settle traffic challans instantly
        </h1>
        <p className="relative mt-5 text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Search pending challans, pay securely via Razorpay, and track settlement updates — all in
          one trusted platform.
        </p>
        <div className="relative mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-emerald-400 transition"
          >
            Check Challans
          </Link>
          <a
            href="#faq"
            className="w-full sm:w-auto rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 font-semibold text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/50 transition"
          >
            Learn more
          </a>
        </div>
      </section>

      <StatsRow />
      <BenefitsSection />
      <HowItWorks />

      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm text-center">
          <p className="text-emerald-700 text-sm font-semibold uppercase tracking-wide">Transparent pricing</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">Simple, upfront fees</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100 text-left">
              <p className="text-slate-600 text-sm font-medium">Online challan</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">₹99</p>
              <p className="text-xs text-slate-500 mt-2">service fee + challan amount</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100 text-left">
              <p className="text-slate-600 text-sm font-medium">Court settlement</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">₹999</p>
              <p className="text-xs text-slate-500 mt-2">end-to-end processing</p>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
      <TermsSection />
    </main>
  );
}
