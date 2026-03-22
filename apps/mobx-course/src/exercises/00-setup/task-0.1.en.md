# Task 0.1: First Store

## Goal

Create a `CounterStore` class using `makeAutoObservable` and verify it works via console output (no React).

## Requirements

1. Import `makeAutoObservable` from `'mobx'`

2. Create a `CounterStore` class with property `count = 0`

3. Call `makeAutoObservable(this)` in the constructor

4. Add methods:
   - `increment()` — increases `count` by 1
   - `decrement()` — decreases `count` by 1

5. Create a store instance and perform operations:
   - Call `increment` three times
   - Call `decrement` once
   - Log `store.count` to console (expected: `2`)

## Checklist

- [ ] `makeAutoObservable` is imported from `'mobx'`
- [ ] `CounterStore` class is defined
- [ ] `count` property is initialized to `0`
- [ ] `makeAutoObservable(this)` is called in constructor
- [ ] `increment` and `decrement` methods work
- [ ] Console shows `2`

## How to verify

1. Open DevTools (F12) -> Console
2. Verify console shows `count: 2`
3. Component displays the result text
