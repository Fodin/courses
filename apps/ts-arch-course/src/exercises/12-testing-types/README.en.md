# 🔥 Level 12: Testing Types

## 🎯 Why Type Safety in Tests Matters

Tests are code that verifies other code. But who verifies the tests? Untyped mocks, fixtures, and assertions are a source of brittle tests that pass but don't catch real bugs.

```typescript
// ❌ Typical problem: mock doesn't match the interface
const mockRepo = {
  findById: jest.fn().mockResolvedValue({ id: '1', name: 'Alice' }),
  // Forgot email! Test passes, but in production findById returns User with email
}

// ❌ Fixture without types
const testUser = {
  id: '1',
  name: 'Test',
  // Added role field to User — all fixtures need updating, but TS won't warn
}
```

TypeScript in tests enables:
- Guaranteeing that mocks match real interfaces
- Automatically detecting mismatches when interfaces change
- Typing fixtures with deep partial overrides
- Verifying contracts between implementations

## 📌 Typed Mocks: Type-Safe Mocks

### MockFunction: Function Wrapper

The foundation of type-safe mocks is a generic wrapper that:
- Preserves the original function signature
- Tracks calls with arguments
- Allows setting return values or implementations

```typescript
type MockFunction<TArgs extends unknown[], TReturn> = {
  (...args: TArgs): TReturn
  calls: TArgs[]
  returnValues: TReturn[]
  mockReturnValue(value: TReturn): void
  mockImplementation(fn: (...args: TArgs) => TReturn): void
  calledWith(...args: TArgs): boolean
  calledTimes(): number
  reset(): void
}
```

### Creating a Mock

```typescript
function createMockFn<TArgs extends unknown[], TReturn>(
  defaultReturn: TReturn
): MockFunction<TArgs, TReturn> {
  let returnValue = defaultReturn
  let implementation: ((...args: TArgs) => TReturn) | null = null
  const calls: TArgs[] = []

  const fn = ((...args: TArgs): TReturn => {
    calls.push(args)
    return implementation ? implementation(...args) : returnValue
  }) as MockFunction<TArgs, TReturn>

  fn.calls = calls
  fn.mockReturnValue = (value) => { returnValue = value }
  fn.mockImplementation = (impl) => { implementation = impl }
  fn.calledWith = (...args) =>
    calls.some((call) => JSON.stringify(call) === JSON.stringify(args))
  fn.calledTimes = () => calls.length
  fn.reset = () => { calls.length = 0; implementation = null }

  return fn
}
```

### MockOf: Mocking an Entire Interface

```typescript
type MockOf<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? MockFunction<A, R>
    : T[K]
}

function createMock<T>(defaults: {
  [K in keyof T]?: T[K] extends (...args: unknown[]) => infer R ? R : T[K]
}): MockOf<T> {
  const mock = {} as Record<string, unknown>
  for (const [key, value] of Object.entries(defaults)) {
    mock[key] = createMockFn(value)
  }
  return mock as MockOf<T>
}
```

Now the mock automatically conforms to the interface:

```typescript
const mockRepo = createMock<UserRepository>({
  findById: Promise.resolve(null),
  findAll: Promise.resolve([]),
  save: Promise.resolve({ id: '1', name: '', email: '' }),
  delete: Promise.resolve(false),
})

// TS knows: mockRepo.findById accepts (string), returns Promise<User | null>
mockRepo.findById('user-1')
mockRepo.findById.calledTimes() // 1
```

## 📌 Type-Safe Fixtures: Test Data Factories

### Problem: Duplication and Desynchronization

```typescript
// ❌ Each test creates objects manually
const user1 = { id: '1', name: 'Alice', email: 'a@t.com', role: 'user', createdAt: Date.now(), settings: { theme: 'light', notifications: true } }
const user2 = { id: '2', name: 'Bob', email: 'b@t.com', role: 'user', createdAt: Date.now(), settings: { theme: 'light', notifications: true } }
// When adding a new field, all tests break
```

### Solution: Factory with Typed Overrides

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type FixtureFactory<T> = {
  build(overrides?: DeepPartial<T>): T
  buildMany(count: number, overrides?: DeepPartial<T>): T[]
  buildWith<K extends keyof T>(key: K, value: T[K]): T
  reset(): void
}
```

### Creating a Factory

```typescript
const userFactory = createFixtureFactory<User>(
  () => ({
    id: 'user',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    createdAt: Date.now(),
    settings: { theme: 'light', notifications: true },
  }),
  'id' // sequenceKey — auto-increment for uniqueness
)

