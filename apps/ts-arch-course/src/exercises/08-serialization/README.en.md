# Level 8: Serialization and Schemas

## 🎯 Level Goal

Learn to design type-safe serialization systems: infer TypeScript types from runtime schema definitions, create bidirectional codecs, and build migration pipelines for versioned data.

---

## The Problem: Gap Between Types and Runtime

TypeScript types exist only at compile time. When working with data from external sources (API, database, files), types are "erased" and we're left unprotected:

```typescript
// ❌ Type declared but no runtime check
interface User {
  id: number
  name: string
  email: string
}

const data = JSON.parse(rawJson) as User // Dangerous cast!
// If rawJson contains { id: "not-a-number" }, the error will surface later
```

We need a mechanism that:
1. Describes data structure once
2. Automatically infers the TypeScript type
3. Validates data at runtime

---

## Pattern 1: Schema Inference

The idea: define a schema as a plain object, and TypeScript **infers** the type from it.

### Defining Schema Fields

```typescript
type SchemaType = 'string' | 'number' | 'boolean'

interface SchemaField<T extends SchemaType> {
  type: T
  required?: boolean
}

function field<T extends SchemaType>(type: T, required = true): SchemaField<T> {
  return { type, required }
}
```

### Inferring Type from Schema

```typescript
// ✅ Conditional type mapping string literal to TypeScript type
type InferFieldType<T extends SchemaField<SchemaType>> =
  T extends SchemaField<'string'> ? string :
  T extends SchemaField<'number'> ? number :
  T extends SchemaField<'boolean'> ? boolean :
  never

// ✅ Recursive mapping of the entire schema
type InferSchema<T extends ObjectSchema> = {
  [K in keyof T]: T[K] extends SchemaField<SchemaType>
    ? T[K]['required'] extends false
      ? InferFieldType<T[K]> | undefined
      : InferFieldType<T[K]>
    : T[K] extends ObjectSchema
      ? InferSchema<T[K]>
      : never
}
```

### Usage

```typescript
const userSchema = createSchema({
  id: field('number'),
  name: field('string'),
  isActive: field('boolean'),
  nickname: field('string', false), // optional
})

// TypeScript automatically infers:
// { id: number; name: string; isActive: boolean; nickname: string | undefined }

const parsed = userSchema.parse(unknownData)
if (parsed) {
  parsed.id      // number ✅
  parsed.name    // string ✅
  parsed.unknown // Error! ✅
}
```

💡 **Key idea**: the type is defined once (in the schema) and used for both runtime validation and compile-time checking. This is the "single source of truth" principle for types.

---

## Pattern 2: Codecs

A codec is a pair of encode/decode functions with typed inputs and outputs:

```typescript
interface Codec<TDecoded, TEncoded> {
  encode: (value: TDecoded) => TEncoded
  decode: (value: TEncoded) => TDecoded
  pipe<TFinal>(other: Codec<TEncoded, TFinal>): Codec<TDecoded, TFinal>
}
```

### Basic Codecs

```typescript
const dateCodec = createCodec<Date, string>(
  (date) => date.toISOString(),
  (str) => new Date(str)
)

const base64Codec = createCodec<string, string>(
  (str) => btoa(str),
  (encoded) => atob(encoded)
)

const jsonCodec = createCodec<Record<string, unknown>, string>(
  (obj) => JSON.stringify(obj),
  (str) => JSON.parse(str)
)
```

### Composition via pipe

```typescript
// ✅ Compose: object -> JSON string -> Base64 string
const compressedJson = jsonCodec.pipe(base64Codec)
// Codec<Record<string, unknown>, string>

const encoded = compressedJson.encode({ name: 'Alice' })
// "eyJuYW1lIjoiQWxpY2UifQ=="

const decoded = compressedJson.decode(encoded)
// { name: 'Alice' }
```

🔥 **Key point**: `pipe` only works when the output type of the first codec matches the input type of the second. This is checked at compile time:

```typescript
// ❌ Error: jsonCodec outputs string, numberCodec expects number
jsonCodec.pipe(numberCodec) // Type error!
```

---

