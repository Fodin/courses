import { useState } from 'react'

// ============================================
// Задание 7.1: Dependency Injection — Решение
// ============================================

class Token<T> {
  constructor(readonly name: string) {}
  // Phantom field for type inference
  readonly _type!: T
}

class Container {
  private bindings = new Map<Token<unknown>, () => unknown>()

  register<T>(token: Token<T>, factory: () => T): void {
    this.bindings.set(token as Token<unknown>, factory as () => unknown)
  }

  registerSingleton<T>(token: Token<T>, factory: () => T): void {
    let instance: T | null = null
    this.bindings.set(token as Token<unknown>, () => {
      if (instance === null) instance = factory()
      return instance
    })
  }

  resolve<T>(token: Token<T>): T {
    const factory = this.bindings.get(token as Token<unknown>)
    if (!factory) throw new Error(`No binding for token: ${token.name}`)
    return factory() as T
  }
}

interface Logger {
  log(message: string): string
  id: number
}

interface Database {
  query(sql: string): string
  id: number
}

let instanceCounter = 0

function createConsoleLogger(): Logger {
  const id = ++instanceCounter
  return {
    id,
    log(message: string) {
      return `[Logger#${id}] ${message}`
    },
  }
}

function createInMemoryDatabase(): Database {
  const id = ++instanceCounter
  return {
    id,
    query(sql: string) {
      return `[DB#${id}] Executed: ${sql}`
    },
  }
}

const LoggerToken = new Token<Logger>('Logger')
const DatabaseToken = new Token<Database>('Database')

