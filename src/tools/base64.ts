// Base64 encoder / decoder (UTF-8 safe)

export interface Base64Result {
  text: string;
  error?: string;
  bytes: number;
}

function utf8Bytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function bytesToUtf8(bytes: Uint8Array): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch (err) {
    return '';
  }
}

export function encodeBase64(input: string): Base64Result {
  if (!input) return { text: '', bytes: 0 };
  try {
    const bytes = utf8Bytes(input);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    const text = btoa(bin);
    return { text, bytes: bytes.length };
  } catch (err) {
    return { text: '', error: (err as Error).message, bytes: 0 };
  }
}

export function decodeBase64(input: string): Base64Result {
  const cleaned = input.replace(/\s+/g, '');
  if (!cleaned) return { text: '', bytes: 0 };
  try {
    const bin = atob(cleaned);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const text = bytesToUtf8(bytes);
    if (!text) return { text: '', error: 'Decoded bytes are not valid UTF-8 text.', bytes: bytes.length };
    return { text, bytes: bytes.length };
  } catch (err) {
    return { text: '', error: 'Invalid Base64 string.', bytes: 0 };
  }
}
