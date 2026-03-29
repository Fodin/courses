import { useState } from 'react'

// ============================================
// Задание 0.1: Type-Safe HTTP Client — Решение
// ============================================

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface ApiEndpoint<TResponse, TBody = never> {
  method: HttpMethod
  path: string
  _responseType?: TResponse
  _bodyType?: TBody
}

function endpoint<TResponse, TBody = never>(
  method: HttpMethod,
  path: string
): ApiEndpoint<TResponse, TBody> {
  return { method, path }
}

interface User {
  id: number
  name: string
  email: string
}

interface CreateUserBody {
  name: string
  email: string
}

interface ApiError {
  code: number
  message: string
}

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError }

const api = {
  getUsers: endpoint<User[]>('GET', '/api/users'),
  getUser: endpoint<User>('GET', '/api/users/:id'),
  createUser: endpoint<User, CreateUserBody>('POST', '/api/users'),
  deleteUser: endpoint<{ deleted: boolean }>('DELETE', '/api/users/:id'),
}

async function typedFetch<TResponse, TBody>(
  _endpoint: ApiEndpoint<TResponse, TBody>,
  ..._args: TBody extends never ? [] : [body: TBody]
): Promise<ApiResult<TResponse>> {
  // Simulated implementation
  return { ok: true, data: {} as TResponse }
}

export function Task0_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Type-Safe HTTP Client ===')
    log.push('')

    // Demonstrate the API definition
    log.push('API endpoints defined:')
    log.push(`  GET    ${api.getUsers.path}    -> User[]`)
    log.push(`  GET    ${api.getUser.path} -> User`)
    log.push(`  POST   ${api.createUser.path}    -> User (body: CreateUserBody)`)
    log.push(`  DELETE ${api.deleteUser.path} -> { deleted: boolean }`)
    log.push('')

    // Demonstrate type safety
    log.push('Type safety guarantees:')
    log.push('  typedFetch(api.getUsers)')
    log.push('    -> Promise<ApiResult<User[]>>')
    log.push('  typedFetch(api.createUser, { name: "John", email: "j@ex.com" })')
    log.push('    -> Promise<ApiResult<User>> (body required!)')
    log.push('  typedFetch(api.deleteUser)')
    log.push('    -> Promise<ApiResult<{ deleted: boolean }>>')
    log.push('')

    // Simulate usage
    const mockResult: ApiResult<User[]> = {
      ok: true,
      data: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ],
    }

    log.push('Simulated fetch result:')
    if (mockResult.ok) {
      mockResult.data.forEach((user) => {
        log.push(`  User #${user.id}: ${user.name} (${user.email})`)
      })
    }

    log.push('')
    log.push('Compile-time errors (prevented by types):')
    log.push('  typedFetch(api.getUsers, { name: "x" })  // Error: GET has no body')
    log.push('  typedFetch(api.createUser)                // Error: body required')
    log.push('  typedFetch(api.createUser, { foo: 1 })    // Error: wrong body type')

    // Keep reference to avoid unused warning
    void typedFetch

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: Type-Safe HTTP Client</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 0.2: Response Mapping — Решение
// ============================================

interface ApiUserDTO {
  user_id: number
  full_name: string
  email_address: string
  created_at: string
  is_active: boolean
}

interface DomainUser {
  id: number
  name: string
  email: string
  createdAt: Date
  isActive: boolean
}

interface ApiOrderDTO {
  order_id: string
  user_id: number
  total_cents: number
  status: 'pending' | 'shipped' | 'delivered'
  items: Array<{ product_id: string; qty: number; price_cents: number }>
}

interface DomainOrder {
  id: string
  userId: number
  totalPrice: number
  status: 'pending' | 'shipped' | 'delivered'
  items: Array<{ productId: string; quantity: number; price: number }>
}

type Mapper<TFrom, TTo> = (dto: TFrom) => TTo

function createMapper<TFrom, TTo>(mapFn: (dto: TFrom) => TTo): Mapper<TFrom, TTo> {
  return mapFn
}

