import { useState } from 'react'

// ============================================
// Задание 2.1: Step Builder — Решение
// ============================================

// Step Builder enforces method call order via types
// Each step returns a new interface that only exposes the next valid method

interface HttpRequest {
  method: string
  url: string
  headers: Record<string, string>
  body?: string
  timeout?: number
}

// Step interfaces — each exposes only the next valid method
interface RequestBuilderStep1 {
  get(url: string): RequestBuilderStep3
  post(url: string): RequestBuilderStep2
  put(url: string): RequestBuilderStep2
  delete(url: string): RequestBuilderStep3
}

interface RequestBuilderStep2 {
  body(data: string | Record<string, unknown>): RequestBuilderStep3
}

interface RequestBuilderStep3 {
  header(key: string, value: string): RequestBuilderStep3
  timeout(ms: number): RequestBuilderStep3
  build(): HttpRequest
}

function createRequestBuilder(): RequestBuilderStep1 {
  const request: Partial<HttpRequest> = {
    headers: {},
  }

  const step3: RequestBuilderStep3 = {
    header(key: string, value: string) {
      request.headers = { ...request.headers, [key]: value }
      return step3
    },
    timeout(ms: number) {
      request.timeout = ms
      return step3
    },
    build() {
      return {
        method: request.method!,
        url: request.url!,
        headers: { ...request.headers! },
        body: request.body,
        timeout: request.timeout,
      }
    },
  }

  const step2: RequestBuilderStep2 = {
    body(data: string | Record<string, unknown>) {
      request.body = typeof data === 'string' ? data : JSON.stringify(data)
      return step3
    },
  }

  return {
    get(url: string) {
      request.method = 'GET'
      request.url = url
      return step3
    },
    post(url: string) {
      request.method = 'POST'
      request.url = url
      return step2
    },
    put(url: string) {
      request.method = 'PUT'
      request.url = url
      return step2
    },
    delete(url: string) {
      request.method = 'DELETE'
      request.url = url
      return step3
    },
  }
}

export function Task2_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Step Builder ===')
    log.push('')

    // GET request — no body step
    const getReq = createRequestBuilder()
      .get('https://api.example.com/users')
      .header('Authorization', 'Bearer token123')
      .timeout(5000)
      .build()

    log.push('GET request (no body step):')
    log.push(`  method: ${getReq.method}`)
    log.push(`  url: ${getReq.url}`)
    log.push(`  headers: ${JSON.stringify(getReq.headers)}`)
    log.push(`  timeout: ${getReq.timeout}ms`)
    log.push('')

    // POST request — body step required
    const postReq = createRequestBuilder()
      .post('https://api.example.com/users')
      .body({ name: 'John', email: 'john@example.com' })
      .header('Content-Type', 'application/json')
      .build()

    log.push('POST request (body step required):')
    log.push(`  method: ${postReq.method}`)
    log.push(`  url: ${postReq.url}`)
    log.push(`  body: ${postReq.body}`)
    log.push(`  headers: ${JSON.stringify(postReq.headers)}`)
    log.push('')

    // PUT with string body
    const putReq = createRequestBuilder()
      .put('https://api.example.com/users/42')
      .body('raw text body')
      .header('Content-Type', 'text/plain')
      .build()

    log.push('PUT request (string body):')
    log.push(`  method: ${putReq.method}`)
    log.push(`  url: ${putReq.url}`)
    log.push(`  body: ${putReq.body}`)
    log.push('')

    // DELETE — no body
    const delReq = createRequestBuilder()
      .delete('https://api.example.com/users/42')
      .build()

    log.push('DELETE request (minimal):')
    log.push(`  method: ${delReq.method}`)
    log.push(`  url: ${delReq.url}`)
    log.push('')

    log.push('Step enforcement (compile-time):')
    log.push('  createRequestBuilder().get("/url").body(...)    // Error: no body on GET')
    log.push('  createRequestBuilder().post("/url").build()     // Error: must call body first')
    log.push('  createRequestBuilder().build()                  // Error: must choose method first')
    log.push('  createRequestBuilder().post("/url").body({}).body({}) // Error: body only once')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Step Builder</h2>
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
// Задание 2.2: Accumulating Builder — Решение
// ============================================

// The builder tracks which properties have been set in the type system

type BuilderState = Record<string, boolean>

interface FormConfig {
  title: string
  action: string
  method: 'GET' | 'POST'
  fields: Array<{ name: string; type: string; required: boolean }>
  validation: boolean
  submitLabel: string
}

type RequiredKeys = 'title' | 'action' | 'method'

class FormBuilder<TSet extends Partial<Record<RequiredKeys, true>> = {}> {
  private config: Partial<FormConfig> = { fields: [] }

  title(title: string): FormBuilder<TSet & { title: true }> {
    this.config.title = title
    return this as unknown as FormBuilder<TSet & { title: true }>
  }

  action(action: string): FormBuilder<TSet & { action: true }> {
    this.config.action = action
    return this as unknown as FormBuilder<TSet & { action: true }>
  }

