import { useState } from 'react'

// ============================================
// Задание 13.3: Zlib (Compression)
// ============================================

// TODO: Изучите модуль zlib для сжатия данных:
//   - zlib.gzip(data, cb) / zlib.gunzip(data, cb) — gzip
//   - zlib.deflate(data, cb) / zlib.inflate(data, cb) — deflate
//   - zlib.brotliCompress(data, cb) / zlib.brotliDecompress(data, cb)
//   - Streaming: zlib.createGzip(), zlib.createGunzip()
//   - Для HTTP: Content-Encoding: gzip / br / deflate
//   - zlib.constants — уровни сжатия (Z_BEST_SPEED, Z_BEST_COMPRESSION)
//
// TODO: Study the zlib module for data compression:
//   - gzip/gunzip, deflate/inflate, brotli
//   - Streaming compression, HTTP Content-Encoding

export function Task13_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Zlib Compression ===')
    log.push('')

    // TODO: Реализуйте упрощённый RLE (Run-Length Encoding) для демонстрации:
    //   rleEncode(input: string): string — 'AAABBC' → '3A2B1C'
    //   rleDecode(encoded: string): string — '3A2B1C' → 'AAABBC'
    //   Покажите коэффициент сжатия для разных входных данных
    // TODO: Implement simplified RLE compression for demonstration

    log.push('RLE compression:')
    log.push('  ... реализуйте и протестируйте RLE')
    log.push('')

    // TODO: Сравните алгоритмы сжатия (симуляция с предопределёнными данными):
    //   Входные данные: JSON конфиг (1KB), HTML страница (10KB), бинарные данные (5KB)
    //   Для каждого покажите:
    //     - Оригинальный размер
    //     - Размер после gzip, deflate, brotli (используйте приблизительные коэффициенты)
    //     - Коэффициент сжатия (%)
    //     - Относительное время (gzip быстрее brotli)
    // TODO: Compare compression algorithms (simulated)

    log.push('Compression comparison:')
    log.push('  ... сравните gzip, deflate, brotli')
    log.push('')

    // TODO: Покажите streaming compression для HTTP ответов:
    //   Создайте цепочку: data → createGzip() → response
    //   Объясните, когда сжатие полезно, а когда нет (маленькие ответы, уже сжатые файлы)
    // TODO: Show streaming compression for HTTP responses
    log.push('HTTP compression:')
    log.push('  ... покажите сжатие HTTP ответов')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.3: Zlib (Compression)</h2>
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
