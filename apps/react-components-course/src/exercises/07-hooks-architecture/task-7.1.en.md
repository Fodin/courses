# Task 7.1: useAsync → useApi → UserSearch

## Goal

Implement a chain of data loading hooks: base `useAsync<T>` → specialized `useApi<T>` with request cancellation → `UserSearch` component that uses the hook and focuses only on rendering.

## Requirements

1. Implement `AsyncState<T>` type with fields `loading: boolean`, `data: T | null`, `error: string | null`
2. Implement `useAsync<T>(fn: () => Promise<T>, deps: DependencyList)` hook:
   - When `deps` change, runs `fn()` and updates state
   - Updates `loading`, `data`, `error` atomically (all three fields at once)
   - Uses `cancelled` flag to protect against race condition on rapid switches
   - Returns `AsyncState<T>`
3. Implement `useApi<T>(url: string)` hook:
   - Built on top of `useAsync` or implements its own logic with `AbortController`
   - When `url` changes, cancels previous request via `controller.abort()`
   - Ignores `AbortError` (not an error, but a normal cancellation)
   - Returns `AsyncState<T>` + `refetch` function
4. Implement `UserSearch` component:
   - Input field for search query
   - Uses `useApi` to load user list
   - Shows loading state (indicator or text)
   - Shows error message on failure
   - Renders user list with name and email

## Hints

- For demo, use `https://jsonplaceholder.typicode.com/users` — returns 10 users
- `AbortController` is created via `new AbortController()`, signal is passed to `fetch(url, { signal: controller.signal })`
- `err.name === 'AbortError'` distinguishes cancellation from real error
- In `useEffect` return a cleanup function: `return () => { controller.abort() }`
- If `url` is empty string — don't make a request (check before calling `fetch`)
- `cancelled` flag inside useEffect: `let cancelled = false` → in `.then()` check `if (!cancelled)` → in cleanup: `cancelled = true`

## Checklist

- [ ] `AsyncState<T>` typed with three fields
- [ ] `useAsync` runs `fn` on mount and when `deps` change
- [ ] `useAsync` protected from race condition via `cancelled` flag
- [ ] `useApi` cancels previous request on new call
- [ ] `AbortError` is not displayed as error to user
- [ ] `UserSearch` uses hook and contains no fetch logic
- [ ] Loading state and errors are shown
- [ ] User list renders after successful loading

## How to check yourself

Open the demo — a list of 10 users should load. Enter text in the search field and quickly delete it — neither loading nor error should "blink" (AbortController cancels unfinished requests). Disable network in DevTools and click the refresh button — an error message should appear.
