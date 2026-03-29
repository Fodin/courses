# Уровень 0: Строгие API-контракты

## 🎯 Цель уровня

Научиться проектировать типобезопасные контракты между фронтендом и бэкендом, чтобы ошибки интеграции обнаруживались **на этапе компиляции**, а не в рантайме.

---

## Проблема: хрупкие API-вызовы

В типичном проекте HTTP-запросы выглядят так:

```typescript
// ❌ Типичный подход — никакой типобезопасности
const response = await fetch('/api/users')
const data = await response.json() // any!

// Опечатка в поле? Узнаем только в рантайме
console.log(data.nmae) // undefined, но TypeScript молчит
```

Каждый `fetch` возвращает `Promise<Response>`, а `.json()` возвращает `Promise<any>`. Это означает:

- Нет автодополнения для полей ответа
- Опечатки в именах полей не отлавливаются
- Изменение API на бэкенде ломает фронтенд **тихо**
- Тело запроса никак не валидируется

---

## Решение: типизированные API-эндпоинты

### Шаг 1: Описание эндпоинтов через дженерики

```typescript
// Типизированный дескриптор эндпоинта
interface ApiEndpoint<TResponse, TBody = never> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  // Фантомные типы — существуют только для TypeScript
  _responseType?: TResponse
  _bodyType?: TBody
}

// Фабричная функция для создания эндпоинтов
function endpoint<TResponse, TBody = never>(
  method: HttpMethod,
  path: string
): ApiEndpoint<TResponse, TBody> {
  return { method, path }
}
```

📌 **Фантомные типы** (`_responseType`, `_bodyType`) — это поля, которые никогда не заполняются в рантайме. Они существуют только для того, чтобы TypeScript мог извлечь информацию о типе через `infer`.

### Шаг 2: Определение API-каталога

```typescript
interface User {
  id: number
  name: string
  email: string
}

interface CreateUserBody {
  name: string
  email: string
}

// ✅ Весь API описан в одном месте
const api = {
  getUsers: endpoint<User[]>('GET', '/api/users'),
  getUser: endpoint<User>('GET', '/api/users/:id'),
  createUser: endpoint<User, CreateUserBody>('POST', '/api/users'),
  deleteUser: endpoint<{ deleted: boolean }>('DELETE', '/api/users/:id'),
}
```

### Шаг 3: Типобезопасный fetch

```typescript
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: number; message: string } }

// Условная типизация: body требуется только если TBody != never
async function typedFetch<TResponse, TBody>(
  endpoint: ApiEndpoint<TResponse, TBody>,
  ...args: TBody extends never ? [] : [body: TBody]
): Promise<ApiResult<TResponse>> {
  const options: RequestInit = {
    method: endpoint.method,
    headers: { 'Content-Type': 'application/json' },
  }

  if (args.length > 0) {
    options.body = JSON.stringify(args[0])
  }

  const response = await fetch(endpoint.path, options)
  const data = await response.json()

  return response.ok
    ? { ok: true, data }
    : { ok: false, error: data }
}
```

💡 **Ключевой трюк**: rest-параметр `...args: TBody extends never ? [] : [body: TBody]` делает аргумент `body` обязательным только для эндпоинтов с телом.

```typescript
// ✅ Автодополнение и проверка типов
const users = await typedFetch(api.getUsers)
//    ^? Promise<ApiResult<User[]>>

const created = await typedFetch(api.createUser, {
  name: 'John',
  email: 'john@example.com'
})
//    ^? Promise<ApiResult<User>>

// ❌ Ошибки компиляции:
await typedFetch(api.getUsers, { name: 'x' }) // GET не принимает body
await typedFetch(api.createUser) // POST требует body
await typedFetch(api.createUser, { foo: 1 }) // Неверная структура body
```

---

## Маппинг ответов: от DTO к доменным типам

API часто возвращает данные в формате, неудобном для фронтенда (snake_case, вложенные ID вместо объектов, центы вместо долларов). Маппинг решает эту проблему типобезопасно.

```typescript
// API возвращает snake_case
interface ApiUserDTO {
  user_id: number
  full_name: string
  email_address: string
  created_at: string  // ISO string
  is_active: boolean
}

// Фронтенд работает с camelCase и правильными типами
interface DomainUser {
  id: number
  name: string
  email: string
  createdAt: Date  // Date, не string!
  isActive: boolean
}
```

### Типизированные маперы

```typescript
type Mapper<TFrom, TTo> = (dto: TFrom) => TTo

function createMapper<TFrom, TTo>(
  mapFn: (dto: TFrom) => TTo
): Mapper<TFrom, TTo> {
  return mapFn
}

// Композиция: маппер для массивов
function mapArray<TFrom, TTo>(
  mapper: Mapper<TFrom, TTo>
): Mapper<TFrom[], TTo[]> {
  return (items) => items.map(mapper)
}

const mapUser = createMapper<ApiUserDTO, DomainUser>((dto) => ({
  id: dto.user_id,
  name: dto.full_name,
  email: dto.email_address,
  createdAt: new Date(dto.created_at),
  isActive: dto.is_active,
}))

const mapUsers = mapArray(mapUser)
```

---

## Версионирование API

Когда API эволюционирует, важно сохранять совместимость и отслеживать изменения через типы.

```typescript
interface ApiVersions {
  v1: {
    '/users': { response: UserV1[]; body: never }
  }
  v2: {
    '/users': { response: UserV2[]; body: never }
    '/users/by-role': { response: UserV2[]; body: never } // Новый эндпоинт
  }
}

type VersionedEndpoint<V extends keyof ApiVersions> = keyof ApiVersions[V]

function createVersionedClient<V extends keyof ApiVersions>(version: V) {
  return {
    get<E extends VersionedEndpoint<V>>(endpoint: E) {
      // Тип ответа автоматически выводится из версии + эндпоинта
    }
  }
}

const v1 = createVersionedClient('v1')
v1.get('/users')          // ✅ UserV1[]
v1.get('/users/by-role')  // ❌ Не существует в v1!

const v2 = createVersionedClient('v2')
v2.get('/users/by-role')  // ✅ UserV2[]
```

