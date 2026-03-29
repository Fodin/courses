import { useState } from 'react'

// ============================================
// Задание 3.3: Template Literal Parsing
// ============================================

// TODO: Создайте тип Split<S, D> — разделяет строку на tuple:
//   Split<'a.b.c', '.'> → ['a', 'b', 'c']
//   Подсказка: S extends `${infer Head}${D}${infer Tail}` ? [Head, ...Split<Tail, D>] : [S]
// TODO: Создайте runtime-функцию split(s, d): string[]

// TODO: Создайте тип Join<T extends string[], D> — объединяет tuple в строку:
//   Join<['a','b','c'], '.'> → 'a.b.c'
// TODO: Создайте runtime-функцию join(arr, d): string

// TODO: Создайте тип ParseRouteParams<S> — извлекает параметры из URL-шаблона:
//   ParseRouteParams<'/users/:id/posts/:postId'> → 'id' | 'postId'
//   Подсказка: ищите :param через infer
// TODO: Создайте runtime-функцию extractRouteParams(route): string[]

// TODO: Реализуйте type-safe buildRoute(template, params):
//   buildRoute('/users/:id', { id: '42' }) → '/users/42'

// TODO: Создайте типы Trim, TrimStart, TrimEnd:
//   TrimStart<'  hello'> → 'hello'
//   TrimEnd<'hello  '> → 'hello'

// TODO: Создайте тип ExtractDomain<S> — извлекает домен из email:
//   ExtractDomain<'alice@example.com'> → 'example.com'

export function Task3_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте Split:
    // log.push('=== Split<S, D> ===')
    // log.push(`Split<'a.b.c', '.'> → [${split('a.b.c', '.').map(s => `"${s}"`).join(', ')}]`)

    // TODO: Протестируйте Join:
    // log.push('=== Join<T, D> ===')
    // log.push(`Join<['a','b','c'], '.'> → "${join(['a', 'b', 'c'], '.')}"`)

    // TODO: Протестируйте ParseRouteParams:
    // const routes = ['/users/:id', '/users/:userId/posts/:postId']
    // for (const route of routes) {
    //   const params = extractRouteParams(route)
    //   log.push(`"${route}" → params: [${params.map(p => `"${p}"`).join(', ')}]`)
    // }

    // TODO: Протестируйте buildRoute:
    // log.push(`buildRoute('/users/:id', { id: '42' }) → "${buildRoute(...)}"`)

    // TODO: Продемонстрируйте Trim типы:
    // log.push("TrimStart<'  hello'> → 'hello'")
    // log.push("Trim<'  hello  '> → 'hello'")

    // TODO: Протестируйте ExtractDomain:
    // const emails = ['alice@example.com', 'bob@company.org']
    // for (const email of emails) {
    //   log.push(`"${email}" → domain: "${extractDomain(email)}"`)
    // }

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
