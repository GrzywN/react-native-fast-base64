// Tests for FastBase64.btoa — TC39-style
import FastBase64 from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test } from '../../../shared';

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
    test(
      'tc39-btoa-rfc-vectors',
      'btoa — RFC 4648 vectors (string form)',
      () => {
        for (const [bytes, encoded] of RFC4648) {
          const str = String.fromCharCode(...bytes);
          ok(
            FastBase64.btoa(str) === encoded,
            `btoa(${JSON.stringify(str)}) = ${FastBase64.btoa(
              str
            )}, expected ${encoded}`
          );
        }
      }
    ),

    test('tc39-btoa-latin1-ff', "btoa — Latin-1: '\\xFF' → '/w=='", () => {
      ok(FastBase64.btoa('\xFF') === '/w==', `got ${FastBase64.btoa('\xFF')}`);
    }),

    test('tc39-btoa-latin1-c0', "btoa — Latin-1: '\\xC0' → 'wA=='", () => {
      ok(FastBase64.btoa('\xC0') === 'wA==', `got ${FastBase64.btoa('\xC0')}`);
    }),

    test('tc39-btoa-throws-u0100', "btoa — throws for '\\u0100'", () => {
      let threw = false;
      try {
        FastBase64.btoa('\u0100');
      } catch {
        threw = true;
      }
      ok(threw, "'\\u0100' should throw");
    }),

    test('tc39-btoa-throws-cjk', "btoa — throws for '世界'", () => {
      let threw = false;
      try {
        FastBase64.btoa('世界');
      } catch {
        threw = true;
      }
      ok(threw, "'世界' should throw");
    }),

    test('tc39-btoa-throws-emoji', "btoa — throws for '😀'", () => {
      let threw = false;
      try {
        FastBase64.btoa('😀');
      } catch {
        threw = true;
      }
      ok(threw, "'😀' should throw");
    }),

    test(
      'tc39-btoa-latin1-roundtrip',
      'btoa — full Latin-1 roundtrip (all 256 chars via atob(btoa(s)))',
      () => {
        let latin1String = '';
        for (let i = 0; i < 256; i++) latin1String += String.fromCharCode(i);
        ok(
          FastBase64.atob(FastBase64.btoa(latin1String)) === latin1String,
          'full Latin-1 roundtrip failed'
        );
      }
    ),
  ];
}
