# Task 3.2: Pagination

## 🎯 Goal

Implement two pagination approaches: offset-based and cursor-based, with Link headers and metadata.

## Requirements

1. Implement offset-based pagination: `?page=3&per_page=20` -> SQL `LIMIT 20 OFFSET 40`
2. Add metadata: `meta: { total, page, perPage, totalPages }`
3. Add Link headers (first, prev, next, last) per RFC 5988
4. Implement cursor-based pagination: `?after=<cursor>&limit=20` -> SQL `WHERE id > N`
5. Compare approaches: offset (random access, slow on large offset) vs cursor (stable, fast)

## Checklist

- [ ] Offset-based: SQL LIMIT/OFFSET, total/page/totalPages metadata
- [ ] Link headers contain rel="first", "prev", "next", "last"
- [ ] Cursor-based: cursor = base64(JSON), request limit+1 to determine hasMore
- [ ] Cursor-based meta: `{ hasMore, nextCursor, prevCursor }`
- [ ] Comparison table: pros and cons of each approach

## How to Verify

Click "Run" and verify that: both pagination types are shown with SQL queries, metadata, and Link headers, along with an approach comparison.
