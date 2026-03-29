import { useState } from 'react'

// ============================================
// Задание 0.3: API Versioning
// ============================================

// TODO: Определите интерфейсы для трёх версий пользователя:
//   UserV1: { id, name, email }
//   UserV2: { id, firstName, lastName, email, role: 'admin' | 'user' | 'guest' }
//   UserV3: { id, firstName, lastName, emails: { primary, secondary? }, role, permissions: string[] }
// TODO: Define interfaces for three user versions:
//   UserV1: { id, name, email }
//   UserV2: { id, firstName, lastName, email, role: 'admin' | 'user' | 'guest' }
//   UserV3: { id, firstName, lastName, emails: { primary, secondary? }, role, permissions: string[] }

// TODO: Создайте интерфейс ApiVersions, описывающий эндпоинты каждой версии:
//   v1: /users -> UserV1[], /users/:id -> UserV1
//   v2: + /users/by-role -> UserV2[]
//   v3: + /users/permissions -> { userId: number, permissions: string[] }[]
// TODO: Create an ApiVersions interface describing endpoints per version

// TODO: Реализуйте createVersionedClient<V>(version) — фабрика клиента,
//   метод get<E>(endpoint) возвращает тип ответа для данной версии и эндпоинта
// TODO: Implement createVersionedClient<V>(version) — client factory,
//   get<E>(endpoint) method returns the response type for that version and endpoint

// TODO: Создайте функции миграции:
//   migrateV1toV2: UserV1 -> UserV2 (name.split(' ') -> firstName/lastName, role='user')
//   migrateV2toV3: UserV2 -> UserV3 (email -> emails.primary, добавить permissions)
// TODO: Create migration functions:
//   migrateV1toV2: UserV1 -> UserV2 (name.split(' ') -> firstName/lastName, role='user')
//   migrateV2toV3: UserV2 -> UserV3 (email -> emails.primary, add permissions)

export function Task0_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== API Versioning ===')
    log.push('')

    // TODO: Создайте клиенты для каждой версии и покажите доступные эндпоинты
    // TODO: Create clients for each version and show available endpoints
    log.push('Versioned API clients:')
    log.push('  ... создайте v1/v2/v3 клиенты')
    log.push('')

    // TODO: Продемонстрируйте цепочку миграции V1 -> V2 -> V3
    // TODO: Demonstrate migration chain V1 -> V2 -> V3
    log.push('Migration chain:')
    log.push('  ... мигрируйте UserV1 через все версии')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.3: API Versioning</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
