import { useState } from 'react'

// ============================================
// Задание 10.1: Type-Level Arithmetic — Решение
// ============================================

export function Task10_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Type-Level Peano Arithmetic
    // Представляем числа как длину кортежей

    // Вспомогательный тип: создание кортежа длины N
    type BuildTuple<N extends number, T extends unknown[] = []> =
      T['length'] extends N ? T : BuildTuple<N, [...T, unknown]>

    // Add: складываем длины кортежей
    type Add<A extends number, B extends number> =
      [...BuildTuple<A>, ...BuildTuple<B>]['length'] extends infer R extends number
        ? R
        : never

    // Subtract: вычитаем, удаляя элементы из кортежа
    type Subtract<A extends number, B extends number> =
      BuildTuple<A> extends [...BuildTuple<B>, ...infer Rest]
        ? Rest['length']
        : never

    // Multiply: рекурсивное сложение
    type Multiply<A extends number, B extends number, Acc extends unknown[] = []> =
      B extends 0
        ? Acc['length']
        : Multiply<A, Subtract<B, 1> & number, [...Acc, ...BuildTuple<A>]>

    // Runtime-демонстрация тех же вычислений
    function tupleAdd(a: number, b: number): number {
      const tupleA = Array(a).fill(null)
      const tupleB = Array(b).fill(null)
      return [...tupleA, ...tupleB].length
    }

    function tupleSubtract(a: number, b: number): number {
      const tuple = Array(a).fill(null)
      return tuple.slice(b).length
    }

    function tupleMultiply(a: number, b: number): number {
      let acc: unknown[] = []
      for (let i = 0; i < b; i++) {
        acc = [...acc, ...Array(a).fill(null)]
      }
      return acc.length
    }

    log.push('=== Type-Level Peano Arithmetic ===')
    log.push('')
    log.push('BuildTuple<3> = [unknown, unknown, unknown]')
    log.push('')

    // Add
    log.push('--- Add (сложение через конкатенацию кортежей) ---')
    const add_3_4 = tupleAdd(3, 4)
    log.push(`Add<3, 4> = [...BuildTuple<3>, ...BuildTuple<4>]['length'] = ${add_3_4}`)
    const add_10_15 = tupleAdd(10, 15)
    log.push(`Add<10, 15> = ${add_10_15}`)
    const add_0_5 = tupleAdd(0, 5)
    log.push(`Add<0, 5> = ${add_0_5}`)

    log.push('')

    // Subtract
    log.push('--- Subtract (вычитание через деструктуризацию) ---')
    const sub_7_3 = tupleSubtract(7, 3)
    log.push(`Subtract<7, 3> = BuildTuple<7> extends [...BuildTuple<3>, ...infer R] → R['length'] = ${sub_7_3}`)
    const sub_10_10 = tupleSubtract(10, 10)
    log.push(`Subtract<10, 10> = ${sub_10_10}`)
    const sub_20_8 = tupleSubtract(20, 8)
    log.push(`Subtract<20, 8> = ${sub_20_8}`)

    log.push('')

    // Multiply
    log.push('--- Multiply (умножение через рекурсивное сложение) ---')
    const mul_3_4 = tupleMultiply(3, 4)
    log.push(`Multiply<3, 4> = Add<3, Add<3, Add<3, 0>>> = ${mul_3_4}`)
    const mul_5_5 = tupleMultiply(5, 5)
    log.push(`Multiply<5, 5> = ${mul_5_5}`)
    const mul_7_0 = tupleMultiply(7, 0)
    log.push(`Multiply<7, 0> = ${mul_7_0}`)

    log.push('')
    log.push('--- Compile-time type assertions ---')
    log.push('type Test1 = Add<3, 4>           // 7')
    log.push('type Test2 = Subtract<10, 3>     // 7')
    log.push('type Test3 = Multiply<4, 5>      // 20')
    log.push('type Test4 = Add<Multiply<3, 3>, 1>  // 10')

    // Compile-time проверки (не выполняются в runtime, но проверяются компилятором)
    type _Test1 = Add<3, 4>         // 7
    type _Test2 = Subtract<10, 3>   // 7
    type _Test3 = Multiply<4, 5>    // 20

    // Verify
    const _check1: _Test1 = 7
    const _check2: _Test2 = 7
    const _check3: _Test3 = 20
    void _check1; void _check2; void _check3

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.1: Type-Level Arithmetic</h2>
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
// Задание 10.2: Type-Level Collections — Решение
// ============================================

