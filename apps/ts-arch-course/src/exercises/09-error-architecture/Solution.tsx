import { useState } from 'react'

// ============================================
// Задание 9.1: Error Hierarchy — Решение
// ============================================

interface BaseAppError {
  readonly _tag: string
  readonly message: string
  readonly timestamp: number
}

interface ValidationError extends BaseAppError {
  readonly _tag: 'ValidationError'
  readonly field: string
  readonly rule: string
}

interface NetworkError extends BaseAppError {
  readonly _tag: 'NetworkError'
  readonly url: string
  readonly statusCode: number
}

interface NotFoundError extends BaseAppError {
  readonly _tag: 'NotFoundError'
  readonly resource: string
  readonly id: string
}

interface AuthorizationError extends BaseAppError {
  readonly _tag: 'AuthorizationError'
  readonly requiredRole: string
  readonly currentRole: string
}

interface RateLimitError extends BaseAppError {
  readonly _tag: 'RateLimitError'
  readonly retryAfterMs: number
}

type AppError =
  | ValidationError
  | NetworkError
  | NotFoundError
  | AuthorizationError
  | RateLimitError

function createError<T extends AppError>(error: Omit<T, 'timestamp'>): T {
  return { ...error, timestamp: Date.now() } as T
}

function formatError(error: AppError): string {
  switch (error._tag) {
    case 'ValidationError':
      return `Validation failed: field "${error.field}" violated rule "${error.rule}"`
    case 'NetworkError':
      return `Network error: ${error.statusCode} for ${error.url}`
    case 'NotFoundError':
      return `Not found: ${error.resource} with id "${error.id}"`
    case 'AuthorizationError':
      return `Unauthorized: need "${error.requiredRole}", have "${error.currentRole}"`
    case 'RateLimitError':
      return `Rate limited: retry after ${error.retryAfterMs}ms`
  }
}

function isRetryable(error: AppError): boolean {
  switch (error._tag) {
    case 'NetworkError':
      return error.statusCode >= 500
    case 'RateLimitError':
      return true
    default:
      return false
  }
}

export function Task9_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Error Hierarchy ===')
    log.push('')

    const errors: AppError[] = [
      createError<ValidationError>({
        _tag: 'ValidationError',
        message: 'Invalid email format',
        field: 'email',
        rule: 'email-format',
      }),
      createError<NetworkError>({
        _tag: 'NetworkError',
        message: 'Server unavailable',
        url: '/api/users',
        statusCode: 503,
      }),
      createError<NotFoundError>({
        _tag: 'NotFoundError',
        message: 'User not found',
        resource: 'User',
        id: 'usr-42',
      }),
      createError<AuthorizationError>({
        _tag: 'AuthorizationError',
        message: 'Insufficient permissions',
        requiredRole: 'admin',
        currentRole: 'viewer',
      }),
      createError<RateLimitError>({
        _tag: 'RateLimitError',
        message: 'Too many requests',
        retryAfterMs: 5000,
      }),
    ]

    log.push('Error formatting (exhaustive switch):')
    errors.forEach((err) => {
      log.push(`  [${err._tag}] ${formatError(err)}`)
    })
    log.push('')

    log.push('Retryable errors:')
    errors.forEach((err) => {
      log.push(`  ${err._tag}: retryable = ${isRetryable(err)}`)
    })
    log.push('')

    log.push('Discriminated union narrows type:')
    const error = errors[1]
    if (error._tag === 'NetworkError') {
      log.push(`  error.statusCode: ${error.statusCode} (only on NetworkError)`)
      log.push(`  error.url: "${error.url}" (only on NetworkError)`)
    }
    log.push('')

    log.push('Type safety:')
    log.push('  error.statusCode  // Error before narrowing')
    log.push('  switch covers all _tag values (exhaustive check)')
    log.push('  createError<ValidationError>({ _tag: "NetworkError" }) // Error!')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.1: Error Hierarchy</h2>
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
// Задание 9.2: Error Boundaries — Решение
// ============================================

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

interface BoundaryConfig<E> {
  name: string
  catch: (error: unknown) => E
  onError?: (error: E) => void
}

function createBoundary<E>(config: BoundaryConfig<E>) {
  return {
    run<T>(fn: () => T): Result<T, E> {
      try {
        return ok(fn())
      } catch (error) {
        const mapped = config.catch(error)
        if (config.onError) config.onError(mapped)
        return err(mapped)
      }
    },
    async runAsync<T>(fn: () => Promise<T>): Promise<Result<T, E>> {
      try {
        return ok(await fn())
      } catch (error) {
        const mapped = config.catch(error)
        if (config.onError) config.onError(mapped)
        return err(mapped)
      }
    },
  }
}

