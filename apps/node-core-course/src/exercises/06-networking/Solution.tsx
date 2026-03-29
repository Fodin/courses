import { useState } from 'react'

// ============================================
// Задание 6.1: TCP with net — Решение
// ============================================

export function Task6_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== TCP Networking with net Module ===')
    log.push('')
    log.push('Модуль net — низкоуровневый TCP/IPC networking в Node.js.')
    log.push('HTTP построен поверх net. Понимание TCP — основа сетевого программирования.')
    log.push('')

    log.push('=== TCP Server ===')
    log.push('')
    log.push('const net = require("net")')
    log.push('')
    log.push('const server = net.createServer((socket) => {')
    log.push('  console.log("Client connected:", socket.remoteAddress)')
    log.push('')
    log.push('  socket.on("data", (data) => {')
    log.push('    console.log("Received:", data.toString())')
    log.push('    socket.write("Echo: " + data.toString())')
    log.push('  })')
    log.push('')
    log.push('  socket.on("end", () => {')
    log.push('    console.log("Client disconnected")')
    log.push('  })')
    log.push('')
    log.push('  socket.on("error", (err) => {')
    log.push('    console.error("Socket error:", err.message)')
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('server.listen(3000, "127.0.0.1", () => {')
    log.push('  console.log("TCP server on port 3000")')
    log.push('})')

    log.push('')
    log.push('=== TCP Client ===')
    log.push('')
    log.push('const client = net.createConnection({')
    log.push('  host: "127.0.0.1",')
    log.push('  port: 3000')
    log.push('}, () => {')
    log.push('  console.log("Connected to server")')
    log.push('  client.write("Hello Server!")')
    log.push('})')
    log.push('')
    log.push('client.on("data", (data) => {')
    log.push('  console.log("Server says:", data.toString())')
    log.push('  client.end() // close connection')
    log.push('})')

    log.push('')
    log.push('=== Socket Events ===')
    log.push('')
    log.push('  "connect"   — соединение установлено')
    log.push('  "data"      — получены данные')
    log.push('  "end"       — другая сторона вызвала end()')
    log.push('  "close"     — сокет полностью закрыт')
    log.push('  "error"     — ошибка сокета')
    log.push('  "timeout"   — неактивность (socket.setTimeout)')
    log.push('  "drain"     — буфер записи опустел')

    log.push('')
    log.push('=== Socket Properties ===')
    log.push('')
    log.push('  socket.remoteAddress  — IP клиента')
    log.push('  socket.remotePort     — порт клиента')
    log.push('  socket.localAddress   — IP сервера')
    log.push('  socket.localPort      — порт сервера')
    log.push('  socket.bytesRead      — прочитано байт')
    log.push('  socket.bytesWritten   — записано байт')

    // Simulation
    log.push('')
    log.push('=== Симуляция: TCP Echo Server ===')
    log.push('')

    const serverLog: string[] = []
    const clientLog: string[] = []

    // Simulate connection
    serverLog.push('[Server] Listening on 127.0.0.1:3000')
    clientLog.push('[Client] Connecting to 127.0.0.1:3000...')
    clientLog.push('[Client] Connected!')
    serverLog.push('[Server] New connection from 127.0.0.1:54321')

    // Simulate data exchange
    const messages = ['Hello', 'How are you?', 'Bye!']
    for (const msg of messages) {
      clientLog.push(`[Client] → send: "${msg}"`)
      serverLog.push(`[Server] ← recv: "${msg}"`)
      serverLog.push(`[Server] → send: "Echo: ${msg}"`)
      clientLog.push(`[Client] ← recv: "Echo: ${msg}"`)
    }

    clientLog.push('[Client] → end()')
    serverLog.push('[Server] Client disconnected')
    serverLog.push(`[Server] Stats: bytesRead=28, bytesWritten=52`)

    log.push('--- Server Log ---')
    serverLog.forEach(l => log.push(`  ${l}`))
    log.push('')
    log.push('--- Client Log ---')
    clientLog.forEach(l => log.push(`  ${l}`))

    log.push('')
    log.push('=== Server Options ===')
    log.push('')
    log.push('const server = net.createServer({')
    log.push('  allowHalfOpen: false,  // auto-end when client ends')
    log.push('  pauseOnConnect: false, // auto-read on connect')
    log.push('  keepAlive: true,       // enable TCP keep-alive')
    log.push('  keepAliveInitialDelay: 1000')
    log.push('})')
    log.push('')
    log.push('server.maxConnections = 100 // limit connections')
    log.push('server.getConnections((err, count) => {')
    log.push('  console.log("Active connections:", count)')
    log.push('})')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: TCP with net</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 6.2: HTTP from Scratch — Решение
