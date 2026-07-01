import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 14.2: Async State Machine
// Task 14.2: Async State Machine
// ============================================
// Конечный автомат для процесса оформления заказа.
// Каждый переход — async-операция с задержкой, вероятностью
// ошибки и автоматическим retry.
//
// State machine for order checkout process.
// Each transition is an async operation with delay,
// error probability, and automatic retry.

// -----------------------------------------------
// Типы / Types
// -----------------------------------------------

type OrderState =
  | 'idle'
  | 'loading'
  | 'confirmation'
  | 'payment'
  | 'processing'
  | 'done'
  | 'error'

interface Transition {
  from: OrderState
  to: OrderState
  timestamp: number   // Date.now()
  duration: number    // в миллисекундах / in ms
  attempt?: number    // если это retry / if this is a retry
}

// -----------------------------------------------
// Данные / Data
// -----------------------------------------------

// TODO: Определите STATE_LABELS: Record<OrderState, string>
// TODO: Define STATE_LABELS: Record<OrderState, string>
// Русские названия состояний: idle → 'Ожидание' и т.д.

// TODO: Определите STATE_COLORS: Record<OrderState, string>
// TODO: Define STATE_COLORS: Record<OrderState, string>
// Цвета: idle → '#64748b', loading → '#3b82f6', error → '#ef4444' и т.д.

// Последовательность шагов pipeline (без idle/done/error)
// Pipeline steps sequence (without idle/done/error)
const PIPELINE: Exclude<OrderState, 'idle' | 'done' | 'error'>[] = [
  'loading', 'confirmation', 'payment', 'processing',
]

// TODO: Определите STEP_DELAYS: Record<string, number>
// TODO: Define STEP_DELAYS: Record<string, number>
// loading: 1200, confirmation: 800, payment: 1500, processing: 1000

// TODO: Определите STEP_FAIL_PROB: Record<string, number>
// TODO: Define STEP_FAIL_PROB: Record<string, number>
// Вероятность ошибки на каждом шаге: loading: 0.15, payment: 0.2 и т.д.

// -----------------------------------------------
// Async функции / Async functions
// -----------------------------------------------

// TODO: Реализуйте runStep(step, signal, attempt): Promise<void>
// TODO: Implement runStep(step, signal, attempt): Promise<void>
// Алгоритм:
//   delay = STEP_DELAYS[step]
//   await new Promise((resolve, reject) => {
//     t = setTimeout(() => {
//       если Math.random() < STEP_FAIL_PROB[step] → reject(Error)
//       иначе → resolve()
//     }, delay)
//     signal: abort → clearTimeout(t), reject(AbortError)
//   })

export function Task14_2() {
  const { t } = useLanguage()

  // TODO: useState для текущего состояния машины
  // TODO: useState for current machine state
  // const [currentState, setCurrentState] = useState<OrderState>('idle')

  // TODO: useState для лога переходов
  // TODO: useState for transitions log
  // const [transitions, setTransitions] = useState<Transition[]>([])

  // TODO: useState для пройденных шагов (для зелёной подсветки)
  // TODO: useState for completed steps (for green highlight)
  // const [completedSteps, setCompletedSteps] = useState<Set<OrderState>>(new Set())

  // TODO: ref для AbortController текущего прогона
  // TODO: ref for AbortController of current run
  // const abortRef = useRef<AbortController | null>(null)

  // TODO: ref для времени начала текущего шага (для вычисления duration)
  // TODO: ref for step start time (to compute duration)
  // const stepStartRef = useRef<number>(0)

  const startOrder = async () => {
    // TODO: Отменить предыдущий прогон если есть
    // TODO: Cancel previous run if exists

    // TODO: Создать новый AbortController, сбросить transitions и completedSteps

    // TODO: Запустить цикл по PIPELINE:
    //   for step of PIPELINE:
    //     for attempt 0..2:
    //       try: await runStep(step, signal, attempt)
    //         → записать переход, добавить step в completedSteps, break
    //       catch AbortError → return (отмена)
    //       catch other:
    //         если attempt < 2 → записать retry в transitions, продолжить
    //         иначе → setCurrentState('error'), return

    // TODO: setCurrentState('done') в конце успешного прогона
  }

  const cancelOrder = () => {
    // TODO: abortRef.current?.abort()
    // TODO: Сбросить state, transitions, completedSteps
  }

  // TODO: Реализуйте полный рендер:
  // TODO: Implement full render:
  // - Горизонтальный pipeline состояний (блоки → стрелки)
  //   текущее подсвечено цветом, пройденные — зелёным ✓
  // - Карточка текущего состояния с названием и описанием
  // - Кнопки "Оформить заказ" (disabled во время выполнения)
  //         "Отменить" (disabled вне выполнения)
  // - Лог переходов: timestamp → from → to → duration [retry #N]

  return (
    <div className="exercise-container">
      <h2>{t('task.14.2')}</h2>
      <div style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.85rem' }}>
        Реализуйте async state machine для процесса оформления заказа
      </div>
    </div>
  )
}
