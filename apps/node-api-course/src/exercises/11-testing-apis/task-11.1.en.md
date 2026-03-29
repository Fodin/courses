# Task 11.1: Unit Testing

## 🎯 Goal

Master API unit testing: mocking dependencies with vi.fn()/vi.spyOn(), testing services and request handlers in isolation.

## Requirements

1. Create mock dependencies (Database, Mailer) via `vi.fn()` with `mockResolvedValue`
2. Test services: verify mock calls (toHaveBeenCalledWith, toHaveBeenCalledTimes)
3. Create mock req/res for testing handlers without Express
4. Test happy path (200) and error path (404, 400)
5. Use beforeEach for mock reset and afterEach for restoreAllMocks

## Checklist

- [ ] Dependencies mocked via vi.fn() with correct return values
- [ ] Tests verify both results and mock interactions
- [ ] Mock req/res allow testing handlers in isolation
- [ ] Happy path and error cases covered
- [ ] Mocks reset between tests

## How to Verify

Click "Run" and verify that: mocks are created and verified, handlers tested via mock req/res, all tests pass.