export function Task7_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    instanceCounter = 0

    const container = new Container()

    // Transient — new instance each time
    container.register(LoggerToken, createConsoleLogger)

    // Singleton — same instance each time
    container.registerSingleton(DatabaseToken, createInMemoryDatabase)

    log.push('--- Transient (Logger) ---')
    const logger1 = container.resolve(LoggerToken)
    const logger2 = container.resolve(LoggerToken)
    log.push(`resolve #1: Logger#${logger1.id}`)
    log.push(`resolve #2: Logger#${logger2.id}`)
    log.push(`Same instance? ${logger1 === logger2 ? 'Yes' : 'No (different instances)'}`)
    log.push(logger1.log('Hello from logger 1'))

    log.push('')
    log.push('--- Singleton (Database) ---')
    const db1 = container.resolve(DatabaseToken)
    const db2 = container.resolve(DatabaseToken)
    log.push(`resolve #1: DB#${db1.id}`)
    log.push(`resolve #2: DB#${db2.id}`)
    log.push(`Same instance? ${db1 === db2 ? 'Yes (singleton)' : 'No'}`)
    log.push(db1.query('SELECT * FROM users'))

    log.push('')
    log.push('--- Missing binding ---')
    const UnknownToken = new Token<string>('Unknown')
    try {
      container.resolve(UnknownToken)
    } catch (e) {
      if (e instanceof Error) log.push(`Error: ${e.message}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.1: Dependency Injection</h2>
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
// Задание 7.2: Ports & Adapters — Решение
// ============================================

interface User {
  id: string
  name: string
  email: string
}

interface UserRepository {
  findById(id: string): User | null
  save(user: User): void
  findAll(): User[]
}

class InMemoryUserRepository implements UserRepository {
  private users = new Map<string, User>()

  findById(id: string): User | null {
    return this.users.get(id) ?? null
  }

  save(user: User): void {
    this.users.set(user.id, user)
  }

  findAll(): User[] {
    return Array.from(this.users.values())
  }
}

let userIdCounter = 0

class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  createUser(name: string, email: string): User {
    const user: User = { id: `usr-${++userIdCounter}`, name, email }
    this.userRepo.save(user)
    return user
  }

  getUser(id: string): User {
    const user = this.userRepo.findById(id)
    if (!user) throw new Error(`User not found: ${id}`)
    return user
  }

  listUsers(): User[] {
    return this.userRepo.findAll()
  }
}

export function Task7_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    userIdCounter = 0

    // Adapter is injected — service doesn't know about InMemory
    const repo: UserRepository = new InMemoryUserRepository()
    const service = new UserService(repo)

    log.push('--- Create users ---')
    const alice = service.createUser('Alice', 'alice@example.com')
    log.push(`Created: ${alice.name} (${alice.id})`)

    const bob = service.createUser('Bob', 'bob@example.com')
    log.push(`Created: ${bob.name} (${bob.id})`)

    log.push('')
    log.push('--- Find user ---')
    const found = service.getUser(alice.id)
    log.push(`Found: ${found.name} <${found.email}>`)

    log.push('')
    log.push('--- List all users ---')
    const all = service.listUsers()
    for (const u of all) {
      log.push(`  - ${u.name} <${u.email}>`)
    }

    log.push('')
    log.push('--- Not found error ---')
    try {
      service.getUser('usr-999')
    } catch (e) {
      if (e instanceof Error) log.push(`Error: ${e.message}`)
    }

    log.push('')
    log.push('--- Architecture ---')
    log.push('UserService depends on UserRepository (port/interface)')
    log.push('InMemoryUserRepository is the adapter (implementation)')
    log.push('Swapping to PostgresUserRepository requires zero changes in UserService')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.2: Ports & Adapters</h2>
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
// Задание 7.3: Clean Architecture — Решение
// ============================================

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'cancelled'

interface OrderItem {
  name: string
  price: number
  quantity: number
}

class Order {
  private _status: OrderStatus

  constructor(
    readonly id: string,
    readonly items: OrderItem[],
    status: OrderStatus = 'pending'
  ) {
    this._status = status
  }

  get status(): OrderStatus {
    return this._status
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  confirm(): void {
    if (this._status !== 'pending') {
      throw new Error(`Cannot confirm order in status: ${this._status}`)
    }
    this._status = 'confirmed'
  }

  cancel(): void {
    if (this._status !== 'pending' && this._status !== 'confirmed') {
      throw new Error(`Cannot cancel order in status: ${this._status}`)
    }
    this._status = 'cancelled'
  }
}

interface OrderRepository {
  save(order: Order): void
  findById(id: string): Order | null
}

class InMemoryOrderRepository implements OrderRepository {
  private orders = new Map<string, Order>()

  save(order: Order): void {
    this.orders.set(order.id, order)
  }

  findById(id: string): Order | null {
    return this.orders.get(id) ?? null
  }
}

let orderIdCounter = 0

class CreateOrderUseCase {
  constructor(private readonly orderRepo: OrderRepository) {}

  execute(items: OrderItem[]): Order {
    const order = new Order(`order-${++orderIdCounter}`, items)
    if (order.total <= 0) {
      throw new Error('Order total must be positive')
    }
    this.orderRepo.save(order)
    return order
  }
}

export function Task7_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    orderIdCounter = 0

    const repo = new InMemoryOrderRepository()
    const createOrder = new CreateOrderUseCase(repo)

    // Create order
    log.push('--- Create Order ---')
    const order = createOrder.execute([
      { name: 'Widget', price: 25, quantity: 2 },
      { name: 'Gadget', price: 50, quantity: 1 },
    ])
    log.push(`Created: ${order.id}, total: $${order.total}, status: ${order.status}`)

    // Confirm
    log.push('')
    log.push('--- State Transitions ---')
    order.confirm()
    log.push(`After confirm: status = ${order.status}`)

    // Cancel from confirmed
    order.cancel()
    log.push(`After cancel: status = ${order.status}`)

    // Invalid transitions
    log.push('')
    log.push('--- Invalid Transitions ---')
    try {
      order.confirm()
    } catch (e) {
      if (e instanceof Error) log.push(`confirm() from cancelled: ${e.message}`)
    }

    // Create another, try invalid flow
    const order2 = createOrder.execute([
      { name: 'Book', price: 15, quantity: 3 },
    ])
    log.push(`Created: ${order2.id}, total: $${order2.total}, status: ${order2.status}`)
    order2.confirm()
    log.push(`Confirmed: status = ${order2.status}`)

    // Empty order
    log.push('')
    log.push('--- Business Rule: positive total ---')
    try {
      createOrder.execute([{ name: 'Free', price: 0, quantity: 1 }])
    } catch (e) {
      if (e instanceof Error) log.push(`Error: ${e.message}`)
    }

    // Verify persistence
    log.push('')
    log.push('--- Repository ---')
    const found = repo.findById(order.id)
    log.push(`Found ${found?.id}: status = ${found?.status}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.3: Clean Architecture</h2>
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
// Задание 7.4: Module Contracts — Решение
// ============================================

interface CreateUserInput {
  name: string
  email: string
}

interface ModuleUser {
  id: string
  name: string
  email: string
}

interface Notification {
  id: string
  userId: string
  message: string
  timestamp: number
}

interface UserModuleContract {
  createUser(input: CreateUserInput): ModuleUser
  getUser(id: string): ModuleUser | null
  listUsers(): ModuleUser[]
  deleteUser(id: string): boolean
}

interface NotificationModuleContract {
  send(userId: string, message: string): void
  getHistory(userId: string): Notification[]
}

let moduleUserIdCounter = 0
let notificationIdCounter = 0

function createUserModule(): UserModuleContract {
  // Internal state — hidden from consumers
  const users = new Map<string, ModuleUser>()

  return {
    createUser(input: CreateUserInput): ModuleUser {
      const user: ModuleUser = {
        id: `u-${++moduleUserIdCounter}`,
        name: input.name,
        email: input.email,
      }
      users.set(user.id, user)
      return user
    },

    getUser(id: string): ModuleUser | null {
      return users.get(id) ?? null
    },

    listUsers(): ModuleUser[] {
      return Array.from(users.values())
    },

    deleteUser(id: string): boolean {
      return users.delete(id)
    },
  }
}

function createNotificationModule(deps: {
  users: UserModuleContract
}): NotificationModuleContract {
  // Internal state
  const notifications = new Map<string, Notification[]>()

  return {
    send(userId: string, message: string): void {
      const user = deps.users.getUser(userId)
      if (!user) throw new Error(`Cannot notify: user ${userId} not found`)

      const notification: Notification = {
        id: `notif-${++notificationIdCounter}`,
        userId,
        message,
        timestamp: Date.now(),
      }

      const existing = notifications.get(userId) ?? []
      existing.push(notification)
      notifications.set(userId, existing)
    },

    getHistory(userId: string): Notification[] {
      return notifications.get(userId) ?? []
    },
  }
}

export function Task7_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    moduleUserIdCounter = 0
    notificationIdCounter = 0

    // Wire modules through contracts
    const users = createUserModule()
    const notifications = createNotificationModule({ users })

    log.push('--- Create Users (via UserModuleContract) ---')
    const alice = users.createUser({ name: 'Alice', email: 'alice@example.com' })
    const bob = users.createUser({ name: 'Bob', email: 'bob@example.com' })
    log.push(`Created: ${alice.name} (${alice.id})`)
    log.push(`Created: ${bob.name} (${bob.id})`)

    log.push('')
    log.push('--- Send Notifications (via NotificationModuleContract) ---')
    notifications.send(alice.id, 'Welcome to the platform!')
    notifications.send(alice.id, 'Your order has been shipped')
    notifications.send(bob.id, 'Welcome, Bob!')
    log.push(`Sent 2 notifications to ${alice.name}`)
    log.push(`Sent 1 notification to ${bob.name}`)

    log.push('')
    log.push('--- Notification History ---')
    const aliceHistory = notifications.getHistory(alice.id)
    for (const n of aliceHistory) {
      log.push(`  [${n.id}] ${n.message}`)
    }

    log.push('')
    log.push('--- Cross-module validation ---')
    try {
      notifications.send('u-999', 'Hello ghost!')
    } catch (e) {
      if (e instanceof Error) log.push(`Error: ${e.message}`)
    }

    log.push('')
    log.push('--- Delete user & list ---')
    users.deleteUser(bob.id)
    const remaining = users.listUsers()
    log.push(`After deleting Bob: ${remaining.length} user(s)`)
    for (const u of remaining) {
      log.push(`  - ${u.name} <${u.email}>`)
    }

    log.push('')
    log.push('--- Contract summary ---')
    log.push('UserModule exposes: createUser, getUser, listUsers, deleteUser')
    log.push('NotificationModule exposes: send, getHistory')
    log.push('Internal state (Maps) is hidden — only contracts are public')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.4: Module Contracts</h2>
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
