// Tests for FastBase64.toBase64URL — TC39-style
import FastBase64 from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test } from '../../../shared';

// RFC 4648 URL vectors (no padding)
const RFC4648_URL: [number[], string][] = [
  [[], ''],
  [[102], 'Zg'],
  [[102, 111], 'Zm8'],
  [[102, 111, 111], 'Zm9v'],
  [[102, 111, 111, 98], 'Zm9vYg'],
  [[102, 111, 111, 98, 97], 'Zm9vYmE'],
  [[102, 111, 111, 98, 97, 114], 'Zm9vYmFy'],
];

export function run(): TestResult[] {
  return [
    test(
      'tc39-to64url-rfc-vectors',
      'toBase64URL — RFC 4648 URL-safe vectors (no padding)',
      () => {
        for (const [bytes, encoded] of RFC4648_URL) {
          const got = FastBase64.toBase64URL(
            new Uint8Array(bytes).buffer as unknown as Object
          ) as string;
          ok(
            got === encoded,
            `toBase64URL(${JSON.stringify(
              bytes
            )}) = ${got}, expected ${encoded}`
          );
        }
      }
    ),

    test(
      'tc39-to64url-alphabet',
      'toBase64URL — [199,239,242] → "x-_y"',
      () => {
        const got = FastBase64.toBase64URL(
          new Uint8Array([199, 239, 242]).buffer as unknown as Object
        ) as string;
        ok(got === 'x-_y', `got ${got}`);
      }
    ),

    test(
      'tc39-to64url-no-padding',
      'toBase64URL — no padding in output',
      () => {
        // 1-byte input would have == padding in standard base64
        const got = FastBase64.toBase64URL(
          new Uint8Array([102]).buffer as unknown as Object
        ) as string;
        ok(!got.includes('='), `got padding: ${got}`);
      }
    ),

    test(
      'tc39-to64url-no-plus-slash',
      'toBase64URL — never + or / in output (all 256 bytes)',
      () => {
        const allBytes = new Uint8Array(256);
        for (let i = 0; i < 256; i++) allBytes[i] = i;
        const got = FastBase64.toBase64URL(
          allBytes.buffer as unknown as Object
        ) as string;
        ok(!got.includes('+') && !got.includes('/'), `contains + or /: ${got}`);
      }
    ),
  ];
}
