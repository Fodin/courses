# Task 7.1: window.onerror

## Goal
Set up global error handlers to catch unhandled errors and promises.

## Requirements
1. Subscribe to `window.addEventListener('error', ...)` in `useEffect`
2. Subscribe to `unhandledrejection` for unhandled promises
3. Create a button that throws an error in `setTimeout`
4. Create a button that creates `Promise.reject` without catch
5. Display caught events on the page
6. Don't forget to unsubscribe in cleanup

## Checklist
- [ ] `error` event handler
- [ ] `unhandledrejection` handler
- [ ] Global error is caught
- [ ] Unhandled promise is caught
- [ ] Cleanup in useEffect
