# Level 3: Advanced Dependency Injection

## 🎯 Level Goal

Learn to create type-safe DI containers that guarantee dependency correctness at compile time: correct service types, circular dependency detection, and lifecycle management.

---

## The Problem: Fragile Dependencies

Without a DI container, dependencies are created manually:

```typescript
// ❌ Manual wiring — fragile and doesn't scale
const config = new Config()
const logger = new Logger(config)
const db = new Database(config, logger)
const cache = new Cache(config, logger)
const userRepo = new UserRepository(db, cache, logger)
const userService = new UserService(userRepo, logger)
// 6 lines, and we haven't started working yet...
```

Problems:
- Creation order matters and is easily broken
- Changing a dependency requires editing all creation points
- No lifecycle control (singleton vs transient)
- Testing is difficult — can't substitute a dependency

---

## Pattern 1: Type-Safe DI Container

### Container with Accumulating Registry

```typescript
class Container<TRegistry extends ServiceRegistry = {}> {
  register<K extends string, T>(
    name: K,
    factory: (container: Container<TRegistry>) => T
  ): Container<TRegistry & Record<K, T>> {
    this.factories.set(name, () => factory(this as any))
    return this as any
  }

  resolve<K extends keyof TRegistry>(name: K): TRegistry[K] {
    // ...
  }
}
```

📌 **Accumulating generic**: each `register()` call returns `Container<TRegistry & Record<K, T>>`, extending the registry. This means `resolve()` knows the types of all registered services.

```typescript
const container = new Container()
  .register('config', () => ({ apiUrl: 'https://api.example.com' }))
  .register('logger', () => ({ log: (msg: string) => console.log(msg) }))

// ✅ Type-safe resolve
container.resolve('config').apiUrl    // string
container.resolve('logger').log       // (msg: string) => void

// ❌ Compile errors
container.resolve('unknown')          // Not in registry
container.resolve('config').log       // No log method on config
```

---

## Pattern 2: Injection Tokens

String keys are prone to collisions. Injection Tokens solve this:

```typescript
class InjectionToken<T> {
  readonly _type!: T  // Phantom type
  constructor(public readonly description: string) {}
}

const TOKENS = {
  Logger: token<Logger>('Logger'),
  Config: token<Config>('Config'),
  ApiBaseUrl: token<string>('ApiBaseUrl'),
  MaxRetries: token<number>('MaxRetries'),
}
```

💡 **Why tokens are better than strings**:
1. Each token is a unique object (no name collisions)
2. Phantom type `T` links the token to the service type
3. Autocomplete when using the `TOKENS` object
4. Refactoring is safe — rename through IDE

---

## Pattern 3: Scoped Dependencies

Three lifetime strategies:

### Singleton
One instance for the entire application. Suitable for configuration, loggers, connection pools.

### Transient
New instance on every resolve. Suitable for stateful objects that shouldn't share state.

### Scoped
One instance within a scope. Typical use case — HTTP request: one DB connection per request.

```typescript
const scope = container.createScope()
scope.resolve('dbConnection') === scope.resolve('dbConnection') // true
const scope2 = container.createScope()
scope.resolve('dbConnection') !== scope2.resolve('dbConnection') // true
```

---

## Pattern 4: Auto-Wiring

Automatic dependency resolution from declarative descriptions:

```typescript
class AutoWireContainer {
  register<T>(name: string, dependencies: string[], factory: (...deps: unknown[]) => T): this

  resolve<T>(name: string): T {
    // 1. Find registered service
    // 2. Recursively resolve all dependencies
    // 3. Call factory with resolved dependencies
    // 4. Detect circular dependencies
  }
}
```

### Cycle Detection

```typescript
resolve<T>(name: string): T {
  if (this.resolving.has(name)) {
    throw new Error(`Circular: ${[...this.resolving, name].join(' -> ')}`)
  }
  this.resolving.add(name)
  // ... resolve dependencies ...
  this.resolving.delete(name)
}
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Service Locator Instead of DI

```typescript
// ❌ Service Locator — depends on container
class UserService {
  constructor(private container: Container) {}
  getUser(id: number) {
    const db = this.container.resolve('database') // Tight coupling!
  }
}

// ✅ Dependency Injection — depends on interfaces
class UserService {
  constructor(private db: Database, private logger: Logger) {}
  getUser(id: number) {
    // Class doesn't know about the container
  }
}
```

### Mistake 2: Captive Dependencies

```typescript
// ❌ Singleton depends on scoped — "captive" dependency
container
  .registerScoped('request', () => new RequestContext())
  .registerSingleton('service', (c) => {
    const request = c.resolve('request') // Captured!
    return new Service(request)
  })

// ✅ Rule: singleton can only depend on singleton
```

### Mistake 3: Circular Dependencies Without Detection

```typescript
// ❌ A depends on B, B depends on A -> infinite recursion
container
  .register('a', (c) => new A(c.resolve('b')))
  .register('b', (c) => new B(c.resolve('a')))
// Stack overflow!
```

### Mistake 4: Losing Types with String Keys

```typescript
// ❌ String key — no type checking
container.resolve('logr')  // Typo, but no compile error

// ✅ Injection Token — type guaranteed
container.inject(TOKENS.Logger)  // Logger, typo impossible
```

---

## 🔥 Best Practices

1. **Injection Tokens** over strings — type safety and uniqueness
2. **Lifetime rule**: singleton >= scoped >= transient (don't depend on shorter-lived)
3. **Lazy creation** — resolve on first access, not at registration
4. **Dependency graph** — visualization helps discover problems
5. **Cycle detection** — mandatory for production containers
6. **Scope per request** — HTTP request = one scope (one DB connection)
7. **Interfaces, not implementations** — depend on abstractions
