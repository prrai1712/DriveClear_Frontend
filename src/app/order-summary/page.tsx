"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/errors";
import { mediumLabel } from "@/lib/challans/types";
import { runCheckoutPayment } from "@/lib/payment/checkout";
import {
  CHECKOUT_STORAGE_KEY,
  CheckoutPreview,
} from "@/lib/orders/types";

function formatMoney(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export default function OrderSummaryPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (!raw) {
      router.replace("/challans");
      return;
    }

    let uuids: string[] = [];
    try {
      const parsed = JSON.parse(raw) as { challan_uuids?: string[] };
      uuids = parsed.challan_uuids || [];
    } catch {
      router.replace("/challans");
      return;
    }

    if (uuids.length === 0) {
      router.replace("/challans");
      return;
    }

    apiRequest<CheckoutPreview>("post", "/orders/preview/", { challan_uuids: uuids })
      .then(setPreview)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [router]);

  async function handlePayNow() {
    if (!preview) return;
    const uuids = preview.line_items.map((item) => item.challan_uuid);
    setPaying(true);
    setError("");
    try {
      await runCheckoutPayment(uuids);
      router.push("/payment/success");
    } catch (err) {
      const msg = getApiErrorMessage(err);
      if (msg.toLowerCase().includes("cancel")) {
        setError("Payment was cancelled. You can try again when ready.");
      } else {
        setError(msg);
      }
    } finally {
      setPaying(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      <div className="max-w-2xl mx-auto p-6">
        <Link href="/challans" className="text-emerald-600 text-sm font-medium">
          ← Back to challans
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-4">Order summary</h1>
        <p className="text-slate-500 text-sm mt-1">Review selected challans and fees before payment</p>

        {loading ? (
          <p className="text-slate-500 mt-8">Calculating totals…</p>
        ) : error && !preview ? (
          <p className="text-red-600 text-sm mt-8">{error}</p>
        ) : preview ? (
          <>
            <ul className="mt-6 space-y-4">
              {preview.line_items.map((item) => (
                <li key={item.challan_uuid} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{item.challan_number}</p>
                      <p className="text-xs text-slate-500">{item.vehicle_number}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded h-fit shrink-0 ${
                        item.medium === "court_challan"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {mediumLabel(item.medium)}
                    </span>
                  </div>
                  {item.offense_name && (
                    <p className="text-sm text-slate-600 mt-2">{item.offense_name}</p>
                  )}
                  <div className="mt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Challan amount</span>
                      <span>₹{formatMoney(item.challan_amount)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Service fee</span>
                      <span>₹{formatMoney(item.service_fee)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-900 pt-1 border-t border-slate-100">
                      <span>Subtotal</span>
                      <span>₹{formatMoney(item.line_total)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Challans ({preview.challan_count})</span>
                <span>₹{formatMoney(preview.subtotal_challans)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Service fees</span>
                <span>₹{formatMoney(preview.subtotal_service_fees)}</span>
              </div>
              <p className="text-xs text-slate-400">{preview.fee_note}</p>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total to pay</span>
                <span>₹{formatMoney(preview.grand_total)}</span>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
          </>
        ) : null}
      </div>

      {preview && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur p-4 shadow-lg">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-slate-600">Total</span>
              <span className="text-xl font-bold text-slate-900">
                ₹{formatMoney(preview.grand_total)}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePayNow}
              disabled={paying}
              className="w-full rounded-xl bg-emerald-600 text-white py-3.5 font-semibold hover:bg-emerald-500 disabled:opacity-50 transition"
            >
              {paying ? "Processing…" : "Pay now"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
