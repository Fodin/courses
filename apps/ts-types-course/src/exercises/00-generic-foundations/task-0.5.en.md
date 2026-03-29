# Task 0.5: Generic Factories

## Goal

Learn to create type-safe factory functions using generics for constructors, builder patterns, registries, and validators.

## Requirements

1. Implement a factory `createModel<T extends Serializable>(ModelClass: new () => T): T` where `Serializable` is an interface with `serialize(): string`. Create at least 2 classes implementing this interface
2. Implement a factory with constructor arguments: `createWithArgs<T, TArgs extends unknown[]>(ctor: new (...args: TArgs) => T, ...args: TArgs): T`
3. Implement a registry factory with chained calls `register().register().create()`
4. Implement a builder factory `createBuilder<T>(initial: T)` with `set(key, value)` and `build()` methods, where `build()` returns `Readonly<T>`
5. Implement a validator factory `createValidator<T>(check, typeName)` with `validate` (type guard) and `parse` (throws on invalid value) methods

## Checklist

- [ ] `createModel(UserModel)` returns `UserModel` (not `Serializable`)
- [ ] `createWithArgs(ApiClient, 'url', 5000)` correctly types constructor arguments
- [ ] Registry correctly works with chain calls and type-safe `create`
- [ ] Builder doesn't allow passing wrong type values to `set`
- [ ] `build()` returns a frozen object
- [ ] `validator.validate()` works as a type guard
- [ ] `validator.parse()` throws an error with description for invalid values

## How to Verify

1. Try calling `builder.set('port', 'not a number')` — should produce a compile error
2. Call `registry.create('nonExistent')` — should produce an error
3. After `validator.validate(value)`, use `value` as a typed value
