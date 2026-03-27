# 🏛️ Уровень 7: Модульная архитектура

## 📖 Введение

Когда приложение растёт, простая структура «все файлы в одной папке» превращается в хаос. Модульная архитектура — это набор паттернов, которые помогают **изолировать части системы** друг от друга, сделать их заменяемыми и тестируемыми.

> 🔥 **Ключевая идея:** Зависимости должны указывать в сторону стабильности. Бизнес-логика не зависит от базы данных. Модули общаются через контракты, а не через внутренние детали.

## 💉 Dependency Injection (DI)

### Проблема

```typescript
// ❌ Плохо: жёсткая связь
class OrderService {
  private db = new PostgresDatabase()    // привязан к Postgres
  private mailer = new SendGridMailer()  // привязан к SendGrid

  createOrder(data: OrderData) {
    this.db.save(data)
    this.mailer.send(data.email, 'Order created')
  }
}
```

Нельзя протестировать без настоящей БД и почтового сервера. Нельзя заменить Postgres на MongoDB без переписывания.

### Решение: DI-контейнер

```typescript
// Token — уникальный идентификатор зависимости с типом
class Token<T> {
  constructor(readonly name: string) {}
}

// Регистрация зависимостей
const DatabaseToken = new Token<Database>('Database')
const MailerToken = new Token<Mailer>('Mailer')

class Container {
  private bindings = new Map<Token<unknown>, () => unknown>()

  register<T>(token: Token<T>, factory: () => T): void {
    this.bindings.set(token, factory)
  }

  resolve<T>(token: Token<T>): T {
    const factory = this.bindings.get(token)
    if (!factory) throw new Error(`No binding for ${token.name}`)
    return factory() as T
  }
}
```

### Lifecycle (время жизни)

| Режим | Описание |
|-------|----------|
| 🔄 **Transient** | Новый экземпляр каждый раз (по умолчанию) |
| 💎 **Singleton** | Один экземпляр на контейнер |
| 📦 **Scoped** | Один экземпляр на «скоуп» (запрос, транзакция) |

```typescript
// Singleton: кэширует первый вызов
registerSingleton<T>(token: Token<T>, factory: () => T): void {
  let instance: T | null = null
  this.bindings.set(token, () => {
    if (!instance) instance = factory()
    return instance
  })
}
```

## 🔌 Ports & Adapters (Гексагональная архитектура)

### 🔥 Ключевая идея

Бизнес-логика живёт в центре и **не знает** ни о базе данных, ни о HTTP, ни о файловой системе. Вместо этого она определяет **порты** (интерфейсы), а внешний мир предоставляет **адаптеры** (реализации).

```
          ┌──────────────────────┐
          │    Adapter (HTTP)    │
          └──────────┬───────────┘
                     │
          ┌──────────▼───────────┐
          │     Port (interface) │
          ├──────────────────────┤
          │   Business Logic     │
          ├──────────────────────┤
          │     Port (interface) │
          └──────────┬───────────┘
                     │
          ┌──────────▼───────────┐
          │  Adapter (Postgres)  │
          └──────────────────────┘
```

### Пример

```typescript
// Port — интерфейс, определённый бизнес-логикой
interface UserRepository {
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
}

// Adapter 1 — реальная база данных
class PostgresUserRepository implements UserRepository {
  async findById(id: string) { /* SQL query */ }
  async save(user: User) { /* SQL insert */ }
}

// Adapter 2 — для тестов
class InMemoryUserRepository implements UserRepository {
  private users = new Map<string, User>()
  async findById(id: string) { return this.users.get(id) ?? null }
  async save(user: User) { this.users.set(user.id, user) }
}
```

> 💡 **Совет:** Бизнес-логика работает с `UserRepository`, не зная какой адаптер за ним стоит. Это делает код тестируемым и заменяемым.

## 🏛️ Clean Architecture

### Слои

```
Infrastructure → Application → Domain
     ↑               ↑           ↑
  зависит от     зависит от   ни от чего
```

1. 🟢 **Domain (Entity)** — бизнес-объекты и правила. Не зависит ни от чего.
2. 🔵 **Application (UseCase)** — сценарии использования. Зависит только от Domain.
3. 🟠 **Infrastructure** — БД, API, фреймворки. Зависит от Application и Domain.

### Пример

