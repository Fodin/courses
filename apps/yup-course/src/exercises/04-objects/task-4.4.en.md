# Task 4.4: noUnknown and strict

## Objective

Learn to forbid unknown fields using `noUnknown()` and control their behavior via `strict` and `stripUnknown`.

## Requirements

1. Create `strictUserSchema` with fields name and email, and add `.noUnknown()`

2. Implement a checkbox to toggle strict mode

3. In strict mode: unknown fields cause an error

4. In non-strict mode: use `stripUnknown: true` to remove extra fields

5. Display the result — which fields remain after validation

## Checklist

- [ ] The schema uses `noUnknown()` with a custom message
- [ ] The checkbox toggles `strict: true/false`
- [ ] strict + extra fields = error
- [ ] non-strict + stripUnknown + extra fields = fields removed
- [ ] A label below the button explains the current mode

## How to verify

1. `{"name": "Alice", "email": "a@b.com"}` — success in both modes
2. `{"name": "Alice", "email": "a@b.com", "extra": "field"}`:
   - strict: error "Unknown field: extra"
   - non-strict: success, extra removed from result
3. `{"name": "Alice", "email": "a@b.com", "hack": true, "admin": true}`:
   - strict: errors for both extra fields
