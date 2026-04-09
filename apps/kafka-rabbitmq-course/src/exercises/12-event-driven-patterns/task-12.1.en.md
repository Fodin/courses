# Task 12.1: Event Sourcing

## Goal

Implement a visualization of the Event Sourcing pattern for an order aggregate. The student should understand the key idea: state is never saved directly — it is **computed** by replaying the sequence of events from the Event Store. The component shows how a slider controls the "replay point" and recalculates the aggregate state in real time.

## Requirements

1. Define event types: `OrderEventType` = `'OrderCreated' | 'ItemAdded' | 'ItemRemoved' | 'OrderPaid'`.
2. Define a base event interface `OrderEventBase` with fields `id: string`, `type: OrderEventType`, `timestamp: number`, `version: number`, and four specific event interfaces with typed `payload` for each type.
3. Define an aggregate state interface `OrderState` with fields: `orderId`, `customerId`, `items` (array), `status: 'pending' | 'paid'`, `total: number`, `version: number`.
4. Implement a pure function `applyEvent(state: OrderState | null, event: OrderEvent): OrderState` that applies each event to the current state via `switch`, returning a new state (immutably).
5. Declare a `PRESET_EVENTS` array of 5 events: `OrderCreated` → `ItemAdded` (book $49, qty 1) → `ItemAdded` (book $54, qty 2) → `ItemRemoved` (first item) → `OrderPaid`. Versions 1–5.
6. Declare `EVENT_COLORS` and `EVENT_ICONS` dictionaries of type `Record<OrderEventType, string>` for color coding and emoji icons of each event type.
7. Implement state `replayTo: number` (from 0 to `PRESET_EVENTS.length`, initial value = array length).
8. Compute `visibleEvents` as a slice `PRESET_EVENTS.slice(0, replayTo)` and `currentState` via `visibleEvents.reduce(applyEvent, null)`.
9. Display a vertical event timeline: each event — a circle + card; circle is active (colored, with icon) if `idx < replayTo`, otherwise gray with version number.
10. Display the current aggregate state block: if `currentState === null` — a stub "State not initialized"; otherwise — a card with `orderId`, `customerId`, version, list of items with quantity and price, total, status badge.
11. Display an `<input type="range">` from 0 to `PRESET_EVENTS.length` with labels "Start (empty)" and "Replayed: N/5".
12. Add an info block "Key Principle" explaining the Event Sourcing idea.

## Checklist

- [ ] Types `OrderEventType`, `OrderEventBase`, specific events, and `OrderEvent` are declared
- [ ] `OrderState` interface contains all 6 fields
- [ ] `applyEvent` function handles all 4 event types via `switch`
- [ ] On `ItemAdded`, `total` is recalculated via `reduce`
- [ ] On `ItemRemoved`, item is filtered from `items` and `total` is recalculated
- [ ] `PRESET_EVENTS` array contains exactly 5 events with versions 1–5
- [ ] `EVENT_COLORS` and `EVENT_ICONS` are declared for all 4 types
- [ ] Slider correctly controls `replayTo` and redraws the component
- [ ] `currentState` is computed via `reduce` from `visibleEvents`
- [ ] Timeline: active events are colored by type, inactive are gray
- [ ] State block shows stub when `replayTo === 0`
- [ ] State card displays items, total, and status when data exists
- [ ] "Key Principle" info block is present

## How to test yourself

1. Open the task — slider is at maximum, all 5 events are active, state shows order ORD-001 with status "PAID" and total $108.
2. Drag the slider to 0 — state block shows stub, all events are gray.
3. Set slider to 1 — only `OrderCreated` is active, state: empty cart, status "PENDING".
4. Set to 3 — `OrderCreated` + 2x`ItemAdded` are active, 2 items in cart, total $157.
5. Set to 4 — `ItemRemoved` removed the first item, total became $108.
6. Set to 5 — status "PAID", total $108.
7. Verify that `applyEvent` does not mutate the input object — state is always computed from scratch.
