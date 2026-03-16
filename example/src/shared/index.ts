export type TestResult = {
  id: string;
  name: string;
  ok: boolean;
  detail?: string;
};

export function ok(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

export function test(
  id: string,
  name: string,
  testFunction: () => void
): TestResult {
  try {
    testFunction();

    return { id, name, ok: true };
  } catch (e: unknown) {
    return { id, name, ok: false, detail: String(e) };
  }
}

export function arrayBufferToBytes(arrayBuffer: unknown): number[] {
  return Array.from(new Uint8Array(arrayBuffer as ArrayBuffer));
}

export function makeBytes(length: number, chunk = 256): Uint8Array {
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = i % chunk;
  }

  return bytes;
}

export function makeAsciiString(
  length: number,
  alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';

  for (let i = 0; i < length; i++) {
    result += alpha[i % alpha.length];
  }

  return result;
}
