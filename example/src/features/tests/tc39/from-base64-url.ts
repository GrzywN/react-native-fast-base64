// Tests for FastBase64.fromBase64URL — TC39-style
import FastBase64 from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test, arrayBufferToBytes } from '../../../shared';

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
      'tc39-from64url-rfc-vectors',
      'fromBase64URL — RFC 4648 URL-safe vectors',
      () => {
        for (const [bytes, encoded] of RFC4648_URL) {
          const got = arrayBufferToBytes(FastBase64.fromBase64URL(encoded));
          ok(
            JSON.stringify(got) === JSON.stringify(bytes),
            `fromBase64URL(${encoded}) = ${JSON.stringify(
              got
            )}, expected ${JSON.stringify(bytes)}`
          );
        }
      }
    ),

    test(
      'tc39-from64url-alphabet',
      'fromBase64URL — "x-_y" → [199,239,242]',
      () => {
        const got = arrayBufferToBytes(FastBase64.fromBase64URL('x-_y'));
        ok(
          JSON.stringify(got) === '[199,239,242]',
          `got ${JSON.stringify(got)}`
        );
      }
    ),

    test(
      'tc39-from64url-accepts-padded',
      'fromBase64URL — accepts padded input "Zg=="',
      () => {
        const got = arrayBufferToBytes(FastBase64.fromBase64URL('Zg=='));
        ok(JSON.stringify(got) === '[102]', `got ${JSON.stringify(got)}`);
      }
    ),

    test(
      'tc39-from64url-throws-plus-slash-1',
      'fromBase64URL — throws for "x+/y" (contains + and /)',
      () => {
        let threw = false;
        try {
          FastBase64.fromBase64URL('x+/y');
        } catch {
          threw = true;
        }
        ok(threw, '"x+/y" should throw');
      }
    ),

    test(
      'tc39-from64url-throws-plus-slash-2',
      'fromBase64URL — throws for "Zm9v/" (contains /)',
      () => {
        let threw = false;
        try {
          FastBase64.fromBase64URL('Zm9v/');
        } catch {
          threw = true;
        }
        ok(threw, '"Zm9v/" should throw');
      }
    ),

    test(
      'tc39-from64url-throws-illegal',
      'fromBase64URL — throws for illegal "Zm.9v"',
      () => {
        let threw = false;
        try {
          FastBase64.fromBase64URL('Zm.9v');
        } catch {
          threw = true;
        }
        ok(threw, '"Zm.9v" should throw');
      }
    ),

    test(
      'tc39-from64url-roundtrip',
      'fromBase64URL(toBase64URL) roundtrip',
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
  ];
}
