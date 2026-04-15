import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.3: Замыкания — createCounter и createRateLimiter
// Task 2.3: Closures — createCounter and createRateLimiter
// ============================================

// ---- Часть 1 / Part 1 ----

// TODO: Определите интерфейс Counter
// TODO: Define the Counter interface
// interface Counter {
//   increment: () => void
//   decrement: () => void
//   reset: () => void
//   getCount: () => number
// }

// TODO: Реализуйте createCounter
// TODO: Implement createCounter
// function createCounter(initial: number): Counter {
//   let count = initial   // приватная переменная через замыкание / private via closure
//
//   return {
//     increment: () => { count++ },
//     decrement: () => { count-- },
//     reset:     () => { count = initial },
//     getCount:  () => count,
//   }
// }

// ---- Часть 2 / Part 2 ----

// TODO: Реализуйте createRateLimiter
// TODO: Implement createRateLimiter
// Функция принимает maxCalls и windowMs, возвращает HOF
// Function takes maxCalls and windowMs, returns HOF
//
// function createRateLimiter(maxCalls: number, windowMs: number) {
//   return function<T>(fn: () => T) {
//     const calls: number[] = []  // приватный массив в замыкании / private via closure
//
//     return {
//       call: () => {
//         const now = Date.now()
//         // TODO: Удалите старые метки вышедшие за окно windowMs
//         // TODO: Remove stale timestamps outside the windowMs window
//
//         // TODO: Если calls.length < maxCalls — добавьте текущий ts и верните { result: fn(), allowed: true }
//         // TODO: If calls.length < maxCalls — push current ts and return { result: fn(), allowed: true }
//
//         // TODO: Иначе верните { result: null, allowed: false }
//         // TODO: Otherwise return { result: null, allowed: false }
//       },
//     }
//   }
// }

export function Task2_3() {
  const { t } = useLanguage()

  // ---- Часть 1: два экземпляра счётчика / Part 1: two counter instances ----

  // TODO: Создайте два экземпляра counter через useState
  // TODO: Create two counter instances via useState
  // const [counterA] = useState(() => createCounter(0))
  // const [counterACount, setCounterACount] = useState(0)
  //
  // const [counterB] = useState(() => createCounter(10))
  // const [counterBCount, setCounterBCount] = useState(10)

  // ---- Часть 2: rate limiter / Part 2: rate limiter ----

  // TODO: Состояние для настроек лимитера
  // TODO: State for limiter settings
  // const [maxCalls, setMaxCalls] = useState(3)
  // const [windowMs, setWindowMs] = useState(2000)

  // TODO: Состояние для лога вызовов
  // TODO: State for call log
  // const [callLog, setCallLog] = useState<Array<{ ts: number; allowed: boolean }>>([])

  // TODO: Экземпляр лимитера через useState
  // TODO: Limiter instance via useState
  // const [limiter, setLimiter] = useState(() =>
  //   createRateLimiter(3, 2000)(() => 'API response')
  // )

  // TODO: Функция выполнения API-вызова
  // TODO: API call function
  // const doApiCall = () => {
  //   const { allowed } = limiter.call()
  //   setCallLog(prev => [...prev.slice(-19), { ts: Date.now(), allowed }])
  // }

  // TODO: При изменении настроек создайте новый лимитер и сбросьте лог
  // TODO: On settings change create new limiter and reset log

  return (
    <div className="exercise-container">
      <h2>{t('task.2.3')}</h2>

      {/* ---- Часть 1 / Part 1 ---- */}

      {/* TODO: Два счётчика рядом */}
      {/* TODO: Two counters side by side */}
      {/* Для каждого: метка, большое число, кнопки +, -, Reset */}
      {/* For each: label, large number, buttons +, -, Reset */}
      {/* Убедитесь что изменение одного не меняет другой */}
      {/* Ensure changing one doesn't affect the other */}

      {/* TODO: Показать код createCounter с пояснением замыкания */}
      {/* TODO: Show createCounter code with closure explanation */}

      {/* ---- Часть 2 / Part 2 ---- */}

      {/* TODO: Ползунки для maxCalls (1-10) и windowMs (1000-5000) */}
      {/* TODO: Sliders for maxCalls (1-10) and windowMs (1000-5000) */}

      {/* TODO: Кнопка "API Call" */}
      {/* TODO: "API Call" button */}

      {/* TODO: Лог вызовов с PASS/BLOCK и таймстампами */}
      {/* TODO: Call log with PASS/BLOCK and timestamps */}

      {/* TODO: Показать код createRateLimiter с пояснением замыкания */}
      {/* TODO: Show createRateLimiter code with closure explanation */}
    </div>
  )
}
