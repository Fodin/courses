# Task 9.1: WebSocket (ws)

## 🎯 Goal

Master WebSocket server with the `ws` library: server creation, connection and message handling, broadcasting, and heartbeat.

## Requirements

1. Create a WebSocket server via `WebSocketServer` attached to an HTTP server
2. Handle events: `connection`, `message` (with JSON parsing), `close` (code and reason), `error`
3. Implement a broadcast function with ability to exclude the sender
4. Show heartbeat via ping/pong: detecting and terminating zombie connections
5. Send a welcome message on connection

## Checklist

- [ ] WebSocket server created and listening for connections
- [ ] Messages parsed from JSON with error handling
- [ ] Broadcast sends to all clients (checking readyState)
- [ ] Heartbeat checks connections every 30 seconds
- [ ] Unresponsive clients removed via terminate

## How to Verify

Click "Run" and verify that: server accepts connections, messages are handled and broadcast, heartbeat detects disconnected clients.
