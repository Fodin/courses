# 🔥 Level 12: Advanced Generics

## 🎯 Why Advanced Generic Patterns

In previous levels we covered generic basics: constraints, inference, conditional types. Now we move to patterns used in advanced libraries: fp-ts, Effect, Zod, tRPC. These patterns enable maximally abstract and reusable code with full type safety.

---

## 📌 Higher-Kinded Types (HKTs)

### The problem

In Haskell, Scala, and Rust you can abstract over type constructors:

```haskell
-- Haskell: Functor works with any type constructor
class Functor f where
  fmap :: (a -> b) -> f a -> f b
```

TypeScript cannot do this:

```typescript
// ❌ TypeScript does not support this
type Functor<F<_>> = {
  map: <A, B>(fa: F<A>, f: (a: A) => B) => F<B>
}
```

### Solution: URI Pattern (Defunctionalization)

The idea: instead of passing a type constructor directly, use a string URI as a "key" into a registry:

```typescript
// Step 1: Registry — maps URIs to type constructors
interface URItoKind<A> {
  Array: A[]
  Option: A | null
  Promise: Promise<A>
}

// Step 2: Wrapper type to look up the registry
type URIS = keyof URItoKind<unknown>
type Kind<F extends URIS, A> = URItoKind<A>[F]

// Kind<'Array', number> = number[]
// Kind<'Option', string> = string | null
// Kind<'Promise', boolean> = Promise<boolean>
```

### Functor via URI pattern

```typescript
// Step 3: Functor interface
interface Functor<F extends URIS> {
  readonly URI: F
  map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B>
}

// Step 4: Implementations
const arrayFunctor: Functor<'Array'> = {
  URI: 'Array',
  map: (fa, f) => fa.map(f),
}

const optionFunctor: Functor<'Option'> = {
  URI: 'Option',
  map: (fa, f) => fa === null ? null : f(fa),
}
```

### Generic functions over any functor

```typescript
function doubleAll<F extends URIS>(
  F: Functor<F>,
  fa: Kind<F, number>
): Kind<F, number> {
  return F.map(fa, n => n * 2)
}

doubleAll(arrayFunctor, [1, 2, 3])    // [2, 4, 6]
doubleAll(optionFunctor, 5)            // 10
doubleAll(optionFunctor, null)          // null
```

### Extending the registry via declaration merging

```typescript
declare module './hkt' {
  interface URItoKind<A> {
    Either: { _tag: 'Left'; error: Error } | { _tag: 'Right'; value: A }
  }
}
// Now 'Either' is available in all generic functions!
```

💡 This pattern is used in **fp-ts** — the most popular FP library for TypeScript.

---

## 📌 Inference Tricks

### Trick 1: const T — preserving literal types

```typescript
// Without const: type widens
function wrap<T extends string>(value: T): T { return value }
const status = wrap('active') // type: string (widened!)

// ✅ With const: literal type preserved
function narrow<const T extends string>(value: T): T { return value }
const status = narrow('active') // type: 'active'

// Works with arrays too
function narrowArray<const T extends readonly string[]>(values: T): T {
  return values
}
const roles = narrowArray(['admin', 'user', 'guest'])
// type: readonly ['admin', 'user', 'guest']
```

📌 The **`const` keyword** in generic position forces TypeScript to infer the narrowest (literal) type.

### Trick 2: NoInfer<T> — controlling inference sites

```typescript
// Problem: T is inferred from both arguments
function createAction<T extends string>(type: T, payload: T) {
  return { type, payload }
}
// createAction('reset', 'increment')
// T = 'reset' | 'increment' — union! Not what we want

// ✅ NoInfer blocks inference from the second position
type NoInfer<T> = T extends infer U ? U : never

function createAction<T extends string>(
  type: T,
  payload: NoInfer<T> extends 'increment' ? number : string
) {
  return { type, payload }
}
```

📌 **NoInfer** (available natively in TypeScript 5.4+) prevents type inference from a specific position.

### Trick 3: Distributive Object Types

Transform an object type into a discriminated union:

```typescript
type EventMap = {
  click: { x: number; y: number }
  keydown: { key: string }
  scroll: { offset: number }
}

type DistributiveMap<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    key: K
    value: T[K]
    handler: (value: T[K]) => void
  }
}[keyof T]

type EventEntries = DistributiveMap<EventMap>
// | { key: 'click';   value: {x, y};   handler: (v: {x, y}) => void }
// | { key: 'keydown'; value: {key};     handler: (v: {key}) => void }
// | { key: 'scroll';  value: {offset};  handler: (v: {offset}) => void }
```

📌 **Pattern**: `{ [K in keyof T]: F<K, T[K]> }[keyof T]` — first create a mapped type, then index by all keys to get a union.

### Trick 4: Satisfies + inference

