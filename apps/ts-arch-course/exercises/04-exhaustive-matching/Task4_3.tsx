import { useState } from 'react'

// ============================================
// Задание 4.3: Pattern Extraction
// ============================================

// TODO: Создайте утилитные типы:
//   ExtractTag<T, Tag> = Extract<T, { _tag: Tag }>
//   ExtractData<T, Tag> — извлекает data из Variant, или undefined если нет data
// TODO: Create utility types ExtractTag and ExtractData

// TODO: Реализуйте PatternMatcher<T extends { _tag: string }> с методами:
//   extract(tag, value) -> data | null — извлекает данные из варианта
//   is(tag, value): value is ... — type guard для сужения типа
//   map(tag, value, fn) -> R | null — извлекает и трансформирует
//   fold(value, handlers) -> R — exhaustive matching с доступом к data
// TODO: Implement PatternMatcher<T> with methods:
//   extract, is (type guard), map, fold (exhaustive)

// TODO: Создайте фабрику createMatcher<T>() -> PatternMatcher<T>
// TODO: Create factory createMatcher<T>() -> PatternMatcher<T>

// TODO: Определите ApiResponse как union из:
//   Ok { items, total }, NotFound, Unauthorized { reason }, RateLimit { retryAfter }
// TODO: Define ApiResponse as union of Ok, NotFound, Unauthorized, RateLimit

export function Task4_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Pattern Extraction ===')
    log.push('')

    // TODO: Продемонстрируйте extract(), is(), map(), fold() на ApiResponse
    log.push('extract(): ... извлеките данные из Ok и RateLimit')
    log.push('')
    log.push('is() type guard: ... сузите тип и получите доступ к полям')
    log.push('')
    log.push('map(): ... трансформируйте данные конкретного варианта')
    log.push('')
    log.push('fold(): ... exhaustive обработка всех вариантов')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Pattern Extraction</h2>
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
