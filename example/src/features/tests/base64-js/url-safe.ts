// URL-safe tests using native toBase64URL/fromBase64URL
import FastBase64 from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test, arrayBufferToBytes } from '../../../shared';

// RFC 4648 URL vectors (unpadded)
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
      'b64js-urlsafe-toBase64URL-vectors',
      'toBase64URL — RFC 4648 URL vectors (unpadded)',
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
      'b64js-urlsafe-no-plus-slash',
      'toBase64URL output never contains + or /',
      () => {
        const allBytes = new Uint8Array(256);
        for (let i = 0; i < 256; i++) allBytes[i] = i;
        const got = FastBase64.toBase64URL(
          allBytes.buffer as unknown as Object
        ) as string;
        ok(!got.includes('+') && !got.includes('/'), `contains + or /: ${got}`);
      }
    ),

    test(
      'b64js-urlsafe-fromBase64URL-unpadded',
      'fromBase64URL accepts unpadded input',
      () => {
        // 'Zg' is 'Zg==' without padding — [102]
        const got = arrayBufferToBytes(FastBase64.fromBase64URL('Zg'));
        ok(JSON.stringify(got) === '[102]', `got ${JSON.stringify(got)}`);
      }
    ),

    test(
      'b64js-urlsafe-fromBase64URL-padded',
      'fromBase64URL accepts padded input ("Zg==")',
      () => {
        const got = arrayBufferToBytes(FastBase64.fromBase64URL('Zg=='));
        ok(JSON.stringify(got) === '[102]', `got ${JSON.stringify(got)}`);
      }
    ),

    test(
      'b64js-urlsafe-fromBase64URL-roundtrip',
      'fromBase64URL roundtrip',
      () => {
        const input = new Uint8Array([1, 2, 3, 200, 255, 0]);
        const encoded = FastBase64.toBase64URL(
          input.buffer as unknown as Object
        ) as string;
        const decoded = arrayBufferToBytes(FastBase64.fromBase64URL(encoded));
        ok(
          JSON.stringify(decoded) === JSON.stringify(Array.from(input)),
          'roundtrip mismatch'
        );
      }
    ),

    test(
      'b64js-urlsafe-fromBase64URL-throws-plus',
      'fromBase64URL throws for + and /',
      () => {
        for (const bad of ['x+/y', 'Zm9v/']) {
          let threw = false;
          try {
            FastBase64.fromBase64URL(bad);
          } catch {
            threw = true;
          }
          ok(threw, `fromBase64URL(${JSON.stringify(bad)}) should throw`);
        }
      }
    ),
  ];
}
