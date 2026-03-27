# 🔧 Уровень 2: Структурные паттерны (Structural Patterns)

## 📖 Введение

Структурные паттерны отвечают на вопрос: **как собрать объекты и классы в более крупные структуры**, сохраняя гибкость и эффективность. Если порождающие паттерны решают проблему создания объектов, то структурные — проблему их **компоновки**.

Представьте: у вас есть сторонний логгер с неудобным API, нужно добавить кэширование к API-клиенту без изменения его кода, или спрятать сложную систему из 5 сервисов за простым интерфейсом. Структурные паттерны — ваш инструмент.

## 🔌 Adapter (Адаптер)

### Проблема

Два компонента не могут работать вместе из-за несовместимых интерфейсов:

```typescript
// ❌ Плохо — код зависит от конкретного API каждого логгера
class ConsoleLogger {
  log(msg: string) { console.log(msg) }
}

class FileLogger {
  writeLog(level: string, message: string) { /* ... */ }
}

// Каждый логгер — свой API. Клиентский код привязан к конкретному логгеру.
```

### Решение

Adapter оборачивает объект с несовместимым интерфейсом, приводя его к нужному:

```typescript
interface ILogger {
  info(message: string): string
  error(message: string): string
  warn(message: string): string
}

class ConsoleLoggerAdapter implements ILogger {
  constructor(private logger: ConsoleLogger) {}

  info(message: string): string {
    return this.logger.log(`[INFO] ${message}`)
  }
  error(message: string): string {
    return this.logger.log(`[ERROR] ${message}`)
  }
  warn(message: string): string {
    return this.logger.log(`[WARN] ${message}`)
  }
}

// Клиентский код работает только с ILogger
function processRequest(logger: ILogger) {
  logger.info('Processing started')
}
```

### Как это работает

1. Определяем **целевой интерфейс** (`ILogger`), который ожидает клиентский код
2. Создаём **адаптер**, который принимает «чужой» объект в конструктор
3. Адаптер реализует целевой интерфейс, **делегируя вызовы** обёрнутому объекту
4. Клиентский код работает только с интерфейсом — не знает о конкретных логгерах

> 💡 **Совет:** В TypeScript адаптер особенно полезен при интеграции сторонних библиотек — вы изолируете их API за своим интерфейсом.

## 🎁 Decorator (Декоратор)

### Проблема

Нужно добавить функциональность без изменения исходного кода:

```typescript
// ❌ Плохо — модификация каждой функции вручную
function fetchData(url: string) {
  console.log(`Fetching ${url}...`) // Логирование вручную
  const cached = cache.get(url)     // Кэширование вручную
  if (cached) return cached
  // ...основная логика
}
```

### Решение

Decorator оборачивает функцию, добавляя поведение до/после вызова:

```typescript
type AnyFunction = (...args: unknown[]) => unknown

function withLogging<T extends AnyFunction>(fn: T, name: string): T {
  return ((...args: Parameters<T>) => {
    console.log(`[LOG] ${name} called with:`, args)
    const result = fn(...args)
    console.log(`[LOG] ${name} returned:`, result)
    return result
  }) as T
}

function withCache<T extends AnyFunction>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)!
    const result = fn(...args) as ReturnType<T>
    cache.set(key, result)
    return result
  }) as T
}

// ✅ Композиция декораторов
const enhancedFetch = withLogging(withCache(fetchData), 'fetchData')
```

### Декораторы в TypeScript

TypeScript позволяет сохранить типобезопасность через generics:

```typescript
function withRetry<T extends AnyFunction>(fn: T, retries: number): T {
  return ((...args: Parameters<T>) => {
    for (let i = 0; i <= retries; i++) {
      try {
        return fn(...args)
      } catch (e) {
        if (i === retries) throw e
      }
    }
  }) as T
}
```

> 📌 **Важно:** Декораторы функций — это обёртки с тем же интерфейсом. Не путайте с TC39 декораторами классов (`@decorator`).

## 🏢 Facade (Фасад)

### Проблема

Клиентский код должен координировать работу множества подсистем:

```typescript
// ❌ Плохо — клиент знает о всех подсистемах и их порядке
const inventory = new InventoryService()
const payment = new PaymentService()
const shipping = new ShippingService()

if (inventory.check(productId)) {
  const payResult = payment.charge(userId, amount)
  if (payResult.success) {
    shipping.createShipment(orderId, address)
    inventory.reserve(productId)
  }
}
```

### Решение

Facade скрывает сложность за простым интерфейсом:

```typescript
class OrderFacade {
  constructor(
    private inventory: InventoryService,
    private payment: PaymentService,
    private shipping: ShippingService
  ) {}

  placeOrder(order: OrderRequest): OrderResult {
    // Вся координация — внутри фасада
    if (!this.inventory.check(order.productId)) {
      return { success: false, error: 'Out of stock' }
    }
    const payment = this.payment.charge(order.userId, order.amount)
    if (!payment.success) {
      return { success: false, error: 'Payment failed' }
    }
    this.shipping.createShipment(order.id, order.address)
    this.inventory.reserve(order.productId)
    return { success: true, orderId: order.id }
  }
}

// ✅ Клиент работает с одним методом
const facade = new OrderFacade(inventory, payment, shipping)
const result = facade.placeOrder(order)
```

### ✅ Когда использовать

