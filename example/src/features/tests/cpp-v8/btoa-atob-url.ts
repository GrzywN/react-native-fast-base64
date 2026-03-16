// Port of test_btoaURL_atobURL() from shared/v8/tests/Base64Test.cpp
//
// Mapping notes:
//   btoaURL(latin1) → convert string to Uint8Array bytes → FastBase64.toBase64URL(buffer)
//   atobURL(b64url) → FastBase64.fromBase64URL(b64url) → convert ArrayBuffer to string
//
// The C++ atobURL uses strict mode (throws for missing padding).
// Our fromBase64URL is loose (accepts unpadded). The strict-mode throw test
// (atobURL("YQ") throws) is intentionally skipped because our JS API
// deliberately accepts unpadded input as per the TC39 Uint8Array.fromBase64 default.
import FastBase64 from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test } from '../../../shared';

function btoaURL(latin1: string): string {
  const bytes = new Uint8Array(latin1.length);
  for (let i = 0; i < latin1.length; i++) bytes[i] = latin1.charCodeAt(i);
  return FastBase64.toBase64URL(bytes.buffer as unknown as Object) as string;
}

function atobURL(b64url: string): string {
  const buf = FastBase64.fromBase64URL(b64url) as unknown as ArrayBuffer;
  return String.fromCharCode(...new Uint8Array(buf));
}

export function run(): TestResult[] {
  return [
    test('v8-btoaURL-foobar', 'v8: btoaURL("foobar") == "Zm9vYmFy"', () => {
      ok(btoaURL('foobar') === 'Zm9vYmFy', `got ${btoaURL('foobar')}`);
    }),

    test('v8-atobURL-foobar', 'v8: atobURL("Zm9vYmFy") == "foobar"', () => {
      ok(atobURL('Zm9vYmFy') === 'foobar', `got ${atobURL('Zm9vYmFy')}`);
    }),

    test('v8-btoaURL-atobURL-abc', 'v8: roundtrip "abc" (3 bytes)', () => {
      ok(atobURL(btoaURL('abc')) === 'abc', 'roundtrip "abc" failed');
    }),

    test(
      'v8-btoaURL-atobURL-abcdef',
      'v8: roundtrip "abcdef" (6 bytes)',
      () => {
        ok(
          atobURL(btoaURL('abcdef')) === 'abcdef',
          'roundtrip "abcdef" failed'
        );
      }
    ),

    test(
      'v8-btoaURL-atobURL-9bytes',
      'v8: roundtrip "hello wo!" (9 bytes)',
      () => {
        ok(
          atobURL(btoaURL('hello wo!')) === 'hello wo!',
          'roundtrip "hello wo!" failed'
        );
      }
    ),

    test(
      'v8-btoaURL-url-chars',
      'v8: bytes {0xFB,0xEF,0xBE}: standard has + or /, url uses - or _',
      () => {
        const urlBytes = new Uint8Array([0xfb, 0xef, 0xbe]);
        const stdEnc = FastBase64.toBase64(
          urlBytes.buffer as unknown as Object
        ) as string;
        const urlEnc = FastBase64.toBase64URL(
          urlBytes.buffer as unknown as Object
        ) as string;
        ok(
          stdEnc.includes('+') || stdEnc.includes('/'),
          `standard base64 should contain + or /: ${stdEnc}`
        );
        ok(
          !urlEnc.includes('+') && !urlEnc.includes('/'),
          `base64url should not contain + or /: ${urlEnc}`
        );
        ok(
          urlEnc.includes('-') || urlEnc.includes('_'),
          `base64url should contain - or _: ${urlEnc}`
        );
      }
    ),

    test(
      'v8-atobURL-throws-invalid',
      'v8: atobURL("not!base64url") throws (invalid chars)',
      () => {
        let threw = false;
        try {
          FastBase64.fromBase64URL('not!base64url');
        } catch {
          threw = true;
        }
        ok(threw, 'fromBase64URL("not!base64url") should throw');
      }
    ),
  ];
}
