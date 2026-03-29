# Task 3.3: Sorting & Filtering

## 🎯 Goal

Implement sorting, filtering, and sparse fieldsets for REST API requests.

## Requirements

1. Implement sorting via `?sort=-createdAt,name` (minus = DESC, no minus = ASC)
2. Implement filtering: `?filter[status]=active`, `?filter[age][gte]=18`, `?filter[role][in]=admin,editor`
3. Implement text search: `?search=john` -> ILIKE across multiple fields
4. Implement sparse fieldsets: `?fields=id,name,email` -> SELECT only specified fields
5. Show a combined query with all parameters

## Checklist

- [ ] Sorting: multiple fields support, ASC/DESC via minus sign
- [ ] Filtering: operators gte, lte, in, like via nested query params
- [ ] Search: ILIKE across multiple fields simultaneously
- [ ] Sparse fieldsets: SELECT only requested fields
- [ ] Combined example: filter + sort + fields + page in one request

## How to Verify

Click "Run" and verify that each parameter type is shown with a query string example and corresponding SQL query, and the combined example merges all parameters.
