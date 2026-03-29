# 🔥 Level 9: Recursive Types

## 🎯 Introduction

Recursive types are one of the most powerful features of TypeScript's type system. A type is **recursive** when it references itself in its definition. This allows modeling structures of arbitrary depth: trees, JSON, linked lists, as well as creating advanced utility types like `DeepReadonly`, `DeepPartial`, and string transformations.

Recursive types are critical for:
- Modeling nested data (JSON, AST, DOM)
- Deep object transformations (`DeepReadonly`, `DeepPartial`)
- Template literal type manipulations (parsing, CamelCase)
- Type-safe dot-notation paths (`'server.host'`)

## 🔥 Recursive Data Structures

### JSON Type

The classic recursive type example — representing JSON:

```typescript
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]                    // array of JSON values
  | { [key: string]: JsonValue }   // object with JSON values

const data: JsonValue = {
  name: 'Alice',
  scores: [95, 87, 92],
  address: {
    city: 'Moscow',
    coords: { lat: 55.75, lng: 37.62 }  // unlimited nesting
  }
}
```

### Tree

```typescript
interface TreeNode<T> {
  value: T
  children: TreeNode<T>[]  // recursive reference
}

const tree: TreeNode<string> = {
  value: 'root',
  children: [
    {
      value: 'child-1',
      children: [
        { value: 'grandchild', children: [] }
      ]
    },
    { value: 'child-2', children: [] }
  ]
}
```

### Linked List

```typescript
interface LinkedList<T> {
  value: T
  next: LinkedList<T> | null  // null — end of list
}

const list: LinkedList<number> = {
  value: 1,
  next: { value: 2, next: { value: 3, next: null } }
}
```

### AST (Abstract Syntax Tree)

```typescript
type Expression =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'binary'; op: '+' | '-'; left: Expression; right: Expression }
  | { type: 'unary'; op: '-' | '!'; operand: Expression }

// 1 + 2 * 3
const expr: Expression = {
  type: 'binary',
  op: '+',
  left: { type: 'number', value: 1 },
  right: {
    type: 'binary',
    op: '*',
    left: { type: 'number', value: 2 },
    right: { type: 'number', value: 3 }
  }
}
```

## 🔥 Recursive Conditional Types

### DeepReadonly

Recursively makes **all nested properties** `readonly`:

```typescript
type DeepReadonly<T> = T extends object
  ? T extends Function
    ? T  // don't touch functions
    : { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T

interface Config {
  server: {
    host: string
    port: number
    ssl: { enabled: boolean }
  }
}

const config: DeepReadonly<Config> = {
  server: { host: 'localhost', port: 3000, ssl: { enabled: true } }
}

// config.server.ssl.enabled = false // ❌ Error: readonly
```

### DeepPartial

Recursively makes **all nested properties** optional:

```typescript
type DeepPartial<T> = T extends object
  ? T extends Function
    ? T
    : { [K in keyof T]?: DeepPartial<T[K]> }
  : T

// Specify only part of the config
const update: DeepPartial<Config> = {
  server: { port: 8080 }  // host and ssl not needed
}
```

### DeepRequired

Recursively removes **all optional modifiers**:

```typescript
type DeepRequired<T> = T extends object
  ? T extends Function
    ? T
    : { [K in keyof T]-?: DeepRequired<T[K]> }
  : T
```

### DeepAwaited — Unwrapping Promises

```typescript
type DeepAwaited<T> = T extends Promise<infer U>
  ? DeepAwaited<U>  // recursively unwrap Promise
  : T extends object
    ? { [K in keyof T]: DeepAwaited<T[K]> }
    : T

type Result = DeepAwaited<Promise<Promise<string>>>  // string

type AsyncData = {
  user: Promise<{ name: string; age: Promise<number> }>
}
type SyncData = DeepAwaited<AsyncData>
// { user: { name: string; age: number } }
```

### Flatten — Flattening Nested Arrays

```typescript
type Flatten<T> = T extends Array<infer U>
  ? Flatten<U>
  : T

type Deep = number[][][]
type Flat = Flatten<Deep>  // number
```

### DeepNullable

```typescript
type DeepNullable<T> = T extends object
  ? T extends Function
    ? T
    : { [K in keyof T]: DeepNullable<T[K]> | null }
  : T | null
```

## 🔥 Recursive String Types

### Split — String Splitting

```typescript
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : S extends ''
      ? []
      : [S]

type Parts = Split<'a.b.c', '.'>  // ['a', 'b', 'c']
```

### Join — Tuple to String

```typescript
type Join<T extends string[], D extends string> =
  T extends []
    ? ''
    : T extends [infer H extends string]
      ? H
      : T extends [infer H extends string, ...infer Rest extends string[]]
        ? `${H}${D}${Join<Rest, D>}`
        : string

type Joined = Join<['a', 'b', 'c'], '-'>  // 'a-b-c'
```

### ReplaceAll — Replace All Occurrences

```typescript
type ReplaceAll<S extends string, From extends string, To extends string> =
  From extends ''
    ? S
    : S extends `${infer Head}${From}${infer Tail}`
      ? `${Head}${To}${ReplaceAll<Tail, From, To>}`
      : S

type Result = ReplaceAll<'hello world hello', 'hello', 'hi'>
// 'hi world hi'
```

### CamelCase — From snake_case

