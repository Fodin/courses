# Уровень 3: Продвинутый Dependency Injection

## 🎯 Цель уровня

Научиться создавать типобезопасные DI-контейнеры, которые гарантируют корректность зависимостей на этапе компиляции: правильные типы сервисов, обнаружение циклических зависимостей и управление жизненным циклом.

---

## Проблема: хрупкие зависимости

Без DI-контейнера зависимости создаются вручную:

```typescript
// ❌ Ручное связывание — хрупко и не масштабируется
const config = new Config()
const logger = new Logger(config)
const db = new Database(config, logger)
const cache = new Cache(config, logger)
const userRepo = new UserRepository(db, cache, logger)
const userService = new UserService(userRepo, logger)
// 6 строк, и мы ещё не начали работу...
```

Проблемы:
- Порядок создания важен и легко нарушается
- Изменение зависимости требует правки всех точек создания
- Нет контроля жизненного цикла (singleton vs transient)
- Тестирование затруднено — нельзя подменить зависимость

---

## Паттерн 1: Типобезопасный DI-контейнер

### Контейнер с накоплением registry

```typescript
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
    this.factories.set(name, () => factory(this as any))
    return this as any
  }

  resolve<K extends keyof TRegistry>(name: K): TRegistry[K] {
    if (this.instances.has(name as string)) {
      return this.instances.get(name as string) as TRegistry[K]
    }
    const factory = this.factories.get(name as string)
    if (!factory) throw new Error(`Service "${String(name)}" not registered`)
    const instance = factory()
    this.instances.set(name as string, instance)
    return instance as TRegistry[K]
  }
}
```

📌 **Accumulating generic**: каждый вызов `register()` возвращает `Container<TRegistry & Record<K, T>>`, расширяя реестр. Это означает, что `resolve()` знает типы всех зарегистрированных сервисов.

```typescript
const container = new Container()
  .register('config', () => ({ apiUrl: 'https://api.example.com' }))
  .register('logger', () => ({ log: (msg: string) => console.log(msg) }))
  .register('http', (c) => ({
    get: (url: string) => {
      c.resolve('logger').log(`GET ${c.resolve('config').apiUrl}${url}`)
    }
  }))

// ✅ Типобезопасный resolve
container.resolve('config').apiUrl    // string
container.resolve('logger').log       // (msg: string) => void

// ❌ Ошибки компиляции
container.resolve('unknown')          // Не в registry
container.resolve('config').log       // Нет метода log у config
```

---

## Паттерн 2: Injection Tokens

Строковые ключи подвержены коллизиям. Injection Tokens решают эту проблему:

```typescript
class InjectionToken<T> {
  readonly _type!: T  // Фантомный тип
  constructor(public readonly description: string) {}
}

function token<T>(description: string): InjectionToken<T> {
  return new InjectionToken<T>(description)
}

// Токены — единственный источник правды о типе сервиса
const TOKENS = {
  Logger: token<Logger>('Logger'),
  Config: token<Config>('Config'),
  ApiBaseUrl: token<string>('ApiBaseUrl'),    // Примитивные значения тоже
  MaxRetries: token<number>('MaxRetries'),
}
```

💡 **Почему токены лучше строк**:
1. Каждый токен — уникальный объект (нет коллизий имён)
2. Фантомный тип `T` связывает токен с типом сервиса
3. Автодополнение при использовании объекта `TOKENS`
4. Рефакторинг безопасен — переименование через IDE

```typescript
class TokenContainer {
  provide<T>(token: InjectionToken<T>, factory: () => T): this { /* ... */ }
  inject<T>(token: InjectionToken<T>): T { /* ... */ }
}

container.inject(TOKENS.Logger)    // Logger
container.inject(TOKENS.ApiBaseUrl) // string
```

---

## Паттерн 3: Scoped Dependencies

Три lifetime стратегии:

```typescript
type Lifetime = 'singleton' | 'transient' | 'scoped'
```

### Singleton
Один экземпляр на всё приложение. Подходит для конфигурации, логгеров, пулов соединений.

```typescript
container.registerSingleton('config', () => loadConfig())
// resolve('config') всегда возвращает тот же объект
```

### Transient
Новый экземпляр при каждом resolve. Подходит для стейтфул-объектов, которые не должны разделять состояние.

```typescript
container.registerTransient('requestId', () => ({ id: uuid() }))
// Каждый resolve('requestId') возвращает новый объект
```

### Scoped
Один экземпляр в пределах scope. Типичный use case — HTTP-запрос: одно соединение с БД на весь запрос.

