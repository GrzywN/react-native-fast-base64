#include <fbjni/fbjni.h>
#include <ReactCommon/CxxTurboModuleUtils.h>

#include "Base64.h"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
  return facebook::jni::initialize(vm, [] {
    facebook::react::registerCxxModuleToGlobalModuleMap(
        std::string(facebook::react::FastBase64Module::kModuleName),
        [](std::shared_ptr<facebook::react::CallInvoker> jsInvoker) {
          return std::make_shared<facebook::react::FastBase64Module>(
              std::move(jsInvoker));
        });
  });
}
