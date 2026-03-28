# Task 6.3: Loading/Error/Success

## Goal
Implement a state pattern for fetching with discriminated union.

## Requirements
1. Define `FetchState<T>` type with 4 variants: idle, loading, success, error
2. Create `useFetch<T>(fetchFn)` hook returning `{ state, execute }`
3. Create a fetch function with 30% chance of error
4. Display all 4 states visually:
   - idle: hint
   - loading: indicator
   - error: message + "Retry" button
   - success: data

## Checklist
- [ ] `FetchState<T>` defined
- [ ] `useFetch` hook implemented
- [ ] All 4 states visually displayed
- [ ] "Retry" button on error
