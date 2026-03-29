import { useState } from 'react'

// ============================================
// Задание 2.3: Hooks Lifecycle
// ============================================

// TODO: Изучите жизненный цикл хуков Fastify
// TODO: Реализуйте onRequest, preHandler, onSend, onResponse хуки
// TODO: Покажите порядок выполнения хуков в запросе
// TODO: Используйте preSerialization для модификации ответа

export function Task2_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Hooks Lifecycle ===')
    log.push('')

    // TODO: Зарегистрируйте все основные хуки с логированием
    // TODO: Покажите цепочку: onRequest -> preParsing -> preValidation -> preHandler -> handler -> preSerialization -> onSend -> onResponse
    // TODO: Реализуйте timing hook для измерения времени запроса
    // TODO: Покажите как хук может прервать цепочку (reply.send)
    log.push('Hooks Lifecycle')
    log.push('  ... onRequest -> preParsing -> preValidation')
    log.push('  ... -> preHandler -> handler -> preSerialization')
    log.push('  ... -> onSend -> onResponse')
    log.push('  ... хук может вызвать reply.send() и прервать цепочку')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.3: Hooks Lifecycle</h2>
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
