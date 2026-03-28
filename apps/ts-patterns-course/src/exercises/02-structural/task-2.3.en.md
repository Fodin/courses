# Task 2.3: Facade

## Objective

Implement the Facade pattern — create an `OrderFacade` that simplifies working with three subsystems: `InventoryService`, `PaymentService`, `ShippingService`.

## Requirements

1. Use the provided subsystems:
   - `InventoryService` — method `check(productId): { available, quantity }` and `reserve(productId): boolean`
   - `PaymentService` — method `charge(userId, amount): { success, transactionId?, error? }`
   - `ShippingService` — method `createShipment(orderId, address): { trackingId }`
2. Define interfaces:
   - `OrderRequest` with fields: `orderId`, `productId`, `userId`, `amount`, `address`
   - `OrderResult` with fields: `success`, `orderId?`, `error?`, `logs`
3. Create the `OrderFacade` class:
   - Accepts three services via the constructor
   - Method `placeOrder(order: OrderRequest): OrderResult` coordinates:
     - Step 1: Check product availability
     - Step 2: Charge payment
     - Step 3: Reserve the product
     - Step 4: Create shipment
   - On failure at any step — returns `{ success: false }` with a description
   - Each step is logged to the `logs` array
4. Demonstrate three scenarios: success, product out of stock, insufficient funds

## Checklist

- [ ] Interfaces `OrderRequest` and `OrderResult` are defined
- [ ] `OrderFacade` accepts three services via the constructor
- [ ] Method `placeOrder` coordinates all four steps
- [ ] On failure at any step, the facade stops and returns an error
- [ ] Each step writes a log entry to the `logs` array
- [ ] Demonstration shows all three scenarios

## How to verify

1. Click the run button
2. Order with `PROD-1` and `user-1` (sufficient funds) — successfully completes all 4 steps
3. Order with `PROD-2` (qty=0) — stops at the availability check step
4. Order with `user-2` (balance 50) and amount 200 — stops at the payment step
5. Logs reflect each completed step
