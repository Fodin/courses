# Task 8.3: Final Refactoring

## Objective

Create a component that demonstrates the use of ALL core React 19 APIs together.

## Requirements

1. Use `use(Context)` for the theme
2. Use `use(Promise)` with Suspense for data loading
3. Use `useOptimistic` for instant updates
4. Use `useActionState` for an add form
5. Use `<title>` for metadata
6. ref as a regular prop (no forwardRef)

## Checklist

- [ ] `use(Context)` reads the theme
- [ ] `use(Promise)` loads data
- [ ] `<Suspense>` shows loading state
- [ ] `useOptimistic` instantly updates the UI
- [ ] `useActionState` handles the form
- [ ] `<title>` is rendered in the component
- [ ] All APIs work together

## How to verify

1. Data loads through Suspense
2. Theme switching works
3. Toggling an item instantly (optimistically) updates the UI
4. The add form works with a pending state
