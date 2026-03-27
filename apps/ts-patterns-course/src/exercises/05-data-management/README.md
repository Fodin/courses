# 💾 Уровень 5: Управление данными

## 📖 Введение

Паттерны управления данными решают одну из самых сложных задач в приложениях: **как организовать доступ к данным, транзакционность и согласованность**. Эти паттерны пришли из мира enterprise-архитектуры (Domain-Driven Design, CQRS, Event Sourcing) и отлично ложатся на TypeScript благодаря строгой типизации.

В этом уровне мы реализуем четыре ключевых паттерна:
- 📦 **Repository** — абстракция доступа к хранилищу данных
- 🔄 **Unit of Work** — группировка операций в транзакции с commit/rollback
- ⚡ **CQRS** — разделение чтения и записи через CommandBus и QueryBus
- 📜 **Event Sourcing** — хранение истории событий вместо текущего состояния

## 📦 Repository (Репозиторий)

### Проблема

Бизнес-логика напрямую работает с хранилищем данных, что создает жёсткую связь:

```typescript
// ❌ Плохо: бизнес-логика знает о деталях хранения
class UserService {
  getUser(id: string) {
    const data = localStorage.getItem(`user:${id}`)
    return data ? JSON.parse(data) : null
  }

  saveUser(user: User) {
    localStorage.setItem(`user:${user.id}`, JSON.stringify(user))
  }
}
```

Если завтра нужно перейти с localStorage на API — придётся переписывать весь сервис.

### Решение

Выделите интерфейс доступа к данным (Repository), а конкретную реализацию подставляйте снаружи:

```typescript
interface Repository<T extends { id: string }> {
  findById(id: string): T | undefined
  findAll(): T[]
  create(entity: T): T
  update(id: string, updates: Partial<T>): T | undefined
  delete(id: string): boolean
}

class InMemoryRepository<T extends { id: string }> implements Repository<T> {
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
```

> 🔥 **Ключевое:** Бизнес-логика зависит от интерфейса `Repository<T>`, а не от конкретного хранилища. Завтра вы замените `InMemoryRepository` на `ApiRepository` без изменения сервисного слоя.

## 🔄 Unit of Work (Единица работы)

### Проблема

При выполнении нескольких связанных операций нужно гарантировать атомарность — либо все операции применяются, либо ни одна:

```typescript
// ❌ Плохо: если updateBalance упадёт — деньги списались, но не зачислились
userRepo.update(sender.id, { balance: sender.balance - amount })
userRepo.update(receiver.id, { balance: receiver.balance + amount })
transactionRepo.create({ from: sender.id, to: receiver.id, amount })
```

### Решение

Unit of Work накапливает изменения и применяет их атомарно:

```typescript
interface UnitOfWork {
  registerNew<T extends { id: string }>(entity: T, repoName: string): void
  registerDirty<T extends { id: string }>(entity: T, repoName: string): void
  registerDeleted(id: string, repoName: string): void
  commit(): void
  rollback(): void
}
```

> 📌 **Важно:** До вызова `commit()` ни одно изменение не попадает в хранилище. При ошибке `rollback()` отменяет все накопленные операции.

## ⚡ CQRS (Command Query Responsibility Segregation)

### Проблема

В сложных приложениях чтение и запись данных имеют принципиально разные требования:
- ✏️ Запись: валидация, бизнес-правила, транзакции, события
- 📖 Чтение: производительность, агрегации, кеширование

Когда всё в одном сервисе, код превращается в месиво:

```typescript
// ❌ Плохо: один сервис и читает, и пишет, и валидирует
class OrderService {
  createOrder(data: OrderData) { /* валидация + запись + событие */ }
  getOrderDetails(id: string) { /* join таблиц + форматирование */ }
  getOrderStats() { /* агрегация + кеш */ }
}
```

### Решение

Разделите операции на команды (запись) и запросы (чтение):

```typescript
// Команда — намерение изменить данные
interface Command {
  type: string
}

// Запрос — намерение прочитать данные
interface Query {
  type: string
}

// Обработчик команды
interface CommandHandler<C extends Command> {
  execute(command: C): void
}

// Обработчик запроса
interface QueryHandler<Q extends Query, R> {
  execute(query: Q): R
}
```

