# Task 10.2: Cross-Module Contracts

## 🎯 Goal

Create a cross-module interaction system through shared contracts: generic Repository, typed EventBus, and modules depending on minimal interfaces.

## Requirements

1. Create a base `Entity` interface (`id`, `createdAt`, `updatedAt`)
2. Create a generic `Repository<T extends Entity>` with CRUD methods:
   - `findById`, `findAll`, `create`, `update`, `delete`
   - `create` accepts `Omit<T, 'id' | 'createdAt' | 'updatedAt'>`
3. Create an `EventBus<TEvents>` with type-safe `emit` and `on` (with unsubscribe)
4. Create a Products module with `ProductEvents` and an Orders module
5. Orders depends on Products through a **minimal** interface (only `getProduct`)
6. Create in-memory implementations of Repository and EventBus

## Checklist

- [ ] `Repository<Product>` and `Repository<Order>` use one generic contract
- [ ] `EventBus<ProductEvents>` checks payload type on `emit`
- [ ] `on` returns an unsubscribe function
- [ ] Orders depends on `{ getProduct: ... }`, not the entire ProductModule
- [ ] Events are delivered to all subscribers in subscription order
- [ ] In-memory implementations fully satisfy the contracts

## How to Verify

Create products via ProductModule, orders via OrderModule, and verify that events are delivered. Ensure that OrderModule cannot call `addProduct` or other ProductModule methods not specified in the contract.
