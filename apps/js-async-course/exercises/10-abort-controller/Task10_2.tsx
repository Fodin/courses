import { useState, useRef, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.2: AbortSignal.timeout и составные сигналы
// Task 10.2: AbortSignal.timeout and combined signals
// ============================================
// Реализуйте демонстрацию двух причин отмены: таймаут и ручная отмена.
// Implement a demo of two cancellation reasons: timeout and manual abort.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

type OpStatus = 'idle' | 'running' | 'done'
type Winner = 'user' | 'timeout' | null

// -----------------------------------------------
// Утилиты / Utilities
// -----------------------------------------------

// TODO: Реализуйте simulateServerDelay(ms, signal)
// TODO: Implement simulateServerDelay(ms, signal)
// Имитирует задержку ответа сервера с поддержкой отмены.
// Simulates server response delay with abort support.
//
// async function simulateServerDelay(ms: number, signal: AbortSignal): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const timer = setTimeout(resolve, ms)
//     signal.addEventListener('abort', () => {
//       clearTimeout(timer)
//       reject(signal.reason)
//     })
//   })
// }

export function Task10_2() {
  const { t } = useLanguage()

  // TODO: Состояние слайдеров
  // TODO: Slider state
  // const [timeoutMs, setTimeoutMs] = useState(3000)    // таймаут AbortSignal.timeout
  // const [serverDelayMs, setServerDelayMs] = useState(2000)  // задержка "сервера"

  // TODO: Состояние операции
  // TODO: Operation state
  // const [status, setStatus] = useState<OpStatus>('idle')
  // const [result, setResult] = useState<string | null>(null)
  // const [winner, setWinner] = useState<Winner>(null)

  // TODO: Таймер (elapsed, для прогресс-бара обратного отсчёта)
  // TODO: Timer (elapsed, for countdown progress bar)
  // const [elapsed, setElapsed] = useState(0)

  // TODO: Ref для пользовательского AbortController
  // TODO: Ref for user AbortController
  // const userControllerRef = useRef<AbortController | null>(null)

  // TODO: Ref для интервала таймера
  // const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // -----------------------------------------------
  // TODO: startOperation() — запускает операцию с составным сигналом
  // TODO: startOperation() — starts operation with combined signal
  // -----------------------------------------------
  // Алгоритм / Algorithm:
  //   1. const userController = new AbortController()
  //   2. const combined = AbortSignal.any([
  //        userController.signal,
  //        AbortSignal.timeout(timeoutMs),
  //      ])
  //   3. Сбросить состояние, status='running'
  //   4. Запустить интервал (каждые 100мс обновлять elapsed)
  //   5. await simulateServerDelay(serverDelayMs, combined)
  //   6. При успехе: setResult('Успех...'), status='done'
  //   7. В catch:
  //      - TimeoutError (err.name === 'TimeoutError') → setWinner('timeout'), setResult('TimeoutError...')
  //      - AbortError (err.name === 'AbortError') → setWinner('user'), setResult('AbortError...')
  //   8. Остановить интервал

  // -----------------------------------------------
  // TODO: userAbort() — ручная отмена пользователем
  // TODO: userAbort() — manual user abort
  // -----------------------------------------------
  // userControllerRef.current?.abort(new DOMException('Пользователь отменил', 'AbortError'))

  // -----------------------------------------------
  // TODO: reset() — сброс состояния
  // TODO: reset() — reset state
  // -----------------------------------------------

  // Не забудьте cleanup при размонтировании компонента!
  // Don't forget cleanup on component unmount!
  useEffect(() => {
    return () => {
      // TODO: остановить интервал, отменить контроллер
      // TODO: stop interval, abort controller
    }
  }, [])

  return (
    <div className="exercise-container">
      <h2>{t('task.10.2')}</h2>

      {/* TODO: Два слайдера: таймаут и задержка сервера */}
      {/* TODO: Two sliders: timeout and server delay */}
      {/* При изменении слайдера — вызывать reset() */}
      {/* On slider change — call reset() */}

      {/* TODO: Подсказка-предсказание */}
      {/* TODO: Prediction hint */}
      {/* Если serverDelayMs < timeoutMs → "Сервер успеет" (зелёный) */}
      {/* If serverDelayMs < timeoutMs → "Server will succeed" (green) */}
      {/* Если serverDelayMs > timeoutMs → "Таймаут сработает" (красный) */}
      {/* If serverDelayMs > timeoutMs → "Timeout will fire" (red) */}

      {/* TODO: Два визуальных таймера (показывать только при running/done) */}
      {/* TODO: Two visual timers (show only when running/done) */}
      {/* 1. Прогресс-бар автотаймаута (elapsed / timeoutMs * 100%) */}
      {/* 1. Auto-timeout progress bar (elapsed / timeoutMs * 100%) */}
      {/* 2. Ручная отмена + прошедшее время */}
      {/* 2. Manual cancel + elapsed time */}
      {/* Победитель помечается "СРАБОТАЛ" */}
      {/* Winner marked "FIRED" */}

      {/* TODO: Результат операции (при status === 'done') */}
      {/* TODO: Operation result (when status === 'done') */}

      {/* TODO: Кнопки управления */}
      {/* TODO: Controls */}
      {/* "Запустить операцию" — disabled при running */}
      {/* "Отменить вручную" — disabled если не running */}
      {/* "Сброс" — всегда активна */}

      {/* TODO: Сниппет кода с AbortSignal.any */}
      {/* TODO: Code snippet with AbortSignal.any */}
      {/* const combined = AbortSignal.any([userSignal, AbortSignal.timeout(ms)]) */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте составной сигнал через AbortSignal.any()
      </div>
    </div>
  )
}
