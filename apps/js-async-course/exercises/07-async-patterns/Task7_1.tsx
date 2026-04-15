import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.1: Retry с exponential backoff
// Task 7.1: Retry with exponential backoff
// ============================================
// Реализуйте функцию retry, которая повторяет async-операцию
// с экспоненциально растущими задержками между попытками.
// Implement a retry function that repeats an async operation
// with exponentially growing delays between attempts.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface RetryOptions {
  maxRetries: number      // Максимальное число повторных попыток / Max number of retries
  baseDelay: number       // Начальная задержка в ms / Initial delay in ms
  factor: number          // Множитель для backoff / Backoff multiplier
  jitter: boolean         // Добавить случайность / Add randomness
}

interface AttemptRecord {
  index: number
  status: 'pending' | 'success' | 'error' | 'waiting'
  delay: number           // Задержка перед следующей попыткой / Delay before next attempt
  timestamp: number
}

// -----------------------------------------------
// TODO: Реализуйте функцию simulateApi
// TODO: Implement simulateApi function
// -----------------------------------------------
// Принимает errorRate (0-100) — вероятность ошибки в процентах
// Accepts errorRate (0-100) — error probability in percent
// Возвращает промис, который через 150-300ms либо резолвится 'OK', либо отклоняется Error('Network error')
// Returns a promise that after 150-300ms either resolves 'OK' or rejects with Error('Network error')
//
// function simulateApi(errorRate: number): Promise<string> { ... }

// -----------------------------------------------
// TODO: Реализуйте функцию retry
// TODO: Implement retry function
// -----------------------------------------------
// Алгоритм:
// Algorithm:
//   Для i от 0 до maxRetries включительно:
//   For i from 0 to maxRetries inclusive:
//     1. Вызовите onAttempt({ index: i, status: 'pending', ... })
//     2. Попробуйте выполнить fn()
//     3. При успехе: onAttempt({ status: 'success' }), вернуть результат
//     4. При ошибке и i === maxRetries: onAttempt({ status: 'error' }), throw
//     5. При ошибке: onAttempt({ status: 'error' })
//        Вычислите delay = baseDelay * factor^i
//        Если jitter: delay = delay * (0.5 + Math.random() * 0.5)
//        Вызовите onAttempt({ status: 'waiting', delay, ... })
//        Подождите delay миллисекунд
//
// async function retry(
//   fn: () => Promise<string>,
//   options: RetryOptions,
//   onAttempt: (attempt: AttemptRecord) => void
// ): Promise<string> { ... }

export function Task7_1() {
  const { t } = useLanguage()

  // TODO: Состояние для настроек
  // TODO: State for settings
  // const [errorRate, setErrorRate] = useState(70)
  // const [maxRetries, setMaxRetries] = useState(4)
  // const [baseDelay, setBaseDelay] = useState(300)
  // const [factor, setFactor] = useState(2)
  // const [jitter, setJitter] = useState(false)

  // TODO: Состояние для истории попыток и результата
  // TODO: State for attempt history and result
  // const [attempts, setAttempts] = useState<AttemptRecord[]>([])
  // const [running, setRunning] = useState(false)
  // const [finalResult, setFinalResult] = useState<string | null>(null)

  // TODO: Реализуйте handleRun — запускает retry и обновляет attempts в реальном времени
  // TODO: Implement handleRun — runs retry and updates attempts in real time

  return (
    <div className="exercise-container">
      <h2>{t('task.7.1')}</h2>

      {/* TODO: Слайдеры для настройки (errorRate, maxRetries, baseDelay, factor) */}
      {/* TODO: Sliders for settings (errorRate, maxRetries, baseDelay, factor) */}

      {/* TODO: Переключатель Jitter ON/OFF */}
      {/* TODO: Jitter toggle ON/OFF */}

      {/* TODO: Панель "Задержки по плану" — рассчитать baseDelay * factor^i для i=0..maxRetries-1 */}
      {/* TODO: "Planned delays" panel — calculate baseDelay * factor^i for i=0..maxRetries-1 */}

      {/* TODO: Timeline попыток — список AttemptRecord с цветовым статусом */}
      {/* TODO: Attempt timeline — list of AttemptRecord with color-coded status */}
      {/* pending → серый, error → красный, success → зелёный, waiting → жёлтый */}
      {/* pending → gray, error → red, success → green, waiting → yellow */}

      {/* TODO: Кнопка "Запустить" */}
      {/* TODO: "Run" button */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте retry с exponential backoff
      </div>
    </div>
  )
}
