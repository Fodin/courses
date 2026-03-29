# 🔥 Level 10: Type-Level Programming

## 🎯 Why Type-Level Programming

Type-level programming means writing algorithms that execute at **compile time**, not runtime. The results are types, not values. This lets you catch entire classes of errors before the program even runs.

### The problem without type-level computation

```typescript
// ❌ Without type-level programming: errors found at runtime
function getElement(tuple: unknown[], index: number): unknown {
  return tuple[index] // May return undefined
}

const result = getElement([1, 'hello', true], 5) // No compile error
console.log(result.toString()) // 💥 Runtime error!
```

### The solution with type-level programming

```typescript
// ✅ With type-level programming: errors caught at compile time
type NthElement<T extends unknown[], N extends number> =
  T[N] extends undefined ? never : T[N]

// Compiler knows exact types of each tuple element
type First = [1, 'hello', true][0]  // 1
type Second = [1, 'hello', true][1] // 'hello'
```

---

## 📌 Tuples as Numbers: Peano Arithmetic

The foundation of type-level arithmetic is representing numbers as **tuple lengths**. This is analogous to Peano numbers in type theory.

### BuildTuple -- creating a tuple of given length

```typescript
type BuildTuple<N extends number, T extends unknown[] = []> =
  T['length'] extends N ? T : BuildTuple<N, [...T, unknown]>

type Three = BuildTuple<3>  // [unknown, unknown, unknown]
type Zero = BuildTuple<0>   // []
```

💡 **How it works**: recursively add elements to the tuple until its length equals N.

### Add

```typescript
type Add<A extends number, B extends number> =
  [...BuildTuple<A>, ...BuildTuple<B>]['length'] extends infer R extends number
    ? R
    : never

type Seven = Add<3, 4>     // 7
type Twenty = Add<10, 10>  // 20
```

📌 **Principle**: concatenate two tuples and take the length of the result.

### Subtract

```typescript
type Subtract<A extends number, B extends number> =
  BuildTuple<A> extends [...BuildTuple<B>, ...infer Rest]
    ? Rest['length']
    : never

type Four = Subtract<7, 3>  // 4
type Zero = Subtract<5, 5>  // 0
```

📌 **Principle**: destructure a tuple of length A, "slicing off" B elements from the front. The length of the remainder is the result.

### Multiply

```typescript
type Multiply<A extends number, B extends number, Acc extends unknown[] = []> =
  B extends 0
    ? Acc['length']
    : Multiply<A, Subtract<B, 1> & number, [...Acc, ...BuildTuple<A>]>

type Twelve = Multiply<3, 4>      // 12
type TwentyFive = Multiply<5, 5>  // 25
```

📌 **Principle**: recursively add a tuple of length A to the accumulator B times.

### Comparing numbers

```typescript
type IsGreater<A extends number, B extends number> =
  BuildTuple<A> extends [...BuildTuple<B>, ...infer Rest]
    ? Rest extends [unknown, ...unknown[]]
      ? true
      : false
    : false

type Yes = IsGreater<5, 3>  // true
type No = IsGreater<2, 7>   // false
```

---

## 📌 Type-Level Collections

### Map -- transform each tuple element

```typescript
type ToStringF = { type: 'toString' }
type WrapArrayF = { type: 'wrapArray' }

type ApplyF<T, F> =
  F extends ToStringF ? `${T & (string | number | boolean)}`
  : F extends WrapArrayF ? T[]
  : never

type TupleMap<T extends unknown[], F> =
  T extends [infer Head, ...infer Tail]
    ? [ApplyF<Head, F>, ...TupleMap<Tail, F>]
    : []

type Result = TupleMap<[1, 2, 3], ToStringF>  // ["1", "2", "3"]
```

### Filter

```typescript
type TupleFilter<T extends unknown[], Predicate> =
  T extends [infer Head, ...infer Tail]
    ? Head extends Predicate
      ? [Head, ...TupleFilter<Tail, Predicate>]
      : TupleFilter<Tail, Predicate>
    : []

type OnlyStrings = TupleFilter<[1, 'a', 2, 'b', true], string>
// ['a', 'b']
```

### Reduce (Flatten)

```typescript
type TupleReduce<T extends unknown[], Acc extends unknown[] = []> =
  T extends [infer Head, ...infer Tail]
    ? Head extends unknown[]
      ? TupleReduce<Tail, [...Acc, ...Head]>
      : TupleReduce<Tail, [...Acc, Head]>
    : Acc

type Flattened = TupleReduce<[[1, 2], [3, 4], [5]]>
// [1, 2, 3, 4, 5]
```

---

## 📌 Type-Level String Operations

Template literal types enable string manipulation at the type level.

### Split

```typescript
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : S extends ''
      ? []
      : [S]

type Parts = Split<'a-b-c', '-'>  // ['a', 'b', 'c']
```

### Join

```typescript
type Join<T extends string[], D extends string> =
  T extends []
    ? ''
    : T extends [infer H extends string]
      ? H
      : T extends [infer H extends string, ...infer R extends string[]]
        ? `${H}${D}${Join<R, D>}`
        : never

type Joined = Join<['hello', 'world'], '-'>  // 'hello-world'
```

### Replace and ReplaceAll

