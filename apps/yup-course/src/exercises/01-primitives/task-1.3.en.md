# Task 1.3: required and nullable

## Objective

Understand the difference between `required()`, `nullable()`, and `optional()` — how they affect validation of `undefined`, `null`, and empty strings.

## Requirements

1. Create 4 schemas:
   - `string().required()`
   - `string().nullable()`
   - `string().optional()`
   - `string().nullable().required()`

2. Create a single input field whose value is validated against all 4 schemas simultaneously

3. Treat an empty field as `undefined`, the text "null" as `null`, and anything else as a string

4. Show the result for each schema side by side: green on success, red on error

## Checklist

- [ ] 4 schemas are created
- [ ] A single input field is validated against all schemas
- [ ] An empty field is interpreted as `undefined`
- [ ] The text "null" is interpreted as `null`
- [ ] Results are shown for each schema

## How to verify

1. Leave the field empty (undefined):
   - `required()` — error
   - `nullable()` — success (undefined)
   - `optional()` — success (undefined)
   - `nullable().required()` — error

2. Enter "null":
   - `required()` — error
   - `nullable()` — success (null)
   - `optional()` — error (null is not allowed without nullable)
   - `nullable().required()` — error (required rejects null)

3. Enter "hello":
   - All 4 — success
