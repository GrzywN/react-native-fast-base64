package com.fastbase64

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.soloader.SoLoader

class FastBase64Package : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? = null

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      NAME to ReactModuleInfo(
        name = NAME,
        className = NAME,
        canOverrideExistingModule = false,
        needsEagerInit = false,
        isCxxModule = true,
        isTurboModule = true
      )
    )
  }

  companion object {
    const val NAME = "FastBase64"

    init {
      SoLoader.loadLibrary("FastBase64")
    }
  }
}
