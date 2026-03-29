# 🔥 Уровень 0: HTTP с нуля

## 🎯 Зачем понимать HTTP без фреймворков

Прежде чем использовать Express или Fastify, важно понять, что происходит "под капотом". Модуль `http` в Node.js -- это фундамент, на котором построены все HTTP-фреймворки. Понимание низкоуровневой работы HTTP поможет:

- Отлаживать сложные проблемы с запросами
- Понимать, что делают фреймворки за вас
- Писать производительный серверный код
- Правильно работать с потоками данных

## 🔥 Модуль http и createServer

Node.js предоставляет встроенный модуль `http` для создания HTTP-серверов без внешних зависимостей.

```typescript
import http from 'node:http'

const server = http.createServer((req, res) => {
  // req: http.IncomingMessage -- входящий запрос (Readable Stream)
  // res: http.ServerResponse  -- исходящий ответ (Writable Stream)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Hello, World!' }))
})

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

### Объект Request (IncomingMessage)

```typescript
// Основные свойства:
req.method      // 'GET', 'POST', 'PUT', 'DELETE'
req.url         // '/api/users?page=2'
req.headers     // { 'content-type': 'application/json', ... }
req.httpVersion // '1.1'

// req -- это Readable Stream!
// Тело запроса приходит чанками:
let body = ''
req.on('data', (chunk) => { body += chunk })
req.on('end', () => { /* body готов */ })
```

### Объект Response (ServerResponse)

```typescript
// Установка статуса и заголовков:
res.statusCode = 200
res.setHeader('Content-Type', 'application/json')

// Или всё сразу:
res.writeHead(201, {
  'Content-Type': 'application/json',
  'Location': '/api/users/42'
})

// Отправка тела ответа:
res.write('chunk 1')  // Можно отправлять чанками
res.write('chunk 2')
res.end()              // Завершить ответ

// Или сразу:
res.end(JSON.stringify({ id: 42 }))
```

## 🔥 Маршрутизация вручную

Без фреймворка маршрутизация -- это разбор URL и метода запроса вручную.

### Парсинг URL

```typescript
const url = new URL(req.url!, `http://${req.headers.host}`)

url.pathname      // '/api/users/42'
url.searchParams  // URLSearchParams { page: '2', limit: '10' }
```

### Простой роутер

```typescript
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`)
  const path = url.pathname
  const method = req.method

  // Статический маршрут
  if (method === 'GET' && path === '/api/users') {
    return sendJson(res, 200, await getUsers())
  }

  // Динамический маршрут
  const userMatch = path.match(/^\/api\/users\/(\d+)$/)
  if (userMatch) {
    const id = parseInt(userMatch[1])
    if (method === 'GET') return sendJson(res, 200, await getUser(id))
    if (method === 'PUT') return sendJson(res, 200, await updateUser(id, body))
    if (method === 'DELETE') { await deleteUser(id); return sendJson(res, 204) }
  }

  // 404
  sendJson(res, 404, { error: 'Not Found' })
})

function sendJson(res: http.ServerResponse, status: number, data?: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(data ? JSON.stringify(data) : '')
}
```

## 🔥 Раздача статических файлов

### Определение Content-Type

```typescript
import path from 'node:path'
import fs from 'node:fs'

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath)
  return MIME_TYPES[ext] || 'application/octet-stream'
}
```

### Потоковая раздача файлов

```typescript
function serveStatic(req: http.IncomingMessage, res: http.ServerResponse) {
  const publicDir = path.join(__dirname, 'public')
  const filePath = path.join(publicDir, req.url || '/')

  // Защита от path traversal (../../etc/passwd)
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403)
    return res.end('Forbidden')
  }

  const stream = fs.createReadStream(filePath)

  stream.on('open', () => {
    res.writeHead(200, { 'Content-Type': getMimeType(filePath) })
    stream.pipe(res)  // Потоковая передача!
  })

  stream.on('error', (err) => {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      res.writeHead(404)
      res.end('Not Found')
    } else {
      res.writeHead(500)
      res.end('Internal Server Error')
    }
  })
}
```

📌 **Важно:** используйте `fs.createReadStream` + `pipe`, а не `fs.readFileSync`. При потоковой передаче файл не загружается целиком в память, что критично для больших файлов.

