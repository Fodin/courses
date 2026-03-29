import { useState } from 'react'

// ============================================
// Задание 5.1: Exhaustive Switches
// ============================================

// TODO: Создайте discriminated union Shape:
//   | { kind: 'circle'; radius: number }
//   | { kind: 'rectangle'; width: number; height: number }
//   | { kind: 'triangle'; base: number; height: number }

// TODO: Реализуйте функцию assertNever(value: never): never
//   Бросает ошибку — гарантирует exhaustiveness checking

// TODO: Реализуйте функцию getArea(shape: Shape): number
//   Используйте switch по shape.kind с default: assertNever(shape)
//   Формулы: circle = PI*r^2, rectangle = w*h, triangle = b*h/2

// TODO: Создайте discriminated union Result:
//   | { status: 'success'; data: string }
//   | { status: 'error'; message: string }
//   | { status: 'loading' }
// TODO: Реализуйте функцию renderResult(result: Result): string
//   Используйте exhaustive switch

// TODO: Создайте union Action для Redux-подобного reducer:
//   | { type: 'INCREMENT'; amount: number }
//   | { type: 'DECREMENT'; amount: number }
//   | { type: 'RESET' }
// TODO: Реализуйте reducer(state: number, action: Action): number

export function Task5_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте getArea:
    // const circle: Shape = { kind: 'circle', radius: 5 }
    // const rect: Shape = { kind: 'rectangle', width: 4, height: 6 }
    // const tri: Shape = { kind: 'triangle', base: 3, height: 8 }
    // log.push(`Площадь круга (r=5): ${getArea(circle).toFixed(2)}`)
    // log.push(`Площадь прямоугольника (4x6): ${getArea(rect)}`)
    // log.push(`Площадь треугольника (b=3, h=8): ${getArea(tri)}`)

    // TODO: Протестируйте renderResult:
    // log.push(renderResult({ status: 'success', data: 'OK' }))
    // log.push(renderResult({ status: 'error', message: 'Not found' }))
    // log.push(renderResult({ status: 'loading' }))

    // TODO: Протестируйте reducer:
    // let state = 0
    // state = reducer(state, { type: 'INCREMENT', amount: 5 })
    // log.push(`После INCREMENT 5: ${state}`)
    // state = reducer(state, { type: 'DECREMENT', amount: 2 })
    // log.push(`После DECREMENT 2: ${state}`)
    // state = reducer(state, { type: 'RESET' })
    // log.push(`После RESET: ${state}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Exhaustive Switches</h2>
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
