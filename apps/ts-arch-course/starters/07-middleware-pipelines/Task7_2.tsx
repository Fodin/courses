import { useState } from 'react'

// ============================================
// Задание 7.2: Context Accumulation
// ============================================

// TODO: Определите AccumulatingMiddleware<TIn, TOut extends TIn> = (ctx: TIn) => TOut
// TODO: Создайте цепочку расширяющихся контекстов:
//   BaseContext { requestId, timestamp }
//   WithUser extends BaseContext { user: {...} }
//   WithPermissions extends WithUser { permissions: string[] }
//   WithAudit extends WithPermissions { audit: {...} }
// TODO: Реализуйте middleware: addUser, addPermissions, addAudit
//   Каждый доступен ТОЛЬКО после предыдущего (addPermissions требует WithUser)
// TODO: Реализуйте pipe() с перегрузками для типобезопасной цепочки

export function Task7_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Context Accumulation ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Context Accumulation')
    log.push('  ... пропустите BaseContext через addUser -> addPermissions -> addAudit')
    log.push('  ... покажите что addPermissions(base) — TS ошибка (нет user)')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.2: Context Accumulation</h2>
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
