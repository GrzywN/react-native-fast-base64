// Port of test_btoa_atob() from shared/v8/tests/Base64Test.cpp
import FastBase64 from 'react-native-fast-base64';
import type { TestResult } from '../../../shared';
import { ok, test } from '../../../shared';

export function run(): TestResult[] {
  return [
    test('v8-btoa-empty', 'v8: btoa("") == ""', () => {
      ok(FastBase64.btoa('') === '', 'btoa("") should be ""');
    }),

    test('v8-atob-empty', 'v8: atob("") == ""', () => {
      ok(FastBase64.atob('') === '', 'atob("") should be ""');
    }),

    test('v8-btoa-a', 'v8: btoa("a") == "YQ=="', () => {
      ok(FastBase64.btoa('a') === 'YQ==', `got ${FastBase64.btoa('a')}`);
    }),

    test('v8-atob-YQ', 'v8: atob("YQ==") == "a"', () => {
      ok(FastBase64.atob('YQ==') === 'a', `got ${FastBase64.atob('YQ==')}`);
    }),

    test('v8-btoa-ab', 'v8: btoa("ab") == "YWI="', () => {
      ok(FastBase64.btoa('ab') === 'YWI=', `got ${FastBase64.btoa('ab')}`);
    }),

    test('v8-atob-YWI', 'v8: atob("YWI=") == "ab"', () => {
      ok(FastBase64.atob('YWI=') === 'ab', `got ${FastBase64.atob('YWI=')}`);
    }),

    test('v8-btoa-abc', 'v8: btoa("abc") == "YWJj"', () => {
      ok(FastBase64.btoa('abc') === 'YWJj', `got ${FastBase64.btoa('abc')}`);
    }),

    test('v8-atob-YWJj', 'v8: atob("YWJj") == "abc"', () => {
      ok(FastBase64.atob('YWJj') === 'abc', `got ${FastBase64.atob('YWJj')}`);
    }),

    test('v8-btoa-foobar', 'v8: btoa("foobar") == "Zm9vYmFy"', () => {
      ok(
        FastBase64.btoa('foobar') === 'Zm9vYmFy',
        `got ${FastBase64.btoa('foobar')}`
      );
    }),

    test('v8-atob-foobar', 'v8: atob("Zm9vYmFy") == "foobar"', () => {
      ok(
        FastBase64.atob('Zm9vYmFy') === 'foobar',
        `got ${FastBase64.atob('Zm9vYmFy')}`
      );
    }),

    test(
      'v8-btoa-atob-latin1-hi',
      'v8: btoa/atob latin1 high bytes roundtrip',
      () => {
        const latin1Hi = '\x80\xFF';
        const encoded = FastBase64.btoa(latin1Hi);
        ok(
          FastBase64.atob(encoded) === latin1Hi,
          'latin1 high bytes roundtrip failed'
        );
      }
    ),

    test(
      'v8-btoa-atob-all-latin1',
      'v8: btoa/atob all 256 latin1 bytes roundtrip',
      () => {
        let allBytes = '';
        for (let i = 0; i <= 0xff; i++) allBytes += String.fromCharCode(i);
        ok(
          FastBase64.atob(FastBase64.btoa(allBytes)) === allBytes,
          'all latin1 bytes roundtrip failed'
        );
      }
    ),

    test(
      'v8-atob-throws-missing-pad-1',
      'v8: atob("YQ") throws (missing padding)',
      () => {
        let threw = false;
        try {
          FastBase64.atob('YQ');
        } catch {
          threw = true;
        }
        ok(threw, 'atob("YQ") should throw');
      }
    ),

    test(
      'v8-atob-throws-missing-pad-2',
      'v8: atob("YWI") throws (missing padding)',
      () => {
        let threw = false;
        try {
          FastBase64.atob('YWI');
        } catch {
          threw = true;
        }
        ok(threw, 'atob("YWI") should throw');
      }
    ),

    test(
      'v8-atob-throws-invalid-1',
      'v8: atob("Y$==") throws (invalid char)',
      () => {
        let threw = false;
        try {
          FastBase64.atob('Y$==');
        } catch {
          threw = true;
        }
        ok(threw, 'atob("Y$==") should throw');
      }
    ),

    test(
      'v8-atob-throws-invalid-2',
      'v8: atob("Z!9v") throws (invalid char)',
      () => {
        let threw = false;
        try {
          FastBase64.atob('Z!9v');
        } catch {
          threw = true;
        }
        ok(threw, 'atob("Z!9v") should throw');
      }
    ),
  ];
}
