#!/usr/bin/env node
/**
 * Decrypt a v1 API envelope from the browser Network tab.
 *
 * Usage:
 *   node scripts/decrypt-api-payload.mjs '<payload-string>' [base64-key]
 *
 * Key defaults to NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_KEY from .env.local
 */
import { readFileSync } from "fs";
import { createDecipheriv } from "crypto";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const VERSION_PREFIX = "v1.";

function loadKeyFromEnvLocal() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const raw = readFileSync(join(root, ".env.local"), "utf8");
  const line = raw.split("\n").find((l) => l.startsWith("NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_KEY="));
  if (!line) throw new Error("Key not found in .env.local");
  return line.split("=", 2)[1].trim();
}

function b64urlDecode(input) {
  const padded = input + "=".repeat((4 - (input.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function decrypt(token, keyB64) {
  if (!token.startsWith(VERSION_PREFIX)) throw new Error("Expected v1. prefix");
  const raw = b64urlDecode(token.slice(VERSION_PREFIX.length));
  const iv = raw.subarray(0, 12);
  const tagAndCipher = raw.subarray(12);
  const key = b64urlDecode(keyB64);
  if (key.length !== 32) throw new Error("Key must be 32 bytes");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  const tag = tagAndCipher.subarray(-16);
  const ciphertext = tagAndCipher.subarray(0, -16);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plain.toString("utf8"));
}

const payload = process.argv[2];
const key = process.argv[3] || loadKeyFromEnvLocal();
if (!payload) {
  console.error("Usage: node scripts/decrypt-api-payload.mjs '<v1....>' [key]");
  process.exit(1);
}
console.log(JSON.stringify(decrypt(payload, key), null, 2));
