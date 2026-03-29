import { useState } from 'react'

// ============================================
// Задание 1.1: Маршруты и Router — Решение
// ============================================

export function Task1_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Express: Маршруты и Router ===')
    log.push('')

    // Basic routes
    log.push('--- Базовые методы маршрутизации ---')
    log.push('')
    log.push('const express = require("express")')
    log.push('const app = express()')
    log.push('')

    const routes = [
      { method: 'GET', path: '/api/users', desc: 'Получить список пользователей' },
      { method: 'GET', path: '/api/users/:id', desc: 'Получить пользователя по ID' },
      { method: 'POST', path: '/api/users', desc: 'Создать пользователя' },
      { method: 'PUT', path: '/api/users/:id', desc: 'Обновить пользователя полностью' },
      { method: 'PATCH', path: '/api/users/:id', desc: 'Частичное обновление' },
      { method: 'DELETE', path: '/api/users/:id', desc: 'Удалить пользователя' },
    ]

    for (const r of routes) {
      log.push(`app.${r.method.toLowerCase()}("${r.path}", handler)  // ${r.desc}`)
    }
    log.push('')

    // Route parameters
    log.push('--- Параметры маршрута (req.params) ---')
    log.push('')
    log.push('app.get("/api/users/:userId/posts/:postId", (req, res) => {')
    log.push('  // req.params = { userId: "42", postId: "7" }')
    log.push('})')
    log.push('')

    // Simulate request matching
    log.push('=== Симуляция маршрутизации ===')
    log.push('')

    const testRequests = [
      { method: 'GET', url: '/api/users', matched: 'GET /api/users', params: '{}', query: '{}' },
      { method: 'GET', url: '/api/users/42', matched: 'GET /api/users/:id', params: '{ id: "42" }', query: '{}' },
      { method: 'GET', url: '/api/users?page=2&limit=10', matched: 'GET /api/users', params: '{}', query: '{ page: "2", limit: "10" }' },
      { method: 'POST', url: '/api/users', matched: 'POST /api/users', params: '{}', query: '{}' },
      { method: 'DELETE', url: '/api/users/42', matched: 'DELETE /api/users/:id', params: '{ id: "42" }', query: '{}' },
    ]

    for (const req of testRequests) {
      log.push(`>> ${req.method} ${req.url}`)
      log.push(`   Маршрут: ${req.matched}`)
      log.push(`   req.params: ${req.params}`)
      log.push(`   req.query: ${req.query}`)
      log.push('')
    }

    // Express Router
    log.push('--- express.Router() — модульные маршруты ---')
    log.push('')
    log.push('// routes/users.js')
    log.push('const router = express.Router()')
    log.push('router.get("/", getUsers)')
    log.push('router.get("/:id", getUserById)')
    log.push('router.post("/", createUser)')
    log.push('')
    log.push('// app.js')
    log.push('app.use("/api/users", usersRouter)')
    log.push('app.use("/api/posts", postsRouter)')
    log.push('app.use("/api/comments", commentsRouter)')
    log.push('')
    log.push('// Итоговые маршруты:')
    log.push('// GET  /api/users      -> usersRouter GET /')
    log.push('// GET  /api/users/:id  -> usersRouter GET /:id')
    log.push('// POST /api/users      -> usersRouter POST /')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: Маршруты и Router</h2>
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
// Задание 1.2: Цепочка Middleware — Решение
// ============================================

