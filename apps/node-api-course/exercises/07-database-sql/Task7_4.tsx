import { useState } from 'react'

// ============================================
// Задание 7.4: Transactions & Pooling
// ============================================

// TODO: Реализуйте транзакции для атомарных операций
// TODO: Используйте BEGIN/COMMIT/ROLLBACK через pg client
// TODO: Покажите Prisma $transaction для связанных операций
// TODO: Настройте connection pooling: min, max, idleTimeout

export function Task7_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Transactions & Pooling ===')
    log.push('')

    // TODO: Реализуйте перевод средств: debit + credit в транзакции
    // TODO: Покажите ROLLBACK при ошибке внутри транзакции
    // TODO: Используйте prisma.$transaction([op1, op2]) или interactive tx
    // TODO: Настройте Pool({ max: 20, idleTimeoutMillis: 30000 })
    log.push('Transactions & Pooling')
    log.push('  ... BEGIN -> UPDATE accounts SET balance = balance - 100 WHERE id = 1')
    log.push('  ... -> UPDATE accounts SET balance = balance + 100 WHERE id = 2 -> COMMIT')
    log.push('  ... ошибка -> ROLLBACK (обе операции отменены)')
    log.push('  ... Pool: max=20, idle=30s, connectionTimeout=5s')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.4: Transactions & Pooling</h2>
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
