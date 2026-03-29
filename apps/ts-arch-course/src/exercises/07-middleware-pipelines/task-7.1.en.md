# Task 7.1: Middleware Chain

## 🎯 Goal

Create a type-safe middleware chain where each middleware receives a typed context and can continue the chain via `next()` or short-circuit by returning a result directly.

## Requirements

1. Create a `Middleware<TContext>` type — a function taking context and `next`, returning `TContext`
2. Implement `createMiddlewareChain(initialContext, ...middlewares)` that executes middleware sequentially
3. Each middleware should be able to:
   - Call `next()` to pass control to the next middleware
   - Return a result directly (short-circuit) without calling `next()`
4. Create a `RequestContext` interface with fields: `path`, `method`, `headers`, `body`, `status`, `responseBody`, `logs`
5. Implement at least 3 middleware: logging, auth, handler

## Checklist

- [ ] `Middleware<TContext>` accepts `ctx: TContext` and `next: () => TContext`
- [ ] `createMiddlewareChain` executes middleware in order
- [ ] Middleware can short-circuit by not calling `next()`
- [ ] Auth middleware returns 401 without calling `next()` when token is missing
- [ ] Logging middleware logs before and after calling `next()`
- [ ] All context types are verified by the compiler

## How to Verify

Create a chain of 3-4 middleware and test two scenarios: with a token (chain completes fully) and without a token (chain stops at auth). Verify that all middleware receive the correct context type.
