import { useState } from 'react'

// ============================================
// Task 9.1: WebSocket (ws) — Solution
// ============================================

export function Task9_1_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateServer = () => {
    const log: string[] = []
    log.push('// === WebSocket Server (ws library) ===')
    log.push("import { WebSocketServer, WebSocket } from 'ws'")
    log.push("import { createServer } from 'http'")
    log.push('')
    log.push('const server = createServer()')
    log.push('const wss = new WebSocketServer({ server })')
    log.push('')
    log.push("wss.on('connection', (ws, req) => {")
    log.push('  const clientIp = req.socket.remoteAddress')
    log.push('  console.log(`[CONNECT] Client from ${clientIp}`)')
    log.push('')
    log.push("  ws.on('message', (data) => {")
    log.push("    const message = JSON.parse(data.toString())")
    log.push('    console.log(`[MSG] Received: ${JSON.stringify(message)}`)')
    log.push('')
    log.push('    // Echo back')
    log.push("    ws.send(JSON.stringify({ type: 'echo', payload: message }))")
    log.push('  })')
    log.push('')
    log.push("  ws.on('close', (code, reason) => {")
    log.push('    console.log(`[DISCONNECT] Code: ${code}, Reason: ${reason}`)')
    log.push('  })')
    log.push('')
    log.push("  ws.on('error', (err) => {")
    log.push('    console.error(`[ERROR] ${err.message}`)')
    log.push('  })')
    log.push('')
    log.push('  // Send welcome message')
    log.push("  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected!' }))")
    log.push('})')
    log.push('')
    log.push('server.listen(3000)')
    log.push('[SERVER] WebSocket server listening on ws://localhost:3000')
    log.push('')
    log.push('// Simulation:')
    log.push('[CONNECT] Client from 192.168.1.10')
    log.push('[SEND] => { type: "welcome", message: "Connected!" }')
    log.push('[MSG] <= { type: "chat", text: "Hello!" }')
    log.push('[SEND] => { type: "echo", payload: { type: "chat", text: "Hello!" } }')
    setResults(log)
    setActiveDemo('server')
  }

  const simulateBroadcast = () => {
    const log: string[] = []
    log.push('// === Broadcasting ===')
    log.push('')
    log.push('function broadcast(wss: WebSocketServer, data: object, exclude?: WebSocket) {')
    log.push('  const message = JSON.stringify(data)')
    log.push('  wss.clients.forEach((client) => {')
    log.push('    if (client !== exclude && client.readyState === WebSocket.OPEN) {')
    log.push('      client.send(message)')
    log.push('    }')
    log.push('  })')
    log.push('}')
    log.push('')
    log.push('// Usage in connection handler:')
    log.push("wss.on('connection', (ws) => {")
    log.push('  // Notify all other clients')
    log.push("  broadcast(wss, { type: 'user_joined', count: wss.clients.size }, ws)")
    log.push('')
    log.push("  ws.on('message', (data) => {")
    log.push('    const msg = JSON.parse(data.toString())')
    log.push("    if (msg.type === 'chat') {")
    log.push('      // Broadcast to everyone including sender')
    log.push("      broadcast(wss, { type: 'chat', user: msg.user, text: msg.text })")
    log.push('    }')
    log.push('  })')
    log.push('')
    log.push("  ws.on('close', () => {")
    log.push("    broadcast(wss, { type: 'user_left', count: wss.clients.size })")
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('// Simulation with 3 clients:')
    log.push('[CONNECT] Client-A connected (total: 1)')
    log.push('[CONNECT] Client-B connected (total: 2)')
    log.push('  => Client-A receives: { type: "user_joined", count: 2 }')
    log.push('[CONNECT] Client-C connected (total: 3)')
    log.push('  => Client-A receives: { type: "user_joined", count: 3 }')
    log.push('  => Client-B receives: { type: "user_joined", count: 3 }')
    log.push('')
    log.push('[MSG] Client-A sends: { type: "chat", user: "Alice", text: "Hi all!" }')
    log.push('  => Client-A receives: { type: "chat", user: "Alice", text: "Hi all!" }')
    log.push('  => Client-B receives: { type: "chat", user: "Alice", text: "Hi all!" }')
    log.push('  => Client-C receives: { type: "chat", user: "Alice", text: "Hi all!" }')
    log.push('')
    log.push('[DISCONNECT] Client-B disconnected')
    log.push('  => Client-A receives: { type: "user_left", count: 2 }')
    log.push('  => Client-C receives: { type: "user_left", count: 2 }')
    setResults(log)
    setActiveDemo('broadcast')
  }

  const simulateHeartbeat = () => {
    const log: string[] = []
    log.push('// === Heartbeat / Ping-Pong ===')
    log.push('')
    log.push("wss.on('connection', (ws) => {")
    log.push('  (ws as any).isAlive = true')
    log.push('')
    log.push("  ws.on('pong', () => {")
    log.push('    (ws as any).isAlive = true')
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('// Check every 30 seconds')
    log.push('const interval = setInterval(() => {')
    log.push('  wss.clients.forEach((ws) => {')
    log.push('    if ((ws as any).isAlive === false) {')
    log.push('      console.log("[HEARTBEAT] Client unresponsive, terminating")')
    log.push('      return ws.terminate()')
    log.push('    }')
    log.push('    (ws as any).isAlive = false')
    log.push('    ws.ping()  // Client auto-responds with pong')
    log.push('  })')
    log.push('}, 30000)')
    log.push('')
    log.push("wss.on('close', () => clearInterval(interval))")
    log.push('')
    log.push('// Simulation:')
    log.push('[HEARTBEAT] t=0s   PING => Client-A')
    log.push('[HEARTBEAT] t=0s   PING => Client-B')
    log.push('[HEARTBEAT] t=0.1s PONG <= Client-A (alive)')
    log.push('[HEARTBEAT] t=0.1s PONG <= Client-B (alive)')
    log.push('[HEARTBEAT] t=30s  PING => Client-A')
    log.push('[HEARTBEAT] t=30s  PING => Client-B')
    log.push('[HEARTBEAT] t=30.1s PONG <= Client-A (alive)')
    log.push('[HEARTBEAT] t=60s  Client-B unresponsive, terminating')
    log.push('[HEARTBEAT] t=60s  PING => Client-A')
    log.push('[HEARTBEAT] t=60.1s PONG <= Client-A (alive)')
    setResults(log)
    setActiveDemo('heartbeat')
  }

  const buttons = [
    { id: 'server', label: 'WS Server & Client', handler: simulateServer },
    { id: 'broadcast', label: 'Broadcasting', handler: simulateBroadcast },
    { id: 'heartbeat', label: 'Heartbeat', handler: simulateHeartbeat },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 9.1: WebSocket (ws)</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#1976d2' : '#e3f2fd',
              color: activeDemo === b.id ? 'white' : '#1976d2',
              border: '1px solid #1976d2',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '0.85rem' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 9.2: Socket.io — Solution
// ============================================

export function Task9_2_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateRoomsNamespaces = () => {
    const log: string[] = []
    log.push('// === Socket.io Rooms & Namespaces ===')
    log.push("import { Server } from 'socket.io'")
    log.push('')
    log.push('const io = new Server(httpServer, {')
    log.push('  cors: { origin: "http://localhost:5173" },')
    log.push('  pingInterval: 25000,')
    log.push('  pingTimeout: 20000')
    log.push('})')
    log.push('')
    log.push('// === Namespaces ===')
    log.push("const chatNs = io.of('/chat')")
    log.push("const adminNs = io.of('/admin')")
    log.push('')
    log.push("chatNs.on('connection', (socket) => {")
    log.push('  console.log(`[CHAT] User connected: ${socket.id}`)')
    log.push('')
    log.push('  // === Rooms ===')
    log.push("  socket.on('join_room', (room) => {")
    log.push('    socket.join(room)')
    log.push("    socket.to(room).emit('user_joined', { user: socket.id, room })")
    log.push('  })')
    log.push('')
    log.push("  socket.on('leave_room', (room) => {")
    log.push('    socket.leave(room)')
    log.push("    socket.to(room).emit('user_left', { user: socket.id, room })")
    log.push('  })')
    log.push('')
    log.push("  socket.on('message', ({ room, text }) => {")
    log.push('    // Send to everyone in room EXCEPT sender')
    log.push("    socket.to(room).emit('message', { user: socket.id, text })")
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('// Simulation:')
    log.push('[CHAT] User-A connected (id: abc123)')
    log.push('[CHAT] User-B connected (id: def456)')
    log.push('[CHAT] User-A joins room "general"')
    log.push('[CHAT] User-B joins room "general"')
    log.push('[CHAT] User-A joins room "dev-team"')
    log.push('')
    log.push('[CHAT] User-A sends to "general": "Hello everyone!"')
    log.push('  => User-B receives in "general": { user: "abc123", text: "Hello everyone!" }')
    log.push('[CHAT] User-B sends to "dev-team": "Sprint review at 3pm"')
    log.push('  => Nobody receives (User-B not in dev-team)')
    setResults(log)
    setActiveDemo('rooms')
  }

  const simulateAcknowledgments = () => {
    const log: string[] = []
    log.push('// === Acknowledgments (Request-Response) ===')
    log.push('')
    log.push('// Server side: callback as last argument')
    log.push("socket.on('create_order', async (data, callback) => {")
    log.push('  try {')
    log.push('    const order = await OrderService.create(data)')
    log.push('    callback({ status: "ok", order })')
    log.push('  } catch (err) {')
    log.push('    callback({ status: "error", message: err.message })')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('// Client side: receive response')
    log.push("socket.emit('create_order', { item: 'Book', qty: 2 }, (response) => {")
    log.push('  if (response.status === "ok") {')
    log.push('    console.log("Order created:", response.order.id)')
    log.push('  } else {')
    log.push('    console.error("Failed:", response.message)')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('// With timeout (Socket.io v4.4+)')
    log.push("socket.timeout(5000).emit('create_order', data, (err, response) => {")
    log.push('  if (err) {')
    log.push('    console.error("Server did not respond in 5s")')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('// Simulation:')
    log.push('[CLIENT] emit("create_order", { item: "Book", qty: 2 })')
    log.push('[SERVER] Received create_order, processing...')
    log.push('[SERVER] Order created: ORD-001')
    log.push('[SERVER] callback({ status: "ok", order: { id: "ORD-001" } })')
    log.push('[CLIENT] Ack received: { status: "ok", order: { id: "ORD-001" } }')
    log.push('')
    log.push('[CLIENT] emit("create_order", { item: "Invalid" })')
    log.push('[SERVER] Error: Invalid item')
    log.push('[SERVER] callback({ status: "error", message: "Invalid item" })')
    log.push('[CLIENT] Ack received: { status: "error", message: "Invalid item" }')
    setResults(log)
    setActiveDemo('ack')
  }

  const simulateMiddleware = () => {
    const log: string[] = []
    log.push('// === Socket.io Middleware ===')
    log.push('')
    log.push('// Global middleware (runs for every connection)')
    log.push('io.use((socket, next) => {')
    log.push('  const token = socket.handshake.auth.token')
    log.push('  if (!token) {')
    log.push('    return next(new Error("Authentication required"))')
    log.push('  }')
    log.push('  try {')
    log.push('    const user = jwt.verify(token, SECRET)')
    log.push('    socket.data.user = user')
    log.push('    next()')
    log.push('  } catch {')
    log.push('    next(new Error("Invalid token"))')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('// Namespace-specific middleware')
    log.push("const admin = io.of('/admin')")
    log.push('admin.use((socket, next) => {')
    log.push("  if (socket.data.user?.role !== 'admin') {")
    log.push('    return next(new Error("Admin access required"))')
    log.push('  }')
    log.push('  next()')
    log.push('})')
    log.push('')
    log.push('// Event-level middleware (per-event validation)')
    log.push("socket.on('message', (data) => {")
    log.push('  // Validate at event level')
    log.push("  if (!data.text || data.text.length > 1000) return")
    log.push("  socket.to(data.room).emit('message', {")
    log.push('    user: socket.data.user.name,')
    log.push('    text: data.text')
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('// Error handling on client')
    log.push("socket.on('connect_error', (err) => {")
    log.push('  console.error(err.message) // "Authentication required"')
    log.push('})')
    log.push('')
    log.push('// Simulation:')
    log.push('[MW] Connection attempt: no token')
    log.push('[MW] REJECTED: "Authentication required"')
    log.push('')
    log.push('[MW] Connection attempt: token=eyJ...')
    log.push('[MW] Token verified: { id: 1, name: "Alice", role: "user" }')
    log.push('[MW] ACCEPTED')
    log.push('')
    log.push('[MW] /admin namespace: role check')
    log.push('[MW] user.role = "user" => REJECTED: "Admin access required"')
    setResults(log)
    setActiveDemo('middleware')
  }

  const buttons = [
    { id: 'rooms', label: 'Rooms & Namespaces', handler: simulateRoomsNamespaces },
    { id: 'ack', label: 'Acknowledgments', handler: simulateAcknowledgments },
    { id: 'middleware', label: 'Middleware', handler: simulateMiddleware },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 9.2: Socket.io</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#7b1fa2' : '#f3e5f5',
              color: activeDemo === b.id ? 'white' : '#7b1fa2',
              border: '1px solid #7b1fa2',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '0.85rem' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 9.3: Server-Sent Events — Solution
// ============================================

export function Task9_3_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateSSEEndpoint = () => {
    const log: string[] = []
    log.push('// === SSE Endpoint ===')
    log.push("import express from 'express'")
    log.push('')
    log.push("app.get('/events', (req, res) => {")
    log.push('  // Set SSE headers')
    log.push("  res.setHeader('Content-Type', 'text/event-stream')")
    log.push("  res.setHeader('Cache-Control', 'no-cache')")
    log.push("  res.setHeader('Connection', 'keep-alive')")
    log.push("  res.setHeader('X-Accel-Buffering', 'no') // Nginx")
    log.push('  res.flushHeaders()')
    log.push('')
    log.push('  // Send initial event')
    log.push("  res.write('event: connected\\n')")
    log.push("  res.write('data: {\"status\":\"ok\"}\\n\\n')")
    log.push('')
    log.push('  // Periodic updates')
    log.push('  const interval = setInterval(() => {')
    log.push("    res.write(`id: ${Date.now()}\\n`)")
    log.push("    res.write('event: heartbeat\\n')")
    log.push("    res.write(`data: ${JSON.stringify({ time: new Date() })}\\n\\n`)")
    log.push('  }, 15000)')
    log.push('')
    log.push("  req.on('close', () => {")
    log.push('    clearInterval(interval)')
    log.push("    console.log('[SSE] Client disconnected')")
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('// SSE Event Format:')
    log.push('// id: <event-id>          (optional, for reconnection)')
    log.push('// event: <event-name>     (optional, default is "message")')
    log.push('// data: <payload>         (required, can be multi-line)')
    log.push('// retry: <ms>            (optional, reconnection delay)')
    log.push('// \\n                     (empty line = end of event)')
    log.push('')
    log.push('// Simulation:')
    log.push('[SSE] Client connected: GET /events')
    log.push('[SSE] => event: connected')
    log.push('[SSE] => data: {"status":"ok"}')
    log.push('[SSE] => ')
    log.push('[SSE] ...15s later...')
    log.push('[SSE] => id: 1711612800000')
    log.push('[SSE] => event: heartbeat')
    log.push('[SSE] => data: {"time":"2026-03-28T12:00:00.000Z"}')
    setResults(log)
    setActiveDemo('endpoint')
  }

  const simulateClient = () => {
    const log: string[] = []
    log.push('// === SSE Client (Browser) ===')
    log.push('')
    log.push("const evtSource = new EventSource('/events')")
    log.push('')
    log.push('// Default "message" event')
    log.push("evtSource.onmessage = (event) => {")
    log.push('  console.log("Data:", event.data)')
    log.push('}')
    log.push('')
    log.push('// Named events')
    log.push("evtSource.addEventListener('connected', (event) => {")
    log.push('  console.log("Connected:", JSON.parse(event.data))')
    log.push('})')
    log.push('')
    log.push("evtSource.addEventListener('notification', (event) => {")
    log.push('  const data = JSON.parse(event.data)')
    log.push('  showNotification(data.title, data.body)')
    log.push('})')
    log.push('')
    log.push('// Error and reconnection')
    log.push("evtSource.onerror = (event) => {")
    log.push('  if (evtSource.readyState === EventSource.CONNECTING) {')
    log.push('    console.log("Reconnecting...")')
    log.push('  } else {')
    log.push('    console.error("SSE connection failed")')
    log.push('    evtSource.close()')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Server can set retry interval:')
    log.push('// res.write("retry: 5000\\n")  // Reconnect after 5s')
    log.push('// Browser sends Last-Event-ID header on reconnect')
    log.push('')
    log.push('// Auth with SSE (cannot set custom headers!):')
    log.push("const evtAuth = new EventSource('/events?token=' + jwt)")
    log.push('// Or use cookies (automatic)')
    log.push('')
    log.push('// Simulation:')
    log.push('[CLIENT] EventSource created, connecting to /events')
    log.push('[CLIENT] Event: "connected" => {"status":"ok"}')
    log.push('[CLIENT] Event: "notification" => {"title":"New order","body":"#ORD-001"}')
    log.push('[CLIENT] Connection lost...')
    log.push('[CLIENT] Reconnecting with Last-Event-ID: 1711612800000')
    log.push('[CLIENT] Reconnected, resuming from ID: 1711612800000')
    setResults(log)
    setActiveDemo('client')
  }

  const buttons = [
    { id: 'endpoint', label: 'SSE Endpoint', handler: simulateSSEEndpoint },
    { id: 'client', label: 'Client Handling', handler: simulateClient },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 9.3: Server-Sent Events (SSE)</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#f57c00' : '#fff3e0',
              color: activeDemo === b.id ? 'white' : '#f57c00',
              border: '1px solid #f57c00',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '0.85rem' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 9.4: Redis Pub/Sub for Scaling — Solution
// ============================================

export function Task9_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    log.push('// === Scaling Real-time with Redis Pub/Sub ===')
    log.push('')
    log.push('// Problem: Multiple Node.js instances, each with own Socket.io')
    log.push('// Client on Instance-1 sends message, client on Instance-2 should receive it')
    log.push('')
    log.push('// Solution: @socket.io/redis-adapter')
    log.push("import { Server } from 'socket.io'")
    log.push("import { createAdapter } from '@socket.io/redis-adapter'")
    log.push("import { createClient } from 'redis'")
    log.push('')
    log.push('const pubClient = createClient({ url: "redis://localhost:6379" })')
    log.push('const subClient = pubClient.duplicate()')
    log.push('await Promise.all([pubClient.connect(), subClient.connect()])')
    log.push('')
    log.push('const io = new Server(httpServer)')
    log.push('io.adapter(createAdapter(pubClient, subClient))')
    log.push('[ADAPTER] Redis adapter connected')
    log.push('')
    log.push('// Now all Socket.io instances share events through Redis:')
    log.push('')
    log.push('// Instance 1 (port 3001):')
    log.push("io.on('connection', (socket) => {")
    log.push("  socket.on('chat', (msg) => {")
    log.push("    io.emit('chat', msg)  // Broadcasts via Redis to ALL instances")
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('// Instance 2 (port 3002):')
    log.push("io.on('connection', (socket) => {")
    log.push("  socket.on('chat', (msg) => {")
    log.push("    io.emit('chat', msg)")
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('// Load balancer distributes connections:')
    log.push('// Nginx config with sticky sessions:')
    log.push('// upstream socketio {')
    log.push('//   ip_hash;  # sticky sessions')
    log.push('//   server 127.0.0.1:3001;')
    log.push('//   server 127.0.0.1:3002;')
    log.push('// }')
    log.push('')
    log.push('// Simulation:')
    log.push('[Instance-1] Client-A connects (via LB)')
    log.push('[Instance-2] Client-B connects (via LB)')
    log.push('[Instance-1] Client-A sends: { text: "Hello from A!" }')
    log.push('[REDIS PUB] Instance-1 publishes to "socket.io#/chat#"')
    log.push('[REDIS SUB] Instance-2 receives from "socket.io#/chat#"')
    log.push('[Instance-1] Client-A receives: { text: "Hello from A!" }')
    log.push('[Instance-2] Client-B receives: { text: "Hello from A!" }')
    log.push('')
    log.push('// Rooms work across instances too:')
    log.push("[Instance-1] Client-A joins room 'dev-team'")
    log.push("[Instance-2] Client-B joins room 'dev-team'")
    log.push("[Instance-1] io.to('dev-team').emit('update', data)")
    log.push('[REDIS] Broadcast to room "dev-team" across all instances')
    log.push('[Instance-2] Client-B receives update in "dev-team"')
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.4: Redis Pub/Sub для горизонтального масштабирования</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '0.85rem' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
