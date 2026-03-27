import { useState } from 'react'

// ============================================
// Задание 4.1: Pipe и Compose
// ============================================

// TODO: Create overloaded pipe function
// pipe<A, B>(fn1: (a: A) => B): (a: A) => B
// pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C
// pipe<A, B, C, D>(fn1, fn2, fn3): (a: A) => D
// pipe<A, B, C, D, E>(fn1, fn2, fn3, fn4): (a: A) => E
// Implementation: use reduce to chain functions left-to-right

// TODO: Create overloaded compose function
// compose<A, B>(fn1: (a: A) => B): (a: A) => B
// compose<A, B, C>(fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => C
// compose<A, B, C, D>(fn3, fn2, fn1): (a: A) => D
// compose<A, B, C, D, E>(fn4, fn3, fn2, fn1): (a: A) => E
// Implementation: use reduceRight to chain functions right-to-left

// TODO: Create helper functions:
// trim(s: string): string — remove whitespace from both ends
// toUpperCase(s: string): string — convert to upper case
// addExclamation(s: string): string — append "!"
// getLength(s: string): number — return string length
// double(n: number): number — multiply by 2
// toFixed(n: number): string — convert to fixed-point string

export function Task4_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create a pipe chain: trim → toUpperCase → addExclamation
    // Test with "  hello  "

    // TODO: Create a pipe chain with type change: trim → getLength → double → toFixed
    // Test with "  hi  "

    // TODO: Create a compose chain: addExclamation ∘ toUpperCase ∘ trim
    // Test with "  world  "

    // TODO: Add results to log array

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Pipe и Compose</h2>
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
