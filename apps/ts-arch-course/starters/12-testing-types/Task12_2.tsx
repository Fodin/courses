import { useState } from 'react'

// ============================================
// Задание 12.2: Type-Safe Fixtures
// ============================================

// TODO: Определите DeepPartial<T> и FixtureFactory<T>:
//   build(overrides?) -> T, buildMany(count, overrides?) -> T[]
//   buildWith<K>(key, value) -> T, reset()
// TODO: Реализуйте createFixtureFactory<T>(defaults, sequenceKey?)
//   sequenceKey — автоинкремент для id
//   overrides через deepMerge
// TODO: Создайте фабрики для User, Post, Comment

export function Task12_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Type-Safe Fixtures ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Type-Safe Fixtures')
    log.push('  ... build, buildMany, buildWith')
    log.push('  ... overrides с deep merge, auto-increment id, relationships')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.2: Type-Safe Fixtures</h2>
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
