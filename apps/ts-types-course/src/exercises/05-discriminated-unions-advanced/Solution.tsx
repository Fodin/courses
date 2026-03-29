import { useState } from 'react'

// ============================================
// Задание 5.1: Exhaustive Switches — Решение
// ============================================

export function Task5_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Discriminated union для фигур
    type Shape =
      | { kind: 'circle'; radius: number }
      | { kind: 'rectangle'; width: number; height: number }
      | { kind: 'triangle'; base: number; height: number }

    // Exhaustiveness checking через never
    function assertNever(value: never): never {
      throw new Error(`Unexpected value: ${JSON.stringify(value)}`)
    }

    function getArea(shape: Shape): number {
      switch (shape.kind) {
        case 'circle':
          return Math.PI * shape.radius ** 2
        case 'rectangle':
          return shape.width * shape.height
        case 'triangle':
          return (shape.base * shape.height) / 2
        default:
          return assertNever(shape)
      }
    }

    const circle: Shape = { kind: 'circle', radius: 5 }
    const rect: Shape = { kind: 'rectangle', width: 4, height: 6 }
    const tri: Shape = { kind: 'triangle', base: 3, height: 8 }

    log.push(`1. Площадь круга (r=5): ${getArea(circle).toFixed(2)}`)
    log.push(`2. Площадь прямоугольника (4x6): ${getArea(rect)}`)
    log.push(`3. Площадь треугольника (b=3, h=8): ${getArea(tri)}`)

    // Exhaustive checking через satisfies
    type Result =
      | { status: 'success'; data: string }
      | { status: 'error'; message: string }
      | { status: 'loading' }

    function formatResult(result: Result): string {
      switch (result.status) {
        case 'success':
          return `Data: ${result.data}`
        case 'error':
          return `Error: ${result.message}`
        case 'loading':
          return 'Loading...'
        default:
          return assertNever(result)
      }
    }

    const success: Result = { status: 'success', data: 'Users loaded' }
    const error: Result = { status: 'error', message: 'Network failure' }
    const loading: Result = { status: 'loading' }

    log.push(`4. formatResult(success): "${formatResult(success)}"`)
    log.push(`5. formatResult(error): "${formatResult(error)}"`)
    log.push(`6. formatResult(loading): "${formatResult(loading)}"`)

    // Exhaustive record pattern
    const areaFormulas: Record<Shape['kind'], string> = {
      circle: 'pi * r^2',
      rectangle: 'w * h',
      triangle: '(b * h) / 2',
    }
    log.push(`7. Record<Shape['kind'], string>: ${JSON.stringify(areaFormulas)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Exhaustive Switches</h2>
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

// ============================================
// Задание 5.2: Полиморфные обработчики — Решение
// ============================================

export function Task5_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Типизированные события
    type AppEvent =
      | { type: 'USER_LOGIN'; payload: { userId: string; timestamp: number } }
      | { type: 'USER_LOGOUT'; payload: { userId: string } }
      | { type: 'PAGE_VIEW'; payload: { url: string; referrer: string } }
      | { type: 'PURCHASE'; payload: { productId: string; amount: number } }

    // Тип для извлечения payload по типу события
    type EventPayload<T extends AppEvent['type']> =
      Extract<AppEvent, { type: T }>['payload']

    // Типобезопасная dispatch-таблица
    type EventHandlers = {
      [K in AppEvent['type']]: (payload: EventPayload<K>) => string
    }

    const handlers: EventHandlers = {
      USER_LOGIN: (payload) =>
        `User ${payload.userId} logged in at ${new Date(payload.timestamp).toISOString()}`,
      USER_LOGOUT: (payload) =>
        `User ${payload.userId} logged out`,
      PAGE_VIEW: (payload) =>
        `Page viewed: ${payload.url} (from: ${payload.referrer})`,
      PURCHASE: (payload) =>
        `Purchase: product ${payload.productId} for $${payload.amount}`,
    }

    // Типобезопасный dispatch
    function dispatch<T extends AppEvent['type']>(
      type: T,
      payload: EventPayload<T>
    ): string {
      const handler = handlers[type] as (payload: EventPayload<T>) => string
      return handler(payload)
    }

    log.push(`1. ${dispatch('USER_LOGIN', { userId: 'u-42', timestamp: Date.now() })}`)
    log.push(`2. ${dispatch('USER_LOGOUT', { userId: 'u-42' })}`)
    log.push(`3. ${dispatch('PAGE_VIEW', { url: '/dashboard', referrer: '/login' })}`)
    log.push(`4. ${dispatch('PURCHASE', { productId: 'p-99', amount: 49.99 })}`)

    // Middleware pattern с типизированными событиями
    type Middleware = (event: AppEvent, next: () => void) => void

    const loggingMiddleware: Middleware = (event, next) => {
      log.push(`5. [Middleware] Processing: ${event.type}`)
      next()
    }

    const testEvent: AppEvent = {
      type: 'PAGE_VIEW',
      payload: { url: '/products', referrer: '/home' },
    }
    loggingMiddleware(testEvent, () => {
      log.push(`6. [Middleware] Event processed successfully`)
    })

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: Полиморфные обработчики</h2>
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

// ============================================
// Задание 5.3: Алгебраические типы данных — Решение
// ============================================

export function Task5_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Option type (Maybe monad)
    type Option<T> =
      | { tag: 'some'; value: T }
      | { tag: 'none' }

    function some<T>(value: T): Option<T> {
      return { tag: 'some', value }
    }

    function none<T>(): Option<T> {
      return { tag: 'none' }
    }

    function mapOption<T, U>(opt: Option<T>, fn: (val: T) => U): Option<U> {
      if (opt.tag === 'some') {
        return some(fn(opt.value))
      }
      return none()
    }

    function unwrapOr<T>(opt: Option<T>, defaultValue: T): T {
      return opt.tag === 'some' ? opt.value : defaultValue
    }

    const maybeUser = some({ name: 'Alice', age: 30 })
    const maybeName = mapOption(maybeUser, (u) => u.name)
    log.push(`1. Option<User> -> map(name): ${JSON.stringify(maybeName)}`)
    log.push(`2. unwrapOr(some("Alice"), "Unknown"): "${unwrapOr(some('Alice'), 'Unknown')}"`)
    log.push(`3. unwrapOr(none(), "Unknown"): "${unwrapOr(none<string>(), 'Unknown')}"`)

    // Result type (Either monad)
    type Result<T, E> =
      | { tag: 'ok'; value: T }
      | { tag: 'err'; error: E }

    function ok<T, E>(value: T): Result<T, E> {
      return { tag: 'ok', value }
    }

    function err<T, E>(error: E): Result<T, E> {
      return { tag: 'err', error }
    }

    function mapResult<T, U, E>(
      result: Result<T, E>,
      fn: (val: T) => U
    ): Result<U, E> {
      if (result.tag === 'ok') {
        return ok(fn(result.value))
      }
      return result
    }

    function parseAge(input: string): Result<number, string> {
      const num = Number(input)
      if (isNaN(num)) return err(`"${input}" is not a number`)
      if (num < 0 || num > 150) return err(`Age ${num} is out of range`)
      return ok(num)
    }

    const validAge = parseAge('25')
    const invalidAge = parseAge('abc')
    const outOfRange = parseAge('200')

    log.push(`4. parseAge("25"): ${JSON.stringify(validAge)}`)
    log.push(`5. parseAge("abc"): ${JSON.stringify(invalidAge)}`)
    log.push(`6. parseAge("200"): ${JSON.stringify(outOfRange)}`)

    // Рекурсивный ADT — дерево выражений
    type Expr =
      | { tag: 'num'; value: number }
      | { tag: 'add'; left: Expr; right: Expr }
      | { tag: 'mul'; left: Expr; right: Expr }
      | { tag: 'neg'; operand: Expr }

    function evaluate(expr: Expr): number {
      switch (expr.tag) {
        case 'num': return expr.value
        case 'add': return evaluate(expr.left) + evaluate(expr.right)
        case 'mul': return evaluate(expr.left) * evaluate(expr.right)
        case 'neg': return -evaluate(expr.operand)
      }
    }

    function printExpr(expr: Expr): string {
      switch (expr.tag) {
        case 'num': return String(expr.value)
        case 'add': return `(${printExpr(expr.left)} + ${printExpr(expr.right)})`
        case 'mul': return `(${printExpr(expr.left)} * ${printExpr(expr.right)})`
        case 'neg': return `(-${printExpr(expr.operand)})`
      }
    }

    // (2 + 3) * (-4) = -20
    const expression: Expr = {
      tag: 'mul',
      left: {
        tag: 'add',
        left: { tag: 'num', value: 2 },
        right: { tag: 'num', value: 3 },
      },
      right: {
        tag: 'neg',
        operand: { tag: 'num', value: 4 },
      },
    }

    log.push(`7. Expr: ${printExpr(expression)} = ${evaluate(expression)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Алгебраические типы данных</h2>
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
