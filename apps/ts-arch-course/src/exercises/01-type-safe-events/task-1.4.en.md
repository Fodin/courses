# Task 1.4: Event Sourcing Basics

## 🎯 Goal

Implement a type-safe event store (EventStore) with replay, type filtering, and time-travel.

## Requirements

1. Define a `BaseEvent` interface with id, timestamp, version fields
2. Create at least 4 event types for one domain model (discriminated union)
3. Implement `EventStore<TEvent>` with methods:
   - `append(event)` — add event
   - `getAll()` — all events
   - `getByType(type)` — filtering with type narrowing via Extract
   - `replay(reducer, initial)` — reconstruct state from all events
   - `replayUntil(reducer, initial, timestamp)` — time-travel
4. Create a reducer for state reconstruction from event sequence
5. Demonstrate full cycle: event creation -> replay -> time-travel

## Checklist

- [ ] All events inherit BaseEvent and use discriminated union (type field)
- [ ] `getByType('MoneyDeposited')` returns `MoneyDeposited[]` (not the general union)
- [ ] `replay` correctly reconstructs state from event sequence
- [ ] `replayUntil` enables "time travel"
- [ ] Reducer uses exhaustive matching for all event types

## How to Verify

Check that `getByType` narrows the type correctly — result elements should only have fields available for the specific event type. Time-travel should show intermediate state.
