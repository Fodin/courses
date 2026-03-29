import { useState } from 'react'

// ============================================
// Задание 9.3: SSE
// ============================================

// TODO: Реализуйте Server-Sent Events (SSE) endpoint
// TODO: Настройте заголовки: Content-Type: text/event-stream, Connection: keep-alive
// TODO: Отправляйте события в формате: data: {...}\n\n
// TODO: Покажите именованные события: event: update\ndata: {...}\n\n

export function Task9_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Server-Sent Events ===')
    log.push('')

    // TODO: Настройте res headers для SSE
    // TODO: Реализуйте периодическую отправку данных через res.write()
    // TODO: Обработайте req.on("close") для cleanup
    // TODO: Покажите retry и id поля для автоматического переподключения
    log.push('SSE')
    log.push('  ... res.writeHead(200, { "Content-Type": "text/event-stream" })')
    log.push('  ... res.write("event: update\\ndata: {...}\\n\\n")')
    log.push('  ... res.write("id: 42\\nretry: 5000\\ndata: {...}\\n\\n")')
    log.push('  ... req.on("close", () => clearInterval(intervalId))')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.3: SSE</h2>
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
