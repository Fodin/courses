import { useState } from 'react'

// ============================================
// Задание 0.3: Inference in Functions
// ============================================

// TODO: Реализуйте функцию identity<T>(value: T): T
// TODO: TypeScript должен автоматически вывести тип из аргумента

// TODO: Реализуйте функцию firstElement<T>(arr: T[]): T | undefined
// TODO: Возвращает первый элемент массива, тип выводится из массива

// TODO: Реализуйте функцию makePair<A, B>(a: A, b: B): [A, B]
// TODO: TS выводит оба типа из аргументов

// TODO: Реализуйте функцию mapArray<T, U>(arr: T[], fn: (item: T) => U): U[]
// TODO: Тип U выводится из возвращаемого значения колбэка

// TODO: Реализуйте функцию createConfig<T extends Record<string, unknown>>(config: T): Readonly<T>
// TODO: Возвращает замороженный объект (Object.freeze)

// TODO: Реализуйте функцию pluck<T, K extends keyof T>(items: T[], key: K): T[K][]
// TODO: Извлекает массив значений по ключу из массива объектов

export function Task0_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте identity:
    // const str = identity('hello')
    // const num = identity(42)
    // log.push(`identity('hello') → "${str}"`)
    // log.push(`identity(42) → ${num}`)

    // TODO: Протестируйте firstElement:
    // log.push(`firstElement([10, 20, 30]) → ${firstElement([10, 20, 30])}`)
    // log.push(`firstElement(['a', 'b']) → "${firstElement(['a', 'b'])}"`)

    // TODO: Протестируйте makePair:
    // const pair = makePair('name', 42)
    // log.push(`makePair('name', 42) → [${pair}]`)

    // TODO: Протестируйте mapArray:
    // const lengths = mapArray(['hello', 'world', 'ts'], (s) => s.length)
    // log.push(`mapArray strings→lengths → [${lengths}]`)
    // const doubled = mapArray([1, 2, 3], (n) => n * 2)
    // log.push(`mapArray doubled → [${doubled}]`)

    // TODO: Протестируйте pluck:
    // const users = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
    // const names = pluck(users, 'name')
    // log.push(`pluck(users, 'name') → [${names}]`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.3: Inference in Functions</h2>
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
