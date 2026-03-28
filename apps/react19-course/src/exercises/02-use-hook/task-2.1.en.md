# Task 2.1: use(Promise)

## Objective

Use the new `use()` API to read data from a promise and display a loading state via Suspense.

## Requirements

1. Create a promise **outside the component** that returns an array of users after a `setTimeout`
2. Create a child component `UserList` that calls `use(promise)` to retrieve the data
3. Display the list of users (name and role)
4. Wrap `UserList` in `<Suspense>` with a loading fallback message

## Checklist

- [ ] The promise is created outside the component
- [ ] `use()` is imported from `'react'`
- [ ] `use(promise)` is called inside the child component
- [ ] `<Suspense>` wraps the component that uses `use()`
- [ ] A fallback is shown during loading
- [ ] The list of users is displayed after loading

## How to Verify

1. On first load, a "Loading..." message is visible
2. After 1–2 seconds, the list of users appears
