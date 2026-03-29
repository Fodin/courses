# Task 7.2: Strict Function Types

## Goal

Study the difference between method and property syntax in the context of variance, understand method bivariance, and learn to design variance-safe APIs.

## Requirements

1. Show the difference between method syntax (`add(item: Dog): void`) and property syntax (`add: (item: Dog) => void`) in the context of variance
2. Explain why method bivariance is needed for DOM compatibility
3. Create `ReadonlyRepo<T>` (covariant) and `WriteRepo<T>` (contravariant) and show safe assignments
4. Demonstrate callback contravariance with a `Callback<T>` type
5. Show the danger of bivariance through an event emitter example
6. Use explicit variance annotations (`in`, `out`) from TypeScript 4.7+
7. Implement the `ReadableStream<out T>` / `WritableStream<in T>` / `DuplexStream<T>` split pattern
8. Show the variance of `Mapper<A, B>` (contravariant in A, covariant in B)

## Checklist

- [ ] Method vs property syntax difference demonstrated
- [ ] DOM compatibility through bivariance explained
- [ ] Read/Write interfaces split with correct variance
- [ ] Callback contravariance shown with example
- [ ] Explicit variance annotations (`in`/`out`) used
- [ ] ReadableStream/WritableStream pattern implemented
- [ ] Mapper variance in both positions shown

## How to verify

1. Click the "Run" button
2. Verify that `ReadonlyRepo<Dog>` is assignable to `ReadonlyRepo<Animal>`
3. Check that `Callback<Animal>` is assignable to `Callback<Dog>`
4. Verify that `Mapper<Animal, string>` can be used with `Array<Dog>.map`
