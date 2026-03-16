// base64-js compat API tests — RFC 4648 §10 vectors
import FastBase64, {
  fromByteArray as fastFromByteArray,
  toByteArray as fastToByteArray,
  byteLength as fastByteLength,
} from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test } from '../../../shared';

const RFC4648: [Uint8Array, string][] = [
  [new Uint8Array([]), ''],
  [new Uint8Array([102]), 'Zg=='],
  [new Uint8Array([102, 111]), 'Zm8='],
  [new Uint8Array([102, 111, 111]), 'Zm9v'],
  [new Uint8Array([102, 111, 111, 98]), 'Zm9vYg=='],
  [new Uint8Array([102, 111, 111, 98, 97]), 'Zm9vYmE='],
  [new Uint8Array([102, 111, 111, 98, 97, 114]), 'Zm9vYmFy'],
];

export function run(): TestResult[] {
  return [
    test(
      'b64js-convert-fromByteArray-vectors',
      'fromByteArray — RFC 4648 vectors',
      () => {
        for (const [bytes, encoded] of RFC4648) {
          ok(
            fastFromByteArray(bytes) === encoded,
            `fromByteArray(${JSON.stringify(
              Array.from(bytes)
            )}) = ${fastFromByteArray(bytes)}, expected ${encoded}`
          );
        }
      }
    ),

    test(
      'b64js-convert-toByteArray-vectors',
      'toByteArray — RFC 4648 vectors',
      () => {
        for (const [bytes, encoded] of RFC4648) {
          const got = fastToByteArray(encoded);
          ok(
            got instanceof Uint8Array,
            `toByteArray(${encoded}) is not Uint8Array`
          );
          ok(
            JSON.stringify(Array.from(got)) ===
              JSON.stringify(Array.from(bytes)),
            `toByteArray(${encoded}) = ${JSON.stringify(
              Array.from(got)
            )}, expected ${JSON.stringify(Array.from(bytes))}`
          );
        }
      }
    ),

    test(
      'b64js-convert-byteLength-vectors',
      'byteLength — RFC 4648 vectors',
      () => {
        const cases: [string, number][] = [
          ['', 0],
          ['Zg==', 1],
          ['Zm8=', 2],
          ['Zm9v', 3],
          ['Zm9vYg==', 4],
          ['Zm9vYmE=', 5],
          ['Zm9vYmFy', 6],
        ];
        for (const [encoded, expectedLength] of cases) {
          ok(
            fastByteLength(encoded) === expectedLength,
            `byteLength(${encoded}) = ${fastByteLength(
              encoded
            )}, expected ${expectedLength}`
          );
        }
      }
    ),

    test(
      'b64js-convert-fromByteArray-slice',
      'fromByteArray — slice (byteOffset > 0)',
      () => {
        const slice = new Uint8Array([0, 102, 111, 111, 0]).subarray(1, 4);
        ok(
          fastFromByteArray(slice) === 'Zm9v',
          `got ${fastFromByteArray(slice)}`
        );
      }
    ),

    test(
      'b64js-convert-fromByteArray-padding',
      'fromByteArray — padding',
      () => {
        ok(
          fastFromByteArray(new Uint8Array([102])).endsWith('=='),
          '1 byte → =='
        );
        ok(
          fastFromByteArray(new Uint8Array([102, 111])).endsWith('='),
          '2 bytes → ='
        );
        ok(
          !fastFromByteArray(new Uint8Array([102, 111, 111])).includes('='),
          '3 bytes → no pad'
        );
      }
    ),

    test(
      'b64js-convert-fromByteArray-matches-toBase64',
      'fromByteArray matches toBase64 native',
      () => {
        const input = new Uint8Array([1, 2, 3, 200, 255, 0]);
        const fromByteArrayResult = fastFromByteArray(input);
        const toBase64Result = FastBase64.toBase64(
          input.buffer as unknown as Object
        ) as string;
        ok(
          fromByteArrayResult === toBase64Result,
          `fromByteArray=${fromByteArrayResult} toBase64=${toBase64Result}`
        );
      }
    ),

    test(
      'b64js-convert-toByteArray-roundtrip',
      'toByteArray roundtrip with fromByteArray',
      () => {
        const input = new Uint8Array([1, 2, 3, 200, 255, 0]);
        const got = fastToByteArray(fastFromByteArray(input));
        ok(
          JSON.stringify(Array.from(got)) === JSON.stringify(Array.from(input)),
          'roundtrip mismatch'
        );
      }
    ),
  ];
}
