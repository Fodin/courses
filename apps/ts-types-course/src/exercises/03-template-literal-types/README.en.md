# 🔥 Level 3: Template Literal Types

## 🎯 What Are Template Literal Types

Template Literal Types are types built on JavaScript template literal syntax (backticks) but operating at the type system level. They allow you to create and transform **string literal types** programmatically.

```typescript
type Greeting = `Hello, ${string}`
// A type describing any string starting with "Hello, "

type World = `Hello, ${'World' | 'TypeScript'}`
// "Hello, World" | "Hello, TypeScript"
```

This feature was introduced in **TypeScript 4.1** and has become one of the key tools for type-level programming.

---

## 📌 Creating Union Types from Template Literals

When a template literal contains a union type, TypeScript creates a **Cartesian product** of all combinations:

```typescript
type Color = 'red' | 'green' | 'blue'
type Shade = 'light' | 'dark'

type ColorVariant = `${Shade}-${Color}`
// "light-red" | "light-green" | "light-blue" |
// "dark-red" | "dark-green" | "dark-blue"
// = 2 * 3 = 6 variants
```

### Three Union Types

```typescript
type Size = 'sm' | 'md' | 'lg'
type Color = 'red' | 'blue'
type Variant = 'outlined' | 'filled'

type ButtonClass = `btn-${Size}-${Color}-${Variant}`
// 3 * 2 * 2 = 12 variants!
```

### Practical Examples

```typescript
// CSS values
type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'
type CSSValue = `${number}${CSSUnit}`
// "10px", "1.5rem", "100%", "50vh" — all valid

// API routes
type ApiVersion = 'v1' | 'v2'
type Resource = 'users' | 'posts'
type ApiRoute = `/api/${ApiVersion}/${Resource}`

// Event handlers
type DOMEvent = 'click' | 'focus' | 'blur'
type EventHandler = `on${Capitalize<DOMEvent>}`
// "onClick" | "onFocus" | "onBlur"
```

⚠️ **Warning:** be careful with combinatorial explosion. `5 x 5 x 5` gives 125 variants, and TypeScript may slow down with too many combinations.

---

## 📌 Built-in String Manipulation Types

TypeScript provides 4 built-in types for transforming string literals:

```typescript
type A = Uppercase<'hello'>      // "HELLO"
type B = Lowercase<'HELLO'>      // "hello"
type C = Capitalize<'hello'>     // "Hello"
type D = Uncapitalize<'Hello'>   // "hello"
```

These types work **only** with literal string types, not with `string`:

```typescript
type E = Uppercase<string>  // string (no concrete result)
type F = Uppercase<'hello'> // "HELLO" (literal → literal)
```

---

## 📌 Custom String Transformations

### CamelCase from kebab-case

```typescript
type CamelCase<S extends string> =
  S extends `${infer Head}-${infer Tail}`
    ? `${Lowercase<Head>}${CamelCase<Capitalize<Tail>>}`
    : S

type A = CamelCase<'background-color'>   // "backgroundColor"
type B = CamelCase<'border-top-width'>    // "borderTopWidth"
```

### Replace and ReplaceAll

```typescript
type Replace<S extends string, From extends string, To extends string> =
  S extends `${infer Head}${From}${infer Tail}`
    ? `${Head}${To}${Tail}`
    : S

type ReplaceAll<S extends string, From extends string, To extends string> =
  S extends `${infer Head}${From}${infer Tail}`
    ? ReplaceAll<`${Head}${To}${Tail}`, From, To>
    : S
```

### Trim

```typescript
type TrimStart<S extends string> =
  S extends ` ${infer Rest}` ? TrimStart<Rest> : S

type TrimEnd<S extends string> =
  S extends `${infer Rest} ` ? TrimEnd<Rest> : S

type Trim<S extends string> = TrimStart<TrimEnd<S>>

type A = Trim<'  hello  '>  // "hello"
```

---

## 📌 Parsing String Types

Template literals with `infer` allow **parsing strings** into parts at the type level:

### Split

```typescript
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : [S]

type A = Split<'a.b.c', '.'>      // ["a", "b", "c"]
```

### Join

```typescript
type Join<T extends string[], D extends string> =
  T extends [infer First extends string]
    ? First
    : T extends [infer First extends string, ...infer Rest extends string[]]
      ? `${First}${D}${Join<Rest, D>}`
      : ''
```

### Extracting Route Parameters

```typescript
type ParseRouteParams<S extends string> =
  S extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ParseRouteParams<Rest>
    : S extends `${string}:${infer Param}`
      ? Param
      : never

type A = ParseRouteParams<'/users/:id/posts/:postId'>
// "id" | "postId"
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Combinatorial Explosion

```typescript
// ❌ Too many combinations
type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j'
type ThreeLetterCode = `${Letter}${Letter}${Letter}`
// 10 * 10 * 10 = 1000 variants! TypeScript will slow down

// ✅ Use string with runtime validation
type ThreeLetterCode = `${string}${string}${string}`
function isValidCode(s: string): boolean {
  return /^[a-j]{3}$/.test(s)
}
```

### Mistake 2: Forgetting K & string with Capitalize

```typescript
// ❌ keyof T can be number | string | symbol
type Bad<T> = {
  [K in keyof T as `get${Capitalize<K>}`]: T[K]
  //                              ^ Error!
}

// ✅ Intersect with string
type Good<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: T[K]
}
```

### Mistake 3: Recursion Without Base Case

```typescript
// ❌ Infinite recursion for empty string
type BadSplit<S extends string> =
  S extends `${infer H}${infer T}` ? [H, ...BadSplit<T>] : never

// ✅ Base case — return empty tuple
type GoodSplit<S extends string> =
  S extends `${infer H}${infer T}` ? [H, ...GoodSplit<T>] : []
```

### Mistake 4: Greedy infer

```typescript
// ⚠️ infer captures the minimum match for the first slot
type First<S extends string> = S extends `${infer F}${infer _}` ? F : S
// First<'hello'> → 'h' (one character, minimum match)

// But:
type BeforeDot<S extends string> = S extends `${infer F}.${infer _}` ? F : S
// BeforeDot<'a.b.c'> → 'a' (first delimiter match)
```

---

## 💡 Best Practices

1. **Control union size.** Template literals with large union types create a Cartesian product. Avoid combinations exceeding ~100 variants.

2. **Use built-in Uppercase/Lowercase/Capitalize/Uncapitalize.** They are compiler-optimized and faster than custom alternatives.

3. **Break complex parsers into intermediate types.** Instead of one monster with 5 infers — use several steps.

4. **Test edge cases:** empty strings, strings without delimiters, single-character strings.

5. **Use template literals for DSLs.** Routes, CSS values, event names — all excellent candidates for type-safe string templates.

6. **Prioritize readability.** Complex recursive template literal types are hard to understand. Document with examples.
