import crypto from "crypto";

const TTL_MS = 5 * 60 * 1000;

type Entry = {
  nonce: string;
  issuedAt: string;
  expiresAt: number;
};

const store = new Map<string, Entry>();

function cleanup() {
  const now = Date.now();
  for (const [addr, e] of store) {
    if (e.expiresAt < now) store.delete(addr);
  }
}

export function saveNonce(addressChecksum: string, nonce: string, issuedAt: string): void {
  cleanup();
  store.set(addressChecksum.toLowerCase(), {
    nonce,
    issuedAt,
    expiresAt: Date.now() + TTL_MS,
  });
}

/** Trả về entry và xóa (một lần dùng). */
export function takeNonce(addressChecksum: string): Entry | null {
  cleanup();
  const key = addressChecksum.toLowerCase();
  const e = store.get(key);
  if (!e) return null;
  store.delete(key);
  if (e.expiresAt < Date.now()) return null;
  return e;
}

export function randomNonce(): string {
  return crypto.randomBytes(32).toString("hex");
}
