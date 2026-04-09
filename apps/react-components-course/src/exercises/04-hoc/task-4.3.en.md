# Task 4.3: HOC Composition via compose

## Goal

Implement a generic `compose` utility for clean composition of multiple HOCs. Apply `withLoading + withAuth + withErrorBoundary` to one component and verify correct wrapping order.

## Requirements

1. Implement class component `ErrorBoundaryClass` with methods:
   - `getDerivedStateFromError` — switches to error mode
   - `componentDidCatch` — logs the error
   - Renders `fallback` or default UI with error text
2. Implement HOC `withErrorBoundary<P>(Component, fallback?)`:
   - Wraps component in `ErrorBoundaryClass`
   - Sets `displayName`
3. Implement `compose` function:
   ```ts
   function compose<P>(...hocs: Array<(c: React.ComponentType<any>) => React.ComponentType<any>>)
     : (Component: React.ComponentType<P>) => React.ComponentType<any>
   ```
   HOCs are applied **right to left** (as in math: `f(g(h(x)))`): leftmost HOC is the outermost layer.
4. Apply via `compose`:
   ```ts
   const EnhancedReport = compose(
     withErrorBoundary,
     withAuth,
     withLoading
   )(ReportComponent)
   ```
5. Add a "Break component" button — the inner component should throw an error, `withErrorBoundary` will catch it
6. Demonstrate all states: not authorized → authorized, loading → loaded, works → error

## Hints

- `reduceRight` is the right tool for compose: applies functions right to left
  ```ts
  hocs.reduceRight((acc, hoc) => hoc(acc), Component)
  ```
- Order: `compose(withErrorBoundary, withAuth, withLoading)(Comp)` == `withErrorBoundary(withAuth(withLoading(Comp)))`
- `withLoading` — closest to the component, its `isLoading` prop is needed from outside
- `withAuth` — middle layer, checks authorization before rendering component
- `withErrorBoundary` — outermost, catches errors from the entire tree inside

## Checklist

- [ ] `ErrorBoundaryClass` correctly catches errors
- [ ] `withErrorBoundary` HOC works
- [ ] `compose` applies HOC in correct order (right to left)
- [ ] Composed component accepts all needed props
- [ ] All three states are demonstrated: loading, content, error
- [ ] Authorization check works in the chain

## How to check yourself

Open React DevTools. The tree should look like this:
```
withErrorBoundary(withAuth(withLoading(ReportComponent)))
  withAuth(withLoading(ReportComponent))
    withLoading(ReportComponent)
      ReportComponent
```

Click "Break" — `ErrorBoundary` should show error UI without crashing the whole page.
