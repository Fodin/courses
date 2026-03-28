# Level 2: String Validation

## Built-in string validations

Yup provides a set of ready-made methods for validating common string formats. This eliminates the need to write regular expressions by hand for typical cases.

---

## email() and url()

### email()

Checks that the string is a valid email address:

```typescript
const emailSchema = yup.string().email('Invalid email format')

await emailSchema.validate('user@example.com')   // Valid
await emailSchema.validate('user@domain')         // Error (no TLD)
await emailSchema.validate('user.name@co.uk')     // Valid
await emailSchema.validate('@example.com')        // Error
await emailSchema.validate('user@')               // Error
```

📌 **Important:** `email()` uses a simplified check (regex), not the full RFC 5322 specification. For most cases this is sufficient.

### url()

Checks that the string is a valid URL:

```typescript
const urlSchema = yup.string().url('Invalid URL')

await urlSchema.validate('https://example.com')       // Valid
await urlSchema.validate('http://localhost:3000')      // Valid
await urlSchema.validate('ftp://files.example.com')   // Valid
await urlSchema.validate('example.com')               // Error (no protocol)
await urlSchema.validate('not a url')                 // Error
```

💡 **Hint:** `url()` requires a protocol (`http://`, `https://`, `ftp://`). A bare `example.com` will not pass validation.

---

## Length constraints: min, max, length

### min(limit, message?)

Minimum string length:

```typescript
const schema = yup.string().min(3, 'At least 3 characters')

await schema.validate('Hi')    // Error: 'At least 3 characters'
await schema.validate('Hey')   // Valid (length 3)
await schema.validate('Hello') // Valid (length 5)
```

### max(limit, message?)

Maximum string length:

```typescript
const schema = yup.string().max(10, 'At most 10 characters')

await schema.validate('Hello')           // Valid
await schema.validate('Hello World!')    // Error: 'At most 10 characters'
```

### length(limit, message?)

Exact string length:

```typescript
const pinSchema = yup.string().length(4, 'PIN must be exactly 4 digits')

await pinSchema.validate('1234')  // Valid
await pinSchema.validate('123')   // Error
await pinSchema.validate('12345') // Error
```

🔥 **Key point:** Combine for flexible constraints:

```typescript
// Username: 3-20 characters
const usernameSchema = yup.string()
  .required('Username is required')
  .min(3, 'Too short')
  .max(20, 'Too long')

// ISO country code: exactly 2 characters
const countrySchema = yup.string()
  .required()
  .length(2, 'Must be 2-letter country code')
  .uppercase()
```

---

## matches() — validation by regular expression

`matches(regex, message?)` lets you validate a string against any pattern:

```typescript
// Russian phone number
const phoneSchema = yup.string()
  .required('Phone is required')
  .matches(/^\+7\d{10}$/, 'Phone must be +7XXXXXXXXXX')

await phoneSchema.validate('+79001234567') // Valid
await phoneSchema.validate('89001234567')  // Error
await phoneSchema.validate('+7123')        // Error

// Password with requirements
const passwordSchema = yup.string()
  .required()
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Must contain lowercase, uppercase, and number'
  )

await passwordSchema.validate('Password1')  // Valid
await passwordSchema.validate('password')   // Error (no uppercase, no digit)
```

### matches options

`matches()` accepts a second argument — an options object:

```typescript
const schema = yup.string().matches(/^[a-z]+$/, {
  message: 'Only lowercase letters',
  excludeEmptyString: true,  // Don't fail on empty string
})

await schema.validate('')     // Valid (empty excluded)
await schema.validate('abc')  // Valid
await schema.validate('ABC')  // Error
```

💡 **Hint:** `excludeEmptyString: true` is useful when a field is optional, but if filled in it must match the pattern.

---

## Transformations: trim, lowercase, uppercase

Yup can not only validate but also **transform** strings. Transformations are applied during the `cast` (type coercion) phase.

### trim()

Removes leading and trailing whitespace:

```typescript
const schema = yup.string().trim()

schema.cast('  hello  ')  // 'hello'
schema.cast('hello')      // 'hello' (no change)
```

### lowercase()

Converts to lowercase:

```typescript
const schema = yup.string().lowercase()

schema.cast('HELLO')      // 'hello'
schema.cast('Hello World') // 'hello world'
```

