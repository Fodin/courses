# 🔥 Level 0: HTTP from Scratch

## 🎯 Why Understand HTTP Without Frameworks

Before using Express or Fastify, it's important to understand what happens "under the hood." The `http` module in Node.js is the foundation upon which all HTTP frameworks are built. Understanding low-level HTTP helps you:

- Debug complex request issues
- Understand what frameworks do for you
- Write performant server code
- Work correctly with data streams

## 🔥 The http Module and createServer

Node.js provides a built-in `http` module for creating HTTP servers without external dependencies.

```typescript
import http from 'node:http'

const server = http.createServer((req, res) => {
  // req: http.IncomingMessage -- incoming request (Readable Stream)
  // res: http.ServerResponse  -- outgoing response (Writable Stream)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Hello, World!' }))
})

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

### The Request Object (IncomingMessage)

```typescript
req.method      // 'GET', 'POST', 'PUT', 'DELETE'
req.url         // '/api/users?page=2'
req.headers     // { 'content-type': 'application/json', ... }
req.httpVersion // '1.1'

// req is a Readable Stream!
let body = ''
req.on('data', (chunk) => { body += chunk })
req.on('end', () => { /* body is ready */ })
```

### The Response Object (ServerResponse)

```typescript
res.writeHead(201, {
  'Content-Type': 'application/json',
  'Location': '/api/users/42'
})
res.end(JSON.stringify({ id: 42 }))
```

## 🔥 Manual Routing

Without a framework, routing means manually parsing the URL and request method.

```typescript
const url = new URL(req.url!, `http://${req.headers.host}`)
const path = url.pathname
const method = req.method

if (method === 'GET' && path === '/api/users') {
  return sendJson(res, 200, await getUsers())
}

const userMatch = path.match(/^\/api\/users\/(\d+)$/)
if (userMatch) {
  const id = parseInt(userMatch[1])
  if (method === 'GET') return sendJson(res, 200, await getUser(id))
}

sendJson(res, 404, { error: 'Not Found' })
```

## 🔥 Static File Serving

```typescript
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
}

function serveStatic(req, res) {
  const publicDir = path.join(__dirname, 'public')
  const filePath = path.resolve(publicDir, '.' + req.url!)

  // Path traversal protection
  if (!filePath.startsWith(publicDir)) {
    return res.writeHead(403).end('Forbidden')
  }

  const stream = fs.createReadStream(filePath)
  stream.on('open', () => {
    res.writeHead(200, { 'Content-Type': getMimeType(filePath) })
    stream.pipe(res)
  })
  stream.on('error', () => res.writeHead(404).end('Not Found'))
}
```

## 🔥 POST Body Parsing

```typescript
function parseBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let totalSize = 0

    req.on('data', (chunk: Buffer) => {
      totalSize += chunk.length
      if (totalSize > 1e6) { req.destroy(); reject(new Error('Too large')) }
      chunks.push(chunk)
    })

    req.on('end', () => {
      const body = Buffer.concat(chunks).toString()
      const ct = req.headers['content-type'] || ''
      if (ct.includes('application/json')) resolve(JSON.parse(body))
      else if (ct.includes('x-www-form-urlencoded')) resolve(Object.fromEntries(new URLSearchParams(body)))
      else resolve(body)
    })
  })
}
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Not ending the response
```typescript
// ❌ Bad: forgot res.end()
res.write('Hello')  // Request hangs forever!

// ✅ Good:
res.end('Hello')
```

### Mistake 2: Sending response twice
```typescript
// ❌ Bad:
if (error) res.end('Bad Request')
res.end('OK')  // Error: write after end

// ✅ Good: use return
if (error) return res.end('Bad Request')
res.end('OK')
```

### Mistake 3: readFileSync for file serving
```typescript
// ❌ Bad: entire file in memory
const data = fs.readFileSync('video.mp4')
res.end(data)

// ✅ Good: streaming
fs.createReadStream('video.mp4').pipe(res)
```

## 💡 Best Practices

1. Always set Content-Type headers
2. Use correct HTTP status codes
3. Use streams for file transfers
4. Limit incoming body size
5. Handle stream errors
6. Return JSON with correct Content-Type for APIs
7. Log incoming requests (method + URL + status + response time)
