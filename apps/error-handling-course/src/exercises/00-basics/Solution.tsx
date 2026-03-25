import { useState } from 'react'

// ============================================
// Задание 0.1: Первый try/catch — Решение
// ============================================

export function Task0_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Пример 1: Базовый try/catch
    try {
      const data = JSON.parse('{"name": "Alice"}')
      log.push(`✅ Парсинг успешен: ${data.name}`)
    } catch (error) {
      log.push(`❌ Ошибка парсинга: ${error}`)
    }

    // Пример 2: Ошибка при парсинге
    try {
      JSON.parse('invalid json')
      log.push('✅ Этот код не выполнится')
    } catch (error) {
      if (error instanceof SyntaxError) {
        log.push(`❌ SyntaxError: ${error.message}`)
      }
    }

    // Пример 3: finally блок
    try {
      const num = Number('abc')
      if (isNaN(num)) {
        throw new Error('Не удалось преобразовать в число')
      }
      log.push(`✅ Число: ${num}`)
    } catch (error) {
      if (error instanceof Error) {
        log.push(`❌ Ошибка: ${error.message}`)
      }
    } finally {
      log.push('ℹ️ Блок finally выполнен')
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: Первый try/catch</h2>

      <button onClick={runExample}>Запустить примеры</button>

      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 0.2: Объект Error и его свойства — Решение
// ============================================

interface ErrorInfo {
  name: string
  message: string
  stack: string
}

export function Task0_2_Solution() {
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null)
  const [customErrors, setCustomErrors] = useState<ErrorInfo[]>([])

  const inspectError = () => {
    try {
      throw new Error('Тестовая ошибка для изучения')
    } catch (error) {
      if (error instanceof Error) {
        setErrorInfo({
          name: error.name,
          message: error.message,
          stack: error.stack ?? 'Стек недоступен',
        })
      }
    }
  }

  const createErrors = () => {
    const errors: ErrorInfo[] = []

    const errorTypes = [
      () => new Error('Обычная ошибка'),
      () => new TypeError('Значение не является функцией'),
      () => new RangeError('Число вне допустимого диапазона'),
      () => new SyntaxError('Неожиданный токен'),
      () => new ReferenceError('Переменная не определена'),
      () => new URIError('Некорректный URI'),
    ]

    for (const createError of errorTypes) {
      const err = createError()
      errors.push({
        name: err.name,
        message: err.message,
        stack: err.stack?.split('\n')[0] ?? '',
      })
    }

    setCustomErrors(errors)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Объект Error</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={inspectError}>Исследовать Error</button>
        <button onClick={createErrors}>Создать разные ошибки</button>
      </div>

      {errorInfo && (
        <div
          style={{
            padding: '1rem',
            background: '#fff3e0',
            borderRadius: '8px',
            border: '1px solid #ff9800',
            marginBottom: '1rem',
          }}
        >
          <h3>Свойства Error:</h3>
          <p>
            <strong>name:</strong> <code>{errorInfo.name}</code>
          </p>
          <p>
            <strong>message:</strong> <code>{errorInfo.message}</code>
          </p>
          <p>
            <strong>stack:</strong>
          </p>
          <pre style={{ fontSize: '0.8rem', overflow: 'auto', maxHeight: '150px' }}>
            {errorInfo.stack}
          </pre>
        </div>
      )}

      {customErrors.length > 0 && (
        <div
          style={{
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
            border: '1px solid #4caf50',
          }}
        >
          <h3>Встроенные типы ошибок:</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>
                  name
                </th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>
                  message
                </th>
              </tr>
            </thead>
            <tbody>
              {customErrors.map((e, i) => (
                <tr key={i}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                    <code>{e.name}</code>
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{e.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
