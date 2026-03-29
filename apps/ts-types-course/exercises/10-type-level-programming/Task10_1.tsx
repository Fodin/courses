import { useState } from 'react'

// ============================================
// Задание 10.1: Type-Level Arithmetic
// ============================================

// TODO: Реализуйте арифметику на уровне типов через tuple length:
//   Числа представлены как длина tuple: type Three = [1, 1, 1] (length = 3)

// TODO: Создайте тип BuildTuple<N, Acc extends unknown[]> — tuple длины N:
//   BuildTuple<3> → [unknown, unknown, unknown]

// TODO: Создайте тип Add<A, B> — сложение:
//   Add<2, 3> → 5
//   Подсказка: [...BuildTuple<A>, ...BuildTuple<B>]['length']

// TODO: Создайте тип Subtract<A, B> — вычитание:
//   Subtract<5, 2> → 3
//   Подсказка: BuildTuple<A> extends [...BuildTuple<B>, ...infer Rest] ? Rest['length'] : never

// TODO: Создайте тип Multiply<A, B> — умножение:
//   Multiply<3, 4> → 12
//   Подсказка: рекурсивно складывайте A сам с собой B раз

// TODO: Создайте тип IsEven<N> — проверка чётности:
//   IsEven<4> → true, IsEven<5> → false

export function Task10_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте type-level арифметику:
    // log.push('=== Type-Level Arithmetic ===')
    // log.push('Add<2, 3> → 5')
    // log.push('Subtract<5, 2> → 3')
    // log.push('Multiply<3, 4> → 12')
    // log.push('IsEven<4> → true')
    // log.push('IsEven<5> → false')

    // TODO: Покажите runtime-верификацию:
    // type Five = Add<2, 3>
    // const five: Five = 5 // Если тип работает правильно, это скомпилируется
    // log.push(`Add<2, 3> verified at runtime: ${five}`)

    // TODO: Покажите ограничения:
    // log.push('')
    // log.push('Ограничения: работает для чисел до ~40-50')
    // log.push('Для больших чисел — recursion depth exceeded')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.1: Type-Level Arithmetic</h2>
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
