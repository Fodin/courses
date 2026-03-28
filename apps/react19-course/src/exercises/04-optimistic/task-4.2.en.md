# Task 4.2: Optimistic List

## Objective

Optimistically add items to a list before they are confirmed by the server.

## Requirements

1. Store a list of items in `useState`
2. Use `useOptimistic` with a reducer function to add items
3. Optimistic items should be visually distinct (e.g., semi-transparent)
4. After server confirmation, the item becomes a regular entry

## Checklist

- [ ] `useOptimistic` with a custom reducer
- [ ] The new item appears instantly with a "sending..." label
- [ ] After the server responds, the label disappears
- [ ] The list updates correctly

## How to Verify

1. Enter some text and click "Add"
2. The item appears instantly (semi-transparent)
3. After 1–2 seconds it becomes a regular item
