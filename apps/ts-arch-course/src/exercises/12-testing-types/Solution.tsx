import { useState } from 'react'

// ============================================
// Задание 12.1: Typed Mocks — Решение
// ============================================

interface UserRepository {
  findById(id: string): Promise<{ id: string; name: string; email: string } | null>
  findAll(): Promise<Array<{ id: string; name: string; email: string }>>
  save(user: { name: string; email: string }): Promise<{ id: string; name: string; email: string }>
  delete(id: string): Promise<boolean>
}

interface EmailService {
  send(to: string, subject: string, body: string): Promise<boolean>
  sendBulk(messages: Array<{ to: string; subject: string; body: string }>): Promise<number>
}

interface Logger {
  info(message: string, meta?: Record<string, unknown>): void
  error(message: string, error?: Error): void
  warn(message: string): void
}

type MockFunction<TArgs extends unknown[], TReturn> = {
  (...args: TArgs): TReturn
  calls: TArgs[]
  returnValues: TReturn[]
  mockReturnValue(value: TReturn): void
  mockImplementation(fn: (...args: TArgs) => TReturn): void
  calledWith(...args: TArgs): boolean
  calledTimes(): number
  reset(): void
}

function createMockFn<TArgs extends unknown[], TReturn>(
  defaultReturn: TReturn
): MockFunction<TArgs, TReturn> {
  let returnValue: TReturn = defaultReturn
  let implementation: ((...args: TArgs) => TReturn) | null = null
  const calls: TArgs[] = []
  const returnValues: TReturn[] = []

  const fn = ((...args: TArgs): TReturn => {
    calls.push(args)
    const result = implementation ? implementation(...args) : returnValue
    returnValues.push(result)
    return result
  }) as MockFunction<TArgs, TReturn>

  fn.calls = calls
  fn.returnValues = returnValues
  fn.mockReturnValue = (value: TReturn) => { returnValue = value }
  fn.mockImplementation = (impl: (...args: TArgs) => TReturn) => { implementation = impl }
  fn.calledWith = (...args: TArgs) =>
    calls.some((call) => JSON.stringify(call) === JSON.stringify(args))
  fn.calledTimes = () => calls.length
  fn.reset = () => {
    calls.length = 0
    returnValues.length = 0
    implementation = null
    returnValue = defaultReturn
  }

  return fn
}

type MockOf<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? MockFunction<A, R>
    : T[K]
}

type DefaultReturnValues<T> = {
  [K in keyof T]?: T[K] extends (...args: infer _A) => infer R ? R : T[K]
}

function createMock<T>(
  defaults: DefaultReturnValues<T>
): MockOf<T> {
  const mock = {} as Record<string, unknown>
  for (const [key, defaultValue] of Object.entries(defaults as Record<string, unknown>)) {
    mock[key] = createMockFn(defaultValue)
  }
  return mock as MockOf<T>
}

export function Task12_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Typed Mock: UserRepository ===')
    const mockRepo = createMock<UserRepository>({
      findById: Promise.resolve(null),
      findAll: Promise.resolve([]),
      save: Promise.resolve({ id: '1', name: '', email: '' }),
      delete: Promise.resolve(false),
    })

    mockRepo.findById.mockReturnValue(
      Promise.resolve({ id: 'user-1', name: 'Alice', email: 'alice@test.com' })
    )

    mockRepo.findById('user-1')
    mockRepo.findById('user-2')
    log.push(`  findById called ${mockRepo.findById.calledTimes()} times`)
    log.push(`  findById called with 'user-1': ${mockRepo.findById.calledWith('user-1')}`)
    log.push(`  findById called with 'user-3': ${mockRepo.findById.calledWith('user-3')}`)

    log.push('')
    log.push('=== Typed Mock: EmailService ===')
    const mockEmail = createMock<EmailService>({
      send: Promise.resolve(true),
      sendBulk: Promise.resolve(0),
    })

    mockEmail.send.mockImplementation(
      (to, subject, _body) => Promise.resolve(to.includes('@') && subject.length > 0)
    )
    mockEmail.send('alice@test.com', 'Hello', 'World')
    mockEmail.send('invalid', '', 'Body')
    log.push(`  send called ${mockEmail.send.calledTimes()} times`)
    log.push(`  Call 1 args: ${JSON.stringify(mockEmail.send.calls[0])}`)
    log.push(`  Call 2 args: ${JSON.stringify(mockEmail.send.calls[1])}`)

    log.push('')
    log.push('=== Typed Mock: Logger ===')
    const mockLogger = createMock<Logger>({
      info: undefined,
      error: undefined,
      warn: undefined,
    })

    mockLogger.info('User created', { userId: 'user-1' })
    mockLogger.error('Failed to save', new Error('DB timeout'))
    mockLogger.warn('Slow query detected')

    log.push(`  info calls: ${mockLogger.info.calledTimes()}`)
    log.push(`  error calls: ${mockLogger.error.calledTimes()}`)
    log.push(`  warn calls: ${mockLogger.warn.calledTimes()}`)
    log.push(`  info called with 'User created': ${mockLogger.info.calledWith('User created', { userId: 'user-1' })}`)

    log.push('')
    log.push('=== Mock reset ===')
    mockRepo.findById.reset()
    log.push(`  findById calls after reset: ${mockRepo.findById.calledTimes()}`)

    log.push('')
    log.push('=== Type safety guarantees ===')
    log.push('  mockRepo.findById accepts (string) — TS error for wrong args')
    log.push('  mockEmail.send accepts (string, string, string)')
    log.push('  mockReturnValue accepts only the return type of the method')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.1: Typed Mocks</h2>
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
// Задание 12.2: Type-Safe Fixtures — Решение
// ============================================

