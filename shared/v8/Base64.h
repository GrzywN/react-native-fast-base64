#pragma once
#include <cstdint>
#include <stdexcept>
#include <string>
#include <vector>

namespace v8base64 {

// Error kinds mirror V8's ToMessageTemplate() mapping
// (src/builtins/builtins-typed-array.cc lines 492–503).
enum class Base64ErrorKind {
  InvalidCharacter, // INVALID_BASE64_CHARACTER → kInvalidBase64Character
  InputRemainder,   // BASE64_INPUT_REMAINDER   → kBase64InputRemainder
  ExtraBits,        // BASE64_EXTRA_BITS         → kBase64ExtraBits
};

// Thrown for all invalid-input conditions.
// Message is prefixed with "InvalidCharacterError" to match Web API DOMException.
struct Base64Error : std::runtime_error {
  Base64ErrorKind kind;
  Base64Error(Base64ErrorKind k, const char* msg)
      : std::runtime_error(msg), kind(k) {}
};

// ── Standard base64 (RFC 4648 §4) — alphabet +/, padding = ──────────────
std::string btoa(const std::string& latin1);                  // Latin-1 bytes → base64
std::string atob(const std::string& base64);                  // base64 → Latin-1 bytes
std::string fromByteArray(const std::vector<uint8_t>& bytes); // bytes → base64
std::vector<uint8_t> toByteArray(const std::string& base64);  // base64 → bytes

// ── Base64url (RFC 4648 §5) — alphabet -_, no padding ───────────────────
std::string btoaURL(const std::string& latin1);
std::string atobURL(const std::string& base64url);
std::string fromByteArrayURL(const std::vector<uint8_t>& bytes);
std::vector<uint8_t> toByteArrayURL(const std::string& base64url);

// ── Zero-copy variants for JSI ArrayBuffer access ────────────────────────
// The JSI bridge passes ArrayBuffer::data(rt) / ArrayBuffer::size(rt)
// directly, avoiding an intermediate std::vector allocation.
std::string fromByteArrayRaw(const uint8_t* data, size_t len);
std::string fromByteArrayURLRaw(const uint8_t* data, size_t len);

} // namespace v8base64
