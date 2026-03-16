import FastBase64 from 'react-native-fast-base64';
import { runGroup, type Group } from '../helpers';
import { prepareInputs } from '../inputs';

export function atobGroup(inputs: ReturnType<typeof prepareInputs>): Group {
  return runGroup('atob', 'atob', 'base64 → string', [
    {
      lib: 'Hermes global',
      run: (sizeIndex) => global.atob(inputs[sizeIndex]!.asciiBase64),
    },
    {
      lib: 'fast-base64',
      run: (sizeIndex) => FastBase64.atob(inputs[sizeIndex]!.asciiBase64),
    },
  ]);
}
