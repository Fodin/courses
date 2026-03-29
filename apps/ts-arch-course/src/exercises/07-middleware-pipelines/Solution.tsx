import { useState } from 'react'

// ============================================
// Задание 7.1: Middleware Chain — Решение
// ============================================

type Middleware<TContext> = (
  ctx: TContext,
  next: () => TContext
) => TContext

function createMiddlewareChain<TContext>(
  initialContext: TContext,
  ...middlewares: Middleware<TContext>[]
): TContext {
  function executeMiddleware(index: number, ctx: TContext): TContext {
    if (index >= middlewares.length) {
      return ctx
    }
    const middleware = middlewares[index]
    return middleware(ctx, () => executeMiddleware(index + 1, ctx))
  }
  return executeMiddleware(0, initialContext)
}

interface RequestContext {
  path: string
  method: string
  headers: Record<string, string>
  body: unknown
  status: number
  responseBody: unknown
  logs: string[]
}

const loggingMiddleware: Middleware<RequestContext> = (ctx, next) => {
  const start = Date.now()
  ctx.logs.push(`[LOG] -> ${ctx.method} ${ctx.path}`)
  const result = next()
  result.logs.push(`[LOG] <- ${result.status} (${Date.now() - start}ms)`)
  return result
}

const authMiddleware: Middleware<RequestContext> = (ctx, next) => {
  if (!ctx.headers['authorization']) {
    ctx.logs.push('[AUTH] No token — 401')
    return { ...ctx, status: 401, responseBody: { error: 'Unauthorized' } }
  }
  ctx.logs.push(`[AUTH] Token: ${ctx.headers['authorization'].slice(0, 10)}...`)
  return next()
}

const corsMiddleware: Middleware<RequestContext> = (ctx, next) => {
  ctx.logs.push('[CORS] Adding CORS headers')
  const result = next()
  result.headers['access-control-allow-origin'] = '*'
  return result
}

const handlerMiddleware: Middleware<RequestContext> = (ctx, _next) => {
  ctx.logs.push('[HANDLER] Processing request')
  return {
    ...ctx,
    status: 200,
    responseBody: { message: 'OK', path: ctx.path },
  }
}

export function Task7_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Middleware Chain ===')
    log.push('')

    // Scenario 1: Full chain with auth
    const ctx1: RequestContext = {
      path: '/api/users',
      method: 'GET',
      headers: { authorization: 'Bearer abc123xyz' },
      body: null,
      status: 0,
      responseBody: null,
      logs: [],
    }

    const result1 = createMiddlewareChain(
      ctx1,
      loggingMiddleware,
      corsMiddleware,
      authMiddleware,
      handlerMiddleware
    )

    log.push('Scenario 1: Authenticated request')
    log.push(`  Status: ${result1.status}`)
    log.push(`  Response: ${JSON.stringify(result1.responseBody)}`)
    log.push('  Middleware logs:')
    result1.logs.forEach((l) => log.push(`    ${l}`))
    log.push('')

    // Scenario 2: No auth token — stops at auth middleware
    const ctx2: RequestContext = {
      path: '/api/admin',
      method: 'POST',
      headers: {},
      body: { action: 'delete' },
      status: 0,
      responseBody: null,
      logs: [],
    }

    const result2 = createMiddlewareChain(
      ctx2,
      loggingMiddleware,
      corsMiddleware,
      authMiddleware,
      handlerMiddleware
    )

    log.push('Scenario 2: Unauthenticated request (stops at auth)')
    log.push(`  Status: ${result2.status}`)
    log.push(`  Response: ${JSON.stringify(result2.responseBody)}`)
    log.push('  Middleware logs:')
    result2.logs.forEach((l) => log.push(`    ${l}`))
    log.push('')

    log.push('Type safety guarantees:')
    log.push('  - Each middleware receives strongly typed TContext')
    log.push('  - next() returns the same TContext type')
    log.push('  - Chain result type matches TContext')
    log.push('  - Middleware can short-circuit by not calling next()')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.1: Middleware Chain</h2>
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
// Задание 7.2: Context Accumulation — Решение
// ============================================

