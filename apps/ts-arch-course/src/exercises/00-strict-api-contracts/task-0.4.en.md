# Task 0.4: Query Parameters

## 🎯 Goal

Implement type-safe building and parsing of URL query parameters based on a declarative schema.

## Requirements

1. Create a `QuerySchema` interface for describing allowed parameters and their types
2. Implement a conditional type `QueryValues<T>` that infers TypeScript types from the schema
3. Implement a `buildQueryString()` function for serializing typed parameters into a string
4. Implement a `parseQueryString()` function for deserializing a string back into a typed object
5. Support types: `string`, `number`, `boolean`, `string[]`
6. Demonstrate a roundtrip: build -> parse -> comparison

## Checklist

- [ ] Schema describes parameters with types `string | number | boolean | string[]`
- [ ] `QueryValues` correctly infers TypeScript types from the schema
- [ ] `buildQueryString` does not accept parameters with wrong types
- [ ] `parseQueryString` returns an object with correct types
- [ ] Arrays are serialized as repeating parameters (`roles=a&roles=b`)
- [ ] Roundtrip test passes: build(parse(qs)) === qs

## How to Verify

Try passing a numeric value to a string parameter — TypeScript should show an error. Verify that parsing correctly restores types from the string.
