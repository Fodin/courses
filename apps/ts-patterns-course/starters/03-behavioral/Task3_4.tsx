import { useState } from 'react'

// ============================================
// Задание 3.4: Chain of Responsibility
// ============================================

// TODO: Define interface HttpRequest:
//   userId: string
//   token: string
//   body: Record<string, unknown>
//   timestamp: number
//   logs: string[]

// TODO: Define interface Handler<T>:
//   setNext(handler: Handler<T>): Handler<T>
//   handle(request: T): T | null

// TODO: Create abstract class BaseHandler implementing Handler<HttpRequest>:
//   private next: Handler<HttpRequest> | null
//   setNext(handler): Handler<HttpRequest> — set next, return handler
//   handle(request): HttpRequest | null — if next exists, delegate; otherwise return request

// TODO: Create class AuthHandler extends BaseHandler:
//   private validTokens = new Set(['token-abc', 'token-xyz'])
//   handle: check if token is in validTokens
//     If invalid → push error log, return null
//     If valid → push success log, call super.handle()

// TODO: Create class RateLimitHandler extends BaseHandler:
//   private requestCounts = new Map<string, number>()
//   private limit = 3
//   handle: increment count for userId
//     If over limit → push error log, return null
//     Otherwise → push success log, call super.handle()

// TODO: Create class ValidationHandler extends BaseHandler:
//   handle: check that body is not empty (has at least 1 key)
//     If empty → push error log, return null
//     Otherwise → push success log, call super.handle()

// TODO: Create class LogHandler extends BaseHandler:
//   handle: push log with elapsed time, call super.handle()

export function Task3_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create handler instances: auth, rateLimit, validation, logger
    // TODO: Build chain: auth → rateLimit → validation → logger

    // TODO: Request 1 — valid request (token-abc, non-empty body)
    // TODO: Request 2 — invalid token
    // TODO: Request 3 — empty body
    // TODO: Requests 4-5 — demonstrate rate limit exceeded

    // TODO: For each request, push logs and result (passed/rejected)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.4: Chain of Responsibility</h2>
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
