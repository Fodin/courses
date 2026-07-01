import { useState } from 'react'

// ============================================
// Задание 9.4: Recovery Strategies
// ============================================

// TODO: Реализуйте retry<T, E>(operation, config) -> Result<T, E & { attempts }>
//   config: { maxAttempts, delayMs, backoffMultiplier? }
// TODO: Реализуйте withFallback<T, E1, E2>(primary, fallback) -> Result<T, { primary: E1, fallback: E2 }>
// TODO: Реализуйте createCircuitBreaker<T, E>(config):
//   execute(operation) -> Result<T, E | { circuitOpen: true, resetIn: number }>
//   getState() -> { failures, state: 'closed'|'open'|'half-open', lastFailureTime }

export function Task9_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Recovery Strategies ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Recovery Strategies')
    log.push('  ... retry: успех на 3й попытке и полный провал')
    log.push('  ... withFallback: primary fails, fallback succeeds')
    log.push('  ... circuit breaker: threshold, open state, resetIn')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.4: Recovery Strategies</h2>
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
