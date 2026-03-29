import { useState } from 'react'

// ============================================
// Задание 0.1: Generic Constraints
// ============================================

// TODO: Реализуйте функцию getProperty<T, K>(obj, key), где K ограничен ключами T
// TODO: Используйте конструкцию K extends keyof T

// TODO: Создайте интерфейс HasLength с полем length: number
// TODO: Реализуйте функцию logLength<T>(item), где T extends HasLength
// TODO: Функция должна возвращать строку с длиной и значением

// TODO: Создайте два интерфейса: Identifiable (id: string | number) и Timestamped (createdAt: Date)
// TODO: Реализуйте функцию getEntityInfo<T>(entity), где T extends Identifiable & Timestamped

// TODO: Реализуйте функцию createInstance<T>(ctor), принимающую конструктор (new () => T)
// TODO: и возвращающую экземпляр T

// TODO: Реализуйте функцию mergeObjects<T>(a, b), где T extends Record<string, unknown>
// TODO: b должен быть Partial<T>, функция возвращает объединённый объект

export function Task0_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Реализуйте getProperty и протестируйте:
    // const user = { name: 'Alice', age: 30, email: 'alice@example.com' }
    // log.push(`getProperty(user, 'name') = ${getProperty(user, 'name')}`)
    // log.push(`getProperty(user, 'age') = ${getProperty(user, 'age')}`)

    // TODO: Реализуйте logLength и протестируйте:
    // log.push(`logLength('hello') → ${logLength('hello')}`)
    // log.push(`logLength([1, 2, 3]) → ${logLength([1, 2, 3])}`)

    // TODO: Реализуйте getEntityInfo и протестируйте:
    // const post = { id: 42, title: 'TypeScript Generics', createdAt: new Date('2024-01-15') }
    // log.push(`getEntityInfo(post) = ${getEntityInfo(post)}`)

    // TODO: Реализуйте createInstance и протестируйте:
    // class Logger { message = 'Logger initialized' }
    // const logger = createInstance(Logger)
    // log.push(`createInstance(Logger).message = ${logger.message}`)

    // TODO: Реализуйте mergeObjects и протестируйте:
    // const merged = mergeObjects({ host: 'localhost', port: 3000 }, { port: 8080 })
    // log.push(`mergeObjects result = ${JSON.stringify(merged)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: Generic Constraints</h2>
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
