import { useState } from 'react'

// ============================================
// Задание 3.1: DI Container — Решение
// ============================================

interface ServiceRegistry {
  [key: string]: unknown
}

class Container<TRegistry extends ServiceRegistry = {}> {
  private factories = new Map<string, () => unknown>()
  private instances = new Map<string, unknown>()

  register<K extends string, T>(
    name: K,
    factory: (container: Container<TRegistry>) => T
  ): Container<TRegistry & Record<K, T>> {
    this.factories.set(name, () => factory(this as unknown as Container<TRegistry>))
    return this as unknown as Container<TRegistry & Record<K, T>>
  }

  resolve<K extends keyof TRegistry>(name: K): TRegistry[K] {
    const key = name as string

    if (this.instances.has(key)) {
      return this.instances.get(key) as TRegistry[K]
    }

    const factory = this.factories.get(key)
    if (!factory) {
      throw new Error(`Service "${key}" not registered`)
    }

    const instance = factory()
    this.instances.set(key, instance)
    return instance as TRegistry[K]
  }

  has<K extends string>(name: K): name is K & keyof TRegistry {
    return this.factories.has(name)
  }
}

// Service interfaces
interface Logger {
  log(message: string): string
  warn(message: string): string
}

interface Config {
  apiUrl: string
  timeout: number
  debug: boolean
}

interface HttpClient {
  get(url: string): string
  post(url: string, body: string): string
}

interface UserService {
  getUser(id: number): string
  createUser(name: string): string
}

export function Task3_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== DI Container ===')
    log.push('')

    const container = new Container()
      .register('config', (): Config => ({
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        debug: true,
      }))
      .register('logger', (): Logger => ({
        log: (msg) => `[LOG] ${msg}`,
        warn: (msg) => `[WARN] ${msg}`,
      }))
      .register('httpClient', (c): HttpClient => {
        const config = c.resolve('config')
        const logger = c.resolve('logger')
        return {
          get: (url) => {
            const result = logger.log(`GET ${config.apiUrl}${url} (timeout: ${config.timeout}ms)`)
            return result
          },
          post: (url, body) => {
            const result = logger.log(`POST ${config.apiUrl}${url} body=${body}`)
            return result
          },
        }
      })
      .register('userService', (c): UserService => {
        const http = c.resolve('httpClient')
        return {
          getUser: (id) => http.get(`/users/${id}`),
          createUser: (name) => http.post('/users', JSON.stringify({ name })),
        }
      })

    log.push('Registered services: config, logger, httpClient, userService')
    log.push('')

    // Resolve services
    const config = container.resolve('config')
    log.push('Resolved config:')
    log.push(`  apiUrl: ${config.apiUrl}`)
    log.push(`  timeout: ${config.timeout}`)
    log.push(`  debug: ${config.debug}`)
    log.push('')

    const userService = container.resolve('userService')
    log.push('Using userService (resolves httpClient -> config + logger):')
    log.push(`  ${userService.getUser(42)}`)
    log.push(`  ${userService.createUser('Alice')}`)
    log.push('')

    // Singleton behavior
    const config2 = container.resolve('config')
    log.push(`Singleton check: config === config2? ${config === config2}`)
    log.push('')

    // Has check
    log.push('Service checks:')
    log.push(`  has('config'): ${container.has('config')}`)
    log.push(`  has('unknown'): ${container.has('unknown')}`)
    log.push('')

    log.push('Type safety:')
    log.push('  container.resolve("config").apiUrl     // string (typed!)')
    log.push('  container.resolve("unknown")           // Error: not in registry')
    log.push('  container.resolve("logger").apiUrl     // Error: no apiUrl on Logger')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: DI Container</h2>
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
// Задание 3.2: Injection Tokens — Решение
// ============================================

class InjectionToken<T> {
  readonly _type!: T
  constructor(public readonly description: string) {}
}

function token<T>(description: string): InjectionToken<T> {
  return new InjectionToken<T>(description)
}

// Token-based container
class TokenContainer {
  private factories = new Map<InjectionToken<unknown>, () => unknown>()
  private instances = new Map<InjectionToken<unknown>, unknown>()

  provide<T>(tokenKey: InjectionToken<T>, factory: () => T): this {
    this.factories.set(tokenKey as InjectionToken<unknown>, factory)
    return this
  }

  inject<T>(tokenKey: InjectionToken<T>): T {
    if (this.instances.has(tokenKey as InjectionToken<unknown>)) {
      return this.instances.get(tokenKey as InjectionToken<unknown>) as T
    }

    const factory = this.factories.get(tokenKey as InjectionToken<unknown>)
    if (!factory) {
      throw new Error(`No provider for token: ${tokenKey.description}`)
    }

    const instance = factory() as T
    this.instances.set(tokenKey as InjectionToken<unknown>, instance)
    return instance
  }

