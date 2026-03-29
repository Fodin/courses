# 🔥 Уровень 9: Real-time коммуникация

## 🎯 Четыре подхода

1. **WebSocket (ws)** -- двусторонний постоянный канал, минимальный overhead
2. **Socket.io** -- абстракция над WebSocket с rooms, namespaces, fallback
3. **SSE (Server-Sent Events)** -- односторонний поток от сервера к клиенту
4. **Redis Pub/Sub** -- горизонтальное масштабирование real-time между инстансами

## 🔥 Сравнение технологий

| Характеристика | WebSocket | SSE | HTTP Polling |
|---|---|---|---|
| Направление | Двустороннее | Сервер → Клиент | Клиент → Сервер |
| Протокол | ws:// | HTTP | HTTP |
| Переподключение | Ручное | Автоматическое | Нет |
| Бинарные данные | Да | Нет (только текст) | Да |
| Прокси/LB | Требует настройки | Работает из коробки | Работает |
| Лучше для | Чат, игры, торговля | Уведомления, ленты | Редкие обновления |

## 🔥 WebSocket (библиотека ws)

### Протокол WebSocket

WebSocket начинается с HTTP Upgrade запроса:

```
GET /ws HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

После handshake устанавливается постоянное TCP-соединение с минимальным overhead (2-14 байт на фрейм vs ~800 байт HTTP-заголовков).

### Создание сервера

```typescript
import { WebSocketServer, WebSocket } from 'ws'
import { createServer } from 'http'

const server = createServer()
const wss = new WebSocketServer({ server })

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress
  console.log(`[CONNECT] ${clientIp}`)

  // Приём сообщений
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString())
    console.log('Received:', message)
  })

  // Отключение
  ws.on('close', (code, reason) => {
    console.log(`[DISCONNECT] Code: ${code}`)
  })

  // Ошибки
  ws.on('error', (err) => {
    console.error('[ERROR]', err.message)
  })

  // Отправка клиенту
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected!' }))
})

server.listen(3000)
```

### Broadcasting

```typescript
function broadcast(wss: WebSocketServer, data: object, exclude?: WebSocket) {
  const message = JSON.stringify(data)
  wss.clients.forEach((client) => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

// Использование
wss.on('connection', (ws) => {
  broadcast(wss, { type: 'user_joined', count: wss.clients.size }, ws)

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString())
    broadcast(wss, { type: 'chat', text: msg.text })
  })
})
```

### Heartbeat (Ping/Pong)

```typescript
wss.on('connection', (ws) => {
  (ws as any).isAlive = true
  ws.on('pong', () => { (ws as any).isAlive = true })
})

const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if ((ws as any).isAlive === false) return ws.terminate()
    (ws as any).isAlive = false
    ws.ping()
  })
}, 30000)

wss.on('close', () => clearInterval(interval))
```

📌 **Зачем heartbeat:** обнаруживает "зомби"-соединения (клиент отключился без close frame, например, при потере сети).

## 🔥 Socket.io

### Rooms и Namespaces

```typescript
import { Server } from 'socket.io'

const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' }
})

// Namespace -- логическое разделение (отдельные каналы)
const chatNs = io.of('/chat')
const adminNs = io.of('/admin')

chatNs.on('connection', (socket) => {
  // Rooms -- группы внутри namespace
  socket.on('join_room', (room) => {
    socket.join(room)
    socket.to(room).emit('user_joined', { user: socket.id })
  })

  socket.on('message', ({ room, text }) => {
    socket.to(room).emit('message', { user: socket.id, text })
  })
})
```

### Acknowledgments (запрос-ответ)

```typescript
// Сервер
socket.on('create_order', async (data, callback) => {
  try {
    const order = await OrderService.create(data)
    callback({ status: 'ok', order })
  } catch (err) {
    callback({ status: 'error', message: err.message })
  }
})

// Клиент
socket.emit('create_order', { item: 'Book' }, (response) => {
  if (response.status === 'ok') {
    console.log('Order:', response.order.id)
  }
})

// С таймаутом
socket.timeout(5000).emit('create_order', data, (err, response) => {
  if (err) console.error('Timeout!')
})
```

### Middleware

```typescript
// Аутентификация
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('Auth required'))
  try {
    socket.data.user = jwt.verify(token, SECRET)
    next()
  } catch {
    next(new Error('Invalid token'))
  }
})

