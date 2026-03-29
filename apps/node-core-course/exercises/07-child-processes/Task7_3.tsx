import { useState } from 'react'

// ============================================
// Задание 7.3: fork & IPC
// ============================================

// TODO: Изучите fork — специализированный spawn для Node.js процессов:
//   - fork(modulePath, args, options) — запускает Node.js скрипт
//   - Автоматически создаёт IPC канал для обмена сообщениями
//   - child.send(message) — отправка сообщения дочернему процессу
//   - process.on('message', cb) — получение сообщения в дочернем
//   - child.on('message', cb) — получение ответа в родительском
//   - Используется для CPU-intensive задач
//
// TODO: Study fork — specialized spawn for Node.js processes:
//   - Automatically creates IPC channel for message passing
//   - child.send() / process.on('message') for communication

export function Task7_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== fork & IPC ===')
    log.push('')

    // TODO: Смоделируйте IPC между родительским и дочерним процессом:
    //   Реализуйте классы MockParentProcess и MockChildProcess
    //   с методами send(msg) и on('message', cb)
    //   Покажите двунаправленный обмен сообщениями
    // TODO: Simulate IPC between parent and child processes

    log.push('IPC message exchange:')
    log.push('  ... покажите отправку и получение сообщений')
    log.push('')

    // TODO: Реализуйте паттерн "Worker": родительский процесс отправляет
    //   задачу (число для факториала), дочерний вычисляет и возвращает результат
    //   Формат сообщений: { type: 'task', payload: number }
    //                     { type: 'result', payload: number }
    //                     { type: 'error', message: string }
    // TODO: Implement "Worker" pattern: parent sends task, child computes and returns

    log.push('Worker pattern:')
    log.push('  ... реализуйте отправку задачи и получение результата')
    log.push('')

    // TODO: Реализуйте graceful shutdown:
    //   1. Родитель отправляет { type: 'shutdown' }
    //   2. Дочерний завершает текущую задачу
    //   3. Дочерний отправляет { type: 'ready-to-exit' }
    //   4. Родитель вызывает child.kill()
    // TODO: Implement graceful shutdown sequence
    log.push('Graceful shutdown:')
    log.push('  ... реализуйте последовательное завершение')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.3: fork & IPC</h2>
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
