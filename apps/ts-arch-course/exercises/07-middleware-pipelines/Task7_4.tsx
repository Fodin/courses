import { useState } from 'react'

// ============================================
// Задание 7.4: Plugin Architecture
// ============================================

// TODO: Определите PluginHooks — маппинг хуков к их payload:
//   'app:init', 'app:ready', 'request:before', 'request:after', 'error'
// TODO: Определите Plugin { name, version, hooks: Partial<{[K]: Handler<Payload>}> }
// TODO: Реализуйте PluginSystem: register(plugin), emit<K>(hook, payload)
// TODO: Создайте плагины: loggingPlugin, metricsPlugin, securityPlugin

export function Task7_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Plugin Architecture ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Plugin Architecture')
    log.push('  ... зарегистрируйте плагины и эмитируйте хуки')
    log.push('  ... покажите какие плагины подписаны на какие хуки')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.4: Plugin Architecture</h2>
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
