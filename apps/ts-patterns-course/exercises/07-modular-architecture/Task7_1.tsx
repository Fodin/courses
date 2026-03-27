import { useState } from 'react'

// ============================================
// Задание 7.1: Dependency Injection
// ============================================

// TODO: Create class Token<T> with:
//   readonly name: string (passed via constructor)
//   readonly _type!: T  — phantom field for type inference (never assigned)

// TODO: Create class Container with:
//   private bindings: Map<Token<unknown>, () => unknown>
//
//   register<T>(token: Token<T>, factory: () => T): void
//     — store factory in bindings (Transient: new instance each resolve)
//
//   registerSingleton<T>(token: Token<T>, factory: () => T): void
//     — wrap factory so it caches the first call result (Singleton)
//     — hint: use a closure with `let instance: T | null = null`
//
//   resolve<T>(token: Token<T>): T
//     — look up factory in bindings, call it, return result as T
//     — if no binding found, throw Error(`No binding for token: ${token.name}`)

interface Logger {
  log(message: string): string
  id: number
}

interface Database {
  query(sql: string): string
  id: number
}

let instanceCounter = 0

function createConsoleLogger(): Logger {
  const id = ++instanceCounter
  return {
    id,
    log(message: string) {
      return `[Logger#${id}] ${message}`
    },
  }
}

function createInMemoryDatabase(): Database {
  const id = ++instanceCounter
  return {
    id,
    query(sql: string) {
      return `[DB#${id}] Executed: ${sql}`
    },
  }
}

// TODO: Create tokens:
//   const LoggerToken = new Token<Logger>('Logger')
//   const DatabaseToken = new Token<Database>('Database')

export function Task7_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    instanceCounter = 0

    // TODO: Create a new Container instance

    // TODO: Register LoggerToken as Transient (use container.register)
    // TODO: Register DatabaseToken as Singleton (use container.registerSingleton)

    // TODO: Demonstrate Transient behavior:
    //   - Resolve LoggerToken twice
    //   - Log each logger's id
    //   - Log whether they are the same instance (=== comparison)
    //   - Call log() on the first logger

    // TODO: Demonstrate Singleton behavior:
    //   - Resolve DatabaseToken twice
    //   - Log each db's id
    //   - Log whether they are the same instance (=== comparison)
    //   - Call query('SELECT * FROM users') on the first db

    // TODO: Demonstrate missing binding error:
    //   - Create a new Token<string>('Unknown')
    //   - Try to resolve it, catch the error and log e.message

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.1: Dependency Injection</h2>
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
