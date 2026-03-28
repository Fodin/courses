# Task 7.4: Transformation Chains

## Objective

Learn to combine multiple `transform()` and `test()` calls into a chain for complex data processing.

## Requirements

1. Create `productSchema` — an object schema:
   - `sku`: transformation chain:
     - trim + toUpperCase
     - replace spaces with dashes
     - test: format "ABC-123" (letters-digits)
     - required
   - `price`: transformation chain:
     - replace comma with dot (European format)
     - strip non-numeric characters except dot
     - test: positive number (use `this.createError` for custom messages)
     - required
   - `tags`: transformation chain:
     - trim + lowercase
     - normalize commas: replace `/,\s*/g` → `', '`
     - test: at least 2 tags
     - required

2. Implement "Validate" and "Cast Only" buttons

3. For the price test, use `function` (not an arrow function) to access `this.createError`

## Checklist

- [ ] SKU: "  abc 123  " → "ABC-123" (trim → upper → replace spaces)
- [ ] Price: "$19,99" → "19.99" (comma→dot → strip non-numeric)
- [ ] Tags: "React,  TypeScript,yup" → "react, typescript, yup"
- [ ] SKU test validates LETTERS-DIGITS format
- [ ] Price test uses `this.createError` for different errors
- [ ] Tags test requires a minimum of 2 tags
- [ ] Cast Only shows the intermediate result

## How to verify

1. Defaults: "Cast Only" → you will see the transformed data
2. Defaults: "Validate" → success
3. SKU "widget" → format error (no digits)
4. Price "abc" → error "not a number"
5. Price "-5" → error "positive"
6. Tags "single" → error "at least 2 tags"
