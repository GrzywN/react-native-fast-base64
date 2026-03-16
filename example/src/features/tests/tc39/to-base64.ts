// Tests for FastBase64.toBase64 — TC39-style
import FastBase64 from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test, makeBytes, arrayBufferToBytes } from '../../../shared';

const RFC4648: [number[], string][] = [
  [[], ''],
  [[102], 'Zg=='],
  [[102, 111], 'Zm8='],
  [[102, 111, 111], 'Zm9v'],
  [[102, 111, 111, 98], 'Zm9vYg=='],
  [[102, 111, 111, 98, 97], 'Zm9vYmE='],
  [[102, 111, 111, 98, 97, 114], 'Zm9vYmFy'],
];

export function run(): TestResult[] {
  return [
    test(
      'tc39-to64-rfc-vectors',
      'toBase64 — RFC 4648 vectors (ArrayBuffer form)',
      () => {
        for (const [bytes, encoded] of RFC4648) {
          const got = FastBase64.toBase64(
            new Uint8Array(bytes).buffer as unknown as Object
          ) as string;
          ok(
            got === encoded,
            `toBase64(${JSON.stringify(bytes)}) = ${got}, expected ${encoded}`
          );
        }
      }
    ),

    test('tc39-to64-alphabet', 'toBase64 — [199,239,242] → "x+/y"', () => {
      const got = FastBase64.toBase64(
        new Uint8Array([199, 239, 242]).buffer as unknown as Object
      ) as string;
      ok(got === 'x+/y', `got ${got}`);
    }),

    test(
      'tc39-to64-zeros',
      'toBase64 — all-zeros (new ArrayBuffer(3)) → "AAAA"',
      () => {
        const got = FastBase64.toBase64(
          new ArrayBuffer(3) as unknown as Object
        ) as string;
        ok(got === 'AAAA', `got ${got}`);
      }
    ),

    test(
      'tc39-to64-0xff',
      'toBase64 — all-0xFF (new Uint8Array(3).fill(0xff).buffer) → "////"',
      () => {
        const got = FastBase64.toBase64(
          new Uint8Array(3).fill(0xff).buffer as unknown as Object
        ) as string;
        ok(got === '////', `got ${got}`);
      }
    ),

    test(
      'tc39-to64-roundtrip-1kb',
      'toBase64 — 1 KB roundtrip via fromBase64',
      () => {
        const input = makeBytes(1024);
        const encoded = FastBase64.toBase64(
          input.buffer as unknown as Object
        ) as string;
        const decoded = arrayBufferToBytes(FastBase64.fromBase64(encoded));
        ok(
          JSON.stringify(decoded) === JSON.stringify(Array.from(input)),
          'roundtrip mismatch'
        );
      }
    ),
  ];
}
