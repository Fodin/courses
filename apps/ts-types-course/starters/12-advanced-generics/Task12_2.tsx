import { useState } from 'react'

// ============================================
// Задание 12.2: Inference Tricks
// ============================================

// TODO: Создайте тип InferFirstArg<T> — извлекает первый аргумент из overloaded функции:
//   Подсказка: для overloaded функций TS берёт ПОСЛЕДНЮЮ сигнатуру

// TODO: Создайте тип UnionToIntersection<U> — конвертирует union в intersection:
//   UnionToIntersection<{ a: 1 } | { b: 2 }> → { a: 1 } & { b: 2 }
//   Подсказка: (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never
//   Использует контравариантность параметров функции

// TODO: Создайте тип LastOfUnion<U> — извлекает «последний» элемент union:
//   Использует UnionToIntersection + overload trick

// TODO: Создайте тип IsEqual<A, B> — точная проверка равенства типов:
//   IsEqual<string, string> → true
//   IsEqual<string, number> → false
//   IsEqual<string, string & {}> → ???
//   Подсказка: (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false

// TODO: Создайте тип Prettify<T> — разворачивает intersection в плоский объект:
//   Prettify<{ a: 1 } & { b: 2 }> → { a: 1; b: 2 }
//   Полезно для читаемости типов в IDE

export function Task12_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте UnionToIntersection:
    // type Union = { a: 1 } | { b: 2 } | { c: 3 }
    // type Inter = UnionToIntersection<Union> // { a: 1 } & { b: 2 } & { c: 3 }
    // log.push('=== UnionToIntersection ===')
    // log.push('{ a: 1 } | { b: 2 } | { c: 3 } → { a: 1 } & { b: 2 } & { c: 3 }')

    // TODO: Продемонстрируйте IsEqual:
    // log.push('')
    // log.push('=== IsEqual ===')
    // log.push('IsEqual<string, string> → true')
    // log.push('IsEqual<string, number> → false')
    // log.push('IsEqual<any, unknown> → false')
    // log.push('IsEqual<never, never> → true')

    // TODO: Продемонстрируйте Prettify:
    // type Ugly = { a: 1 } & { b: 2 } & { c: 3 }
    // type Pretty = Prettify<Ugly> // { a: 1; b: 2; c: 3 }
    // const obj: Pretty = { a: 1, b: 2, c: 3 }
    // log.push('')
    // log.push('=== Prettify ===')
    // log.push(`Prettify<{a:1} & {b:2} & {c:3}> → ${JSON.stringify(obj)}`)

    // TODO: Объясните трюк с контравариантностью:
    // log.push('')
    // log.push('UnionToIntersection использует контравариантность:')
    // log.push('Union → функции с union-параметрами → infer → intersection')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.2: Inference Tricks</h2>
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
