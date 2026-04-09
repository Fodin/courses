import { useState } from 'react'

// ============================================
// Задание 1.2: Middleware Chain
// Task 1.2: Middleware Chain
// ============================================

// TODO: Реализуйте цепочку middleware в Express
// TODO: Implement a middleware chain in Express
// TODO: Создайте logger middleware (логирование метода, URL, времени)
// TODO: Create a logger middleware (log method, URL, time)
// TODO: Создайте auth middleware (проверка заголовка Authorization)
// TODO: Create an auth middleware (check Authorization header)
// TODO: Покажите порядок выполнения: app-level -> router-level -> route-level
// TODO: Show execution order: app-level -> router-level -> route-level

export function Task1_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Middleware Chain ===')
    log.push('')

    // TODO: Реализуйте loggerMiddleware(req, res, next)
    // TODO: Implement loggerMiddleware(req, res, next)
    // TODO: Реализуйте authMiddleware с проверкой токена
    // TODO: Implement authMiddleware with token verification
    // TODO: Покажите app.use() vs router.use() vs route-specific middleware
    // TODO: Show app.use() vs router.use() vs route-specific middleware
    // TODO: Продемонстрируйте вызов next() и next(error)
    // TODO: Demonstrate calling next() and next(error)
    log.push('Middleware Chain')
    log.push('  ... app.use(loggerMiddleware)')
    log.push('  ... router.use(authMiddleware)')
    log.push('  ... router.get("/secret", roleCheck("admin"), handler)')
    log.push('  ... порядок: logger -> auth -> roleCheck -> handler')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: Middleware Chain</h2>
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
