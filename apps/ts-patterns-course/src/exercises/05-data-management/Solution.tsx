import { useState } from 'react'

// ============================================
// Задание 5.1: Repository — Решение
// ============================================

interface Entity {
  id: string
}

interface Repository<T extends Entity> {
  findById(id: string): T | undefined
  findAll(): T[]
  create(entity: T): T
  update(id: string, updates: Partial<T>): T | undefined
  delete(id: string): boolean
}

class InMemoryRepository<T extends Entity> implements Repository<T> {
  private store = new Map<string, T>()

  findById(id: string): T | undefined {
    return this.store.get(id)
  }

  findAll(): T[] {
    return Array.from(this.store.values())
  }

  create(entity: T): T {
    this.store.set(entity.id, { ...entity })
    return entity
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const existing = this.store.get(id)
    if (!existing) return undefined
    const updated = { ...existing, ...updates }
    this.store.set(id, updated)
    return updated
  }

  delete(id: string): boolean {
    return this.store.delete(id)
  }
}

interface User extends Entity {
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

export function Task5_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const repo = new InMemoryRepository<User>()

    log.push('--- Create ---')
    repo.create({ id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin' })
    repo.create({ id: '2', name: 'Bob', email: 'bob@example.com', role: 'user' })
    repo.create({ id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'guest' })
    log.push(`Created 3 users`)
    log.push(`findAll(): ${repo.findAll().length} users`)

    log.push('')
    log.push('--- Read ---')
    const alice = repo.findById('1')
    log.push(`findById("1"): ${alice ? `${alice.name} (${alice.role})` : 'not found'}`)
    const unknown = repo.findById('999')
    log.push(`findById("999"): ${unknown ? unknown.name : 'undefined'}`)

    log.push('')
    log.push('--- Update ---')
    const updated = repo.update('2', { role: 'admin', name: 'Bob Senior' })
    log.push(`update("2", { role: "admin" }): ${updated ? `${updated.name} (${updated.role})` : 'undefined'}`)
    const notFound = repo.update('999', { name: 'Ghost' })
    log.push(`update("999", ...): ${notFound ? notFound.name : 'undefined'}`)

    log.push('')
    log.push('--- Delete ---')
    const deleted = repo.delete('3')
    log.push(`delete("3"): ${deleted}`)
    const deletedAgain = repo.delete('3')
    log.push(`delete("3") again: ${deletedAgain}`)
    log.push(`findAll(): ${repo.findAll().length} users`)

    log.push('')
    log.push('--- Final state ---')
    repo.findAll().forEach(u => {
      log.push(`  ${u.id}: ${u.name} <${u.email}> [${u.role}]`)
    })

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Repository</h2>
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
// Задание 5.2: Unit of Work — Решение
// ============================================

interface UnitOfWork {
  registerNew<T extends Entity>(entity: T, repoName: string): void
  registerDirty<T extends Entity>(entity: T, repoName: string): void
  registerDeleted(id: string, repoName: string): void
  commit(): string[]
  rollback(): void
}

interface PendingNew {
  kind: 'new'
  entity: Entity
  repoName: string
}

interface PendingDirty {
  kind: 'dirty'
  entity: Entity
  repoName: string
}

interface PendingDelete {
  kind: 'delete'
  id: string
  repoName: string
}

type PendingOp = PendingNew | PendingDirty | PendingDelete

class InMemoryUnitOfWork implements UnitOfWork {
  private pending: PendingOp[] = []

  constructor(private repos: Map<string, Repository<Entity>>) {}

  registerNew<T extends Entity>(entity: T, repoName: string): void {
    this.pending.push({ kind: 'new', entity, repoName })
  }

  registerDirty<T extends Entity>(entity: T, repoName: string): void {
    this.pending.push({ kind: 'dirty', entity, repoName })
  }

  registerDeleted(id: string, repoName: string): void {
    this.pending.push({ kind: 'delete', id, repoName })
  }

  commit(): string[] {
    const log: string[] = []
    const creates = this.pending.filter((op): op is PendingNew => op.kind === 'new')
    const updates = this.pending.filter((op): op is PendingDirty => op.kind === 'dirty')
    const deletes = this.pending.filter((op): op is PendingDelete => op.kind === 'delete')

    for (const op of creates) {
      const repo = this.repos.get(op.repoName)
      if (repo) {
        repo.create(op.entity)
        log.push(`[CREATE] ${op.repoName}: id=${op.entity.id}`)
      }
    }

    for (const op of updates) {
      const repo = this.repos.get(op.repoName)
      if (repo) {
        repo.update(op.entity.id, op.entity)
        log.push(`[UPDATE] ${op.repoName}: id=${op.entity.id}`)
      }
    }

    for (const op of deletes) {
      const repo = this.repos.get(op.repoName)
      if (repo) {
        repo.delete(op.id)
        log.push(`[DELETE] ${op.repoName}: id=${op.id}`)
      }
    }

    this.pending = []
    return log
  }

  rollback(): void {
    this.pending = []
  }
}

interface Product extends Entity {
  name: string
  price: number
}

export function Task5_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    const userRepo = new InMemoryRepository<User>()
    const productRepo = new InMemoryRepository<Product>()

    const repos = new Map<string, Repository<Entity>>()
    repos.set('users', userRepo as Repository<Entity>)
    repos.set('products', productRepo as Repository<Entity>)

    // Scenario 1: Commit
    log.push('=== Scenario 1: Commit ===')
    const uow1 = new InMemoryUnitOfWork(repos)
    uow1.registerNew<User>({ id: 'u1', name: 'Alice', email: 'alice@test.com', role: 'admin' }, 'users')
    uow1.registerNew<User>({ id: 'u2', name: 'Bob', email: 'bob@test.com', role: 'user' }, 'users')
    uow1.registerNew<Product>({ id: 'p1', name: 'Laptop', price: 999 }, 'products')

    log.push('Before commit:')
    log.push(`  Users: ${userRepo.findAll().length}`)
    log.push(`  Products: ${productRepo.findAll().length}`)

    const ops = uow1.commit()
    ops.forEach(o => log.push(`  ${o}`))

    log.push('After commit:')
    log.push(`  Users: ${userRepo.findAll().length}`)
    log.push(`  Products: ${productRepo.findAll().length}`)

    // Scenario 2: Update + delete in one transaction
    log.push('')
    log.push('=== Scenario 2: Update + Delete ===')
    const uow2 = new InMemoryUnitOfWork(repos)
    uow2.registerDirty<User>({ id: 'u1', name: 'Alice Updated', email: 'alice@new.com', role: 'admin' }, 'users')
    uow2.registerDeleted('u2', 'users')

    const ops2 = uow2.commit()
    ops2.forEach(o => log.push(`  ${o}`))

    log.push('After commit:')
    userRepo.findAll().forEach(u => log.push(`  ${u.id}: ${u.name} <${u.email}>`))

    // Scenario 3: Rollback
    log.push('')
    log.push('=== Scenario 3: Rollback ===')
    const uow3 = new InMemoryUnitOfWork(repos)
    uow3.registerNew<User>({ id: 'u99', name: 'Ghost', email: 'ghost@test.com', role: 'guest' }, 'users')
    uow3.registerDeleted('p1', 'products')

    log.push('Pending operations registered...')
    uow3.rollback()
    log.push('Rollback called!')
    log.push(`Users: ${userRepo.findAll().length} (unchanged)`)
    log.push(`Products: ${productRepo.findAll().length} (unchanged)`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: Unit of Work</h2>
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
// Задание 5.3: CQRS — Решение
// ============================================

interface Command {
  type: string
}

interface Query {
  type: string
}

interface CommandHandler<C extends Command> {
  execute(command: C): void
}

interface QueryHandler<Q extends Query, R> {
  execute(query: Q): R
}

class CommandBus {
  private handlers = new Map<string, CommandHandler<Command>>()

  register<C extends Command>(type: string, handler: CommandHandler<C>): void {
    this.handlers.set(type, handler as CommandHandler<Command>)
  }

  dispatch(command: Command): void {
    const handler = this.handlers.get(command.type)
    if (!handler) {
      throw new Error(`No handler registered for command: ${command.type}`)
    }
    handler.execute(command)
  }
}

class QueryBus {
  private handlers = new Map<string, QueryHandler<Query, unknown>>()

  register<Q extends Query, R>(type: string, handler: QueryHandler<Q, R>): void {
    this.handlers.set(type, handler as QueryHandler<Query, unknown>)
  }

  dispatch<R>(query: Query): R {
    const handler = this.handlers.get(query.type)
    if (!handler) {
      throw new Error(`No handler registered for query: ${query.type}`)
    }
    return handler.execute(query) as R
  }
}

interface Todo {
  id: string
  title: string
  completed: boolean
}

interface CreateTodoCommand extends Command {
  type: 'CreateTodo'
  id: string
  title: string
}

interface CompleteTodoCommand extends Command {
  type: 'CompleteTodo'
  id: string
}

interface GetAllTodosQuery extends Query {
  type: 'GetAllTodos'
}

interface GetTodoByIdQuery extends Query {
  type: 'GetTodoById'
  id: string
}

class CreateTodoHandler implements CommandHandler<CreateTodoCommand> {
  constructor(private store: Map<string, Todo>) {}

  execute(command: CreateTodoCommand): void {
    this.store.set(command.id, {
      id: command.id,
      title: command.title,
      completed: false,
    })
  }
}

class CompleteTodoHandler implements CommandHandler<CompleteTodoCommand> {
  constructor(private store: Map<string, Todo>) {}

  execute(command: CompleteTodoCommand): void {
    const todo = this.store.get(command.id)
    if (!todo) throw new Error(`Todo not found: ${command.id}`)
    this.store.set(command.id, { ...todo, completed: true })
  }
}

class GetAllTodosHandler implements QueryHandler<GetAllTodosQuery, Todo[]> {
  constructor(private store: Map<string, Todo>) {}

  execute(_query: GetAllTodosQuery): Todo[] {
    return Array.from(this.store.values())
  }
}

class GetTodoByIdHandler implements QueryHandler<GetTodoByIdQuery, Todo | undefined> {
  constructor(private store: Map<string, Todo>) {}

  execute(query: GetTodoByIdQuery): Todo | undefined {
    return this.store.get(query.id)
  }
}

export function Task5_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const todoStore = new Map<string, Todo>()

    // Setup buses
    const commandBus = new CommandBus()
    const queryBus = new QueryBus()

    commandBus.register<CreateTodoCommand>('CreateTodo', new CreateTodoHandler(todoStore))
    commandBus.register<CompleteTodoCommand>('CompleteTodo', new CompleteTodoHandler(todoStore))
    queryBus.register<GetAllTodosQuery, Todo[]>('GetAllTodos', new GetAllTodosHandler(todoStore))
    queryBus.register<GetTodoByIdQuery, Todo | undefined>('GetTodoById', new GetTodoByIdHandler(todoStore))

    // Create todos via CommandBus
    log.push('--- Commands: Create Todos ---')
    commandBus.dispatch({ type: 'CreateTodo', id: 't1', title: 'Learn TypeScript' } as CreateTodoCommand)
    log.push('Dispatched: CreateTodo "Learn TypeScript"')
    commandBus.dispatch({ type: 'CreateTodo', id: 't2', title: 'Learn CQRS' } as CreateTodoCommand)
    log.push('Dispatched: CreateTodo "Learn CQRS"')
    commandBus.dispatch({ type: 'CreateTodo', id: 't3', title: 'Build a project' } as CreateTodoCommand)
    log.push('Dispatched: CreateTodo "Build a project"')

    // Query all todos
    log.push('')
    log.push('--- Query: GetAllTodos ---')
    const allTodos = queryBus.dispatch<Todo[]>({ type: 'GetAllTodos' })
    allTodos.forEach(t => log.push(`  [${t.completed ? 'x' : ' '}] ${t.id}: ${t.title}`))

    // Complete a todo
    log.push('')
    log.push('--- Command: CompleteTodo ---')
    commandBus.dispatch({ type: 'CompleteTodo', id: 't1' } as CompleteTodoCommand)
    log.push('Dispatched: CompleteTodo "t1"')

    // Query single todo
    log.push('')
    log.push('--- Query: GetTodoById ---')
    const todo = queryBus.dispatch<Todo | undefined>({ type: 'GetTodoById', id: 't1' } as GetTodoByIdQuery)
    log.push(`  t1: "${todo?.title}" completed=${todo?.completed}`)

    // Query all again
    log.push('')
    log.push('--- Query: GetAllTodos (after complete) ---')
    const updated = queryBus.dispatch<Todo[]>({ type: 'GetAllTodos' })
    updated.forEach(t => log.push(`  [${t.completed ? 'x' : ' '}] ${t.id}: ${t.title}`))

    // Error handling
    log.push('')
    log.push('--- Error: Unknown command ---')
    try {
      commandBus.dispatch({ type: 'DeleteTodo' })
    } catch (e) {
      log.push(`Caught: ${(e as Error).message}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: CQRS</h2>
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
// Задание 5.4: Event Sourcing — Решение
// ============================================

interface DomainEvent {
  type: string
  timestamp: number
  aggregateId: string
}

interface AccountOpened extends DomainEvent {
  type: 'AccountOpened'
  ownerName: string
}

interface MoneyDeposited extends DomainEvent {
  type: 'MoneyDeposited'
  amount: number
}

interface MoneyWithdrawn extends DomainEvent {
  type: 'MoneyWithdrawn'
  amount: number
}

interface AccountClosed extends DomainEvent {
  type: 'AccountClosed'
  reason: string
}

type AccountEvent = AccountOpened | MoneyDeposited | MoneyWithdrawn | AccountClosed

interface AccountState {
  ownerName: string
  balance: number
  isOpen: boolean
  transactions: number
}

const initialAccountState: AccountState = {
  ownerName: '',
  balance: 0,
  isOpen: false,
  transactions: 0,
}

function applyEvent(state: AccountState, event: AccountEvent): AccountState {
  switch (event.type) {
    case 'AccountOpened':
      return { ...state, ownerName: event.ownerName, balance: 0, isOpen: true, transactions: 0 }
    case 'MoneyDeposited':
      return { ...state, balance: state.balance + event.amount, transactions: state.transactions + 1 }
    case 'MoneyWithdrawn':
      return { ...state, balance: state.balance - event.amount, transactions: state.transactions + 1 }
    case 'AccountClosed':
      return { ...state, isOpen: false }
  }
}

function replay(events: AccountEvent[]): AccountState {
  return events.reduce(applyEvent, initialAccountState)
}

class EventStore {
  private events: AccountEvent[] = []

  append(event: AccountEvent): void {
    this.events.push(event)
  }

  getEvents(aggregateId: string): AccountEvent[] {
    return this.events.filter(e => e.aggregateId === aggregateId)
  }

  getEventsAfter(aggregateId: string, timestamp: number): AccountEvent[] {
    return this.events.filter(e => e.aggregateId === aggregateId && e.timestamp > timestamp)
  }
}

function formatEvent(event: AccountEvent): string {
  switch (event.type) {
    case 'AccountOpened':
      return `AccountOpened (owner: ${event.ownerName})`
    case 'MoneyDeposited':
      return `MoneyDeposited (+${event.amount})`
    case 'MoneyWithdrawn':
      return `MoneyWithdrawn (-${event.amount})`
    case 'AccountClosed':
      return `AccountClosed (reason: ${event.reason})`
  }
}

export function Task5_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const store = new EventStore()
    const accountId = 'acc-001'

    const baseTime = Date.now()

    // Build event history
    const events: AccountEvent[] = [
      { type: 'AccountOpened', aggregateId: accountId, timestamp: baseTime, ownerName: 'Alice' },
      { type: 'MoneyDeposited', aggregateId: accountId, timestamp: baseTime + 1000, amount: 1000 },
      { type: 'MoneyDeposited', aggregateId: accountId, timestamp: baseTime + 2000, amount: 500 },
      { type: 'MoneyWithdrawn', aggregateId: accountId, timestamp: baseTime + 3000, amount: 200 },
      { type: 'MoneyDeposited', aggregateId: accountId, timestamp: baseTime + 4000, amount: 300 },
      { type: 'MoneyWithdrawn', aggregateId: accountId, timestamp: baseTime + 5000, amount: 150 },
    ]

    events.forEach(e => store.append(e))

    // Show event log
    log.push('--- Event Log ---')
    const allEvents = store.getEvents(accountId)
    allEvents.forEach((e, i) => {
      log.push(`  ${i + 1}. ${formatEvent(e)}`)
    })

    // Replay full state
    log.push('')
    log.push('--- Full Replay ---')
    const currentState = replay(allEvents)
    log.push(`  Owner: ${currentState.ownerName}`)
    log.push(`  Balance: ${currentState.balance}`)
    log.push(`  Transactions: ${currentState.transactions}`)
    log.push(`  Is Open: ${currentState.isOpen}`)

    // Replay partial state (first 3 events = after 2nd deposit)
    log.push('')
    log.push('--- Replay after 3 events (time travel) ---')
    const partialEvents = allEvents.slice(0, 3)
    const pastState = replay(partialEvents)
    log.push(`  Balance at that point: ${pastState.balance}`)
    log.push(`  Transactions at that point: ${pastState.transactions}`)

    // Get events after certain timestamp
    log.push('')
    log.push('--- Events after 2nd deposit ---')
    const laterEvents = store.getEventsAfter(accountId, baseTime + 2000)
    laterEvents.forEach(e => {
      log.push(`  ${formatEvent(e)}`)
    })

    // Close account
    log.push('')
    log.push('--- Close Account ---')
    const closeEvent: AccountClosed = {
      type: 'AccountClosed',
      aggregateId: accountId,
      timestamp: baseTime + 6000,
      reason: 'Customer request',
    }
    store.append(closeEvent)

    const finalState = replay(store.getEvents(accountId))
    log.push(`  Balance: ${finalState.balance}`)
    log.push(`  Is Open: ${finalState.isOpen}`)
    log.push(`  Total transactions: ${finalState.transactions}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.4: Event Sourcing</h2>
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
