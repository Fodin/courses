# Task 9.3: SelectableList — generic component

## Goal

Implement a generic `SelectableList<T>` component that works with any data type. The component knows nothing about the element structure — all rendering and key management is delegated via props functions.

## Requirements

1. Component accepts generic parameter `T`
2. Component props:
   - `items: T[]` — array of elements
   - `selectedItem: T | null` — selected element
   - `onSelect: (item: T) => void` — callback on selection
   - `renderItem: (item: T, isSelected: boolean) => React.ReactNode` — element render function
   - `keyExtractor: (item: T) => string` — unique key function
3. Clicking an element calls `onSelect(item)`
4. Selected element is visually highlighted
5. Demonstration: two lists with different data types — `User[]` and `Product[]`. Each list shows the selected element below

## Hints

- For comparing "is element selected" use `keyExtractor`: `keyExtractor(item) === keyExtractor(selectedItem)`
- `renderItem` accepts `isSelected: boolean` — allows the caller to change the style
- `T` doesn't need `extends` constraint — the component works with any type
- In the demo, create two different data sets and two component instances with different types

## Checklist

- [ ] Component declared as `function SelectableList<T>(...)`
- [ ] `onSelect` typed as `(item: T) => void` — TypeScript knows the type on call
- [ ] `renderItem` accepts `(item: T, isSelected: boolean) => React.ReactNode`
- [ ] `keyExtractor` accepts `(item: T) => string`
- [ ] Selected element determined via `keyExtractor`, not via `===`
- [ ] Demo: user list with `User[]` and product list with `Product[]`
- [ ] TypeScript inferred `T` automatically without explicit `<User>` or `<Product>`
- [ ] No `any` in types

## How to check yourself

Open the assignment in the browser. You should see two independent lists. On clicking an element:
- Element is visually highlighted (e.g., blue background)
- Selected element info appears below the list
- Selection in one list doesn't affect the other

Check in TypeScript: in the `renderItem` callback, the first argument should have the correct type (`User` for the first list, `Product` — for the second).
