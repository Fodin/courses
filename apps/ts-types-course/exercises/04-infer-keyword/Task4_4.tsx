import { useState } from 'react'

// ============================================
// Задание 4.4: Infer in Tuples
// ============================================

// TODO: Создайте тип First<T> — извлекает первый элемент tuple:
//   T extends [infer F, ...unknown[]] ? F : never

// TODO: Создайте тип Last<T> — извлекает последний элемент tuple:
//   T extends [...unknown[], infer L] ? L : never

// TODO: Создайте тип Tail<T> — убирает первый элемент, возвращает остаток:
//   T extends [unknown, ...infer Rest] ? Rest : never

// TODO: Создайте тип Init<T> — убирает последний элемент, возвращает начало:
//   T extends [...infer Rest, unknown] ? Rest : never

// TODO: Создайте тип Flatten<T> — рекурсивно разворачивает вложенные tuple:
//   [1, [2, [3]]] → [1, 2, 3]
//   Подсказка: T extends [infer Head, ...infer Tail]
//     Head extends unknown[] ? [...Flatten<Head>, ...Flatten<Tail>] : [Head, ...Flatten<Tail>]

// TODO: Создайте тип Zip<A, B> — объединяет два tuple попарно:
//   Zip<[1, 2, 3], ['a', 'b', 'c']> → [[1, 'a'], [2, 'b'], [3, 'c']]

export function Task4_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте First и Last:
    // type F = First<[string, number, boolean]> // string
    // type L = Last<[string, number, boolean]> // boolean
    // log.push('First<[string, number, boolean]> → string')
    // log.push('Last<[string, number, boolean]> → boolean')

    // TODO: Продемонстрируйте Tail и Init:
    // type T = Tail<[1, 2, 3]> // [2, 3]
    // type I = Init<[1, 2, 3]> // [1, 2]

    // TODO: Продемонстрируйте Flatten runtime-аналогом:
    // function flattenArray(arr: unknown[]): unknown[] {
    //   return arr.reduce<unknown[]>((acc, item) =>
    //     Array.isArray(item) ? [...acc, ...flattenArray(item)] : [...acc, item], []
    //   )
    // }
    // log.push(`flatten([1, [2, [3]]]) → [${flattenArray([1, [2, [3]]])}]`)

    // TODO: Продемонстрируйте Zip runtime-аналогом:
    // function zip<A, B>(a: A[], b: B[]): [A, B][] {
    //   return a.map((item, i) => [item, b[i]])
    // }
    // log.push(`zip([1,2,3], ['a','b','c']) → ${JSON.stringify(zip([1,2,3], ['a','b','c']))}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.4: Infer in Tuples</h2>
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
