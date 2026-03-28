# Task 6.3: Option / Maybe

## Objective

Implement the `Option<T>` pattern for safely working with absent values instead of null/undefined.

## Requirements

1. Create `Some<T>` and `None` classes with a `_tag` field ('some' | 'none')
2. Implement a `map` method — transforms the value inside Some (None stays None)
3. Implement a `flatMap` method — chains where each step can return None
4. Implement a `getOrElse(defaultValue)` method — extracts the value with a fallback
5. Create a `fromNullable(value)` function — converts null/undefined to None and anything else to Some
6. Demonstrate safe access to nested object properties

## Checklist

- [ ] `Some` and `None` classes with correct `_tag` values
- [ ] `map` works for Some, passes through None
- [ ] `flatMap` unwraps nested Options
- [ ] `getOrElse` returns the value or the default
- [ ] `fromNullable` correctly handles null, undefined, and values
- [ ] Demo of safe access to nested fields

## How to Verify

- Click the button — the chain of nested field accesses should be displayed
- Some values pass through map/flatMap
- None skips transformations and returns the default via getOrElse
- fromNullable(null) === None, fromNullable(42) === Some(42)
