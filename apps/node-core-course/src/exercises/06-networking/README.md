# 🔥 Уровень 6: Networking

## 🎯 Зачем понимать сетевое программирование

Node.js создавался для сетевых приложений. Понимание TCP, HTTP и DNS на низком уровне -- ключ к написанию производительных серверов, отладке сетевых проблем и пониманию работы фреймворков (Express, Fastify, Koa).

## 📌 Сетевой стек Node.js

```
┌───────────────────────────────────────┐
│            Application                 │
│     (Express, Fastify, Koa, etc.)     │
├───────────────────────────────────────┤
│         http / https modules           │
│    (HTTP parsing, routing, headers)    │
├───────────────────────────────────────┤
│         tls module (optional)          │
│    (TLS/SSL encryption layer)          │
├───────────────────────────────────────┤
│            net module                  │
│    (TCP sockets, IPC)                  │
├───────────────────────────────────────┤
│            libuv                       │
│    (async I/O, event loop)             │
├───────────────────────────────────────┤
│         Operating System               │
│    (TCP/IP stack, DNS resolver)        │
└───────────────────────────────────────┘
```

## 🔥 TCP с модулем net

### TCP Server

```js
const net = require('net')

const server = net.createServer((socket) => {
  console.log('Client:', socket.remoteAddress, socket.remotePort)

  socket.on('data', (data) => {
    console.log('Received:', data.toString())
    socket.write('Echo: ' + data.toString())
  })

  socket.on('end', () => console.log('Client disconnected'))
  socket.on('error', (err) => console.error('Error:', err.message))
})

server.listen(3000, '127.0.0.1', () => {
  console.log('TCP server listening on port 3000')
})
```

### TCP Client

```js
const client = net.createConnection({ port: 3000 }, () => {
  client.write('Hello Server!')
})

client.on('data', (data) => {
  console.log('Response:', data.toString())
  client.end()
})
```

### Socket -- это Duplex Stream

Socket одновременно Readable и Writable, поэтому работают все паттерны стримов:

```js
// pipe, pipeline, for await...of
const server = net.createServer((socket) => {
  socket.pipe(socket) // echo server в одну строку!
})

// Или с pipeline
const server = net.createServer(async (socket) => {
  await pipeline(socket, transform, socket)
})
```

### Ключевые события сокета

```js
socket.on('connect', () => {})   // соединение установлено
socket.on('data', (buf) => {})   // получены данные
socket.on('end', () => {})       // другая сторона завершила
socket.on('close', () => {})     // сокет закрыт
socket.on('error', (err) => {})  // ошибка
socket.on('timeout', () => {})   // таймаут неактивности
socket.on('drain', () => {})     // буфер записи опустел
```

## 🔥 HTTP с модулем http

### Базовый сервер

```js
const http = require('http')

const server = http.createServer((req, res) => {
  // req = IncomingMessage (Readable Stream)
  // res = ServerResponse (Writable Stream)

  console.log(req.method, req.url, req.headers)

  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World\n')
})

server.listen(3000)
```

### Чтение тела запроса

```js
async function readBody(req) {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString()
}

// С ограничением размера (защита от abuse)
async function readBodySafe(req, maxBytes = 1e6) {
  let size = 0
  const chunks = []
  for await (const chunk of req) {
    size += chunk.length
    if (size > maxBytes) {
      req.destroy()
      throw new Error('Payload too large')
    }
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString()
}
```

### Маршрутизация

```js
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (req.method === 'GET' && url.pathname === '/api/users') {
    const page = url.searchParams.get('page') || '1'
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ users: [], page }))
  }
  else if (req.method === 'POST' && url.pathname === '/api/users') {
    const body = JSON.parse(await readBody(req))
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ id: Date.now(), ...body }))
  }
  else {
    res.writeHead(404)
    res.end('Not Found')
  }
})
```

### Streaming Response

```js
// Отправка файла через stream — не загружает в память!
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/octet-stream' })
  const stream = fs.createReadStream('big-file.bin')
  pipeline(stream, res).catch(console.error)
})
```

## 🔥 URL и DNS

### URL API (WHATWG)

```js
const url = new URL('https://user:pass@example.com:8080/path?q=1#hash')

url.protocol  // "https:"
url.hostname  // "example.com"
url.port      // "8080"
url.pathname  // "/path"
url.search    // "?q=1"
url.hash      // "#hash"
url.origin    // "https://example.com:8080"
```

### URLSearchParams

```js
const params = new URLSearchParams('page=1&limit=10')
params.get('page')      // "1"
params.set('page', '2')
params.append('sort', 'name')
params.toString()        // "page=2&limit=10&sort=name"

for (const [key, value] of params) {
  console.log(key, '=', value)
}
```

### DNS Module

