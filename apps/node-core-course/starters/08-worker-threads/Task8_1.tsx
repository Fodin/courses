import { useState } from 'react'

// ============================================
// Задание 8.1: Basic Worker
// ============================================

// TODO: Изучите worker_threads — потоки в Node.js:
//   - new Worker(filename, options) — создание воркера
//   - worker.postMessage(data) — отправка данных воркеру
//   - parentPort.postMessage(data) — ответ из воркера
//   - workerData — начальные данные при создании
//   - isMainThread — проверка, главный ли это поток
//   - В отличие от child_process: общее адресное пространство, дешевле
//
// TODO: Study worker_threads — threads in Node.js:
//   - new Worker, postMessage, parentPort, workerData, isMainThread
//   - Unlike child_process: shared address space, cheaper

export function Task8_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Basic Worker ===')
    log.push('')

    // TODO: Смоделируйте Worker thread в памяти:
    //   class MockWorker {
    //     postMessage(data) — отправка сообщения "воркеру"
    //     on('message', cb) — получение ответа
    //     on('error', cb) — ошибка в воркере
    //     on('exit', cb) — завершение
    //     terminate() — принудительное завершение
    //   }
    //   Воркер выполняет CPU-intensive задачу (вычисление простых чисел)
    // TODO: Simulate a Worker thread in memory

    log.push('Worker creation & messaging:')
    log.push('  ... создайте воркер и обменяйтесь сообщениями')
    log.push('')

    // TODO: Реализуйте вычисление в "воркере":
    //   Задача: найти все простые числа до N
    //   Main thread отправляет { type: 'compute', n: 10000 }
    //   Worker возвращает { type: 'result', primes: [...], duration: ms }
    // TODO: Implement computation in "worker":
    //   Task: find all primes up to N

    log.push('Prime computation:')
    log.push('  ... вычислите простые числа в воркере')
    log.push('')

    // TODO: Покажите разницу между worker_threads и child_process:
    //   Таблица: память, IPC, данные, использование
    // TODO: Compare worker_threads vs child_process
    log.push('worker_threads vs child_process:')
    log.push('  ... создайте таблицу сравнения')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.1: Basic Worker</h2>
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
