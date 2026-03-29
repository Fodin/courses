import { useState } from 'react'

// ============================================
// Задание 1.4: Template Engines
// ============================================

// TODO: Подключите шаблонизатор к Express (EJS или Handlebars)
// TODO: Настройте app.set('view engine') и app.set('views')
// TODO: Реализуйте res.render() с передачей данных в шаблон
// TODO: Покажите layouts, partials и передачу динамических данных

export function Task1_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Template Engines ===')
    log.push('')

    // TODO: Настройте EJS как view engine
    // TODO: Создайте шаблон с циклом и условиями
    // TODO: Покажите передачу массива объектов в шаблон
    // TODO: Продемонстрируйте экранирование HTML (XSS-защита)
    log.push('Template Engine')
    log.push('  ... app.set("view engine", "ejs")')
    log.push('  ... res.render("users", { users, title: "User List" })')
    log.push('  ... <% users.forEach(u => { %> ... <% }) %>')
    log.push('  ... <%= escapedOutput %> vs <%- rawHtml %>')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: Template Engines</h2>
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
