import { useState } from 'react'

// ============================================
// Задание 7.1: Middleware Chain
// ============================================

// TODO: Определите тип Middleware<TContext> = (ctx, next: () => TContext) => TContext
// TODO: Реализуйте createMiddlewareChain<TContext>(initialContext, ...middlewares) -> TContext
//   Middleware может вызвать next() для продолжения цепочки или вернуть ctx (short-circuit)
// TODO: Создайте middleware для HTTP: loggingMiddleware, authMiddleware, corsMiddleware, handlerMiddleware
//   authMiddleware: проверяет headers.authorization, если нет — 401 без вызова next()

export function Task7_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Middleware Chain ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Middleware Chain')
    log.push('  ... покажите два сценария: authenticated (полная цепочка) и unauthenticated (останов на auth)')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.1: Middleware Chain</h2>
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
