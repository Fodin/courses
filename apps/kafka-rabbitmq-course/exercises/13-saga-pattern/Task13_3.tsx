import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 13.3: Компенсирующие действия
// Task 13.3: Compensating Actions
// ============================================================
//
// Goal: implement a compensating actions simulator that shows
// concrete business effects for each step — both the forward action
// (e.g. "ORDER #1234 created") and the compensating action
// (e.g. "ORDER #1234 cancelled").
// Users can choose which step fails and observe the reverse cascade.

// TODO: Define the CompensationStatus type.
// TODO: Определите тип CompensationStatus.
// Values: 'idle' | 'done' | 'failed' | 'compensating' | 'compensated'
// Значения: 'idle' | 'done' | 'failed' | 'compensating' | 'compensated'
// type CompensationStatus = ...

// TODO: Define the CompensationStep interface.
// TODO: Определите интерфейс CompensationStep.
// Fields: id: string, stepNumber: number, service: string,
//         action: string, compensationAction: string,
//         effect: string, compensationEffect: string,
//         color: string, status: CompensationStatus
// Поля: id: string, stepNumber: number, service: string,
//       action: string, compensationAction: string,
//       effect: string, compensationEffect: string,
//       color: string, status: CompensationStatus
// interface CompensationStep { ... }

// TODO: Declare COMP_STEPS — array of 4 steps:
// TODO: Объявите COMP_STEPS — массив из 4 шагов:
// 1. id: 'order',     stepNumber: 1, service: 'OrderService',
//    action: 'Создать заказ',          effect: 'ORDER #1234 создан, статус: PENDING'
//    compensationAction: 'Отменить заказ', compensationEffect: 'ORDER #1234 отменён, статус: CANCELLED'
//    color: '#4f86f7'
// 2. id: 'payment',   stepNumber: 2, service: 'PaymentService',
//    action: 'Списать средства',        effect: '$99.99 списано с карты *1234'
//    compensationAction: 'Вернуть средства', compensationEffect: '$99.99 возвращено на карту *1234'
//    color: '#38a169'
// 3. id: 'inventory', stepNumber: 3, service: 'InventoryService',
//    action: 'Зарезервировать товар',   effect: 'SKU-555 зарезервирован (остаток: 9)'
//    compensationAction: 'Снять резервирование', compensationEffect: 'SKU-555 освобождён (остаток: 10)'
//    color: '#ed8936'
// 4. id: 'shipping',  stepNumber: 4, service: 'ShippingService',
//    action: 'Создать доставку',         effect: 'Delivery #D789 создана в системе'
//    compensationAction: 'Отменить доставку', compensationEffect: 'Delivery #D789 отменена'
//    color: '#805ad5'
// const COMP_STEPS: CompensationStep[] = [...]

// STATUS_LABELS and STATUS_COLORS — same as tasks 13.1 / 13.2
// STATUS_LABELS и STATUS_COLORS — те же, что в заданиях 13.1 / 13.2

