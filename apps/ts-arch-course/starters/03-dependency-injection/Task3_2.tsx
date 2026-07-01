import { useState } from 'react'

// ============================================
// Задание 3.2: Injection Tokens
// ============================================

// TODO: Реализуйте класс InjectionToken<T> с фантомным полем _type
//   и функцию-фабрику token<T>(description) -> InjectionToken<T>
// TODO: Implement class InjectionToken<T> with phantom _type field
//   and factory function token<T>(description) -> InjectionToken<T>

// TODO: Реализуйте TokenContainer с методами:
//   - provide<T>(token, factory) -> this
//   - inject<T>(token) -> T (ленивый singleton)
//   - hasProvider<T>(token) -> boolean
//   Тип значения определяется токеном, а не строковым ключом
// TODO: Implement TokenContainer with methods:
//   - provide<T>(token, factory) -> this
//   - inject<T>(token) -> T (lazy singleton)
//   - hasProvider<T>(token) -> boolean
//   Value type is determined by token, not string key

// TODO: Определите токены для различных сервисов:
//   TOKENS.Logger: InjectionToken<Logger>
//   TOKENS.Config: InjectionToken<Config>
//   TOKENS.Cache: InjectionToken<CacheService>
//   TOKENS.ApiBaseUrl: InjectionToken<string>
//   TOKENS.MaxRetries: InjectionToken<number>
// TODO: Define tokens for various services

export function Task3_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Injection Tokens ===')
    log.push('')

    // TODO: Создайте TokenContainer и зарегистрируйте провайдеры через токены
    // TODO: Create TokenContainer and register providers via tokens
    log.push('Tokens defined:')
    log.push('  ... покажите описания токенов')
    log.push('')

    // TODO: Разрешите зависимости — тип определяется токеном
    //   container.inject(TOKENS.ApiBaseUrl) -> string
    //   container.inject(TOKENS.MaxRetries) -> number
    // TODO: Resolve dependencies — type is determined by token
    log.push('Token-based resolution:')
    log.push('  ... inject через токены и выведите типизированные значения')
    log.push('')

    log.push('Type safety with tokens:')
    log.push('  container.inject(TOKENS.ApiBaseUrl)    // string')
    log.push('  container.inject(TOKENS.MaxRetries)    // number')
    log.push('  container.inject(TOKENS.Logger).apiUrl // Error: no apiUrl on Logger')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: Injection Tokens</h2>
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
