import { useState } from 'react'

// ============================================
// Задание 1.4: Conditional Types with Generics
// ============================================

// TODO: Создайте тип Flatten<T> — рекурсивно разворачивает Promise и Array:
//   Promise<infer U> → Flatten<U>, Array<infer E> → Flatten<E>, иначе → T

// TODO: Создайте типы OptionalKeys<T> и RequiredKeys<T>:
//   OptionalKeys — извлекает имена опциональных свойств
//   RequiredKeys — извлекает имена обязательных свойств
//   Подсказка: используйте undefined extends T[K] для проверки опциональности

// TODO: Создайте типы FunctionKeys<T> и NonFunctionKeys<T>:
//   FunctionKeys — ключи, значения которых являются функциями
//   NonFunctionKeys — ключи, значения которых НЕ являются функциями

// TODO: Реализуйте функцию processValue<T extends string | number>(value):
//   Если string → возвращает string[] (value.split(''))
//   Если number → возвращает number (value * 2)
//   Возвращаемый тип: T extends string ? string[] : number

// TODO: Создайте тип MakeRequired<T, K extends keyof T>:
//   Делает указанные ключи обязательными, остальные не трогает
//   Подсказка: Omit<T, K> & Required<Pick<T, K>>

export function Task1_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Выведите compile-time примеры Flatten:
    // log.push('=== Flatten<T> ===')
    // log.push('Flatten<Promise<string[]>> → string')
    // log.push('Flatten<number[][]> → number')

    // TODO: Продемонстрируйте OptionalKeys/RequiredKeys:
    // interface UserProfile { id: number; name: string; email?: string; phone?: string; bio?: string }
    // log.push('RequiredKeys<UserProfile> → ["id", "name"]')
    // log.push('OptionalKeys<UserProfile> → ["email", "phone", "bio"]')

    // TODO: Продемонстрируйте FunctionKeys/NonFunctionKeys:
    // const service = {
    //   name: 'AuthService', version: 2,
    //   login: (_user: string) => true, logout: () => {}, getToken: () => 'abc123'
    // }
    // Разделите ключи на функции и данные (runtime)

    // TODO: Протестируйте processValue:
    // log.push(`processValue("hello") → [${processValue('hello')}]`)
    // log.push(`processValue(42) → ${processValue(42)}`)

    // TODO: Протестируйте MakeRequired:
    // interface FormData { username?: string; password?: string; email?: string }
    // const form: MakeRequired<FormData, 'username' | 'password'> = {
    //   username: 'alice', password: 'secret123'
    // }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: Conditional Types with Generics</h2>
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
