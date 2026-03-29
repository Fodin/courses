# Level 2: Type-Safe Builders

## 🎯 Level Goal

Learn to create Builder patterns where TypeScript controls method call order, tracks set properties, and restricts available methods based on current state.

---

## The Problem: Builders Without Guarantees

Classic Builders in JavaScript don't protect against errors:

```typescript
// ❌ Nothing prevents forgetting required fields
const request = new RequestBuilder()
  .header('Content-Type', 'application/json')
  .build() // Oops — forgot URL and method!

// ❌ Nothing prevents calling body for GET
const getRequest = new RequestBuilder()
  .get('/api/users')
  .body({ data: 'oops' }) // GET with body — semantic error!
  .build()
```

---

## Pattern 1: Step Builder

Step Builder uses different interfaces for each step, controlling call sequence:

```typescript
// Each step returns the next step's interface
interface Step1_ChooseMethod {
  get(url: string): Step3_Configure
  post(url: string): Step2_SetBody
  put(url: string): Step2_SetBody
  delete(url: string): Step3_Configure
}

interface Step2_SetBody {
  body(data: string | object): Step3_Configure
}

interface Step3_Configure {
  header(key: string, value: string): Step3_Configure
  timeout(ms: number): Step3_Configure
  build(): HttpRequest
}
```

💡 **Key idea**: the return type of each method determines which methods are available next.

### Step Builder Guarantees

```typescript
// ✅ GET: method -> configure -> build
createRequestBuilder().get('/users').header('Auth', 'Bearer').build()

// ✅ POST: method -> body -> configure -> build
createRequestBuilder().post('/users').body({ name: 'John' }).build()

// ❌ GET with body — body() method not available on step3
createRequestBuilder().get('/users').body({})  // Compile error!

// ❌ POST without body — build() not available on step2
createRequestBuilder().post('/users').build()  // Compile error!
```

---

## Pattern 2: Accumulating Builder

Accumulating Builder tracks set properties through a generic parameter:

```typescript
class FormBuilder<TSet extends Partial<Record<'title' | 'action' | 'method', true>> = {}> {
  private config: Partial<FormConfig> = {}

  title(value: string): FormBuilder<TSet & { title: true }> {
    this.config.title = value
    return this as any
  }

  // build() available only when all required fields are set
  build(
    this: FormBuilder<{ title: true; action: true; method: true }>
  ): FormConfig {
    return this.config as FormConfig
  }
}
```

📌 **Key trick**: each setter returns `FormBuilder<TSet & { field: true }>`. The `build()` method uses `this:` parameter for restriction — it's available only when `TSet` contains all required keys.

### Advantages Over Step Builder

1. **Order doesn't matter** — methods can be called in any order
2. **Optional methods** — don't affect `build()` availability
3. **Better autocomplete** — IDE shows all available methods

---

## Pattern 3: Conditional Builder Methods

Builder methods available only based on current state:

```typescript
class DbConfigBuilder<T extends 'postgres' | 'mysql' | 'sqlite' | null = null> {
  postgres(): DbConfigBuilder<'postgres'> { /* ... */ }
  mysql(): DbConfigBuilder<'mysql'> { /* ... */ }
  sqlite(): DbConfigBuilder<'sqlite'> { /* ... */ }

  // Only for network databases
  host(this: DbConfigBuilder<'postgres'> | DbConfigBuilder<'mysql'>, h: string): this {
    /* ... */
  }

  // PostgreSQL only
  ssl(this: DbConfigBuilder<'postgres'>, enabled: boolean): this { /* ... */ }

  // SQLite only
  filename(this: DbConfigBuilder<'sqlite'>, path: string): this { /* ... */ }
}
```

💡 **This-parameter typing**: TypeScript allows specifying the `this` type in method parameters. If a method is called on an object with an incompatible `this`, it causes a compile error.

```typescript
// ✅ PostgreSQL: ssl and poolSize available
new DbConfigBuilder().postgres().host('localhost').ssl(true).build()

// ❌ SQLite doesn't have host
new DbConfigBuilder().sqlite().host('localhost')  // Compile error!
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Mutable Builder Returning this

```typescript
// ❌ Returning this doesn't change the type
class BadBuilder {
  setUrl(url: string) { return this } // Type always BadBuilder
  build() { return { url: this.url! } } // May crash at runtime!
}

// ✅ Returning new type
class GoodBuilder<TSet extends {}> {
  setUrl(url: string): GoodBuilder<TSet & { url: true }> { /* ... */ }
  build(this: GoodBuilder<{ url: true }>): Config { /* ... */ }
}
```

### Mistake 2: Too Many Steps in Step Builder

```typescript
// ❌ 10 steps — impossible to remember the order
builder.step1().step2().step3()...step10().build()

// ✅ Step Builder for 2-4 required steps, Accumulating for more
```

### Mistake 3: Losing Generic Context During Cast

```typescript
// ❌ as any loses typing
title(value: string) {
  return this as any // All types lost!
}

// ✅ Explicit cast preserving generic
title(value: string): FormBuilder<TSet & { title: true }> {
  return this as unknown as FormBuilder<TSet & { title: true }>
}
```

### Mistake 4: Missing Defaults for Optional Parameters

```typescript
// ❌ Optional fields can be undefined
build(): Config {
  return { logging: this.config.logging } // undefined if not called

// ✅ Defaults in build
  return { logging: this.config.logging ?? false } // Guaranteed default
}
```

---

## 🔥 Best Practices

1. **Step Builder** for strict sequences (HTTP: method -> body -> headers)
2. **Accumulating Builder** when call order doesn't matter but required fields are needed
3. **Conditional Builder** for branching configurations (different DBs, protocols)
4. **Immutable builder** — each method creates a new instance (functional style)
5. **Default values** for all optional parameters in `build()`
6. **Fluent API** — all setters return `this` (or new type) for chaining
7. **Minimum steps** — no more than 4-5 in Step Builder, otherwise use Accumulating
