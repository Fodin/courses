# 🔥 Уровень 6: Продвинутые Type Guards

## 🎯 Введение

Type guards (защитники типов) — механизм TypeScript, позволяющий **сужать** тип переменной на основе runtime-проверок. Вы уже знакомы с базовыми guards: `typeof`, `instanceof`, `in`. На этом уровне мы изучим **продвинутые** техники: пользовательские type predicates (`is`), assertion functions (`asserts`), и generic-narrowing.

Эти паттерны критически важны для работы с данными из внешних источников (API, пользовательский ввод, `unknown`), где TypeScript не может вывести тип автоматически.

## 🔥 Встроенные type guards — напоминание

```typescript
// typeof guard
function process(value: string | number) {
  if (typeof value === 'string') {
    value.toUpperCase() // TypeScript знает: string
  } else {
    value.toFixed(2) // TypeScript знает: number
  }
}

// instanceof guard
function handleError(error: Error | string) {
  if (error instanceof TypeError) {
    error.message // TypeScript знает: TypeError
  }
}

// in guard
function hasName(obj: { name: string } | { id: number }) {
  if ('name' in obj) {
    obj.name // TypeScript знает: { name: string }
  }
}
```

Проблема: эти guards ограничены — они не могут проверить сложные условия или пользовательские типы.

## 🔥 Custom Type Predicates (is)

### Синтаксис

```typescript
function isType(value: SourceType): value is TargetType {
  // runtime-проверка
  return /* boolean */
}
```

Ключевая часть — **возвращаемый тип** `value is TargetType`. Это **type predicate** — обещание компилятору, что если функция вернёт `true`, то `value` имеет тип `TargetType`.

### Базовые примеры

```typescript
interface User {
  id: number
  name: string
  email: string
}

interface Admin extends User {
  role: 'admin'
  permissions: string[]
}

// Type predicate для Admin
function isAdmin(user: User): user is Admin {
  return 'role' in user && (user as Admin).role === 'admin'
}

function greet(user: User) {
  if (isAdmin(user)) {
    // TypeScript знает: user is Admin
    console.log(`Admin ${user.name}, permissions: ${user.permissions.join(', ')}`)
  } else {
    // TypeScript знает: user is User (но не Admin)
    console.log(`User ${user.name}`)
  }
}
```

### Фильтрация массивов

Type predicates особенно полезны с `Array.filter`:

```typescript
function isNotNull<T>(value: T | null | undefined): value is T {
  return value != null
}

const values: (string | null)[] = ['hello', null, 'world', null]

// Без type predicate: (string | null)[]
const bad = values.filter(v => v != null)

// С type predicate: string[]
const good = values.filter(isNotNull)
```

📌 Без type predicate `filter` возвращает тот же тип массива. С predicate — TypeScript сужает тип элементов.

### Composable guards

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNonEmpty(value: string): value is string {
  return value.length > 0
}

// Комбинация guards
function isNonEmptyString(value: unknown): value is string {
  return isString(value) && isNonEmpty(value)
}

const items: unknown[] = [42, '', 'hello', null, 'world']
const valid = items.filter(isNonEmptyString)
// string[]: ['hello', 'world']
```

### Guard для валидации API-ответов

```typescript
interface ApiResponse<T> {
  status: number
  data: T
}

interface SuccessResponse<T> extends ApiResponse<T> {
  status: 200
  data: T
}

interface ErrorResponse extends ApiResponse<null> {
  status: 400 | 404 | 500
  data: null
  error: string
}

function isSuccess<T>(
  response: ApiResponse<T | null>
): response is SuccessResponse<T> {
  return response.status === 200 && response.data !== null
}

async function fetchUser(id: string) {
  const response: ApiResponse<User | null> = await fetch(`/api/users/${id}`).then(r => r.json())

  if (isSuccess(response)) {
    // TypeScript знает: response.data is User
    console.log(response.data.name)
  }
}
```

## 🔥 Assertion Functions (asserts)

### Отличие от type predicates

| | Type predicate (`is`) | Assertion (`asserts`) |
|---|---|---|
| Возвращаемый тип | `value is Type` | `asserts value is Type` |
| Что возвращает | `boolean` | `void` (или бросает ошибку) |
| Контроль потока | `if (isX(value))` | `assertX(value); // далее value: Type` |
| Аналогия | Проверка: «является ли?» | Утверждение: «гарантирую, что является» |

### asserts condition

```typescript
function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Assertion failed')
  }
}

function processUser(user: User | null) {
  assert(user !== null, 'User must not be null')
  // После assert TypeScript знает: user is User
  console.log(user.name)
}
```