function mapArray<TFrom, TTo>(mapper: Mapper<TFrom, TTo>): Mapper<TFrom[], TTo[]> {
  return (items: TFrom[]) => items.map(mapper)
}

const mapUser = createMapper<ApiUserDTO, DomainUser>((dto) => ({
  id: dto.user_id,
  name: dto.full_name,
  email: dto.email_address,
  createdAt: new Date(dto.created_at),
  isActive: dto.is_active,
}))

const mapOrder = createMapper<ApiOrderDTO, DomainOrder>((dto) => ({
  id: dto.order_id,
  userId: dto.user_id,
  totalPrice: dto.total_cents / 100,
  status: dto.status,
  items: dto.items.map((item) => ({
    productId: item.product_id,
    quantity: item.qty,
    price: item.price_cents / 100,
  })),
}))

const mapUsers = mapArray(mapUser)

export function Task0_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Response Mapping ===')
    log.push('')

    const apiUser: ApiUserDTO = {
      user_id: 42,
      full_name: 'John Doe',
      email_address: 'john@example.com',
      created_at: '2024-01-15T10:30:00Z',
      is_active: true,
    }

    log.push('API Response (snake_case DTO):')
    log.push(`  user_id: ${apiUser.user_id}`)
    log.push(`  full_name: "${apiUser.full_name}"`)
    log.push(`  email_address: "${apiUser.email_address}"`)
    log.push(`  created_at: "${apiUser.created_at}"`)
    log.push(`  is_active: ${apiUser.is_active}`)
    log.push('')

    const domainUser = mapUser(apiUser)
    log.push('Domain Object (camelCase):')
    log.push(`  id: ${domainUser.id}`)
    log.push(`  name: "${domainUser.name}"`)
    log.push(`  email: "${domainUser.email}"`)
    log.push(`  createdAt: ${domainUser.createdAt.toISOString()}`)
    log.push(`  isActive: ${domainUser.isActive}`)
    log.push('')

    const apiOrder: ApiOrderDTO = {
      order_id: 'ORD-001',
      user_id: 42,
      total_cents: 4999,
      status: 'shipped',
      items: [
        { product_id: 'PROD-1', qty: 2, price_cents: 1999 },
        { product_id: 'PROD-2', qty: 1, price_cents: 1001 },
      ],
    }

    const domainOrder = mapOrder(apiOrder)
    log.push('Order mapping (cents -> dollars):')
    log.push(`  id: "${domainOrder.id}"`)
    log.push(`  totalPrice: $${domainOrder.totalPrice.toFixed(2)}`)
    log.push(`  items:`)
    domainOrder.items.forEach((item) => {
      log.push(`    ${item.productId}: ${item.quantity}x $${item.price.toFixed(2)}`)
    })
    log.push('')

    const apiUsers: ApiUserDTO[] = [
      apiUser,
      { user_id: 43, full_name: 'Jane Smith', email_address: 'jane@example.com', created_at: '2024-02-20T14:00:00Z', is_active: false },
    ]

    const domainUsers = mapUsers(apiUsers)
    log.push('Batch mapping (mapArray):')
    domainUsers.forEach((u) => {
      log.push(`  ${u.name} (${u.email}) - ${u.isActive ? 'active' : 'inactive'}`)
    })

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Response Mapping</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 0.3: API Versioning — Решение
// ============================================

interface UserV1 {
  id: number
  name: string
  email: string
}

