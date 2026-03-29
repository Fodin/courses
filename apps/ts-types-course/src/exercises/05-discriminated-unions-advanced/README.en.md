# 🔥 Level 5: Advanced Discriminated Unions

## 🎯 Introduction

Discriminated unions are one of the fundamental patterns in TypeScript. At the basic level, you already know them: a union of types with a common discriminant field. But at this level we dive into **advanced** techniques: exhaustive checking, polymorphic dispatch tables, and modeling complex domains through algebraic data types.

These patterns come from functional programming (Haskell, OCaml, Rust) and form the foundation for building predictable, type-safe systems.

## 🔥 Exhaustive Switches via never

### The Problem with Incomplete switch

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    // ⚠️ Forgot rectangle — TypeScript will NOT report an error!
  }
  return 0 // Silent bug
}
```

When a new variant is added to the union, the compiler won't warn about missing cases. The solution is **exhaustive checking**.

### The assertNever Pattern

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`)
}

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'rectangle':
      return shape.width * shape.height
    default:
      // ✅ If all variants are handled, shape has type never
      // If a new variant is added — compilation error here
      return assertNever(shape)
  }
}
```

### How Narrowing to never Works

TypeScript sequentially **narrows** the type in each branch:

```typescript
function process(shape: Shape) {
  // shape: Shape (circle | rectangle | triangle)

  if (shape.kind === 'circle') {
    // shape: { kind: 'circle'; radius: number }
    return
  }

  // shape: rectangle | triangle

  if (shape.kind === 'rectangle') {
    // shape: { kind: 'rectangle'; width: number; height: number }
    return
  }

  // shape: triangle

  if (shape.kind === 'triangle') {
    // shape: { kind: 'triangle'; ... }
    return
  }

  // shape: never — all variants exhausted
  assertNever(shape)
}
```

### Exhaustive Record

An alternative approach — using `Record` with `Shape['kind']` as keys:

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number }

// ✅ Adding a new kind requires adding a handler — TypeScript enforces it
const descriptions: Record<Shape['kind'], string> = {
  circle: 'A round shape',
  rectangle: 'A four-sided shape with right angles',
  triangle: 'A three-sided polygon',
}
```

📌 `Record<Shape['kind'], Handler>` automatically requires handling every variant.

## 🔥 Polymorphic Handlers (Dispatch Tables)

### Typed Events

```typescript
type AppEvent =
  | { type: 'USER_LOGIN'; payload: { userId: string; timestamp: number } }
  | { type: 'USER_LOGOUT'; payload: { userId: string } }
  | { type: 'PAGE_VIEW'; payload: { url: string; referrer: string } }
  | { type: 'PURCHASE'; payload: { productId: string; amount: number } }
```

### Extracting payload by Type

```typescript
type EventPayload<T extends AppEvent['type']> =
  Extract<AppEvent, { type: T }>['payload']

// EventPayload<'USER_LOGIN'> = { userId: string; timestamp: number }
// EventPayload<'PURCHASE'> = { productId: string; amount: number }
```

`Extract<Union, Shape>` extracts only those variants from the union that are compatible with `Shape`.

### Type-safe Dispatch Table

```typescript
type EventHandlers = {
  [K in AppEvent['type']]: (payload: EventPayload<K>) => void
}

const handlers: EventHandlers = {
  USER_LOGIN: (payload) => {
    // payload is automatically typed as { userId: string; timestamp: number }
    console.log(`User ${payload.userId} logged in`)
  },
  USER_LOGOUT: (payload) => {
    console.log(`User ${payload.userId} logged out`)
  },
  PAGE_VIEW: (payload) => {
    console.log(`Viewed ${payload.url}`)
  },
  PURCHASE: (payload) => {
    console.log(`Purchase: $${payload.amount}`)
  },
}
```

### Type-safe Dispatch

```typescript
function dispatch<T extends AppEvent['type']>(
  type: T,
  payload: EventPayload<T>
): void {
  const handler = handlers[type] as (payload: EventPayload<T>) => void
  handler(payload)
}

// ✅ TypeScript validates the match between type and payload
dispatch('USER_LOGIN', { userId: 'u-42', timestamp: Date.now() })

// ❌ Error: payload doesn't match USER_LOGIN
// dispatch('USER_LOGIN', { url: '/home' })
```

### The Visitor Pattern