### asserts value is Type

```typescript
function assertDefined<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T {
  if (value == null) {
    throw new Error(message ?? 'Value is null or undefined')
  }
}

function assertIsUser(value: unknown): asserts value is User {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Expected an object')
  }
  const obj = value as Record<string, unknown>
  if (typeof obj.id !== 'number') throw new Error('id must be a number')
  if (typeof obj.name !== 'string') throw new Error('name must be a string')
  if (typeof obj.email !== 'string') throw new Error('email must be a string')
}
```

### Паттерн: валидация на входе функции

```typescript
function createOrder(userId: unknown, items: unknown) {
  assertDefined(userId, 'userId is required')
  assertIsString(userId) // asserts userId is string
  assertIsNonEmptyArray(items) // asserts items is [unknown, ...unknown[]]

  // Далее TypeScript знает точные типы
  return { userId, items, createdAt: new Date() }
}
```

### Assertion для массивов

```typescript
function assertNonEmpty<T>(
  arr: T[],
  message?: string
): asserts arr is [T, ...T[]] {
  if (arr.length === 0) {
    throw new Error(message ?? 'Expected non-empty array')
  }
}

function processItems(items: string[]) {
  assertNonEmpty(items, 'At least one item required')
  // TypeScript знает: items is [string, ...string[]]
  const [first, ...rest] = items
  console.log(`First: ${first}, rest: ${rest.length}`)
}
```

### Assertion chains

```typescript
function processApiData(raw: unknown) {
  // Каждый assert сужает тип для последующего кода
  assertDefined(raw)                    // raw: {} (non-null)
  assertHasProperty(raw, 'data')        // raw: { data: unknown }
  assertIsArray(raw.data)               // raw: { data: unknown[] }
  assertNonEmpty(raw.data)              // raw: { data: [unknown, ...unknown[]] }

  return raw.data.map(item => processItem(item))
}
```

## 🔥 Generic Narrowing

### Generic type guard для свойств

```typescript
function hasProperty<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj
}

const data: unknown = { name: 'Alice', age: 30 }

if (hasProperty(data, 'name')) {
  // data: Record<'name', unknown>
  console.log(data.name)
}
```

### Type guard с проверкой типа значения

```typescript
function hasTypedProperty<K extends string, V>(
  obj: unknown,
  key: K,
  guard: (value: unknown) => value is V
): obj is Record<K, V> {
  return hasProperty(obj, key) && guard(obj[key])
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

if (hasTypedProperty(data, 'name', isString)) {
  // data: Record<'name', string>
  data.name.toUpperCase() // ✅ TypeScript знает, что name — string
}
```

### Guard для массивов с generic

```typescript
function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(guard)
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

const arr: unknown = [1, 2, 3]
if (isArrayOf(arr, isNumber)) {
  // arr: number[]
  const sum = arr.reduce((a, b) => a + b, 0)
}
```

### Guard factory pattern

```typescript
function createGuard<T>(
  check: (value: unknown) => boolean
): (value: unknown) => value is T {
  return (value: unknown): value is T => check(value)
}

interface Product {
  id: number
  name: string
  price: number
}

const isProduct = createGuard<Product>((value) => {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number'
  )
})

const data: unknown = { id: 1, name: 'Laptop', price: 999 }
if (isProduct(data)) {
  console.log(data.name, data.price) // ✅ полная типизация
}
```

### Guard для discriminated unions

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

function isSuccess<T>(result: Result<T>): result is Extract<Result<T>, { success: true }> {
  return result.success === true
}

function isFailure<T>(result: Result<T>): result is Extract<Result<T>, { success: false }> {
  return result.success === false
}

function processResult<T>(result: Result<T>) {
  if (isSuccess(result)) {
    // result: { success: true; data: T }
    return result.data
  }
  // result: { success: false; error: string }
  throw new Error(result.error)
}
```

## 🔥 Продвинутые паттерны

### Schema validation с type guards

```typescript
type Schema<T> = {
  [K in keyof T]: (value: unknown) => value is T[K]
}

function validateSchema<T>(
  data: unknown,
  schema: Schema<T>
): data is T {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>

  for (const key in schema) {
    if (!schema[key](obj[key])) return false
  }
  return true
}

interface User {
  name: string
  age: number
  active: boolean
}

const userSchema: Schema<User> = {
  name: (v): v is string => typeof v === 'string',
  age: (v): v is number => typeof v === 'number',
  active: (v): v is boolean => typeof v === 'boolean',
}

