#pragma once

#include <jsi/jsi.h>
#include <string>

#include "../v8/Base64.h"

// Latin-1 ↔ UTF-8 conversion for btoa & atob.
// btoa & atob are host environment APIs, not V8 APIs:
//   https://html.spec.whatwg.org/multipage/webappapis.html#dom-btoa

namespace rnbase64 {

/**
 * Converts a UTF-8 string to Latin-1.
 * Throws `Base64Error(InvalidCharacter)` if any code point exceeds U+00FF.
 */
inline std::string utf8ToLatin1(const std::string& utf8) {
  std::string latin1;
  latin1.reserve(utf8.size());

  for (size_t i = 0; i < utf8.size();) {
    const auto c = static_cast<unsigned char>(utf8[i]);

    if (c < 0x80) {
      // U+0000–U+007F: single byte, value == code point.
      latin1.push_back(static_cast<char>(c));
      ++i;
    } else if ((c & 0xE0) == 0xC0 && i + 1 < utf8.size()) {
      // U+0080–U+07FF: 2-byte UTF-8 sequence.
      const uint32_t cp =
          ((c & 0x1F) << 6) |
          (static_cast<unsigned char>(utf8[i + 1]) & 0x3F);
      if (cp > 0xFF) {
        throw v8base64::Base64Error(
            v8base64::Base64ErrorKind::InvalidCharacter,
            "InvalidCharacterError: code point out of Latin-1 range (> U+00FF)");
      }
      latin1.push_back(static_cast<char>(static_cast<uint8_t>(cp)));
      i += 2;
    } else {
      // U+0800+: 3- or 4-byte UTF-8 — always > U+00FF.
      throw v8base64::Base64Error(
          v8base64::Base64ErrorKind::InvalidCharacter,
          "InvalidCharacterError: code point out of Latin-1 range (> U+00FF)");
    }
  }

  return latin1;
}

/**
 * Converts a Latin-1 byte string to UTF-8.
 * Bytes 0x80–0xFF are re-encoded as 2-byte UTF-8 sequences.
 */
inline std::string latin1ToUtf8(const std::string& latin1) {
  std::string utf8;
  utf8.reserve(latin1.size() * 2); // worst case: every byte >= 0x80

  for (const auto c : latin1) {
    const auto byte = static_cast<unsigned char>(c);
    if (byte < 0x80) {
      utf8.push_back(static_cast<char>(byte));
    } else {
      // 2-byte UTF-8: 110xxxxx 10xxxxxx
      utf8.push_back(static_cast<char>(0xC0 | (byte >> 6)));
      utf8.push_back(static_cast<char>(0x80 | (byte & 0x3F)));
    }
  }

  return utf8;
}

/** Converts a JSI string to Latin-1. Delegates to `utf8ToLatin1`. */
inline std::string jsiStringToLatin1(facebook::jsi::Runtime& rt,
                                     const facebook::jsi::String& jsiStr) {
  return utf8ToLatin1(jsiStr.utf8(rt));
}

/** Converts a Latin-1 byte string to a JSI string. Delegates to `latin1ToUtf8`. */
inline facebook::jsi::String latin1ToJsiString(facebook::jsi::Runtime& rt,
                                               const std::string& latin1) {
  return facebook::jsi::String::createFromUtf8(rt, latin1ToUtf8(latin1));
}

} // namespace rnbase64
