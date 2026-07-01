import { useState } from 'react'

// ============================================
// Задание 12.3: Contract Tests
// ============================================

// TODO: Определите StorageContract<T> { get, set, has, delete, clear, size }
// TODO: Определите ContractTest<T> { name, test: (impl) => { passed, message } }
// TODO: Реализуйте createContractSuite<T>(name, tests) с run(impl)
// TODO: Создайте storageContractTests — набор тестов для StorageContract
// TODO: Реализуйте MapStorage и ObjectStorage — обе реализуют StorageContract
//   Прогоните один набор тестов на обеих реализациях

export function Task12_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Contract Tests ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Contract Tests')
    log.push('  ... прогоните один suite на MapStorage и ObjectStorage')
    log.push('  ... обе должны пройти все тесты — они взаимозаменяемы')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.3: Contract Tests</h2>
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
