# Task 13.1: Domain Layer

## Goal

Build a complete domain layer with Value Objects, entities, domain events, and specifications for an order management system.

## Requirements

1. Create Value Objects: `Email` (normalization, validation) and `Money` (amount, currency, add operation, negative protection)
2. Both Value Objects use private constructors and factory method `create()` returning `Result<T>`
3. Define `DomainEvent` as a discriminated union with types: OrderCreated, ItemAdded, OrderConfirmed, OrderCancelled
4. Implement the `Order` entity (immutable interface) and pure functions: `createOrder`, `addItem`, `confirmOrder`, `cancelOrder`
5. Each function returns `Result<Order>` and appends the corresponding event
6. Implement the Specification pattern with combinators `and`, `or`, `not`
7. Create specifications: `isDraft`, `isConfirmed`, `hasItems`, `totalOver(amount)`

## Checklist

- [ ] Email.create normalizes to lowercase and validates format
- [ ] Money.create rejects negative amounts and invalid currency
- [ ] Money.add checks currency match
- [ ] addItem to non-draft order returns an error
- [ ] confirmOrder on empty order returns an error
- [ ] Each operation appends a DomainEvent
- [ ] Specifications combine: isDraft.and(hasItems)
- [ ] All objects are immutable (readonly)

## How to Verify

1. Create Email with mixed case -- result should be lowercase
2. Try creating Money with negative amount -- should get an error
3. Go through full order lifecycle: create -> add items -> confirm
4. Verify that after confirmation, items cannot be added
5. Ensure events are recorded in correct order
