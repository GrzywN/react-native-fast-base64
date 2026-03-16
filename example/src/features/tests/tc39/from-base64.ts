// Tests for FastBase64.fromBase64 — TC39-style
import FastBase64 from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test, arrayBufferToBytes } from '../../../shared';

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
    test('tc39-from64-rfc-vectors', 'fromBase64 — RFC 4648 vectors', () => {
      for (const [bytes, encoded] of RFC4648) {
        const got = arrayBufferToBytes(FastBase64.fromBase64(encoded));
        ok(
          JSON.stringify(got) === JSON.stringify(bytes),
          `fromBase64(${encoded}) = ${JSON.stringify(
            got
          )}, expected ${JSON.stringify(bytes)}`
        );
      }
    }),

    test('tc39-from64-alphabet', 'fromBase64 — "x+/y" → [199,239,242]', () => {
      const got = arrayBufferToBytes(FastBase64.fromBase64('x+/y'));
      ok(JSON.stringify(got) === '[199,239,242]', `got ${JSON.stringify(got)}`);
    }),

    test(
      'tc39-from64-unpadded-1',
      'fromBase64 — accepts unpadded "Zg" → [102]',
      () => {
        const got = arrayBufferToBytes(FastBase64.fromBase64('Zg'));
        ok(JSON.stringify(got) === '[102]', `got ${JSON.stringify(got)}`);
      }
    ),

    test(
      'tc39-from64-unpadded-2',
      'fromBase64 — accepts unpadded "Zm8" → [102,111]',
      () => {
        const got = arrayBufferToBytes(FastBase64.fromBase64('Zm8'));
        ok(JSON.stringify(got) === '[102,111]', `got ${JSON.stringify(got)}`);
      }
    ),

    test(
      'tc39-from64-whitespace-space',
      'fromBase64 — ignores space whitespace',
      () => {
        const got = arrayBufferToBytes(FastBase64.fromBase64('Zg =='));
        ok(JSON.stringify(got) === '[102]', `got ${JSON.stringify(got)}`);
      }
    ),

    test(
      'tc39-from64-whitespace-newline',
      'fromBase64 — ignores newline whitespace',
      () => {
        const got = arrayBufferToBytes(FastBase64.fromBase64('Zg\n=='));
        ok(JSON.stringify(got) === '[102]', `got ${JSON.stringify(got)}`);
      }
    ),

    test(
      'tc39-from64-whitespace-tab',
      'fromBase64 — ignores tab whitespace',
      () => {
        const got = arrayBufferToBytes(FastBase64.fromBase64('Zg\t=='));
        ok(JSON.stringify(got) === '[102]', `got ${JSON.stringify(got)}`);
      }
    ),

    test(
      'tc39-from64-throws-dot',
      'fromBase64 — throws for illegal "Zm.9v"',
      () => {
        let threw = false;
        try {
          FastBase64.fromBase64('Zm.9v');
        } catch {
          threw = true;
        }
        ok(threw, '"Zm.9v" should throw');
      }
    ),

    test(
      'tc39-from64-throws-caret',
      'fromBase64 — throws for illegal "Zm9v^"',
      () => {
        let threw = false;
        try {
          FastBase64.fromBase64('Zm9v^');
        } catch {
          threw = true;
        }
        ok(threw, '"Zm9v^" should throw');
      }
    ),

    test(
      'tc39-from64-throws-unicode-minus',
      'fromBase64 — throws for Unicode lookalike U+2212',
      () => {
        // U+2212 MINUS SIGN looks like '-' but is not valid base64
        let threw = false;
        try {
          FastBase64.fromBase64('Z\u2212==');
        } catch {
          threw = true;
        }
        ok(threw, 'U+2212 should throw');
      }
    ),

    test('tc39-from64-roundtrip', 'fromBase64(toBase64) roundtrip', () => {
      const input = new Uint8Array([1, 2, 3, 200, 255, 0]);
      const encoded = FastBase64.toBase64(
        input.buffer as unknown as Object
      ) as string;
      const decoded = arrayBufferToBytes(FastBase64.fromBase64(encoded));
      ok(
        JSON.stringify(decoded) === JSON.stringify(Array.from(input)),
        'roundtrip mismatch'
      );
    }),
  ];
}
