import { useState } from 'react'

// ============================================
// Задание 9.2: Recursive Conditional Types
// ============================================

// TODO: Создайте тип DeepPartial<T> — рекурсивно делает всё optional:
//   { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }

// TODO: Создайте тип DeepReadonly<T> — рекурсивно readonly:
//   { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }

// TODO: Создайте тип DeepFlatten<T> — рекурсивно разворачивает вложенные массивы:
//   DeepFlatten<number[][]> → number
//   DeepFlatten<string[][][]> → string

// TODO: Создайте тип Paths<T> — все возможные пути в объекте через dot-notation:
//   Paths<{ a: { b: { c: string }; d: number } }> → 'a' | 'a.b' | 'a.b.c' | 'a.d'
//   Подсказка: рекурсивно собирайте ключи через template literal types

// TODO: Создайте тип PathValue<T, P extends string> — значение по пути:
//   PathValue<{ a: { b: number } }, 'a.b'> → number

export function Task9_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте DeepPartial:
    // interface Config { server: { host: string; port: number; ssl: { cert: string } } }
    // const partial: DeepPartial<Config> = { server: { port: 8080 } }
    // log.push(`DeepPartial: ${JSON.stringify(partial)}`)

    // TODO: Протестируйте DeepReadonly:
    // const frozen: DeepReadonly<Config> = { server: { host: 'x', port: 3000, ssl: { cert: 'y' } } }
    // frozen.server.port = 8080 // Ошибка!
    // log.push('DeepReadonly: все вложенные свойства readonly')

    // TODO: Продемонстрируйте DeepFlatten:
    // log.push('DeepFlatten<number[][]> → number')
    // log.push('DeepFlatten<string[][][]> → string')

    // TODO: Продемонстрируйте Paths:
    // log.push("Paths<{ a: { b: { c: string } } }> → 'a' | 'a.b' | 'a.b.c'")
    // Реализуйте runtime-аналог:
    // function getPaths(obj: Record<string, unknown>, prefix = ''): string[] { ... }

    // TODO: Продемонстрируйте PathValue:
    // function getByPath(obj: unknown, path: string): unknown { ... }
    // log.push(`getByPath({ a: { b: 42 } }, 'a.b') → ${getByPath({ a: { b: 42 } }, 'a.b')}`)

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
