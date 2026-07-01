# Task 14.1: API Builder — Library

## Goal

Go through all 7 steps of a step-by-step REST API design wizard for a "Library" system. At each step — work through a checklist and compare your solution to the reference.

## Requirements

1. Step 1 — identify all 6 system resources (books, authors, readers, reservations, nested resources)
2. Step 2 — design the URL structure: correct naming, hierarchy, query parameters
3. Step 3 — create an HTTP method matrix for each resource (GET/POST/PUT/PATCH/DELETE)
4. Step 4 — define status codes for all operations, including error scenarios
5. Step 5 — design data models with correct formats (camelCase, ISO 8601, money)
6. Step 6 — add pagination, filtering, and sorting for list endpoints
7. Step 7 — go through a final 10-point checklist and summarize

## Checklist

- [ ] Step 1: 4 root resources and 2 nested resources identified
- [ ] Step 2: URLs use lowercase, plural, no verbs
- [ ] Step 3: GET doesn't modify data, DELETE is idempotent
- [ ] Step 4: no successful response returns 4xx/5xx
- [ ] Step 5: all dates in ISO 8601, IDs are strings, prices with currency
- [ ] Step 6: pagination via page/limit with meta in response
- [ ] Step 7: final checklist passed, all 10 items checked

## How to Check Yourself

1. Click "Show" at each step — compare your solution to the reference
2. If your answer differs — figure out why the reference is as it is
3. At step 3, verify: no GET request should create or delete data
4. At step 4, find at least one operation with code 409 — why 409 and not 400?
5. At step 7, make sure you can justify every item in the final checklist

## Tips

- Choose a nested resource (books/{id}/copies) when the copy makes no sense without the book
- 409 Conflict — for business state conflicts (book already reserved, no copies available)
- Pagination is needed even for "small" collections — the library can grow
