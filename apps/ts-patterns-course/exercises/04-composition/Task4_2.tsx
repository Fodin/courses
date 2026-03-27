import { useState } from 'react'

// ============================================
// Задание 4.2: Middleware
// ============================================

// TODO: Define HttpRequest interface
// - method: string
// - url: string
// - headers: Record<string, string>
// - body?: string

// TODO: Define HttpResponse interface
// - status: number
// - body: string
// - headers: Record<string, string>

// TODO: Define Middleware type
// (request: HttpRequest, next: (req: HttpRequest) => HttpResponse) => HttpResponse

// TODO: Create createPipeline(...middlewares: Middleware[])
// Returns a function (req, handler) => HttpResponse
// Use reduceRight to build the chain:
// each middleware wraps the next one

// TODO: Create loggingMiddleware
// - Call next(req) to get response
// - Add X-Log header with request info (method, url, status)
// - Return enriched response

// TODO: Create authMiddleware
// - Check req.headers['authorization']
// - If missing, return { status: 401, body: 'Unauthorized', headers: {} }
// - If present, call next(req)

// TODO: Create corsMiddleware
// - Call next(req) to get response
// - Add Access-Control-Allow-Origin: '*'
// - Add Access-Control-Allow-Methods: 'GET, POST, PUT, DELETE'
// - Return enriched response

export function Task4_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create pipeline with loggingMiddleware, authMiddleware, corsMiddleware
    // TODO: Create a simple handler that returns 200 with a message

    // TODO: Test with authorized request (has authorization header)
    // TODO: Test with unauthorized request (no authorization header)
    // TODO: Add results to log

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Middleware</h2>
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