  method(method: 'GET' | 'POST'): FormBuilder<TSet & { method: true }> {
    this.config.method = method
    return this as unknown as FormBuilder<TSet & { method: true }>
  }

  field(name: string, type: string, required = false): this {
    this.config.fields = [...(this.config.fields || []), { name, type, required }]
    return this
  }

  validation(enabled: boolean): this {
    this.config.validation = enabled
    return this
  }

  submitLabel(label: string): this {
    this.config.submitLabel = label
    return this
  }

  build(
    this: FormBuilder<{ title: true; action: true; method: true }>
  ): FormConfig {
    return {
      title: this.config.title!,
      action: this.config.action!,
      method: this.config.method!,
      fields: this.config.fields || [],
      validation: this.config.validation ?? false,
      submitLabel: this.config.submitLabel ?? 'Submit',
    }
  }
}

export function Task2_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Accumulating Builder ===')
    log.push('')

    // Full builder with all required fields
    const form = new FormBuilder()
      .title('Contact Form')
      .action('/api/contact')
      .method('POST')
      .field('name', 'text', true)
      .field('email', 'email', true)
      .field('message', 'textarea', false)
      .validation(true)
      .submitLabel('Send Message')
      .build()

    log.push('Built form config:')
    log.push(`  title: "${form.title}"`)
    log.push(`  action: "${form.action}"`)
    log.push(`  method: "${form.method}"`)
    log.push(`  validation: ${form.validation}`)
    log.push(`  submitLabel: "${form.submitLabel}"`)
    log.push(`  fields:`)
    form.fields.forEach((f) => {
      log.push(`    - ${f.name} (${f.type})${f.required ? ' [required]' : ''}`)
    })
    log.push('')

    // Minimal form
    const minimal = new FormBuilder()
      .title('Search')
      .action('/search')
      .method('GET')
      .field('q', 'text', true)
      .build()

    log.push('Minimal form (only required fields):')
    log.push(`  title: "${minimal.title}"`)
    log.push(`  action: "${minimal.action}"`)
    log.push(`  method: "${minimal.method}"`)
    log.push(`  submitLabel: "${minimal.submitLabel}" (default)`)
    log.push(`  fields: ${minimal.fields.length}`)
    log.push('')

    // Order doesn't matter
    const reordered = new FormBuilder()
      .method('POST')
      .field('email', 'email', true)
      .action('/api/subscribe')
      .title('Newsletter')
      .build()

    log.push('Order-independent (method->field->action->title):')
    log.push(`  title: "${reordered.title}"`)
    log.push(`  action: "${reordered.action}"`)
    log.push('')

    log.push('Accumulation tracking (compile-time):')
    log.push('  new FormBuilder().title("x").build()             // Error: missing action, method')
    log.push('  new FormBuilder().title("x").action("/y").build() // Error: missing method')
    log.push('  new FormBuilder().build()                         // Error: missing all required')
    log.push('  FormBuilder<{title:true, action:true, method:true}> -> build() available')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Accumulating Builder</h2>
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
// Задание 2.3: Conditional Builder Methods — Решение
// ============================================

type DatabaseType = 'postgres' | 'mysql' | 'sqlite'

interface BaseDbConfig {
  database: string
  logging: boolean
}

interface PostgresConfig extends BaseDbConfig {
  type: 'postgres'
  host: string
  port: number
  ssl: boolean
  poolSize: number
}

interface MysqlConfig extends BaseDbConfig {
  type: 'mysql'
  host: string
  port: number
  charset: string
}

interface SqliteConfig extends BaseDbConfig {
  type: 'sqlite'
  filename: string
  mode: 'memory' | 'file'
}

type DbConfig = PostgresConfig | MysqlConfig | SqliteConfig

// Conditional builder: methods change based on selected database type
class DbConfigBuilder<T extends DatabaseType | null = null> {
  private config: Partial<DbConfig> = { logging: false }

  postgres(): DbConfigBuilder<'postgres'> {
    (this.config as Partial<PostgresConfig>).type = 'postgres'
    ;(this.config as Partial<PostgresConfig>).port = 5432
    ;(this.config as Partial<PostgresConfig>).ssl = false
    ;(this.config as Partial<PostgresConfig>).poolSize = 10
    return this as unknown as DbConfigBuilder<'postgres'>
  }

  mysql(): DbConfigBuilder<'mysql'> {
    (this.config as Partial<MysqlConfig>).type = 'mysql'
    ;(this.config as Partial<MysqlConfig>).port = 3306
    ;(this.config as Partial<MysqlConfig>).charset = 'utf8mb4'
    return this as unknown as DbConfigBuilder<'mysql'>
  }

  sqlite(): DbConfigBuilder<'sqlite'> {
    (this.config as Partial<SqliteConfig>).type = 'sqlite'
    ;(this.config as Partial<SqliteConfig>).mode = 'file'
    return this as unknown as DbConfigBuilder<'sqlite'>
  }

