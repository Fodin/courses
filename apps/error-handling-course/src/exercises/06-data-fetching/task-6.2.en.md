# Task 6.2: API Errors

## Goal
Create an ApiError class and demonstrate typed handling of API errors.

## Requirements
1. Create `ApiError extends Error` class with fields: `status`, `code`, `details`
2. Create an API simulator function with different responses (200, 403, 404, 500)
3. Handle each error type via `instanceof ApiError`
4. Show error details (status, code, message, details)

## Checklist
- [ ] `ApiError` class with status, code, details
- [ ] API simulator with different responses
- [ ] Typed handling via instanceof
- [ ] Error details displayed
