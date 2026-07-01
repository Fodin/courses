import { useState } from 'react'

// ============================================
// Задание 2.1: Routes & Schemas
// Task 2.1: Routes & Schemas
// ============================================

// TODO: Создайте Fastify-сервер с типизированными маршрутами
// TODO: Create a Fastify server with typed routes
// TODO: Определите JSON Schema для валидации request/response
// TODO: Define JSON Schema for request/response validation
// TODO: Используйте schema: { body, querystring, params, response }
// TODO: Use schema: { body, querystring, params, response }
// TODO: Покажите автоматическую сериализацию через fast-json-stringify
// TODO: Show automatic serialization via fast-json-stringify

export function Task2_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Fastify Routes & Schemas ===')
    log.push('')

    // TODO: Создайте fastify instance с logger: true
    // TODO: Create a fastify instance with logger: true
    // TODO: Определите route с полной JSON Schema валидацией
    // TODO: Define a route with full JSON Schema validation
    // TODO: Покажите Type Provider для TypeScript интеграции
    // TODO: Show Type Provider for TypeScript integration
    // TODO: Продемонстрируйте автоматический 400 при невалидном body
    // TODO: Demonstrate automatic 400 on invalid body
    log.push('Fastify Routes')
    log.push('  ... fastify.get("/users/:id", { schema }, handler)')
    log.push('  ... schema: { params: { id: { type: "string" } } }')
    log.push('  ... schema: { response: { 200: { ... } } }')
    log.push('  ... невалидный body -> автоматический 400 с деталями')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Routes & Schemas</h2>
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
