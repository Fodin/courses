# Task 1.3: Error Hierarchy

## Goal

Build a multi-level error hierarchy for a real application.

## Requirements

1. Create a base `AppError extends Error` class with fields:
   - `code: string` — error code
   - `timestamp: Date` — time of occurrence
2. Create `DatabaseError extends AppError` with an optional `query?: string` field
3. Create `NetworkError extends AppError` with `url: string` and optional `status?: number` fields
4. Create `AuthError extends AppError`
5. Demonstrate handling different errors through an `instanceof` chain

## Checklist

- [ ] `AppError` with `code` and `timestamp` fields
- [ ] `DatabaseError`, `NetworkError`, `AuthError` inherit from `AppError`
- [ ] Each subclass adds its own fields
- [ ] All errors pass `instanceof AppError` check
- [ ] Results with context displayed on the page
