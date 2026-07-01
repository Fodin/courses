import { useState } from 'react'

// ============================================
// Задание 2.1: Basic Mapped Types
// ============================================

// TODO: Создайте тип MyReadonly<T> — делает все свойства readonly
// TODO: Синтаксис: { readonly [K in keyof T]: T[K] }

// TODO: Создайте тип MyPartial<T> — делает все свойства опциональными
// TODO: Синтаксис: { [K in keyof T]?: T[K] }

// TODO: Создайте тип MyRequired<T> — делает все свойства обязательными
// TODO: Синтаксис: { [K in keyof T]-?: T[K] }

// TODO: Создайте тип MyPick<T, K extends keyof T> — выбирает подмножество ключей
// TODO: Синтаксис: { [P in K]: T[P] }

// TODO: Создайте тип MyRecord<K extends string | number | symbol, V>
// TODO: Синтаксис: { [P in K]: V }

// TODO: Создайте тип Nullable<T> — делает все значения T[K] | null

export function Task2_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте MyReadonly:
    // interface User { name: string; age: number; email: string }
    // const readonlyUser: MyReadonly<User> = { name: 'Alice', age: 30, email: 'alice@test.com' }
    // log.push('=== MyReadonly<T> ===')
    // log.push(`readonlyUser = ${JSON.stringify(readonlyUser)}`)
    // log.push('readonlyUser.name is readonly — cannot reassign')

    // TODO: Протестируйте MyPartial:
    // const partialUser: MyPartial<User> = { name: 'Bob' }
    // log.push('=== MyPartial<T> ===')
    // log.push(`partialUser = ${JSON.stringify(partialUser)}`)

    // TODO: Протестируйте MyRequired:
    // interface Config { host?: string; port?: number; debug?: boolean }
    // const requiredConfig: MyRequired<Config> = { host: 'localhost', port: 3000, debug: false }

    // TODO: Протестируйте MyPick:
    // type UserName = MyPick<User, 'name' | 'email'>
    // const picked: UserName = { name: 'Charlie', email: 'charlie@test.com' }

    // TODO: Протестируйте MyRecord:
    // type StatusMap = MyRecord<'active' | 'inactive' | 'banned', { label: string; color: string }>

    // TODO: Протестируйте Nullable:
    // const nullableUser: Nullable<User> = { name: 'Dave', age: null, email: null }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Basic Mapped Types</h2>
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