```typescript
type Config = Record<string, { enabled: boolean; value: string | number }>

const config = {
  debug: { enabled: true, value: 'verbose' },
  maxRetries: { enabled: false, value: 3 },
} satisfies Config

// config.debug.value → type: 'verbose' (not string!)
// config.maxRetries.value → type: 3 (not number!)
```

---

## 📌 Curried Generics

### Problem: partial application of generics

```typescript
// ❌ TypeScript doesn't support partial generic application
type MapOf<K> = Map<K, _>  // Can't do this!
type StringMap = MapOf<string>  // Can't do this!
```

### Solution 1: Currying via nested functions

```typescript
function mapOf<K>() {
  return function <V>(entries: [K, V][]): Map<K, V> {
    return new Map(entries)
  }
}

const stringMap = mapOf<string>()
const m = stringMap([['a', 1], ['b', 2]])  // Map<string, number>
```

### Solution 2: Builder with progressive type accumulation

```typescript
class TypedBuilder<Schema extends Record<string, unknown> = Record<string, never>> {
  field<K extends string, V>(
    key: K,
    value: V
  ): TypedBuilder<Schema & Record<K, V>> {
    return new TypedBuilder({
      ...this.data,
      [key]: value,
    })
  }

  build(): Schema {
    return this.data as Schema
  }
}

const config = new TypedBuilder()
  .field('host', 'localhost')   // TypedBuilder<{ host: string }>
  .field('port', 3000)          // TypedBuilder<... & { port: number }>
  .field('debug', true)         // TypedBuilder<... & { debug: boolean }>
  .build()
```

### Solution 3: Curried validators

```typescript
function validatorFor<T>() {
  return {
    field<K extends keyof T & string>(key: K) {
      return {
        check(predicate: (value: T[K]) => boolean) {
          return {
            validate(obj: T): boolean {
              return predicate(obj[key])
            },
          }
        },
      }
    },
  }
}

interface User { name: string; age: number }

const nameCheck = validatorFor<User>()
  .field('name')
  .check(name => name.length > 0)
```

### Solution 4: Curried Event Emitter

```typescript
function typedEmitter<Events extends Record<string, unknown>>() {
  const handlers = new Map<string, Array<(p: unknown) => void>>()

  return {
    on<K extends keyof Events & string>(
      event: K,
      handler: (payload: Events[K]) => void
    ) {
      const list = handlers.get(event) ?? []
      list.push(handler as (p: unknown) => void)
      handlers.set(event, list)
      return this
    },

    emit<K extends keyof Events & string>(event: K, payload: Events[K]) {
      (handlers.get(event) ?? []).forEach(h => h(payload))
    },
  }
}

interface AppEvents {
  login: { userId: string }
  logout: { reason: string }
}

const emitter = typedEmitter<AppEvents>()
emitter.on('login', p => console.log(p.userId))  // ✅ Autocomplete!
emitter.emit('login', { userId: 'u-42' })         // ✅ Type-safe!
emitter.emit('login', { reason: 'timeout' })       // ❌ Error!
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Trying to pass a type constructor as a generic

```typescript
// ❌ TypeScript doesn't support HKTs directly
interface Functor<F<_>> { map: ... }

// ✅ Use the URI pattern
interface Functor<F extends URIS> {
  map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B>
}
```

### Mistake 2: const T narrows too aggressively

```typescript
// ❌ const makes arrays readonly — may break signatures
function process<const T extends string[]>(items: T) { /* ... */ }
// T = readonly ['a', 'b'] — not compatible with string[]

// ✅ Use readonly in the signature
function process<const T extends readonly string[]>(items: T) { /* ... */ }
```

### Mistake 3: Builder without proper type accumulation

```typescript
// ❌ Type doesn't accumulate
class BadBuilder<T> {
  field<K extends string, V>(key: K, value: V): BadBuilder<T> {
    return this // Type T doesn't change!
  }
}

// ✅ Return new type with extended Schema
field<K, V>(key: K, value: V): TypedBuilder<Schema & Record<K, V>> {
  return new TypedBuilder(...)
}
```

### Mistake 4: Forgetting declaration merging for URIs

```typescript
// ❌ Adding new URI without merging
const myURI = 'MyType' // Just a string, not in registry

// ✅ Declaration merging adds to registry
declare module './hkt' {
  interface URItoKind<A> {
    MyType: MyType<A>
  }
}
```

---

## 💡 Best Practices

1. **URI pattern for HKT** — use when abstracting over container types (Array, Option, Either)
2. **const T** — use for APIs that must preserve exact literal types (routers, config builders)
3. **Curried generics** — use when one generic is known before another
4. **TypedBuilder** — use for APIs with progressive configuration
5. **NoInfer** — use when inference from multiple positions creates unwanted unions
6. **Distributive objects** — use to generate discriminated unions from object types
