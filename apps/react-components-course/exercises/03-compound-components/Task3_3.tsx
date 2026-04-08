import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.3: Stepper — wizard-паттерн
// ============================================
//
// Реализуйте многошаговый wizard-компонент с Compound Components.
//
// Итоговый API:
//
//   <Stepper onComplete={handleDone}>
//     <Stepper.Progress />
//     <Stepper.Step stepIndex={0} title="Шаг 1">...</Stepper.Step>
//     <Stepper.Step stepIndex={1} title="Шаг 2">...</Stepper.Step>
//     <Stepper.Step stepIndex={2} title="Шаг 3">...</Stepper.Step>
//     <Stepper.Controls />
//   </Stepper>

// --- Step 1: Типы контекста ---

// TODO: Создайте интерфейс StepperContextValue с полями:
//   currentStep: number
//   totalSteps: number
//   next: () => void
//   prev: () => void
//   goTo: (step: number) => void
//   isCompleted: boolean
interface StepperContextValue {
  // TODO: ваши поля здесь
}

// --- Step 2: Контекст и хук ---

const StepperContext = createContext<StepperContextValue | null>(null)

// TODO: Реализуйте useStepperContext() с проверкой на null
function useStepperContext(): StepperContextValue {
  // TODO: ваш код здесь
  throw new Error('Not implemented')
}

// --- Step 3: StepperRoot — корневой компонент ---

interface StepperRootProps {
  children: ReactNode
  initialStep?: number
  onComplete?: () => void
}

// TODO: Реализуйте StepperRoot:
//   State: currentStep (начинается с initialStep ?? 0), isCompleted
//
//   totalSteps: посчитайте количество StepperStep среди children.
//   Подсказка: используйте useMemo + обход children,
//   сравнивайте child.type === StepperStep
//
//   next(): если currentStep < totalSteps - 1 → увеличить,
//           иначе → isCompleted = true, вызвать onComplete?.()
//   prev(): уменьшить currentStep, но не меньше 0
//   goTo(step): установить шаг в диапазоне [0, totalSteps-1]
//
//   Если isCompleted — рендерить экран успеха (не Provider)
//   Иначе — StepperContext.Provider с children
function StepperRoot({ children, initialStep = 0, onComplete: _onComplete }: StepperRootProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isCompleted, setIsCompleted] = useState(false)

  // TODO: Посчитайте totalSteps из children
  const totalSteps = 0

  // TODO: Реализуйте next, prev, goTo

  const value = useMemo(
    () => ({
      currentStep,
      totalSteps,
      next: () => { setCurrentStep(s => s + 1) },  // TODO: доработать
      prev: () => { setCurrentStep(s => Math.max(0, s - 1)) },
      goTo: (_step: number) => {},                   // TODO: доработать
      isCompleted,
    }),
    [currentStep, totalSteps, isCompleted],
  )

  // TODO: Если isCompleted — показать экран успеха
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
//   - Читает currentStep из контекста
//   - Если currentStep !== stepIndex — возвращает null
//   - Иначе — рендерит заголовок (Шаг N: title) и children
function StepperStep({ title, children, stepIndex = 0 }: StepperStepProps) {
  // TODO: ваш код здесь
  return (
    <div>
      <h3>Шаг {stepIndex + 1}: {title}</h3>
      {children}
    </div>
  )
}

// --- Step 5: Stepper.Controls ---

// TODO: Реализуйте StepperControls:
//   - Читает currentStep, totalSteps, next, prev из контекста
//   - Кнопка "Назад": disabled если currentStep === 0
//   - Кнопка "Далее" / "Завершить": текст меняется на последнем шаге
function StepperControls() {
  // TODO: ваш код здесь
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
      <button>Назад</button>
      <button>Далее</button>
    </div>
  )
}

// --- Step 6: Stepper.Progress ---

// TODO: Реализуйте StepperProgress:
//   - Читает currentStep, totalSteps, goTo из контекста
//   - Рендерит Array.from({ length: totalSteps }) кружков
//   - Текущий шаг — выделен, пройденные — с галочкой
//   - Клик по кружку — goTo(index)
function StepperProgress() {
  // TODO: ваш код здесь
  return <div>Прогресс</div>
}

// --- Step 7: Соберите Stepper ---

// TODO: displayName для каждого компонента
// TODO: Object.assign(StepperRoot, { Step: StepperStep, Controls: StepperControls, Progress: StepperProgress })
const Stepper = Object.assign(StepperRoot, {
  Step: StepperStep,
  Controls: StepperControls,
  Progress: StepperProgress,
})

// ============================================
// Демонстрация
// ============================================

export function Task3_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.3 — Stepper</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        Реализуйте компоненты выше. Проверьте: навигацию, блокировку
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
