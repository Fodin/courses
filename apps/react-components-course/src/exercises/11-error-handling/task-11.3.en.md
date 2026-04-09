# Task 11.3: useErrorHandler for async errors

## Goal

Implement a `useErrorHandler` hook that allows propagating async errors (from fetch, setTimeout, event handlers) to the nearest Error Boundary.

## Requirements

1. Implement `useErrorHandler()` hook:
   - Uses `useState<null>(null)` internally
   - Returns a function `(error: Error) => void`
   - On call does `setState(() => { throw error })` — this propagates the error to the render phase
2. Create `AsyncDataWidget` component — simulates data loading:
   - State: `loading`, `data`, call `useErrorHandler`
   - "Load data" button starts `setTimeout(1500ms)` then either returns data or calls `handleError(new Error(...))`
   - Toggle (checkbox or select) "Mode: success / error" determines what happens
3. Create `EventErrorWidget` component — simulates error in event handler:
   - "Perform action" button in `onClick` calls `handleError(new Error(...))`
   - Demonstrates: without `useErrorHandler` the error in onClick wouldn't be caught by boundary
4. Wrap both widgets in separate `ErrorBoundary` with "Restore" button
5. Add an explanation section: why `setState(() => { throw error })` works (text block in UI)

## Hints

- Key pattern: `const [, setState] = useState<null>(null)` — we only care about `setState`, not the value
- `setState(() => { throw error })` — updater function is called by React during reconciliation, error hits the render phase
- `useCallback` for stable reference of returned function
- For async simulation: `await new Promise(resolve => setTimeout(resolve, 1500))`
- After `handleError` the component should not continue — add early return or isMounted check

## Checklist

- [ ] `useErrorHandler` implemented with `setState(() => { throw error })` pattern
- [ ] `AsyncDataWidget` shows loading state (spinner or text)
- [ ] "success/error" mode toggle works
- [ ] On error, `ErrorBoundary` triggers, not just console.error
- [ ] `EventErrorWidget` demonstrates error propagation from onClick
- [ ] Both widgets recover via `resetErrorBoundary`
- [ ] UI includes explanation of how the hook works

## How to check yourself

1. Select "error" mode, click "Load data" — after 1.5s boundary fallback appears
2. Click "Restore", switch to "success", click "Load data" — data is shown
3. In EventErrorWidget click "Perform action" — boundary catches the error from onClick
4. Open DevTools: console.error shows the message from componentDidCatch
5. Verify that without ErrorBoundary the test fails — the error must go through the boundary
