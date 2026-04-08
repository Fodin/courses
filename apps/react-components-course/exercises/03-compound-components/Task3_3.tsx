import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.3: Stepper — wizard-паттерн
// Task 3.3: Stepper — wizard pattern
// ============================================
//
// Реализуйте многошаговый wizard-компонент с Compound Components.
// Implement a multi-step wizard component with Compound Components.
//
// Итоговый API:
// The final API:
//
//   <Stepper onComplete={handleDone}>
//     <Stepper.Progress />
//     <Stepper.Step stepIndex={0} title="Шаг 1">...</Stepper.Step>
//     <Stepper.Step stepIndex={1} title="Шаг 2">...</Stepper.Step>
//     <Stepper.Step stepIndex={2} title="Шаг 3">...</Stepper.Step>
//     <Stepper.Controls />
//   </Stepper>

// --- Step 1: Типы контекста ---
// --- Step 1: Context types ---

// TODO: Создайте интерфейс StepperContextValue с полями:
// TODO: Create the StepperContextValue interface with fields:
//   currentStep: number
//   totalSteps: number
//   next: () => void
//   prev: () => void
//   goTo: (step: number) => void
//   isCompleted: boolean
interface StepperContextValue {
  // TODO: ваши поля здесь
  // TODO: your fields here
}

// --- Step 2: Контекст и хук ---
// --- Step 2: Context and hook ---

const StepperContext = createContext<StepperContextValue | null>(null)

// TODO: Реализуйте useStepperContext() с проверкой на null
// TODO: Implement useStepperContext() with a null check
function useStepperContext(): StepperContextValue {
  // TODO: ваш код здесь
  // TODO: your code here
  throw new Error('Not implemented')
}

// --- Step 3: StepperRoot — корневой компонент ---
// --- Step 3: StepperRoot — root component ---

interface StepperRootProps {
  children: ReactNode
  initialStep?: number
  onComplete?: () => void
}

// TODO: Реализуйте StepperRoot:
// TODO: Implement StepperRoot:
//   State: currentStep (начинается с initialStep ?? 0), isCompleted
//   State: currentStep (starts from initialStep ?? 0), isCompleted
//
//   totalSteps: посчитайте количество StepperStep среди children.
//   totalSteps: count the number of StepperStep among children.
//   Подсказка: используйте useMemo + обход children,
//   Hint: use useMemo + traverse children,
//   сравнивайте child.type === StepperStep
//   compare child.type === StepperStep
//
//   next(): если currentStep < totalSteps - 1 → увеличить,
//   next(): if currentStep < totalSteps - 1 → increment,
//           иначе → isCompleted = true, вызвать onComplete?.()
//           otherwise → isCompleted = true, call onComplete?.()
//   prev(): уменьшить currentStep, но не меньше 0
//   prev(): decrement currentStep, but not below 0
//   goTo(step): установить шаг в диапазоне [0, totalSteps-1]
//   goTo(step): set step in range [0, totalSteps-1]
//
//   Если isCompleted — рендерить экран успеха (не Provider)
//   If isCompleted — render success screen (not Provider)
//   Иначе — StepperContext.Provider с children
//   Otherwise — StepperContext.Provider with children
function StepperRoot({ children, initialStep = 0, onComplete: _onComplete }: StepperRootProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isCompleted, setIsCompleted] = useState(false)

  // TODO: Посчитайте totalSteps из children
  // TODO: Count totalSteps from children
  const totalSteps = 0

  // TODO: Реализуйте next, prev, goTo
  // TODO: Implement next, prev, goTo

  const value = useMemo(
    () => ({
      currentStep,
      totalSteps,
      next: () => { setCurrentStep(s => s + 1) },  // TODO: доработать / improve
      prev: () => { setCurrentStep(s => Math.max(0, s - 1)) },
      goTo: (_step: number) => {},                   // TODO: доработать / improve
      isCompleted,
    }),
    [currentStep, totalSteps, isCompleted],
  )

  // TODO: Если isCompleted — показать экран успеха
  // TODO: If isCompleted — show success screen
  if (isCompleted) {
    return <div>Завершено!</div>
  }

  return (
    <StepperContext.Provider value={value}>
      <div>{children}</div>
    </StepperContext.Provider>
  )
}

