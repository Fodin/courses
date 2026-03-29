# Task 4.2: Variant Types

## Goal

Create a system of type-safe constructors for tagged union types (Variant) that simplifies creation of discriminated unions and ensures correct typing.

## Requirements

1. Implement a generic type `Variant<Tag, Data?>` where `Data` is optional — variants can be with or without data
2. Create an overloaded constructor function `variant(tag)` and `variant(tag, data)`
3. Implement a `RemoteData<E, A>` type with variants: `NotAsked`, `Loading`, `Failure<E>`, `Success<A>`
4. Create constructors for each RemoteData variant
5. Implement a `matchVariant()` function for pattern matching on the `_tag` field
6. Demonstrate with a `PaymentResult` example with variants: `Approved`, `Declined`, `Pending`, `Refunded`

## Checklist

- [ ] `Variant<'Ok', { id: number }>` produces type `{ readonly _tag: 'Ok'; readonly data: { id: number } }`
- [ ] `Variant<'NotAsked'>` produces type `{ readonly _tag: 'NotAsked' }` (no data)
- [ ] Function `variant('Ok', data)` returns a correctly typed object
- [ ] Function `variant('NotAsked')` works without a second argument
- [ ] `matchVariant()` provides exhaustive handling of all variants
- [ ] In `matchVariant` handlers, data for each specific variant is accessible with correct types

## How to Verify

1. `variant('Success', 42)` should have type `Variant<'Success', number>`
2. `variant('Loading')` should have type `Variant<'Loading'>` without `data` field
3. In `matchVariant`, try omitting a variant — there should be a compilation error
