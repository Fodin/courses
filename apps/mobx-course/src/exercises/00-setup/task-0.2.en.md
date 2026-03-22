# Task 0.2: Store + React

## Goal

Connect `CounterStore` to a React component using `observer` from `mobx-react-lite`.

## Requirements

1. Import `observer` from `'mobx-react-lite'`

2. Create a `CounterStore` class with `makeAutoObservable` (same as task 0.1)

3. Create a store instance **outside the component** (at module level)

4. Wrap the component in `observer`:
   ```tsx
   export const Task0_2 = observer(function Task0_2() {
     // ...
   })
   ```

5. Display the current `count` value and "+1" / "-1" buttons

## Checklist

- [ ] `observer` is imported from `'mobx-react-lite'`
- [ ] Component is wrapped in `observer`
- [ ] Store is created outside the component
- [ ] "+1" button calls `increment()`
- [ ] "-1" button calls `decrement()`
- [ ] `count` value updates on screen when buttons are clicked

## How to verify

1. Click "+1" three times — counter should show `3`
2. Click "-1" once — counter should show `2`
3. Verify the number on screen updates instantly
