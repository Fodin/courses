# 🔥 Уровень 0: Generics и ограничения типов

## 🎯 Зачем нужны Generics

Generics (обобщённые типы) -- это один из самых мощных инструментов TypeScript. Они позволяют создавать **переиспользуемые компоненты**, которые работают с разными типами, сохраняя при этом полную типобезопасность.

### Проблема без generics

Без generics мы вынуждены выбирать между типобезопасностью и переиспользуемостью:

```typescript
// ❌ Вариант 1: конкретный тип — не переиспользуемый
function identityNumber(value: number): number {
  return value
}

// ❌ Вариант 2: any — теряем типизацию
function identityAny(value: any): any {
  return value
}

const result = identityAny('hello')
result.toFixed(2) // Нет ошибки компиляции, но упадёт в runtime!
```

### Решение с generics

```typescript
// ✅ Generic-функция — и типобезопасно, и переиспользуемо
function identity<T>(value: T): T {
  return value
}

const str = identity('hello')   // тип: string
const num = identity(42)        // тип: number
str.toFixed(2) // ❌ Ошибка компиляции! Property 'toFixed' does not exist on type 'string'
num.toUpperCase() // ❌ Ошибка компиляции!
```

TypeScript **выводит** (infers) тип `T` из переданного аргумента. Это называется **type inference** (вывод типов).

---

## 📌 Generic Constraints (ограничения)

По умолчанию generic-параметр `T` может быть **любым типом**. Но часто нам нужно ограничить допустимые типы, чтобы безопасно обращаться к определённым свойствам.

### Ключевое слово extends

Ограничение задаётся через `extends`:

```typescript
// T должен иметь свойство length
interface HasLength {
  length: number
}

function logWithLength<T extends HasLength>(value: T): T {
  console.log(`Length: ${value.length}`)
  return value
}

logWithLength('hello')       // ✅ string имеет length
logWithLength([1, 2, 3])    // ✅ array имеет length
logWithLength({ length: 5 }) // ✅ объект с length
logWithLength(42)            // ❌ number не имеет length
```

### Ограничение keyof

`keyof T` создаёт union-тип из всех ключей типа `T`:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }

getProperty(user, 'name')  // ✅ тип: string
getProperty(user, 'age')   // ✅ тип: number
getProperty(user, 'email') // ❌ Argument of type '"email"' is not assignable
```

💡 **Важно:** `T[K]` -- это **indexed access type**. TypeScript точно знает, что `user['name']` возвращает `string`, а `user['age']` -- `number`.

### Множественные ограничения

Можно комбинировать ограничения через `&`:

```typescript
interface Identifiable {
  id: string | number
}

interface Timestamped {
  createdAt: Date
}

function logEntity<T extends Identifiable & Timestamped>(entity: T): void {
  console.log(`[${entity.id}] created at ${entity.createdAt.toISOString()}`)
}

// ✅ Тип соответствует обоим интерфейсам
logEntity({ id: 1, createdAt: new Date(), name: 'test' })

// ❌ Не хватает createdAt
logEntity({ id: 1, name: 'test' })
```

### Ограничение через конструктор

Для фабричных функций нужно ограничить тип как конструируемый:

```typescript
function createInstance<T>(ctor: new () => T): T {
  return new ctor()
}

class UserService {
  greeting = 'Hello from UserService'
}

const service = createInstance(UserService)
console.log(service.greeting) // ✅ "Hello from UserService"
```

Для конструкторов с аргументами:

```typescript
function createWithArgs<T, TArgs extends unknown[]>(
  ctor: new (...args: TArgs) => T,
  ...args: TArgs
): T {
  return new ctor(...args)
}

class ApiClient {
  constructor(public baseUrl: string, public timeout: number) {}
}

