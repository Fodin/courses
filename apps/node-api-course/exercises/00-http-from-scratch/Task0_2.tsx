import { useState } from 'react'

// ============================================
// Задание 0.2: Manual Routing
// ============================================

// TODO: Реализуйте маршрутизацию вручную без фреймворков
// TODO: Разберите req.url и req.method для определения маршрута
// TODO: Создайте роутер-объект с маппингом path -> handler
// TODO: Обработайте 404 для несуществующих маршрутов

export function Task0_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Manual Routing ===')
    log.push('')

    // TODO: Создайте объект routes с маппингом 'GET /users' -> handler
    // TODO: Реализуйте функцию matchRoute(method, url)
    // TODO: Покажите парсинг query-параметров из URL
    // TODO: Обработайте динамические сегменты /users/:id
    log.push('Manual Router')
    log.push('  ... создайте routes map: { "GET /users": handler }')
    log.push('  ... реализуйте matchRoute с поддержкой :params')
    log.push('  ... покажите парсинг query string через URL API')
    log.push('  ... верните 404 для неизвестных маршрутов')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Manual Routing</h2>
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