  hasProvider<T>(tokenKey: InjectionToken<T>): boolean {
    return this.factories.has(tokenKey as InjectionToken<unknown>)
  }
}

// Define tokens
interface CacheService {
  get(key: string): string | null
  set(key: string, value: string): void
}

interface AnalyticsService {
  track(event: string, data: Record<string, unknown>): string
}

const TOKENS = {
  Logger: token<Logger>('Logger'),
  Config: token<Config>('Config'),
  Cache: token<CacheService>('CacheService'),
  Analytics: token<AnalyticsService>('AnalyticsService'),
  ApiBaseUrl: token<string>('ApiBaseUrl'),
  MaxRetries: token<number>('MaxRetries'),
}

export function Task3_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Injection Tokens ===')
    log.push('')

    const container = new TokenContainer()

    // Register with tokens
    container
      .provide(TOKENS.ApiBaseUrl, () => 'https://api.example.com')
      .provide(TOKENS.MaxRetries, () => 3)
      .provide(TOKENS.Logger, () => ({
        log: (msg: string) => `[LOG] ${msg}`,
        warn: (msg: string) => `[WARN] ${msg}`,
      }))
      .provide(TOKENS.Config, () => ({
        apiUrl: container.inject(TOKENS.ApiBaseUrl),
        timeout: 5000,
        debug: true,
      }))
      .provide(TOKENS.Cache, () => {
        const store = new Map<string, string>()
        return {
          get: (key: string) => store.get(key) ?? null,
          set: (key: string, value: string) => { store.set(key, value) },
        }
      })
      .provide(TOKENS.Analytics, () => ({
        track: (event: string, data: Record<string, unknown>) => {
          const logger = container.inject(TOKENS.Logger)
          return logger.log(`Analytics: ${event} ${JSON.stringify(data)}`)
        },
      }))

    log.push('Tokens defined:')
    Object.entries(TOKENS).forEach(([name, t]) => {
      log.push(`  ${name}: "${t.description}" — registered: ${container.hasProvider(t as InjectionToken<unknown>)}`)
    })
    log.push('')

    // Resolve via tokens
    const baseUrl = container.inject(TOKENS.ApiBaseUrl)
    log.push(`ApiBaseUrl: "${baseUrl}" (string)`)

    const maxRetries = container.inject(TOKENS.MaxRetries)
    log.push(`MaxRetries: ${maxRetries} (number)`)
    log.push('')

    const config = container.inject(TOKENS.Config)
    log.push('Config:')
    log.push(`  apiUrl: "${config.apiUrl}"`)
    log.push(`  timeout: ${config.timeout}`)
    log.push('')

    // Cache usage
    const cache = container.inject(TOKENS.Cache)
    cache.set('user:1', 'Alice')
    log.push(`Cache set: user:1 = "Alice"`)
    log.push(`Cache get: user:1 = "${cache.get('user:1')}"`)
    log.push(`Cache get: user:2 = ${cache.get('user:2')} (null — not found)`)
    log.push('')

    // Analytics with Logger dependency
    const analytics = container.inject(TOKENS.Analytics)
    const tracked = analytics.track('page_view', { page: '/home', userId: 42 })
    log.push(`Analytics: ${tracked}`)
    log.push('')

    log.push('Type safety with tokens:')
    log.push('  container.inject(TOKENS.ApiBaseUrl)   // string')
    log.push('  container.inject(TOKENS.MaxRetries)   // number')
    log.push('  container.inject(TOKENS.Logger)       // Logger')
    log.push('  container.inject(TOKENS.Logger).apiUrl // Error: no apiUrl on Logger')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: Injection Tokens</h2>
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
// Задание 3.3: Scoped Dependencies — Решение
// ============================================

type Lifetime = 'singleton' | 'transient' | 'scoped'

interface ServiceDescriptor<T> {
  factory: () => T
  lifetime: Lifetime
}

class ScopedContainer {
  private descriptors = new Map<string, ServiceDescriptor<unknown>>()
  private singletons = new Map<string, unknown>()
  private scopedInstances = new Map<string, unknown>()
  private parent: ScopedContainer | null = null

  registerSingleton<T>(name: string, factory: () => T): this {
    this.descriptors.set(name, { factory, lifetime: 'singleton' })
    return this
  }

  registerTransient<T>(name: string, factory: () => T): this {
    this.descriptors.set(name, { factory, lifetime: 'transient' })
    return this
  }

  registerScoped<T>(name: string, factory: () => T): this {
    this.descriptors.set(name, { factory, lifetime: 'scoped' })
    return this
  }

