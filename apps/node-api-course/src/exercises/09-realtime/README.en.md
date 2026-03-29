# 🔥 Level 9: Real-time Communication

## 🎯 Four Approaches

1. **WebSocket (ws)** -- bidirectional persistent channel, minimal overhead
2. **Socket.io** -- WebSocket abstraction with rooms, namespaces, fallback
3. **SSE** -- server-to-client one-way stream
4. **Redis Pub/Sub** -- horizontal scaling of real-time across instances

## 🔥 WebSocket (ws library)

```typescript
const wss = new WebSocketServer({ server })
wss.on('connection', (ws) => {
  ws.on('message', (data) => { /* handle */ })
  ws.send(JSON.stringify({ type: 'welcome' }))
})
```

Broadcasting, heartbeat (ping/pong), and error handling.

## 🔥 Socket.io

Rooms, namespaces, acknowledgments (request-response), and middleware for auth.

## 🔥 SSE

```typescript
res.setHeader('Content-Type', 'text/event-stream')
res.write('event: notification\ndata: {"msg":"hello"}\n\n')
```

Auto-reconnection with Last-Event-ID.

## 🔥 Scaling with Redis Adapter

```typescript
io.adapter(createAdapter(pubClient, subClient))
// io.emit() now works across ALL instances
```

Sticky sessions required for Socket.io behind load balancers.

## ⚠️ Common Beginner Mistakes

- No heartbeat (zombie connections)
- JSON.parse without try/catch
- SSE without flush headers
- Socket.io without sticky sessions behind LB

## 💡 Best Practices

1. Heartbeat every 30 seconds for WebSocket
2. Use rooms for targeted broadcasts in Socket.io
3. SSE for notifications (simpler, auto-reconnect)
4. Redis Adapter for multi-instance deployments
5. Always validate/parse messages in try/catch
