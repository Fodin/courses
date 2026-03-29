# Task 13.2: Application Layer

## Goal

Create an application layer with typed Command and Query handlers using Result types and the CQS (Command-Query Separation) pattern.

## Requirements

1. Define `Command` as a discriminated union: CreateOrder, AddItem, ConfirmOrder, CancelOrder
2. Define `Query` as a discriminated union: GetOrder, ListOrders, GetOrderTotal
3. Create `CommandHandler<C, R>` and `QueryHandler<Q, R>` types with an `execute` method
4. Implement command handlers: createCreateOrderHandler, createAddItemHandler, createConfirmOrderHandler, createCancelOrderHandler
5. Implement query handlers: createGetOrderHandler, createListOrdersHandler
6. Each handler receives dependencies (store) via closure and returns `Result<T>`
7. Demonstrate a full scenario: creation, adding items, confirmation, cancellation, queries

## Checklist

- [ ] Command and Query are discriminated unions
- [ ] CommandHandler is typed via `Extract<Command, { type: ... }>`
- [ ] CreateOrder returns `Result<string>` (new order id)
- [ ] AddItem for non-existent order returns an error
- [ ] ConfirmOrder on empty order delegates error from domain
- [ ] ListOrders supports filtering by status
- [ ] All errors are passed via Result, not via throw

## How to Verify

1. Create an order via handler -- get an id
2. Add items -- status ok
3. Confirm an empty order -- get an error from domain
4. Query order list with status filter
5. Try adding an item to a confirmed order -- get an error