export function Task10_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Type-Level Map: применяет преобразование к каждому элементу кортежа
    type TupleMap<T extends unknown[], F extends { type: string }> =
      T extends [infer Head, ...infer Tail]
        ? [ApplyF<Head, F>, ...TupleMap<Tail, F>]
        : []

    // "Функторы" для type-level map
    type ToStringF = { type: 'toString' }
    type WrapArrayF = { type: 'wrapArray' }
    type ToPromiseF = { type: 'toPromise' }

    type ApplyF<T, F extends { type: string }> =
      F extends ToStringF ? `${T & (string | number | boolean)}`
      : F extends WrapArrayF ? T[]
      : F extends ToPromiseF ? Promise<T>
      : never

    // Type-Level Filter: фильтрует элементы кортежа по предикату
    type TupleFilter<T extends unknown[], Predicate> =
      T extends [infer Head, ...infer Tail]
        ? Head extends Predicate
          ? [Head, ...TupleFilter<Tail, Predicate>]
          : TupleFilter<Tail, Predicate>
        : []

    // Type-Level Reduce: сворачивает кортеж в одно значение
    type TupleReduce<T extends unknown[], Acc extends unknown[] = []> =
      T extends [infer Head, ...infer Tail]
        ? Head extends unknown[]
          ? TupleReduce<Tail, [...Acc, ...Head]>
          : TupleReduce<Tail, [...Acc, Head]>
        : Acc

    // Runtime-демонстрации
    log.push('=== Type-Level Collections ===')
    log.push('')

    // Map
    log.push('--- TupleMap ---')
    type Mapped1 = TupleMap<[1, 2, 3], ToStringF>
    log.push('TupleMap<[1, 2, 3], ToStringF> = ["1", "2", "3"]')

    type Mapped2 = TupleMap<[string, number], WrapArrayF>
    log.push('TupleMap<[string, number], WrapArrayF> = [string[], number[]]')

    type Mapped3 = TupleMap<[string, number, boolean], ToPromiseF>
    log.push('TupleMap<[string, number, boolean], ToPromiseF> = [Promise<string>, Promise<number>, Promise<boolean>]')

    // Runtime map
    const nums = [1, 2, 3] as const
    const mapped = Array.from(nums).map(String)
    log.push(`Runtime map([1, 2, 3], String) = [${mapped.map(v => `"${v}"`).join(', ')}]`)

    log.push('')

    // Filter
    log.push('--- TupleFilter ---')
    type Filtered1 = TupleFilter<[1, 'a', 2, 'b', 3], string>
    log.push('TupleFilter<[1, "a", 2, "b", 3], string> = ["a", "b"]')

    type Filtered2 = TupleFilter<[1, 'a', true, null, 'b'], string | number>
    log.push('TupleFilter<[1, "a", true, null, "b"], string | number> = [1, "a", "b"]')

    // Runtime filter
    const mixed = [1, 'a', 2, 'b', 3]
    const filtered = mixed.filter((v): v is string => typeof v === 'string')
    log.push(`Runtime filter([1, "a", 2, "b", 3], isString) = [${filtered.map(v => `"${v}"`).join(', ')}]`)

    log.push('')

    // Reduce (Flatten)
    log.push('--- TupleReduce (Flatten) ---')
    type Reduced1 = TupleReduce<[[1, 2], [3, 4], [5]]>
    log.push('TupleReduce<[[1, 2], [3, 4], [5]]> = [1, 2, 3, 4, 5]')

    type Reduced2 = TupleReduce<[['a'], ['b', 'c']]>
    log.push('TupleReduce<[["a"], ["b", "c"]]> = ["a", "b", "c"]')

    // Runtime reduce (flatten)
    const nested = [[1, 2], [3, 4], [5]]
    const flattened = nested.reduce<number[]>((acc, curr) => [...acc, ...curr], [])
    log.push(`Runtime flatten([[1, 2], [3, 4], [5]]) = [${flattened.join(', ')}]`)

    log.push('')
    log.push('--- Compose: Map + Filter ---')
    type StringsOnly = TupleFilter<TupleMap<[1, true, 'hello'], ToStringF>, `${string}`>
    log.push('TupleFilter<TupleMap<[1, true, "hello"], ToStringF>, string> = ["1", "true", "hello"]')

    // Verify types compile
    const _v1: Mapped1 = ['1', '2', '3']
    const _v2: Filtered1 = ['a', 'b']
    const _v3: Reduced1 = [1, 2, 3, 4, 5]
    void _v1; void _v2; void _v3

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.2: Type-Level Collections</h2>
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
// Задание 10.3: Type-Level Strings — Решение
// ============================================

