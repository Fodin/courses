# 🔥 Level 7: Type Variance

## 🎯 Introduction

Variance is one of the most fundamental yet misunderstood concepts in TypeScript's type system. It determines **how generic types relate when their type parameters are in a subtype relationship**. For example, if `Dog extends Animal`, can you use `Array<Dog>` where `Array<Animal>` is expected?

Understanding variance is critical for:
- Designing safe generic APIs
- Understanding TypeScript errors when passing callbacks
- Working with collections, Promises, and event systems
- Making informed choices between method and property syntax

## 🔥 Types of Variance

There are four types of variance:

| Type | Meaning | Example |
|------|---------|---------|
| **Covariance** | Subtyping direction preserved | `Producer<Dog>` -> `Producer<Animal>` |
| **Contravariance** | Subtyping direction reversed | `Consumer<Animal>` -> `Consumer<Dog>` |
| **Invariance** | Assignment forbidden both ways | `Box<Dog>` != `Box<Animal>` |
| **Bivariance** | Allowed both ways (unsound) | Methods in TS |

## 🔥 Covariance

### Output Position

Type T is in a **covariant** (output) position when used as a **return type**:

```typescript
interface Producer<T> {
  produce(): T  // T in output position
}
```

If `Dog extends Animal`, then `Producer<Dog>` is compatible with `Producer<Animal>`:

```typescript
interface Animal { name: string }
interface Dog extends Animal { breed: string }

const dogProducer: Producer<Dog> = {
  produce: () => ({ name: 'Rex', breed: 'Shepherd' })
}

// ✅ Safe: Dog is an Animal, so Producer<Dog> is a Producer<Animal>
const animalProducer: Producer<Animal> = dogProducer
const animal = animalProducer.produce() // Animal
```

**Why is this safe?** `dogProducer.produce()` returns a `Dog`, which always contains all `Animal` fields. We simply "forget" about the extra fields.

### Arrays are covariant (with a caveat)

```typescript
const dogs: Dog[] = [{ name: 'Rex', breed: 'Shepherd' }]

// ✅ readonly arrays — safely covariant
const animals: readonly Animal[] = dogs

// ⚠️ Mutable arrays — NOT safe (but TS allows it!)
const mutableAnimals: Animal[] = dogs
mutableAnimals.push({ name: 'Whiskers' }) // A cat got into the dog array!
```

📌 **Important**: TypeScript allows covariant assignment of mutable arrays for convenience, even though it's unsound. Use `readonly` arrays for safety.

### Promise is covariant

```typescript
const dogPromise: Promise<Dog> = Promise.resolve({ name: 'Rex', breed: 'Shepherd' })

// ✅ Promise<Dog> -> Promise<Animal>
const animalPromise: Promise<Animal> = dogPromise
```

## 🔥 Contravariance

### Input Position

Type T is in a **contravariant** (input) position when used as a **function parameter**:

```typescript
interface Consumer<T> {
  consume: (value: T) => void  // T in input position
}
```

If `Dog extends Animal`, then `Consumer<Animal>` is compatible with `Consumer<Dog>`:

```typescript
const animalConsumer: Consumer<Animal> = {
  consume: (a: Animal) => console.log(a.name)
}

// ✅ Safe: a function accepting Animal can accept Dog
const dogConsumer: Consumer<Dog> = animalConsumer
dogConsumer.consume({ name: 'Rex', breed: 'Shepherd' })
```

**Why is this safe?** `animalConsumer.consume` only uses `Animal` fields. If we pass a `Dog`, it certainly has all `Animal` fields.

**Why is the reverse unsafe?**

```typescript
const dogConsumer2: Consumer<Dog> = {
  consume: (d: Dog) => console.log(d.breed) // uses breed!
}

// ❌ Unsafe: Animal doesn't have breed
// const animalConsumer2: Consumer<Animal> = dogConsumer2 // Error
```

### Callbacks are contravariant in their parameters

```typescript
type Handler<T> = (value: T) => void

const handleAnimal: Handler<Animal> = (a) => console.log(a.name)

// ✅ Handler<Animal> -> Handler<Dog>: contravariance
const handleDog: Handler<Dog> = handleAnimal
```

## 🔥 Invariance

When type T is used **simultaneously** in input and output positions, the generic type becomes **invariant**:

```typescript
interface Box<T> {
  get(): T              // output — covariant
  set(value: T): void   // input — contravariant
}

// ❌ Box<Dog> cannot be assigned to Box<Animal>
// If it could: box.set({ name: 'Cat' }) — we'd insert a non-Dog
// const animalBox: Box<Animal> = dogBox // Error

// ❌ Box<Animal> cannot be assigned to Box<Dog>
// If it could: box.get() would return Animal without breed
// const dogBox: Box<Dog> = animalBox // Error
```

📌 **Invariant types** are the strictest and safest. Mutable collections should be invariant.

## 🔥 Bivariance

TypeScript (with `strictFunctionTypes: true`) distinguishes two syntaxes for declaring functions in interfaces:

### Method syntax — bivariant

