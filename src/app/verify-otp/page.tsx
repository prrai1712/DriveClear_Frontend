"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { exchangeFirebaseToken } from "@/lib/auth/firebase-login";
import { verifyBackendOtp, sendBackendOtp } from "@/lib/auth/backend-otp";
import {
  confirmFirebaseOtp,
  destroyRecaptcha,
  getPendingConfirmation,
  sendFirebaseOtp,
  toE164,
} from "@/lib/firebase/phone-auth";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase/errors";

function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return `${phone.slice(0, 2)}•••••${phone.slice(-2)}`;
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [authMode, setAuthMode] = useState<"backend" | "firebase">("backend");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const p = sessionStorage.getItem("dc_phone") || "";
    const n = sessionStorage.getItem("dc_name") || "";
    const mode = (sessionStorage.getItem("dc_auth_mode") || "backend") as "backend" | "firebase";
    setPhone(p);
    setName(n);
    setAuthMode(mode);

    if (mode === "firebase" && !getPendingConfirmation()) {
      router.replace("/login");
    }
    if (!p) {
      router.replace("/login");
    }
  }, [router]);

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (authMode === "firebase") {
        const idToken = await confirmFirebaseOtp(otp);
        await exchangeFirebaseToken(idToken, name);
      } else {
        await verifyBackendOtp(phone, otp, name);
      }
      sessionStorage.removeItem("dc_phone");
      sessionStorage.removeItem("dc_name");
      sessionStorage.removeItem("dc_auth_mode");
      sessionStorage.removeItem("dc_dev_otp");
      sessionStorage.removeItem("dc_test_otp_hint");
      router.push("/vehicle");
    } catch (err: unknown) {
      if (authMode === "firebase" && process.env.NODE_ENV === "development") {
        try {
          await verifyBackendOtp(phone, otp, name);
          sessionStorage.removeItem("dc_phone");
          sessionStorage.removeItem("dc_name");
          sessionStorage.removeItem("dc_auth_mode");
          sessionStorage.removeItem("dc_dev_otp");
          sessionStorage.removeItem("dc_test_otp_hint");
          router.push("/vehicle");
          return;
        } catch {
          /* show error below */
        }
      }
      if (authMode === "firebase") {
        const apiMsg = getApiErrorMessage(err);
        setError(
          apiMsg !== "Request failed" && !apiMsg.startsWith("Request failed with status")
            ? apiMsg
            : getFirebaseAuthErrorMessage(err),
        );
      } else {
        setError(getApiErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setLoading(true);
    try {
      if (authMode === "firebase") {
        destroyRecaptcha();
        await sendFirebaseOtp(toE164(phone));
      } else {
        const res = await sendBackendOtp(phone, name);
        if (res.dev_otp) sessionStorage.setItem("dc_dev_otp", res.dev_otp);
      }
    } catch (err: unknown) {
      setError(
        authMode === "firebase" ? getFirebaseAuthErrorMessage(err) : getApiErrorMessage(err),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout backHref="/login" backLabel="Change number">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Verify OTP</h1>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-slate-800">+91 {maskPhone(phone)}</span>
        </p>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label htmlFor="otp" className="sr-only">
              One-time password
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              maxLength={6}
              className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-center text-2xl tracking-[0.4em] font-semibold text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 transition"
              placeholder="••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 font-semibold shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-45 disabled:shadow-none disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Verifying…" : "Verify & continue"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="mt-4 w-full text-sm font-medium text-emerald-700 hover:text-emerald-800 disabled:opacity-50 transition"
        >
          Resend code
        </button>
      </div>
    </AuthLayout>
  );
}
