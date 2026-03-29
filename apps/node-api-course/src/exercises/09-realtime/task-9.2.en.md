# Task 9.2: Socket.io

## 🎯 Goal

Master Socket.io: rooms and namespaces for grouping, acknowledgments for request-response pattern, middleware for authentication.

## Requirements

1. Create a Socket.io server with CORS settings, define namespaces (`/chat`, `/admin`)
2. Implement rooms: join, leave, sending messages to specific rooms via `socket.to(room).emit()`
3. Show acknowledgments: callback for delivery confirmation, timeout
4. Implement middleware: global (JWT auth), namespace-level (role check), client-side error handling

## Checklist

- [ ] Namespaces created for different functional domains
- [ ] Rooms: join/leave/send work correctly
- [ ] Acknowledgments return operation results to client
- [ ] Middleware verifies JWT on connection
- [ ] Namespace middleware restricts access by role

## How to Verify

Click "Run" and verify that: namespaces are isolated, rooms group clients, acknowledgments confirm operations, middleware blocks unauthorized users.