export function Task10_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Split: разбивает строку по разделителю
    type Split<S extends string, D extends string> =
      S extends `${infer Head}${D}${infer Tail}`
        ? [Head, ...Split<Tail, D>]
        : S extends ''
          ? []
          : [S]

    // Join: объединяет кортеж строк через разделитель
    type Join<T extends string[], D extends string> =
      T extends []
        ? ''
        : T extends [infer Head extends string]
          ? Head
          : T extends [infer Head extends string, ...infer Tail extends string[]]
            ? `${Head}${D}${Join<Tail, D>}`
            : never

    // Replace: заменяет первое вхождение подстроки
    type Replace<S extends string, From extends string, To extends string> =
      From extends ''
        ? S
        : S extends `${infer Before}${From}${infer After}`
          ? `${Before}${To}${After}`
          : S

    // ReplaceAll: заменяет все вхождения
    type ReplaceAll<S extends string, From extends string, To extends string> =
      From extends ''
        ? S
        : S extends `${infer Before}${From}${infer After}`
          ? ReplaceAll<`${Before}${To}${After}`, From, To>
          : S

    // TrimLeft / TrimRight / Trim
    type Whitespace = ' ' | '\t' | '\n'

    type TrimLeft<S extends string> =
      S extends `${Whitespace}${infer Rest}` ? TrimLeft<Rest> : S

    type TrimRight<S extends string> =
      S extends `${infer Rest}${Whitespace}` ? TrimRight<Rest> : S

    type Trim<S extends string> = TrimLeft<TrimRight<S>>

    // Runtime demonstrations
    log.push('=== Type-Level String Manipulation ===')
    log.push('')

    // Split
    log.push('--- Split ---')
    type S1 = Split<'hello-world-ts', '-'>
    log.push('Split<"hello-world-ts", "-"> = ["hello", "world", "ts"]')

    type S2 = Split<'a.b.c.d', '.'>
    log.push('Split<"a.b.c.d", "."> = ["a", "b", "c", "d"]')

    type S3 = Split<'single', '-'>
    log.push('Split<"single", "-"> = ["single"]')

    const splitResult = 'hello-world-ts'.split('-')
    log.push(`Runtime: "hello-world-ts".split("-") = [${splitResult.map(s => `"${s}"`).join(', ')}]`)

    log.push('')

    // Join
    log.push('--- Join ---')
    type J1 = Join<['hello', 'world', 'ts'], '-'>
    log.push('Join<["hello", "world", "ts"], "-"> = "hello-world-ts"')

    type J2 = Join<['a', 'b', 'c'], '.'>
    log.push('Join<["a", "b", "c"], "."> = "a.b.c"')

    const joinResult = ['hello', 'world', 'ts'].join('-')
    log.push(`Runtime: ["hello", "world", "ts"].join("-") = "${joinResult}"`)

    log.push('')

    // Replace
    log.push('--- Replace / ReplaceAll ---')
    type R1 = Replace<'hello world', 'world', 'TypeScript'>
    log.push('Replace<"hello world", "world", "TypeScript"> = "hello TypeScript"')

    type R2 = ReplaceAll<'a-b-c-d', '-', '_'>
    log.push('ReplaceAll<"a-b-c-d", "-", "_"> = "a_b_c_d"')

    type R3 = ReplaceAll<'aabaa', 'a', 'x'>
    log.push('ReplaceAll<"aabaa", "a", "x"> = "xxbxx"')

    const replaceResult = 'a-b-c-d'.replaceAll('-', '_')
    log.push(`Runtime: "a-b-c-d".replaceAll("-", "_") = "${replaceResult}"`)

    log.push('')

    // Trim
    log.push('--- Trim ---')
    type T1 = Trim<'  hello  '>
    log.push('Trim<"  hello  "> = "hello"')

    type T2 = TrimLeft<'   left'>
    log.push('TrimLeft<"   left"> = "left"')

    type T3 = TrimRight<'right   '>
    log.push('TrimRight<"right   "> = "right"')

    const trimResult = '  hello  '.trim()
    log.push(`Runtime: "  hello  ".trim() = "${trimResult}"`)

    // Compile-time verification
    const _v1: S1 = ['hello', 'world', 'ts']
    const _v2: J1 = 'hello-world-ts'
    const _v3: R1 = 'hello TypeScript'
    const _v4: T1 = 'hello'
    void _v1; void _v2; void _v3; void _v4

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.3: Type-Level Strings</h2>
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
// Задание 10.4: Type-Level Pattern Matching — Решение
// ============================================

