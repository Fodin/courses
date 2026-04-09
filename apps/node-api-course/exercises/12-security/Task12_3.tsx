import { useState } from 'react'

// ============================================
// Задание 12.3: CSRF & Advanced
// Task 12.3: CSRF & Advanced
// ============================================

// TODO: Реализуйте CSRF-защиту для форм и API / Implement CSRF protection for forms and API
// TODO: Используйте Synchronizer Token Pattern или Double Submit Cookie / Use Synchronizer Token Pattern or Double Submit Cookie
// TODO: Покажите SameSite cookie как дополнительную защиту / Show SameSite cookies as additional protection
// TODO: Реализуйте защиту от timing attacks при сравнении токенов / Implement timing attack protection when comparing tokens

export function Task12_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== CSRF & Advanced Security ===')
    log.push('')

    // TODO: Генерируйте CSRF-токен и передайте в форму/meta-тег / Generate CSRF token and pass to form/meta tag
    // TODO: Проверяйте токен в middleware через req.headers["x-csrf-token"] / Verify token in middleware via req.headers["x-csrf-token"]
    // TODO: Используйте crypto.timingSafeEqual для сравнения токенов / Use crypto.timingSafeEqual for token comparison
    // TODO: Покажите BREACH attack mitigation для сжатых HTTPS ответов / Show BREACH attack mitigation for compressed HTTPS responses
    log.push('CSRF Protection')
    log.push('  ... csrf token: crypto.randomBytes(32).toString("hex")')
    log.push('  ... Set-Cookie: _csrf=token; SameSite=Strict')
    log.push('  ... verify: crypto.timingSafeEqual(expected, received)')
    log.push('  ... Double Submit: cookie + header должны совпадать / must match')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.3: CSRF & Advanced</h2>
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