// Usage
const user = userFactory.build() // user-1
const admin = userFactory.build({ role: 'admin', settings: { theme: 'dark' } })
// admin.settings.notifications === true (preserved from default)
const users = userFactory.buildMany(3, { role: 'moderator' })
```

### Deep Merge for Nested Objects

When overriding nested objects, it's important to merge rather than replace:

```typescript
// settings: { theme: 'light', notifications: true }
// override: { settings: { theme: 'dark' } }
// Result: { settings: { theme: 'dark', notifications: true } }  ✅
// NOT: { settings: { theme: 'dark' } }  ❌
```

## 📌 Contract Tests: Contract Testing

### The Idea

A contract test is a set of tests describing the behavior of an interface. Any implementation of that interface should pass all contract tests:

```typescript
type ContractTest<T> = {
  readonly name: string
  readonly test: (impl: T) => { passed: boolean; message: string }
}

type ContractSuite<T> = {
  readonly name: string
  readonly tests: ContractTest<T>[]
  run(impl: T): { results: Array<{ test: string; passed: boolean; message: string }> }
}
```

### Example: StorageContract

```typescript
interface StorageContract<T> {
  get(key: string): T | undefined
  set(key: string, value: T): void
  has(key: string): boolean
  delete(key: string): boolean
  clear(): void
  size(): number
}
```

Contract tests:
1. `set` + `get` returns the value
2. `get` for missing key returns `undefined`
3. `has` returns `true` for existing keys
4. `delete` removes the key
5. `clear` removes everything
6. `size` returns the correct count

### Applying to Different Implementations

```typescript
const suite = createContractSuite('StorageContract', storageContractTests(42, 99))

// Both implementations pass the same tests
suite.run(new MapStorage<number>())     // PASS
suite.run(new ObjectStorage<number>())  // PASS
suite.run(new RedisStorage<number>())   // PASS — new implementation is also compatible
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Mocking with any Instead of Typed Mocks

```typescript
// ❌ Bad: mock is not tied to the interface
const mockRepo = {
  findById: jest.fn() as any,  // any hides everything
}

// ✅ Good: type-safe mock
const mockRepo = createMock<UserRepository>({
  findById: Promise.resolve(null),
})
// When UserRepository changes, TS will show an error
```

### Mistake 2: Fixtures with Partial Instead of DeepPartial

```typescript
// ❌ Bad: Partial doesn't work for nested objects
type Override = Partial<User>
// override({ settings: { theme: 'dark' } })
// TS error: notifications is required!

// ✅ Good: DeepPartial allows partial nested objects
type Override = DeepPartial<User>
// override({ settings: { theme: 'dark' } })  // OK, notifications preserved
```

### Mistake 3: Contract Tests with Side Effects

```typescript
// ❌ Bad: tests depend on execution order
const tests = [
  { name: 'set', test: (s) => { s.set('a', 1); return { passed: true } } },
  { name: 'get', test: (s) => { return { passed: s.get('a') === 1 } } },
  // If set not called before get — test fails
]

// ✅ Good: each test starts with clean state
const tests = [
  { name: 'set and get', test: (s) => {
    s.clear()
    s.set('a', 1)
    return { passed: s.get('a') === 1 }
  }},
]
```

### Mistake 4: buildMany Without Unique Identifiers

```typescript
// ❌ Bad: all objects have the same id
const users = Array.from({ length: 3 }, () => ({ ...defaultUser }))
// users[0].id === users[1].id === users[2].id

// ✅ Good: sequenceKey ensures uniqueness
const factory = createFixtureFactory<User>(defaults, 'id')
const users = factory.buildMany(3) // user-1, user-2, user-3
```

## 💡 Best Practices

### 1. Mock = Mirror of the Interface

Use `MockOf<T>` instead of creating mocks manually. When the interface changes, TypeScript will show where the mock is outdated.

### 2. One Factory per Entity

Create a separate factory for each entity. Factories can be combined to create related data.

### 3. Contract Tests for All Abstractions

If you have an interface with multiple implementations, write contract tests. This guarantees interchangeability.

### 4. Isolate Contract Tests

Each test should start from a clean state. Call `clear()` or create a new instance.

### 5. Type Mock Return Values

```typescript
// ❌ Bad
mockRepo.findById.mockReturnValue({ id: '1' } as any)

// ✅ Good — TypeScript checks object completeness
mockRepo.findById.mockReturnValue(
  Promise.resolve({ id: '1', name: 'Alice', email: 'a@t.com' })
)
```
