import { useState } from 'react'

// ============================================
// Задание 0.1: Branded Types — Решение
// ============================================

declare const __brand: unique symbol

type Brand<T, B extends string> = T & { readonly [__brand]: B }

type UserId = Brand<string, 'UserId'>
type Email = Brand<string, 'Email'>
type OrderId = Brand<string, 'OrderId'>

function createUserId(id: string): UserId {
  if (!id || id.length < 3) {
    throw new Error(`Invalid UserId: "${id}" must be at least 3 characters`)
  }
  return id as UserId
}

function createEmail(value: string): Email {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    throw new Error(`Invalid Email: "${value}" is not a valid email`)
  }
  return value as Email
}

function createOrderId(id: string): OrderId {
  if (!/^ORD-\d+$/.test(id)) {
    throw new Error(`Invalid OrderId: "${id}" must match ORD-XXXX format`)
  }
  return id as OrderId
}

function findUser(userId: UserId): string {
  return `User found: ${userId}`
}

function sendEmail(email: Email): string {
  return `Email sent to: ${email}`
}

function getOrder(orderId: OrderId): string {
  return `Order details: ${orderId}`
}

export function Task0_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Creating branded values with validation
    try {
      const userId = createUserId('usr-42')
      log.push(`✅ Created UserId: ${userId}`)
      log.push(`   ${findUser(userId)}`)
    } catch (e) {
      if (e instanceof Error) log.push(`❌ ${e.message}`)
    }

    try {
      const email = createEmail('alice@example.com')
      log.push(`✅ Created Email: ${email}`)
      log.push(`   ${sendEmail(email)}`)
    } catch (e) {
      if (e instanceof Error) log.push(`❌ ${e.message}`)
    }

    try {
      const orderId = createOrderId('ORD-1001')
      log.push(`✅ Created OrderId: ${orderId}`)
      log.push(`   ${getOrder(orderId)}`)
    } catch (e) {
      if (e instanceof Error) log.push(`❌ ${e.message}`)
    }

    // Validation failures
    log.push('')
    log.push('--- Validation failures ---')

    try {
      createUserId('ab')
    } catch (e) {
      if (e instanceof Error) log.push(`❌ ${e.message}`)
    }

    try {
      createEmail('not-an-email')
    } catch (e) {
      if (e instanceof Error) log.push(`❌ ${e.message}`)
    }

    try {
      createOrderId('12345')
    } catch (e) {
      if (e instanceof Error) log.push(`❌ ${e.message}`)
    }

    // Compile-time safety demonstration
    log.push('')
    log.push('--- Compile-time safety ---')
    log.push('✅ findUser(userId) — compiles OK')
    log.push('❌ findUser("raw-string") — TS error: string is not UserId')
    log.push('❌ findUser(email) — TS error: Email is not UserId')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: Branded Types</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
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
// Задание 0.2: Type Guards — Решение
// ============================================

interface SuccessResponse {
  status: 'success'
  data: { id: number; name: string }
}

interface ErrorResponse {
  status: 'error'
  error: { code: number; message: string }
}

type ApiResponse = SuccessResponse | ErrorResponse

function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return response.status === 'error'
}

function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
  return response.status === 'success'
}

interface Circle {
  kind: 'circle'
  radius: number
}

interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}

interface Triangle {
  kind: 'triangle'
  base: number
  height: number
}

type Shape = Circle | Rectangle | Triangle

function isCircle(shape: Shape): shape is Circle {
  return shape.kind === 'circle'
}

function isRectangle(shape: Shape): shape is Rectangle {
  return shape.kind === 'rectangle'
}

function getArea(shape: Shape): number {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2
  }
  if (isRectangle(shape)) {
    return shape.width * shape.height
  }
  return (shape.base * shape.height) / 2
}

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

export function Task0_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // API response type guards
    const successResp: ApiResponse = { status: 'success', data: { id: 1, name: 'Alice' } }
    const errorResp: ApiResponse = { status: 'error', error: { code: 404, message: 'Not found' } }

    log.push('--- API Response Guards ---')
    if (isSuccessResponse(successResp)) {
      log.push(`✅ Success: user ${successResp.data.name} (id: ${successResp.data.id})`)
    }
    if (isErrorResponse(errorResp)) {
      log.push(`❌ Error ${errorResp.error.code}: ${errorResp.error.message}`)
    }

    // Shape type guards
    log.push('')
    log.push('--- Shape Guards ---')
    const shapes: Shape[] = [
      { kind: 'circle', radius: 5 },
      { kind: 'rectangle', width: 4, height: 6 },
      { kind: 'triangle', base: 3, height: 8 },
    ]

    for (const shape of shapes) {
      log.push(`✅ ${shape.kind}: area = ${getArea(shape).toFixed(2)}`)
    }

    // NonNullable guard
    log.push('')
    log.push('--- NonNullable Guard ---')
    const values: (string | null | undefined)[] = ['hello', null, 'world', undefined, 'ts']
    const filtered = values.filter(isNonNullable)
    log.push(`✅ Filtered: [${filtered.join(', ')}] (${filtered.length} of ${values.length})`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Type Guards</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
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
// Задание 0.3: Discriminated Unions — Решение
// ============================================

interface ClickEvent {
  type: 'click'
  x: number
  y: number
  target: string
}

interface SubmitEvent {
  type: 'submit'
  formId: string
  data: Record<string, string>
}

interface NavigateEvent {
  type: 'navigate'
  from: string
  to: string
}

type AppEvent = ClickEvent | SubmitEvent | NavigateEvent

function handleEvent(event: AppEvent): string {
  switch (event.type) {
    case 'click':
      return `Click at (${event.x}, ${event.y}) on "${event.target}"`
    case 'submit':
      return `Form "${event.formId}" submitted with ${Object.keys(event.data).length} fields`
    case 'navigate':
      return `Navigation: ${event.from} → ${event.to}`
    default: {
      const _exhaustive: never = event
      return _exhaustive
    }
  }
}

function formatEvent(event: AppEvent): string {
  switch (event.type) {
    case 'click':
      return `🖱️ ${handleEvent(event)}`
    case 'submit':
      return `📝 ${handleEvent(event)}`
    case 'navigate':
      return `🧭 ${handleEvent(event)}`
    default: {
      const _exhaustive: never = event
      return _exhaustive
    }
  }
}

export function Task0_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    const events: AppEvent[] = [
      { type: 'click', x: 100, y: 200, target: 'button.submit' },
      { type: 'submit', formId: 'login', data: { username: 'alice', password: '***' } },
      { type: 'navigate', from: '/home', to: '/dashboard' },
      { type: 'click', x: 50, y: 75, target: 'a.nav-link' },
      { type: 'navigate', from: '/dashboard', to: '/settings' },
    ]

    log.push('--- Event Processing ---')
    for (const event of events) {
      log.push(formatEvent(event))
    }

    log.push('')
    log.push('--- Exhaustive Check ---')
    log.push('✅ All event types handled in switch')
    log.push('✅ Adding new type to union → TS error in default branch')
    log.push('✅ The `never` type ensures exhaustive matching')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.3: Discriminated Unions</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
