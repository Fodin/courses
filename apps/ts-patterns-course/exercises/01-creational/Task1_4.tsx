import { useState } from 'react'

// ============================================
// Задание 1.4: Singleton
// ============================================

// TODO: Create class ConfigManager with:
//   private static instance: ConfigManager | null
//   private config: Map<string, unknown>
//   private constructor() — prevents direct instantiation
//
//   static getInstance(): ConfigManager — lazy initialization
//   get<T>(key: string): T | undefined — return typed value
//   set<T>(key: string, value: T): void — store value
//   has(key: string): boolean — check key existence
//   getAll(): Record<string, unknown> — return all config as object
//   clear(): void — clear all config
//   static resetInstance(): void — reset instance to null (for tests)

export function Task1_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Reset instance for demo
    // TODO: Get first instance (config1), set theme, maxRetries, debugMode
    // TODO: Get second instance (config2), read values set via config1
    // TODO: Verify config1 === config2
    // TODO: Modify via config2, verify change visible via config1
    // TODO: Demonstrate has(), getAll()

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: Singleton</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
