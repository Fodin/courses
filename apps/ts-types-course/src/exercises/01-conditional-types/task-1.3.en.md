# Task 1.3: Nested Conditionals

## Goal

Learn to create nested conditional types for multi-level branching and recursive type unwrapping.

## Requirements

1. Implement type `TypeName<T>` determining the type name ('string', 'number', 'boolean', 'undefined', 'null', 'array', 'function', 'object') via a chain of nested conditional types
2. Implement type `DeepUnwrap<T>` recursively unwrapping Promise, Array, Set, Map to the base type
3. Implement a `ResponseType<M>` system for HTTP methods ('GET', 'POST', 'PUT', 'DELETE'), returning different response types for each method
4. Implement `SeverityAction<S>` for grouping log levels ('debug'|'info' -> 'log', 'warn' -> 'alert', 'error'|'fatal' -> 'notify')

## Checklist

- [ ] `TypeName<string>` = 'string', `TypeName<null>` = 'null', `TypeName<number[]>` = 'array'
- [ ] `DeepUnwrap<Promise<string[]>>` resolves to `string`
- [ ] `DeepUnwrap<Set<Map<string, boolean>>>` resolves to `boolean`
- [ ] `ResponseType<'GET'>` has a `cached` field, `ResponseType<'POST'>` has an `id` field
- [ ] `SeverityAction<'debug'>` = 'log', `SeverityAction<'error'>` = 'notify'
- [ ] A runtime `simulateRequest` function with conditional return type is created

## How to Verify

1. Check `TypeName` for all 8 type categories
2. Verify that `DeepUnwrap` works correctly with 3+ levels of nesting
3. Call `simulateRequest` with different methods and check the response structure
