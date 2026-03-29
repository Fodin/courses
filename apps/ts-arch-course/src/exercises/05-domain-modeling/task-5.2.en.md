# Task 5.2: Entities & Aggregates

## Goal

Implement an Entity model with ID-based identity and an Aggregate with a root entity that controls business invariants.

## Requirements

1. Create a generic `EntityId<T>` type based on branded types for typed identifiers
2. Implement a base `Entity<Id>` interface with fields `id`, `createdAt`, `updatedAt`
3. Create an `Order` aggregate with nested `OrderItem` entities
4. `Order` must be the Aggregate Root: all operations on `OrderItem` go through Order functions
5. Implement operations: `createOrder` (minimum 1 item), `addItemToOrder` (draft only), `confirmOrder`
6. All changes must return a new object (immutability) and update `updatedAt`

## Checklist

- [ ] `OrderId` and `OrderItemId` are different types, incompatible with each other
- [ ] `createOrder` with empty items array throws an error
- [ ] `addItemToOrder` works only for orders with `draft` status
- [ ] `confirmOrder` changes status and updates `updatedAt`
- [ ] Two `OrderItem`s with identical data have different `id`s
- [ ] `calculateOrderTotal` correctly sums prices accounting for quantities

## How to Verify

1. Create an order, add an item, confirm it -- check statuses at each step
2. Try adding an item to a confirmed order -- should throw an error
3. Compare IDs of two independently created OrderItems -- they should be unique
