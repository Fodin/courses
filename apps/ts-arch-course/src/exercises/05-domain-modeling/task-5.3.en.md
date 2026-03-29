# Task 5.3: Domain Events

## Goal

Implement a type-safe domain event system with EventBus, supporting subscription, unsubscription, and event logging.

## Requirements

1. Create a generic `DomainEvent<T, P>` interface with fields `type`, `payload`, `timestamp`, `eventId`
2. Define concrete order event types: `OrderCreated`, `OrderItemAdded`, `OrderConfirmed`, `OrderCancelled`
3. Implement an `EventBus<E>` class with methods `on(type, handler)`, `emit(event)`, `getLog()`
4. The `on` method should return an unsubscribe function
5. Handlers should receive typed payload based on event type (via `Extract`)
6. `getLog()` returns the history of all emitted events

## Checklist

- [ ] `DomainEvent` is generic over type and payload
- [ ] `on('OrderCreated', handler)` -- handler receives correctly typed event
- [ ] `on` returns an unsubscribe function, after which the handler is not called
- [ ] `emit` calls all registered handlers for the given type
- [ ] `getLog()` contains complete event history
- [ ] Component demonstrates subscribe, emit, unsubscribe, and re-emit

## How to Verify

1. In the `OrderCreated` handler, verify `event.payload.orderId` is accessible without TS errors
2. After unsubscribing, the handler should not fire on the next `emit`
3. `getLog()` should contain all events, including those with no handlers
