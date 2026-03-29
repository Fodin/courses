# Task 4.1: Zod Validation

## 🎯 Goal

Implement API request validation with Zod: schemas for body, params, query, error formatting, and TypeScript type inference.

## Requirements

1. Define a Zod schema for creating a user: `name` (string, min 2), `email` (email), `age` (int, optional), `role` (enum), `tags` (array)
2. Create a composite schema validating body, params, and query in one object
3. Demonstrate validation of valid and invalid requests via `safeParse()`
4. Implement a `validate(schema)` middleware for automatic validation with 422 response
5. Show TypeScript type inference: `z.infer<typeof schema>`

## Checklist

- [ ] Zod schema uses `.string()`, `.email()`, `.number().int()`, `.enum()`, `.array()`
- [ ] `safeParse()` used instead of `parse()` for safe validation
- [ ] Errors formatted: path + message for each invalid field
- [ ] Middleware automatically validates and saves result in `req.validated`
- [ ] TypeScript infers the type from the schema without duplicating interfaces

## How to Verify

Click "Run" and verify that: valid request passes with inferred type, invalid one returns 422 with per-field error list.
