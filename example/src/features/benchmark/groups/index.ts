import type { Group } from '../helpers';
import { prepareInputs } from '../inputs';
import { bufEncodeGroup } from './buf-encode';
import { bufDecodeGroup } from './buf-decode';
import { btoaGroup } from './btoa';
import { atobGroup } from './atob';
import { bufEncodeUrlGroup } from './buf-encode-url';
import { bufDecodeUrlGroup } from './buf-decode-url';
import { byteLengthGroup } from './byte-length';

export function runAllBenchmarks(): Group[] {
  const inputs = prepareInputs();

  return [
    bufEncodeGroup(inputs),
    bufDecodeGroup(inputs),
    btoaGroup(inputs),
    atobGroup(inputs),
    bufEncodeUrlGroup(inputs),
    bufDecodeUrlGroup(inputs),
    byteLengthGroup(inputs),
  ];
}