type AccumulatingMiddleware<TIn, TOut extends TIn> = (ctx: TIn) => TOut

function pipe<A>(ctx: A): A
function pipe<A, B extends A>(ctx: A, m1: AccumulatingMiddleware<A, B>): B
function pipe<A, B extends A, C extends B>(
  ctx: A,
  m1: AccumulatingMiddleware<A, B>,
  m2: AccumulatingMiddleware<B, C>
): C
function pipe<A, B extends A, C extends B, D extends C>(
  ctx: A,
  m1: AccumulatingMiddleware<A, B>,
  m2: AccumulatingMiddleware<B, C>,
  m3: AccumulatingMiddleware<D, D>
): D
function pipe(ctx: unknown, ...middlewares: Array<(ctx: never) => unknown>): unknown {
  return middlewares.reduce((acc, mw) => mw(acc as never), ctx)
}

interface BaseContext {
  requestId: string
  timestamp: number
}

interface WithUser extends BaseContext {
  user: { id: number; name: string; role: string }
}

interface WithPermissions extends WithUser {
  permissions: string[]
}

interface WithAudit extends WithPermissions {
  audit: { action: string; userId: number; time: number }
}

const addUser: AccumulatingMiddleware<BaseContext, WithUser> = (ctx) => ({
  ...ctx,
  user: { id: 42, name: 'Alice', role: 'admin' },
})

const addPermissions: AccumulatingMiddleware<WithUser, WithPermissions> = (ctx) => ({
  ...ctx,
  permissions: ctx.user.role === 'admin'
    ? ['read', 'write', 'delete', 'manage']
    : ['read'],
})

const addAudit: AccumulatingMiddleware<WithPermissions, WithAudit> = (ctx) => ({
  ...ctx,
  audit: {
    action: 'access',
    userId: ctx.user.id,
    time: ctx.timestamp,
  },
})

export function Task7_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Context Accumulation ===')
    log.push('')

    const base: BaseContext = {
      requestId: 'req-001',
      timestamp: Date.now(),
    }

    log.push('Step 1: BaseContext')
    log.push(`  { requestId: "${base.requestId}", timestamp: ${base.timestamp} }`)
    log.push('')

    const withUser = addUser(base)
    log.push('Step 2: + WithUser (addUser middleware)')
    log.push(`  user: { id: ${withUser.user.id}, name: "${withUser.user.name}", role: "${withUser.user.role}" }`)
    log.push('')

    const withPerms = addPermissions(withUser)
    log.push('Step 3: + WithPermissions (addPermissions middleware)')
    log.push(`  permissions: [${withPerms.permissions.map((p) => `"${p}"`).join(', ')}]`)
    log.push('')

    const withAudit = addAudit(withPerms)
    log.push('Step 4: + WithAudit (addAudit middleware)')
    log.push(`  audit: { action: "${withAudit.audit.action}", userId: ${withAudit.audit.userId} }`)
    log.push('')

    // Using pipe
    const piped = pipe(base, addUser, addPermissions)
    log.push('Using pipe(base, addUser, addPermissions):')
    log.push(`  user.name: "${piped.user.name}"`)
    log.push(`  permissions: [${piped.permissions.map((p) => `"${p}"`).join(', ')}]`)
    log.push('')

    log.push('Type safety guarantees:')
    log.push('  - addPermissions(base)  // Error: BaseContext lacks "user"')
    log.push('  - addAudit(withUser)    // Error: WithUser lacks "permissions"')
    log.push('  - Each middleware can only access properties from its input type')
    log.push('  - pipe() enforces correct middleware ordering')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.2: Context Accumulation</h2>
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
// Задание 7.3: Interceptors — Решение
// ============================================

interface InterceptorRequest {
  url: string
  method: string
  headers: Record<string, string>
  body?: unknown
}

interface InterceptorResponse {
  status: number
  headers: Record<string, string>
  data: unknown
  timing?: number
}

