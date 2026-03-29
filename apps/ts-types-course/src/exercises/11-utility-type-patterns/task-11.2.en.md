# Task 11.2: XOR Type

## Goal

Implement `XOR<A, B>` that enforces mutually exclusive union types: an object can have properties from either A or B, but never both simultaneously.

## Requirements

1. Demonstrate the problem: show that regular `A | B` allows both sets of properties
2. Implement `Without<T, U>` — makes keys from T (absent in U) optional with type `never`
3. Implement `XOR<T, U>` via combination of `Without` and intersection
4. Implement `XOR3<A, B, C>` for three mutually exclusive variants
5. Show a practical example: three payment methods (card, bank, crypto)
6. Implement a `processPayment` function that handles the XOR type

## Checklist

- [ ] Regular union `CardPayment | BankTransfer` allows both (demonstrated)
- [ ] `XOR<CardPayment, BankTransfer>` accepts only one set
- [ ] Attempting to provide both sets of properties causes a compile error
- [ ] `XOR3` works with three mutually exclusive variants
- [ ] `processPayment` correctly handles all variants via type narrowing

## How to Verify

1. Try assigning an object with fields from both types — should error
2. Verify TypeScript correctly narrows the type inside if-checks
3. Check that each XOR variant is accepted individually
