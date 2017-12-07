//: Playground
// RxSwiftの挙動を確かめるためのPlaygroundページです。
// 先に ExilimDeviceControllerアプリをシミュレータ向けにビルドしておく必要があります。
// うまくいかない場合は、ManageSchemesで RxSwiftを可視化して、RxSwiftをシミュレータ向けに手動ビルドしてみてください。

import UIKit
import RxSwift
import PlaygroundSupport

let disposeBag = DisposeBag()

PlaygroundPage.current.needsIndefiniteExecution = true
DispatchQueue.main.asyncAfter(deadline: .now() + 10.0) {
    print("end")
    PlaygroundPage.current.finishExecution()
}

print("start")

let timer = Observable<Int>.interval(1.0, scheduler: SerialDispatchQueueScheduler(internalSerialQueueName: "queue"))
let result = timer.map { count -> Int in
    print("\(count)")
    return count
}
let result2 = result.flatMap { count -> Observable<(Int,Int)> in
    return Observable<Int>.timer(2.0, scheduler: SerialDispatchQueueScheduler(internalSerialQueueName: "queue2")).map { return (count,$0) }
}
let result3 = result2.do(onNext: { (count) in
    print("==>\(count)")
})

result3.subscribe().disposed(by: disposeBag)



