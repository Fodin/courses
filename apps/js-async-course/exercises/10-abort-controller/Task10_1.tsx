import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.1: Отмена fetch с AbortController
// Task 10.1: Cancelling fetch with AbortController
// ============================================
// Реализуйте интерактивную демонстрацию отмены fetch-запроса.
// Implement an interactive fetch cancellation demonstration.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface LogEntry {
  id: number
  text: string
  color: string
}

// Статус операции / Operation status
type FetchStatus = 'idle' | 'loading' | 'aborted' | 'done'

// -----------------------------------------------
// Утилиты / Utilities
// -----------------------------------------------

// TODO: Реализуйте вспомогательную функцию delay с поддержкой AbortSignal
// TODO: Implement a delay utility that supports AbortSignal
// Алгоритм / Algorithm:
//   - возвращает Promise<void>
//   - внутри setTimeout вызывает resolve
//   - если signal передан: при 'abort' — clearTimeout и reject(signal.reason)
//
// function delay(ms: number, signal?: AbortSignal): Promise<void> { ... }

export function Task10_1() {
  const { t } = useLanguage()

  // TODO: Состояние прогресса (0..100)
  // TODO: Progress state (0..100)
  // const [progress, setProgress] = useState(0)

  // TODO: Состояние статуса: 'idle' | 'loading' | 'aborted' | 'done'
  // TODO: Status state
  // const [status, setStatus] = useState<FetchStatus>('idle')

  // TODO: Лог событий
  // TODO: Events log
  // const [log, setLog] = useState<LogEntry[]>([])

  // TODO: signal.aborted и signal.reason для отображения
  // TODO: signal.aborted and signal.reason for display
  // const [signalAborted, setSignalAborted] = useState(false)
  // const [signalReason, setSignalReason] = useState('')

  // TODO: Ref для AbortController (не state — не должен триггерить ре-рендер)
  // TODO: Ref for AbortController (not state — should not trigger re-renders)
  // const controllerRef = useRef<AbortController | null>(null)

  // TODO: Ref для ID лог-записей
  // const logIdRef = useRef(0)

  // -----------------------------------------------
  // TODO: addLog(text, color) — добавляет запись в лог
  // TODO: addLog(text, color) — adds entry to log
  // -----------------------------------------------

  // -----------------------------------------------
  // TODO: startFetch() — запускает симулированный fetch
  // TODO: startFetch() — starts simulated fetch
  // -----------------------------------------------
  // Алгоритм / Algorithm:
  //   1. Создать new AbortController(), сохранить в controllerRef
  //   2. Сбросить progress, status='loading', log=[], signalAborted=false
  //   3. addLog('fetch() started...', цвет)
  //   4. Цикл по [20, 40, 60, 80, 100]:
  //      - await delay(700, signal)
  //      - setProgress(pct)
  //      - addLog(`progress ${pct}%...`, цвет)
  //   5. При успехе: addLog('completed', цвет), status='done'
  //   6. В catch: если AbortError — addLog('AbortError caught', красный), status='aborted'
  //              setSignalAborted(signal.aborted), setSignalReason(String(signal.reason))

  // -----------------------------------------------
  // TODO: abort() — вызывает controller.abort(reason)
  // TODO: abort() — calls controller.abort(reason)
  // -----------------------------------------------
  // controller.abort(new DOMException('...', 'AbortError'))
  // addLog('controller.abort() вызван', оранжевый)

  // -----------------------------------------------
  // TODO: reset() — сбрасывает всё в начальное состояние
  // TODO: reset() — resets everything to initial state
  // -----------------------------------------------

  return (
    <div className="exercise-container">
      <h2>{t('task.10.1')}</h2>

      {/* TODO: Прогресс-бар */}
      {/* TODO: Progress bar */}
      {/* Цвет: синий при loading, красный при aborted, зелёный при done */}
      {/* Color: blue when loading, red when aborted, green when done */}

      {/* TODO: Панель статуса signal */}
      {/* TODO: Signal status panel */}
      {/* signal.aborted: true/false */}
      {/* signal.reason: строка */}

      {/* TODO: Лог событий */}
      {/* TODO: Events log */}
      {/* log.map(...) с цветными записями */}

      {/* TODO: Кнопки управления */}
      {/* TODO: Controls */}
      {/* "Загрузить" — disabled при loading */}
      {/* "Отменить" — disabled если status !== 'loading' */}
      {/* "Сброс" — всегда активна */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте отмену fetch через AbortController
      </div>
    </div>
  )
}
