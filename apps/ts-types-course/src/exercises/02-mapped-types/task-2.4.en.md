# Task 2.4: Deep Mapped Types

## Goal

Learn to create recursive mapped types for deep transformation of nested objects: DeepPartial, DeepReadonly, DeepRequired, DeepNullable.

## Requirements

1. Implement `DeepPartial<T>` — recursively makes all nested properties optional. Do not unwrap arrays
2. Implement `DeepReadonly<T>` — recursively makes all nested properties readonly
3. Implement `DeepRequired<T>` — recursively removes optionality at all nesting levels
4. Implement `DeepNullable<T>` — recursively adds `| null` to every property
5. Implement a `deepMerge<T>(target: T, source: DeepPartial<T>): T` function for type-safe deep merging

## Checklist

- [ ] `DeepPartial` allows specifying only nested properties without the top level
- [ ] `DeepPartial` does not unwrap arrays (array stays an array, not an object with numeric keys)
- [ ] `DeepReadonly` blocks mutation at 2+ levels of nesting
- [ ] `DeepRequired` requires all properties at all levels
- [ ] `DeepNullable` allows null at any nesting level
- [ ] `deepMerge` correctly merges nested objects, preserving type safety

## How to Verify

1. Create `DeepPartial<AppConfig>` with only one nested property at the 3rd level
2. Try mutating a deep property of `DeepReadonly` — should error
3. Call `deepMerge` with a partial override — check that base values are preserved
