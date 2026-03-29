# Task 1.1: Typed Event Emitter

## 🎯 Goal

Implement a generic EventEmitter where TypeScript guarantees correspondence between event name and payload type.

## Requirements

1. Define an `AppEvents` interface with at least 4 events of different structures
2. Create a `TypedEventEmitter<TEvents>` class with methods:
   - `on(event, handler)` — subscribe, returns an unsubscribe function
   - `off(event, handler)` — unsubscribe
   - `emit(event, payload)` — dispatch event
   - `once(event, handler)` — one-time subscription
   - `listenerCount(event)` — subscriber count
   - `removeAllListeners(event?)` — remove all subscribers
3. All methods must be type-safe — TypeScript infers payload type from event name
4. Demonstrate all methods working

## Checklist

- [ ] `emit('user:login', { userId: 42 })` causes compile error (userId must be string)
- [ ] `emit('typo:event', {})` causes error (event not in map)
- [ ] `on()` returns an unsubscribe function
- [ ] `once()` calls handler only once
- [ ] `removeAllListeners()` without argument clears all subscriptions

## How to Verify

Try subscribing to a non-existent event or passing wrong payload — TypeScript should error. Check that after `on()` the handler receives payload with the correct type.
