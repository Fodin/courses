# Task 3.4: Chain of Responsibility

## Objective

Implement a chain of HTTP request handlers: authorization, rate limiting, validation, logging.

## Requirements

1. Define the `HttpRequest` interface with fields: `userId`, `token`, `body`, `timestamp`, `logs: string[]`
2. Create a `Handler<T>` interface with methods:
   - `setNext(handler: Handler<T>): Handler<T>`
   - `handle(request: T): T | null` (null = request rejected)
3. Create an abstract `BaseHandler` with implementations of `setNext` and passing to `next`
4. Implement the handlers:
   - `AuthHandler` — validates the token against a set of valid tokens
   - `RateLimitHandler` — counts requests per userId, rejects when the limit is exceeded
   - `ValidationHandler` — checks that the body is not empty
   - `LogHandler` — logs the request passing through
5. Assemble the chain: Auth → RateLimit → Validation → Log
6. Demonstrate: a valid request, an invalid token, an empty body, and a rate limit exceeded

## Checklist

- [ ] `Handler<T>` is typed with a generic
- [ ] `BaseHandler` implements passing to the next handler
- [ ] `AuthHandler` rejects invalid tokens
- [ ] `RateLimitHandler` counts requests and rejects on limit exceeded
- [ ] `ValidationHandler` checks for the presence of a body
- [ ] `LogHandler` logs the final processing
- [ ] A rejected request does not reach subsequent handlers

## How to verify

1. Click the run button
2. Verify that a valid request passes through all 4 handlers
3. Verify that an invalid token is rejected at the first step
4. Verify that exceeding the rate limit rejects the request
