import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.3: Promise.race — гонка промисов
// Task 5.3: Promise.race — promise race
// ============================================
// Реализуйте двухрежимную визуализацию Promise.race.
// Implement a two-mode Promise.race visualization.
//
// Режим 1: Гонка трёх бегунов с настраиваемой задержкой и исходом
// Mode 1: Race of three runners with configurable delay and outcome
//
// Режим 2: Паттерн таймаута через race([fetch, timeout])
// Mode 2: Timeout pattern via race([fetch, timeout])
//
// Ключевое: race реагирует на ПЕРВЫЙ результат любого типа
// Key: race reacts to the FIRST result of ANY type (fulfilled OR rejected)

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface Runner {
  name: string
  color: string
  delay: number                   // задержка в мс / delay in ms
  outcome: 'success' | 'fail'     // исход промиса / promise outcome
}

type Tab = 'race' | 'timeout'

// -----------------------------------------------
// Константы / Constants
// -----------------------------------------------

const RUNNER_COLORS = ['#3b82f6', '#ec4899', '#f59e0b']

const INITIAL_RUNNERS: Runner[] = [
  { name: 'Бегун А', color: RUNNER_COLORS[0], delay: 1200, outcome: 'success' },
  { name: 'Бегун B', color: RUNNER_COLORS[1], delay: 800, outcome: 'success' },
  { name: 'Бегун C', color: RUNNER_COLORS[2], delay: 1600, outcome: 'success' },
]

export function Task5_3() {
  const { t } = useLanguage()

  // TODO: Вкладки: 'race' | 'timeout'
  // TODO: Tabs: 'race' | 'timeout'
  // const [tab, setTab] = useState<Tab>('race')

  // --- Режим гонки / Race mode ---

  // TODO: Список бегунов с начальными значениями INITIAL_RUNNERS
  // TODO: Runners list with INITIAL_RUNNERS as initial value
  // const [runners, setRunners] = useState<Runner[]>(INITIAL_RUNNERS)

  // TODO: Прогресс каждого бегуна [0, 0, 0]
  // TODO: Progress for each runner [0, 0, 0]
  // const [progresses, setProgresses] = useState([0, 0, 0])

  // TODO: Статусы каждого бегуна
  // TODO: Status for each runner
  // const [statuses, setStatuses] = useState<('idle' | 'running' | 'done' | 'error')[]>(...)

  // TODO: Победитель гонки
  // TODO: Race winner
  // const [winner, setWinner] = useState<{ index: number; outcome: 'success' | 'fail' } | null>(null)

  // const [running, setRunning] = useState(false)

  // --- Режим таймаута / Timeout mode ---

  // TODO: Задержка fetch и таймаут (слайдеры)
  // TODO: Fetch delay and timeout (sliders)
  // const [fetchDelay, setFetchDelay] = useState(3000)
  // const [timeoutMs, setTimeoutMs] = useState(2000)

  // TODO: Прогресс fetch и таймаута
  // TODO: Fetch and timeout progress
  // const [fetchProgress, setFetchProgress] = useState(0)
  // const [timeoutProgress, setTimeoutProgress] = useState(0)

  // TODO: Результат таймаутной гонки
  // TODO: Timeout race result
  // const [timeoutResult, setTimeoutResult] = useState<string | null>(null)
  // const [timeoutRunning, setTimeoutRunning] = useState(false)

  // const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  // -----------------------------------------------
  // TODO: handleRun() для режима гонки
  // TODO: handleRun() for race mode
  // -----------------------------------------------
  // 1. Установите statuses в 'running' для всех
  //    Set statuses to 'running' for all
  //
  // 2. Создайте промисы для каждого бегуна (анимация прогресса через setInterval)
  //    Create promises for each runner (progress animation via setInterval)
  //    - При outcome='success': resolve({ index: i, outcome: 'success' })
  //    - При outcome='fail': reject({ index: i, outcome: 'fail' })
  //
  // 3. Promise.race(promises)
  //    - .then(result) → setWinner(result), setRunning(false)
  //    - .catch(result) → setWinner(result), setRunning(false)
  //    Важно: используйте флаг resolved, чтобы winner устанавливался только один раз
  //    Important: use a resolved flag so winner is set only once

  // -----------------------------------------------
  // TODO: handleTimeoutRun() для режима таймаута
  // TODO: handleTimeoutRun() for timeout mode
  // -----------------------------------------------
  // 1. Создайте fetchPromise — resolve('Ответ сервера') через fetchDelay
  //    Create fetchPromise — resolve('Ответ сервера') after fetchDelay
  //
  // 2. Создайте timeoutPromise — reject(new Error('Timeout: запрос превысил лимит')) через timeoutMs
  //    Create timeoutPromise — reject(new Error(...)) after timeoutMs
  //
  // 3. Анимируйте оба прогресса через setInterval
  //    Animate both progresses via setInterval
  //
  // 4. Promise.race([fetchPromise, timeoutPromise])
  //    - .then → "Победил fetch: ..."
  //    - .catch → "Победил таймаут: ..."

  // useEffect(() => () => timersRef.current.forEach(clearInterval), [])

  return (
    <div className="exercise-container">
      <h2>{t('task.5.3')}</h2>

      {/* TODO: Вкладки "Гонка бегунов" и "Паттерн: Timeout" */}
      {/* TODO: Tabs "Runner Race" and "Pattern: Timeout" */}

      {/* === Режим гонки / Race mode === */}
      {/* TODO: Настройки бегунов: слайдер задержки + переключатель OK/FAIL */}
      {/* TODO: Runner settings: delay slider + OK/FAIL toggle */}

      {/* TODO: Трек гонки: горизонтальные прогресс-бары */}
      {/* TODO: Race track: horizontal progress bars */}
      {/* Первый финишировавший — метка "ПОБЕДИТЕЛЬ" или "ПЕРВЫЙ REJECTED" */}
      {/* First to finish — label "WINNER" or "FIRST REJECTED" */}

      {/* TODO: Блок результата race */}
      {/* TODO: Race result block */}

      {/* === Режим таймаута / Timeout mode === */}
      {/* TODO: Два слайдера: Задержка fetch и Таймаут */}
      {/* TODO: Two sliders: Fetch delay and Timeout */}

      {/* TODO: Два прогресс-бара: синий (fetch) и красный (timeout) */}
      {/* TODO: Two progress bars: blue (fetch) and red (timeout) */}

      {/* TODO: Подсказка кто победит до запуска */}
      {/* TODO: Hint about who will win before running */}

      {/* TODO: Сниппет withTimeout(promise, ms) */}
      {/* TODO: withTimeout(promise, ms) code snippet */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализацию Promise.race
      </div>
    </div>
  )
}
