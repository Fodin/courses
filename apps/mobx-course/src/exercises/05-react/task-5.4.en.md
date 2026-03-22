# Task 5.4: Observer granularity and re-renders

## Goal

Understand how splitting into small observer components enables granular re-renders — when one item changes, only that item re-renders, not the entire list.

## Requirements

1. Create an `ItemStore` class with `makeAutoObservable`:
   - Observable array `items` — 20 elements of type `{ id: number, name: string, count: number }`
   - Action `increment(id)` — increments the `count` of the element with the given `id` by 1
2. Create a store instance at the module level
3. Create a **separate** observer component `ListItem`:
   - Receives `item` via props
   - Tracks the number of re-renders via `useRef`
   - Displays the item name, its `count`, a `+1` button, and the render counter
4. In the main observer component:
   - Display all items via `ListItem`
   - Add an explanation that clicking +1 only re-renders one item

```typescript
class ItemStore {
  items = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`,
    count: 0,
  }))

  increment(id: number): void
}
```

## Checklist

- [ ] `ItemStore` created with `makeAutoObservable` containing 20 items
- [ ] `ListItem` — separate observer component
- [ ] Render counter implemented via `useRef`
- [ ] Clicking +1 increments `count` only for the target item
- [ ] Render counter only increases for the item that was clicked

## How to verify

1. On load, all items show `renders: 1`
2. Click +1 on Item 5 — its count becomes 1, renders becomes 2
3. Check other items — their renders are still 1
4. Click +1 on Item 10 — only Item 10 updates, others are unaffected
5. This proves observer granularity: MobX only re-renders components that read changed data