// Namespace-уровень
adminNs.use((socket, next) => {
  if (socket.data.user?.role !== 'admin') {
    return next(new Error('Admin only'))
  }
  next()
})
```

## 🔥 Server-Sent Events (SSE)

### SSE endpoint

```typescript
app.get('/events', (req, res) => {
  // Обязательные заголовки
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // Nginx
  res.flushHeaders()

  // Формат SSE-события
  res.write('event: connected\n')
  res.write('data: {"status":"ok"}\n\n')

  // Периодические обновления
  const interval = setInterval(() => {
    res.write(`id: ${Date.now()}\n`)
    res.write('event: heartbeat\n')
    res.write(`data: ${JSON.stringify({ time: new Date() })}\n\n`)
  }, 15000)

  req.on('close', () => {
    clearInterval(interval)
  })
})
```

### Формат событий

```
id: 12345              (необязательно -- для переподключения)
event: notification    (необязательно -- тип события)
data: {"key":"value"}  (обязательно -- данные)
retry: 5000            (необязательно -- интервал переподключения в мс)
                       (пустая строка = конец события)
```

### Клиент (браузер)

```typescript
const evtSource = new EventSource('/events')

evtSource.addEventListener('notification', (event) => {
  const data = JSON.parse(event.data)
  showNotification(data)
})

// Автоматическое переподключение!
evtSource.onerror = () => {
  if (evtSource.readyState === EventSource.CONNECTING) {
    console.log('Reconnecting...')
    // Браузер отправит Last-Event-ID header
  }
}
```

📌 **Ограничение SSE:** нельзя установить кастомные заголовки (Authorization). Решение: передавайте токен в query string или используйте cookies.

## 🔥 Масштабирование с Redis

### Проблема

При нескольких инстансах Node.js каждый имеет свой пул WebSocket-соединений. Клиент на Instance-1 не может отправить сообщение клиенту на Instance-2.

### Решение: Redis Adapter

```typescript
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

const pubClient = createClient({ url: 'redis://localhost:6379' })
const subClient = pubClient.duplicate()
await Promise.all([pubClient.connect(), subClient.connect()])

const io = new Server(httpServer)
io.adapter(createAdapter(pubClient, subClient))

// Теперь io.emit() и io.to(room).emit() работают
// через Redis across ALL instances
```

### Sticky Sessions для Load Balancer

```nginx
upstream socketio {
  ip_hash;  # sticky sessions (обязательно для Socket.io!)
  server 127.0.0.1:3001;
  server 127.0.0.1:3002;
}
```

📌 **Sticky sessions обязательны** для Socket.io, потому что handshake (HTTP) и WebSocket соединение должны попасть на один инстанс.

## ⚠️ Частые ошибки новичков

### Ошибка 1: Нет heartbeat

```typescript
// ❌ "Зомби" соединения висят вечно
wss.on('connection', (ws) => {
  // ... без heartbeat клиент может молча отключиться
})

// ✅ Ping/Pong каждые 30 секунд
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!(ws as any).isAlive) return ws.terminate()
    ;(ws as any).isAlive = false
    ws.ping()
  })
}, 30000)
```

### Ошибка 2: JSON.parse без try/catch

```typescript
// ❌ Сервер падает при невалидном сообщении
ws.on('message', (data) => {
  const msg = JSON.parse(data.toString()) // может бросить!
})

// ✅ Безопасный парсинг
ws.on('message', (data) => {
  try {
    const msg = JSON.parse(data.toString())
    handleMessage(msg)
  } catch {
    ws.send(JSON.stringify({ error: 'Invalid JSON' }))
  }
})
```

### Ошибка 3: SSE без flush

```typescript
// ❌ Данные буферизируются, клиент ничего не получает
res.write('data: hello\n\n')

// ✅ Flush headers и отключение буферизации Nginx
res.setHeader('X-Accel-Buffering', 'no')
res.flushHeaders()
res.write('data: hello\n\n')
```

### Ошибка 4: Socket.io без sticky sessions

```typescript
// ❌ 400 Bad Request при масштабировании
// Nginx round-robin отправляет handshake на Instance-1,
// но WebSocket upgrade попадает на Instance-2

// ✅ ip_hash в Nginx или cookie-based sticky
```

## 💡 Best Practices

1. **WebSocket** -- heartbeat (ping/pong) каждые 30 секунд
2. **Socket.io** -- всегда используйте rooms для таргетированной рассылки
3. **SSE** -- для уведомлений и лент (проще WebSocket, автопереподключение)
4. **Redis Adapter** -- обязательно при нескольких инстансах
5. **Sticky Sessions** -- обязательно для Socket.io за LB
6. **Валидация** -- всегда парсьте JSON в try/catch
7. **Backpressure** -- не отправляйте данные быстрее, чем клиент может принять
