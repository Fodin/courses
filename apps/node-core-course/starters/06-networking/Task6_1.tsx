import { useState } from 'react'

// ============================================
// Задание 6.1: TCP Server & Client
// ============================================

// TODO: Изучите модуль net для TCP:
//   - net.createServer(connectionListener) — создание TCP сервера
//   - server.listen(port) — начало прослушивания
//   - net.createConnection(port) — TCP клиент
//   - socket — Duplex stream (чтение и запись)
//   - События: 'connection', 'data', 'end', 'error', 'close'
//
// TODO: Study the net module for TCP:
//   - net.createServer, server.listen, net.createConnection
//   - socket is a Duplex stream

export function Task6_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== TCP Server & Client ===')
    log.push('')

    // TODO: Смоделируйте TCP сервер и клиент в памяти:
    //   Реализуйте классы MockTCPServer и MockTCPSocket
    //   MockTCPServer:
    //     - listen(port) — начинает "прослушивание"
    //     - on('connection', cb) — новое соединение
    //   MockTCPSocket:
    //     - write(data) — отправка данных
    //     - on('data', cb) — получение данных
    //     - end() — закрытие соединения
    //     - connect(port) — подключение к серверу
    // TODO: Simulate TCP server and client in memory

    log.push('Server started on port 3000')
    log.push('')

    // TODO: Реализуйте простой echo-протокол:
    //   Клиент отправляет сообщение → Сервер отвечает тем же сообщением
    // TODO: Implement a simple echo protocol
    log.push('Echo protocol:')
    log.push('  ... клиент отправляет, сервер эхо-ответ')
    log.push('')

    // TODO: Реализуйте простой request-response протокол:
    //   Формат: [4 байта длина][payload]
    //   Покажите, как обрабатывать фрагментацию TCP (данные приходят частями)
    // TODO: Implement length-prefixed request-response protocol
    //   Show how to handle TCP fragmentation
    log.push('Length-prefixed protocol:')
    log.push('  ... реализуйте протокол с длиной сообщения')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: TCP Server & Client</h2>
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
