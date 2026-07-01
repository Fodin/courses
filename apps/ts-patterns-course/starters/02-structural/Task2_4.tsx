import { useState } from 'react'

// ============================================
// Задание 2.4: Proxy
// ============================================

// --- Interface and implementation (do not modify) ---

interface ApiService {
  fetchUser(id: string): string
  fetchProduct(id: string): string
  updateUser(id: string, data: Record<string, string>): string
}

class RealApiService implements ApiService {
  fetchUser(id: string): string {
    return `User data for ${id}: { name: "User-${id}", role: "admin" }`
  }

  fetchProduct(id: string): string {
    return `Product data for ${id}: { title: "Product-${id}", price: 99 }`
  }

  updateUser(id: string, data: Record<string, string>): string {
    return `Updated user ${id}: ${JSON.stringify(data)}`
  }
}

// TODO: Implement createLoggingProxy<T extends object>(target: T, logs: string[]): T
//   - Use new Proxy(target, { get(obj, prop, receiver) { ... } })
//   - Use Reflect.get(obj, prop, receiver) to access the original value
//   - If value is not a function, return it as-is
//   - If value is a function, return a wrapper that:
//     1. Pushes `[Proxy:LOG] methodName(arg1, arg2)` to logs
//     2. Calls the original method with .apply(obj, args)
//     3. Pushes `[Proxy:LOG] → result` to logs
//     4. Returns the result

// TODO: Implement createCachingProxy<T extends object>(target: T, logs: string[]): T
//   - Create a Map<string, unknown> for the cache
//   - Use new Proxy(target, { get(obj, prop, receiver) { ... } })
//   - Cache key format: `${String(prop)}:${JSON.stringify(args)}`
//   - On cache hit: push `[Proxy:CACHE HIT] methodName(args)` to logs, return cached value
//   - On cache miss: push `[Proxy:CACHE MISS] methodName(args)` to logs, call method, store and return

export function Task2_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create a logging proxy for RealApiService
    //   const loggingLogs: string[] = []
    //   const loggingApi = createLoggingProxy(new RealApiService(), loggingLogs)
    //   Call loggingApi.fetchUser('42') and loggingApi.fetchProduct('99')
    //   Push '--- Logging Proxy ---' header and loggingLogs to log

    // TODO: Create a caching proxy for RealApiService
    //   const cachingLogs: string[] = []
    //   const cachingApi = createCachingProxy(new RealApiService(), cachingLogs)
    //   Call cachingApi.fetchUser('42') twice (second should be cache hit)
    //   Call cachingApi.fetchUser('100') once (new args — cache miss)
    //   Call cachingApi.fetchProduct('99') twice (second should be cache hit)
    //   Push '--- Caching Proxy ---' header and cachingLogs to log

    // TODO: Add summary showing proxy transparency

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.4: Proxy</h2>
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
