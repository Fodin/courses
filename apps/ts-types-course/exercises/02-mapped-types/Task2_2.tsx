import { useState } from 'react'

// ============================================
// Задание 2.2: Key Remapping
// ============================================

// TODO: Создайте тип Getters<T> — преобразует ключи в getter-методы:
//   { [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K] }
//   name → getName: () => string

// TODO: Создайте тип Setters<T> — преобразует ключи в setter-методы:
//   { [K in keyof T as `set${Capitalize<K & string>}`]: (value: T[K]) => void }

// TODO: Создайте тип OmitByType<T, U> — убирает ключи, значения которых extends U:
//   Используйте as never для фильтрации: T[K] extends U ? never : K

// TODO: Создайте тип ExtractByType<T, U> — оставляет только ключи с типом U

// TODO: Создайте тип Prefixed<T, P extends string> — добавляет префикс к ключам:
//   { [K in keyof T as `${P}_${K & string}`]: T[K] }

// TODO: Создайте тип EventHandlers<T> — генерирует on{Key}Change обработчики:
//   { [K in keyof T as `on${Capitalize<K & string>}Change`]: (newValue: T[K], oldValue: T[K]) => void }

export function Task2_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте Getters:
    // interface Person { name: string; age: number; active: boolean }
    // const getters: Getters<Person> = {
    //   getName: () => 'Alice', getAge: () => 30, getActive: () => true
    // }
    // log.push(`getName() → "${getters.getName()}"`)

    // TODO: Протестируйте Setters:
    // const state: Person = { name: 'Bob', age: 25, active: false }
    // Создайте setters, которые мутируют state

    // TODO: Протестируйте OmitByType:
    // interface Mixed { id: number; name: string; active: boolean; count: number; label: string }
    // type WithoutNumbers = OmitByType<Mixed, number>
    // log.push(`OmitByType<Mixed, number> = ${JSON.stringify(filtered)}`)

    // TODO: Протестируйте ExtractByType:
    // type OnlyStrings = ExtractByType<Mixed, string>

    // TODO: Протестируйте Prefixed:
    // interface ApiData { userId: number; userName: string }
    // const prefixed: Prefixed<ApiData, 'api'> = { api_userId: 42, api_userName: 'Alice' }

    // TODO: Протестируйте EventHandlers:
    // const handlers: EventHandlers<Person> = { ... }
    // handlers.onNameChange('Dave', 'Charlie')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Key Remapping</h2>
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