// ============================================

export function Task6_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== HTTP Server from Scratch ===')
    log.push('')
    log.push('Модуль http построен поверх net. IncomingMessage — Readable stream,')
    log.push('ServerResponse — Writable stream.')
    log.push('')

    log.push('=== Базовый HTTP Server ===')
    log.push('')
    log.push('const http = require("http")')
    log.push('')
    log.push('const server = http.createServer((req, res) => {')
    log.push('  // req — IncomingMessage (Readable Stream)')
    log.push('  console.log(req.method, req.url)')
    log.push('  console.log("Headers:", req.headers)')
    log.push('')
    log.push('  // res — ServerResponse (Writable Stream)')
    log.push('  res.writeHead(200, {')
    log.push('    "Content-Type": "application/json",')
    log.push('    "X-Request-Id": "abc123"')
    log.push('  })')
    log.push('  res.end(JSON.stringify({ status: "ok" }))')
    log.push('})')
    log.push('')
    log.push('server.listen(3000)')

    log.push('')
    log.push('=== Чтение Body (POST/PUT) ===')
    log.push('')
    log.push('async function readBody(req) {')
    log.push('  const chunks = []')
    log.push('  for await (const chunk of req) {')
    log.push('    chunks.push(chunk)')
    log.push('  }')
    log.push('  return Buffer.concat(chunks).toString()')
    log.push('}')
    log.push('')
    log.push('// Или с ограничением размера:')
    log.push('async function readBodyLimited(req, maxSize = 1e6) {')
    log.push('  let size = 0')
    log.push('  const chunks = []')
    log.push('  for await (const chunk of req) {')
    log.push('    size += chunk.length')
    log.push('    if (size > maxSize) throw new Error("Body too large")')
    log.push('    chunks.push(chunk)')
    log.push('  }')
    log.push('  return Buffer.concat(chunks).toString()')
    log.push('}')

    log.push('')
    log.push('=== Routing ===')
    log.push('')
    log.push('const server = http.createServer(async (req, res) => {')
    log.push('  const url = new URL(req.url, `http://${req.headers.host}`)')
    log.push('')
    log.push('  if (req.method === "GET" && url.pathname === "/api/users") {')
    log.push('    res.writeHead(200, { "Content-Type": "application/json" })')
    log.push('    res.end(JSON.stringify([{ id: 1, name: "Alice" }]))')
    log.push('  }')
    log.push('  else if (req.method === "POST" && url.pathname === "/api/users") {')
    log.push('    const body = JSON.parse(await readBody(req))')
    log.push('    res.writeHead(201, { "Content-Type": "application/json" })')
    log.push('    res.end(JSON.stringify({ id: 2, ...body }))')
    log.push('  }')
    log.push('  else {')
    log.push('    res.writeHead(404)')
    log.push('    res.end("Not Found")')
    log.push('  }')
    log.push('})')

    log.push('')
    log.push('=== Streaming Response ===')
    log.push('')
    log.push('// Отправка файла через stream (эффективно!)')
    log.push('const server = http.createServer((req, res) => {')
    log.push('  const stream = fs.createReadStream("big-file.json")')
    log.push('  res.writeHead(200, { "Content-Type": "application/json" })')
    log.push('  pipeline(stream, res) // stream → HTTP response')
    log.push('})')

    // Simulation
    log.push('')
    log.push('=== Симуляция: HTTP Request/Response ===')
    log.push('')

    const requests = [
      {
        method: 'GET',
        path: '/api/users',
        headers: { 'Accept': 'application/json' },
        body: null,
        status: 200,
        response: '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]'
      },
      {
        method: 'POST',
        path: '/api/users',
        headers: { 'Content-Type': 'application/json' },
        body: '{"name":"Charlie","age":30}',
        status: 201,
        response: '{"id":3,"name":"Charlie","age":30}'
      },
      {
        method: 'GET',
        path: '/unknown',
        headers: {},
        body: null,
        status: 404,
        response: 'Not Found'
      },
    ]

    for (const req of requests) {
      log.push(`→ ${req.method} ${req.path}`)
      if (req.body) log.push(`  Body: ${req.body}`)
      log.push(`← ${req.status} ${req.status === 200 ? 'OK' : req.status === 201 ? 'Created' : 'Not Found'}`)
      log.push(`  ${req.response}`)
      log.push('')
    }

    log.push('=== IncomingMessage Properties ===')
    log.push('')
    log.push('  req.method      — HTTP метод (GET, POST, ...)')
    log.push('  req.url         — путь + query string')
    log.push('  req.headers     — заголовки (lowercase keys!)')
    log.push('  req.httpVersion — "1.1" или "2.0"')
    log.push('  req.socket      — underlying TCP socket')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: HTTP from Scratch</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 6.3: URL & DNS — Решение
