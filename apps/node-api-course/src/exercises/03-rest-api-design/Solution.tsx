import { useState } from 'react'

// ============================================
// Задание 3.1: CRUD Endpoints — Решение
// ============================================

export function Task3_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== REST API: CRUD Endpoints ===')
    log.push('')

    // HTTP methods mapping
    log.push('--- Соответствие HTTP-методов и CRUD ---')
    log.push('')
    const crudMap = [
      { method: 'POST', crud: 'Create', path: '/api/users', status: '201 Created', desc: 'Создать ресурс' },
      { method: 'GET', crud: 'Read', path: '/api/users', status: '200 OK', desc: 'Список ресурсов' },
      { method: 'GET', crud: 'Read', path: '/api/users/:id', status: '200 OK', desc: 'Один ресурс' },
      { method: 'PUT', crud: 'Update', path: '/api/users/:id', status: '200 OK', desc: 'Полная замена' },
      { method: 'PATCH', crud: 'Update', path: '/api/users/:id', status: '200 OK', desc: 'Частичное обновление' },
      { method: 'DELETE', crud: 'Delete', path: '/api/users/:id', status: '204 No Content', desc: 'Удаление' },
    ]

    for (const r of crudMap) {
      log.push(`  ${r.method.padEnd(7)} ${r.path.padEnd(18)} ${r.status.padEnd(18)} // ${r.desc}`)
    }
    log.push('')

    // Response format conventions
    log.push('--- Формат ответа (Envelope Pattern) ---')
    log.push('')

    // Single resource
    log.push('GET /api/users/42')
    log.push(JSON.stringify({
      data: { id: 42, name: 'John', email: 'john@example.com', createdAt: '2024-01-15T10:30:00Z' },
    }, null, 2))
    log.push('')

    // Collection
    log.push('GET /api/users')
    log.push(JSON.stringify({
      data: [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ],
      meta: { total: 150, page: 1, perPage: 20, totalPages: 8 },
    }, null, 2))
    log.push('')

    // Error response
    log.push('POST /api/users (validation error)')
    log.push(JSON.stringify({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: [
          { field: 'email', message: 'Invalid email format' },
          { field: 'name', message: 'Name is required' },
        ],
      },
    }, null, 2))
    log.push('')

    // Status codes
    log.push('--- Правильные статус-коды ---')
    log.push('')
    log.push('  Успех:')
    log.push('  200 — запрос выполнен, есть тело ответа')
    log.push('  201 — ресурс создан + Location header')
    log.push('  204 — успех без тела (DELETE)')
    log.push('')
    log.push('  Ошибки клиента:')
    log.push('  400 — невалидный запрос')
    log.push('  401 — не аутентифицирован')
    log.push('  403 — нет прав')
    log.push('  404 — ресурс не найден')
    log.push('  409 — конфликт (дубликат)')
    log.push('  422 — невалидные данные')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: CRUD Endpoints</h2>
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
// Задание 3.2: Пагинация — Решение
// ============================================

export function Task3_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== REST API: Пагинация ===')
    log.push('')

    // Offset-based
    log.push('--- Offset-based пагинация ---')
    log.push('')
    log.push('GET /api/users?page=3&per_page=20')
    log.push('')
    log.push('SQL: SELECT * FROM users ORDER BY id LIMIT 20 OFFSET 40')
    log.push('')
    log.push(JSON.stringify({
      data: [{ id: 41, name: '...' }, { id: 42, name: '...' }],
      meta: { total: 150, page: 3, perPage: 20, totalPages: 8 },
    }, null, 2))
    log.push('')
    log.push('Заголовки:')
    log.push('  Link: <api/users?page=1&per_page=20>; rel="first",')
    log.push('        <api/users?page=2&per_page=20>; rel="prev",')
    log.push('        <api/users?page=4&per_page=20>; rel="next",')
    log.push('        <api/users?page=8&per_page=20>; rel="last"')
    log.push('  X-Total-Count: 150')
    log.push('')

    // Cursor-based
    log.push('--- Cursor-based пагинация ---')
    log.push('')
    log.push('GET /api/users?after=eyJpZCI6NDB9&limit=20')
    log.push('')
    log.push('// cursor = base64("{"id":40}")')
    log.push('SQL: SELECT * FROM users WHERE id > 40 ORDER BY id LIMIT 21')
    log.push('  (запрашиваем limit+1, чтобы понять, есть ли следующая страница)')
    log.push('')
    log.push(JSON.stringify({
      data: [{ id: 41, name: '...' }, { id: 42, name: '...' }],
      meta: {
        hasMore: true,
        nextCursor: 'eyJpZCI6NjB9',
        prevCursor: 'eyJpZCI6NDF9',
      },
    }, null, 2))
    log.push('')

    // Comparison
    log.push('--- Сравнение подходов ---')
    log.push('')
    log.push('  Offset-based:')
    log.push('    + Можно перейти на любую страницу')
    log.push('    + Знаем totalPages')
    log.push('    - Медленно на больших offset (OFFSET 100000)')
    log.push('    - Пропуск/дублирование при вставках')
    log.push('')
    log.push('  Cursor-based:')
    log.push('    + Стабильно при вставках/удалениях')
    log.push('    + Одинаково быстро на любой странице')
    log.push('    - Нельзя перейти на произвольную страницу')
    log.push('    - Сложнее реализовать')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: Пагинация</h2>
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
// Задание 3.3: Сортировка и фильтрация — Решение
// ============================================