  resolve<T>(name: string): T {
    const descriptor = this.descriptors.get(name) ?? this.parent?.findDescriptor(name)

    if (!descriptor) {
      throw new Error(`Service "${name}" not registered`)
    }

    switch (descriptor.lifetime) {
      case 'singleton': {
        // Singletons live in root container
        const root = this.getRoot()
        if (!root.singletons.has(name)) {
          root.singletons.set(name, descriptor.factory())
        }
        return root.singletons.get(name) as T
      }
      case 'transient':
        // Always create new
        return descriptor.factory() as T
      case 'scoped': {
        // One per scope
        if (!this.scopedInstances.has(name)) {
          this.scopedInstances.set(name, descriptor.factory())
        }
        return this.scopedInstances.get(name) as T
      }
    }
  }

  createScope(): ScopedContainer {
    const child = new ScopedContainer()
    child.parent = this
    child.descriptors = new Map(this.descriptors)
    return child
  }

  private findDescriptor(name: string): ServiceDescriptor<unknown> | undefined {
    return this.descriptors.get(name) ?? this.parent?.findDescriptor(name)
  }

  private getRoot(): ScopedContainer {
    return this.parent ? this.parent.getRoot() : this
  }
}

export function Task3_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Scoped Dependencies ===')
    log.push('')

    let idCounter = 0
    const createId = () => ++idCounter

    const container = new ScopedContainer()
      .registerSingleton('config', () => {
        const id = createId()
        return { id, apiUrl: 'https://api.example.com', _type: 'singleton' }
      })
      .registerTransient('requestId', () => {
        const id = createId()
        return { id, value: `req-${Math.random().toString(36).slice(2, 8)}`, _type: 'transient' }
      })
      .registerScoped('dbConnection', () => {
        const id = createId()
        return { id, connectionString: 'postgres://localhost/app', _type: 'scoped' }
      })

    // Singleton: same instance everywhere
    const config1 = container.resolve<{ id: number; apiUrl: string }>('config')
    const config2 = container.resolve<{ id: number; apiUrl: string }>('config')
    log.push('Singleton (config):')
    log.push(`  First resolve:  id=${config1.id}`)
    log.push(`  Second resolve: id=${config2.id}`)
    log.push(`  Same instance: ${config1 === config2}`)
    log.push('')

    // Transient: new instance every time
    const req1 = container.resolve<{ id: number; value: string }>('requestId')
    const req2 = container.resolve<{ id: number; value: string }>('requestId')
    const req3 = container.resolve<{ id: number; value: string }>('requestId')
    log.push('Transient (requestId):')
    log.push(`  Resolve 1: id=${req1.id}, value="${req1.value}"`)
    log.push(`  Resolve 2: id=${req2.id}, value="${req2.value}"`)
    log.push(`  Resolve 3: id=${req3.id}, value="${req3.value}"`)
    log.push(`  All different: ${req1 !== req2 && req2 !== req3}`)
    log.push('')

    // Scoped: same within scope, different across scopes
    log.push('Scoped (dbConnection):')

    const scope1 = container.createScope()
    const db1a = scope1.resolve<{ id: number; connectionString: string }>('dbConnection')
    const db1b = scope1.resolve<{ id: number; connectionString: string }>('dbConnection')
    log.push(`  Scope 1: first id=${db1a.id}, second id=${db1b.id}, same=${db1a === db1b}`)

    const scope2 = container.createScope()
    const db2a = scope2.resolve<{ id: number; connectionString: string }>('dbConnection')
    const db2b = scope2.resolve<{ id: number; connectionString: string }>('dbConnection')
    log.push(`  Scope 2: first id=${db2a.id}, second id=${db2b.id}, same=${db2a === db2b}`)
    log.push(`  Cross-scope: scope1 === scope2? ${db1a === db2a}`)
    log.push('')

    // Singleton shared across scopes
    const scopeConfig = scope1.resolve<{ id: number }>('config')
    log.push('Singleton across scopes:')
    log.push(`  Root config id: ${config1.id}`)
    log.push(`  Scope1 config id: ${scopeConfig.id}`)
    log.push(`  Same: ${config1 === scopeConfig}`)
    log.push('')

    log.push('Lifetime summary:')
    log.push('  Singleton: one instance for entire application')
    log.push('  Transient: new instance on every resolve()')
    log.push('  Scoped:    one instance per scope (e.g., per HTTP request)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: Scoped Dependencies</h2>
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
// Задание 3.4: Auto-Wiring — Решение
// ============================================

// Dependency metadata for auto-wiring
interface DependencyMeta {
  name: string
  dependencies: string[]
  factory: (...deps: unknown[]) => unknown
}

class AutoWireContainer {
  private metas = new Map<string, DependencyMeta>()
  private instances = new Map<string, unknown>()
  private resolving = new Set<string>()

  register<T>(
    name: string,
    dependencies: string[],
    factory: (...deps: unknown[]) => T
  ): this {
    this.metas.set(name, { name, dependencies, factory })
    return this
  }

  resolve<T>(name: string): T {
    if (this.instances.has(name)) {
      return this.instances.get(name) as T
    }

    if (this.resolving.has(name)) {
      throw new Error(`Circular dependency detected: ${[...this.resolving, name].join(' -> ')}`)
    }

    const meta = this.metas.get(name)
    if (!meta) {
      throw new Error(`Service "${name}" not registered`)
    }

    this.resolving.add(name)

    // Auto-resolve dependencies
    const deps = meta.dependencies.map((dep) => this.resolve(dep))
    const instance = meta.factory(...deps)

    this.resolving.delete(name)
    this.instances.set(name, instance)
    return instance as T
  }

  getResolutionOrder(name: string): string[] {
    const order: string[] = []
    const visited = new Set<string>()

    const visit = (n: string) => {
      if (visited.has(n)) return
      visited.add(n)
      const meta = this.metas.get(n)
      if (meta) {
        meta.dependencies.forEach((dep) => visit(dep))
      }
      order.push(n)
    }

    visit(name)
    return order
  }

  getDependencyGraph(): Map<string, string[]> {
    const graph = new Map<string, string[]>()
    this.metas.forEach((meta, name) => {
      graph.set(name, [...meta.dependencies])
    })
    return graph
  }
}

export function Task3_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Auto-Wiring ===')
    log.push('')

    const container = new AutoWireContainer()

    // Register services with dependency declarations
    container
      .register('config', [], () => ({
        dbUrl: 'postgres://localhost/app',
        redisUrl: 'redis://localhost',
        logLevel: 'info',
      }))
      .register('logger', ['config'], (...deps: unknown[]) => {
        const config = deps[0] as Record<string, string>
        return {
          info: (msg: string) => `[${config.logLevel?.toUpperCase()}] ${msg}`,
          error: (msg: string) => `[ERROR] ${msg}`,
        }
      })
      .register('database', ['config', 'logger'], (...deps: unknown[]) => {
        const config = deps[0] as Record<string, string>
        const logger = deps[1] as { info: (m: string) => string }
        return {
          query: (sql: string) => logger.info(`DB(${config.dbUrl}): ${sql}`),
        }
      })
      .register('cache', ['config', 'logger'], (...deps: unknown[]) => {
        const config = deps[0] as Record<string, string>
        const logger = deps[1] as { info: (m: string) => string }
        return {
          get: (key: string) => logger.info(`Cache(${config.redisUrl}): GET ${key}`),
        }
      })
      .register('userRepository', ['database', 'cache', 'logger'], (...deps: unknown[]) => {
        const db = deps[0] as { query: (s: string) => string }
        const cache = deps[1] as { get: (k: string) => string }
        const logger = deps[2] as { info: (m: string) => string }
        return {
          findById: (id: number) => {
            const cached = cache.get(`user:${id}`)
            const dbResult = db.query(`SELECT * FROM users WHERE id = ${id}`)
            return logger.info(`UserRepo: cache=${cached}, db=${dbResult}`)
          },
        }
      })
      .register('userService', ['userRepository', 'logger'], (...deps: unknown[]) => {
        const repo = deps[0] as { findById: (id: number) => string }
        const logger = deps[1] as { info: (m: string) => string }
        return {
          getUser: (id: number) => {
            const result = repo.findById(id)
            return logger.info(`UserService.getUser(${id}): ${result}`)
          },
        }
      })

    // Show dependency graph
    log.push('Dependency graph:')
    const graph = container.getDependencyGraph()
    graph.forEach((deps, name) => {
      log.push(`  ${name} <- [${deps.join(', ') || 'none'}]`)
    })
    log.push('')

    // Show resolution order
    log.push('Resolution order for "userService":')
    const order = container.getResolutionOrder('userService')
    order.forEach((name, i) => {
      log.push(`  ${i + 1}. ${name}`)
    })
    log.push('')

    // Auto-resolve
    log.push('Resolving userService (auto-wires all dependencies):')
    const userService = container.resolve<{ getUser: (id: number) => string }>('userService')
    const result = userService.getUser(42)
    log.push(`  Result: ${result}`)
    log.push('')

    // Circular dependency detection
    log.push('Circular dependency detection:')
    const circularContainer = new AutoWireContainer()
    circularContainer
      .register('a', ['b'], () => ({}))
      .register('b', ['c'], () => ({}))
      .register('c', ['a'], () => ({}))

    try {
      circularContainer.resolve('a')
    } catch (e) {
      log.push(`  Error: ${(e as Error).message}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.4: Auto-Wiring</h2>
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
