import { useState } from 'react'

// ============================================
// Задание 4.1: Pipe и Compose — Решение
// ============================================

// Overloads for type-safe pipe
function pipe<A, B>(fn1: (a: A) => B): (a: A) => B
function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C
function pipe<A, B, C, D>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D): (a: A) => D
function pipe<A, B, C, D, E>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D, fn4: (d: D) => E): (a: A) => E
function pipe(...fns: Array<(arg: unknown) => unknown>): (arg: unknown) => unknown {
  return (input: unknown) => fns.reduce((acc, fn) => fn(acc), input)
}

// Overloads for type-safe compose
function compose<A, B>(fn1: (a: A) => B): (a: A) => B
function compose<A, B, C>(fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => C
function compose<A, B, C, D>(fn3: (c: C) => D, fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => D
function compose<A, B, C, D, E>(fn4: (d: D) => E, fn3: (c: C) => D, fn2: (b: B) => C, fn1: (a: A) => B): (a: A) => E
function compose(...fns: Array<(arg: unknown) => unknown>): (arg: unknown) => unknown {
  return (input: unknown) => fns.reduceRight((acc, fn) => fn(acc), input)
}

// Helper functions for demo
function trim(s: string): string {
  return s.trim()
}

function toUpperCase(s: string): string {
  return s.toUpperCase()
}

function addExclamation(s: string): string {
  return s + '!'
}

function getLength(s: string): number {
  return s.length
}

function double(n: number): number {
  return n * 2
}

function toFixed(n: number): string {
  return n.toFixed(0)
}

export function Task4_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('--- Pipe: left-to-right ---')

    const shout = pipe(trim, toUpperCase, addExclamation)
    log.push(`✅ pipe(trim, toUpperCase, addExclamation)("  hello  ") = "${shout('  hello  ')}"`)

    const countDoubled = pipe(trim, getLength, double, toFixed)
    log.push(`✅ pipe(trim, getLength, double, toFixed)("  hi  ") = "${countDoubled('  hi  ')}"`)

    log.push('')
    log.push('--- Compose: right-to-left ---')

    const shoutComposed = compose(addExclamation, toUpperCase, trim)
    log.push(`✅ compose(addExclamation, toUpperCase, trim)("  world  ") = "${shoutComposed('  world  ')}"`)

    const countComposed = compose(toFixed, double, getLength)
    log.push(`✅ compose(toFixed, double, getLength)("test") = "${countComposed('test')}"`)

    log.push('')
    log.push('--- Type safety ---')
    log.push('✅ pipe(trim, getLength) returns (a: string) => number')
    log.push('✅ pipe(getLength, double) returns (a: string) => number')
    log.push('❌ pipe(getLength, trim) — TS error: number is not string')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Pipe и Compose</h2>
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
// Задание 4.2: Middleware — Решение
// ============================================

interface HttpRequest {
  method: string
  url: string
  headers: Record<string, string>
  body?: string
}

interface HttpResponse {
  status: number
  body: string
  headers: Record<string, string>
}

type Middleware = (
  request: HttpRequest,
  next: (req: HttpRequest) => HttpResponse
) => HttpResponse

function createPipeline(
  ...middlewares: Middleware[]
): (req: HttpRequest, handler: (req: HttpRequest) => HttpResponse) => HttpResponse {
  return (req, handler) => {
    const chain = middlewares.reduceRight(
      (next: (r: HttpRequest) => HttpResponse, mw: Middleware) =>
        (r: HttpRequest) => mw(r, next),
      handler
    )
    return chain(req)
  }
}

const loggingMiddleware: Middleware = (req, next) => {
  const start = Date.now()
  const response = next(req)
  const duration = Date.now() - start
  return {
    ...response,
    headers: {
      ...response.headers,
      'X-Log': `${req.method} ${req.url} → ${response.status} (${duration}ms)`,
    },
  }
}

const authMiddleware: Middleware = (req, next) => {
  if (!req.headers['authorization']) {
    return { status: 401, body: 'Unauthorized', headers: {} }
  }
  return next(req)
}

const corsMiddleware: Middleware = (req, next) => {
  const response = next(req)
  return {
    ...response,
    headers: {
      ...response.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    },
  }
}

export function Task4_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    const pipeline = createPipeline(loggingMiddleware, authMiddleware, corsMiddleware)

    const handler = (req: HttpRequest): HttpResponse => ({
      status: 200,
      body: `Hello from ${req.url}`,
      headers: { 'Content-Type': 'text/plain' },
    })

    // Authorized request
    log.push('--- Authorized request ---')
    const authReq: HttpRequest = {
      method: 'GET',
      url: '/api/users',
      headers: { authorization: 'Bearer token-123' },
    }
    const res1 = pipeline(authReq, handler)
    log.push(`✅ Status: ${res1.status}`)
    log.push(`✅ Body: ${res1.body}`)
    log.push(`✅ CORS: ${res1.headers['Access-Control-Allow-Origin']}`)
    log.push(`✅ Log: ${res1.headers['X-Log']}`)

    // Unauthorized request
    log.push('')
    log.push('--- Unauthorized request ---')
    const noAuthReq: HttpRequest = {
      method: 'POST',
      url: '/api/admin',
      headers: {},
    }
    const res2 = pipeline(noAuthReq, handler)
    log.push(`❌ Status: ${res2.status}`)
    log.push(`❌ Body: ${res2.body}`)
    log.push(`✅ Log: ${res2.headers['X-Log']}`)

    log.push('')
    log.push('--- Middleware order ---')
    log.push('✅ logging → auth → cors → handler')
    log.push('✅ Each middleware can short-circuit (like auth returning 401)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Middleware</h2>
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
// Задание 4.3: Plugin System — Решение
// ============================================

interface Plugin<TConfig = unknown> {
  name: string
  config?: TConfig
  onInit?(): string
  onDestroy?(): string
}

class PluginManager {
  private plugins = new Map<string, Plugin>()
  private logs: string[] = []

  install<T>(plugin: Plugin<T>): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already installed`)
    }
    this.plugins.set(plugin.name, plugin)
    const initLog = plugin.onInit?.()
    if (initLog) {
      this.logs.push(initLog)
    }
  }

  uninstall(name: string): void {
    const plugin = this.plugins.get(name)
    if (!plugin) {
      throw new Error(`Plugin "${name}" is not installed`)
    }
    const destroyLog = plugin.onDestroy?.()
    if (destroyLog) {
      this.logs.push(destroyLog)
    }
    this.plugins.delete(name)
  }

  isInstalled(name: string): boolean {
    return this.plugins.has(name)
  }

  getPlugin<T>(name: string): Plugin<T> | undefined {
    return this.plugins.get(name) as Plugin<T> | undefined
  }

  listPlugins(): string[] {
    return Array.from(this.plugins.keys())
  }

  getLogs(): string[] {
    return [...this.logs]
  }
}

interface LoggerPluginConfig {
  level: 'debug' | 'info' | 'warn' | 'error'
  prefix: string
}

const loggerPlugin: Plugin<LoggerPluginConfig> = {
  name: 'logger',
  config: { level: 'info', prefix: '[LOG]' },
  onInit() {
    return `${this.config!.prefix} Logger initialized (level: ${this.config!.level})`
  },
  onDestroy() {
    return `${this.config!.prefix} Logger destroyed`
  },
}

interface AnalyticsPluginConfig {
  trackingId: string
  enabled: boolean
}

const analyticsPlugin: Plugin<AnalyticsPluginConfig> = {
  name: 'analytics',
  config: { trackingId: 'UA-12345', enabled: true },
  onInit() {
    return `[Analytics] Tracking started (ID: ${this.config!.trackingId})`
  },
  onDestroy() {
    return `[Analytics] Tracking stopped`
  },
}

const cachePlugin: Plugin = {
  name: 'cache',
  onInit() {
    return '[Cache] In-memory cache initialized'
  },
  onDestroy() {
    return '[Cache] Cache cleared and destroyed'
  },
}

export function Task4_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const manager = new PluginManager()

    log.push('--- Installing plugins ---')
    manager.install(loggerPlugin)
    manager.install(analyticsPlugin)
    manager.install(cachePlugin)

    for (const entry of manager.getLogs()) {
      log.push(`✅ ${entry}`)
    }

    log.push('')
    log.push('--- Plugin list ---')
    log.push(`✅ Installed: [${manager.listPlugins().join(', ')}]`)

    log.push('')
    log.push('--- Plugin lookup ---')
    const analytics = manager.getPlugin<AnalyticsPluginConfig>('analytics')
    if (analytics?.config) {
      log.push(`✅ analytics.config.trackingId = "${analytics.config.trackingId}"`)
    }
    log.push(`✅ isInstalled("logger") = ${manager.isInstalled('logger')}`)
    log.push(`✅ isInstalled("unknown") = ${manager.isInstalled('unknown')}`)

    log.push('')
    log.push('--- Uninstalling ---')
    manager.uninstall('cache')
    const allLogs = manager.getLogs()
    log.push(`✅ ${allLogs[allLogs.length - 1]}`)
    log.push(`✅ Remaining: [${manager.listPlugins().join(', ')}]`)

    log.push('')
    log.push('--- Duplicate protection ---')
    try {
      manager.install(loggerPlugin)
    } catch (e) {
      if (e instanceof Error) log.push(`❌ ${e.message}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Plugin System</h2>
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
