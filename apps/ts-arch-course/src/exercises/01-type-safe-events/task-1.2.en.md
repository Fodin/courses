# Task 1.2: Event Bus

## 🎯 Goal

Create a centralized event bus with middleware support, event history, and type-safe publish/subscribe.

## Requirements

1. Create an `EventBus<TEvents>` class with `subscribe()`, `publish()`, and `use()` methods
2. Implement a middleware chain: each middleware receives event, payload, and `next()`
3. Middleware can modify behavior, log, or block events (by not calling next)
4. Add event history: `getHistory()`, `clearHistory()`
5. Create at least 2 middlewares (logging and timer)
6. Use a realistic set of business events

## Checklist

- [ ] `publish` checks payload type for each event
- [ ] Middlewares are called in order of registration
- [ ] Middleware can interrupt the chain by not calling `next()`
- [ ] History contains all dispatched events with timestamps
- [ ] `subscribe` returns an unsubscribe function

## How to Verify

Add a middleware that doesn't call `next()` for a specific event. Verify that subscribers to that event don't receive notifications. Check history for completeness.
