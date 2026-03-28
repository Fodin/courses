# Task 2.3: matches (regex)

## Objective

Use `matches()` to validate strings against regular expressions.

## Requirements

1. Create `phoneSchema` — validate a Russian phone number:
   - Pattern: `/^\+7\d{10}$/`
   - Message: "Phone must be in format +7XXXXXXXXXX"

2. Create `hexColorSchema` — validate a hex color:
   - Pattern: `/^#[0-9A-Fa-f]{6}$/`
   - Message: "Must be a valid hex color (e.g. #FF0000)"

3. On successful color validation, show a color preview (a square filled with that color)

4. Both fields must be required

## Checklist

- [ ] `phoneSchema` is created with `matches()` and the +7 pattern
- [ ] `hexColorSchema` is created with `matches()` and the hex pattern
- [ ] The phone number "+79001234567" passes validation
- [ ] The color "#FF0000" passes validation and shows a red square
- [ ] Invalid values show errors

## How to verify

1. Phone: "+79001234567" — success
2. Phone: "89001234567" — error (no +7)
3. Phone: "+7123" — error (too few digits)
4. Color: "#FF0000" — success + red square
5. Color: "#abc" — error (only 3 characters)
6. Color: "red" — error (not hex format)
