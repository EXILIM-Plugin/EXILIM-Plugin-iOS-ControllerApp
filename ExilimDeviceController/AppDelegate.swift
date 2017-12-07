//
//  AppDelegate.swift
//  ExilimDeviceController
//
//  Created by Kunihiko Ohnaka on 2017/10/04.
//  Copyright © 2017年 CASIO COMPUTER Co., LTD. All rights reserved.
//

import UIKit
import DConnectSDK
import CoreData
import RxSwift
import RxCocoa

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    private let disposeBag = DisposeBag()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        DConnectManager.shared().settings.useLocalOAuth = false
        DConnectManager.shared().settings.useOriginEnable = false
        #if DEBUG
        DConnectManager.shared().settings.useExternalIP = true
        #endif
        self.startManager()

        // RxCocoaの URLSession+Rx.swiftのログを無効化
        RxCocoa.Logging.URLRequests = { _ in return false }
        
        // ネットワーク接続状態の変化にHost名を追従させるために、定期的にポーリング
        // Reachabilityの通知だと、あるWiFiから 別のWiFiへの変化に追従できないので
        // ポーリングで監視している。
        //
        Observable<Int>.interval(1.0, scheduler: MainScheduler.instance).subscribe(onNext: { [unowned self] _ in
            self.updateHostName()
        }).disposed(by: disposeBag)

        return true
    }

    private func updateHostName() {
        guard let manager = DConnectManager.shared() else {
            return
        }
        guard manager.isStarted() else {
            return
        }
        manager.settings.host = self.getWiFiAddress() ?? "localhost"
    }

    // Return IP address of WiFi interface (en0) as a String, or `nil`
    private func getWiFiAddress() -> String? {
        var address : String?
        
        // Get list of all interfaces on the local machine:
        var ifaddr : UnsafeMutablePointer<ifaddrs>?
        guard getifaddrs(&ifaddr) == 0 else { return nil }
        guard let firstAddr = ifaddr else { return nil }
        
        // For each interface ...
        for ifptr in sequence(first: firstAddr, next: { $0.pointee.ifa_next }) {
            let interface = ifptr.pointee
            
            // Check for IPv4 or IPv6 interface:
            let addrFamily = interface.ifa_addr.pointee.sa_family
            if addrFamily == UInt8(AF_INET) || addrFamily == UInt8(AF_INET6) {
                
                // Check interface name:
                let name = String(cString: interface.ifa_name)
                if  name == "en0" {
                    
                    // Convert interface address to a human readable string:
                    var hostname = [CChar](repeating: 0, count: Int(NI_MAXHOST))
                    getnameinfo(interface.ifa_addr, socklen_t(interface.ifa_addr.pointee.sa_len),
                                &hostname, socklen_t(hostname.count),
                                nil, socklen_t(0), NI_NUMERICHOST)
                    address = String(cString: hostname)
                }
            }
        }
        freeifaddrs(ifaddr)
        
        return address
    }


    // MARK: - Core Data

    lazy var applicationDocumentsDirectory: URL = {
        let urls = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        return urls[urls.count-1]
    }()
    
    lazy var managedObjectModel: NSManagedObjectModel = {
        let modelURL = Bundle.main.url(forResource:"Application", withExtension: "momd")!
        return NSManagedObjectModel(contentsOf: modelURL)!
    }()
    
    lazy var persistentStoreCoordinator: NSPersistentStoreCoordinator = {
        let coordinator = NSPersistentStoreCoordinator(managedObjectModel: self.managedObjectModel)
        let url = self.applicationDocumentsDirectory.appendingPathComponent("SimpleMasterDetail.sqlite")
        do {
            try coordinator.addPersistentStore(ofType: NSSQLiteStoreType, configurationName: nil, at: url, options: nil)
            return coordinator
        } catch _ {
            abort()
        }
    }()
    
    lazy var managedObjectContext: NSManagedObjectContext = {
        let coordinator = self.persistentStoreCoordinator
        let managedObjectContext = NSManagedObjectContext(concurrencyType: .mainQueueConcurrencyType)
        managedObjectContext.persistentStoreCoordinator = coordinator
        return managedObjectContext
    }()
    
    // MARK: - Core Data Saving support
    
    func saveContext () {
         let moc = self.managedObjectContext
        guard moc.hasChanges else {
            return
        }
        do {
            try moc.save()
        } catch let error as NSError {
            NSLog("Unresolved error \(error), \(error.userInfo)")
            abort()
        }
    }
}

extension AppDelegate {
    func applicationDidEnterBackground(_ application: UIApplication) {
        self.stopManager()
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        self.startManager()
    }

    fileprivate func startManager() {
        guard DConnectManager.shared().start() else {
            let alert = UIAlertController(title: "エラー", message: "DeviceConnect を起動できませんでした。他のDeviceConnectアプリを停止してから再度お試しください。", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
            }))
            self.window?.rootViewController?.present(alert, animated: true) {
            }
            return
        }
    }
    fileprivate func stopManager() {
        DConnectManager.shared().stop()
    }
}
