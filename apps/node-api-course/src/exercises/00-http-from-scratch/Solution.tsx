import { useState } from 'react'

// ============================================
// Задание 0.1: createServer — Решение
// ============================================

export function Task0_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== http.createServer — основа Node.js API ===')
    log.push('')

    // Simulate creating a server
    log.push('// Создание HTTP-сервера')
    log.push('const http = require("http")')
    log.push('')
    log.push('const server = http.createServer((req, res) => {')
    log.push('  // req — объект IncomingMessage (читаемый поток)')
    log.push('  // res — объект ServerResponse (записываемый поток)')
    log.push('})')
    log.push('')

    // Simulate request object
    log.push('--- Объект Request (IncomingMessage) ---')
    const mockReq = {
      method: 'GET',
      url: '/api/users?page=1',
      headers: {
        host: 'localhost:3000',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0',
      },
      httpVersion: '1.1',
    }
    log.push(`req.method: "${mockReq.method}"`)
    log.push(`req.url: "${mockReq.url}"`)
    log.push(`req.httpVersion: "${mockReq.httpVersion}"`)
    log.push(`req.headers: ${JSON.stringify(mockReq.headers, null, 2)}`)
    log.push('')

    // Simulate response object
    log.push('--- Объект Response (ServerResponse) ---')
    log.push('')
    log.push('// Установка статус-кода и заголовков')
    log.push('res.writeHead(200, {')
    log.push('  "Content-Type": "application/json",')
    log.push('  "X-Request-Id": "abc-123"')
    log.push('})')
    log.push('')

    // Common status codes
    log.push('--- Коды ответа HTTP ---')
    const statusCodes = [
      { code: 200, text: 'OK', desc: 'Успешный запрос' },
      { code: 201, text: 'Created', desc: 'Ресурс создан' },
      { code: 204, text: 'No Content', desc: 'Успех без тела ответа' },
      { code: 400, text: 'Bad Request', desc: 'Некорректный запрос' },
      { code: 401, text: 'Unauthorized', desc: 'Требуется аутентификация' },
      { code: 403, text: 'Forbidden', desc: 'Доступ запрещён' },
      { code: 404, text: 'Not Found', desc: 'Ресурс не найден' },
      { code: 500, text: 'Internal Server Error', desc: 'Ошибка сервера' },
    ]
    for (const s of statusCodes) {
      log.push(`  ${s.code} ${s.text} — ${s.desc}`)
    }
    log.push('')

    // Simulate full request-response cycle
    log.push('=== Полный цикл запрос-ответ ===')
    log.push('')
    log.push('>> GET /api/health HTTP/1.1')
    log.push('>> Host: localhost:3000')
    log.push('')
    log.push('<< HTTP/1.1 200 OK')
    log.push('<< Content-Type: application/json')
    log.push('<< Content-Length: 27')
    log.push('<< ')
    log.push('<< {"status":"ok","uptime":42}')
    log.push('')

    log.push('// Запуск сервера')
    log.push('server.listen(3000, () => {')
    log.push('  console.log("Server running on http://localhost:3000")')
    log.push('})')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: http.createServer</h2>
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
// Задание 0.2: Ручная маршрутизация — Решение
// ============================================

