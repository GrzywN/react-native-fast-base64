// Port of test_fromToByteArray() from shared/v8/tests/Base64Test.cpp
import {
  fromByteArray as fastFromByteArray,
  toByteArray as fastToByteArray,
} from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test } from '../../../shared';

export function run(): TestResult[] {
  return [
    test(
      'v8-fromByteArray-foobar',
      'v8: fromByteArray([102,111,111,98,97,114]) == "Zm9vYmFy"',
      () => {
        const foobar = new Uint8Array([102, 111, 111, 98, 97, 114]);
        ok(
          fastFromByteArray(foobar) === 'Zm9vYmFy',
          `got ${fastFromByteArray(foobar)}`
        );
      }
    ),

    test(
      'v8-toByteArray-foobar',
      'v8: toByteArray("Zm9vYmFy") == [102,111,111,98,97,114]',
      () => {
        const got = fastToByteArray('Zm9vYmFy');
        const expected = [102, 111, 111, 98, 97, 114];
        ok(
          JSON.stringify(Array.from(got)) === JSON.stringify(expected),
          `got ${JSON.stringify(Array.from(got))}`
        );
      }
    ),

    test('v8-fromByteArray-empty', 'v8: fromByteArray([]) == ""', () => {
      ok(fastFromByteArray(new Uint8Array([])) === '', 'empty should be ""');
    }),

    test('v8-toByteArray-empty', 'v8: toByteArray("") is empty', () => {
      const got = fastToByteArray('');
      ok(got.length === 0, `expected empty, got length ${got.length}`);
    }),

    test(
      'v8-fromByteArray-zeros',
      'v8: fromByteArray([0,0,0]) == "AAAA"',
      () => {
        ok(
          fastFromByteArray(new Uint8Array([0, 0, 0])) === 'AAAA',
          `got ${fastFromByteArray(new Uint8Array([0, 0, 0]))}`
        );
      }
    ),

    test(
      'v8-fromByteArray-maxbytes',
      'v8: fromByteArray([255,255,255]) == "////"',
      () => {
        ok(
          fastFromByteArray(new Uint8Array([255, 255, 255])) === '////',
          `got ${fastFromByteArray(new Uint8Array([255, 255, 255]))}`
        );
      }
    ),

    test('v8-toByteArray-single', 'v8: toByteArray("YQ==") == [97]', () => {
      const got = fastToByteArray('YQ==');
      ok(
        JSON.stringify(Array.from(got)) === '[97]',
        `got ${JSON.stringify(Array.from(got))}`
      );
    }),

    test(
      'v8-fromToByteArray-255-roundtrip',
      'v8: 255-byte roundtrip (bytes 0..254)',
      () => {
        const allBytes = new Uint8Array(255);
        for (let i = 0; i < 255; i++) allBytes[i] = i;
        const got = fastToByteArray(fastFromByteArray(allBytes));
        ok(
          JSON.stringify(Array.from(got)) ===
            JSON.stringify(Array.from(allBytes)),
          'roundtrip mismatch'
        );
      }
    ),

    test(
      'v8-toByteArray-throws-invalid',
      'v8: toByteArray("not!base64") throws',
      () => {
        let threw = false;
        try {
          fastToByteArray('not!base64');
        } catch {
          threw = true;
        }
        ok(threw, 'toByteArray("not!base64") should throw');
      }
    ),

    test(
      'v8-toByteArray-loose-1',
      'v8: toByteArray("YQ") == [97] (loose — no padding accepted)',
      () => {
        const got = fastToByteArray('YQ');
        ok(
          JSON.stringify(Array.from(got)) === '[97]',
          `got ${JSON.stringify(Array.from(got))}`
        );
      }
    ),

    test(
      'v8-toByteArray-loose-2',
      'v8: toByteArray("YWI") == [97,98] (loose)',
      () => {
        const got = fastToByteArray('YWI');
        ok(
          JSON.stringify(Array.from(got)) === '[97,98]',
          `got ${JSON.stringify(Array.from(got))}`
        );
      }
    ),
  ];
}
