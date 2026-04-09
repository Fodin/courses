# Task 5.1 — Pagination Visualizer

## Goal

Visually demonstrate the difference between offset and cursor pagination, including the consistency problem when inserting/deleting items.

## Requirements

1. The component displays an array of 30 items with paginated viewing (5 items per page).
2. Two modes are implemented: offset (page/limit) and cursor (after/first) with switching.
3. The current request URL is displayed as a string and updates when the page changes.
4. There is an "Insert Item" button — simulating adding a new item to the beginning of the list.
5. In offset mode, when navigating to the next page after insertion, a duplicated item is shown (highlighted in red).
6. In cursor mode, insertion does not affect pagination — items are not duplicated, with an explanatory note.
7. "Back" / "Next" buttons are disabled on the first / last page respectively.

## Checklist

- [ ] Toggle between offset and cursor modes
- [ ] Line with the current request URL (page/limit or after/first)
- [ ] Display of 5 items per page
- [ ] "Back" and "Next" buttons with edge disabling
- [ ] Button to insert a new item
- [ ] In offset mode: red highlight of duplicate after insertion and navigating to page 2
- [ ] In cursor mode: explanation that insertion does not affect the cursor

## How to Check Yourself

1. Open the component in offset mode.
2. Insert a new item using the "Insert Item" button.
3. Navigate to page 2 — a red duplicate should appear.
4. Switch to cursor mode.
5. Press "Insert Item" again — no duplicates should appear when paging.
