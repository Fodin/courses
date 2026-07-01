import { useState } from 'react'

// ============================================
// Задание 12.1: Typed Mocks
// ============================================

// TODO: Определите MockFunction<TArgs, TReturn> — функция с трекингом:
//   calls: TArgs[], returnValues: TReturn[], mockReturnValue(value),
//   mockImplementation(fn), calledWith(...args), calledTimes(), reset()
// TODO: Реализуйте createMockFn<TArgs, TReturn>(defaultReturn) -> MockFunction
// TODO: Определите MockOf<T> — каждый метод T заменён на MockFunction
// TODO: Реализуйте createMock<T>(defaults) -> MockOf<T>

export function Task12_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Typed Mocks ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Typed Mocks')
    log.push('  ... создайте моки для UserRepository, EmailService, Logger')
    log.push('  ... покажите calledTimes, calledWith, mockImplementation')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.1: Typed Mocks</h2>
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
