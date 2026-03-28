# Level 1: Primitive Types

## Basic Yup types

Yup provides schemas for all fundamental JavaScript data types. Each schema knows how to validate and transform values of the corresponding type.

### Schema types

| Method          | Validates        | Default cast                   |
| --------------- | ---------------- | ------------------------------ |
| `yup.string()`  | strings          | `String(value)`                |
| `yup.number()`  | numbers          | `Number(value)` / `parseFloat` |
| `yup.boolean()` | boolean values   | Truthy/falsy conversion        |
| `yup.date()`    | dates            | `new Date(value)`              |

---

## string()

Schema for string values. Yup automatically coerces values to a string (except `null` and `undefined`).

```typescript
import * as yup from 'yup'

const nameSchema = yup.string()
  .required('Name is required')
  .min(2, 'Name too short')
  .max(50, 'Name too long')

await nameSchema.validate('John') // 'John'
await nameSchema.validate('')     // Error: 'Name is required'
await nameSchema.validate('J')    // Error: 'Name too short'
```

🔥 **Key point:** `string()` automatically coerces values to a string:

```typescript
const schema = yup.string()
schema.cast(123)    // '123'
schema.cast(true)   // 'true'
schema.cast(null)   // null (not cast)
```

---

## number()

Schema for numeric values. Yup attempts to convert strings to numbers.

```typescript
const ageSchema = yup.number()
  .required('Age is required')
  .positive('Must be positive')
  .integer('Must be integer')
  .min(18, 'Must be 18+')
  .max(120, 'Invalid age')

await ageSchema.validate(25)    // 25
await ageSchema.validate('25')  // 25 (cast from string!)
await ageSchema.validate(-5)    // Error: 'Must be positive'
await ageSchema.validate(17.5)  // Error: 'Must be integer'
```

📌 **Important:** `number()` parses strings! `'42'` becomes `42`. This is convenient for form data where all values arrive as strings.

```typescript
const schema = yup.number()
schema.cast('3.14')   // 3.14
schema.cast('')       // NaN (then fails validation)
schema.cast('abc')    // NaN (then fails validation)
```

---

## boolean()

Schema for boolean values.

```typescript
const termsSchema = yup.boolean()
  .required('Must accept terms')
  .isTrue('You must check this box')

await termsSchema.validate(true)   // true
await termsSchema.validate(false)  // Error: 'You must check this box'
```

💡 **Hint:** `isTrue()` and `isFalse()` are useful for checkboxes:

```typescript
// "Accept terms" checkbox
const acceptSchema = yup.boolean().isTrue('Please accept the terms')

// "Don't send notifications" checkbox
const optOutSchema = yup.boolean().isFalse('Cannot opt out of critical notifications')
```

---

## date()

Schema for dates. Yup converts strings into `Date` objects.

```typescript
const dateSchema = yup.date()
  .required('Date is required')
  .min(new Date('2020-01-01'), 'Date must be after 2020')
  .max(new Date(), 'Date cannot be in the future')

await dateSchema.validate(new Date())        // valid
await dateSchema.validate('2024-06-15')      // Date object (cast from string)
await dateSchema.validate('1999-01-01')      // Error: 'Date must be after 2020'
```

📌 **Important:** ISO strings are automatically parsed:

```typescript
const schema = yup.date()
schema.cast('2024-01-15')                  // Date object
schema.cast('2024-01-15T10:30:00.000Z')    // Date object
schema.cast('not a date')                  // Invalid Date
```

---

## Modifiers: required, nullable, optional

These methods control which "empty" values are permitted.

### required()

The value **must be present** and cannot be `undefined`, `null`, or an empty string:

```typescript
const schema = yup.string().required('Required!')

await schema.validate('hello')   // 'hello'
await schema.validate(undefined) // Error
await schema.validate(null)      // Error
await schema.validate('')        // Error (empty string fails too!)
```

### nullable()

Allows `null` as a valid value:

```typescript
const schema = yup.string().nullable()

await schema.validate('hello')   // 'hello'
await schema.validate(null)      // null (valid!)
await schema.validate(undefined) // undefined (valid by default)
```

### optional()

Allows `undefined` as a valid value (this is the default behavior):

```typescript
const schema = yup.string().optional()

await schema.validate('hello')   // 'hello'
await schema.validate(undefined) // undefined (valid)
```

