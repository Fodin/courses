# Task 0.1: http.createServer

## 🎯 Goal

Demonstrate how `http.createServer` works, including `IncomingMessage` and `ServerResponse` objects, and proper usage of status codes and headers.

## Requirements

1. Create an HTTP server using `http.createServer`
2. Handle the `req` (IncomingMessage) object: display `method`, `url`, `httpVersion`, `headers`
3. Configure the `res` (ServerResponse) object: set status code 200, headers `Content-Type: application/json` and `X-Request-Id`
4. Display a table of common HTTP status codes (200, 201, 204, 400, 401, 403, 404, 500)
5. Show a complete request-response cycle with formatted HTTP messages

## Checklist

- [ ] Server created via `http.createServer` with `(req, res)` callback
- [ ] Properties `req.method`, `req.url`, `req.headers` displayed correctly
- [ ] `res.writeHead` called with status code and headers
- [ ] All major status codes (2xx, 4xx, 5xx) listed with descriptions
- [ ] Full cycle shown: incoming request -> outgoing response
- [ ] Server starts via `server.listen(port, callback)`

## How to Verify

Click the "Run" button and verify the output displays: request/response object structure, status codes table, and the full HTTP request-response cycle.
