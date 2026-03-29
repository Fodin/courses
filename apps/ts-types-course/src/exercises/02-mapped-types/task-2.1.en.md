# Task 2.1: Basic Mapped Types

## Goal

Learn to create basic mapped types: your own versions of Readonly, Partial, Required, Pick, Record, and a custom Nullable.

## Requirements

1. Implement `MyReadonly<T>` — makes all properties readonly. Show that mutation attempts produce errors
2. Implement `MyPartial<T>` — makes all properties optional
3. Implement `MyRequired<T>` with `-?` — removes optionality from all properties
4. Implement `MyPick<T, K extends keyof T>` — picks a subset of keys from a type
5. Implement `MyRecord<K extends string | number | symbol, V>` — creates a type with specified keys and value type
6. Implement `Nullable<T>` — makes all values nullable

## Checklist

- [ ] `MyReadonly<User>` doesn't allow property assignment
- [ ] `MyPartial<User>` allows creating an object with incomplete properties
- [ ] `MyRequired<Config>` requires all properties, including previously optional ones
- [ ] `MyPick<User, 'name' | 'email'>` contains only the specified keys
- [ ] `MyRecord<'a' | 'b', number>` contains keys 'a' and 'b' with number values
- [ ] `Nullable<User>` allows null for each property

## How to Verify

1. Try assigning a value to a readonly property — should error
2. Create a MyPartial object without some properties — should compile
3. Create a MyRequired object without a property — should error
