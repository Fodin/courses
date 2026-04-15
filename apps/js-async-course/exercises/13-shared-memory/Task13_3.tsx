import { useState, useRef, useCallback, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 13.3: Atomics.waitAsync / notify
// Task 13.3: Atomics.waitAsync / notify
// ============================================
// Producer-Consumer паттерн через разделяемую память.
// Producer пишет данные и вызывает notify, Consumer ждёт через waitAsync.
//
// Producer-Consumer pattern via shared memory.
// Producer writes data and calls notify, Consumer waits via waitAsync.

// -----------------------------------------------
// Producer Worker code
// -----------------------------------------------
// Producer должен:
// Producer should:
//   1. Получить sab, flagBuf, iterations
//      Receive sab, flagBuf, iterations
//   2. Для каждой итерации i:
//      For each iteration i:
//      a. Записать данные: arr[0..3] = [i*10, i*10+1, i*10+2, i*10+3]
//         Write data: arr[0..3] = [i*10, i*10+1, i*10+2, i*10+3]
//      b. Atomics.store(flag, 1, i)     — записать номер итерации
//         Atomics.store(flag, 1, i)     — write iteration number
//      c. Atomics.store(flag, 0, 1)     — поднять флаг
//         Atomics.store(flag, 0, 1)     — raise the flag
//      d. Atomics.notify(flag, 0, 1)    — разбудить Consumer
//         Atomics.notify(flag, 0, 1)    — wake Consumer
//      e. postMessage({ type: 'produced', iteration: i, data: [...] })
//         postMessage({ type: 'produced', iteration: i, data: [...] })
//      f. setTimeout 300мс до следующей итерации
//         setTimeout 300ms before next iteration
//   3. postMessage({ type: 'done' }) в конце
//      postMessage({ type: 'done' }) at the end
//
// const WORKER_PRODUCER = `...`

// -----------------------------------------------
// Consumer Worker code
// -----------------------------------------------
// Consumer должен:
// Consumer should:
//   1. Получить sab, flagBuf, iterations
//      Receive sab, flagBuf, iterations
//   2. Ждать данные через Atomics.waitAsync:
//      Wait for data via Atomics.waitAsync:
//
//      var result = Atomics.waitAsync(flag, 0, 0)  // ждём пока flag[0] !== 0
//      if (result.value === 'not-equal') {
//        // значение уже изменилось — читаем немедленно
//        consumeData()
//      } else {
//        result.value.then(function(outcome) {
//          if (outcome === 'ok') consumeData()
//          else waitForData() // timeout или другой случай
//        })
//      }
//
//   3. consumeData():
//      a. Прочитать данные arr[0..3]
//         Read data arr[0..3]
//      b. Atomics.store(flag, 0, 0) — сбросить флаг
//         Atomics.store(flag, 0, 0) — reset flag
//      c. postMessage({ type: 'consumed', iteration, data })
//         postMessage({ type: 'consumed', iteration, data })
//      d. Продолжить ожидание (если не все итерации consumed)
//         Continue waiting (if not all iterations consumed)
//
// const WORKER_CONSUMER = `...`

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface ProdConsEvent {
  side: 'producer' | 'consumer'
  text: string
  iteration?: number
}

export function Task13_3() {
  const { t } = useLanguage()

  // TODO: Состояние — идёт ли демонстрация
  // TODO: State — is demo running
  // const [isRunning, setIsRunning] = useState(false)

  // TODO: Список событий (лог Producer/Consumer)
  // TODO: List of events (Producer/Consumer log)
  // const [events, setEvents] = useState<ProdConsEvent[]>([])

  // TODO: Текущее состояние буфера (4 числа)
  // TODO: Current buffer state (4 numbers)
  // const [buffer, setBuffer] = useState<number[]>([0, 0, 0, 0])

  // TODO: Счётчики произведённых и потреблённых
  // TODO: Produced and consumed counters
  // const [producedCount, setProducedCount] = useState(0)
  // const [consumedCount, setConsumedCount] = useState(0)

  // TODO: Подсветка буфера ('none' | 'write' | 'read')
  // TODO: Buffer highlight state ('none' | 'write' | 'read')
  // const [bufferHighlight, setBufferHighlight] = useState<'none' | 'write' | 'read'>('none')

  // TODO: refs для Producer и Consumer Worker'ов
  // TODO: refs for Producer and Consumer Workers
  // const prodRef = useRef<Worker | null>(null)
  // const consRef = useRef<Worker | null>(null)

  // TODO: useEffect — cleanup при размонтировании
  // TODO: useEffect — cleanup on unmount

  // -----------------------------------------------
  // TODO: Реализуйте runDemo()
  // TODO: Implement runDemo()
  // -----------------------------------------------
  // 1. Создать два SharedArrayBuffer:
  //    - sab: SharedArrayBuffer(4 * 4) — 4 Int32 для данных
  //    - flagBuf: SharedArrayBuffer(2 * 4) — [ready_flag, iteration_number]
  // 2. Создать Producer и Consumer Worker'ов
  // 3. Подключить обработчики onmessage:
  //    - Producer 'produced': setBuffer, setProducedCount, addEvent, подсветить 'write'
  //    - Consumer 'consumed': setConsumedCount, addEvent, подсветить 'read'
  //    - При 'done' от обоих: setIsRunning(false)
  // 4. Отправить сообщения: worker.postMessage({ sab, flagBuf, iterations: 6 })
  // 5. setIsRunning(true)

  return (
    <div className="exercise-container">
      <h2>{t('task.13.3')}</h2>

      {/* TODO: Три колонки: Producer | Буфер | Consumer */}
      {/* TODO: Three columns: Producer | Buffer | Consumer */}

      {/* TODO: Producer колонка — название, описание шагов, счётчик N/6 */}
      {/* TODO: Producer column — title, step description, counter N/6 */}

      {/* TODO: Буфер — 4 ячейки, подсветка при write (синий) и read (зелёный) */}
      {/* TODO: Buffer — 4 cells, highlight on write (blue) and read (green) */}

      {/* TODO: Consumer колонка — название, описание ожидания, счётчик N/6 */}
      {/* TODO: Consumer column — title, wait description, counter N/6 */}

      {/* TODO: Лог событий — Producer синим, Consumer зелёным, с отступом */}
      {/* TODO: Event log — Producer in blue, Consumer in green, with indent */}

      {/* TODO: Кнопка "Запустить демонстрацию" */}
      {/* TODO: Button "Run demonstration" */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте Producer-Consumer через Atomics.waitAsync
      </div>
    </div>
  )
}
