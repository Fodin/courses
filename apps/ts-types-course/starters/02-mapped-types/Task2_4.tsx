import { useState } from 'react'

// ============================================
// Задание 2.4: Deep Mapped Types
// ============================================

// TODO: Создайте тип DeepPartial<T> — рекурсивно делает все свойства опциональными:
//   Если T[K] — объект (но не массив), рекурсивно применяем DeepPartial
//   Массивы оставляем как есть

// TODO: Создайте тип DeepReadonly<T> — рекурсивно делает всё readonly:
//   Для вложенных объектов — DeepReadonly
//   Для массивов — readonly T[K][number][]

// TODO: Создайте тип DeepRequired<T> — рекурсивно убирает optional:
//   { [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K] }

// TODO: Создайте тип DeepNullable<T> — рекурсивно добавляет | null

// TODO: Реализуйте функцию deepMerge<T>(target: T, source: DeepPartial<T>): T
//   Рекурсивно объединяет объекты, перезаписывая только указанные свойства

export function Task2_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Определите вложенный интерфейс AppConfig:
    // interface AppConfig {
    //   server: { host: string; port: number; ssl: { enabled: boolean; cert: string } }
    //   database: { host: string; port: number; name: string }
    //   logging: { level: string; file: string }
    // }

    // TODO: Протестируйте DeepPartial — можно указать только часть вложенной структуры:
    // const partial: DeepPartial<AppConfig> = { server: { port: 8080, ssl: { enabled: true } } }
    // log.push('=== DeepPartial<T> ===')
    // log.push(`partial = ${JSON.stringify(partial, null, 2)}`)

    // TODO: Протестируйте DeepReadonly:
    // const frozen: DeepReadonly<AppConfig> = { ... }
    // frozen.server.port = 8080 // Ошибка! Глубокий readonly

    // TODO: Протестируйте DeepRequired:
    // interface PartialSettings {
    //   ui?: { theme?: string; sidebar?: { collapsed?: boolean; width?: number } }
    // }
    // const full: DeepRequired<PartialSettings> = { ... } // Все поля обязательны

    // TODO: Протестируйте DeepNullable:
    // const nullable: DeepNullable<UserProfile> = { name: 'Alice', address: { street: '...', city: null, zip: null } }

    // TODO: Протестируйте deepMerge:
    // const defaults = { server: { host: 'localhost', port: 3000 }, debug: false }
    // const overrides = { server: { port: 8080 } }
    // const merged = deepMerge(defaults, overrides)
    // log.push(`merged = ${JSON.stringify(merged)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.4: Deep Mapped Types</h2>
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
