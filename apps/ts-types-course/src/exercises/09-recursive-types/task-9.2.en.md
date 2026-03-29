# Task 9.2: Recursive Conditional Types

## Goal

Create utility types with recursive conditional types: DeepReadonly, DeepPartial, DeepRequired, DeepAwaited, Flatten, DeepNullable.

## Requirements

1. Implement `DeepReadonly<T>` — recursively makes all properties readonly, excluding Function
2. Implement `DeepPartial<T>` — recursively makes all properties optional
3. Implement `DeepRequired<T>` — recursively removes the optional modifier (`-?`)
4. Implement `DeepAwaited<T>` — recursively unwraps Promises (including `Promise<Promise<T>>`)
5. Implement `Flatten<T>` — flattens nested arrays to the base type
6. Implement `DeepNullable<T>` — recursively adds `| null` to all properties

## Checklist

- [ ] `DeepReadonly` prevents modification of nested properties
- [ ] `DeepPartial` allows specifying only part of the configuration
- [ ] `DeepRequired` requires all nested fields
- [ ] `DeepAwaited` unwraps `Promise<Promise<string>>` to `string`
- [ ] `Flatten<number[][][]>` returns `number`
- [ ] `DeepNullable` adds null to every field recursively
- [ ] All types exclude Function from recursion
- [ ] Results displayed on the page

## How to verify

1. Click the "Run" button
2. Verify that `DeepReadonly<Config>` doesn't allow modifying `config.server.ssl.enabled`
3. Check that `DeepPartial<Config>` accepts an object with only `server.port`
4. Verify that `DeepNullable` allows `null` at any nesting level
