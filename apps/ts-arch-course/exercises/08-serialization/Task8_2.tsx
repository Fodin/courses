import { useState } from 'react'

// ============================================
// Задание 8.2: Codec Pattern
// ============================================

// TODO: Определите Codec<TDecoded, TEncoded> { encode, decode, pipe }
//   pipe<TFinal>(other: Codec<TEncoded, TFinal>) -> Codec<TDecoded, TFinal>
// TODO: Реализуйте createCodec<D, E>(encode, decode) -> Codec<D, E>
// TODO: Создайте кодеки: dateCodec (Date<->string), numberCodec (number<->string),
//   base64Codec (string<->string), jsonCodec (object<->string)
// TODO: Скомпонуйте: compressedJsonCodec = jsonCodec.pipe(base64Codec)

export function Task8_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Codec Pattern ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Codec Pattern')
    log.push('  ... покажите encode/decode для каждого кодека')
    log.push('  ... скомпонуйте jsonCodec.pipe(base64Codec) и покажите roundtrip')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.2: Codec Pattern</h2>
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
