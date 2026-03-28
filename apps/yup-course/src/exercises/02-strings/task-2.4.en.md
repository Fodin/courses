# Task 2.4: trim, lowercase, uppercase

## Objective

Understand how Yup transforms strings using `trim()`, `lowercase()`, `uppercase()`, and how strict mode works.

## Requirements

1. Create 4 schemas:
   - `trim()` — removes whitespace
   - `lowercase()` — converts to lowercase
   - `uppercase()` — converts to uppercase
   - `trim().lowercase()` — combination

2. Use `cast()` to demonstrate transformations — show the original and the transformed value

3. Add a "Test strict mode" button — show that `lowercase()` in strict mode **checks** rather than **transforms**

4. Display the "raw" input value (with whitespace and original casing)

## Checklist

- [ ] 4 schemas are created
- [ ] `cast()` shows the original and transformed value
- [ ] Strict mode demonstrates the difference (error on uppercase input)
- [ ] The "raw" input value is visible

## How to verify

1. Enter "  Hello World  " (with spaces):
   - trim: "Hello World"
   - lowercase: "  hello world  "
   - uppercase: "  HELLO WORLD  "
   - trim + lowercase: "hello world"

2. Enter "HELLO" and click "Test strict mode":
   - Error (value is not lowercase)

3. Enter "hello" and click "Test strict mode":
   - Success (already lowercase)
