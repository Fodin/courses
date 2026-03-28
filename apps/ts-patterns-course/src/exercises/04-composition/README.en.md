# 🧩 Level 4: Composition Patterns

## 📖 Introduction

Composition is one of the fundamental principles of both functional and object-oriented programming. Instead of inheritance, we **build complex behavior from simple parts**.

In this level we implement three powerful patterns: **Pipe/Compose** for transformation chains, **Middleware** for request processing, and **Plugin System** for extensible architectures.

## 🔗 Pipe and Compose

### Problem

Code often contains nested function calls that read right to left:

```typescript
// ❌ Unreadable — must be read from the inside out
const result = toUpperCase(trim(addPrefix(removeSpaces(input), '> ')))
```

### Solution: pipe()

`pipe` passes the result of one function to the next **left to right**:

```typescript
// ✅ Reads as a sequence of steps
const process = pipe(
  removeSpaces,
  (s: string) => addPrefix(s, '> '),
  trim,
  toUpperCase
)
const result = process(input)
```

### Implementation

```typescript
function pipe<A, B>(fn1: (a: A) => B): (a: A) => B
function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C
function pipe<A, B, C, D>(
  fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D
): (a: A) => D

// Runtime implementation with any, type safety via overloads
function pipe(...fns: Array<(arg: unknown) => unknown>) {
  return (input: unknown) => fns.reduce((acc, fn) => fn(acc), input)
}
```

### compose() — reverse order

`compose` works **right to left**, like mathematical composition f(g(x)):

```typescript
const format = compose(toUpperCase, trim, addPrefix)
// Equivalent to: toUpperCase(trim(addPrefix(x)))
```

> 💡 **Tip:** Use `pipe` when describing a data flow, `compose` when building a function from other functions.

## 🚇 Middleware

### Problem

HTTP processing involves many cross-cutting concerns: authentication, logging, CORS, validation. Putting everything in one function leads to chaos:

```typescript
// ❌ Monolithic handler
function handleRequest(req: Request): Response {
  // Logging...
  // CORS...
  // Authentication...
  // Validation...
  // Business logic...
  // Logging again...
}
```

### Solution: Middleware Pipeline

Each middleware does one thing and passes control to the next via `next()`:

```typescript
type Middleware = (
  request: Request,
  next: (req: Request) => Response
) => Response

const loggingMiddleware: Middleware = (req, next) => {
  console.log(`→ ${req.method} ${req.url}`)
  const response = next(req)
  console.log(`← ${response.status}`)
  return response
}

const authMiddleware: Middleware = (req, next) => {
  if (!req.headers.authorization) {
    return { status: 401, body: 'Unauthorized' }
  }
  return next(req)
}
```

### How to assemble a pipeline

```typescript
function createPipeline(
  ...middlewares: Middleware[]
): (req: Request, handler: (req: Request) => Response) => Response {
  return (req, handler) => {
    const chain = middlewares.reduceRight(
      (next, mw) => (r: Request) => mw(r, next),
      handler
    )
    return chain(req)
  }
}
```

> 📌 **Important:** `reduceRight` — because middlewares wrap each other from the outside in, but execute in forward order.

## 🧩 Plugin System

### Problem

A monolithic application is hard to extend. Every new feature requires modifying the core:

```typescript
// ❌ Every feature — a change to the App class
class App {
  init() {
    this.setupLogging()    // Hardcoded
    this.setupAnalytics()  // Hardcoded
    this.setupI18n()       // Hardcoded
  }
}
```

### Solution: Plugin Architecture

The core provides lifecycle hooks; plugins connect without modifying the core:

```typescript
interface Plugin<TConfig = unknown> {
  name: string
  config?: TConfig
  onInit?(): void
  onDestroy?(): void
}

class PluginManager {
  private plugins = new Map<string, Plugin>()

  install<T>(plugin: Plugin<T>): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" already installed`)
    }
    this.plugins.set(plugin.name, plugin)
    plugin.onInit?.()
  }

  uninstall(name: string): void {
    const plugin = this.plugins.get(name)
    if (plugin) {
      plugin.onDestroy?.()
      this.plugins.delete(name)
    }
  }
}
```

### Type-safe configuration

```typescript
interface LoggerConfig {
  level: 'debug' | 'info' | 'warn' | 'error'
  prefix: string
}

const loggerPlugin: Plugin<LoggerConfig> = {
  name: 'logger',
  config: { level: 'info', prefix: '[APP]' },
  onInit() {
    console.log(`${this.config!.prefix} Logger initialized at ${this.config!.level} level`)
  },
  onDestroy() {
    console.log(`${this.config!.prefix} Logger destroyed`)
  }
}
```

> 🔥 **Key insight:** Plugins make the application extensible without modifying the core — adhering to the Open/Closed Principle.

## ⚠️ Common Beginner Mistakes

### 🐛 1. Losing type safety in pipe

```typescript
// ❌ Using any[] for pipe arguments
function pipe(...fns: any[]): any {
  return (x: any) => fns.reduce((v, f) => f(v), x)
}
```

✅ **Good** — overloads preserve types at each step:
```typescript
function pipe<A, B>(fn1: (a: A) => B): (a: A) => B
function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C
```

### 🐛 2. Forgetting to call next() in middleware

```typescript
// ❌ Middleware "swallows" the request — the chain is broken
const badMiddleware: Middleware = (req, next) => {
  console.log('logging...')
  // Forgot return next(req)!
  return { status: 200, body: '' }
}
```

✅ **Good** — always pass control forward (unless intentionally stopping):
```typescript
const goodMiddleware: Middleware = (req, next) => {
  console.log('logging...')
  return next(req)
}
```

### 🐛 3. Not checking for duplicate plugins

```typescript
// ❌ Re-installing overwrites the plugin without cleanup
install(plugin: Plugin) {
  this.plugins.set(plugin.name, plugin) // Old onDestroy was never called!
}
```

✅ **Good** — check + throw error or automatically remove the old one:
```typescript
install(plugin: Plugin) {
  if (this.plugins.has(plugin.name)) {
    throw new Error(`Plugin "${plugin.name}" already installed`)
  }
  this.plugins.set(plugin.name, plugin)
  plugin.onInit?.()
}
```

### 🐛 4. Mutating the request in middleware

```typescript
// ❌ Mutating the original object — side effects
const authMiddleware: Middleware = (req, next) => {
  req.headers.user = 'admin' // Mutation!
  return next(req)
}
```

✅ **Good** — create a new object:
```typescript
const authMiddleware: Middleware = (req, next) => {
  const enrichedReq = {
    ...req,
    headers: { ...req.headers, user: 'admin' }
  }
  return next(enrichedReq)
}
```

## 💡 Best Practices

1. 🔗 **pipe for data, compose for functions** — use `pipe` when describing a data flow, `compose` when building a function from other functions
2. 🚇 **Middleware — single responsibility** — each middleware solves exactly one task
3. 🧩 **Plugins are self-contained** — a plugin should not depend on the installation order of other plugins
4. 🔒 **Immutability** — do not mutate objects passing through the pipeline, create new ones
5. 🛡️ **Type safety** — use overloads and generics instead of `any`
