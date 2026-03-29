import { useState } from 'react'

// ============================================
// Задание 4.1: Match Expression — Решение
// ============================================

type MatchHandler<T extends string, R> = {
  [K in T]: (value: K) => R
}

function match<T extends string>(value: T) {
  return {
    with<R>(handlers: { [K in T]: (value: K) => R }): R {
      const handler = (handlers as unknown as Record<string, (value: string) => R>)[value]
      return handler(value)
    },
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface RouteConfig {
  method: HttpMethod
  cacheable: boolean
  idempotent: boolean
  description: string
}

function describeMethod(method: HttpMethod): RouteConfig {
  return match(method).with<RouteConfig>({
    GET: () => ({
      method: 'GET',
      cacheable: true,
      idempotent: true,
      description: 'Retrieve a resource without side effects',
    }),
    POST: () => ({
      method: 'POST',
      cacheable: false,
      idempotent: false,
      description: 'Create a new resource',
    }),
    PUT: () => ({
      method: 'PUT',
      cacheable: false,
      idempotent: true,
      description: 'Replace a resource entirely',
    }),
    DELETE: () => ({
      method: 'DELETE',
      cacheable: false,
      idempotent: true,
      description: 'Remove a resource',
    }),
    PATCH: () => ({
      method: 'PATCH',
      cacheable: false,
      idempotent: false,
      description: 'Partially update a resource',
    }),
  })
}

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number }

function matchTagged<T extends { kind: string }>(value: T) {
  return {
    with<R>(handlers: { [K in T['kind']]: (val: Extract<T, { kind: K }>) => R }): R {
      const handler = (handlers as unknown as Record<string, (val: T) => R>)[value.kind]
      return handler(value)
    },
  }
}

function calculateArea(shape: Shape): number {
  return matchTagged(shape).with({
    circle: (s) => Math.PI * s.radius * s.radius,
    rectangle: (s) => s.width * s.height,
    triangle: (s) => 0.5 * s.base * s.height,
  })
}

export function Task4_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Match Expression для строковых литералов ===')
    const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    for (const method of methods) {
      const config = describeMethod(method)
      log.push(
        `  ${method}: cacheable=${config.cacheable}, idempotent=${config.idempotent}`
      )
      log.push(`    → ${config.description}`)
    }

    log.push('')
    log.push('=== Match Expression для tagged unions ===')
    const shapes: Shape[] = [
      { kind: 'circle', radius: 5 },
      { kind: 'rectangle', width: 4, height: 6 },
      { kind: 'triangle', base: 3, height: 8 },
    ]
    for (const shape of shapes) {
      const area = calculateArea(shape)
      log.push(`  ${shape.kind}: area = ${area.toFixed(2)}`)
    }

    log.push('')
    log.push('=== Безопасность: компилятор гарантирует обработку всех вариантов ===')
    log.push('  Если добавить новый HttpMethod, TypeScript покажет ошибку')
    log.push('  в handlers, пока не добавим обработчик для нового варианта')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Match Expression</h2>
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
// Задание 4.2: Variant Types — Решение
// ============================================

type Variant<Tag extends string, Data = undefined> = Data extends undefined
  ? { readonly _tag: Tag }
  : { readonly _tag: Tag; readonly data: Data }

function variant<Tag extends string>(tag: Tag): Variant<Tag>
function variant<Tag extends string, Data>(tag: Tag, data: Data): Variant<Tag, Data>
function variant<Tag extends string, Data>(tag: Tag, data?: Data) {
  if (data === undefined) return { _tag: tag } as Variant<Tag>
  return { _tag: tag, data } as Variant<Tag, Data>
}

type RemoteData<E, A> =
  | Variant<'NotAsked'>
  | Variant<'Loading'>
  | Variant<'Failure', E>
  | Variant<'Success', A>

const NotAsked = (): RemoteData<never, never> => variant('NotAsked')
const Loading = (): RemoteData<never, never> => variant('Loading')
const Failure = <E,>(error: E): RemoteData<E, never> => variant('Failure', error)
const Success = <A,>(value: A): RemoteData<never, A> => variant('Success', value)

function matchVariant<T extends { _tag: string }>(value: T) {
  return {
    with<R>(handlers: { [K in T['_tag']]: (val: Extract<T, { _tag: K }>) => R }): R {
      const handler = (handlers as unknown as Record<string, (val: T) => R>)[value._tag]
      return handler(value)
    },
  }
}

function renderRemoteData<E, A>(
  rd: RemoteData<E, A>,
  formatValue: (a: A) => string,
  formatError: (e: E) => string
): string {
  switch (rd._tag) {
    case 'NotAsked': return '[idle] No request made yet'
    case 'Loading': return '[loading] Fetching data...'
    case 'Failure': return `[error] ${formatError((rd as Variant<'Failure', E> & { data: E }).data)}`
    case 'Success': return `[success] ${formatValue((rd as Variant<'Success', A> & { data: A }).data)}`
  }
}

type PaymentResult =
  | Variant<'Approved', { transactionId: string; amount: number }>
  | Variant<'Declined', { reason: string; code: number }>
  | Variant<'Pending', { estimatedTime: number }>
  | Variant<'Refunded', { originalId: string; refundAmount: number }>

function describePayment(result: PaymentResult): string {
  return matchVariant(result).with({
    Approved: (v) => `Payment approved: $${v.data.amount} (tx: ${v.data.transactionId})`,
    Declined: (v) => `Payment declined: ${v.data.reason} (code: ${v.data.code})`,
    Pending: (v) => `Payment pending, estimated: ${v.data.estimatedTime}s`,
    Refunded: (v) => `Refunded $${v.data.refundAmount} (original: ${v.data.originalId})`,
  })
}

export function Task4_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== RemoteData variant type ===')
    const states: RemoteData<string, number[]>[] = [
      NotAsked(),
      Loading(),
      Failure('Network timeout after 5000ms'),
      Success([1, 2, 3, 4, 5]),
    ]
    for (const state of states) {
      const rendered = renderRemoteData(
        state,
        (nums) => `[${nums.join(', ')}]`,
        (e) => e
      )
      log.push(`  ${rendered}`)
    }

    log.push('')
    log.push('=== PaymentResult variant type ===')
    const payments: PaymentResult[] = [
      variant('Approved', { transactionId: 'tx-001', amount: 99.99 }),
      variant('Declined', { reason: 'Insufficient funds', code: 402 }),
      variant('Pending', { estimatedTime: 30 }),
      variant('Refunded', { originalId: 'tx-001', refundAmount: 99.99 }),
    ]
    for (const payment of payments) {
      log.push(`  ${describePayment(payment)}`)
    }

    log.push('')
    log.push('=== Типобезопасность конструкторов ===')
    log.push('  variant("Success", data) — data типизирован')
    log.push('  variant("NotAsked") — data отсутствует')
    log.push('  Попытка variant("Success") без data → ошибка компиляции')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Variant Types</h2>
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
// Задание 4.3: Pattern Extraction — Решение
// ============================================

type ExtractTag<T extends { _tag: string }, Tag extends T['_tag']> = Extract<T, { _tag: Tag }>

type ExtractData<T extends { _tag: string }, Tag extends T['_tag']> =
  ExtractTag<T, Tag> extends { data: infer D } ? D : undefined

type PatternMatcher<T extends { _tag: string }> = {
  extract<Tag extends T['_tag']>(
    tag: Tag,
    value: T
  ): ExtractData<T, Tag> | null
  is<Tag extends T['_tag']>(tag: Tag, value: T): value is ExtractTag<T, Tag>
  map<Tag extends T['_tag'], R>(
    tag: Tag,
    value: T,
    fn: (data: ExtractData<T, Tag>) => R
  ): R | null
  fold<R>(
    value: T,
    handlers: { [K in T['_tag']]: (data: ExtractData<T, K>) => R }
  ): R
}

function createMatcher<T extends { _tag: string }>(): PatternMatcher<T> {
  return {
    extract<Tag extends T['_tag']>(tag: Tag, value: T) {
      if (value._tag === tag) {
        return ('data' in value ? value.data : undefined) as ExtractData<T, Tag>
      }
      return null
    },

    is<Tag extends T['_tag']>(tag: Tag, value: T): value is ExtractTag<T, Tag> {
      return value._tag === tag
    },

    map<Tag extends T['_tag'], R>(
      tag: Tag,
      value: T,
      fn: (data: ExtractData<T, Tag>) => R
    ): R | null {
      if (value._tag === tag) {
        const data = ('data' in value ? value.data : undefined) as ExtractData<T, Tag>
        return fn(data)
      }
      return null
    },

    fold<R>(
      value: T,
      handlers: { [K in T['_tag']]: (data: ExtractData<T, K>) => R }
    ): R {
      const tag = value._tag as T['_tag']
      const handler = (handlers as Record<string, (data: unknown) => R>)[tag]
      const data = 'data' in value ? value.data : undefined
      return handler(data)
    },
  }
}

type ApiResponse =
  | Variant<'Ok', { items: string[]; total: number }>
  | Variant<'NotFound'>
  | Variant<'Unauthorized', { reason: string }>
  | Variant<'RateLimit', { retryAfter: number }>

export function Task4_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const matcher = createMatcher<ApiResponse>()

    const responses: ApiResponse[] = [
      variant('Ok', { items: ['user-1', 'user-2', 'user-3'], total: 100 }),
      variant('NotFound'),
      variant('Unauthorized', { reason: 'Token expired' }),
      variant('RateLimit', { retryAfter: 60 }),
    ]

    log.push('=== Pattern Extraction: extract() ===')
    for (const resp of responses) {
      const okData = matcher.extract('Ok', resp)
      if (okData !== null) {
        log.push(`  Extracted Ok data: ${okData.items.length} items, total=${okData.total}`)
      }
      const rateLimitData = matcher.extract('RateLimit', resp)
      if (rateLimitData !== null) {
        log.push(`  Extracted RateLimit data: retryAfter=${rateLimitData.retryAfter}s`)
      }
    }

    log.push('')
    log.push('=== Pattern Extraction: is() type guard ===')
    for (const resp of responses) {
      if (matcher.is('Ok', resp)) {
        log.push(`  is(Ok): items=[${resp.data.items.join(', ')}]`)
      }
      if (matcher.is('Unauthorized', resp)) {
        log.push(`  is(Unauthorized): reason="${resp.data.reason}"`)
      }
      if (matcher.is('NotFound', resp)) {
        log.push(`  is(NotFound): no associated data`)
      }
    }

    log.push('')
    log.push('=== Pattern Extraction: map() ===')
    for (const resp of responses) {
      const itemCount = matcher.map('Ok', resp, (data) => `Found ${data.items.length} of ${data.total}`)
      if (itemCount !== null) {
        log.push(`  map(Ok): ${itemCount}`)
      }
      const retryMsg = matcher.map('RateLimit', resp, (data) => `Retry in ${data.retryAfter}s`)
      if (retryMsg !== null) {
        log.push(`  map(RateLimit): ${retryMsg}`)
      }
    }

    log.push('')
    log.push('=== Pattern Extraction: fold() — exhaustive ===')
    for (const resp of responses) {
      const message = matcher.fold(resp, {
        Ok: (data) => `200: ${data.items.length} items loaded`,
        NotFound: () => '404: Resource not found',
        Unauthorized: (data) => `401: ${data.reason}`,
        RateLimit: (data) => `429: Retry after ${data.retryAfter}s`,
      })
      log.push(`  ${message}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Pattern Extraction</h2>
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
