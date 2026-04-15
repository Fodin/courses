import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.2: Callbacks vs Promises — сравнение
// Task 2.2: Callbacks vs Promises — comparison
// ============================================
// Реализуйте компаратор: слева — pipeline на вложенных колбэках,
// справа — эквивалентная Promise-цепочка. Оба варианта запускаются
// одновременно и приходят к одному результату.
//
// Implement a comparator: left side — nested callbacks pipeline,
// right side — equivalent Promise chain. Both run simultaneously
// and produce the same result.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Статус одной стороны / Status of one side
type SideStatus = 'idle' | 'running' | 'done'

// Запись лога / Log entry
interface SideLog {
  step: number    // Индекс шага 0–4 / Step index 0–4
  label: string   // Название шага / Step label
  time: number    // Мс с начала выполнения стороны / Ms since side start
  color: string   // Цвет шага / Step color
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// Описания шагов — одинаковые для обеих сторон
// Step descriptors — same for both sides
const CB_STEPS = [
  { label: 'getUser()',     color: '#3b82f6' },
  { label: 'getPosts()',    color: '#8b5cf6' },
  { label: 'getComments()', color: '#ec4899' },
  { label: 'filterSpam()',  color: '#f59e0b' },
  { label: 'sendReport()',  color: '#10b981' },
]

// -----------------------------------------------
// Асинхронные функции Promise-стороны / Promise-side async functions
// -----------------------------------------------

// TODO: Реализуйте функции-промисы для каждого шага
// TODO: Implement Promise-based functions for each step
// Каждая функция должна возвращать Promise<string>, резолвящийся через setTimeout
// Each function must return a Promise<string> that resolves via setTimeout
// Задержки (ms): getUser=500, getPosts=600, getComments=700, filterSpam=400, sendReport=500
// Delays (ms): getUser=500, getPosts=600, getComments=700, filterSpam=400, sendReport=500
//
// function getUserPromise(): Promise<string> { ... }
// function getPostsPromise(user: string): Promise<string> { ... }
// function getCommentsPromise(posts: string): Promise<string> { ... }
// function filterSpamPromise(comments: string): Promise<string> { ... }
// function sendReportPromise(filtered: string): Promise<string> { ... }

export function Task2_2() {
  const { t } = useLanguage()

  // TODO: Состояние для колбэк-стороны
  // TODO: State for callback side
  // const [cbStatus, setCbStatus] = useState<SideStatus>('idle')
  // const [cbLogs, setCbLogs] = useState<SideLog[]>([])
  // const [cbStep, setCbStep] = useState(0)  // сколько шагов завершено / completed steps count

  // TODO: Состояние для Promise-стороны
  // TODO: State for Promise side
  // const [promStatus, setPromStatus] = useState<SideStatus>('idle')
  // const [promLogs, setPromLogs] = useState<SideLog[]>([])
  // const [promStep, setPromStep] = useState(0)

  // TODO: Состояние для hover-подсветки (номер шага, на который наведён курсор)
  // TODO: State for hover highlight (index of hovered step)
  // const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  // TODO: Состояние: оба варианта завершены
  // TODO: State: both variants are done
  // const [finished, setFinished] = useState(false)

  // -----------------------------------------------
  // TODO: Реализуйте handleRun()
  // TODO: Implement handleRun()
  // -----------------------------------------------
  // 1. Установить оба статуса в 'running', сбросить логи и шаги
  //    Set both statuses to 'running', reset logs and steps
  //
  // ---- Callback-сторона (5 вложенных setTimeout) ----
  // ---- Callback side (5 nested setTimeouts) ----
  // Используйте setTimeout напрямую — это и есть симуляция колбэков
  // Use setTimeout directly — this simulates callbacks
  // Каждый новый setTimeout запускается внутри предыдущего колбэка
  // Each next setTimeout starts inside the previous callback
  // Порядок задержек: 500, 600, 700, 400, 500 мс
  // Delay sequence: 500, 600, 700, 400, 500 ms
  // При завершении каждого шага: addCbLog(stepIndex), setCbStep(i + 1)
  // After each step: addCbLog(stepIndex), setCbStep(i + 1)
  // После шага 4: setCbStatus('done'), проверить оба завершены
  // After step 4: setCbStatus('done'), check if both are done
  //
  // ---- Promise-сторона ----
  // ---- Promise side ----
  // getUserPromise()
  //   .then(user => { addPromLog(0); return getPostsPromise(user) })
  //   .then(posts => { addPromLog(1); return getCommentsPromise(posts) })
  //   .then(comments => { addPromLog(2); return filterSpamPromise(comments) })
  //   .then(filtered => { addPromLog(3); return sendReportPromise(filtered) })
  //   .then(() => { addPromLog(4); setPromStatus('done'); ... })
  //
  // Обе стороны запускаются параллельно в одном handleRun
  // Both sides start in parallel within one handleRun call

  // -----------------------------------------------
  // TODO: Реализуйте handleReset()
  // TODO: Implement handleReset()
  // -----------------------------------------------
  // Сброс всех состояний в начальные значения
  // Reset all state to initial values

  // -----------------------------------------------
  // Код для отображения / Display code
  // -----------------------------------------------

  // Строки callback-кода (вложенная структура)
  // Callback code lines (nested structure)
  const callbackLines = [
    { text: "getUser(userId, (err, user) => {", step: 0 },
    { text: "  if (err) return onError(err)", step: 0 },
    { text: "  getPosts(user, (err, posts) => {", step: 1 },
    { text: "    if (err) return onError(err)", step: 1 },
    { text: "    getComments(posts, (err, cmts) => {", step: 2 },
    { text: "      if (err) return onError(err)", step: 2 },
    { text: "      filterSpam(cmts, (err, clean) => {", step: 3 },
    { text: "        if (err) return onError(err)", step: 3 },
    { text: "        sendReport(clean, (err) => {", step: 4 },
    { text: "          if (err) return onError(err)", step: 4 },
    { text: "          console.log('done!')", step: 4 },
    { text: "        })", step: 4 },
    { text: "      })", step: 3 },
    { text: "    })", step: 2 },
    { text: "  })", step: 1 },
    { text: "})", step: 0 },
  ]

  // Строки Promise-кода (плоская цепочка)
  // Promise code lines (flat chain)
  const promiseLines = [
    { text: "getUser(userId)", step: 0 },
    { text: "  .then(user => getPosts(user))", step: 1 },
    { text: "  .then(posts => getComments(posts))", step: 2 },
    { text: "  .then(cmts => filterSpam(cmts))", step: 3 },
    { text: "  .then(clean => sendReport(clean))", step: 4 },
    { text: "  .then(() => console.log('done!'))", step: 4 },
    { text: "  .catch(err => onError(err))", step: -1 },
  ]

  // Метрики для таблицы сравнения / Metrics for comparison table
  const metrics = [
    { label: 'Вложенность',      cb: '5 уровней',              prom: '0 уровней' },
    { label: 'Строк кода',       cb: '~15',                    prom: '~7' },
    { label: 'Обработка ошибок', cb: 'if(err) в каждом уровне', prom: 'один .catch()' },
    { label: 'Читаемость',       cb: 'Пирамида',               prom: 'Плоская цепочка' },
  ]

  return (
    <div className="exercise-container">
      <h2>{t('task.2.2')}</h2>

      {/* TODO: Подсказка о hover-подсветке */}
      {/* TODO: Hover highlight hint */}

      {/* TODO: Две колонки кода */}
      {/* TODO: Two code columns */}
      {/* Левая: callbackLines — для каждой строки onMouseEnter → setHoveredStep(line.step) */}
      {/* Left: callbackLines — for each line onMouseEnter → setHoveredStep(line.step) */}
      {/* Правая: promiseLines — аналогично */}
      {/* Right: promiseLines — same */}
      {/* При hoveredStep === line.step — подсветить фон обеих строк цветом шага */}
      {/* When hoveredStep === line.step — highlight both lines with step color */}
      {/* Строки с step === -1 (catch) — не подсвечивать, но показывать серым */}
      {/* Lines with step === -1 (catch) — no highlight, show in grey */}

      {/* TODO: Прогресс-бары */}
      {/* TODO: Progress bars */}
      {/* Для каждой стороны: 5 сегментов, закрашиваются по мере logs.length */}
      {/* For each side: 5 segments, fill as logs.length increases */}
      {/* Цвет каждого сегмента = CB_STEPS[i].color */}
      {/* Each segment color = CB_STEPS[i].color */}

      {/* TODO: Таблица метрик */}
      {/* TODO: Metrics table */}
      {/* 4 строки из массива metrics: Метрика | Callbacks (красный) | Promises (зелёный) */}
      {/* 4 rows from metrics array: Metric | Callbacks (red) | Promises (green) */}

      {/* TODO: Итоговое сообщение при finished === true */}
      {/* TODO: Final success message when finished === true */}

      {/* TODO: Кнопки "Запустить оба" и "Сброс" */}
      {/* TODO: "Run both" and "Reset" buttons */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте сравнение callbacks и promises
      </div>
    </div>
  )
}
