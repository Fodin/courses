import { useState } from 'react'

// ============================================
// Задание 0.1: Generic Constraints — Решение
// ============================================

export function Task0_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Ограничение через extends keyof
    function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
      return obj[key]
    }

    const user = { name: 'Alice', age: 30, email: 'alice@example.com' }
    log.push(`getProperty(user, 'name') = ${getProperty(user, 'name')}`)
    log.push(`getProperty(user, 'age') = ${getProperty(user, 'age')}`)
    // getProperty(user, 'phone') — ошибка компиляции!

    // 2. Ограничение через extends interface
    interface HasLength {
      length: number
    }

    function logLength<T extends HasLength>(item: T): string {
      return `length = ${item.length}, value = ${JSON.stringify(item)}`
    }

    log.push(`logLength('hello') → ${logLength('hello')}`)
    log.push(`logLength([1, 2, 3]) → ${logLength([1, 2, 3])}`)
    log.push(`logLength({ length: 42, data: 'test' }) → ${logLength({ length: 42, data: 'test' })}`)
    // logLength(123) — ошибка: number не имеет length

    // 3. Ограничение через extends с несколькими условиями
    interface Identifiable {
      id: string | number
    }

    interface Timestamped {
      createdAt: Date
    }

    function getEntityInfo<T extends Identifiable & Timestamped>(entity: T): string {
      return `ID: ${entity.id}, created: ${entity.createdAt.toISOString().split('T')[0]}`
    }

    const post = {
      id: 42,
      title: 'TypeScript Generics',
      createdAt: new Date('2024-01-15'),
    }
    log.push(`getEntityInfo(post) = ${getEntityInfo(post)}`)

    // 4. Constraint с конструктором
    function createInstance<T>(ctor: new () => T): T {
      return new ctor()
    }

    class Logger {
      message = 'Logger initialized'
    }

    const logger = createInstance(Logger)
    log.push(`createInstance(Logger).message = ${logger.message}`)

    // 5. Ограничение extends Record
    function mergeObjects<T extends Record<string, unknown>>(a: T, b: Partial<T>): T {
      return { ...a, ...b }
    }

    const merged = mergeObjects(
      { host: 'localhost', port: 3000 },
      { port: 8080 }
    )
    log.push(`mergeObjects result = ${JSON.stringify(merged)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: Generic Constraints</h2>
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
// Задание 0.2: Default Type Parameters — Решение
// ============================================

export function Task0_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Простой дефолтный параметр
    interface ApiResponse<TData = unknown, TError = Error> {
      data: TData | null
      error: TError | null
      status: number
    }

    const genericResp: ApiResponse = { data: null, error: null, status: 200 }
    log.push(`ApiResponse<> (defaults) → status: ${genericResp.status}`)

    const typedResp: ApiResponse<{ name: string }> = {
      data: { name: 'Alice' },
      error: null,
      status: 200,
    }
    log.push(`ApiResponse<{name}> → data.name: ${typedResp.data?.name}`)

    // 2. Дженерик с дефолтом, зависящим от другого параметра
    interface Collection<TItem, TKey extends keyof TItem = keyof TItem> {
      items: TItem[]
      indexBy: TKey
    }

    interface Product {
      id: number
      sku: string
      name: string
    }

    const byId: Collection<Product, 'id'> = {
      items: [{ id: 1, sku: 'A1', name: 'Widget' }],
      indexBy: 'id',
    }
    log.push(`Collection<Product, 'id'> → indexBy: ${byId.indexBy}`)

    const byAny: Collection<Product> = {
      items: [{ id: 2, sku: 'B2', name: 'Gadget' }],
      indexBy: 'sku',
    }
    log.push(`Collection<Product> (default key) → indexBy: ${byAny.indexBy}`)

    // 3. Фабричная функция с дефолтом
    function createStore<TState = Record<string, unknown>>(
      initialState: TState
    ): { getState: () => TState; setState: (s: Partial<TState>) => void; state: TState } {
      let state = { ...initialState }
      return {
        getState: () => state,
        setState: (partial) => {
          state = { ...state, ...partial }
        },
        get state() {
          return state
        },
      }
    }

    const store = createStore({ count: 0, name: 'default' })
    store.setState({ count: 10 })
    log.push(`createStore → after setState: ${JSON.stringify(store.getState())}`)

    // 4. Дефолт для класса событий
    interface EventPayload {
      timestamp: number
    }

    interface TypedEvent<T extends EventPayload = EventPayload> {
      type: string
      payload: T
    }

    const simpleEvent: TypedEvent = {
      type: 'ping',
      payload: { timestamp: Date.now() },
    }
    log.push(`TypedEvent (default) → type: ${simpleEvent.type}`)

    interface UserPayload extends EventPayload {
      userId: string
      action: string
    }

    const userEvent: TypedEvent<UserPayload> = {
      type: 'user.login',
      payload: { timestamp: Date.now(), userId: 'u-123', action: 'login' },
    }
    log.push(`TypedEvent<UserPayload> → userId: ${userEvent.payload.userId}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Default Type Parameters</h2>
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
// Задание 0.3: Inference in Functions — Решение
// ============================================

export function Task0_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Вывод типа из аргумента
    function identity<T>(value: T): T {
      return value
    }

    const str = identity('hello')
    const num = identity(42)
    log.push(`identity('hello') → type inferred as string: "${str}"`)
    log.push(`identity(42) → type inferred as number: ${num}`)

    // 2. Вывод типа из массива
    function firstElement<T>(arr: T[]): T | undefined {
      return arr[0]
    }

    const first = firstElement([10, 20, 30])
    log.push(`firstElement([10, 20, 30]) → ${first} (inferred as number)`)

    const firstStr = firstElement(['a', 'b', 'c'])
    log.push(`firstElement(['a','b','c']) → "${firstStr}" (inferred as string)`)

    // 3. Вывод нескольких типов
    function makePair<A, B>(a: A, b: B): [A, B] {
      return [a, b]
    }

    const pair = makePair('name', 42)
    log.push(`makePair('name', 42) → [${pair}] (inferred as [string, number])`)

    // 4. Вывод типа из колбэка
    function mapArray<T, U>(arr: T[], fn: (item: T) => U): U[] {
      return arr.map(fn)
    }

    const lengths = mapArray(['hello', 'world', 'ts'], (s) => s.length)
    log.push(`mapArray(['hello','world','ts'], s => s.length) → [${lengths}]`)

    const doubled = mapArray([1, 2, 3], (n) => n * 2)
    log.push(`mapArray([1,2,3], n => n*2) → [${doubled}]`)

    // 5. Вывод литерального типа с const assertion
    function createConfig<T extends Record<string, unknown>>(config: T): Readonly<T> {
      return Object.freeze(config)
    }

    const config = createConfig({
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
    })
    log.push(`createConfig → frozen: ${JSON.stringify(config)}`)

    // 6. Вывод типа из объекта с вложенными свойствами
    function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
      return items.map((item) => item[key])
    }

    const users = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ]

    const names = pluck(users, 'name')
    log.push(`pluck(users, 'name') → [${names}] (inferred as string[])`)

    const ages = pluck(users, 'age')
    log.push(`pluck(users, 'age') → [${ages}] (inferred as number[])`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.3: Inference in Functions</h2>
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
// Задание 0.4: Conditional Inference — Решение
// ============================================

export function Task0_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Простой условный тип
    type IsString<T> = T extends string ? 'yes' : 'no'

    // Демонстрируем runtime-эквиваленты
    function isString(value: unknown): 'yes' | 'no' {
      return typeof value === 'string' ? 'yes' : 'no'
    }

    log.push(`isString('hello') → ${isString('hello')}`)
    log.push(`isString(42) → ${isString(42)}`)

    // 2. Извлечение типа из Promise
    type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

    // Runtime-эквивалент
    function describeType(value: unknown): string {
      if (value instanceof Promise) return 'Promise<...>'
      return typeof value
    }

    log.push(`describeType(Promise.resolve(42)) → ${describeType(Promise.resolve(42))}`)
    log.push(`describeType('hello') → ${describeType('hello')}`)

    // 3. Извлечение типа элемента массива
    type ElementType<T> = T extends (infer E)[] ? E : T

    function getElementType(arr: unknown[]): string {
      if (arr.length === 0) return 'unknown (empty array)'
      return typeof arr[0]
    }

    log.push(`getElementType([1, 2, 3]) → ${getElementType([1, 2, 3])}`)
    log.push(`getElementType(['a', 'b']) → ${getElementType(['a', 'b'])}`)

    // 4. Извлечение типа возвращаемого значения функции
    type MyReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never

    function getSum(a: number, b: number): number {
      return a + b
    }

    function greet(name: string): string {
      return `Hello, ${name}!`
    }

    log.push(`getSum(2, 3) → ${getSum(2, 3)} (return type: number)`)
    log.push(`greet('TypeScript') → ${greet('TypeScript')} (return type: string)`)

    // 5. Условные типы с generics — type-safe event handler
    type EventMap = {
      click: { x: number; y: number }
      keypress: { key: string; code: number }
      scroll: { top: number; left: number }
    }

    type EventHandler<K extends keyof EventMap> = EventMap[K] extends { x: number }
      ? 'mouse-event'
      : EventMap[K] extends { key: string }
        ? 'keyboard-event'
        : 'other-event'

    function classifyEvent<K extends keyof EventMap>(
      event: K,
      _data: EventMap[K]
    ): string {
      const handlers: Record<keyof EventMap, string> = {
        click: 'mouse-event',
        keypress: 'keyboard-event',
        scroll: 'other-event',
      }
      return `${event} → ${handlers[event]}`
    }

    log.push(`classifyEvent: ${classifyEvent('click', { x: 10, y: 20 })}`)
    log.push(`classifyEvent: ${classifyEvent('keypress', { key: 'a', code: 65 })}`)
    log.push(`classifyEvent: ${classifyEvent('scroll', { top: 100, left: 0 })}`)

    // 6. Рекурсивный conditional с infer
    type DeepUnwrap<T> = T extends Promise<infer U> ? DeepUnwrap<U> : T

    async function deepResolve(): Promise<string> {
      return 'deeply resolved value'
    }

    deepResolve().then((val) => {
      log.push(`DeepUnwrap: Promise<Promise<string>> → "${val}"`)
    })

    log.push('--- Type-level examples (compile-time only) ---')
    log.push('type A = IsString<"hello">        // "yes"')
    log.push('type B = IsString<42>              // "no"')
    log.push('type C = UnwrapPromise<Promise<number>> // number')
    log.push('type D = ElementType<string[]>     // string')
    log.push('type E = MyReturnType<typeof getSum>   // number')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.4: Conditional Inference</h2>
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
// Задание 0.5: Generic Factories — Решение
// ============================================

export function Task0_5_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Фабрика через конструктор
    interface Serializable {
      serialize(): string
    }

    class UserModel implements Serializable {
      constructor(public name: string = 'Unknown', public role: string = 'user') {}
      serialize(): string {
        return JSON.stringify({ name: this.name, role: this.role })
      }
    }

    class ProductModel implements Serializable {
      constructor(public title: string = 'Untitled', public price: number = 0) {}
      serialize(): string {
        return JSON.stringify({ title: this.title, price: this.price })
      }
    }

    function createModel<T extends Serializable>(
      ModelClass: new () => T
    ): T {
      return new ModelClass()
    }

    const user = createModel(UserModel)
    log.push(`createModel(UserModel) → ${user.serialize()}`)

    const product = createModel(ProductModel)
    log.push(`createModel(ProductModel) → ${product.serialize()}`)

    // 2. Фабрика с параметрами конструктора
    function createWithArgs<T, TArgs extends unknown[]>(
      ctor: new (...args: TArgs) => T,
      ...args: TArgs
    ): T {
      return new ctor(...args)
    }

    const typedUser = createWithArgs(UserModel, 'Alice', 'admin')
    log.push(`createWithArgs(UserModel, 'Alice', 'admin') → ${typedUser.serialize()}`)

    // 3. Registry-фабрика
    type Registry<T extends Record<string, unknown>> = {
      register: <K extends string, V>(key: K, factory: () => V) => Registry<T & Record<K, V>>
      create: <K extends keyof T>(key: K) => T[K]
    }

    function createRegistry(): Registry<Record<string, never>> {
      const factories = new Map<string, () => unknown>()

      const registry: Registry<Record<string, never>> = {
        register(key, factory) {
          factories.set(key, factory)
          return registry as never
        },
        create(key) {
          const factory = factories.get(key as string)
          if (!factory) throw new Error(`Unknown key: ${String(key)}`)
          return factory() as never
        },
      }

      return registry
    }

    const reg = createRegistry()
      .register('user', () => ({ name: 'Default User', role: 'viewer' }))
      .register('config', () => ({ theme: 'dark', lang: 'en' }))

    log.push(`registry.create('user') → ${JSON.stringify(reg.create('user'))}`)
    log.push(`registry.create('config') → ${JSON.stringify(reg.create('config'))}`)

    // 4. Builder-фабрика
    function createBuilder<T extends Record<string, unknown>>(initial: T) {
      const state = { ...initial }

      return {
        set<K extends keyof T>(key: K, value: T[K]) {
          state[key] = value
          return this
        },
        build(): Readonly<T> {
          return Object.freeze({ ...state })
        },
      }
    }

    const serverConfig = createBuilder({
      host: 'localhost',
      port: 3000,
      debug: false,
    })
      .set('port', 8080)
      .set('debug', true)
      .build()

    log.push(`builder.build() → ${JSON.stringify(serverConfig)}`)

    // 5. Validator-фабрика
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
        parse(value: unknown): T {
          if (check(value)) return value
          throw new Error(`Expected ${typeName}, got ${typeof value}`)
        },
      }
    }

    const stringValidator = createValidator(
      (v: unknown): v is string => typeof v === 'string',
      'string'
    )

    log.push(`stringValidator.validate('hello') → ${stringValidator.validate('hello')}`)
    log.push(`stringValidator.validate(42) → ${stringValidator.validate(42)}`)
    log.push(`stringValidator.parse('world') → "${stringValidator.parse('world')}"`)

    try {
      stringValidator.parse(42)
    } catch (e) {
      log.push(`stringValidator.parse(42) → Error: ${(e as Error).message}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.5: Generic Factories</h2>
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
