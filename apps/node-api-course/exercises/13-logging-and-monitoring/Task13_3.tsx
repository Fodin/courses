import { useState } from 'react'

// ============================================
// Задание 13.3: Health & Docs
// Task 13.3: Health & Docs
// ============================================

// TODO: Реализуйте health check endpoint: GET /health / Implement health check endpoint: GET /health
// TODO: Проверяйте состояние зависимостей: DB, Redis, external APIs / Check dependency health: DB, Redis, external APIs
// TODO: Настройте Swagger/OpenAPI документацию через swagger-ui-express / Set up Swagger/OpenAPI documentation via swagger-ui-express
// TODO: Генерируйте OpenAPI spec из JSDoc или Zod schemas / Generate OpenAPI spec from JSDoc or Zod schemas

export function Task13_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Health Checks & API Docs ===')
    log.push('')

    // TODO: Реализуйте GET /health -> { status, uptime, checks: { db, redis } } / Implement GET /health -> { status, uptime, checks: { db, redis } }
    // TODO: Покажите liveness (/healthz) vs readiness (/readyz) для k8s / Show liveness (/healthz) vs readiness (/readyz) for k8s
    // TODO: Настройте swagger-ui-express с OpenAPI 3.0 spec / Set up swagger-ui-express with OpenAPI 3.0 spec
    // TODO: Покажите автогенерацию spec из Zod schemas или route decorators / Show auto-generation of spec from Zod schemas or route decorators
    log.push('Health & Docs')
    log.push('  ... GET /health -> { status: "ok", uptime: 3600, db: "connected" }')
    log.push('  ... GET /healthz (liveness) -> 200 (процесс жив / process is alive)')
    log.push('  ... GET /readyz (readiness) -> 200 (готов принимать трафик / ready to accept traffic)')
    log.push('  ... GET /api-docs -> Swagger UI с интерактивной документацией / with interactive documentation')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.3: Health & Docs</h2>
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
