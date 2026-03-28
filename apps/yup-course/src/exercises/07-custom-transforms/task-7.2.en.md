# Task 7.2: transform()

## Objective

Learn to use `transform()` to normalize data before validation.

## Requirements

1. Create `contactSchema` — an object schema:
   - `email`: transform (trim + lowercase) → email() → required()
   - `phone`: transform (remove all non-digit characters) → matches 10-11 digits → required()
   - `name`: transform (trim + normalize spaces: `replace(/\s+/g, ' ')`) → required() → min(2)

2. Implement two buttons:
   - **Validate** — full validation with transformation
   - **Cast Only** — transformation only, no validation (via `schema.cast()`)

3. Display the transformation result so the student can see the difference between input and output

## Checklist

- [ ] Email: "  USER@EXAMPLE.COM  " → "user@example.com"
- [ ] Phone: "+7 (999) 123-45-67" → "79991234567"
- [ ] Name: "  John    Doe  " → "John Doe"
- [ ] transform() comes **before** validation rules
- [ ] Cast Only shows the transformed data without validation

## How to verify

1. Defaults: click "Cast Only" — you will see the transformed data
2. Defaults: click "Validate" — success with transformed data
3. Email empty → required error
4. Phone "abc" → error (0 digits, need 10-11)
5. Name "A" → error min(2)
