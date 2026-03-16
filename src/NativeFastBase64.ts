import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Web API — https://developer.mozilla.org/en-US/docs/Web/API/btoa

  /** @throws {InvalidCharacterError} if any code point exceeds U+00FF. */
  btoa(data: string): string;

  /** @throws {InvalidCharacterError} on invalid characters or missing padding. */
  atob(data: string): string;

  // TC39 ArrayBuffer API — https://tc39.es/proposal-arraybuffer-base64/
  // ArrayBuffer is typed as Object for codegen compatibility;
  // the native bridge validates & casts to ArrayBuffer at runtime.

  toBase64(bytes: Object): string;

  /** Accepts padded and unpadded input. */
  fromBase64(base64: string): Object;

  /** RFC 4648 §5 — no padding in output. */
  toBase64URL(bytes: Object): string;

  /** Accepts padded and unpadded input. */
  fromBase64URL(base64url: string): Object;
}

export default TurboModuleRegistry.getEnforcing<Spec>('FastBase64');