> 🔥 **Ключевое:** CommandBus маршрутизирует команды к обработчикам, QueryBus — запросы. Это позволяет независимо масштабировать, кешировать и оптимизировать чтение и запись.

## 📜 Event Sourcing (Источник событий)

### Проблема

Классический подход хранит только текущее состояние. Когда нужно понять, **как мы пришли к этому состоянию** — информация потеряна:

```typescript
// Мы видим баланс 500, но не знаем почему
const account = { id: '1', balance: 500 }
// Было ли это: 1000 - 300 - 200? Или 0 + 500? Или 600 - 100?
```

### Решение

Вместо хранения состояния храните **последовательность событий**:

```typescript
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
```

Текущее состояние вычисляется путём последовательного применения событий (replay):

```typescript
function replay(events: AccountEvent[]): AccountState {
  return events.reduce((state, event) => {
    switch (event.type) {
      case 'AccountOpened':
        return { ...state, ownerName: event.ownerName, balance: 0 }
      case 'MoneyDeposited':
        return { ...state, balance: state.balance + event.amount }
      case 'MoneyWithdrawn':
        return { ...state, balance: state.balance - event.amount }
    }
  }, initialState)
}
```

> 📌 **Важно:** Event Sourcing даёт полную аудиторскую историю, возможность «перемотать» состояние на любой момент и debug любого бага.

## ⚠️ Частые ошибки новичков

### 🐛 1. Repository, который делает слишком много

❌ **Плохо** — бизнес-логика внутри репозитория:
```typescript
class UserRepository {
  createUser(name: string, email: string) {
    // Валидация email — это НЕ задача репозитория
    if (!email.includes('@')) throw new Error('Invalid email')
    // Хеширование пароля — это НЕ задача репозитория
    const hashedPassword = hash(password)
    this.store.set(id, { name, email, hashedPassword })
  }
}
```

✅ **Хорошо** — репозиторий только хранит и достает данные:
```typescript
class UserRepository {
  create(user: User): User {
    this.store.set(user.id, { ...user })
    return user
  }
}
// Валидация и бизнес-логика — в сервисном слое
```

### 🐛 2. Unit of Work без rollback

❌ **Плохо** — commit без обработки ошибок:
```typescript
commit() {
  this.newEntities.forEach(e => repo.create(e))
  this.dirtyEntities.forEach(e => repo.update(e.id, e))
  // Если update упал на 3-й из 5 — данные в неконсистентном состоянии
}
```

✅ **Хорошо** — сохраняйте снимок для отката:
```typescript
commit() {
  const snapshot = this.createSnapshot()
  try {
    this.applyChanges()
  } catch (error) {
    this.restoreSnapshot(snapshot)
    throw error
  }
}
```

### 🐛 3. CQRS: команды возвращают данные

❌ **Плохо** — команда возвращает созданную сущность:
```typescript
class CreateOrderHandler {
  execute(cmd: CreateOrder): Order {  // Command не должен возвращать данные
    return this.repo.create(order)
  }
}
```

✅ **Хорошо** — команда только выполняет действие, данные получаются через запрос:
```typescript
class CreateOrderHandler {
  execute(cmd: CreateOrder): void {
    this.repo.create(order)
    this.eventBus.emit('OrderCreated', { orderId: order.id })
  }
}
// Клиент читает через QueryBus
```

### 🐛 4. Event Sourcing: мутация событий

❌ **Плохо** — изменение уже записанного события:
```typescript
// События ИММУТАБЕЛЬНЫ! Нельзя менять историю
eventStore.events[0].amount = 999
```

✅ **Хорошо** — для исправления создайте компенсирующее событие:
```typescript
eventStore.append({
  type: 'MoneyAdjusted',
  amount: -100,
  reason: 'Correction for double charge'
})
```

## 💡 Best Practices

- 📦 **Repository**: один репозиторий — одна сущность. Не создавайте «god repository» для всего
- 🔄 **Unit of Work**: используйте для операций, затрагивающих несколько сущностей одновременно
- ⚡ **CQRS**: не применяйте везде — для простых CRUD-операций это оверинжиниринг
- 📜 **Event Sourcing**: events — это факты, случившиеся в прошлом. Именуйте их в прошедшем времени: `OrderCreated`, `MoneyDeposited`
- 🛡️ **Типизация**: используйте discriminated unions для типов событий и команд — TypeScript автоматически сузит типы в switch/case
