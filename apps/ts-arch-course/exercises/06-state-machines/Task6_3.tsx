import { useState } from 'react'

// ============================================
// Задание 6.3: Hierarchical States
// ============================================

// TODO: Определите иерархическое состояние приложения AppState:
//   offline: пустое
//   online: { connection: ConnectionSubState, auth: AuthSubState }
//   maintenance: { estimatedEnd, message }
//   ConnectionSubState: connecting { attempt } | connected { connectedAt, latency }
//   AuthSubState: anonymous | authenticating { provider } | authenticated { userId, token } | authError { reason }
// TODO: Реализуйте reduceAppState(state, action) -> AppState
// TODO: Реализуйте describeAppState(state) -> string[] — описание текущего состояния

export function Task6_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Hierarchical States ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Hierarchical State Machine')
    log.push('  ... проведите через offline -> online -> connected -> login -> authenticated -> maintenance')
    log.push('  ... покажите nested type narrowing')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: Hierarchical States</h2>
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