interface UserV2 {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface UserV3 {
  id: number
  firstName: string
  lastName: string
  emails: { primary: string; secondary?: string }
  role: 'admin' | 'user' | 'guest'
  permissions: string[]
}

interface ApiVersions {
  v1: {
    '/users': { response: UserV1[]; body: never }
    '/users/:id': { response: UserV1; body: never }
  }
  v2: {
    '/users': { response: UserV2[]; body: never }
    '/users/:id': { response: UserV2; body: never }
    '/users/by-role': { response: UserV2[]; body: never }
  }
  v3: {
    '/users': { response: UserV3[]; body: never }
    '/users/:id': { response: UserV3; body: never }
    '/users/by-role': { response: UserV3[]; body: never }
    '/users/permissions': { response: { userId: number; permissions: string[] }[]; body: never }
  }
}

type VersionedEndpoint<V extends keyof ApiVersions> = keyof ApiVersions[V]

function createVersionedClient<V extends keyof ApiVersions>(_version: V) {
  return {
    get<E extends VersionedEndpoint<V>>(
      _endpoint: E
    ): ApiVersions[V][E] extends { response: infer R } ? R : never {
      return undefined as never
    },
  }
}

type MigrationFn<TFrom, TTo> = (data: TFrom) => TTo

function createMigration<TFrom, TTo>(fn: MigrationFn<TFrom, TTo>): MigrationFn<TFrom, TTo> {
  return fn
}

const migrateV1toV2 = createMigration<UserV1, UserV2>((v1) => {
  const [firstName, ...rest] = v1.name.split(' ')
  return {
    id: v1.id,
    firstName,
    lastName: rest.join(' ') || '',
    email: v1.email,
    role: 'user',
  }
})

const migrateV2toV3 = createMigration<UserV2, UserV3>((v2) => ({
  id: v2.id,
  firstName: v2.firstName,
  lastName: v2.lastName,
  emails: { primary: v2.email },
  role: v2.role,
  permissions: v2.role === 'admin' ? ['read', 'write', 'delete'] : ['read'],
}))

export function Task0_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== API Versioning ===')
    log.push('')

    // Demonstrate version-specific clients
    const _v1Client = createVersionedClient('v1')
    const _v2Client = createVersionedClient('v2')
    const _v3Client = createVersionedClient('v3')

    log.push('Versioned API clients created:')
    log.push('  v1Client.get("/users")     -> UserV1[]')
    log.push('  v2Client.get("/users")     -> UserV2[]')
    log.push('  v3Client.get("/users")     -> UserV3[]')
    log.push('')

    log.push('Version-specific endpoints:')
    log.push('  v1: /users, /users/:id')
    log.push('  v2: /users, /users/:id, /users/by-role')
    log.push('  v3: /users, /users/:id, /users/by-role, /users/permissions')
    log.push('')

    // Demonstrate migrations
    const v1User: UserV1 = { id: 1, name: 'John Doe', email: 'john@example.com' }
    const v2User = migrateV1toV2(v1User)
    const v3User = migrateV2toV3(v2User)

    log.push('Migration chain: V1 -> V2 -> V3')
    log.push('')
    log.push('V1 User:')
    log.push(`  { id: ${v1User.id}, name: "${v1User.name}", email: "${v1User.email}" }`)
    log.push('')
    log.push('V2 User (after migration):')
    log.push(`  { id: ${v2User.id}, firstName: "${v2User.firstName}", lastName: "${v2User.lastName}",`)
    log.push(`    email: "${v2User.email}", role: "${v2User.role}" }`)
    log.push('')
    log.push('V3 User (after migration):')
    log.push(`  { id: ${v3User.id}, firstName: "${v3User.firstName}", lastName: "${v3User.lastName}",`)
    log.push(`    emails: { primary: "${v3User.emails.primary}" },`)
    log.push(`    role: "${v3User.role}", permissions: [${v3User.permissions.map((p) => `"${p}"`).join(', ')}] }`)
    log.push('')

