# Task 5.3: Event Pipeline Design (E-commerce)

## Objective

Design an event-driven pipeline for order processing in e-commerce: from creation to delivery. For each stage, determine the event type, queue, delivery guarantee, idempotency key, and error handling strategy.

## Requirements

1. Implement an interactive table with 5 order stages:
   - **Order creation** — OrderCreated
   - **Payment processing** — PaymentProcessed / PaymentFailed
   - **Warehouse reservation** — InventoryReserved / InventoryFailed
   - **Shipment** — ShipmentCreated
   - **Customer notification** — NotificationSent
2. For each stage, show:
   - Event type (event name)
   - Pattern (Queue or Topic)
   - Delivery guarantee (at-most-once / at-least-once)
   - Idempotency key (what is used for deduplication)
   - Error handling (retry policy + fallback)
3. Visualize the order flow:
   - Current stage (highlighted in color)
   - Switching between stages on click
   - Status: success / error / waiting
4. Show an example event payload for the selected stage (JSON)

## Checklist

- [ ] 5 order stages with descriptions
- [ ] For each stage: event, pattern, delivery, idempotency key, error handling
- [ ] Visual flow with current stage highlighting
- [ ] Stage switching
- [ ] Example JSON payload for each stage
- [ ] Justification of delivery guarantee choice for each stage
- [ ] Error scenario: what happens on failure at each stage

## How to Check Yourself

1. Payment — at-least-once + idempotency (payment loss is unacceptable)
2. Notification — at-most-once is acceptable (duplicate email is annoying but not critical)
3. Inventory — at-least-once + idempotency key = orderId (double reservation is a problem)
4. OrderCreated is published to a Topic (multiple subscribers: payment, analytics, fraud)
5. Each payload contains orderId, timestamp, and sufficient data for processing
