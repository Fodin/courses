import { useState } from 'react'

// ============================================
// Задание 10.3: Dependency Inversion
// ============================================

// TODO: Определите порт-интерфейсы (абстракции): Logger, Cache<T>, NotificationService, UserStore
// TODO: Реализуйте createUserService(deps: { logger, cache, notifications, store })
//   getUser: cache hit -> return, miss -> store.findById -> cache.set
//   updateUser: store update -> cache invalidate -> notification
// TODO: Создайте адаптеры: createConsoleLogger, createMemoryCache, createMockNotifications
//   Адаптеры можно заменить без изменения сервиса

export function Task10_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Dependency Inversion ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Dependency Inversion')
    log.push('  ... покажите cache miss/hit, update с invalidation и notification')
    log.push('  ... UserService зависит от ИНТЕРФЕЙСОВ, не от реализаций')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.3: Dependency Inversion</h2>
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
