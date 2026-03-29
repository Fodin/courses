# Task 6.1: TCP with net

## Goal

Master the `net` module for creating TCP servers and clients, understand socket events and connection properties.

## Requirements

1. Show TCP server creation via `net.createServer()`
2. Demonstrate a TCP client via `net.createConnection()`
3. Show all socket events: `connect`, `data`, `end`, `close`, `error`, `timeout`, `drain`
4. Demonstrate socket properties: `remoteAddress`, `remotePort`, `bytesRead`, `bytesWritten`
5. Show server options: `allowHalfOpen`, `keepAlive`, `maxConnections`
6. Simulate a TCP echo server with message exchange

## Checklist

- [ ] TCP server created with incoming connection handling
- [ ] TCP client connects and sends data
- [ ] All socket events listed and explained
- [ ] Socket properties shown
- [ ] Server options demonstrated
- [ ] Echo server simulation works

## How to verify

1. Click "Run" and study the server and client logs
2. Verify the server echoes back each message
3. Check that bytesRead and bytesWritten are shown
4. Verify main socket events are explained
