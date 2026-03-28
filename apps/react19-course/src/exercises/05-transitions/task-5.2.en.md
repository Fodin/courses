# Task 5.2: Async transitions

## Objective

Use an async function inside `startTransition` — a new capability in React 19.

## Requirements

1. Create `startTransition` via `useTransition`
2. Pass an async function with `await` into `startTransition`
3. `isPending` will automatically become `true` for the duration of the `await`
4. Show a data-saving interaction with a loading indicator

## Checklist

- [ ] An async function is passed to `startTransition`
- [ ] `await` is used inside the transition
- [ ] `isPending` automatically tracks the async operation
- [ ] A loading indicator is displayed during the `await`

## How to verify

1. Click "Save" — a loading indicator appears
2. After the async operation completes the indicator disappears