interface DomainError {
  code: string
  message: string
  details?: Record<string, unknown>
}

const domainBoundary = createBoundary<DomainError>({
  name: 'domain',
  catch: (error) => {
    if (error instanceof Error) {
      return { code: 'DOMAIN_ERROR', message: error.message }
    }
    return { code: 'UNKNOWN', message: String(error) }
  },
})

interface InfraError {
  service: string
  operation: string
  cause: string
}

const infraBoundary = createBoundary<InfraError>({
  name: 'infrastructure',
  catch: (error) => ({
    service: 'database',
    operation: 'query',
    cause: error instanceof Error ? error.message : String(error),
  }),
})

export function Task9_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Error Boundaries ===')
    log.push('')

    // Domain boundary - success
    const result1 = domainBoundary.run(() => {
      return { id: 1, name: 'Alice' }
    })
    log.push('Domain boundary (success):')
    if (result1.ok) {
      log.push(`  ok: true, value: ${JSON.stringify(result1.value)}`)
    }
    log.push('')

    // Domain boundary - error
    const result2 = domainBoundary.run(() => {
      throw new Error('User email already exists')
    })
    log.push('Domain boundary (error):')
    if (!result2.ok) {
      log.push(`  ok: false, error.code: "${result2.error.code}"`)
      log.push(`  error.message: "${result2.error.message}"`)
    }
    log.push('')

    // Infra boundary - error
    const result3 = infraBoundary.run(() => {
      throw new Error('Connection refused')
    })
    log.push('Infra boundary (error):')
    if (!result3.ok) {
      log.push(`  ok: false`)
      log.push(`  service: "${result3.error.service}"`)
      log.push(`  operation: "${result3.error.operation}"`)
      log.push(`  cause: "${result3.error.cause}"`)
    }
    log.push('')

    // Boundaries isolate error types
    log.push('Error isolation:')
    log.push('  Domain boundary catches -> DomainError { code, message }')
    log.push('  Infra boundary catches  -> InfraError { service, operation, cause }')
    log.push('  Each boundary maps unknown -> its own error type')
    log.push('')

    log.push('Type safety:')
    log.push('  if (!result.ok) result.error.code    // DomainError')
    log.push('  if (!result.ok) result.error.service  // InfraError')
    log.push('  Errors from different boundaries have different types')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.2: Error Boundaries</h2>
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
// Задание 9.3: Error Propagation — Решение
// ============================================

type ResultChain<T, E> = {
  ok: true
  value: T
  map<U>(fn: (value: T) => U): ResultChain<U, E>
  flatMap<U, E2>(fn: (value: T) => ResultChain<U, E2>): ResultChain<U, E | E2>
  mapError<E2>(fn: (error: E) => E2): ResultChain<T, E2>
  unwrapOr(fallback: T): T
  match<U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U
} | {
  ok: false
  error: E
  map<U>(fn: (value: T) => U): ResultChain<U, E>
  flatMap<U, E2>(fn: (value: T) => ResultChain<U, E2>): ResultChain<U, E | E2>
  mapError<E2>(fn: (error: E) => E2): ResultChain<T, E2>
  unwrapOr(fallback: T): T
  match<U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U
}

function okChain<T>(value: T): ResultChain<T, never> {
  return {
    ok: true as const,
    value,
    map<U>(fn: (v: T) => U): ResultChain<U, never> {
      return okChain(fn(value))
    },
    flatMap<U, E2>(fn: (v: T) => ResultChain<U, E2>): ResultChain<U, E2> {
      return fn(value) as ResultChain<U, E2>
    },
    mapError<E2>(_fn: (e: never) => E2): ResultChain<T, E2> {
      return this as unknown as ResultChain<T, E2>
    },
    unwrapOr(_fallback: T): T {
      return value
    },
    match<U>(handlers: { ok: (v: T) => U; err: (e: never) => U }): U {
      return handlers.ok(value)
    },
  }
}

function errChain<E>(error: E): ResultChain<never, E> {
  return {
    ok: false as const,
    error,
    map<U>(_fn: (v: never) => U): ResultChain<U, E> {
      return this as unknown as ResultChain<U, E>
    },
    flatMap<U, E2>(_fn: (v: never) => ResultChain<U, E2>): ResultChain<U, E | E2> {
      return this as unknown as ResultChain<U, E | E2>
    },
    mapError<E2>(fn: (e: E) => E2): ResultChain<never, E2> {
      return errChain(fn(error))
    },
    unwrapOr<T>(fallback: T): T {
      return fallback
    },
    match<U>(handlers: { ok: (v: never) => U; err: (e: E) => U }): U {
      return handlers.err(error)
    },
  }
}

