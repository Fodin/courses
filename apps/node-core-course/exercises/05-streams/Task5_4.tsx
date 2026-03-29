import { useState } from 'react'

// ============================================
// Задание 5.4: Pipeline
// ============================================

// TODO: Изучите stream.pipeline() — безопасное соединение стримов:
//   - pipeline(source, ...transforms, destination, callback)
//   - Автоматически обрабатывает ошибки и очистку
//   - stream.pipeline с промисами: const { pipeline } = require('stream/promises')
//   - Преимущество перед pipe(): корректная обработка ошибок и destroy
//
// TODO: Study stream.pipeline() — safe stream composition:
//   - Automatically handles errors and cleanup
//   - Promise version: stream/promises pipeline
//   - Advantage over pipe(): proper error handling and destroy

export function Task5_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Stream Pipeline ===')
    log.push('')

    // TODO: Покажите проблему с pipe() — если один стрим ошибается,
    //   другие не уничтожаются (утечка ресурсов)
    // TODO: Show the problem with pipe() — if one stream errors,
    //   others are not destroyed (resource leak)

    log.push('Problem with pipe():')
    log.push('  ... покажите, что ошибка в середине цепочки не очищает ресурсы')
    log.push('')

    // TODO: Реализуйте упрощённый myPipeline(...streams):
    //   1. Соединяет стримы через pipe
    //   2. Подписывается на 'error' каждого стрима
    //   3. При ошибке вызывает destroy() на ВСЕХ стримах
    //   4. Возвращает Promise, который resolve/reject при завершении
    // TODO: Implement simplified myPipeline(...streams):
    //   1. Connects streams via pipe
    //   2. Listens for 'error' on each stream
    //   3. On error, calls destroy() on ALL streams
    //   4. Returns Promise that resolves/rejects on completion

    log.push('myPipeline implementation:')
    log.push('  ... реализуйте безопасный pipeline')
    log.push('')

    // TODO: Продемонстрируйте pipeline с обработкой ошибок:
    //   source → transform (может бросить ошибку) → destination
    //   Покажите, что все стримы корректно закрываются при ошибке
    // TODO: Demonstrate pipeline with error handling
    log.push('Pipeline with error:')
    log.push('  ... покажите корректное поведение при ошибке')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.4: Pipeline</h2>
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
