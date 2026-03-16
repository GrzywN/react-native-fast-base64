/**
 * Vendored codegen output. Update when NativeFastBase64.ts changes & codegen re-runs.
 * Source: android/build/generated/source/codegen/jni/react/renderer/components/FastBase64Spec/FastBase64SpecJSI.h
 */

#pragma once

#include <ReactCommon/TurboModule.h>
#include <react/bridging/Bridging.h>

namespace facebook::react {

template <typename T>
class JSI_EXPORT NativeFastBase64CxxSpec : public TurboModule {
public:
  static constexpr std::string_view kModuleName = "FastBase64";

protected:
  NativeFastBase64CxxSpec(std::shared_ptr<CallInvoker> jsInvoker)
      : TurboModule(std::string{NativeFastBase64CxxSpec::kModuleName}, jsInvoker) {
    methodMap_["btoa"]         = MethodMetadata{.argCount = 1, .invoker = __btoa};
    methodMap_["atob"]         = MethodMetadata{.argCount = 1, .invoker = __atob};
    methodMap_["toBase64"]     = MethodMetadata{.argCount = 1, .invoker = __toBase64};
    methodMap_["fromBase64"]   = MethodMetadata{.argCount = 1, .invoker = __fromBase64};
    methodMap_["toBase64URL"]  = MethodMetadata{.argCount = 1, .invoker = __toBase64URL};
    methodMap_["fromBase64URL"]= MethodMetadata{.argCount = 1, .invoker = __fromBase64URL};
  }

private:
  static jsi::Value __btoa(jsi::Runtime &rt, TurboModule &turboModule,
                            const jsi::Value *args, size_t count) {
    static_assert(bridging::getParameterCount(&T::btoa) == 2,
                  "Expected btoa(...) to have 2 parameters");
    return bridging::callFromJs<jsi::String>(
        rt, &T::btoa,
        static_cast<NativeFastBase64CxxSpec *>(&turboModule)->jsInvoker_,
        static_cast<T *>(&turboModule),
        count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed")
                   : args[0].asString(rt));
  }

  static jsi::Value __atob(jsi::Runtime &rt, TurboModule &turboModule,
                            const jsi::Value *args, size_t count) {
    static_assert(bridging::getParameterCount(&T::atob) == 2,
                  "Expected atob(...) to have 2 parameters");
    return bridging::callFromJs<jsi::String>(
        rt, &T::atob,
        static_cast<NativeFastBase64CxxSpec *>(&turboModule)->jsInvoker_,
        static_cast<T *>(&turboModule),
        count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed")
                   : args[0].asString(rt));
  }

  static jsi::Value __toBase64(jsi::Runtime &rt, TurboModule &turboModule,
                                const jsi::Value *args, size_t count) {
    static_assert(bridging::getParameterCount(&T::toBase64) == 2,
                  "Expected toBase64(...) to have 2 parameters");
    return bridging::callFromJs<jsi::String>(
        rt, &T::toBase64,
        static_cast<NativeFastBase64CxxSpec *>(&turboModule)->jsInvoker_,
        static_cast<T *>(&turboModule),
        count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed")
                   : args[0].asObject(rt));
  }

  static jsi::Value __fromBase64(jsi::Runtime &rt, TurboModule &turboModule,
                                  const jsi::Value *args, size_t count) {
    static_assert(bridging::getParameterCount(&T::fromBase64) == 2,
                  "Expected fromBase64(...) to have 2 parameters");
    return bridging::callFromJs<jsi::Object>(
        rt, &T::fromBase64,
        static_cast<NativeFastBase64CxxSpec *>(&turboModule)->jsInvoker_,
        static_cast<T *>(&turboModule),
        count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed")
                   : args[0].asString(rt));
  }

  static jsi::Value __toBase64URL(jsi::Runtime &rt, TurboModule &turboModule,
                                   const jsi::Value *args, size_t count) {
    static_assert(bridging::getParameterCount(&T::toBase64URL) == 2,
                  "Expected toBase64URL(...) to have 2 parameters");
    return bridging::callFromJs<jsi::String>(
        rt, &T::toBase64URL,
        static_cast<NativeFastBase64CxxSpec *>(&turboModule)->jsInvoker_,
        static_cast<T *>(&turboModule),
        count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed")
                   : args[0].asObject(rt));
  }

  static jsi::Value __fromBase64URL(jsi::Runtime &rt, TurboModule &turboModule,
                                     const jsi::Value *args, size_t count) {
    static_assert(bridging::getParameterCount(&T::fromBase64URL) == 2,
                  "Expected fromBase64URL(...) to have 2 parameters");
    return bridging::callFromJs<jsi::Object>(
        rt, &T::fromBase64URL,
        static_cast<NativeFastBase64CxxSpec *>(&turboModule)->jsInvoker_,
        static_cast<T *>(&turboModule),
        count <= 0 ? throw jsi::JSError(rt, "Expected argument in position 0 to be passed")
                   : args[0].asString(rt));
  }
};

} // namespace facebook::react
