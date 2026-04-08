import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 13.2: Saga Orchestration
// ============================================================
//
// Goal: implement an Orchestration Saga visualizer with a central
// SagaOrchestrator that sends commands to services and receives replies.
// Visualize as an SVG diagram: orchestrator in the center, services around it.
// Arrows animate between orchestrator and services during execution.

// Reuse StepStatus from task 13.1 (or redeclare here):
// type StepStatus = 'idle' | 'running' | 'success' | 'failed' | 'compensating' | 'compensated'

// TODO: Define the OrchestratorStep interface.
// Fields: id: string, service: string, command: string, reply: string,
//         compensationCommand: string, x: number, y: number, color: string, status: StepStatus
// interface OrchestratorStep { ... }

// TODO: Declare ORCH_STEPS — array of 4 steps (SVG positions for a 500×360 viewBox):
// 1. PaymentService:      command 'ProcessPayment',    reply 'PaymentProcessed',    compensation 'RefundPayment',    x: 60,  y: 80,  color '#38a169'
// 2. InventoryService:    command 'ReserveInventory',  reply 'InventoryReserved',   compensation 'ReleaseInventory', x: 310, y: 80,  color '#ed8936'
// 3. ShippingService:     command 'ScheduleShipping',  reply 'ShippingScheduled',   compensation 'CancelShipping',   x: 60,  y: 250, color '#805ad5'
// 4. NotificationService: command 'SendConfirmation',  reply 'ConfirmationSent',    compensation 'SendCancellation', x: 310, y: 250, color '#e53e3e'
// const ORCH_STEPS: OrchestratorStep[] = [...]

// Orchestrator node position (center of SVG):
// const ORCHESTRATOR = { x: 170, y: 155 }

// TODO: Define the Arrow interface.
// Fields: fromX, fromY, toX, toY: number, color: string, label: string, reverse?: boolean
// interface Arrow { ... }

// STATUS_LABELS and STATUS_COLORS — same as task 13.1

