import type { ApiResponse } from "./types";

const ENABLED = process.env.NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_ENABLED === "true";
const KEY_B64 = (process.env.NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_KEY || "").trim();
const VERSION_PREFIX = "v1.";

export type EncryptedEnvelope = {
  encrypted: true;
  payload: string;
};

export function isPayloadEncryptionEnabled(): boolean {
  return ENABLED && KEY_B64.length > 0;
}

function base64UrlDecode(input: string): Uint8Array {
  const padded = input + "=".repeat((4 - (input.length % 4)) % 4);
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function importAesKey(): Promise<CryptoKey> {
  const keyBytes = base64UrlDecode(KEY_B64);
  if (keyBytes.length !== 32) {
    throw new Error("NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_KEY must decode to 32 bytes");
  }
  const keyMaterial = new Uint8Array(keyBytes);
  return crypto.subtle.importKey("raw", keyMaterial, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

export function isEncryptedEnvelope(data: unknown): data is EncryptedEnvelope {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as EncryptedEnvelope).encrypted === true &&
    typeof (data as EncryptedEnvelope).payload === "string"
  );
}

export async function decryptApiEnvelope<T = ApiResponse<unknown>>(outer: EncryptedEnvelope): Promise<T> {
  if (!isPayloadEncryptionEnabled()) {
    throw new Error("Payload encryption is not enabled on the client");
  }
  const raw = base64UrlDecode(outer.payload.slice(VERSION_PREFIX.length));
  if (raw.length < 13) {
    throw new Error("Invalid encrypted payload");
  }
  // Copy into standalone buffers — required for Web Crypto in some browsers.
  const iv = new Uint8Array(raw.slice(0, 12));
  const ciphertext = new Uint8Array(raw.slice(12));
  const key = await importAesKey();
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return JSON.parse(new TextDecoder().decode(plain)) as T;
}

export async function encryptApiBody(body: Record<string, unknown>): Promise<EncryptedEnvelope> {
  if (!isPayloadEncryptionEnabled()) {
    throw new Error("Payload encryption is not enabled on the client");
  }
  const plaintext = new TextEncoder().encode(JSON.stringify(body));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await importAesKey();
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return {
    encrypted: true,
    payload: `${VERSION_PREFIX}${base64UrlEncode(combined)}`,
  };
}

export async function unwrapApiData<T>(data: unknown): Promise<T> {
  if (isEncryptedEnvelope(data)) {
    return decryptApiEnvelope<T>(data);
  }
  return data as T;
}
