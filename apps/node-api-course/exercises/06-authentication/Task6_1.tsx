import { useState } from 'react'

// ============================================
// Задание 6.1: Cookie Sessions
// ============================================

// TODO: Реализуйте аутентификацию через cookie-сессии
// TODO: Создайте login endpoint с установкой Set-Cookie
// TODO: Настройте httpOnly, secure, sameSite, maxAge
// TODO: Реализуйте session store (в памяти) с генерацией session ID

export function Task6_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Cookie Sessions ===')
    log.push('')

    // TODO: Генерируйте sessionId через crypto.randomBytes(32)
    // TODO: Храните сессии в Map<sessionId, { userId, createdAt, data }>
    // TODO: Реализуйте sessionMiddleware для парсинга cookie
    // TODO: Покажите logout с удалением cookie и сессии
    log.push('Cookie Sessions')
    log.push('  ... Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Strict')
    log.push('  ... sessionStore.set(sid, { userId: 42, role: "user" })')
    log.push('  ... sessionMiddleware: req.session = store.get(sid)')
    log.push('  ... logout: store.delete(sid) + clearCookie')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: Cookie Sessions</h2>
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
