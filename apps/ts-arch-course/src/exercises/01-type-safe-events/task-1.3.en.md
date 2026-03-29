# Task 1.3: DOM Events Typing

## 🎯 Goal

Create a type-safe wrapper over the DOM CustomEvent API, ensuring a link between event name and detail type.

## Requirements

1. Define a `CustomEventMap` with at least 5 custom DOM events
2. Implement `dispatchTypedEvent()` — dispatch event with typed detail
3. Implement `onTypedEvent()` — subscribe with automatic detail type inference, returns cleanup
4. Create a conditional type `TypedElementEvents<E>` that determines available events based on HTML element type
5. Demonstrate dispatch and subscription for all events

## Checklist

- [ ] `dispatchTypedEvent('app:theme-change', { theme: 'blue' })` causes error
- [ ] `onTypedEvent` automatically infers detail type from event name
- [ ] Cleanup function correctly removes the listener
- [ ] `TypedElementEvents` uses conditional types for element-specific events
- [ ] Events use bubbles: true for correct bubbling

## How to Verify

Dispatch an event and verify the subscriber receives payload with the correct type. Make sure the cleanup function actually prevents handler calls after unsubscribing.