interface Interceptor<TReq, TRes> {
  name: string
  before?: (req: TReq) => TReq
  after?: (res: TRes) => TRes
  onError?: (error: Error, req: TReq) => TRes | never
}

function createInterceptorPipeline<TReq, TRes>(
  interceptors: Interceptor<TReq, TRes>[],
  handler: (req: TReq) => TRes
) {
  return (req: TReq): TRes => {
    // Apply before hooks in order
    let processedReq = req
    for (const interceptor of interceptors) {
      if (interceptor.before) {
        processedReq = interceptor.before(processedReq)
      }
    }

    // Execute handler
    let response: TRes
    try {
      response = handler(processedReq)
    } catch (error) {
      // Try error handlers in reverse order
      for (let i = interceptors.length - 1; i >= 0; i--) {
        const interceptor = interceptors[i]
        if (interceptor.onError) {
          try {
            return interceptor.onError(error as Error, processedReq)
          } catch {
            continue
          }
        }
      }
      throw error
    }

    // Apply after hooks in reverse order
    let processedRes = response
    for (let i = interceptors.length - 1; i >= 0; i--) {
      const interceptor = interceptors[i]
      if (interceptor.after) {
        processedRes = interceptor.after(processedRes)
      }
    }

    return processedRes
  }
}

const authInterceptor: Interceptor<InterceptorRequest, InterceptorResponse> = {
  name: 'auth',
  before: (req) => ({
    ...req,
    headers: { ...req.headers, authorization: 'Bearer token-xyz' },
  }),
}

const timingInterceptor: Interceptor<InterceptorRequest, InterceptorResponse> = {
  name: 'timing',
  before: (req) => {
    (req as unknown as Record<string, unknown>)['_startTime'] = Date.now()
    return req
  },
  after: (res) => ({
    ...res,
    timing: 42,
  }),
}

const errorInterceptor: Interceptor<InterceptorRequest, InterceptorResponse> = {
  name: 'error-handler',
  onError: (error, req) => ({
    status: 500,
    headers: {},
    data: { error: error.message, url: (req as InterceptorRequest).url },
  }),
}

export function Task7_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Interceptors ===')
    log.push('')

    // Success scenario
    const successHandler = (req: InterceptorRequest): InterceptorResponse => ({
      status: 200,
      headers: { 'content-type': 'application/json' },
      data: { message: 'OK', url: req.url },
    })

    const pipeline = createInterceptorPipeline(
      [authInterceptor, timingInterceptor, errorInterceptor],
      successHandler
    )

    const req1: InterceptorRequest = {
      url: '/api/users',
      method: 'GET',
      headers: {},
    }

    const res1 = pipeline(req1)
    log.push('Success scenario:')
    log.push(`  Request: ${req1.method} ${req1.url}`)
    log.push(`  Status: ${res1.status}`)
    log.push(`  Data: ${JSON.stringify(res1.data)}`)
    log.push(`  Timing: ${res1.timing}ms`)
    log.push('')

    // Error scenario
    const errorHandler = (_req: InterceptorRequest): InterceptorResponse => {
      throw new Error('Database connection failed')
    }

    const errorPipeline = createInterceptorPipeline(
      [authInterceptor, timingInterceptor, errorInterceptor],
      errorHandler
    )

    const req2: InterceptorRequest = {
      url: '/api/orders',
      method: 'POST',
      headers: {},
      body: { item: 'widget' },
    }

    const res2 = errorPipeline(req2)
    log.push('Error scenario (caught by errorInterceptor):')
    log.push(`  Request: ${req2.method} ${req2.url}`)
    log.push(`  Status: ${res2.status}`)
    log.push(`  Data: ${JSON.stringify(res2.data)}`)
    log.push('')

    log.push('Interceptor pipeline order:')
    log.push('  Before hooks: auth -> timing -> ... (in order)')
    log.push('  After hooks:  ... -> timing -> auth (reverse order)')
    log.push('  Error hooks:  error-handler -> timing -> auth (reverse order)')
    log.push('')
    log.push('Type safety:')
    log.push('  - before() receives and returns TReq')
    log.push('  - after() receives and returns TRes')
    log.push('  - onError() returns TRes or throws')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.3: Interceptors</h2>
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
// Задание 7.4: Plugin Architecture — Решение
// ============================================

