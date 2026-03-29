import { useState } from 'react'

// ============================================
// Задание 5.2: Writable Stream
// ============================================

// TODO: Изучите Writable streams:
//   - Методы: write(chunk), end(), destroy()
//   - События: 'drain', 'finish', 'error', 'close'
//   - write() возвращает false когда внутренний буфер заполнен → ждать 'drain'
//   - highWaterMark — порог буфера (по умолчанию 16KB)
//   - Создание: new Writable({ write(chunk, enc, cb) { ... cb() } })
//
// TODO: Study Writable streams:
//   - Methods: write(chunk), end(), destroy()
//   - Events: 'drain', 'finish', 'error', 'close'
//   - write() returns false when buffer full → wait for 'drain'

export function Task5_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Writable Stream ===')
    log.push('')

    // TODO: Реализуйте класс MyWritable:
    //   - constructor(options: { highWaterMark: number })
    //   - write(chunk: string): boolean — записывает в буфер, false если буфер полон
    //   - end() — завершает запись, эмитирует 'finish'
    //   - on('drain', cb) — вызывается когда буфер опустошён
    //   - on('finish', cb) — вызывается после end()
    //   - getBuffer(): string[] — содержимое внутреннего буфера
    // TODO: Implement MyWritable class

    log.push('Basic write:')
    log.push('  ... запишите данные и покажите содержимое буфера')
    log.push('')

    // TODO: Продемонстрируйте backpressure:
    //   Установите highWaterMark = 3 и запишите 5 элементов
    //   Покажите, что write() возвращает false после 3-го элемента
    // TODO: Demonstrate backpressure with lowered highWaterMark
    log.push('Backpressure demo (highWaterMark=3):')
    log.push('  ... покажите, когда write() возвращает false')
    log.push('')

    // TODO: Покажите правильный паттерн записи с учётом backpressure:
    //   if (!writable.write(chunk)) await once(writable, 'drain')
    // TODO: Show correct write pattern respecting backpressure
    log.push('Correct write pattern:')
    log.push('  ... реализуйте запись с ожиданием drain')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: Writable Stream</h2>
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
