import { useState } from 'react'

// ============================================
// Задание 6.2: Validation
// ============================================

// TODO: Create class Valid<A> with:
// - readonly _tag = 'valid'
// - constructor(readonly value: A)
// - map<B>(fn: (a: A) => B): Validation<never, B>

// TODO: Create class Invalid<E> with:
// - readonly _tag = 'invalid'
// - constructor(readonly errors: E[])
// - map<B>(_fn: (a: never) => B): Validation<E, B>

// TODO: Define type Validation<E, A> = Valid<A> | Invalid<E>

// TODO: Create helper function valid<A>(value: A): Validation<never, A>

// TODO: Create helper function invalid<E>(errors: E[]): Validation<E, never>

// TODO: Create function combine<E, T extends Record<string, Validation<E, unknown>>>(
//   validations: T
// ): Validation<E, { [K in keyof T]: T[K] extends Validation<E, infer A> ? A : never }>
// - Iterate over all entries
// - Collect errors from all Invalid values into one array
// - If any errors exist, return invalid(allErrors)
// - Otherwise, return valid(collectedValues)

// TODO: Create validators:
// - validateName(name: string): Validation<string, string>
//   (not empty, min 2 chars)
// - validateEmail(email: string): Validation<string, string>
//   (must contain @)
// - validatePassword(password: string): Validation<string, string>
//   (min 8 chars, must contain a digit)

export function Task6_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Demonstrate valid form — combine name, email, password validators
    // TODO: Log Valid result as JSON

    // TODO: Demonstrate invalid form — all fields invalid
    // TODO: Log ALL errors (should be more than one)

    // TODO: Demonstrate partially invalid form

    // TODO: Demonstrate map on Valid and Invalid values

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: Validation</h2>
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
