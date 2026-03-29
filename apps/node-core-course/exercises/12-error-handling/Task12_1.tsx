import { useState } from 'react'

// ============================================
// Задание 12.1: Error Classes
// ============================================

// TODO: Изучите систему ошибок Node.js:
//   - Все ошибки Node.js наследуют от Error
//   - SystemError: errno, code, syscall (например ENOENT, EACCES, ECONNREFUSED)
//   - TypeError, RangeError, SyntaxError — стандартные JS ошибки
//   - error.code — строковый идентификатор (например 'ERR_INVALID_ARG_TYPE')
//   - Кастомные ошибки: class AppError extends Error { code, statusCode, isOperational }
//   - Operational vs Programming errors — ключевое различие
//
// TODO: Study the Node.js error system:
//   - SystemError, error.code, custom errors
//   - Operational vs Programming errors distinction

export function Task12_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Error Classes ===')
    log.push('')

    // TODO: Создайте иерархию кастомных ошибок:
    //   class AppError extends Error { code: string, isOperational: boolean }
    //   class ValidationError extends AppError — ошибки валидации
    //   class NotFoundError extends AppError — ресурс не найден
    //   class DatabaseError extends AppError — ошибки БД
    //   class AuthenticationError extends AppError — ошибки аутентификации
    //   Каждый класс: правильный name, корректный stack trace, serialization
    // TODO: Create custom error hierarchy

    log.push('Error hierarchy:')
    log.push('  ... создайте и покажите иерархию ошибок')
    log.push('')

    // TODO: Покажите разницу между operational и programming ошибками:
    //   Operational: ожидаемые (file not found, network timeout, invalid input)
    //     → обработать и продолжить работу
    //   Programming: баги (undefined is not a function, wrong argument type)
    //     → логировать и перезапустить процесс
    // TODO: Show difference between operational and programming errors

    log.push('Operational vs Programming:')
    log.push('  ... классифицируйте примеры ошибок')
    log.push('')

    // TODO: Реализуйте сериализацию ошибок:
    //   toJSON() — для логирования и API ответов
    //   fromJSON() — восстановление из JSON
    //   Включите: message, code, stack, timestamp, context
    // TODO: Implement error serialization (toJSON, fromJSON)
    log.push('Error serialization:')
    log.push('  ... сериализуйте и десериализуйте ошибки')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.1: Error Classes</h2>
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
