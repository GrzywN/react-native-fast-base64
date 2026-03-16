import * as Base64JS from 'base64-js';
import { fromByteArray as fastFromByteArray } from 'react-native-fast-base64';
import { runGroup, type Group } from '../helpers';
import { uint8ToLatin1 } from '../converters';
import { prepareInputs } from '../inputs';

export function bufEncodeGroup(
  inputs: ReturnType<typeof prepareInputs>
): Group {
  return runGroup(
    'buf-encode',
    'Buffer → base64',
    'encode image / binary data',
    [
      {
        lib: 'Hermes (btoa)',
        run: (sizeIndex) =>
          global.btoa(uint8ToLatin1(inputs[sizeIndex]!.uint8)),
      },
      {
        lib: 'base64-js',
        run: (sizeIndex) => Base64JS.fromByteArray(inputs[sizeIndex]!.uint8),
      },
      {
        lib: 'fast-base64',
        run: (sizeIndex) => fastFromByteArray(inputs[sizeIndex]!.uint8),
      },
    ]
  );
}
