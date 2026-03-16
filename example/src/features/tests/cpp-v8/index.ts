import type { TestResult } from '../../../shared';
import { run as runBtoaAtob } from './btoa-atob';
import { run as runFromToByteArray } from './from-to-byte-array';
import { run as runBtoaAtobUrl } from './btoa-atob-url';
import { run as runFromToByteArrayUrl } from './from-to-byte-array-url';

export function run(): TestResult[] {
  return [
    ...runBtoaAtob(),
    ...runFromToByteArray(),
    ...runBtoaAtobUrl(),
    ...runFromToByteArrayUrl(),
  ];
}
