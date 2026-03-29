# Task 0.1: Type-Safe HTTP Client

## 🎯 Goal

Create a generic wrapper around `fetch` that provides full type safety: typed responses, required/optional request body, and a discriminated union for results.

## Requirements

1. Create an `ApiEndpoint<TResponse, TBody>` interface with phantom types for storing response and body type information
2. Implement an `endpoint()` factory function for creating typed endpoint descriptors
3. Create an `ApiResult<T>` type as a discriminated union with `ok: true` (data) and `ok: false` (error) variants
4. Implement a `typedFetch()` function that:
   - Accepts an endpoint and optionally a request body
   - Requires body only for endpoints with a body type (POST/PUT)
   - Forbids body for endpoints without a body (GET/DELETE)
   - Returns `Promise<ApiResult<TResponse>>`
5. Create an API catalog with at least 4 endpoints (GET, POST, PUT, DELETE)

## Checklist

- [ ] `ApiEndpoint` uses phantom types for `TResponse` and `TBody`
- [ ] `typedFetch(api.getUsers)` returns `Promise<ApiResult<User[]>>`
- [ ] `typedFetch(api.createUser, body)` requires request body
- [ ] `typedFetch(api.getUsers, body)` causes a compile error
- [ ] `typedFetch(api.createUser)` without body causes a compile error
- [ ] `ApiResult` is handled via `result.ok` check

## How to Verify

Try calling `typedFetch` with incorrect arguments — TypeScript should show an error. Verify that autocomplete works for response fields after checking `result.ok`.