  database(name: string): this {
    this.config.database = name
    return this
  }

  logging(enabled: boolean): this {
    this.config.logging = enabled
    return this
  }

  // Available only for postgres and mysql (network databases)
  host(this: DbConfigBuilder<'postgres'> | DbConfigBuilder<'mysql'>, host: string): DbConfigBuilder<'postgres'> | DbConfigBuilder<'mysql'> {
    (this.config as Partial<PostgresConfig | MysqlConfig>).host = host
    return this
  }

  port(this: DbConfigBuilder<'postgres'> | DbConfigBuilder<'mysql'>, port: number): DbConfigBuilder<'postgres'> | DbConfigBuilder<'mysql'> {
    (this.config as Partial<PostgresConfig | MysqlConfig>).port = port
    return this
  }

  // Postgres-only methods
  ssl(this: DbConfigBuilder<'postgres'>, enabled: boolean): DbConfigBuilder<'postgres'> {
    (this.config as Partial<PostgresConfig>).ssl = enabled
    return this
  }

  poolSize(this: DbConfigBuilder<'postgres'>, size: number): DbConfigBuilder<'postgres'> {
    (this.config as Partial<PostgresConfig>).poolSize = size
    return this
  }

  // MySQL-only method
  charset(this: DbConfigBuilder<'mysql'>, charset: string): DbConfigBuilder<'mysql'> {
    (this.config as Partial<MysqlConfig>).charset = charset
    return this
  }

  // SQLite-only methods
  filename(this: DbConfigBuilder<'sqlite'>, filename: string): DbConfigBuilder<'sqlite'> {
    (this.config as Partial<SqliteConfig>).filename = filename
    return this
  }

  mode(this: DbConfigBuilder<'sqlite'>, mode: 'memory' | 'file'): DbConfigBuilder<'sqlite'> {
    (this.config as Partial<SqliteConfig>).mode = mode
    return this
  }

  build(this: DbConfigBuilder<Exclude<T, null>>): DbConfig {
    return { ...this.config } as DbConfig
  }
}

export function Task2_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Conditional Builder Methods ===')
    log.push('')

    // Postgres config — ssl and poolSize available
    const pgConfig = new DbConfigBuilder()
      .postgres()
      .database('myapp')
      .host('localhost')
      .port(5432)
      .ssl(true)
      .poolSize(20)
      .logging(true)
      .build()

    log.push('PostgreSQL config:')
    log.push(`  type: ${pgConfig.type}`)
    log.push(`  database: ${pgConfig.database}`)
    if (pgConfig.type === 'postgres') {
      log.push(`  host: ${pgConfig.host}:${pgConfig.port}`)
      log.push(`  ssl: ${pgConfig.ssl}`)
      log.push(`  poolSize: ${pgConfig.poolSize}`)
    }
    log.push(`  logging: ${pgConfig.logging}`)
    log.push('')

    // MySQL config — charset available, no ssl/poolSize
    const mysqlConfig = new DbConfigBuilder()
      .mysql()
      .database('shop')
      .host('db.example.com')
      .port(3307)
      .charset('utf8mb4')
      .build()

    log.push('MySQL config:')
    log.push(`  type: ${mysqlConfig.type}`)
    log.push(`  database: ${mysqlConfig.database}`)
    if (mysqlConfig.type === 'mysql') {
      log.push(`  host: ${mysqlConfig.host}:${mysqlConfig.port}`)
      log.push(`  charset: ${mysqlConfig.charset}`)
    }
    log.push('')

    // SQLite config — filename and mode, no host/port
    const sqliteConfig = new DbConfigBuilder()
      .sqlite()
      .database('test')
      .filename('./data.db')
      .mode('file')
      .build()

    log.push('SQLite config:')
    log.push(`  type: ${sqliteConfig.type}`)
    log.push(`  database: ${sqliteConfig.database}`)
    if (sqliteConfig.type === 'sqlite') {
      log.push(`  filename: ${sqliteConfig.filename}`)
      log.push(`  mode: ${sqliteConfig.mode}`)
    }
    log.push('')

    // In-memory SQLite
    const memConfig = new DbConfigBuilder()
      .sqlite()
      .database('inmem')
      .filename(':memory:')
      .mode('memory')
      .build()

    log.push('SQLite in-memory:')
    if (memConfig.type === 'sqlite') {
      log.push(`  filename: ${memConfig.filename}`)
      log.push(`  mode: ${memConfig.mode}`)
    }
    log.push('')

    log.push('Conditional methods (compile-time):')
    log.push('  builder.sqlite().host("x")     // Error: host not available for sqlite')
    log.push('  builder.sqlite().ssl(true)      // Error: ssl not available for sqlite')
    log.push('  builder.mysql().poolSize(10)    // Error: poolSize is postgres-only')
    log.push('  builder.postgres().filename("x") // Error: filename is sqlite-only')
    log.push('  new DbConfigBuilder().build()    // Error: must choose database type first')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.3: Conditional Builder Methods</h2>
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