// ============================================

export function Task6_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== URL & DNS ===')
    log.push('')

    log.push('=== URL API (WHATWG) ===')
    log.push('')
    log.push('const url = new URL("https://user:pass@example.com:8080/path?q=1#hash")')
    log.push('')

    // Simulate URL parsing
    const parts = {
      href: 'https://user:pass@example.com:8080/path?q=1#hash',
      protocol: 'https:',
      username: 'user',
      password: 'pass',
      hostname: 'example.com',
      port: '8080',
      host: 'example.com:8080',
      origin: 'https://example.com:8080',
      pathname: '/path',
      search: '?q=1',
      hash: '#hash',
    }

    log.push('URL breakdown:')
    log.push(`  protocol: "${parts.protocol}"`)
    log.push(`  username: "${parts.username}"`)
    log.push(`  password: "${parts.password}"`)
    log.push(`  hostname: "${parts.hostname}"`)
    log.push(`  port:     "${parts.port}"`)
    log.push(`  host:     "${parts.host}"`)
    log.push(`  origin:   "${parts.origin}"`)
    log.push(`  pathname: "${parts.pathname}"`)
    log.push(`  search:   "${parts.search}"`)
    log.push(`  hash:     "${parts.hash}"`)

    log.push('')
    log.push('=== URLSearchParams ===')
    log.push('')
    log.push('const params = new URLSearchParams("page=1&limit=10&sort=name")')
    log.push('')

    const params = new URLSearchParams('page=1&limit=10&sort=name')
    log.push(`  params.get("page")    → "${params.get('page')}"`)
    log.push(`  params.get("limit")   → "${params.get('limit')}"`)
    log.push(`  params.has("sort")    → ${params.has('sort')}`)
    log.push('')

    params.append('filter', 'active')
    params.set('page', '2')
    log.push('  params.append("filter", "active")')
    log.push('  params.set("page", "2")')
    log.push(`  params.toString() → "${params.toString()}"`)

    log.push('')
    log.push('  // Итерация')
    log.push('  for (const [key, value] of params) {')
    log.push('    console.log(key, "=", value)')
    log.push('  }')
    params.forEach((value, key) => {
      log.push(`    ${key} = ${value}`)
    })

    log.push('')
    log.push('=== Построение URL ===')
    log.push('')
    log.push('const url = new URL("/api/users", "https://example.com")')
    log.push('url.searchParams.set("page", "1")')
    log.push('url.searchParams.set("limit", "20")')
    log.push('console.log(url.href)')

    const builtUrl = new URL('/api/users', 'https://example.com')
    builtUrl.searchParams.set('page', '1')
    builtUrl.searchParams.set('limit', '20')
    log.push(`  → "${builtUrl.href}"`)

    log.push('')
    log.push('=== DNS Module ===')
    log.push('')
    log.push('const dns = require("dns")')
    log.push('const dnsPromises = require("dns/promises")')
    log.push('')
    log.push('// dns.lookup() — использует OS resolver (getaddrinfo)')
    log.push('// Учитывает /etc/hosts, может блокировать thread pool!')
    log.push('const { address, family } = await dnsPromises.lookup("example.com")')
    log.push('// → { address: "93.184.216.34", family: 4 }')
    log.push('')
    log.push('// dns.resolve() — прямой DNS запрос (не блокирует)')
    log.push('const addresses = await dnsPromises.resolve4("example.com")')
    log.push('// → ["93.184.216.34"]')
    log.push('')
    log.push('// Различные типы записей:')
    log.push('await dnsPromises.resolve4("example.com")   // A records')
    log.push('await dnsPromises.resolve6("example.com")   // AAAA records')
    log.push('await dnsPromises.resolveMx("example.com")  // MX records')
    log.push('await dnsPromises.resolveTxt("example.com") // TXT records')
    log.push('await dnsPromises.resolveNs("example.com")  // NS records')
    log.push('await dnsPromises.resolveCname("www.ex.com") // CNAME records')

    // Simulation
    log.push('')
    log.push('=== Симуляция: DNS Resolution ===')
    log.push('')

    const dnsRecords = [
      { domain: 'example.com', type: 'A', result: '93.184.216.34' },
      { domain: 'example.com', type: 'AAAA', result: '2606:2800:220:1:248:1893:25c8:1946' },
      { domain: 'example.com', type: 'MX', result: '10 mail.example.com' },
      { domain: 'example.com', type: 'NS', result: 'a.iana-servers.net, b.iana-servers.net' },
      { domain: 'example.com', type: 'TXT', result: 'v=spf1 -all' },
    ]

    for (const record of dnsRecords) {
      log.push(`  dns.resolve${record.type === 'A' ? '4' : record.type === 'AAAA' ? '6' : record.type}("${record.domain}")`)
      log.push(`    → ${record.result}`)
    }

    log.push('')
    log.push('=== dns.lookup() vs dns.resolve() ===')
    log.push('')
    log.push('┌─────────────┬────────────────────┬───────────────────┐')
    log.push('│             │ dns.lookup()        │ dns.resolve()     │')
    log.push('├─────────────┼────────────────────┼───────────────────┤')
    log.push('│ Механизм    │ OS resolver        │ DNS протокол      │')
    log.push('│ /etc/hosts  │ Учитывает          │ Игнорирует        │')
    log.push('│ Thread pool │ Использует (!)     │ Не использует     │')
    log.push('│ Кеширование │ OS cache           │ Нет по умолч.     │')
    log.push('│ Результат   │ Один адрес         │ Все записи        │')
    log.push('└─────────────┴────────────────────┴───────────────────┘')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: URL & DNS</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 6.4: HTTPS/TLS — Решение
