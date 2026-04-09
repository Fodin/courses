# Task 2.2: Generic DataList with renderItem and renderEmpty

## Goal

Implement a universal `DataList<T>` component that accepts an array of data and render functions for items and empty state. Demonstrate it with three different data types.

---

## Requirements

1. The `DataList<T>` component is parameterized with a generic — TypeScript should infer the `item` type in `renderItem` automatically from the `data` array type
2. Props:
   - `data: T[]` — array of data
   - `renderItem: (item: T, index: number) => ReactNode` — render of a single element
   - `renderEmpty?: () => ReactNode` — render for empty list (optional)
3. If `data` is empty and `renderEmpty` is passed — call `renderEmpty()`
4. If `data` is empty and `renderEmpty` is not passed — show default message "List is empty"
5. Implement three independent uses of `DataList`:
   - **User list** `{ id, name, role }` — card with name and role
   - **Product list** `{ id, title, price }` — row with name and price
   - **Notification list** `{ id, message, read }` — notification with read/unread status
6. For each of the three lists add a "Clear" button — when clicked, `data` becomes empty to demonstrate `renderEmpty`

---

## Hints

- Generic declaration: `function DataList<T>({ data, renderItem, renderEmpty }: DataListProps<T>)`
- TypeScript in TSX files requires `<T,>` or `<T extends object>` to distinguish from JSX tag
- For `key` in the list — if `T` has no `id`, use `index` as fallback
- The props interface can be extracted separately: `interface DataListProps<T> { ... }`

---

## Checklist

- [ ] `DataList<T>` is declared as a generic function
- [ ] TypeScript correctly infers `item` type in `renderItem` without explicit specification
- [ ] Empty state works: with `data=[]` shows `renderEmpty()` or default
- [ ] User list renders with name and role
- [ ] Product list renders with name and price
- [ ] Notification list shows read status
- [ ] "Clear" button switches the list to empty state

---

## How to check yourself

Click the "Clear" button for each of the three lists — a no-data message should appear. The other two lists should not be affected (independent state).