interface ParseError { _tag: 'ParseError'; input: string }
interface ValidationErr { _tag: 'ValidationError'; field: string; reason: string }
interface SaveError { _tag: 'SaveError'; entity: string }

function parseEmail(input: string): ResultChain<string, ParseError> {
  if (input.includes('@')) return okChain(input.trim().toLowerCase())
  return errChain({ _tag: 'ParseError' as const, input })
}

function validateEmail(email: string): ResultChain<string, ValidationErr> {
  if (email.endsWith('.com') || email.endsWith('.org')) return okChain(email)
  return errChain({ _tag: 'ValidationError' as const, field: 'email', reason: 'Invalid domain' })
}

function saveUser(email: string): ResultChain<{ id: number; email: string }, SaveError> {
  if (email === 'taken@example.com') {
    return errChain({ _tag: 'SaveError' as const, entity: 'User' })
  }
  return okChain({ id: Math.floor(Math.random() * 1000), email })
}

export function Task9_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Error Propagation ===')
    log.push('')

    // Success chain
    const result1 = parseEmail('Alice@Example.COM')
      .flatMap(validateEmail)
      .flatMap(saveUser)
      .map((user) => `User #${user.id} created with ${user.email}`)

    log.push('Success chain: parseEmail -> validateEmail -> saveUser')
    result1.match({
      ok: (msg) => log.push(`  Result: ${msg}`),
      err: (e) => log.push(`  Error: ${JSON.stringify(e)}`),
    })
    log.push('')

    // Fails at parse
    const result2 = parseEmail('invalid-email')
      .flatMap(validateEmail)
      .flatMap(saveUser)

    log.push('Fails at parse (no @):')
    result2.match({
      ok: (user) => log.push(`  User: ${JSON.stringify(user)}`),
      err: (e) => log.push(`  Error: [${e._tag}] input="${(e as ParseError).input}"`),
    })
    log.push('')

    // Fails at validation
    const result3 = parseEmail('user@example.xyz')
      .flatMap(validateEmail)
      .flatMap(saveUser)

    log.push('Fails at validation (bad domain):')
    result3.match({
      ok: (user) => log.push(`  User: ${JSON.stringify(user)}`),
      err: (e) => log.push(`  Error: [${e._tag}] ${(e as ValidationErr).reason || ''}`),
    })
    log.push('')

    // mapError to normalize
    const result4 = parseEmail('test@good.com')
      .flatMap(validateEmail)
      .flatMap(saveUser)
      .mapError((e) => ({ code: e._tag, message: `Failed: ${e._tag}` }))

    log.push('mapError to normalize error type:')
    result4.match({
      ok: (user) => log.push(`  User: ${JSON.stringify(user)}`),
      err: (e) => log.push(`  Normalized error: ${JSON.stringify(e)}`),
    })
    log.push('')

    // unwrapOr fallback
    const name = parseEmail('bad')
      .map((email) => email.split('@')[0])
      .unwrapOr('anonymous')

    log.push(`unwrapOr fallback: "${name}"`)
    log.push('')

    log.push('Error types accumulate through flatMap:')
    log.push('  parseEmail      -> ResultChain<string, ParseError>')
    log.push('  .flatMap(valid) -> ResultChain<string, ParseError | ValidationErr>')
    log.push('  .flatMap(save)  -> ResultChain<User, ParseError | ValidationErr | SaveError>')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.3: Error Propagation</h2>
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
// Задание 9.4: Recovery Strategies — Решение
// ============================================

interface RetryConfig {
  maxAttempts: number
  delayMs: number
  backoffMultiplier?: number
}

interface CircuitBreakerConfig {
  failureThreshold: number
  resetTimeMs: number
}

type RecoveryStrategy<T, E> =
  | { type: 'retry'; config: RetryConfig; operation: () => Result<T, E> }
  | { type: 'fallback'; primary: () => Result<T, E>; fallback: () => Result<T, E> }
  | { type: 'circuit-breaker'; config: CircuitBreakerConfig; operation: () => Result<T, E> }

function retry<T, E>(
  operation: () => Result<T, E>,
  config: RetryConfig
): Result<T, E & { attempts: number }> {
  let lastError: E | undefined
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    const result = operation()
    if (result.ok) return result as Result<T, E & { attempts: number }>
    lastError = result.error
  }
  return err({ ...lastError!, attempts: config.maxAttempts } as E & { attempts: number })
}

