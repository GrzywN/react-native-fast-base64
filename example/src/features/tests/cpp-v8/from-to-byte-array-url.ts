// Port of test_fromToByteArrayURL() from shared/v8/tests/Base64Test.cpp
import FastBase64 from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test, arrayBufferToBytes } from '../../../shared';

function fromByteArrayURL(bytes: number[]): string {
  return FastBase64.toBase64URL(
    new Uint8Array(bytes).buffer as unknown as Object
  ) as string;
}

function toByteArrayURL(base64Url: string): number[] {
  return arrayBufferToBytes(FastBase64.fromBase64URL(base64Url));
}

export function run(): TestResult[] {
  return [
    test(
      'v8-fromByteArrayURL-foobar',
      'v8: fromByteArrayURL([102,111,111,98,97,114]) == "Zm9vYmFy"',
      () => {
        ok(
          fromByteArrayURL([102, 111, 111, 98, 97, 114]) === 'Zm9vYmFy',
          `got ${fromByteArrayURL([102, 111, 111, 98, 97, 114])}`
        );
      }
    ),

    test(
      'v8-toByteArrayURL-foobar',
      'v8: toByteArrayURL("Zm9vYmFy") == [102,111,111,98,97,114]',
      () => {
        const got = toByteArrayURL('Zm9vYmFy');
        const expected = [102, 111, 111, 98, 97, 114];
        ok(
          JSON.stringify(got) === JSON.stringify(expected),
          `got ${JSON.stringify(got)}`
        );
      }
    ),

    test(
      'v8-fromToByteArrayURL-256-roundtrip',
      'v8: all 256 bytes roundtrip',
      () => {
        const allBytes = Array.from({ length: 256 }, (_, i) => i);
        const got = toByteArrayURL(fromByteArrayURL(allBytes));
        ok(
          JSON.stringify(got) === JSON.stringify(allBytes),
          'all 256 bytes roundtrip failed'
        );
      }
    ),

    test(
      'v8-fromByteArrayURL-no-pad-1',
      'v8: fromByteArrayURL([42]) no padding (no "=")',
      () => {
        const encoded = fromByteArrayURL([42]);
        ok(!encoded.includes('='), `got padding: ${encoded}`);
      }
    ),

    test(
      'v8-fromByteArrayURL-no-pad-2',
      'v8: fromByteArrayURL([42,43]) no padding',
      () => {
        const encoded = fromByteArrayURL([42, 43]);
        ok(!encoded.includes('='), `got padding: ${encoded}`);
      }
    ),

    test(
      'v8-fromByteArrayURL-no-pad-3',
      'v8: fromByteArrayURL([42,43,44]) no padding',
      () => {
        const encoded = fromByteArrayURL([42, 43, 44]);
        ok(!encoded.includes('='), `got padding: ${encoded}`);
      }
    ),

    test(
      'v8-toByteArrayURL-loose-1',
      'v8: toByteArrayURL(fromByteArrayURL([42])) == [42]',
      () => {
        const got = toByteArrayURL(fromByteArrayURL([42]));
        ok(JSON.stringify(got) === '[42]', `got ${JSON.stringify(got)}`);
      }
    ),

    test(
      'v8-toByteArrayURL-loose-2',
      'v8: toByteArrayURL(fromByteArrayURL([42,43])) == [42,43]',
      () => {
        const got = toByteArrayURL(fromByteArrayURL([42, 43]));
        ok(JSON.stringify(got) === '[42,43]', `got ${JSON.stringify(got)}`);
      }
    ),

    test(
      'v8-toByteArrayURL-loose-3',
      'v8: toByteArrayURL(fromByteArrayURL([42,43,44])) == [42,43,44]',
      () => {
        const got = toByteArrayURL(fromByteArrayURL([42, 43, 44]));
        ok(JSON.stringify(got) === '[42,43,44]', `got ${JSON.stringify(got)}`);
      }
    ),
  ];
}