interface User {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly role: 'admin' | 'user' | 'moderator'
  readonly createdAt: number
  readonly settings: {
    readonly theme: 'light' | 'dark'
    readonly notifications: boolean
  }
}

interface Post {
  readonly id: string
  readonly title: string
  readonly content: string
  readonly authorId: string
  readonly status: 'draft' | 'published' | 'archived'
  readonly tags: string[]
  readonly createdAt: number
}

interface Comment {
  readonly id: string
  readonly postId: string
  readonly authorId: string
  readonly text: string
  readonly createdAt: number
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type FixtureFactory<T> = {
  build(overrides?: DeepPartial<T>): T
  buildMany(count: number, overrides?: DeepPartial<T>): T[]
  buildWith<K extends keyof T>(key: K, value: T[K]): T
  reset(): void
}

function createFixtureFactory<T>(
  defaults: () => T,
  sequenceKey?: keyof T
): FixtureFactory<T> {
  let counter = 0

  function deepMerge(base: Record<string, unknown>, overrides: Record<string, unknown>): Record<string, unknown> {
    const result = { ...base }
    for (const [key, value] of Object.entries(overrides)) {
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          result[key] = deepMerge(
            (result[key] as Record<string, unknown>) || {},
            value as Record<string, unknown>
          )
        } else {
          result[key] = value
        }
      }
    }
    return result
  }

  return {
    build(overrides?: DeepPartial<T>): T {
      counter++
      const base = defaults()
      if (sequenceKey && typeof base[sequenceKey] === 'string') {
        (base as Record<string, unknown>)[sequenceKey as string] =
          `${base[sequenceKey]}-${counter}`
      }
      if (!overrides) return base
      return deepMerge(base as Record<string, unknown>, overrides as Record<string, unknown>) as T
    },

    buildMany(count: number, overrides?: DeepPartial<T>): T[] {
      return Array.from({ length: count }, () => this.build(overrides))
    },

    buildWith<K extends keyof T>(key: K, value: T[K]): T {
      return this.build({ [key]: value } as unknown as DeepPartial<T>)
    },

    reset(): void {
      counter = 0
    },
  }
}

const userFactory = createFixtureFactory<User>(
  () => ({
    id: 'user',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    createdAt: Date.now(),
    settings: { theme: 'light', notifications: true },
  }),
  'id'
)

const postFactory = createFixtureFactory<Post>(
  () => ({
    id: 'post',
    title: 'Test Post',
    content: 'Lorem ipsum dolor sit amet',
    authorId: 'user-1',
    status: 'draft',
    tags: ['test'],
    createdAt: Date.now(),
  }),
  'id'
)

const commentFactory = createFixtureFactory<Comment>(
  () => ({
    id: 'comment',
    postId: 'post-1',
    authorId: 'user-1',
    text: 'Great post!',
    createdAt: Date.now(),
  }),
  'id'
)

