# Task 5.5: Invariant Types

## Goal

Learn to encode domain invariants in the TypeScript type system, making invalid states impossible at compile time.

## Requirements

1. Implement a `NonEmptyArray<T>` type and a `headOf` function that safely extracts the first element
2. Create workflow types: `UnverifiedEmail` and `VerifiedEmail` with different branded types
3. The `sendNewsletter` function should only accept `VerifiedEmail` -- passing `UnverifiedEmail` should be a compilation error
4. Implement `NonNegativeBalance` with `deposit` and `withdraw` operations (with insufficient funds check)
5. Create `Percentage` -- a number from 0 to 100 with an `applyDiscount` function

## Checklist

- [ ] `NonEmptyArray<T>` guarantees at least one element via tuple type
- [ ] `headOf` returns `T`, not `T | undefined`
- [ ] `createNonEmpty([])` throws an error
- [ ] `sendNewsletter(unverifiedEmail, ...)` causes a compilation error
- [ ] `withdraw` with amount greater than balance throws an error
- [ ] `createPercentage(150)` throws an error

## How to Verify

1. Check the return type of `headOf` -- it should be `T`, not `T | undefined`
2. Try passing `UnverifiedEmail` to `sendNewsletter` -- should be a TS error
3. The chain `deposit -> withdraw -> withdraw` should correctly track the balance
