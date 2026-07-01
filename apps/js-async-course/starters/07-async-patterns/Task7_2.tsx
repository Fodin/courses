import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.2: Async Pool
// Task 7.2: Async Pool
// ============================================
// Реализуйте функцию asyncPool, которая выполняет задачи параллельно,
// но не более concurrency задач одновременно.
// Implement asyncPool that runs tasks in parallel
// with at most 'concurrency' tasks running at the same time.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface PoolTask {
  id: number
  duration: number
  status: 'queued' | 'running' | 'done'
  slot: number            // Индекс слота воркера (-1 если в очереди) / Worker slot index (-1 if queued)
  startTime: number
  endTime: number
}

// -----------------------------------------------
// TODO: Реализуйте функцию asyncPool
// TODO: Implement asyncPool function
// -----------------------------------------------
// Подходы (выберите один):
// Approaches (choose one):
//
// Подход 1 — N воркеров в цикле:
// Approach 1 — N workers in loop:
//   async function worker(slot: number): Promise<void> {
//     while (index < tasks.length) {
//       const i = index++
//       onUpdate(i, 'running', slot)
//       await tasks[i]()
//       onUpdate(i, 'done', slot)
//     }
//   }
//   await Promise.all(Array.from({ length: concurrency }, (_, i) => worker(i)))
//
// Подход 2 — Promise.race на множестве активных промисов:
// Approach 2 — Promise.race on active promises set:
//   const executing = new Set<Promise<unknown>>()
//   for (const task of tasks) {
//     const p = task().then(() => executing.delete(p))
//     executing.add(p)
//     if (executing.size >= concurrency) await Promise.race(executing)
//   }
//   await Promise.all(executing)
//
// async function asyncPool<T>(
//   concurrency: number,
//   tasks: Array<() => Promise<T>>,
//   onUpdate: (id: number, status: 'running' | 'done', slot: number) => void
// ): Promise<T[]> { ... }

// Длительности задач (мс) / Task durations (ms)
const TASK_DURATIONS = [400, 800, 600, 1200, 300, 900, 500, 700, 1000, 400, 600, 800]

export function Task7_2() {
  const { t } = useLanguage()

  const [concurrency, setConcurrency] = useState(3)
  const [tasks, setTasks] = useState<PoolTask[]>([])
  const [running, setRunning] = useState(false)
  const [totalTime, setTotalTime] = useState<number | null>(null)
  const startRef = useRef<number>(0)

  // TODO: Реализуйте handleRun
  // TODO: Implement handleRun
  // 1. Создайте начальный массив tasks со статусом 'queued'
  // 2. Запустите asyncPool с соответствующими функциями-задачами
  // 3. В onUpdate обновляйте state tasks через setTasks
  // 4. Измерьте и сохраните общее время через setTotalTime

  const sequentialTime = TASK_DURATIONS.reduce((a, b) => a + b, 0)

  return (
    <div className="exercise-container">
      <h2>{t('task.7.2')}</h2>

      {/* TODO: Слайдер конкурентности N */}
      {/* TODO: Concurrency slider N */}

      {/* TODO: Визуализация слотов — N строк, в каждой задачи выполненные этим воркером */}
      {/* TODO: Slots visualization — N rows, each with tasks processed by that worker */}

      {/* TODO: Карточки всех задач с цветовым статусом */}
      {/* TODO: All task cards with color-coded status */}

      {/* TODO: Статистика: фактическое время, последовательное ({sequentialTime}ms), ускорение */}
      {/* TODO: Stats: actual time, sequential ({sequentialTime}ms), speedup ratio */}

      {/* TODO: Кнопка запуска */}
      {/* TODO: Run button */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте async pool с ограничением конкурентности
      </div>
    </div>
  )
}
