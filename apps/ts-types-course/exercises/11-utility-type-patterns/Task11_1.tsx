import { useState } from 'react'

// ============================================
// Задание 11.1: Exact Types
// ============================================

// TODO: Проблема: TypeScript позволяет лишние свойства при присвоении через переменную:
//   interface User { name: string; age: number }
//   const data = { name: 'Alice', age: 30, extra: true }
//   const user: User = data // Нет ошибки! Excess property check не работает

// TODO: Создайте тип Exact<T, Shape> — запрещает лишние свойства:
//   Подсказка: T & Record<Exclude<keyof T, keyof Shape>, never>
//   Или через mapped type: { [K in keyof T]: K extends keyof Shape ? Shape[K] : never }

// TODO: Создайте функцию exactAssign<T>(shape: T): <U extends Exact<U, T>>(data: U) => T
//   Гарантирует точное соответствие объекта типу

// TODO: Создайте тип StrictOmit<T, K> — Omit, который ошибается на несуществующих ключах:
//   StrictOmit<User, 'name'> → OK
//   StrictOmit<User, 'nonExistent'> → ошибка (в отличие от стандартного Omit)

// TODO: Создайте тип ExactPartial<T> — Partial, но без лишних ключей

export function Task11_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Покажите проблему excess property check:
    // interface User { name: string; age: number }
    // const data = { name: 'Alice', age: 30, extra: true }
    // const user: User = data // OK — лишнее свойство не проверяется!
    // log.push('=== Проблема: лишние свойства ===')
    // log.push(`User = ${JSON.stringify(user)} — extra прошло!`)

    // TODO: Покажите решение через Exact:
    // function createUser<T extends Exact<T, User>>(data: T): User { return data }
    // const goodUser = createUser({ name: 'Alice', age: 30 }) // OK
    // // createUser({ name: 'Alice', age: 30, extra: true }) // Ошибка!
    // log.push(`Exact: createUser({ name, age }) → OK`)
    // log.push('Exact: createUser({ name, age, extra }) → Ошибка компиляции!')

    // TODO: Продемонстрируйте StrictOmit:
    // type UserWithoutName = StrictOmit<User, 'name'> // OK
    // // type Bad = StrictOmit<User, 'foo'> // Ошибка!
    // log.push('StrictOmit<User, "name"> → OK')
    // log.push('StrictOmit<User, "foo"> → Ошибка компиляции!')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.1: Exact Types</h2>
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
