# Level 7: Custom Rules and Transformations

## Why do we need custom rules?

Yup's built-in validators (required, min, max, matches...) cover most cases. But sometimes you need **your own logic**:
- Validating a tax ID against a checksum
- Validation via an external API (email uniqueness)
- Normalizing data before validation (trimming spaces, formatting phone numbers)
- Reusable rules across the entire project

Yup provides three tools for this: `test()`, `transform()`, and `addMethod()`.

---

## test() — custom validation

### Basic syntax

`.test(name, message, validator)` adds a custom validator:

```typescript
import * as yup from 'yup'

const schema = yup.string().test(
  'no-spaces',                              // name — unique test name
  'Must not contain spaces',                // message — error message
  (value) => value == null || !value.includes(' ')  // validator — function
)

await schema.validate('hello')        // ✅ Valid
await schema.validate('hello world')  // ❌ Error: 'Must not contain spaces'
```

### Validator function

The validator function must return:
- `true` — validation passed
- `false` — error (the message from the parameter is used)
- `ValidationError` — custom error (via `createError`)

```typescript
const passwordSchema = yup.string().test(
  'strong-password',
  'Password must contain uppercase, lowercase, and digit',
  (value) => {
    if (!value) return true // let required() handle empty
    return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value)
  }
)
```

📌 **Important:** If the value is `null` or `undefined`, typically return `true` — let `required()` handle the required check. Otherwise you'll get duplicate errors.

### Async tests

`test()` supports asynchronous validators — you can validate via an API:

```typescript
const emailSchema = yup.string().email().test(
  'unique-email',
  'This email is already registered',
  async (value) => {
    if (!value) return true
    // Simulate API call
    const response = await fetch(`/api/check-email?email=${value}`)
    const { available } = await response.json()
    return available
  }
)

// Must use validateAsync for async tests
await emailSchema.validate('test@example.com')
```

🔥 **Key point:** If at least one `test()` in the schema is asynchronous, **all** validation must use `await schema.validate()` (not `validateSync`).

### createError for custom messages

Inside a test you can create an error with a dynamic message:

```typescript
const ageSchema = yup.number().test(
  'valid-age',
  'Invalid age',
  function (value) {
    if (!value) return true
    if (value < 0) {
      return this.createError({ message: `Age cannot be negative: ${value}` })
    }
    if (value > 150) {
      return this.createError({ message: `Age ${value} seems unrealistic` })
    }
    return true
  }
)
```

⚠️ **Note:** To access `this.createError()`, use a **regular function** (`function`), not an arrow function (`=>`).

---

## transform() — data transformation

### How transform works

`.transform()` modifies data **before** validation:

```typescript
const schema = yup.string()
  .transform((value) => value?.trim().toLowerCase())
  .email('Enter valid email')

schema.cast('  HELLO@EXAMPLE.COM  ')  // 'hello@example.com'
await schema.validate('  HELLO@EXAMPLE.COM  ')  // ✅ Valid: 'hello@example.com'
```

### Order: transform → validate

```typescript
const phoneSchema = yup.string()
  .transform((value) => {
    if (!value) return value
    // Remove non-digit characters
    return value.replace(/\D/g, '')
  })
  .matches(/^\d{10,11}$/, 'Phone must be 10-11 digits')

phoneSchema.cast('+7 (999) 123-45-67')  // '79991234567'
await phoneSchema.validate('+7 (999) 123-45-67')  // ✅ Valid
```

### transform parameters

Transform receives two arguments: the current value and the original value:

```typescript
const schema = yup.number()
  .transform((value, originalValue) => {
    // originalValue — what came in as input (before type coercion)
    if (typeof originalValue === 'string' && originalValue.includes(',')) {
      // Replace comma with dot for European notation
      return parseFloat(originalValue.replace(',', '.'))
    }
    return value
  })

schema.cast('3,14')  // 3.14
```

💡 **Hint:** `transform()` is useful for normalizing data from forms where the user may enter data in an unexpected format.

---

## addMethod() — extending Yup

### Why addMethod is needed

If the same `test()` or `transform()` is used across multiple schemas — extract it into a method:

```typescript
import { addMethod, string } from 'yup'

// TypeScript: extend the interface
declare module 'yup' {
  interface StringSchema {
    phone(message?: string): this
  }
}

// Add the method
addMethod(string, 'phone', function (message = 'Invalid phone number') {
  return this
    .transform((value) => value?.replace(/\D/g, ''))
    .test('phone', message, (value) => !value || /^\d{10,11}$/.test(value))
})

// Use it like a built-in method!
const schema = yup.string().phone().required()
await schema.validate('+7 (999) 123-45-67')  // ✅ Valid
```

### addMethod with parameters

```typescript
declare module 'yup' {
  interface StringSchema {
    noWords(words: string[], message?: string): this
  }
}

addMethod(string, 'noWords', function (words: string[], message?: string) {
  return this.test(
    'no-words',
    message || `Must not contain: ${words.join(', ')}`,
    (value) => {
      if (!value) return true
      const lower = value.toLowerCase()
      return !words.some((word) => lower.includes(word.toLowerCase()))
    }
  )
})

const schema = yup.string().noWords(['spam', 'test'])
await schema.validate('Hello world')      // ✅
await schema.validate('This is a test')   // ❌ 'Must not contain: spam, test'
```

