# Task 8.3: Ambient Declarations

## Goal

Learn to create ambient declarations for describing external code, use namespace merging, global augmentation, and triple-slash directives.

## Requirements

1. Explain the concept of ambient declarations and the `declare` keyword
2. Show `declare var/const` for global variables (`__VERSION__`, `__DEV__`, `process`)
3. Show `declare function` for global functions (`require`, `setTimeout`)
4. Create a `MathUtils` namespace and demonstrate namespace merging (add, multiply, subtract, PI)
5. Explain `declare global { ... }` for augmenting global scope from a module
6. Implement Enum + Namespace merging: `Color` enum with `fromHex()` and `toLabel()` methods
7. Implement Class + Namespace merging: `Validator` class with `Options` interface and `create()` factory
8. Explain triple-slash directives: `reference path`, `reference types`, `reference lib`

## Checklist

- [ ] Ambient declarations and `declare` explained
- [ ] `declare var/const/function` examples shown
- [ ] Namespace merging works with `MathUtils`
- [ ] `declare global` explained
- [ ] Enum + Namespace: `Color.fromHex()` and `Color.toLabel()` work
- [ ] Class + Namespace: `Validator.create()` and `Validator.defaults` work
- [ ] Triple-slash directives explained
- [ ] Results displayed on the page

## How to verify

1. Click the "Run" button
2. Verify that `MathUtils` contains functions from both namespace blocks
3. Check that `Color.fromHex('#00FF00')` returns `GREEN`
4. Verify that `Validator.create()` creates a validator and `Validator.defaults` is accessible
