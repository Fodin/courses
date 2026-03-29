import { useState } from 'react'

// ============================================
// Задание 6.4: State Narrowing
// ============================================

// TODO: Определите DocumentState как union с 5 статусами:
//   draft { content, author }, review { +reviewer, comments }, approved { +approvedBy, approvedAt }
//   published { +publishedAt, url }, archived { +archivedAt, reason }
// TODO: Реализуйте type guard isInState<S>(state, status): state is Extract<...>
// TODO: Реализуйте getStateData<S>(state, status) -> Extract<...> | null
// TODO: Реализуйте matchDocumentState — exhaustive matching
// TODO: Transition функции принимают ТОЛЬКО правильное входное состояние:
//   submitForReview(draft) -> review, approve(review) -> approved, publish(approved) -> published

export function Task6_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== State Narrowing ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Document Workflow with State Narrowing')
    log.push('  ... проведите документ: draft -> review -> approved -> published')
    log.push('  ... покажите isInState(), getStateData(), matchDocumentState()')
    log.push('  ... submitForReview() принимает ТОЛЬКО draft — TS ошибка для других')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.4: State Narrowing</h2>
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
