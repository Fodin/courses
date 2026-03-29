import { useState } from 'react'

// ============================================
// Задание 12.2: Process Errors
// ============================================

// TODO: Изучите глобальную обработку ошибок в Node.js:
//   - process.on('uncaughtException', handler) — необработанные исключения
//   - process.on('unhandledRejection', handler) — необработанные Promise rejections
//   - process.on('warning', handler) — предупреждения (deprecation, memory leak)
//   - --unhandled-rejections=throw (Node.js 15+ — по умолчанию)
//   - Domain (устаревший, не использовать)
//   - Best practice: логировать, очистить ресурсы, перезапустить процесс
//
// TODO: Study global error handling in Node.js:
//   - uncaughtException, unhandledRejection, warning events
//   - Best practice: log, cleanup, restart

export function Task12_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Process Errors ===')
    log.push('')

    // TODO: Смоделируйте глобальные обработчики ошибок:
    //   Реализуйте класс ProcessErrorHandler:
    //     - onUncaughtException(error) — обработка синхронных ошибок
    //     - onUnhandledRejection(reason, promise) — обработка async ошибок
    //     - onWarning(warning) — обработка предупреждений
    //   Покажите, что происходит с каждым типом ошибки
    // TODO: Simulate global error handlers

    log.push('uncaughtException handler:')
    log.push('  ... покажите обработку необработанного исключения')
    log.push('')

    log.push('unhandledRejection handler:')
    log.push('  ... покажите обработку отклонённого промиса')
    log.push('')

    // TODO: Покажите правильную стратегию обработки:
    //   1. Логировать ошибку (с полным stack trace и контекстом)
    //   2. Закрыть сервер (server.close()) — перестать принимать соединения
    //   3. Дождаться завершения текущих запросов (с таймаутом)
    //   4. Выйти с ненулевым кодом (process.exit(1))
    //   5. Менеджер процессов (PM2, systemd) перезапустит
    // TODO: Show proper error handling strategy

    log.push('Proper shutdown strategy:')
    log.push('  ... реализуйте правильную последовательность')
    log.push('')

    // TODO: Объясните, почему process.on('uncaughtException') НЕ должен
    //   предотвращать завершение — после исключения состояние процесса undefined
    // TODO: Explain why uncaughtException should NOT prevent exit
    log.push('Why always exit after uncaughtException:')
    log.push('  ... объясните опасность продолжения работы')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.2: Process Errors</h2>
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