// TS выводит TArgs как [string, number]
const client = createWithArgs(ApiClient, 'https://api.example.com', 5000)
```

---

## 📌 Default Type Parameters (типы по умолчанию)

Так же как функции могут иметь значения по умолчанию для параметров, generics могут иметь **типы по умолчанию**:

```typescript
interface ApiResponse<TData = unknown, TError = Error> {
  data: TData | null
  error: TError | null
  status: number
}

// Используем дефолтные типы
const resp1: ApiResponse = { data: null, error: null, status: 200 }

// Переопределяем первый параметр
const resp2: ApiResponse<User> = { data: { name: 'Alice' }, error: null, status: 200 }

// Переопределяем оба
const resp3: ApiResponse<User, ApiError> = { data: null, error: { code: 404 }, status: 404 }
```

### Правила для дефолтных параметров

```typescript
// ✅ Правильно: параметры с дефолтами идут после параметров без дефолтов
interface Good<T, U = string> {}

// ❌ Ошибка: параметр без дефолта после параметра с дефолтом
interface Bad<T = string, U> {} // Required type parameters may not follow optional type parameters
```

### Дефолт, зависящий от другого параметра

```typescript
interface Collection<TItem, TKey extends keyof TItem = keyof TItem> {
  items: TItem[]
  indexBy: TKey
}

interface Product {
  id: number
  sku: string
  name: string
}

// Явно указан ключ
const byId: Collection<Product, 'id'> = {
  items: [],
  indexBy: 'id' // только 'id' допустим
}

// Дефолт = keyof Product, то есть 'id' | 'sku' | 'name'
const byAny: Collection<Product> = {
  items: [],
  indexBy: 'sku' // любой ключ Product допустим
}
```

---

## 📌 Type Inference в функциях

TypeScript умеет **выводить** generic-параметры из аргументов функции, избавляя нас от необходимости указывать типы явно.

### Вывод из одного аргумента

```typescript
function wrap<T>(value: T): { value: T } {
  return { value }
}

const wrapped = wrap('hello')
// TypeScript вывел: wrap<string>('hello') → { value: string }
```

### Вывод из нескольких аргументов

```typescript
function makePair<A, B>(first: A, second: B): [A, B] {
  return [first, second]
}

const pair = makePair('key', 42)
// Вывод: makePair<string, number> → [string, number]
```

### Вывод из колбэков

```typescript
function mapArray<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn)
}

// T выводится из arr, U — из возвращаемого типа fn
const lengths = mapArray(['hello', 'world'], (s) => s.length)
// T = string, U = number → number[]
```

### Вывод с keyof

```typescript
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key])
}

const users = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]

const names = pluck(users, 'name')  // string[]
const ages = pluck(users, 'age')    // number[]
```

💡 **Важно:** TypeScript выводит точный тип возвращаемого значения `T[K]`, а не обобщённый `T[keyof T]`.

---

## 📌 Conditional Types с Generic

Условные типы становятся по-настоящему мощными в комбинации с generics:

```typescript
type IsArray<T> = T extends unknown[] ? true : false

type A = IsArray<string[]>  // true
type B = IsArray<number>    // false
```

### infer — извлечение типов

Ключевое слово `infer` позволяет «вытащить» часть типа внутри условного выражения:

```typescript
// Извлечь тип элемента массива
type ElementType<T> = T extends (infer E)[] ? E : T

type A = ElementType<string[]>   // string
type B = ElementType<number[]>   // number
type C = ElementType<boolean>    // boolean (не массив — вернуть как есть)

// Извлечь возвращаемый тип функции
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type D = MyReturnType<() => string>           // string
type E = MyReturnType<(x: number) => boolean> // boolean

// Извлечь тип из Promise
type Awaited<T> = T extends Promise<infer U> ? U : T

