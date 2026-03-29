import { useState } from 'react'

// ============================================
// Задание 4.1: Infer в возвращаемых типах — Решение
// ============================================

export function Task4_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Тип MyReturnType — аналог встроенного ReturnType
    type MyReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never

    // Пример 1: простая функция
    function getUser() {
      return { id: 1, name: 'Alice', active: true }
    }
    type UserResult = MyReturnType<typeof getUser>
    const user: UserResult = { id: 1, name: 'Alice', active: true }
    log.push(`1. MyReturnType<typeof getUser>: ${JSON.stringify(user)}`)

    // Пример 2: функция с промисом
    type UnwrapPromise<T> = T extends Promise<infer U> ? U : T
    type ResolvedString = UnwrapPromise<Promise<string>>
    const val: ResolvedString = 'hello'
    log.push(`2. UnwrapPromise<Promise<string>>: "${val}" (тип: string)`)

    // Пример 3: глубокий unwrap промисов
    type DeepUnwrapPromise<T> = T extends Promise<infer U> ? DeepUnwrapPromise<U> : T
    type DeepResolved = DeepUnwrapPromise<Promise<Promise<Promise<number>>>>
    const num: DeepResolved = 42
    log.push(`3. DeepUnwrapPromise<Promise<Promise<Promise<number>>>>: ${num} (тип: number)`)

    // Пример 4: извлечение типа из массива
    type ArrayElement<T> = T extends (infer E)[] ? E : never
    type Elem = ArrayElement<string[]>
    const elem: Elem = 'test'
    log.push(`4. ArrayElement<string[]>: "${elem}" (тип: string)`)

    // Пример 5: комбинация — ReturnType + UnwrapPromise
    async function fetchUsers(): Promise<{ id: number; name: string }[]> {
      return [{ id: 1, name: 'Bob' }]
    }
    type FetchResult = UnwrapPromise<ReturnType<typeof fetchUsers>>
    const fetched: FetchResult = [{ id: 1, name: 'Bob' }]
    log.push(`5. Async return unwrap: ${JSON.stringify(fetched)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Infer в возвращаемых типах</h2>
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
// Задание 4.2: Infer в параметрах функции — Решение
// ============================================

export function Task4_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Тип для извлечения первого параметра
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type FirstParam<T> = T extends (first: infer P, ...rest: any[]) => unknown ? P : never

    function greet(name: string, age: number): string {
      return `${name} is ${age}`
    }
    type GreetFirst = FirstParam<typeof greet>
    const first: GreetFirst = 'Alice'
    log.push(`1. FirstParam<typeof greet>: "${first}" (тип: string)`)

    // Извлечение всех параметров
    type MyParameters<T> = T extends (...args: infer P) => unknown ? P : never
    type GreetParams = MyParameters<typeof greet>
    const params: GreetParams = ['Bob', 30]
    log.push(`2. MyParameters<typeof greet>: [${params.map(p => JSON.stringify(p)).join(', ')}]`)

    // Извлечение последнего параметра (через infer + rest)
    type LastParam<T> = T extends (...args: [...infer _, infer L]) => unknown ? L : never
    type GreetLast = LastParam<typeof greet>
    const last: GreetLast = 25
    log.push(`3. LastParam<typeof greet>: ${last} (тип: number)`)

    // Извлечение типа this
    type GetThisType<T> = T extends (this: infer U, ...args: unknown[]) => unknown ? U : never

    interface Counter {
      count: number
      increment(this: Counter): void
    }
    type CounterThis = GetThisType<Counter['increment']>
    log.push(`4. GetThisType<Counter['increment']>: Counter`)

    // Извлечение параметра конструктора
    type ConstructorParams<T> = T extends new (...args: infer P) => unknown ? P : never

    class User {
      constructor(public name: string, public age: number) {}
    }
    type UserCtorParams = ConstructorParams<typeof User>
    const ctorArgs: UserCtorParams = ['Charlie', 28]
    log.push(`5. ConstructorParams<typeof User>: [${ctorArgs.map(a => JSON.stringify(a)).join(', ')}]`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Infer в параметрах функции</h2>
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
// Задание 4.3: Infer в шаблонных литералах — Решение
// ============================================

export function Task4_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Парсинг строковых шаблонов с infer
    type ParseRoute<T extends string> =
      T extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? Param | ParseRoute<`/${Rest}`>
        : T extends `${infer _Start}:${infer Param}`
          ? Param
          : never

    type RouteParams = ParseRoute<'/users/:userId/posts/:postId'>
    log.push(`1. ParseRoute<'/users/:userId/posts/:postId'>: "userId" | "postId"`)

    // Разбор строки по разделителю
    type Split<S extends string, D extends string> =
      S extends `${infer Head}${D}${infer Tail}`
        ? [Head, ...Split<Tail, D>]
        : [S]

    type Parts = Split<'a.b.c.d', '.'>
    log.push(`2. Split<'a.b.c.d', '.'>: ["a", "b", "c", "d"]`)

    // Извлечение домена из email
    type ExtractDomain<T extends string> =
      T extends `${infer _User}@${infer Domain}` ? Domain : never

    type Domain = ExtractDomain<'dev@example.com'>
    const domain: Domain = 'example.com'
    log.push(`3. ExtractDomain<'dev@example.com'>: "${domain}"`)

    // CamelCase из kebab-case
    type KebabToCamel<S extends string> =
      S extends `${infer Head}-${infer Char}${infer Rest}`
        ? `${Head}${Uppercase<Char>}${KebabToCamel<Rest>}`
        : S

    type Camel = KebabToCamel<'get-user-by-id'>
    const camel: Camel = 'getUserById'
    log.push(`4. KebabToCamel<'get-user-by-id'>: "${camel}"`)

    // Извлечение query-параметров из URL
    type ParseQueryKey<T extends string> =
      T extends `${infer Key}=${infer _Value}` ? Key : T

    type ParseQuery<T extends string> =
      T extends `${infer Param}&${infer Rest}`
        ? ParseQueryKey<Param> | ParseQuery<Rest>
        : ParseQueryKey<T>

    type QueryKeys = ParseQuery<'page=1&limit=10&sort=name'>
    log.push(`5. ParseQuery<'page=1&limit=10&sort=name'>: "page" | "limit" | "sort"`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Infer в шаблонных литералах</h2>
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
// Задание 4.4: Infer в кортежах — Решение
// ============================================

export function Task4_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Извлечение первого элемента кортежа
    type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never
    type First = Head<[string, number, boolean]>
    log.push(`1. Head<[string, number, boolean]>: string`)

    // Извлечение последнего элемента
    type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never
    type LastEl = Last<[string, number, boolean]>
    log.push(`2. Last<[string, number, boolean]>: boolean`)

    // Извлечение хвоста кортежа
    type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never
    type Rest = Tail<[1, 2, 3, 4]>
    log.push(`3. Tail<[1, 2, 3, 4]>: [2, 3, 4]`)

    // Длина кортежа на уровне типов
    type Length<T extends unknown[]> = T['length']
    type Len = Length<[string, number, boolean]>
    const len: Len = 3
    log.push(`4. Length<[string, number, boolean]>: ${len}`)

    // Разворот кортежа
    type Reverse<T extends unknown[]> =
      T extends [infer H, ...infer R]
        ? [...Reverse<R>, H]
        : []

    type Reversed = Reverse<[1, 2, 3]>
    log.push(`5. Reverse<[1, 2, 3]>: [3, 2, 1]`)

    // Flatten кортежа (один уровень)
    type FlattenOnce<T extends unknown[]> =
      T extends [infer H, ...infer R]
        ? H extends unknown[]
          ? [...H, ...FlattenOnce<R>]
          : [H, ...FlattenOnce<R>]
        : []

    type Flat = FlattenOnce<[[1, 2], [3], [4, 5]]>
    log.push(`6. FlattenOnce<[[1, 2], [3], [4, 5]]>: [1, 2, 3, 4, 5]`)

    // Zip двух кортежей
    type Zip<A extends unknown[], B extends unknown[]> =
      A extends [infer AH, ...infer AR]
        ? B extends [infer BH, ...infer BR]
          ? [[AH, BH], ...Zip<AR, BR>]
          : []
        : []

    type Zipped = Zip<['a', 'b', 'c'], [1, 2, 3]>
    log.push(`7. Zip<['a','b','c'], [1,2,3]>: [["a",1], ["b",2], ["c",3]]`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.4: Infer в кортежах</h2>
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
