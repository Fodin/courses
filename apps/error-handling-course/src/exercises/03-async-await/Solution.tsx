import { useState } from 'react'

// ============================================
// Задание 3.1: async/await обработка — Решение
// ============================================

function simulateApi(shouldFail: boolean): Promise<{ data: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Сервер вернул ошибку 500'))
      } else {
        resolve({ data: 'Пользователь найден' })
      }
    }, 300)
  })
}

export function Task3_1_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const runExample = async () => {
    setLoading(true)
    const log: string[] = []

    // Успешный запрос
    try {
      const result = await simulateApi(false)
      log.push(`✅ Успех: ${result.data}`)
    } catch (error) {
      if (error instanceof Error) {
        log.push(`❌ Ошибка: ${error.message}`)
      }
    }

    // Неуспешный запрос
    try {
      const result = await simulateApi(true)
      log.push(`✅ Успех: ${result.data}`)
    } catch (error) {
      if (error instanceof Error) {
        log.push(`❌ Ошибка: ${error.message}`)
      }
    } finally {
      log.push('ℹ️ Запрос завершён (finally)')
    }

    // Несколько последовательных запросов
    try {
      log.push('\n--- Последовательные запросы ---')
      const r1 = await simulateApi(false)
      log.push(`Запрос 1: ${r1.data}`)
      const r2 = await simulateApi(true) // Упадёт
      log.push(`Запрос 2: ${r2.data}`) // Не выполнится
    } catch (error) {
      if (error instanceof Error) {
        log.push(`Цепочка прервана: ${error.message}`)
      }
    }

    setResults(log)
    setLoading(false)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: async/await обработка</h2>
      <button onClick={runExample} disabled={loading}>
        {loading ? 'Загрузка...' : 'Запустить'}
      </button>
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

// ============================================
// Задание 3.2: Retry паттерн — Решение
// ============================================

let attemptCount = 0

function unstableApi(): Promise<string> {
  attemptCount++
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (attemptCount < 3) {
        reject(new Error(`Попытка ${attemptCount}: сервер недоступен`))
      } else {
        resolve('Данные получены успешно!')
      }
    }, 200)
  })
}

async function retry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts: number; delay: number; onRetry?: (error: Error, attempt: number) => void }
): Promise<T> {
  const { maxAttempts, delay, onRetry } = options
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < maxAttempts) {
        onRetry?.(lastError, attempt)
        await new Promise((r) => setTimeout(r, delay))
      }
    }
  }

  throw lastError
}

export function Task3_2_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const runRetry = async () => {
    attemptCount = 0
    setLoading(true)
    const log: string[] = []

    try {
      const data = await retry(unstableApi, {
        maxAttempts: 5,
        delay: 500,
        onRetry: (error, attempt) => {
          log.push(`🔄 Попытка ${attempt} не удалась: ${error.message}`)
          setResults([...log])
        },
      })
      log.push(`✅ Успех: ${data}`)
    } catch (error) {
      if (error instanceof Error) {
        log.push(`❌ Все попытки исчерпаны: ${error.message}`)
      }
    }

    setResults([...log])
    setLoading(false)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: Retry паттерн</h2>
      <button onClick={runRetry} disabled={loading}>
        {loading ? 'Выполняется...' : 'Запустить retry'}
      </button>
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
