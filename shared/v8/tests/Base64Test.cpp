// Base64Test.cpp — standalone unit tests for v8base64.
//
// Test vectors sourced from:
//   - V8: test/mjsunit/harmony/ (uint8-array-*-base64, base64-* files)
//   - V8: src/inspector/string-util.cc (Binary::toBase64 / fromBase64)
//
// Compile and run (no external test framework needed):
//   g++ -std=c++17 -I.. tests/Base64Test.cpp ../Base64.cpp vendor/simdutf.cpp \
//       -o base64_test && ./base64_test

#include <cassert>
#include <cstdio>
#include <cstring>
#include <functional>
#include <stdexcept>
#include <vector>

#include "../Base64.h"

using namespace v8base64;

static int g_failures = 0;

static void check(bool cond, const char* msg) {
  if (!cond) {
    fprintf(stderr, "FAIL: %s\n", msg);
    g_failures++;
  }
}

static void assertEqual(const std::string& got, const std::string& expected,
                        const char* msg) {
  if (got != expected) {
    fprintf(stderr, "FAIL [%s]: expected '%s', got '%s'\n", msg,
            expected.c_str(), got.c_str());
    g_failures++;
  }
}

static void assertThrows(std::function<void()> fn, const char* msg) {
  try {
    fn();
    fprintf(stderr, "FAIL [%s]: expected Base64Error but no exception thrown\n",
            msg);
    g_failures++;
  } catch (const Base64Error&) {
    // expected
  }
}

// ── btoa / atob ────────────────────────────────────────────────────────────

static void test_btoa_atob() {
  // Empty string
  assertEqual(btoa(""), "", "btoa empty");
  assertEqual(atob(""), "", "atob empty");

  // Single byte (needs 2 padding chars)
  assertEqual(btoa("a"), "YQ==", "btoa 'a'");
  assertEqual(atob("YQ=="), "a", "atob 'YQ=='");

  // Two bytes (needs 1 padding char)
  assertEqual(btoa("ab"), "YWI=", "btoa 'ab'");
  assertEqual(atob("YWI="), "ab", "atob 'YWI='");

  // Three bytes (no padding needed — exact multiple of 3)
  assertEqual(btoa("abc"), "YWJj", "btoa 'abc'");
  assertEqual(atob("YWJj"), "abc", "atob 'YWJj'");

  // V8 test vector from test/mjsunit/harmony/uint8-array-to-base64-on-shared-array-buffer.js
  // bytes {102,111,111,98,97,114} == "foobar"
  assertEqual(btoa("foobar"), "Zm9vYmFy", "btoa 'foobar'");
  assertEqual(atob("Zm9vYmFy"), "foobar", "atob 'Zm9vYmFy'");

  // Latin-1 high bytes (0x80–0xFF) — V8 inspector Binary::toBase64 handles these
  std::string latin1_hi = "\x80\xFF";
  std::string encoded = btoa(latin1_hi);
  assertEqual(atob(encoded), latin1_hi, "btoa/atob latin1 high bytes round-trip");

  // All Latin-1 bytes round-trip
  std::string all_bytes;
  for (int i = 0; i <= 0xFF; i++)
    all_bytes.push_back((char)(uint8_t)i);
  assertEqual(atob(btoa(all_bytes)), all_bytes, "btoa/atob all latin1 bytes round-trip");

  // atob: strict padding — missing = must throw (Web API behaviour)
  assertThrows([&] { atob("YQ"); }, "atob missing padding throws");
  assertThrows([&] { atob("YWI"); }, "atob one missing padding throws");

  // atob: invalid character must throw
  assertThrows([&] { atob("Y$=="); }, "atob invalid char throws");
  assertThrows([&] { atob("Z!9v"); }, "atob invalid char 2 throws");
}

// ── fromByteArray / toByteArray ────────────────────────────────────────────

static void test_fromToByteArray() {
  // V8 test vector: {102,111,111,98,97,114} == "foobar"
  // Source: test/mjsunit/harmony/uint8-array-to-base64-on-shared-array-buffer.js
  std::vector<uint8_t> foobar = {102, 111, 111, 98, 97, 114};
  assertEqual(fromByteArray(foobar), "Zm9vYmFy", "fromByteArray foobar");
  check(toByteArray("Zm9vYmFy") == foobar, "toByteArray foobar");

  // Empty
  assertEqual(fromByteArray({}), "", "fromByteArray empty");
  check(toByteArray("").empty(), "toByteArray empty");

  // All-zero bytes (exact multiple of 3)
  std::vector<uint8_t> zeros(3, 0);
  assertEqual(fromByteArray(zeros), "AAAA", "fromByteArray zeros");

  // All-max bytes (0xFF, exact multiple of 3)
  std::vector<uint8_t> maxbytes = {255, 255, 255};
  assertEqual(fromByteArray(maxbytes), "////", "fromByteArray 0xFF");

  // Single byte with padding
  check(toByteArray("YQ==") == std::vector<uint8_t>{97}, "toByteArray single byte");

  // Round-trip: use 255 bytes (255 = 85*3, exact multiple of 3 → no padding edge cases)
  std::vector<uint8_t> all_bytes;
  for (int i = 0; i < 255; i++)
    all_bytes.push_back((uint8_t)i);
  check(toByteArray(fromByteArray(all_bytes)) == all_bytes,
        "fromByteArray/toByteArray 255-byte round-trip");

  // Invalid base64 throws
  assertThrows([&] { toByteArray("not!base64"); }, "toByteArray invalid throws");
  // Missing padding is accepted (loose mode — mirrors V8 Uint8Array.fromBase64 default)
  check(toByteArray("YQ") == std::vector<uint8_t>{97},
        "toByteArray loose: no-padding single byte accepted");
  check(toByteArray("YWI") == std::vector<uint8_t>{97, 98},
        "toByteArray loose: no-padding two bytes accepted");
}

