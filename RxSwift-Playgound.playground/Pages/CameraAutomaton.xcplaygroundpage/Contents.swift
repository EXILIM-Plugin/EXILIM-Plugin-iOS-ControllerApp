//: [Previous](@previous)

import Foundation
import RxAutomaton
import RxSwift

let scheduler = SerialDispatchQueueScheduler(internalSerialQueueName: "queue")

enum State {
    case offline
    case idle
    case webServerStarting
    case webServerRunning
    case liveViewStarting
    case liveViewRunning
    case liveViewTakingPhoto
    case liveViewRecordingMovie
}

enum Input {
    case empty
    case connectionChangedToOffline
    case connectionChangedToOnline
    case webServerStarted
    case liveViewStartRequested
    case liveViewStarted
    case liveViewEndRequested
    case liveViewEnded
    case takePhotoRequested
    case takePhotoCompleted
    case recordMovieRequested
    case recordMovieCompleted
    case operationFailed
    case recovered
}

var forceFailOperation: Bool = false


let startWebServer = Observable<Int>.timer(0.5, scheduler: scheduler).map { _ -> Input in forceFailOperation ? .operationFailed : .webServerStarted }
let startLiveView = Observable<Int>.timer(0.5, scheduler: scheduler).map { _ -> Input in forceFailOperation ? .operationFailed : .liveViewStarted }
let recovery = Observable<Int>.timer(0.2, scheduler: scheduler).map { _ -> Input in
    forceFailOperation = false
    return .recovered
}
func checkAppMode(_ appMode: String ) -> Observable<Input> {
    return Observable<Int>.timer(0.5, scheduler: scheduler).map { _ -> Input in forceFailOperation ? .operationFailed : .empty }
}

let mappings: [Automaton<State, Input>.NextMapping] = [
    /*  Input                  |   fromState => toState                      |      Effect       */
    /* -----------------------------------------------------------------------------------------*/
    .connectionChangedToOnline  | .offline           => .idle                 | .empty(),
    .connectionChangedToOnline  | .idle              => .webServerStarting    | startWebServer,
    .webServerStarted           | .webServerStarting => .webServerRunning     | .empty(),
    .liveViewStartRequested     | .webServerStarting => .liveViewStarting     | startLiveView,
    .liveViewStartRequested     | .webServerRunning  => .liveViewStarting     | startLiveView,
    .liveViewStarted            | .liveViewStarting  => .liveViewRunning      | .empty(),
    .takePhotoRequested         | .liveViewRunning => .liveViewTakingPhoto    | .empty(),
    .takePhotoCompleted         | .liveViewTakingPhoto => .liveViewRunning    | .empty(),
    .recordMovieRequested       | .liveViewRunning => .liveViewRecordingMovie | .empty(),
    .recordMovieCompleted       | .liveViewRecordingMovie => .liveViewRunning | .empty(),
    // camera appMode checking
    .connectionChangedToOnline  | .webServerRunning    => .webServerRunning   | checkAppMode("WEB_SERVER"),
    .connectionChangedToOnline  | .liveViewRunning     => .liveViewRunning    | checkAppMode("LIVE_VIEW"),
    // offline handling
    .connectionChangedToOffline | .idle                   => .offline         | .empty(),
    .connectionChangedToOffline | .webServerStarting      => .offline         | .empty(),
    .connectionChangedToOffline | .webServerRunning       => .offline         | .empty(),
    .connectionChangedToOffline | .liveViewStarting       => .offline         | .empty(),
    .connectionChangedToOffline | .liveViewRunning        => .offline         | .empty(),
    .connectionChangedToOffline | .liveViewTakingPhoto    => .offline         | .empty(),
    .connectionChangedToOffline | .liveViewRecordingMovie => .offline         | .empty(),
    // error handling
    .operationFailed            | .idle                   => .idle            | recovery,
    .operationFailed            | .webServerStarting      => .idle            | recovery,
    .operationFailed            | .webServerRunning       => .idle            | recovery,
    .operationFailed            | .liveViewStarting       => .idle            | recovery,
    .operationFailed            | .liveViewRunning        => .idle            | recovery,
    .operationFailed            | .liveViewTakingPhoto    => .idle            | recovery,
    .operationFailed            | .liveViewRecordingMovie => .idle            | recovery
]

// 3. Prepare input pipe for sending `Input` to `Automaton`.
let (inputSignal, inputObserver) = Observable<Input>.pipe()

// 4. Setup `Automaton`.
let automaton = Automaton(
    state: .offline,
    input: inputSignal,
    mapping: reduce(mappings),  // combine mappings using `reduce` helper
    strategy: .latest   // NOTE: `.latest` cancels previous running effect
)

// Observe state-transition replies (`.success` or `.failure`).
automaton.replies.subscribe(onNext: { reply in
    print("received reply = \(reply)")
})

// Observe current state changes.
automaton.state.asObservable().subscribe(onNext: { state in
    print("current state  = \(state)")
})


//
// TEST START
//

let send = { (_ input: Input) in
    print("Input: \(input)")
    inputObserver.onNext(input)
}
func assertState(_ state: State) {
    guard automaton.state.value == state else {
        print("‼️ aborted. state: \(automaton.state.value) is not expected state (\(state))")
        abort()
    }
}

assertState(.offline)

send(.connectionChangedToOffline)
send(.connectionChangedToOnline)
send(.connectionChangedToOnline)
assertState(.webServerStarting)
Thread.sleep(forTimeInterval: 1.0)
assertState(.webServerRunning)

// ライブビュー開始
send(.liveViewStartRequested)
assertState(.liveViewStarting)
Thread.sleep(forTimeInterval: 1.0)
assertState(.liveViewRunning)

// 写真撮影
send(.takePhotoRequested)
assertState(.liveViewTakingPhoto)
Thread.sleep(forTimeInterval: 1.0)
assertState(.liveViewTakingPhoto)
send(.takePhotoCompleted)
Thread.sleep(forTimeInterval: 1.0)
assertState(.liveViewRunning)

// 動画撮影
send(.recordMovieRequested)
assertState(.liveViewRecordingMovie)
Thread.sleep(forTimeInterval: 1.0)
assertState(.liveViewRecordingMovie)
send(.recordMovieCompleted)
Thread.sleep(forTimeInterval: 1.0)
assertState(.liveViewRunning)

// 写真撮影（失敗）
forceFailOperation = true

send(.takePhotoRequested)
assertState(.liveViewTakingPhoto)
Thread.sleep(forTimeInterval: 1.0)
assertState(.liveViewTakingPhoto)
send(.operationFailed)
assertState(.idle)
Thread.sleep(forTimeInterval: 1.0)

send(.connectionChangedToOnline)
assertState(.webServerStarting)
Thread.sleep(forTimeInterval: 1.0)
assertState(.webServerRunning)

print("Success🌟")

//
// Utilities
//



//: [Next](@next)
