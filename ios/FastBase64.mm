#import "FastBase64.h"

#include "Base64.h"

@implementation FastBase64

RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::FastBase64Module>(params.jsInvoker);
}

@end
