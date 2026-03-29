import { useState } from 'react'

// ============================================
// Задание 3.2: String Manipulation Types
// ============================================

// TODO: Продемонстрируйте встроенные типы: Uppercase, Lowercase, Capitalize, Uncapitalize

// TODO: Создайте тип CamelCase<S> — конвертирует kebab-case в camelCase:
//   'background-color' → 'backgroundColor'
//   Подсказка: S extends `${infer Head}-${infer Tail}` ? `${Lowercase<Head>}${CamelCase<Capitalize<Tail>>}` : S
// TODO: Создайте runtime-функцию toCamelCase(s: string): string

// TODO: Создайте тип KebabCase<S> — конвертирует camelCase в kebab-case:
//   'backgroundColor' → 'background-color'
//   Подсказка: проверяйте Head extends Uppercase<Head> для обнаружения заглавных букв
// TODO: Создайте runtime-функцию toKebabCase(s: string): string

// TODO: Создайте runtime-функцию toSnakeCase(s: string): string
//   'backgroundColor' → 'background_color'

// TODO: Создайте типы Replace<S, From, To> и ReplaceAll<S, From, To>:
//   Replace заменяет первое вхождение
//   ReplaceAll — рекурсивно заменяет все вхождения

export function Task3_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Выведите встроенные типы:
    // log.push("Uppercase<'hello'> → 'HELLO'")
    // log.push("Lowercase<'HELLO'> → 'hello'")
    // log.push("Capitalize<'hello'> → 'Hello'")
    // log.push("Uncapitalize<'Hello'> → 'hello'")

    // TODO: Протестируйте CamelCase / toCamelCase:
    // const kebabExamples = ['background-color', 'border-top-width', 'font-size']
    // for (const k of kebabExamples) {
    //   log.push(`"${k}" → "${toCamelCase(k)}"`)
    // }

    // TODO: Протестируйте KebabCase / toKebabCase:
    // const camelExamples = ['backgroundColor', 'borderTopWidth', 'fontSize']
    // for (const c of camelExamples) {
    //   log.push(`"${c}" → "${toKebabCase(c)}"`)
    // }

    // TODO: Протестируйте toSnakeCase

    // TODO: Создайте маппинг CSS → JS свойств:
    // type CSSProperties = 'background-color' | 'border-radius' | 'font-size'
    // type JSProperties = CamelCase<CSSProperties>

    // TODO: Продемонстрируйте Replace/ReplaceAll:
    // log.push("Replace<'hello world', ' ', '-'> → 'hello-world'")
    // log.push("ReplaceAll<'a.b.c.d', '.', '/'> → 'a/b/c/d'")

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
