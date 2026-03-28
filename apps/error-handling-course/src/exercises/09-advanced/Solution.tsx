import { useState } from 'react'

// ============================================
// Задание 9.1: Функциональная обработка — Решение
// ============================================

type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E }

const ok = <T,>(value: T): Result<T, never> => ({ ok: true, value })
const err = <E,>(error: E): Result<never, E> => ({ ok: false, error })

function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result
}

function flatMap<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
  return result.ok ? fn(result.value) : result
}

function mapError<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  return result.ok ? result : err(fn(result.error))
}

function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue
}

// Pipeline
function pipe<T, E>(...fns: Array<(input: Result<unknown, E>) => Result<unknown, E>>) {
  return (initial: Result<T, E>) => fns.reduce((acc, fn) => fn(acc as Result<unknown, E>), initial as Result<unknown, E>)
}

function safeParseNumber(input: string): Result<number, string> {
  const num = Number(input)
  return isNaN(num) ? err(`"${input}" не число`) : ok(num)
}

function validatePositive(num: number): Result<number, string> {
  return num > 0 ? ok(num) : err(`${num} должно быть положительным`)
}

function safeSqrt(num: number): Result<number, string> {
  return num >= 0 ? ok(Math.sqrt(num)) : err('Нельзя извлечь корень из отрицательного числа')
}

export function Task9_1_Solution() {
  const [input, setInput] = useState('16')
  const [result, setResult] = useState<string>('')

  const calculate = () => {
    const pipeline = flatMap(
      flatMap(safeParseNumber(input), validatePositive),
      safeSqrt
    )

    const doubled = map(pipeline, (v) => v * 2)
    const formatted = map(doubled, (v) => `Результат: ${v.toFixed(4)}`)
    const output = unwrapOr(formatted, 'Ошибка вычисления')

    const errorMapped = mapError(pipeline, (e) => `ОШИБКА: ${e.toUpperCase()}`)

    setResult(pipeline.ok
      ? output
      : `${errorMapped.ok ? '' : errorMapped.error}`)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.1: Функциональная обработка</h2>
      <p>Введите число. Цепочка: parse → validate positive → sqrt → double</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} style={{ width: '200px' }} />
        <button onClick={calculate}>Вычислить</button>
      </div>

      {result && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          background: result.startsWith('ОШИБКА') ? '#ffebee' : '#e8f5e9',
          border: `1px solid ${result.startsWith('ОШИБКА') ? '#ef5350' : '#4caf50'}`,
        }}>
          <code>{result}</code>
        </div>
      )}

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
        <p>Попробуйте: "16" (успех), "abc" (не число), "-4" (не положительное)</p>
      </div>
    </div>
  )
}

// ============================================
// Задание 9.2: Тестирование ошибок — Решение
// ============================================

// Функции для тестирования
function divideOrThrow(a: number, b: number): number {
  if (b === 0) throw new Error('Division by zero')
  return a / b
}

async function fetchUserOrThrow(id: number): Promise<{ name: string }> {
  if (id < 0) throw new TypeError('ID must be positive')
  if (id === 0) throw new Error('User not found')
  return { name: `User_${id}` }
}

function validateAge(age: unknown): number {
  if (typeof age !== 'number') throw new TypeError(`Expected number, got ${typeof age}`)
  if (age < 0 || age > 150) throw new RangeError(`Age ${age} is out of range [0, 150]`)
  return age
}

interface TestResult {
  name: string
  passed: boolean
  error?: string
}

function test(name: string, fn: () => void): TestResult {
  try {
    fn()
    return { name, passed: true }
  } catch (e) {
    return { name, passed: false, error: e instanceof Error ? e.message : String(e) }
  }
}

