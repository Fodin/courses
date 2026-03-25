import { useState } from 'react'

// ============================================
// Задание 1.1: Встроенные типы ошибок — Решение
// ============================================

export function Task1_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const demonstrateErrors = () => {
    const log: string[] = []

    // TypeError
    try {
      const obj: unknown = null
      ;(obj as { method: () => void }).method()
    } catch (e) {
      if (e instanceof TypeError) {
        log.push(`TypeError: ${e.message}`)
      }
    }

    // RangeError
    try {
      const arr = new Array(-1)
      void arr
    } catch (e) {
      if (e instanceof RangeError) {
        log.push(`RangeError: ${e.message}`)
      }
    }

    // SyntaxError
    try {
      JSON.parse('{invalid}')
    } catch (e) {
      if (e instanceof SyntaxError) {
        log.push(`SyntaxError: ${e.message}`)
      }
    }

    // URIError
    try {
      decodeURIComponent('%')
    } catch (e) {
      if (e instanceof URIError) {
        log.push(`URIError: ${e.message}`)
      }
    }

    // Проверка цепочки наследования
    const typeError = new TypeError('test')
    log.push(`TypeError instanceof Error: ${typeError instanceof Error}`)
    log.push(`TypeError instanceof TypeError: ${typeError instanceof TypeError}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: Встроенные типы ошибок</h2>
      <button onClick={demonstrateErrors}>Демонстрация ошибок</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 1.2: Custom Error классы — Решение
// ============================================

class ValidationError extends Error {
  field: string
  constructor(message: string, field: string) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

class HttpError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
  }
}

class NotFoundError extends HttpError {
  constructor(resource: string) {
    super(`${resource} не найден`, 404)
    this.name = 'NotFoundError'
  }
}

export function Task1_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExamples = () => {
    const log: string[] = []

    try {
      throw new ValidationError('Email некорректен', 'email')
    } catch (e) {
      if (e instanceof ValidationError) {
        log.push(`${e.name}: ${e.message} (поле: ${e.field})`)
      }
    }

    try {
      throw new HttpError('Доступ запрещён', 403)
    } catch (e) {
      if (e instanceof HttpError) {
        log.push(`${e.name}: ${e.message} (код: ${e.statusCode})`)
      }
    }

    try {
      throw new NotFoundError('Пользователь')
    } catch (e) {
      if (e instanceof NotFoundError) {
        log.push(`${e.name}: ${e.message} (код: ${e.statusCode})`)
      }
      if (e instanceof HttpError) {
        log.push(`  → также является HttpError: ${e instanceof HttpError}`)
      }
      if (e instanceof Error) {
        log.push(`  → также является Error: ${e instanceof Error}`)
      }
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: Custom Error классы</h2>
      <button onClick={runExamples}>Запустить примеры</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 1.3: Иерархия ошибок — Решение
// ============================================

class AppError extends Error {
  code: string
  timestamp: Date
  constructor(message: string, code: string) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.timestamp = new Date()
  }
}

class DatabaseError extends AppError {
  query?: string
  constructor(message: string, query?: string) {
    super(message, 'DB_ERROR')
    this.name = 'DatabaseError'
    this.query = query
  }
}

class NetworkError extends AppError {
  url: string
  status?: number
  constructor(message: string, url: string, status?: number) {
    super(message, 'NETWORK_ERROR')
    this.name = 'NetworkError'
    this.url = url
    this.status = status
  }
}

class AuthError extends AppError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR')
    this.name = 'AuthError'
  }
}

export function Task1_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const demonstrateHierarchy = () => {
    const log: string[] = []

    const errors: AppError[] = [
      new DatabaseError('Соединение потеряно', 'SELECT * FROM users'),
      new NetworkError('Таймаут запроса', 'https://api.example.com', 408),
      new AuthError('Токен истёк'),
    ]

    for (const err of errors) {
      log.push(`[${err.code}] ${err.name}: ${err.message}`)
      log.push(`  instanceof AppError: ${err instanceof AppError}`)
      log.push(`  instanceof Error: ${err instanceof Error}`)

      if (err instanceof DatabaseError && err.query) {
        log.push(`  query: ${err.query}`)
      }
      if (err instanceof NetworkError) {
        log.push(`  url: ${err.url}, status: ${err.status}`)
      }
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: Иерархия ошибок</h2>
      <button onClick={demonstrateHierarchy}>Показать иерархию</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 1.4: Type guards для ошибок — Решение
// ============================================

interface ApiErrorResponse {
  error: {
    code: string
    message: string
  }
}

function isError(value: unknown): value is Error {
  return value instanceof Error
}

function isApiError(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as ApiErrorResponse).error === 'object' &&
    (value as ApiErrorResponse).error !== null &&
    typeof (value as ApiErrorResponse).error.code === 'string' &&
    typeof (value as ApiErrorResponse).error.message === 'string'
  )
}

function isErrorWithCode(error: unknown): error is Error & { code: string } {
  return error instanceof Error && 'code' in error && typeof (error as { code: unknown }).code === 'string'
}

function getErrorMessage(error: unknown): string {
  if (isError(error)) return error.message
  if (isApiError(error)) return `[${error.error.code}] ${error.error.message}`
  if (typeof error === 'string') return error
  return 'Неизвестная ошибка'
}

export function Task1_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const testTypeGuards = () => {
    const log: string[] = []

    const testCases: unknown[] = [
      new Error('Обычная ошибка'),
      new TypeError('Тип не подходит'),
      { error: { code: 'INVALID_INPUT', message: 'Неверный ввод' } },
      'Строковая ошибка',
      42,
      null,
    ]

    for (const testCase of testCases) {
      const msg = getErrorMessage(testCase)
      const type = isError(testCase)
        ? `Error (${testCase.name})`
        : isApiError(testCase)
          ? 'ApiErrorResponse'
          : typeof testCase
      log.push(`${type}: "${msg}"`)
    }

    // Тест isErrorWithCode
    const dbErr = new DatabaseError('test', 'SELECT 1')
    if (isErrorWithCode(dbErr)) {
      log.push(`\nisErrorWithCode: code="${dbErr.code}"`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: Type guards для ошибок</h2>
      <button onClick={testTypeGuards}>Тестировать type guards</button>
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
