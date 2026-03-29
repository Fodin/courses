import { useState } from 'react'

// ============================================
// Задание 0.1: createServer
// ============================================

// TODO: Создайте HTTP-сервер с помощью http.createServer()
// TODO: Обработайте входящие запросы и верните ответ с правильным Content-Type
// TODO: Используйте res.writeHead() для установки статуса и заголовков
// TODO: Завершите ответ через res.end() с телом ответа

export function Task0_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== http.createServer ===')
    log.push('')

    // TODO: Смоделируйте создание HTTP-сервера
    // TODO: Покажите обработку req.method, req.url
    // TODO: Продемонстрируйте отправку JSON-ответа и plain text
    log.push('http.createServer(callback)')
    log.push('  ... создайте сервер, обработайте GET /')
    log.push('  ... верните JSON с Content-Type: application/json')
    log.push('  ... покажите разницу между writeHead и setHeader')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: createServer</h2>
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
