import { useState } from 'react'

// ============================================
// Задание 4.2: Infer in Parameters
// ============================================

// TODO: Создайте тип MyParameters<T> — аналог встроенного Parameters:
//   T extends (...args: infer P) => unknown ? P : never
//   Результат — tuple типов параметров

// TODO: Создайте тип FirstParameter<T> — извлекает тип первого параметра:
//   T extends (first: infer F, ...rest: unknown[]) => unknown ? F : never

// TODO: Создайте тип LastParameter<T> — извлекает тип последнего параметра:
//   Подсказка: T extends (...args: [...infer _, infer Last]) => unknown ? Last : never

// TODO: Создайте тип ConstructorParameters<T> — параметры конструктора:
//   T extends new (...args: infer P) => unknown ? P : never

// TODO: Создайте функцию wrapFunction, которая оборачивает вызов функции в try/catch:
//   function wrapFunction<T extends (...args: unknown[]) => unknown>(fn: T):
//     (...args: Parameters<T>) => ReturnType<T> | null

export function Task4_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте MyParameters:
    // function createUser(name: string, age: number, active: boolean) { return { name, age, active } }
    // type Params = MyParameters<typeof createUser> // [string, number, boolean]
    // log.push('MyParameters<typeof createUser> → [string, number, boolean]')

    // TODO: Протестируйте FirstParameter:
    // type First = FirstParameter<typeof createUser> // string
    // log.push('FirstParameter<typeof createUser> → string')

    // TODO: Протестируйте LastParameter:
    // type Last = LastParameter<typeof createUser> // boolean
    // log.push('LastParameter<typeof createUser> → boolean')

    // TODO: Протестируйте ConstructorParameters:
    // class UserService {
    //   constructor(public baseUrl: string, public timeout: number) {}
    // }
    // type CtorParams = ConstructorParameters<typeof UserService> // [string, number]

    // TODO: Протестируйте wrapFunction:
    // const safeDivide = wrapFunction((a: number, b: number) => {
    //   if (b === 0) throw new Error('Division by zero')
    //   return a / b
    // })
    // log.push(`safeDivide(10, 2) → ${safeDivide(10, 2)}`)
    // log.push(`safeDivide(10, 0) → ${safeDivide(10, 0)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Infer in Parameters</h2>
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
