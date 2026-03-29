import { useState } from 'react'

// ============================================
// Задание 12.1: Higher-Kinded Types — Решение
// ============================================

export function Task12_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Higher-Kinded Types via URI pattern (defunctionalization)
    // TypeScript doesn't have native HKTs, but we can simulate them

    // Step 1: URI registry — maps string URIs to type constructors
    interface URItoKind<A> {
      Array: A[]
      Option: A | null
      Promise: Promise<A>
      Identity: A
    }

    type URIS = keyof URItoKind<unknown>
    type Kind<F extends URIS, A> = URItoKind<A>[F]

    // Step 2: Functor interface — works with any type constructor
    interface Functor<F extends URIS> {
      readonly URI: F
      map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B>
    }

    // Step 3: Implement functors for different type constructors
    const arrayFunctor: Functor<'Array'> = {
      URI: 'Array',
      map: <A, B>(fa: A[], f: (a: A) => B): B[] => fa.map(f),
    }

    const optionFunctor: Functor<'Option'> = {
      URI: 'Option',
      map: <A, B>(fa: A | null, f: (a: A) => B): B | null =>
        fa === null ? null : f(fa),
    }

    const identityFunctor: Functor<'Identity'> = {
      URI: 'Identity',
      map: <A, B>(fa: A, f: (a: A) => B): B => f(fa),
    }

    // Step 4: Generic function that works with ANY functor
    function doubleAll<F extends URIS>(
      F: Functor<F>,
      fa: Kind<F, number>
    ): Kind<F, number> {
      return F.map(fa, (n) => n * 2)
    }

    function stringify<F extends URIS>(
      F: Functor<F>,
      fa: Kind<F, number>
    ): Kind<F, string> {
      return F.map(fa, (n) => `value: ${n}`)
    }

    log.push('=== Higher-Kinded Types (URI Pattern) ===')
    log.push('')
    log.push('--- Concept ---')
    log.push('HKT = type constructor that takes a type and returns a type')
    log.push('Array<_>, Promise<_>, Option<_> are all "kind * -> *"')
    log.push('TypeScript cannot abstract over them natively')
    log.push('Solution: URI string registry + Kind<F, A> lookup')

    log.push('')
    log.push('--- URItoKind Registry ---')
    log.push('interface URItoKind<A> {')
    log.push('  Array: A[]')
    log.push('  Option: A | null')
    log.push('  Promise: Promise<A>')
    log.push('}')
    log.push('type Kind<F extends URIS, A> = URItoKind<A>[F]')

    log.push('')
    log.push('--- Functor Interface ---')
    log.push('interface Functor<F extends URIS> {')
    log.push('  map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B>')
    log.push('}')

    log.push('')
    log.push('--- Generic Operations ---')

    // doubleAll works on any Functor!
    const arrResult = doubleAll(arrayFunctor, [1, 2, 3])
    log.push(`doubleAll(Array, [1, 2, 3]) = [${arrResult}]`)

    const optResult = doubleAll(optionFunctor, 5)
    log.push(`doubleAll(Option, 5) = ${optResult}`)

    const optNullResult = doubleAll(optionFunctor, null)
    log.push(`doubleAll(Option, null) = ${optNullResult}`)

    const idResult = doubleAll(identityFunctor, 21)
    log.push(`doubleAll(Identity, 21) = ${idResult}`)

    log.push('')

    const arrStr = stringify(arrayFunctor, [10, 20])
    log.push(`stringify(Array, [10, 20]) = [${arrStr.map(s => `"${s}"`).join(', ')}]`)

    const optStr = stringify(optionFunctor, 42)
    log.push(`stringify(Option, 42) = "${optStr}"`)

    log.push('')
    log.push('--- Extending the Registry ---')
    log.push('Add new entries to URItoKind via declaration merging:')
    log.push('interface URItoKind<A> { MyMonad: MyMonad<A> }')
    log.push('Then implement Functor<"MyMonad"> — works with all generic functions!')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.1: Higher-Kinded Types</h2>
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
// Задание 12.2: Inference Tricks — Решение
// ============================================

