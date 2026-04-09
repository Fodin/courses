# Pagination and Filtering

## Why Pagination is Needed

Returning all 10 million records from the database in a single response is a bad idea. Pagination splits a large dataset into pages: the server returns only a portion, and the client requests the next one as needed.

Without pagination, an API becomes unstable as data grows: timeouts, memory overload, slow clients.

## Offset vs Cursor: Key Differences

| Criterion | Offset (page/limit) | Cursor (after/first) |
|----------|---------------------|----------------------|
| Jump to page N | ✅ Yes | ❌ Sequential only |
| Total count | ✅ totalCount | ⚠️ Difficult |
| Stability on inserts | ❌ Duplicates/skips | ✅ Stable |
| Performance | ❌ OFFSET degrades | ✅ Fast |
| Use case | Admin panels | Feeds, infinite scroll |

**Offset**: `GET /api/posts?page=3&limit=20` or `?offset=40&limit=20`

**Cursor**: `GET /api/posts?after=cursor_abc&first=20`

## Query Parameters for Filtering and Sorting

```
GET /api/products
  ?status=active          # simple filter
  &price[gte]=100         # operator (>=)
  &price[lte]=5000        # operator (<=)
  &sort=-createdAt        # sort: minus = DESC
  &page=2&limit=20        # pagination
```

Sort with a minus sign (`-name`) is a GitHub API convention. Multiple fields: `sort=status,-createdAt`.

## Response Metadata

```json
{
  "data": [...],
  "meta": {
    "totalCount": 247,
    "page": 2,
    "limit": 20,
    "totalPages": 13,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

For cursor pagination, `pageInfo` is used instead of `page`/`totalPages`:

```json
{
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "cursor_xyz",
    "startCursor": "cursor_abc"
  }
}
```
