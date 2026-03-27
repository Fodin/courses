import { useState } from 'react'

// ============================================
// Задание 8.4: Effect Pattern
// ============================================

// TODO: Define Result<E, A> discriminated union:
//   | { readonly success: true; readonly value: A }
//   | { readonly success: false; readonly error: E }

// TODO: Create constructors:
//   function ok<A>(value: A): Result<never, A>
//   function err<E>(error: E): Result<E, never>

// TODO: Create class Effect<R, E, A> with:
//   constructor(readonly run: (context: R) => Result<E, A>)
//
//   map<B>(f: (a: A) => B): Effect<R, E, B>
//     - Run this effect, if success — apply f to value
//     - Return new Effect wrapping the logic
//
//   flatMap<R2, E2, B>(f: (a: A) => Effect<R2, E2, B>): Effect<R & R2, E | E2, B>
//     - Run this effect, if success — run the next effect from f(value)
//     - KEY: R & R2 combines requirements, E | E2 combines errors
//     - The context parameter is (ctx: R & R2)
//
//   catchError<E2, B>(f: (e: E) => Effect<R, E2, B>): Effect<R, E2, A | B>
//     - Run this effect, if error — run the recovery effect from f(error)

// TODO: Create smart constructors:
//   function succeed<A>(value: A): Effect<unknown, never, A>
//   function fail<E>(error: E): Effect<unknown, E, never>
//   function service<R, A>(f: (ctx: R) => A): Effect<R, never, A>
//   function serviceWithError<R, E, A>(f: (ctx: R) => Result<E, A>): Effect<R, E, A>

// TODO: Define service interfaces:
//   interface DatabaseService { findUser: (id: string) => { name: string; email: string } | null }
//   interface EmailService { send: (to: string, subject: string, body: string) => boolean }
//   interface LoggerService { log: (message: string) => void }

// TODO: Define error types:
//   type DatabaseError = { type: 'DatabaseError'; message: string }
//   type EmailError = { type: 'EmailError'; message: string }
//   type NotFoundError = { type: 'NotFoundError'; id: string }

// TODO: Implement domain effects:
//   function findUser(id: string): Effect<{ db: DatabaseService }, NotFoundError, { name: string; email: string }>
//     - Use serviceWithError to access db from context
//     - Return err({ type: 'NotFoundError', id }) if user not found
//
//   function sendEmail(to, subject, body): Effect<{ email: EmailService }, EmailError, void>
//     - Use serviceWithError to access email from context
//
//   function logMessage(message: string): Effect<{ logger: LoggerService }, never, void>
//     - Use service to access logger from context

// TODO: Compose notifyUser using flatMap:
//   function notifyUser(userId, subject, body):
//     Effect<{ db: DatabaseService; email: EmailService; logger: LoggerService },
//            NotFoundError | EmailError, string>
//     - logMessage → findUser → logMessage → sendEmail → map to success string
//     - TypeScript should automatically infer the combined R and E types

export function Task8_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('--- Effect Pattern ---')
    log.push('')

    // TODO: Create context object with all three services:
    //   db: { findUser that returns alice/bob or null }
    //   email: { send that logs and returns true }
    //   logger: { log that pushes to log array }

    // TODO: Case 1 — Success: notifyUser('1', 'Welcome!', 'Hello Alice')
    //   Run effect and log success/error result

    // TODO: Case 2 — Not found: notifyUser('999', 'Hello', 'Body')
    //   Run effect and log the NotFoundError

    // TODO: Case 3 — Error recovery with catchError:
    //   notifyUser('999', 'Hi', 'Body').catchError(e => {
    //     if (e.type === 'NotFoundError') return succeed(`User ${e.id} not found — skipped`)
    //     return fail(e)
    //   })

    // TODO: Case 4 — Using map:
    //   findUser('2').map(user => user.name.toUpperCase())

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.4: Effect Pattern</h2>
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