```typescript
// 🟢 Domain — Entity с бизнес-правилами
class Order {
  constructor(
    readonly id: string,
    readonly items: OrderItem[],
    private _status: OrderStatus
  ) {}

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  canCancel(): boolean {
    return this._status === 'pending' || this._status === 'confirmed'
  }

  cancel(): void {
    if (!this.canCancel()) {
      throw new Error(`Cannot cancel order in status: ${this._status}`)
    }
    this._status = 'cancelled'
  }
}

// 🔵 Application — UseCase
class CreateOrderUseCase {
  constructor(
    private orderRepo: OrderRepository,
    private notifier: OrderNotifier
  ) {}

  execute(input: CreateOrderInput): Order {
    const order = new Order(generateId(), input.items, 'pending')
    if (order.total <= 0) throw new Error('Order total must be positive')
    this.orderRepo.save(order)
    this.notifier.notify(order)
    return order
  }
}
```

### Правило зависимостей

> 📌 **Важно:** Зависимости указывают внутрь. Infrastructure знает о Domain, но Domain не знает об Infrastructure. Это достигается через интерфейсы (порты), определённые в Domain/Application слоях.

## 📦 Module Contracts

### Проблема

```typescript
// ❌ Плохо: модуль экспортирует всё
export { UserService } from './UserService'
export { UserRepository } from './UserRepository'
export { UserValidator } from './UserValidator'
export { hashPassword } from './utils'
export { USER_TABLE_NAME } from './constants'
```

Другие модули начинают зависеть от внутренних деталей. Рефакторинг становится невозможным.

### Решение: публичный API модуля

```typescript
// users/index.ts — публичный контракт
export type { User, CreateUserInput } from './types'
export { UserService } from './UserService'

// Всё остальное — internal, не экспортируется
```

### Типобезопасные контракты между модулями

```typescript
// Контракт модуля
interface UserModuleContract {
  getUser(id: string): User | null
  createUser(input: CreateUserInput): User
}

// Модуль реализует контракт
function createUserModule(deps: UserModuleDeps): UserModuleContract {
  return {
    getUser(id) { /* ... */ },
    createUser(input) { /* ... */ },
  }
}

// ✅ Другие модули видят только контракт
const users: UserModuleContract = createUserModule(deps)
users.getUser('42')
```

> 🔥 **Ключевое:** Публичный API модуля — это контракт. Внутренности можно рефакторить свободно, пока контракт соблюдается.

## ⚠️ Частые ошибки новичков

### 🐛 1. DI-контейнер без типизации

```typescript
// ❌ Плохо: get возвращает any
container.get('database') // any
```

✅ **Хорошо** — Token<T> гарантирует тип:
```typescript
const DatabaseToken = new Token<Database>('Database')
container.resolve(DatabaseToken) // Database
```

### 🐛 2. Порт зависит от адаптера

```typescript
// ❌ Плохо: порт знает о Postgres
interface UserRepository {
  query(sql: string): Promise<PgResult>  // детали Postgres в порту!
}
```

✅ **Хорошо** — порт абстрактный:
```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
}
```

### 🐛 3. Бизнес-логика в Infrastructure

```typescript
// ❌ Плохо: правила заказа в репозитории
class OrderRepository {
  save(order: Order) {
    if (order.total < 0) throw new Error('Invalid total')  // бизнес-правило!
    this.db.insert(order)
  }
}
```

✅ **Хорошо** — правила в Entity:
```typescript
class Order {
  validate() {
    if (this.total < 0) throw new Error('Invalid total')
  }
}
```

### 🐛 4. Barrel files, которые создают циклические зависимости

```typescript
// ❌ Плохо: всё через один index.ts
// moduleA/index.ts exports from moduleB
// moduleB/index.ts exports from moduleA
// → Circular dependency!
```

✅ **Хорошо** — модули зависят от контрактов, не друг от друга.

## 💡 Best Practices

- 💉 **Token<T>** для DI — типобезопасность при resolve
- 🔌 **Порты определяет бизнес-логика**, а не инфраструктура
- 🏛️ **Зависимости указывают внутрь** — Infrastructure → Application → Domain
- 💡 Начинайте с простого — не нужен DI-контейнер для 3 сервисов
- 🧪 Тестируйте бизнес-логику без инфраструктуры — подставляйте in-memory адаптеры
- 📦 Публичный API модуля — только типы и фасады, внутренности скрыты