### Миграции между версиями

```typescript
type MigrationFn<TFrom, TTo> = (data: TFrom) => TTo

const migrateV1toV2: MigrationFn<UserV1, UserV2> = (v1) => {
  const [firstName, ...rest] = v1.name.split(' ')
  return {
    id: v1.id,
    firstName,
    lastName: rest.join(' ') || '',
    email: v1.email,
    role: 'user' as const,
  }
}
```

---

## Типобезопасные query-параметры

```typescript
interface QuerySchema {
  [key: string]: 'string' | 'number' | 'boolean' | 'string[]'
}

// Автоматический вывод типов из схемы
type QueryValues<T extends QuerySchema> = {
  [K in keyof T]?: T[K] extends 'string' ? string
    : T[K] extends 'number' ? number
    : T[K] extends 'boolean' ? boolean
    : T[K] extends 'string[]' ? string[]
    : never
}

const usersQuery = {
  search: 'string',
  page: 'number',
  active: 'boolean',
  roles: 'string[]',
} as const satisfies QuerySchema

function buildQueryString<T extends QuerySchema>(
  schema: T,
  params: QueryValues<T>
): string { /* ... */ }

// ✅ Типобезопасно
buildQueryString(usersQuery, { search: 'john', page: 1 })

// ❌ Ошибка: search должен быть string
buildQueryString(usersQuery, { search: 42 })
```

---

## Контрактное тестирование с type guards

Runtime-валидация API-ответов гарантирует, что данные соответствуют контрактам:

```typescript
type TypeGuard<T> = (value: unknown) => value is T

function isObject<T extends Record<string, unknown>>(
  schema: { [K in keyof T]: TypeGuard<T[K]> }
): TypeGuard<T> {
  return (value): value is T => {
    if (typeof value !== 'object' || value === null) return false
    const obj = value as Record<string, unknown>
    return Object.entries(schema).every(
      ([key, guard]) => (guard as TypeGuard<unknown>)(obj[key])
    )
  }
}

// Композиция guard-ов
const isUser = isObject<User>({
  id: isNumber,
  name: isString,
  email: isString,
})

// Использование
const data: unknown = await response.json()
if (isUser(data)) {
  // data типизирован как User
  console.log(data.name)
}
```

---

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Использование `as` вместо type guards

```typescript
// ❌ Опасно: нет runtime-проверки
const user = data as User
console.log(user.name) // может быть undefined!

// ✅ Безопасно: проверка в рантайме
if (isUser(data)) {
  console.log(data.name) // гарантированно string
}
```

**Почему это проблема**: `as` — это приказ компилятору «поверь мне». Если бэкенд вернёт другую структуру, TypeScript не поможет.

### Ошибка 2: any в ответах API

```typescript
// ❌ Весь смысл TypeScript теряется
async function getUser(id: number): Promise<any> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

// ✅ Строгая типизация
async function getUser(id: number): Promise<ApiResult<User>> {
  return typedFetch(api.getUser)
}
```

### Ошибка 3: Дублирование типов вместо единого источника правды

```typescript
// ❌ Типы продублированы — разойдутся при изменениях
// file: userService.ts
interface User { id: number; name: string }
// file: userComponent.ts
interface User { id: number; name: string; email: string }

// ✅ Единый источник типов
// file: api/contracts.ts
export interface User { id: number; name: string; email: string }
```

### Ошибка 4: Игнорирование ошибок API

```typescript
// ❌ Оптимистичный подход
const data = await typedFetch(api.getUsers)
renderUsers(data) // А если ошибка?

// ✅ Discriminated union заставляет обрабатывать оба случая
const result = await typedFetch(api.getUsers)
if (result.ok) {
  renderUsers(result.data)
} else {
  showError(result.error.message)
}
```

---

## 🔥 Лучшие практики

1. **Единый файл контрактов** — все API-типы в одном месте (`api/contracts.ts`)
2. **Фантомные типы** для привязки метаданных без рантайм-оверхеда
3. **Discriminated unions** для `ApiResult<T>` — невозможно забыть обработку ошибок
4. **Маппинг на границе** — DTO в доменные типы конвертируются в одном месте
5. **Runtime-валидация** для данных из внешних источников (API, localStorage, URL)
6. **`satisfies`** для проверки литеральных объектов без потери сужения типов
7. **Версионирование** через mapped types — компилятор следит за совместимостью

---

## Дополнительные паттерны

### Паттерн «API Specification Object»

```typescript
interface ApiSpec {
  endpoints: Record<string, ApiEndpoint<unknown, unknown>>
  baseUrl: string
  headers: Record<string, string>
}

function createApiClient<T extends ApiSpec>(spec: T) {
  return {
    call<K extends keyof T['endpoints']>(
      name: K,
      ...args: unknown[]
    ) {
      // Реализация с полной типобезопасностью
    }
  }
}
```

### Паттерн «Response Envelope»

```typescript
interface ApiEnvelope<T> {
  data: T
  meta: {
    requestId: string
    timestamp: number
    version: string
  }
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// Все ответы обёрнуты в единую структуру
type EnvelopedEndpoint<T> = ApiEndpoint<ApiEnvelope<T>>
```

Эти паттерны формируют фундамент для типобезопасной архитектуры API-слоя в TypeScript-приложениях.
