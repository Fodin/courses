# 🔮 Level 8: Advanced TypeScript Patterns

## 📖 Introduction

In previous levels we used TypeScript to type classic patterns. Now we go further: **the TypeScript type system itself becomes a design tool**. Conditional types, phantom types, mapped types, and type-level computations let you move business logic to compile time — errors are caught before the program even runs.

These patterns are especially useful in API design: a builder that won't let you assemble an invalid object, data that can't accidentally be used without validation, state machines with type-safe transitions.

## 🔨 Type-safe Builder

### Problem

A classic Builder allows you to skip required fields — the error is only discovered at runtime:

```typescript
// ❌ Bad: error only at runtime
const config = new ConfigBuilder()
  .setPort(3000)
  // Forgot .setHost() — a required field!
  .build() // Runtime error or invalid object
```

### Solution

Use conditional types and a type accumulator so that the `build()` method is only available **after** all required fields have been set:

```typescript
type RequiredKeys = 'host' | 'port'

// Accumulator tracks which fields have already been set
type Builder<Set extends string> = {
  setHost(host: string): Builder<Set | 'host'>
  setPort(port: number): Builder<Set | 'port'>
  // build() is available only when Set contains all RequiredKeys
  build: RequiredKeys extends Set ? () => Config : never
}
```

> 🔥 **Key point:** `build` has type `never` until all required fields are set. TypeScript will not allow calling `never`.

### How It Works

1. `Builder<never>` — initial state, nothing set
2. `setHost()` returns `Builder<'host'>` — host is set
3. `setPort()` on `Builder<'host'>` returns `Builder<'host' | 'port'>`
4. Now `RequiredKeys extends 'host' | 'port'` — true, `build()` is available

> 💡 **Tip:** This pattern is ideal for configurations, ORM query builders, and API clients — anywhere there are required steps.

## 👻 Phantom Types

### Problem

At runtime a string is just a string. But "raw user input", "validated email", and "encrypted data" are fundamentally different things:

```typescript
// ❌ Bad: nothing prevents sending unvalidated data
function sendEmail(email: string) { /* ... */ }
sendEmail(rawUserInput) // Compiles without errors!
```

### Solution

Phantom types (branded types) add an "invisible tag" to a type without changing its runtime representation:

```typescript
// Markers — empty interfaces that exist only at the type level
interface Validated { readonly _validated: unique symbol }
interface Sanitized { readonly _sanitized: unique symbol }

// Branded type = base type + phantom tag
type BrandedString<Brand> = string & { readonly __brand: Brand }

type RawInput = string
type ValidatedInput = BrandedString<Validated>
type SanitizedInput = BrandedString<Sanitized & Validated>

// ✅ Only validated input can be sanitized
function sanitize(input: ValidatedInput): SanitizedInput {
  return input.replace(/<[^>]*>/g, '') as SanitizedInput
}
```

> 📌 **Important:** `as` is used only in "boundary" functions (validate, sanitize). All other code works with branded types without casts.

### Composing Markers

Phantom types can be combined via intersection:

```typescript
type Encrypted = BrandedString<{ encrypted: true }>
type EncryptedAndValidated = BrandedString<Validated & { encrypted: true }>
```

This allows you to build data processing pipelines where each step is guaranteed at the type level.

## 🤖 Type-level State Machine

### Problem

A state machine with runtime transition checks:

```typescript
// ❌ Bad: invalid transition is only discovered at runtime
class Document {
  publish() {
    if (this.state !== 'review') {
      throw new Error('Can only publish from review state')
    }
  }
}
```

### Solution

Encode allowed transitions in the type system:

```typescript
// States — marker types
interface Draft { readonly _state: 'draft' }
interface Review { readonly _state: 'review' }
interface Published { readonly _state: 'published' }

// Document is parameterized by current state
class Document<S> {
  // Transition Draft → Review
  submitForReview(this: Document<Draft>): Document<Review> { /* ... */ }
  // Transition Review → Published
  publish(this: Document<Review>): Document<Published> { /* ... */ }
  // Transition Review → Draft
  requestChanges(this: Document<Review>): Document<Draft> { /* ... */ }
}
```

> 🔥 **Key point:** TypeScript uses the `this` parameter to restrict method calls. `publish()` can **only** be called on a `Document<Review>`.

### Allowed Transitions Pattern

