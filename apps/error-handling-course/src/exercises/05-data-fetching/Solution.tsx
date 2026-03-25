import { useState, useEffect, useCallback } from 'react'

// ============================================
// Задание 5.1: Ошибки fetch — Решение
// ============================================

export function Task5_1_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const runExamples = async () => {
    setLoading(true)
    const log: string[] = []

    // 1. fetch не кидает ошибку при 404/500!
    try {
      const response = await fetch('https://httpstat.us/404')
      log.push(`Status: ${response.status}, ok: ${response.ok}`)
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        log.push(`Поймана ошибка: ${error.message}`)
      }
    }

    // 2. Сетевая ошибка (нет соединения)
    try {
      await fetch('https://this-domain-does-not-exist-12345.com')
    } catch (error) {
      if (error instanceof TypeError) {
        log.push(`\nСетевая ошибка (TypeError): ${error.message}`)
      }
    }

    // 3. Ошибка парсинга JSON
    try {
      const response = await fetch('https://httpstat.us/200')
      const text = await response.text()
      log.push(`\nТело ответа: "${text.substring(0, 50)}"`)
      JSON.parse('not json')
    } catch (error) {
      if (error instanceof SyntaxError) {
        log.push(`Ошибка парсинга JSON: ${error.message}`)
      }
    }

    setResults(log)
    setLoading(false)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Ошибки fetch</h2>
      <p>fetch не считает HTTP 4xx/5xx ошибкой — нужно проверять response.ok!</p>
      <button onClick={runExamples} disabled={loading}>
        {loading ? 'Загрузка...' : 'Запустить'}
      </button>
      {results.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          {results.map((r, i) => (
            <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ============================================
// Задание 5.2: API ошибки — Решение
// ============================================

class ApiError extends Error {
  status: number
  code: string
  details?: Record<string, string>

  constructor(status: number, code: string, message: string, details?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

// Симуляция API
function simulateApiCall(endpoint: string): Promise<{ data: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      switch (endpoint) {
        case '/users/1':
          resolve({ data: 'Alice' })
          break
        case '/users/999':
          reject(new ApiError(404, 'NOT_FOUND', 'Пользователь не найден', { id: '999' }))
          break
        case '/admin':
          reject(new ApiError(403, 'FORBIDDEN', 'Доступ запрещён'))
          break
        case '/data':
          reject(new ApiError(500, 'INTERNAL_ERROR', 'Внутренняя ошибка сервера'))
          break
        default:
          reject(new ApiError(404, 'NOT_FOUND', `Эндпоинт ${endpoint} не найден`))
      }
    }, 300)
  })
}

export function Task5_2_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const runExamples = async () => {
    setLoading(true)
    const log: string[] = []
    const endpoints = ['/users/1', '/users/999', '/admin', '/data']

    for (const endpoint of endpoints) {
      try {
        const result = await simulateApiCall(endpoint)
        log.push(`✅ ${endpoint}: ${result.data}`)
      } catch (error) {
        if (error instanceof ApiError) {
          log.push(`❌ ${endpoint}: [${error.status}] ${error.code} — ${error.message}`)
          if (error.details) {
            log.push(`   Детали: ${JSON.stringify(error.details)}`)
          }
        }
      }
    }

    setResults(log)
    setLoading(false)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: API ошибки</h2>
      <button onClick={runExamples} disabled={loading}>
        {loading ? 'Загрузка...' : 'Тестировать эндпоинты'}
      </button>
      {results.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          {results.map((r, i) => (
            <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ============================================
// Задание 5.3: Loading/Error/Success — Решение
// ============================================

type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function useFetch<T>(fetchFn: () => Promise<T>) {
  const [state, setState] = useState<FetchState<T>>({ status: 'idle' })

  const execute = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const data = await fetchFn()
      setState({ status: 'success', data })
    } catch (error) {
      setState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      })
    }
  }, [fetchFn])

  return { state, execute }
}

interface Post {
  id: number
  title: string
  body: string
}

const fetchPosts = () =>
  new Promise<Post[]>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve([
          { id: 1, title: 'Первый пост', body: 'Содержание первого поста' },
          { id: 2, title: 'Второй пост', body: 'Содержание второго поста' },
        ])
      } else {
        reject(new Error('Не удалось загрузить посты'))
      }
    }, 800)
  })