// ============================================

export function Task6_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== HTTPS & TLS ===')
    log.push('')
    log.push('TLS (Transport Layer Security) — протокол шифрования поверх TCP.')
    log.push('HTTPS = HTTP + TLS. Модули: https, tls.')
    log.push('')

    log.push('=== Создание самоподписанного сертификата ===')
    log.push('')
    log.push('# Генерация ключа и сертификата (OpenSSL):')
    log.push('openssl req -x509 -newkey rsa:4096 \\')
    log.push('  -keyout key.pem -out cert.pem \\')
    log.push('  -days 365 -nodes \\')
    log.push('  -subj "/CN=localhost"')

    log.push('')
    log.push('=== HTTPS Server ===')
    log.push('')
    log.push('const https = require("https")')
    log.push('const fs = require("fs")')
    log.push('')
    log.push('const options = {')
    log.push('  key: fs.readFileSync("key.pem"),')
    log.push('  cert: fs.readFileSync("cert.pem"),')
    log.push('  // Опционально для mutual TLS:')
    log.push('  // ca: fs.readFileSync("ca-cert.pem"),')
    log.push('  // requestCert: true,')
    log.push('  // rejectUnauthorized: true')
    log.push('}')
    log.push('')
    log.push('const server = https.createServer(options, (req, res) => {')
    log.push('  res.writeHead(200)')
    log.push('  res.end("Hello Secure World!")')
    log.push('})')
    log.push('')
    log.push('server.listen(443)')

    log.push('')
    log.push('=== TLS Server (raw) ===')
    log.push('')
    log.push('const tls = require("tls")')
    log.push('')
    log.push('const server = tls.createServer({')
    log.push('  key: fs.readFileSync("key.pem"),')
    log.push('  cert: fs.readFileSync("cert.pem"),')
    log.push('  minVersion: "TLSv1.2",')
    log.push('  ciphers: "ECDHE-ECDSA-AES128-GCM-SHA256"')
    log.push('}, (socket) => {')
    log.push('  console.log("TLS connection:",')
    log.push('    socket.authorized ? "authorized" : "unauthorized")')
    log.push('  console.log("Protocol:", socket.getProtocol())')
    log.push('  console.log("Cipher:", socket.getCipher().name)')
    log.push('  socket.write("Welcome to secure server!")')
    log.push('  socket.end()')
    log.push('})')
    log.push('')
    log.push('server.listen(8443)')

    log.push('')
    log.push('=== TLS Client ===')
    log.push('')
    log.push('const socket = tls.connect({')
    log.push('  host: "localhost",')
    log.push('  port: 8443,')
    log.push('  ca: fs.readFileSync("cert.pem"), // trust self-signed')
    log.push('  // rejectUnauthorized: false // NEVER in production!')
    log.push('}, () => {')
    log.push('  console.log("Connected, authorized:", socket.authorized)')
    log.push('  socket.write("Hello!")')
    log.push('})')

    log.push('')
    log.push('=== HTTPS Request (Client) ===')
    log.push('')
    log.push('// Рекомендуется: fetch() (Node.js 18+)')
    log.push('const res = await fetch("https://api.example.com/data")')
    log.push('const data = await res.json()')
    log.push('')
    log.push('// Или https.get()/')
    log.push('https.get("https://api.example.com", (res) => {')
    log.push('  let data = ""')
    log.push('  res.on("data", chunk => data += chunk)')
    log.push('  res.on("end", () => console.log(JSON.parse(data)))')
    log.push('})')

    // Simulation
    log.push('')
    log.push('=== Симуляция: TLS Handshake ===')
    log.push('')

    const handshakeSteps = [
      { step: 1, from: 'Client', to: 'Server', msg: 'ClientHello (supported TLS versions, cipher suites)' },
      { step: 2, from: 'Server', to: 'Client', msg: 'ServerHello (chosen TLS 1.3, AES-256-GCM-SHA384)' },
      { step: 3, from: 'Server', to: 'Client', msg: 'Certificate (server\'s X.509 cert)' },
      { step: 4, from: 'Client', to: 'Client', msg: 'Verify certificate chain (CA → intermediate → server)' },
      { step: 5, from: 'Client', to: 'Server', msg: 'Key Exchange (ECDHE public key)' },
      { step: 6, from: 'Both', to: 'Both', msg: 'Derive session keys (symmetric encryption)' },
      { step: 7, from: 'Both', to: 'Both', msg: 'Finished — encrypted channel established!' },
    ]

    for (const s of handshakeSteps) {
      log.push(`  ${s.step}. [${s.from} → ${s.to}] ${s.msg}`)
    }

    log.push('')
    log.push('=== TLS Connection Info ===')
    log.push('')
    log.push('  Protocol:    TLSv1.3')
    log.push('  Cipher:      TLS_AES_256_GCM_SHA384')
    log.push('  Key Exchange: ECDHE (X25519)')
    log.push('  Certificate:  CN=localhost, RSA 4096-bit')
    log.push('  Valid:        2024-01-01 → 2025-01-01')
    log.push('  Authorized:   true (self-signed, trusted via ca option)')

    log.push('')
    log.push('=== Security Best Practices ===')
    log.push('')
    log.push('  ✅ Минимум TLS 1.2 (minVersion: "TLSv1.2")')
    log.push('  ✅ Никогда rejectUnauthorized: false в production')
    log.push('  ✅ Регулярно обновляйте сертификаты')
    log.push('  ✅ Используйте Let\'s Encrypt для бесплатных сертификатов')
    log.push('  ✅ Включайте HSTS (Strict-Transport-Security header)')
    log.push('  ❌ Не храните приватные ключи в репозитории')
    log.push('  ❌ Не отключайте проверку сертификатов')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.4: HTTPS/TLS</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
