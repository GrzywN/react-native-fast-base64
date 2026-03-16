import * as Base64JS from 'base64-js';
import FastBase64 from 'react-native-fast-base64';
import { SIZES } from './helpers';
import { makeBytes, makeAsciiString } from '../../shared';

export function prepareInputs() {
  return SIZES.map((size) => {
    const uint8 = makeBytes(size.bytes);
    const base64 = Base64JS.fromByteArray(uint8);
    const base64Url = FastBase64.toBase64URL(
      uint8.buffer as unknown as Object
    ) as string;
    const asciiString = makeAsciiString(size.bytes);
    const asciiBase64 = global.btoa(asciiString);

    return { uint8, base64, base64Url, asciiString, asciiBase64 };
  });
}