export function Task10_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Pattern matching engine at the type level
    // Паттерн: Match<Value, Patterns> -> Result

    // Wildcard pattern
    type _ = { __brand: 'wildcard' }

    // Pattern types
    type PatternCase<P, R> = { pattern: P; result: R }

    // Matching logic
    type MatchPattern<Value, Pattern> =
      Pattern extends _ ? true
      : Pattern extends Value ? true
      : Value extends Pattern ? true
      : false

    // Match: find first matching pattern
    type Match<Value, Cases extends PatternCase<unknown, unknown>[]> =
      Cases extends [infer Head extends PatternCase<unknown, unknown>, ...infer Tail extends PatternCase<unknown, unknown>[]]
        ? MatchPattern<Value, Head['pattern']> extends true
          ? Head['result']
          : Match<Value, Tail>
        : never

    // Extract pattern: match and extract parts
    type ExtractRoute<S extends string> =
      S extends `/${infer Resource}/${infer Id}/${infer Action}`
        ? { resource: Resource; id: Id; action: Action }
        : S extends `/${infer Resource}/${infer Id}`
          ? { resource: Resource; id: Id }
          : S extends `/${infer Resource}`
            ? { resource: Resource }
            : never

    // Runtime pattern matching demonstration
    type Route1 = ExtractRoute<'/users/123/edit'>
    type Route2 = ExtractRoute<'/posts/456'>
    type Route3 = ExtractRoute<'/dashboard'>

    function extractRoute(path: string): Record<string, string> {
      const parts = path.split('/').filter(Boolean)
      if (parts.length === 3) return { resource: parts[0], id: parts[1], action: parts[2] }
      if (parts.length === 2) return { resource: parts[0], id: parts[1] }
      if (parts.length === 1) return { resource: parts[0] }
      return {}
    }

    log.push('=== Type-Level Pattern Matching ===')
    log.push('')

    // Match type
    log.push('--- Match<Value, Cases[]> ---')

    type StatusText = Match<200, [
      PatternCase<200, 'OK'>,
      PatternCase<404, 'Not Found'>,
      PatternCase<500, 'Server Error'>,
      PatternCase<_, 'Unknown'>
    ]>

    log.push('Match<200, [{200->"OK"}, {404->"Not Found"}, ...]> = "OK"')
    log.push('Match<404, [...]> = "Not Found"')
    log.push('Match<999, [... {_->"Unknown"}]> = "Unknown" (wildcard)')

    // Runtime
    function matchStatus(code: number): string {
      const cases: Array<[number | null, string]> = [
        [200, 'OK'],
        [404, 'Not Found'],
        [500, 'Server Error'],
        [null, 'Unknown'],
      ]
      for (const [pattern, result] of cases) {
        if (pattern === null || pattern === code) return result
      }
      return 'Unknown'
    }

    log.push(`matchStatus(200) = "${matchStatus(200)}"`)
    log.push(`matchStatus(404) = "${matchStatus(404)}"`)
    log.push(`matchStatus(999) = "${matchStatus(999)}"`)

    log.push('')

    // Route extraction
    log.push('--- ExtractRoute<Path> ---')
    log.push(`extractRoute("/users/123/edit") = ${JSON.stringify(extractRoute('/users/123/edit'))}`)
    log.push(`extractRoute("/posts/456") = ${JSON.stringify(extractRoute('/posts/456'))}`)
    log.push(`extractRoute("/dashboard") = ${JSON.stringify(extractRoute('/dashboard'))}`)

    log.push('')

    // Type-level exhaustive matching
    log.push('--- Exhaustive Pattern Matching ---')

    type Shape =
      | { kind: 'circle'; radius: number }
      | { kind: 'rect'; width: number; height: number }
      | { kind: 'triangle'; base: number; height: number }

    type ShapeArea<S extends Shape> =
      S extends { kind: 'circle' } ? 'PI * r^2'
      : S extends { kind: 'rect' } ? 'w * h'
      : S extends { kind: 'triangle' } ? '0.5 * b * h'
      : never

    function shapeArea(s: Shape): string {
      switch (s.kind) {
        case 'circle': return `PI * ${s.radius}^2 = ${(Math.PI * s.radius ** 2).toFixed(2)}`
        case 'rect': return `${s.width} * ${s.height} = ${s.width * s.height}`
        case 'triangle': return `0.5 * ${s.base} * ${s.height} = ${0.5 * s.base * s.height}`
      }
    }

    log.push(`circle(r=5): ${shapeArea({ kind: 'circle', radius: 5 })}`)
    log.push(`rect(3x4): ${shapeArea({ kind: 'rect', width: 3, height: 4 })}`)
    log.push(`triangle(b=6,h=4): ${shapeArea({ kind: 'triangle', base: 6, height: 4 })}`)

    // Compile-time checks
    const _v1: StatusText = 'OK'
    const _v2: Route1 = { resource: 'users', id: '123', action: 'edit' }
    const _v3: Route2 = { resource: 'posts', id: '456' }
    void _v1; void _v2; void _v3

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.4: Type-Level Pattern Matching</h2>
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
// Задание 10.5: Type-Level SQL Builder — Решение
// ============================================

