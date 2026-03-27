import { useState } from 'react'

// ============================================
// Задание 8.1: Type-safe Builder
// ============================================

// TODO: Define interface ServerConfig with fields:
//   host: string
//   port: number
//   protocol: 'http' | 'https'
//   maxConnections?: number
//   timeout?: number

// TODO: Define type RequiredConfigKeys = 'host' | 'port' | 'protocol'

// TODO: Create class ConfigBuilder<Set extends string = never>
//   The generic parameter Set tracks which required fields have been set.
//
//   private config: Partial<ServerConfig> = {}
//
//   setHost(host: string): ConfigBuilder<Set | 'host'>
//     - Store host in config
//     - Return this cast to the new type: return this as unknown as ConfigBuilder<Set | 'host'>
//
//   setPort(port: number): ConfigBuilder<Set | 'port'>
//     - Same pattern as setHost
//
//   setProtocol(protocol: 'http' | 'https'): ConfigBuilder<Set | 'protocol'>
//     - Same pattern
//
//   setMaxConnections(max: number): ConfigBuilder<Set>
//     - Optional field — does NOT change Set
//
//   setTimeout(timeout: number): ConfigBuilder<Set>
//     - Optional field — does NOT change Set
//
//   build(this: ConfigBuilder<RequiredConfigKeys extends Set ? Set : never>): ServerConfig
//     - The `this` parameter constraint makes build() callable
//       ONLY when Set contains all RequiredConfigKeys
//     - Return { ...this.config } as ServerConfig

// TODO: Create factory function createConfigBuilder(): ConfigBuilder<never>
//   - Returns new ConfigBuilder()

export function Task8_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('--- Type-safe Builder ---')
    log.push('')

    // TODO: Build config1 with all required fields:
    //   createConfigBuilder()
    //     .setHost('localhost')
    //     .setPort(3000)
    //     .setProtocol('https')
    //     .build()
    // Log host, port, protocol

    // TODO: Build config2 with required + optional fields:
    //   createConfigBuilder()
    //     .setProtocol('http')
    //     .setHost('api.example.com')
    //     .setMaxConnections(100)
    //     .setPort(8080)
    //     .setTimeout(5000)
    //     .build()
    // Log all fields including optional

    // TODO: Add comments showing that these would NOT compile:
    //   createConfigBuilder().setHost('x').build()  — missing port & protocol
    //   createConfigBuilder().build()               — no fields set

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.1: Type-safe Builder</h2>
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
