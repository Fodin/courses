import { useState } from 'react'

// ============================================
// Задание 7.3: Interceptors
// ============================================

// TODO: Определите Interceptor<TReq, TRes>:
//   name: string
//   before?: (req: TReq) => TReq — трансформация запроса
//   after?: (res: TRes) => TRes — трансформация ответа (в обратном порядке)
//   onError?: (error: Error, req: TReq) => TRes | never — обработка ошибок
// TODO: Реализуйте createInterceptorPipeline(interceptors, handler) -> (req) => res
//   before hooks выполняются в прямом порядке, after — в обратном
// TODO: Создайте interceptors: authInterceptor, timingInterceptor, errorInterceptor

export function Task7_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Interceptors ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Interceptors')
    log.push('  ... покажите success сценарий (auth + timing) и error сценарий (errorInterceptor ловит)')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.3: Interceptors</h2>
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
