import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.1: Симулятор Event Loop
// Task 1.1: Event Loop Simulator
// ============================================
// Реализуйте пошаговый визуализатор Event Loop.
// Implement a step-by-step Event Loop visualizer.
//
// Показывает как задачи перемещаются между:
// Shows how tasks move between:
//   - Call Stack (синхронный код / synchronous code)
//   - Web APIs (браузерные помощники / browser helpers)
//   - Microtask Queue (Promise.then, queueMicrotask)
//   - Macrotask Queue (setTimeout, setInterval)

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Идентификаторы зон куда попадают задачи
// Zone identifiers where tasks can reside
type AreaId = 'callStack' | 'webApis' | 'macroQueue' | 'microQueue'

// Карточка задачи / Task card
interface EventLoopItem {
  id: string        // Уникальный идентификатор / Unique identifier
  label: string     // Текст на карточке / Label on the card
  color: string     // Цвет карточки / Card color
  area: AreaId      // В какой зоне находится / Which zone it belongs to
}

// Один шаг симуляции / One simulation step
interface EventLoopStep {
  description: string       // Пояснение что происходит / What's happening
  highlight: string         // Строка кода для подсветки (точное совпадение) / Code line to highlight
  items: EventLoopItem[]    // Текущее состояние всех зон / Current state of all zones
  output: string[]          // Что уже выведено в консоль / Console output so far
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// Пример кода для визуализации
// Code example to visualize
const EL_CODE_LINES = [
  "console.log('1')",
  "setTimeout(() => console.log('2'), 0)",
  "Promise.resolve().then(() => console.log('3'))",
  "console.log('4')",
]

// TODO: Определите массив шагов EL_STEPS типа EventLoopStep[]
// TODO: Define EL_STEPS array of type EventLoopStep[]
//
// Шаг 0: начало, всё пусто, вывод пустой
// Step 0: beginning, everything empty, no output
//
// Шаг 1: console.log('1') в Call Stack, вывод: ['1']
//   items: [{ id: 'log1', label: "log('1')", color: '#3b82f6', area: 'callStack' }]
//
// Шаг 2: setTimeout в Call Stack, callback в Macrotask Queue
//   items: setTimeout в callStack + колбэк в macroQueue
//
// Шаг 3: Promise.then в Call Stack, callback в Microtask Queue
//   items: promise в callStack + старый макро + новый микро
//
// Шаг 4: console.log('4') в Call Stack, вывод добавляет '4'
//   items: log4 в callStack + cb в macroQueue + cb в microQueue
//
// Шаг 5: Call Stack пуст, Event Loop берёт из Microtask Queue
//   items: cb3 выполняется в callStack, в macroQueue остаётся cb2
//   вывод добавляет '3'
//
// Шаг 6: Microtask Queue пуст, берём из Macrotask Queue
//   items: cb2 выполняется в callStack
//   вывод добавляет '2'
//
// Шаг 7: всё готово, все зоны пусты, вывод: ['1', '4', '3', '2']
//
// const EL_STEPS: EventLoopStep[] = [...]

// -----------------------------------------------
// Вспомогательные стили / Helper styles
// -----------------------------------------------

// TODO: определите вспомогательные функции для inline-стилей
// TODO: define helper functions for inline styles

// -----------------------------------------------
// Компонент / Component
// -----------------------------------------------

export function Task1_1() {
  const { t } = useLanguage()

  // TODO: Состояние для текущего шага (0 = начало)
  // TODO: State for current step (0 = beginning)
  // const [stepIndex, setStepIndex] = useState(0)

  // Текущий шаг / Current step
  // const step = EL_STEPS[stepIndex]

  return (
    <div className="exercise-container">
      <h2>{t('task.1.1')}</h2>

      {/* TODO: Отобразите 4 визуальные зоны */}
      {/* TODO: Render 4 visual zones */}
      {/* Каждая зона имеет заголовок и отображает items для своей AreaId */}
      {/* Each zone has a header and shows items for its AreaId */}
      {/* Зоны: Call Stack (синий), Web APIs (янтарный), */}
      {/* Microtask Queue (фиолетовый), Macrotask Queue (янтарный) */}
      {/* Zones: Call Stack (blue), Web APIs (amber), */}
      {/* Microtask Queue (purple), Macrotask Queue (amber) */}

      {/* TODO: Блок "Вывод в консоль" */}
      {/* TODO: "Console output" block */}
      {/* Показывает step.output в виде цветных бейджей */}
      {/* Shows step.output as colored badges */}

      {/* TODO: Пояснение текущего шага */}
      {/* TODO: Current step explanation */}
      {/* step.description + "Шаг X/Y" */}

      {/* TODO: Кнопки управления */}
      {/* TODO: Control buttons */}
      {/* "Шаг вперёд →" — если stepIndex < EL_STEPS.length - 1 */}
      {/* "Next step →" — if stepIndex < EL_STEPS.length - 1 */}
      {/* "Сброс" — устанавливает stepIndex = 0 */}
      {/* "Reset" — sets stepIndex = 0 */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте симулятор Event Loop
      </div>
    </div>
  )
}
