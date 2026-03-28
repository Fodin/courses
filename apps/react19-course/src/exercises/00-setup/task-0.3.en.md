# Task 0.3: Breaking Changes

## Objective

Create an interactive component with a table of all breaking changes in React 19 — what was removed and what replaced it.

## Requirements

1. Create an array of breaking changes with the following fields:
   - `removed` — what was removed
   - `replacement` — what replaced it
   - `category` — category (Components, ReactDOM, Types, Testing, etc.)
2. Display the data as a table
3. Add category filtering (filter buttons)
4. Show the total count of breaking changes

## Breaking Changes to Include

### Components
- `defaultProps` for function components → default parameters
- `propTypes` → TypeScript
- String refs → `useRef` / callback refs
- Legacy Context → `createContext`

### ReactDOM
- `ReactDOM.render` → `createRoot().render()`
- `ReactDOM.hydrate` → `hydrateRoot()`
- `ReactDOM.unmountComponentAtNode` → `root.unmount()`
- `ReactDOM.findDOMNode` → `useRef`

### Types
- Implicit `children` in FC → explicit `children: ReactNode`
- `useRef()` without argument → `useRef(null)`

### Testing
- `react-test-renderer` → `@testing-library/react`

## Hints

- Use `useState` to store the current filter
- `new Set(arr.map(...))` helps extract unique categories
- Use `<table>` to display the data

## Checklist

- [ ] Table with columns: Removed, Replacement, Category
- [ ] Filtering by category
- [ ] "All" button to reset the filter
- [ ] Counter for the total number of changes