```typescript
type ASTNode =
  | { type: 'literal'; value: number }
  | { type: 'binary'; op: '+' | '-' | '*'; left: ASTNode; right: ASTNode }
  | { type: 'unary'; op: '-'; operand: ASTNode }

type Visitor<R> = {
  [K in ASTNode['type']]: (node: Extract<ASTNode, { type: K }>) => R
}

function visit<R>(node: ASTNode, visitor: Visitor<R>): R {
  return (visitor[node.type] as (node: ASTNode) => R)(node)
}

const evaluator: Visitor<number> = {
  literal: (node) => node.value,
  binary: (node) => {
    const left = visit(node.left, evaluator)
    const right = visit(node.right, evaluator)
    switch (node.op) {
      case '+': return left + right
      case '-': return left - right
      case '*': return left * right
    }
  },
  unary: (node) => -visit(node.operand, evaluator),
}
```

## 🔥 Algebraic Data Types (ADT)

Algebraic data types are a way of modeling data through **sum** (tagged unions) and **product** (tuples/objects) types. This concept comes from functional programming.

### The Option (Maybe) Type

Instead of `null` / `undefined` — an explicit type encoding presence or absence of a value:

```typescript
type Option<T> =
  | { tag: 'some'; value: T }
  | { tag: 'none' }

function some<T>(value: T): Option<T> {
  return { tag: 'some', value }
}

function none<T>(): Option<T> {
  return { tag: 'none' }
}
```

Operations on Option:

```typescript
function map<T, U>(opt: Option<T>, fn: (val: T) => U): Option<U> {
  return opt.tag === 'some' ? some(fn(opt.value)) : none()
}

function flatMap<T, U>(opt: Option<T>, fn: (val: T) => Option<U>): Option<U> {
  return opt.tag === 'some' ? fn(opt.value) : none()
}

function unwrapOr<T>(opt: Option<T>, defaultValue: T): T {
  return opt.tag === 'some' ? opt.value : defaultValue
}

// Usage
function findUser(id: string): Option<{ name: string }> {
  if (id === '1') return some({ name: 'Alice' })
  return none()
}

const userName = unwrapOr(
  map(findUser('1'), (u) => u.name),
  'Unknown'
)
// 'Alice'
```

### The Result (Either) Type

Instead of `throw` — an explicit type for success or error:

```typescript
type Result<T, E> =
  | { tag: 'ok'; value: T }
  | { tag: 'err'; error: E }

function ok<T, E>(value: T): Result<T, E> {
  return { tag: 'ok', value }
}

function err<T, E>(error: E): Result<T, E> {
  return { tag: 'err', error }
}

function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (val: T) => U
): Result<U, E> {
  return result.tag === 'ok' ? ok(fn(result.value)) : result
}
```

Practical example:

```typescript
type ValidationError =
  | { code: 'REQUIRED'; field: string }
  | { code: 'TOO_SHORT'; field: string; minLength: number }
  | { code: 'INVALID_EMAIL'; field: string }

function validateEmail(email: string): Result<string, ValidationError> {
  if (!email) return err({ code: 'REQUIRED', field: 'email' })
  if (!email.includes('@')) return err({ code: 'INVALID_EMAIL', field: 'email' })
  return ok(email)
}
```

### Recursive ADTs — Expression Trees

```typescript
type Expr =
  | { tag: 'num'; value: number }
  | { tag: 'add'; left: Expr; right: Expr }
  | { tag: 'mul'; left: Expr; right: Expr }
  | { tag: 'neg'; operand: Expr }

function evaluate(expr: Expr): number {
  switch (expr.tag) {
    case 'num': return expr.value
    case 'add': return evaluate(expr.left) + evaluate(expr.right)
    case 'mul': return evaluate(expr.left) * evaluate(expr.right)
    case 'neg': return -evaluate(expr.operand)
  }
}

// (2 + 3) * (-4) = -20
const expr: Expr = {
  tag: 'mul',
  left: { tag: 'add', left: { tag: 'num', value: 2 }, right: { tag: 'num', value: 3 } },
  right: { tag: 'neg', operand: { tag: 'num', value: 4 } },
}
```

### Linked List as ADT

```typescript
type List<T> =
  | { tag: 'cons'; head: T; tail: List<T> }
  | { tag: 'nil' }

function cons<T>(head: T, tail: List<T>): List<T> {
  return { tag: 'cons', head, tail }
}

const nil: List<never> = { tag: 'nil' }

function toArray<T>(list: List<T>): T[] {
  if (list.tag === 'nil') return []
  return [list.head, ...toArray(list.tail)]
}

const myList = cons(1, cons(2, cons(3, nil)))
toArray(myList) // [1, 2, 3]
```

