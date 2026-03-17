import * as QuickBase64 from 'react-native-quick-base64';
import FastBase64 from 'react-native-fast-base64';
import { runGroup, type Group } from '../helpers';
import { prepareInputs } from '../inputs';

export function btoaGroup(inputs: ReturnType<typeof prepareInputs>): Group {
  return runGroup('btoa', 'btoa', 'string → base64', [
    {
      lib: 'Hermes global',
      run: (sizeIndex) => global.btoa(inputs[sizeIndex]!.asciiString),
    },
    {
      lib: 'quick-base64',
      run: (sizeIndex) => QuickBase64.btoa(inputs[sizeIndex]!.asciiString),
    },
    {
      lib: 'fast-base64',
      run: (sizeIndex) => FastBase64.btoa(inputs[sizeIndex]!.asciiString),
    },
  ]);
}
