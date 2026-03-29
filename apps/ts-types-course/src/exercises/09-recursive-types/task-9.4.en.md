# Task 9.4: Recursion Limits

## Goal

Understand TypeScript recursion limitations, learn to use tail-recursive optimization, and workarounds for deep recursion.

## Requirements

1. Explain TypeScript recursion limits (~50 levels for conditional types)
2. Show an example of naive recursion that hits the limit
3. Demonstrate tail-recursive optimization (TypeScript 4.5+): `BuildTuple<N>` with accumulator
4. Show the accumulator pattern with `Reverse<T>` — naive vs tail-recursive version
5. Implement arithmetic via tuple length: `Add<A, B>` with `BuildTuple`
6. Show recursive array checking `CheckAll<T>` with early exit
7. List best practices for recursive types
8. Implement depth limiter pattern: `SafeDeepReadonly<T, D>` with `MaxDepth` tuple

## Checklist

- [ ] Recursion limits explained (50 levels, error message)
- [ ] Naive recursion shown as anti-pattern
- [ ] Tail recursion with accumulator demonstrated
- [ ] `Reverse<[1,2,3,4,5]>` = `[5,4,3,2,1]` via tail recursion
- [ ] `Add<3, 4>` = `7` via tuple length
- [ ] `CheckAll` with early exit works
- [ ] Best practices listed
- [ ] Depth limiter prevents infinite recursion
- [ ] Results displayed on the page

## How to verify

1. Click the "Run" button
2. Verify the difference between naive and tail recursion is explained
3. Check that `Add<3, 4>` correctly computes 7
4. Verify the depth limiter pattern with `MaxDepth` tuple is explained