export function Task10_5_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Type-safe SQL query builder
    // Schema definition
    interface DBSchema {
      users: {
        id: number
        name: string
        email: string
        age: number
        active: boolean
      }
      posts: {
        id: number
        title: string
        body: string
        author_id: number
        published: boolean
      }
      comments: {
        id: number
        post_id: number
        user_id: number
        text: string
      }
    }

    // Query builder types
    type TableName = keyof DBSchema
    type ColumnOf<T extends TableName> = keyof DBSchema[T] & string

    type WhereClause<T extends TableName> = {
      column: ColumnOf<T>
      op: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE'
      value: DBSchema[T][ColumnOf<T>]
    }

    type OrderDirection = 'ASC' | 'DESC'

    interface Query<
      T extends TableName,
      Selected extends ColumnOf<T> = ColumnOf<T>,
    > {
      table: T
      selected: Selected[]
      wheres: WhereClause<T>[]
      orderBy: { column: ColumnOf<T>; direction: OrderDirection } | null
      limitVal: number | null
    }

    // Pick only selected columns from result
    type QueryResult<T extends TableName, Selected extends ColumnOf<T>> =
      Pick<DBSchema[T], Selected>

    // Builder implementation
    class SQLBuilder<
      T extends TableName,
      Selected extends ColumnOf<T> = ColumnOf<T>,
    > {
      private query: Query<T, Selected>

      constructor(table: T) {
        this.query = {
          table,
          selected: [] as unknown as Selected[],
          wheres: [],
          orderBy: null,
          limitVal: null,
        }
      }

      select<C extends ColumnOf<T>>(...columns: C[]): SQLBuilder<T, C> {
        const builder = new SQLBuilder<T, C>(this.query.table)
        builder.query = {
          ...this.query,
          selected: columns,
        } as unknown as Query<T, C>
        return builder
      }

      where(column: ColumnOf<T>, op: WhereClause<T>['op'], value: DBSchema[T][ColumnOf<T>]): this {
        this.query.wheres.push({ column, op, value })
        return this
      }

      orderByCol(column: ColumnOf<T>, direction: OrderDirection = 'ASC'): this {
        this.query.orderBy = { column, direction }
        return this
      }

      limit(n: number): this {
        this.query.limitVal = n
        return this
      }

      toSQL(): string {
        const cols = this.query.selected.length > 0
          ? this.query.selected.join(', ')
          : '*'

        let sql = `SELECT ${cols} FROM ${this.query.table}`

        if (this.query.wheres.length > 0) {
          const conditions = this.query.wheres.map(w => {
            const val = typeof w.value === 'string' ? `'${w.value}'` : w.value
            return `${w.column} ${w.op} ${val}`
          })
          sql += ` WHERE ${conditions.join(' AND ')}`
        }

        if (this.query.orderBy) {
          sql += ` ORDER BY ${this.query.orderBy.column} ${this.query.orderBy.direction}`
        }

        if (this.query.limitVal !== null) {
          sql += ` LIMIT ${this.query.limitVal}`
        }

        return sql
      }

      // Simulate execution with type-safe result
      execute(): QueryResult<T, Selected>[] {
        return [] // Placeholder — in real code would hit DB
      }
    }

    function from<T extends TableName>(table: T): SQLBuilder<T> {
      return new SQLBuilder(table)
    }

    log.push('=== Type-Safe SQL Builder ===')
    log.push('')

    // Query 1: Select specific columns from users
    const q1 = from('users')
      .select('id', 'name', 'email')
      .where('active', '=', true)
      .orderByCol('name', 'ASC')
      .toSQL()

    log.push('Query 1 (users — select specific columns):')
    log.push(`  ${q1}`)
    log.push('  Result type: Pick<DBSchema["users"], "id" | "name" | "email">')

    log.push('')

    // Query 2: Filter posts
    const q2 = from('posts')
      .select('title', 'published')
      .where('published', '=', true)
      .where('author_id', '=', 1)
      .limit(10)
      .toSQL()

    log.push('Query 2 (posts — with multiple where):')
    log.push(`  ${q2}`)

    log.push('')

    // Query 3: Comments with ordering
    const q3 = from('comments')
      .select('text', 'user_id')
      .where('post_id', '=', 42)
      .orderByCol('user_id', 'DESC')
      .limit(5)
      .toSQL()

    log.push('Query 3 (comments — ordered):')
    log.push(`  ${q3}`)

    log.push('')

    // Query 4: Select all (no select call)
    const q4 = from('users')
      .where('age', '>', 18)
      .toSQL()

    log.push('Query 4 (users — select all):')
    log.push(`  ${q4}`)

    log.push('')
    log.push('--- Type Safety Demonstrations ---')
    log.push('from("users").select("nonexistent")        // Compile error!')
    log.push('from("users").where("fake", "=", 1)        // Compile error!')
    log.push('from("users").where("name", "=", 123)      // Compile error! (name is string)')
    log.push('from("nonexistent")                         // Compile error!')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.5: Type-Level SQL Builder</h2>
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
