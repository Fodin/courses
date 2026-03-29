import { useState } from 'react'

// ============================================
// Задание 5.5: Invariant Types
// ============================================

// TODO: Определите NonEmptyArray<T> = readonly [T, ...T[]]
// TODO: createNonEmpty<T>(items) бросает при пустом, headOf<T>(arr) всегда безопасен
// TODO: Создайте UnverifiedEmail и VerifiedEmail (разные Brand)
// TODO: registerEmail -> UnverifiedEmail, verifyEmail -> VerifiedEmail
// TODO: sendNewsletter принимает ТОЛЬКО VerifiedEmail
// TODO: NonNegativeBalance с deposit/withdraw (overdraft -> Error)
// TODO: Percentage (0-100) с applyDiscount

export function Task5_5() {
  const [results, setResults] = useState<string[]>([])
  const runExample = () => {
    const log: string[] = []
    log.push('=== Invariant Types ===')
    log.push('')
    log.push('NonEmptyArray:')
    log.push('  ... createNonEmpty, headOf')
    log.push('')
    log.push('Email Verification workflow:')
    log.push('  ... registerEmail -> verifyEmail -> sendNewsletter')
    log.push('')
    log.push('NonNegativeBalance:')
    log.push('  ... deposit, withdraw, overdraft error')
    log.push('')
    log.push('Percentage:')
    log.push('  ... createPercentage(20), applyDiscount(100, discount)')
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.5: Invariant Types</h2>
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
