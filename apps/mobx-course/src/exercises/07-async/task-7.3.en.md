# Task 7.3: Cancelling flow

## Goal

Learn to cancel a running flow via `promise.cancel()` and set up cleanup on component unmount.

## Requirements

Create a `SlowDataStore` store with slow loading (3 seconds) and cancellation support:

1. Declare observable fields: `data: string | null`, `isLoading: boolean`
2. Implement `fetchData` via `flow`:
   - Add an artificial 3-second delay (`yield new Promise(...)`)
   - After the delay, write a string with the current time to `this.data`
   - In `finally`, reset `isLoading = false` (important for correct cancellation)
3. In the observer component:
   - Start `fetchData` in `useEffect` on mount
   - Return `promise.cancel()` from the `useEffect` cleanup function
   - Add a "Cancel" button for manual cancellation
   - Add a "Reload" button to reload data

```typescript
// flow returns a CancellablePromise
const promise = store.fetchData()
promise.cancel() // Cancels the generator execution
```

## Checklist

- [ ] `SlowDataStore` with `fetchData` via `flow`
- [ ] 3-second delay before loading data
- [ ] `finally` block resets `isLoading`
- [ ] `useEffect` starts `fetchData` and cancels in cleanup
- [ ] "Cancel" button for manual cancellation
- [ ] "Reload" button to reload data

## How to verify

1. On component mount, a 3-second loading begins
2. Click "Cancel" before it finishes — loading is interrupted, `isLoading` becomes `false`
3. Click "Reload" — loading starts again
4. Wait 3 seconds — a string with the time appears
5. Quickly switch to another task and back — on unmount the old request is cancelled
