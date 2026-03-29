import { useState } from 'react'

// ============================================
// Задание 3.1: DI Container
// ============================================

// TODO: Реализуйте класс Container<TRegistry extends ServiceRegistry = {}>
//   TRegistry накапливает типы зарегистрированных сервисов.
//   - register<K, T>(name, factory) -> Container<TRegistry & Record<K, T>>
//     factory получает container для разрешения зависимостей
//   - resolve<K extends keyof TRegistry>(name) -> TRegistry[K]
//     Ленивая инициализация: создаёт инстанс при первом resolve, потом возвращает кэш
//   - has<K>(name): name is K & keyof TRegistry
// TODO: Implement class Container<TRegistry>
//   - register<K, T>(name, factory) -> Container<TRegistry & Record<K, T>>
//   - resolve<K>(name) -> TRegistry[K] (lazy singleton)
//   - has<K>(name) type guard

// TODO: Определите интерфейсы сервисов: Logger, Config, HttpClient, UserService
//   Logger: log(msg)->string, warn(msg)->string
//   Config: apiUrl: string, timeout: number, debug: boolean
//   HttpClient: get(url)->string, post(url, body)->string
//   UserService: getUser(id)->string, createUser(name)->string
// TODO: Define service interfaces: Logger, Config, HttpClient, UserService

export function Task3_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== DI Container ===')
    log.push('')

    // TODO: Создайте контейнер с цепочкой регистрации:
    //   config -> logger -> httpClient (зависит от config+logger) -> userService (от httpClient)
    // TODO: Create container with registration chain:
    //   config -> logger -> httpClient (depends on config+logger) -> userService (from httpClient)
    log.push('Registered services: config, logger, httpClient, userService')
    log.push('')

    // TODO: Разрешите сервисы и покажите их работу
    // TODO: Resolve services and demonstrate usage
    log.push('Resolved config:')
    log.push('  ... container.resolve("config").apiUrl')
    log.push('')

    log.push('Using userService:')
    log.push('  ... userService.getUser(42) — вызывает httpClient -> config + logger')
    log.push('')

    // TODO: Проверьте singleton-поведение (config === config2)
    // TODO: Verify singleton behavior
    log.push('Singleton check: config === config2?')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: DI Container</h2>
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
