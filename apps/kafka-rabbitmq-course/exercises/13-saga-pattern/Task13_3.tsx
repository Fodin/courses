import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 13.3: Компенсирующие действия
// ============================================================
//
// Goal: implement a compensating actions simulator that shows
// concrete business effects for each step — both the forward action
// (e.g. "ORDER #1234 created") and the compensating action
// (e.g. "ORDER #1234 cancelled").
// Users can choose which step fails and observe the reverse cascade.

// TODO: Define the CompensationStatus type.
// Values: 'idle' | 'done' | 'failed' | 'compensating' | 'compensated'
// type CompensationStatus = ...

// TODO: Define the CompensationStep interface.
// Fields: id: string, stepNumber: number, service: string,
//         action: string, compensationAction: string,
//         effect: string, compensationEffect: string,
//         color: string, status: CompensationStatus
// interface CompensationStep { ... }

// TODO: Declare COMP_STEPS — array of 4 steps:
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

export function Task13_3() {
  const { t } = useLanguage()

  // TODO: Declare state:
  // steps: CompensationStep[] (initial: COMP_STEPS)
  // failAtStep: number (default 2 — fail on InventoryService)
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
  // const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

  // TODO: Implement getStepBg(status, color): string
  // Returns background color for the step card:
  // idle → '#fafafa', done → `${color}12`, failed → '#fff5f5',
  // compensating → '#fffbf0', compensated → '#f7f8fa', else '#fff'
  // const getStepBg = (status: CompensationStatus, color: string): string => { ... }

  // TODO: Implement getStepBorderColor(status, color): string
  // Returns border/accent color for the step card:
  // idle → '#e2e8f0', done → color, failed → '#e53e3e',
  // compensating → '#f59e0b', compensated → '#9ca3af', else '#e2e8f0'
  // const getStepBorderColor = (status: CompensationStatus, color: string): string => { ... }

  // TODO: Implement runSimulation:
  // 1. Reset: abortRef.current = false, setRunning(true), setPhase('forward'),
  //    setEffects([]), reset steps to COMP_STEPS with status 'idle'
  // 2. Forward pass — loop through COMP_STEPS with index i:
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
  //    setPhase('done'), setEffects(prev => [...prev, '[SUCCESS] Все шаги выполнены успешно!']), setRunning(false), return
  // 4. Compensation: setPhase('compensating')
  //    setEffects(prev => [...prev, '--- Начало компенсации (в обратном порядке) ---'])
  //    await sleep(400)
  //    Loop from failedAt - 1 down to 0:
  //    - if abortRef.current — break
  //    - status → 'compensating', await sleep(700)
  //    - status → 'compensated'
  //    - setEffects(prev => [...prev, `[COMPENSATED] Шаг ${step.stepNumber}: ${step.compensationEffect}`])
  //    - await sleep(400)
  // 5. setEffects(prev => [...prev, '--- Компенсация завершена. Данные восстановлены ---'])
  //    setPhase('done'), setRunning(false)
  const runSimulation = async () => {
    // TODO: implement
  }

  // TODO: Implement reset:
  // abortRef.current = true, reset steps to COMP_STEPS idle, clear effects,
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
      {/* label "Падает шаг:" */}
      {/* COMP_STEPS.map — one button per step ("Шаг 1", "Шаг 2", ...) */}
      {/*   Active (failAtStep === i): border red '#e53e3e', bg '#fff5f5', text red */}
      {/*   Inactive: border '#e2e8f0', bg '#fff', text '#555' */}
      {/*   disabled when running */}
      {/* "Без ошибок" button: active border green, bg '#f0fff4', text green */}
      {/* "Симулировать" / "Сбросить" button — marginLeft: 'auto' */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* TODO: step selector buttons and main action button */}
      </div>

      {/* TODO: Vertical steps list — flex column, gap 0.75rem, marginBottom 1.5rem */}
      {/* Each step: horizontal flex row */}
      {/*   Left: number circle + vertical connector line */}
      {/*     Circle: w=32, h=32, border-radius 50%, bg=getStepBorderColor, white text, step number */}
      {/*     Connector line: w=2, flex 1, bg: compensated → red '#e53e3e', done → step.color, else '#e2e8f0' */}
      {/*     No connector after last step */}
      {/*   Right: step card (flex 1) */}
      {/*     Border: getStepBorderColor, bg: getStepBg */}
      {/*     Header row: service name (bold) + action/compensationAction (show compensation when compensating/compensated) */}
      {/*     Status badge (when status !== 'idle'): colored text box with STATUS_LABELS[status] */}
      {/*     Effect line (when status !== 'idle'): monospace, shows compensationEffect when compensating/compensated, */}
      {/*       shows failure text when failed: `ОШИБКА: ${step.service} вернул исключение`, else step.effect */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {/* TODO: step cards */}
      </div>

      {/* TODO: Effects log — dark block, show only when effects.length > 0 */}
      {/* Line colors: [FAILURE] → red '#fc8181', [COMPENSATED] → orange '#f6ad55', */}
      {/*              [SUCCESS] → green '#68d391', '---' → grey '#718096', else '#a0aec0' */}
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
      {/* If failAtStep === -1: green bg/border, text "Saga выполнена успешно. Все 4 шага зафиксированы." */}
      {/* Else: red bg/border, text */}
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
