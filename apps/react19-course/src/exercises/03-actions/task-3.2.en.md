# Task 3.2: useActionState

## Objective

Manage form state using `useActionState` — the new React 19 hook that combines an action and its state.

## Requirements

1. Import `useActionState` from `'react'`
2. Create an action function `(prevState, formData) => newState`
3. Use `useActionState(action, initialState)`
4. Display validation errors and success status
5. Add a simulated server delay

## Checklist

- [ ] `useActionState` returns `[state, formAction, isPending]`
- [ ] The action function processes FormData and returns new state
- [ ] Validation errors are displayed
- [ ] `isPending` is used to show a loading indicator
- [ ] Successful submission displays the result

## How to Verify

1. Submit the empty form — validation errors appear
2. Fill in all fields and submit — a loading indicator appears, then the result
