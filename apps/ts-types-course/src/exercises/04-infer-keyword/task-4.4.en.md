# Task 4.4: Infer in Tuples

## Goal

Learn to use `infer` for tuple type manipulations: extracting elements, reversing, merging, and transforming.

## Requirements

1. Create `Head<T>` and `Last<T>` types that extract the first and last elements of a tuple
2. Create a `Tail<T>` type that returns the tuple without its first element
3. Create a `Reverse<T>` type that recursively reverses a tuple (`[1, 2, 3]` -> `[3, 2, 1]`)
4. Create a `FlattenOnce<T>` type that unwraps one level of array nesting in a tuple (`[[1, 2], [3]]` -> `[1, 2, 3]`)
5. Create a `Zip<A, B>` type that pairs elements from two tuples (`['a', 'b'], [1, 2]` -> `[['a', 1], ['b', 2]]`)
6. Demonstrate computing tuple length via `T['length']`

## Checklist

- [ ] `Head` and `Last` correctly extract elements from a tuple
- [ ] `Tail` returns the tuple without its first element
- [ ] `Reverse` recursively reverses the tuple
- [ ] `FlattenOnce` unwraps one level of nested arrays
- [ ] `Zip` pairs elements from two tuples
- [ ] Tuple length is computed at the type level

## How to verify

1. Click the "Run" button
2. Verify that `Head<[string, number]>` yields `string` and `Last` yields `number`
3. Verify that `Reverse<[1, 2, 3]>` yields `[3, 2, 1]`
4. Check that `Zip` works correctly with tuples of equal length