const raw: unknown = { name: 'Alice', age: 30, active: true }
if (validateSchema<User>(raw, userSchema)) {
  // raw: User
  console.log(raw.name)
}
```

### Branded types с guards

```typescript
type Email = string & { readonly __brand: 'Email' }
type PositiveNumber = number & { readonly __brand: 'Positive' }

function isEmail(value: string): value is Email {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isPositive(value: number): value is PositiveNumber {
  return value > 0
}

function sendEmail(to: Email, amount: PositiveNumber) {
  console.log(`Sending $${amount} to ${to}`)
}

const email = 'user@example.com'
const amount = 100

if (isEmail(email) && isPositive(amount)) {
  sendEmail(email, amount) // ✅ TypeScript доволен
}
```

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Type predicate не соответствует реальной проверке

```typescript
// ❌ Опасно! Predicate обещает User, но проверка неполная
function isUser(value: unknown): value is User {
  return typeof value === 'object' // Только проверка на object!
}

const data: unknown = { foo: 'bar' }
if (isUser(data)) {
  // TypeScript верит, что data: User, но data.name — undefined!
  console.log(data.name.toUpperCase()) // Runtime error!
}

// ✅ Полная проверка всех полей
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).id === 'number' &&
    typeof (value as Record<string, unknown>).name === 'string' &&
    typeof (value as Record<string, unknown>).email === 'string'
  )
}
```

📌 TypeScript **доверяет** вашему type predicate. Если проверка неполная — вы получите runtime-ошибку при полной уверенности компилятора.

### Ошибка 2: Assertion function не бросает ошибку

```typescript
// ❌ Assertion должна бросать ошибку, если условие не выполнено
function assertString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    console.log('Not a string') // ⚠️ Не бросает ошибку!
    // TypeScript всё равно сузит тип — но значение не строка!
  }
}

// ✅ Всегда бросайте ошибку в assertion functions
function assertString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError(`Expected string, got ${typeof value}`)
  }
}
```

### Ошибка 3: Не учтён null в проверке

```typescript
// ❌ typeof null === 'object' — классическая ловушка
function hasName(obj: unknown): obj is { name: string } {
  return typeof obj === 'object' && typeof (obj as Record<string, unknown>).name === 'string'
  // null пройдёт проверку typeof obj === 'object'!
}

// ✅ Явная проверка на null
function hasName(obj: unknown): obj is { name: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as Record<string, unknown>).name === 'string'
  )
}
```

### Ошибка 4: Guard в стрелочной функции без аннотации

```typescript
// ❌ Стрелочная функция без return type — не guard
const isString = (value: unknown) => typeof value === 'string'
// Тип: (value: unknown) => boolean — НЕ type predicate!

// ✅ Явная аннотация return type
const isString = (value: unknown): value is string =>
  typeof value === 'string'
```

### Ошибка 5: Assertion в async функции

```typescript
// ❌ asserts не работает с async функциями
async function assertUser(id: string): asserts id is string {
  // Ошибка: assertion function cannot be async
}

// ✅ Assertion внутри обычной функции, async-логика отдельно
async function loadAndValidateUser(id: string): Promise<User> {
  const data = await fetchUser(id)
  assertIsUser(data) // Обычная assertion function
  return data
}
```

## 💡 Best practices

1. **Type predicate должен точно соответствовать проверке**: не обещайте `User`, если проверяете только `typeof obj === 'object'`

2. **Assertion functions всегда должны бросать ошибку**: если условие не выполнено — `throw`, никогда не `return`

3. **Используйте generic guards для переиспользования**: `isArrayOf<T>`, `hasProperty<K>` — универсальные строительные блоки

4. **Комбинируйте guards**: маленькие, специализированные guards легче тестировать и комбинировать

5. **Помните о null**: `typeof null === 'object'` — всегда проверяйте `obj !== null`

6. **Предпочитайте assertion functions для входных данных**: в начале функции проверьте все предусловия и сузьте типы

7. **Не используйте assertion functions в async-контексте**: `asserts` не совместим с `async`

## 📌 Резюме

| Техника | Синтаксис | Когда использовать |
|---------|-----------|-------------------|
| Type predicate | `value is Type` | Проверка типа в if/filter |
| Assertion function | `asserts value is Type` | Валидация на входе функции |
| `asserts condition` | `asserts condition` | Проверка произвольных условий |
| Generic guard | `<T>(value, guard) => value is T` | Переиспользуемые проверки |
| Guard factory | `createGuard<T>(check)` | Создание guards из описания |
| Schema validation | `Schema<T> + validateSchema` | Валидация объектов по схеме |
| Branded type guard | `value is BrandedType` | Номинальная типизация |
