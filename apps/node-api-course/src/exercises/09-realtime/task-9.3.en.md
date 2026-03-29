# Task 9.3: Server-Sent Events (SSE)

## 🎯 Goal

Master SSE: creating endpoints with correct headers, event formatting, automatic client reconnection with Last-Event-ID.

## Requirements

1. Create an SSE endpoint with headers: Content-Type, Cache-Control, Connection, X-Accel-Buffering
2. Show SSE event format: id, event, data, retry
3. Send periodic heartbeat events
4. Show client code: EventSource, named event handling, reconnection with Last-Event-ID
5. Demonstrate SSE limitations: no custom headers, solution via query string / cookies

## Checklist

- [ ] SSE endpoint sends correct headers
- [ ] Events follow SSE format (id, event, data, empty line)
- [ ] Heartbeat prevents connection closure
- [ ] Client handles named events via addEventListener
- [ ] Reconnection uses Last-Event-ID to resume stream

## How to Verify

Click "Run" and verify that: SSE endpoint correctly formats events, client receives and processes them, reconnection works with Last-Event-ID.
