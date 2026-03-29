import { useState } from 'react'

// ============================================
// Задание 10.2: Type-Level Collections
// ============================================

// TODO: Создайте type-level операции над tuple (списками):
//   type Push<T extends unknown[], V> = [...T, V]
//   type Pop<T extends unknown[]> = T extends [...infer Init, unknown] ? Init : never
//   type Shift<T extends unknown[]> = T extends [unknown, ...infer Rest] ? Rest : never
//   type Unshift<T extends unknown[], V> = [V, ...T]

// TODO: Создайте тип Includes<T extends unknown[], V>:
//   Проверяет, есть ли V в tuple T
//   Includes<[1, 2, 3], 2> → true
//   Includes<[1, 2, 3], 4> → false

// TODO: Создайте тип Unique<T extends unknown[]>:
//   Убирает дубликаты из tuple
//   Unique<[1, 2, 2, 3, 1]> → [1, 2, 3]

// TODO: Создайте тип Reverse<T extends unknown[]>:
//   Reverse<[1, 2, 3]> → [3, 2, 1]

// TODO: Создайте тип TupleToUnion<T extends unknown[]>:
//   TupleToUnion<[string, number, boolean]> → string | number | boolean
//   Подсказка: T[number]

// TODO: Создайте тип UnionToTuple<U> (продвинутый):
//   UnionToTuple<'a' | 'b' | 'c'> → ['a', 'b', 'c']

export function Task10_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте type-level операции:
    // log.push('=== Type-Level Collections ===')
    // log.push('Push<[1, 2], 3> → [1, 2, 3]')
    // log.push('Pop<[1, 2, 3]> → [1, 2]')
    // log.push('Shift<[1, 2, 3]> → [2, 3]')
    // log.push('Unshift<[2, 3], 1> → [1, 2, 3]')

    // TODO: Продемонстрируйте Includes:
    // log.push('')
    // log.push('Includes<[1, 2, 3], 2> → true')
    // log.push('Includes<[1, 2, 3], 4> → false')

    // TODO: Продемонстрируйте Reverse:
    // log.push('Reverse<[1, 2, 3]> → [3, 2, 1]')
    // const reversed = [1, 2, 3].reverse()
    // log.push(`Runtime: [${reversed}]`)

    // TODO: Продемонстрируйте TupleToUnion:
    // log.push('TupleToUnion<[string, number]> → string | number')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.2: Type-Level Collections</h2>
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
