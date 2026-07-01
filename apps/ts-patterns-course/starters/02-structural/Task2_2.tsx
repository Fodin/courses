import { useState } from 'react'

// ============================================
// Задание 2.2: Decorator
// ============================================

// TODO: Define type AnyFunction = (...args: never[]) => unknown

// TODO: Implement withLogging<T extends AnyFunction>(fn: T, name: string): T
//   - Return a wrapper function with the same signature as fn
//   - The wrapper should call fn(...args) and return `[LOG:<name>] <result>`
//   - Cast the wrapper as unknown as T to preserve the type

// TODO: Implement withCache<T extends AnyFunction>(fn: T): T
//   - Create a Map<string, ReturnType<T>> for caching
//   - Cache key: JSON.stringify(args)
//   - On cache hit: return `[CACHE HIT] <cached value>`
//   - On cache miss: call fn, store result, return it

// TODO: Implement withRetry<T extends AnyFunction>(fn: T, maxRetries: number): T
//   - Loop from 0 to maxRetries, calling fn(...args) in a try/catch
//   - On success: return the result
//   - If all retries fail: return `[RETRY FAILED] after N attempts: <error message>`

// Helper functions for demonstration (do not modify)
function computeExpensive(n: number): string {
  let sum = 0
  for (let i = 0; i < n; i++) sum += i
  return `sum(0..${n}) = ${sum}`
}

let failCount = 0
function unreliableOperation(input: string): string {
  failCount++
  if (failCount % 3 !== 0) {
    throw new Error(`Operation failed (attempt ${failCount})`)
  }
  return `Success with "${input}" on attempt ${failCount}`
}

export function Task2_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create a logged version of computeExpensive using withLogging
    // TODO: Call it with 100 and 1000, push results to log

    // TODO: Create a cached version of computeExpensive using withCache
    // TODO: Call it with 100 twice (second should be cache hit) and 200 once

    // TODO: Reset failCount = 0
    // TODO: Create a retried version of unreliableOperation using withRetry (3 retries)
    // TODO: Call it with 'test-data' and push result to log

    // TODO: Demonstrate decorator composition:
    //   const enhanced = withLogging(withCache(computeExpensive), 'cached+logged')
    //   Call enhanced(500) twice and push results to log

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Decorator</h2>
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
