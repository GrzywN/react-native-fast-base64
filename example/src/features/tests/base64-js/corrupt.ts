// Invalid/corrupt input tests for toByteArray
import { toByteArray as fastToByteArray } from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test } from '../../../shared';

export function run(): TestResult[] {
  return [
    test('b64js-corrupt-exclamations', 'toByteArray("!!!") throws', () => {
      let threw = false;
      try {
        fastToByteArray('!!!');
      } catch {
        threw = true;
      }
      ok(threw, 'toByteArray("!!!") should throw');
    }),

    test(
      'b64js-corrupt-dot',
      'toByteArray("Zm.9v") throws (dot is illegal)',
      () => {
        let threw = false;
        try {
          fastToByteArray('Zm.9v');
        } catch {
          threw = true;
        }
        ok(threw, 'toByteArray("Zm.9v") should throw');
      }
    ),

    test('b64js-corrupt-caret', 'toByteArray("Zm9v^") throws', () => {
      let threw = false;
      try {
        fastToByteArray('Zm9v^');
      } catch {
        threw = true;
      }
      ok(threw, 'toByteArray("Zm9v^") should throw');
    }),

    test(
      'b64js-corrupt-unicode-minus',
      'toByteArray with Unicode lookalike U+2212 throws',
      () => {
        // U+2212 MINUS SIGN looks like '-' but is not valid base64
        let threw = false;
        try {
          fastToByteArray('Z\u2212==');
        } catch {
          threw = true;
        }
        ok(threw, 'U+2212 should throw');
      }
    ),
  ];
}
