import { useState } from 'react'

// ============================================
// Задание 1.1: Basic Conditional Types — Решение
// ============================================

export function Task1_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. IsString — проверяет, является ли тип строкой
    type IsString<T> = T extends string ? true : false

    // Runtime-демонстрация
    function checkIsString(value: unknown): boolean {
      return typeof value === 'string'
    }

    log.push('=== IsString<T> ===')
    log.push(`IsString<"hello">  → true  (compile-time)`)
    log.push(`IsString<42>       → false (compile-time)`)
    log.push(`checkIsString("hello") → ${checkIsString('hello')}`)
    log.push(`checkIsString(42)      → ${checkIsString(42)}`)

    // 2. IsArray — проверяет, является ли тип массивом
    type IsArray<T> = T extends unknown[] ? true : false

    function checkIsArray(value: unknown): boolean {
      return Array.isArray(value)
    }

    log.push('')
    log.push('=== IsArray<T> ===')
    log.push(`IsArray<number[]>  → true  (compile-time)`)
    log.push(`IsArray<string>    → false (compile-time)`)
    log.push(`checkIsArray([1,2]) → ${checkIsArray([1, 2])}`)
    log.push(`checkIsArray("hi")  → ${checkIsArray('hi')}`)

    // 3. ExtractReturnType — извлекает возвращаемый тип функции
    type ExtractReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never

    function getSum(a: number, b: number): number { return a + b }
    function getName(): string { return 'Alice' }
    function getNothing(): void { /* noop */ }

    log.push('')
    log.push('=== ExtractReturnType<T> ===')
    log.push(`ExtractReturnType<typeof getSum>     → number`)
    log.push(`ExtractReturnType<typeof getName>    → string`)
    log.push(`ExtractReturnType<typeof getNothing> → void`)
    log.push(`getSum(2, 3)  = ${getSum(2, 3)}`)
    log.push(`getName()     = "${getName()}"`)

    // 4. ExtractPromiseType — извлекает тип из Promise
    type ExtractPromiseType<T> = T extends Promise<infer U> ? U : T

    log.push('')
    log.push('=== ExtractPromiseType<T> ===')
    log.push(`ExtractPromiseType<Promise<string>> → string`)
    log.push(`ExtractPromiseType<Promise<number>> → number`)
    log.push(`ExtractPromiseType<boolean>         → boolean (not a Promise)`)

    // 5. NonNullableCustom — исключает null и undefined
    type NonNullableCustom<T> = T extends null | undefined ? never : T

    function filterNullable<T>(values: T[]): NonNullableCustom<T>[] {
      return values.filter((v): v is NonNullableCustom<T> => v != null)
    }

    const mixed = ['hello', null, 'world', undefined, 'ts']
    const filtered = filterNullable(mixed)
    log.push('')
    log.push('=== NonNullableCustom<T> ===')
    log.push(`Input:    [${mixed.map(v => v === null ? 'null' : v === undefined ? 'undefined' : `"${v}"`).join(', ')}]`)
    log.push(`Filtered: [${filtered.map(v => `"${v}"`).join(', ')}]`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: Basic Conditional Types</h2>
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
// Задание 1.2: Distributive Conditionals — Решение
// ============================================

export function Task1_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Дистрибутивность — conditional type распределяется по union
    type ToArray<T> = T extends unknown ? T[] : never

    log.push('=== Distributive behavior ===')
    log.push('type ToArray<T> = T extends unknown ? T[] : never')
    log.push('')
    log.push('ToArray<string | number>')
    log.push('  = (string extends unknown ? string[] : never) | (number extends unknown ? number[] : never)')
    log.push('  = string[] | number[]')
    log.push('  НЕ (string | number)[]!')

    // 2. Предотвращение дистрибутивности через [T]
    type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never

    log.push('')
    log.push('=== Non-distributive (wrapped in tuple) ===')
    log.push('type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never')
    log.push('')
    log.push('ToArrayNonDist<string | number>')
    log.push('  = (string | number)[]')
    log.push('  Один массив с обоими типами!')

    // 3. Практический пример: Extract и Exclude
    type MyExtract<T, U> = T extends U ? T : never
    type MyExclude<T, U> = T extends U ? never : T

    type Mixed = string | number | boolean | null | undefined

    // Runtime-демонстрация Extract/Exclude
    function extractTypes(values: unknown[], check: (v: unknown) => boolean): unknown[] {
      return values.filter(check)
    }

    function excludeTypes(values: unknown[], check: (v: unknown) => boolean): unknown[] {
      return values.filter((v) => !check(v))
    }

    const values = ['hello', 42, true, null, undefined, 'world', 0]

    const strings = extractTypes(values, (v) => typeof v === 'string')
    const nonNull = excludeTypes(values, (v) => v == null)

    log.push('')
    log.push('=== Extract / Exclude (distributive) ===')
    log.push(`MyExtract<Mixed, string | number> → string | number`)
    log.push(`MyExclude<Mixed, null | undefined> → string | number | boolean`)
    log.push('')
    log.push(`Runtime extract strings: [${strings.map(v => `"${v}"`).join(', ')}]`)
    log.push(`Runtime exclude nullish: [${nonNull.join(', ')}]`)

    // 4. Дистрибутивность с never
    type IsNever<T> = [T] extends [never] ? true : false

    log.push('')
    log.push('=== never and distributivity ===')
    log.push('type IsNever<T> = [T] extends [never] ? true : false')
    log.push('')
    log.push('IsNever<never>  → true')
    log.push('IsNever<string> → false')
    log.push('')
    log.push('⚠️ Without wrapping in []:')
    log.push('type BadIsNever<T> = T extends never ? true : false')
    log.push('BadIsNever<never> → never (not true!)')
    log.push('Because never is empty union — nothing to distribute over')

    // 5. Practical: filter union by predicate
    type FilterByProperty<T, K extends string> = T extends Record<K, unknown> ? T : never

    interface Dog { bark(): void; name: string }
    interface Cat { meow(): void; name: string }
    interface Fish { swim(): void }

    // FilterByProperty<Dog | Cat | Fish, 'name'> → Dog | Cat
    log.push('')
    log.push('=== FilterByProperty<T, K> ===')
    log.push('type FilterByProperty<T, K> = T extends Record<K, unknown> ? T : never')
    log.push('FilterByProperty<Dog | Cat | Fish, "name"> → Dog | Cat')
    log.push('Only types with "name" property are kept')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: Distributive Conditionals</h2>
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
// Задание 1.3: Nested Conditionals — Решение
// ============================================

export function Task1_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Многоуровневое ветвление типов
    type TypeName<T> =
      T extends string ? 'string' :
      T extends number ? 'number' :
      T extends boolean ? 'boolean' :
      T extends undefined ? 'undefined' :
      T extends null ? 'null' :
      T extends unknown[] ? 'array' :
      T extends (...args: unknown[]) => unknown ? 'function' :
      'object'

    function getTypeName(value: unknown): string {
      if (value === null) return 'null'
      if (value === undefined) return 'undefined'
      if (Array.isArray(value)) return 'array'
      if (typeof value === 'function') return 'function'
      return typeof value
    }

    const testValues: [string, unknown][] = [
      ['string "hello"', 'hello'],
      ['number 42', 42],
      ['boolean true', true],
      ['undefined', undefined],
      ['null', null],
      ['array [1,2]', [1, 2]],
      ['function', () => {}],
      ['object {}', {}],
    ]

    log.push('=== TypeName<T> — nested conditional ===')
    for (const [label, value] of testValues) {
      log.push(`  ${label.padEnd(20)} → "${getTypeName(value)}"`)
    }

    // 2. Вложенное извлечение типов
    type DeepUnwrap<T> =
      T extends Promise<infer U> ? DeepUnwrap<U> :
      T extends Array<infer E> ? DeepUnwrap<E> :
      T extends Set<infer S> ? DeepUnwrap<S> :
      T extends Map<unknown, infer V> ? DeepUnwrap<V> :
      T

    log.push('')
    log.push('=== DeepUnwrap<T> — recursive unwrapping ===')
    log.push('DeepUnwrap<Promise<string>>           → string')
    log.push('DeepUnwrap<Promise<number[]>>         → number')
    log.push('DeepUnwrap<Set<Map<string, boolean>>> → boolean')
    log.push('DeepUnwrap<Promise<Set<number>>>      → number')

    // 3. Conditional branching for API response handling
    type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

    type ResponseType<M extends HttpMethod> =
      M extends 'GET' ? { data: unknown; cached: boolean } :
      M extends 'POST' ? { data: unknown; id: string } :
      M extends 'PUT' ? { data: unknown; updated: boolean } :
      M extends 'DELETE' ? { success: boolean } :
      never

    function simulateRequest<M extends HttpMethod>(method: M): ResponseType<M> {
      const responses: Record<HttpMethod, unknown> = {
        GET: { data: { name: 'Alice' }, cached: true },
        POST: { data: { name: 'Bob' }, id: 'new-123' },
        PUT: { data: { name: 'Charlie' }, updated: true },
        DELETE: { success: true },
      }
      return responses[method] as ResponseType<M>
    }

    log.push('')
    log.push('=== ResponseType<Method> — API branching ===')
    log.push(`GET    → ${JSON.stringify(simulateRequest('GET'))}`)
    log.push(`POST   → ${JSON.stringify(simulateRequest('POST'))}`)
    log.push(`PUT    → ${JSON.stringify(simulateRequest('PUT'))}`)
    log.push(`DELETE → ${JSON.stringify(simulateRequest('DELETE'))}`)

    // 4. Severity-based logging
    type Severity = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

    type SeverityAction<S extends Severity> =
      S extends 'debug' | 'info' ? 'log' :
      S extends 'warn' ? 'alert' :
      S extends 'error' | 'fatal' ? 'notify' :
      never

    function getAction(severity: Severity): string {
      if (severity === 'debug' || severity === 'info') return 'log'
      if (severity === 'warn') return 'alert'
      return 'notify'
    }

    log.push('')
    log.push('=== SeverityAction<S> — grouped branching ===')
    for (const s of ['debug', 'info', 'warn', 'error', 'fatal'] as Severity[]) {
      log.push(`  ${s.padEnd(8)} → action: "${getAction(s)}"`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: Nested Conditionals</h2>
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
// Задание 1.4: Conditional Types with Generics — Решение
// ============================================

export function Task1_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Flatten — рекурсивно «разворачивает» вложенные массивы и Promise
    type Flatten<T> = T extends Promise<infer U>
      ? Flatten<U>
      : T extends Array<infer E>
        ? Flatten<E>
        : T

    log.push('=== Flatten<T> ===')
    log.push('Flatten<Promise<string[]>>     → string')
    log.push('Flatten<number[][]>            → number')
    log.push('Flatten<Promise<boolean[]>[]>  → boolean')

    // 2. OptionalKeys / RequiredKeys
    type OptionalKeys<T> = {
      [K in keyof T]-?: undefined extends T[K] ? K : never
    }[keyof T]

    type RequiredKeys<T> = {
      [K in keyof T]-?: undefined extends T[K] ? never : K
    }[keyof T]

    interface UserProfile {
      id: number
      name: string
      email?: string
      phone?: string
      bio?: string
    }

    // Runtime simulation
    function getOptionalKeys(obj: Record<string, unknown>, required: string[]): string[] {
      return Object.keys(obj).filter(k => !required.includes(k))
    }

    const profileKeys = { id: 1, name: 'Alice', email: undefined, phone: undefined, bio: undefined }
    const requiredKeys = ['id', 'name']
    const optionalKeys = getOptionalKeys(profileKeys, requiredKeys)

    log.push('')
    log.push('=== OptionalKeys / RequiredKeys ===')
    log.push(`RequiredKeys<UserProfile> → ${JSON.stringify(requiredKeys)}`)
    log.push(`OptionalKeys<UserProfile> → ${JSON.stringify(optionalKeys)}`)

    // 3. FunctionProperties — извлечь ключи, значения которых — функции
    type FunctionKeys<T> = {
      [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never
    }[keyof T]

    type NonFunctionKeys<T> = {
      [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? never : K
    }[keyof T]

    const service = {
      name: 'AuthService',
      version: 2,
      login: (_user: string) => true,
      logout: () => {},
      getToken: () => 'abc123',
    }

    const funcKeys = Object.keys(service).filter(
      (k) => typeof (service as Record<string, unknown>)[k] === 'function'
    )
    const dataKeys = Object.keys(service).filter(
      (k) => typeof (service as Record<string, unknown>)[k] !== 'function'
    )

    log.push('')
    log.push('=== FunctionKeys / NonFunctionKeys ===')
    log.push(`FunctionKeys<typeof service>    → [${funcKeys.join(', ')}]`)
    log.push(`NonFunctionKeys<typeof service> → [${dataKeys.join(', ')}]`)

    // 4. Conditional return type in a generic function
    function processValue<T extends string | number>(
      value: T
    ): T extends string ? string[] : number {
      if (typeof value === 'string') {
        return value.split('') as T extends string ? string[] : number
      }
      return (value as number) * 2 as T extends string ? string[] : number
    }

    const strResult = processValue('hello')
    const numResult = processValue(42)

    log.push('')
    log.push('=== Conditional return types ===')
    log.push(`processValue("hello") → [${strResult}] (string[])`)
    log.push(`processValue(42)      → ${numResult} (number)`)

    // 5. MakeRequired — сделать определённые ключи обязательными
    type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

    interface FormData {
      username?: string
      password?: string
      email?: string
      rememberMe?: boolean
    }

    const loginForm: MakeRequired<FormData, 'username' | 'password'> = {
      username: 'alice',
      password: 'secret123',
      // email и rememberMe остаются необязательными
    }

    log.push('')
    log.push('=== MakeRequired<T, K> ===')
    log.push(`MakeRequired<FormData, 'username' | 'password'>`)
    log.push(`  username и password — обязательны`)
    log.push(`  email и rememberMe — опциональны`)
    log.push(`  loginForm → ${JSON.stringify(loginForm)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: Conditional Types with Generics</h2>
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
