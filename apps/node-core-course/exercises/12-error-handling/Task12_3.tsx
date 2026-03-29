import { useState } from 'react'

// ============================================
// Задание 12.3: Async Error Patterns
// ============================================

// TODO: Изучите паттерны обработки ошибок в async коде Node.js:
//   Callback pattern: fn(err, result) — error-first callback
//   EventEmitter pattern: emitter.on('error', handler)
//   Promise/async-await: try/catch, .catch()
//   Stream errors: stream.on('error') + pipeline()
//   Проблемы: потеря stack trace в async, ошибки в setTimeout
//
// TODO: Study async error handling patterns in Node.js:
//   Callback (error-first), EventEmitter, Promise/async, Stream

export function Task12_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Async Error Patterns ===')
    log.push('')

    // TODO: Покажите все 4 паттерна обработки ошибок:
    //   1. Error-first callback:
    //      fs.readFile('/missing', (err, data) => { if (err) ... })
    //   2. EventEmitter:
    //      server.on('error', (err) => { ... })
    //   3. Promise/async:
    //      try { await fs.promises.readFile('/missing') } catch (err) { ... }
    //   4. Stream:
    //      pipeline(source, transform, dest).catch(err => ...)
    // TODO: Show all 4 error handling patterns

    log.push('1. Error-first callback:')
    log.push('  ... покажите паттерн callback(err, result)')
    log.push('')
    log.push('2. EventEmitter error:')
    log.push('  ... покажите обработку ошибки через событие')
    log.push('')
    log.push('3. Promise/async-await:')
    log.push('  ... покажите try/catch с async/await')
    log.push('')
    log.push('4. Stream error:')
    log.push('  ... покажите обработку ошибок в pipeline')
    log.push('')

    // TODO: Реализуйте утилиту для конвертации callback → Promise:
    //   function promisify<T>(fn: (...args: [...any, (err: Error | null, result: T) => void]) => void)
    //     : (...args: any[]) => Promise<T>
    //   Покажите обработку ошибок в обоих стилях
    // TODO: Implement callback-to-Promise converter (promisify)

    log.push('promisify:')
    log.push('  ... конвертируйте callback API в Promise')
    log.push('')

    // TODO: Покажите проблему потери stack trace в async коде
    //   и решение с --async-stack-traces (Error.captureStackTrace)
    // TODO: Show lost stack trace problem and solution
    log.push('Async stack traces:')
    log.push('  ... покажите проблему и решение')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.3: Async Error Patterns</h2>
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
