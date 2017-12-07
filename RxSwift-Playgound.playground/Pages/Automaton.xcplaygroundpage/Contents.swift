//: [Previous](@previous)
// 先に ExilimDeviceControllerアプリをシミュレータ向けにビルドしておく必要があります。
// うまくいかない場合は、ManageSchemesで RxSwiftを可視化して、RxSwiftをシミュレータ向けに手動ビルドしてみてください。

import Foundation
import RxAutomaton
import RxSwift


enum State {
    case loggedOut, loggingIn, loggedIn, loggingOut
}

enum Input {
    case login, loginOK, logout, logoutOK
    case forceLogout
}

// Additional effects (`Observable`s) while state-transitioning.
// (NOTE: Use `Observable.empty()` for no effect)

let scheduler = SerialDispatchQueueScheduler(internalSerialQueueName: "queue")
/* show UI, setup DB, request APIs, ..., and send `Input.loginOK` */
let loginOKProducer = Observable<Int>.timer(1.0, scheduler: scheduler).map { _ in Input.loginOK }
 /* show UI, clear cache, cancel APIs, ..., and send `Input.logoutOK` */
let logoutOKProducer = Observable<Int>.timer(1.0, scheduler: scheduler).map { _ in Input.logoutOK }
/* do something more special, ..., and send `Input.logoutOK` */
let forceLogoutOKProducer = Observable<Int>.timer(1.0, scheduler: scheduler).map { _ in Input.logoutOK }

let canForceLogout: (State) -> Bool = [.loggingIn, .loggedIn].contains

// 2. Setup state-transition mappings.
let mappings: [Automaton<State, Input>.NextMapping] = [
    
    /*  Input   |   fromState => toState     |      Effect       */
    /* ----------------------------------------------------------*/
    .login    | .loggedOut  => .loggingIn  | loginOKProducer,
    .loginOK  | .loggingIn  => .loggedIn   | .empty(),
    .logout   | .loggedIn   => .loggingOut | logoutOKProducer,
    .logoutOK | .loggingOut => .loggedOut  | .empty(),
    
    .forceLogout | canForceLogout => .loggingOut | forceLogoutOKProducer
]

// 3. Prepare input pipe for sending `Input` to `Automaton`.
let (inputSignal, inputObserver) = Observable<Input>.pipe()

// 4. Setup `Automaton`.
let automaton = Automaton(
    state: .loggedOut,
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
    print("current state = \(state)")
})


//
// TEST START
//

let send = inputObserver.onNext

guard automaton.state.value == .loggedOut else {
    print("state = \(automaton.state.value)")
    abort()
}

send(Input.login)
Thread.sleep(forTimeInterval: 3.0)

// already logged in
guard automaton.state.value == .loggedIn else {
    print("state = \(automaton.state.value)")
    abort()
}
send(Input.logout)
// logging out...
guard automaton.state.value == .loggingOut else {
    print("state = \(automaton.state.value)")
    abort()
}
// `logoutOKProducer` will automatically send `Input.logoutOK` later
// and transit to `State.loggedOut`.
Thread.sleep(forTimeInterval: 2.0)

// already logged out
guard automaton.state.value == .loggedOut else {
    print("state = \(automaton.state.value)")
    abort()
}
send(Input.login)

// logging in...
guard automaton.state.value == .loggingIn else {
    print("state = \(automaton.state.value)")
    abort()
}
// `loginOKProducer` will automatically send `Input.loginOK` later
// and transit to `State.loggedIn`.
// 👨🏽 < But wait, there's more!
// Let's send `Input.forceLogout` immediately after `State.loggingIn`.

send(Input.forceLogout)                       // 💥💣💥
guard automaton.state.value == .loggingOut else {
    print("state = \(automaton.state.value)")
    abort()
}
// `forcelogoutOKProducer` will automatically send `Input.logoutOK` later
// and transit to `State.loggedOut`.
Thread.sleep(forTimeInterval: 2.0)
guard automaton.state.value == .loggedOut else {
    abort()
}

print("Success🌟")
//: [Next](@next)
