# Task 10.4: Type-Level Pattern Matching

## Goal

Build a pattern matching engine that works at the TypeScript type level: extract structure from strings, general-purpose Match with wildcard, and exhaustive matching.

## Requirements

1. Implement `ExtractRoute<S>` — extracts resource, id, and action from a URL pattern `/resource/id/action`
2. Implement helper types `_` (wildcard) and `PatternCase<P, R>`
3. Implement `Match<Value, Cases>` — finds the first matching pattern and returns the result
4. Show exhaustive matching via discriminated union and conditional types (using shapes example)
5. Implement runtime analogs for each type-level pattern
6. The wildcard pattern `_` must match any value

## Checklist

- [ ] `ExtractRoute<"/users/123/edit">` = `{ resource: "users"; id: "123"; action: "edit" }`
- [ ] `ExtractRoute<"/posts/456">` = `{ resource: "posts"; id: "456" }`
- [ ] `ExtractRoute<"/dashboard">` = `{ resource: "dashboard" }`
- [ ] `Match<200, [PatternCase<200, "OK">, ...]>` = `"OK"`
- [ ] `Match<999, [..., PatternCase<_, "Unknown">]>` = `"Unknown"` (wildcard)
- [ ] Exhaustive matching on Shape (`circle | rect | triangle`) covers all variants
- [ ] Runtime functions give the same results

## How to Verify

1. Check that the wildcard pattern only works last (if first — it overrides all others)
2. Verify that `Match` with an empty Cases list returns `never`
3. Check that `ExtractRoute` correctly handles paths without `id` and `action`
