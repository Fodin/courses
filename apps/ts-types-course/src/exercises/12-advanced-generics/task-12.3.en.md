# Task 12.3: Curried Generics

## Goal

Implement curried type constructors and partial generic application patterns in TypeScript through nested functions and the builder pattern.

## Requirements

1. Implement `mapOf<K>()` — a curried Map constructor that fixes the key type while the value type is inferred later
2. Implement `TypedBuilder` — a builder with progressive type accumulation via `field(key, value)` method
3. Implement `validatorFor<T>()` — a curried validator that first fixes the object type, then allows creating checks for specific fields
4. Implement `typedEmitter<Events>()` — a curried event emitter with type-safe `on` and `emit`
5. Show that each pattern provides autocomplete and type safety

## Checklist

- [ ] `mapOf<string>()([["a", 1]])` creates `Map<string, number>`
- [ ] `builder().field("host", "localhost").field("port", 3000).build()` — type contains both fields
- [ ] `validatorFor<User>().field("name").check(n => n.length > 0)` — type-safe
- [ ] `typedEmitter<AppEvents>().on("login", p => p.userId)` — payload autocomplete
- [ ] `typedEmitter<AppEvents>().emit("login", { wrong: true })` — compile error
- [ ] Each example is demonstrated at runtime

## How to Verify

1. In builder: verify that after `field("host", "localhost")` you cannot access `config.port`
2. In emitter: try `emit("login", { reason: "x" })` — should error
3. In validator: try `validatorFor<User>().field("nonexistent")` — should error
