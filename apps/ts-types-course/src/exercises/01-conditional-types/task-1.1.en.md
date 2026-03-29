# Task 1.1: Basic Conditional Types

## Goal

Learn to create basic conditional types for type checking, extracting nested types via `infer`, and filtering nullable values.

## Requirements

1. Implement type `IsString<T>` returning `true` for string types and `false` for others. Create a runtime function `checkIsString` with analogous behavior
2. Implement type `IsArray<T>` checking whether `T` is an array
3. Implement type `ExtractReturnType<T>` extracting the return type of a function via `infer`. Return `never` for non-functions
4. Implement type `ExtractPromiseType<T>` extracting the type from `Promise`. Return `T` as-is for non-Promises
5. Implement type `NonNullableCustom<T>` excluding `null` and `undefined` from union types. Create a runtime function `filterNullable`

## Checklist

- [ ] `IsString<"hello">` resolves to `true`, `IsString<42>` to `false`
- [ ] `IsArray<number[]>` resolves to `true`, `IsArray<string>` to `false`
- [ ] `ExtractReturnType<() => boolean>` resolves to `boolean`
- [ ] `ExtractPromiseType<Promise<string>>` resolves to `string`
- [ ] `NonNullableCustom<string | null | undefined>` resolves to `string`
- [ ] Runtime functions work correctly with test data

## How to Verify

1. Create type assertions: `type _Test = IsString<"hello"> extends true ? 'pass' : 'fail'`
2. Check `ExtractReturnType` for functions with various return types
3. Verify that `filterNullable` removes all null/undefined from the array