function expect<T>(actual: T) {
  return {
    toBe: (expected: T) => {
      if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`)
    },
    toThrow: (fn: () => void, expectedMessage?: string) => {
      try {
        fn()
        throw new Error('Expected function to throw')
      } catch (e) {
        if (e instanceof Error && e.message === 'Expected function to throw') throw e
        if (expectedMessage && e instanceof Error && !e.message.includes(expectedMessage)) {
          throw new Error(`Expected "${expectedMessage}" in error, got "${e.message}"`)
        }
      }
    },
    toThrowType: (fn: () => void, ErrorType: abstract new (...args: string[]) => Error) => {
      try {
        fn()
        throw new Error('Expected function to throw')
      } catch (e) {
        if (e instanceof Error && e.message === 'Expected function to throw') throw e
        if (!(e instanceof ErrorType)) {
          throw new Error(`Expected ${ErrorType.name}, got ${(e as Error).constructor.name}`)
        }
      }
    },
  }
}

export function Task9_2_Solution() {
  const [results, setResults] = useState<TestResult[]>([])

  const runTests = () => {
    const testResults: TestResult[] = [
      test('divideOrThrow: normal division', () => {
        expect(divideOrThrow(10, 2)).toBe(5)
      }),
      test('divideOrThrow: throws on zero', () => {
        expect(null).toThrow(() => divideOrThrow(10, 0), 'Division by zero')
      }),
      test('validateAge: valid age', () => {
        expect(validateAge(25)).toBe(25)
      }),
      test('validateAge: throws TypeError for string', () => {
        expect(null).toThrowType(() => validateAge('abc' as unknown), TypeError)
      }),
      test('validateAge: throws RangeError for negative', () => {
        expect(null).toThrowType(() => validateAge(-1), RangeError)
      }),
      test('validateAge: throws RangeError for > 150', () => {
        expect(null).toThrow(() => validateAge(200), 'out of range')
      }),
    ]

    setResults(testResults)
  }

  const passed = results.filter((r) => r.passed).length

  return (
    <div className="exercise-container">
      <h2>Задание 9.2: Тестирование ошибок</h2>
      <button onClick={runTests}>Запустить тесты</button>

      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontWeight: 'bold' }}>
            {passed}/{results.length} тестов пройдено
            {passed === results.length ? ' ✅' : ' ❌'}
          </p>
          {results.map((r, i) => (
            <div key={i} style={{
              padding: '0.5rem',
              margin: '0.25rem 0',
              background: r.passed ? '#e8f5e9' : '#ffebee',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}>
              {r.passed ? '✅' : '❌'} {r.name}
              {r.error && <span style={{ color: '#c62828' }}> — {r.error}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 9.3: Финальный проект — Решение
// ============================================

class AppError extends Error {
  code: string
  constructor(message: string, code: string) {
    super(message)
    this.name = 'AppError'
    this.code = code
  }
}

interface TodoItem {
  id: number
  text: string
  done: boolean
}

let nextId = 1
let todoStore: TodoItem[] = []

function simulateTodoApi(action: string, payload?: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      switch (action) {
        case 'list':
          resolve([...todoStore])
          break
        case 'add': {
          const text = (payload as { text: string }).text
          if (!text.trim()) {
            reject(new AppError('Текст задачи не может быть пустым', 'VALIDATION'))
            return
          }
          if (todoStore.length >= 5) {
            reject(new AppError('Максимум 5 задач (демо-лимит)', 'LIMIT_EXCEEDED'))
            return
          }
          if (Math.random() < 0.2) {
            reject(new AppError('Сервер временно недоступен', 'SERVER_ERROR'))
            return
          }
          const item: TodoItem = { id: nextId++, text, done: false }
          todoStore.push(item)
          resolve(item)
          break
        }
        case 'toggle': {
          const id = (payload as { id: number }).id
          const todo = todoStore.find((t) => t.id === id)
          if (!todo) {
            reject(new AppError(`Задача #${id} не найдена`, 'NOT_FOUND'))
            return
          }
          todo.done = !todo.done
          resolve(todo)
          break
        }
        case 'delete': {
          const delId = (payload as { id: number }).id
          const idx = todoStore.findIndex((t) => t.id === delId)
          if (idx === -1) {
            reject(new AppError(`Задача #${delId} не найдена`, 'NOT_FOUND'))
            return
          }
          todoStore.splice(idx, 1)
          resolve({ deleted: delId })
          break
        }
        default:
          reject(new AppError(`Неизвестное действие: ${action}`, 'UNKNOWN'))
      }
    }, 300)
  })
}

export function Task9_3_Solution() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const clearError = () => setError(null)

  const withErrorHandling = async (fn: () => Promise<void>) => {
    clearError()
    setLoading(true)
    try {
      await fn()
    } catch (e) {
      if (e instanceof AppError) {
        setError(`[${e.code}] ${e.message}`)
      } else if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Неизвестная ошибка')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadTodos = () => withErrorHandling(async () => {
    const list = await simulateTodoApi('list') as TodoItem[]
    setTodos(list)
  })

  const addTodo = () => withErrorHandling(async () => {
    await simulateTodoApi('add', { text: input })
    setInput('')
    const list = await simulateTodoApi('list') as TodoItem[]
    setTodos(list)
  })

  const toggleTodo = (id: number) => withErrorHandling(async () => {
    await simulateTodoApi('toggle', { id })
    const list = await simulateTodoApi('list') as TodoItem[]
    setTodos(list)
  })

  const deleteTodo = (id: number) => withErrorHandling(async () => {
    await simulateTodoApi('delete', { id })
    const list = await simulateTodoApi('list') as TodoItem[]
    setTodos(list)
  })

  const resetStore = () => {
    todoStore = []
    nextId = 1
    setTodos([])
    clearError()
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.3: Финальный проект — Todo с обработкой ошибок</h2>

      {error && (
        <div role="alert" style={{ padding: '0.75rem', background: '#ffebee', borderRadius: '4px', border: '1px solid #ef5350', marginBottom: '1rem' }}>
          {error}
          <button onClick={clearError} style={{ marginLeft: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Новая задача..." onKeyDown={(e) => e.key === 'Enter' && addTodo()} style={{ flex: 1 }} />
        <button onClick={addTodo} disabled={loading}>{loading ? '...' : 'Добавить'}</button>
        <button onClick={loadTodos} disabled={loading}>Обновить</button>
        <button onClick={resetStore}>Сброс</button>
      </div>

      <p style={{ color: '#666', fontSize: '0.85rem' }}>20% шанс ошибки сервера при добавлении. Лимит: 5 задач.</p>

      {todos.length === 0 ? (
        <p style={{ color: '#999' }}>Нет задач. Добавьте первую!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
              <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
              <span style={{ flex: 1, textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#999' : 'inherit' }}>
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef5350' }}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