### addMethod for numbers

```typescript
declare module 'yup' {
  interface NumberSchema {
    even(message?: string): this
  }
}

addMethod(yup.number, 'even', function (message = 'Must be even') {
  return this.test('even', message, (value) => value == null || value % 2 === 0)
})

const schema = yup.number().even().positive()
await schema.validate(4)   // ✅
await schema.validate(3)   // ❌ 'Must be even'
```

📌 **Important:** `addMethod` is registered **globally** — once called, the method is available in all schemas of that type. Call `addMethod` during application initialization.

---

## Transformation chains

### Multiple transform + test calls

Transformations and tests execute **in declaration order**:

```typescript
const usernameSchema = yup.string()
  .transform((value) => value?.trim())                   // 1. trim
  .transform((value) => value?.toLowerCase())             // 2. lowercase
  .test('no-spaces', 'No spaces allowed',
    (value) => !value || !value.includes(' '))             // 3. test
  .min(3, 'At least 3 characters')                        // 4. built-in
  .max(20, 'At most 20 characters')                       // 5. built-in
  .matches(/^[a-z0-9_]+$/, 'Only letters, digits, _')     // 6. built-in

usernameSchema.cast('  Hello_World  ')  // 'hello_world'
await usernameSchema.validate('  Hello_World  ')  // ✅ Valid: 'hello_world'
```

### Object transformation

```typescript
const formSchema = yup.object({
  email: yup.string()
    .transform((v) => v?.trim().toLowerCase())
    .email()
    .required(),
  phone: yup.string()
    .transform((v) => v?.replace(/\D/g, ''))
    .matches(/^\d{10,11}$/, 'Invalid phone')
    .required(),
  name: yup.string()
    .transform((v) => v?.trim().replace(/\s+/g, ' '))  // normalize spaces
    .required()
    .min(2),
})

const result = formSchema.cast({
  email: '  USER@EXAMPLE.COM  ',
  phone: '+7 (999) 123-45-67',
  name: '  John    Doe  ',
})
// { email: 'user@example.com', phone: '79991234567', name: 'John Doe' }
```

---

## ⚠️ Common beginner mistakes

### ❌ Mistake 1: Arrow function with this.createError

```typescript
// ❌ Bad: arrow function loses 'this' context
const schema = yup.string().test('custom', 'Error', (value) => {
  return this.createError({ message: 'custom' })  // this is undefined!
})

// ✅ Good: use regular function
const schema = yup.string().test('custom', 'Error', function (value) {
  return this.createError({ message: `${value} is invalid` })
})
```

**Why it matters:** `this` in an arrow function refers to the outer context, not the Yup test context. Use `function` to access `this.createError()`, `this.path`, `this.parent`.

### ❌ Mistake 2: Validating an empty value in test without accounting for required

```typescript
// ❌ Bad: test fails on undefined, conflicting with optional()
const schema = yup.string().test(
  'is-valid',
  'Invalid format',
  (value) => /^[A-Z]+$/.test(value!)  // crashes on undefined!
)

// ✅ Good: handle null/undefined in test
const schema = yup.string().test(
  'is-valid',
  'Invalid format',
  (value) => !value || /^[A-Z]+$/.test(value)
)
```

**Why it matters:** `test()` is called for ANY value, including undefined. Always check `!value` before your main logic.

### ❌ Mistake 3: transform after test — the test receives untransformed data

```typescript
// ❌ Bad: test runs BEFORE transform
const schema = yup.string()
  .test('no-spaces', 'No spaces', (v) => !v?.includes(' '))
  .transform((v) => v?.trim())  // trim happens AFTER test!

// ✅ Good: transform BEFORE test
const schema = yup.string()
  .transform((v) => v?.trim())
  .test('no-spaces', 'No spaces', (v) => !v?.includes(' '))
```

**Why it matters:** Yup executes the chain left to right. If transform comes after test, the test receives raw data. Place `transform()` before `test()`.

### ❌ Mistake 4: addMethod without extending the TypeScript interface

```typescript
// ❌ Bad: TypeScript error — 'phone' does not exist
addMethod(string, 'phone', function () { ... })
const schema = yup.string().phone()  // TS Error!

// ✅ Good: declare module extension
declare module 'yup' {
  interface StringSchema {
    phone(message?: string): this
  }
}
addMethod(string, 'phone', function (message?: string) { ... })
const schema = yup.string().phone()  // ✅ No TS error
```

**Why it matters:** TypeScript is unaware of methods added via `addMethod`. You need to extend the interface using `declare module`.

---

## 💡 Best Practices

1. **`test()` for validation, `transform()` for transformation** — do not mix them
2. **Handle null/undefined in test** — let `required()` be responsible for required checks
3. **transform() before test()** — the test should receive normalized data
4. **addMethod() for reusable rules** — do not duplicate test/transform logic
5. **Regular function for this.createError** — arrow functions lose context
6. **Async test — only with await validate** — `validateSync` does not support async

---

## What's next?

In the next level you will learn:

- `ref()` — references to other fields (password confirmation)
- `lazy()` — dynamic and recursive schemas
- `InferType` — inferring TypeScript types from schemas
- Final project — a comprehensive validation system