// --- Step 4: Stepper.Step ---

interface StepperStepProps {
  title: string
  children: ReactNode
  stepIndex?: number
}

// TODO: Реализуйте StepperStep:
// TODO: Implement StepperStep:
//   - Читает currentStep из контекста
//   - Reads currentStep from context
//   - Если currentStep !== stepIndex — возвращает null
//   - If currentStep !== stepIndex — return null
//   - Иначе — рендерит заголовок (Шаг N: title) и children
//   - Otherwise — renders header (Step N: title) and children
function StepperStep({ title, children, stepIndex = 0 }: StepperStepProps) {
  // TODO: ваш код здесь
  // TODO: your code here
  return (
    <div>
      <h3>Шаг {stepIndex + 1}: {title}</h3>
      {children}
    </div>
  )
}

// --- Step 5: Stepper.Controls ---

// TODO: Реализуйте StepperControls:
// TODO: Implement StepperControls:
//   - Читает currentStep, totalSteps, next, prev из контекста
//   - Reads currentStep, totalSteps, next, prev from context
//   - Кнопка "Назад": disabled если currentStep === 0
//   - "Back" button: disabled if currentStep === 0
//   - Кнопка "Далее" / "Завершить": текст меняется на последнем шаге
//   - "Next" / "Complete" button: text changes on the last step
function StepperControls() {
  // TODO: ваш код здесь
  // TODO: your code here
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
      <button>Назад</button>
      <button>Далее</button>
    </div>
  )
}

// --- Step 6: Stepper.Progress ---

// TODO: Реализуйте StepperProgress:
// TODO: Implement StepperProgress:
//   - Читает currentStep, totalSteps, goTo из контекста
//   - Reads currentStep, totalSteps, goTo from context
//   - Рендерит Array.from({ length: totalSteps }) кружков
//   - Renders Array.from({ length: totalSteps }) circles
//   - Текущий шаг — выделен, пройденные — с галочкой
//   - Current step — highlighted, completed — with checkmark
//   - Клик по кружку — goTo(index)
//   - Click on circle — goTo(index)
function StepperProgress() {
  // TODO: ваш код здесь
  // TODO: your code here
  return <div>Прогресс</div>
}

// --- Step 7: Соберите Stepper ---
// --- Step 7: Assemble Stepper ---

// TODO: displayName для каждого компонента
// TODO: displayName for each component
// TODO: Object.assign(StepperRoot, { Step: StepperStep, Controls: StepperControls, Progress: StepperProgress })
const Stepper = Object.assign(StepperRoot, {
  Step: StepperStep,
  Controls: StepperControls,
  Progress: StepperProgress,
})

// ============================================
// Демонстрация
// Demo
// ============================================

export function Task3_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.3 — Stepper</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        {/* Реализуйте компоненты выше. Проверьте: навигацию, блокировку */}
        {/* Implement the components above. Check: navigation, blocking */}
        Реализуйте компоненты выше. Проверьте: навигацию, блокировку
        {/* кнопки "Назад" на первом шаге, кнопку "Завершить" на последнем. */}
        {/* of the "Back" button on the first step, the "Complete" button on the last. */}
        кнопки "Назад" на первом шаге, кнопку "Завершить" на последнем.
      </p>

      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
          maxWidth: 480,
        }}
      >
        <Stepper onComplete={() => alert('Форма отправлена!')}>
          <Stepper.Progress />

          <Stepper.Step stepIndex={0} title="Личные данные">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                placeholder="Имя"
                style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6 }}
              />
              <input
                placeholder="Email"
                style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6 }}
              />
            </div>
          </Stepper.Step>

          <Stepper.Step stepIndex={1} title="Адрес доставки">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                placeholder="Город"
                style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6 }}
              />
              <input
                placeholder="Улица"
                style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 6 }}
              />
            </div>
          </Stepper.Step>

          <Stepper.Step stepIndex={2} title="Подтверждение">
            {/* Проверьте данные и нажмите «Завершить». */}
            {/* Check the data and click "Complete". */}
            <p style={{ color: '#64748b', margin: 0 }}>
              Проверьте данные и нажмите «Завершить».
            </p>
          </Stepper.Step>

          <Stepper.Controls />
        </Stepper>
      </div>
    </div>
  )
}
