import { useState } from 'react'

// ============================================
// Задание 6.3: Refresh Tokens
// ============================================

// TODO: Реализуйте схему access + refresh tokens
// TODO: Access token: короткоживущий (15 мин), в Authorization header
// TODO: Refresh token: долгоживущий (7 дней), в httpOnly cookie
// TODO: Создайте POST /auth/refresh для обновления пары токенов

export function Task6_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Refresh Tokens ===')
    log.push('')

    // TODO: POST /auth/login -> { accessToken } + Set-Cookie: refreshToken
    // TODO: POST /auth/refresh -> проверка refreshToken -> новая пара
    // TODO: Реализуйте token rotation (старый refresh token инвалидируется)
    // TODO: Храните refresh tokens в БД для возможности revoke
    log.push('Refresh Tokens')
    log.push('  ... login -> accessToken (15m) + refreshToken (7d, httpOnly)')
    log.push('  ... POST /auth/refresh -> новый accessToken + ротация refresh')
    log.push('  ... token rotation: старый refresh инвалидируется')
    log.push('  ... revoke: DELETE /auth/logout -> удаление из БД')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: Refresh Tokens</h2>
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
