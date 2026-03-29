# Task 6.2: State Data Association

## Goal

Implement a state machine with associated data for each state via discriminated union, ensuring type-safe data access through type narrowing.

## Requirements

1. Create a `FetchState<T, E>` type as a discriminated union with variants: `idle` (no data), `loading` (with `startedAt`), `success` (with `data: T` and `fetchedAt`), `error` (with `error: E`, `failedAt`, `retryCount`)
2. Implement state constructors: `idle()`, `loading()`, `success()`, `error()`
3. Implement `foldFetchState` -- exhaustive handling with a handler for each state
4. Implement `mapFetchState` -- data transformation in the success state
5. Create a `FormState` type with 5 states (editing, validating, submitting, submitted, failed), each with unique data
6. Show type narrowing: in each switch branch, only that state's data is accessible

## Checklist

- [ ] `FetchState` is a generic discriminated union with 4 variants
- [ ] In the `success` branch, `data` and `fetchedAt` are available, but not `error`
- [ ] In the `error` branch, `error` and `retryCount` are available, but not `data`
- [ ] `foldFetchState` handles all states exhaustively
- [ ] `mapFetchState` transforms data only in the success state
- [ ] `FormState` demonstrates 5 different data sets for 5 states

## How to Verify

1. Try accessing `state.data` without checking `status` -- should get a TS error
2. In `foldFetchState`, remove a handler -- should get a TS error
3. `mapFetchState` for idle/loading/error should return the state unchanged