```typescript
const scope = container.createScope()
scope.resolve('dbConnection') === scope.resolve('dbConnection') // true
// Другой scope — другой экземпляр
const scope2 = container.createScope()
scope.resolve('dbConnection') !== scope2.resolve('dbConnection') // true
```

### Реализация Scope

```typescript
class ScopedContainer {
  private parent: ScopedContainer | null = null
  private scopedInstances = new Map<string, unknown>()

  createScope(): ScopedContainer {
    const child = new ScopedContainer()
    child.parent = this
    child.descriptors = new Map(this.descriptors)
    return child
  }

  resolve<T>(name: string): T {
    switch (descriptor.lifetime) {
      case 'singleton':
        return this.getRoot().singletons.getOrCreate(name)
      case 'transient':
        return descriptor.factory()
      case 'scoped':
        return this.scopedInstances.getOrCreate(name)
    }
  }
}
```

---

## Паттерн 4: Auto-Wiring

Автоматическое разрешение зависимостей по декларативному описанию:

```typescript
class AutoWireContainer {
  register<T>(
    name: string,
    dependencies: string[],
    factory: (...deps: unknown[]) => T
  ): this { /* ... */ }

  resolve<T>(name: string): T {
    // 1. Найти зарегистрированный сервис
    // 2. Рекурсивно resolve все его зависимости
    // 3. Вызвать factory с разрешёнными зависимостями
    // 4. Обнаружить циклические зависимости
  }
}
```

### Обнаружение циклов

```typescript
resolve<T>(name: string): T {
  if (this.resolving.has(name)) {
    throw new Error(`Circular dependency: ${[...this.resolving, name].join(' -> ')}`)
  }
  this.resolving.add(name)
  // ... resolve dependencies ...
  this.resolving.delete(name)
}
```

### Граф зависимостей

```typescript
// Визуализация порядка разрешения
container.getResolutionOrder('userService')
// ['config', 'logger', 'database', 'cache', 'userRepository', 'userService']
```

---

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Service Locator вместо DI

```typescript
// ❌ Service Locator — зависимость от контейнера
class UserService {
  constructor(private container: Container) {}

  getUser(id: number) {
    // Класс знает о контейнере — сильная связанность
    const db = this.container.resolve('database')
    return db.query(`SELECT * FROM users WHERE id = ${id}`)
  }
}

// ✅ Dependency Injection — зависимость от интерфейсов
class UserService {
  constructor(private db: Database, private logger: Logger) {}

  getUser(id: number) {
    // Класс не знает о контейнере
    this.logger.log(`Getting user ${id}`)
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`)
  }
}
```

### Ошибка 2: Captive Dependencies

```typescript
// ❌ Singleton зависит от scoped — "пленная" зависимость
container
  .registerScoped('request', () => new RequestContext())
  .registerSingleton('service', (c) => {
    // Scoped зависимость захвачена singleton-ом!
    // service.request всегда будет первым созданным request
    const request = c.resolve('request')
    return new Service(request)
  })

// ✅ Правило: singleton может зависеть только от singleton
// Scoped -> scoped или transient
// Transient -> что угодно
```

### Ошибка 3: Циклические зависимости без обнаружения

```typescript
// ❌ A зависит от B, B зависит от A → бесконечная рекурсия
container
  .register('a', (c) => new A(c.resolve('b')))
  .register('b', (c) => new B(c.resolve('a')))
// Stack overflow!

// ✅ Обнаружение циклов
resolve(name) {
  if (this.resolving.has(name)) {
    throw new Error(`Circular: ${[...this.resolving, name].join(' -> ')}`)
  }
}
```

### Ошибка 4: Потеря типов при использовании строковых ключей

```typescript
// ❌ Строковый ключ — нет проверки типа
container.resolve('logr')  // Опечатка, но нет ошибки компиляции

// ✅ Injection Token — тип гарантирован
container.inject(TOKENS.Logger)  // Logger, опечатка невозможна
```

---

## 🔥 Лучшие практики

1. **Injection Tokens** вместо строк — безопасность типов и уникальность
2. **Правило lifetime**: singleton >= scoped >= transient (не зависеть от "короче живущего")
3. **Ленивое создание** — resolve при первом обращении, не при регистрации
4. **Граф зависимостей** — визуализация помогает обнаружить проблемы
5. **Обнаружение циклов** — обязательно для production-контейнеров
6. **Scope per request** — HTTP-запрос = один scope (одно соединение с БД)
7. **Интерфейсы, не реализации** — зависеть от абстракций