export function Task12_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    userFactory.reset()
    postFactory.reset()
    commentFactory.reset()

    log.push('=== Fixture Factory: basic build ===')
    const user1 = userFactory.build()
    log.push(`  User: id=${user1.id}, name=${user1.name}, role=${user1.role}`)
    log.push(`  Settings: theme=${user1.settings.theme}, notifications=${user1.settings.notifications}`)

    const user2 = userFactory.build()
    log.push(`  User 2: id=${user2.id} (auto-incremented)`)

    log.push('')
    log.push('=== Fixture Factory: overrides ===')
    const admin = userFactory.build({
      name: 'Admin User',
      role: 'admin',
      settings: { theme: 'dark' },
    })
    log.push(`  Admin: name=${admin.name}, role=${admin.role}`)
    log.push(`  Settings: theme=${admin.settings.theme}, notifications=${admin.settings.notifications}`)

    log.push('')
    log.push('=== Fixture Factory: buildMany ===')
    const users = userFactory.buildMany(3, { role: 'moderator' })
    for (const u of users) {
      log.push(`  ${u.id}: role=${u.role}`)
    }

    log.push('')
    log.push('=== Fixture Factory: buildWith ===')
    const publishedPost = postFactory.buildWith('status', 'published')
    log.push(`  Post: id=${publishedPost.id}, status=${publishedPost.status}`)

    log.push('')
    log.push('=== Fixture Factory: relationships ===')
    const author = userFactory.build({ name: 'Author' })
    const post = postFactory.build({ authorId: author.id, title: 'My Article' })
    const comments = commentFactory.buildMany(2, { postId: post.id, authorId: author.id })
    log.push(`  Author: ${author.id} (${author.name})`)
    log.push(`  Post: ${post.id} by ${post.authorId}`)
    for (const c of comments) {
      log.push(`  Comment: ${c.id} on ${c.postId} by ${c.authorId}`)
    }

    log.push('')
    log.push('=== Type safety: overrides match interface ===')
    log.push('  userFactory.build({ role: "admin" }) — TS allows')
    log.push('  userFactory.build({ role: "superadmin" }) — TS error')
    log.push('  postFactory.buildWith("status", "published") — typed key + value')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.2: Type-Safe Fixtures</h2>
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
// Задание 12.3: Contract Tests — Решение
// ============================================

interface StorageContract<T> {
  get(key: string): T | undefined
  set(key: string, value: T): void
  has(key: string): boolean
  delete(key: string): boolean
  clear(): void
  size(): number
}

type ContractTest<T> = {
  readonly name: string
  readonly test: (impl: T) => { passed: boolean; message: string }
}

type ContractSuite<T> = {
  readonly name: string
  readonly tests: ContractTest<T>[]
  run(impl: T): { name: string; results: Array<{ test: string; passed: boolean; message: string }> }
}

function createContractSuite<T>(
  name: string,
  tests: ContractTest<T>[]
): ContractSuite<T> {
  return {
    name,
    tests,
    run(impl: T) {
      const results = tests.map((t) => {
        try {
          const result = t.test(impl)
          return { test: t.name, ...result }
        } catch (e) {
          return { test: t.name, passed: false, message: `Threw: ${(e as Error).message}` }
        }
      })
      return { name, results }
    },
  }
}

