# Task 8.1: Schema Inference

## 🎯 Goal

Create a schema definition system from which TypeScript automatically infers types. One schema — for both runtime validation and compile-time checking.

## Requirements

1. Create a `SchemaField<T>` type with `type` (string literal) and `required` (boolean) fields
2. Implement a `field(type, required?)` helper function for creating fields
3. Create an `InferFieldType<T>` conditional type mapping `'string'` -> `string`, `'number'` -> `number`, `'boolean'` -> `boolean`
4. Create an `InferSchema<T>` type that recursively infers the type from the schema definition (optional fields -> `T | undefined`)
5. Implement `createSchema(definition)` with `validate(data)` and `parse(data)` methods
6. Create a schema with at least 5 fields, including optional ones

## Checklist

- [ ] `field('number')` creates `SchemaField<'number'>` with `required: true`
- [ ] `field('string', false)` creates an optional field
- [ ] `InferSchema` infers correct types for all fields
- [ ] Optional fields have type `T | undefined`
- [ ] `validate()` returns a type guard (`data is InferSchema<T>`)
- [ ] `parse()` returns a typed object or `null`

## How to Verify

Create a schema with different field types and call `parse()` with valid and invalid data. Verify that after `parse()` TypeScript knows the exact type of each field.
