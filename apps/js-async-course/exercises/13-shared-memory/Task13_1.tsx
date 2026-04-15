import { useState, useRef, useCallback, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 13.1: Race Condition визуализатор
// Task 13.1: Race Condition Visualizer
// ============================================
// Два настоящих Worker'а соревнуются за одну ячейку SharedArrayBuffer.
// Покажите разницу между небезопасным доступом и Atomics.add.
//
// Two real Workers compete for one SharedArrayBuffer cell.
// Demonstrate the difference between unsafe access and Atomics.add.

// -----------------------------------------------
// Worker code strings (for Blob creation)
// -----------------------------------------------

// TODO: Код Worker'а БЕЗ Atomics (race condition)
// TODO: Worker code WITHOUT Atomics (race condition)
// Алгоритм:
//   for (var i = 0; i < iterations; i++) {
//     var val = arr[0]           // 1. read
//     busy wait ~1ms             // 2. wait (увеличивает вероятность конфликта)
//     arr[0] = val + 1           // 3. write (другой Worker мог уже написать!)
//   }
// const WORKER_RACE_NO_ATOMICS = `...`

// TODO: Код Worker'а С Atomics
// TODO: Worker code WITH Atomics
// Алгоритм:
//   for (var i = 0; i < iterations; i++) {
//     Atomics.add(arr, 0, 1)     // атомарный инкремент — неделимая операция
//   }
// const WORKER_RACE_WITH_ATOMICS = `...`

// -----------------------------------------------
// Helper: создать Worker из строки кода
// Helper: create Worker from code string
// -----------------------------------------------
// const blob = new Blob([code], { type: 'application/javascript' })
// const url = URL.createObjectURL(blob)
// const w = new Worker(url)
// URL.revokeObjectURL(url)
// return w

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface RunResult {
  finalValue: number
}

export function Task13_1() {
  const { t } = useLanguage()

  // TODO: Состояние — использовать ли Atomics
  // TODO: State — whether to use Atomics
  // const [useAtomics, setUseAtomics] = useState(false)

  // TODO: Состояние — идёт ли выполнение
  // TODO: State — is experiment running
  // const [isRunning, setIsRunning] = useState(false)

  // TODO: Массив результатов (5 запусков)
  // TODO: Array of run results (5 runs)
  // const [runs, setRuns] = useState<RunResult[]>([])

  // TODO: Лог сообщений
  // TODO: Log messages
  // const [logs, setLogs] = useState<string[]>([])

  // TODO: ref для хранения активных Worker'ов (для cleanup)
  // TODO: ref for active workers (for cleanup)
  // const workersRef = useRef<Worker[]>([])

  // TODO: useEffect — cleanup при размонтировании
  // TODO: useEffect — cleanup on unmount
  // useEffect(() => () => workersRef.current.forEach(w => w.terminate()), [])

  // -----------------------------------------------
  // TODO: Реализуйте runOnce(atomics, onDone)
  // TODO: Implement runOnce(atomics, onDone)
  // -----------------------------------------------
  // 1. Создать SharedArrayBuffer(4), Int32Array, установить arr[0] = 0
  // 2. Создать 2 Worker'а из нужного кода (atomics ? WITH : WITHOUT)
  // 3. Каждый Worker получает: { sab, id: 0|1, iterations: 50 }
  // 4. Когда оба Worker'а ответят (doneCount === 2) — вызвать onDone({ finalValue: arr[0] })
  // 5. terminate() оба Worker'а

  // -----------------------------------------------
  // TODO: Реализуйте runExperiment()
  // TODO: Implement runExperiment()
  // -----------------------------------------------
  // 1. setIsRunning(true), setRuns([]), setLogs([])
  // 2. Запустить 5 раз runOnce с паузой ~200мс между запусками
  // 3. После каждого запуска: добавить в лог и обновить runs
  // 4. setIsRunning(false) в конце

  return (
    <div className="exercise-container">
      <h2>{t('task.13.1')}</h2>

      {/* TODO: Вкладки "Без Atomics / С Atomics" */}
      {/* TODO: Tabs "Without Atomics / With Atomics" */}

      {/* TODO: Объяснение текущего режима */}
      {/* TODO: Explanation for current mode */}

      {/* TODO: Таблица результатов — 5 ячеек с finalValue и статусом */}
      {/* TODO: Results table — 5 cells with finalValue and status */}
      {/* Ожидаемое значение: 100 (2 Worker'а × 50 итераций) */}
      {/* Expected value: 100 (2 workers × 50 iterations) */}

      {/* TODO: Итоговый вывод — все корректно или есть race condition */}
      {/* TODO: Summary — all correct or race condition detected */}

      {/* TODO: Лог событий */}
      {/* TODO: Event log */}

      {/* TODO: Кнопки "Запустить 5 экспериментов" и "Очистить" */}
      {/* TODO: Buttons "Run 5 experiments" and "Clear" */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте Race Condition визуализатор
      </div>
    </div>
  )
}
