# Task 4.3 — Reference Request/Response for a Resource

## Goal

Create a complete set of correct request/response pairs for standard CRUD operations. Consolidate the skill of designing request and response bodies, taking into account HTTP headers, status codes, and conventions.

## Requirements

1. The component covers five operations: list, get one, create, partial update, delete.
2. For each operation, the following are shown: HTTP method, full URL, request headers, request body (if any).
3. A "Request / Response" toggle shows response headers and body with the correct status code.
4. For each operation — a "Key decisions" block with justification of the method, status, and structure.
5. The example resource is "product" with fields: id, name, price, category, inStock.

## Checklist

- [ ] All 5 operations: GET (list), GET (one), POST, PATCH, DELETE
- [ ] For each: method, URL, headers, request body
- [ ] For each: response status, response headers, response body
- [ ] "Request/Response" toggle
- [ ] Pagination in GET collection (meta)
- [ ] POST returns 201 + Location
- [ ] PATCH uses application/merge-patch+json
- [ ] DELETE returns 204 without body
- [ ] Decision justification block for each operation

## How to Check Yourself

Close the component. Design from scratch request/response for an "order" resource — all 5 operations. Compare with the reference. Pay attention to: headers, status codes, presence/absence of body, meta fields in the collection.
