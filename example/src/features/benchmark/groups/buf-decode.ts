import * as Base64JS from 'base64-js';
import { toByteArray as fastToByteArray } from 'react-native-fast-base64';
import { runGroup, type Group } from '../helpers';
import { latin1ToUint8 } from '../converters';
import { prepareInputs } from '../inputs';

export function bufDecodeGroup(
  inputs: ReturnType<typeof prepareInputs>
): Group {
  return runGroup(
    'buf-decode',
    'base64 → Buffer',
    'decode image / binary data',
    [
      {
        lib: 'Hermes (atob)',
        run: (sizeIndex) =>
          latin1ToUint8(global.atob(inputs[sizeIndex]!.base64)),
      },
      {
        lib: 'base64-js',
        run: (sizeIndex) => Base64JS.toByteArray(inputs[sizeIndex]!.base64),
      },
      {
        lib: 'fast-base64',
        run: (sizeIndex) => fastToByteArray(inputs[sizeIndex]!.base64),
      },
    ]
  );
}
