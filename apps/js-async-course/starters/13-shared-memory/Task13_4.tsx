import { useState, useRef, useCallback, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 13.4: Mutex на Atomics
// Task 13.4: Mutex via Atomics
// ============================================
// Spinlock Mutex через Atomics.compareExchange.
// Два Worker'а борются за критическую секцию (общий счётчик).
//
// Spinlock Mutex via Atomics.compareExchange.
// Two Workers compete for the critical section (shared counter).

// -----------------------------------------------
// Worker code with optional mutex
// -----------------------------------------------
// Worker должен:
// Worker should:
//   1. Получить lockBuf, counterBuf, id, iterations, useMutex
//      Receive lockBuf, counterBuf, id, iterations, useMutex
//
//   2. Определить UNLOCKED = 0, LOCKED = 1
//      Define UNLOCKED = 0, LOCKED = 1
//
//   3. acquireLock():
//      // Spinloop — ждём пока lock !== UNLOCKED
//      while (Atomics.compareExchange(lock, 0, UNLOCKED, LOCKED) !== UNLOCKED) {}
//
//   4. releaseLock():
//      Atomics.store(lock, 0, UNLOCKED)
//      Atomics.notify(lock, 0, 1)
//
//   5. Для каждой итерации:
//      For each iteration:
//      a. Записать время начала ожидания (Date.now() - start)
//         Record wait start time
//      b. if (useMutex) acquireLock()
//         if (useMutex) acquireLock()
//      c. Записать время захвата лока
//         Record lock acquire time
//      d. Критическая секция: var val = counter[0]; busy wait ~2мс; counter[0] = val + 1
//         Critical section: var val = counter[0]; busy wait ~2ms; counter[0] = val + 1
//      e. Записать время освобождения лока
//         Record lock release time
//      f. if (useMutex) releaseLock()
//         if (useMutex) releaseLock()
//      g. Сохранить в timeline: { iter, waitStart, lockStart, lockEnd }
//         Save to timeline: { iter, waitStart, lockStart, lockEnd }
//
//   6. postMessage({ type: 'done', id, timeline, finalVal: counter[0] })
//      postMessage({ type: 'done', id, timeline, finalVal: counter[0] })
//
// const WORKER_MUTEX = `...`

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface TimelineSegment {
  workerId: number
  iter: number
  waitStart: number
  lockStart: number   // время начала критической секции
  lockEnd: number     // время конца критической секции
}

export function Task13_4() {
  const { t } = useLanguage()

  // TODO: Использовать ли mutex
  // TODO: Whether to use mutex
  // const [useMutex, setUseMutex] = useState(true)

  // TODO: Идёт ли выполнение
  // TODO: Is experiment running
  // const [isRunning, setIsRunning] = useState(false)

  // TODO: Timeline сегменты для визуализации
  // TODO: Timeline segments for visualization
  // const [timeline, setTimeline] = useState<TimelineSegment[]>([])

  // TODO: Итоговое значение счётчика
  // TODO: Final counter value
  // const [finalValue, setFinalValue] = useState<number | null>(null)

  // TODO: Лог сообщений
  // TODO: Log messages
  // const [logs, setLogs] = useState<string[]>([])

  // TODO: ref для Worker'ов
  // TODO: ref for Workers
  // const workersRef = useRef<Worker[]>([])

  // TODO: useEffect — cleanup
  // TODO: useEffect — cleanup

  // -----------------------------------------------
  // TODO: Реализуйте runDemo()
  // TODO: Implement runDemo()
  // -----------------------------------------------
  // 1. Создать lockBuf (Int32Array[1], lockArr[0] = 0) и counterBuf (Int32Array[1])
  //    Create lockBuf (Int32Array[1], lockArr[0] = 0) and counterBuf (Int32Array[1])
  // 2. Создать 2 Worker'а из WORKER_MUTEX
  //    Create 2 Workers from WORKER_MUTEX
  // 3. Каждый Worker получает: { lockBuf, counterBuf, id: 0|1, iterations: 8, useMutex }
  //    Each Worker receives: { lockBuf, counterBuf, id: 0|1, iterations: 8, useMutex }
  // 4. worker.onmessage: при 'done' собрать timeline сегменты, прочитать counter[0]
  //    worker.onmessage: on 'done' collect timeline segments, read counter[0]
  // 5. Когда оба ответили: setTimeline(all segments), setFinalValue(counter[0])
  //    When both responded: setTimeline(all segments), setFinalValue(counter[0])
  //
  // Для Timeline: преобразовать массив { iter, waitStart, lockStart, lockEnd } от Worker'а
  // в TimelineSegment[] (добавить workerId)

  // -----------------------------------------------
  // TODO: Вычислите overlaps (только без mutex)
  // TODO: Compute overlaps (only without mutex)
  // -----------------------------------------------
  // Два сегмента A и B пересекаются, если:
  //   A.lockStart < B.lockEnd && B.lockStart < A.lockEnd && A.workerId !== B.workerId
  // Two segments A and B overlap if:
  //   A.lockStart < B.lockEnd && B.lockStart < A.lockEnd && A.workerId !== B.workerId

  return (
    <div className="exercise-container">
      <h2>{t('task.13.4')}</h2>

      {/* TODO: Вкладки "С Mutex / Без Mutex" */}
      {/* TODO: Tabs "With Mutex / Without Mutex" */}

      {/* TODO: Объяснение выбранного режима */}
      {/* TODO: Explanation for selected mode */}

      {/* TODO: Сниппет кода — acquireLock через compareExchange */}
      {/* TODO: Code snippet — acquireLock via compareExchange */}

      {/* TODO: Timeline визуализация */}
      {/* TODO: Timeline visualization */}
      {/* Для каждого Worker'а (0 и 1): горизонтальная полоса с прямоугольниками */}
      {/* For each Worker (0 and 1): horizontal bar with rectangles */}
      {/* Прямоугольник: left% = lockStart/maxTime*100, width% = (lockEnd-lockStart)/maxTime*100 */}
      {/* Rectangle: left% = lockStart/maxTime*100, width% = (lockEnd-lockStart)/maxTime*100 */}
      {/* Красный если есть пересечение с другим Worker'ом */}
      {/* Red if overlap with another Worker */}

      {/* TODO: Итоговый счётчик (зелёный = 16, красный = меньше) */}
      {/* TODO: Final counter (green = 16, red = less) */}

      {/* TODO: Лог сообщений */}
      {/* TODO: Log messages */}

      {/* TODO: Кнопка "Запустить эксперимент" */}
      {/* TODO: Button "Run experiment" */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте Mutex через Atomics.compareExchange
      </div>
    </div>
  )
}
