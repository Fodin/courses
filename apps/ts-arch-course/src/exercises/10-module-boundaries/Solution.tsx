import { useState } from 'react'

// ============================================
// Задание 10.1: Public API Surface — Решение
// ============================================

// === Internal types (not exported from module) ===
interface InternalUserRecord {
  _id: string
  _rev: number
  firstName: string
  lastName: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

// === Public types (exported from module) ===
interface PublicUser {
  id: string
  name: string
  email: string
  createdAt: Date
}

interface CreateUserInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface UpdateUserInput {
  firstName?: string
  lastName?: string
  email?: string
}

interface UserQueryOptions {
  limit?: number
  offset?: number
  sortBy?: 'name' | 'email' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// === Internal implementation ===
function toPublicUser(record: InternalUserRecord): PublicUser {
  return {
    id: record._id,
    name: `${record.firstName} ${record.lastName}`,
    email: record.email,
    createdAt: record.createdAt,
  }
}

// === Public API (barrel export) ===
interface UserModule {
  createUser: (input: CreateUserInput) => PublicUser
  getUser: (id: string) => PublicUser | null
  updateUser: (id: string, input: UpdateUserInput) => PublicUser
  listUsers: (options?: UserQueryOptions) => PublicUser[]
  deleteUser: (id: string) => boolean
}

function createUserModule(): UserModule {
  const store = new Map<string, InternalUserRecord>()

  return {
    createUser(input: CreateUserInput): PublicUser {
      const record: InternalUserRecord = {
        _id: `usr-${Date.now()}`,
        _rev: 1,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        passwordHash: `hashed:${input.password}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }
      store.set(record._id, record)
      return toPublicUser(record)
    },
    getUser(id: string): PublicUser | null {
      const record = store.get(id)
      return record ? toPublicUser(record) : null
    },
    updateUser(id: string, input: UpdateUserInput): PublicUser {
      const record = store.get(id)
      if (!record) throw new Error(`User ${id} not found`)
      const updated = {
        ...record,
        ...input,
        _rev: record._rev + 1,
        updatedAt: new Date(),
      }
      store.set(id, updated)
      return toPublicUser(updated)
    },
    listUsers(options?: UserQueryOptions): PublicUser[] {
      const users = Array.from(store.values())
        .filter((r) => !r.deletedAt)
        .map(toPublicUser)

      const sorted = options?.sortBy
        ? users.sort((a, b) => {
            const key = options.sortBy!
            const aVal = String(a[key])
            const bVal = String(b[key])
            return options.sortOrder === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
          })
        : users

      const offset = options?.offset ?? 0
      const limit = options?.limit ?? sorted.length
      return sorted.slice(offset, offset + limit)
    },
    deleteUser(id: string): boolean {
      const record = store.get(id)
      if (!record) return false
      record.deletedAt = new Date()
      return true
    },
  }
}

export function Task10_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Public API Surface ===')
    log.push('')

    const users = createUserModule()

    // Create users
    const alice = users.createUser({
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      password: 'secret123',
    })
    log.push('Created user:')
    log.push(`  id: "${alice.id}"`)
    log.push(`  name: "${alice.name}"`)
    log.push(`  email: "${alice.email}"`)
    log.push(`  createdAt: ${alice.createdAt.toISOString()}`)
    log.push('')

    const bob = users.createUser({
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob@example.com',
      password: 'password456',
    })

    // List users
    const allUsers = users.listUsers({ sortBy: 'name', sortOrder: 'asc' })
    log.push('List users (sorted by name):')
    allUsers.forEach((u) => log.push(`  ${u.name} (${u.email})`))
    log.push('')

    // Update user
    const updated = users.updateUser(alice.id, { lastName: 'Williams' })
    log.push('Updated user:')
    log.push(`  name: "${updated.name}" (was "Alice Johnson")`)
    log.push('')

    // Delete user
    const deleted = users.deleteUser(bob.id)
    log.push(`Delete Bob: ${deleted}`)
    const afterDelete = users.listUsers()
    log.push(`Users after delete: ${afterDelete.length}`)
    log.push('')

    log.push('Public API vs Internal:')
    log.push('  Public:   PublicUser { id, name, email, createdAt }')
    log.push('  Internal: InternalUserRecord { _id, _rev, passwordHash, ... }')
    log.push('')
    log.push('Type safety:')
    log.push('  alice.passwordHash  // Error: not in PublicUser')
    log.push('  alice._rev          // Error: not in PublicUser')
    log.push('  alice.name          // OK: "Alice Johnson"')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.1: Public API Surface</h2>
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
// Задание 10.2: Cross-Module Contracts — Решение
// ============================================

// === Shared contracts ===
interface Entity {
  id: string
  createdAt: Date
  updatedAt: Date
}

interface Repository<T extends Entity> {
  findById(id: string): T | null
  findAll(filter?: Partial<T>): T[]
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T
  update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): T
  delete(id: string): boolean
}

interface EventBus<TEvents extends object> {
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void
  on<K extends keyof TEvents>(event: K, handler: (payload: TEvents[K]) => void): () => void
}

// === Module A: Products ===
interface Product extends Entity {
  name: string
  price: number
  stock: number
}

interface ProductEvents {
  'product:created': { product: Product }
  'product:updated': { product: Product; changes: Partial<Product> }
  'product:out-of-stock': { productId: string; productName: string }
}

function createProductModule(
  repo: Repository<Product>,
  events: EventBus<ProductEvents>
) {
  return {
    addProduct(name: string, price: number, stock: number): Product {
      const product = repo.create({ name, price, stock })
      events.emit('product:created', { product })
      return product
    },
    updateStock(id: string, delta: number): Product {
      const product = repo.findById(id)
      if (!product) throw new Error(`Product ${id} not found`)
      const updated = repo.update(id, { stock: product.stock + delta })
      if (updated.stock <= 0) {
        events.emit('product:out-of-stock', { productId: id, productName: updated.name })
      }
      events.emit('product:updated', { product: updated, changes: { stock: updated.stock } })
      return updated
    },
    getProduct(id: string): Product | null {
      return repo.findById(id)
    },
  }
}

// === Module B: Orders (depends on Product contract) ===
interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

interface Order extends Entity {
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped'
}

function createOrderModule(
  repo: Repository<Order>,
  productModule: { getProduct: (id: string) => Product | null },
  events: EventBus<ProductEvents>
) {
  // Listen for out-of-stock events
  events.on('product:out-of-stock', ({ productId, productName }) => {
    void productId
    void productName
  })

  return {
    createOrder(items: Array<{ productId: string; quantity: number }>): Order {
      const orderItems: OrderItem[] = items.map((item) => {
        const product = productModule.getProduct(item.productId)
        if (!product) throw new Error(`Product ${item.productId} not found`)
        if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`)
        return {
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
        }
      })
      const total = orderItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
      return repo.create({ items: orderItems, total, status: 'pending' })
    },
    getOrder(id: string): Order | null {
      return repo.findById(id)
    },
  }
}

