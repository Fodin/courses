import { useState } from 'react'

// ============================================
// Задание 2.2: Plugins & Decorators
// ============================================

// TODO: Создайте Fastify-плагин с помощью fastify-plugin
// TODO: Используйте decorate() для добавления утилит к instance
// TODO: Реализуйте инкапсуляцию: плагин видим только внутри scope
// TODO: Покажите register() с prefix и opts

export function Task2_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Plugins & Decorators ===')
    log.push('')

    // TODO: Создайте dbPlugin с fastify.decorate('db', connection)
    // TODO: Покажите encapsulation vs fastify-plugin (skip encapsulation)
    // TODO: Реализуйте authPlugin с decorateRequest('user', null)
    // TODO: Продемонстрируйте порядок загрузки плагинов (after/ready)
    log.push('Plugins & Decorators')
    log.push('  ... fastify.register(dbPlugin, { connectionString })')
    log.push('  ... fastify.decorate("db", pgPool)')
    log.push('  ... fastify.decorateRequest("user", null)')
    log.push('  ... encapsulation: child scope не влияет на parent')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Plugins & Decorators</h2>
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
