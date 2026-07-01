import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.3: Отмена в React useEffect
// Task 10.3: Cancellation in React useEffect
// ============================================
// Реализуйте search-компонент с AbortController в useEffect.
// Implement a search component with AbortController in useEffect.
// Сравните два режима: с отменой (нет race condition) и без.
// Compare two modes: with cancellation (no race condition) and without.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface SearchRequest {
  id: number
  query: string
  startTime: number
  endTime: number | null
  status: 'pending' | 'done' | 'aborted'
  duration: number
}

// Режим: с AbortController или без
// Mode: with AbortController or without
type Mode = 'with' | 'without'

// -----------------------------------------------
// Утилиты / Utilities
// -----------------------------------------------

// TODO: Реализуйте simulateSearch(query, signal)
// TODO: Implement simulateSearch(query, signal)
// Симулирует поисковый API с случайной задержкой 500–2000мс.
// Simulates a search API with random delay 500–2000ms.
//
// async function simulateSearch(query: string, signal: AbortSignal): Promise<string[]> {
//   const ms = 500 + Math.floor(Math.random() * 1500)
//   await new Promise<void>((resolve, reject) => {
//     const t = setTimeout(resolve, ms)
//     signal.addEventListener('abort', () => { clearTimeout(t); reject(signal.reason) })
//   })
//   return [`${query}_result_1`, `${query}_result_2`, `${query}_result_3`]
// }

export function Task10_3() {
  const { t } = useLanguage()

  // TODO: Режим работы: 'with' | 'without'
  // TODO: Working mode: 'with' | 'without'
  // const [mode, setMode] = useState<Mode>('with')

  // TODO: Текущий поисковый запрос
  // TODO: Current search query
  // const [query, setQuery] = useState('')

  // TODO: Результаты поиска
  // TODO: Search results
  // const [results, setResults] = useState<string[]>([])

  // TODO: Timeline запросов
  // TODO: Requests timeline
  // const [requests, setRequests] = useState<SearchRequest[]>([])

  // TODO: Флаг race condition (для режима 'without')
  // TODO: Race condition flag (for 'without' mode)
  // const [raceWarning, setRaceWarning] = useState(false)

  // TODO: Счётчик ID запросов (useRef — не триггерит ре-рендер)
  // TODO: Request ID counter (useRef — no re-render trigger)
  // const requestIdRef = useRef(0)

  // -----------------------------------------------
  // TODO: useEffect при смене mode — сбрасывать все состояния
  // TODO: useEffect on mode change — reset all state
  // -----------------------------------------------
  // useEffect(() => {
  //   setQuery(''); setResults([]); setRequests([]); setRaceWarning(false)
  // }, [mode])

  // -----------------------------------------------
  // TODO: Основной useEffect для поиска
  // TODO: Main search useEffect
  // -----------------------------------------------
  // Зависимость: [query, mode]
  // Dependencies: [query, mode]
  //
  // Режим 'with' (с AbortController):
  // Mode 'with' (with AbortController):
  //   1. Если query пустой — setResults([]), return
  //   2. const reqId = ++requestIdRef.current
  //   3. Записать новый запрос в requests со статусом 'pending'
  //   4. const controller = new AbortController()
  //   5. simulateSearch(query, controller.signal)
  //      - .then: обновить requests (статус 'done', duration), setResults(res)
  //      - .catch: если AbortError → обновить requests (статус 'aborted')
  //   6. return () => controller.abort()  // ВАЖНО: cleanup!
  //
  // Режим 'without' (без AbortController):
  // Mode 'without' (no AbortController):
  //   1. Те же шаги 1-3
  //   4. simulateSearch(query, new AbortController().signal) — никогда не отменяется
  //      - .then: обновить requests (статус 'done'), setResults(res)
  //              если reqId < requestIdRef.current → setRaceWarning(true) (race condition!)
  //   5. return undefined  // Нет cleanup!

  // -----------------------------------------------
  // Вспомогательная функция для обновления записи запроса
  // Helper to update a request entry
  // -----------------------------------------------
  // const updateRequest = (id: number, updates: Partial<SearchRequest>) =>
  //   setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))

  return (
    <div className="exercise-container">
      <h2>{t('task.10.3')}</h2>

      {/* TODO: Переключатель режимов (вкладки) */}
      {/* TODO: Mode switcher (tabs) */}
      {/* "С AbortController" | "Без AbortController" */}

      {/* TODO: Пояснение текущего режима */}
      {/* TODO: Current mode explanation */}
      {/* Режим 'with': зелёная рамка, объяснение cleanup */}
      {/* Режим 'without': красная рамка, предупреждение о race condition */}

      {/* TODO: Поисковый input */}
      {/* TODO: Search input */}
      {/* onChange: setQuery(value), сбросить requests и raceWarning */}
      {/* placeholder: "Начните печатать..." */}

      {/* TODO: Предупреждение о race condition (только в режиме 'without') */}
      {/* TODO: Race condition warning (only in 'without' mode) */}
      {/* Показывать, когда raceWarning === true */}

      {/* TODO: Результаты поиска */}
      {/* TODO: Search results */}
      {/* results.map(r => <span key={r}>{r}</span>) */}

      {/* TODO: Timeline запросов */}
      {/* TODO: Requests timeline */}
      {/* requests.map(req => ...) */}
      {/* Серая полоса = отменён, зелёная = успех, синяя = в процессе */}
      {/* Gray bar = aborted, green = success, blue = in progress */}

      {/* TODO: Сниппет кода для текущего режима */}
      {/* TODO: Code snippet for current mode */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте поиск с отменой через AbortController в useEffect
      </div>
    </div>
  )
}
