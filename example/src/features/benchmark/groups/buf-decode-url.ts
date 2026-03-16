import * as Base64JS from 'base64-js';
import FastBase64 from 'react-native-fast-base64';
import { runGroup, type Group } from '../helpers';
import { latin1ToUint8, urlToB64 } from '../converters';
import { prepareInputs } from '../inputs';

export function bufDecodeUrlGroup(
  inputs: ReturnType<typeof prepareInputs>
): Group {
  return runGroup('buf-decode-url', 'base64url → Buffer', 'URL-safe decode', [
    {
      lib: 'Hermes (replace)',
      run: (sizeIndex) =>
        latin1ToUint8(global.atob(urlToB64(inputs[sizeIndex]!.base64Url))),
    },
    {
      lib: 'base64-js (replace)',
      run: (sizeIndex) =>
        Base64JS.toByteArray(urlToB64(inputs[sizeIndex]!.base64Url)),
    },
    {
      lib: 'fast-base64',
      run: (sizeIndex) =>
        new Uint8Array(
          FastBase64.fromBase64URL(
            inputs[sizeIndex]!.base64Url
          ) as unknown as ArrayBuffer
        ),
    },
  ]);
}
