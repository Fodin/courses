import { useState } from 'react'

// ============================================
// Задание 5.4: Compression & Caching
// ============================================

// TODO: Реализуйте gzip-сжатие ответов через middleware
// TODO: Настройте HTTP-кэширование: Cache-Control, ETag, Last-Modified
// TODO: Реализуйте conditional requests (304 Not Modified)
// TODO: Покажите разницу между no-cache, no-store, max-age

export function Task5_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Compression & Caching ===')
    log.push('')

    // TODO: Реализуйте compression middleware с проверкой Accept-Encoding
    // TODO: Настройте Cache-Control для разных типов ресурсов
    // TODO: Генерируйте ETag через crypto.createHash('md5')
    // TODO: Обработайте If-None-Match -> 304 Not Modified
    log.push('Compression & Caching')
    log.push('  ... Accept-Encoding: gzip -> zlib.createGzip().pipe(res)')
    log.push('  ... Cache-Control: public, max-age=3600')
    log.push('  ... ETag: "abc123" -> If-None-Match -> 304')
    log.push('  ... static: max-age=31536000, API: no-cache')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.4: Compression & Caching</h2>
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