// ── btoaURL / atobURL ──────────────────────────────────────────────────────

static void test_btoaURL_atobURL() {
  // "foobar" = 6 bytes (exact multiple of 3) → no padding either way
  assertEqual(btoaURL("foobar"), "Zm9vYmFy", "btoaURL foobar");
  assertEqual(atobURL("Zm9vYmFy"), "foobar", "atobURL foobar");

  // atobURL uses strict mode, so missing '=' padding throws
  assertThrows([&] { atobURL("YQ"); }, "atobURL strict: missing padding throws");

  // Round-trip: inputs must be exact multiples of 3 bytes because btoaURL
  // omits = padding (base64url convention) and atobURL uses strict mode.
  assertEqual(atobURL(btoaURL("abc")), "abc", "btoaURL/atobURL round-trip 3 bytes");
  assertEqual(atobURL(btoaURL("abcdef")), "abcdef",
              "btoaURL/atobURL round-trip 6 bytes");
  assertEqual(atobURL(btoaURL("hello wo!")), "hello wo!",
              "btoaURL/atobURL round-trip 9 bytes");

  // Bytes that produce + or / in standard base64 must produce - or _ in base64url.
  // 0xFB, 0xEF, 0xBE = 3 bytes (multiple of 3 → no padding, clean round-trip)
  std::vector<uint8_t> url_test = {0xFB, 0xEF, 0xBE};
  std::string std_enc = fromByteArray(url_test);
  std::string url_enc = fromByteArrayURL(url_test);

  check(std_enc.find('+') != std::string::npos ||
            std_enc.find('/') != std::string::npos,
        "standard base64 uses + or /");
  check(url_enc.find('+') == std::string::npos &&
            url_enc.find('/') == std::string::npos,
        "base64url avoids + and /");
  check(url_enc.find('-') != std::string::npos ||
            url_enc.find('_') != std::string::npos,
        "base64url uses - or _");

  // Invalid base64url throws
  assertThrows([&] { atobURL("not!base64url"); }, "atobURL invalid throws");
}

// ── fromByteArrayURL / toByteArrayURL ─────────────────────────────────────

static void test_fromToByteArrayURL() {
  std::vector<uint8_t> foobar = {102, 111, 111, 98, 97, 114};
  assertEqual(fromByteArrayURL(foobar), "Zm9vYmFy", "fromByteArrayURL foobar");
  check(toByteArrayURL("Zm9vYmFy") == foobar, "toByteArrayURL foobar");

  // Round-trip for all 256 byte values — toByteArrayURL uses loose mode,
  // so no-padding inputs from fromByteArrayURL are accepted without error.
  std::vector<uint8_t> all_bytes;
  for (int i = 0; i <= 255; i++)
    all_bytes.push_back((uint8_t)i);
  check(toByteArrayURL(fromByteArrayURL(all_bytes)) == all_bytes,
        "fromByteArrayURL/toByteArrayURL all-bytes round-trip (loose)");

  // No '=' padding in URL output regardless of input length
  std::vector<uint8_t> one = {42};
  std::vector<uint8_t> two = {42, 43};
  std::vector<uint8_t> three = {42, 43, 44};
  check(fromByteArrayURL(one).find('=') == std::string::npos,
        "fromByteArrayURL no padding 1 byte");
  check(fromByteArrayURL(two).find('=') == std::string::npos,
        "fromByteArrayURL no padding 2 bytes");
  check(fromByteArrayURL(three).find('=') == std::string::npos,
        "fromByteArrayURL no padding 3 bytes");
  // toByteArrayURL (loose) accepts all of them
  check(toByteArrayURL(fromByteArrayURL(one)) == one,
        "toByteArrayURL loose round-trip 1 byte");
  check(toByteArrayURL(fromByteArrayURL(two)) == two,
        "toByteArrayURL loose round-trip 2 bytes");
  check(toByteArrayURL(fromByteArrayURL(three)) == three,
        "toByteArrayURL loose round-trip 3 bytes");
}

// ── main ───────────────────────────────────────────────────────────────────

int main() {
  test_btoa_atob();
  test_fromToByteArray();
  test_btoaURL_atobURL();
  test_fromToByteArrayURL();

  if (g_failures == 0) {
    printf("All tests passed.\n");
    return 0;
  } else {
    fprintf(stderr, "%d test(s) failed.\n", g_failures);
    return 1;
  }
}
