# Task 2.2: Accumulating Builder

## 🎯 Goal

Implement a Builder that tracks set required properties in the generic parameter and allows build() only when all required fields are provided.

## Requirements

1. Create a `FormBuilder<TSet>` class where TSet accumulates information about filled fields
2. Define at least 3 required fields (title, action, method) and 3 optional ones
3. Each required field setter returns `FormBuilder<TSet & { field: true }>`
4. The `build()` method uses this-parameter to require all required fields
5. Method call order should not be fixed
6. Demonstrate: full build, minimal build, invalid attempt

## Checklist

- [ ] `new FormBuilder().title("x").build()` — error (missing fields)
- [ ] `new FormBuilder().title("x").action("/y").method("POST").build()` — works
- [ ] Method call order doesn't affect the result
- [ ] Optional fields have default values in build()
- [ ] TypeScript shows which required fields are missing

## How to Verify

Try calling build() after setting only 1 and 2 required fields — check error messages. Verify that call order doesn't matter.
