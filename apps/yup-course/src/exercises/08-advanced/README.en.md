# Level 8: Advanced Techniques

## Overview

This final level covers advanced Yup features:
- `ref()` — references to other fields for cross-validation
- `lazy()` — dynamic and recursive schemas
- `InferType` — inferring TypeScript types from schemas
- Final project — a comprehensive validation system

---

## ref() — references to other fields

### Basic usage

`yup.ref('field')` creates a reference to the value of another field in the same schema:

```typescript
import * as yup from 'yup'

const schema = yup.object({
  password: yup.string().required().min(8),
  confirmPassword: yup.string()
    .required('Please confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

await schema.validate({
  password: 'MyPass123',
  confirmPassword: 'MyPass123',
})  // ✅ Valid

await schema.validate({
  password: 'MyPass123',
  confirmPassword: 'Different',
})  // ❌ Error: 'Passwords must match'
```

### ref in numeric comparisons

```typescript
const rangeSchema = yup.object({
  minPrice: yup.number().required().min(0),
  maxPrice: yup.number()
    .required()
    .moreThan(yup.ref('minPrice'), 'Max must be greater than min'),
})

const dateSchema = yup.object({
  startDate: yup.date().required(),
  endDate: yup.date()
    .required()
    .min(yup.ref('startDate'), 'End date must be after start date'),
})
```

### Context ($prefix)

References with `$` access the **context**, not the schema's fields:

```typescript
const schema = yup.object({
  discount: yup.number()
    .max(yup.ref('$maxDiscount'), 'Discount exceeds maximum allowed'),
})

await schema.validate(
  { discount: 50 },
  { context: { maxDiscount: 100 } }
)  // ✅ Valid

await schema.validate(
  { discount: 150 },
  { context: { maxDiscount: 100 } }
)  // ❌ Error: 'Discount exceeds maximum allowed'
```

🔥 **Key point:** Context (`$`) lets you pass external data into validation without including it in the schema itself. This solves the problem of circular dependencies.

---

## lazy() — dynamic and recursive schemas

### Why lazy is needed

`yup.lazy()` creates a schema **on the fly**, based on the value:

```typescript
import { lazy, string, number, object } from 'yup'

// Schema depends on actual value type
const flexibleSchema = lazy((value) => {
  if (typeof value === 'number') {
    return number().min(0).max(100)
  }
  return string().required()
})

await flexibleSchema.validate(42)       // ✅ number, valid
await flexibleSchema.validate('hello')  // ✅ string, valid
await flexibleSchema.validate(-1)       // ❌ number, min 0
```

### Recursive schemas

The main power of `lazy()` is recursion. For example, a comment tree:

```typescript
interface TreeNode {
  id: number
  label: string
  children: TreeNode[]
}

const nodeSchema: yup.ObjectSchema<TreeNode> = yup.object({
  id: yup.number().required(),
  label: yup.string().required(),
  children: yup.array().of(
    yup.lazy(() => nodeSchema.default(undefined)) as yup.Schema<TreeNode>
  ).default([]),
})

await nodeSchema.validate({
  id: 1,
  label: 'Root',
  children: [
    {
      id: 2,
      label: 'Child',
      children: [
        { id: 3, label: 'Grandchild', children: [] },
      ],
    },
  ],
})  // ✅ Valid
```

📌 **Important:** With recursion, always use `.default(undefined)` inside `lazy()`, otherwise Yup will enter an infinite loop when trying to resolve the default value.

### lazy() based on a field value

```typescript
const dynamicSchema = yup.object({
  type: yup.string().oneOf(['text', 'number', 'email']).required(),
  value: yup.lazy((_value, { parent }) => {
    switch (parent.type) {
      case 'number':
        return yup.number().required()
      case 'email':
        return yup.string().email().required()
      default:
        return yup.string().required()
    }
  }),
})
```

💡 **Hint:** The second argument of `lazy()` contains `{ parent, path, value }` — you can access neighboring fields.

---

## InferType — TypeScript types from schemas

### Basic usage

`InferType` infers a TypeScript type from a Yup schema:

```typescript
import { object, string, number, InferType } from 'yup'

const userSchema = object({
  name: string().required(),
  age: number().required().positive(),
  email: string().email().optional(),
  role: string().oneOf(['admin', 'user'] as const).required(),
})

type User = InferType<typeof userSchema>
// type User = {
//   name: string
//   age: number
//   email?: string | undefined
//   role: 'admin' | 'user'
// }
```

### Optional, nullable, and default

