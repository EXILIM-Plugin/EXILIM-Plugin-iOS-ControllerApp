//
//  WebViewController.swift
//  ExilimDeviceController
//
//  Created by Kunihiko Ohnaka on 2017/10/04.
//  Copyright © 2017年 CASIO COMPUTER Co., LTD. All rights reserved.
//

import UIKit
import WebKit
import Reachability
import RxSwift
import RxCocoa
import SystemConfiguration.CaptiveNetwork
import NetworkExtension

class WebViewController: UIViewController {

    @IBOutlet weak var headerView: UIView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var progress: UIProgressView!
    @IBOutlet weak var addressBar: UIStackView!
    @IBOutlet weak var backButton: UIButton!
    @IBOutlet weak var forwardButton: UIButton!
    @IBOutlet weak var addressTextField: UITextField!
    @IBOutlet weak var reloadButton: UIButton!
    @IBOutlet weak var closeButton: UIButton!
    @IBOutlet weak var ssidLabel: UILabel!

    private var initialUrl: URL?
    
    private var webView: WKWebView!

    private let disposeBag = DisposeBag()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Title Label
        self.titleLabel.text = ""
        
        // progress
        self.progress.progress = 0.0
        
        // Address TextField
        self.addressTextField.delegate = self
        
        // WebView
        let webViewConf = WKWebViewConfiguration()
        self.webView = WKWebView(frame: .zero, configuration: webViewConf)
        self.webView.navigationDelegate = self
        self.webView.uiDelegate = self
        self.webView.allowsBackForwardNavigationGestures = true
        self.webView.translatesAutoresizingMaskIntoConstraints = false
        self.view.addSubview(self.webView)

