import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.4: Worker Pool
// Task 12.4: Worker Pool
// ============================================
// Реализуйте паттерн Worker Pool: N воркеров обрабатывают очередь
// из 20 задач разной сложности. Воркер, завершив задачу, немедленно
// берёт следующую из очереди.
//
// Implement the Worker Pool pattern: N workers process a queue of
// 20 tasks with different complexities. A worker, after finishing a task,
// immediately picks the next one from the queue.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface WorkerTask {
  id: number
  complexity: number  // 1–5 условная сложность / 1–5 relative complexity
  status: 'pending' | 'running' | 'done'
  workerId?: number   // Какой воркер выполняет / Which worker is running it
  elapsed?: number    // Время выполнения мс / Execution time ms
}

interface WorkerSlot {
  id: number
  busy: boolean
  currentTask?: number  // ID текущей задачи / Current task ID
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// TODO: Код воркера, имитирующего CPU-bound работу
// TODO: Worker code simulating CPU-bound work
// Воркер должен:
//   - Получить { taskId, complexity }
//   - Выполнить iterations = complexity * N вычислений
//   - Отправить { taskId } обратно
//
// const POOL_WORKER_CODE = `
//   self.onmessage = function(e) {
//     var taskId = e.data.taskId
//     var complexity = e.data.complexity
//     var iterations = complexity * 2000000
//     var dummy = 0
//     for (var i = 0; i < iterations; i++) { dummy += i }
//     self.postMessage({ taskId: taskId })
//   }
// `

// TODO: Функция createTasks() — создаёт 20 задач с разной сложностью
// TODO: Function createTasks() — creates 20 tasks with different complexities
// const complexities = [2, 4, 1, 5, 3, 2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 4, 2]
// function createTasks(): WorkerTask[] { ... }

export function Task12_4() {
  const { t } = useLanguage()

  // TODO: Размер пула (слайдер 1–8)
  // TODO: Pool size (slider 1–8)
  // const [poolSize, setPoolSize] = useState(4)

  // TODO: Задачи, слоты воркеров, запущено ли, время, счётчик завершённых
  // TODO: Tasks, worker slots, running state, elapsed time, done count
  // const [tasks, setTasks] = useState<WorkerTask[]>(createTasks())
  // const [slots, setSlots] = useState<WorkerSlot[]>([])
  // const [isRunning, setIsRunning] = useState(false)
  // const [totalElapsed, setTotalElapsed] = useState<number | null>(null)
  // const [completedCount, setCompletedCount] = useState(0)

  // TODO: Refs для воркеров, очереди, счётчиков
  // TODO: Refs for workers, queue, counters
  // const workersRef = useRef<Worker[]>([])
  // const taskQueueRef = useRef<WorkerTask[]>([])
  // const startTimeRef = useRef<number>(0)
  // const completedRef = useRef<number>(0)
  // const totalTasksRef = useRef<number>(0)

  // -----------------------------------------------
  // TODO: Реализуйте dispatchNext(workerId)
  // TODO: Implement dispatchNext(workerId)
  // -----------------------------------------------
  // Если очередь пуста:
  //   - Обновить слот: busy=false, currentTask=undefined
  //   - Если completedRef.current >= totalTasksRef.current:
  //     setTotalElapsed, setIsRunning(false)
  // Иначе:
  //   - Взять задачу из очереди (shift)
  //   - Обновить задачу: status='running', workerId
  //   - Обновить слот: busy=true, currentTask=task.id
  //   - worker.onmessage = (e) => {
  //       completedRef.current++
  //       setCompletedCount(...)
  //       Обновить задачу: status='done', elapsed
  //       dispatchNext(workerId)
  //     }
  //   - worker.postMessage({ taskId: task.id, complexity: task.complexity })

  // -----------------------------------------------
  // TODO: Реализуйте handleStart()
  // TODO: Implement handleStart()
  // -----------------------------------------------
  // 1. Создать свежие задачи createTasks()
  // 2. Создать слоты: Array.from({ length: poolSize }, ...)
  // 3. Завершить старые воркеры (workersRef.current.forEach terminate)
  // 4. Создать новые воркеры через Blob URL
  // 5. startTimeRef.current = performance.now()
  // 6. Запустить dispatchNext для каждого воркера

  // -----------------------------------------------
  // TODO: Реализуйте handleReset()
  // TODO: Implement handleReset()
  // -----------------------------------------------
  // Terminate все воркеры, сбросить все состояния

  // TODO: useEffect cleanup — terminate воркеры при размонтировании

  return (
    <div className="exercise-container">
      <h2>{t('task.12.4')}</h2>

      {/* TODO: Слайдер размера пула (1–8) с отображением navigator.hardwareConcurrency */}
      {/* TODO: Pool size slider (1–8) showing navigator.hardwareConcurrency */}

      {/* TODO: Слоты воркеров — N блоков, каждый показывает "простаивает" или задачу */}
      {/* TODO: Worker slots — N blocks, each showing "idle" or current task */}
      {/* Цветовые квадратики сложности (1=зелёный, 5=фиолетовый) */}
      {/* Complexity colored squares (1=green, 5=purple) */}

      {/* TODO: Сетка из 20 карточек задач */}
      {/* TODO: Grid of 20 task cards */}
      {/* pending → серая, running → синяя, done → зелёная с временем */}
      {/* pending → grey, running → blue, done → green with elapsed time */}

      {/* TODO: Счётчики: В очереди / Выполняется / Готово */}
      {/* TODO: Counters: Queued / Running / Done */}

      {/* TODO: Итоговое время + подсказка (оптимально/добавь воркеров/слишком много) */}
      {/* TODO: Total time + hint (optimal/add workers/too many) */}

      {/* TODO: Кнопки "Запустить пул" и "Сброс" */}
      {/* TODO: Buttons "Start pool" and "Reset" */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте паттерн Worker Pool
      </div>
    </div>
  )
}
