import { useState } from 'react'

// ============================================
// Задание 4.1: Infer in Return Types
// ============================================

// TODO: Создайте тип MyReturnType<T> — аналог встроенного ReturnType:
//   T extends (...args: unknown[]) => infer R ? R : never

// TODO: Создайте тип UnwrapPromise<T>:
//   T extends Promise<infer U> ? U : T

// TODO: Создайте тип DeepUnwrapPromise<T> — рекурсивный unwrap:
//   T extends Promise<infer U> ? DeepUnwrapPromise<U> : T

// TODO: Создайте тип ArrayElement<T> — извлекает тип элемента массива:
//   T extends (infer E)[] ? E : never

// TODO: Скомбинируйте: UnwrapPromise<ReturnType<typeof asyncFn>> для async-функций

export function Task4_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте MyReturnType:
    // function getUser() { return { id: 1, name: 'Alice', active: true } }
    // type UserResult = MyReturnType<typeof getUser>
    // const user: UserResult = { id: 1, name: 'Alice', active: true }
    // log.push(`MyReturnType<typeof getUser>: ${JSON.stringify(user)}`)

    // TODO: Протестируйте UnwrapPromise:
    // type ResolvedString = UnwrapPromise<Promise<string>>
    // const val: ResolvedString = 'hello'
    // log.push(`UnwrapPromise<Promise<string>>: "${val}"`)

    // TODO: Протестируйте DeepUnwrapPromise:
    // type Deep = DeepUnwrapPromise<Promise<Promise<Promise<number>>>>
    // log.push(`DeepUnwrapPromise: ${num} (тип: number)`)

    // TODO: Протестируйте ArrayElement:
    // type Elem = ArrayElement<string[]>
    // log.push(`ArrayElement<string[]>: тип string`)

    // TODO: Протестируйте комбинацию с async-функцией:
    // async function fetchUsers(): Promise<{ id: number; name: string }[]> {
    //   return [{ id: 1, name: 'Bob' }]
    // }
    // type FetchResult = UnwrapPromise<ReturnType<typeof fetchUsers>>

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Infer in Return Types</h2>
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