- ✅ Когда нужно **упростить** работу со сложной системой
- ✅ Когда хотите **изолировать** клиентский код от деталей реализации
- ✅ Когда несколько подсистем нужно **координировать** в определённом порядке

> 💡 **Совет:** Facade не запрещает прямой доступ к подсистемам — он просто предлагает удобный путь для типичных сценариев.

## 🪞 Proxy (Прокси)

### Проблема

Нужно контролировать доступ к объекту: добавить кэширование, логирование, проверку прав — без изменения самого объекта:

```typescript
// ❌ Плохо — логика кэширования и логирования внутри сервиса
class ApiService {
  fetch(url: string) {
    console.log(`Fetching ${url}`) // Логирование — не ответственность сервиса
    if (this.cache[url]) return this.cache[url] // Кэш — не ответственность сервиса
    // ...
  }
}
```

### Решение

Proxy перехватывает обращения к объекту через `Proxy` API:

```typescript
function createCachingProxy<T extends object>(target: T): T {
  const cache = new Map<string, unknown>()

  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver)
      if (typeof value !== 'function') return value

      return (...args: unknown[]) => {
        const key = `${String(prop)}:${JSON.stringify(args)}`
        if (cache.has(key)) return cache.get(key)
        const result = value.apply(obj, args)
        cache.set(key, result)
        return result
      }
    }
  })
}
```

### Виды прокси

| Тип | Назначение |
|-----|-----------|
| 🗄️ Кэширующий | Сохраняет результаты вызовов |
| 📝 Логирующий | Записывает все обращения |
| 🔒 Защитный | Проверяет права доступа |
| 💤 Виртуальный | Откладывает создание «тяжёлого» объекта |

> 📌 **Важно:** `Proxy` — встроенный API JavaScript. TypeScript добавляет типобезопасность через generics, но сама типизация `Proxy` ограничена — будьте внимательны с типами.

## ⚠️ Частые ошибки новичков

### 🐛 1. Адаптер, который добавляет логику

```typescript
// ❌ Плохо — адаптер добавляет валидацию, это не его задача
class LoggerAdapter implements ILogger {
  info(message: string) {
    if (message.length > 1000) throw new Error('Too long') // Это не адаптация!
    this.logger.log(message)
  }
}
```

> ⚠️ **Почему это ошибка:** адаптер должен только **приводить интерфейс** — не добавлять новую бизнес-логику. Валидация, кэширование и т.д. — задача других паттернов (Decorator, Proxy).

```typescript
// ✅ Хорошо — адаптер только транслирует вызовы
class LoggerAdapter implements ILogger {
  info(message: string) {
    return this.logger.log(`[INFO] ${message}`)
  }
}
```

### 🐛 2. Декоратор, меняющий сигнатуру функции

```typescript
// ❌ Плохо — декоратор меняет возвращаемый тип
function withLogging(fn: (x: number) => number) {
  return (x: number) => {
    const result = fn(x)
    return { result, logged: true } // Тип изменён!
  }
}
```

> ⚠️ **Почему это ошибка:** декоратор должен быть **прозрачным** — вызывающий код не должен знать о его существовании. Изменение сигнатуры ломает контракт.

```typescript
// ✅ Хорошо — декоратор сохраняет сигнатуру
function withLogging<T extends AnyFunction>(fn: T): T {
  return ((...args: Parameters<T>) => {
    console.log('called')
    return fn(...args)
  }) as T
}
```

### 🐛 3. Фасад, который стал God Object

```typescript
// ❌ Плохо — фасад делает всё сам, не делегируя
class OrderFacade {
  placeOrder(order: Order) {
    // 200 строк проверки инвентаря
    // 150 строк обработки платежа
    // 100 строк создания доставки
  }
}
```

> ⚠️ **Почему это ошибка:** фасад должен **координировать** подсистемы, а не заменять их. Вся логика остаётся в подсистемах.

```typescript
// ✅ Хорошо — фасад делегирует
class OrderFacade {
  placeOrder(order: Order) {
    this.inventory.check(order.productId)
    this.payment.charge(order.userId, order.amount)
    this.shipping.create(order.id)
  }
}
```

### 🐛 4. Proxy без типизации

```typescript
// ❌ Плохо — any убивает типобезопасность
function createProxy(target: any): any {
  return new Proxy(target, { /* ... */ })
}
```

> ⚠️ **Почему это ошибка:** весь смысл TypeScript теряется. Ошибки обнаружатся только в рантайме.

```typescript
// ✅ Хорошо — generic сохраняет тип
function createProxy<T extends object>(target: T): T {
  return new Proxy(target, { /* ... */ })
}
```

## 📌 Итоги

- ✅ **Adapter** — приведение несовместимого интерфейса к нужному без изменения исходного кода
- ✅ **Decorator** — добавление поведения (логирование, кэш, retry) через обёртку с тем же интерфейсом
- ✅ **Facade** — упрощение работы со сложной системой через единый интерфейс
- ✅ **Proxy** — контроль доступа к объекту через перехват обращений
- 💡 TypeScript усиливает каждый паттерн: интерфейсы гарантируют совместимость, generics сохраняют типобезопасность
- 📌 Каждый паттерн решает свою задачу — не путайте Adapter (совместимость) с Decorator (расширение) и Proxy (контроль доступа)
