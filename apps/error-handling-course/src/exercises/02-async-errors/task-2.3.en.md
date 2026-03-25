# Task 2.3: Promise.allSettled

## Goal
Study Promise combinators and their behavior on errors.

## Requirements
1. Create a function `fetchUser(id)` that returns reject for `id=3`
2. Show `Promise.all` — how it fails on the first error
3. Show `Promise.allSettled` — how it returns all results
4. Show `Promise.race` with a timeout
5. Show `Promise.any` and `AggregateError`

## Checklist
- [ ] `fetchUser` implemented with conditional reject
- [ ] `Promise.all` fails on error
- [ ] `Promise.allSettled` shows fulfilled/rejected statuses
- [ ] `Promise.race` with timeout
- [ ] `Promise.any` and `AggregateError` handled
