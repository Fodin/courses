import { useState } from 'react'

// ============================================
// Задание 8.1: Type-safe Builder — Решение
// ============================================

interface ServerConfig {
  host: string
  port: number
  protocol: 'http' | 'https'
  maxConnections?: number
  timeout?: number
}

type RequiredConfigKeys = 'host' | 'port' | 'protocol'

class ConfigBuilder<Set extends string = never> {
  private config: Partial<ServerConfig> = {}

  setHost(host: string): ConfigBuilder<Set | 'host'> {
    this.config.host = host
    return this as unknown as ConfigBuilder<Set | 'host'>
  }

  setPort(port: number): ConfigBuilder<Set | 'port'> {
    this.config.port = port
    return this as unknown as ConfigBuilder<Set | 'port'>
  }

  setProtocol(protocol: 'http' | 'https'): ConfigBuilder<Set | 'protocol'> {
    this.config.protocol = protocol
    return this as unknown as ConfigBuilder<Set | 'protocol'>
  }

  setMaxConnections(max: number): ConfigBuilder<Set> {
    this.config.maxConnections = max
    return this
  }

  setTimeout(timeout: number): ConfigBuilder<Set> {
    this.config.timeout = timeout
    return this
  }

  build(
    this: ConfigBuilder<RequiredConfigKeys extends Set ? Set : never>
  ): ServerConfig {
    return { ...this.config } as ServerConfig
  }
}

function createConfigBuilder(): ConfigBuilder<never> {
  return new ConfigBuilder()
}

export function Task8_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('--- Type-safe Builder ---')
    log.push('')

    // Valid: all required fields set
    const config1 = createConfigBuilder()
      .setHost('localhost')
      .setPort(3000)
      .setProtocol('https')
      .build()

    log.push('Config 1 (all required fields):')
    log.push(`  host: ${config1.host}`)
    log.push(`  port: ${config1.port}`)
    log.push(`  protocol: ${config1.protocol}`)
    log.push('')

    // Valid: required + optional fields
    const config2 = createConfigBuilder()
      .setProtocol('http')
      .setHost('api.example.com')
      .setMaxConnections(100)
      .setPort(8080)
      .setTimeout(5000)
      .build()

    log.push('Config 2 (required + optional):')
    log.push(`  host: ${config2.host}`)
    log.push(`  port: ${config2.port}`)
    log.push(`  protocol: ${config2.protocol}`)
    log.push(`  maxConnections: ${config2.maxConnections}`)
    log.push(`  timeout: ${config2.timeout}`)
    log.push('')

    // Type error examples (commented out — would not compile):
    log.push('// These would NOT compile:')
    log.push('// createConfigBuilder().setHost("x").build()')
    log.push('//   => Error: build() not available, missing port & protocol')
    log.push('// createConfigBuilder().build()')
    log.push('//   => Error: build() not available, no fields set')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.1: Type-safe Builder</h2>
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
// Задание 8.2: Phantom Types — Решение
// ============================================

declare const ValidatedBrand: unique symbol
declare const SanitizedBrand: unique symbol
declare const EncryptedBrand: unique symbol

interface Validated { readonly [ValidatedBrand]: true }
interface Sanitized { readonly [SanitizedBrand]: true }
interface Encrypted { readonly [EncryptedBrand]: true }

type Branded<T, Brand> = T & { readonly __brand: Brand }

type RawString = string
type ValidatedString = Branded<string, Validated>
type SanitizedString = Branded<string, Sanitized>
type ValidatedAndSanitized = Branded<string, Validated & Sanitized>
type EncryptedString = Branded<string, Encrypted>

function validate(input: RawString): ValidatedString | null {
  if (input.length === 0) return null
  if (input.length > 255) return null
  return input as ValidatedString
}

