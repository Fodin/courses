# 🔥 Level 4: Exhaustive Matching

## 🎯 Why Exhaustive Matching Matters

In real applications we constantly work with variants: order statuses, notification types, HTTP methods, data loading states. Every time a new variant is added, we must guarantee that **all** code paths handling these variants are updated.

Without exhaustive matching, adding a new variant is a ticking time bomb. The code compiles, tests pass, but in production you suddenly get `undefined` instead of a result.

```typescript
type Status = 'active' | 'inactive' | 'suspended'

// ❌ Six months later 'pending' was added, but switch wasn't updated
function getLabel(status: Status): string {
  switch (status) {
    case 'active': return 'Active'
    case 'inactive': return 'Inactive'
    // suspended and pending not handled — silent failure
  }
  return 'Unknown' // default hides the problem
}
```

TypeScript provides powerful tools so the **compiler** catches these errors for us.

## 📌 Never Check: The Foundation of Exhaustive Matching

The `never` type in TypeScript means "this cannot happen". If a value reaches a point where its type is narrowed to `never`, something went wrong -- we didn't handle all variants.

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`)
}

type Status = 'active' | 'inactive' | 'suspended'

function getLabel(status: Status): string {
  switch (status) {
    case 'active': return 'Active'
    case 'inactive': return 'Inactive'
    case 'suspended': return 'Suspended'
    default: return assertNever(status) // ✅ compiler checks this
  }
}
```

If you add `'pending'` to the `Status` type, TypeScript immediately shows an error:

```
Argument of type 'string' is not assignable to parameter of type 'never'.
```

### How It Works Internally

TypeScript uses **control flow analysis**. In each `case` it **narrows** the variable type by subtracting handled variants:

```typescript
function explain(status: Status) {
  // status: 'active' | 'inactive' | 'suspended'

  if (status === 'active') {
    // status: 'active'
    return
  }
  // status: 'inactive' | 'suspended'

  if (status === 'inactive') {
    // status: 'inactive'
    return
  }
  // status: 'suspended'

  if (status === 'suspended') {
    // status: 'suspended'
    return
  }
  // status: never ← all variants handled
}
```

## 🔥 Match Expression: A Functional Alternative to Switch

`switch` works, but has problems: forgotten `break`, indentation, inability to use as an expression. A match function solves all of these:

```typescript
type MatchHandlers<T extends string, R> = {
  [K in T]: (value: K) => R
}

function match<T extends string>(value: T) {
  return {
    with<R>(handlers: MatchHandlers<T, R>): R {
      const handler = handlers[value]
      return handler(value)
    },
  }
}
```

### Usage

```typescript
type Theme = 'light' | 'dark' | 'system'

// ✅ Expression, not statement — can be used in const
const backgroundColor = match(theme).with({
  light: () => '#ffffff',
  dark: () => '#1a1a1a',
  system: () => window.matchMedia('(prefers-color-scheme: dark)').matches
    ? '#1a1a1a'
    : '#ffffff',
})
```

### Why It Works

Mapped type `{ [K in T]: ... }` guarantees that the `handlers` object contains a key for **every** variant of `T`. If `T = 'a' | 'b' | 'c'`, then handlers must have all three keys.

```typescript
// ❌ Compilation error: Property 'system' is missing
const bg = match(theme).with({
  light: () => '#ffffff',
  dark: () => '#1a1a1a',
  // system is missing!
})
```

## 📌 Tagged Unions and Pattern Matching

For more complex data types, **tagged unions** (discriminated unions) are used -- types with a shared discriminator field:

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number }
```

### Match for Tagged Unions

```typescript
function matchTagged<T extends { kind: string }>(value: T) {
  return {
    with<R>(
      handlers: { [K in T['kind']]: (val: Extract<T, { kind: K }>) => R }
    ): R {
      const handler = (handlers as Record<string, (val: T) => R>)[value.kind]
      return handler(value)
    },
  }
}
```

The key magic here is `Extract<T, { kind: K }>`. This utility type extracts from union `T` only the variant where `kind === K`. This gives access to specific fields of each variant:

```typescript
const area = matchTagged(shape).with({
  circle: (s) => Math.PI * s.radius ** 2,    // s: { kind: 'circle'; radius: number }
  rectangle: (s) => s.width * s.height,       // s: { kind: 'rectangle'; ... }
  triangle: (s) => 0.5 * s.base * s.height,   // s: { kind: 'triangle'; ... }
})
```

## 🔥 Variant Types: Constructors for Tagged Unions

Creating tagged unions manually each time is tedious. The **Variant** pattern provides type-safe constructors:

```typescript
type Variant<Tag extends string, Data = undefined> = Data extends undefined
  ? { readonly _tag: Tag }
  : { readonly _tag: Tag; readonly data: Data }

// Constructor function
function variant<Tag extends string>(tag: Tag): Variant<Tag>
function variant<Tag extends string, Data>(tag: Tag, data: Data): Variant<Tag, Data>
function variant(tag: string, data?: unknown) {
  return data === undefined ? { _tag: tag } : { _tag: tag, data }
}
```

### Practical Example: RemoteData

```typescript
type RemoteData<E, A> =
  | Variant<'NotAsked'>
  | Variant<'Loading'>
  | Variant<'Failure', E>
  | Variant<'Success', A>

