# Task 1.2: Custom Error Classes

## Goal

Learn to create your own error classes with additional context.

## Requirements

1. Create a `ValidationError extends Error` class with a `field: string` field
2. Create an `HttpError extends Error` class with a `statusCode: number` field
3. Create a `NotFoundError extends HttpError` class with code 404
4. In each class, set `this.name` to the class name
5. Demonstrate that `NotFoundError` is both an `HttpError` and an `Error`

## Checklist

- [ ] `ValidationError` created with `field` field
- [ ] `HttpError` created with `statusCode` field
- [ ] `NotFoundError` inherits from `HttpError`
- [ ] `this.name` set in all classes
- [ ] `instanceof` chain works correctly