export function Task5_3_Solution() {
  const { state, execute } = useFetch(fetchPosts)

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Loading/Error/Success</h2>
      <button onClick={execute} disabled={state.status === 'loading'}>
        {state.status === 'loading' ? 'Загрузка...' : 'Загрузить посты'}
      </button>

      <div style={{ marginTop: '1rem' }}>
        {state.status === 'idle' && (
          <p style={{ color: '#999' }}>Нажмите кнопку для загрузки</p>
        )}

        {state.status === 'loading' && (
          <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
            Загрузка данных...
          </div>
        )}

        {state.status === 'error' && (
          <div style={{ padding: '1rem', background: '#ffebee', borderRadius: '8px', border: '1px solid #ef5350' }}>
            <p>Ошибка: {state.error}</p>
            <button onClick={execute} style={{ marginTop: '0.5rem' }}>Повторить</button>
          </div>
        )}

        {state.status === 'success' && (
          <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #4caf50' }}>
            <h4>Посты:</h4>
            {state.data.map((post) => (
              <div key={post.id} style={{ marginBottom: '0.5rem' }}>
                <strong>{post.title}</strong>
                <p style={{ margin: '0.25rem 0' }}>{post.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Задание 5.4: Восстановление загрузки — Решение
// ============================================

let fetchAttempt = 0

function fetchWithFailures(): Promise<string> {
  fetchAttempt++
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fetchAttempt <= 2) {
        reject(new Error(`Попытка ${fetchAttempt}: сервер недоступен (503)`))
      } else {
        resolve('Данные успешно загружены!')
      }
    }, 500)
  })
}

export function Task5_4_Solution() {
  const [state, setState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error'
    data?: string
    error?: string
    attempts: { num: number; result: string }[]
  }>({ status: 'idle', attempts: [] })

  const loadWithRetry = async () => {
    fetchAttempt = 0
    setState({ status: 'loading', attempts: [] })

    const maxRetries = 3
    const attempts: { num: number; result: string }[] = []

    for (let i = 1; i <= maxRetries; i++) {
      try {
        const data = await fetchWithFailures()
        attempts.push({ num: i, result: `✅ ${data}` })
        setState({ status: 'success', data, attempts: [...attempts] })
        return
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Ошибка'
        attempts.push({ num: i, result: `❌ ${msg}` })
        setState({ status: 'loading', attempts: [...attempts] })

        if (i < maxRetries) {
          await new Promise((r) => setTimeout(r, 1000))
        }
      }
    }

    setState({
      status: 'error',
      error: 'Все попытки исчерпаны',
      attempts: [...attempts],
    })
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.4: Восстановление загрузки</h2>
      <button onClick={loadWithRetry} disabled={state.status === 'loading'}>
        {state.status === 'loading' ? 'Загрузка...' : 'Загрузить с retry'}
      </button>

      {state.attempts.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Попытки:</h4>
          {state.attempts.map((a) => (
            <div key={a.num} style={{ padding: '0.25rem 0', fontFamily: 'monospace' }}>
              Попытка {a.num}: {a.result}
            </div>
          ))}
        </div>
      )}

      {state.status === 'success' && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          Итог: {state.data}
        </div>
      )}

      {state.status === 'error' && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#ffebee', borderRadius: '8px' }}>
          <p>Итог: {state.error}</p>
          <button onClick={loadWithRetry}>Попробовать заново</button>
        </div>
      )}
    </div>
  )
}
