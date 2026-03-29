import { useState } from 'react'

// ============================================
// Задание 9.1: Recursive Data Structures — Решение
// ============================================

export function Task9_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. JSON type — классический рекурсивный тип
    type JsonValue =
      | string
      | number
      | boolean
      | null
      | JsonValue[]
      | { [key: string]: JsonValue }

    const json: JsonValue = {
      name: 'Alice',
      age: 30,
      active: true,
      address: {
        city: 'Moscow',
        coords: [55.75, 37.62]
      },
      tags: ['developer', 'typescript']
    }
    log.push(`1. JsonValue: ${JSON.stringify(json).slice(0, 80)}...`)

    // 2. Tree structure
    interface TreeNode<T> {
      value: T
      children: TreeNode<T>[]
    }

    const tree: TreeNode<string> = {
      value: 'root',
      children: [
        {
          value: 'child-1',
          children: [
            { value: 'grandchild-1', children: [] },
            { value: 'grandchild-2', children: [] }
          ]
        },
        {
          value: 'child-2',
          children: []
        }
      ]
    }

    // Рекурсивный обход дерева
    function treeToString<T>(node: TreeNode<T>, depth = 0): string {
      const indent = '  '.repeat(depth)
      const childStr = node.children
        .map(c => treeToString(c, depth + 1))
        .join('\n')
      return `${indent}${node.value}${childStr ? '\n' + childStr : ''}`
    }

    log.push('2. Tree structure:')
    treeToString(tree).split('\n').forEach(line => log.push(`   ${line}`))

    // 3. Linked List
    interface LinkedList<T> {
      value: T
      next: LinkedList<T> | null
    }

    const list: LinkedList<number> = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: null
        }
      }
    }

    function linkedListToArray<T>(node: LinkedList<T> | null): T[] {
      const result: T[] = []
      let current = node
      while (current !== null) {
        result.push(current.value)
        current = current.next
      }
      return result
    }

    log.push(`3. LinkedList: [${linkedListToArray(list).join(' -> ')}]`)

    // 4. File system structure
    interface FileSystemEntry {
      name: string
      type: 'file' | 'directory'
      children?: FileSystemEntry[]
      size?: number
    }

    const fileSystem: FileSystemEntry = {
      name: '/',
      type: 'directory',
      children: [
        {
          name: 'src',
          type: 'directory',
          children: [
            { name: 'index.ts', type: 'file', size: 1024 },
            { name: 'utils.ts', type: 'file', size: 512 }
          ]
        },
        { name: 'package.json', type: 'file', size: 256 }
      ]
    }

    function countFiles(entry: FileSystemEntry): number {
      if (entry.type === 'file') return 1
      return (entry.children ?? []).reduce((sum, child) => sum + countFiles(child), 0)
    }

    log.push(`4. FileSystem: ${countFiles(fileSystem)} files in tree`)

    // 5. Nested comment thread
    interface Comment {
      id: number
      text: string
      author: string
      replies: Comment[]
    }

    const thread: Comment = {
      id: 1,
      text: 'Great article!',
      author: 'Alice',
      replies: [
        {
          id: 2,
          text: 'I agree!',
          author: 'Bob',
          replies: [
            {
              id: 3,
              text: 'Thanks both!',
              author: 'Author',
              replies: []
            }
          ]
        }
      ]
    }

    function countComments(comment: Comment): number {
      return 1 + comment.replies.reduce((sum, r) => sum + countComments(r), 0)
    }

    log.push(`5. Comment thread: ${countComments(thread)} comments total`)

    // 6. Recursive type with discriminated union — AST
    type Expression =
      | { type: 'number'; value: number }
      | { type: 'string'; value: string }
      | { type: 'binary'; op: '+' | '-' | '*' | '/'; left: Expression; right: Expression }
      | { type: 'unary'; op: '-' | '!'; operand: Expression }

    const expr: Expression = {
      type: 'binary',
      op: '+',
      left: { type: 'number', value: 1 },
      right: {
        type: 'binary',
        op: '*',
        left: { type: 'number', value: 2 },
        right: { type: 'number', value: 3 }
      }
    }

    function evaluate(expr: Expression): number | string {
      switch (expr.type) {
        case 'number': return expr.value
        case 'string': return expr.value
        case 'unary': {
          const val = evaluate(expr.operand)
          return expr.op === '-' ? -(val as number) : val
        }
        case 'binary': {
          const l = evaluate(expr.left) as number
          const r = evaluate(expr.right) as number
          switch (expr.op) {
            case '+': return l + r
            case '-': return l - r
            case '*': return l * r
            case '/': return l / r
          }
        }
      }
    }

    log.push(`6. AST evaluate(1 + 2 * 3) = ${evaluate(expr)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.1: Recursive Data Structures</h2>
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
// Задание 9.2: Recursive Conditional Types — Решение
// ============================================

export function Task9_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. DeepReadonly — рекурсивно делает все свойства readonly
    type DeepReadonly<T> = T extends object
      ? T extends Function
        ? T
        : { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T

    interface MutableConfig {
      server: {
        host: string
        port: number
        ssl: {
          enabled: boolean
          cert: string
        }
      }
      debug: boolean
    }

    const config: DeepReadonly<MutableConfig> = {
      server: {
        host: 'localhost',
        port: 3000,
        ssl: { enabled: true, cert: 'cert.pem' }
      },
      debug: false
    }
    // config.server.ssl.enabled = false // ❌ Error: readonly
    log.push(`1. DeepReadonly: config.server.ssl.enabled = ${config.server.ssl.enabled}`)
    log.push('   Cannot assign: config.server.ssl.enabled = false (readonly)')

    // 2. DeepPartial — рекурсивно делает все свойства optional
    type DeepPartial<T> = T extends object
      ? T extends Function
        ? T
        : { [K in keyof T]?: DeepPartial<T[K]> }
      : T

    const partialConfig: DeepPartial<MutableConfig> = {
      server: {
        port: 8080
        // host и ssl не обязательны
      }
    }
    log.push(`2. DeepPartial: only port=${partialConfig.server?.port}`)

    // 3. DeepRequired — рекурсивно убирает optional
    type DeepRequired<T> = T extends object
      ? T extends Function
        ? T
        : { [K in keyof T]-?: DeepRequired<T[K]> }
      : T

    interface OptionalConfig {
      server?: {
        host?: string
        port?: number
      }
      debug?: boolean
    }

    // DeepRequired<OptionalConfig> требует все поля
    const fullConfig: DeepRequired<OptionalConfig> = {
      server: { host: 'localhost', port: 3000 },
      debug: true
    }
    log.push(`3. DeepRequired: host="${fullConfig.server.host}", port=${fullConfig.server.port}`)

    // 4. DeepAwaited — рекурсивно "разворачивает" Promise
    type DeepAwaited<T> = T extends Promise<infer U>
      ? DeepAwaited<U>
      : T extends object
        ? { [K in keyof T]: DeepAwaited<T[K]> }
        : T

    type NestedPromise = Promise<Promise<Promise<string>>>
    // DeepAwaited<NestedPromise> = string

    type AsyncData = {
      user: Promise<{ name: string; age: Promise<number> }>
      posts: Promise<string[]>
    }
    // DeepAwaited<AsyncData> = { user: { name: string; age: number }; posts: string[] }

    log.push('4. DeepAwaited<Promise<Promise<string>>> = string')
    log.push('   DeepAwaited<{user: Promise<{age: Promise<number>}>}> = {user: {age: number}}')

    // 5. Flatten — рекурсивное уплощение массивов
    type Flatten<T> = T extends Array<infer U>
      ? Flatten<U>
      : T

    type Nested = number[][][]
    // Flatten<Nested> = number

    type Mixed = (string | number[])[]
    // Flatten<Mixed> = string | number

    log.push('5. Flatten<number[][][]> = number')
    log.push('   Flatten<(string | number[])[]> = string | number')

    // 6. DeepPick — рекурсивный Pick по nested path
    type DeepNullable<T> = T extends object
      ? T extends Function
        ? T
        : { [K in keyof T]: DeepNullable<T[K]> | null }
      : T | null

    interface User {
      name: string
      profile: {
        bio: string
        social: {
          twitter: string
          github: string
        }
      }
    }

    const nullableUser: DeepNullable<User> = {
      name: 'Alice',
      profile: {
        bio: null,
        social: {
          twitter: null,
          github: '@alice'
        }
      }
    }

    log.push(`6. DeepNullable: bio=${nullableUser.profile?.bio}, twitter=${nullableUser.profile?.social?.twitter}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.2: Recursive Conditional Types</h2>
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
// Задание 9.3: Recursive String Types — Решение
// ============================================

export function Task9_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Split — разбить строку по разделителю
    type Split<S extends string, D extends string> =
      S extends `${infer Head}${D}${infer Tail}`
        ? [Head, ...Split<Tail, D>]
        : S extends ''
          ? []
          : [S]

    type Parts = Split<'a.b.c.d', '.'>
    // ['a', 'b', 'c', 'd']

    log.push('1. Split<"a.b.c.d", "."> = ["a", "b", "c", "d"]')

    // 2. Join — объединить tuple в строку
    type Join<T extends string[], D extends string> =
      T extends []
        ? ''
        : T extends [infer Head extends string]
          ? Head
          : T extends [infer Head extends string, ...infer Tail extends string[]]
            ? `${Head}${D}${Join<Tail, D>}`
            : string

    type Joined = Join<['a', 'b', 'c'], '-'>
    // 'a-b-c'

    log.push('2. Join<["a", "b", "c"], "-"> = "a-b-c"')

    // 3. Replace — заменить все вхождения
    type ReplaceAll<
      S extends string,
      From extends string,
      To extends string
    > = From extends ''
      ? S
      : S extends `${infer Head}${From}${infer Tail}`
        ? `${Head}${To}${ReplaceAll<Tail, From, To>}`
        : S

    type Replaced = ReplaceAll<'hello world hello', 'hello', 'hi'>
    // 'hi world hi'

    log.push('3. ReplaceAll<"hello world hello", "hello", "hi"> = "hi world hi"')

    // 4. CamelCase — snake_case в camelCase
    type CamelCase<S extends string> =
      S extends `${infer Head}_${infer Char}${infer Tail}`
        ? `${Lowercase<Head>}${Uppercase<Char>}${CamelCase<Tail>}`
        : Lowercase<S>

    type Camel1 = CamelCase<'hello_world'>       // 'helloWorld'
    type Camel2 = CamelCase<'user_first_name'>   // 'userFirstName'
    type Camel3 = CamelCase<'get_user_by_id'>    // 'getUserById'

    log.push('4. CamelCase<"hello_world"> = "helloWorld"')
    log.push('   CamelCase<"user_first_name"> = "userFirstName"')
    log.push('   CamelCase<"get_user_by_id"> = "getUserById"')

    // 5. KebabCase — camelCase в kebab-case
    type KebabCase<S extends string> =
      S extends `${infer Head}${infer Tail}`
        ? Tail extends Uncapitalize<Tail>
          ? `${Lowercase<Head>}${KebabCase<Tail>}`
          : `${Lowercase<Head>}-${KebabCase<Tail>}`
        : S

    type Kebab1 = KebabCase<'helloWorld'>    // 'hello-world'
    type Kebab2 = KebabCase<'firstName'>     // 'first-name'

    log.push('5. KebabCase<"helloWorld"> = "hello-world"')
    log.push('   KebabCase<"firstName"> = "first-name"')

    // 6. TrimLeft / TrimRight — убрать пробелы
    type TrimLeft<S extends string> =
      S extends ` ${infer Rest}` ? TrimLeft<Rest> : S

    type TrimRight<S extends string> =
      S extends `${infer Rest} ` ? TrimRight<Rest> : S

    type Trim<S extends string> = TrimLeft<TrimRight<S>>

    type Trimmed = Trim<'  hello world  '>  // 'hello world'

    log.push('6. Trim<"  hello world  "> = "hello world"')

    // 7. Length — длина строки через рекурсию
    type StringLength<S extends string, Acc extends unknown[] = []> =
      S extends `${infer _}${infer Rest}`
        ? StringLength<Rest, [...Acc, unknown]>
        : Acc['length']

    type Len = StringLength<'hello'>  // 5

    log.push('7. StringLength<"hello"> = 5')

    // 8. Практический пример: dot-notation path
    type PathKeys<T, Prefix extends string = ''> =
      T extends object
        ? {
            [K in keyof T & string]: K | `${K}.${PathKeys<T[K], ''>}`
          }[keyof T & string]
        : never

    interface Config {
      server: {
        host: string
        port: number
      }
      db: {
        url: string
      }
    }

    // PathKeys<Config> = 'server' | 'server.host' | 'server.port' | 'db' | 'db.url'
    log.push('8. PathKeys<Config> = "server" | "server.host" | "server.port" | "db" | "db.url"')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.3: Recursive String Types</h2>
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
// Задание 9.4: Recursion Limits — Решение
// ============================================

export function Task9_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Лимит рекурсии TypeScript
    log.push('1. TypeScript recursion depth limit: ~50 levels (conditional types)')
    log.push('   Instantiation limit: ~50 levels for type aliases')
    log.push('   Error: "Type instantiation is excessively deep and possibly infinite"')

    // 2. Пример: наивная рекурсия — быстро достигает лимита
    // type NaiveRepeat<S extends string, N extends number, Acc extends string = ''> =
    //   N extends 0
    //     ? Acc
    //     : NaiveRepeat<S, Subtract<N, 1>, `${Acc}${S}`>
    // Это достигнет лимита при N > ~45

    log.push('2. Naive recursion hits limit at ~45-50 levels')
    log.push('   type NaiveRepeat<S, N> fails for large N')

    // 3. Tail-recursive optimization (TypeScript 4.5+)
    // TypeScript оптимизирует хвостовую рекурсию в условных типах
    type BuildTuple<N extends number, Acc extends unknown[] = []> =
      Acc['length'] extends N
        ? Acc
        : BuildTuple<N, [...Acc, unknown]>

    // BuildTuple<1000> работает благодаря tail recursion optimization!
    type Tuple5 = BuildTuple<5>  // [unknown, unknown, unknown, unknown, unknown]

    log.push('3. Tail-recursive optimization (TS 4.5+):')
    log.push('   BuildTuple<1000> works with tail recursion!')
    log.push('   Pattern: accumulator parameter in last position')

    // 4. Паттерн: аккумулятор для хвостовой рекурсии
    // Наивный вариант (НЕ хвостовая рекурсия):
    // type Reverse<T extends unknown[]> =
    //   T extends [infer H, ...infer Rest]
    //     ? [...Reverse<Rest>, H]  // НЕ хвостовая — рекурсия внутри spread
    //     : []

    // Оптимизированный вариант (хвостовая рекурсия):
    type Reverse<T extends unknown[], Acc extends unknown[] = []> =
      T extends [infer H, ...infer Rest]
        ? Reverse<Rest, [H, ...Acc]>  // хвостовая — рекурсия в последней позиции
        : Acc

    type Reversed = Reverse<[1, 2, 3, 4, 5]>  // [5, 4, 3, 2, 1]

    log.push('4. Accumulator pattern for tail recursion:')
    log.push('   Reverse<[1,2,3,4,5]> = [5,4,3,2,1]')
    log.push('   Non-tail: [...Reverse<Rest>, H] — hits limit')
    log.push('   Tail: Reverse<Rest, [H, ...Acc]> — optimized!')

    // 5. Workaround: "divide and conquer" для глубокой рекурсии
    // Разбиваем рекурсию на шаги по 10, чтобы не превысить лимит

    type Add<A extends number, B extends number> =
      [...BuildTuple<A>, ...BuildTuple<B>]['length'] extends infer R extends number
        ? R : never

    type Sum = Add<3, 4>  // 7

    log.push('5. Divide and conquer workaround:')
    log.push(`   Add<3, 4> = 7 (via tuple length)`)
    log.push('   Break deep recursion into smaller steps')

    // 6. Workaround: conditional type distribution
    // Распределение union через conditional types уменьшает глубину

    type IsString<T> = T extends string ? true : false
    type CheckAll<T extends unknown[]> =
      T extends [infer H, ...infer Rest]
        ? IsString<H> extends true
          ? CheckAll<Rest>
          : false
        : true

    type AllStrings = CheckAll<['a', 'b', 'c']>     // true
    type NotAll = CheckAll<['a', 42, 'c']>           // false

    log.push('6. CheckAll<["a", "b", "c"]> = true')
    log.push('   CheckAll<["a", 42, "c"]> = false')

    // 7. Практические рекомендации
    log.push('7. Best practices for recursive types:')
    log.push('   a) Use accumulator parameter (tail recursion)')
    log.push('   b) Add depth counter to prevent infinite loops')
    log.push('   c) Use "extends never" escape hatch')
    log.push('   d) Test with realistic data sizes')
    log.push('   e) Consider runtime validation as alternative')

    // 8. Паттерн: depth limiter
    type MaxDepth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    type SafeDeepReadonly<T, D extends number = 10> =
      [D] extends [never]
        ? T  // Достигли лимита — прекращаем рекурсию
        : T extends object
          ? T extends Function
            ? T
            : { readonly [K in keyof T]: SafeDeepReadonly<T[K], MaxDepth[D]> }
          : T

    log.push('8. Depth limiter pattern:')
    log.push('   SafeDeepReadonly<T, Depth> stops at max depth')
    log.push('   Uses tuple lookup: MaxDepth[D] to decrement')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.4: Recursion Limits</h2>
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
