import NativeFastBase64 from './NativeFastBase64';

export * from './NativeFastBase64';
export { default } from './NativeFastBase64';

// base64-js compatibility — https://github.com/beatgammit/base64-js

export function fromByteArray(bytes: Uint8Array): string {
  // If bytes is a slice, isolate its portion of the backing buffer.
  const buffer =
    bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength
      ? bytes.buffer
      : bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength
        );

  return NativeFastBase64.toBase64(buffer as unknown as Object);
}

export function toByteArray(base64: string): Uint8Array {
  return new Uint8Array(
    NativeFastBase64.fromBase64(base64) as unknown as ArrayBuffer
  );
}

/** O(1) — does not decode or allocate. */
export function byteLength(base64: string): number {
  const base64Length = base64.length;

  if (base64Length === 0) {
    return 0;
  }

  const paddingLength =
    base64[base64Length - 2] === '='
      ? 2
      : base64[base64Length - 1] === '='
      ? 1
      : 0;

  return (base64Length / 4) * 3 - paddingLength;
}
