# Task 5.2 — Query Parameter Builder

## Goal

Learn to correctly compose query parameters for filtering, sorting, and pagination, and understand the structure of metadata in responses.

## Requirements

1. The component contains a form with the following controls:
   - Status filter (select: active / draft / archived / any)
   - Price range: "from" and "to" fields (operators `price[gte]` and `price[lte]`)
   - Created date from (operator `createdAt[gte]`)
   - Sorting (select): by name A→Z, Z→A, by date newest/oldest, by price ↑↓
   - Page and limit (5 / 10 / 20 / 50)
2. The request URL updates in real time when any filter changes.
3. The URL uses notation `price[gte]`, `price[lte]`, `createdAt[gte]` for ranges.
4. Descending sort uses a minus prefix: `sort=-createdAt`.
5. When filters change (except page), the page resets to 1.
6. A block showing example response metadata is displayed: totalCount, page, limit, totalPages, hasNextPage, hasPrevPage.
7. Different parts of the URL are highlighted in different colors (filters, operators, sorting, pagination).

## Checklist

- [ ] Status filter
- [ ] Price range with operators `[gte]` / `[lte]`
- [ ] Date filter with operator `[gte]`
- [ ] Sorting with the minus = DESC convention
- [ ] Limit selection from preset values
- [ ] URL updates on every change
- [ ] Page resets to 1 when filters change
- [ ] Response metadata (totalCount, totalPages, hasNextPage, hasPrevPage)
- [ ] Color-coded URL parts

## How to Check Yourself

Set up filters: status = active, price 500–3000, sort by date (newest), page 2, limit 10.
The expected URL should contain: `status=active`, `price[gte]=500`, `price[lte]=3000`, `sort=-createdAt`, `page=2`, `limit=10`.
Make sure the page resets to 1 when sorting changes.
