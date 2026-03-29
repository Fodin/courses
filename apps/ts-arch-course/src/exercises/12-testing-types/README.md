# 🔥 Уровень 12: Типы для тестирования

## 🎯 Зачем нужна типизация в тестах

Тесты -- это код, который проверяет другой код. Но кто проверяет тесты? Нетипизированные моки, фикстуры и ассерты -- источник хрупких тестов, которые проходят, но не ловят ошибки.

```typescript
// ❌ Типичная проблема: мок не соответствует интерфейсу
const mockRepo = {
  findById: jest.fn().mockResolvedValue({ id: '1', name: 'Alice' }),
  // Забыли email! Тест пройдёт, но в продакшене findById возвращает User с email
}

// ❌ Фикстура без типов
const testUser = {
  id: '1',
  name: 'Test',
  // Добавили поле role в User — все фикстуры должны обновиться, но TS не предупредит
}
```

TypeScript в тестах позволяет:
- Гарантировать, что мок соответствует реальному интерфейсу
- Автоматически обнаруживать расхождения при изменении интерфейсов
- Типизировать фикстуры с deep partial overrides
- Верифицировать контракты между реализациями

## 📌 Typed Mocks: типобезопасные моки

### MockFunction: обёртка над функцией

Основа типобезопасных моков -- generic-обёртка, которая:
- Сохраняет сигнатуру оригинальной функции
- Трекает вызовы с аргументами
- Позволяет задать возвращаемое значение или реализацию

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

### Создание мока

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

### MockOf: мок целого интерфейса

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

Теперь мок автоматически соответствует интерфейсу:

```typescript
const mockRepo = createMock<UserRepository>({
  findById: Promise.resolve(null),
  findAll: Promise.resolve([]),
  save: Promise.resolve({ id: '1', name: '', email: '' }),
  delete: Promise.resolve(false),
})

// TS знает: mockRepo.findById принимает (string), возвращает Promise<User | null>
mockRepo.findById('user-1')
mockRepo.findById.calledTimes() // 1
```

## 📌 Type-Safe Fixtures: фабрики тестовых данных

### Проблема: дублирование и рассинхронизация

```typescript
// ❌ Каждый тест создаёт объект вручную
const user1 = { id: '1', name: 'Alice', email: 'a@t.com', role: 'user', createdAt: Date.now(), settings: { theme: 'light', notifications: true } }
const user2 = { id: '2', name: 'Bob', email: 'b@t.com', role: 'user', createdAt: Date.now(), settings: { theme: 'light', notifications: true } }
// При добавлении нового поля все тесты ломаются
```

### Решение: фабрика с типизированными overrides

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

### Создание фабрики

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
  'id' // sequenceKey — автоинкремент для уникальности
)

// Использование
const user = userFactory.build() // user-1
const admin = userFactory.build({ role: 'admin', settings: { theme: 'dark' } })
// admin.settings.notifications === true (сохраняется из default)
const users = userFactory.buildMany(3, { role: 'moderator' })
```

### Deep Merge для вложенных объектов

При override вложенных объектов важно мержить, а не заменять:

```typescript
// settings: { theme: 'light', notifications: true }
// override: { settings: { theme: 'dark' } }
// Результат: { settings: { theme: 'dark', notifications: true } }  ✅
// НЕ: { settings: { theme: 'dark' } }  ❌
```

## 📌 Contract Tests: контрактное тестирование

### Идея

Contract test -- набор тестов, описывающих поведение интерфейса. Любая реализация этого интерфейса должна проходить все контрактные тесты:

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

### Пример: контракт StorageContract

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

Контрактные тесты:
1. `set` + `get` возвращает значение
2. `get` для отсутствующего ключа возвращает `undefined`
3. `has` возвращает `true` для существующих ключей
4. `delete` удаляет ключ
5. `clear` очищает всё
6. `size` возвращает правильное количество

### Применение к разным реализациям

```typescript
const suite = createContractSuite('StorageContract', storageContractTests(42, 99))

// Обе реализации проходят одни и те же тесты
suite.run(new MapStorage<number>())     // PASS
suite.run(new ObjectStorage<number>())  // PASS
suite.run(new RedisStorage<number>())   // PASS — новая реализация тоже совместима
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Мок с any вместо типизированного

```typescript
// ❌ Плохо: мок не связан с интерфейсом
const mockRepo = {
  findById: jest.fn() as any,  // any всё скрывает
}

// ✅ Хорошо: типобезопасный мок
const mockRepo = createMock<UserRepository>({
  findById: Promise.resolve(null),
})
// При изменении UserRepository TS покажет ошибку
```

### Ошибка 2: Фикстуры с Partial вместо DeepPartial

```typescript
// ❌ Плохо: Partial не работает для вложенных объектов
type Override = Partial<User>
// override({ settings: { theme: 'dark' } })
// TS ошибка: notifications обязателен!

// ✅ Хорошо: DeepPartial позволяет частичные вложенные объекты
type Override = DeepPartial<User>
// override({ settings: { theme: 'dark' } })  // OK, notifications сохранится
```

### Ошибка 3: Контрактные тесты с побочными эффектами

```typescript
// ❌ Плохо: тесты зависят от порядка выполнения
const tests = [
  { name: 'set', test: (s) => { s.set('a', 1); return { passed: true } } },
  { name: 'get', test: (s) => { return { passed: s.get('a') === 1 } } },
  // Если set не вызван до get — тест fails
]

// ✅ Хорошо: каждый тест начинает с чистого состояния
const tests = [
  { name: 'set and get', test: (s) => {
    s.clear()
    s.set('a', 1)
    return { passed: s.get('a') === 1 }
  }},
]
```

### Ошибка 4: buildMany без уникальных идентификаторов

```typescript
// ❌ Плохо: все объекты с одинаковым id
const users = Array.from({ length: 3 }, () => ({ ...defaultUser }))
// users[0].id === users[1].id === users[2].id

// ✅ Хорошо: sequenceKey обеспечивает уникальность
const factory = createFixtureFactory<User>(defaults, 'id')
const users = factory.buildMany(3) // user-1, user-2, user-3
```

## 💡 Best Practices

### 1. Мок = зеркало интерфейса

Используйте `MockOf<T>` вместо ручного создания моков. При изменении интерфейса TypeScript покажет, где мок устарел.

### 2. Одна фабрика на entity

Создавайте отдельную фабрику для каждой сущности. Фабрики можно комбинировать для создания связанных данных.

### 3. Контрактные тесты для всех абстракций

Если у вас есть интерфейс с несколькими реализациями, напишите контрактные тесты. Это гарантирует взаимозаменяемость.

### 4. Изолируйте контрактные тесты

Каждый тест должен начинать с чистого состояния. Вызывайте `clear()` или создавайте новый экземпляр.

### 5. Типизируйте возвращаемые значения моков

```typescript
// ❌ Плохо
mockRepo.findById.mockReturnValue({ id: '1' } as any)

// ✅ Хорошо — TypeScript проверит полноту объекта
mockRepo.findById.mockReturnValue(
  Promise.resolve({ id: '1', name: 'Alice', email: 'a@t.com' })
)
```