```typescript
const schema = object({
  required: string().required(),           // string
  optional: string().optional(),           // string | undefined
  nullable: string().nullable().required(), // string | null
  withDefault: string().default('hello'),  // string (always has value)
  defined: string().defined(),             // string (not undefined)
})

type Result = InferType<typeof schema>
// {
//   required: string
//   optional?: string | undefined
//   nullable: string | null
//   withDefault: string
//   defined: string
// }
```

### ObjectSchema for compatibility checking

You can bind a schema to an existing interface:

```typescript
import { ObjectSchema, object, string, number } from 'yup'

interface Product {
  name: string
  price: number
  sku: string
}

// TypeScript will verify that the schema matches the interface
const productSchema: ObjectSchema<Product> = object({
  name: string().required(),
  price: number().required().positive(),
  sku: string().required(),
})
```

🔥 **Key point:** `ObjectSchema<T>` guarantees that your schema matches interface `T`. If you forget a field or specify a wrong type — TypeScript will show an error.

### Generic functions with schemas

```typescript
async function validateData<T>(
  schema: yup.Schema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const validated = await schema.validate(data, { abortEarly: false })
    return { success: true, data: validated }
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return { success: false, errors: err.errors }
    }
    throw err
  }
}

const result = await validateData(userSchema, unknownData)
if (result.success) {
  console.log(result.data.name)  // TypeScript knows it's User
}
```

---

## ⚠️ Common beginner mistakes

### ❌ Mistake 1: ref to a non-existent field

```typescript
// ❌ Bad: 'password' not in this schema
const confirmSchema = yup.string()
  .oneOf([yup.ref('password')], 'Must match')  // ref won't resolve!

// ✅ Good: ref works within the same object schema
const schema = yup.object({
  password: yup.string().required(),
  confirm: yup.string()
    .oneOf([yup.ref('password')], 'Must match'),
})
```

**Why it matters:** `ref()` resolves relative to the nearest parent `object()`. Outside of an object — the reference will not find the field.

### ❌ Mistake 2: lazy without default for recursion

```typescript
// ❌ Bad: infinite loop when resolving defaults
const nodeSchema = yup.object({
  children: yup.array().of(
    yup.lazy(() => nodeSchema)  // infinite recursion!
  ),
})

// ✅ Good: add .default(undefined)
const nodeSchema = yup.object({
  children: yup.array().of(
    yup.lazy(() => nodeSchema.default(undefined))
  ).default([]),
})
```

**Why it matters:** Yup tries to compute the default value recursively. Without `.default(undefined)` this results in an infinite loop.

### ❌ Mistake 3: InferType with non-const oneOf

```typescript
// ❌ Bad: type is just 'string'
const schema = yup.string().oneOf(['admin', 'user'])
type Role = InferType<typeof schema>  // string | undefined

// ✅ Good: use 'as const' for literal types
const schema = yup.string().oneOf(['admin', 'user'] as const)
type Role = InferType<typeof schema>  // 'admin' | 'user' | undefined
```

**Why it matters:** Without `as const`, TypeScript widens literal types to `string`. With `as const` — the exact values are preserved.

### ❌ Mistake 4: Confusing ref and when for cross-validation

```typescript
// ❌ Not ideal: when for simple comparison
const schema = yup.object({
  password: yup.string().required(),
  confirm: yup.string().when('password', ([password], schema) =>
    schema.test('match', 'Must match', (v) => v === password)
  ),
})

// ✅ Better: ref for simple field references
const schema = yup.object({
  password: yup.string().required(),
  confirm: yup.string()
    .oneOf([yup.ref('password')], 'Must match'),
})
```

**Why it matters:** `ref()` is simpler and more readable for straightforward comparisons. `when()` is for conditional logic (different rules depending on a value).

---

## 💡 Best Practices

1. **`ref()` for cross-field comparisons** — password/confirm, min/max, dates
2. **Context `$` for external data** — configuration, user roles, feature flags
3. **`lazy()` for recursion** — trees, nested comments, arbitrary depth
4. **`InferType` instead of manual interfaces** — DRY: one schema = one type
5. **`as const` with `oneOf`** — to get literal types
6. **`ObjectSchema<T>` for compatibility checking** — guarantees the schema matches the interface

---

## Final Project

In the last task of this level you will create a **comprehensive user registration validation system**, combining all the techniques you have learned:
- Primitives, strings, numbers, dates
- Objects and arrays
- Conditional validation (when)
- Custom rules (test, transform)
- References (ref) and types (InferType)
