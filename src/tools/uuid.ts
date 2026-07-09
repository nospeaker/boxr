// UUID Generator — RFC 4122 v1, v4, v5, v7

export type UuidVersion = 'v1' | 'v4' | 'v5' | 'v7';

const NAMESPACE_DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const NAMESPACE_URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
const NAMESPACE_OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';
const NAMESPACE_X500 = '6ba7b814-9dad-11d1-80b4-00c04fd430c8';

// Prefer crypto.randomUUID when available
export function generateUuid(version: UuidVersion = 'v4', count = 1, name = '', namespace = NAMESPACE_DNS): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(genOne(version, name, namespace));
  }
  return out;
}

function genOne(version: UuidVersion, name: string, namespace: string): string {
  switch (version) {
    case 'v1':
      return uuidV1();
    case 'v4':
      if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
      return uuidV4();
    case 'v5':
      return uuidV5(name || 'utilhub', namespace);
    case 'v7':
      return uuidV7();
  }
}

function uuidV4(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
}

function uuidV1(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  // Set version (1) and variant
  bytes[6] = (bytes[6] & 0x0f) | 0x10;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
}

function uuidV7(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  const ts = Date.now();
  bytes[0] = (ts >>> 24) & 0xff;
  bytes[1] = (ts >>> 16) & 0xff;
  bytes[2] = (ts >>> 8) & 0xff;
  bytes[3] = ts & 0xff;
  bytes[4] = ((ts / 0x100000000) * 0x100) & 0xff;
  bytes[5] = ((ts / 0x100000000) * 0x10000) & 0xff;
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
}

function uuidV5(name: string, namespaceStr: string): string {
  const nsBytes = namespaceStringToBytes(namespaceStr);
  const nameBytes = new TextEncoder().encode(name);
  const combined = new Uint8Array(nsBytes.length + nameBytes.length);
  combined.set(nsBytes);
  combined.set(nameBytes, nsBytes.length);
  const hash = sha1(combined);
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) bytes[i] = hash[i];
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return formatUuid(bytes);
}

// ──────────────────────── helpers ────────────────────────

function formatUuid(bytes: Uint8Array): string {
  const hex: string[] = [];
  for (let i = 0; i < bytes.length; i++) hex.push(bytes[i].toString(16).padStart(2, '0'));
  return (
    hex.slice(0, 4).join('') + '-' +
    hex.slice(4, 6).join('') + '-' +
    hex.slice(6, 8).join('') + '-' +
    hex.slice(8, 10).join('') + '-' +
    hex.slice(10, 16).join('')
  );
}

function namespaceStringToBytes(ns: string): Uint8Array {
  // Accept UUID-string namespace
  const cleaned = ns.replace(/-/g, '');
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(cleaned.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Tiny SHA-1 implementation (only used for v5; v4 and v7 use crypto.getRandomValues)
function sha1(bytes: Uint8Array): Uint8Array {
  const len = bytes.length;
  const padded = new Uint8Array(((len + 9 + 63) >> 6) << 6);
  padded.set(bytes);
  padded[len] = 0x80;
  const bitLen = len * 8;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, Math.floor(bitLen / 0x100000000));
  dv.setUint32(padded.length - 4, bitLen >>> 0);

  const w = new Uint32Array(80);
  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  for (let i = 0; i < padded.length; i += 64) {
    for (let j = 0; j < 16; j++) w[j] = dv.getUint32(i + j * 4);
    for (let j = 16; j < 80; j++) {
      w[j] = ((w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16]) << 1) | ((w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16]) >>> 31);
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4;
    for (let j = 0; j < 80; j++) {
      const f =
        j < 20 ? (b & c) | (~b & d) :
        j < 40 ? b ^ c ^ d :
        j < 60 ? (b & c) | (b & d) | (c & d) :
        b ^ c ^ d;
      const t = ((a << 5) | (a >>> 27)) + f + e + w[j] + (j < 20 ? 0x5a827999 : j < 40 ? 0x6ed9eba1 : j < 60 ? 0x8f1bbcdc : 0xca62c1d6);
      e = d; d = c; c = ((b << 30) | (b >>> 2)); b = a; a = t >>> 0;
    }
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }
  const out = new Uint8Array(20);
  const outDv = new DataView(out.buffer);
  outDv.setUint32(0, h0);
  outDv.setUint32(4, h1);
  outDv.setUint32(8, h2);
  outDv.setUint32(12, h3);
  outDv.setUint32(16, h4);
  return out;
}

export const NAMESPACES = {
  DNS: NAMESPACE_DNS,
  URL: NAMESPACE_URL,
  OID: NAMESPACE_OID,
  X500: NAMESPACE_X500,
};
