# Level 5: Arrays and Tuples

## Why validate arrays?

Arrays are one of the most common data structures: tags, roles, product lists, coordinates. Yup lets you validate both the array itself (length, required) and each of its elements.

---

## array().of() — basic array validation

### Creating an array schema

`yup.array()` creates an array schema. The `.of()` method defines the schema for each element:

```typescript
// Array of strings
const tagsSchema = yup.array().of(
  yup.string().required('Tag cannot be empty')
)

await tagsSchema.validate(['react', 'yup'])     // Valid
await tagsSchema.validate(['react', ''])         // Error: element invalid
await tagsSchema.validate('not an array')        // Error: type mismatch
```

### Array of objects

```typescript
const itemsSchema = yup.array().of(
  yup.object({
    id: yup.number().required(),
    name: yup.string().required(),
    price: yup.number().positive().required(),
  })
)

await itemsSchema.validate([
  { id: 1, name: 'Widget', price: 9.99 },
  { id: 2, name: 'Gadget', price: 24.99 },
])  // Valid
```

### Array of numbers

```typescript
const scoresSchema = yup.array().of(
  yup.number().required().min(0).max(100)
)

await scoresSchema.validate([85, 92, 78])   // Valid
await scoresSchema.validate([85, -5, 78])   // Error: -5 < 0
await scoresSchema.validate([85, 101, 78])  // Error: 101 > 100
```

🔥 **Key point:** `.of()` applies the schema to **every** element. If even one element is invalid — the entire array is invalid.

---

## Length constraints: min, max, length

### min(limit, message?)

Minimum number of elements:

```typescript
const schema = yup.array()
  .of(yup.string().required())
  .min(1, 'At least one item required')

await schema.validate([])          // Error: 'At least one item required'
await schema.validate(['hello'])   // Valid
```

### max(limit, message?)

Maximum number of elements:

```typescript
const schema = yup.array()
  .of(yup.string().required())
  .max(5, 'Maximum 5 items allowed')

await schema.validate(['a', 'b', 'c'])                   // Valid (3)
await schema.validate(['a', 'b', 'c', 'd', 'e', 'f'])   // Error (6 > 5)
```

### length(limit, message?)

Exact number of elements:

```typescript
const teamSchema = yup.array()
  .of(yup.string().required())
  .length(5, 'Team must have exactly 5 members')

await teamSchema.validate(['a', 'b', 'c', 'd', 'e'])   // Valid
await teamSchema.validate(['a', 'b'])                    // Error (2 !== 5)
```

### Combination

```typescript
const rolesSchema = yup.array()
  .of(yup.string().required())
  .required('Roles are required')
  .min(1, 'At least 1 role')
  .max(3, 'Max 3 roles')

await rolesSchema.validate(['admin', 'editor'])  // Valid
await rolesSchema.validate([])                    // Error: min 1
await rolesSchema.validate(['a', 'b', 'c', 'd']) // Error: max 3
```

---

## compact() and ensure()

### compact()

Removes "falsy" values from the array (transformation):

```typescript
const schema = yup.array().of(yup.string()).compact()

schema.cast(['hello', '', null, 'world', false, undefined])
// Result: ['hello', 'world']
```

### ensure()

Guarantees the value will become an array:

```typescript
const schema = yup.array().of(yup.number()).ensure()

schema.cast(null)       // []
schema.cast(undefined)  // []
schema.cast(42)         // [42]
schema.cast([1, 2])     // [1, 2]
```

💡 **Hint:** `ensure()` is useful when an API may return either a single value or an array.

---

## tuple() — fixed-length arrays

### What is a tuple?

A tuple is a fixed-length array where each element has its own type. Unlike a regular array, where all elements share the same type.

```typescript
import { tuple, string, number } from 'yup'

// [name: string, age: number]
const schema = tuple([
  string().required().label('name'),
  number().required().positive().integer().label('age'),
])

await schema.validate(['Alice', 25])    // Valid: ['Alice', 25]
await schema.validate(['Alice', -1])    // Error: age must be positive
await schema.validate(['Alice'])        // Error: missing age
```

