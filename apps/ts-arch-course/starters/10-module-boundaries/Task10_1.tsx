import { useState } from 'react'

// ============================================
// Задание 10.1: Public API Surface
// ============================================

// TODO: Определите InternalUserRecord (с _id, _rev, passwordHash, deletedAt)
// TODO: Определите PublicUser (id, name, email, createdAt) — без внутренних полей
// TODO: Создайте CreateUserInput, UpdateUserInput, UserQueryOptions
// TODO: Реализуйте UserModule { createUser, getUser, updateUser, listUsers, deleteUser }
//   Внутри использует InternalUserRecord, наружу отдаёт только PublicUser
//   toPublicUser(record) — маппинг internal -> public

export function Task10_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Public API Surface ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Public API Surface')
    log.push('  ... создайте пользователей, обновите, удалите')
    log.push('  ... покажите что alice.passwordHash -> TS Error (not in PublicUser)')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.1: Public API Surface</h2>
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
