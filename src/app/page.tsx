import Link from "next/link";
import { TrustStrip } from "@/components/home/TrustStrip";
import { StatsRow } from "@/components/home/StatsRow";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FaqSection } from "@/components/home/FaqSection";
import { TermsSection } from "@/components/home/TermsSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <TrustStrip />

      <nav className="max-w-5xl mx-auto px-4 py-5 flex justify-between items-center">
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm shadow-md">
            DC
          </span>
          <span className="text-lg font-bold text-slate-900">DriveClear</span>
        </span>
        <Link
          href="/login"
          className="rounded-full bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-800 transition shadow-md"
        >
          Get started
        </Link>
      </nav>

      <section className="max-w-5xl mx-auto px-4 pt-8 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
          Check &amp; settle traffic challans instantly
        </h1>
        <p className="mt-5 text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Search pending challans, pay securely via Razorpay, and track settlement updates — all in
          one trusted platform.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-emerald-400 transition"
          >
            Check Challans
          </Link>
          <a
            href="#faq"
            className="rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 font-semibold text-slate-800 hover:border-emerald-300 transition"
          >
            Learn more
          </a>
        </div>
      </section>

      <StatsRow />
      <BenefitsSection />
      <HowItWorks />

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm text-center">
          <p className="text-slate-500 text-sm">Transparent pricing</p>
          <div className="mt-6 grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
              <p className="text-slate-600 text-sm">Online challan</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">₹99</p>
              <p className="text-xs text-slate-500 mt-1">service fee + challan amount</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-100">
              <p className="text-slate-600 text-sm">Court settlement</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">₹999</p>
              <p className="text-xs text-slate-500 mt-1">end-to-end processing</p>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
      <TermsSection />
    </main>
  );
}
