# Task 6.4: State Narrowing

## Goal

Implement pattern matching on state machine states using type guards, Extract, and exhaustive handling for modeling a document workflow.

## Requirements

1. Create a `DocumentState` type as a discriminated union with 5 states: `draft`, `review`, `approved`, `published`, `archived` -- each with unique data
2. Implement a type guard `isInState(state, status)` that narrows the type to a specific variant via `Extract`
3. Implement `getStateData(state, status)` -- safe extraction of specific state data or null
4. Implement `matchDocumentState` -- exhaustive match requiring a handler for each state
5. Create transition functions that accept only specific states: `submitForReview(draft)`, `approve(review)`, `publish(approved)`
6. The `archive(state)` function should accept a document in any state except `archived`

## Checklist

- [ ] `DocumentState` is a discriminated union on `status` field with 5 variants
- [ ] `isInState(doc, 'published')` narrows the type: after check, `url` and `publishedAt` are accessible
- [ ] `getStateData(doc, 'review')` returns typed data or null
- [ ] `matchDocumentState` requires a handler for each of the 5 states
- [ ] `submitForReview` accepts only draft, `approve` accepts only review
- [ ] `archive` accepts any state except already archived

## How to Verify

1. Pass a draft document to `approve()` -- should get a TS error (expects review)
2. In `matchDocumentState`, remove a handler -- should get a TS error
3. After `isInState(doc, 'review')`, check access to `doc.reviewer` -- should work