export function Task13_2() {
  const { t } = useLanguage()

  // TODO: Declare state:
  // steps: OrchestratorStep[] (initial: ORCH_STEPS)
  // failAt: number (default 1 — fail on InventoryService)
  // running: boolean
  // currentArrow: Arrow | null
  // log: string[]
  // phase: 'idle' | 'forward' | 'compensating' | 'done'
  // sagaState: string (default 'STARTED') — displayed as a badge
  // abortRef: React.MutableRefObject<boolean>
  const [steps, setSteps] = useState<any[]>([])
  const [failAt, setFailAt] = useState<number>(1)
  const [running, setRunning] = useState(false)
  const [currentArrow, setCurrentArrow] = useState<any>(null)
  const [log, setLog] = useState<string[]>([])
  const [phase, setPhase] = useState<string>('idle')
  const [sagaState, setSagaState] = useState<string>('STARTED')
  const abortRef = useRef(false)

  // Node dimensions for SVG rendering
  const NODE_W = 130
  const NODE_H = 55
  const ORC_W = 120
  const ORC_H = 50

  // TODO: Implement getCenter(x, y, w, h): returns { cx: x + w/2, cy: y + h/2 }
  // const getCenter = (x: number, y: number, w: number, h: number) => ({ cx: ..., cy: ... })

  // TODO: Implement makeArrow(step, label, reverse, color): Arrow
  // When reverse = false: arrow from orchestrator center to step center
  // When reverse = true:  arrow from step center to orchestrator center
  // Use getCenter with ORCHESTRATOR position and ORC_W/ORC_H, and step position and NODE_W/NODE_H
  // const makeArrow = (step: OrchestratorStep, label: string, reverse: boolean, color: string): Arrow => { ... }

  // TODO: Implement runSaga:
  // 1. Reset: abortRef.current = false, setRunning(true), setPhase('forward'),
  //    setLog(['[ORCHESTRATOR] Saga запущена. Шаг 1: обработка платежа']),
  //    setSagaState('STARTED'), reset steps to ORCH_STEPS idle, setCurrentArrow(null)
  // 2. Forward pass for each step (index idx):
  //    - setCurrentArrow(makeArrow(step, step.command, false, '#4f86f7')) — blue command arrow
  //    - status → 'running', addLog('[ORCHESTRATOR] -> {service}: {command}')
  //    - setSagaState('EXECUTING: {command}')
  //    - await sleep(800)
  //    - if idx === failAt:
  //        setCurrentArrow(makeArrow(step, 'ERROR', true, '#e53e3e')) — red error arrow
  //        status → 'failed', addLog('[ERROR] {service} вернул ошибку! Компенсация...')
  //        setSagaState('COMPENSATING'), failedAt = idx, await sleep(600), break
  //    - else:
  //        setCurrentArrow(makeArrow(step, step.reply, true, '#38a169')) — green reply arrow
  //        status → 'success', addLog('[OK] {service} -> Orchestrator: {reply}')
  //        await sleep(600)
  // 3. If failedAt === -1: setCurrentArrow(null), setSagaState('COMPLETED'),
  //    addLog('[ORCHESTRATOR] Saga завершена успешно!'), setPhase('done'), setRunning(false), return
  // 4. Compensation: setPhase('compensating')
  //    Loop from failedAt - 1 down to 0:
  //    - makeArrow orange with compensationCommand (forward direction)
  //    - status → 'compensating', addLog('[COMPENSATE] Orchestrator -> {service}: {compensationCommand}')
  //    - await sleep(800)
  //    - makeArrow grey with 'ACK' (reverse direction)
  //    - status → 'compensated', addLog('[ACK] {service} компенсация выполнена')
  //    - await sleep(400)
  // 5. setCurrentArrow(null), setSagaState('ROLLED_BACK'), addLog('[ORCHESTRATOR] Rollback завершён.')
  //    setPhase('done'), setRunning(false)
  const runSaga = async () => {
    // TODO: implement
  }

  // TODO: Implement reset:
  // abortRef.current = true, reset steps, clear arrow and log,
  // setPhase('idle'), setSagaState('STARTED'), setRunning(false)
  const reset = () => {
    // TODO: implement
  }

  const SVG_W = 500
  const SVG_H = 360

  return (
    <div className="exercise-container">
      <h2>{t('task.13.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Orchestration Saga: центральный оркестратор управляет всеми шагами,
        отправляет команды и получает ответы. При ошибке — оркестратор сам
        инициирует компенсирующие команды в обратном порядке.
      </p>

      {/* TODO: Controls — flex row with: */}
      {/* label "Ошибка в сервисе:", <select> (disabled when running) with "Без ошибок" + ORCH_STEPS options */}
      {/* button "Запустить" / "Сбросить" */}
      {/* sagaState badge — background changes: compensating → pink, done → green, else blue */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* TODO: controls and badge */}
      </div>

      {/* TODO: SVG diagram */}
      {/* viewBox={`0 0 ${SVG_W} ${SVG_H}`}, border, borderRadius, background '#fafafa' */}
      {/* Elements: */}
      {/* 1. Animated arrow (currentArrow): <line> with strokeDasharray="6 3" and 'dashMove' animation */}
      {/* 2. Arrow label: <text> at midpoint of line, above it (y - 6) */}
      {/* 3. Orchestrator rectangle: x=ORCHESTRATOR.x, y=ORCHESTRATOR.y, w=ORC_W, h=ORC_H */}
      {/*    fill changes by phase; stroke '#4f86f7'; labels: "Orchestrator" + "SagaCoordinator" */}
      {/* 4. Service nodes: steps.map — rect colored by STATUS_COLORS, service name, status label */}
      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ border: '1px solid #eee', borderRadius: '12px', background: '#fafafa', maxHeight: '360px', marginBottom: '1rem' }}
      >
        {/* TODO: SVG elements */}
      </svg>

      {/* TODO: Event log — dark block */}
      {/* Empty state text, lines colored: [ERROR] red, [COMPENSATE] orange, [ORCHESTRATOR] cyan '#90cdf4', [OK] green, else grey */}
      <div style={{
        background: '#1a1a2e',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        maxHeight: '160px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.75rem',
        color: '#a0aec0',
      }}>
        {/* TODO: log output */}
      </div>

      {/* TODO: CSS animation for dashed arrow movement */}
      <style>{`
        @keyframes dashMove {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -18; }
        }
      `}</style>
    </div>
  )
}
