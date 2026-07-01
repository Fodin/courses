import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.4: Promise.any — первый успешный
// Task 5.4: Promise.any — first successful
// ============================================
// Реализуйте визуализацию Promise.any с CDN-сценарием.
// Implement a Promise.any visualization with a CDN scenario.
//
// Ключевые особенности / Key features:
// - any реагирует на первый FULFILLED (rejected игнорируются)
//   any reacts to the first FULFILLED (rejected are ignored)
// - Если все rejected → AggregateError с массивом .errors
//   If all rejected → AggregateError with .errors array
// - В отличие от race, который реагирует на первый ЛЮБОЙ результат
//   Unlike race which reacts to the first result of ANY type

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface Server {
  name: string
  color: string
  delay: number   // задержка ответа в мс / response delay in ms
  online: boolean // доступен ли сервер / whether the server is available
}

// -----------------------------------------------
// Константы / Constants
// -----------------------------------------------

const SERVER_COLORS = ['#3b82f6', '#8b5cf6', '#10b981']

const INITIAL_SERVERS: Server[] = [
  { name: 'CDN Primary', color: SERVER_COLORS[0], delay: 1200, online: true },
  { name: 'CDN Secondary', color: SERVER_COLORS[1], delay: 800, online: true },
  { name: 'CDN Tertiary', color: SERVER_COLORS[2], delay: 600, online: true },
]

export function Task5_4() {
  const { t } = useLanguage()

  // TODO: Список серверов (начальное значение INITIAL_SERVERS)
  // TODO: Servers list (initial value INITIAL_SERVERS)
  // const [servers, setServers] = useState<Server[]>(INITIAL_SERVERS)

  // TODO: Прогресс каждого сервера [0, 0, 0]
  // TODO: Progress for each server [0, 0, 0]
  // const [progresses, setProgresses] = useState([0, 0, 0])

  // TODO: Статусы: idle | running | done | error
  // TODO: Statuses: idle | running | done | error
  // const [statuses, setStatuses] = useState(...)

  // TODO: Результат: fulfilled с победителем или AggregateError
  // TODO: Result: fulfilled with winner or AggregateError
  // type Result =
  //   | { type: 'fulfilled'; winner: number; value: string }
  //   | { type: 'aggregate'; errors: string[] }
  // const [result, setResult] = useState<Result | null>(null)

  // const [running, setRunning] = useState(false)
  // const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  // -----------------------------------------------
  // TODO: handleRun()
  // TODO: handleRun()
  // -----------------------------------------------
  // 1. Все три сервера стартуют одновременно с анимацией прогресса
  //    All three servers start simultaneously with progress animation
  //
  // 2. Промис каждого сервера:
  //    Each server's promise:
  //    - online=true  → resolve({ winner: i, value: `asset.js from ${server.name}` })
  //    - online=false → reject(new Error(`${server.name}: offline`))
  //
  // 3. Promise.any(promises):
  //    - .then(res) → setResult({ type: 'fulfilled', winner: res.winner, value: res.value })
  //    - .catch(err) → AggregateError
  //      setResult({ type: 'aggregate', errors: [...] })
  //
  // Подсказка для AggregateError: в .catch нужно собрать массив errors[]
  // Hint for AggregateError: in .catch you need to collect the errors[] array
  // Можно собирать их по мере rejected, или из err.errors если поддерживается
  // You can collect them as rejections happen, or from err.errors if supported

  // -----------------------------------------------
  // TODO: Предупреждение если все серверы offline
  // TODO: Warning if all servers are offline
  // -----------------------------------------------
  // const allOffline = servers.every(s => !s.online)
  // Показывайте предупреждение: "Все серверы offline — будет AggregateError"
  // Show warning: "All servers offline — AggregateError will be thrown"

  // useEffect(() => () => timersRef.current.forEach(clearInterval), [])

  return (
    <div className="exercise-container">
      <h2>{t('task.5.4')}</h2>

      {/* TODO: Настройки серверов */}
      {/* TODO: Server settings */}
      {/* Для каждого: слайдер задержки + переключатель ONLINE/OFFLINE */}
      {/* For each: delay slider + ONLINE/OFFLINE toggle */}
      {/* Если все OFFLINE — предупреждение про AggregateError */}
      {/* If all OFFLINE — warning about AggregateError */}

      {/* TODO: Трек серверов: горизонтальные прогресс-бары */}
      {/* TODO: Server track: horizontal progress bars */}
      {/* ONLINE: цветной прогресс → зелёный + "ПОБЕДА" при завершении */}
      {/* ONLINE: colored progress → green + "WIN" on completion */}
      {/* OFFLINE: серый прогресс → красный + "OFFLINE" при завершении */}
      {/* OFFLINE: grey progress → red + "OFFLINE" on completion */}

      {/* TODO: Блок результата */}
      {/* TODO: Result block */}
      {/* Зелёный: "Promise.any fulfilled: 'asset.js from CDN Name'" */}
      {/* Green: "Promise.any fulfilled: 'asset.js from CDN Name'" */}
      {/* Красный при AggregateError: показать errors[] */}
      {/* Red for AggregateError: show errors[] */}

      {/* TODO: Блок сравнения Promise.race vs Promise.any */}
      {/* TODO: Comparison block Promise.race vs Promise.any */}
      {/* Покажите кодовый сниппет с объяснением разницы */}
      {/* Show code snippet explaining the difference */}

      {/* TODO: Кнопки */}
      {/* TODO: Buttons */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализацию Promise.any
      </div>
    </div>
  )
}
