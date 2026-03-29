# Task 13.3: Infrastructure Layer

## Goal

Implement the infrastructure layer with typed repositories, Event Store, and external service adapters.

## Requirements

1. Define a generic `Repository<T, ID>` interface with methods: findById, findAll, save, delete (all returning Result)
2. Implement `InMemoryOrderRepository` implementing Repository<Order>
3. Define a generic `EventStore<E>` interface with methods: append, getStream, getAllEvents
4. Implement `InMemoryEventStore<E>`
5. Define external service interfaces: `NotificationService`, `PaymentGateway`
6. Implement in-memory adapters with call tracking (for testing)
7. Demonstrate: CRUD via Repository, event read/write, external service calls

## Checklist

- [ ] Repository<T, ID> is generic with default ID = string
- [ ] findById returns `Result<T | null>` (null, not error, for missing items)
- [ ] EventStore stores events by streamId
- [ ] append adds to existing stream
- [ ] NotificationService and PaymentGateway return Result
- [ ] In-memory adapters track calls (sent, charges, refunds)
- [ ] Refunding a non-existent transaction returns an error

## How to Verify

1. Save and find an order via Repository
2. Delete an order -- findById returns null
3. Write events and read the stream
4. Make a charge and refund via PaymentGateway
5. Try refunding a non-existent transaction -- get an error
