import { useState } from 'react'

// ============================================
// Задание 5.4: Specifications
// ============================================

// TODO: Определите Specification<T> { isSatisfiedBy, and, or, not }
// TODO: Реализуйте BaseSpec<T> с комбинированными предикатами
// TODO: Создайте spec<T>(predicate) -> Specification<T>
// TODO: Определите Product { name, price, category, inStock, rating }
// TODO: Создайте спецификации: isInStock, isAffordable(max), hasMinRating(min), inCategory(cat)
// TODO: Реализуйте filterBySpec<T>(items, specification) -> T[]

export function Task5_4() {
  const [results, setResults] = useState<string[]>([])
  const runExample = () => {
    const log: string[] = []
    log.push('=== Specifications ===')
    log.push('')
    log.push('Simple Specifications:')
    log.push('  ... isInStock, isAffordable(40)')
    log.push('')
    log.push('Composed: AND')
    log.push('  ... isInStock.and(isAffordable(40)).and(hasMinRating(4.5))')
    log.push('')
    log.push('Composed: OR')
    log.push('  ... inCategory("books").or(inCategory("electronics"))')
    log.push('')
    log.push('Composed: NOT')
    log.push('  ... isInStock.not()')
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.4: Specifications</h2>
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
