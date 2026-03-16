// Tests for FastBase64.atob — TC39-style
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
    test('tc39-atob-rfc-vectors', 'atob — RFC 4648 vectors reversed', () => {
      for (const [bytes, encoded] of RFC4648) {
        const expected = String.fromCharCode(...bytes);
        ok(
          FastBase64.atob(encoded) === expected,
          `atob(${encoded}) = ${JSON.stringify(
            FastBase64.atob(encoded)
          )}, expected ${JSON.stringify(expected)}`
        );
      }
    }),

    test('tc39-atob-latin1-ff', "atob — Latin-1: '/w==' → '\\xFF'", () => {
      ok(
        FastBase64.atob('/w==') === '\xFF',
        `got ${JSON.stringify(FastBase64.atob('/w=='))}`
      );
    }),

    test('tc39-atob-latin1-c0', "atob — Latin-1: 'wA==' → '\\xC0'", () => {
      ok(
        FastBase64.atob('wA==') === '\xC0',
        `got ${JSON.stringify(FastBase64.atob('wA=='))}`
      );
    }),

    test(
      'tc39-atob-roundtrip',
      "atob(btoa(s)) roundtrip for 'Hello, \\xFF World!'",
      () => {
        const input = 'Hello, \xFF World!';
        ok(
          FastBase64.atob(FastBase64.btoa(input)) === input,
          'roundtrip mismatch'
        );
      }
    ),

    test(
      'tc39-atob-throws-pad-1',
      "atob — throws for 'Zg=' (missing padding)",
      () => {
        let threw = false;
        try {
          FastBase64.atob('Zg=');
        } catch {
          threw = true;
        }
        ok(threw, "'Zg=' should throw");
      }
    ),

    test(
      'tc39-atob-throws-pad-2',
      "atob — throws for 'Zg===' (excess padding)",
      () => {
        let threw = false;
        try {
          FastBase64.atob('Zg===');
        } catch {
          threw = true;
        }
        ok(threw, "'Zg===' should throw");
      }
    ),

    test(
      'tc39-atob-throws-invalid-1',
      "atob — throws for 'Y$==' (invalid char)",
      () => {
        let threw = false;
        try {
          FastBase64.atob('Y$==');
        } catch {
          threw = true;
        }
        ok(threw, "'Y$==' should throw");
      }
    ),

    test(
      'tc39-atob-throws-invalid-2',
      "atob — throws for 'Z!9v' (invalid char)",
      () => {
        let threw = false;
        try {
          FastBase64.atob('Z!9v');
        } catch {
          threw = true;
        }
        ok(threw, "'Z!9v' should throw");
      }
    ),
  ];
}
