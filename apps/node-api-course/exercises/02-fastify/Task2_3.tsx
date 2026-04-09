import { useState } from 'react'

// ============================================
// Задание 2.3: Hooks Lifecycle
// Task 2.3: Hooks Lifecycle
// ============================================

// TODO: Изучите жизненный цикл хуков Fastify
// TODO: Learn the Fastify hooks lifecycle
// TODO: Реализуйте onRequest, preHandler, onSend, onResponse хуки
// TODO: Implement onRequest, preHandler, onSend, onResponse hooks
// TODO: Покажите порядок выполнения хуков в запросе
// TODO: Show the execution order of hooks in a request
// TODO: Используйте preSerialization для модификации ответа
// TODO: Use preSerialization to modify the response

export function Task2_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Hooks Lifecycle ===')
    log.push('')

    // TODO: Зарегистрируйте все основные хуки с логированием
    // TODO: Register all main hooks with logging
    // TODO: Покажите цепочку: onRequest -> preParsing -> preValidation -> preHandler -> handler -> preSerialization -> onSend -> onResponse
    // TODO: Show the chain: onRequest -> preParsing -> preValidation -> preHandler -> handler -> preSerialization -> onSend -> onResponse
    // TODO: Реализуйте timing hook для измерения времени запроса
    // TODO: Implement a timing hook to measure request time
    // TODO: Покажите как хук может прервать цепочку (reply.send)
    // TODO: Show how a hook can break the chain (reply.send)
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
