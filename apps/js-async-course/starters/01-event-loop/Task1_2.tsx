import { useState, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.2: Микротаски vs Макротаски
// Task 1.2: Microtasks vs Macrotasks
// ============================================
// Реализуйте демонстратор разницы в приоритетах.
// Implement a priority difference demonstrator.
//
// Три сценария:
// Three scenarios:
//   1. Базовый: одна микро vs одна макро
//   2. Все микро до одной макро (три микро + одна макро)
//   3. Microtask Starvation — бесконечная цепочка блокирует макро

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Элемент в очереди / Queue item
interface QueueItem {
  id: string          // Уникальный ключ / Unique key
  label: string       // Описание задачи / Task description
  type: 'micro' | 'macro'  // Тип задачи / Task type
  source: string      // Источник API / API source (e.g. 'Promise.resolve()', 'setTimeout')
}

// Описание сценария / Scenario description
interface Scenario {
  name: string                  // Название для вкладки / Tab name
  description: string           // Объяснение сценария / Scenario explanation
  initialMicro: QueueItem[]     // Начальное состояние Microtask Queue
  initialMacro: QueueItem[]     // Начальное состояние Macrotask Queue
  code: string                  // Пример кода / Code example
  warning?: string              // Предупреждение (для starvation) / Warning message
}

// -----------------------------------------------
// Данные — три сценария / Data — three scenarios
// -----------------------------------------------

// TODO: Определите массив SCENARIOS типа Scenario[]
// TODO: Define SCENARIOS array of type Scenario[]
//
// Сценарий 1 (базовый):
// Scenario 1 (basic):
//   name: 'Базовый приоритет'
//   initialMicro: одна задача от Promise.resolve()
//   initialMacro: одна задача от setTimeout
//
// Сценарий 2 (все микро):
// Scenario 2 (all micro first):
//   name: 'Все микротаски до одной макротаски'
//   initialMicro: три задачи (Promise x2 + queueMicrotask)
//   initialMacro: одна задача от setTimeout
//
// Сценарий 3 (starvation):
// Scenario 3 (starvation):
//   name: 'Microtask Starvation'
//   warning: объяснение блокировки
//   initialMicro: 3-4 задачи с пометкой что они бесконечны
//   initialMacro: задача отмечена как "никогда не выполнится"
//
// const SCENARIOS: Scenario[] = [...]

// -----------------------------------------------
// Компонент / Component
// -----------------------------------------------

export function Task1_2() {
  const { t } = useLanguage()

  // TODO: Состояние для текущего сценария (0, 1, 2)
  // TODO: State for current scenario index
  // const [scenarioIdx, setScenarioIdx] = useState(0)

  // TODO: Состояние для выполненных микротасок (массив id)
  // TODO: State for completed microtask ids
  // const [microDone, setMicroDone] = useState<string[]>([])

  // TODO: Состояние для выполненных макротасок (массив id)
  // TODO: State for completed macrotask ids
  // const [macroDone, setMacroDone] = useState<string[]>([])

  // TODO: Лог выполнения — массив строк вида "[micro] label" или "[macro] label"
  // TODO: Execution log — array of strings like "[micro] label" or "[macro] label"
  // const [log, setLog] = useState<string[]>([])

  // TODO: Функция handleStep — выполняет следующую задачу:
  // TODO: handleStep function — executes the next task:
  //   1. Если есть невыполненные микротаски — выполнить первую
  //      If there are pending microtasks — execute the first one
  //   2. Иначе если есть невыполненные макротаски — выполнить первую
  //      Otherwise if there are pending macrotasks — execute the first one
  //   3. Для сценария Starvation — показать специальное предупреждение
  //      For Starvation scenario — show special warning

  // TODO: Функция reset — сбрасывает все состояния
  // TODO: reset function — clears all state

  return (
    <div className="exercise-container">
      <h2>{t('task.1.2')}</h2>

      {/* TODO: Вкладки для переключения сценариев */}
      {/* TODO: Tabs for switching scenarios */}
      {/* При переключении — сбрасывать состояние выполнения */}
      {/* On switch — reset execution state */}

      {/* TODO: Описание текущего сценария + warning если есть */}
      {/* TODO: Current scenario description + warning if present */}

      {/* TODO: Блок кода сценария */}
      {/* TODO: Scenario code block */}

      {/* TODO: Две очереди рядом: Microtask Queue и Macrotask Queue */}
      {/* TODO: Two queues side by side: Microtask Queue and Macrotask Queue */}
      {/* Каждая задача: выполненная — перечёркнута, ожидающая — активна */}
      {/* Each task: done — strikethrough, pending — active */}
      {/* Для starvation: макротаска помечается как заблокированная */}
      {/* For starvation: macrotask is marked as blocked */}

      {/* TODO: Лог порядка выполнения */}
      {/* TODO: Execution order log */}
      {/* [micro] — фиолетовый, [macro] — янтарный */}
      {/* [micro] — purple, [macro] — amber */}

      {/* TODO: Кнопки управления */}
      {/* TODO: Controls */}
      {/* "Выполнить микротаску →" если есть микро, иначе "Выполнить макротаску →" */}
      {/* "Execute microtask →" if micro pending, else "Execute macrotask →" */}
      {/* "Сброс" */}

      {/* TODO: Постоянный блок с правилом Event Loop */}
      {/* TODO: Persistent Event Loop rule block */}
      {/* "ВСЕ микротаски → ОДНА макротаска → repeat" */}
      {/* "ALL microtasks → ONE macrotask → repeat" */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализатор очередей микро и макро задач
      </div>
    </div>
  )
}
