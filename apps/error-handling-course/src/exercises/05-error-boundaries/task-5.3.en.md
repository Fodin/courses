# Task 5.3: Recovery After an Error

## Goal
Implement an Error Boundary with recovery capability (retry).

## Requirements
1. Create `RecoverableErrorBoundary` with "Try again" button
2. On click — reset `hasError` and increment `resetKey`
3. Use `key={resetKey}` on children wrapper to recreate the tree
4. Create `RandomFailure` — a component that crashes with 50% probability
5. Show that after clicking the button the component is recreated

## Checklist
- [ ] `RecoverableErrorBoundary` with reset button
- [ ] `resetKey` + `key` to recreate tree
- [ ] `RandomFailure` component
- [ ] Recovery works on button click