        self.webView.addObserver(self, forKeyPath: "title", options: .new, context: nil)
        self.webView.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil)
        self.webView.addObserver(self, forKeyPath: "loading", options: .new, context: nil)
        self.webView.addObserver(self, forKeyPath: "canGoBack", options: .new, context:nil)
        self.webView.addObserver(self, forKeyPath: "canGoForward", options: .new, context:nil)

        // Auto-layout 制約条件
        let topConstraint = NSLayoutConstraint(item: webView,
                                               attribute: NSLayoutAttribute.top,
                                               relatedBy: NSLayoutRelation.equal,
                                               toItem: self.headerView,
                                               attribute: NSLayoutAttribute.bottom,
                                               multiplier: 1.0,
                                               constant: 0)
        let leadingConstraint = NSLayoutConstraint(item: webView,
                                                   attribute: NSLayoutAttribute.leading,
                                                   relatedBy: NSLayoutRelation.equal,
                                                   toItem: self.view,
                                                   attribute: NSLayoutAttribute.leading,
                                                   multiplier: 1.0,
                                                   constant: 0)
        let bottomConstraint = NSLayoutConstraint(item: webView,
                                                  attribute: NSLayoutAttribute.bottom,
                                                  relatedBy: NSLayoutRelation.equal,
                                                  toItem: self.view,
                                                  attribute: NSLayoutAttribute.bottom,
                                                  multiplier: 1.0,
                                                  constant: 0)
        let trailingConstraint = NSLayoutConstraint(item: webView,
                                                    attribute: NSLayoutAttribute.trailing,
                                                    relatedBy: NSLayoutRelation.equal,
                                                    toItem: self.view,
                                                    attribute: NSLayoutAttribute.trailing,
                                                    multiplier: 1.0,
                                                    constant: 0)
        
        self.view.addConstraint(topConstraint)
        self.view.addConstraint(bottomConstraint)
        self.view.addConstraint(leadingConstraint)
        self.view.addConstraint(trailingConstraint)

        // 「戻る」「進む」ボタンは最初は無効
        self.backButton.isEnabled = false
        self.forwardButton.isEnabled = false
        
        // アドレスバー編集中に WebViewのタップでキーボードを閉じる
        let gestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(WebViewController.tapGestureRecognized(_:)))
        gestureRecognizer.delegate = self
        self.webView.addGestureRecognizer(gestureRecognizer)

        // SSIDの表示
        ssidLabel.text = self.currentSSID
        let ssidPolling = Observable<Int>.interval(1.0, scheduler: MainScheduler.instance)
        let ssidObservable = ssidPolling.map { [weak self] _ -> String? in
            guard let selfRef = self else {
                return nil
            }
            return selfRef.currentSSID
            }.distinctUntilChanged( { $0 == $1 } )
        ssidObservable.bind(to: ssidLabel.rx.text).disposed(by: self.disposeBag)

        // ロード
        self.load(url: initialUrl)
    }

    var currentSSID: String? {
        let interfaces = CNCopySupportedInterfaces()
        let count = CFArrayGetCount(interfaces)
        guard count > 0 else {
            return nil
        }
        print("Count=\(count)")
        let interfaceName: UnsafeRawPointer = CFArrayGetValueAtIndex(interfaces, 0)
        let rec = unsafeBitCast(interfaceName, to: AnyObject.self)
        if let unsafeInterfaceData = CNCopyCurrentNetworkInfo("\(rec)" as CFString) {
            let interfaceData = unsafeInterfaceData as Dictionary
            let ssid = interfaceData["SSID" as NSString] as! String
            //                let bssid = interfaceData["BSSID" as NSString] as! String
            //                Log.trace("SSID=\(ssid) BSSID=\(bssid)")
            return ssid
        } else {
            return nil
        }
    }

    deinit {
        self.webView.removeObserver(self, forKeyPath: "title")
        self.webView.removeObserver(self, forKeyPath: "estimatedProgress")
        self.webView.removeObserver(self, forKeyPath: "loading")
        self.webView.removeObserver(self, forKeyPath: "canGoBack")
        self.webView.removeObserver(self, forKeyPath: "canGoForward")
    }
    
    @objc func tapGestureRecognized(_ sender: UITapGestureRecognizer) {
        // キーボードが出ている状態で、WebViewをタップしたらキーボードを閉じる
        if addressTextField.isFirstResponder {
            addressTextField.resignFirstResponder()
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
    }

    @IBAction func closeButtonTouchDown(_ sender: Any) {
        let alertController = UIAlertController(title: "アプリを終了してもよろしいですか?", message: nil, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "キャンセル", style: .cancel) { (action) in
        })
        alertController.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
            self.dismiss(animated: true, completion: nil)
        }))
        self.present(alertController, animated: true) {
        }
    }
    
    func load(url: URL?) {
        guard let url = url else {
            return
        }
        guard webView != nil else {
            self.initialUrl = url
            return
        }
        self.titleLabel.text = url.host ?? url.lastPathComponent
        self.addressTextField.text = url.absoluteString
        let request = URLRequest(url: url)
        self.webView.load(request)
    }
    
    @IBAction func backButtonTouchDown(_ sender: Any) {
        self.webView.goBack()
    }
    
    @IBAction func forwardButtonTouchDown(_ sender: Any) {
        self.webView.goForward()
    }
    
    @IBAction func addressTextFieldEditingDidEnd(_ sender: Any) {
        guard let urlStr = self.addressTextField.text else {
            return
        }
        let urlOpt: URL?
        if urlStr.hasPrefix("http") {
            urlOpt = URL(string: urlStr)
        } else {
            urlOpt = URL(string: "http://" + urlStr)
        }
        guard let url = urlOpt else {
            let alertController = UIAlertController(title: "URLが不正です", message: nil, preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "OK", style: .cancel) { (action) in
            })
            self.present(alertController, animated: true) {
            }
            return
        }
        load(url: url)
    }
    
    @IBAction func addressTextFieldEditingChanged(_ sender: Any) {
    }
    
    
    @IBAction func reloadButtonTouchDown(_ sender: Any) {
        self.webView.reload()
    }


    override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        guard let keyPath = keyPath else {
            return super.observeValue(forKeyPath: nil, of: object, change: change, context: context)
        }
        switch keyPath {
        case "title":
            self.titleLabel.text = self.webView.title
        case "estimatedProgress":
            self.progress.setProgress(Float(webView.estimatedProgress), animated: true)
        case "loading":
            UIApplication.shared.isNetworkActivityIndicatorVisible = self.webView.isLoading
            switch (!self.progress.isHidden,self.webView.isLoading) {
            case (false,true):
                self.progress.setProgress(0.0, animated: false)
                self.progress.isHidden = false
            case (true,false):
                if !self.progress.isHidden {
                    self.progress.setProgress(1.0, animated: true)
                    // UIProgressViewのアニメーションの完了をきっちり取ることができないので、
                    // 0.7秒の固定ディレイを入れる
                    DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 0.7) {
                        UIView.animate(withDuration: 0.5, animations: { self.progress.alpha = 0.0 }) { _ in
                            self.progress.isHidden = true
                            self.progress.alpha = 1.0
                            self.progress.setProgress(0.0, animated: false)
                        }
                    }
                }
            default:
                ()
            }
        case "canGoBack":
            self.backButton.isEnabled = self.webView.canGoBack
        case "canGoForward":
            self.forwardButton.isEnabled = self.webView.canGoForward
        default:
            ()
        }
    }
}

extension WebViewController : UIGestureRecognizerDelegate {
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }
}

extension WebViewController : WKNavigationDelegate {
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            assertionFailure()
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }
    
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alertController = UIAlertController(title: message, message: nil, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "OK", style: .cancel, handler: { _ in
            completionHandler()
        }))
        self.present(alertController, animated: true) {
        }
    }
}

extension WebViewController : WKUIDelegate {
    
}

extension WebViewController : UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        return true
    }
}
