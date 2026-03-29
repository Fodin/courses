import { useState } from 'react'

// ============================================
// Задание 9.2: Signals
// ============================================

// TODO: Изучите обработку сигналов в Node.js:
//   - SIGINT (Ctrl+C) — запрос на прерывание
//   - SIGTERM — запрос на завершение (от kill, Docker, k8s)
//   - SIGUSR1 — включает debugger в Node.js
//   - SIGUSR2 — пользовательский сигнал
//   - SIGHUP — терминал закрыт
//   - process.on('SIGTERM', handler) — подписка на сигнал
//   - process.kill(pid, signal) — отправка сигнала
//   - SIGKILL и SIGSTOP нельзя перехватить!
//
// TODO: Study signal handling in Node.js:
//   - SIGINT, SIGTERM, SIGUSR1, SIGUSR2, SIGHUP
//   - process.on('signal', handler), process.kill(pid, signal)

export function Task9_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Signals ===')
    log.push('')

    // TODO: Реализуйте graceful shutdown handler:
    //   class GracefulShutdown {
    //     register(cleanupFn: () => Promise<void>) — регистрация cleanup-функции
    //     start() — подписка на SIGINT и SIGTERM
    //     shutdown() — выполнение всех cleanup в правильном порядке
    //   }
    //   Порядок shutdown:
    //     1. Прекратить принимать новые запросы
    //     2. Дождаться завершения текущих запросов (с таймаутом)
    //     3. Закрыть соединения с БД
    //     4. Flush логов
    //     5. process.exit(0)
    // TODO: Implement graceful shutdown handler

    log.push('Graceful shutdown setup:')
    log.push('  ... зарегистрируйте cleanup-функции')
    log.push('')

    // TODO: Смоделируйте последовательность сигналов:
    //   1. SIGTERM → начало graceful shutdown
    //   2. Если shutdown не завершился за 30 сек → force exit
    //   3. Повторный SIGTERM/SIGINT → немедленный exit
    // TODO: Simulate signal sequence with timeout

    log.push('Signal simulation:')
    log.push('  ... смоделируйте SIGTERM и процесс завершения')
    log.push('')

    // TODO: Создайте таблицу сигналов с описанием, действием по умолчанию,
    //   можно ли перехватить, и типичным использованием
    // TODO: Create a signals reference table
    log.push('Signals reference:')
    log.push('  ... создайте справочник сигналов')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.2: Signals</h2>
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
