import { useState } from 'react'

// ============================================
// Задание 2.2: Accumulating Builder
// ============================================

// TODO: Определите интерфейс FormConfig:
//   title: string, action: string, method: 'GET'|'POST',
//   fields: Array<{name, type, required}>, validation: boolean, submitLabel: string
// TODO: Define FormConfig interface

// TODO: Определите тип RequiredKeys = 'title' | 'action' | 'method'
// TODO: Define type RequiredKeys = 'title' | 'action' | 'method'

// TODO: Реализуйте класс FormBuilder<TSet extends Partial<Record<RequiredKeys, true>> = {}>
//   Каждый обязательный setter возвращает FormBuilder<TSet & { key: true }>
//   Необязательные setters (field, validation, submitLabel) возвращают this
//   build() доступен ТОЛЬКО когда TSet содержит все RequiredKeys:
//     build(this: FormBuilder<{ title: true, action: true, method: true }>): FormConfig
// TODO: Implement class FormBuilder<TSet>
//   Required setters return FormBuilder<TSet & { key: true }>
//   Optional setters return this
//   build() is only available when all RequiredKeys are set (using this parameter)

export function Task2_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Accumulating Builder ===')
    log.push('')

    // TODO: Создайте полную форму со всеми обязательными полями
    // TODO: Create a complete form with all required fields
    log.push('Built form config:')
    log.push('  ... new FormBuilder().title("...").action("...").method("POST").build()')
    log.push('')

    // TODO: Покажите что порядок вызовов не важен
    // TODO: Show that call order doesn't matter
    log.push('Order-independent:')
    log.push('  ... вызовите method->action->title и build()')
    log.push('')

    log.push('Accumulation tracking (compile-time):')
    log.push('  new FormBuilder().title("x").build()  // Error: missing action, method')
    log.push('  new FormBuilder().build()              // Error: missing all required')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Accumulating Builder</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
