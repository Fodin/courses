import { useState } from 'react'

// ============================================
// Задание 4.1: Zod
// Task 4.1: Zod
// ============================================

// TODO: Реализуйте валидацию запросов с помощью Zod
// TODO: Implement request validation using Zod
// TODO: Создайте схемы для body, params, query
// TODO: Create schemas for body, params, query
// TODO: Используйте z.object(), z.string(), z.number(), z.enum()
// TODO: Use z.object(), z.string(), z.number(), z.enum()
// TODO: Реализуйте middleware для автоматической валидации через schema.parse()
// TODO: Implement middleware for automatic validation via schema.parse()

export function Task4_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Zod Validation ===')
    log.push('')

    // TODO: Создайте CreateUserSchema = z.object({ name, email, age })
    // TODO: Create CreateUserSchema = z.object({ name, email, age })
    // TODO: Реализуйте validate(schema) middleware
    // TODO: Implement validate(schema) middleware
    // TODO: Покажите z.transform(), z.refine() для кастомных правил
    // TODO: Show z.transform(), z.refine() for custom rules
    // TODO: Продемонстрируйте z.infer<typeof Schema> для типизации
    // TODO: Demonstrate z.infer<typeof Schema> for typing
    log.push('Zod Validation')
    log.push('  ... const CreateUserSchema = z.object({ name: z.string().min(2) })')
    log.push('  ... validate(CreateUserSchema) middleware')
    log.push('  ... type CreateUserDto = z.infer<typeof CreateUserSchema>')
    log.push('  ... .refine(data => data.password === data.confirmPassword)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Zod</h2>
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
