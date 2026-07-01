import { useState } from 'react'

// ============================================
// Задание 11.3: Async Iterators
// ============================================

// TODO: Изучите async iterators в контексте Node.js:
//   - for await...of — потребление async iterable
//   - async function* — создание async generator
//   - Readable streams реализуют Symbol.asyncIterator
//   - events.on(emitter, event) → AsyncIterator
//   - Используются в: streams, database cursors, paginated APIs
//   - Поддержка AbortSignal для прерывания итерации
//
// TODO: Study async iterators in Node.js context:
//   - for await...of, async generators, streams as async iterables

export function Task11_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Async Iterators ===')
    log.push('')

    // TODO: Реализуйте async generator, имитирующий paginated API:
    //   async function* fetchPages(totalPages: number): AsyncGenerator<PageData>
    //   Каждая "страница" содержит items: Array<{ id, name }>
    //   Имитируйте задержку сети через setTimeout
    // TODO: Implement async generator simulating paginated API

    log.push('Paginated API iterator:')
    log.push('  ... реализуйте постраничную загрузку через async generator')
    log.push('')

    // TODO: Реализуйте утилиты для async iterators:
    //   1. asyncMap(iterable, fn) — трансформация элементов
    //   2. asyncFilter(iterable, fn) — фильтрация
    //   3. asyncTake(iterable, n) — взять первые N элементов
    //   4. asyncBatch(iterable, size) — группировка в батчи
    // TODO: Implement async iterator utilities

    log.push('Async iterator utilities:')
    log.push('  ... реализуйте map, filter, take, batch')
    log.push('')

    // TODO: Покажите чтение stream через async iterator:
    //   for await (const chunk of readableStream) { ... }
    //   Сравните с событийным подходом ('data' event)
    // TODO: Show reading a stream via async iterator
    log.push('Stream as async iterable:')
    log.push('  ... прочитайте стрим через for await...of')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.3: Async Iterators</h2>
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
