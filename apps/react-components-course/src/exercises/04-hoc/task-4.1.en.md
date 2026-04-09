# Task 4.1: withLoading — HOC for loading state

## Goal

Implement an HOC `withLoading<P>` that wraps an arbitrary component and shows a spinner while data is loading. Practice proper typing with generics.

## Requirements

1. Create an HOC `withLoading<P extends object>(Component)` that accepts a component with props type `P`
2. The returned component should accept `P & { isLoading: boolean }` — all original props plus a loading flag
3. If `isLoading === true` — render a spinner (any visual loading indication)
4. If `isLoading === false` — render the original component with its props
5. The `isLoading` prop must not be passed to the original component (destructure it separately)
6. Set `displayName` in format `withLoading(ComponentName)`
7. Demonstrate: create two components `UserCard` and `ProductList`, wrap them with `withLoading`, add a button to toggle loading state

## Hints

- `P & { isLoading: boolean }` — type intersection: all fields of P plus new fields
- When destructuring `const { isLoading, ...rest } = props` — TypeScript needs help: `rest as P`
- `Component.displayName ?? Component.name ?? 'Component'` — safe name retrieval
- HOC must be called outside the renderer component, otherwise React creates a new type every time
- `React.ComponentType<P>` accepts both functional and class components

## Checklist

- [ ] HOC is correctly typed with `<P extends object>`
- [ ] With `isLoading=true` a spinner/loading indicator is visible
- [ ] With `isLoading=false` the original component renders with correct props
- [ ] `isLoading` doesn't reach the original component
- [ ] `displayName` is set correctly
- [ ] HOC is created outside render function
- [ ] Demo works with toggle button

## How to check yourself

Open React DevTools. In the component tree you should see:
```
withLoading(UserCard)
  UserCard
withLoading(ProductList)
  ProductList
```

Try passing a wrong prop type to the original component — TypeScript should give an error.