export function Task1_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Express: Цепочка Middleware ===')
    log.push('')

    // Middleware concept
    log.push('--- Что такое middleware ---')
    log.push('')
    log.push('// Middleware — функция с доступом к req, res и next')
    log.push('function myMiddleware(req, res, next) {')
    log.push('  // Логика до обработчика')
    log.push('  next()  // Передать управление следующему middleware')
    log.push('  // Логика после обработчика (редко)')
    log.push('}')
    log.push('')

    // Simulate middleware chain
    log.push('=== Симуляция цепочки middleware ===')
    log.push('')
    log.push('>> GET /api/users')
    log.push('')

    const middlewares = [
      { name: 'express.json()', action: 'Парсинг JSON body', time: 0.1 },
      { name: 'cors()', action: 'Установка CORS-заголовков', time: 0.05 },
      { name: 'requestLogger', action: 'Логирование: GET /api/users', time: 0.2 },
      { name: 'authMiddleware', action: 'Проверка токена: valid', time: 1.5 },
      { name: 'rateLimiter', action: 'Rate limit: 48/100 запросов', time: 0.1 },
      { name: 'getUsersHandler', action: 'Получение данных из БД', time: 15.3 },
    ]

    let step = 1
    for (const mw of middlewares) {
      log.push(`  [${step}] ${mw.name}`)
      log.push(`      -> ${mw.action} (${mw.time}ms)`)
      log.push(`      -> next()`)
      log.push('')
      step++
    }

    log.push('<< 200 OK (17.25ms total)')
    log.push('')

    // Order matters
    log.push('--- Порядок middleware имеет значение ---')
    log.push('')
    log.push('// Правильный порядок:')
    log.push('app.use(express.json())      // 1. Парсинг тела')
    log.push('app.use(cors())              // 2. CORS')
    log.push('app.use(requestLogger)       // 3. Логирование')
    log.push('app.use(authMiddleware)       // 4. Аутентификация')
    log.push('app.use("/api", apiRouter)   // 5. Маршруты')
    log.push('app.use(errorHandler)        // 6. Обработка ошибок (последний!)')
    log.push('')

    // Middleware scoping
    log.push('--- Область действия middleware ---')
    log.push('')
    log.push('// Глобальный: применяется ко всем маршрутам')
    log.push('app.use(express.json())')
    log.push('')
    log.push('// На группу маршрутов:')
    log.push('app.use("/api", authMiddleware)')
    log.push('')
    log.push('// На конкретный маршрут:')
    log.push('app.get("/api/admin", isAdmin, adminHandler)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: Цепочка Middleware</h2>
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
// Задание 1.3: Обработка ошибок — Решение
// ============================================

export function Task1_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Express: Обработка ошибок ===')
    log.push('')

    // Error middleware signature
    log.push('--- Error-handling middleware ---')
    log.push('')
    log.push('// Обязательно 4 аргумента — Express определяет error middleware по количеству')
    log.push('function errorHandler(err, req, res, next) {')
    log.push('  console.error(err.stack)')
    log.push('  res.status(err.statusCode || 500).json({')
    log.push('    error: err.message,')
    log.push('    code: err.code')
    log.push('  })')
    log.push('}')
    log.push('')

    // Custom error classes
    log.push('--- Пользовательские классы ошибок ---')
    log.push('')

    class AppError {
      constructor(
        public message: string,
        public statusCode: number,
        public code: string,
      ) {}
    }

    const errors = [
      new AppError('User not found', 404, 'USER_NOT_FOUND'),
      new AppError('Email already exists', 409, 'DUPLICATE_EMAIL'),
      new AppError('Invalid token', 401, 'INVALID_TOKEN'),
      new AppError('Forbidden', 403, 'INSUFFICIENT_PERMISSIONS'),
      new AppError('Validation failed', 422, 'VALIDATION_ERROR'),
    ]

    for (const err of errors) {
      log.push(`  ${err.statusCode} ${err.code}: "${err.message}"`)
    }
    log.push('')

    // Async error wrapper
    log.push('--- Async error wrapper ---')
    log.push('')
    log.push('// Проблема: Express НЕ ловит ошибки из async функций')
    log.push('app.get("/api/users", async (req, res) => {')
    log.push('  const users = await db.getUsers()  // Если упадёт — unhandled rejection!')
    log.push('})')
    log.push('')
    log.push('// Решение: обёртка asyncHandler')
    log.push('const asyncHandler = (fn) => (req, res, next) =>')
    log.push('  Promise.resolve(fn(req, res, next)).catch(next)')
    log.push('')
    log.push('app.get("/api/users", asyncHandler(async (req, res) => {')
    log.push('  const users = await db.getUsers()  // Ошибка попадёт в errorHandler')
    log.push('  res.json(users)')
    log.push('}))')
    log.push('')

    // Simulate error flow
    log.push('=== Симуляция потока ошибок ===')
    log.push('')
    log.push('>> GET /api/users/999')
    log.push('  [1] authMiddleware -> next()')
    log.push('  [2] getUserHandler -> throw new AppError("User not found", 404)')
    log.push('  [3] asyncHandler -> catch(next)')
    log.push('  [4] errorHandler:')
    log.push('')
    log.push('<< 404 Not Found')
    log.push(JSON.stringify({ error: 'User not found', code: 'USER_NOT_FOUND' }, null, 2))

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: Обработка ошибок</h2>
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
// Задание 1.4: Шаблонизаторы — Решение
// ============================================

export function Task1_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Express: Шаблонизаторы (EJS) ===')
    log.push('')

    // Setup
    log.push('--- Настройка EJS ---')
    log.push('')
    log.push('app.set("view engine", "ejs")')
    log.push('app.set("views", path.join(__dirname, "views"))')
    log.push('')
    log.push('// Структура views/')
    log.push('views/')
    log.push('  layouts/')
    log.push('    main.ejs          // Основной layout')
    log.push('  partials/')
    log.push('    header.ejs        // Шапка')
    log.push('    footer.ejs        // Подвал')
    log.push('  pages/')
    log.push('    index.ejs         // Главная')
    log.push('    users/')
    log.push('      list.ejs        // Список пользователей')
    log.push('      profile.ejs     // Профиль')
    log.push('')

    // EJS syntax
    log.push('--- Синтаксис EJS ---')
    log.push('')
    log.push('<%= variable %>        // Вывод с экранированием HTML')
    log.push('<%- rawHtml %>         // Вывод без экранирования (опасно!)')
    log.push('<% if (cond) { %>      // Управляющие конструкции')
    log.push('<%- include("partial") %> // Подключение partial')
    log.push('')

    // Simulate rendering
    log.push('=== Симуляция рендеринга ===')
    log.push('')
    log.push('>> GET /users')
    log.push('')
    log.push('// Обработчик:')
    log.push('app.get("/users", async (req, res) => {')
    log.push('  const users = await db.getUsers()')
    log.push('  res.render("pages/users/list", {')
    log.push('    title: "Пользователи",')
    log.push('    users: users,')
    log.push('    currentPage: 1')
    log.push('  })')
    log.push('})')
    log.push('')

    // Rendered output
    log.push('--- Результат рендеринга ---')
    log.push('')
    log.push('<!DOCTYPE html>')
    log.push('<html>')
    log.push('<head><title>Пользователи</title></head>')
    log.push('<body>')
    log.push('  <header><!-- из partials/header.ejs --></header>')
    log.push('  <h1>Пользователи</h1>')
    log.push('  <ul>')
    log.push('    <li>John (john@example.com)</li>')
    log.push('    <li>Jane (jane@example.com)</li>')
    log.push('  </ul>')
    log.push('  <footer><!-- из partials/footer.ejs --></footer>')
    log.push('</body>')
    log.push('</html>')
    log.push('')
    log.push('<< 200 OK')
    log.push('   Content-Type: text/html; charset=utf-8')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: Шаблонизаторы (EJS)</h2>
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
