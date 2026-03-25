# Task 0.1: First try/catch

## Goal

Learn to use the `try/catch/finally` construct for error handling.

## Requirements

1. Create a function that parses a JSON string via `JSON.parse`
2. Wrap the call in `try/catch`:
   - In `try` — parse and display the result
   - In `catch` — handle the `SyntaxError`
3. Add a `finally` block that logs the operation completion
4. Create an example using `throw new Error(...)` to create your own error
5. Display results on the page

## Checklist

- [ ] `try/catch` correctly wraps `JSON.parse`
- [ ] `SyntaxError` is handled in `catch`
- [ ] `finally` block always executes
- [ ] `throw new Error` is used
- [ ] Results are displayed on the page

## How to verify

1. Click the run button
2. Verify that successful parsing shows data
3. Verify that invalid JSON shows an error
4. Verify that `finally` executes in both cases
