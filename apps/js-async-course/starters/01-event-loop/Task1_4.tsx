import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.4: Браузер vs Node.js Event Loop
// Task 1.4: Browser vs Node.js Event Loop
// ============================================
// Реализуйте сравнительный визуализатор двух моделей
// Event Loop: браузерной и Node.js (libuv).
// Implement a comparative visualizer of two Event Loop
// models: browser and Node.js (libuv).

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Тип окружения / Environment type
type EnvTab = 'browser' | 'node'

// Описание одной фазы / One phase description
interface Phase {
  id: string        // Идентификатор фазы / Phase identifier
  label: string     // Название для кнопки / Button label
  color: string     // Цвет фазы / Phase color
  desc: string      // Подробное описание / Detailed description
}

// Уникальный API / Unique API entry
interface UniqueApi {
  api: string   // Название API / API name
  desc: string  // Описание / Description
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// TODO: Определите массив BROWSER_PHASES типа Phase[]
// TODO: Define BROWSER_PHASES array of type Phase[]
// Фазы браузера:
// Browser phases:
//   1. sync     — синхронный код (синий)
//   2. micro    — Microtask Queue: Promise.then, queueMicrotask (фиолетовый)
//   3. raf      — requestAnimationFrame (зелёный)
//   4. render   — Style → Layout → Paint → Composite (голубой)
//   5. macro    — Macrotask Queue: setTimeout/setInterval (янтарный)
//
// const BROWSER_PHASES: Phase[] = [...]

// TODO: Определите массив NODE_PHASES типа Phase[]
// TODO: Define NODE_PHASES array of type Phase[]
// Фазы Node.js:
// Node.js phases:
//   1. sync      — синхронный код (синий)
//   2. nexttick  — process.nextTick (розовый, ВЫШЕ Promise!)
//   3. micro     — Promise microtasks (фиолетовый)
//   4. timers    — setTimeout, setInterval (янтарный)
//   5. pending   — pending I/O callbacks (оранжевый)
//   6. idle      — idle/prepare (серый)
//   7. poll      — Poll: new I/O events (зелёный)
//   8. check     — setImmediate (индиго)
//   9. close     — close callbacks (светло-серый)
//
// const NODE_PHASES: Phase[] = [...]

// TODO: Определите BROWSER_ONLY_APIS и NODE_ONLY_APIS типа UniqueApi[]
// TODO: Define BROWSER_ONLY_APIS and NODE_ONLY_APIS of type UniqueApi[]
//
// BROWSER_ONLY_APIS:
//   - requestAnimationFrame: 'Колбэк перед отрисовкой кадра'
//   - requestIdleCallback: 'Колбэк в период простоя браузера'
//   - MutationObserver: 'Наблюдение за DOM (микротаска)'
//
// NODE_ONLY_APIS:
//   - process.nextTick: 'Приоритет выше Promise.then!'
//   - setImmediate: 'Выполняется в фазе Check (после Poll)'
//   - libuv: '6 фаз I/O цикла под капотом'

// Код для сравнения / Comparison code
const COMPARE_CODE = `console.log('sync')
setTimeout(() => console.log('setTimeout'), 0)
setImmediate(() => console.log('setImmediate'))  // только Node.js!
Promise.resolve().then(() => console.log('Promise'))
process?.nextTick(() => console.log('nextTick')) // только Node.js!`

// TODO: Определите BROWSER_OUTPUT и NODE_OUTPUT — массивы строк
// TODO: Define BROWSER_OUTPUT and NODE_OUTPUT — string arrays
// BROWSER_OUTPUT: ['sync', 'Promise', 'setTimeout']
// NODE_OUTPUT: ['sync', 'nextTick', 'Promise', 'setTimeout или setImmediate*']

// -----------------------------------------------
// Компонент / Component
// -----------------------------------------------

export function Task1_4() {
  const { t } = useLanguage()

  // TODO: Состояние текущей вкладки окружения
  // TODO: Current environment tab state
  // const [activeTab, setActiveTab] = useState<EnvTab>('browser')

  // TODO: Состояние активной фазы (null = нет выбранной)
  // TODO: Active phase state (null = none selected)
  // const [activePhase, setActivePhase] = useState<string | null>(null)

  // TODO: Вычислите phases = activeTab === 'browser' ? BROWSER_PHASES : NODE_PHASES
  // TODO: Compute phases based on activeTab

  return (
    <div className="exercise-container">
      <h2>{t('task.1.4')}</h2>

      {/* TODO: Вкладки "Браузер" и "Node.js" */}
      {/* TODO: "Browser" and "Node.js" tabs */}
      {/* При переключении: setActiveTab + setActivePhase(null) */}
      {/* On switch: setActiveTab + setActivePhase(null) */}

      {/* TODO: Пайплайн фаз — кнопки соединённые стрелками */}
      {/* TODO: Phase pipeline — buttons connected with arrows */}
      {/* phases.map((phase, i) => <button onClick={...}>{phase.label}</button>) */}
      {/* Между кнопками → символ, в конце "(цикл)" для браузера */}
      {/* Separator → between buttons, "(loop)" at end for browser */}
      {/* Активная фаза: background = phase.color, text = white */}
      {/* Active phase: background = phase.color, text = white */}
      {/* Неактивная: background = phase.color + '20', text = phase.color */}
      {/* Inactive: background = phase.color + '20', text = phase.color */}

      {/* TODO: Описание выбранной фазы (если activePhase !== null) */}
      {/* TODO: Selected phase description (if activePhase !== null) */}

      {/* TODO: Блок уникальных API — две колонки */}
      {/* TODO: Unique APIs block — two columns */}
      {/* Слева: "ТОЛЬКО БРАУЗЕР" с BROWSER_ONLY_APIS */}
      {/* Left: "BROWSER ONLY" with BROWSER_ONLY_APIS */}
      {/* Справа: "ТОЛЬКО NODE.JS" с NODE_ONLY_APIS */}
      {/* Right: "NODE.JS ONLY" with NODE_ONLY_APIS */}

      {/* TODO: Блок сравнительного кода */}
      {/* TODO: Comparison code block */}
      {/* <pre>{COMPARE_CODE}</pre> */}

      {/* TODO: Вывод рядом — браузер vs Node.js */}
      {/* TODO: Side-by-side output — browser vs Node.js */}
      {/* BROWSER_OUTPUT и NODE_OUTPUT с нумерацией */}
      {/* BROWSER_OUTPUT and NODE_OUTPUT with numbering */}
      {/* Примечание о нестабильности setTimeout vs setImmediate */}
      {/* Note about setTimeout vs setImmediate instability */}

      {/* TODO: Блок "Главное отличие Node.js" */}
      {/* TODO: "Key Node.js difference" block */}
      {/* process.nextTick > Promise.then (историческое поведение Node.js) */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте сравнение Event Loop браузера и Node.js
      </div>
    </div>
  )
}