## 🔥 Парсинг тела POST-запроса

HTTP-тело приходит чанками (chunks). Нужно собрать все чанки и распарсить.

```typescript
function parseBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let totalSize = 0
    const MAX_SIZE = 1024 * 1024 // 1 МБ

    req.on('data', (chunk: Buffer) => {
      totalSize += chunk.length
      if (totalSize > MAX_SIZE) {
        req.destroy()
        reject(new Error('Payload too large'))
        return
      }
      chunks.push(chunk)
    })

    req.on('end', () => {
      const body = Buffer.concat(chunks).toString()
      const contentType = req.headers['content-type'] || ''

      if (contentType.includes('application/json')) {
        try {
          resolve(JSON.parse(body))
        } catch {
          reject(new Error('Invalid JSON'))
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        resolve(Object.fromEntries(new URLSearchParams(body)))
      } else {
        resolve(body)
      }
    })

    req.on('error', reject)
  })
}
```

### Использование:

```typescript
if (method === 'POST' && path === '/api/users') {
  try {
    const body = await parseBody(req)
    const user = await createUser(body)
    sendJson(res, 201, user)
  } catch (err) {
    if (err.message === 'Invalid JSON') {
      sendJson(res, 400, { error: 'Invalid JSON body' })
    } else if (err.message === 'Payload too large') {
      sendJson(res, 413, { error: 'Payload too large' })
    } else {
      sendJson(res, 500, { error: 'Internal Server Error' })
    }
  }
}
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Не завершают ответ

```typescript
// ❌ Плохо: забыли res.end()
server.createServer((req, res) => {
  res.writeHead(200)
  res.write('Hello')
  // Запрос "висит" бесконечно!
})

// ✅ Хорошо:
server.createServer((req, res) => {
  res.writeHead(200)
  res.end('Hello')
})
```

### Ошибка 2: Отправляют ответ дважды

```typescript
// ❌ Плохо:
if (error) {
  res.writeHead(400)
  res.end('Bad Request')
}
// Код продолжает выполняться!
res.writeHead(200)
res.end('OK')  // Error: write after end

// ✅ Хорошо: используйте return
if (error) {
  res.writeHead(400)
  return res.end('Bad Request')
}
res.writeHead(200)
res.end('OK')
```

### Ошибка 3: readFileSync для раздачи файлов

```typescript
// ❌ Плохо: весь файл в памяти
const data = fs.readFileSync('video.mp4')  // 2 ГБ в RAM!
res.end(data)

// ✅ Хорошо: потоковая передача
fs.createReadStream('video.mp4').pipe(res)
```

### Ошибка 4: Нет защиты от path traversal

```typescript
// ❌ Плохо:
const filePath = path.join(publicDir, req.url!)
// GET /../../../etc/passwd -> утечка файлов!

// ✅ Хорошо: проверяем что путь внутри publicDir
const filePath = path.resolve(publicDir, '.' + req.url!)
if (!filePath.startsWith(publicDir)) {
  return sendJson(res, 403, { error: 'Forbidden' })
}
```

### Ошибка 5: Нет ограничения размера body

```typescript
// ❌ Плохо: принимаем любой размер body
req.on('data', (chunk) => { body += chunk })

// ✅ Хорошо: ограничиваем размер
req.on('data', (chunk) => {
  totalSize += chunk.length
  if (totalSize > 1e6) { // 1 МБ
    req.destroy()
    res.writeHead(413).end('Payload Too Large')
  }
  body += chunk
})
```

## 💡 Best Practices

1. **Всегда устанавливайте Content-Type** -- без него браузер может неправильно интерпретировать ответ
2. **Используйте правильные статус-коды** -- 201 для создания, 204 для удаления, 400 для ошибок валидации
3. **Используйте потоки (streams)** для передачи файлов и больших ответов
4. **Ограничивайте размер входящих данных** для защиты от DoS
5. **Обрабатывайте ошибки** в event listener'ах (`stream.on('error', ...)`)
6. **Всегда возвращайте JSON** с правильным Content-Type для API
7. **Логируйте входящие запросы** хотя бы метод + URL + статус + время ответа