// Constructors
const NotAsked = (): RemoteData<never, never> => variant('NotAsked')
const Loading = (): RemoteData<never, never> => variant('Loading')
const Failure = <E,>(error: E): RemoteData<E, never> => variant('Failure', error)
const Success = <A,>(value: A): RemoteData<never, A> => variant('Success', value)
```

## 📌 Pattern Extraction: Extracting Data from Patterns

Often you need not just to match, but to **extract** data from a specific variant. This requires a combination of type guard + extraction:

```typescript
type PatternMatcher<T extends { _tag: string }> = {
  extract<Tag extends T['_tag']>(tag: Tag, value: T): ExtractData<T, Tag> | null
  is<Tag extends T['_tag']>(tag: Tag, value: T): value is Extract<T, { _tag: Tag }>
  map<Tag extends T['_tag'], R>(
    tag: Tag, value: T, fn: (data: ExtractData<T, Tag>) => R
  ): R | null
  fold<R>(
    value: T,
    handlers: { [K in T['_tag']]: (data: ExtractData<T, K>) => R }
  ): R
}
```

### Helper Types

```typescript
type ExtractTag<T extends { _tag: string }, Tag extends T['_tag']> =
  Extract<T, { _tag: Tag }>

type ExtractData<T extends { _tag: string }, Tag extends T['_tag']> =
  ExtractTag<T, Tag> extends { data: infer D } ? D : undefined
```

### Usage

```typescript
const matcher = createMatcher<ApiResponse>()

// extract — get data or null
const data = matcher.extract('Ok', response)
if (data !== null) {
  console.log(data.items) // string[] — type-safe
}

// is — type guard
if (matcher.is('Unauthorized', response)) {
  console.log(response.data.reason) // TypeScript knows the type
}

// fold — exhaustive handling
const message = matcher.fold(response, {
  Ok: (data) => `Loaded ${data.items.length} items`,
  NotFound: () => 'Not found',
  Unauthorized: (data) => `Auth error: ${data.reason}`,
})
```

## 💡 Advanced Patterns

### Match with Default Handler

Sometimes you need to handle a few specific variants and have a catch-all for the rest:

```typescript
function matchWithDefault<T extends string>(value: T) {
  return {
    with<R>(handlers: Partial<Record<T, (value: T) => R>> & { _default: (value: T) => R }): R {
      const handler = handlers[value] ?? handlers._default
      return handler(value)
    },
  }
}
```

### Composable Matchers

```typescript
function pipe<T extends { _tag: string }, R>(
  value: T,
  ...matchers: Array<(v: T) => R | null>
): R | null {
  for (const m of matchers) {
    const result = m(value)
    if (result !== null) return result
  }
  return null
}
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Default Branch Hiding Problems

```typescript
// ❌ default hides unhandled variants
function handle(status: Status): string {
  switch (status) {
    case 'active': return 'Active'
    default: return 'Unknown' // New status added? Silence.
  }
}

// ✅ assertNever guarantees all variants are handled
function handle(status: Status): string {
  switch (status) {
    case 'active': return 'Active'
    case 'inactive': return 'Inactive'
    case 'suspended': return 'Suspended'
    default: return assertNever(status)
  }
}
```

### Mistake 2: String Checks Instead of Discriminator

```typescript
// ❌ TypeScript cannot narrow type by arbitrary condition
function process(item: Shape) {
  if ('radius' in item) {
    // item is still Shape, not { kind: 'circle'; radius: number }
  }
}

// ✅ Discriminator check works with control flow
function process(item: Shape) {
  if (item.kind === 'circle') {
    // item: { kind: 'circle'; radius: number } — narrowing works
    console.log(item.radius)
  }
}
```

### Mistake 3: Forgotten Return in Switch

```typescript
// ❌ Without return — fall-through
function label(s: Status) {
  switch (s) {
    case 'active':
      console.log('Active') // fall-through to next case!
    case 'inactive':
      return 'Not active'
  }
}

// ✅ Match expression doesn't have this problem
const label = match(s).with({
  active: () => 'Active',
  inactive: () => 'Not active',
  suspended: () => 'Suspended',
})
```

### Mistake 4: Mutable Discriminator

```typescript
// ❌ If _tag is mutable, pattern matching is unreliable
const item = { _tag: 'Ok', data: 42 }
item._tag = 'Error' // Type didn't change but data doesn't match

// ✅ readonly discriminator
type Variant<Tag extends string, Data = undefined> = Data extends undefined
  ? { readonly _tag: Tag }
  : { readonly _tag: Tag; readonly data: Data }
```

## 💡 Best Practices

1. **Always use `assertNever`** in the default branch of switch when handling all union type variants
2. **Prefer match expressions** over switch statements -- they return values and have no fall-through
3. **Use `readonly` for tags** -- a mutable discriminator breaks type safety
4. **Extract variant constructors** into separate functions -- simplifies creation and ensures type safety
5. **Use `Extract` for narrowing union types** -- this is the key to type-safe pattern matching
6. **Group related variants** into a single union type rather than separate types
