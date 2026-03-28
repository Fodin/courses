# Task 1.4: Remove forwardRef

## Objective

Rewrite an existing component that uses `forwardRef` to the new React 19 style (ref as a prop).

## Requirements

1. The task file contains a component `OldInput` wrapped in `forwardRef`
2. Create `NewInput` without `forwardRef`:
   - Remove the `forwardRef` wrapper
   - Move `ref` into the props destructuring
   - Delete `displayName`
3. Replace all usages of `OldInput` with `NewInput`
4. Verify that the ref still works (the "Focus" button)

## Migration Example

```tsx
// Before (React 18)
const OldInput = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    return <input ref={ref} {...props} />
  }
)
OldInput.displayName = 'OldInput'

// After (React 19)
function NewInput({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

## Checklist

- [ ] `NewInput` is created without `forwardRef`
- [ ] `ref` is in the props destructuring
- [ ] No `displayName`
- [ ] The "Focus" button works with `NewInput`
- [ ] `OldInput` is replaced with `NewInput` in JSX
