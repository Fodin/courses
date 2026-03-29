# Level 0: Strict API Contracts

## 🎯 Level Goal

Learn to design type-safe contracts between frontend and backend so that integration errors are caught **at compile time**, not at runtime.

---

## The Problem: Brittle API Calls

In a typical project, HTTP requests look like this:

```typescript
// ❌ Typical approach — no type safety
const response = await fetch('/api/users')
const data = await response.json() // any!

// Typo in field name? You'll only find out at runtime
console.log(data.nmae) // undefined, but TypeScript is silent
```

Every `fetch` returns `Promise<Response>`, and `.json()` returns `Promise<any>`. This means:

- No autocomplete for response fields
- Typos in field names aren't caught
- Backend API changes break the frontend **silently**
- Request body is not validated at all

---

## Solution: Typed API Endpoints

### Step 1: Describe Endpoints with Generics

```typescript
// Typed endpoint descriptor
interface ApiEndpoint<TResponse, TBody = never> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  // Phantom types — exist only for TypeScript
  _responseType?: TResponse
  _bodyType?: TBody
}

// Factory function for creating endpoints
function endpoint<TResponse, TBody = never>(
  method: HttpMethod,
  path: string
): ApiEndpoint<TResponse, TBody> {
  return { method, path }
}
```

📌 **Phantom types** (`_responseType`, `_bodyType`) are fields that are never populated at runtime. They exist solely so TypeScript can extract type information via `infer`.

### Step 2: Define the API Catalog

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

// ✅ Entire API described in one place
const api = {
  getUsers: endpoint<User[]>('GET', '/api/users'),
  getUser: endpoint<User>('GET', '/api/users/:id'),
  createUser: endpoint<User, CreateUserBody>('POST', '/api/users'),
  deleteUser: endpoint<{ deleted: boolean }>('DELETE', '/api/users/:id'),
}
```

### Step 3: Type-Safe Fetch

```typescript
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: number; message: string } }

// Conditional typing: body is required only when TBody != never
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

💡 **Key trick**: the rest parameter `...args: TBody extends never ? [] : [body: TBody]` makes the `body` argument required only for endpoints with a body type.

```typescript
// ✅ Autocomplete and type checking
const users = await typedFetch(api.getUsers)
//    ^? Promise<ApiResult<User[]>>

const created = await typedFetch(api.createUser, {
  name: 'John',
  email: 'john@example.com'
})
//    ^? Promise<ApiResult<User>>

// ❌ Compile errors:
await typedFetch(api.getUsers, { name: 'x' }) // GET doesn't accept body
await typedFetch(api.createUser) // POST requires body
await typedFetch(api.createUser, { foo: 1 }) // Wrong body structure
```

---

## Response Mapping: From DTO to Domain Types

APIs often return data in formats inconvenient for the frontend (snake_case, nested IDs instead of objects, cents instead of dollars). Mapping solves this in a type-safe way.

```typescript
// API returns snake_case
interface ApiUserDTO {
  user_id: number
  full_name: string
  email_address: string
  created_at: string  // ISO string
  is_active: boolean
}

// Frontend works with camelCase and proper types
interface DomainUser {
  id: number
  name: string
  email: string
  createdAt: Date  // Date, not string!
  isActive: boolean
}
```

### Typed Mappers

```typescript
type Mapper<TFrom, TTo> = (dto: TFrom) => TTo

function createMapper<TFrom, TTo>(
  mapFn: (dto: TFrom) => TTo
): Mapper<TFrom, TTo> {
  return mapFn
}

// Composition: mapper for arrays
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

## API Versioning

When an API evolves, it's important to maintain compatibility and track changes through types.

```typescript
interface ApiVersions {
  v1: {
    '/users': { response: UserV1[]; body: never }
  }
  v2: {
    '/users': { response: UserV2[]; body: never }
    '/users/by-role': { response: UserV2[]; body: never } // New endpoint
  }
}

type VersionedEndpoint<V extends keyof ApiVersions> = keyof ApiVersions[V]

function createVersionedClient<V extends keyof ApiVersions>(version: V) {
  return {
    get<E extends VersionedEndpoint<V>>(endpoint: E) {
      // Response type is automatically inferred from version + endpoint
    }
  }
}

const v1 = createVersionedClient('v1')
v1.get('/users')          // ✅ UserV1[]
v1.get('/users/by-role')  // ❌ Doesn't exist in v1!

const v2 = createVersionedClient('v2')
v2.get('/users/by-role')  // ✅ UserV2[]
```

### Version Migrations

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

## Type-Safe Query Parameters

```typescript
interface QuerySchema {
  [key: string]: 'string' | 'number' | 'boolean' | 'string[]'
}

// Automatic type inference from schema
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

// ✅ Type-safe
buildQueryString(usersQuery, { search: 'john', page: 1 })

// ❌ Error: search must be string
buildQueryString(usersQuery, { search: 42 })
```

---

## Contract Testing with Type Guards

Runtime validation of API responses ensures data matches contracts:

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

// Guard composition
const isUser = isObject<User>({
  id: isNumber,
  name: isString,
  email: isString,
})

// Usage
const data: unknown = await response.json()
if (isUser(data)) {
  // data is typed as User
  console.log(data.name)
}
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Using `as` Instead of Type Guards

```typescript
// ❌ Dangerous: no runtime check
const user = data as User
console.log(user.name) // could be undefined!

// ✅ Safe: runtime validation
if (isUser(data)) {
  console.log(data.name) // guaranteed to be string
}
```

**Why this is a problem**: `as` is a command to the compiler to "trust me." If the backend returns a different structure, TypeScript won't help.

### Mistake 2: `any` in API Responses

```typescript
// ❌ The entire point of TypeScript is lost
async function getUser(id: number): Promise<any> {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}

// ✅ Strict typing
async function getUser(id: number): Promise<ApiResult<User>> {
  return typedFetch(api.getUser)
}
```

### Mistake 3: Duplicating Types Instead of a Single Source of Truth

```typescript
// ❌ Types are duplicated — will diverge on changes
// file: userService.ts
interface User { id: number; name: string }
// file: userComponent.ts
interface User { id: number; name: string; email: string }

// ✅ Single source of types
// file: api/contracts.ts
export interface User { id: number; name: string; email: string }
```

### Mistake 4: Ignoring API Errors

```typescript
// ❌ Optimistic approach
const data = await typedFetch(api.getUsers)
renderUsers(data) // What if there's an error?

// ✅ Discriminated union forces handling both cases
const result = await typedFetch(api.getUsers)
if (result.ok) {
  renderUsers(result.data)
} else {
  showError(result.error.message)
}
```

---

## 🔥 Best Practices

1. **Single contract file** — all API types in one place (`api/contracts.ts`)
2. **Phantom types** to attach metadata without runtime overhead
3. **Discriminated unions** for `ApiResult<T>` — impossible to forget error handling
4. **Mapping at the boundary** — DTOs are converted to domain types in one place
5. **Runtime validation** for data from external sources (API, localStorage, URL)
6. **`satisfies`** to check literal objects without losing type narrowing
7. **Versioning** through mapped types — the compiler tracks compatibility

---

## Additional Patterns

### "API Specification Object" Pattern

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
      // Implementation with full type safety
    }
  }
}
```

### "Response Envelope" Pattern

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

// All responses wrapped in a uniform structure
type EnvelopedEndpoint<T> = ApiEndpoint<ApiEnvelope<T>>
```

These patterns form the foundation for a type-safe API layer architecture in TypeScript applications.
