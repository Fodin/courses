# Task 1.1: Built-in Error Types

## Goal

Learn the built-in error types in JavaScript and practice distinguishing them using `instanceof`.

## Requirements

1. Trigger each error type in a separate `try/catch`:
   - `TypeError` — calling a method on `null`
   - `RangeError` — creating an array with negative length
   - `SyntaxError` — parsing invalid JSON
   - `URIError` — invalid `decodeURIComponent`
2. In each `catch`, check the type using `instanceof`
3. Show the inheritance chain: `TypeError instanceof Error`
4. Display all results on the page

## Checklist

- [ ] 4 error types triggered and caught
- [ ] Using `instanceof` to check type
- [ ] Inheritance chain demonstrated
- [ ] Results displayed on the page
