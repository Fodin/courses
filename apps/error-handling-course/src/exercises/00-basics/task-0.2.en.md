# Task 0.2: The Error Object and Its Properties

## Goal

Study the structure of the `Error` object and JavaScript's built-in error types.

## Requirements

1. Create an `Error` via `new Error('...')` and study its properties:
   - `name` — the error type name
   - `message` — the message text
   - `stack` — the call stack
2. Create instances of all built-in error types:
   - `Error`, `TypeError`, `RangeError`, `SyntaxError`, `ReferenceError`, `URIError`
3. Display a table with each type's properties
4. Show the full call stack for one of the errors

## Checklist

- [ ] Error object is created and its properties are displayed
- [ ] All built-in error types are created
- [ ] Properties table is displayed
- [ ] Call stack is shown

## How to verify

1. Click "Inspect Error" — name, message, stack should appear
2. Click "Create different errors" — a table with 6 error types
3. Verify that each type has the correct `name` property
