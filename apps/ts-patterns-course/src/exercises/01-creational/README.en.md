# 🏗️ Level 1: Creational Patterns

## 📖 Introduction

Creational patterns solve one of the most common problems in programming — **how to create objects correctly**. Seems like `new MyClass()` should be enough? In practice — it is not.

Imagine: you are building a notification system. Today you need email, tomorrow — SMS, the day after — push notifications. Change the object creation code every time? What if Telegram or Slack gets added? Creational patterns help create objects in a **flexible**, **extensible**, and **type-safe** way.

## 🏭 Factory Method

### Problem

Code directly instantiates concrete classes — adding a new type requires changing every creation site:

```typescript
// ❌ Bad — tight coupling to concrete classes
function notify(type: string, message: string) {
  if (type === 'email') {
    const n = new EmailNotification()
    n.send(message)
  } else if (type === 'sms') {
    const n = new SMSNotification()
    n.send(message)
  }
  // Every new type — a new if/else
}
```

### Solution

Factory Method moves object creation into a dedicated function/method:

```typescript
interface Notification {
  send(message: string): string
  format(message: string): string
}

function createNotification(type: 'email' | 'sms' | 'push'): Notification {
  switch (type) {
    case 'email': return new EmailNotification()
    case 'sms': return new SMSNotification()
    case 'push': return new PushNotification()
  }
}

// Client code does not depend on concrete classes
const notification = createNotification('email')
notification.send('Hello!')
```

### How it works

1. Define a **common interface** for all products
2. Each concrete class implements that interface
3. The **factory function** accepts a type and returns the appropriate instance
4. Client code works only with the interface

> 💡 **Tip:** In TypeScript the factory can return `Notification` — and the compiler guarantees that all variants implement the required methods.

## 🎨 Abstract Factory

### Problem

You need to create **families of related objects**. For example, UI components for different themes — each theme defines its own Button, Input, Card:

```typescript
// ❌ Bad — mixing styles from different themes
const button = isDark ? new DarkButton() : new LightButton()
const input = isDark ? new DarkInput() : new LightInput()
// Easy to accidentally create DarkButton + LightInput
```

### Solution

Abstract Factory creates **entire families** of objects through a single interface:

```typescript
interface UIFactory {
  createButton(label: string): UIComponent
  createInput(placeholder: string): UIComponent
  createCard(title: string, content: string): UIComponent
}

class LightThemeFactory implements UIFactory {
  createButton(label: string) { return new LightButton(label) }
  createInput(placeholder: string) { return new LightInput(placeholder) }
  createCard(title: string, content: string) { return new LightCard(title, content) }
}

// Guarantee: all components are from the same theme
function buildUI(factory: UIFactory) {
  const btn = factory.createButton('Submit')
  const input = factory.createInput('Enter name')
  return { btn, input }
}
```

### Difference from Factory Method

| | Factory Method | Abstract Factory |
|---|---------------|-----------------|
| 🎯 What it creates | **One** object | A **family** of objects |
| 🔧 Structure | One factory function | Interface with multiple methods |
| 📋 Choice | Product type | Product family |

## 🔨 Builder

### Problem

Objects with many parameters are cumbersome to create:

```typescript
// ❌ Bad — long constructor, unclear argument order
const query = new Query('users', ['name', 'email'], 'age > 18', 'name', 'asc', 10, 0)
```

### Solution

Builder allows assembling an object **step by step** through a method chain:

```typescript
const query = new QueryBuilder()
  .select('name', 'email')
  .from('users')
  .where('age > 18')
  .orderBy('name', 'asc')
  .limit(10)
  .build()
```

### 🔥 Type-safe Builder in TypeScript

TypeScript allows creating a Builder that enforces required steps **at the type level**:

```typescript
class QueryBuilder<HasSelect extends boolean = false, HasFrom extends boolean = false> {
  select(...fields: string[]): QueryBuilder<true, HasFrom> { /* ... */ }
  from(table: string): QueryBuilder<HasSelect, true> { /* ... */ }

  // build() is only available if select and from have been called
  build(this: QueryBuilder<true, true>): Query { /* ... */ }
}

// ✅ Compiles
new QueryBuilder().select('name').from('users').build()

// ❌ TS Error — from() was not called
new QueryBuilder().select('name').build()
```

