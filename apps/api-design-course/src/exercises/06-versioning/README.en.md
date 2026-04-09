# Level 6: API Versioning

## Why Version an API?

An API is a contract between the server and its clients. When you change this contract, you risk breaking all the applications that depend on it. Versioning allows you to introduce changes gradually without breaking existing clients.

## Breaking vs Non-Breaking Changes

**Non-breaking (safe changes):**
- Adding a new field to a response
- Adding a new optional request parameter
- Adding a new endpoint

**Breaking (breaking changes):**
- Removing a field from a response
- Changing a field type (`string` → `number`)
- Renaming a field
- Changing the semantics of an existing field
- Removing an endpoint

## Three Versioning Strategies

### 1. URL Versioning
The version is embedded in the URL path.

```
GET /api/v1/users
GET /api/v2/users
```

✅ Simple, visible, cacheable.
❌ "Pollutes" the URL — one resource at multiple addresses.

### 2. Header Versioning
The version is passed in an HTTP header.

```
GET /api/users
Accept: application/vnd.myapi.v2+json
```

✅ Clean URLs, conforms to HTTP Content Negotiation.
❌ Cannot be tested directly from a browser.

### 3. Query Param Versioning
The version as a query parameter.

```
GET /api/users?version=2
```

✅ Compromise — visible in URL, doesn't change the path.
❌ Gets mixed with other parameters.

## Deprecation Policy

When a version becomes obsolete, use standard headers (RFC 8594):

```
Deprecation: Tue, 01 Jan 2025 00:00:00 GMT
Sunset: Tue, 01 Jul 2025 00:00:00 GMT
Link: <https://api.example.com/migration>; rel="successor-version"
```
