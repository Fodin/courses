import { useState } from 'react'

// ============================================
// Задание 12.1: Helmet & Headers
// Task 12.1: Helmet & Headers
// ============================================

// TODO: Настройте безопасные HTTP-заголовки через Helmet / Set up secure HTTP headers via Helmet
// TODO: Покажите каждый заголовок: CSP, X-Frame-Options, HSTS и др. / Show each header: CSP, X-Frame-Options, HSTS, etc.
// TODO: Настройте Content-Security-Policy для вашего API / Configure Content-Security-Policy for your API
// TODO: Реализуйте кастомные security headers вручную (без Helmet) / Implement custom security headers manually (without Helmet)

export function Task12_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Helmet & Security Headers ===')
    log.push('')

    // TODO: Подключите app.use(helmet()) с кастомной конфигурацией / Connect app.use(helmet()) with custom configuration
    // TODO: Настройте CSP: script-src 'self', img-src 'self' data: / Configure CSP: script-src 'self', img-src 'self' data:
    // TODO: Покажите X-Content-Type-Options: nosniff / Show X-Content-Type-Options: nosniff
    // TODO: Настройте Strict-Transport-Security для HTTPS / Configure Strict-Transport-Security for HTTPS
    log.push('Helmet')
    log.push('  ... app.use(helmet({ contentSecurityPolicy: { directives: { ... } } }))')
    log.push('  ... X-Content-Type-Options: nosniff')
    log.push('  ... X-Frame-Options: DENY')
    log.push('  ... Strict-Transport-Security: max-age=31536000; includeSubDomains')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.1: Helmet & Headers</h2>
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
