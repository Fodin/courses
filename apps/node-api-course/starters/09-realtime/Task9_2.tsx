import { useState } from 'react'

// ============================================
// Задание 9.2: Socket.io
// Task 9.2: Socket.io
// ============================================

// TODO: Создайте Socket.io сервер с rooms и namespaces
// TODO: Create Socket.io server with rooms and namespaces
// TODO: Реализуйте emit, on, broadcast с типизированными событиями
// TODO: Implement emit, on, broadcast with typed events
// TODO: Используйте rooms для группировки: socket.join("room:123")
// TODO: Use rooms for grouping: socket.join("room:123")
// TODO: Покажите namespaces: io.of("/chat"), io.of("/notifications")
// TODO: Show namespaces: io.of("/chat"), io.of("/notifications")

export function Task9_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Socket.io ===')
    log.push('')

    // TODO: Создайте io = new Server(httpServer, { cors: { origin: "*" } })
    // TODO: Create io = new Server(httpServer, { cors: { origin: "*" } })
    // TODO: Реализуйте chat namespace с join/leave room
    // TODO: Implement chat namespace with join/leave room
    // TODO: Покажите io.to("room:123").emit("message", data)
    // TODO: Show io.to("room:123").emit("message", data)
    // TODO: Добавьте middleware для аутентификации сокетов
    // TODO: Add middleware for socket authentication
    log.push('Socket.io')
    log.push('  ... const io = new Server(httpServer)')
    log.push('  ... io.on("connection", (socket) => { ... })')
    log.push('  ... socket.join("room:123"), socket.to("room:123").emit(...)')
    log.push('  ... io.of("/chat").use(authMiddleware)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.2: Socket.io</h2>
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
