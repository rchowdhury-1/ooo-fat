import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_session";
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me";
  return globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): ArrayBuffer {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return arr.buffer as ArrayBuffer;
}

export async function createAdminToken(): Promise<string> {
  const payload = JSON.stringify({ admin: true, iat: Date.now() });
  const key = await getKey();
  const sig = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return btoa(payload) + "." + toHex(sig);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const payloadB64 = token.slice(0, dot);
  const sigHex = token.slice(dot + 1);
  try {
    const payload = atob(payloadB64);
    const key = await getKey();
    const valid = await globalThis.crypto.subtle.verify(
      "HMAC",
      key,
      fromHex(sigHex),
      new TextEncoder().encode(payload)
    );
    if (!valid) return false;
    const data = JSON.parse(payload) as { admin?: boolean; iat?: number };
    return (
      data.admin === true &&
      typeof data.iat === "number" &&
      Date.now() - data.iat < MAX_AGE_MS
    );
  } catch {
    return false;
  }
}

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
