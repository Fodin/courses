import { useState } from 'react'

// ============================================
// Задание 6.4: OAuth 2.0
// ============================================

// TODO: Реализуйте OAuth 2.0 Authorization Code Flow
// TODO: Создайте GET /auth/github -> redirect к GitHub authorize URL
// TODO: Обработайте callback: GET /auth/github/callback?code=xxx
// TODO: Обменяйте code на access_token и получите профиль пользователя

export function Task6_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== OAuth 2.0 ===')
    log.push('')

    // TODO: Сгенерируйте state параметр для CSRF-защиты
    // TODO: Redirect к github.com/login/oauth/authorize?client_id&scope&state
    // TODO: POST github.com/login/oauth/access_token с code + client_secret
    // TODO: GET api.github.com/user с Bearer token -> создайте/найдите user
    log.push('OAuth 2.0 Flow')
    log.push('  ... 1. GET /auth/github -> redirect to GitHub')
    log.push('  ... 2. User authorizes -> callback?code=xxx&state=yyy')
    log.push('  ... 3. Exchange code -> access_token (server-to-server)')
    log.push('  ... 4. Fetch user profile -> create/find local user')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.4: OAuth 2.0</h2>
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