```typescript
// Transition map at the type level
type Transitions = {
  Draft: 'Review'
  Review: 'Published' | 'Draft'
  Published: never // terminal state
}

// Conditional type for checking a transition
type CanTransition<From extends string, To extends string> =
  From extends keyof Transitions
    ? To extends Transitions[From]
      ? true
      : false
    : false
```

> 💡 **Tip:** This approach is used in real projects: workflow engines, payment systems, CI/CD pipelines.

## ⚡ Effect Pattern

### Problem

Functions with side effects are hard to test, compose, and handle errors for:

```typescript
// ❌ Bad: side effects, implicit dependencies, mixed errors
async function processOrder(orderId: string) {
  const db = getDatabase() // where does the dependency come from?
  const order = await db.find(orderId) // what error?
  await sendEmail(order.email) // yet another dependency
}
```

### Solution

`Effect<R, E, A>` — a lazy computation that explicitly describes:
- 📦 `R` — required dependencies (context)
- ❌ `E` — possible errors
- ✅ `A` — the result on success

```typescript
type Effect<R, E, A> = {
  _R: R  // Requirements (dependencies)
  _E: E  // Error channel
  _A: A  // Success value
  run: (context: R) => { success: true; value: A } | { success: false; error: E }
}
```

> 💡 **Tip:** This is a simplified version of concepts from libraries like Effect-TS and ZIO. We implement the core idea: describing a computation separately from its execution.

### Composing Effects

```typescript
// flatMap: chain of dependent computations
function flatMap<R, E, A, R2, E2, B>(
  effect: Effect<R, E, A>,
  f: (a: A) => Effect<R2, E2, B>
): Effect<R & R2, E | E2, B>

// TypeScript automatically merges requirements (R & R2)
// and errors (E | E2) — this is a type-level computation
```

> 🔥 **Key point:** TypeScript tracks at the type level which dependencies are needed and which errors are possible — without a single line of runtime code for this.

## ⚠️ Common Beginner Mistakes

### 🐛 1. Builder without a type-level accumulator

❌ **Bad** — Builder returns the same type, `build()` is always available:
```typescript
class Builder {
  setHost(host: string): Builder { return this }
  setPort(port: number): Builder { return this }
  build(): Config { /* ... */ } // Can be called without setHost!
}
```

✅ **Good** — each setter changes the Builder type:
```typescript
class Builder<Set extends string> {
  setHost(host: string): Builder<Set | 'host'> { /* ... */ }
  build: RequiredKeys extends Set ? () => Config : never
}
```

### 🐛 2. Phantom types with mutable casting

❌ **Bad** — `as` scattered throughout the code:
```typescript
const data = userInput as ValidatedInput // Bypassing validation!
sendToDatabase(data) // Compiles, but data is invalid
```

✅ **Good** — `as` only inside constructor functions:
```typescript
function validate(input: string): ValidatedInput | null {
  return isValid(input) ? (input as ValidatedInput) : null
}
// Everywhere else — only ValidatedInput, no as
```

### 🐛 3. State Machine without `this` restriction

❌ **Bad** — methods are available in any state:
```typescript
class Document<S> {
  publish(): Document<Published> { /* ... */ }
}
const draft = new Document<Draft>()
draft.publish() // Compiles! No state check
```

✅ **Good** — the `this` parameter restricts the call:
```typescript
class Document<S> {
  publish(this: Document<Review>): Document<Published> { /* ... */ }
}
const draft = new Document<Draft>()
draft.publish() // ❌ Compile error!
```

### 🐛 4. Effect without typed errors

❌ **Bad** — all errors are `unknown`:
```typescript
type Effect<A> = { run: () => Promise<A> }
// What errors can it throw? Unknown
```

✅ **Good** — errors are explicitly described in the type:
```typescript
type Effect<R, E, A> = {
  run: (ctx: R) => Result<E, A>
}
// E = DatabaseError | NetworkError — we know exactly what can go wrong
```

## 💡 Best Practices

- 🔨 **Builder**: use a union type accumulator to track which fields have been set
- 👻 **Phantom Types**: minimize the number of `as` — only in "boundary" functions
- 🤖 **State Machine**: describe the transition map as a type, not as runtime checks
- ⚡ **Effect**: separate the description of a computation from its interpretation
- 🔥 **General**: if a rule can be expressed at the type level — express it at the type level
