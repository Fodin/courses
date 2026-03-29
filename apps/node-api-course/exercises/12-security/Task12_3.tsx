import { useState } from 'react'

// ============================================
// Задание 12.3: CSRF & Advanced
// ============================================

// TODO: Реализуйте CSRF-защиту для форм и API
// TODO: Используйте Synchronizer Token Pattern или Double Submit Cookie
// TODO: Покажите SameSite cookie как дополнительную защиту
// TODO: Реализуйте защиту от timing attacks при сравнении токенов

export function Task12_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== CSRF & Advanced Security ===')
    log.push('')

    // TODO: Генерируйте CSRF-токен и передайте в форму/meta-тег
    // TODO: Проверяйте токен в middleware через req.headers["x-csrf-token"]
    // TODO: Используйте crypto.timingSafeEqual для сравнения токенов
    // TODO: Покажите BREACH attack mitigation для сжатых HTTPS ответов
    log.push('CSRF Protection')
    log.push('  ... csrf token: crypto.randomBytes(32).toString("hex")')
    log.push('  ... Set-Cookie: _csrf=token; SameSite=Strict')
    log.push('  ... verify: crypto.timingSafeEqual(expected, received)')
    log.push('  ... Double Submit: cookie + header должны совпадать')

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
