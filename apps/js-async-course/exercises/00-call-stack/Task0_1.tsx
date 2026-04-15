import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.1: Визуализатор Call Stack
// Task 0.1: Call Stack Visualizer
// ============================================
// Реализуйте интерактивный визуализатор, показывающий пошаговое
// выполнение цепочки вложенных функций с анимацией стека.
// Implement an interactive visualizer showing step-by-step execution
// of a nested function call chain with stack animation.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

interface StackFrame {
  name: string   // Имя функции / Function name, e.g. 'a()'
  line: string   // Номер строки / Line reference, e.g. 'строка 13'
  color: string  // Цвет фрейма / Frame color, e.g. '#3b82f6'
}

// Тип события стека: push (добавить фрейм), pop (убрать), info (пояснение)
// Stack event type: push (add frame), pop (remove), info (explanation)
type StepAction = 'push' | 'pop' | 'info'

interface Step {
  action: StepAction
  frame?: StackFrame         // Только для 'push' / Only for 'push'
  description: string        // Описание шага / Step description
  highlightLine: number      // Номер строки кода для подсветки / Code line to highlight (0-indexed)
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// Цвета для фреймов (можно использовать по модулю)
// Colors for frames (use modulo for cycling)
const FRAME_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

// Строки кода для отображения слева (0-indexed)
// Code lines to display on the left (0-indexed)
const CODE_LINES = [
  'function d() {',
  '  return 42',
  '}',
  'function c() {',
  '  return d()',
  '}',
  'function b() {',
  '  return c()',
  '}',
  'function a() {',
  '  return b()',
  '}',
  'a() // start',
]

// TODO: Определите массив шагов STEPS типа Step[]
// TODO: Define a STEPS array of type Step[]
// Последовательность событий:
// Sequence of events:
//   1. info   — "Начало программы. Call Stack пустой."  highlightLine: 12
//   2. push a — frame: { name: 'a()', line: 'строка 13', color: FRAME_COLORS[0] }, highlightLine: 9
//   3. push b — frame: { name: 'b()', line: 'строка 11', color: FRAME_COLORS[1] }, highlightLine: 6
//   4. push c — frame: { name: 'c()', line: 'строка 8',  color: FRAME_COLORS[2] }, highlightLine: 3
//   5. push d — frame: { name: 'd()', line: 'строка 5',  color: FRAME_COLORS[3] }, highlightLine: 0
//   6. pop    — "d() выполнен, возвращает 42. Фрейм снимается.", highlightLine: 1
//   7. pop    — "c() возвращает результат.", highlightLine: 4
//   8. pop    — "b() возвращает значение.", highlightLine: 7
//   9. pop    — "a() завершена. Стек пустой.", highlightLine: 10
// const STEPS: Step[] = [...]

// TODO: Объявите режимы / Declare modes
// type Mode = 'trace' | 'recursion'

export function Task0_1() {
  const { t } = useLanguage()

  // TODO: Состояние для режима ('trace' | 'recursion')
  // TODO: State for mode ('trace' | 'recursion')
  // const [mode, setMode] = useState<Mode>('trace')

  // TODO: Состояние для текущего шага трассировки (0 = начало)
  // TODO: State for current trace step index (0 = beginning)
  // const [stepIndex, setStepIndex] = useState(0)

  // TODO: Состояние для стека фреймов
  // TODO: State for the stack of frames
  // const [stack, setStack] = useState<StackFrame[]>([])

  // TODO: Состояние для глубины рекурсии (1..30)
  // TODO: State for recursion depth slider (1..30)
  // const [depth, setDepth] = useState(5)

  // -----------------------------------------------
  // TODO: Реализуйте функцию applyStep(targetIndex)
  // TODO: Implement applyStep(targetIndex)
  // -----------------------------------------------
  // Пересчитывает stack, применяя все шаги от 0 до targetIndex.
  // Recalculates stack by applying all steps from 0 to targetIndex.
  // Алгоритм:
  // Algorithm:
  //   - начните с пустого массива []
  //   - для каждого шага i от 1 до targetIndex:
  //     - если STEPS[i].action === 'push' && STEPS[i].frame — push frame в массив
  //     - если STEPS[i].action === 'pop' — pop из массива
  //   - обновите state stack и stepIndex

  // -----------------------------------------------
  // TODO: Реализуйте handleNext() и handleReset()
  // TODO: Implement handleNext() and handleReset()
  // -----------------------------------------------
  // handleNext: если stepIndex < STEPS.length - 1, вызовите applyStep(stepIndex + 1)
  // handleReset: установите stack = [], stepIndex = 0

  // -----------------------------------------------
  // TODO: Вычислите isOverflow для режима рекурсии
  // TODO: Compute isOverflow for recursion mode
  // -----------------------------------------------
  // isOverflow = mode === 'recursion' && depth > 25

  return (
    <div className="exercise-container">
      <h2>{t('task.0.1')}</h2>

      {/* TODO: Добавьте вкладки для переключения режимов */}
      {/* TODO: Add tabs for mode switching */}
      {/* При переключении вкладки — сбрасывайте состояние через handleReset() */}
      {/* When switching tabs — reset state via handleReset() */}

      {/* TODO: Режим 'trace' — трассировка вызовов */}
      {/* TODO: Mode 'trace' — call trace */}
      {/* Левая панель: CODE_LINES с подсветкой currentStep.highlightLine */}
      {/* Left panel: CODE_LINES with highlight on currentStep.highlightLine */}
      {/* Правая панель: стек (stack.map(...)) снизу вверх */}
      {/* Right panel: stack displayed bottom-to-top */}
      {/* Подпись текущего шага: STEPS[stepIndex].description */}
      {/* Current step label: STEPS[stepIndex].description */}

      {/* TODO: Режим 'recursion' — ползунок глубины */}
      {/* TODO: Mode 'recursion' — depth slider */}
      {/* <input type="range" min={1} max={30} value={depth} onChange={...} /> */}
      {/* Показывайте depth мини-блоков (или до 26 + "...") */}
      {/* Show depth mini-blocks (up to 26 + "..." for overflow) */}
      {/* isOverflow → красное сообщение RangeError */}
      {/* isOverflow → red RangeError message */}
      {/* !isOverflow → зелёное сообщение "Стек в норме" */}
      {/* !isOverflow → green "Stack is ok" message */}

      {/* TODO: Кнопки управления для режима 'trace' */}
      {/* TODO: Controls for 'trace' mode */}
      {/* <button onClick={handleNext}>Шаг вперёд →</button> */}
      {/* <button onClick={handleReset}>Сброс</button> */}
      {/* Блокируйте кнопку "Шаг вперёд" если stepIndex >= STEPS.length - 1 */}
      {/* Disable "Next step" when stepIndex >= STEPS.length - 1 */}

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализатор стека вызовов
      </div>
    </div>
  )
}