### uppercase()

Converts to uppercase:

```typescript
const schema = yup.string().uppercase()

schema.cast('hello')       // 'HELLO'
schema.cast('Hello World') // 'HELLO WORLD'
```

### Combining transformations

```typescript
const emailSchema = yup.string()
  .trim()
  .lowercase()
  .email('Invalid email')
  .required('Email is required')

// User enters: '  USER@EXAMPLE.COM  '
const result = await emailSchema.validate('  USER@EXAMPLE.COM  ')
// result: 'user@example.com' (trimmed + lowercased + validated)
```

📌 **Important:** Transformations are applied **before** validation. So `trim().min(3)` trims whitespace first, then checks the length:

```typescript
const schema = yup.string().trim().min(3)

await schema.validate('  ab  ')
// After trim: 'ab' (length 2) → Error: min 3
```

---

## Strict mode and transformations

In strict mode, transformations are **not applied** and the value is checked as-is:

```typescript
const schema = yup.string().lowercase()

// Normal mode: transforms then validates
await schema.validate('HELLO')                    // 'hello' (transformed)

// Strict mode: no transforms, fails if not already lowercase
await schema.validate('HELLO', { strict: true })  // Error!
await schema.validate('hello', { strict: true })  // 'hello' (already lowercase)
```

🔥 **Key point:** Use `strict: true` when you want to **check** that a value is already in the correct format, rather than **transforming** it.

---

## ⚠️ Common beginner mistakes

### ❌ Mistake 1: Using matches() for email and url

```typescript
// ❌ Bad: reinventing the wheel
const emailSchema = yup.string().matches(
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  'Invalid email'
)

// ✅ Good: use built-in method
const emailSchema = yup.string().email('Invalid email')
```

**Why this is a problem:** The built-in `email()` and `url()` methods already contain battle-tested patterns. Custom regexes are easy to get wrong.

### ❌ Mistake 2: Forgetting that trim() is a transformation, not a validation

```typescript
// ❌ Bad: expecting trim() to fail on spaces
const schema = yup.string().trim().required()
await schema.validate('   ')
// Result: '' after trim → Error from required() (empty string)
// But NOT an error from trim() itself!

// ✅ Good: trim() transforms, required() validates
// If you want to reject spaces, use matches:
const strictSchema = yup.string().matches(/^\S.*\S$/, 'No leading/trailing spaces')
```

**Why this is a problem:** `trim()` removes spaces but does not throw an error. To **forbid** spaces, use `matches()` or `strict: true`.

### ❌ Mistake 3: Wrong order — transformation after validation

```typescript
// ❌ Bad: min() checked before trim() in this mental model
// (actually Yup applies ALL transforms first, then ALL validations)
const schema = yup.string().min(3).trim()

// BUT this is fine in Yup — transforms always run before validations
// Just be aware that order of trim() in chain doesn't matter for execution
```

**Why this is a problem:** In Yup, transformations always run before validations regardless of their position in the chain. For readability, it is best to write transformations first:

```typescript
// ✅ Good: transforms first, then validations
yup.string().trim().lowercase().min(3).max(50).required()
```

### ❌ Mistake 4: url() without a protocol

```typescript
// ❌ Bad: user enters domain without protocol
await urlSchema.validate('example.com') // Error!

// ✅ Good: tell users to include protocol, or transform:
const schema = yup.string()
  .transform((value) => {
    if (value && !value.startsWith('http')) {
      return `https://${value}`
    }
    return value
  })
  .url('Invalid URL')
```

**Why this is a problem:** `url()` requires a protocol. If users frequently enter domains without `https://`, add a transformation.

---

## 💡 Best Practices

1. **Use built-in methods** (`email()`, `url()`) instead of custom regexes
2. **Combine transformations** — `trim().lowercase()` for email fields
3. **Write transformations first** in the chain for readability
4. **Use `excludeEmptyString`** in `matches()` for optional fields
5. **Strict mode** for validation without transformation (API validation)
6. **Always provide custom messages** — `min(3, 'Too short')` is better than the default

---

## What's next?

In the next level you will learn about:

- Number validations: `min()`, `max()`, `positive()`, `negative()`, `integer()`
- Date validations: `min()`, `max()`, ranges
- Number transformations: `round()`, `truncate()`
