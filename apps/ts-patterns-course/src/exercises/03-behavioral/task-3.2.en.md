# Task 3.2: Observer (TypedEventEmitter)

## Objective

Implement a typed EventEmitter with support for strictly typed events via generics.

## Requirements

1. Define the type `Listener<T> = (data: T) => void`
2. Create the class `TypedEventEmitter<TEventMap>` where `TEventMap extends Record<string, unknown>`:
   - `on<K>(event: K, listener: Listener<TEventMap[K]>)` — subscribe
   - `off<K>(event: K, listener: Listener<TEventMap[K]>)` — unsubscribe
   - `emit<K>(event: K, data: TEventMap[K])` — emit an event
   - `listenerCount<K>(event: K): number` — number of listeners
3. Define the `AppEvents` interface with events:
   - `userLogin: { userId: string; timestamp: number }`
   - `userLogout: { userId: string }`
   - `error: { message: string; code: number }`
4. Demonstrate subscribing, emitting events, and unsubscribing

## Checklist

- [ ] `TypedEventEmitter` is parameterized by the event map
- [ ] `on` and `emit` are typed — passing incorrect data types is not allowed
- [ ] `off` correctly removes a specific listener
- [ ] `listenerCount` returns the current count
- [ ] After `off`, the event no longer triggers the removed listener
- [ ] Demonstration shows subscribing, emitting, and unsubscribing

## How to verify

1. Click the run button
2. Verify that events are logged correctly
3. Verify that after `off` the listener count decreased
4. Verify that the removed listener is no longer called
