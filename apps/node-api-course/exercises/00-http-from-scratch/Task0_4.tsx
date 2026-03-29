import { useState } from 'react'

// ============================================
// Задание 0.4: POST Body Parsing
// ============================================

// TODO: Реализуйте парсинг тела POST-запроса из chunks
// TODO: Соберите данные через req.on('data') и req.on('end')
// TODO: Распарсите JSON-тело через JSON.parse с обработкой ошибок
// TODO: Обработайте Content-Type: application/x-www-form-urlencoded

export function Task0_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== POST Body Parsing ===')
    log.push('')

    // TODO: Реализуйте функцию parseBody(req): Promise<unknown>
    // TODO: Покажите сборку chunks в Buffer и декодирование в строку
    // TODO: Добавьте валидацию Content-Length (защита от слишком больших тел)
    // TODO: Обработайте JSON.parse SyntaxError -> 400 Bad Request
    log.push('Body Parser')
    log.push('  ... req.on("data", chunk => chunks.push(chunk))')
    log.push('  ... req.on("end", () => Buffer.concat(chunks))')
    log.push('  ... JSON.parse с try/catch -> 400 при ошибке')
    log.push('  ... лимит Content-Length для защиты от DoS')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.4: POST Body Parsing</h2>
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
