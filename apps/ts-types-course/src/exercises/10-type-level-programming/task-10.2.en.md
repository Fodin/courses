# Task 10.2: Type-Level Collections

## Goal

Implement Map, Filter, and Reduce operations for tuple types at the TypeScript type system level.

## Requirements

1. Implement "functors" for map: `ToStringF`, `WrapArrayF`, `ToPromiseF` and the `ApplyF<T, F>` type that applies a functor to a value
2. Implement `TupleMap<T, F>` that recursively applies a transformation to each tuple element
3. Implement `TupleFilter<T, Predicate>` that keeps only elements extending `Predicate`
4. Implement `TupleReduce<T>` (flatten) that "unwraps" nested tuples into a flat one
5. Show composition: Map then Filter
6. Accompany each type-level example with a runtime analog

## Checklist

- [ ] `TupleMap<[1, 2, 3], ToStringF>` = `["1", "2", "3"]`
- [ ] `TupleMap<[string, number], WrapArrayF>` = `[string[], number[]]`
- [ ] `TupleFilter<[1, "a", 2, "b", 3], string>` = `["a", "b"]`
- [ ] `TupleReduce<[[1, 2], [3, 4], [5]]>` = `[1, 2, 3, 4, 5]`
- [ ] Composition of Map + Filter works correctly
- [ ] Compile-time assertions verify the types

## How to Verify

1. Check empty tuple: `TupleMap<[], ToStringF>` should be `[]`
2. Check filter with empty result: `TupleFilter<[1, 2, 3], string>` should be `[]`
3. Verify `TupleReduce` handles non-array elements (just appends them)
