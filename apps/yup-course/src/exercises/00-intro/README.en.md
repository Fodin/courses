# Level 0: Introduction to Yup

## What is Yup?

**Yup** is a library for building data validation schemas in JavaScript/TypeScript. It lets you declaratively describe the structure and constraints of your data, then check whether the actual data conforms to those constraints.

### Why do we need validation?

Imagine you receive data from a user via a form or from an API. Without validation, you don't know:
- Are the required fields filled in?
- Is the email format correct?
- Is the number within an acceptable range?
- Are there any extraneous or dangerous values?

**Yup solves this problem** by providing an expressive API for describing validation rules.

### Why Yup?

| Library    | Size    | API style         | TypeScript |
| ---------- | ------- | ----------------- | ---------- |
| **Yup**    | ~15 KB  | Method chaining   | Excellent  |
| Zod        | ~13 KB  | Method chaining   | Excellent  |
| Joi        | ~150 KB | Method chaining   | Average    |
| io-ts      | ~8 KB   | Functional        | Excellent  |

🔥 **Advantages of Yup:**

1. **Intuitive API** — method chains read like natural language
2. **Excellent typing** — `InferType` automatically derives TypeScript types from the schema
3. **Transformations** — Yup not only validates but also transforms data
4. **Integration** — supported by React Hook Form, Formik, and other libraries
5. **Customization** — easy to create your own validation rules

---

## Core concepts

### 1. Schema

A schema is a description of what data **should look like**. It is a set of rules that data must satisfy.

```typescript
import * as yup from 'yup'

// Schema describes the expected shape of data
const nameSchema = yup.string().required().min(2)
```

### 2. Validation

Validation is the process of checking data against a schema. Yup provides two primary methods:

```typescript
// validate() — async, throws ValidationError on failure
try {
  const result = await schema.validate(data)
  console.log('Valid:', result)
} catch (err) {
  console.log('Invalid:', err.message)
}

// validateSync() — sync version
try {
  const result = schema.validateSync(data)
  console.log('Valid:', result)
} catch (err) {
  console.log('Invalid:', err.message)
}

// isValid() — returns boolean, never throws
const valid = await schema.isValid(data) // true or false
```

### 3. Type casting

Yup automatically tries to coerce data into the required type:

```typescript
const numSchema = yup.number()

// Yup casts string "5" to number 5
const result = numSchema.cast('5') // 5 (number)
```

📌 **Important:** `validate()` first casts the type (`cast`), then checks the rules. If you need to validate without casting, use the `{ strict: true }` option.

---

## Your first schema

### Creating an object schema

The most common use case is validating objects with multiple fields:

```typescript
import * as yup from 'yup'

// Define an object schema
const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().required('Age is required').positive('Age must be positive'),
  email: yup.string().email('Invalid email').required('Email is required'),
})
```

### Validating data

```typescript
// Valid data
const validUser = { name: 'John', age: 25, email: 'john@example.com' }
const result = await userSchema.validate(validUser)
// result: { name: 'John', age: 25, email: 'john@example.com' }

// Invalid data — throws ValidationError
try {
  await userSchema.validate({ name: '', age: -5, email: 'bad' })
} catch (err) {
  console.log(err.message) // first error message
}
```

### Type inference with InferType

🔥 **Key feature of Yup** — automatic TypeScript type inference from the schema:

```typescript
// Automatically infer TypeScript type from schema
type User = yup.InferType<typeof userSchema>
// Equivalent to:
// type User = {
//   name: string
//   age: number
//   email: string
// }
```

This means you don't need to duplicate types — the schema is the single source of truth.

---

## Handling validation errors

### ValidationError

When `validate()` encounters an error, it throws a `ValidationError` with useful properties:

```typescript
try {
  await schema.validate(data, { abortEarly: false })
} catch (err) {
  if (err instanceof yup.ValidationError) {
    err.message   // first error message (or summary)
    err.errors    // string[] — all error messages
    err.inner     // ValidationError[] — per-field errors
    err.path      // string — field path (e.g. 'email')
  }
}
```

