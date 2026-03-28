# Level 6: Conditional Validation

## Why do we need conditional validation?

In real-world forms, validation rules often **depend on the values of other fields**. For example:
- If the account type is "business" — a tax ID is required
- If the delivery method is "courier" — an address is mandatory
- If the country is "US" — the zip code must be 5 digits

Yup solves this with the `.when()` method, which lets you **dynamically change schema rules** based on other fields.

---

## when() — basic usage

### Simplest case

The `.when()` method takes the name of a dependency field and an object with conditions:

```typescript
import * as yup from 'yup'

const schema = yup.object({
  isBusiness: yup.boolean(),
  companyName: yup.string().when('isBusiness', {
    is: true,
    then: (schema) => schema.required('Company name is required'),
    otherwise: (schema) => schema.optional(),
  }),
})

// isBusiness = true → companyName required
await schema.validate({ isBusiness: true, companyName: 'Acme' }) // ✅
await schema.validate({ isBusiness: true })                       // ❌ Error

// isBusiness = false → companyName optional
await schema.validate({ isBusiness: false })                      // ✅
```

### How it works

1. `when('isBusiness', ...)` — watches the value of the `isBusiness` field
2. `is: true` — condition: when `isBusiness === true`
3. `then: (schema) => ...` — schema when the condition is met
4. `otherwise: (schema) => ...` — schema when it is not (optional)

🔥 **Key point:** `then` and `otherwise` receive the **current schema** as an argument — you extend it rather than create a new one from scratch.

---

## is/then/otherwise — full syntax

### is as a function

`is` can be not just a value, but also a function:

```typescript
const schema = yup.object({
  age: yup.number(),
  guardianName: yup.string().when('age', {
    is: (age: number) => age < 18,
    then: (schema) => schema.required('Guardian required for minors'),
    otherwise: (schema) => schema.optional(),
  }),
})
```

### Without otherwise

If `otherwise` is not needed, you can omit it:

```typescript
const schema = yup.object({
  hasNewsletter: yup.boolean(),
  email: yup.string().when('hasNewsletter', {
    is: true,
    then: (schema) => schema.required().email('Enter valid email'),
  }),
})
```

### Functional when() syntax

For more complex cases, `when()` accepts a function:

```typescript
const schema = yup.object({
  paymentMethod: yup.string().oneOf(['card', 'bank', 'cash']),
  cardNumber: yup.string().when('paymentMethod', ([method], schema) => {
    return method === 'card'
      ? schema.required('Card number required').length(16)
      : schema.optional()
  }),
})
```

📌 **Important:** In the functional syntax, the value of the dependency field arrives as an **array** — `[method]`, even if there is only one field.

---

## when() with multiple fields

### Depending on two fields

You can specify an array of dependency fields:

```typescript
const schema = yup.object({
  country: yup.string().required(),
  hasState: yup.boolean(),
  state: yup.string().when(['country', 'hasState'], {
    is: (country: string, hasState: boolean) =>
      country === 'US' && hasState === true,
    then: (schema) => schema.required('State required for US'),
    otherwise: (schema) => schema.optional(),
  }),
})
```

### Functional syntax with multiple fields

```typescript
const schema = yup.object({
  deliveryType: yup.string().oneOf(['pickup', 'courier', 'post']),
  urgency: yup.string().oneOf(['normal', 'express']),
  address: yup.string().when(
    ['deliveryType', 'urgency'],
    ([delivery, urgency], schema) => {
      if (delivery === 'courier') {
        return schema.required('Address required for courier delivery')
      }
      if (delivery === 'post' && urgency === 'express') {
        return schema.required('Address required for express post')
      }
      return schema.optional()
    }
  ),
})
```

💡 **Hint:** The functional syntax is more convenient when the logic is more complex than a simple comparison.

---

## Nested conditions

### Multiple when() on a single field

You can chain multiple `.when()` calls on one field:

```typescript
const schema = yup.object({
  accountType: yup.string().oneOf(['personal', 'business']),
  country: yup.string().required(),
  taxId: yup.string()
    .when('accountType', {
      is: 'business',
      then: (schema) => schema.required('Tax ID required for business'),
    })
    .when('country', {
      is: 'US',
      then: (schema) => schema.matches(/^\d{9}$/, 'US Tax ID must be 9 digits'),
    }),
})
```