### Combinations

```typescript
// Required and nullable — must be present, null is OK
yup.string().nullable().required()
// undefined -> Error, null -> Error (!), '' -> Error, 'hi' -> OK

// Optional and nullable — most permissive
yup.string().nullable().optional()
// undefined -> OK, null -> OK, '' -> OK, 'hi' -> OK
```

⚠️ **Warning:** `nullable().required()` — `null` still causes an error! `required()` checks that the value is "non-empty", and `null` is considered empty. `nullable()` affects type casting.

---

## default() and defined()

### default()

Sets a default value for `undefined`:

```typescript
const schema = yup.string().default('Guest')

schema.cast(undefined)  // 'Guest'
schema.cast('John')     // 'John'
schema.cast(null)       // null (default doesn't replace null!)
```

📌 **Important:** `default()` only replaces `undefined`, not `null`. To replace `null` as well, use `nullable().default()`:

```typescript
const schema = yup.string().nullable().default('Guest')

schema.cast(undefined) // 'Guest'
schema.cast(null)      // 'Guest' (now replaces null too!)
```

For dynamic values, pass a function:

```typescript
const schema = yup.date().default(() => new Date()) // current date
```

### defined()

Forbids `undefined` (but allows `null`):

```typescript
const schema = yup.string().defined('Must be defined')

await schema.validate('hello')    // 'hello'
await schema.validate(undefined)  // Error: 'Must be defined'
await schema.validate(null)       // null (valid!)
```

💡 **Difference:** `required()` forbids `undefined`, `null`, and `''`. `defined()` forbids only `undefined`.

---

## ⚠️ Common beginner mistakes

### ❌ Mistake 1: Confusing cast and validate

```typescript
// ❌ Bad: cast doesn't validate, it only transforms
const schema = yup.number().min(18)
schema.cast('5')  // 5 (no error! cast doesn't check min)

// ✅ Good: use validate to check constraints
await schema.validate('5') // Error: 'must be >= 18'
```

**Why this is a problem:** `cast()` only transforms the value, it does not check validation rules. Use `validate()` to enforce constraints.

### ❌ Mistake 2: Expecting number() to reject strings

```typescript
// ❌ Bad: expecting string '42' to fail
const schema = yup.number()
await schema.validate('42') // 42 (valid! Yup casts it)

// ✅ Good: use strict mode if you want only actual numbers
await schema.validate('42', { strict: true }) // Error!
```

**Why this is a problem:** Yup coerces types by default. This is convenient for forms, but may hide type errors. Use `strict: true` when coercion is not needed.

### ❌ Mistake 3: Thinking nullable() makes a field optional

```typescript
// ❌ Bad: thinking nullable alone makes it optional
const schema = yup.string().nullable().required()
await schema.validate(null) // Error! required() rejects null

// ✅ Good: understand that nullable affects type, not requirement
// nullable() allows null in the TYPE, required() checks for non-empty VALUE
```

**Why this is a problem:** `nullable()` widens the accepted type (adds `| null`) but does not override `required()`.

### ❌ Mistake 4: Expecting default() to work during validate

```typescript
// ❌ Bad: default only works with cast, not validate
const schema = yup.string().required().default('Guest')
await schema.validate(undefined) // Error! required fires before default

// ✅ Good: default works with cast()
schema.cast(undefined) // 'Guest'

// Or use it without required:
const schema2 = yup.string().default('Guest')
await schema2.validate(undefined) // 'Guest'
```

**Why this is a problem:** `default()` is applied during `cast`, while `required()` is checked during `validate`. When `required()` is present, it will reject `undefined` before `default()` can take effect in some configurations.

---

## 💡 Best Practices

1. **Always provide error messages** — `required('Field is required')` is clearer than the default message
2. **Use strict mode** for API data where type coercion is not needed
3. **Remember casting** — Yup casts types first, then validates
4. **nullable vs optional** — `nullable` for `null`, `optional` for `undefined`
5. **default() for default values** in forms, `defined()` for strict checks against `undefined`

---

## What's next?

In the next level you will learn about:

- String validations: `email()`, `url()`, `matches()`
- Length constraints: `min()`, `max()`, `length()`
- String transformations: `trim()`, `lowercase()`, `uppercase()`
