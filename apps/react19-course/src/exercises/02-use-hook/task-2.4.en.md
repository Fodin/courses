# Task 2.4: Suspense + use + ErrorBoundary

## Objective

Implement the full data-loading pattern: Suspense for the loading state, ErrorBoundary for errors, and use() for reading data.

## Requirements

1. Create an `ErrorBoundary` component (class component with `getDerivedStateFromError`)
2. Create a function that returns a promise that can either resolve or reject
3. Create a component that reads data via `use(promise)`
4. Wrap everything in `ErrorBoundary > Suspense > Component`
5. Add two buttons: "Load (success)" and "Load (error)"
6. On error, the ErrorBoundary displays a message and a "Try again" button

## Checklist

- [ ] ErrorBoundary correctly catches errors from rejected promises
- [ ] Suspense shows a fallback during loading
- [ ] `use(promise)` reads data in the child component
- [ ] The "success" button loads data
- [ ] The "error" button triggers the ErrorBoundary
- [ ] "Try again" resets the error state

## How to Verify

1. Click "Load (success)" — loading indicator appears, then data
2. Click "Load (error)" — loading indicator appears, then an error message
3. Click "Try again" — the error is dismissed
