import { useState } from 'react'

// ============================================
// Задание 6.1: Custom Type Predicates
// ============================================

// TODO: Создайте иерархию типов:
//   interface User { id: number; name: string; email: string }
//   interface Admin extends User { role: 'admin'; permissions: string[] }
//   interface Guest { sessionId: string; temporary: true }
//   type Actor = User | Admin | Guest

// TODO: Реализуйте type predicate функции:
//   isUser(actor: Actor): actor is User — проверяет наличие id и name, отсутствие role
//   isAdmin(actor: Actor): actor is Admin — проверяет role === 'admin'
//   isGuest(actor: Actor): actor is Guest — проверяет наличие sessionId и temporary

// TODO: Реализуйте generic type guard:
//   function hasProperty<T extends object, K extends string>(
//     obj: T, key: K
//   ): obj is T & Record<K, unknown>

// TODO: Реализуйте type guard для массивов:
//   function isNonEmpty<T>(arr: T[]): arr is [T, ...T[]]
//   function isStringArray(arr: unknown[]): arr is string[]

// TODO: Реализуйте функцию processActor(actor: Actor): string
//   Используйте type guards для сужения типа и доступа к специфичным полям

export function Task6_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Создайте экземпляры каждого типа и протестируйте guards:
    // const admin: Actor = { id: 1, name: 'Alice', email: 'a@t.com', role: 'admin', permissions: ['read', 'write'] }
    // const user: Actor = { id: 2, name: 'Bob', email: 'b@t.com' }
    // const guest: Actor = { sessionId: 'abc-123', temporary: true }
    //
    // log.push(`isAdmin(admin): ${isAdmin(admin)}`)
    // log.push(`isUser(user): ${isUser(user)}`)
    // log.push(`isGuest(guest): ${isGuest(guest)}`)

    // TODO: Протестируйте hasProperty:
    // const obj = { name: 'test', value: 42 }
    // if (hasProperty(obj, 'name')) {
    //   log.push(`obj has 'name': ${obj.name}`)
    // }

    // TODO: Протестируйте isNonEmpty:
    // const arr = [1, 2, 3]
    // if (isNonEmpty(arr)) {
    //   log.push(`First element: ${arr[0]}`) // type-safe доступ
    // }

    // TODO: Протестируйте processActor:
    // log.push(processActor(admin))
    // log.push(processActor(user))
    // log.push(processActor(guest))

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: Custom Type Predicates</h2>
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
