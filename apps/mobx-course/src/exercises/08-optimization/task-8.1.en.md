# Task 8.1: Granular Observer

## Goal

Learn to optimize rendering of large lists by extracting each item into a separate observer component.

## Requirements

Create a `BigListStore` and a list component with granular observer:

1. `BigListStore` contains an array of 100 items `{ id, name, value }`
2. Method `incrementValue(id)` increments the `value` of a specific item by 1
3. Computed `total` — sum of all `value`s
4. Component `BigListItem` — a separate `observer` displaying one item
5. Each `BigListItem` tracks its re-render count via `useRef`
6. When clicking the `+1` button, **only** the clicked item should re-render

```typescript
interface Item {
  id: number
  name: string
  value: number
}

class BigListStore {
  items: Item[] // 100 items
  incrementValue(id: number): void
  get total(): number
}
```

## Checklist

- [ ] `BigListStore` created with `makeAutoObservable` and 100 items
- [ ] `incrementValue` correctly increments the item's value by id
- [ ] Computed `total` calculates the sum of all values
- [ ] `BigListItem` is wrapped in `observer`
- [ ] Render counter is displayed for each item
- [ ] Clicking `+1` only re-renders one item (counter only grows for that item)

## How to verify

1. Open the list and click `+1` on any item
2. Verify that the render counter increased **only** for the clicked item
3. Check that `total` updates correctly
4. Compare behavior with a version where `BigListItem` is not wrapped in `observer` — the whole list would re-render
