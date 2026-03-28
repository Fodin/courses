# Task 8.1: ref() and context — cross-field validation

## Objective

Learn to use `yup.ref()` for references between fields and `context` (`$`) for passing external parameters into validation.

## Requirements

1. Create `passwordFormSchema` — an object schema with three groups of fields:

   **Password (ref between fields):**
   - `password`: required, min(8)
   - `confirmPassword`: required, `.oneOf([yup.ref('password')], 'Passwords must match')`

   **Price range (ref with moreThan):**
   - `minPrice`: required, min(0)
   - `maxPrice`: required, `.moreThan(yup.ref('minPrice'), 'Max must be greater than min')`

   **Discount (context):**
   - `discount`: required, min(0), `.max(yup.ref('$maxDiscount'), 'Discount exceeds maximum allowed: ${max}%')`

2. When validating, pass the context via options:
   ```ts
   schema.validate(data, {
     abortEarly: false,
     context: { maxDiscount: Number(maxDiscount) },
   })
   ```

3. Use `abortEarly: false` to show all errors

## Checklist

- [ ] `confirmPassword` uses `yup.ref('password')` inside `oneOf()`
- [ ] `maxPrice` uses `yup.ref('minPrice')` inside `moreThan()`
- [ ] `discount` uses `yup.ref('$maxDiscount')` (with `$`) inside `max()`
- [ ] Context is passed via `{ context: { maxDiscount } }`
- [ ] `abortEarly: false` is enabled

## How to verify

1. Password "MyPass123", confirm "MyPass123" — success
2. Password "MyPass123", confirm "other" — error "Passwords must match"
3. minPrice 10, maxPrice 100 — success
4. minPrice 100, maxPrice 50 — error "Max must be greater than min"
5. maxDiscount 20, discount 15 — success
6. maxDiscount 20, discount 25 — error about exceeding the limit
7. All fields empty — all errors shown at once
