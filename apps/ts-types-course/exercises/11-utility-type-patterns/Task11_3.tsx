import { useState } from 'react'

// ============================================
// Задание 11.3: DeepPick & DeepOmit
// ============================================

// TODO: Создайте тип DeepPick<T, Path extends string> — выбор вложенных свойств по пути:
//   interface Config { server: { host: string; port: number; ssl: { cert: string; key: string } } }
//   DeepPick<Config, 'server.host' | 'server.ssl.cert'>
//   → { server: { host: string; ssl: { cert: string } } }
//
//   Подсказка: разбирайте путь через template literal:
//   Path extends `${infer Key}.${infer Rest}` ? { [K in Key]: DeepPick<T[K], Rest> } : Pick<T, Path>

// TODO: Создайте тип DeepOmit<T, Path extends string> — удаление вложенных свойств:
//   DeepOmit<Config, 'server.ssl.key'> — убирает ssl.key из конфигурации

// TODO: Реализуйте runtime-функцию deepPick<T>(obj: T, paths: string[]): Partial<T>
//   Возвращает объект только с указанными путями

// TODO: Реализуйте runtime-функцию deepOmit<T>(obj: T, paths: string[]): Partial<T>
//   Возвращает объект без указанных путей

export function Task11_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Создайте Config и протестируйте DeepPick:
    // const config = {
    //   server: { host: 'localhost', port: 3000, ssl: { cert: 'cert.pem', key: 'key.pem' } },
    //   database: { host: 'db', port: 5432 }
    // }
    //
    // const picked = deepPick(config, ['server.host', 'server.ssl.cert'])
    // log.push('=== DeepPick ===')
    // log.push(`deepPick(config, ['server.host', 'server.ssl.cert'])`)
    // log.push(`→ ${JSON.stringify(picked, null, 2)}`)

    // TODO: Протестируйте DeepOmit:
    // const omitted = deepOmit(config, ['server.ssl.key', 'database.port'])
    // log.push('')
    // log.push('=== DeepOmit ===')
    // log.push(`deepOmit(config, ['server.ssl.key', 'database.port'])`)
    // log.push(`→ ${JSON.stringify(omitted, null, 2)}`)

    // TODO: Покажите type-level примеры:
    // log.push('')
    // log.push('Type-level:')
    // log.push("DeepPick<Config, 'server.host'> → { server: { host: string } }")
    // log.push("DeepOmit<Config, 'server.ssl.key'> → { server: { ..., ssl: { cert: string } } }")

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.3: DeepPick & DeepOmit</h2>
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
