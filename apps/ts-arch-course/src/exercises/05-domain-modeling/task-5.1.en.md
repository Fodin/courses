# Task 5.1: Value Objects

## Goal

Implement immutable Value Objects using branded types, ensuring type safety for domain primitives and preventing type confusion.

## Requirements

1. Implement a base `Brand<T, B>` type using `unique symbol` to prevent structural compatibility
2. Create branded types: `Email`, `Money`, `PositiveInt`, `UserId`
3. For each branded type, implement a factory function with validation: `createEmail`, `createMoney`, `createPositiveInt`, `createUserId`
4. Create a composite Value Object `Price` with fields `amount: Money` and `currency: Currency`
5. Implement operations: `addPrices` (with currency match check), `formatPrice`
6. Demonstrate that mixing different branded types causes a compilation error

## Checklist

- [ ] `Brand<T, B>` uses `unique symbol` for type isolation
- [ ] `createEmail` validates format and converts to lowercase
- [ ] `createMoney` rounds to 2 decimal places
- [ ] `createPositiveInt` rejects non-integer and non-positive numbers
- [ ] `addPrices` throws an error for different currencies
- [ ] Component demonstrates successful and failed creation attempts

## How to Verify

1. Try assigning a regular `string` to an `Email` variable -- there should be a TS error
2. Try passing `Email` where `UserId` is expected -- there should be a TS error
3. `createEmail('invalid')` should throw a runtime error
