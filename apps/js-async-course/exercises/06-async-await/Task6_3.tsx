import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.3: Sequential vs Parallel
// Task 6.3: Sequential vs Parallel
// ============================================
// Реализуйте визуализацию разницы между последовательным await
// и Promise.all с анимированным timeline.
// Implement visualization of the difference between sequential await
// and Promise.all with an animated timeline.

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// Три задачи с фиксированным временем
// Three tasks with fixed durations
const TASKS = [
  { name: 'fetchUser',     duration: 1000, color: '#3b82f6' },
  { name: 'fetchPosts',    duration: 1500, color: '#8b5cf6' },
  { name: 'fetchComments', duration: 800,  color: '#ec4899' },
]

// TODO: Определите тип режима
// TODO: Define mode type
// type RunMode = 'sequential' | 'parallel'

// TODO: Определите интерфейс для состояния каждой полосы
// TODO: Define interface for each bar state
// interface BarState {
//   progress: number  // 0..100
//   done: boolean
//   startedAt: number // смещение старта для последовательного режима
// }

// -----------------------------------------------
// Код для отображения
// Code snippets to display
// -----------------------------------------------

const CODE_SEQUENTIAL = `// Последовательный await — медленно!
const user     = await fetchUser()     // 1000ms
const posts    = await fetchPosts()    // 1500ms
const comments = await fetchComments() //  800ms
// Итого: 1000 + 1500 + 800 = 3300ms`

const CODE_PARALLEL = `// Promise.all — все запросы параллельно!
const [user, posts, comments] = await Promise.all([
  fetchUser(),     // 1000ms |
  fetchPosts(),    // 1500ms | одновременно
  fetchComments(), //  800ms |
])
// Итого: max(1000, 1500, 800) = 1500ms`

export function Task6_3() {
  const { t } = useLanguage()

  // TODO: Состояние для активного режима
  // TODO: State for active mode
  // const [mode, setMode] = useState<RunMode>('sequential')

  // TODO: Состояние для полос прогресса
  // TODO: State for progress bars
  // const [bars, setBars] = useState<BarState[]>(
  //   TASKS.map(() => ({ progress: 0, done: false, startedAt: 0 }))
  // )

  // TODO: Состояние для прошедшего времени (ms)
  // TODO: State for elapsed time (ms)
  // const [elapsed, setElapsed] = useState(0)

  // TODO: Состояние — идёт ли анимация
  // TODO: State — is animation running
  // const [running, setRunning] = useState(false)

  // TODO: Состояние для итогового времени (или null если ещё не запускалось)
  // TODO: State for total time (or null if not run yet)
  // const [totalTime, setTotalTime] = useState<number | null>(null)

  // TODO: ref для хранения ID requestAnimationFrame (для отмены)
  // TODO: ref for requestAnimationFrame ID (for cancellation)
  // const rafRef = useRef<number | null>(null)

  // -----------------------------------------------
  // TODO: Реализуйте start()
  // TODO: Implement start()
  // -----------------------------------------------
  // Алгоритм:
  // 1. Сбросить bars, elapsed, totalTime; установить running = true
  // 2. Сохранить performance.now() как startTime
  // 3. Вычислить смещения старта для каждой задачи:
  //    - sequential: TASKS[i].startedAt = сумма длительностей предыдущих задач
  //    - parallel: все startedAt = 0
  // 4. Запустить рекурсивный requestAnimationFrame (tick):
  //    - вычислить elapsed = performance.now() - startTime
  //    - для каждой задачи: progress = clamp((elapsed - startedAt) / duration * 100, 0, 100)
  //    - обновить bars и elapsed в state
  //    - если elapsed >= totalDuration: setRunning(false), setTotalTime(elapsed), остановить
  //    - иначе: rafRef.current = requestAnimationFrame(tick)
  // 5. Не забыть отменить RAF при размонтировании (useEffect cleanup)

  // -----------------------------------------------
  // TODO: Реализуйте reset()
  // TODO: Implement reset()
  // -----------------------------------------------
  // Отменить текущий RAF, сбросить все состояния в начальное

  // TODO: useEffect для cleanup при размонтировании
  // TODO: useEffect for cleanup on unmount
  // useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  return (
    <div className="exercise-container">
      <h2>{t('task.6.3')}</h2>

      {/* TODO: Две вкладки: "Последовательно" и "Параллельно" */}
      {/* TODO: Two tabs: "Sequential" and "Parallel" */}

      {/* TODO: Блок кода (CODE_SEQUENTIAL или CODE_PARALLEL) */}
      {/* TODO: Code block (CODE_SEQUENTIAL or CODE_PARALLEL) */}

      {/* TODO: Timeline с полосами прогресса */}
      {/* TODO: Timeline with progress bars */}
      {/* TASKS.map((task, i) => ...) */}
      {/* Для каждой задачи: название + полоса прогресса */}
      {/* For each task: name + progress bar */}
      {/* В sequential режиме полоса начинается со смещением startedAt */}
      {/* In sequential mode bar starts with startedAt offset */}

      {/* TODO: Счётчик elapsed и итоговое время */}
      {/* TODO: Elapsed counter and total time */}

      {/* TODO: Информационный блок с теоретическими значениями */}
      {/* TODO: Info block with theoretical values */}
      {/* Sequential: 3300ms, Parallel: 1500ms, ускорение 2.2x */}

      {/* TODO: Кнопки "Запустить" и "Сброс" */}
      {/* TODO: "Run" and "Reset" buttons */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте анимированный timeline sequential vs parallel
      </div>
    </div>
  )
}