## Pattern 3: Type-Safe Data Migrations

When data schemas evolve, you need a migration mechanism:

```typescript
interface Migration<TFrom, TTo> {
  fromVersion: number
  toVersion: number
  migrate: (data: TFrom) => TTo
}

interface VersionedData<T> {
  version: number
  data: T
}
```

### Migration Chain

```typescript
// V1 -> V2: split name into firstName/lastName
const v1toV2 = createMigration<UserV1, UserV2>(1, 2, (data) => {
  const [first, ...rest] = data.name.split(' ')
  return {
    firstName: first,
    lastName: rest.join(' '),
    email: data.email,
    createdAt: new Date().toISOString(),
  }
})

// V2 -> V3: email -> emails (object)
const v2toV3 = createMigration<UserV2, UserV3>(2, 3, (data) => ({
  ...data,
  emails: { primary: data.email },
  role: 'user',
}))
```

### Migration Pipeline

```typescript
class MigrationPipeline {
  private migrations: Migration<unknown, unknown>[] = []

  register<TFrom, TTo>(migration: Migration<TFrom, TTo>): this {
    this.migrations.push(migration as Migration<unknown, unknown>)
    return this
  }

  migrate<T>(versioned: VersionedData<unknown>, target: number): VersionedData<T> {
    let current = versioned
    for (const m of this.migrations) {
      if (current.version === m.fromVersion && m.toVersion <= target) {
        current = { version: m.toVersion, data: m.migrate(current.data) }
      }
    }
    return current as VersionedData<T>
  }
}

// ✅ V1 data automatically passes through all intermediate migrations
const result = pipeline.migrate<UserV4>(v1Data, 4)
// V1 -> V2 -> V3 -> V4 — all transformations applied
```

📌 **Important**: each migration is typed (input V1, output V2), guaranteeing transformation correctness at definition time. The pipeline applies migrations sequentially by version numbers.

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: as Instead of Validation

```typescript
// ❌ Type assertion — no runtime protection
const user = data as User

// ✅ Validation through schema
const user = userSchema.parse(data)
if (user) {
  // Here user definitely matches the type
}
```

### Mistake 2: Broken encode/decode Roundtrip

```typescript
// ❌ encode and decode are inconsistent
const broken = createCodec<Date, string>(
  (d) => d.toISOString(),
  (s) => new Date(s + 'INVALID') // Roundtrip broken!
)

// ✅ Always verify roundtrip: decode(encode(x)) === x
const correct = createCodec<Date, string>(
  (d) => d.toISOString(),
  (s) => new Date(s)
)
```

### Mistake 3: Skipping Versions in Migrations

```typescript
// ❌ V1->V2 and V3->V4 exist, but no V2->V3 — data gets stuck at V2
pipeline.register(v1toV2)
pipeline.register(v3toV4) // V2->V3 is missing!

// ✅ All intermediate versions must be covered
pipeline.register(v1toV2)
pipeline.register(v2toV3)
pipeline.register(v3toV4)
```

### Mistake 4: Mutating Data in Migrations

```typescript
// ❌ Mutating source data
const migration = createMigration<V1, V2>(1, 2, (data) => {
  (data as any).newField = 'value' // Mutates the original!
  return data as unknown as V2
})

// ✅ Create a new object
const migration = createMigration<V1, V2>(1, 2, (data) => ({
  ...data,
  newField: 'value',
}))
```

---

## 💡 Best Practices

1. **Schema as single source of truth** — define structure once, derive types and validation from it
2. **Roundtrip test for codecs** — `decode(encode(x))` should return an equivalent of `x`
3. **Version your data** — each record contains a version number for correct migration
4. **Immutable migrations** — create new objects, don't mutate old ones
5. **Linear migration chain** — each version has exactly one migration to the next
6. **Compose codecs** via `pipe` — instead of monolithic encode/decode

---

## 📌 Summary

| Pattern | When to Use | Key Features |
|---------|------------|--------------|
| Schema Inference | Validating external data | Single source of truth for types and runtime |
| Codec | Converting data between formats | Bidirectional, composable |
| Data Migrations | Data schema evolution | Versioned, sequential |
