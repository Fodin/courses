import { useState } from 'react'

// ============================================
// Задание 9.3: Recursive String Types
// ============================================

// TODO: Создайте тип Split<S, D> — рекурсивно разбивает строку:
//   Split<'a.b.c', '.'> → ['a', 'b', 'c']

// TODO: Создайте тип Join<T extends string[], D> — рекурсивно объединяет:
//   Join<['a', 'b', 'c'], '.'> → 'a.b.c'

// TODO: Создайте тип Reverse<S> — переворачивает строку:
//   Reverse<'hello'> → 'olleh'

// TODO: Создайте тип Length<S> — длина строки (через рекурсивный подсчёт):
//   Length<'hello'> → 5
//   Подсказка: S extends `${string}${infer Rest}` ? Add1<Length<Rest>> : 0
//   Используйте tuple length trick: ['', '', '', '', '']['length'] = 5

// TODO: Создайте тип CamelToSnake<S> — конвертация camelCase в snake_case:
//   CamelToSnake<'backgroundColor'> → 'background_color'
//   Рекурсивно обрабатывайте каждый символ

export function Task9_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте Split и Join runtime-аналогами:
    // log.push(`split('a.b.c', '.') → [${split('a.b.c', '.').join(', ')}]`)
    // log.push(`join(['a','b','c'], '.') → "${join(['a','b','c'], '.')}"`)

    // TODO: Продемонстрируйте Reverse:
    // function reverse(s: string): string { return s.split('').reverse().join('') }
    // log.push(`reverse('hello') → "${reverse('hello')}"`)
    // log.push(`reverse('TypeScript') → "${reverse('TypeScript')}"`)

    // TODO: Продемонстрируйте Length:
    // log.push("Length<'hello'> → 5")
    // log.push("Length<''> → 0")
    // log.push("Length<'TypeScript'> → 10")

    // TODO: Продемонстрируйте CamelToSnake:
    // function camelToSnake(s: string): string {
    //   return s.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)
    // }
    // const examples = ['backgroundColor', 'borderTopWidth', 'fontSize']
    // for (const e of examples) {
    //   log.push(`"${e}" → "${camelToSnake(e)}"`)
    // }

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
