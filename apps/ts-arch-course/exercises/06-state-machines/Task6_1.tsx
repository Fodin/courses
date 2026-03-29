import { useState } from 'react'

// ============================================
// Задание 6.1: State Transitions
// ============================================

// TODO: Определите TransitionMap — маппинг допустимых переходов между состояниями
// TODO: Реализуйте TypedStateMachine с состояниями: idle, fetching, success, error
//   transition(to) — проверяет допустимость перехода, бросает ошибку при невалидном
//   state (getter), history — массив { from, to }
// TODO: Определите AllowedTransitions = { [K in State]: State[] }
//   idle -> [fetching], fetching -> [success, error], success -> [idle, fetching], error -> [idle, fetching]

export function Task6_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== State Transitions ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Typed State Machine: Fetch lifecycle')
    log.push('  ... создайте машину, покажите валидные и невалидные переходы')
    log.push('  ... выведите историю и карту допустимых переходов')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: State Transitions</h2>
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