export function Task13_3() {
  const { t } = useLanguage()

  // TODO: Declare state:
  // TODO: Объявите состояние:
  // steps: CompensationStep[] (initial: COMP_STEPS)
  // steps: CompensationStep[] (начальное: COMP_STEPS)
  // failAtStep: number (default 2 — fail on InventoryService)
  // failAtStep: number (по умолчанию 2 — ошибка на InventoryService)
  // running: boolean
  // effects: string[]
  // phase: 'idle' | 'forward' | 'compensating' | 'done'
  // abortRef: React.MutableRefObject<boolean>
  const [steps, setSteps] = useState<any[]>([])
  const [failAtStep, setFailAtStep] = useState<number>(2)
  const [running, setRunning] = useState(false)
  const [effects, setEffects] = useState<string[]>([])
  const [phase, setPhase] = useState<string>('idle')
  const abortRef = useRef(false)

  // TODO: Implement sleep helper
  // TODO: Реализуйте вспомогательную функцию sleep
  // const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

  // TODO: Implement getStepBg(status, color): string
  // TODO: Реализуйте getStepBg(status, color): string
  // Returns background color for the step card:
  // Возвращает цвет фона карточки шага:
  // idle → '#fafafa', done → `${color}12`, failed → '#fff5f5',
  // compensating → '#fffbf0', compensated → '#f7f8fa', else '#fff'
  // const getStepBg = (status: CompensationStatus, color: string): string => { ... }

  // TODO: Implement getStepBorderColor(status, color): string
  // TODO: Реализуйте getStepBorderColor(status, color): string
  // Returns border/accent color for the step card:
  // Возвращает цвет рамки/акцента карточки шага:
  // idle → '#e2e8f0', done → color, failed → '#e53e3e',
  // compensating → '#f59e0b', compensated → '#9ca3af', else '#e2e8f0'
  // const getStepBorderColor = (status: CompensationStatus, color: string): string => { ... }

  // TODO: Implement runSimulation:
  // TODO: Реализуйте runSimulation:
  // 1. Reset: abortRef.current = false, setRunning(true), setPhase('forward'),
  //    setEffects([]), reset steps to COMP_STEPS with status 'idle'
  // 1. Сброс: abortRef.current = false, setRunning(true), setPhase('forward'),
  //    setEffects([]), сбросить steps в COMP_STEPS со статусом 'idle'
  // 2. Forward pass — loop through COMP_STEPS with index i:
  // 2. Прямой проход — цикл по COMP_STEPS с индексом i:
  //    - if abortRef.current — break
  //    - if i === failAtStep:
  //        status → 'failed'
  //        setEffects(prev => [...prev, `[FAILURE] Шаг ${step.stepNumber}: ${step.service} - ошибка выполнения`])
  //        failedAt = i, await sleep(500), break
  //    - else:
  //        status → 'done'
  //        setEffects(prev => [...prev, `[DONE] Шаг ${step.stepNumber}: ${step.effect}`])
  //        await sleep(600)
  // 3. If failedAt === -1 (no failure):
  // 3. Если failedAt === -1 (нет ошибки):
  //    setPhase('done'), setEffects(prev => [...prev, '[SUCCESS] Все шаги выполнены успешно!']), setRunning(false), return
  // 4. Compensation: setPhase('compensating')
  // 4. Компенсация: setPhase('compensating')
  //    setEffects(prev => [...prev, '--- Начало компенсации (в обратном порядке) ---'])
  //    await sleep(400)
  //    Loop from failedAt - 1 down to 0:
  //    Цикл от failedAt - 1 до 0:
  //    - if abortRef.current — break
  //    - status → 'compensating', await sleep(700)
  //    - status → 'compensated'
  //    - setEffects(prev => [...prev, `[COMPENSATED] Шаг ${step.stepNumber}: ${step.compensationEffect}`])
  //    - await sleep(400)
  // 5. setEffects(prev => [...prev, '--- Компенсация завершена. Данные восстановлены ---'])
  // 5. setEffects(prev => [...prev, '--- Compensation completed. Data restored ---'])
  //    setPhase('done'), setRunning(false)
  const runSimulation = async () => {
    // TODO: implement
  }

  // TODO: Implement reset:
  // TODO: Реализуйте reset:
  // abortRef.current = true, reset steps to COMP_STEPS idle, clear effects,
  // abortRef.current = true, сбросить steps в COMP_STEPS idle, очистить effects,
  // setPhase('idle'), setRunning(false)
  const reset = () => {
    // TODO: implement
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.13.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Симулятор компенсирующих действий. Выберите шаг, который упадёт, —
        и наблюдайте, как система в обратном порядке отменяет уже совершённые действия.
      </p>

      {/* TODO: Controls — flex row, gap 1rem, alignItems center, marginBottom 1.5rem, flexWrap wrap */}
      {/* TODO: Элементы управления — flex-строка, gap 1rem, alignItems center, marginBottom 1.5rem, flexWrap wrap */}
      {/* label "Падает шаг:" */}
      {/* COMP_STEPS.map — one button per step ("Шаг 1", "Шаг 2", ...) */}
      {/* COMP_STEPS.map — одна кнопка на шаг ("Шаг 1", "Шаг 2", ...) */}
      {/*   Active (failAtStep === i): border red '#e53e3e', bg '#fff5f5', text red */}
      {/*   Active (failAtStep === i): рамка красная '#e53e3e', фон '#fff5f5', текст красный */}
      {/*   Inactive: border '#e2e8f0', bg '#fff', text '#555' */}
      {/*   Inactive: рамка '#e2e8f0', фон '#fff', текст '#555' */}
      {/*   disabled when running */}
      {/*   отключён когда running */}
      {/* "Без ошибок" button: active border green, bg '#f0fff4', text green */}
      {/* Кнопка "Без ошибок": активная рамка зелёная, фон '#f0fff4', текст зелёный */}
      {/* "Симулировать" / "Сбросить" button — marginLeft: 'auto' */}
      {/* Кнопка "Симулировать" / "Сбросить" — marginLeft: 'auto' */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* TODO: step selector buttons and main action button */}
      </div>

      {/* TODO: Vertical steps list — flex column, gap 0.75rem, marginBottom 1.5rem */}
      {/* TODO: Вертикальный список шагов — flex-колонна, gap 0.75rem, marginBottom 1.5rem */}
      {/* Each step: horizontal flex row */}
      {/* Каждый шаг: горизонтальная flex-строка */}
      {/*   Left: number circle + vertical connector line */}
      {/*   Слева: кружок с номером + вертикальная линия-соединитель */}
      {/*     Circle: w=32, h=32, border-radius 50%, bg=getStepBorderColor, white text, step number */}
      {/*     Кружок: w=32, h=32, border-radius 50%, bg=getStepBorderColor, белый текст, номер шага */}
      {/*     Connector line: w=2, flex 1, bg: compensated → red '#e53e3e', done → step.color, else '#e2e8f0' */}
      {/*     Линия-соединитель: w=2, flex 1, bg: compensated → красная '#e53e3e', done → step.color, иначе '#e2e8f0' */}
      {/*     No connector after last step */}
      {/*     Нет соединителя после последнего шага */}
      {/*   Right: step card (flex 1) */}
      {/*   Справа: карточка шага (flex 1) */}
      {/*     Border: getStepBorderColor, bg: getStepBg */}
      {/*     Header row: service name (bold) + action/compensationAction (show compensation when compensating/compensated) */}
      {/*     Строка заголовка: имя сервиса (bold) + action/compensationAction (показывать компенсацию при compensating/compensated) */}
      {/*     Status badge (when status !== 'idle'): colored text box with STATUS_LABELS[status] */}
      {/*     Бейдж статуса (когда status !== 'idle'): цветной текст с STATUS_LABELS[status] */}
      {/*     Effect line (when status !== 'idle'): monospace, shows compensationEffect when compensating/compensated, */}
      {/*       shows failure text when failed: `ОШИБКА: ${step.service} вернул исключение`, else step.effect */}
      {/*     Строка эффекта (когда status !== 'idle'): моноширинный, показывает compensationEffect при compensating/compensated, */}
      {/*       показывает текст ошибки при failed: `ОШИБКА: ${step.service} вернул исключение`, иначе step.effect */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {/* TODO: step cards */}
      </div>

      {/* TODO: Effects log — dark block, show only when effects.length > 0 */}
      {/* TODO: Лог эффектов — тёмный блок, показывать только когда effects.length > 0 */}
      {/* Line colors: [FAILURE] → red '#fc8181', [COMPENSATED] → orange '#f6ad55', */}
      {/*              [SUCCESS] → green '#68d391', '---' → grey '#718096', else '#a0aec0' */}
      {/* Цвета строк: [FAILURE] → красный '#fc8181', [COMPENSATED] → оранжевый '#f6ad55', */}
      {/*              [SUCCESS] → зелёный '#68d391', '---' → серый '#718096', иначе '#a0aec0' */}
      {effects.length > 0 && (
        <div style={{
          background: '#1a1a2e',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          maxHeight: '180px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
        }}>
          {/* TODO: effects output */}
        </div>
      )}

      {/* TODO: Summary block (show only when phase === 'done') */}
      {/* TODO: Блок итога (показывать только когда phase === 'done') */}
      {/* If failAtStep === -1: green bg/border, text "Saga выполнена успешно. Все 4 шага зафиксированы." */}
      {/* Если failAtStep === -1: зелёный фон/рамка, текст "Saga выполнена успешно. Все 4 шага зафиксированы." */}
      {/* Else: red bg/border, text */}
      {/* Иначе: красный фон/рамка, текст */}
      {/*   `Шаг ${failAtStep + 1} завершился ошибкой. Откатано ${failAtStep} шаг(ов). Система консистентна.` */}
      {phase === 'done' && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
        }}>
          {/* TODO: summary message */}
        </div>
      )}
    </div>
  )
}
