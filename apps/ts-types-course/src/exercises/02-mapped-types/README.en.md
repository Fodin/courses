# 🔥 Level 2: Mapped Types

## 🎯 What Are Mapped Types

Mapped Types are a TypeScript mechanism that lets you create **new types based on existing ones** by iterating over their keys. Think of it as `Array.map()`, but for types.

```typescript
type Mapped<T> = {
  [K in keyof T]: NewValueType
}
```

Mapped types are the foundation of most built-in TypeScript utility types (`Partial`, `Required`, `Readonly`, `Pick`, `Record`).

---

## 📌 Mapped Type Syntax

### Basic Structure

```typescript
type MyMapped<T> = {
  [K in keyof T]: T[K]
}
// This is an identity mapped type — creates a copy of T
```

Breaking it down:
- `K` — iteration variable (key name)
- `in` — iteration operator
- `keyof T` — set of keys to iterate over
- `T[K]` — indexed access type (value type at key K)

### Iterating Over an Arbitrary Union

```typescript
type FromUnion = {
  [K in 'a' | 'b' | 'c']: string
}
// { a: string; b: string; c: string }
```

---

## 📌 Basic Mapped Types

### Readonly — Prevent Modification

```typescript
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

interface User {
  name: string
  age: number
}

type ReadonlyUser = MyReadonly<User>
// { readonly name: string; readonly age: number }

const user: ReadonlyUser = { name: 'Alice', age: 30 }
user.name = 'Bob' // ❌ Cannot assign to 'name' because it is a read-only property
```

### Partial — All Properties Optional

```typescript
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

type PartialUser = MyPartial<User>
// { name?: string; age?: number }
```

### Required — All Properties Required

```typescript
type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}
```

💡 `-?` is a modifier that **removes** optionality. Similarly, `-readonly` removes readonly.

### Pick — Subset of Keys

```typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type UserName = MyPick<User, 'name'>
// { name: string }
```

### Record — Type with Specified Keys

```typescript
type MyRecord<K extends string | number | symbol, V> = {
  [P in K]: V
}

type StatusMap = MyRecord<'active' | 'inactive', boolean>
// { active: boolean; inactive: boolean }
```

---

## 📌 Key Remapping

Since TypeScript 4.1, mapped types can use an **`as` clause** to transform keys:

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
}

interface Person {
  name: string
  age: number
}

type PersonGetters = Getters<Person>
// { getName: () => string; getAge: () => number }
```

### Filtering Keys via as never

If the `as` expression resolves to `never`, the key is **excluded** from the result:

```typescript
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K]
}

interface Data {
  id: number
  name: string
  count: number
  label: string
}

type WithoutNumbers = OmitByType<Data, number>
// { name: string; label: string }
```

### Prefixes and Suffixes

```typescript
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}_${K & string}`]: T[K]
}

type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<K & string>}Change`]: (value: T[K]) => void
}
```

💡 `K & string` is needed because `keyof T` may contain `number` and `symbol`, but template literals only work with `string`.

---

## ���� Modifier Manipulation

### Adding Modifiers

```typescript
type Frozen<T> = { readonly [K in keyof T]: T[K] }
type Loose<T> = { [K in keyof T]?: T[K] }
```

### Removing Modifiers

```typescript
type Mutable<T> = { -readonly [K in keyof T]: T[K] }
type Concrete<T> = { [K in keyof T]-?: T[K] }
```

### Combined Modifiers

```typescript
type ReadonlyRequired<T> = {
  readonly [K in keyof T]-?: T[K]
}
```

### Selective Modifiers

Often you need to apply a modifier to a **subset** of keys:

```typescript
type ReadonlyPick<T, K extends keyof T> =
  { readonly [P in K]: T[P] } &
  { [P in Exclude<keyof T, K>]: T[P] }

type OptionalExcept<T, K extends keyof T> =
  { [P in K]-?: T[P] } &
  { [P in Exclude<keyof T, K>]?: T[P] }
```

---

## 📌 Deep Mapped Types

Regular mapped types only work on the first level of nesting. For deep transformation, you need **recursion**:

### DeepPartial

```typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends unknown[]
      ? T[K]                  // leave arrays alone
      : DeepPartial<T[K]>    // recurse for objects
    : T[K]                   // leave primitives as-is
}
```

### DeepReadonly

```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends unknown[]
      ? readonly T[K][number][]
      : DeepReadonly<T[K]>
    : T[K]
}
```

### DeepRequired

```typescript
type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object
    ? T[K] extends unknown[]
      ? T[K]
      : DeepRequired<T[K]>
    : T[K]
}
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Forgetting K & string with Key Remapping

```typescript
// ❌ Error: Type 'K' is not assignable to type 'string'
type Bad<T> = {
  [K in keyof T as `get${Capitalize<K>}`]: T[K]
}

// ✅ Intersect with string
type Good<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: T[K]
}
```

### Mistake 2: DeepPartial Without Array Check

```typescript
// ❌ Arrays will be unwrapped as objects
type BadDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? BadDeepPartial<T[K]> : T[K]
}
// Array<number> becomes { 0?: number; 1?: number; length?: number; ... }

// ✅ Check for arrays separately
type GoodDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends unknown[] ? T[K] : GoodDeepPartial<T[K]>
    : T[K]
}
```

### Mistake 3: Intersection Instead of Single Mapped Type

```typescript
// ❌ Intersection creates visually complex type in IDE
type Verbose<T> = Readonly<T> & Partial<T>

// ✅ One mapped type — cleaner
type Clean<T> = {
  readonly [K in keyof T]?: T[K]
}
```

### Mistake 4: Forgetting -? for Required

```typescript
// ❌ This is identity, not Required!
type NotRequired<T> = {
  [K in keyof T]: T[K]
}

// ✅ Need -? to remove optional
type IsRequired<T> = {
  [K in keyof T]-?: T[K]
}
```

---

## 💡 Best Practices

1. **Use built-in utility types** (`Partial`, `Required`, `Readonly`, `Pick`, `Record`) instead of custom ones when possible.

2. **Key remapping (`as`) is a powerful tool.** Use it for getter/setter interfaces, key filtering, prefixed types.

3. **For deep transformations, always check for arrays.** `unknown[]` needs to be handled separately from regular objects.

4. **Split complex mapped types.** Instead of one monster with 10 conditions — use several intermediate types.

5. **Remember homomorphism.** Mapped types of the form `{ [K in keyof T]: ... }` preserve the modifiers of the source type (readonly, optional). This is called a homomorphic mapped type.

6. **Test with optional/readonly properties.** Make sure your mapped type correctly handles modifiers.
