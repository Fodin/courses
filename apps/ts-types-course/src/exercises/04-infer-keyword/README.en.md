# 🔥 Level 4: The infer Keyword

## 🎯 Introduction

The `infer` keyword is one of the most powerful tools in TypeScript's type system. It allows you to **extract** (infer) types from other types inside conditional type expressions. If conditional types are `if/else` for types, then `infer` is a "variable" that TypeScript fills in automatically.

Without `infer`, many typing tasks would be simply impossible: extracting function return types, parameters, array elements, or parts of string literal types.

## 🔥 Syntax of infer

`infer` is used **only** inside `extends` in conditional types:

```typescript
type MyType<T> = T extends SomePattern<infer U> ? U : FallbackType
```

Here `infer U` tells TypeScript: "figure out the type in position `U`, and give me access to it in the true branch."

### Basic Example

```typescript
// Extracting the element type of an array
type ArrayElement<T> = T extends (infer E)[] ? E : never

type A = ArrayElement<string[]>    // string
type B = ArrayElement<number[]>    // number
type C = ArrayElement<boolean>     // never — not an array
```

📌 Important: `infer` can only appear in the true branch of a conditional type. You cannot write `infer` outside of `extends ... ? ... : ...`.

## 🔥 Infer in Function Return Types

The most classic example — recreating the built-in `ReturnType<T>`:

```typescript
type MyReturnType<T extends (...args: unknown[]) => unknown> =
  T extends (...args: unknown[]) => infer R ? R : never

function getUser() {
  return { id: 1, name: 'Alice', active: true }
}

type User = MyReturnType<typeof getUser>
// { id: number; name: string; active: boolean }
```

### Unwrapping Promises

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

type A = UnwrapPromise<Promise<string>>   // string
type B = UnwrapPromise<Promise<number[]>> // number[]
type C = UnwrapPromise<string>            // string (not a promise — returned as-is)
```

### Recursive Unwrap

```typescript
type DeepUnwrap<T> = T extends Promise<infer U> ? DeepUnwrap<U> : T

type D = DeepUnwrap<Promise<Promise<Promise<boolean>>>>  // boolean
```

💡 The built-in `Awaited<T>` in TypeScript 4.5+ does exactly this.

## 🔥 Infer in Function Parameters

### Extracting All Parameters

```typescript
type MyParameters<T> = T extends (...args: infer P) => unknown ? P : never

function createUser(name: string, age: number, active: boolean) {
  return { name, age, active }
}

type Params = MyParameters<typeof createUser>
// [name: string, age: number, active: boolean]
```

### Extracting the First Parameter

```typescript
type FirstParam<T> =
  T extends (first: infer P, ...rest: unknown[]) => unknown ? P : never

type F = FirstParam<typeof createUser>  // string
```

### Extracting the Last Parameter

```typescript
type LastParam<T> =
  T extends (...args: [...infer _, infer L]) => unknown ? L : never

type L = LastParam<typeof createUser>  // boolean
```

### Constructor Parameters

```typescript
type ConstructorParams<T> =
  T extends new (...args: infer P) => unknown ? P : never

class Database {
  constructor(host: string, port: number) {}
}

type DBParams = ConstructorParams<typeof Database>
// [host: string, port: number]
```

📌 Note the `new` keyword — constructors have the signature `new (...args) => T`.

### Extracting Instance Types

```typescript
type InstanceOf<T> = T extends new (...args: unknown[]) => infer I ? I : never

type DBInstance = InstanceOf<typeof Database>  // Database
```

## 🔥 Infer in Template Literal Types

One of the most powerful combinations is `infer` with template literal types. This lets you **parse string types** at the type system level.

### Extracting Parts of a String

```typescript
type ExtractDomain<T extends string> =
  T extends `${infer _User}@${infer Domain}` ? Domain : never

type D = ExtractDomain<'dev@example.com'>  // 'example.com'
```

### Parsing Route Parameters

```typescript
type ParseRoute<T extends string> =
  T extends `${infer _}:${infer Param}/${infer Rest}`
    ? Param | ParseRoute<`/${Rest}`>
    : T extends `${infer _}:${infer Param}`
      ? Param
      : never

