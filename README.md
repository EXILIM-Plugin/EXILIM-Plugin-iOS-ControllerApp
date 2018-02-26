# EXILIM-Plugin-iOS-ControllerApp について

EXILIM-Plugin-iOS-ControllerAppは、iOS版 Device Connectプラットフォームである [DeviceConnect-iOS](https://github.com/DeviceConnect/DeviceConnect-iOS/) を使って、カシオ計算機製のデジタルカメラである EXILIM シリーズを利用できるようにしたブラウザアプリです。

EXILIM Device Controllerアプリの使用方法は[**操作マニュアル**](http://support.casio.jp/storage/download_files/001/PDF/EXILIM_Plugin_iOS_Manual.pdf)をご覧ください。

# アーキテクチャ

本アプリは [DeviceConnect-iOS](https://github.com/DeviceConnect/DeviceConnect-iOS/) に EXILIM用のプラグインである [EXILIM-Plugin-iOS](https://github.com/EXILIM-Plugin/EXILIM-Plugin-iOS) を組み込み、Webブラウザから DeviceConnectの機能を使えるようにした iOSアプリとして作られています。

DeviceConnectや EXILIMプラグインの詳細については、各プロジェクトのページをご覧ください。

# 詳細仕様

本アプリの詳細仕様は以下の通りです。

- 動作確認カメラ
  - EXILIM EX-FR100
  - EXILIM EX-FR200
  - EXILIM EX-FR100KT
- 対応 OS
  - iOS 9.0 以上
- 動作確認済み Xcode バージョン
  - Xcode 9.2
- 対応 Swift バージョン
  - Swift 3.2
  - ※ 本プラグインは Swiftで実装されているため、異なるバージョンの Swiftランタイムでは正常に動作しない可能性があります。
  - ※ Swift 4 への対応も予定しています。
- 依存ライブラリ
　- DeviceConnect
  - DeviceConnectSDK (2.1)
    - CocoaAsyncSocket (7.6.1)
    - CocoaHTTPServer (2.3.1)
    - CocoaLumberjack (3.3.0)
    - RoutingHTTPServer (1.0.0)
  - ReachabilitySwift (4.1.0)
  - RxAutomaton (0.2.1)
  - RxCocoa (3.6.1)
  - RxSwift (3.6.1)

# ビルド方法

`ExilimDeviceController.xcworkspace` を Xcode 9.2 で開き、 `ExilimDeviceController` スキーマを選択してビルドすれば動作します。


# アプリの利用方法

## カメラとの接続

アプリを利用する際は、iOSデバイスとカメラを Wi-Fiで接続する必要があります。
以下のその手順を示します。

### FR-100でライブビュー映像を利用する場合
- アプリを起動します
- 「登録済みのアプリ」から「EXILIM Controller」を選択します
- カメラとコントローラーの電源を入れます
- コントローラー画面の上部のメニューから Wi-Fiアイコンをタップします
- 「スマートフォンで撮影」を選択します
- 「開始」ボタンを押します
- カメラの Wi-Fi アクセスポイントが準備されるので、表示された SSIDとパスワードを使って iOSデバイスをそのWi-Fiネットワークに接続します。
- ホーム画面から本アプリのアイコンをタップします
- 「startLive」ボタンを押すと、画面下部にライブビュー映像が表示されます

### FR-100でSDカードのファイルにアクセスする場合
- アプリを起動します
- 「登録済みのアプリ」から「Device Connect Demo Site」を選択します
  - 外部サイトにある Webアプリのため、インターネットに接続した状態で開く必要があります
- カメラとコントローラーの電源を入れます
- コントローラー画面の上部のメニューから Wi-Fiアイコンをタップします
- 「スマートフォンへ送る」を選択します
- 「スマートフォンから見る」を選択します
- カメラの Wi-Fi アクセスポイントが準備されるので、表示された SSIDとパスワードを使って iOSデバイスをそのWi-Fiネットワークに接続します。
- ホーム画面から本アプリのアイコンをタップします
- 「Search Device」ボタンを押します
- 「DeviceList」に「Exilim」と表示されるのでそれをタップします
- 「file」をタップします
- 「File Manager」をタップします
- するとデジタルカメラに接続されたSDカードの内部を見ることができます
  - 過去に撮影した画像は `DCIM` フォルダの中の `100CASIO` フォルダの中に入っています
  - 動画は表示できません

# アプリのカスタマイズ方法

## プラグインの追加方法

本アプリは Hostプラグインと Exilimプラグインだけが追加された状態になっています。他の DeviceConnectプラグインを併用したい場合は、必要なプラグインの Podを追加する必要があります。
詳しくは、[EXILIM-Plugin-iOS](https://github.com/EXILIM-Plugin/EXILIM-Plugin-iOS) を参照してください。

ただし、弊社では他のプラグインとの同時利用についての動作保証は行なっておりません。


# 制限事項
## Releaseビルド時にラインタイムエラーが発生する

本アプリが組み込んでいる EXILIMプラグインの Frameworkモジュールは Debug 設定でビルドされているため、アプリをビルドする際は Debug ビルドをするようにしてください。 
本アプリを Release ビルドすると、CocoaPodsの他の Frameworkと EXILIMプラグインの Frameworkで整合性が取れず、ランタイムエラーが発生する問題があります。

アプリを Releaseビルドで利用する方法については後日対応する予定です。

# ライセンス

特別にライセンスが明示されたファイルを除き、本プロジェクトの成果物は [MIT ライセンス](LICENSE.md)のもと利用可能です。

依存ライブラリ等については個々のライセンス条項に従ってご利用ください。

