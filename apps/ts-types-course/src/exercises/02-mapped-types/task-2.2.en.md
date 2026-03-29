# Task 2.2: Key Remapping

## Goal

Master key remapping via the `as` clause in mapped types: creating getter/setter interfaces, filtering keys, adding prefixes.

## Requirements

1. Implement `Getters<T>` — creates an interface with getters (`getName`, `getAge`, etc.) for each property
2. Implement `Setters<T>` — creates an interface with setters (`setName`, `setAge`, etc.)
3. Implement `OmitByType<T, U>` — excludes keys whose values are assignable to `U` (via `as never`)
4. Implement `ExtractByType<T, U>` — keeps only keys whose values are assignable to `U`
5. Implement `Prefixed<T, P>` — adds a prefix to each key
6. Implement `EventHandlers<T>` — creates handlers of the form `on{Key}Change(newValue, oldValue)`

## Checklist

- [ ] `Getters<{name: string}>` contains `getName: () => string`
- [ ] `Setters<{age: number}>` contains `setAge: (value: number) => void`
- [ ] `OmitByType<{id: number, name: string}, number>` contains only `name`
- [ ] `ExtractByType<{id: number, name: string}, string>` contains only `name`
- [ ] `Prefixed<{x: number}, 'api'>` contains `api_x: number`
- [ ] `EventHandlers` correctly types callbacks with new and old values

## How to Verify

1. Call Getters and Setters methods — verify argument/return types are correct
2. Check that OmitByType actually removes all numeric properties
3. Create EventHandlers and call a handler with typed arguments
