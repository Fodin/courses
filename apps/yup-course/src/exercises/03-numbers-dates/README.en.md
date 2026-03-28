# Level 3: Numbers and Dates

## Number validations

Yup provides a rich set of methods for working with numeric data — from simple range constraints to transformations that automatically coerce numbers into the required format.

---

## min, max — range constraints

### min(limit, message?)

The value must be **greater than or equal to** `limit`:

```typescript
const schema = yup.number().min(0, 'Must be non-negative')

await schema.validate(0)    // Valid: 0
await schema.validate(42)   // Valid: 42
await schema.validate(-1)   // Error: 'Must be non-negative'
```

### max(limit, message?)

The value must be **less than or equal to** `limit`:

```typescript
const schema = yup.number().max(100, 'Max is 100')

await schema.validate(100)  // Valid: 100
await schema.validate(101)  // Error: 'Max is 100'
```

### moreThan and lessThan — strict comparisons

Unlike `min`/`max`, these methods use **strict** comparison (boundary not included):

```typescript
const schema = yup.number()
  .moreThan(0, 'Must be greater than 0')    // > 0, NOT >= 0
  .lessThan(100, 'Must be less than 100')   // < 100, NOT <= 100

await schema.validate(0)    // Error: 'Must be greater than 0'
await schema.validate(1)    // Valid
await schema.validate(99)   // Valid
await schema.validate(100)  // Error: 'Must be less than 100'
```

🔥 **Key point:** `min(0)` allows zero, `moreThan(0)` does not. Choose based on your business logic.

---

## positive and negative

### positive(message?)

The value must be strictly greater than zero:

```typescript
const priceSchema = yup.number().positive('Price must be positive')

await priceSchema.validate(10)   // Valid
await priceSchema.validate(0)    // Error (zero is NOT positive)
await priceSchema.validate(-5)   // Error
```

📌 **Important:** `positive()` is equivalent to `moreThan(0)`. Zero is not considered a positive number!

### negative(message?)

The value must be strictly less than zero:

```typescript
const debtSchema = yup.number().negative('Must be negative')

await debtSchema.validate(-100)  // Valid
await debtSchema.validate(0)     // Error (zero is NOT negative)
await debtSchema.validate(50)    // Error
```

---

## integer and truncate

### integer(message?)

**Validation**: checks that the number is an integer:

```typescript
const quantitySchema = yup.number().integer('Must be a whole number')

await quantitySchema.validate(5)     // Valid
await quantitySchema.validate(3.14)  // Error: 'Must be a whole number'
await quantitySchema.validate(0)     // Valid
```

### truncate()

**Transformation**: drops the fractional part (like `Math.trunc`):

```typescript
const schema = yup.number().truncate()

schema.cast(3.7)   // 3
schema.cast(-2.9)  // -2
schema.cast(5)     // 5 (no change)
```

### round(type?)

**Transformation**: rounds the number. Accepts a rounding method:

```typescript
const floorSchema = yup.number().round('floor')
const ceilSchema = yup.number().round('ceil')
const roundSchema = yup.number().round('round')  // default

floorSchema.cast(3.7)   // 3
ceilSchema.cast(3.2)    // 4
roundSchema.cast(3.5)   // 4
roundSchema.cast(3.4)   // 3
```

💡 **Hint:** `truncate()` always drops the fractional part (like `Math.trunc`), while `round()` lets you choose the rounding strategy.

---

## Date validation

### date()

Creates a schema for dates. By default it parses ISO strings and `Date` objects:

```typescript
const schema = yup.date()

await schema.isValid(new Date())          // true
await schema.isValid('2024-01-15')        // true (ISO string)
await schema.isValid('not a date')        // false
await schema.isValid('2024-13-45')        // false (invalid date)
```

📌 **Important:** Yup automatically converts strings to `Date` objects via the `new Date()` constructor. Invalid dates (Invalid Date) will not pass the check.

### min and max for dates

