# Task 8.2: Specification Refactoring

## Goal

Create an interactive tool to demonstrate OpenAPI specification refactoring: find duplication, extract repeating blocks into `components`, and clearly show line savings.

## Requirements

1. Show statistics: number of lines "before" and "after" refactoring, and the savings
2. A checklist of 4 duplicating blocks, each clickable:
   - `Order schema` — repeated in 2 endpoints
   - `Error schema` — repeated in 4 places
   - `401 Unauthorized response` — repeated in 2 endpoints
   - `500 ServerError response` — repeated in 2 endpoints
3. For each item, show how many times it is duplicated (`×N` icon)
4. When an item is checked, show the resulting `$ref`
5. "Before" / "After" toggle for viewing YAML
6. After all items are checked — a success message

## What to Implement

- [ ] `SPEC_BEFORE` and `SPEC_AFTER` constants with YAML texts
- [ ] `DUPLICATES` array describing each duplicating block
- [ ] `refactored: string[]` state — list of checked IDs
- [ ] `view: 'before' | 'after'` state for YAML switching
- [ ] `toggle(id)` function — adds/removes from the checked list
- [ ] `allDone` computation — whether all items are checked

## SPEC_BEFORE Content

A specification with two endpoints (`GET /orders` and `GET /orders/{id}`) where:
- The order schema (`id`, `total`, `status`) is described twice inline
- The error schema (`code`, `message`) is described in each of the 401, 404, 500 responses
- Responses 401 and 500 are repeated in each endpoint

## SPEC_AFTER Content

The same specification after refactoring:
- `Order` and `Error` moved to `components/schemas`
- `Unauthorized`, `NotFound`, `ServerError` moved to `components/responses`
- Paths use `$ref` references

## How to Check Yourself

- The "After" button shows the corrected specification with `$ref`
- Checking each item produces a line with the resulting `$ref`
- After checking all four items, a success message appears
- The savings counter shows the real difference in lines
