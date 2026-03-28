# Task 4.2: Middleware

## Objective

Implement an HTTP-like middleware pipeline with a type-safe request processing chain.

## Requirements

1. Create `HttpRequest` and `HttpResponse` interfaces:
   - `HttpRequest`: `method`, `url`, `headers`, optional `body`
   - `HttpResponse`: `status`, `body`, `headers`
2. Create the `Middleware` type: a function `(request, next) => HttpResponse`
3. Create the function `createPipeline(...middlewares)` — assembles middleware into a chain
4. Implement three middlewares:
   - `loggingMiddleware` — adds an `X-Log` header with request information
   - `authMiddleware` — checks the `authorization` header, returns 401 if absent
   - `corsMiddleware` — adds CORS headers to the response
5. Demonstrate authorized and unauthorized requests

## Checklist

- [ ] Interfaces `HttpRequest` and `HttpResponse` are defined
- [ ] `Middleware` type correctly types `next`
- [ ] `createPipeline` assembles the chain via `reduceRight`
- [ ] `authMiddleware` stops the chain when there is no token
- [ ] `loggingMiddleware` adds request information
- [ ] `corsMiddleware` adds CORS headers
- [ ] Both scenarios (with and without a token) are demonstrated

## How to verify

- A request with `authorization` should pass through all middlewares and return status 200
- A request without `authorization` should return status 401 and not reach the handler
