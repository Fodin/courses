import { useState } from 'react'

// ============================================
// Задание 4.1: Result тип — Решение
// ============================================

type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

function safeDivide(a: number, b: number): Result<number, string> {
  if (b === 0) return err('Деление на ноль')
  return ok(a / b)
}

function safeParseInt(str: string): Result<number, string> {
  const num = parseInt(str, 10)
  if (isNaN(num)) return err(`"${str}" не является числом`)
  return ok(num)
}

function safeJsonParse<T>(json: string): Result<T, string> {
  try {
    return ok(JSON.parse(json))
  } catch {
    return err('Некорректный JSON')
  }
}

export function Task4_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExamples = () => {
    const log: string[] = []

    // safeDivide
    const r1 = safeDivide(10, 3)
    if (r1.ok) log.push(`10 / 3 = ${r1.value.toFixed(2)}`)

    const r2 = safeDivide(10, 0)
    if (!r2.ok) log.push(`10 / 0 = Ошибка: ${r2.error}`)

    // safeParseInt
    const r3 = safeParseInt('42')
    if (r3.ok) log.push(`parseInt("42") = ${r3.value}`)

    const r4 = safeParseInt('abc')
    if (!r4.ok) log.push(`parseInt("abc") = Ошибка: ${r4.error}`)

    // safeJsonParse
    const r5 = safeJsonParse<{ name: string }>('{"name":"Alice"}')
    if (r5.ok) log.push(`JSON parse: name = ${r5.value.name}`)

    const r6 = safeJsonParse('{invalid}')
    if (!r6.ok) log.push(`JSON parse: ${r6.error}`)

    // Цепочка операций
    log.push('\n--- Цепочка ---')
    const input = '5'
    const parseResult = safeParseInt(input)
    if (parseResult.ok) {
      const divResult = safeDivide(100, parseResult.value)
      if (divResult.ok) {
        log.push(`100 / ${input} = ${divResult.value}`)
      }
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Result тип</h2>
      <button onClick={runExamples}>Запустить</button>
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
// Задание 4.2: Discriminated unions — Решение
// ============================================

type LoadingState = { status: 'idle' }
type LoadingInProgress = { status: 'loading' }
type LoadingSuccess<T> = { status: 'success'; data: T }
type LoadingError = { status: 'error'; error: string; retryCount: number }

type AsyncState<T> = LoadingState | LoadingInProgress | LoadingSuccess<T> | LoadingError

interface User {
  id: number
  name: string
  email: string
}

function renderState(state: AsyncState<User>): string {
  switch (state.status) {
    case 'idle':
      return 'Ожидание запуска'
    case 'loading':
      return 'Загрузка...'
    case 'success':
      return `Пользователь: ${state.data.name} (${state.data.email})`
    case 'error':
      return `Ошибка: ${state.error} (попытка ${state.retryCount})`
  }
}

export function Task4_2_Solution() {
  const [state, setState] = useState<AsyncState<User>>({ status: 'idle' })

  const simulate = async () => {
    setState({ status: 'loading' })

    await new Promise((r) => setTimeout(r, 1000))

    if (Math.random() > 0.5) {
      setState({
        status: 'success',
        data: { id: 1, name: 'Alice', email: 'alice@example.com' },
      })
    } else {
      setState({
        status: 'error',
        error: 'Сервер недоступен',
        retryCount: 1,
      })
    }
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Discriminated unions</h2>
      <button onClick={simulate} disabled={state.status === 'loading'}>
        Загрузить пользователя
      </button>
      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          borderRadius: '8px',
          background:
            state.status === 'error'
              ? '#ffebee'
              : state.status === 'success'
                ? '#e8f5e9'
                : '#f5f5f5',
          border: `1px solid ${state.status === 'error' ? '#ef5350' : state.status === 'success' ? '#4caf50' : '#ccc'}`,
        }}
      >
        <strong>Состояние:</strong> {renderState(state)}
      </div>
    </div>
  )
}

// ============================================
// Задание 4.3: Type-safe ошибки — Решение
// ============================================

type AppErrorCode = 'VALIDATION' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'NETWORK' | 'UNKNOWN'

interface TypedError<C extends AppErrorCode> {
  code: C
  message: string
  details?: Record<string, unknown>
}

type ValidationErr = TypedError<'VALIDATION'> & {
  details: { field: string; constraint: string }
}

type NotFoundErr = TypedError<'NOT_FOUND'> & {
  details: { resource: string; id: string }
}

type AppErr = ValidationErr | NotFoundErr | TypedError<'UNAUTHORIZED'> | TypedError<'NETWORK'> | TypedError<'UNKNOWN'>

function handleAppError(error: AppErr): string {
  switch (error.code) {
    case 'VALIDATION':
      return `Поле "${error.details.field}": ${error.details.constraint}`
    case 'NOT_FOUND':
      return `${error.details.resource} с ID ${error.details.id} не найден`
    case 'UNAUTHORIZED':
      return 'Необходима авторизация'
    case 'NETWORK':
      return 'Проблема с сетью'
    case 'UNKNOWN':
      return `Неизвестная ошибка: ${error.message}`
  }
}

export function Task4_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExamples = () => {
    const errors: AppErr[] = [
      { code: 'VALIDATION', message: 'Invalid email', details: { field: 'email', constraint: 'должен содержать @' } },
      { code: 'NOT_FOUND', message: 'User not found', details: { resource: 'Пользователь', id: '123' } },
      { code: 'UNAUTHORIZED', message: 'Token expired' },
      { code: 'NETWORK', message: 'Connection timeout' },
      { code: 'UNKNOWN', message: 'Something unexpected happened' },
    ]

    setResults(errors.map((e) => `[${e.code}] ${handleAppError(e)}`))
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Type-safe ошибки</h2>
      <button onClick={runExamples}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Обработка ошибок:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 4.4: Exhaustive handling — Решение
// ============================================

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number }

function assertNever(value: never): never {
  throw new Error(`Необработанный случай: ${JSON.stringify(value)}`)
}

function calculateArea(shape: Shape): Result<number, string> {
  switch (shape.kind) {
    case 'circle':
      if (shape.radius < 0) return err('Радиус не может быть отрицательным')
      return ok(Math.PI * shape.radius ** 2)
    case 'rectangle':
      if (shape.width < 0 || shape.height < 0) return err('Размеры не могут быть отрицательными')
      return ok(shape.width * shape.height)
    case 'triangle':
      if (shape.base < 0 || shape.height < 0) return err('Размеры не могут быть отрицательными')
      return ok((shape.base * shape.height) / 2)
    default:
      return assertNever(shape)
  }
}

export function Task4_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExamples = () => {
    const log: string[] = []

    const shapes: Shape[] = [
      { kind: 'circle', radius: 5 },
      { kind: 'rectangle', width: 4, height: 6 },
      { kind: 'triangle', base: 3, height: 8 },
      { kind: 'circle', radius: -1 },
    ]

    for (const shape of shapes) {
      const result = calculateArea(shape)
      if (result.ok) {
        log.push(`${shape.kind}: площадь = ${result.value.toFixed(2)}`)
      } else {
        log.push(`${shape.kind}: ❌ ${result.error}`)
      }
    }

    // Демонстрация assertNever — если добавить новый тип, TS покажет ошибку компиляции
    log.push('\nassertNever гарантирует обработку всех вариантов union type.')
    log.push('Если добавить новый kind, TypeScript покажет ошибку компиляции.')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.4: Exhaustive handling</h2>
      <button onClick={runExamples}>Запустить</button>
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
