# Task 7.3: Clean Architecture

## Objective

Implement Clean Architecture: an Entity with business rules, a UseCase for a scenario, and a Repository as a port.

## Requirements

1. **Domain layer — `Order` Entity:**
   - Fields: `id`, `items: OrderItem[]`, `status: OrderStatus`
   - `OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'cancelled'`
   - `total` getter — sum of (price * quantity) across all items
   - `confirm()` method — only from 'pending'
   - `cancel()` method — only from 'pending' or 'confirmed'
   - Throws an Error on an invalid transition

2. **Domain layer — `OrderRepository` port:**
   - `save(order: Order): void`
   - `findById(id: string): Order | null`

3. **Application layer — `CreateOrderUseCase`:**
   - Accepts `OrderRepository` through its constructor
   - `execute(items: OrderItem[])` — creates an Order, validates total > 0, saves it
   - Returns the created Order

4. Demonstrate: order creation, confirm, cancel, and errors on invalid transitions

## Checklist

- [ ] `Order` Entity contains business rules (not the Repository!)
- [ ] `total` is computed correctly
- [ ] `confirm()` works only from 'pending'
- [ ] `cancel()` works from 'pending' and 'confirmed'
- [ ] `CreateOrderUseCase` does not reference the store directly
- [ ] All state transitions are demonstrated

## How to Verify

- Click the button — order operations should be displayed
- Successful transitions: pending → confirmed, pending → cancelled
- Errors: confirm from cancelled, cancel from shipped
