"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { sendFirebaseOtp, toE164 } from "@/lib/firebase/phone-auth";
import { sendBackendOtp } from "@/lib/auth/backend-otp";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase/errors";
import { getApiErrorMessage } from "@/lib/api/errors";
import { clearTokens } from "@/lib/auth/token";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    clearTokens();
  }, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const useFirebase = isFirebaseConfigured();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      sessionStorage.setItem("dc_name", name.trim());
      sessionStorage.setItem("dc_phone", phone);

      const preferBackend = process.env.NODE_ENV === "development" || !useFirebase;

      if (preferBackend) {
        sessionStorage.setItem("dc_auth_mode", "backend");
        sessionStorage.removeItem("dc_test_otp_hint");
        const res = await sendBackendOtp(phone, name.trim());
        if (res.dev_otp) sessionStorage.setItem("dc_dev_otp", res.dev_otp);
      } else {
        sessionStorage.setItem("dc_auth_mode", "firebase");
        sessionStorage.removeItem("dc_dev_otp");
        sessionStorage.removeItem("dc_test_otp_hint");
        const firebaseSend = sendFirebaseOtp(toE164(phone));
        await Promise.race([
          firebaseSend,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Request timed out")), 20_000),
          ),
        ]);
      }

      router.push("/verify-otp");
    } catch (err: unknown) {
      setError(
        useFirebase && process.env.NODE_ENV !== "development"
          ? getFirebaseAuthErrorMessage(err)
          : getApiErrorMessage(err),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Sign in</h1>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed">
          Enter your details to search challans, pay securely, and track settlement.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
              Mobile number
            </label>
            <div className="flex rounded-2xl border-2 border-slate-200 bg-white overflow-hidden focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/15 transition">
              <span className="flex items-center px-3 text-slate-500 text-sm font-medium border-r border-slate-200 bg-slate-50">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
                minLength={10}
                maxLength={10}
                autoComplete="tel-national"
                className="flex-1 px-3 py-3.5 text-slate-900 outline-none"
                placeholder="10-digit number"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || phone.length < 10 || !name.trim()}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 font-semibold shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-45 disabled:shadow-none disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Sending OTP…" : "Continue"}
          </button>
        </form>

        <p className="mt-5 text-xs text-slate-500 text-center leading-relaxed">
          By continuing, you agree to receive an OTP for verification. Payments are processed securely via
          Razorpay.
        </p>
      </div>
    </AuthLayout>
  );
}