type Params = ParseRoute<'/users/:userId/posts/:postId'>
// 'userId' | 'postId'
```

### Converting kebab-case to camelCase

```typescript
type KebabToCamel<S extends string> =
  S extends `${infer Head}-${infer Char}${infer Rest}`
    ? `${Head}${Uppercase<Char>}${KebabToCamel<Rest>}`
    : S

type Result = KebabToCamel<'background-color'>  // 'backgroundColor'
type Long = KebabToCamel<'border-top-left-radius'>  // 'borderTopLeftRadius'
```

### Splitting a String by Delimiter

```typescript
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : [S]

type Parts = Split<'a.b.c', '.'>  // ['a', 'b', 'c']
type Words = Split<'hello world', ' '>  // ['hello', 'world']
```

### Parsing URL Query Parameters

```typescript
type ParseQueryKey<T extends string> =
  T extends `${infer Key}=${infer _}` ? Key : T

type ParseQuery<T extends string> =
  T extends `${infer Param}&${infer Rest}`
    ? ParseQueryKey<Param> | ParseQuery<Rest>
    : ParseQueryKey<T>

type Keys = ParseQuery<'page=1&limit=10&sort=name'>
// 'page' | 'limit' | 'sort'
```

## 🔥 Infer in Tuples

Tuples are fixed-length arrays with known element types. `infer` lets you destructure them element by element.

### First and Last Elements

```typescript
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never
type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never

type H = Head<[string, number, boolean]>  // string
type L = Last<[string, number, boolean]>  // boolean
```

### Tuple Tail

```typescript
type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never

type T = Tail<[1, 2, 3, 4]>  // [2, 3, 4]
```

### Reversing a Tuple

```typescript
type Reverse<T extends unknown[]> =
  T extends [infer H, ...infer R]
    ? [...Reverse<R>, H]
    : []

type Rev = Reverse<[1, 2, 3]>  // [3, 2, 1]
```

### Flattening One Level

```typescript
type FlattenOnce<T extends unknown[]> =
  T extends [infer H, ...infer R]
    ? H extends unknown[]
      ? [...H, ...FlattenOnce<R>]
      : [H, ...FlattenOnce<R>]
    : []

type Flat = FlattenOnce<[[1, 2], [3], [4, 5]]>  // [1, 2, 3, 4, 5]
```

### Zipping Two Tuples

```typescript
type Zip<A extends unknown[], B extends unknown[]> =
  A extends [infer AH, ...infer AR]
    ? B extends [infer BH, ...infer BR]
      ? [[AH, BH], ...Zip<AR, BR>]
      : []
    : []

type Z = Zip<['a', 'b'], [1, 2]>  // [['a', 1], ['b', 2]]
```

## 🔥 Infer with Constraints (TypeScript 4.7+)

Starting with TypeScript 4.7, you can use `extends` constraints directly in the `infer` position:

```typescript
// Extract the type, but only if it's a string
type FirstString<T> =
  T extends [infer S extends string, ...unknown[]] ? S : never

type A = FirstString<['hello', 42]>  // 'hello'
type B = FirstString<[42, 'hello']>  // never
```

This significantly simplifies code that previously required nested conditionals:

```typescript
// ❌ Before TypeScript 4.7 — nested conditionals
type GetString<T> = T extends [infer S, ...unknown[]]
  ? S extends string ? S : never
  : never

// ✅ TypeScript 4.7+ — constraint right in infer
type GetString<T> = T extends [infer S extends string, ...unknown[]]
  ? S
  : never
```

## 🔥 Practical Patterns

### Typing an EventEmitter

```typescript
type EventMap = {
  click: [x: number, y: number]
  change: [value: string]
  submit: [data: FormData]
}

type EventHandler<T extends keyof EventMap> =
  EventMap[T] extends infer Args
    ? Args extends unknown[]
      ? (...args: Args) => void
      : never
    : never

