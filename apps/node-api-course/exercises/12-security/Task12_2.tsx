import { useState } from 'react'

// ============================================
// Задание 12.2: Input Sanitization
// Task 12.2: Input Sanitization
// ============================================

// TODO: Реализуйте санитизацию пользовательского ввода / Implement user input sanitization
// TODO: Защитите от XSS: экранирование HTML в строковых полях / Protect against XSS: HTML escaping in string fields
// TODO: Защитите от NoSQL injection: запрет $-операторов в input / Protect against NoSQL injection: disallow $-operators in input
// TODO: Защитите от SQL injection: параметризованные запросы + whitelist / Protect against SQL injection: parameterized queries + whitelist

export function Task12_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Input Sanitization ===')
    log.push('')

    // TODO: Реализуйте sanitizeHtml(input) для удаления тегов / Implement sanitizeHtml(input) to remove tags
    // TODO: Покажите express-mongo-sanitize для NoSQL injection / Show express-mongo-sanitize for NoSQL injection
    // TODO: Реализуйте middleware для рекурсивной санитизации req.body / Implement middleware for recursive req.body sanitization
    // TODO: Продемонстрируйте prototype pollution защиту / Demonstrate prototype pollution protection
    log.push('Input Sanitization')
    log.push('  ... sanitize("<script>alert(1)</script>") -> "&lt;script&gt;..."')
    log.push('  ... reject body: { "$gt": "" } -> NoSQL injection')
    log.push('  ... parameterized query: WHERE id = $1 (не конкатенация / not concatenation)')
    log.push('  ... Object.create(null) для безопасных объектов / for safe objects')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.2: Input Sanitization</h2>
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
