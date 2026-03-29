import { useState } from 'react'

// ============================================
// Задание 10.3: Type-Level Strings
// ============================================

// TODO: Создайте тип StringLength<S> — длина строки на уровне типов:
//   StringLength<'hello'> → 5
//   Подсказка: конвертируйте строку в tuple через Split, затем берите length

// TODO: Создайте тип Repeat<S extends string, N extends number> — повторение строки:
//   Repeat<'ab', 3> → 'ababab'

// TODO: Создайте тип StartsWith<S, Prefix> — проверка начала строки:
//   StartsWith<'hello world', 'hello'> → true

// TODO: Создайте тип EndsWith<S, Suffix> — проверка конца строки:
//   EndsWith<'hello world', 'world'> → true

// TODO: Создайте тип PadStart<S, N, Char> — дополнение строки слева:
//   PadStart<'42', 5, '0'> → '00042'

// TODO: Создайте тип Replace<S, From, To> — замена первого вхождения
// TODO: Создайте тип ReplaceAll<S, From, To> — замена всех вхождений

export function Task10_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте type-level строковые операции:
    // log.push('=== Type-Level Strings ===')
    // log.push("StringLength<'hello'> → 5")
    // log.push("Repeat<'ab', 3> → 'ababab'")
    // log.push("StartsWith<'hello world', 'hello'> → true")
    // log.push("EndsWith<'hello world', 'world'> → true")

    // TODO: Runtime-верификация:
    // log.push('')
    // log.push(`'hello'.length → ${'hello'.length}`)
    // log.push(`'ab'.repeat(3) → '${'ab'.repeat(3)}'`)
    // log.push(`'hello world'.startsWith('hello') → ${'hello world'.startsWith('hello')}`)

    // TODO: Продемонстрируйте PadStart:
    // log.push("PadStart<'42', 5, '0'> → '00042'")
    // log.push(`Runtime: '${'42'.padStart(5, '0')}'`)

    // TODO: Продемонстрируйте Replace/ReplaceAll:
    // log.push("Replace<'a.b.c', '.', '/'> → 'a/b.c'")
    // log.push("ReplaceAll<'a.b.c', '.', '/'> → 'a/b/c'")

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>За��ание 10.3: Type-Level Strings</h2>
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