⚠️ **Note:** Each `.when()` **extends** the schema. If `accountType = 'business'` and `country = 'US'`, then `taxId` will be simultaneously `required` AND must match the 9-digit format.

### when() inside nested objects

```typescript
const schema = yup.object({
  shipping: yup.object({
    method: yup.string().oneOf(['standard', 'express']),
    trackingNumber: yup.string().when('method', {
      is: 'express',
      then: (schema) => schema.required('Tracking required for express'),
    }),
  }),
})
```

📌 **Important:** `when()` by default looks for fields **at the same object level**. To reference fields from a parent object, use the `$`-context (Level 8).

---

## ⚠️ Common beginner mistakes

### ❌ Mistake 1: Forgetting that then/otherwise receive the schema

```typescript
// ❌ Bad: creating schema from scratch
const schema = yup.object({
  hasBio: yup.boolean(),
  bio: yup.string().min(10).when('hasBio', {
    is: true,
    then: () => yup.string().required(), // lost min(10)!
  }),
})

// ✅ Good: extending the passed schema
const schema = yup.object({
  hasBio: yup.boolean(),
  bio: yup.string().min(10).when('hasBio', {
    is: true,
    then: (schema) => schema.required(), // keeps min(10)
  }),
})
```

**Why it matters:** `then` receives the current schema with all already-configured rules. Creating a new schema loses all previous rules (min, max, matches, etc.).

### ❌ Mistake 2: Not including the field in the object shape

```typescript
// ❌ Bad: isBusiness not in schema
const schema = yup.object({
  companyName: yup.string().when('isBusiness', {
    is: true,
    then: (schema) => schema.required(),
  }),
})
// when() won't work — isBusiness not tracked

// ✅ Good: include the dependency field
const schema = yup.object({
  isBusiness: yup.boolean().required(),
  companyName: yup.string().when('isBusiness', {
    is: true,
    then: (schema) => schema.required(),
  }),
})
```

**Why it matters:** `when()` can only reference fields declared in the same object. If the field is not in the shape — the condition will never fire.

### ❌ Mistake 3: Forgetting array destructuring in the functional syntax

```typescript
// ❌ Bad: value is an array, not the field value
const schema = yup.object({
  role: yup.string(),
  permissions: yup.array().when('role', (role, schema) => {
    // role is ARRAY [roleValue], not string!
    return role === 'admin' ? schema.min(1) : schema
  }),
})

// ✅ Good: destructure the array
const schema = yup.object({
  role: yup.string(),
  permissions: yup.array().when('role', ([role], schema) => {
    return role === 'admin' ? schema.min(1) : schema
  }),
})
```

**Why it matters:** In the functional `when()` syntax, dependency values arrive as an **array**. Without destructuring you are comparing an array instead of a value.

### ❌ Mistake 4: Circular dependencies

```typescript
// ❌ Bad: circular dependency
const schema = yup.object({
  a: yup.string().when('b', {
    is: 'x',
    then: (s) => s.required(),
  }),
  b: yup.string().when('a', {
    is: 'y',
    then: (s) => s.required(),
  }),
})
// Error: Cyclic dependency

// ✅ Good: use one-directional dependency or $context
```

**Why it matters:** Yup cannot resolve mutual dependencies. Use context (`$`) for one of the fields, or reconsider the schema architecture.

---

## 💡 Best Practices

1. **Always use the schema parameter in then/otherwise** — do not create a new schema, extend the current one
2. **Functional syntax for complex logic** — `is` as a function or fully functional `when()`
3. **Destructure in the functional syntax** — `([value], schema)`, not `(value, schema)`
4. **All dependencies must be in the shape** — otherwise `when()` will not see the field
5. **Avoid circular dependencies** — A depends on B, B depends on A = error
6. **One condition per one concern** — multiple `.when()` calls are better than one giant one

---

## What's next?

In the next level you will learn:

- Custom validators: `test()` with synchronous and asynchronous logic
- Transformations: `transform()` for preprocessing data
- Extending Yup: `addMethod()` for reusable rules
