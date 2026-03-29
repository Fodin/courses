import { useState } from 'react'

// ============================================
// Задание 10.4: Type-Level Pattern Matching
// ============================================

// TODO: Создайте тип Match<T, Patterns> — pattern matching на уровне типов:
//   type Patterns = [
//     [string, 'is-string'],
//     [number, 'is-number'],
//     [boolean, 'is-boolean'],
//   ]
//   Match<string, Patterns> → 'is-string'

// TODO: Создайте тип ParseInt<S extends string> — парсинг строки в число:
//   ParseInt<'42'> → 42
//   Подсказка: маппинг цифр через lookup type и рекурсивный подсчёт

// TODO: Создайте тип IsUnion<T> — проверка, является ли T union:
//   IsUnion<string | number> → true
//   IsUnion<string> → false
//   Подсказка: [T] extends [UnionToIntersection<T>] ? false : true

// TODO: Создайте тип IsLiteral<T> — проверка, является ли T literal type:
//   IsLiteral<'hello'> → true
//   IsLiteral<string> → false

// TODO: Создайте тип Compute<T> — «развернуть» пересечение типов в плоский объект:
//   Compute<{ a: 1 } & { b: 2 }> → { a: 1; b: 2 }
//   Подсказка: { [K in keyof T]: T[K] }

export function Task10_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте Match:
    // log.push('=== Type-Level Pattern Matching ===')
    // log.push('Match<string, Patterns> → "is-string"')
    // log.push('Match<number, Patterns> → "is-number"')
    // log.push('Match<boolean, Patterns> → "is-boolean"')

    // TODO: Продемонстрируйте IsUnion:
    // log.push('')
    // log.push('IsUnion<string | number> → true')
    // log.push('IsUnion<string> → false')
    // log.push('IsUnion<never> → false')

    // TODO: Продемонстрируйте IsLiteral:
    // log.push('')
    // log.push("IsLiteral<'hello'> → true")
    // log.push('IsLiteral<string> → false')
    // log.push('IsLiteral<42> → true')
    // log.push('IsLiteral<number> → false')

    // TODO: Продемонстрируйте Compute:
    // type Merged = Compute<{ a: 1 } & { b: 2 }>
    // const merged: Merged = { a: 1, b: 2 }
    // log.push(`Compute<{a:1} & {b:2}> → ${JSON.stringify(merged)}`)

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
