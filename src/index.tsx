import NativeFastBase64 from './NativeFastBase64';

export * from './NativeFastBase64';
export { default } from './NativeFastBase64';

// base64-js compatibility — https://github.com/beatgammit/base64-js

/** Encodes a Uint8Array to a base64 string. */
export function fromByteArray(bytes: Uint8Array): string {
  // If bytes is a slice, isolate its portion of the backing buffer.
  const buf =
    bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength
      ? bytes.buffer
      : bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength
        );
  return NativeFastBase64.toBase64(buf as unknown as Object);
}

/** Decodes a base64 string to a Uint8Array. */
export function toByteArray(base64: string): Uint8Array {
  return new Uint8Array(
    NativeFastBase64.fromBase64(base64) as unknown as ArrayBuffer
  );
}

/** Returns the byte length of the decoded data without decoding. */
export function byteLength(base64: string): number {
  const len = base64.length;
  if (len === 0) return 0;
  const padLen = base64[len - 2] === '=' ? 2 : base64[len - 1] === '=' ? 1 : 0;
  return (len / 4) * 3 - padLen;
}
