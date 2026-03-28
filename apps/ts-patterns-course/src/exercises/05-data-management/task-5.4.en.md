# Task 5.4: Event Sourcing (Bank Account)

## Objective

Implement the Event Sourcing pattern using a bank account as an example: store a history of events and restore the current state through replay.

## Requirements

1. Define a base `DomainEvent` interface:
   - `type: string`
   - `timestamp: number`
   - `aggregateId: string`
2. Define bank account events as a discriminated union `AccountEvent`:
   - `AccountOpened` — with an `ownerName: string` field
   - `MoneyDeposited` — with an `amount: number` field
   - `MoneyWithdrawn` — with an `amount: number` field
   - `AccountClosed` — with a `reason: string` field
3. Define `AccountState`:
   - `ownerName: string`, `balance: number`, `isOpen: boolean`, `transactions: number`
4. Implement `EventStore`:
   - `append(event: AccountEvent): void` — append an event
   - `getEvents(aggregateId: string): AccountEvent[]` — all events for an aggregate
   - `getEventsAfter(aggregateId: string, timestamp: number): AccountEvent[]` — events after a point in time
5. Implement the `replay(events: AccountEvent[]): AccountState` function:
   - Applies events sequentially to compute the current state
   - `AccountOpened`: sets ownerName, balance = 0, isOpen = true
   - `MoneyDeposited`: increases balance, increments transactions
   - `MoneyWithdrawn`: decreases balance, increments transactions
   - `AccountClosed`: sets isOpen = false
6. Demonstrate: account opening, deposits, withdrawals, and state restoration at any point in time

## Checklist

- [ ] `DomainEvent` interface with type, timestamp, aggregateId
- [ ] Discriminated union `AccountEvent` with 4 event types
- [ ] `AccountState` type is defined
- [ ] `EventStore` stores and filters events
- [ ] `replay` correctly restores state from an array of events
- [ ] Demo shows the full operation history
- [ ] State restoration to an intermediate point in time is demonstrated

## How to Verify

1. Click the run button
2. Confirm that the balance is computed correctly from the event sequence
3. Verify that replaying to an intermediate point gives the correct balance
4. Confirm that the transaction count matches the number of deposit/withdraw events
