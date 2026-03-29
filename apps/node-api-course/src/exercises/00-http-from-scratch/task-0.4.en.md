# Task 0.4: POST Body Parsing

## 🎯 Goal

Implement HTTP request body parsing for various Content-Types: JSON, URL-encoded form data, and chunked transfer handling.

## Requirements

1. Read the request body via `data` and `end` events on the `req` object (Readable Stream)
2. Add protection against oversized request bodies (size limit)
3. Parse JSON body via `JSON.parse()` and show the result
4. Parse URL-encoded form data via `new URLSearchParams()`
5. Determine the parser type based on the Content-Type header
6. Handle parsing errors (invalid JSON -> 400 Bad Request)

## Checklist

- [ ] Request body read via `req.on('data')` and `req.on('end')`
- [ ] Protection implemented: `if (body.length > 1e6) req.destroy()`
- [ ] JSON body correctly parsed from `application/json`
- [ ] Form data correctly parsed from `application/x-www-form-urlencoded`
- [ ] Parser type determined by Content-Type header
- [ ] Invalid JSON returns 400 Bad Request with error message

## How to Verify

Click "Run" and verify that: JSON body is correctly parsed, form data is converted to key-value pairs, Content-Type -> parser table is shown, and invalid JSON is handled with a 400 error.
