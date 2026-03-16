cmake_minimum_required(VERSION 3.13)
project(FastBase64)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(SHARED_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../shared")

add_library(
  FastBase64
  SHARED
  ${SHARED_DIR}/Base64.cpp
  ${SHARED_DIR}/v8/Base64.cpp
  ${SHARED_DIR}/v8/vendor/simdutf.cpp
  src/main/jni/OnLoad.cpp
)

target_include_directories(
  FastBase64
  PRIVATE
  ${SHARED_DIR}
  ${SHARED_DIR}/v8/vendor
)

target_compile_options(FastBase64 PRIVATE -O3)

# Folly flags required when compiling against RN prebuilt prefab (no folly-config.h).
# Source: node_modules/react-native/ReactAndroid/cmake-utils/folly-flags.cmake
target_compile_definitions(FastBase64 PRIVATE
  FOLLY_NO_CONFIG=1
  FOLLY_HAVE_CLOCK_GETTIME=1
  FOLLY_USE_LIBCPP=1
  FOLLY_CFG_NO_COROUTINES=1
  FOLLY_MOBILE=1
  FOLLY_HAVE_RECVMMSG=1
  FOLLY_HAVE_PTHREAD=1
  FOLLY_HAVE_XSI_STRERROR_R=1
)

find_package(ReactAndroid REQUIRED CONFIG)
find_package(fbjni REQUIRED CONFIG)

target_link_libraries(
  FastBase64
  ReactAndroid::jsi
  ReactAndroid::reactnative
  fbjni::fbjni
  android
  log
)