```js
const dns = require('dns/promises')

// lookup() — через OS resolver (учитывает /etc/hosts)
const { address } = await dns.lookup('example.com')

// resolve() — прямой DNS запрос
const addresses = await dns.resolve4('example.com')   // A records
const ipv6 = await dns.resolve6('example.com')        // AAAA
const mx = await dns.resolveMx('example.com')         // MX
const txt = await dns.resolveTxt('example.com')        // TXT
```

**Важно:** `dns.lookup()` использует thread pool libuv и может быть узким местом при большом количестве резолвов. `dns.resolve()` использует c-ares и не блокирует thread pool.

## 🔥 HTTPS и TLS

### HTTPS Server

```js
const https = require('https')
const fs = require('fs')

const server = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  minVersion: 'TLSv1.2'
}, (req, res) => {
  res.writeHead(200)
  res.end('Secure!')
})

server.listen(443)
```

### TLS Server (raw TCP + encryption)

```js
const tls = require('tls')

const server = tls.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, (socket) => {
  console.log('Protocol:', socket.getProtocol())    // "TLSv1.3"
  console.log('Cipher:', socket.getCipher().name)    // "TLS_AES_256_GCM_SHA384"
  console.log('Authorized:', socket.authorized)
  socket.end('Welcome!')
})
```

### TLS Handshake

```
Client                          Server
  │                                │
  │──── ClientHello ──────────────►│  (versions, ciphers)
  │◄─── ServerHello ──────────────│  (chosen version, cipher)
  │◄─── Certificate ──────────────│  (X.509 cert)
  │──── Verify cert chain         │
  │──── Key Exchange ────────────►│  (ECDHE)
  │     Derive session keys        │
  │◄───── Finished ───────────────│
  │                                │
  │═══ Encrypted Channel ════════│
```

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Не ограничивать размер тела запроса

```js
// ❌ Злоумышленник может отправить 10GB body
const body = await readBody(req)
```

```js
// ✅ Ограничиваем размер
const body = await readBodySafe(req, 1e6) // max 1MB
```

### Ошибка 2: Забывать res.end()

```js
// ❌ Клиент будет висеть вечно
server.on('request', (req, res) => {
  res.writeHead(200)
  res.write('Hello')
  // res.end() забыли!
})
```

```js
// ✅ Всегда вызывайте end()
res.writeHead(200)
res.end('Hello')
```

### Ошибка 3: rejectUnauthorized: false

```js
// ❌ НИКОГДА в production!
const socket = tls.connect({
  host: 'api.example.com',
  rejectUnauthorized: false // отключает проверку сертификата!
})
```

```js
// ✅ Добавьте CA если самоподписанный
const socket = tls.connect({
  host: 'api.example.com',
  ca: fs.readFileSync('ca-cert.pem') // доверяем конкретному CA
})
```

### Ошибка 4: dns.lookup() в highload

```js
// ❌ lookup() использует thread pool (default: 4 threads)
// При 1000 concurrent запросов — bottleneck!
for (const host of hosts) {
  const { address } = await dns.lookup(host)
}
```

```js
// ✅ Используйте dns.resolve() или кешируйте результаты
const cache = new Map()
async function cachedLookup(hostname) {
  if (cache.has(hostname)) return cache.get(hostname)
  const [address] = await dns.resolve4(hostname)
  cache.set(hostname, address)
  setTimeout(() => cache.delete(hostname), 60000) // TTL 1 min
  return address
}
```

### Ошибка 5: Конкатенация данных TCP без фрейминга

```js
// ❌ TCP не гарантирует границы сообщений!
socket.on('data', (data) => {
  // data может быть частью сообщения или несколько сообщений
  const message = JSON.parse(data.toString()) // может упасть!
})
```

```js
// ✅ Используйте фрейминг (delimiter или length prefix)
let buffer = ''
socket.on('data', (data) => {
  buffer += data.toString()
  let newlineIndex
  while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
    const message = buffer.slice(0, newlineIndex)
    buffer = buffer.slice(newlineIndex + 1)
    processMessage(JSON.parse(message))
  }
})
```

## 💡 Best Practices

1. **Используйте `pipeline()`** для связи стримов в HTTP (req/res)
2. **Ограничивайте размер body** для защиты от DoS
3. **Минимум TLS 1.2** для любых production серверов
4. **Не отключайте проверку сертификатов** (`rejectUnauthorized: false`)
5. **Используйте `dns.resolve()`** вместо `dns.lookup()` в highload
6. **Реализуйте framing** для TCP-протоколов (newline-delimited, length-prefix)
7. **Всегда вызывайте `res.end()`** в HTTP handlers
8. **Используйте `fetch()`** (Node.js 18+) вместо `http.get()` для клиентских запросов
9. **Настройте keep-alive** для переиспользования TCP соединений
10. **Используйте Let's Encrypt** для бесплатных TLS сертификатов