> 🔥 **Key insight:** This is one of the most powerful TypeScript patterns — the compiler will not let you call `build()` without the required steps.

## 💎 Singleton

### Problem

Some objects should exist as a single instance: configuration, logger, connection pool. Multiple instances lead to desynchronization:

```typescript
// ❌ Bad — two configuration instances
const config1 = new ConfigManager()
config1.set('theme', 'dark')

const config2 = new ConfigManager()
console.log(config2.get('theme')) // undefined — a different instance!
```

### Solution

Singleton guarantees a single instance:

```typescript
class ConfigManager {
  private static instance: ConfigManager | null = null
  private config = new Map<string, unknown>()

  private constructor() {} // Prevents new ConfigManager()

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  get<T>(key: string): T | undefined {
    return this.config.get(key) as T | undefined
  }

  set<T>(key: string, value: T): void {
    this.config.set(key, value)
  }
}

const config1 = ConfigManager.getInstance()
config1.set('theme', 'dark')

const config2 = ConfigManager.getInstance()
console.log(config2.get('theme')) // 'dark' — the same instance!
```

### Singleton and TypeScript generics

Typing `get/set` via generics makes Singleton type-safe:

```typescript
const manager = ConfigManager.getInstance()
manager.set<number>('maxRetries', 3)
const retries = manager.get<number>('maxRetries') // number | undefined
```

> 📌 **Note:** In modern frontend development, Singleton is often replaced by the module pattern (exporting a single instance from a module) or state managers. However, understanding the pattern is important for backend and infrastructure code.

## ⚠️ Common Beginner Mistakes

### 🐛 1. Factory without an interface

```typescript
// ❌ Bad — factory returns a concrete type
function createNotification(type: string): EmailNotification | SMSNotification {
  // ...
}
```

> ⚠️ **Why this is wrong:** client code is forced to know about concrete classes. Adding a new type requires changing the factory, the return type, and all code that uses the result.

```typescript
// ✅ Good — factory returns an interface
interface Notification {
  send(message: string): string
}

function createNotification(type: NotificationType): Notification {
  // ...
}
```

### 🐛 2. Builder without immutable intermediate steps

```typescript
// ❌ Bad — mutating one builder breaks another
const base = new QueryBuilder().from('users')
const q1 = base.select('name').build()
const q2 = base.select('email').build() // base is already mutated!
```

> ⚠️ **Why this is wrong:** if Builder mutates its own state, reusing intermediate steps leads to unexpected results.

```typescript
// ✅ Good — each step returns a new builder
select(...fields: string[]) {
  const next = this.clone()
  next.fields = fields
  return next
}
```

### 🐛 3. Singleton with a public constructor

```typescript
// ❌ Bad — constructor is public
class Config {
  static instance = new Config()
  constructor() {} // Anyone can do new Config()
}
```

> ⚠️ **Why this is wrong:** nothing prevents creating `new Config()`, bypassing `getInstance()`. Singleton loses its purpose.

```typescript
// ✅ Good — private constructor
class Config {
  private constructor() {}
  static getInstance() { /* ... */ }
}
```

### 🐛 4. Untyped factory parameter

```typescript
// ❌ Bad — string allows any value
function create(type: string) { /* ... */ }
create('emial') // Typo, but TypeScript stays silent
```

> ⚠️ **Why this is wrong:** a string type does not guard against typos. The error will only be discovered at runtime.

```typescript
// ✅ Good — union type
type NotificationType = 'email' | 'sms' | 'push'
function create(type: NotificationType) { /* ... */ }
create('emial') // TS Error!
```

## 📌 Summary

- ✅ **Factory Method** — creating objects of a single interface via a factory function
- ✅ **Abstract Factory** — creating families of related objects
- ✅ **Builder** — step-by-step construction of complex objects with method chaining
- ✅ **Singleton** — guaranteeing a single instance with a global access point
- 💡 TypeScript strengthens every pattern: interfaces, union types, generics, private constructors
- 📌 Factories should always return an **interface**, not a concrete class
