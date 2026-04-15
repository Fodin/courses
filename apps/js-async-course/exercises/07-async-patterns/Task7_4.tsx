import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.4: Async Mutex
// Task 7.4: Async Mutex
// ============================================
// Реализуйте AsyncMutex — класс для защиты общего состояния
// от race condition в конкурентном async-коде.
// Implement AsyncMutex — a class to protect shared state
// from race conditions in concurrent async code.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface MutexLogEntry {
  process: 'A' | 'B'
  action: string
  counter: number         // Значение счётчика в момент события / Counter value at the time
  conflict: boolean       // Обнаружена гонка / Race condition detected
  time: number            // Мс от старта / Ms from start
}

// -----------------------------------------------
// TODO: Реализуйте класс AsyncMutex
// TODO: Implement AsyncMutex class
// -----------------------------------------------
// Поля / Fields:
//   private queue: Array<() => void> = []
//   private locked = false
//
// Метод acquire(): Promise<void>
//   Если locked === false: установить locked = true, вернуть резолвенный промис
//   Иначе: вернуть новый Promise, добавив resolve в queue
//
// Метод release(): void
//   Если queue.length > 0: взять первый из очереди (shift), вызвать его (он резолвит ожидающий acquire)
//   Иначе: установить locked = false
//
// Метод withLock<T>(fn: () => Promise<T>): Promise<T>
//   await this.acquire()
//   try { return await fn() } finally { this.release() }
//
// class AsyncMutex { ... }

export function Task7_4() {
  const { t } = useLanguage()

  const [useMutex, setUseMutex] = useState(false)
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState<MutexLogEntry[]>([])
  const [finalCounter, setFinalCounter] = useState<number | null>(null)

  const handleRun = async () => {
    setRunning(true)
    setLog([])
    setFinalCounter(null)

    let counter = 0
    const entries: MutexLogEntry[] = []
    const startTime = Date.now()

    // TODO: Создайте экземпляр AsyncMutex если useMutex === true
    // TODO: Create AsyncMutex instance if useMutex === true
    // const mutex = new AsyncMutex()

    const addEntry = (process: 'A' | 'B', action: string, currentCounter: number, conflict = false) => {
      entries.push({ process, action, counter: currentCounter, conflict, time: Date.now() - startTime })
      setLog([...entries])
    }

    const runProcess = async (name: 'A' | 'B', iterations: number) => {
      for (let i = 0; i < iterations; i++) {
        if (useMutex) {
          // TODO: Используйте mutex.withLock для атомарного read-delay-write
          // TODO: Use mutex.withLock for atomic read-delay-write
          // await mutex.withLock(async () => {
          //   const read = counter
          //   addEntry(name, `read: ${read}`, read)
          //   await new Promise(r => setTimeout(r, 20 + Math.random() * 30))
          //   counter = read + 1
          //   addEntry(name, `write: ${counter}`, counter)
          // })
        } else {
          // TODO: Реализуйте без mutex — read, delay, write (покажет race condition)
          // TODO: Implement without mutex — read, delay, write (will show race condition)
          // const read = counter
          // addEntry(name, `read: ${read}`, read)
          // await new Promise(r => setTimeout(r, 20 + Math.random() * 30))
          // const conflict = counter !== read
          // counter = read + 1
          // addEntry(name, `write: ${counter}${conflict ? ' (КОНФЛИКТ!)' : ''}`, counter, conflict)
        }
      }
    }

    await Promise.all([
      runProcess('A', 5),
      runProcess('B', 5),
    ])

    setFinalCounter(counter)
    setRunning(false)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.7.4')}</h2>

      {/* TODO: Объяснение режима (с mutex / без) */}
      {/* TODO: Mode explanation (with mutex / without) */}

      {/* TODO: Переключатель Mutex ON/OFF */}
      {/* TODO: Mutex toggle ON/OFF */}

      {/* TODO: Сниппет кода демонстрирующий разницу */}
      {/* TODO: Code snippet showing the difference */}

      {/* TODO: Лог операций — процесс, действие, значение, конфликт */}
      {/* TODO: Operations log — process, action, value, conflict */}

      {/* TODO: Итоговый результат: counter === 10 → успех, иначе ошибка */}
      {/* TODO: Final result: counter === 10 → success, otherwise error */}

      {/* TODO: Кнопка запуска */}
      {/* TODO: Run button */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте AsyncMutex для защиты от race condition
      </div>
    </div>
  )
}
