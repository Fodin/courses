import { useState } from 'react'

// ============================================
// Задание 0.3: Static Files
// ============================================

// TODO: Реализуйте раздачу статических файлов через http-модуль
// TODO: Определите MIME-типы для .html, .css, .js, .json, .png
// TODO: Используйте fs.createReadStream для потоковой отдачи файлов
// TODO: Обработайте ошибки: файл не найден (404), ошибка чтения (500)

export function Task0_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Static File Server ===')
    log.push('')

    // TODO: Создайте маппинг расширений на MIME-типы
    // TODO: Реализуйте функцию serveStaticFile(filePath, res)
    // TODO: Покажите использование path.join для безопасных путей
    // TODO: Предотвратите directory traversal атаки (../../etc/passwd)
    log.push('Static File Server')
    log.push('  ... маппинг: { ".html": "text/html", ".css": "text/css" }')
    log.push('  ... fs.createReadStream(filePath).pipe(res)')
    log.push('  ... обработка ENOENT -> 404')
    log.push('  ... защита от path traversal')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.3: Static Files</h2>
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