## 🔥 Advanced Patterns

### Multi-field Discriminants

```typescript
type APIResponse =
  | { status: 'success'; code: 200; data: unknown }
  | { status: 'success'; code: 201; data: unknown; location: string }
  | { status: 'error'; code: 400; errors: string[] }
  | { status: 'error'; code: 500; message: string }

function handleResponse(response: APIResponse) {
  if (response.status === 'success') {
    if (response.code === 201) {
      // TypeScript knows response has a location property
      console.log(response.location)
    }
  }
}
```

### Branded Discriminants

```typescript
type Success<T> = { readonly _tag: 'Success'; value: T }
type Failure<E> = { readonly _tag: 'Failure'; error: E }
type IO<T, E> = Success<T> | Failure<E>

// readonly _tag prevents accidental mutation of the discriminant
```

### Mapped Discriminated Unions

```typescript
type ActionMap = {
  increment: { amount: number }
  decrement: { amount: number }
  reset: Record<string, never>
  setName: { name: string }
}

type Action = {
  [K in keyof ActionMap]: { type: K } & ActionMap[K]
}[keyof ActionMap]

// Result:
// | { type: 'increment'; amount: number }
// | { type: 'decrement'; amount: number }
// | { type: 'reset' }
// | { type: 'setName'; name: string }
```

💡 This pattern lets you define actions in one place and automatically generate the union.

## ⚠️ Common Beginner Mistakes

### Mistake 1: Discriminant is Not a Literal Type

```typescript
// ❌ string is too wide — narrowing doesn't work
type Bad =
  | { type: string; data: number }
  | { type: string; message: string }

// ✅ Literal string types as discriminants
type Good =
  | { type: 'data'; data: number }
  | { type: 'error'; message: string }
```

### Mistake 2: Forgetting default with assertNever

```typescript
// ❌ Without default + assertNever, adding a new variant won't cause an error
function process(shape: Shape) {
  switch (shape.kind) {
    case 'circle': return 'circle'
    case 'rectangle': return 'rect'
    // Added triangle to the union, but no error here!
  }
}

// ✅ With assertNever — compilation error when a new variant is added
function process(shape: Shape) {
  switch (shape.kind) {
    case 'circle': return 'circle'
    case 'rectangle': return 'rect'
    default: return assertNever(shape) // Error: triangle not handled
  }
}
```

### Mistake 3: Mutating the Discriminant

```typescript
// ❌ Changing the discriminant breaks type safety
const event: AppEvent = { type: 'USER_LOGIN', payload: { userId: '1', timestamp: 0 } }
// event.type = 'PURCHASE' — payload no longer matches the type!

// ✅ Use readonly for discriminants
type SafeEvent =
  | { readonly type: 'USER_LOGIN'; payload: { userId: string } }
  | { readonly type: 'USER_LOGOUT'; payload: { userId: string } }
```

### Mistake 4: Using if Instead of switch Without Narrowing

```typescript
// ❌ TypeScript doesn't narrow without discriminant check
function bad(event: AppEvent) {
  if (event.type === 'USER_LOGIN' || event.type === 'PURCHASE') {
    // event: USER_LOGIN | PURCHASE — payload is still a union!
    // event.payload.userId — error, PURCHASE doesn't have userId
  }
}

// ✅ Check each variant separately
function good(event: AppEvent) {
  if (event.type === 'USER_LOGIN') {
    event.payload.userId // ✅ works
  }
}
```

## 💡 Best Practices

1. **Always use `assertNever` in default**: guarantees exhaustive checking when new variants are added

2. **Use `readonly` for discriminants**: prevents accidental mutation

3. **Prefer ADTs over inheritance**: `Option<T>`, `Result<T, E>` instead of `null` and `throw`

4. **Use `Extract` to extract variants**: `Extract<Union, { type: T }>` is safer than manual type duplication

5. **Define dispatch tables via mapped types**: `Record<Union['type'], Handler>` guarantees completeness

6. **Use a single discriminant per union**: multiple discriminants complicate type narrowing

## 📌 Summary

| Pattern | When to Use |
|---------|-------------|
| `assertNever` | Guarantee all variants are handled in a switch |
| Dispatch table | Map union variants to handlers |
| `Extract<U, Shape>` | Extract a specific variant from a union |
| `Option<T>` | Replace null/undefined |
| `Result<T, E>` | Replace throw/try-catch |
| Recursive ADTs | Trees, expressions, linked lists |
| Mapped discriminated unions | Auto-generate union from a map object |
