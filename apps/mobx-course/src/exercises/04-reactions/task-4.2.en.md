# Task 4.2: reaction — Search Query Store

## Goal

Create a search store and set up a `reaction` that triggers a search only when the query changes, but not on initialization.

## Requirements

1. Create a `SearchStore` class with observable fields:
   - `query: string` (default `''`)
   - `results: string[]` (default `[]`)
   - A private `allItems` array with items to search through
2. Add a `setQuery(value)` method — sets the search query
3. Add a `search()` method — filters `allItems` by `query` and writes the result to `results`
4. In the component, create a `reaction` inside `useEffect`:
   - Data function: `() => searchStore.query`
   - Effect function: receives `query` and `previousQuery`, calls `searchStore.search()` and writes a log entry
5. Return the disposer in the `useEffect` cleanup function
6. Connect an `<input>` for query input and display the results list

## Checklist

- [ ] `SearchStore` created with `makeAutoObservable`
- [ ] Uses `reaction`, not `autorun`
- [ ] On component mount, the effect **does not** fire (log is empty)
- [ ] When typing in the input field, `search()` runs and results are displayed
- [ ] The log shows the previous and current query values
- [ ] Disposer is called in the `useEffect` cleanup

## How to verify

1. On page load, the log should be empty — `reaction` does not fire on initialization
2. Type text in the search field — a log entry like `Query changed: "" → "a"` should appear
3. Continue typing — each query change adds an entry with the previous and current value
4. Search results update with each query change
