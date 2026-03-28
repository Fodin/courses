# Level 4: Object Schemas

## Why do we need object schemas?

In real applications, data almost always arrives as objects — user profiles, forms, API responses. Yup lets you describe the structure of an object and validate each field according to its own rules.

---

## object() and shape()

### Basic creation

`yup.object()` creates an object schema. Fields are described directly in the constructor or via `.shape()`:

```typescript
// Option 1: fields in the constructor
const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().required().positive().integer(),
  email: yup.string().email('Invalid email'),
})

// Option 2: via shape() — equivalent
const userSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  age: yup.number().required().positive().integer(),
  email: yup.string().email('Invalid email'),
})
```

### Validating an object

```typescript
// Valid object
await userSchema.validate({
  name: 'Alice',
  age: 28,
  email: 'alice@example.com',
})
// Returns: { name: 'Alice', age: 28, email: 'alice@example.com' }

// Invalid: missing required fields
await userSchema.validate({ name: 'Bob' })
// Error: 'age is a required field'
```

### abortEarly: false

By default Yup stops at the first error. Pass `abortEarly: false` to collect all errors:

```typescript
try {
  await userSchema.validate({}, { abortEarly: false })
} catch (err) {
  console.log(err.errors)
  // ['Name is required', 'age is a required field']

  console.log(err.inner)
  // Array of ValidationError objects with .path and .message
  err.inner.forEach(e => {
    console.log(`${e.path}: ${e.message}`)
  })
  // 'name: Name is required'
  // 'age: age is a required field'
}
```

🔥 **Key point:** `err.inner` contains an array of errors with field paths — indispensable for displaying errors in forms.

---

## Nested objects

Objects can contain other objects:

```typescript
const profileSchema = yup.object({
  user: yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
  }),
  address: yup.object({
    city: yup.string().required('City is required'),
    zipCode: yup.string()
      .required('Zip is required')
      .matches(/^\d{5,6}$/, 'Invalid zip code'),
    country: yup.string().required(),
  }),
})
```

### Error paths in nested objects

When an error occurs, the path points to the specific field using dot notation:

```typescript
try {
  await profileSchema.validate(
    { user: { firstName: '' }, address: {} },
    { abortEarly: false }
  )
} catch (err) {
  err.inner.forEach(e => console.log(e.path))
  // 'user.firstName'
  // 'user.lastName'
  // 'address.city'
  // 'address.zipCode'
  // 'address.country'
}
```

💡 **Hint:** Paths like `user.firstName` let you pinpoint which field has an error — very convenient for form integrations (React Hook Form, Formik).

---

## pick, omit, partial

Yup lets you create new schemas from existing ones — without duplicating code.

### pick(keys)

Creates a schema with only the specified fields:

```typescript
const fullSchema = yup.object({
  name: yup.string().required(),
  age: yup.number().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
})

// Only name and email
const publicSchema = fullSchema.pick(['name', 'email'])

await publicSchema.validate({ name: 'Alice', email: 'a@b.com' })  // Valid
await publicSchema.validate({ name: 'Alice' })  // Error: email required
```

### omit(keys)

Creates a schema without the specified fields:

```typescript
// Everything except phone
const withoutPhone = fullSchema.omit(['phone'])

await withoutPhone.validate({
  name: 'Alice',
  age: 25,
  email: 'a@b.com',
})  // Valid (phone not required)
```

### partial()

Makes all fields optional:

```typescript
const partialSchema = fullSchema.partial()

await partialSchema.validate({})          // Valid (all optional)
await partialSchema.validate({ name: 'Alice' })  // Valid
```

📌 **Important:** `partial()` removes `required()` from all fields, but other validations remain:

```typescript
const partialSchema = fullSchema.partial()

// email is optional, but if provided must be valid
await partialSchema.validate({ email: 'bad' })  // Error: 'Invalid email'
await partialSchema.validate({ email: 'a@b.com' })  // Valid
```

---

## noUnknown and strict

### noUnknown(message?)

Forbids fields not described in the schema:

