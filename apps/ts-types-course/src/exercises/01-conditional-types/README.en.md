# 🔥 Level 1: Conditional Types

## 🎯 What Are Conditional Types

Conditional types are a TypeScript mechanism for creating types that **depend on a condition**. They work similarly to the ternary operator in JavaScript, but at the type system level:

```typescript
type Result = T extends U ? X : Y
//   If T is assignable to U → X, otherwise → Y
```

This is one of TypeScript's most powerful features, enabling you to create **computed types** -- types determined based on other types.

---

## 📌 Basic Conditional Types

### Simple Type Checking

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<'hello'>   // true
type B = IsString<42>        // false
type C = IsString<string>    // true
```

### Array Check

```typescript
type IsArray<T> = T extends unknown[] ? true : false

type A = IsArray<number[]>    // true
type B = IsArray<string>      // false
type C = IsArray<[1, 2, 3]>  // true (tuple extends unknown[])
```

### Type Extraction with infer

The `infer` keyword lets you **declare a type variable** inside a conditional expression and use it in the true branch:

```typescript
// Extract function return type
type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never

type A = ReturnOf<() => string>           // string
type B = ReturnOf<(x: number) => boolean> // boolean
type C = ReturnOf<string>                 // never (not a function)
```

```typescript
// Extract array element type
type ElementOf<T> = T extends (infer E)[] ? E : T

type A = ElementOf<string[]>   // string
type B = ElementOf<number[]>   // number
type C = ElementOf<boolean>    // boolean (not an array — return as-is)
```

```typescript
// Extract type from Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

type A = UnwrapPromise<Promise<string>>  // string
type B = UnwrapPromise<number>           // number
```

---

## 📌 Distributive Conditional Types

This is one of the most counterintuitive features of TypeScript. When a conditional type is applied to a **naked type parameter** (not wrapped in another type), it **distributes** over unions:

```typescript
type ToArray<T> = T extends unknown ? T[] : never

// Naked type parameter T — distribution over union:
type Result = ToArray<string | number>
// = ToArray<string> | ToArray<number>
// = string[] | number[]
// NOT (string | number)[]!
```

### Step-by-Step Breakdown

```
ToArray<string | number>

Step 1: Distribute the union
  = ToArray<string> | ToArray<number>

Step 2: Apply conditional to each member
  = (string extends unknown ? string[] : never) | (number extends unknown ? number[] : never)

Step 3: Simplify
  = string[] | number[]
```

### Preventing Distribution

By wrapping `T` in a tuple `[T]`, we prevent distribution:

```typescript
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never

type Result = ToArrayNonDist<string | number>
// = (string | number)[]
// One array containing string | number
```

### Practical Application: Extract and Exclude

The standard utility types `Extract` and `Exclude` work precisely because of distributivity:

```typescript
// Keep only union members assignable to U
type MyExtract<T, U> = T extends U ? T : never

type A = MyExtract<string | number | boolean, string | number>
// = string | number

// Remove union members assignable to U
type MyExclude<T, U> = T extends U ? never : T

type B = MyExclude<string | number | boolean, boolean>
// = string | number
```

### never and Distributivity

`never` is an empty union (a union with zero members). A distributive conditional over `never` always returns `never`:

```typescript
// ❌ Doesn't work for never!
type BadIsNever<T> = T extends never ? true : false
type Test = BadIsNever<never> // never (not true!)

// ✅ Wrap in tuple
type IsNever<T> = [T] extends [never] ? true : false
type Test = IsNever<never> // true
```

---

## 📌 Nested Conditional Types

Conditional types can be nested to create multi-level branching:

```typescript
type TypeName<T> =
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends boolean ? 'boolean' :
  T extends undefined ? 'undefined' :
  T extends null ? 'null' :
  T extends unknown[] ? 'array' :
  T extends (...args: any[]) => any ? 'function' :
  'object'

type A = TypeName<'hello'>     // 'string'
type B = TypeName<42>          // 'number'
type C = TypeName<number[]>    // 'array'
type D = TypeName<() => void>  // 'function'
```

### Recursive Unwrapping

```typescript
type DeepUnwrap<T> =
  T extends Promise<infer U> ? DeepUnwrap<U> :
  T extends Array<infer E> ? DeepUnwrap<E> :
  T extends Set<infer S> ? DeepUnwrap<S> :
  T extends Map<any, infer V> ? DeepUnwrap<V> :
  T

type A = DeepUnwrap<Promise<string>>           // string
type B = DeepUnwrap<Promise<number[]>>         // number
type C = DeepUnwrap<Set<Map<string, boolean>>> // boolean
```

---

## 📌 Conditional Types with Generics

Combining conditional types and generics allows creating powerful utility types:

### Extracting Keys by Value Type

```typescript
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

interface Service {
  name: string
  version: number
  login: (user: string) => boolean
  logout: () => void
}

type FK = FunctionKeys<Service>  // 'login' | 'logout'
```

### Conditional Types for Shaping APIs

```typescript
type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

interface Config {
  host?: string
  port?: number
  debug?: boolean
}

type ProductionConfig = MakeRequired<Config, 'host' | 'port'>
// { host: string; port: number; debug?: boolean }
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Forgetting About Distributivity

```typescript
// ❌ Expect (string | number)[], get string[] | number[]
type ToArray<T> = T extends any ? T[] : never
type Result = ToArray<string | number>  // string[] | number[]

// ✅ If you need one array — wrap in tuple
type ToArray<T> = [T] extends [any] ? T[] : never
type Result = ToArray<string | number>  // (string | number)[]
```

### Mistake 2: Checking never Without Wrapping

```typescript
// ❌ Always returns never for never
type Bad<T> = T extends never ? 'empty' : 'not empty'
type Test = Bad<never>  // never

// ✅ Wrap in tuple
type Good<T> = [T] extends [never] ? 'empty' : 'not empty'
type Test = Good<never>  // 'empty'
```

### Mistake 3: infer in the Wrong Position

```typescript
// ❌ infer can ONLY be used in the extends clause of a conditional type
type Bad<T> = T extends infer U ? U : never  // Works but useless
type AlsoBad = infer U  // ❌ Error: infer outside conditional type

// ✅ infer in a meaningful position
type Good<T> = T extends Promise<infer U> ? U : T
```

### Mistake 4: Excessive Nesting

```typescript
// ❌ Hard to read and maintain
type Complex<T> =
  T extends string ? T extends `${infer A}.${infer B}` ?
    A extends `${infer C}-${infer D}` ? [C, D, B] : [A, B]
  : [T] : never

// ✅ Break into intermediate types with clear names
type SplitDot<T extends string> = T extends `${infer A}.${infer B}` ? [A, B] : [T]
type SplitDash<T extends string> = T extends `${infer A}-${infer B}` ? [A, B] : [T]
```

---

## 💡 Best Practices

1. **Break complex conditional types** into intermediate types with descriptive names.

2. **Remember distributivity** every time a conditional type receives a union. If you don't want distribution -- wrap in `[T]`.

3. **Use never as a fallback** in conditional types to denote impossible combinations.

4. **Test with edge cases:** `never`, `any`, `unknown`, empty unions, nested generics.

5. **Limit recursion depth.** TypeScript has a limit (~50 levels). For deep recursion, use tail-call conditional types (tail-call optimization is available since TS 4.5+).

6. **Document complex conditional types** with comments including input/output examples.
