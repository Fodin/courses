import { useState } from 'react'

// ============================================
// За��ание 9.4: Recursion Limits
// ============================================

// TODO: Продемонстрируйте лимиты рекурсии в TypeScript:
//   TS ограничивает глубину рекурсии типов (~50 уровней)
//   При превышении: Type instantiation is excessively deep and possibly infinite

// TODO: Создайте тип TupleOfLength<N, T, Acc extends T[]> — tuple заданной длины:
//   TupleOfLength<3, string> → [string, string, string]
//   Используйте аккумулятор для хвостовой рекурсии:
//   Acc['length'] extends N ? Acc : TupleOfLength<N, T, [...Acc, T]>

// TODO: Создайте тип Range<From, To> — union чисел от From до To:
//   Range<2, 5> → 2 | 3 | 4 | 5
//   Подсказка: используйте TupleOfLength для подсчёта

// TODO: Покажите паттерн «tail call optimization» для типов:
//   Плохо: type Bad<N> = N extends 0 ? [] : [1, ...Bad<Subtract<N, 1>>]
//   Хорошо: type Good<N, Acc extends 1[] = []> = Acc['length'] extends N ? Acc : Good<N, [...Acc, 1]>
//   Хвостовая рекурсия с аккумулятором позволяет больше уровне��

// TODO: Продемонстрируйте workaround через distributive conditional:
//   Разбиение рекурсии на части для обхода лимита

export function Task9_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте TupleOfLength:
    // type Three = TupleOfLength<3, string> // [string, string, string]
    // const three: Three = ['a', 'b', 'c']
    // log.push(`TupleOfLength<3, string>: [${three.join(', ')}]`)

    // TODO: Продемонстрируйт�� Range:
    // log.push('Range<2, 5> → 2 | 3 | 4 | 5')
    // function isInRange(n: number, from: number, to: number): boolean {
    //   return n >= from && n <= to
    // }
    // for (let i = 0; i <= 7; i++) {
    //   log.push(`  ${i}: ${isInRange(i, 2, 5) ? 'in range' : 'out of range'}`)
    // }

    // TODO: Покажите л��мит рекурсии:
    // log.push('')
    // log.push('=== Recursion Limits ===')
    // log.push('TS ограничивает рекурсию до ~50 уровней')
    // log.push('TupleOfLength<1000> — вызовет ошибку')
    // log.push('TupleOfLength<40> — OK с tail call optimization')

    // TODO: Покажите паттерн аккумулятора:
    // log.push('')
    // log.push('=== Tail Call Optimization ===')
    // log.push('Без аккумулятора: [1, ...Recursive<N-1>] — стек растёт')
    // log.push('С аккумулятором: Recursive<N, [...Acc, 1]> — хвостовая рекурсия')

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