```typescript
type CamelCase<S extends string> =
  S extends `${infer Head}_${infer Char}${infer Tail}`
    ? `${Lowercase<Head>}${Uppercase<Char>}${CamelCase<Tail>}`
    : Lowercase<S>

type CC = CamelCase<'user_first_name'>  // 'userFirstName'
```

### KebabCase — From camelCase

```typescript
type KebabCase<S extends string> =
  S extends `${infer H}${infer T}`
    ? T extends Uncapitalize<T>
      ? `${Lowercase<H>}${KebabCase<T>}`
      : `${Lowercase<H>}-${KebabCase<T>}`
    : S

type KB = KebabCase<'helloWorld'>  // 'hello-world'
```

### Dot-Notation Paths

```typescript
type PathKeys<T> =
  T extends object
    ? {
        [K in keyof T & string]: K | `${K}.${PathKeys<T[K]>}`
      }[keyof T & string]
    : never

interface Config {
  server: { host: string; port: number }
  db: { url: string }
}

type Paths = PathKeys<Config>
// 'server' | 'server.host' | 'server.port' | 'db' | 'db.url'
```

## 🔥 Recursion Limits and Optimization

### TypeScript Limits

TypeScript has a **recursion depth limit** to prevent infinite loops:

- Conditional types: ~50 levels
- Type instantiation: ~50 levels
- Error: `Type instantiation is excessively deep and possibly infinite`

### Tail-Recursive Optimization (TypeScript 4.5+)

TypeScript 4.5 added **tail recursion optimization** for conditional types. A type is tail-recursive when the recursive call is in the **last position**:

```typescript
// ❌ NOT tail-recursive — recursion inside spread
type NaiveReverse<T extends unknown[]> =
  T extends [infer H, ...infer Rest]
    ? [...NaiveReverse<Rest>, H]  // recursion NOT in last position
    : []

// ✅ Tail-recursive — with accumulator
type Reverse<T extends unknown[], Acc extends unknown[] = []> =
  T extends [infer H, ...infer Rest]
    ? Reverse<Rest, [H, ...Acc]>  // recursion in last position
    : Acc
```

With tail recursion optimization, `Reverse` works for arrays of **1000+ elements**, while `NaiveReverse` fails at ~45.

### Pattern: Accumulator

```typescript
// BuildTuple — creates a tuple of given length
type BuildTuple<N extends number, Acc extends unknown[] = []> =
  Acc['length'] extends N
    ? Acc
    : BuildTuple<N, [...Acc, unknown]>

type T100 = BuildTuple<100>  // tuple of 100 elements — works!
```

### Pattern: Depth Limiter

To prevent infinite recursion, add a depth counter:

```typescript
type MaxDepth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

type SafeDeepReadonly<T, D extends number = 10> =
  [D] extends [never]
    ? T  // reached limit
    : T extends object
      ? T extends Function
        ? T
        : { readonly [K in keyof T]: SafeDeepReadonly<T[K], MaxDepth[D]> }
      : T
```

`MaxDepth[D]` decrements the counter: `MaxDepth[10]` = 9, `MaxDepth[1]` = 0, `MaxDepth[0]` = never.

## ⚠️ Common Beginner Mistakes

### Mistake 1: Forgetting the base case

```typescript
// ❌ Infinite recursion — no stop condition
type Infinite<T> = { value: Infinite<T> }

// ✅ Has base case
type Finite<T> = { value: T } | { value: Finite<T> }
```

### Mistake 2: Not excluding Function from object recursion

```typescript
// ❌ Function is also an object — will attempt recursion on Function properties
type BadDeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: BadDeepReadonly<T[K]> }
  : T

// ✅ Exclude Function
type GoodDeepReadonly<T> = T extends object
  ? T extends Function
    ? T
    : { readonly [K in keyof T]: GoodDeepReadonly<T[K]> }
  : T
```

### Mistake 3: Non-tail recursion for large data

```typescript
// ❌ Hits limit at ~45 elements
type NaiveLength<T extends unknown[]> =
  T extends [infer _, ...infer Rest]
    ? 1 + NaiveLength<Rest>  // NOT tail-recursive
    : 0

// ✅ Tail recursion with accumulator
type Length<T extends unknown[], Acc extends unknown[] = []> =
  T extends [infer _, ...infer Rest]
    ? Length<Rest, [...Acc, unknown]>
    : Acc['length']
```

### Mistake 4: Forgetting to handle empty string in Split

```typescript
// ❌ Split<'', '.'> returns [''] instead of []
type BadSplit<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}` ? [H, ...BadSplit<T, D>] : [S]

// ✅ Handle empty string
type GoodSplit<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}`
    ? [H, ...GoodSplit<T, D>]
    : S extends '' ? [] : [S]
```

## 📌 Summary

| Technique | Use Case | Example |
|-----------|----------|---------|
| Recursive interfaces | Trees, JSON, AST | `TreeNode<T>` |
| DeepReadonly/Partial | Deep transformations | `DeepReadonly<Config>` |
| String recursion | Parsing, CamelCase | `Split<S, D>` |
| Tail recursion | Large data (1000+) | `BuildTuple<N>` |
| Depth limiter | Infinite loop protection | `SafeDeep<T, D>` |

💡 **Key principles**:
1. Always define a base case (stop condition)
2. Exclude Function from object recursion
3. Use accumulator for tail recursion
4. Add depth limiter for production code
5. Test with realistic data sizes