function storageContractTests<T>(
  sampleValue: T,
  anotherValue: T
): ContractTest<StorageContract<T>>[] {
  return [
    {
      name: 'set and get returns the value',
      test: (storage) => {
        storage.clear()
        storage.set('key1', sampleValue)
        const result = storage.get('key1')
        const passed = JSON.stringify(result) === JSON.stringify(sampleValue)
        return { passed, message: passed ? 'get returns set value' : `Expected ${JSON.stringify(sampleValue)}, got ${JSON.stringify(result)}` }
      },
    },
    {
      name: 'get returns undefined for missing key',
      test: (storage) => {
        storage.clear()
        const result = storage.get('nonexistent')
        return { passed: result === undefined, message: result === undefined ? 'Returns undefined' : `Expected undefined, got ${String(result)}` }
      },
    },
    {
      name: 'has returns true for existing key',
      test: (storage) => {
        storage.clear()
        storage.set('key1', sampleValue)
        const result = storage.has('key1')
        return { passed: result === true, message: result ? 'has() returns true' : 'has() should return true for existing key' }
      },
    },
    {
      name: 'has returns false for missing key',
      test: (storage) => {
        storage.clear()
        const result = storage.has('missing')
        return { passed: result === false, message: !result ? 'has() returns false' : 'has() should return false for missing key' }
      },
    },
    {
      name: 'delete removes the key',
      test: (storage) => {
        storage.clear()
        storage.set('key1', sampleValue)
        const deleted = storage.delete('key1')
        const exists = storage.has('key1')
        const passed = deleted === true && exists === false
        return { passed, message: passed ? 'Key deleted successfully' : `delete=${deleted}, has=${exists}` }
      },
    },
    {
      name: 'delete returns false for missing key',
      test: (storage) => {
        storage.clear()
        const result = storage.delete('nonexistent')
        return { passed: result === false, message: !result ? 'Returns false for missing' : 'Should return false' }
      },
    },
    {
      name: 'clear removes all keys',
      test: (storage) => {
        storage.clear()
        storage.set('a', sampleValue)
        storage.set('b', anotherValue)
        storage.clear()
        const passed = storage.size() === 0
        return { passed, message: passed ? 'All keys cleared' : `Size after clear: ${storage.size()}` }
      },
    },
    {
      name: 'size returns correct count',
      test: (storage) => {
        storage.clear()
        storage.set('a', sampleValue)
        storage.set('b', anotherValue)
        const passed = storage.size() === 2
        return { passed, message: passed ? 'Size is correct' : `Expected 2, got ${storage.size()}` }
      },
    },
    {
      name: 'set overwrites existing value',
      test: (storage) => {
        storage.clear()
        storage.set('key', sampleValue)
        storage.set('key', anotherValue)
        const result = storage.get('key')
        const passed = JSON.stringify(result) === JSON.stringify(anotherValue)
        return { passed, message: passed ? 'Value overwritten' : `Expected ${JSON.stringify(anotherValue)}, got ${JSON.stringify(result)}` }
      },
    },
  ]
}

class MapStorage<T> implements StorageContract<T> {
  private store = new Map<string, T>()
  get(key: string): T | undefined { return this.store.get(key) }
  set(key: string, value: T): void { this.store.set(key, value) }
  has(key: string): boolean { return this.store.has(key) }
  delete(key: string): boolean { return this.store.delete(key) }
  clear(): void { this.store.clear() }
  size(): number { return this.store.size }
}

class ObjectStorage<T> implements StorageContract<T> {
  private store: Record<string, T> = {}
  get(key: string): T | undefined { return this.store[key] }
  set(key: string, value: T): void { this.store[key] = value }
  has(key: string): boolean { return key in this.store }
  delete(key: string): boolean {
    if (key in this.store) {
      delete this.store[key]
      return true
    }
    return false
  }
  clear(): void { this.store = {} }
  size(): number { return Object.keys(this.store).length }
}

export function Task12_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    const suite = createContractSuite(
      'StorageContract<number>',
      storageContractTests<number>(42, 99)
    )

    log.push('=== Contract Tests: MapStorage ===')
    const mapResults = suite.run(new MapStorage<number>())
    for (const r of mapResults.results) {
      const icon = r.passed ? 'PASS' : 'FAIL'
      log.push(`  [${icon}] ${r.test}: ${r.message}`)
    }
    const mapPassed = mapResults.results.filter((r) => r.passed).length
    log.push(`  Total: ${mapPassed}/${mapResults.results.length} passed`)

    log.push('')
    log.push('=== Contract Tests: ObjectStorage ===')
    const objResults = suite.run(new ObjectStorage<number>())
    for (const r of objResults.results) {
      const icon = r.passed ? 'PASS' : 'FAIL'
      log.push(`  [${icon}] ${r.test}: ${r.message}`)
    }
    const objPassed = objResults.results.filter((r) => r.passed).length
    log.push(`  Total: ${objPassed}/${objResults.results.length} passed`)

    log.push('')
    log.push('=== Contract Tests: string storage ===')
    const stringSuite = createContractSuite(
      'StorageContract<string>',
      storageContractTests<string>('hello', 'world')
    )
    const strResults = stringSuite.run(new MapStorage<string>())
    const strPassed = strResults.results.filter((r) => r.passed).length
    log.push(`  MapStorage<string>: ${strPassed}/${strResults.results.length} passed`)

    log.push('')
    log.push('=== Contract suite: both implementations are interchangeable ===')
    log.push('  MapStorage and ObjectStorage both pass the same contract')
    log.push('  Any new implementation can be verified against the same suite')
    log.push('  Contract tests catch behavioral differences between implementations')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.3: Contract Tests</h2>
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
