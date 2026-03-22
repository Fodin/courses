# Task 4.3: when — Loading Store

## Goal

Create a loading store and implement two `when` usage patterns: the callback form and the promise form (`await when`).

## Requirements

1. Create a `LoadingStore` class with observable fields:
   - `isLoaded: boolean` (default `false`)
   - `data: string | null` (default `null`)
2. Add a `startLoading()` method — resets state and after a `setTimeout` (2 seconds) sets `data` and `isLoaded = true`
3. Add a `reset()` method — resets `isLoaded` and `data`
4. In the component, implement **two patterns**:
   - **when callback**: inside `useEffect`, create a `when` that waits for `isLoaded === true` and writes to the log
   - **await when**: create an async function that calls `startLoading()`, then `await when(() => isLoaded)`, and after resolution writes the result
5. Return the disposer from `when` in the `useEffect` cleanup function
6. Add three buttons: Start Loading (callback), Start Loading (await), Reset

## Checklist

- [ ] `LoadingStore` created with `makeAutoObservable`
- [ ] when callback fires once when `isLoaded` becomes `true`
- [ ] await when resolves the promise when `isLoaded` becomes `true`
- [ ] After the when-callback fires, pressing Start Loading again **does not** trigger another callback (when is one-time)
- [ ] Disposer from when is called in the `useEffect` cleanup
- [ ] Reset button resets the state

## How to verify

1. Click "Start Loading (when callback)" — after 2 seconds a log entry from when should appear
2. Click Reset, then "Start Loading (when callback)" again — **no new entry** appears (when already fired and disposed)
3. Click "Start Loading (await when)" — after 2 seconds the result from await when appears along with a log entry
4. Await when can be used multiple times because each call creates a new promise
