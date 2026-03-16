import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Web API — https://developer.mozilla.org/en-US/docs/Web/API/btoa

  /** Encodes a Latin-1 string to base64. Throws `InvalidCharacterError` if any code point exceeds U+00FF. */
  btoa(data: string): string;

  /** Decodes a base64 string. Throws `InvalidCharacterError` on invalid input or missing padding. */
  atob(data: string): string;

  // TC39 ArrayBuffer API — https://tc39.es/proposal-arraybuffer-base64/
  // ArrayBuffer is typed as Object for codegen compatibility;
  // the native bridge validates & casts to ArrayBuffer at runtime.

  /** Encodes an ArrayBuffer to a base64 string. */
  toBase64(bytes: Object): string;

  /** Decodes a base64 string to an ArrayBuffer. Accepts padded & unpadded input. */
  fromBase64(base64: string): Object;

  /** Encodes an ArrayBuffer to a base64url string (RFC 4648 §5, no padding). */
  toBase64URL(bytes: Object): string;

  /** Decodes a base64url string to an ArrayBuffer. Accepts padded & unpadded input. */
  fromBase64URL(base64url: string): Object;
}

export default TurboModuleRegistry.getEnforcing<Spec>('FastBase64');
