import { useState } from 'react'

// ============================================
// Задание 2.1: Маршруты и JSON Schema — Решение
// ============================================

export function Task2_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Fastify: Маршруты и JSON Schema валидация ===')
    log.push('')

    // Route definition
    log.push('--- Определение маршрута с JSON Schema ---')
    log.push('')
    log.push('fastify.post("/api/users", {')
    log.push('  schema: {')
    log.push('    body: {')
    log.push('      type: "object",')
    log.push('      required: ["name", "email"],')
    log.push('      properties: {')
    log.push('        name: { type: "string", minLength: 2 },')
    log.push('        email: { type: "string", format: "email" },')
    log.push('        age: { type: "integer", minimum: 0, maximum: 150 }')
    log.push('      },')
    log.push('      additionalProperties: false')
    log.push('    },')
    log.push('    response: {')
    log.push('      201: {')
    log.push('        type: "object",')
    log.push('        properties: {')
    log.push('          id: { type: "integer" },')
    log.push('          name: { type: "string" },')
    log.push('          email: { type: "string" }')
    log.push('        }')
    log.push('      }')
    log.push('    }')
    log.push('  }')
    log.push('}, handler)')
    log.push('')

    // Simulate validation
    log.push('=== Симуляция валидации ===')
    log.push('')

    const validBody = { name: 'John Doe', email: 'john@example.com', age: 30 }
    log.push(`>> POST /api/users`)
    log.push(`>> Body: ${JSON.stringify(validBody)}`)
    log.push('   Schema validation: PASSED')
    log.push('<< 201 Created')
    log.push(`<< ${JSON.stringify({ id: 1, ...validBody })}`)
    log.push('')

    const invalidBody = { email: 'not-an-email' }
    log.push(`>> POST /api/users`)
    log.push(`>> Body: ${JSON.stringify(invalidBody)}`)
    log.push('   Schema validation: FAILED')
    log.push('<< 400 Bad Request')
    log.push(JSON.stringify({
      statusCode: 400,
      error: 'Bad Request',
      message: "body must have required property 'name'",
    }, null, 2))
    log.push('')

    // Response serialization
    log.push('--- Сериализация ответа ---')
    log.push('')
    log.push('// Response schema автоматически:')
    log.push('// 1. Удаляет лишние поля (password, internalId)')
    log.push('// 2. Сериализует быстрее, чем JSON.stringify (fast-json-stringify)')
    log.push('')

    const dbUser = { id: 1, name: 'John', email: 'john@example.com', password: 'hashed_secret', internalId: 'uuid-123' }
    const serialized = { id: 1, name: 'John', email: 'john@example.com' }
    log.push(`БД возвращает: ${JSON.stringify(dbUser)}`)
    log.push(`Клиент получает: ${JSON.stringify(serialized)}`)
    log.push('  password и internalId удалены благодаря response schema!')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Маршруты и JSON Schema</h2>
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
// Задание 2.2: Плагины и декораторы — Решение
// ============================================

export function Task2_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Fastify: Плагины и декораторы ===')
    log.push('')

    // Plugin system
    log.push('--- Система плагинов ---')
    log.push('')
    log.push('// Плагин — функция с fastify instance и options')
    log.push('async function dbPlugin(fastify, opts) {')
    log.push('  const pool = createPool(opts.connectionString)')
    log.push('  ')
    log.push('  // decorateRequest — добавляет свойство к каждому запросу')
    log.push('  fastify.decorateRequest("db", null)')
    log.push('  ')
    log.push('  fastify.addHook("onRequest", async (req) => {')
    log.push('    req.db = pool')
    log.push('  })')
    log.push('  ')
    log.push('  fastify.addHook("onClose", async () => {')
    log.push('    await pool.end()')
    log.push('  })')
    log.push('}')
    log.push('')

    // Encapsulation
    log.push('--- Инкапсуляция ---')
    log.push('')
    log.push('// По умолчанию плагины инкапсулированы:')
    log.push('fastify.register(pluginA)  // pluginA НЕ видит pluginB')
    log.push('fastify.register(pluginB)  // pluginB НЕ видит pluginA')
    log.push('')
    log.push('// fastify-plugin — пробивает инкапсуляцию:')
    log.push('const fp = require("fastify-plugin")')
    log.push('module.exports = fp(dbPlugin)  // Теперь доступен везде')
    log.push('')

    // Simulate plugin loading
    log.push('=== Симуляция загрузки плагинов ===')
    log.push('')

    const plugins = [
      { name: 'fastify-cors', scope: 'global', decorates: 'reply.cors()' },
      { name: 'db-plugin', scope: 'global (fp)', decorates: 'request.db' },
      { name: 'auth-plugin', scope: 'global (fp)', decorates: 'request.user, fastify.jwt' },
      { name: 'users-routes', scope: 'encapsulated', decorates: 'routes: /api/users/*' },
      { name: 'posts-routes', scope: 'encapsulated', decorates: 'routes: /api/posts/*' },
    ]

    for (const p of plugins) {
      log.push(`  [register] ${p.name}`)
      log.push(`    scope: ${p.scope}`)
      log.push(`    adds: ${p.decorates}`)
      log.push('')
    }

    // Decorator types
    log.push('--- Типы декораторов ---')
    log.push('')
    log.push('fastify.decorate("utility", fn)         // На instance Fastify')
    log.push('fastify.decorateRequest("user", null)    // На каждый Request')
    log.push('fastify.decorateReply("sendError", fn)   // На каждый Reply')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Плагины и декораторы</h2>
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
// Задание 2.3: Lifecycle хуки — Решение
// ============================================

