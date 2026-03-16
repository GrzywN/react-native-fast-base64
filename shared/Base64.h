#pragma once

// Vendored codegen spec — update when NativeFastBase64.ts changes & codegen re-runs.
#include "codegen/FastBase64SpecJSI.h"

#include <jsi/jsi.h>
#include <memory>
#include <string>

namespace facebook::react {

class JSI_EXPORT FastBase64Module
    : public NativeFastBase64CxxSpec<FastBase64Module> {
public:
  explicit FastBase64Module(std::shared_ptr<CallInvoker> jsInvoker);

  // Web API — https://developer.mozilla.org/en-US/docs/Web/API/btoa

  /** Encodes a Latin-1 string to base64. Throws `InvalidCharacterError` if any code point exceeds U+00FF. */
  std::string btoa(jsi::Runtime& rt, std::string data);

  /** Decodes a base64 string. Throws `InvalidCharacterError` on invalid input or missing padding. */
  std::string atob(jsi::Runtime& rt, std::string data);

  // TC39 ArrayBuffer API — https://tc39.es/proposal-arraybuffer-base64/

  /** Encodes an ArrayBuffer to a base64 string. */
  std::string toBase64(jsi::Runtime& rt, jsi::Object bytes);

  /** Decodes a base64 string to an ArrayBuffer. Accepts padded & unpadded input. */
  jsi::Object fromBase64(jsi::Runtime& rt, std::string base64);

  /** Encodes an ArrayBuffer to a base64url string (RFC 4648 §5, no padding). */
  std::string toBase64URL(jsi::Runtime& rt, jsi::Object bytes);

  /** Decodes a base64url string to an ArrayBuffer. Accepts padded & unpadded input. */
  jsi::Object fromBase64URL(jsi::Runtime& rt, std::string base64url);
};

} // namespace facebook::react
