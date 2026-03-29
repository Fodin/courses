# Task 5.2: CORS

## 🎯 Goal

Understand the CORS mechanism: simple requests, preflight (OPTIONS), credentials, and cors middleware configuration.

## Requirements

1. Explain what CORS is and why it's needed (browser same-origin policy)
2. Show a simple request: `Origin` header -> `Access-Control-Allow-Origin` response
3. Show a preflight request: OPTIONS with `Access-Control-Request-Method/Headers` -> `Allow-*` response
4. Explain credentials: `fetch({ credentials: 'include' })` + `Access-Control-Allow-Credentials: true`
5. Show cors middleware configuration: origin, methods, allowedHeaders, exposedHeaders, credentials, maxAge

## Checklist

- [ ] Same-origin policy explained: domain:port:protocol
- [ ] Simple request: Origin -> Allow-Origin + Vary: Origin
- [ ] Preflight: OPTIONS -> 204 + Allow-Methods/Headers + Max-Age
- [ ] Credentials: cannot use `Allow-Origin: *` with credentials: true
- [ ] cors() configuration: origins array, methods, headers, maxAge

## How to Verify

Click "Run" and verify that: simple request and preflight mechanisms are shown, credentials limitations explained, and cors middleware configuration is complete.
