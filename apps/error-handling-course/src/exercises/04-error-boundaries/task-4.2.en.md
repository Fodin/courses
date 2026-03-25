# Task 4.2: Fallback UI

## Goal
Learn how to create an informative and beautiful fallback UI for Error Boundary.

## Requirements
1. Create `ErrorFallback` component with:
   - Error heading
   - Problem description
   - `<details>` section with full error stack
2. Add a `fallback` prop to Error Boundary — a function accepting `{ error }`
3. If `fallback` is passed — use it, otherwise — use standard `ErrorFallback`
4. Demonstrate two variants: standard and custom fallback

## Checklist
- [ ] `ErrorFallback` with nice UI
- [ ] `<details>` section with stack
- [ ] `fallback` prop accepts a function
- [ ] Two fallback variants shown
