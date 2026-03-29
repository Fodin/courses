# Task 7.3: Interceptors

## 🎯 Goal

Implement an interceptor pattern with typed before/after hooks and error handling, following the onion model.

## Requirements

1. Create an `Interceptor<TReq, TRes>` interface with optional hooks:
   - `before: (req: TReq) => TReq` — request transformation
   - `after: (res: TRes) => TRes` — response transformation
   - `onError: (error: Error, req: TReq) => TRes | never` — error handling
2. Implement `createInterceptorPipeline(interceptors, handler)`:
   - Before hooks execute in forward order
   - After hooks execute in reverse order
   - Error hooks are tried in reverse order
3. Create at least 3 interceptors: auth (before), timing (before + after), error handler (onError)

## Checklist

- [ ] `Interceptor<TReq, TRes>` has typed `before`, `after`, `onError`
- [ ] Before hooks execute in forward order (1 -> 2 -> 3)
- [ ] After hooks execute in reverse order (3 -> 2 -> 1)
- [ ] On handler error, error hooks are tried in reverse order
- [ ] Auth interceptor adds authorization header
- [ ] Error interceptor returns a typed error response

## How to Verify

Create a pipeline with 3 interceptors and test two scenarios: successful request (before -> handler -> after) and handler error (before -> handler throws -> onError). Verify that request and response types are preserved at all stages.
