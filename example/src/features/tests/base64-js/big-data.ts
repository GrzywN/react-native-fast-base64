// Large buffer tests for base64-js compat API
import FastBase64, {
  fromByteArray as fastFromByteArray,
  toByteArray as fastToByteArray,
} from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test, makeBytes } from '../../../shared';

export function run(): TestResult[] {
  return [
    test(
      'b64js-bigdata-1kb-roundtrip',
      '1 KB buffer: fromByteArray roundtrip via toByteArray',
      () => {
        const bytes = makeBytes(1024);
        const encoded = fastFromByteArray(bytes);
        const decoded = fastToByteArray(encoded);
        ok(
          JSON.stringify(Array.from(decoded)) ===
            JSON.stringify(Array.from(bytes)),
          '1 KB roundtrip mismatch'
        );
      }
    ),

    test('b64js-bigdata-100kb-roundtrip', '100 KB buffer: roundtrip', () => {
      const bytes = makeBytes(102400);
      const encoded = fastFromByteArray(bytes);
      const decoded = fastToByteArray(encoded);
      ok(
        JSON.stringify(Array.from(decoded)) ===
          JSON.stringify(Array.from(bytes)),
        '100 KB roundtrip mismatch'
      );
    }),

    test(
      'b64js-bigdata-1kb-matches-native',
      '1 KB: fromByteArray output matches FastBase64.toBase64',
      () => {
        const bytes = makeBytes(1024);
        const fromByteArrayResult = fastFromByteArray(bytes);
        const toBase64Result = FastBase64.toBase64(
          bytes.buffer as unknown as Object
        ) as string;
        ok(
          fromByteArrayResult === toBase64Result,
          'fromByteArray does not match toBase64 for 1 KB'
        );
      }
    ),

    test(
      'b64js-bigdata-instanceof',
      'toByteArray result instanceof Uint8Array for large input',
      () => {
        const bytes = makeBytes(1024);
        const encoded = fastFromByteArray(bytes);
        const decoded = fastToByteArray(encoded);
        ok(decoded instanceof Uint8Array, 'result is not Uint8Array');
      }
    ),
  ];
}
