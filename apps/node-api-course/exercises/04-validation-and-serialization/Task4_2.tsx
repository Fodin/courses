import { useState } from 'react'

// ============================================
// Задание 4.2: Joi
// ============================================

// TODO: Реализуйте валидацию с помощью Joi
// TODO: Создайте Joi.object() схемы с цепочкой правил
// TODO: Используйте Joi.alternatives(), Joi.when() для условной валидации
// TODO: Сравните подход Joi с Zod: runtime-only vs type inference

export function Task4_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Joi Validation ===')
    log.push('')

    // TODO: Создайте schema = Joi.object({ email: Joi.string().email() })
    // TODO: Реализуйте middleware с schema.validate(req.body)
    // TODO: Покажите abortEarly: false для сбора всех ошибок
    // TODO: Продемонстрируйте Joi.ref() для cross-field валидации
    log.push('Joi Validation')
    log.push('  ... Joi.object({ email: Joi.string().email().required() })')
    log.push('  ... const { error, value } = schema.validate(body)')
    log.push('  ... abortEarly: false -> все ошибки сразу')
    log.push('  ... Joi.ref("password") для подтверждения пароля')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Joi</h2>
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
