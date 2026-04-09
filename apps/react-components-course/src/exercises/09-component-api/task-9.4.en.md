# Task 9.4: Autocomplete with forwardRef and generics

## Goal

Implement a generic `Autocomplete<T>` component with `forwardRef` support. The component works with any data type and allows the parent to control focus via ref. The task includes solving the generics + forwardRef compatibility problem in React 18.

## Requirements

1. Component accepts generic parameter `T`
2. Component props:
   - `options: T[]` — array of options
   - `value: string` — text in the input field
   - `onChange: (value: string) => void` — callback on text change
   - `onSelect: (item: T) => void` — callback on option selection
   - `getOptionLabel: (item: T) => string` — function to get display text
   - `placeholder?: string`
3. Ref points to the `HTMLInputElement` inside the component
4. Solve the generics + forwardRef problem via type assertion or declare function workaround
5. Add `displayName` for debugging
6. Demonstration: component with an array of cities, with a "Focus via ref" button

## Hints

- `forwardRef` in React 18 doesn't support generics directly — a workaround is needed
- The cleanest way: implement the component as a regular forwardRef, then cast the type: `const Autocomplete = AutocompleteInner as <T>(props: AutocompleteProps<T> & { ref?: React.Ref<HTMLInputElement> }) => React.ReactElement`
- Or use `declare function` to declare the type separately from the implementation
- For showing the dropdown: use `useState` for `isOpen` and filter `options` by `value`
- `getOptionLabel` is used both for displaying items in the list and for filling the field on selection

## Checklist

- [ ] Component implemented with `forwardRef`
- [ ] Generic parameter `T` is preserved after workaround
- [ ] `ref` points to `HTMLInputElement`
- [ ] `onSelect` typed as `(item: T) => void`
- [ ] `getOptionLabel` typed as `(item: T) => string`
- [ ] `displayName` set for React DevTools
- [ ] Demo: "Focus" button calls `ref.current?.focus()`
- [ ] Dropdown list is filtered by entered text
- [ ] On option selection: field fills with text, list closes
- [ ] No `any` in types

## How to check yourself

Open the assignment in the browser. You should see:
- Input field with placeholder
- On typing — dropdown list of filtered options
- On clicking an option — field fills, list closes
- "Focus" button moves focus to the input

Check in React DevTools: component should be named `Autocomplete`, not `ForwardRef` or `Anonymous`.
