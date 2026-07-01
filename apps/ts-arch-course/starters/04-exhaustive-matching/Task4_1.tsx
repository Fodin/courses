import { useState } from 'react'

// ============================================
// Задание 4.1: Match Expression
// ============================================

// TODO: Реализуйте функцию match<T extends string>(value) — возвращает объект с методом:
//   with<R>(handlers: { [K in T]: (value: K) => R }): R
//   Компилятор требует обработчик для КАЖДОГО варианта T (exhaustive)
// TODO: Implement match<T extends string>(value) — returns object with method:
//   with<R>(handlers: { [K in T]: (value: K) => R }): R
//   Compiler requires handler for EVERY variant of T (exhaustive)

// TODO: Реализуйте matchTagged<T extends { kind: string }>(value) для tagged unions:
//   with<R>(handlers: { [K in T['kind']]: (val: Extract<T, { kind: K }>) => R }): R
// TODO: Implement matchTagged for tagged unions with discriminant 'kind'

// TODO: Определите HttpMethod и Shape (circle/rectangle/triangle) типы
//   Используйте match для HttpMethod, matchTagged для вычисления площадей Shape
// TODO: Define HttpMethod and Shape types
//   Use match for HttpMethod, matchTagged for computing Shape areas

export function Task4_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Match Expression ===')
    log.push('')

    // TODO: Продемонстрируйте match для строковых литералов HttpMethod
    log.push('Match for string literals:')
    log.push('  ... match(method).with({ GET: ..., POST: ..., ... })')
    log.push('')

    // TODO: Продемонстрируйте matchTagged для tagged union Shape
    log.push('Match for tagged unions:')
    log.push('  ... matchTagged(shape).with({ circle: ..., rectangle: ..., triangle: ... })')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Match Expression</h2>
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