type F = Awaited<Promise<string>>  // string
type G = Awaited<number>           // number
```

---

## 📌 Generic Factories

Фабричные функции -- один из самых практичных паттернов для generics.

### Builder Pattern

```typescript
function createBuilder<T extends Record<string, unknown>>(initial: T) {
  const state = { ...initial }

  return {
    set<K extends keyof T>(key: K, value: T[K]) {
      state[key] = value
      return this
    },
    build(): Readonly<T> {
      return Object.freeze({ ...state })
    }
  }
}

const config = createBuilder({ host: '', port: 0, debug: false })
  .set('host', 'localhost')
  .set('port', 8080)
  .set('debug', true)
  .build()
// config: Readonly<{ host: string; port: number; debug: boolean }>
```

### Validator Factory

```typescript
type Validator<T> = {
  validate: (value: unknown) => value is T
  parse: (value: unknown) => T
}

function createValidator<T>(
  check: (value: unknown) => value is T,
  typeName: string
): Validator<T> {
  return {
    validate: check,
    parse(value) {
      if (check(value)) return value
      throw new Error(`Expected ${typeName}, got ${typeof value}`)
    }
  }
}

const isString = createValidator(
  (v: unknown): v is string => typeof v === 'string',
  'string'
)

isString.parse('hello')  // ✅ 'hello'
isString.parse(42)       // ❌ throws Error
```

---

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Лишние generic-параметры

```typescript
// ❌ Плохо: T не добавляет ценности
function logValue<T>(value: T): void {
  console.log(value)
}

// ✅ Хорошо: generic не нужен, если тип не используется в возврате или других параметрах
function logValue(value: unknown): void {
  console.log(value)
}
```

📌 **Правило:** если generic-параметр используется только в одном месте — скорее всего, он не нужен.

### Ошибка 2: Ограничение вместо конкретного типа

```typescript
// ❌ Плохо: extends string, но возвращает string (а не T)
function processName<T extends string>(name: T): string {
  return name.toUpperCase()
}

const result = processName('hello' as const)
// result: string — потеряли литеральный тип!

// ✅ Хорошо: возвращаем T (или Uppercase<T>)
function processName<T extends string>(name: T): Uppercase<T> {
  return name.toUpperCase() as Uppercase<T>
}

const result = processName('hello' as const)
// result: "HELLO"
```

### Ошибка 3: Забыли constraint

```typescript
// ❌ Ошибка: Property 'length' does not exist on type 'T'
function getLength<T>(value: T): number {
  return value.length // Error!
}

// ✅ Исправлено: добавили ограничение
function getLength<T extends { length: number }>(value: T): number {
  return value.length
}
```

### Ошибка 4: Неправильный порядок дефолтных параметров

```typescript
// ❌ Ошибка компиляции
interface BadOrder<T = string, U> {
  first: T
  second: U
}

// ✅ Параметры с дефолтами — в конце
interface GoodOrder<U, T = string> {
  first: T
  second: U
}
```

### Ошибка 5: Явное указание типа вместо вывода

```typescript
function makePair<A, B>(a: A, b: B): [A, B] {
  return [a, b]
}

// ❌ Избыточно: TypeScript отлично выведет типы сам
const pair = makePair<string, number>('hello', 42)

// ✅ Лучше: позволить inference работать
const pair = makePair('hello', 42) // [string, number]
```

---

## 💡 Best Practices

1. **Используйте минимально необходимые constraints.** Не ограничивайте больше, чем нужно функции.

2. **Давайте осмысленные имена параметрам.** Вместо `T, U, V` используйте `TItem, TKey, TResult` для сложных generics.

3. **Полагайтесь на inference.** Не указывайте generic-параметры явно, если TypeScript может их вывести.

4. **Используйте дефолтные типы** для публичных API, чтобы упростить использование в простых случаях.

5. **Тестируйте edge-cases.** Проверяйте, как ваш generic ведёт себя с `never`, `unknown`, `any`, union-типами.

6. **Один generic-параметр = одна задача.** Не создавайте функции с 5+ generic-параметрами — разбейте на несколько функций.
