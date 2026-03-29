import { useState } from 'react'

// ============================================
// Задание 8.1: Interface Merging
// ============================================

// TODO: Продемонстрируйте слияние интерфейсов (declaration merging):
//   Два объявления одного интерфейса автоматически объединяются
//   interface User { name: string }
//   interface User { age: number }
//   → User = { name: string; age: number }

// TODO: Создайте расширяемый интерфейс Config:
//   interface Config { appName: string }
//   interface Config { version: number }
//   interface Config { debug: boolean }
//   Покажите, что все поля доступны в итоговом типе

// TODO: Продемонстрируйте слияние с namespace:
//   function formatDate(date: Date): string { ... }
//   namespace formatDate { export const defaultFormat = 'YYYY-MM-DD' }
//   Функция и namespace объединяются — можно вызвать formatDate() и formatDate.defaultFormat

// TODO: Продемонстрируйте расширение enum-подобного объекта:
//   Создайте const enum-like через interface merging

// TODO: Покажите правило: при конфликте типов свойств — ошибка компиляции
//   interface A { x: string }
//   interface A { x: number } // Ошибка! Тип не совпадает

export function Task8_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Создайте merged интерфейс User:
    // const user: User = { name: 'Alice', age: 30 }
    // log.push(`Merged User: ${JSON.stringify(user)}`)

    // TODO: Создайте merged Config:
    // const config: Config = { appName: 'MyApp', version: 1, debug: true }
    // log.push(`Merged Config: ${JSON.stringify(config)}`)

    // TODO: Продемонстрируйте function + namespace:
    // log.push(`formatDate(new Date()) → "${formatDate(new Date())}"`)
    // log.push(`formatDate.defaultFormat → "${formatDate.defaultFormat}"`)

    // TODO: Покажите ограничения:
    // log.push('Нельзя объявить одно свойство с разными типами — ошибка компиляции')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.1: Interface Merging</h2>
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
