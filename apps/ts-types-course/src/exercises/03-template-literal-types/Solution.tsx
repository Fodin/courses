import { useState } from 'react'

// ============================================
// Задание 3.1: Template Literal Basics — Решение
// ============================================

export function Task3_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Базовый template literal type
    type Greeting = `Hello, ${string}`
    // Любая строка, начинающаяся с "Hello, "

    function greet(msg: Greeting): string {
      return msg
    }

    log.push('=== Basic Template Literal ===')
    log.push(`greet("Hello, World") → "${greet('Hello, World')}"`)
    log.push(`greet("Hello, TypeScript") → "${greet('Hello, TypeScript')}"`)
    // greet("Hi there") // ❌ Ошибка!

    // 2. Union из template literals
    type Color = 'red' | 'green' | 'blue'
    type Shade = 'light' | 'dark'
    type ColorVariant = `${Shade}-${Color}`
    // "light-red" | "light-green" | "light-blue" | "dark-red" | "dark-green" | "dark-blue"

    const allVariants: ColorVariant[] = [
      'light-red', 'light-green', 'light-blue',
      'dark-red', 'dark-green', 'dark-blue',
    ]

    log.push('')
    log.push('=== Union from Template Literals ===')
    log.push(`type Color = 'red' | 'green' | 'blue'`)
    log.push(`type Shade = 'light' | 'dark'`)
    log.push(`type ColorVariant = \`\${Shade}-\${Color}\``)
    log.push(`All variants (${allVariants.length}): ${allVariants.join(', ')}`)

    // 3. CSS units
    type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'
    type CSSValue = `${number}${CSSUnit}`

    function setCSSValue(prop: string, value: CSSValue): string {
      return `${prop}: ${value}`
    }

    log.push('')
    log.push('=== CSS Values ===')
    log.push(setCSSValue('width', '100px'))
    log.push(setCSSValue('font-size', '1.5rem'))
    log.push(setCSSValue('height', '50vh'))
    // setCSSValue('width', '100') // ❌ Нет единицы измерения

    // 4. Event names
    type DOMEvent = 'click' | 'focus' | 'blur' | 'input' | 'change'
    type EventHandler = `on${Capitalize<DOMEvent>}`
    // "onClick" | "onFocus" | "onBlur" | "onInput" | "onChange"

    const handlers: EventHandler[] = ['onClick', 'onFocus', 'onBlur', 'onInput', 'onChange']
    log.push('')
    log.push('=== Event Handler Names ===')
    log.push(`type DOMEvent = 'click' | 'focus' | ...`)
    log.push(`type EventHandler = \`on\${Capitalize<DOMEvent>}\``)
    log.push(`Handlers: ${handlers.join(', ')}`)

    // 5. Route patterns
    type ApiVersion = 'v1' | 'v2'
    type Resource = 'users' | 'posts' | 'comments'
    type ApiRoute = `/api/${ApiVersion}/${Resource}`

    const routes: ApiRoute[] = [
      '/api/v1/users', '/api/v1/posts', '/api/v1/comments',
      '/api/v2/users', '/api/v2/posts', '/api/v2/comments',
    ]

    log.push('')
    log.push('=== API Routes ===')
    log.push(`Routes (${routes.length}):`)
    routes.forEach((r) => log.push(`  ${r}`))

    // 6. Combinatorial explosion
    type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
    type StatusCode = 200 | 201 | 400 | 404 | 500
    type LogEntry = `[${HttpMethod}] ${StatusCode}`
    // 4 * 5 = 20 combinations

    const exampleLogs: LogEntry[] = [
      '[GET] 200', '[POST] 201', '[DELETE] 404', '[PUT] 500',
    ]

    log.push('')
    log.push('=== Combinatorial Type ===')
    log.push(`HttpMethod (4) x StatusCode (5) = 20 possible LogEntry values`)
    log.push(`Examples: ${exampleLogs.join(', ')}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: Template Literal Basics</h2>
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
// Задание 3.2: String Manipulation Types — Решение
// ============================================

export function Task3_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Встроенные string manipulation types
    type Upper = Uppercase<'hello'>     // "HELLO"
    type Lower = Lowercase<'HELLO'>     // "hello"
    type Cap = Capitalize<'hello'>      // "Hello"
    type Uncap = Uncapitalize<'Hello'>  // "hello"

    log.push('=== Built-in String Manipulation Types ===')
    log.push(`Uppercase<'hello'>     → "HELLO"`)
    log.push(`Lowercase<'HELLO'>     → "hello"`)
    log.push(`Capitalize<'hello'>    → "Hello"`)
    log.push(`Uncapitalize<'Hello'>  → "hello"`)

    // 2. CamelCase from kebab-case
    type CamelCase<S extends string> =
      S extends `${infer Head}-${infer Tail}`
        ? `${Lowercase<Head>}${CamelCase<Capitalize<Tail>>}`
        : S

    // Compile-time examples:
    // CamelCase<'background-color'> → 'backgroundColor'
    // CamelCase<'border-top-width'> → 'borderTopWidth'

    function toCamelCase(s: string): string {
      return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    }

    const kebabExamples = ['background-color', 'border-top-width', 'font-size', 'margin-left']
    log.push('')
    log.push('=== CamelCase<S> (kebab → camel) ===')
    for (const k of kebabExamples) {
      log.push(`  "${k}" → "${toCamelCase(k)}"`)
    }

    // 3. KebabCase from camelCase
    type KebabCase<S extends string> =
      S extends `${infer Head}${infer Tail}`
        ? Head extends Uppercase<Head>
          ? Head extends Lowercase<Head>
            ? `${Head}${KebabCase<Tail>}`
            : `-${Lowercase<Head>}${KebabCase<Tail>}`
          : `${Head}${KebabCase<Tail>}`
        : S

    function toKebabCase(s: string): string {
      return s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
    }

    const camelExamples = ['backgroundColor', 'borderTopWidth', 'fontSize', 'marginLeft']
    log.push('')
    log.push('=== KebabCase<S> (camel → kebab) ===')
    for (const c of camelExamples) {
      log.push(`  "${c}" → "${toKebabCase(c)}"`)
    }

    // 4. SnakeCase
    function toSnakeCase(s: string): string {
      return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
    }

    log.push('')
    log.push('=== SnakeCase (camel → snake) ===')
    for (const c of camelExamples) {
      log.push(`  "${c}" → "${toSnakeCase(c)}"`)
    }

    // 5. Practical: CSS property to JS property mapping
    type CSSProperties = 'background-color' | 'border-radius' | 'font-size' | 'line-height' | 'z-index'
    type JSProperties = CamelCase<CSSProperties>

    const cssToJs: Record<string, string> = {}
    const cssProps: CSSProperties[] = ['background-color', 'border-radius', 'font-size', 'line-height', 'z-index']
    for (const prop of cssProps) {
      cssToJs[prop] = toCamelCase(prop)
    }

    log.push('')
    log.push('=== CSS → JS Property Mapping ===')
    for (const [css, js] of Object.entries(cssToJs)) {
      log.push(`  ${css.padEnd(20)} → ${js}`)
    }

    // 6. Replace in string type
    type Replace<
      S extends string,
      From extends string,
      To extends string
    > = S extends `${infer Head}${From}${infer Tail}`
      ? `${Head}${To}${Tail}`
      : S

    type ReplaceAll<
      S extends string,
      From extends string,
      To extends string
    > = S extends `${infer Head}${From}${infer Tail}`
      ? ReplaceAll<`${Head}${To}${Tail}`, From, To>
      : S

    log.push('')
    log.push('=== Replace / ReplaceAll ===')
    log.push(`Replace<'hello world', ' ', '-'>    → "hello-world"`)
    log.push(`ReplaceAll<'a.b.c.d', '.', '/'>     → "a/b/c/d"`)
    log.push(`Runtime: "${'hello world'.replace(' ', '-')}"`)
    log.push(`Runtime: "${'a.b.c.d'.replaceAll('.', '/')}"`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: String Manipulation Types</h2>
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
// Задание 3.3: Template Literal Parsing — Решение
// ============================================

export function Task3_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Split — разделение строки на tuple
    type Split<S extends string, D extends string> =
      S extends `${infer Head}${D}${infer Tail}`
        ? [Head, ...Split<Tail, D>]
        : [S]

    // Split<'a.b.c', '.'> → ['a', 'b', 'c']
    // Split<'hello', ''> → ['h', 'e', 'l', 'l', 'o']

    function split(s: string, d: string): string[] {
      return s.split(d)
    }

    log.push('=== Split<S, D> ===')
    log.push(`Split<'a.b.c', '.'>         → [${split('a.b.c', '.').map(s => `"${s}"`).join(', ')}]`)
    log.push(`Split<'hello-world', '-'>    → [${split('hello-world', '-').map(s => `"${s}"`).join(', ')}]`)
    log.push(`Split<'one/two/three', '/'>  → [${split('one/two/three', '/').map(s => `"${s}"`).join(', ')}]`)

    // 2. Join — объединение tuple в строку
    type Join<T extends string[], D extends string> =
      T extends [infer First extends string]
        ? First
        : T extends [infer First extends string, ...infer Rest extends string[]]
          ? `${First}${D}${Join<Rest, D>}`
          : ''

    function join(arr: string[], d: string): string {
      return arr.join(d)
    }

    log.push('')
    log.push('=== Join<T, D> ===')
    log.push(`Join<['a','b','c'], '.'>  → "${join(['a', 'b', 'c'], '.')}"`)
    log.push(`Join<['x','y'], '-'>      → "${join(['x', 'y'], '-')}"`)

    // 3. ParseRoute — извлечение параметров из URL-шаблона
    type ParseRouteParams<S extends string> =
      S extends `${string}:${infer Param}/${infer Rest}`
        ? Param | ParseRouteParams<Rest>
        : S extends `${string}:${infer Param}`
          ? Param
          : never

    // ParseRouteParams<'/users/:id/posts/:postId'> → 'id' | 'postId'

    function extractRouteParams(route: string): string[] {
      const matches = route.match(/:(\w+)/g)
      return matches ? matches.map((m) => m.slice(1)) : []
    }

    const routes = [
      '/users/:id',
      '/users/:userId/posts/:postId',
      '/api/:version/resources/:resourceId/comments/:commentId',
    ]

    log.push('')
    log.push('=== ParseRouteParams<S> ===')
    for (const route of routes) {
      const params = extractRouteParams(route)
      log.push(`  "${route}"`)
      log.push(`    → params: [${params.map(p => `"${p}"`).join(', ')}]`)
    }

    // 4. Type-safe route builder
    type RouteParams<S extends string> =
      S extends `${string}:${infer Param}/${infer Rest}`
        ? { [K in Param | keyof RouteParamsHelper<Rest>]: string }
        : S extends `${string}:${infer Param}`
          ? { [K in Param]: string }
          : Record<string, never>

    type RouteParamsHelper<S extends string> =
      S extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? { [K in Param]: string } & RouteParamsHelper<Rest>
        : S extends `${infer _Start}:${infer Param}`
          ? { [K in Param]: string }
          : Record<string, never>

    function buildRoute(template: string, params: Record<string, string>): string {
      return template.replace(/:(\w+)/g, (_, key) => params[key] || `:${key}`)
    }

    log.push('')
    log.push('=== Type-safe Route Builder ===')
    log.push(`buildRoute('/users/:id', { id: '42' })`)
    log.push(`  → "${buildRoute('/users/:id', { id: '42' })}"`)
    log.push(`buildRoute('/users/:userId/posts/:postId', { userId: '1', postId: '99' })`)
    log.push(`  → "${buildRoute('/users/:userId/posts/:postId', { userId: '1', postId: '99' })}"`)

    // 5. TrimStart / TrimEnd / Trim
    type TrimStart<S extends string> =
      S extends ` ${infer Rest}` ? TrimStart<Rest> : S

    type TrimEnd<S extends string> =
      S extends `${infer Rest} ` ? TrimEnd<Rest> : S

    type Trim<S extends string> = TrimStart<TrimEnd<S>>

    log.push('')
    log.push('=== Trim Types ===')
    log.push(`TrimStart<'  hello'>  → "hello"`)
    log.push(`TrimEnd<'hello  '>    → "hello"`)
    log.push(`Trim<'  hello  '>     → "hello"`)
    log.push(`Runtime: "${'  hello  '.trim()}"`)

    // 6. Extract domain from email
    type ExtractDomain<S extends string> =
      S extends `${string}@${infer Domain}` ? Domain : never

    function extractDomain(email: string): string {
      return email.split('@')[1] || ''
    }

    const emails = ['alice@example.com', 'bob@company.org', 'dev@startup.io']
    log.push('')
    log.push('=== ExtractDomain<S> ===')
    for (const email of emails) {
      log.push(`  "${email}" → domain: "${extractDomain(email)}"`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: Template Literal Parsing</h2>
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
