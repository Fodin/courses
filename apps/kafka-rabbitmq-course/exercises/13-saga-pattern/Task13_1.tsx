import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 13.1: Saga Choreography
// ============================================================
//
// Goal: implement a Choreography Saga visualizer for an e-commerce order.
// Four services react to each other's events without a central coordinator.
// On failure at any step, compensating events run in reverse order.

// TODO: Define the StepStatus type.
// Values: 'idle' | 'running' | 'success' | 'failed' | 'compensating' | 'compensated'
// type StepStatus = ...

// TODO: Define the ChoreographyStep interface.
// Fields: id: string, service: string, event: string,
//         compensationEvent: string, color: string, status: StepStatus
// interface ChoreographyStep { ... }

// TODO: Declare the INITIAL_STEPS constant — array of 4 steps:
// 1. OrderService:    event 'order.created',       compensation 'order.cancelled',       color '#4f86f7'
// 2. PaymentService:  event 'payment.processed',   compensation 'payment.refunded',      color '#38a169'
// 3. InventoryService: event 'inventory.reserved', compensation 'inventory.released',    color '#ed8936'
// 4. ShippingService: event 'shipping.scheduled',  compensation 'shipping.cancelled',    color '#805ad5'
// const INITIAL_STEPS: ChoreographyStep[] = [...]

// TODO: Declare STATUS_LABELS: Record<StepStatus, string>
// Mappings: idle → 'Ожидание', running → 'Выполняется...', success → 'Успешно',
//           failed → 'Ошибка', compensating → 'Откат...', compensated → 'Откатано'
// const STATUS_LABELS: Record<StepStatus, string> = { ... }

// TODO: Declare STATUS_COLORS: Record<StepStatus, string>
// Colors: idle → '#9ca3af', running → '#f59e0b', success → '#38a169',
//         failed → '#e53e3e', compensating → '#f59e0b', compensated → '#718096'
// const STATUS_COLORS: Record<StepStatus, string> = { ... }

export function Task13_1() {
  const { t } = useLanguage()

  // TODO: Declare state:
  // steps: ChoreographyStep[] (initial value — INITIAL_STEPS)
  // failAt: number (default 2 — fail on InventoryService)
  // running: boolean
  // log: string[]
  // phase: 'idle' | 'forward' | 'compensating' | 'done'
  // abortRef: React.MutableRefObject<boolean> via useRef(false)
  const [steps, setSteps] = useState<any[]>([])
  const [failAt, setFailAt] = useState<number>(2)
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const [phase, setPhase] = useState<string>('idle')
  const abortRef = useRef(false)

  // TODO: Implement the addLog helper: adds a string to the log array
  // const addLog = (msg: string) => setLog(prev => [...prev, msg])

  // TODO: Implement the sleep helper: returns a Promise that resolves after ms milliseconds
  // const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

  // TODO: Implement runSaga:
  // 1. Reset state: abortRef.current = false, setRunning(true), setPhase('forward'),
  //    clear log, reset all steps to 'idle'
  // 2. Forward pass — loop through INITIAL_STEPS with index i:
  //    - if abortRef.current — break
  //    - set steps[i].status = 'running', addLog('[EVENT] {event} опубликовано')
  //    - await sleep(700)
  //    - if i === failAt: status → 'failed', addLog('[ERROR] ... Запуск компенсации...'), save failedAt = i, break
  //    - else: status → 'success', addLog('[OK] ...'), await sleep(300)
  // 3. If failedAt === -1 (no failure): setPhase('done'), addLog('[SAGA] Заказ успешно обработан...'), return
  // 4. Compensation phase: setPhase('compensating'), await sleep(400)
  //    Loop from failedAt - 1 down to 0:
  //    - if abortRef.current — break
  //    - status → 'compensating', addLog('[COMPENSATE] {compensationEvent} опубликовано')
  //    - await sleep(700)
  //    - status → 'compensated', addLog('[OK] {service} выполнил компенсацию')
  //    - await sleep(300)
  // 5. addLog('[SAGA] Компенсация завершена. Система вернулась в исходное состояние.')
  //    setPhase('done'), setRunning(false)
  const runSaga = async () => {
    // TODO: implement
  }

  // TODO: Implement reset:
  // abortRef.current = true, reset steps to INITIAL_STEPS with status 'idle',
  // clear log, setPhase('idle'), setRunning(false)
  const reset = () => {
    // TODO: implement
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.13.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Choreography Saga для e-commerce заказа. Каждый сервис слушает события
        предыдущего и публикует своё. При ошибке — компенсирующие события в обратном порядке.
      </p>

      {/* TODO: Controls row — flex, gap 1rem, marginBottom 1.5rem, flexWrap wrap */}
      {/* Label "Ошибка на шаге:" + <select> with options: */}
      {/*   - value={-1} "Без ошибок (успех)" */}
      {/*   - INITIAL_STEPS.map(...) one option per step showing service name */}
      {/* <select> should be disabled when running */}
      {/* Button "Запустить Saga" / "Сбросить" — toggles based on running state */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* TODO: controls */}
      </div>

      {/* TODO: Horizontal service chain */}
      {/* steps.map((step, idx) => ( */}
      {/*   <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}> */}
      {/*     Service card: border color from STATUS_COLORS[step.status], */}
      {/*       pulse animation dot, service name, current event (compensationEvent when compensating/compensated), */}
      {/*       status label colored by STATUS_COLORS[step.status] */}
      {/*     Arrow between steps: color green on success, red on compensating/compensated, grey otherwise */}
      {/*       Show '←' arrow direction during compensation */}
      {/*   </div> */}
      {/* )) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2rem', overflowX: 'auto' }}>
        {/* TODO: step cards with arrows */}
      </div>

      {/* TODO: Legend row — 2 items: green "Forward path (success)", red "Compensation path (rollback)" */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {/* TODO: legend */}
      </div>

      {/* TODO: Event log — dark block background '#1a1a2e', monospace font */}
      {/* Empty state: "// Нажмите "Запустить Saga" для начала симуляции" in grey */}
      {/* Log lines colored: [ERROR] → red '#fc8181', [COMPENSATE] → orange '#f6ad55', */}
      {/*                    [SAGA] → green '#68d391', else → '#a0aec0' */}
      <div style={{
        background: '#1a1a2e',
        borderRadius: '8px',
        padding: '1rem',
        maxHeight: '200px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.78rem',
        color: '#a0aec0',
      }}>
        {/* TODO: log output */}
      </div>

      {/* TODO: CSS animation for the pulse effect on running/compensating status dots */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
