import { useState } from 'react'

// ============================================
// Задание 8.3: Worker Pool
// ============================================

// TODO: Реализуйте пул воркеров для параллельных вычислений:
//   - Создаёт N воркеров при инициализации
//   - Очередь задач: если все воркеры заняты, задача ждёт
//   - Автоматическое распределение задач по свободным воркерам
//   - Graceful shutdown: ждёт завершения текущих задач
//   - Обработка ошибок: перезапуск воркера при crash
//
// TODO: Implement a worker pool for parallel computation:
//   - Creates N workers at initialization
//   - Task queue: if all busy, task waits
//   - Automatic distribution to free workers
//   - Graceful shutdown, error handling with worker restart

export function Task8_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Worker Pool ===')
    log.push('')

    // TODO: Реализуйте класс WorkerPool:
    //   class WorkerPool {
    //     constructor(size: number)
    //     exec(task: TaskData): Promise<ResultData>
    //     getStats(): { busy: number, idle: number, queued: number }
    //     shutdown(): Promise<void>
    //   }
    //   Внутри: массив воркеров, очередь задач (FIFO),
    //   промисы для ожидающих результата
    // TODO: Implement WorkerPool class

    log.push('Pool creation (size=4):')
    log.push('  ... создайте пул из 4 воркеров')
    log.push('')

    // TODO: Отправьте 10 задач в пул из 4 воркеров:
    //   Покажите, как задачи распределяются и выполняются
    //   Выведите статистику после каждого завершения
    // TODO: Submit 10 tasks to pool of 4 workers
    //   Show distribution and stats after each completion

    log.push('Task execution (10 tasks, 4 workers):')
    log.push('  ... отправьте задачи и покажите распределение')
    log.push('')

    // TODO: Покажите обработку ошибки воркера:
    //   Если воркер падает, пул должен создать новый
    //   и передать задачу на выполнение
    // TODO: Show worker error handling and restart
    log.push('Worker crash recovery:')
    log.push('  ... покажите перезапуск воркера при ошибке')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.3: Worker Pool</h2>
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