export function Task3_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== REST API: Сортировка и фильтрация ===')
    log.push('')

    // Sorting
    log.push('--- Сортировка ---')
    log.push('')
    log.push('GET /api/users?sort=-createdAt,name')
    log.push('')
    log.push('Конвенция: минус = DESC, без минуса = ASC')
    log.push('SQL: ORDER BY created_at DESC, name ASC')
    log.push('')

    const sortExamples = [
      { query: 'sort=name', sql: 'ORDER BY name ASC' },
      { query: 'sort=-createdAt', sql: 'ORDER BY created_at DESC' },
      { query: 'sort=-role,name', sql: 'ORDER BY role DESC, name ASC' },
    ]

    for (const ex of sortExamples) {
      log.push(`  ${ex.query.padEnd(25)} -> ${ex.sql}`)
    }
    log.push('')

    // Filtering
    log.push('--- Фильтрация ---')
    log.push('')

    const filterExamples = [
      { query: 'filter[status]=active', sql: "WHERE status = 'active'" },
      { query: 'filter[age][gte]=18', sql: 'WHERE age >= 18' },
      { query: 'filter[role][in]=admin,editor', sql: "WHERE role IN ('admin','editor')" },
      { query: 'filter[name][like]=John', sql: "WHERE name LIKE '%John%'" },
      { query: 'search=john', sql: "WHERE name ILIKE '%john%' OR email ILIKE '%john%'" },
    ]

    for (const ex of filterExamples) {
      log.push(`  ${ex.query}`)
      log.push(`    -> ${ex.sql}`)
      log.push('')
    }

    // Sparse fieldsets
    log.push('--- Sparse Fieldsets (выбор полей) ---')
    log.push('')
    log.push('GET /api/users?fields=id,name,email')
    log.push('')
    log.push('SQL: SELECT id, name, email FROM users')
    log.push('')
    log.push('Без fields:')
    log.push(JSON.stringify({ id: 1, name: 'John', email: 'j@e.com', bio: '...', avatar: '...', createdAt: '...' }))
    log.push('')
    log.push('С fields=id,name,email:')
    log.push(JSON.stringify({ id: 1, name: 'John', email: 'j@e.com' }))
    log.push('')

    // Combined example
    log.push('--- Комбинированный запрос ---')
    log.push('')
    log.push('GET /api/users?filter[status]=active&sort=-createdAt&fields=id,name&page=1&per_page=10')
    log.push('')
    log.push('SQL: SELECT id, name FROM users')
    log.push("     WHERE status = 'active'")
    log.push('     ORDER BY created_at DESC')
    log.push('     LIMIT 10 OFFSET 0')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: Сортировка и фильтрация</h2>
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
// Задание 3.4: Версионирование API — Решение
// ============================================

export function Task3_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== REST API: Версионирование ===')
    log.push('')

    // URL versioning
    log.push('--- 1. URL Versioning (самый популярный) ---')
    log.push('')
    log.push('GET /api/v1/users -> UserV1Controller')
    log.push('GET /api/v2/users -> UserV2Controller')
    log.push('')
    log.push('app.use("/api/v1", v1Router)')
    log.push('app.use("/api/v2", v2Router)')
    log.push('')
    log.push('+ Простой и понятный')
    log.push('+ Легко проксировать и кэшировать')
    log.push('- URL меняется при новой версии')
    log.push('- Дублирование кода между версиями')
    log.push('')

    // Header versioning
    log.push('--- 2. Header Versioning ---')
    log.push('')
    log.push('GET /api/users')
    log.push('X-API-Version: 2')
    log.push('')
    log.push('// Middleware:')
    log.push('function versionRouter(req, res, next) {')
    log.push('  const version = req.headers["x-api-version"] || "1"')
    log.push('  req.apiVersion = parseInt(version)')
    log.push('  next()')
    log.push('}')
    log.push('')
    log.push('+ URL остаётся стабильным')
    log.push('- Версию не видно в URL')
    log.push('- Сложнее тестировать в браузере')
    log.push('')

    // Content negotiation
    log.push('--- 3. Content Negotiation ---')
    log.push('')
    log.push('GET /api/users')
    log.push('Accept: application/vnd.myapi.v2+json')
    log.push('')
    log.push('+ Следует HTTP-стандартам')
    log.push('- Сложный заголовок')
    log.push('- Труднее отлаживать')
    log.push('')

    // Simulate version routing
    log.push('=== Симуляция маршрутизации по версиям ===')
    log.push('')

    const requests = [
      { url: '/api/v1/users/42', version: 'v1' },
      { url: '/api/v2/users/42', version: 'v2' },
    ]

    for (const req of requests) {
      log.push(`>> GET ${req.url}`)
      if (req.version === 'v1') {
        log.push('<< 200 OK')
        log.push(JSON.stringify({ id: 42, name: 'John', email: 'john@example.com' }))
      } else {
        log.push('<< 200 OK')
        log.push(JSON.stringify({
          id: 42,
          fullName: 'John Doe',
          contacts: { email: 'john@example.com' },
          links: { self: '/api/v2/users/42', posts: '/api/v2/users/42/posts' },
        }))
      }
      log.push('')
    }

    // Deprecation strategy
    log.push('--- Стратегия deprecation ---')
    log.push('')
    log.push('// Заголовки для устаревшей версии:')
    log.push('Deprecation: true')
    log.push('Sunset: Sat, 01 Jun 2025 00:00:00 GMT')
    log.push('Link: </api/v2/users>; rel="successor-version"')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.4: Версионирование API</h2>
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
