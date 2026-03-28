# 🔧 Level 2: Structural Patterns

## 📖 Introduction

Structural patterns answer the question: **how to assemble objects and classes into larger structures** while maintaining flexibility and efficiency. If creational patterns address the problem of creating objects, structural patterns address the problem of **composing** them.

Imagine: you have a third-party logger with an inconvenient API, you need to add caching to an API client without modifying its code, or you need to hide a complex system of 5 services behind a simple interface. Structural patterns are your tool.

## 🔌 Adapter

### Problem

Two components cannot work together due to incompatible interfaces:

```typescript
// ❌ Bad — code depends on each logger's specific API
class ConsoleLogger {
  log(msg: string) { console.log(msg) }
}

class FileLogger {
  writeLog(level: string, message: string) { /* ... */ }
}

// Each logger has its own API. Client code is tied to the concrete logger.
```

### Solution

Adapter wraps an object with an incompatible interface, converting it to the required one:

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

// Client code works only with ILogger
function processRequest(logger: ILogger) {
  logger.info('Processing started')
}
```

### How it works

1. Define the **target interface** (`ILogger`) expected by client code
2. Create an **adapter** that accepts the "foreign" object in its constructor
3. The adapter implements the target interface, **delegating calls** to the wrapped object
4. Client code works only with the interface — it knows nothing about concrete loggers

> 💡 **Tip:** In TypeScript, the adapter is especially useful when integrating third-party libraries — you isolate their API behind your own interface.

## 🎁 Decorator

### Problem

You need to add functionality without modifying the original code:

```typescript
// ❌ Bad — manually modifying each function
function fetchData(url: string) {
  console.log(`Fetching ${url}...`) // Logging added manually
  const cached = cache.get(url)     // Caching added manually
  if (cached) return cached
  // ...main logic
}
```

### Solution

Decorator wraps a function, adding behavior before/after the call:

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

// ✅ Composing decorators
const enhancedFetch = withLogging(withCache(fetchData), 'fetchData')
```

### Decorators in TypeScript

TypeScript allows preserving type safety through generics:

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

> 📌 **Note:** Function decorators are wrappers that preserve the same interface. Do not confuse them with TC39 class decorators (`@decorator`).

## 🏢 Facade

### Problem

Client code has to coordinate many subsystems:

```typescript
// ❌ Bad — client knows about all subsystems and their order
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

### Solution

Facade hides complexity behind a simple interface:

```typescript
class OrderFacade {
  constructor(
    private inventory: InventoryService,
    private payment: PaymentService,
    private shipping: ShippingService
  ) {}

  placeOrder(order: OrderRequest): OrderResult {
    // All coordination happens inside the facade
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

// ✅ Client works with a single method
const facade = new OrderFacade(inventory, payment, shipping)
const result = facade.placeOrder(order)
```

### ✅ When to use

- ✅ When you need to **simplify** working with a complex system
- ✅ When you want to **isolate** client code from implementation details
- ✅ When multiple subsystems need to be **coordinated** in a specific order

> 💡 **Tip:** Facade does not prohibit direct access to subsystems — it simply offers a convenient path for typical scenarios.

## 🪞 Proxy

### Problem

You need to control access to an object: add caching, logging, permission checks — without modifying the object itself:

```typescript
// ❌ Bad — caching and logging logic inside the service
class ApiService {
  fetch(url: string) {
    console.log(`Fetching ${url}`) // Logging is not the service's responsibility
    if (this.cache[url]) return this.cache[url] // Caching is not the service's responsibility
    // ...
  }
}
```

### Solution

Proxy intercepts access to an object via the `Proxy` API:

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

### Types of proxies

| Type | Purpose |
|-----|-----------|
| 🗄️ Caching | Stores the results of calls |
| 📝 Logging | Records all accesses |
| 🔒 Protection | Checks access permissions |
| 💤 Virtual | Defers creation of a "heavy" object |

> 📌 **Note:** `Proxy` is a built-in JavaScript API. TypeScript adds type safety via generics, but `Proxy` typing itself is limited — be careful with types.

## ⚠️ Common Beginner Mistakes

### 🐛 1. Adapter that adds business logic

```typescript
// ❌ Bad — adapter adds validation, which is not its responsibility
class LoggerAdapter implements ILogger {
  info(message: string) {
    if (message.length > 1000) throw new Error('Too long') // This is not adaptation!
    this.logger.log(message)
  }
}
```

> ⚠️ **Why this is wrong:** an adapter should only **translate the interface** — not add new business logic. Validation, caching, etc. are the responsibility of other patterns (Decorator, Proxy).

```typescript
// ✅ Good — adapter only translates calls
class LoggerAdapter implements ILogger {
  info(message: string) {
    return this.logger.log(`[INFO] ${message}`)
  }
}
```

### 🐛 2. Decorator that changes the function signature

```typescript
// ❌ Bad — decorator changes the return type
function withLogging(fn: (x: number) => number) {
  return (x: number) => {
    const result = fn(x)
    return { result, logged: true } // Type has changed!
  }
}
```

> ⚠️ **Why this is wrong:** a decorator should be **transparent** — the calling code should not know about its existence. Changing the signature breaks the contract.

```typescript
// ✅ Good — decorator preserves the signature
function withLogging<T extends AnyFunction>(fn: T): T {
  return ((...args: Parameters<T>) => {
    console.log('called')
    return fn(...args)
  }) as T
}
```

### 🐛 3. Facade that became a God Object

```typescript
// ❌ Bad — facade does everything itself without delegating
class OrderFacade {
  placeOrder(order: Order) {
    // 200 lines of inventory checking
    // 150 lines of payment processing
    // 100 lines of shipment creation
  }
}
```

> ⚠️ **Why this is wrong:** a facade should **coordinate** subsystems, not replace them. All logic stays in the subsystems.

```typescript
// ✅ Good — facade delegates
class OrderFacade {
  placeOrder(order: Order) {
    this.inventory.check(order.productId)
    this.payment.charge(order.userId, order.amount)
    this.shipping.create(order.id)
  }
}
```

### 🐛 4. Proxy without type safety

```typescript
// ❌ Bad — any destroys type safety
function createProxy(target: any): any {
  return new Proxy(target, { /* ... */ })
}
```

> ⚠️ **Why this is wrong:** all the benefits of TypeScript are lost. Errors will only be discovered at runtime.

```typescript
// ✅ Good — generic preserves the type
function createProxy<T extends object>(target: T): T {
  return new Proxy(target, { /* ... */ })
}
```

## 📌 Summary

- ✅ **Adapter** — converting an incompatible interface to the required one without modifying the source code
- ✅ **Decorator** — adding behavior (logging, caching, retry) via a wrapper with the same interface
- ✅ **Facade** — simplifying work with a complex system through a single interface
- ✅ **Proxy** — controlling access to an object by intercepting calls
- 💡 TypeScript strengthens every pattern: interfaces guarantee compatibility, generics preserve type safety
- 📌 Each pattern solves its own problem — do not confuse Adapter (compatibility) with Decorator (extension) and Proxy (access control)
