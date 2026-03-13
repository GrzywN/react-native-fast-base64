#import "FastBase64.h"

@implementation FastBase64
- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeFastBase64SpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"FastBase64";
}

@end
