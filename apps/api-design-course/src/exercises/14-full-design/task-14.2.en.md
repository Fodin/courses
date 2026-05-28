# Task 14.2: API Review — Find 15 Problems

## Goal

Conduct a full API Review of a poorly designed Shop API. Find all 15 problems across 9 categories, understand why each one is a problem, and study the correct solution.

## Requirements

1. Read the "bad" API specification carefully
2. Find as many problems as possible on your own before looking at hints
3. For each problem found — mark it as found (checkbox)
4. Study the fix for each problem ("Show fix" button)
5. Understand why each "fix" is better than the original

## Problem Categories

Find one or more problems in each category:

- [ ] **URL Design** — at least 3 problems (verbs, casing, duplication)
- [ ] **HTTP Methods** — at least 2 problems (POST for deletion, GET modifies data)
- [ ] **Status Codes** — 200 OK on errors
- [ ] **Data Model** — inconsistent naming, wrong types, wrong date format
- [ ] **Pagination** — no pagination on list endpoint
- [ ] **Search/Filter** — POST for search
- [ ] **Versioning** — no versioning
- [ ] **Errors** — no machine-readable error code
- [ ] **Rate Limiting** — no documentation

## How to Check Yourself

1. First read the specification, mark the problems you noticed
2. Compare the number of found problems with the total (15)
3. Click "Show fix" for problems you didn't find — study them
4. Ask yourself: "How would I spot this problem in a real review?"
5. Final goal: 15/15 found + 15/15 studied

## Tips

- Verbs in URLs — the most common problem on real projects. Look for words like get, create, update, delete, search, list
- 200 OK on errors — especially tricky: the API "works," but it's hard for clients to handle errors
- Pay attention to field casing in JSON responses — is there a consistent standard?
- Check: can all necessary operations be done through proper HTTP methods?
