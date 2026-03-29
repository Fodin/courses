# Task 9.4: Redis Pub/Sub for Scaling

## 🎯 Goal

Master horizontal scaling of real-time apps: Redis Adapter for Socket.io, sticky sessions for Load Balancer.

## Requirements

1. Show the problem: clients on different instances can't see each other's messages
2. Connect `@socket.io/redis-adapter`: pubClient, subClient (duplicate), createAdapter
3. Demonstrate that `io.emit()` and `io.to(room).emit()` work across instances via Redis
4. Show Nginx configuration with sticky sessions (ip_hash) for WebSocket

## Checklist

- [ ] Scaling problem described and understood
- [ ] Redis Adapter connected with pub/sub clients
- [ ] Broadcast and rooms work across instances
- [ ] Nginx configuration includes ip_hash for sticky sessions

## How to Verify

Click "Run" and verify that: Redis Adapter is configured, messages pass between instances via Redis, rooms work cross-instance.
