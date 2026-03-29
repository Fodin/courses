import { useState } from 'react'

// ============================================
// Задание 13.5: Full Wiring
// ============================================

// TODO: Соберите всё вместе:
//   Создайте DI container, зарегистрируйте все зависимости
//   Infrastructure adapters -> Application use cases -> API handlers
//   Продемонстрируйте полный цикл: создание заказа -> подтверждение -> просмотр
//   Покажите обработку ошибок на каждом уровне

export function Task13_5() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Full Wiring ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Full Wiring')
    log.push('  ... DI container со всеми зависимостями')
    log.push('  ... полный цикл: create order -> confirm -> view')
    log.push('  ... обработка ошибок на каждом уровне')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.5: Full Wiring</h2>
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