export function Task2_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Fastify: Lifecycle хуки ===')
    log.push('')

    // Lifecycle diagram
    log.push('--- Жизненный цикл запроса ---')
    log.push('')
    log.push('  Incoming Request')
    log.push('       │')
    log.push('       ▼')
    log.push('  onRequest        — логирование, rate limiting')
    log.push('       │')
    log.push('       ▼')
    log.push('  preParsing       — декомпрессия, модификация payload')
    log.push('       │')
    log.push('       ▼')
    log.push('  preValidation    — аутентификация, подготовка body')
    log.push('       │')
    log.push('       ▼')
    log.push('  preHandler       — авторизация, загрузка зависимостей')
    log.push('       │')
    log.push('       ▼')
    log.push('  Handler          — бизнес-логика')
    log.push('       │')
    log.push('       ▼')
    log.push('  preSerialization — трансформация ответа')
    log.push('       │')
    log.push('       ▼')
    log.push('  onSend           — модификация финального payload')
    log.push('       │')
    log.push('       ▼')
    log.push('  onResponse       — метрики, логирование ответа')
    log.push('')

    // Simulate request through hooks
    log.push('=== Симуляция: GET /api/users/42 ===')
    log.push('')

    const hooks = [
      { name: 'onRequest', action: 'Start timer, assign requestId: "req-abc"', time: 0.1 },
      { name: 'preParsing', action: '(не используется)', time: 0 },
      { name: 'preValidation', action: 'Params schema: { id: "42" } -> valid', time: 0.2 },
      { name: 'preHandler [auth]', action: 'JWT verify -> user: { id: 5, role: "admin" }', time: 1.2 },
      { name: 'preHandler [rbac]', action: 'Check permission: users.read -> allowed', time: 0.1 },
      { name: 'Handler', action: 'db.query("SELECT * FROM users WHERE id = $1", [42])', time: 12.5 },
      { name: 'preSerialization', action: 'Remove password field from response', time: 0.1 },
      { name: 'onSend', action: 'Add X-Request-Id header: "req-abc"', time: 0.05 },
      { name: 'onResponse', action: 'Log: GET /api/users/42 -> 200 (14.25ms)', time: 0.1 },
    ]

    for (const hook of hooks) {
      if (hook.time === 0) continue
      log.push(`  [${hook.name}]`)
      log.push(`    ${hook.action} (${hook.time}ms)`)
      log.push('')
    }

    log.push('<< 200 OK (14.35ms)')
    log.push('')

    // onError hook
    log.push('--- Хук onError ---')
    log.push('')
    log.push('fastify.addHook("onError", async (request, reply, error) => {')
    log.push('  // Вызывается при ошибке в любом хуке/handler')
    log.push('  logger.error({')
    log.push('    requestId: request.id,')
    log.push('    error: error.message,')
    log.push('    stack: error.stack')
    log.push('  })')
    log.push('  // НЕ заменяет setErrorHandler — только для side-effects')
    log.push('})')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.3: Lifecycle хуки</h2>
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
