# Task 1.2: ref as a Prop

## Objective

Create a `FancyInput` component that accepts `ref` as a regular prop (without `forwardRef`).

## Requirements

1. Create a function component `FancyInput`
2. The component should accept `ref` as a regular prop:
   ```tsx
   function FancyInput({ ref, ...props }: { ref?: Ref<HTMLInputElement> }) {
     return <input ref={ref} {...props} />
   }
   ```
3. **Do NOT use** `forwardRef`
4. In the parent component:
   - Create `useRef<HTMLInputElement>(null)`
   - Pass the ref to `FancyInput`
   - Add a "Focus" button that calls `inputRef.current?.focus()`

## Hints

- Ref type: `Ref<HTMLInputElement>` from `react`
- Destructure ref from props: `{ ref, ...props }`
- Pass the ref to the inner `<input>`

## Checklist

- [ ] `FancyInput` does not use `forwardRef`
- [ ] `ref` is accepted as a regular prop
- [ ] The "Focus" button works
- [ ] TypeScript shows no errors
