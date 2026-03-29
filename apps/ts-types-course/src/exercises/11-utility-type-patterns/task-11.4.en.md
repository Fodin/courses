# Task 11.4: Opaque Types

## Goal

Implement an opaque (branded/nominal) type system for domain modeling that prevents accidental mixing of structurally identical types.

## Requirements

1. Implement `Brand<T, B>` via intersection with a branded symbol
2. Create domain types: `UserId`, `PostId`, `Email`, `Money`, `Percentage`
3. Implement smart constructors with validation for each branded type
4. Implement type-safe functions: `getUserById(id: UserId)`, `sendEmail(to: Email)`, `applyDiscount(price: Money, discount: Percentage)`
5. Demonstrate that branded types prevent mixing at compile time
6. Show validation errors with invalid data

## Checklist

- [ ] `Brand<number, "UserId">` creates a nominal type
- [ ] `getUserById(postId)` — compile error (PostId !== UserId)
- [ ] `getUserById(42)` — compile error (number !== UserId)
- [ ] `sendEmail("not-email")` — compile error (string !== Email)
- [ ] `applyDiscount(price, price)` — compile error (Money !== Percentage)
- [ ] Smart constructors validate data and throw errors
- [ ] `createEmail("invalid")` throws Error

## How to Verify

1. Try assigning a plain `number` to a `UserId` variable — should error
2. Try passing `UserId` instead of `PostId` — should error
3. Verify branded types work with arithmetic: `(price as number) + 1`
