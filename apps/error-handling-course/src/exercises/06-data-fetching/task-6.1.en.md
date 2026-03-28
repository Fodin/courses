# Task 6.1: Fetch Errors

## Goal
Understand the specifics of error handling in the fetch API.

## Requirements
1. Show that fetch does NOT throw an error on HTTP 404 — check `response.ok`
2. Show a network error (request to a non-existent domain) — this is `TypeError`
3. Show JSON parsing error — `SyntaxError`
4. Implement the correct pattern: check `response.ok` + throw
5. Display all results

## Checklist
- [ ] fetch at 404 doesn't throw — shown
- [ ] Network error — TypeError
- [ ] Parsing error — SyntaxError
- [ ] Correct pattern with `response.ok` check
