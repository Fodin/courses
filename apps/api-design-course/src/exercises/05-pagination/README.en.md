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

## Field filtering — fighting over-fetching

Pagination limits the number of **rows**, while field filtering limits the number of **fields** in each row. These are two different axes of saving bandwidth.

**Over-fetching** — the client needs `id` and `name`, but the API returns the whole object with 30 fields. For a list of 100 products this bloats the response several times over.

The solution is a `fields` parameter (sparse fieldsets, the JSON:API convention):

```
GET /products?fields=id,name,price     # return only these fields
GET /users/42?fields=id,email          # partial representation
```

```json
// GET /products?fields=id,name → compact response
{ "data": [ { "id": 1, "name": "Coffee" }, { "id": 2, "name": "Tea" } ] }
```

This is the "poor man's" GraphQL: the client decides what it needs. Rule: `fields` only shrinks the set of fields, it doesn't change the resource's structure.

## Response compression (gzip)

Even compact JSON compresses well — text is redundant. The client announces it can decompress, the server compresses:

```http
# Request
Accept-Encoding: gzip, br

# Response
Content-Encoding: gzip
```

Gzip typically shrinks a JSON response by 70–90%. This is a **free** optimization at the infrastructure level (nginx, CDN), almost always on by default. Trade-off: extra CPU load, so there's no point compressing tiny responses (a few hundred bytes).

**Three axes of saving bandwidth** work together: pagination cuts rows, `fields` cuts fields, gzip compresses the rest.
