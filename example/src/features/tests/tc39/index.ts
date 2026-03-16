import type { TestResult } from '../../../shared';
import { run as runBtoa } from './btoa';
import { run as runAtob } from './atob';
import { run as runToBase64 } from './to-base64';
import { run as runFromBase64 } from './from-base64';
import { run as runToBase64URL } from './to-base64-url';
import { run as runFromBase64URL } from './from-base64-url';

export function run(): TestResult[] {
  return [
    ...runBtoa(),
    ...runAtob(),
    ...runToBase64(),
    ...runFromBase64(),
    ...runToBase64URL(),
    ...runFromBase64URL(),
  ];
}
