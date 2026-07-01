import { useState } from 'react'

// ============================================
// Задание 2.3: Modifier Manipulation
// ============================================

// TODO: Создайте тип Mutable<T> — удаляет readonly со всех свойств:
//   { -readonly [K in keyof T]: T[K] }

// TODO: Создайте тип Concrete<T> — удаляет optional (?) со всех свойств:
//   { [K in keyof T]-?: T[K] }

// TODO: Создайте тип ReadonlyRequired<T> — readonly + required одновременно:
//   { readonly [K in keyof T]-?: T[K] }

// TODO: Создайте тип ReadonlyPick<T, K extends keyof T> — selective readonly:
//   Указанные ключи K становятся readonly, остальные остаются мутабельными
//   Подсказка: пересечение { readonly [P in K]: T[P] } & { [P in Exclude<keyof T, K>]: T[P] }

// TODO: Создайте тип OptionalExcept<T, K extends keyof T>:
//   Указанные ключи K обязательны, остальные — опциональны
//   Подсказка: Required<Pick<T, K>> & Partial<Omit<T, K>> (или через mapped types)

export function Task2_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте Mutable:
    // interface FrozenConfig { readonly host: string; readonly port: number; readonly debug: boolean }
    // const mutableConfig: Mutable<FrozenConfig> = { host: 'localhost', port: 3000, debug: false }
    // mutableConfig.host = '0.0.0.0' // Теперь можно!
    // log.push('=== Mutable<T> ===')
    // log.push(`mutableConfig = ${JSON.stringify(mutableConfig)}`)

    // TODO: Протестируйте Concrete:
    // interface PartialForm { username?: string; password?: string; email?: string }
    // const form: Concrete<PartialForm> = { username: 'alice', password: 'secret', email: 'a@t.com' }

    // TODO: Протестируйте ReadonlyRequired:
    // interface Settings { theme?: string; fontSize?: number; language?: string }
    // const settings: ReadonlyRequired<Settings> = { theme: 'dark', fontSize: 14, language: 'en' }

    // TODO: Протестируйте ReadonlyPick:
    // interface Document { id: string; title: string; content: string; author: string }
    // const doc: ReadonlyPick<Document, 'id' | 'author'> = { ... }
    // doc.title = 'Updated' // OK
    // doc.id = 'new' // Ошибка: readonly

    // TODO: Протестируйте OptionalExcept:
    // interface Registration { username: string; email: string; phone: string; address: string }
    // const minimal: OptionalExcept<Registration, 'username' | 'email'> = {
    //   username: 'alice', email: 'alice@test.com'
    // }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.3: Modifier Manipulation</h2>
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
