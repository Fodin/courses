# Task 13.5: Full Wiring

## Goal

Wire all application layers through a DI container while maintaining full type safety, and demonstrate an end-to-end scenario from API request to event persistence.

## Requirements

1. Create a generic `Container` with methods: `register(token, factory)`, `resolve(token)`, `has(token)`
2. Container must cache instances (singleton behavior)
3. Define `TokenMap` -- a mapping of tokens to service types
4. Create `TypedContainer` with `resolve<K extends keyof TokenMap>(token): TokenMap[K]`
5. Implement `wireApplication()` that registers all services in the correct order
6. Demonstrate a full end-to-end scenario:
   - Create order via API
   - Add items
   - Confirm order
   - Process payment via PaymentGateway
   - Send notification via NotificationService
   - Store events in EventStore
7. Show infrastructure state after all operations

## Checklist

- [ ] Container caches instances (resolve twice returns same object)
- [ ] Resolving a non-existent service throws an error
- [ ] TokenMap maps string keys to specific types
- [ ] TypedContainer.resolve('apiController') returns ApiController (not unknown)
- [ ] wireApplication registers: infrastructure -> application -> API
- [ ] End-to-end scenario passes through all layers without errors
- [ ] Event stream contains all order events
- [ ] Notifications and payments are tracked

## How to Verify

1. Call `wireApplication()` -- container is ready
2. Create an order via `api.createOrder` -- get 201
3. Go through the full cycle: create -> addItems -> confirm -> pay -> notify
4. Check EventStore -- all events recorded
5. Check NotificationService and PaymentGateway -- calls tracked
6. Verify that TypedContainer doesn't allow resolve('invalidToken')
