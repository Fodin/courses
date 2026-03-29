# Task 1.4: Conditional Types with Generics

## Goal

Learn to combine conditional types with generics to create advanced utility types: extracting keys by type, conditional function return types, partial requirement.

## Requirements

1. Implement type `Flatten<T>` recursively unwrapping Promise and Array to the base type
2. Implement types `OptionalKeys<T>` and `RequiredKeys<T>` extracting optional and required keys of an object type
3. Implement types `FunctionKeys<T>` and `NonFunctionKeys<T>` splitting object keys by value type (function / non-function)
4. Implement a generic function `processValue` with conditional return type: returns `string[]` (split) for strings, `number` (doubled) for numbers
5. Implement utility type `MakeRequired<T, K>` making specified keys required while leaving others unchanged

## Checklist

- [ ] `Flatten<Promise<string[]>>` resolves to `string`
- [ ] `OptionalKeys<{ a: string; b?: number }>` resolves to `'b'`
- [ ] `RequiredKeys<{ a: string; b?: number }>` resolves to `'a'`
- [ ] `FunctionKeys` correctly extracts only keys with function values
- [ ] `processValue("hello")` returns `string[]`, `processValue(42)` returns `number`
- [ ] `MakeRequired<T, K>` makes specified keys required

## How to Verify

1. Check `OptionalKeys` and `RequiredKeys` on an interface with mixed keys
2. Verify that `processValue` has different return types for string and number
3. Try creating an object of type `MakeRequired<Form, 'name'>` without the `name` field — error
