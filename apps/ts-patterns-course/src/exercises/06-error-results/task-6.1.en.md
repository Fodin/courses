# Task 6.1: Result / Either

## Objective

Implement the `Result<T, E>` pattern for type-safe error handling without throw/catch.

## Requirements

1. Create `Ok<T>` and `Err<E>` classes with a `_tag` field ('ok' | 'err')
2. Implement a `map` method — transforms the value inside Ok (Err passes through unchanged)
3. Implement a `flatMap` method — chains operations, each of which returns a Result
4. Implement a `match` method — handles both cases via an `{ ok, err }` object
5. Create a `fromThrowable(fn)` function — wraps a function that can throw into a Result
6. Create `ok(value)` and `err(error)` helper functions
7. Demonstrate a chain: parseJSON → extractField → validateValue

## Checklist

- [ ] `Ok` and `Err` classes with correct `_tag` values
- [ ] `map` works for Ok and passes through Err
- [ ] `flatMap` unwraps nested Results
- [ ] `match` calls the correct handler
- [ ] `fromThrowable` catches throws and returns Err
- [ ] `ok()` / `err()` helpers create instances
- [ ] Operation chain demo works correctly

## How to Verify

- Click the button — the chain of transformations should be displayed
- Ok values pass through map/flatMap
- Err values skip all transformations until match
- fromThrowable correctly catches exceptions
