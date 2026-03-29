# Task 3.4: API Versioning

## 🎯 Goal

Compare three API versioning approaches: URL, headers, and content negotiation, with implementation examples and deprecation strategy.

## Requirements

1. Show URL versioning: `/api/v1/users` vs `/api/v2/users` with separate routers
2. Show Header versioning: `X-API-Version: 2` with middleware for version detection
3. Show Content negotiation: `Accept: application/vnd.myapi.v2+json`
4. Demonstrate response differences between v1 and v2 for the same resource
5. Show deprecation strategy: Deprecation, Sunset, Link headers

## Checklist

- [ ] URL versioning: separate routers for v1/v2, pros and cons
- [ ] Header versioning: versioning middleware, pros and cons
- [ ] Content negotiation: Accept header, pros and cons
- [ ] Example: v1 returns flat structure, v2 returns nested with HATEOAS links
- [ ] Deprecation headers: Deprecation, Sunset, Link rel="successor-version"

## How to Verify

Click "Run" and verify that: all three approaches are shown with examples and trade-offs, v1/v2 demonstrate response format differences, and the deprecation strategy includes HTTP headers.
