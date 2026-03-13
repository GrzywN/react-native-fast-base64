package com.fastbase64

import com.facebook.react.bridge.ReactApplicationContext

class FastBase64Module(reactContext: ReactApplicationContext) :
  NativeFastBase64Spec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeFastBase64Spec.NAME
  }
}
