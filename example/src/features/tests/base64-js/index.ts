import type { TestResult } from '../../../shared';
import { run as runConvert } from './convert';
import { run as runBigData } from './big-data';
import { run as runCorrupt } from './corrupt';
import { run as runUrlSafe } from './url-safe';

export function run(): TestResult[] {
  return [...runConvert(), ...runBigData(), ...runCorrupt(), ...runUrlSafe()];
}