export function Task0_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Ручная маршрутизация на чистом http ===')
    log.push('')

    // Simulate URL parsing
    log.push('--- Парсинг URL ---')
    const testUrl = '/api/users/42?fields=name,email&sort=name'
    log.push(`URL: "${testUrl}"`)
    log.push('')

    const urlObj = new URL(testUrl, 'http://localhost:3000')
    log.push(`pathname: "${urlObj.pathname}"`)
    log.push(`searchParams: ${JSON.stringify(Object.fromEntries(urlObj.searchParams))}`)
    log.push('')

    // Extract route params
    log.push('--- Извлечение параметров маршрута ---')
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    log.push(`Сегменты пути: [${pathParts.map(p => `"${p}"`).join(', ')}]`)
    log.push(`Ресурс: "${pathParts[1]}", ID: "${pathParts[2]}"`)
    log.push('')

    // Simulate router
    log.push('--- Таблица маршрутов ---')
    log.push('')

    interface Route {
      method: string
      pattern: string
      handler: string
    }
    const routes: Route[] = [
      { method: 'GET', pattern: '/api/users', handler: 'getAllUsers' },
      { method: 'GET', pattern: '/api/users/:id', handler: 'getUserById' },
      { method: 'POST', pattern: '/api/users', handler: 'createUser' },
      { method: 'PUT', pattern: '/api/users/:id', handler: 'updateUser' },
      { method: 'DELETE', pattern: '/api/users/:id', handler: 'deleteUser' },
    ]

    for (const r of routes) {
      log.push(`  ${r.method.padEnd(7)} ${r.pattern.padEnd(20)} -> ${r.handler}()`)
    }
    log.push('')

    // Simulate requests
    log.push('=== Симуляция маршрутизации ===')
    log.push('')

    const requests = [
      { method: 'GET', url: '/api/users' },
      { method: 'GET', url: '/api/users/42' },
      { method: 'POST', url: '/api/users' },
      { method: 'GET', url: '/api/posts' },
    ]

    for (const req of requests) {
      log.push(`>> ${req.method} ${req.url}`)

      const urlPath = new URL(req.url, 'http://localhost:3000').pathname
      const parts = urlPath.split('/').filter(Boolean)

      if (parts[0] === 'api' && parts[1] === 'users') {
        if (parts.length === 2 && req.method === 'GET') {
          log.push('<< 200 OK — getAllUsers()')
        } else if (parts.length === 2 && req.method === 'POST') {
          log.push('<< 201 Created — createUser()')
        } else if (parts.length === 3 && req.method === 'GET') {
          log.push(`<< 200 OK — getUserById(${parts[2]})`)
        } else {
          log.push('<< 405 Method Not Allowed')
        }
      } else {
        log.push('<< 404 Not Found — маршрут не найден')
      }
      log.push('')
    }

    // Query parameters
    log.push('--- Обработка Query Parameters ---')
    const queryUrl = '/api/users?page=2&limit=10&sort=-createdAt'
    const qObj = new URL(queryUrl, 'http://localhost:3000')
    log.push(`URL: "${queryUrl}"`)
    log.push(`page: ${qObj.searchParams.get('page')}`)
    log.push(`limit: ${qObj.searchParams.get('limit')}`)
    log.push(`sort: ${qObj.searchParams.get('sort')}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Ручная маршрутизация</h2>
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
// Задание 0.3: Раздача статики — Решение
// ============================================

export function Task0_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Раздача статических файлов ===')
    log.push('')

    // MIME types
    log.push('--- Content-Type по расширению файла ---')
    const mimeTypes: Record<string, string> = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.txt': 'text/plain; charset=utf-8',
      '.pdf': 'application/pdf',
    }

    for (const [ext, type] of Object.entries(mimeTypes)) {
      log.push(`  ${ext.padEnd(8)} -> ${type}`)
    }
    log.push('')

    // Simulate file serving
    log.push('--- Симуляция раздачи файлов ---')
    log.push('')

    const fileRequests = [
      { url: '/index.html', exists: true, size: 2048 },
      { url: '/styles/main.css', exists: true, size: 4096 },
      { url: '/app.js', exists: true, size: 8192 },
      { url: '/favicon.ico', exists: true, size: 1024 },
      { url: '/not-found.html', exists: false, size: 0 },
      { url: '/../../../etc/passwd', exists: false, size: 0 },
    ]

    for (const file of fileRequests) {
      log.push(`>> GET ${file.url}`)

      // Security: path traversal check
      if (file.url.includes('..')) {
        log.push('<< 403 Forbidden — обнаружена попытка path traversal!')
        log.push('   Защита: path.resolve() + проверка что путь внутри publicDir')
        log.push('')
        continue
      }

      if (!file.exists) {
        log.push('<< 404 Not Found')
        log.push('   Файл не существует на сервере')
        log.push('')
        continue
      }

      const ext = '.' + file.url.split('.').pop()
      const contentType = mimeTypes[ext] || 'application/octet-stream'

      log.push(`<< 200 OK`)
      log.push(`   Content-Type: ${contentType}`)
      log.push(`   Content-Length: ${file.size}`)
      log.push(`   (файл отправлен через fs.createReadStream — потоковая передача)`)
      log.push('')
    }

    // Streaming explanation
    log.push('--- Потоковая передача файлов ---')
    log.push('')
    log.push('// Плохо: загрузка всего файла в память')
    log.push('const data = fs.readFileSync("large-file.zip")  // 500 МБ в RAM!')
    log.push('res.end(data)')
    log.push('')
    log.push('// Хорошо: потоковая передача')
    log.push('const stream = fs.createReadStream("large-file.zip")')
    log.push('stream.pipe(res)  // данные передаются чанками, ~64 КБ за раз')
    log.push('')
    log.push('// stream.pipe(res) автоматически:')
    log.push('//   1. Читает чанк из файла')
    log.push('//   2. Записывает в response')
    log.push('//   3. Управляет backpressure')
    log.push('//   4. Закрывает response по окончании')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.3: Раздача статических файлов</h2>
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
// Задание 0.4: Парсинг тела POST-запроса — Решение
// ============================================

export function Task0_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Парсинг тела POST-запроса ===')
    log.push('')

    // Chunked transfer
    log.push('--- Чанковое чтение тела запроса ---')
    log.push('')
    log.push('// HTTP тело приходит чанками (chunks)')
    log.push('// Нужно собрать все чанки в буфер')
    log.push('')
    log.push('let body = ""')
    log.push('req.on("data", (chunk) => {')
    log.push('  body += chunk.toString()')
    log.push('  // Защита от слишком больших тел:')
    log.push('  if (body.length > 1e6) req.destroy()')
    log.push('})')
    log.push('req.on("end", () => {')
    log.push('  const parsed = JSON.parse(body)')
    log.push('})')
    log.push('')

    // Simulate JSON parsing
    log.push('--- Парсинг JSON body ---')
    log.push('')
    const jsonBody = '{"name":"John","email":"john@example.com","age":30}'
    log.push(`>> POST /api/users HTTP/1.1`)
    log.push(`>> Content-Type: application/json`)
    log.push(`>> Content-Length: ${jsonBody.length}`)
    log.push(`>> `)
    log.push(`>> ${jsonBody}`)
    log.push('')

    try {
      const parsed = JSON.parse(jsonBody)
      log.push('Парсинг успешен:')
      log.push(`  name: "${parsed.name}"`)
      log.push(`  email: "${parsed.email}"`)
      log.push(`  age: ${parsed.age}`)
    } catch {
      log.push('Ошибка парсинга JSON')
    }
    log.push('')

    // URL-encoded form data
    log.push('--- Парсинг URL-encoded form data ---')
    log.push('')
    const formBody = 'username=admin&password=secret123&remember=true'
    log.push(`>> POST /login HTTP/1.1`)
    log.push(`>> Content-Type: application/x-www-form-urlencoded`)
    log.push(`>> `)
    log.push(`>> ${formBody}`)
    log.push('')

    const formParams = new URLSearchParams(formBody)
    log.push('Парсинг через URLSearchParams:')
    for (const [key, value] of formParams) {
      log.push(`  ${key}: "${value}"`)
    }
    log.push('')

    // Content-Type detection
    log.push('--- Определение типа тела по Content-Type ---')
    log.push('')
    const contentTypes = [
      { type: 'application/json', parser: 'JSON.parse(body)' },
      { type: 'application/x-www-form-urlencoded', parser: 'new URLSearchParams(body)' },
      { type: 'text/plain', parser: 'body (строка как есть)' },
      { type: 'multipart/form-data', parser: 'Требуется специальный парсер (busboy, formidable)' },
    ]

    for (const ct of contentTypes) {
      log.push(`  ${ct.type}`)
      log.push(`    -> ${ct.parser}`)
      log.push('')
    }

    // Error handling
    log.push('--- Обработка ошибок парсинга ---')
    log.push('')
    const invalidJson = '{name: invalid}'
    log.push(`Тело запроса: "${invalidJson}"`)
    try {
      JSON.parse(invalidJson)
    } catch (e) {
      log.push(`Ошибка: ${(e as Error).message}`)
      log.push('Ответ: 400 Bad Request — Invalid JSON')
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.4: Парсинг тела POST-запроса</h2>
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
