import { useState } from 'react'

// ============================================
// Задание 6.2: JWT
// ============================================

// TODO: Реализуйте JWT-аутентификацию (JSON Web Tokens)
// TODO: Создайте sign (выпуск) и verify (проверка) токена
// TODO: Включите payload: { sub, role, iat, exp }
// TODO: Реализуйте authMiddleware для проверки Bearer token

export function Task6_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== JWT Authentication ===')
    log.push('')

    // TODO: Создайте jwt.sign(payload, secret, { expiresIn: "1h" })
    // TODO: Реализуйте middleware: Authorization: Bearer <token> -> jwt.verify
    // TODO: Покажите структуру JWT: header.payload.signature
    // TODO: Обработайте ошибки: TokenExpiredError, JsonWebTokenError
    log.push('JWT Auth')
    log.push('  ... jwt.sign({ sub: userId, role }, SECRET, { expiresIn: "1h" })')
    log.push('  ... Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...')
    log.push('  ... jwt.verify(token, SECRET) -> payload')
    log.push('  ... TokenExpiredError -> 401, JsonWebTokenError -> 401')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: JWT</h2>
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