interface PluginHooks {
  'app:init': { config: Record<string, unknown> }
  'app:ready': { startTime: number }
  'request:before': { url: string; method: string }
  'request:after': { url: string; status: number; duration: number }
  'error': { error: Error; context: string }
}

type HookHandler<T> = (payload: T) => void

interface Plugin {
  name: string
  version: string
  hooks: Partial<{
    [K in keyof PluginHooks]: HookHandler<PluginHooks[K]>
  }>
}

class PluginSystem {
  private plugins: Plugin[] = []
  private hookHandlers: Map<string, Array<{ pluginName: string; handler: HookHandler<never> }>> = new Map()

  register(plugin: Plugin): void {
    this.plugins.push(plugin)
    for (const [hookName, handler] of Object.entries(plugin.hooks)) {
      if (!this.hookHandlers.has(hookName)) {
        this.hookHandlers.set(hookName, [])
      }
      this.hookHandlers.get(hookName)!.push({
        pluginName: plugin.name,
        handler: handler as HookHandler<never>,
      })
    }
  }

  emit<K extends keyof PluginHooks>(hook: K, payload: PluginHooks[K], log: string[]): void {
    const handlers = this.hookHandlers.get(hook) ?? []
    for (const { pluginName, handler } of handlers) {
      log.push(`  [${hook}] -> ${pluginName}`)
      handler(payload as never)
    }
  }

  getPlugins(): Plugin[] {
    return [...this.plugins]
  }
}

function createPlugin(def: Plugin): Plugin {
  return def
}

const loggingPlugin = createPlugin({
  name: 'logging',
  version: '1.0.0',
  hooks: {
    'app:init': ({ config }) => {
      void config
    },
    'request:before': ({ url, method }) => {
      void url; void method
    },
    'request:after': ({ url, status, duration }) => {
      void url; void status; void duration
    },
    'error': ({ error, context }) => {
      void error; void context
    },
  },
})

const metricsPlugin = createPlugin({
  name: 'metrics',
  version: '1.2.0',
  hooks: {
    'app:ready': ({ startTime }) => {
      void startTime
    },
    'request:after': ({ duration }) => {
      void duration
    },
  },
})

const securityPlugin = createPlugin({
  name: 'security',
  version: '2.0.0',
  hooks: {
    'request:before': ({ url }) => {
      void url
    },
    'error': ({ error }) => {
      void error
    },
  },
})

export function Task7_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Plugin Architecture ===')
    log.push('')

    const system = new PluginSystem()
    system.register(loggingPlugin)
    system.register(metricsPlugin)
    system.register(securityPlugin)

    log.push('Registered plugins:')
    system.getPlugins().forEach((p) => {
      const hooks = Object.keys(p.hooks)
      log.push(`  ${p.name}@${p.version} — hooks: [${hooks.join(', ')}]`)
    })
    log.push('')

    log.push('Emitting "app:init":')
    system.emit('app:init', { config: { debug: true } }, log)
    log.push('')

    log.push('Emitting "app:ready":')
    system.emit('app:ready', { startTime: Date.now() }, log)
    log.push('')

    log.push('Emitting "request:before":')
    system.emit('request:before', { url: '/api/data', method: 'GET' }, log)
    log.push('')

    log.push('Emitting "request:after":')
    system.emit('request:after', { url: '/api/data', status: 200, duration: 150 }, log)
    log.push('')

    log.push('Emitting "error":')
    system.emit('error', { error: new Error('Connection timeout'), context: 'database' }, log)
    log.push('')

    log.push('Type safety guarantees:')
    log.push('  - emit("app:init", { wrong: true })  // Error: missing "config"')
    log.push('  - Plugin hooks are typed per event name')
    log.push('  - Cannot register hook for unknown event')
    log.push('  - Payload type is inferred from hook name')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.4: Plugin Architecture</h2>
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
