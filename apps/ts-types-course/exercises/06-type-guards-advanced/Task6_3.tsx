import { useState } from 'react'

// ============================================
// Задание 6.3: Generic Narrowing
// ============================================

// TODO: Реализуйте generic type guard isOfType:
//   function isOfType<T>(value: unknown, check: (v: unknown) => boolean): value is T
//   Обёртка для любой проверки, возвращающая type predicate

// TODO: Реализуйте generic type guard для интерфейсов по ключам:
//   function hasKeys<T extends Record<string, unknown>>(
//     value: unknown, keys: (keyof T)[]
//   ): value is T
//   Проверяет, что value — объект и содержит все указанные ключи

// TODO: Реализуйте type guard для discriminated unions:
//   function isVariant<T extends { type: string }, K extends T['type']>(
//     value: T, type: K
//   ): value is Extract<T, { type: K }>

// TODO: Реализуйте filter с сужением типа:
//   function typedFilter<T, U extends T>(arr: T[], guard: (item: T) => item is U): U[]
//   Обёртка над Array.filter с правильным выводом типа

// TODO: Реализуйте pipeline валидации:
//   function validate<T>(value: unknown, ...guards: ((v: unknown) => v is unknown)[]): value is T

export function Task6_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте isOfType:
    // const val: unknown = 42
    // if (isOfType<number>(val, v => typeof v === 'number')) {
    //   log.push(`isOfType<number>: ${val.toFixed(2)}`)
    // }

    // TODO: Протестируйте hasKeys:
    // interface User { name: string; age: number }
    // const obj: unknown = { name: 'Alice', age: 30 }
    // if (hasKeys<User>(obj, ['name', 'age'])) {
    //   log.push(`hasKeys<User>: ${obj.name}, ${obj.age}`)
    // }

    // TODO: Протестируйте isVariant:
    // type Event = { type: 'click'; x: number } | { type: 'key'; code: string }
    // const event: Event = { type: 'click', x: 100 }
    // if (isVariant(event, 'click')) {
    //   log.push(`isVariant click: x=${event.x}`)
    // }

    // TODO: Протестируйте typedFilter:
    // const mixed: (string | number)[] = ['a', 1, 'b', 2, 'c', 3]
    // const strings = typedFilter(mixed, (v): v is string => typeof v === 'string')
    // log.push(`typedFilter strings: [${strings.join(', ')}]`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: Generic Narrowing</h2>
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