### Coordinates

```typescript
const coordinatesSchema = yup.tuple([
  yup.number().required().min(-90).max(90),    // latitude
  yup.number().required().min(-180).max(180),  // longitude
])

await coordinatesSchema.validate([55.7558, 37.6173])   // Valid (Moscow)
await coordinatesSchema.validate([91, 0])               // Error: lat > 90
```

### Tuple with mixed types

```typescript
const entrySchema = yup.tuple([
  yup.string().required(),                              // name
  yup.number().required().positive(),                    // value
  yup.string().oneOf(['active', 'inactive']).required(), // status
])

await entrySchema.validate(['Widget', 42, 'active'])    // Valid
await entrySchema.validate(['Widget', 42, 'unknown'])   // Error: invalid status
```

📌 **Important:** Tuples have no default transformation. Yup does not coerce element types automatically the way `array()` does.

### label() for readable errors

```typescript
const schema = yup.tuple([
  yup.string().required().label('name'),
  yup.number().required().label('age'),
])

await schema.validate([undefined, undefined])
// Error: 'name is a required field'
// Without label: '[0] is a required field'
```

🔥 **Key point:** Use `.label()` for tuple elements — without it, error messages will contain indices instead of meaningful names.

---

## ⚠️ Common beginner mistakes

### ❌ Mistake 1: array() without of() does not validate elements

```typescript
// ❌ Bad: no element validation
const schema = yup.array()
await schema.validate([1, 'two', null, {}])  // Valid! No element checks

// ✅ Good: always specify element schema
const schema = yup.array().of(yup.number().required())
await schema.validate([1, 'two', null])  // Error
```

**Why it matters:** Without `.of()`, Yup only checks that the value is an array, but does not validate its contents.

### ❌ Mistake 2: Confusing required() on the array vs. its elements

```typescript
// ❌ Bad: required on array, but elements can be empty strings
const schema = yup.array()
  .of(yup.string())  // element not required!
  .required()         // array itself required

await schema.validate(['', ''])  // Valid! Elements are empty strings

// ✅ Good: required on both
const schema = yup.array()
  .of(yup.string().required('Element required'))
  .required('Array required')
  .min(1, 'At least one')
```

**Why it matters:** `required()` on an array checks that the array exists (not null/undefined), but not that its elements are non-empty. Add `required()` to `.of()` as well.

### ❌ Mistake 3: Using array instead of tuple for fixed structures

```typescript
// ❌ Bad: array doesn't enforce position types
const schema = yup.array().of(yup.mixed())
await schema.validate([42, 'hello'])  // Valid, but no type safety

// ✅ Good: tuple for fixed-length typed arrays
const schema = yup.tuple([
  yup.number().required(),
  yup.string().required(),
])
```

**Why it matters:** `array().of()` applies the same schema to all elements. If elements have different types — use `tuple()`.

### ❌ Mistake 4: Forgetting min(1) for a "non-empty array"

```typescript
// ❌ Bad: required() alone allows empty array
const schema = yup.array().of(yup.string()).required()
await schema.validate([])  // Valid! Empty array is not null

// ✅ Good: add min(1) to reject empty arrays
const schema = yup.array().of(yup.string()).required().min(1, 'Cannot be empty')
await schema.validate([])  // Error: 'Cannot be empty'
```

**Why it matters:** An empty array `[]` is neither null nor undefined, so `required()` lets it through. Use `.min(1)` to reject empty arrays.

---

## 💡 Best Practices

1. **Always specify `.of()`** — an array without an element schema is useless
2. **`min(1)` for a non-empty array** — `required()` alone is not enough
3. **`tuple()` for fixed structures** — coordinates, key-value pairs
4. **`.label()` for tuple elements** — readable messages instead of indices
5. **`compact()` before validation** — clean the array of empty values
6. **`ensure()` for optional arrays** — guarantees an array even from null

---

## What's next?

In the next level you will learn:

- Conditional validation: `when()` with `is/then/otherwise`
- Dependent fields: validation based on another field's value
- Complex conditions: multiple dependencies and nested conditions
