import { useState } from 'react'

// ============================================
// Задание 5.1: Readable Stream
// ============================================

// TODO: Изучите Readable streams в Node.js:
//   - Два режима: flowing (данные идут автоматически) и paused (нужен read())
//   - События: 'data', 'end', 'error', 'readable'
//   - Методы: read(), pause(), resume(), pipe(), destroy()
//   - Создание: new Readable({ read() { this.push(data) } })
//   - objectMode: true — для передачи объектов вместо буферов
//
// TODO: Study Readable streams in Node.js:
//   - Two modes: flowing (automatic) and paused (manual read())
//   - Events: 'data', 'end', 'error', 'readable'
//   - Methods: read(), pause(), resume(), pipe(), destroy()
//   - Creation: new Readable({ read() { this.push(data) } })

export function Task5_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Readable Stream ===')
    log.push('')

    // TODO: Реализуйте класс MyReadable, который симулирует Readable stream:
    //   - constructor(source: string[]) — массив данных для чтения
    //   - read(): string | null — возвращает следующий элемент или null (конец)
    //   - on('data', cb), on('end', cb) — подписка на события
    //   - startFlowing() — автоматическая отправка данных через 'data' события
    //   - pause() / resume() — управление потоком
    // TODO: Implement MyReadable class simulating a Readable stream

    log.push('Paused mode (manual read):')
    log.push('  ... прочитайте данные по одному через read()')
    log.push('')

    log.push('Flowing mode (event-driven):')
    log.push('  ... подпишитесь на "data" и получите все данные')
    log.push('')

    // TODO: Создайте генератор данных — Readable, который выдаёт числа от 1 до N
    //   с задержкой (симуляция async источника данных)
    // TODO: Create a data generator — Readable that yields numbers 1 to N
    log.push('Number generator stream:')
    log.push('  ... создайте стрим, генерирующий числа')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Readable Stream</h2>
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
