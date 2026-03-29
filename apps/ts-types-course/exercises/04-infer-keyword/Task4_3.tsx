import { useState } from 'react'

// ============================================
// Задание 4.3: Infer in Template Literals
// ============================================

// TODO: Создайте тип ExtractRouteParam<S> — извлекает параметр из ':param':
//   S extends `:${infer Param}` ? Param : never

// TODO: Создайте тип ParseRoute<S> — извлекает все параметры из URL-шаблона:
//   '/users/:id/posts/:postId' → 'id' | 'postId'
//   Подсказка: рекурсивно ищите :param через infer

// TODO: Создайте тип ExtractDomain<S> — извлекает домен из email:
//   'user@example.com' → 'example.com'
//   S extends `${string}@${infer Domain}` ? Domain : never

// TODO: Создайте тип ParseQueryString<S> — разбирает query string:
//   'name=Alice&age=30' → { name: string; age: string }
//   Подсказка: рекурсивно разделяйте по & и = через infer

// TODO: Создайте тип GetFileExtension<S> — извлекает расширение файла:
//   'image.png' → 'png', 'archive.tar.gz' → 'gz'

export function Task4_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте ExtractRouteParam:
    // log.push("ExtractRouteParam<':id'> → 'id'")
    // log.push("ExtractRouteParam<'users'> → never")

    // TODO: Протестируйте ParseRoute runtime-аналогом:
    // function extractParams(route: string): string[] {
    //   return (route.match(/:(\w+)/g) || []).map(m => m.slice(1))
    // }
    // log.push(`ParseRoute<'/users/:id/posts/:postId'> → [${extractParams('/users/:id/posts/:postId')}]`)

    // TODO: Протестируйте ExtractDomain:
    // function extractDomain(email: string): string { return email.split('@')[1] || '' }
    // log.push(`ExtractDomain<'alice@example.com'> → "${extractDomain('alice@example.com')}"`)

    // TODO: Протестируйте ParseQueryString:
    // function parseQS(qs: string): Record<string, string> {
    //   return Object.fromEntries(qs.split('&').map(p => p.split('=')))
    // }
    // log.push(`ParseQueryString: ${JSON.stringify(parseQS('name=Alice&age=30'))}`)

    // TODO: Протестируйте GetFileExtension:
    // function getExt(filename: string): string {
    //   const parts = filename.split('.')
    //   return parts[parts.length - 1]
    // }
    // log.push(`GetFileExtension<'image.png'> → "${getExt('image.png')}"`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Infer in Template Literals</h2>
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
