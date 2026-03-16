require "json"
package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "FastBase64"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/GrzywN/react-native-fast-base64.git", :tag => "#{s.version}" }

  s.source_files = [
    "ios/**/*.{h,m,mm}",
    "shared/**/*.{h,cpp}",
  ]

  # simdutf vendored amalgamation — nie ma oficjalnego CocoaPod
  s.preserve_paths = "shared/vendor/simdutf/**/*"

  s.pod_target_xcconfig = {
    "CLANG_CXX_LANGUAGE_STANDARD"        => "c++17",
    "HEADER_SEARCH_PATHS"                => "$(PODS_TARGET_SRCROOT)/shared $(PODS_TARGET_SRCROOT)/shared/vendor/simdutf",
    "GCC_OPTIMIZATION_LEVEL"             => "3",
  }

  install_modules_dependencies(s)
end
