# Task 7.2: Context Accumulation

## 🎯 Goal

Implement a context accumulation pattern where each middleware extends the context type with new properties, and TypeScript guarantees the correct execution order.

## Requirements

1. Create an `AccumulatingMiddleware<TIn, TOut extends TIn>` type — a function that extends the context type
2. Define an interface chain: `BaseContext` -> `WithUser` -> `WithPermissions` -> `WithAudit`
3. Implement middleware for each extension step:
   - `addUser`: adds `user` with fields `id`, `name`, `role`
   - `addPermissions`: adds `permissions` based on `user.role`
   - `addAudit`: adds `audit` with fields `action`, `userId`, `time`
4. Implement a `pipe()` function with overloads for type-safe composition (minimum 3 overloads)

## Checklist

- [ ] `AccumulatingMiddleware<TIn, TOut>` constrains `TOut extends TIn`
- [ ] Each middleware returns an extended type via spread
- [ ] `addPermissions(baseCtx)` causes a compile error (no `user`)
- [ ] `addAudit(withUserCtx)` causes a compile error (no `permissions`)
- [ ] `pipe(base, addUser, addPermissions)` returns `WithPermissions`
- [ ] `pipe()` overloads check middleware compatibility

## How to Verify

Try breaking middleware order in `pipe()` — TypeScript should show an error. Verify that `pipe()` result has all accumulated properties with correct types.
