# Task 4.1: Basic useOptimistic

## Objective

Use `useOptimistic` to instantly reflect a change in the UI before the server request completes.

## Requirements

1. Create a `liked` state (boolean) via `useState`
2. Use `useOptimistic(liked, (_, newValue) => newValue)` for the optimistic value
3. Create an async function `toggleLike` that instantly updates the UI and then calls the "server"
4. The like button should toggle instantly

## Checklist

- [ ] `useOptimistic` is imported from `'react'`
- [ ] The optimistic value is displayed instantly
- [ ] The server request is simulated via `setTimeout`
- [ ] After the server responds, the state is synchronized

## How to Verify

1. Click the like button — it toggles instantly
2. After 1–2 seconds, the change is "confirmed" by the server
