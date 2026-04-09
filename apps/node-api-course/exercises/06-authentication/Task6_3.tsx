import { useState } from 'react'

// ============================================
// Задание 6.3: Refresh Tokens
// Task 6.3: Refresh Tokens
// ============================================

// TODO: Реализуйте схему access + refresh tokens
// TODO: Implement access + refresh tokens scheme
// TODO: Access token: короткоживущий (15 мин), в Authorization header
// TODO: Access token: short-lived (15 min), in Authorization header
// TODO: Refresh token: долгоживущий (7 дней), в httpOnly cookie
// TODO: Refresh token: long-lived (7 days), in httpOnly cookie
// TODO: Создайте POST /auth/refresh для обновления пары токенов
// TODO: Create POST /auth/refresh for token pair refresh

export function Task6_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Refresh Tokens ===')
    log.push('')

    // TODO: POST /auth/login -> { accessToken } + Set-Cookie: refreshToken
    // TODO: POST /auth/login -> { accessToken } + Set-Cookie: refreshToken
    // TODO: POST /auth/refresh -> проверка refreshToken -> новая пара
    // TODO: POST /auth/refresh -> validate refreshToken -> new pair
    // TODO: Реализуйте token rotation (старый refresh token инвалидируется)
    // TODO: Implement token rotation (old refresh token is invalidated)
    // TODO: Храните refresh tokens в БД для возможности revoke
    // TODO: Store refresh tokens in DB for revocation capability
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
