"use client";

import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";

let recaptchaVerifier: RecaptchaVerifier | null = null;
let pendingConfirmation: ConfirmationResult | null = null;
let recaptchaContainerId: string | null = null;

/** Remove verifier + wipe DOM so Firebase can render again. */
export function destroyRecaptcha(): void {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {
      /* already cleared */
    }
    recaptchaVerifier = null;
  }
  if (recaptchaContainerId) {
    const el = document.getElementById(recaptchaContainerId);
    if (el) {
      el.innerHTML = "";
      el.remove();
    }
    recaptchaContainerId = null;
  }
  document.querySelectorAll("#recaptcha-container").forEach((el) => {
    el.innerHTML = "";
  });
}

function createRecaptchaContainer(): string {
  destroyRecaptcha();
  const id = `recaptcha-${Date.now()}`;
  const el = document.createElement("div");
  el.id = id;
  el.style.position = "fixed";
  el.style.bottom = "0";
  el.style.right = "0";
  el.style.zIndex = "9999";
  document.body.appendChild(el);
  recaptchaContainerId = id;
  return id;
}

async function getRecaptchaVerifier(): Promise<RecaptchaVerifier> {
  const auth = getFirebaseAuth();
  const containerId = createRecaptchaContainer();

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {},
    "expired-callback": () => destroyRecaptcha(),
  });

  return recaptchaVerifier;
}

export function getPendingConfirmation(): ConfirmationResult | null {
  return pendingConfirmation;
}

export function clearPendingConfirmation(): void {
  pendingConfirmation = null;
}

export async function sendFirebaseOtp(phoneE164: string): Promise<ConfirmationResult> {
  const auth = getFirebaseAuth();
  const verifier = await getRecaptchaVerifier();
  try {
    pendingConfirmation = await signInWithPhoneNumber(auth, phoneE164, verifier);
    return pendingConfirmation;
  } catch (error) {
    destroyRecaptcha();
    throw error;
  }
}

export async function confirmFirebaseOtp(code: string): Promise<string> {
  if (!pendingConfirmation) {
    throw new Error("No OTP session. Please request a new code from login.");
  }
  const credential = await pendingConfirmation.confirm(code);
  clearPendingConfirmation();
  destroyRecaptcha();
  return credential.user.getIdToken();
}

export function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (phone.startsWith("+")) return phone;
  return `+${digits}`;
}
