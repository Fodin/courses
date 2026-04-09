# Task 0.1: Good vs Bad API

## Goal

Learn to recognize signs of poorly designed APIs and argue what exactly is violated and how to fix it.

## Requirements

1. Create a `Task0_1` component that displays at least **3 pairs** of "bad API vs good API" comparisons
2. Each pair must cover a **separate aspect**: URL design, response format, field naming (or any others of your choice)
3. Each pair contains:
   - A block with a bad example (code/HTTP request)
   - A block with a good example (code/HTTP request)
   - A list of specific problems in the bad version
4. Add a "Show breakdown" button for each pair — breakdown is hidden by default
5. Add a "Show all breakdowns" button
6. Implement using `useState`

## Checklist

- [ ] At least 3 comparison pairs
- [ ] Each aspect is separate (no topic duplication)
- [ ] "Show breakdown" button for each pair
- [ ] "Show all breakdowns" button
- [ ] State (show/hide) works independently for each pair
- [ ] Bad and good variants are visually distinct (colors, icons)
- [ ] Component wrapped in `<div className="exercise-container">`

## How to Check Yourself

1. Open the task in a browser — breakdowns should be hidden
2. Click "Show breakdown" on the first pair — only that breakdown should open
3. Click "Show all breakdowns" — all breakdowns open simultaneously
4. Read the list of problems for each bad example and make sure each problem is specific and explainable
5. Try to come up with a fourth pair on your own and add it
