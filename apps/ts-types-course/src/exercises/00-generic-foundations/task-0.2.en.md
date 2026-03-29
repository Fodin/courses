# Task 0.2: Default Type Parameters

## Goal

Learn to use default type parameters to create flexible APIs that are simple to use by default but allow customization.

## Requirements

1. Create an `ApiResponse<TData = unknown, TError = Error>` interface with `data`, `error`, `status` fields
2. Create a `Collection<TItem, TKey extends keyof TItem = keyof TItem>` interface with `items` and `indexBy` fields
3. Implement `createStore<TState = Record<string, unknown>>(initialState: TState)` returning an object with `getState()` and `setState(partial)`
4. Create a `TypedEvent<T extends EventPayload = EventPayload>` interface with `type` and `payload` fields, where `EventPayload` contains `timestamp: number`
5. Demonstrate each type's usage both with default parameters and explicitly specified ones

## Checklist

- [ ] `ApiResponse` works without generic arguments (defaults `unknown` and `Error` are used)
- [ ] `ApiResponse<User>` correctly types `data` as `User | null`
- [ ] `Collection<Product>` allows any Product key in `indexBy`
- [ ] `Collection<Product, 'id'>` restricts `indexBy` to only `'id'`
- [ ] `createStore` correctly infers state type from `initialState`
- [ ] `TypedEvent` works with default `EventPayload` and with custom payload types

## How to Verify

1. Create `ApiResponse` without parameters and verify `data` has type `unknown | null`
2. Try assigning a string to `indexBy` of type `Collection<Product, 'id'>` — should error
3. Call `store.setState({ nonExistentField: 1 })` — should produce a compile error