function withFallback<T, E1, E2>(
  primary: () => Result<T, E1>,
  fallback: () => Result<T, E2>
): Result<T, { primary: E1; fallback: E2 }> {
  const result = primary()
  if (result.ok) return result as Result<T, { primary: E1; fallback: E2 }>
  const fallbackResult = fallback()
  if (fallbackResult.ok) return fallbackResult as Result<T, { primary: E1; fallback: E2 }>
  return err({ primary: result.error, fallback: fallbackResult.error })
}

interface CircuitBreakerState {
  failures: number
  state: 'closed' | 'open' | 'half-open'
  lastFailureTime: number
}

function createCircuitBreaker<T, E>(config: CircuitBreakerConfig) {
  const state: CircuitBreakerState = {
    failures: 0,
    state: 'closed',
    lastFailureTime: 0,
  }

  return {
    execute(operation: () => Result<T, E>): Result<T, E | { circuitOpen: true; resetIn: number }> {
      if (state.state === 'open') {
        const elapsed = Date.now() - state.lastFailureTime
        if (elapsed < config.resetTimeMs) {
          return err({ circuitOpen: true as const, resetIn: config.resetTimeMs - elapsed })
        }
        state.state = 'half-open'
      }

      const result = operation()
      if (result.ok) {
        state.failures = 0
        state.state = 'closed'
        return result
      }

      state.failures++
      state.lastFailureTime = Date.now()
      if (state.failures >= config.failureThreshold) {
        state.state = 'open'
      }
      return result
    },
    getState(): CircuitBreakerState {
      return { ...state }
    },
  }
}

export function Task9_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Recovery Strategies ===')
    log.push('')

    // Retry
    let attempt = 0
    const retryResult = retry(
      () => {
        attempt++
        if (attempt < 3) return err({ code: 'TIMEOUT', attempt })
        return ok({ data: 'success after retries' })
      },
      { maxAttempts: 5, delayMs: 100 }
    )
    log.push('Retry strategy (succeeds on attempt 3):')
    if (retryResult.ok) {
      log.push(`  Result: ${JSON.stringify(retryResult.value)}`)
      log.push(`  Attempts used: ${attempt}`)
    }
    log.push('')

    // Retry failure
    const retryFail = retry(
      () => err({ code: 'TIMEOUT' as const }),
      { maxAttempts: 3, delayMs: 100 }
    )
    log.push('Retry strategy (all attempts fail):')
    if (!retryFail.ok) {
      log.push(`  Error: code="${retryFail.error.code}", attempts=${retryFail.error.attempts}`)
    }
    log.push('')

    // Fallback
    const fallbackResult = withFallback(
      () => err({ source: 'primary-db' as const, reason: 'Connection refused' }),
      () => ok({ id: 1, name: 'Alice', source: 'cache' as const })
    )
    log.push('Fallback strategy (primary fails, fallback succeeds):')
    if (fallbackResult.ok) {
      log.push(`  Result: ${JSON.stringify(fallbackResult.value)}`)
    }
    log.push('')

    // Both fail
    const bothFail = withFallback(
      () => err({ source: 'primary' as const }),
      () => err({ source: 'fallback' as const })
    )
    log.push('Fallback strategy (both fail):')
    if (!bothFail.ok) {
      log.push(`  primary error: ${JSON.stringify(bothFail.error.primary)}`)
      log.push(`  fallback error: ${JSON.stringify(bothFail.error.fallback)}`)
    }
    log.push('')

    // Circuit breaker
    const breaker = createCircuitBreaker<string, { code: string }>({
      failureThreshold: 3,
      resetTimeMs: 5000,
    })

    log.push('Circuit breaker (threshold: 3 failures):')
    for (let i = 0; i < 5; i++) {
      const r = breaker.execute(() => err({ code: 'SERVICE_DOWN' }))
      const state = breaker.getState()
      if (!r.ok && 'circuitOpen' in r.error) {
        log.push(`  Call ${i + 1}: CIRCUIT OPEN (resetIn: ${r.error.resetIn}ms)`)
      } else {
        log.push(`  Call ${i + 1}: ${r.ok ? 'OK' : `FAIL (failures: ${state.failures}, state: ${state.state})`}`)
      }
    }
    log.push('')

    // Recovery strategy type info
    void (undefined as unknown as RecoveryStrategy<string, Error>)
    log.push('Type safety:')
    log.push('  retry() returns Result<T, E & { attempts: number }>')
    log.push('  withFallback() returns Result<T, { primary: E1; fallback: E2 }>')
    log.push('  circuitBreaker returns Result<T, E | { circuitOpen: true }>')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.4: Recovery Strategies</h2>
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
