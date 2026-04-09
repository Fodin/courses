# Task 8.3: FilterPanel — useCallback + React.memo for multiple controls

## Goal

Learn to apply `useCallback` together with `React.memo` for optimizing panels with multiple independent controls, each receiving its own `onChange` handler.

## Context

You have a `FilterPanel` with five independent filters: category, price range, rating, discount availability, sorting. Each filter is a separate component (`CategoryFilter`, `PriceFilter`, `RatingFilter`, `DiscountFilter`, `SortFilter`), each receiving its own `onChange`.

Currently, changing any single filter causes **all five** to re-render — because the parent creates new `onChange` functions on every render.

## Requirements

1. Add render counters to each of the five filter components
2. Verify the problem is real: change any filter and look at the counters
3. Wrap each filter component in `React.memo`
4. Stabilize each `onChange` handler via `useCallback` in the `FilterPanel` parent
5. Verify that changing one filter re-renders only that one
6. Display current values of all filters at the bottom of the panel (to verify filtering works)

## Hints

- `useCallback` for each handler: `const handleCategoryChange = useCallback((value: string) => { setFilters(prev => ({ ...prev, category: value })) }, [])`
- Setter from `useState` is stable — no need to add it to `useCallback` dependencies
- Use functional setState form: `setFilters(prev => ({ ...prev, field: value }))` — important when dependencies are empty
- `React.memo` is needed on ALL five filters — otherwise stabilizing `onChange` is pointless
- Order: first add memo, then useCallback — and watch how counters stop growing

## Checklist

```
[ ] Render counters added to all 5 filter components and visible in UI
[ ] All 5 filter components wrapped in React.memo
[ ] All 5 onChange handlers stabilized via useCallback
[ ] useCallback uses functional setState (prev => ...) — not direct state read
[ ] On Category change, only CategoryFilter re-renders
[ ] On Price change, only PriceFilter re-renders
[ ] Same for Rating, Discount, Sort
[ ] All filter values displayed and update correctly
```

## How to check yourself

Open the component. Change category — counter grows only for `CategoryFilter`. Change rating — only for `RatingFilter`. All other counters stay put. Meanwhile filter values below the panel update correctly.
