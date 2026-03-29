# Task 5.2: Polymorphic Handlers

## Goal

Learn to create type-safe dispatch tables for handling discriminated union variants.

## Requirements

1. Create a discriminated union `AppEvent` with at least 4 event types, each with a unique `payload`
2. Create a utility type `EventPayload<T>` that extracts the payload by event type using `Extract`
3. Implement a type-safe dispatch table `EventHandlers` where each handler receives the correct payload type
4. Create a generic function `dispatch<T>(type, payload)` that invokes the corresponding handler
5. Demonstrate a middleware pattern: a function that accepts `AppEvent` and a `next` callback

## Checklist

- [ ] `AppEvent` contains at least 4 variants with different payloads
- [ ] `EventPayload<T>` correctly extracts payload via `Extract`
- [ ] Dispatch table is typed via mapped type
- [ ] `dispatch` function is generic and validates type-payload correspondence
- [ ] Middleware is correctly typed

## How to verify

1. Click the "Run" button
2. Verify that each dispatch calls the correct handler
3. Try calling `dispatch('USER_LOGIN', { url: '/' })` — there should be a type error
4. Verify that middleware handles the event and calls `next`