```typescript
interface Handler {
  handle(event: Event): void  // method syntax
}
```

Methods in interfaces are **bivariant** — they allow assignment in both covariant and contravariant directions. This is less safe but necessary for DOM API compatibility.

### Property (function) syntax — strictly contravariant

```typescript
interface Handler {
  handle: (event: Event) => void  // property syntax
}
```

Function properties obey strict contravariance when `strictFunctionTypes: true`.

### Comparison

```typescript
interface Animal { name: string }
interface Dog extends Animal { breed: string }

// ❌ Method syntax — bivariant (allows unsound assignment)
interface BivariantEmitter {
  emit(handler: (data: Dog) => void): void
}

// ✅ Property syntax — contravariant (strict)
interface StrictEmitter {
  emit: (handler: (data: Dog) => void) => void
}
```

💡 **Recommendation**: use property syntax for callbacks and event handlers to get strict typing.

## 🔥 Explicit Variance Annotations (TypeScript 4.7+)

Starting with TypeScript 4.7, you can explicitly annotate variance of generic parameters:

```typescript
// out = covariant (T only in output positions)
interface Producer<out T> {
  produce(): T
}

// in = contravariant (T only in input positions)
interface Consumer<in T> {
  consume(value: T): void
}

// in out = invariant (T in both positions)
interface Box<in out T> {
  get(): T
  set(value: T): void
}
```

### Why use explicit annotations?

1. **Documentation** — immediately shows how the type behaves with inheritance
2. **Error detection** — TypeScript verifies T is only used in declared positions
3. **Performance** — the compiler can optimize compatibility checks

```typescript
// ❌ Error: T is used in input position but declared as out
interface Broken<out T> {
  produce(): T
  consume(value: T): void // Error: T is used in 'in' position
}
```

## 🔥 Practical Patterns

### Splitting Read/Write Interfaces

```typescript
interface Readable<out T> {
  read(): T
}

interface Writable<in T> {
  write(value: T): void
}

interface ReadWrite<T> extends Readable<T>, Writable<T> {}
```

This allows covariance when reading and contravariance when writing.

### Variance-safe event emitter

```typescript
// ✅ Property syntax for strictness
interface TypedEmitter<T> {
  on: (handler: (data: T) => void) => void
  emit: (data: T) => void
}
```

### Higher-order functions

```typescript
type Mapper<A, B> = (a: A) => B
// A — contravariant (input position)
// B — covariant (output position)

// Mapper<Animal, string> is compatible with Mapper<Dog, string>
// thanks to contravariance of A
const getName: Mapper<Animal, string> = (a) => a.name
const dogs: Dog[] = [{ name: 'Rex', breed: 'Shepherd' }]
const names: string[] = dogs.map(getName) // ✅
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Mutable array in covariant position

```typescript
// ❌ Dangerous: mutable array
function addAnimal(animals: Animal[]) {
  animals.push({ name: 'Cat' })
}

const dogs: Dog[] = [{ name: 'Rex', breed: 'Shepherd' }]
addAnimal(dogs) // TS allows this! But Cat ended up in Dog[]

// ✅ Safe: readonly array
function countAnimals(animals: readonly Animal[]): number {
  return animals.length
}
```

### Mistake 2: Confusing contravariance direction

```typescript
// ❌ Wrong expectation
type DogHandler = (dog: Dog) => void
type AnimalHandler = (animal: Animal) => void

// It seems like DogHandler is more specific...
// But AnimalHandler is assignable to DogHandler, not the other way!
const h: DogHandler = ((a: Animal) => console.log(a.name)) // ✅
// const h2: AnimalHandler = ((d: Dog) => console.log(d.breed)) // ❌
```

💡 **Mnemonic**: function parameters go "against the flow" of inheritance.

### Mistake 3: Using method syntax for callbacks

```typescript
// ❌ Bivariance allows unsound code
interface EventBus {
  on(event: string, handler: (data: Dog) => void): void  // method
}

// ✅ Strict contravariance
interface EventBus {
  on: (event: string, handler: (data: Dog) => void) => void  // property
}
```

### Mistake 4: Ignoring variance when designing APIs

```typescript
// ❌ Single interface with read and write — invariant
interface Repository<T> {
  get(id: string): T
  save(item: T): void
}
// Repository<Dog> and Repository<Animal> are incompatible!

// ✅ Split into read and write
interface ReadRepo<out T> {
  get(id: string): T
}
interface WriteRepo<in T> {
  save(item: T): void
}
// ReadRepo<Dog> is compatible with ReadRepo<Animal>
```

## 📌 Summary

| Position | Variance | Example | Direction |
|----------|----------|---------|-----------|
| Output (return) | Covariance | `Producer<T>` | Dog -> Animal |
| Input (parameter) | Contravariance | `Consumer<T>` | Animal -> Dog |
| Both | Invariance | `Box<T>` | Neither way |
| Method syntax | Bivariance | `{ handle(e: T): void }` | Both ways |

💡 **Key principle**: if you only **read** a value — covariance is safe. If you only **write** — contravariance is safe. If both operations — only invariance guarantees safety.