// === In-memory implementations ===
function createInMemoryRepo<T extends Entity>(): Repository<T> {
  const store = new Map<string, T>()
  let counter = 0

  return {
    findById(id) { return store.get(id) ?? null },
    findAll(filter) {
      let items = Array.from(store.values())
      if (filter) {
        items = items.filter((item) =>
          Object.entries(filter).every(([k, v]) => (item as Record<string, unknown>)[k] === v)
        )
      }
      return items
    },
    create(data) {
      counter++
      const entity = {
        ...data,
        id: `entity-${counter}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as T
      store.set(entity.id, entity)
      return entity
    },
    update(id, data) {
      const existing = store.get(id)
      if (!existing) throw new Error(`Entity ${id} not found`)
      const updated = { ...existing, ...data, updatedAt: new Date() }
      store.set(id, updated)
      return updated
    },
    delete(id) { return store.delete(id) },
  }
}

function createEventBus<TEvents extends object>(): EventBus<TEvents> {
  const handlers = new Map<string, Array<(payload: unknown) => void>>()

  return {
    emit(event, payload) {
      const list = handlers.get(event as string) ?? []
      list.forEach((h) => h(payload))
    },
    on(event, handler) {
      const key = event as string
      if (!handlers.has(key)) handlers.set(key, [])
      handlers.get(key)!.push(handler as (payload: unknown) => void)
      return () => {
        const list = handlers.get(key) ?? []
        const idx = list.indexOf(handler as (payload: unknown) => void)
        if (idx >= 0) list.splice(idx, 1)
      }
    },
  }
}

export function Task10_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Cross-Module Contracts ===')
    log.push('')

    const productRepo = createInMemoryRepo<Product>()
    const orderRepo = createInMemoryRepo<Order>()
    const events = createEventBus<ProductEvents>()

    // Track events
    const eventLog: string[] = []
    events.on('product:created', ({ product }) => {
      eventLog.push(`[EVENT] product:created — "${product.name}"`)
    })
    events.on('product:out-of-stock', ({ productName }) => {
      eventLog.push(`[EVENT] product:out-of-stock — "${productName}"`)
    })

    const products = createProductModule(productRepo, events)
    const orders = createOrderModule(orderRepo, products, events)

    // Add products
    const laptop = products.addProduct('Laptop', 999.99, 5)
    const mouse = products.addProduct('Mouse', 29.99, 100)
    log.push('Products created:')
    log.push(`  ${laptop.name}: $${laptop.price} (stock: ${laptop.stock})`)
    log.push(`  ${mouse.name}: $${mouse.price} (stock: ${mouse.stock})`)
    log.push('')

    // Create order through contract
    const order = orders.createOrder([
      { productId: laptop.id, quantity: 1 },
      { productId: mouse.id, quantity: 2 },
    ])
    log.push('Order created:')
    log.push(`  id: "${order.id}"`)
    log.push(`  items: ${order.items.length}`)
    order.items.forEach((item) => {
      log.push(`    ${item.productName}: ${item.quantity}x $${item.unitPrice}`)
    })
    log.push(`  total: $${order.total.toFixed(2)}`)
    log.push('')

    // Deplete stock
    products.updateStock(laptop.id, -5)
    log.push('After depleting laptop stock:')
    const updatedLaptop = products.getProduct(laptop.id)
    log.push(`  stock: ${updatedLaptop?.stock}`)
    log.push('')

    // Event log
    log.push('Events emitted:')
    eventLog.forEach((e) => log.push(`  ${e}`))
    log.push('')

    log.push('Contract types:')
    log.push('  Repository<T extends Entity> — generic CRUD contract')
    log.push('  EventBus<TEvents> — typed pub/sub contract')
    log.push('  Product module exposes: addProduct, updateStock, getProduct')
    log.push('  Order module depends on: { getProduct } (minimal interface)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.2: Cross-Module Contracts</h2>
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
// Задание 10.3: Dependency Inversion — Решение
// ============================================

// === Port interfaces (abstractions) ===
interface Logger {
  info(message: string, context?: Record<string, unknown>): void
  error(message: string, error?: Error): void
  warn(message: string): void
}

interface Cache<T> {
  get(key: string): T | null
  set(key: string, value: T, ttlMs?: number): void
  delete(key: string): boolean
  clear(): void
}

interface NotificationService {
  sendEmail(to: string, subject: string, body: string): boolean
  sendPush(userId: string, message: string): boolean
}

interface UserStore {
  findById(id: string): { id: string; name: string; email: string } | null
  save(user: { id: string; name: string; email: string }): void
}

// === Domain service depending on abstractions ===
interface UserServiceDeps {
  logger: Logger
  cache: Cache<{ id: string; name: string; email: string }>
  notifications: NotificationService
  store: UserStore
}

function createUserService(deps: UserServiceDeps) {
  const { logger, cache, notifications, store } = deps

  return {
    getUser(id: string) {
      const cached = cache.get(`user:${id}`)
      if (cached) {
        logger.info('Cache hit', { userId: id })
        return cached
      }

      const user = store.findById(id)
      if (user) {
        cache.set(`user:${id}`, user, 60000)
        logger.info('User loaded from store', { userId: id })
      } else {
        logger.warn(`User ${id} not found`)
      }
      return user
    },

    updateUser(id: string, name: string) {
      const user = store.findById(id)
      if (!user) {
        logger.error(`Cannot update: user ${id} not found`)
        return null
      }

      const updated = { ...user, name }
      store.save(updated)
      cache.delete(`user:${id}`)
      logger.info('User updated', { userId: id, name })
      notifications.sendEmail(updated.email, 'Profile Updated', `Your name was changed to ${name}`)
      return updated
    },
  }
}

// === Adapter implementations ===
function createConsoleLogger(): Logger & { getLogs(): string[] } {
  const logs: string[] = []
  return {
    info(message, context) {
      const entry = context ? `[INFO] ${message} ${JSON.stringify(context)}` : `[INFO] ${message}`
      logs.push(entry)
    },
    error(message, error) {
      logs.push(`[ERROR] ${message}${error ? `: ${error.message}` : ''}`)
    },
    warn(message) {
      logs.push(`[WARN] ${message}`)
    },
    getLogs() { return [...logs] },
  }
}

function createMemoryCache<T>(): Cache<T> & { getSize(): number } {
  const data = new Map<string, { value: T; expiresAt: number | null }>()

  return {
    get(key) {
      const entry = data.get(key)
      if (!entry) return null
      if (entry.expiresAt && entry.expiresAt < Date.now()) {
        data.delete(key)
        return null
      }
      return entry.value
    },
    set(key, value, ttlMs) {
      data.set(key, { value, expiresAt: ttlMs ? Date.now() + ttlMs : null })
    },
    delete(key) { return data.delete(key) },
    clear() { data.clear() },
    getSize() { return data.size },
  }
}

function createMockNotifications(): NotificationService & { getSent(): string[] } {
  const sent: string[] = []
  return {
    sendEmail(to, subject, _body) {
      sent.push(`Email to ${to}: "${subject}"`)
      return true
    },
    sendPush(userId, message) {
      sent.push(`Push to ${userId}: "${message}"`)
      return true
    },
    getSent() { return [...sent] },
  }
}

function createMemoryUserStore(): UserStore {
  const users = new Map<string, { id: string; name: string; email: string }>()
  return {
    findById(id) { return users.get(id) ?? null },
    save(user) { users.set(user.id, user) },
  }
}

export function Task10_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Dependency Inversion ===')
    log.push('')

    // Create adapters
    const logger = createConsoleLogger()
    const cache = createMemoryCache<{ id: string; name: string; email: string }>()
    const notifications = createMockNotifications()
    const store = createMemoryUserStore()

    // Inject dependencies
    const userService = createUserService({ logger, cache, notifications, store })

    // Prepare test data
    store.save({ id: 'usr-1', name: 'Alice', email: 'alice@example.com' })
    store.save({ id: 'usr-2', name: 'Bob', email: 'bob@example.com' })

    log.push('Port interfaces (abstractions):')
    log.push('  Logger: info(), error(), warn()')
    log.push('  Cache<T>: get(), set(), delete(), clear()')
    log.push('  NotificationService: sendEmail(), sendPush()')
    log.push('  UserStore: findById(), save()')
    log.push('')

    // First fetch — cache miss
    const user1 = userService.getUser('usr-1')
    log.push(`Get user (cache miss): ${user1?.name}`)

    // Second fetch — cache hit
    const user1again = userService.getUser('usr-1')
    log.push(`Get user (cache hit): ${user1again?.name}`)

    // Not found
    const notFound = userService.getUser('usr-99')
    log.push(`Get unknown user: ${notFound}`)
    log.push('')

    // Update
    const updated = userService.updateUser('usr-1', 'Alice Williams')
    log.push(`Update user: ${updated?.name}`)
    log.push(`Cache size after update: ${cache.getSize()} (invalidated)`)
    log.push('')

    // Logger output
    log.push('Logger output:')
    logger.getLogs().forEach((l) => log.push(`  ${l}`))
    log.push('')

    // Notifications
    log.push('Notifications sent:')
    notifications.getSent().forEach((n) => log.push(`  ${n}`))
    log.push('')

    log.push('Dependency Inversion Principle:')
    log.push('  UserService depends on INTERFACES (Logger, Cache, ...)')
    log.push('  Not on implementations (ConsoleLogger, MemoryCache, ...)')
    log.push('  Adapters can be swapped without changing service code')
    log.push('  Testing: inject mocks that satisfy the same interface')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.3: Dependency Inversion</h2>
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
