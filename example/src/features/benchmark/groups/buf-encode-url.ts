import * as Base64JS from 'base64-js';
import * as QuickBase64 from 'react-native-quick-base64';
import FastBase64 from 'react-native-fast-base64';
import { runGroup, type Group } from '../helpers';
import { uint8ToLatin1, b64ToUrl } from '../converters';
import { prepareInputs } from '../inputs';

export function bufEncodeUrlGroup(
  inputs: ReturnType<typeof prepareInputs>
): Group {
  return runGroup(
    'buf-encode-url',
    'Buffer → base64url',
    'URL-safe encode (no padding)',
    [
      {
        lib: 'Hermes (replace)',
        run: (sizeIndex) =>
          b64ToUrl(global.btoa(uint8ToLatin1(inputs[sizeIndex]!.uint8))),
      },
      {
        lib: 'base64-js (replace)',
        run: (sizeIndex) =>
          b64ToUrl(Base64JS.fromByteArray(inputs[sizeIndex]!.uint8)),
      },
      {
        lib: 'quick-base64',
        run: (sizeIndex) =>
          QuickBase64.fromByteArray(inputs[sizeIndex]!.uint8, true),
      },
      {
        lib: 'fast-base64',
        run: (sizeIndex) =>
          FastBase64.toBase64URL(
            inputs[sizeIndex]!.uint8.buffer as unknown as Object
          ),
      },
    ]
  );
}