    log.push('Type safety:')
    log.push('  v1Client.get("/users/by-role")  // Compile error: not in v1')
    log.push('  v3Client.get("/users/permissions") // OK: added in v3')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.3: API Versioning</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 0.4: Query Parameters — Решение
// ============================================

interface QuerySchema {
  [key: string]: 'string' | 'number' | 'boolean' | 'string[]'
}

type QueryValues<T extends QuerySchema> = {
  [K in keyof T]?: T[K] extends 'string'
    ? string
    : T[K] extends 'number'
      ? number
      : T[K] extends 'boolean'
        ? boolean
        : T[K] extends 'string[]'
          ? string[]
          : never
}

function buildQueryString<T extends QuerySchema>(
  _schema: T,
  params: QueryValues<T>
): string {
  const parts: string[] = []

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue

    if (Array.isArray(value)) {
      value.forEach((v) => parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`))
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    }
  }

  return parts.length > 0 ? `?${parts.join('&')}` : ''
}

function parseQueryString<T extends QuerySchema>(
  schema: T,
  queryString: string
): QueryValues<T> {
  const params = new URLSearchParams(queryString.startsWith('?') ? queryString.slice(1) : queryString)
  const result: Record<string, unknown> = {}

  for (const [key, type] of Object.entries(schema)) {
    const values = params.getAll(key)
    if (values.length === 0) continue

    switch (type) {
      case 'string':
        result[key] = values[0]
        break
      case 'number':
        result[key] = Number(values[0])
        break
      case 'boolean':
        result[key] = values[0] === 'true'
        break
      case 'string[]':
        result[key] = values
        break
    }
  }

  return result as QueryValues<T>
}

const usersQuerySchema = {
  search: 'string',
  page: 'number',
  limit: 'number',
  active: 'boolean',
  roles: 'string[]',
} as const satisfies QuerySchema

export function Task0_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Query Parameters ===')
    log.push('')

    // Build query string
    const qs1 = buildQueryString(usersQuerySchema, {
      search: 'john',
      page: 1,
      limit: 20,
      active: true,
    })
    log.push('Build query string:')
    log.push(`  Input: { search: "john", page: 1, limit: 20, active: true }`)
    log.push(`  Output: ${qs1}`)
    log.push('')

    const qs2 = buildQueryString(usersQuerySchema, {
      roles: ['admin', 'editor'],
      active: true,
    })
    log.push('Array parameters:')
    log.push(`  Input: { roles: ["admin", "editor"], active: true }`)
    log.push(`  Output: ${qs2}`)
    log.push('')

    const qs3 = buildQueryString(usersQuerySchema, {})
    log.push('Empty parameters:')
    log.push(`  Input: {}`)
    log.push(`  Output: "${qs3}" (empty string)`)
    log.push('')

    // Parse query string
    const parsed = parseQueryString(
      usersQuerySchema,
      '?search=alice&page=2&limit=10&active=false&roles=user&roles=guest'
    )
    log.push('Parse query string:')
    log.push(`  Input: "?search=alice&page=2&limit=10&active=false&roles=user&roles=guest"`)
    log.push(`  Output:`)
    log.push(`    search: "${parsed.search}" (string)`)
    log.push(`    page: ${parsed.page} (number)`)
    log.push(`    limit: ${parsed.limit} (number)`)
    log.push(`    active: ${parsed.active} (boolean)`)
    log.push(`    roles: [${(parsed.roles ?? []).map((r) => `"${r}"`).join(', ')}] (string[])`)
    log.push('')

    // Roundtrip
    const original = { search: 'test', page: 3, limit: 50, active: true, roles: ['admin'] as string[] }
    const serialized = buildQueryString(usersQuerySchema, original)
    const deserialized = parseQueryString(usersQuerySchema, serialized)
    log.push('Roundtrip test:')
    log.push(`  Original: ${JSON.stringify(original)}`)
    log.push(`  Serialized: ${serialized}`)
    log.push(`  Deserialized: ${JSON.stringify(deserialized)}`)

    log.push('')
    log.push('Type safety:')
    log.push('  buildQueryString(schema, { search: 42 })   // Error: number != string')
    log.push('  buildQueryString(schema, { unknown: "x" })  // Error: not in schema')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.4: Query Parameters</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 0.5: Contract Testing — Решение
// ============================================

type TypeGuard<T> = (value: unknown) => value is T

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

function isArray<T>(guard: TypeGuard<T>): TypeGuard<T[]> {
  return (value: unknown): value is T[] =>
    Array.isArray(value) && value.every(guard)
}

function isObject<T extends object>(
  schema: { [K in keyof T]: TypeGuard<T[K]> }
): TypeGuard<T> {
  return (value: unknown): value is T => {
    if (typeof value !== 'object' || value === null) return false
    const obj = value as Record<string, unknown>
    return Object.entries(schema).every(([key, guard]) =>
      (guard as TypeGuard<unknown>)(obj[key])
    )
  }
}

function isOneOf<T extends string>(...values: T[]): TypeGuard<T> {
  return (value: unknown): value is T =>
    typeof value === 'string' && values.includes(value as T)
}

interface ContractValidationResult {
  valid: boolean
  errors: string[]
}

function validateContract<T>(
  guard: TypeGuard<T>,
  data: unknown,
  label: string
): ContractValidationResult {
  if (guard(data)) {
    return { valid: true, errors: [] }
  }
  return { valid: false, errors: [`${label}: contract validation failed`] }
}

// Compose validators for a User contract
interface ContractUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  active: boolean
}

const isContractUser = isObject<ContractUser>({
  id: isNumber,
  name: isString,
  email: isString,
  role: isOneOf('admin', 'user', 'guest'),
  active: isBoolean,
})

const isContractUserList = isArray(isContractUser)

export function Task0_5_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Contract Testing ===')
    log.push('')

    // Valid data
    const validUser = { id: 1, name: 'Alice', email: 'alice@ex.com', role: 'admin', active: true }
    const result1 = validateContract(isContractUser, validUser, 'User')
    log.push('Valid user object:')
    log.push(`  Data: ${JSON.stringify(validUser)}`)
    log.push(`  Valid: ${result1.valid}`)
    log.push('')

    // Invalid data - wrong role
    const invalidRole = { id: 2, name: 'Bob', email: 'bob@ex.com', role: 'superadmin', active: true }
    const result2 = validateContract(isContractUser, invalidRole, 'User')
    log.push('Invalid role:')
    log.push(`  Data: ${JSON.stringify(invalidRole)}`)
    log.push(`  Valid: ${result2.valid}`)
    log.push(`  Errors: ${result2.errors.join(', ')}`)
    log.push('')

    // Invalid data - missing field
    const missingField = { id: 3, name: 'Charlie', email: 'charlie@ex.com' }
    const result3 = validateContract(isContractUser, missingField, 'User')
    log.push('Missing fields (role, active):')
    log.push(`  Data: ${JSON.stringify(missingField)}`)
    log.push(`  Valid: ${result3.valid}`)
    log.push(`  Errors: ${result3.errors.join(', ')}`)
    log.push('')

    // Invalid data - wrong type
    const wrongType = { id: '4', name: 'Diana', email: 'diana@ex.com', role: 'user', active: 'yes' }
    const result4 = validateContract(isContractUser, wrongType, 'User')
    log.push('Wrong types (id: string, active: string):')
    log.push(`  Data: ${JSON.stringify(wrongType)}`)
    log.push(`  Valid: ${result4.valid}`)
    log.push(`  Errors: ${result4.errors.join(', ')}`)
    log.push('')

    // Array validation
    const users = [validUser, { id: 5, name: 'Eve', email: 'eve@ex.com', role: 'user', active: false }]
    const result5 = validateContract(isContractUserList, users, 'UserList')
    log.push('Valid user array:')
    log.push(`  Count: ${users.length}`)
    log.push(`  Valid: ${result5.valid}`)
    log.push('')

    const mixedUsers = [validUser, invalidRole]
    const result6 = validateContract(isContractUserList, mixedUsers, 'UserList')
    log.push('Mixed array (1 valid + 1 invalid):')
    log.push(`  Valid: ${result6.valid}`)
    log.push(`  Errors: ${result6.errors.join(', ')}`)
    log.push('')

    // Non-object
    const result7 = validateContract(isContractUser, null, 'User')
    const result8 = validateContract(isContractUser, 'not an object', 'User')
    log.push('Edge cases:')
    log.push(`  null -> valid: ${result7.valid}`)
    log.push(`  "not an object" -> valid: ${result8.valid}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.5: Contract Testing</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
