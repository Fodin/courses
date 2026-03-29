import { useState } from 'react'

// ============================================
// Задание 6.1: Custom Type Predicates — Решение
// ============================================

export function Task6_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Базовые type guard функции
    interface User {
      id: number
      name: string
      email: string
    }

    interface Admin extends User {
      role: 'admin'
      permissions: string[]
    }

    interface Guest {
      sessionId: string
      temporary: true
    }

    type Actor = User | Admin | Guest

    // Type predicate: value is Type
    function isUser(actor: Actor): actor is User {
      return 'id' in actor && 'name' in actor && !('role' in actor)
    }

    function isAdmin(actor: Actor): actor is Admin {
      return 'role' in actor && (actor as Admin).role === 'admin'
    }

    function isGuest(actor: Actor): actor is Guest {
      return 'sessionId' in actor && 'temporary' in actor
    }

    const admin: Actor = { id: 1, name: 'Alice', email: 'alice@test.com', role: 'admin', permissions: ['read', 'write'] }
    const user: Actor = { id: 2, name: 'Bob', email: 'bob@test.com' }
    const guest: Actor = { sessionId: 'abc-123', temporary: true }

    log.push(`1. isAdmin(admin): ${isAdmin(admin)}`)
    log.push(`2. isUser(user): ${isUser(user)}`)
    log.push(`3. isGuest(guest): ${isGuest(guest)}`)

    // Type guard для фильтрации массивов
    function isNotNull<T>(value: T | null | undefined): value is T {
      return value != null
    }

    const mixedArray: (string | null | undefined)[] = ['hello', null, 'world', undefined, 'ts']
    const strings = mixedArray.filter(isNotNull)
    log.push(`4. filter(isNotNull): [${strings.map(s => `"${s}"`).join(', ')}]`)

    // Composable type guards
    function isString(value: unknown): value is string {
      return typeof value === 'string'
    }

    function isNumber(value: unknown): value is number {
      return typeof value === 'number' && !isNaN(value)
    }

    function isNonEmptyString(value: unknown): value is string {
      return isString(value) && value.length > 0
    }

    const values: unknown[] = [42, '', 'hello', null, 0, 'world', NaN]
    const validStrings = values.filter(isNonEmptyString)
    const validNumbers = values.filter(isNumber)
    log.push(`5. filter(isNonEmptyString): [${validStrings.map(s => `"${s}"`).join(', ')}]`)
    log.push(`6. filter(isNumber): [${validNumbers.join(', ')}]`)

    // Type guard для response validation
    interface ApiResponse {
      status: number
      data: unknown
    }

    interface SuccessResponse extends ApiResponse {
      status: 200
      data: { users: User[] }
    }

    function isSuccessResponse(resp: ApiResponse): resp is SuccessResponse {
      return resp.status === 200 && resp.data !== null && typeof resp.data === 'object'
    }

    const resp: ApiResponse = { status: 200, data: { users: [{ id: 1, name: 'Alice', email: 'a@b.com' }] } }
    if (isSuccessResponse(resp)) {
      log.push(`7. isSuccessResponse: true, users count = ${(resp.data as { users: User[] }).users.length}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: Custom Type Predicates</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результат��:</h3>
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
// Задание 6.2: Assertion Functions — Решение
// ============================================

export function Task6_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // asserts condition
    function assertDefined<T>(
      value: T | null | undefined,
      message?: string
    ): asserts value is T {
      if (value == null) {
        throw new Error(message ?? 'Value is null or undefined')
      }
    }

    // Пример 1: assertDefined
    try {
      const name: string | null = 'Alice'
      assertDefined(name, 'Name is required')
      // После assertDefined TypeScript знает, что name: string
      log.push(`1. assertDefined("Alice"): "${name.toUpperCase()}"`)
    } catch (e) {
      log.push(`1. Error: ${e}`)
    }

    // Пример 2: assertDefined с null
    try {
      const value: string | null = null
      assertDefined(value, 'Value must not be null')
      log.push(`2. Unreachable`)
    } catch (e) {
      log.push(`2. assertDefined(null): "${(e as Error).message}"`)
    }

    // asserts value is Type
    interface User {
      id: number
      name: string
      email: string
    }

    function assertIsUser(value: unknown): asserts value is User {
      if (typeof value !== 'object' || value === null) {
        throw new Error('Expected an object')
      }
      const obj = value as Record<string, unknown>
      if (typeof obj.id !== 'number') {
        throw new Error('Expected id to be a number')
      }
      if (typeof obj.name !== 'string') {
        throw new Error('Expected name to be a string')
      }
      if (typeof obj.email !== 'string') {
        throw new Error('Expected email to be a string')
      }
    }

    // Пример 3: assertIsUser с валидным объектом
    try {
      const data: unknown = { id: 1, name: 'Bob', email: 'bob@test.com' }
      assertIsUser(data)
      // После assert TypeScript знает, что data: User
      log.push(`3. assertIsUser: ${data.name} (${data.email})`)
    } catch (e) {
      log.push(`3. Error: ${(e as Error).message}`)
    }

    // Пример 4: assertIsUser с невалидным объектом
    try {
      const data: unknown = { id: 'not-a-number', name: 42 }
      assertIsUser(data)
      log.push(`4. Unreachable`)
    } catch (e) {
      log.push(`4. assertIsUser(invalid): "${(e as Error).message}"`)
    }

    // Assertion для числовых ограничений
    function assertPositive(value: number): asserts value is number {
      if (value <= 0) {
        throw new Error(`Expected positive number, got ${value}`)
      }
    }

    function assertInRange(
      value: number,
      min: number,
      max: number
    ): asserts value is number {
      if (value < min || value > max) {
        throw new Error(`Expected ${min}-${max}, got ${value}`)
      }
    }

    try {
      const age = 25
      assertPositive(age)
      assertInRange(age, 0, 150)
      log.push(`5. assertPositive + assertInRange(${age}): valid`)
    } catch (e) {
      log.push(`5. Error: ${(e as Error).message}`)
    }

    try {
      const age = -5
      assertPositive(age)
      log.push(`6. Unreachable`)
    } catch (e) {
      log.push(`6. assertPositive(-5): "${(e as Error).message}"`)
    }

    // Assertion chain
    function assertNonEmptyArray<T>(
      arr: T[]
    ): asserts arr is [T, ...T[]] {
      if (arr.length === 0) {
        throw new Error('Expected non-empty array')
      }
    }

    try {
      const items = [1, 2, 3]
      assertNonEmptyArray(items)
      // TypeScript знает, что items — непустой массив
      const [first] = items
      log.push(`7. assertNonEmptyArray: first = ${first}`)
    } catch (e) {
      log.push(`7. Error: ${(e as Error).message}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: Assertion Functions</h2>
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
// Задание 6.3: Generic Narrowing — Решени��
// ============================================

export function Task6_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Generic type guard — проверка свойства у unknown
    function hasProperty<K extends string>(
      obj: unknown,
      key: K
    ): obj is Record<K, unknown> {
      return typeof obj === 'object' && obj !== null && key in obj
    }

    const data: unknown = { name: 'Alice', age: 30 }
    if (hasProperty(data, 'name')) {
      log.push(`1. hasProperty(data, 'name'): "${data.name}"`)
    }
    if (hasProperty(data, 'age')) {
      log.push(`2. hasProperty(data, 'age'): ${data.age}`)
    }
    log.push(`3. hasProperty(data, 'missing'): ${hasProperty(data, 'missing')}`)

    // Generic type guard с проверкой типа значения
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

    function isNumber(value: unknown): value is number {
      return typeof value === 'number'
    }

    if (hasTypedProperty(data, 'name', isString)) {
      log.push(`4. hasTypedProperty(data, 'name', isString): "${data.name.toUpperCase()}"`)
    }

    // Generic guard для массивов
    function isArrayOf<T>(
      value: unknown,
      guard: (item: unknown) => item is T
    ): value is T[] {
      return Array.isArray(value) && value.every(guard)
    }

    const arr: unknown = [1, 2, 3, 4, 5]
    if (isArrayOf(arr, isNumber)) {
      const sum = arr.reduce((a, b) => a + b, 0)
      log.push(`5. isArrayOf(arr, isNumber): sum = ${sum}`)
    }

    const mixed: unknown = [1, 'two', 3]
    log.push(`6. isArrayOf([1, "two", 3], isNumber): ${isArrayOf(mixed, isNumber)}`)

    // Generic guard factory
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

    const isProduct = createGuard<Product>(
      (value): boolean =>
        typeof value === 'object' &&
        value !== null &&
        typeof (value as Record<string, unknown>).id === 'number' &&
        typeof (value as Record<string, unknown>).name === 'string' &&
        typeof (value as Record<string, unknown>).price === 'number'
    )

    const product: unknown = { id: 1, name: 'Laptop', price: 999 }
    if (isProduct(product)) {
      log.push(`7. isProduct: ${product.name} — $${product.price}`)
    }

    // Discriminated union guard с generic
    type ApiResult<T> =
      | { success: true; data: T }
      | { success: false; error: string }

    function isSuccess<T>(result: ApiResult<T>): result is Extract<ApiResult<T>, { success: true }> {
      return result.success === true
    }

    const result1: ApiResult<string[]> = { success: true, data: ['a', 'b'] }
    const result2: ApiResult<number> = { success: false, error: 'Not found' }

    if (isSuccess(result1)) {
      log.push(`8. isSuccess(result1): data = [${result1.data.join(', ')}]`)
    }
    if (!isSuccess(result2)) {
      log.push(`9. !isSuccess(result2): error = "${result2.error}"`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>За��ание 6.3: Generic Narrowing</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Резуль��аты:</h3>
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
