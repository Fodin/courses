import { useState } from 'react'

// ============================================
// Задание 5.5: Backpressure
// ============================================

// TODO: Разберитесь в механизме backpressure (противодавление):
//   - Возникает, когда producer быстрее consumer
//   - write() возвращает false → producer должен приостановиться
//   - 'drain' событие → producer может продолжить
//   - Без backpressure: переполнение памяти, потеря данных
//   - pipe() обрабатывает backpressure автоматически
//
// TODO: Understand the backpressure mechanism:
//   - Occurs when producer is faster than consumer
//   - write() returns false → producer should pause
//   - 'drain' event → producer can resume
//   - Without backpressure: memory overflow, data loss

export function Task5_5() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Backpressure ===')
    log.push('')

    // TODO: Смоделируйте проблему без backpressure:
    //   Быстрый producer (1000 элементов мгновенно) + медленный consumer (обработка 1мс/элемент)
    //   Покажите, как буфер растёт без контроля
    // TODO: Simulate the problem without backpressure:
    //   Fast producer + slow consumer, show buffer growth

    log.push('Without backpressure:')
    log.push('  ... покажите рост буфера без контроля')
    log.push('')

    // TODO: Реализуйте корректный backpressure:
    //   1. Producer проверяет возвращаемое значение write()
    //   2. Если false — ставит на паузу и ждёт 'drain'
    //   3. Покажите, что размер буфера остаётся в пределах highWaterMark
    // TODO: Implement correct backpressure:
    //   1. Producer checks write() return value
    //   2. If false — pauses and waits for 'drain'
    //   3. Show buffer stays within highWaterMark

    log.push('With backpressure:')
    log.push('  ... покажите контролируемый поток данных')
    log.push('')

    // TODO: Покажите метрики: пиковый размер буфера, количество drain-ов,
    //   общее время обработки
    // TODO: Show metrics: peak buffer size, drain count, total processing time
    log.push('Metrics comparison:')
    log.push('  ... сравните метрики с backpressure и без')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.5: Backpressure</h2>
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
