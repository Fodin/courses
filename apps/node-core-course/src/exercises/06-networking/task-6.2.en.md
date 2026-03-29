# Task 6.2: HTTP from Scratch

## Goal

Learn to create an HTTP server using the `http` module without frameworks: request handling, body reading, routing, and streaming responses.

## Requirements

1. Create an HTTP server via `http.createServer()`
2. Show `IncomingMessage` properties: method, url, headers
3. Demonstrate body reading via async iterator with size limiting
4. Implement simple routing (GET, POST, 404)
5. Show streaming response via `pipeline(readStream, res)`
6. Simulate several HTTP requests/responses

## Checklist

- [ ] HTTP server created and listening on a port
- [ ] IncomingMessage properties shown
- [ ] Body reading with size limiting implemented
- [ ] GET/POST/404 routing works
- [ ] Streaming response via pipeline shown
- [ ] Request simulation is correct

## How to verify

1. Click "Run" and study the request simulation
2. Verify GET returns 200, POST returns 201, unknown path returns 404
3. Check POST body is processed correctly
4. Verify streaming response is explained
