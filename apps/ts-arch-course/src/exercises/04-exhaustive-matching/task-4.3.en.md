# Task 4.3: Pattern Extraction

## Goal

Implement a `PatternMatcher` utility for type-safe data extraction from tagged union types with support for type guards, mapping, and exhaustive handling.

## Requirements

1. Implement helper types `ExtractTag<T, Tag>` and `ExtractData<T, Tag>` for extracting a specific variant and its data from a union
2. Create a `PatternMatcher<T>` interface with methods: `extract`, `is`, `map`, `fold`
3. `extract(tag, value)` — returns variant data or `null`
4. `is(tag, value)` — type guard that narrows value type to a specific variant
5. `map(tag, value, fn)` — applies function to data if tag matches, otherwise `null`
6. `fold(value, handlers)` — exhaustive handling of all variants
7. Demonstrate with an `ApiResponse` type with variants: `Ok`, `NotFound`, `Unauthorized`, `RateLimit`

## Checklist

- [ ] `extract('Ok', response)` returns `{ items: string[]; total: number } | null`
- [ ] `is('Ok', response)` works as a type guard — after check, `data` fields are accessible
- [ ] `map('Ok', response, fn)` applies `fn` only to the `Ok` variant data
- [ ] `fold(response, handlers)` requires a handler for every variant
- [ ] Data types in `fold` handlers are correctly inferred for each variant
- [ ] For variants without data (NotFound), the handler receives `undefined`

## How to Verify

1. After `if (matcher.is('Ok', resp))`, check that `resp.data.items` is accessible without errors
2. In `fold`, try removing a handler — there should be a compilation error
3. Verify that `extract` returns `null` for non-matching tags
