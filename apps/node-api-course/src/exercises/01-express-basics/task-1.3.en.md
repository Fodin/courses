# Task 1.3: Error Handling

## 🎯 Goal

Implement centralized error handling in Express: error-handling middleware, custom error classes, and an async handler wrapper.

## Requirements

1. Create error-handling middleware with 4 arguments `(err, req, res, next)`
2. Implement an `AppError` class with `message`, `statusCode`, `code` fields for typed errors (404, 409, 401, 403, 422)
3. Implement `asyncHandler` -- a wrapper that catches errors from async functions and passes them to `next()`
4. Show the error flow: handler throws -> asyncHandler catches -> errorHandler responds

## Checklist

- [ ] Error middleware has exactly 4 arguments (Express identifies it by argument count)
- [ ] `AppError` contains `statusCode` and machine-readable `code`
- [ ] `asyncHandler` wraps `Promise.resolve(fn()).catch(next)`
- [ ] Full flow shown: error in handler -> catch -> error middleware -> JSON response to client
- [ ] Error middleware is last in the `app.use` chain

## How to Verify

Click "Run" and verify the simulation shows: creating errors of different types, passing through asyncHandler, and forming a JSON response with the correct status code.
