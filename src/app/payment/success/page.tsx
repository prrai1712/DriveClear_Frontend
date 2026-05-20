"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PAYMENT_RESULT_KEY, CheckoutVerifyResponse } from "@/lib/payment/checkout";

function formatMoney(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [result, setResult] = useState<CheckoutVerifyResponse | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(PAYMENT_RESULT_KEY);
    if (!raw) {
      router.replace("/challans");
      return;
    }
    try {
      setResult(JSON.parse(raw) as CheckoutVerifyResponse);
      sessionStorage.removeItem(PAYMENT_RESULT_KEY);
    } catch {
      router.replace("/challans");
    }
  }, [router]);

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto p-6 pt-16 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-6">Payment successful</h1>
        <p className="text-slate-500 mt-2">
          {result.order_count} challan{result.order_count === 1 ? "" : "s"} paid · ₹
          {formatMoney(result.total_paid)}
        </p>
        <p className="text-xs text-slate-400 mt-2 break-all">
          Reference: {result.checkout_batch_id}
        </p>
        <p className="text-sm text-slate-600 mt-6">
          We will process your challan settlement and update status in your account.
        </p>
        <Link
          href="/challans"
          className="inline-block mt-8 rounded-xl bg-emerald-600 text-white px-8 py-3 font-semibold hover:bg-emerald-500 transition"
        >
          Back to challans
        </Link>
      </div>
    </main>
  );
}
