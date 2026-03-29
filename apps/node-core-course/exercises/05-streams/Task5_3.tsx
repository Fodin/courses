import { useState } from 'react'

// ============================================
// Задание 5.3: Transform Stream
// ============================================

// TODO: Изучите Transform streams — одновременно Readable и Writable:
//   - Данные входят через write(), трансформируются, выходят через read()
//   - Создание: new Transform({ transform(chunk, enc, cb) { this.push(modified); cb() } })
//   - flush(cb) — вызывается после всех данных (финализация)
//   - Примеры: zlib.createGzip(), crypto.createCipheriv()
//
// TODO: Study Transform streams — both Readable and Writable:
//   - Data enters via write(), transforms, exits via read()
//   - flush(cb) — called after all data (finalization)

export function Task5_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Transform Stream ===')
    log.push('')

    // TODO: Реализуйте несколько Transform-стримов:
    //   1. UpperCaseTransform — преобразует текст в верхний регистр
    //   2. LineSplitTransform — разбивает входные данные по '\n'
    //   3. JsonParseTransform — парсит каждую строку как JSON
    //   4. FilterTransform — пропускает только элементы, удовлетворяющие предикату
    // TODO: Implement several Transform streams:
    //   1. UpperCaseTransform, 2. LineSplitTransform,
    //   3. JsonParseTransform, 4. FilterTransform

    log.push('UpperCaseTransform:')
    log.push('  ... преобразуйте "hello world" → "HELLO WORLD"')
    log.push('')

    log.push('LineSplitTransform:')
    log.push('  ... разбейте "line1\\nline2\\nline3" на отдельные элементы')
    log.push('')

    log.push('JsonParseTransform:')
    log.push('  ... распарсите JSON строки в объекты')
    log.push('')

    // TODO: Покажите цепочку трансформов: input → split → parse → filter → output
    // TODO: Show a transform chain: input → split → parse → filter → output
    log.push('Chained transforms:')
    log.push('  ... соедините трансформы в цепочку')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Transform Stream</h2>
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