### abortEarly: false

By default Yup stops at the first error. To collect **all** errors, pass `{ abortEarly: false }`:

```typescript
// ❌ Default: stops at first error
await schema.validate(data)
// throws: "Name is required" (only first error)

// ✅ Collect all errors
await schema.validate(data, { abortEarly: false })
// throws ValidationError with err.inner containing ALL errors
```

### Extracting errors by field

```typescript
try {
  await schema.validate(data, { abortEarly: false })
} catch (err) {
  if (err instanceof yup.ValidationError) {
    // Map errors by field path
    const fieldErrors: Record<string, string> = {}
    for (const error of err.inner) {
      if (error.path) {
        fieldErrors[error.path] = error.message
      }
    }
    // { name: 'Name is required', email: 'Invalid email' }
  }
}
```

---

## ⚠️ Common beginner mistakes

### ❌ Mistake 1: Forgetting `await` when calling `validate()`

```typescript
// ❌ Bad: validate returns a Promise!
const result = schema.validate(data)
console.log(result) // Promise { <pending> }

// ✅ Good: always await
const result = await schema.validate(data)
console.log(result) // actual validated data
```

**Why this is a problem:** `validate()` is an asynchronous method. Without `await` you get a Promise, not the result. Validation errors will not be caught in `try/catch`.

### ❌ Mistake 2: Not using `abortEarly: false` for forms

```typescript
// ❌ Bad: user sees errors one by one
try {
  await schema.validate(formData)
} catch (err) {
  showError(err.message) // only first error
}

// ✅ Good: user sees all errors at once
try {
  await schema.validate(formData, { abortEarly: false })
} catch (err) {
  if (err instanceof yup.ValidationError) {
    err.inner.forEach(e => showFieldError(e.path, e.message))
  }
}
```

**Why this is a problem:** In forms, users want to see all errors at once rather than fixing them one by one.

### ❌ Mistake 3: Confusing `validate()` and `isValid()`

```typescript
// ❌ Bad: trying to get errors from isValid
const valid = await schema.isValid(data)
// valid is just true/false — no error details!

// ✅ Good: use validate() when you need error details
try {
  await schema.validate(data, { abortEarly: false })
} catch (err) {
  // err.inner has all the details
}
```

**Why this is a problem:** `isValid()` returns only a `boolean`. If you need error messages, use `validate()`.

### ❌ Mistake 4: Not checking the error type

```typescript
// ❌ Bad: assumes all errors are ValidationError
try {
  await schema.validate(data)
} catch (err) {
  console.log(err.errors) // might crash if err is not ValidationError
}

// ✅ Good: check the type first
try {
  await schema.validate(data)
} catch (err) {
  if (err instanceof yup.ValidationError) {
    console.log(err.errors)
  } else {
    throw err // re-throw unexpected errors
  }
}
```

**Why this is a problem:** Inside `try/catch` you may encounter not only a `ValidationError` but any other error (e.g. `TypeError`). Always check the type.

---

## 💡 Best Practices

1. **Use `InferType`** — don't duplicate types manually
2. **Always provide error messages** — `required('Name is required')` is better than `required()`
3. **Use `abortEarly: false`** for forms — show all errors at once
4. **Check `instanceof yup.ValidationError`** — not all errors are validation errors
5. **Keep schemas separate** — define schemas in separate files/constants for reuse

---

## 📚 Additional resources

- [Official Yup documentation](https://github.com/jquense/yup)
- [API Reference](https://github.com/jquense/yup#api)
- [TypeScript integration](https://github.com/jquense/yup#typescript-integration)

---

## What's next?

In the next level you will learn about:

- Primitive types: `string()`, `number()`, `boolean()`, `date()`
- Modifiers: `required()`, `nullable()`, `optional()`, `default()`
- Type casting and strict mode
