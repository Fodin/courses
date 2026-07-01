import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.3: Микротаски — визуализатор порядка выполнения
// Task 4.3: Microtasks — execution order visualizer
// ============================================
// Реализуйте пошаговый визуализатор, показывающий взаимодействие
// Call Stack, Microtask Queue и Macrotask Queue.
// Implement a step-by-step visualizer showing the interaction
// of Call Stack, Microtask Queue and Macrotask Queue.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

// Элемент одной из очередей
// Item in one of the queues
interface QueueItem {
  id: string
  label: string
  type: 'microtask' | 'macrotask' | 'sync'
  color: string
}

// Один шаг пошаговой анимации
// One step of the step-by-step animation
interface ExecStep {
  description: string    // Объяснение что происходит / Explanation of what happens
  stackItems: string[]   // Содержимое Call Stack / Call Stack contents
  microtasks: QueueItem[]// Очередь микротасков / Microtask queue contents
  macrotasks: QueueItem[]// Очередь макротасков / Macrotask queue contents
  output: string[]       // Вывод консоли (накопительно) / Console output (cumulative)
  highlight: number      // Подсвечиваемая строка кода (0-indexed, -1 = нет) / Highlighted code line
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// Строки кода для отображения (левая панель)
// Code lines for display (left panel)
// const CODE_LINES_4_3 = [
//   "console.log('A')                    // синхронный",
//   "Promise.resolve().then(() => {",
//   "  console.log('B')                  // микротаск 1",
//   "}).then(() => {",
//   "  console.log('C')                  // микротаск 2",
//   "})",
//   "setTimeout(() => {",
//   "  console.log('D')                  // макротаск",
//   "}, 0)",
//   "console.log('E')                    // синхронный",
// ]

// TODO: Объявите массив EXEC_STEPS типа ExecStep[] — минимум 8 шагов
// TODO: Declare EXEC_STEPS array of type ExecStep[] — at least 8 steps
// Порядок вывода должен быть: A → E → B → C → D
// Output order must be: A → E → B → C → D
//
// Подсказки по шагам:
// Step hints:
// 1. Начало: все пусто, вывод []
// 2. console.log('A') → stackItems: ['console.log("A")'], output: ['A']
// 3. Promise.resolve().then() → microtasks: [{ id: 'm1', label: 'колбэк1 (→"B")', ... }]
// 4. setTimeout → macrotasks: [{ id: 't1', label: 'setTimeout cb (→"D")', ... }]
// 5. console.log('E') → output: ['A', 'E']
// 6. Drain microtasks: колбэк1 → output: ['A', 'E', 'B'], новый microtask m2
// 7. Drain microtasks: колбэк2 → output: ['A', 'E', 'B', 'C'], microtasks: []
// 8. Макротаск: setTimeout cb → output: ['A', 'E', 'B', 'C', 'D']
// const EXEC_STEPS: ExecStep[] = [...]

export function Task4_3() {
  const { t } = useLanguage()

  // TODO: Состояние для текущего шага (0 = начало)
  // TODO: State for current step index (0 = beginning)
  // const [stepIndex, setStepIndex] = useState(0)

  // TODO: Состояние для переключения вкладки (основная / starvation)
  // TODO: State for tab switching (main / starvation)
  // const [showStarvation, setShowStarvation] = useState(false)

  // TODO: Состояние для симуляции starvation
  // TODO: State for starvation simulation
  // const [starvationRunning, setStarvationRunning] = useState(false)
  // const [macroCount, setMacroCount] = useState(0)
  // const [microCount, setMicroCount] = useState(0)
  // const starvRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // -----------------------------------------------
  // TODO: Реализуйте startStarvation()
  // TODO: Implement startStarvation()
  // -----------------------------------------------
  // 1. setStarvationRunning(true), сбросить счётчики
  // 2. setInterval каждые 100мс: microCount += 10, macroCount если micro % 50 === 0
  // 3. setTimeout через 3000мс: clearInterval, setStarvationRunning(false)

  // -----------------------------------------------
  // TODO: Добавьте useEffect для очистки при размонтировании
  // TODO: Add useEffect for cleanup on unmount
  // -----------------------------------------------

  // TODO: currentStep = EXEC_STEPS[stepIndex]
  // TODO: currentStep = EXEC_STEPS[stepIndex]

  return (
    <div className="exercise-container">
      <h2>{t('task.4.3')}</h2>

      {/* TODO: Вкладки: 'Пошаговое выполнение' и 'Starvation' */}
      {/* TODO: Tabs: 'Step-by-step execution' and 'Starvation' */}

      <div>
        {/* TODO: Режим 'Пошаговое выполнение' */}
        {/* TODO: 'Step-by-step' mode */}
        {/* Левая панель: CODE_LINES_4_3 с подсветкой currentStep.highlight */}
        {/* Left panel: CODE_LINES_4_3 with highlight on currentStep.highlight */}

        {/* Правая панель: три блока */}
        {/* Right panel: three blocks */}
        {/* 1. CALL STACK — currentStep.stackItems */}
        {/* 2. MICROTASK QUEUE — currentStep.microtasks */}
        {/* 3. MACROTASK QUEUE — currentStep.macrotasks */}

        {/* Вывод консоли: currentStep.output.join(', ') */}
        {/* Console output: currentStep.output.join(', ') */}

        {/* Описание текущего шага: currentStep.description */}
        {/* Current step description: currentStep.description */}

        {/* Кнопки: 'Шаг вперёд →' и 'Сброс' */}
        {/* Buttons: 'Step forward →' and 'Reset' */}

        {/* TODO: Режим 'Starvation' */}
        {/* TODO: 'Starvation' mode */}
        {/* Code-сниппет с рекурсивным Promise.resolve().then(recursive) */}
        {/* Code snippet with recursive Promise.resolve().then(recursive) */}
        {/* Два счётчика: microCount (растёт быстро) и macroCount (почти 0) */}
        {/* Two counters: microCount (grows fast) and macroCount (nearly 0) */}
        {/* Объяснение: почему макротаск не выполняется */}
        {/* Explanation: why macrotask never executes */}
        {/* Кнопка 'Симулировать starvation (3 сек)' */}
        {/* Button 'Simulate starvation (3 sec)' */}
      </div>

      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте визуализатор микротасков и очередей
      </div>
    </div>
  )
}
