import * as Base64JS from 'base64-js';
import * as QuickBase64 from 'react-native-quick-base64';
import { byteLength as fastByteLength } from 'react-native-fast-base64';
import { runGroup, type Group } from '../helpers';
import { prepareInputs } from '../inputs';

export function byteLengthGroup(
  inputs: ReturnType<typeof prepareInputs>
): Group {
  return runGroup(
    'byteLength',
    'byteLength',
    'decoded byte count (no allocation)',
    [
      {
        lib: 'base64-js',
        run: (sizeIndex) => Base64JS.byteLength(inputs[sizeIndex]!.base64),
      },
      {
        lib: 'quick-base64',
        run: (sizeIndex) => QuickBase64.byteLength(inputs[sizeIndex]!.base64),
      },
      {
        lib: 'fast-base64',
        run: (sizeIndex) => fastByteLength(inputs[sizeIndex]!.base64),
      },
    ]
  );
}
