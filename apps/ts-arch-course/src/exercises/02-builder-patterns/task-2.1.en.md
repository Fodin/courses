# Task 2.1: Step Builder

## 🎯 Goal

Implement a Step Builder for HTTP requests that enforces correct method call order at the type level: choose method -> body (for POST/PUT) -> configure -> build.

## Requirements

1. Create 3 step interfaces, each providing only valid methods
2. Step 1: choose HTTP method (get, post, put, delete) — each leads to the appropriate step
3. Step 2 (POST/PUT only): set request body
4. Step 3: configure headers, timeout, and call build()
5. GET and DELETE should skip the body step and go straight to configuration
6. Implement a `createRequestBuilder()` factory function with correct transitions

## Checklist

- [ ] `createRequestBuilder().get("/url").body({})` — compile error
- [ ] `createRequestBuilder().post("/url").build()` — error (body needed)
- [ ] `createRequestBuilder().build()` — error (method needed)
- [ ] Chain header().header().timeout().build() works
- [ ] build() returns a complete HttpRequest object

## How to Verify

Try all invalid call chains — TypeScript should show errors. Every GET/DELETE should skip past the body step.
