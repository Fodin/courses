import { useState, useRef, useEffect, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.3: Debounce и Throttle async
// Task 7.3: Async Debounce and Throttle
// ============================================
// Реализуйте debounce и throttle и примените к поисковому инпуту.
// Implement debounce and throttle and apply them to a search input.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

type Mode = 'debounce' | 'throttle'

interface CallEvent {
  id: number
  time: number            // Время от сброса (ms) / Time since reset (ms)
  type: 'press' | 'call' // Нажатие или реальный вызов / Key press or actual call
}

// -----------------------------------------------
// TODO: Реализуйте useDebounce
// TODO: Implement useDebounce
// -----------------------------------------------
// Использует useRef для хранения таймера
// Uses useRef to store the timer
// При каждом вызове: clearTimeout(timer), timer = setTimeout(fn, delay)
// On each call: clearTimeout(timer), timer = setTimeout(fn, delay)
//
// function useDebounce<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
//   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
//   return useCallback((...args: T) => {
//     if (timerRef.current) clearTimeout(timerRef.current)
//     timerRef.current = setTimeout(() => fn(...args), delay)
//   }, [fn, delay])
// }

// -----------------------------------------------
// TODO: Реализуйте useThrottle
// TODO: Implement useThrottle
// -----------------------------------------------
// Использует useRef для хранения времени последнего вызова
// Uses useRef to store the time of the last call
// При каждом вызове: если now - lastCall >= delay → вызвать fn, обновить lastCall
// On each call: if now - lastCall >= delay → call fn, update lastCall
//
// function useThrottle<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
//   const lastRef = useRef<number>(0)
//   return useCallback((...args: T) => {
//     const now = Date.now()
//     if (now - lastRef.current >= delay) {
//       lastRef.current = now
//       fn(...args)
//     }
//   }, [fn, delay])
// }

export function Task7_3() {
  const { t } = useLanguage()

  const [mode, setMode] = useState<Mode>('debounce')
  const [inputValue, setInputValue] = useState('')
  const [events, setEvents] = useState<CallEvent[]>([])
  const [pressCount, setPressCount] = useState(0)
  const [callCount, setCallCount] = useState(0)
  const startTimeRef = useRef<number>(Date.now())
  const eventIdRef = useRef(0)

  const resetAll = () => {
    setEvents([])
    setPressCount(0)
    setCallCount(0)
    startTimeRef.current = Date.now()
    eventIdRef.current = 0
    setInputValue('')
  }

  const addEvent = useCallback((type: 'press' | 'call') => {
    const ev: CallEvent = {
      id: eventIdRef.current++,
      time: Date.now() - startTimeRef.current,
      type,
    }
    setEvents((prev) => [...prev.slice(-40), ev])
    if (type === 'press') setPressCount((c) => c + 1)
    if (type === 'call') setCallCount((c) => c + 1)
  }, [])

  // TODO: Реализуйте simulateSearch — регистрирует событие 'call' если value.length > 0
  // TODO: Implement simulateSearch — registers a 'call' event if value.length > 0
  // const simulateSearch = useCallback((value: string) => { ... }, [addEvent])

  // TODO: Создайте debouncedSearch через useDebounce(simulateSearch, 300)
  // TODO: Create debouncedSearch via useDebounce(simulateSearch, 300)

  // TODO: Создайте throttledSearch через useThrottle(simulateSearch, 500)
  // TODO: Create throttledSearch via useThrottle(simulateSearch, 500)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    addEvent('press')
    // TODO: В зависимости от mode вызовите debouncedSearch или throttledSearch
    // TODO: Based on mode, call debouncedSearch or throttledSearch
  }

  useEffect(() => {
    resetAll()
  }, [mode])

  return (
    <div className="exercise-container">
      <h2>{t('task.7.3')}</h2>

      {/* TODO: Вкладки Debounce / Throttle */}
      {/* TODO: Debounce / Throttle tabs */}

      {/* TODO: Объяснение текущего режима */}
      {/* TODO: Current mode explanation */}

      {/* TODO: Инпут с обработчиком handleChange */}
      {/* TODO: Input with handleChange handler */}

      {/* TODO: Счётчики: нажатий, запросов, экономия % */}
      {/* TODO: Counters: presses, calls, savings % */}

      {/* TODO: Timeline — точки на горизонтальной оси */}
      {/* TODO: Timeline — dots on horizontal axis */}
      {/* Серые точки (снизу) = нажатия / Gray dots (bottom) = presses */}
      {/* Зелёные точки (выше) = запросы / Green dots (above) = calls */}

      {/* TODO: Кнопка сброса */}
      {/* TODO: Reset button */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте debounce и throttle
      </div>
    </div>
  )
}