export function Task12_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Trick 1: Constrained Identity — narrow without widening
    function narrow<const T extends string>(value: T): T {
      return value
    }

    function narrowArray<const T extends readonly string[]>(values: T): T {
      return values
    }

    // Trick 2: Inference Anchors — control where inference happens
    type NoInfer<T> = T extends infer U ? U : never

    function createAction<T extends string>(
      type: T,
      _defaultPayload: NoInfer<T> extends 'increment' ? number : string
    ) {
      return { type, payload: _defaultPayload }
    }

    // Trick 3: Distributive Object Types
    type DistributiveMap<T extends Record<string, unknown>> = {
      [K in keyof T]: {
        key: K
        value: T[K]
        handler: (value: T[K]) => void
      }
    }[keyof T]

    // Trick 4: Inference from mapped types
    type EventMap = {
      click: { x: number; y: number }
      keydown: { key: string }
      scroll: { offset: number }
    }

    type EventEntries = DistributiveMap<EventMap>

    function handleEvent<K extends keyof EventMap>(
      event: K,
      handler: (payload: EventMap[K]) => void
    ): string {
      const mockData: EventMap = {
        click: { x: 100, y: 200 },
        keydown: { key: 'Enter' },
        scroll: { offset: 50 },
      }
      handler(mockData[event])
      return `Handled: ${event}`
    }

    // Trick 5: Satisfies + inference
    type Config = Record<string, { enabled: boolean; value: string | number }>

    const config = {
      debug: { enabled: true, value: 'verbose' },
      maxRetries: { enabled: false, value: 3 },
      timeout: { enabled: true, value: 5000 },
    } satisfies Config

    // config retains literal types while being validated against Config

    log.push('=== Advanced Inference Tricks ===')
    log.push('')

    // Trick 1
    log.push('--- Trick 1: Constrained Identity (const T) ---')
    const status = narrow('active')
    log.push(`narrow("active") → type is "active" (not string)`)
    log.push(`typeof status: "${status}" (literal type preserved)`)

    const statuses = narrowArray(['active', 'inactive', 'pending'] as const)
    log.push(`narrowArray(["active", "inactive", "pending"]) → readonly tuple`)
    log.push(`  Values: [${statuses.join(', ')}]`)

    log.push('')

    // Trick 2
    log.push('--- Trick 2: NoInfer<T> (Inference Anchors) ---')
    log.push('function createAction<T>(type: T, payload: NoInfer<T>-based)')
    log.push('NoInfer prevents T from being inferred from the payload position')
    log.push('T is inferred ONLY from the `type` argument')

    const action1 = createAction('increment', 5)
    log.push(`createAction("increment", 5) → ${JSON.stringify(action1)}`)

    const action2 = createAction('reset', 'default')
    log.push(`createAction("reset", "default") → ${JSON.stringify(action2)}`)

    log.push('')

    // Trick 3
    log.push('--- Trick 3: Distributive Object Types ---')
    log.push('Convert { click: X, keydown: Y } into discriminated union:')
    log.push('  | { key: "click", value: X, handler: (v: X) => void }')
    log.push('  | { key: "keydown", value: Y, handler: (v: Y) => void }')

    // Trick 4
    log.push('')
    log.push('--- Trick 4: Mapped Type Inference ---')

    let eventLog = ''
    handleEvent('click', (payload) => {
      eventLog = `click at (${payload.x}, ${payload.y})`
    })
    log.push(`handleEvent("click") → ${eventLog}`)

    handleEvent('keydown', (payload) => {
      eventLog = `keydown: ${payload.key}`
    })
    log.push(`handleEvent("keydown") → ${eventLog}`)

    handleEvent('scroll', (payload) => {
      eventLog = `scroll offset: ${payload.offset}`
    })
    log.push(`handleEvent("scroll") → ${eventLog}`)

    log.push('')

    // Trick 5
    log.push('--- Trick 5: Satisfies + Inference ---')
    log.push('`satisfies Config` validates shape but preserves literal types')
    log.push(`config.debug.value → "${config.debug.value}" (type: "verbose", not string)`)
    log.push(`config.maxRetries.value → ${config.maxRetries.value} (type: 3, not number)`)
    log.push(`config.timeout.value → ${config.timeout.value} (type: 5000, not number)`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.2: Inference Tricks</h2>
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
// Задание 12.3: Curried Generics — Решение
// ============================================

export function Task12_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Curried type constructors
    // Problem: TypeScript doesn't support partial application of generics
    // type MapOf = Map<string, _>  // Can't do this!

    // Solution 1: Curried functions that return generic types
    function mapOf<K>() {
      return function <V>(entries: [K, V][]): Map<K, V> {
        return new Map(entries)
      }
    }

    // Solution 2: Builder pattern with progressive generic resolution
    class TypedBuilder<Schema extends Record<string, unknown> = Record<string, never>> {
      private data: Partial<Schema>

      constructor(data?: Partial<Schema>) {
        this.data = data ?? {}
      }

      field<K extends string, V>(
        key: K,
        value: V
      ): TypedBuilder<Schema & Record<K, V>> {
        return new TypedBuilder({
          ...this.data,
          [key]: value,
        } as Partial<Schema & Record<K, V>>)
      }

      build(): Schema {
        return this.data as Schema
      }
    }

    function builder(): TypedBuilder {
      return new TypedBuilder()
    }

    // Solution 3: Curried validators
    function validatorFor<T>() {
      return {
        field<K extends keyof T & string>(key: K) {
          return {
            check(predicate: (value: T[K]) => boolean) {
              return {
                key,
                validate(obj: T): boolean {
                  return predicate(obj[key])
                },
                describe(): string {
                  return `Validator for "${key}"`
                },
              }
            },
          }
        },
      }
    }

    // Solution 4: Curried event emitter
    function typedEmitter<Events extends Record<string, object>>() {
      const handlers = new Map<string, Array<(payload: unknown) => void>>()

      return {
        on<K extends keyof Events & string>(
          event: K,
          handler: (payload: Events[K]) => void
        ) {
          const list = handlers.get(event) ?? []
          list.push(handler as (payload: unknown) => void)
          handlers.set(event, list)
          return this
        },

        emit<K extends keyof Events & string>(
          event: K,
          payload: Events[K]
        ): string {
          const list = handlers.get(event) ?? []
          list.forEach((h) => h(payload))
          return `Emitted "${event}" to ${list.length} handler(s)`
        },
      }
    }

    log.push('=== Curried Generics ===')
    log.push('')

    // Solution 1: Curried constructor
    log.push('--- Curried Type Constructors ---')

    const stringMap = mapOf<string>()
    const m1 = stringMap([['a', 1], ['b', 2]])
    log.push(`mapOf<string>()([["a",1],["b",2]]) → Map(${m1.size}) {${Array.from(m1.entries()).map(([k, v]) => `${k}=>${v}`).join(', ')}}`)

    const numMap = mapOf<number>()
    const m2 = numMap([[1, 'one'], [2, 'two']])
    log.push(`mapOf<number>()([[1,"one"],[2,"two"]]) → Map(${m2.size}) {${Array.from(m2.entries()).map(([k, v]) => `${k}=>${v}`).join(', ')}}`)

    log.push('')

    // Solution 2: Progressive builder
    log.push('--- Progressive Generic Resolution (Builder) ---')

    const config = builder()
      .field('host', 'localhost')
      .field('port', 3000)
      .field('debug', true)
      .build()

    log.push(`builder().field("host", "localhost").field("port", 3000).field("debug", true).build()`)
    log.push(`  = ${JSON.stringify(config)}`)
    log.push(`  Type: { host: string } & { port: number } & { debug: boolean }`)
    log.push(`  config.host → "${config.host}" (type: string)`)
    log.push(`  config.port → ${config.port} (type: number)`)
    log.push(`  config.debug → ${config.debug} (type: boolean)`)

    log.push('')

    // Solution 3: Curried validator
    log.push('--- Curried Validators ---')

    interface User {
      name: string
      age: number
      email: string
    }

    const userValidator = validatorFor<User>()
    const nameCheck = userValidator.field('name').check((name) => name.length > 0)
    const ageCheck = userValidator.field('age').check((age) => age >= 18)

    const testUser: User = { name: 'Alice', age: 25, email: 'alice@test.com' }
    log.push(`validatorFor<User>().field("name").check(n => n.length > 0)`)
    log.push(`  ${nameCheck.describe()} → ${nameCheck.validate(testUser)}`)
    log.push(`validatorFor<User>().field("age").check(a => a >= 18)`)
    log.push(`  ${ageCheck.describe()} → ${ageCheck.validate(testUser)}`)

    log.push('')

    // Solution 4: Curried emitter
    log.push('--- Curried Event Emitter ---')

    type AppEvents = {
      login: { userId: string }
      logout: { reason: string }
      error: { code: number; message: string }
    }

    const emitter = typedEmitter<AppEvents>()

    let lastEvent = ''
    emitter.on('login', (p) => { lastEvent = `login: ${p.userId}` })
    emitter.on('error', (p) => { lastEvent = `error ${p.code}: ${p.message}` })

    const r1 = emitter.emit('login', { userId: 'u-42' })
    log.push(`emit("login", {userId: "u-42"}) → "${r1}" / ${lastEvent}`)

    const r2 = emitter.emit('error', { code: 500, message: 'Internal' })
    log.push(`emit("error", {code: 500, ...}) → "${r2}" / ${lastEvent}`)

    const r3 = emitter.emit('logout', { reason: 'timeout' })
    log.push(`emit("logout", {reason: "timeout"}) → "${r3}" (no handlers)`)

    log.push('')
    log.push('--- Key Pattern ---')
    log.push('function outer<A>() {')
    log.push('  return function inner<B>(value: B): [A, B] { ... }')
    log.push('}')
    log.push('// Partial application: fix A, infer B later')
    log.push('const withString = outer<string>()')
    log.push('withString(42)  // [string, number]')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.3: Curried Generics</h2>
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
