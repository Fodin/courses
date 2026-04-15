// ============================================
// Шпаргалка: Паттерны async/await
// Cheat Sheet: Async/Await Patterns
// ============================================
// Используйте как справочник при выполнении заданий 7.1-7.5
// Use as a reference when completing tasks 7.1-7.5

// -----------------------------------------------
// 1. RETRY с exponential backoff
// -----------------------------------------------

async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    baseDelay?: number
    factor?: number
    jitter?: boolean
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 300, factor = 2, jitter = false } = options

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries) throw error

      let delay = baseDelay * Math.pow(factor, i)
      if (jitter) delay = delay * (0.5 + Math.random() * 0.5)
      await new Promise((r) => setTimeout(r, Math.round(delay)))
    }
  }
  throw new Error('Unreachable') // TypeScript requires this
}

// Вычисление задержки для попытки i:
// Calculating delay for attempt i:
// delay = baseDelay * factor^i
// С jitter: delay = delay * (0.5 + random * 0.5)

// -----------------------------------------------
// 2. ASYNC POOL — N воркеров
// -----------------------------------------------

async function asyncPool<T>(
  concurrency: number,
  tasks: Array<() => Promise<T>>,
  onUpdate?: (index: number, status: 'running' | 'done', slot: number) => void
): Promise<T[]> {
  const results: T[] = []
  let index = 0

  async function worker(slot: number): Promise<void> {
    while (index < tasks.length) {
      const i = index++
      onUpdate?.(i, 'running', slot)
      results[i] = await tasks[i]()
      onUpdate?.(i, 'done', slot)
    }
  }

  await Promise.all(Array.from({ length: concurrency }, (_, slot) => worker(slot)))
  return results
}

// -----------------------------------------------
// 3. DEBOUNCE — ждёт паузы
// -----------------------------------------------

function debounce<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: T): void => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// В React-компоненте — используйте useRef чтобы таймер не сбрасывался при ре-рендере:
// In React — use useRef so the timer persists across re-renders:
// const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
// const debouncedFn = useCallback((...args) => {
//   if (timerRef.current) clearTimeout(timerRef.current)
//   timerRef.current = setTimeout(() => fn(...args), delay)
// }, [fn, delay])

// -----------------------------------------------
// 4. THROTTLE — не чаще N раз в секунду
// -----------------------------------------------

function throttle<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
  let lastCall = 0

  return (...args: T): void => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}

// В React — useRef для lastCall:
// const lastRef = useRef<number>(0)
// const throttledFn = useCallback((...args) => {
//   const now = Date.now()
//   if (now - lastRef.current >= delay) {
//     lastRef.current = now
//     fn(...args)
//   }
// }, [fn, delay])

// -----------------------------------------------
// 5. ASYNC MUTEX — исключительный доступ
// -----------------------------------------------

class AsyncMutex {
  private queue: Array<() => void> = []
  private locked = false

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true
      return
    }
    return new Promise<void>((resolve) => {
      this.queue.push(resolve)
    })
  }

  release(): void {
    const next = this.queue.shift()
    if (next) {
      next()               // Передаём блокировку следующему / Pass lock to next
    } else {
      this.locked = false  // Никто не ждёт — просто разблокируем / Nobody waiting — just unlock
    }
  }

  async withLock<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire()
    try {
      return await fn()
    } finally {
      this.release()       // Всегда освобождаем, даже при ошибке / Always release, even on error
    }
  }
}

// Использование / Usage:
// const mutex = new AsyncMutex()
//
// async function safeIncrement(counter: { value: number }) {
//   await mutex.withLock(async () => {
//     const current = counter.value   // read
//     await delay(10)                  // simulate async work
//     counter.value = current + 1     // write — no race condition!
//   })
// }

// -----------------------------------------------
// 6. CIRCUIT BREAKER — автомат состояний
// -----------------------------------------------

// type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'
//
// CLOSED → OPEN:     при N ошибок подряд (failureThreshold)
// OPEN → HALF_OPEN:  через resetTimeout мс
// HALF_OPEN → CLOSED: если пробный запрос успешен
// HALF_OPEN → OPEN:   если пробный запрос провалился
//
// Ключевые refs в React:
// const stateRef = useRef<CircuitState>('CLOSED')
// const failuresRef = useRef(0)
// const openTimeRef = useRef(0)
//
// ВАЖНО: useRef не вызывает ре-рендер!
// IMPORTANT: useRef does not trigger re-render!
// Для обновления UI: setCbState(stateRef.current) после каждого изменения ref

// -----------------------------------------------
// Полезные утилиты / Useful utilities
// -----------------------------------------------

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// Пример из задания 7.4 — почему нужен mutex:
// Example from task 7.4 — why mutex is needed:
//
// let counter = 0
//
// // БЕЗ mutex (ПЛОХО): / WITHOUT mutex (BAD):
// async function incrementUnsafe() {
//   const read = counter           // A читает 0
//   await delay(25)                // B тоже читает 0 в это время!
//   counter = read + 1             // A пишет 1, B пишет 1 — потеря!
// }
//
// // С mutex (ХОРОШО): / WITH mutex (GOOD):
// const mutex = new AsyncMutex()
// async function incrementSafe() {
//   await mutex.withLock(async () => {
//     const read = counter         // только один процесс здесь
//     await delay(25)
//     counter = read + 1           // гарантированно корректно
//   })
// }

export {}
