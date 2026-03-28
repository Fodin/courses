# Task 4.2: Discriminated unions

## Goal
Use discriminated unions to model loading states.

## Requirements
1. Define the `AsyncState<T>` type with variants: `idle`, `loading`, `success`, `error`
2. Each variant has a `status` field (discriminant)
3. `success` contains `data: T`, `error` contains `error: string` and `retryCount`
4. Create a function `renderState(state)` that handles all variants
5. Simulate loading a user with a random outcome

## Checklist
- [ ] `AsyncState<T>` defined with 4 variants
- [ ] Discriminant `status` works for type narrowing
- [ ] Component correctly displays all states
- [ ] Visual indication: different colors for success/error