```typescript
const birthdaySchema = yup.date()
  .required('Date is required')
  .max(new Date(), 'Cannot be in the future')
  .min(new Date('1900-01-01'), 'Too far in the past')

// Birthday must be between 1900-01-01 and today
await birthdaySchema.validate('2000-05-15')   // Valid
await birthdaySchema.validate('2099-01-01')   // Error: future date
await birthdaySchema.validate('1899-12-31')   // Error: too far
```

### Date in the future

```typescript
const eventSchema = yup.date()
  .required('Event date is required')
  .min(new Date(), 'Event must be in the future')

await eventSchema.validate('2030-12-25')  // Valid
await eventSchema.validate('2020-01-01')  // Error: in the past
```

---

## Date ranges and yup.ref()

For cross-field validation (when one field depends on another), use `yup.ref()`:

```typescript
const dateRangeSchema = yup.object({
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End must be after start'),
})

// Valid: end > start
await dateRangeSchema.validate({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
})

// Error: end < start
await dateRangeSchema.validate({
  startDate: '2024-12-31',
  endDate: '2024-01-01',
})
// Error: 'End must be after start'
```

🔥 **Key point:** `yup.ref('fieldName')` creates a reference to the value of another field within the same object schema. This is the foundation for cross-field validation.

---

## ⚠️ Common beginner mistakes

### ❌ Mistake 1: Confusing positive() and min(0)

```typescript
// ❌ Bad: positive() rejects 0
const schema = yup.number().positive()
await schema.validate(0)  // Error!

// ✅ Good: use min(0) if zero is allowed
const schema = yup.number().min(0, 'Must be >= 0')
await schema.validate(0)  // Valid
```

**Why this is a problem:** `positive()` is `moreThan(0)`, so zero does not pass. If zero is valid (e.g. "item quantity"), use `min(0)`.

### ❌ Mistake 2: integer() does not transform

```typescript
// ❌ Bad: expecting integer() to round the number
const schema = yup.number().integer()
await schema.validate(3.7)  // Error, NOT 4!

// ✅ Good: use truncate() or round() before integer()
const schema = yup.number().truncate().integer()
schema.cast(3.7)  // 3 (truncated, then passes integer check)
```

**Why this is a problem:** `integer()` is a **validation**, not a transformation. It checks but does not convert. Use `truncate()` or `round()` for conversion.

### ❌ Mistake 3: Strings instead of numbers

```typescript
// ❌ Bad: passing string to number schema
const schema = yup.number().min(0)
await schema.validate('42')  // Works due to coercion, but risky

// ✅ Good: ensure proper type or use transform
const schema = yup.number()
  .transform((value, original) => {
    return original === '' ? undefined : value
  })
  .required()
```

**Why this is a problem:** Yup coerces strings to numbers automatically, but an empty string `''` becomes `NaN`. Handle empty strings via `transform`.

### ❌ Mistake 4: Dynamic dates in min/max

```typescript
// ❌ Bad: date is captured once at schema creation
const schema = yup.date().min(new Date())
// new Date() computed once — stale after a while

// ✅ Good: wrap in a function for lazy evaluation
const schema = yup.date().min(
  yup.ref('$now'),  // pass via context
  'Must be in the future'
)
// or re-create schema when needed
```

**Why this is a problem:** `new Date()` is evaluated once at schema creation time. If the schema is long-lived (e.g. inside a component), the "current date" will become stale.

---

## 💡 Best Practices

1. **`positive()` for prices, `min(0)` for quantities** — decide whether zero is allowed
2. **`integer()` for validation, `truncate()`/`round()` for transformation** — don't confuse them
3. **Handle empty strings** via `transform` for numeric fields from forms
4. **`yup.ref()` for cross-field validation** — "end must be after start"
5. **Use `moreThan`/`lessThan` for strict comparisons** — when the boundary is not allowed
6. **Custom error messages should be specific:** `min(18, 'Must be at least 18')`, not just `min(18)`

---

## What's next?

In the next level you will learn about:

- Object schemas: `object().shape()`
- Nested objects
- Schema composition: `pick()`, `omit()`, `partial()`
- Strict mode: `noUnknown()` and `strict()`
