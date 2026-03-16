#include "Base64.h"

#include "custom/Latin1.h"
#include "v8/Base64.h"

#include <jsi/jsi.h>

namespace facebook::react {

namespace jsi = facebook::jsi;

FastBase64Module::FastBase64Module(std::shared_ptr<CallInvoker> jsInvoker)
    : NativeFastBase64CxxSpec<FastBase64Module>(std::move(jsInvoker)) {}

[[noreturn]] static void rethrowAsJSError(jsi::Runtime& rt,
                                          const v8base64::Base64Error& e) {
  throw jsi::JSError(rt, e.what());
}

std::string FastBase64Module::btoa(jsi::Runtime& rt, std::string data) {
  // JSI strings are UTF-8; convert to Latin-1 before encoding.
  try {
    return v8base64::btoa(rnbase64::utf8ToLatin1(data));
  } catch (const v8base64::Base64Error& e) {
    rethrowAsJSError(rt, e);
  }
}

std::string FastBase64Module::atob(jsi::Runtime& rt, std::string data) {
  // Decode base64 → Latin-1, then re-encode to UTF-8 for a valid std::string.
  try {
    return rnbase64::latin1ToUtf8(v8base64::atob(data));
  } catch (const v8base64::Base64Error& e) {
    rethrowAsJSError(rt, e);
  }
}

// The codegen spec types ArrayBuffer args as jsi::Object — validate here.
static std::pair<const uint8_t*, size_t> arrayBufferView(jsi::Runtime& rt,
                                                          jsi::Object& obj) {
  if (!obj.isArrayBuffer(rt)) {
    throw jsi::JSError(rt, "TypeError: expected ArrayBuffer");
  }
  auto buf = obj.getArrayBuffer(rt);
  return {buf.data(rt), buf.size(rt)};
}

// Owns the decoded byte vector. The JSI runtime holds this alive via shared_ptr
// for the lifetime of the JS ArrayBuffer, providing zero-copy access.
class VectorBuffer final : public jsi::MutableBuffer {
public:
  explicit VectorBuffer(std::vector<uint8_t> v) noexcept
      : data_(std::move(v)) {}
  size_t size() const override { return data_.size(); }
  uint8_t* data() override { return data_.data(); }

private:
  std::vector<uint8_t> data_;
};

static jsi::Object makeArrayBuffer(jsi::Runtime& rt,
                                   std::vector<uint8_t> bytes) {
  return jsi::ArrayBuffer(rt, std::make_shared<VectorBuffer>(std::move(bytes)));
}

std::string FastBase64Module::toBase64(jsi::Runtime& rt, jsi::Object bytes) {
  auto [data, size] = arrayBufferView(rt, bytes);
  return v8base64::fromByteArrayRaw(data, size);
}

jsi::Object FastBase64Module::fromBase64(jsi::Runtime& rt,
                                          std::string base64) {
  try {
    std::vector<uint8_t> bytes = v8base64::toByteArray(base64);
    return makeArrayBuffer(rt, std::move(bytes));
  } catch (const v8base64::Base64Error& e) {
    rethrowAsJSError(rt, e);
  }
}

std::string FastBase64Module::toBase64URL(jsi::Runtime& rt, jsi::Object bytes) {
  auto [data, size] = arrayBufferView(rt, bytes);
  return v8base64::fromByteArrayURLRaw(data, size);
}

jsi::Object FastBase64Module::fromBase64URL(jsi::Runtime& rt,
                                             std::string base64url) {
  try {
    std::vector<uint8_t> bytes = v8base64::toByteArrayURL(base64url);
    return makeArrayBuffer(rt, std::move(bytes));
  } catch (const v8base64::Base64Error& e) {
    rethrowAsJSError(rt, e);
  }
}

} // namespace facebook::react
