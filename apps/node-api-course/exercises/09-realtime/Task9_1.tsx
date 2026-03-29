import { useState } from 'react'

// ============================================
// Задание 9.1: WebSocket ws
// ============================================

// TODO: Создайте WebSocket-сервер через библиотеку ws
// TODO: Обработайте connection, message, close, error события
// TODO: Реализуйте broadcast для отправки сообщений всем клиентам
// TODO: Добавьте heartbeat (ping/pong) для обнаружения потерянных соединений

export function Task9_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== WebSocket (ws) ===')
    log.push('')

    // TODO: Создайте new WebSocketServer({ server: httpServer })
    // TODO: Обработайте wss.on("connection", (ws, req) => { ... })
    // TODO: Реализуйте ws.on("message") с JSON-парсингом
    // TODO: Покажите broadcast: wss.clients.forEach(c => c.send(msg))
    log.push('WebSocket ws')
    log.push('  ... const wss = new WebSocketServer({ server })')
    log.push('  ... wss.on("connection", (ws) => { ws.on("message", ...) })')
    log.push('  ... broadcast: wss.clients.forEach(c => c.send(data))')
    log.push('  ... heartbeat: ping каждые 30s, pong -> isAlive = true')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.1: WebSocket ws</h2>
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
