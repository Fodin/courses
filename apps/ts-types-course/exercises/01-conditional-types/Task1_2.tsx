import { useState } from 'react'

// ============================================
// Задание 1.2: Distributive Conditionals
// ============================================

// TODO: Создайте тип ToArray<T> — дистрибутивный (T extends unknown ? T[] : never)
// TODO: Поймите: ToArray<string | number> = string[] | number[] (НЕ (string | number)[])

// TODO: Создайте тип ToArrayNonDist<T> — НЕдистрибутивный ([T] extends [unknown] ? T[] : never)
// TODO: Поймите: ToArrayNonDist<string | number> = (string | number)[]

// TODO: Создайте тип MyExtract<T, U> = T extends U ? T : never
// TODO: Создайте тип MyExclude<T, U> = T extends U ? never : T

// TODO: Создайте тип IsNever<T> = [T] extends [never] ? true : false
// TODO: Подумайте: почему здесь нужна обёртка в tuple?

// TODO: Создайте тип FilterByProperty<T, K extends string>
// TODO: Оставляет из union только типы, имеющие свойство K

export function Task1_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Объясните дистрибутивность в логах:
    // log.push('=== Distributive behavior ===')
    // log.push('ToArray<string | number> = string[] | number[]')
    // log.push('ToArrayNonDist<string | number> = (string | number)[]')

    // TODO: Продемонстрируйте Extract/Exclude:
    // type Mixed = string | number | boolean | null | undefined
    // const values = ['hello', 42, true, null, undefined, 'world', 0]
    // Отфильтруйте строки (runtime-аналог Extract)
    // Исключите null/undefined (runtime-аналог Exclude)

    // TODO: Продемонстрируйте IsNever:
    // log.push('IsNever<never> → true')
    // log.push('IsNever<string> → false')
    // log.push('Без обёртки в []: BadIsNever<never> → never (не true!)')

    // TODO: Продемонстрируйте FilterByProperty:
    // interface Dog { bark(): void; name: string }
    // interface Cat { meow(): void; name: string }
    // interface Fish { swim(): void }
    // log.push('FilterByProperty<Dog | Cat | Fish, "name"> → Dog | Cat')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: Distributive Conditionals</h2>
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
