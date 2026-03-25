import { useState } from 'react'

// ============================================
// Задание 2.1: Promise rejection — Решение
// ============================================

export function Task2_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExamples = async () => {
    const log: string[] = []

    // .then/.catch
    await new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error('Таймаут запроса')), 100)
    })
      .then((data) => log.push(`Данные: ${data}`))
      .catch((err: Error) => log.push(`.catch: ${err.message}`))

    // Promise.reject
    await Promise.reject(new Error('Отклонённый промис'))
      .catch((err: Error) => log.push(`Promise.reject: ${err.message}`))

    // Цепочка промисов — ошибка в середине
    await Promise.resolve('данные')
      .then((data) => {
        log.push(`Шаг 1: ${data}`)
        throw new Error('Ошибка на шаге 2')
      })
      .then(() => log.push('Шаг 3 — не выполнится'))
      .catch((err: Error) => log.push(`Поймана: ${err.message}`))
      .then(() => log.push('Шаг 4 — выполнится после catch'))

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Promise rejection</h2>
      <button onClick={runExamples}>Запустить</button>
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
// Задание 2.2: async/await обработка — Решение
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

export function Task2_2_Solution() {
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
      <h2>Задание 2.2: async/await обработка</h2>
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
// Задание 2.3: Promise.allSettled — Решение
// ============================================

function fetchUser(id: number): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 3) reject(new Error(`Пользователь ${id} не найден`))
      else resolve(`User_${id}`)
    }, 200)
  })
}

export function Task2_3_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const runExample = async () => {
    setLoading(true)
    const log: string[] = []

    // Promise.all — падает при первой ошибке
    log.push('--- Promise.all ---')
    try {
      const users = await Promise.all([fetchUser(1), fetchUser(2), fetchUser(3)])
      log.push(`Все пользователи: ${users.join(', ')}`)
    } catch (error) {
      if (error instanceof Error) {
        log.push(`❌ Promise.all упал: ${error.message}`)
      }
    }

    // Promise.allSettled — получаем все результаты
    log.push('\n--- Promise.allSettled ---')
    const settled = await Promise.allSettled([fetchUser(1), fetchUser(2), fetchUser(3)])

    for (const result of settled) {
      if (result.status === 'fulfilled') {
        log.push(`✅ fulfilled: ${result.value}`)
      } else {
        log.push(`❌ rejected: ${result.reason.message}`)
      }
    }

    // Promise.race
    log.push('\n--- Promise.race ---')
    try {
      const fastest = await Promise.race([
        new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Таймаут')), 100)),
        fetchUser(1),
      ])
      log.push(`Первый: ${fastest}`)
    } catch (error) {
      if (error instanceof Error) {
        log.push(`❌ Race проиграл: ${error.message}`)
      }
    }

    // Promise.any
    log.push('\n--- Promise.any ---')
    try {
      const anyResult = await (Promise as unknown as { any: (values: Promise<string>[]) => Promise<string> }).any([
        Promise.reject(new Error('Ошибка 1')),
        Promise.reject(new Error('Ошибка 2')),
        fetchUser(1),
      ])
      log.push(`✅ Первый успешный: ${anyResult}`)
    } catch (error: unknown) {
      const err = error as { errors?: Error[] }
      if (err.errors) {
        log.push(`❌ AggregateError: все ${err.errors.length} промиса отклонены`)
      }
    }

    setResults(log)
    setLoading(false)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.3: Promise.allSettled</h2>
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
// Задание 2.4: Retry паттерн — Решение
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

export function Task2_4_Solution() {
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
      <h2>Задание 2.4: Retry паттерн</h2>
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
