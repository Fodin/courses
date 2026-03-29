# Task 12.1: Error Classes

## Goal

Learn to distinguish operational vs programmer errors, create custom error hierarchies with codes, use `Error.captureStackTrace` and `error.cause`.

## Requirements

1. Explain the difference between operational and programmer errors with examples
2. Show Node.js system error codes (ENOENT, EACCES, EADDRINUSE, etc.)
3. Create a custom error hierarchy: AppError → ValidationError, NotFoundError, DatabaseError
4. Demonstrate Error.captureStackTrace for clean stack traces
5. Show error.cause (ES2022) for error chaining
6. Demonstrate error type checking via instanceof

## Checklist

- [ ] Operational vs programmer errors explained
- [ ] System error codes listed
- [ ] Custom error hierarchy created
- [ ] Error.captureStackTrace used
- [ ] error.cause for error chaining shown
- [ ] instanceof checking demonstrated

## How to verify

1. Click "Run" — all error types should be displayed
2. Verify each error class has unique code and statusCode
3. Check that error.cause preserves the original error
4. Verify instanceof correctly identifies error types