// (x: number, y: number) => void
type ClickHandler = EventHandler<'click'>
```

### Typing a pipe Function

```typescript
type PipeReturn<Fns extends ((...args: unknown[]) => unknown)[]> =
  Fns extends [...unknown[], (...args: unknown[]) => infer R]
    ? R
    : never
```

### Extracting Generic Parameters

```typescript
type ExtractGeneric<T> =
  T extends Map<infer K, infer V> ? { key: K; value: V } :
  T extends Set<infer E> ? { element: E } :
  T extends Promise<infer R> ? { result: R } :
  never

type MapInfo = ExtractGeneric<Map<string, number>>
// { key: string; value: number }
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: infer Outside a Conditional Type

```typescript
// ❌ Syntax error — infer only works inside extends
type Bad<T> = infer U

// ✅ Correct — inside a conditional type
type Good<T> = T extends Array<infer U> ? U : never
```

### Mistake 2: Using infer in the False Branch

```typescript
// ❌ U is only available in the true branch
type Wrong<T> = T extends Promise<infer U> ? string : U

// ✅ U is used in the true branch
type Right<T> = T extends Promise<infer U> ? U : never
```

### Mistake 3: Same Name for Multiple infer Variables

```typescript
// ⚠️ Two infer with the same name create an intersection
type Ambiguous<T> = T extends {
  a: infer U
  b: infer U
} ? U : never

type Result = Ambiguous<{ a: string; b: number }>
// string & number = never!
```

When the same `infer U` appears in **covariant** positions — you get a union. In **contravariant** positions (function parameters) — you get an intersection.

```typescript
type CovariantInfer<T> = T extends {
  a: () => infer U
  b: () => infer U
} ? U : never

type R = CovariantInfer<{ a: () => string; b: () => number }>
// string | number  (union in covariant position)
```

### Mistake 4: Forgetting Distributive Behavior

```typescript
type Unbox<T> = T extends Array<infer U> ? U : T

// Union distributes!
type R = Unbox<string[] | number[]>
// string | number  (not (string | number)[])
```

### Mistake 5: Greedy infer in Strings

```typescript
// ⚠️ infer is "greedy" by default — captures maximum
type GetFirst<S extends string> =
  S extends `${infer First}.${infer _Rest}` ? First : S

type A = GetFirst<'a.b.c'>  // 'a' — First stops at the first dot

// But with nested templates, infer order matters!
type GetLast<S extends string> =
  S extends `${infer _}.${infer Rest}` ? GetLast<Rest> : S

type B = GetLast<'a.b.c'>  // 'c'
```

## 💡 Best Practices

1. **Use built-in utility types when possible**: `ReturnType`, `Parameters`, `Awaited`, `InstanceType` — they all use `infer` under the hood

2. **Give infer variables meaningful names**: `infer R` for return, `infer P` for params, `infer E` for element

3. **Combine infer with generic constraints** (TS 4.7+) for early rejection of invalid types

4. **Remember recursion limits**: `infer` combined with recursive types can create powerful parsers, but TypeScript limits recursion depth (typically ~1000 levels)

5. **Test edge cases**: empty arrays, never, unknown, union types — they can all behave unexpectedly with `infer`

6. **Use `_` for unused infer variables**: `infer _Start` instead of `infer Start` when the variable is not needed in the result

## 📌 Summary

| Pattern | Example | Result |
|---------|---------|--------|
| Return type | `T extends () => infer R` | Function return type |
| Parameters | `T extends (...args: infer P) => any` | Parameter tuple |
| Array element | `T extends (infer E)[]` | Element type |
| Promise unwrap | `T extends Promise<infer U>` | Inner promise type |
| Template literal | `` T extends `${infer A}:${infer B}` `` | String type parts |
| Tuple head | `T extends [infer H, ...any]` | First tuple element |
| Tuple tail | `T extends [any, ...infer R]` | Remaining tuple |
| Constructor | `T extends new (...args: infer P) => any` | Constructor parameters |
| Constrained infer | `T extends [infer S extends string]` | With type constraint |

`infer` is the key to type-level programming in TypeScript. Once you master it, you can create types that automatically adapt to the structure of your data.