```typescript
const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email(),
}).noUnknown('Unknown field: ${unknown}')

// Without noUnknown: extra fields silently ignored
// With noUnknown: extra fields cause error
await schema.validate(
  { name: 'Alice', email: 'a@b.com', extra: 'field' },
  { strict: true }
)
// Error: 'Unknown field: extra'
```

### stripUnknown

Instead of throwing an error, you can **remove** unknown fields:

```typescript
const schema = yup.object({
  name: yup.string().required(),
}).noUnknown()

const result = await schema.validate(
  { name: 'Alice', extra: 'field' },
  { stripUnknown: true }
)
// result: { name: 'Alice' } — extra removed
```

### strict and noUnknown

`noUnknown()` behaves differently depending on `strict`:

```typescript
const schema = yup.object({ name: yup.string() }).noUnknown()

// strict: false (default) — unknown fields are stripped before check
await schema.validate({ name: 'A', extra: 1 })
// Valid: { name: 'A' } — extra stripped

// strict: true — no stripping, noUnknown fires
await schema.validate({ name: 'A', extra: 1 }, { strict: true })
// Error: unknown field
```

🔥 **Key point:** In non-strict mode `noUnknown()` may not fire because extra fields are removed before the check. For strict API validation, pass `{ strict: true }`.

---

## ⚠️ Common beginner mistakes

### ❌ Mistake 1: Forgetting abortEarly: false

```typescript
// ❌ Bad: only first error shown
try {
  await schema.validate(data)
} catch (err) {
  console.log(err.message) // Only one error
}

// ✅ Good: collect all errors
try {
  await schema.validate(data, { abortEarly: false })
} catch (err) {
  console.log(err.errors) // All errors
  err.inner.forEach(e => {
    console.log(`${e.path}: ${e.message}`)
  })
}
```

**Why this is a problem:** By default Yup throws on the first invalid field. For forms you almost always need all errors at once.

### ❌ Mistake 2: Duplicating schemas instead of using pick/omit

```typescript
// ❌ Bad: copy-paste full schema
const createUserSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
})

const updateUserSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  // password not needed for update
})

// ✅ Good: derive from base schema
const baseSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
})

const updateSchema = baseSchema.omit(['password'])
```

**Why this is a problem:** Duplication leads to drift — change a rule in one place, forget to update the other.

### ❌ Mistake 3: noUnknown without strict

```typescript
// ❌ Bad: noUnknown without strict — unknown fields stripped before check
const schema = yup.object({ name: yup.string() }).noUnknown()
await schema.validate({ name: 'A', hack: true })
// No error! 'hack' was stripped

// ✅ Good: use strict: true with noUnknown
await schema.validate({ name: 'A', hack: true }, { strict: true })
// Error: unknown field
```

**Why this is a problem:** Without `strict: true`, Yup removes unknown fields first and then checks — `noUnknown()` finds nothing extra.

### ❌ Mistake 4: Not using err.inner for field paths

```typescript
// ❌ Bad: only err.message — no field paths
catch (err) {
  setError(err.message)
}

// ✅ Good: use err.inner for per-field errors
catch (err) {
  const fieldErrors = {}
  err.inner.forEach(e => {
    fieldErrors[e.path] = e.message
  })
  setErrors(fieldErrors)
}
```

**Why this is a problem:** `err.message` contains only the text of the first error. `err.inner` provides an array of errors with paths — exactly what forms need.

---

## 💡 Best Practices

1. **Always use `abortEarly: false`** for form validation
2. **`err.inner`** for mapping errors to form fields
3. **`pick()`/`omit()`** instead of duplicating schemas for create/update
4. **`partial()`** for PATCH requests where all fields are optional
5. **`noUnknown()` + `strict: true`** for strict API validation
6. **`stripUnknown: true`** when you want to silently remove extra fields (sanitization)

---

## What's next?

In the next level you will learn about:

- Arrays: `array().of()`, `min()`, `max()`, `length()`
- Tuples: `tuple()` for fixed-length arrays
- Validating array elements
