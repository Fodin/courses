import { useState } from 'react'

// ============================================
// Задание 6.2: HTTP Server
// ============================================

// TODO: Изучите модуль http для создания HTTP серверов:
//   - http.createServer(requestListener) — создание сервера
//   - req (IncomingMessage): method, url, headers, тело через stream
//   - res (ServerResponse): writeHead(), write(), end(), statusCode
//   - Роутинг: парсинг req.url и req.method
//   - Тело запроса: собираем через 'data' + 'end' события
//
// TODO: Study the http module for creating HTTP servers:
//   - http.createServer, req (IncomingMessage), res (ServerResponse)
//   - Routing: parse req.url and req.method
//   - Request body: collect via 'data' + 'end' events

export function Task6_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== HTTP Server ===')
    log.push('')

    // TODO: Реализуйте простой HTTP роутер:
    //   type Route = { method: string, path: string, handler: (req, res) => void }
    //   class SimpleRouter {
    //     addRoute(method, path, handler)
    //     handleRequest(req) — находит подходящий маршрут и вызывает handler
    //   }
    //   Маршруты:
    //     GET /api/users — список пользователей
    //     GET /api/users/:id — один пользователь
    //     POST /api/users — создание пользователя
    //     DELETE /api/users/:id — удаление
    // TODO: Implement a simple HTTP router with routes above

    log.push('Router setup:')
    log.push('  ... определите маршруты')
    log.push('')

    // TODO: Смоделируйте запросы к роутеру и покажите ответы:
    //   GET /api/users → 200, [{id: 1, name: 'Alice'}]
    //   GET /api/users/1 → 200, {id: 1, name: 'Alice'}
    //   POST /api/users {name: 'Bob'} → 201, {id: 2, name: 'Bob'}
    //   GET /api/unknown → 404, Not Found
    // TODO: Simulate requests and show responses

    log.push('Request simulation:')
    log.push('  ... смоделируйте HTTP запросы')
    log.push('')

    // TODO: Покажите парсинг тела запроса из stream
    // TODO: Show request body parsing from stream
    log.push('Body parsing:')
    log.push('  ... покажите как собрать тело из чанков')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: HTTP Server</h2>
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
