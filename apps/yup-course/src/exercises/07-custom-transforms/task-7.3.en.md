# Task 7.3: addMethod()

## Objective

Learn to extend Yup with custom methods via `addMethod()` for reusing validation logic.

## Requirements

1. Create a custom `phone()` method for `StringSchema`:
   - Transform: remove all non-digit characters
   - Test: 10-11 digits
   - Accepts an optional `message` parameter

2. Create a custom `noSpaces()` method for `StringSchema`:
   - Test: the string contains no spaces
   - Accepts an optional `message` parameter

3. Use `declare module 'yup'` to extend the TypeScript interface

4. Create `userSchema` using the custom methods:
   - `username`: required() + noSpaces() + min(3) + max(20)
   - `phone`: required() + phone()

## Checklist

- [ ] `declare module 'yup'` extends `StringSchema`
- [ ] `addMethod(yup.string, 'phone', ...)` with transform + test
- [ ] `addMethod(yup.string, 'noSpaces', ...)` with test
- [ ] Both methods accept an optional message
- [ ] `userSchema` uses `.phone()` and `.noSpaces()` like built-in methods

## How to verify

1. username="johndoe", phone="+7 999 123 45 67" — success
2. username="john doe" — error "no spaces"
3. username="ab" — error "min 3"
4. phone="123" — error "invalid phone" (fewer than 10 digits)
5. phone="+7 (999) 123-45-67" — success (transformed to 79991234567)