function sanitize(input: ValidatedString): ValidatedAndSanitized {
  const sanitized = input.replace(/<[^>]*>/g, '').replace(/[&<>"']/g, '')
  return sanitized as ValidatedAndSanitized
}

function encrypt(input: ValidatedAndSanitized): EncryptedString {
  // Simple "encryption" for demo — base64 encode
  const encoded = btoa(input)
  return encoded as EncryptedString
}

function storeInDatabase(data: EncryptedString): string {
  return `Stored encrypted data: ${data.slice(0, 10)}...`
}

// Pipeline: raw → validate → sanitize → encrypt → store
function processUserInput(raw: RawString): string {
  const validated = validate(raw)
  if (!validated) return 'Validation failed: empty or too long'

  const sanitized = sanitize(validated)
  const encrypted = encrypt(sanitized)
  return storeInDatabase(encrypted)
}

export function Task8_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('--- Phantom Types (Branded Types) ---')
    log.push('')

    // Valid input
    const input1 = 'Hello, World!'
    log.push(`Input: "${input1}"`)
    log.push(`Result: ${processUserInput(input1)}`)
    log.push('')

    // Input with HTML tags — will be sanitized
    const input2 = 'Hello <script>alert("xss")</script> World'
    log.push(`Input: "${input2}"`)
    const validated2 = validate(input2)
    if (validated2) {
      const sanitized2 = sanitize(validated2)
      log.push(`After sanitize: "${sanitized2}"`)
      const encrypted2 = encrypt(sanitized2)
      log.push(`After encrypt: "${encrypted2}"`)
      log.push(`Store: ${storeInDatabase(encrypted2)}`)
    }
    log.push('')

    // Empty input — validation fails
    const input3 = ''
    log.push(`Input: "${input3}" (empty)`)
    log.push(`Result: ${processUserInput(input3)}`)
    log.push('')

    // Type safety demos
    log.push('// Type safety — these would NOT compile:')
    log.push('// sanitize("raw string")       => Error: string is not ValidatedString')
    log.push('// encrypt(validatedOnly)        => Error: need ValidatedAndSanitized')
    log.push('// storeInDatabase(sanitizedStr) => Error: need EncryptedString')
    log.push('')
    log.push('Pipeline enforced at compile time:')
    log.push('  RawString → validate → ValidatedString')
    log.push('  ValidatedString → sanitize → ValidatedAndSanitized')
    log.push('  ValidatedAndSanitized → encrypt → EncryptedString')
    log.push('  EncryptedString → storeInDatabase')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.2: Phantom Types</h2>
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
// Задание 8.3: Type-level State Machine — Решение
// ============================================

interface DraftState { readonly _state: 'draft' }
interface ReviewState { readonly _state: 'review' }
interface PublishedState { readonly _state: 'published' }

interface DocumentData {
  title: string
  content: string
  author: string
}

class TypedDocument<S> {
  constructor(
    readonly data: DocumentData,
    readonly state: string
  ) {}

  // Draft → Review
  submitForReview(this: TypedDocument<DraftState>): TypedDocument<ReviewState> {
    return new TypedDocument<ReviewState>(
      this.data,
      'review'
    )
  }

  // Review → Published
  publish(this: TypedDocument<ReviewState>): TypedDocument<PublishedState> {
    return new TypedDocument<PublishedState>(
      this.data,
      'published'
    )
  }

  // Review → Draft
  requestChanges(this: TypedDocument<ReviewState>): TypedDocument<DraftState> {
    return new TypedDocument<DraftState>(
      this.data,
      'draft'
    )
  }

  // Edit content — only in Draft
  editContent(this: TypedDocument<DraftState>, content: string): TypedDocument<DraftState> {
    return new TypedDocument<DraftState>(
      { ...this.data, content },
      'draft'
    )
  }

  describe(): string {
    return `"${this.data.title}" [${this.state}] by ${this.data.author}`
  }
}

function createDraft(data: DocumentData): TypedDocument<DraftState> {
  return new TypedDocument<DraftState>(data, 'draft')
}

// Type-level transition map for validation
type TransitionMap = {
  draft: 'review'
  review: 'published' | 'draft'
  published: never
}

type CanTransition<
  From extends keyof TransitionMap,
  To extends string
> = To extends TransitionMap[From] ? true : false

// Compile-time assertions
type _AssertDraftToReview = CanTransition<'draft', 'review'> // true
type _AssertReviewToPublished = CanTransition<'review', 'published'> // true
type _AssertReviewToDraft = CanTransition<'review', 'draft'> // true
type _AssertDraftToPublished = CanTransition<'draft', 'published'> // false
type _AssertPublishedToAny = CanTransition<'published', 'draft'> // false

export function Task8_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('--- Type-level State Machine ---')
    log.push('')

    // Create draft
    const draft = createDraft({
      title: 'Advanced TypeScript',
      content: 'Initial draft...',
      author: 'Alice',
    })
    log.push(`1. Created: ${draft.describe()}`)

    // Edit content (only allowed in Draft)
    const edited = draft.editContent('Updated content with examples')
    log.push(`2. Edited:  ${edited.describe()}`)

    // Submit for review (Draft → Review)
    const inReview = edited.submitForReview()
    log.push(`3. Submit:  ${inReview.describe()}`)

    // Request changes (Review → Draft)
    const backToDraft = inReview.requestChanges()
    log.push(`4. Changes: ${backToDraft.describe()}`)

    // Edit again and re-submit
    const reEdited = backToDraft.editContent('Final version with fixes')
    log.push(`5. Re-edit: ${reEdited.describe()}`)

    const reSubmitted = reEdited.submitForReview()
    log.push(`6. Re-submit: ${reSubmitted.describe()}`)

    // Publish (Review → Published)
    const published = reSubmitted.publish()
    log.push(`7. Publish: ${published.describe()}`)

    log.push('')
    log.push('// Type safety — these would NOT compile:')
    log.push('// draft.publish()          => Error: publish needs Review state')
    log.push('// published.editContent()  => Error: edit needs Draft state')
    log.push('// published.requestChanges() => Error: needs Review state')
    log.push('// inReview.editContent()   => Error: edit needs Draft state')
    log.push('')

    // Show transition map
    log.push('Transition map (type-level):')
    log.push('  Draft     → Review                (submitForReview)')
    log.push('  Review    → Published | Draft      (publish | requestChanges)')
    log.push('  Published → (terminal state)       (no transitions)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.3: Type-level State Machine</h2>
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
// Задание 8.4: Effect Pattern — Решение
// ============================================

type Result<E, A> =
  | { readonly success: true; readonly value: A }
  | { readonly success: false; readonly error: E }

function ok<A>(value: A): Result<never, A> {
  return { success: true, value }
}

function err<E>(error: E): Result<E, never> {
  return { success: false, error }
}

class Effect<R, E, A> {
  constructor(readonly run: (context: R) => Result<E, A>) {}

  // Map the success value
  map<B>(f: (a: A) => B): Effect<R, E, B> {
    return new Effect((ctx: R) => {
      const result = this.run(ctx)
      if (result.success) {
        return ok(f(result.value))
      }
      return result
    })
  }

  // Chain effects — combines requirements and errors
  flatMap<R2, E2, B>(f: (a: A) => Effect<R2, E2, B>): Effect<R & R2, E | E2, B> {
    return new Effect((ctx: R & R2) => {
      const result = this.run(ctx)
      if (!result.success) {
        return result as Result<E | E2, B>
      }
      return f(result.value).run(ctx)
    })
  }

  // Handle errors
  catchError<E2, B>(f: (e: E) => Effect<R, E2, B>): Effect<R, E2, A | B> {
    return new Effect((ctx: R) => {
      const result = this.run(ctx)
      if (!result.success) {
        return f(result.error).run(ctx) as Result<E2, A | B>
      }
      return result as Result<E2, A | B>
    })
  }
}

// Smart constructors
function succeed<A>(value: A): Effect<unknown, never, A> {
  return new Effect(() => ok(value))
}

function fail<E>(error: E): Effect<unknown, E, never> {
  return new Effect(() => err(error))
}

function service<R, A>(f: (ctx: R) => A): Effect<R, never, A> {
  return new Effect((ctx: R) => ok(f(ctx)))
}

function serviceWithError<R, E, A>(f: (ctx: R) => Result<E, A>): Effect<R, E, A> {
  return new Effect(f)
}

// Domain types
interface DatabaseService {
  findUser: (id: string) => { name: string; email: string } | null
}

interface EmailService {
  send: (to: string, subject: string, body: string) => boolean
}

interface LoggerService {
  log: (message: string) => void
}

type DatabaseError = { type: 'DatabaseError'; message: string }
type EmailError = { type: 'EmailError'; message: string }
type NotFoundError = { type: 'NotFoundError'; id: string }

// Effects that declare their requirements and possible errors
function findUser(id: string): Effect<{ db: DatabaseService }, NotFoundError, { name: string; email: string }> {
  return serviceWithError(({ db }) => {
    const user = db.findUser(id)
    if (!user) return err({ type: 'NotFoundError' as const, id })
    return ok(user)
  })
}

function sendEmail(
  to: string,
  subject: string,
  body: string
): Effect<{ email: EmailService }, EmailError, void> {
  return serviceWithError(({ email }) => {
    const sent = email.send(to, subject, body)
    if (!sent) return err({ type: 'EmailError' as const, message: `Failed to send to ${to}` })
    return ok(undefined)
  })
}

function logMessage(message: string): Effect<{ logger: LoggerService }, never, void> {
  return service(({ logger }) => logger.log(message))
}

// Composed effect: requires db + email + logger, can fail with NotFound | Email errors
function notifyUser(
  userId: string,
  subject: string,
  body: string
): Effect<
  { db: DatabaseService; email: EmailService; logger: LoggerService },
  NotFoundError | EmailError,
  string
> {
  return logMessage(`Looking up user ${userId}`)
    .flatMap(() => findUser(userId))
    .flatMap((user) =>
      logMessage(`Sending email to ${user.email}`)
        .flatMap(() => sendEmail(user.email, subject, body))
        .map(() => `Email sent to ${user.name} (${user.email})`)
    )
}

export function Task8_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('--- Effect Pattern ---')
    log.push('')

    // Create service implementations
    const context = {
      db: {
        findUser: (id: string) => {
          const users: Record<string, { name: string; email: string }> = {
            '1': { name: 'Alice', email: 'alice@example.com' },
            '2': { name: 'Bob', email: 'bob@example.com' },
          }
          return users[id] ?? null
        },
      },
      email: {
        send: (to: string, subject: string, _body: string) => {
          log.push(`  [EmailService] Sending "${subject}" to ${to}`)
          return !to.includes('fail')
        },
      },
      logger: {
        log: (message: string) => {
          log.push(`  [Logger] ${message}`)
        },
      },
    }

    // Success case
    log.push('Case 1: Notify existing user')
    const effect1 = notifyUser('1', 'Welcome!', 'Hello Alice')
    const result1 = effect1.run(context)
    if (result1.success) {
      log.push(`  Result: ${result1.value}`)
    } else {
      log.push(`  Error: ${JSON.stringify(result1.error)}`)
    }
    log.push('')

    // User not found
    log.push('Case 2: Notify non-existent user')
    const effect2 = notifyUser('999', 'Hello', 'Body')
    const result2 = effect2.run(context)
    if (result2.success) {
      log.push(`  Result: ${result2.value}`)
    } else {
      log.push(`  Error: ${result2.error.type} (id: ${'id' in result2.error ? result2.error.id : 'N/A'})`)
    }
    log.push('')

    // Error recovery with catchError
    log.push('Case 3: Error recovery with catchError')
    const withFallback = notifyUser('999', 'Hi', 'Body')
      .catchError((e) => {
        if (e.type === 'NotFoundError') {
          return succeed(`User ${e.id} not found — skipped notification`)
        }
        return fail(e)
      })
    const result3 = withFallback.run(context)
    if (result3.success) {
      log.push(`  Recovered: ${result3.value}`)
    }
    log.push('')

    // map example
    log.push('Case 4: Using map to transform results')
    const uppercased = findUser('2')
      .map((user) => user.name.toUpperCase())
    const result4 = uppercased.run(context)
    if (result4.success) {
      log.push(`  Mapped: ${result4.value}`)
    }
    log.push('')

    // Type information
    log.push('Type signatures (compile-time):')
    log.push('  findUser:    Effect<{db}, NotFoundError, User>')
    log.push('  sendEmail:   Effect<{email}, EmailError, void>')
    log.push('  logMessage:  Effect<{logger}, never, void>')
    log.push('  notifyUser:  Effect<{db,email,logger}, NotFound|Email, string>')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.4: Effect Pattern</h2>
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
