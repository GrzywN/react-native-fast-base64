// Base64.cpp — simdutf-backed base64 implementation.
//
// Algorithm and simdutf API mirrored from V8:
//   src/builtins/builtins-typed-array.cc  (lines 371–882)
//   src/inspector/string-util.cc           (lines 19–99)
//
// simdutf is compiled separately via vendor/simdutf.cpp which defines
// SIMDUTF_IMPLEMENTATION. This file only includes the header for declarations.

#include "vendor/simdutf.h"

#include "Base64.h"

namespace v8base64 {

// ── Internal helpers ──────────────────────────────────────────────────────

// Encode raw bytes → base64 string.
// Mirrors V8's ArrayBufferFromBase64 / binary_to_base64 call pattern.
static std::string encode(const char* data, size_t len,
                           simdutf::base64_options opts) {
  size_t out_len = simdutf::base64_length_from_binary(len, opts);
  std::string result(out_len, '\0');
  simdutf::binary_to_base64(data, len, result.data(), opts);
  return result;
}

// Mirrors V8's ToMessageTemplate() (builtins-typed-array.cc lines 492–503):
//   INVALID_BASE64_CHARACTER → kInvalidBase64Character
//   BASE64_INPUT_REMAINDER   → kBase64InputRemainder
//   BASE64_EXTRA_BITS        → kBase64ExtraBits
static Base64Error mapError(simdutf::error_code error) {
  switch (error) {
    case simdutf::error_code::INVALID_BASE64_CHARACTER:
      return {Base64ErrorKind::InvalidCharacter,
              "Invalid character in base64 string"};
    case simdutf::error_code::BASE64_INPUT_REMAINDER:
      return {Base64ErrorKind::InputRemainder,
              "Base64 input has incomplete last chunk"};
    case simdutf::error_code::BASE64_EXTRA_BITS:
      return {Base64ErrorKind::ExtraBits,
              "Base64 input has extra bits in last chunk"};
    default:
      return {Base64ErrorKind::InvalidCharacter, "Invalid base64 input"};
  }
}

// Decode base64 string → raw bytes.
// V8 ref: builtins-typed-array.cc line 513–516, error mapping lines 492–503.
//
// last_chunk_handling controls padding behaviour:
//   loose  — default in V8's Uint8Array.fromBase64 (HandleOptionsBag line 470:
//             "5. If lastChunkHandling is undefined, set lastChunkHandling to
//             'loose'."); accepts inputs without '=' padding.
//   strict — Web API atob(): throws on missing '=' padding.
//
// decode_up_to_bad_char mirrors V8's ArrayBufferFromBase64 (line 516):
//   /*decode_up_to_bad_char*/ true
static std::vector<uint8_t> decode(
    const char* data, size_t len, simdutf::base64_options opts,
    simdutf::last_chunk_handling_options last_chunk_handling) {
  size_t max_len = simdutf::maximal_binary_length_from_base64(data, len);
  std::vector<uint8_t> buf(max_len);
  size_t out_len = max_len;

  simdutf::result r = simdutf::base64_to_binary_safe(
      data, len, reinterpret_cast<char*>(buf.data()), out_len, opts,
      last_chunk_handling,
      /*decode_up_to_bad_char*/ true);

  if (r.error != simdutf::error_code::SUCCESS)
    throw mapError(r.error);

  buf.resize(out_len);
  return buf;
}

// ── simdutf option mapping (V8 builtins-typed-array.cc lines 784–831) ────
//   base64_default  = standard alphabet (+/), with = padding
//   base64_url      = URL-safe alphabet (-_), no padding
//
// last_chunk_handling per method:
//   atob / atobURL    → strict  (Web API: missing '=' throws)
//   toByteArray / toByteArrayURL → loose (V8 Uint8Array.fromBase64 default,
//                       HandleOptionsBag line 470: "set lastChunkHandling to
//                       'loose'")

std::string btoa(const std::string& s) {
  return encode(s.data(), s.size(), simdutf::base64_options::base64_default);
}

std::string atob(const std::string& s) {
  auto b = decode(s.data(), s.size(), simdutf::base64_options::base64_default,
                  simdutf::last_chunk_handling_options::strict);
  return std::string(reinterpret_cast<char*>(b.data()), b.size());
}

std::string fromByteArray(const std::vector<uint8_t>& v) {
  return encode(reinterpret_cast<const char*>(v.data()), v.size(),
                simdutf::base64_options::base64_default);
}

std::vector<uint8_t> toByteArray(const std::string& s) {
  // 5. If lastChunkHandling is undefined, set lastChunkHandling to "loose".
  return decode(s.data(), s.size(), simdutf::base64_options::base64_default,
                simdutf::last_chunk_handling_options::loose);
}

std::string btoaURL(const std::string& s) {
  return encode(s.data(), s.size(), simdutf::base64_options::base64_url);
}

std::string atobURL(const std::string& s) {
  auto b = decode(s.data(), s.size(), simdutf::base64_options::base64_url,
                  simdutf::last_chunk_handling_options::strict);
  return std::string(reinterpret_cast<char*>(b.data()), b.size());
}

std::string fromByteArrayURL(const std::vector<uint8_t>& v) {
  return encode(reinterpret_cast<const char*>(v.data()), v.size(),
                simdutf::base64_options::base64_url);
}

std::vector<uint8_t> toByteArrayURL(const std::string& s) {
  // 5. If lastChunkHandling is undefined, set lastChunkHandling to "loose".
  return decode(s.data(), s.size(), simdutf::base64_options::base64_url,
                simdutf::last_chunk_handling_options::loose);
}

std::string fromByteArrayRaw(const uint8_t* data, size_t len) {
  return encode(reinterpret_cast<const char*>(data), len,
                simdutf::base64_options::base64_default);
}

std::string fromByteArrayURLRaw(const uint8_t* data, size_t len) {
  return encode(reinterpret_cast<const char*>(data), len,
                simdutf::base64_options::base64_url);
}

} // namespace v8base64
