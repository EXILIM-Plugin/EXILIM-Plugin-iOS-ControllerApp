source 'https://github.com/EXILIM-Plugin/EXILIM-Plugin-iOS-PodSpecs.git'
source 'https://github.com/kunichiko/DeviceConnect-PodSpecs.git'
source 'https://github.com/CocoaPods/Specs.git'

platform :ios, '9.0'
swift_version = '3.0' 
use_frameworks!

target 'ExilimDeviceController' do
  pod 'DeviceConnectSDK', '= 2.1.3'
  pod 'DeviceConnectHostPlugin'
  pod 'DeviceConnectExilimPlugin'
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ONLY_ACTIVE_ARCH'] = 'NO'

      # https://github.com/robbiehanson/CocoaHTTPServer/issues/171
      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)', 'DD_LEGACY_MACROS=1']
    end
  end
end