```typescript
type Replace<S extends string, From extends string, To extends string> =
  From extends ''
    ? S
    : S extends `${infer Before}${From}${infer After}`
      ? `${Before}${To}${After}`
      : S

type ReplaceAll<S extends string, From extends string, To extends string> =
  From extends ''
    ? S
    : S extends `${infer Before}${From}${infer After}`
      ? ReplaceAll<`${Before}${To}${After}`, From, To>
      : S

type R1 = Replace<'hello world', 'world', 'TS'>  // 'hello TS'
type R2 = ReplaceAll<'a-b-c', '-', '_'>           // 'a_b_c'
```

### Trim

```typescript
type Whitespace = ' ' | '\t' | '\n'

type TrimLeft<S extends string> =
  S extends `${Whitespace}${infer Rest}` ? TrimLeft<Rest> : S

type TrimRight<S extends string> =
  S extends `${infer Rest}${Whitespace}` ? TrimRight<Rest> : S

type Trim<S extends string> = TrimLeft<TrimRight<S>>

type Trimmed = Trim<'  hello  '>  // 'hello'
```

---

## 📌 Type-Level Pattern Matching

Pattern matching at the type level using conditional types and template literal inference:

### Extracting structure from strings

```typescript
type ExtractRoute<S extends string> =
  S extends `/${infer Resource}/${infer Id}/${infer Action}`
    ? { resource: Resource; id: Id; action: Action }
    : S extends `/${infer Resource}/${infer Id}`
      ? { resource: Resource; id: Id }
      : S extends `/${infer Resource}`
        ? { resource: Resource }
        : never

type R = ExtractRoute<'/users/123/edit'>
// { resource: 'users'; id: '123'; action: 'edit' }
```

### General-purpose Match

```typescript
type _ = { __brand: 'wildcard' }
type PatternCase<P, R> = { pattern: P; result: R }

type Match<Value, Cases extends PatternCase<unknown, unknown>[]> =
  Cases extends [infer Head extends PatternCase<unknown, unknown>, ...infer Tail extends PatternCase<unknown, unknown>[]]
    ? Value extends Head['pattern']
      ? Head['result']
      : Head['pattern'] extends _
        ? Head['result']
        : Match<Value, Tail>
    : never

type Status = Match<404, [
  PatternCase<200, 'OK'>,
  PatternCase<404, 'Not Found'>,
  PatternCase<_, 'Unknown'>,
]>  // 'Not Found'
```

---

## 📌 Type-Safe Builder (SQL Example)

Capstone: combining all techniques in a type-safe SQL builder.

```typescript
interface DBSchema {
  users: { id: number; name: string; email: string; active: boolean }
  posts: { id: number; title: string; author_id: number }
}

type TableName = keyof DBSchema
type ColumnOf<T extends TableName> = keyof DBSchema[T] & string

class SQLBuilder<T extends TableName, Selected extends ColumnOf<T> = ColumnOf<T>> {
  select<C extends ColumnOf<T>>(...cols: C[]): SQLBuilder<T, C> { /* ... */ }
  where(col: ColumnOf<T>, op: string, val: unknown): this { /* ... */ }
  toSQL(): string { /* ... */ }
  execute(): Pick<DBSchema[T], Selected>[] { /* ... */ }
}

// Type-safe!
from('users').select('id', 'name').where('active', '=', true)
// Result type: Pick<DBSchema['users'], 'id' | 'name'>[]

// Compile errors:
from('users').select('nonexistent')       // ❌
from('users').where('fake_col', '=', 1)   // ❌
from('nonexistent')                        // ❌
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Forgetting the base case of recursion

```typescript
// ❌ Infinite recursion — no base case
type BadSplit<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}`
    ? [H, ...BadSplit<T, D>]
    : never  // Should be [S] or [], not never!

// ✅ Correct
type Split<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}`
    ? [H, ...Split<T, D>]
    : S extends '' ? [] : [S]
```

### Mistake 2: Exceeding the recursion limit

```typescript
// ❌ Recursion too deep for large numbers
type Add<A extends number, B extends number> =
  [...BuildTuple<A>, ...BuildTuple<B>]['length']
// Add<500, 500> — Error: Type instantiation is excessively deep

// ✅ Be aware of the ~999 limit (varies by TS version)
// For large numbers, use iterative approaches
```

### Mistake 3: Forgetting infer extends

```typescript
// ❌ Without infer extends — type may not narrow
type GetLength<T extends unknown[]> =
  T['length']  // type is number, not literal

// ✅ With infer extends
type GetLength<T extends unknown[]> =
  T['length'] extends infer L extends number ? L : never
```

### Mistake 4: Wrong pattern order

```typescript
// ❌ Wildcard first — other patterns unreachable
type Match<V, Cases> =
  Cases extends [PatternCase<_, infer R>, ...infer _] ? R : never

// ✅ Wildcard last
type Match<V, Cases> =
  Cases extends [infer H, ...infer T]
    ? V extends H['pattern'] ? H['result'] : Match<V, T>
    : never
```

---

## 💡 Best Practices

1. **Start with simple cases** and add complexity incrementally
2. **Test each type separately** with type assertions: `const _: ExpectedType = actualValue`
3. **Remember TypeScript's recursion limits** (~999 levels)
4. **Use helper types** instead of monolithic definitions
5. **Document complex types** with comments and examples
6. **Don't overuse** type-level programming — use it only when compile-time checking provides real value
