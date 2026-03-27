import { useState } from 'react'

// ============================================
// Задание 4.3: Plugin System
// ============================================

// TODO: Define Plugin<TConfig> interface
// - name: string
// - config?: TConfig
// - onInit?(): string
// - onDestroy?(): string

// TODO: Create PluginManager class
// - Private field: plugins = new Map<string, Plugin>()
// - Private field: logs: string[] = []
// - install<T>(plugin: Plugin<T>): void
//   - Throw Error if plugin already installed
//   - Add to map, call onInit() if exists, save log
// - uninstall(name: string): void
//   - Throw Error if plugin not found
//   - Call onDestroy() if exists, remove from map, save log
// - isInstalled(name: string): boolean
// - getPlugin<T>(name: string): Plugin<T> | undefined
// - listPlugins(): string[]
// - getLogs(): string[]

// TODO: Define LoggerPluginConfig interface
// - level: 'debug' | 'info' | 'warn' | 'error'
// - prefix: string

// TODO: Define AnalyticsPluginConfig interface
// - trackingId: string
// - enabled: boolean

// TODO: Create loggerPlugin: Plugin<LoggerPluginConfig>
// - name: 'logger'
// - config: { level: 'info', prefix: '[LOG]' }
// - onInit: return log message with prefix and level
// - onDestroy: return log message

// TODO: Create analyticsPlugin: Plugin<AnalyticsPluginConfig>
// - name: 'analytics'
// - config: { trackingId: 'UA-12345', enabled: true }
// - onInit/onDestroy: return log messages

// TODO: Create cachePlugin: Plugin (no config)
// - name: 'cache'
// - onInit/onDestroy: return log messages

export function Task4_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create PluginManager instance
    // TODO: Install all three plugins
    // TODO: Display init logs
    // TODO: List installed plugins
    // TODO: Get analytics plugin config and display trackingId
    // TODO: Uninstall cache plugin
    // TODO: Try to install logger again — should throw
    // TODO: Add results to log

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Plugin System</h2>
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
