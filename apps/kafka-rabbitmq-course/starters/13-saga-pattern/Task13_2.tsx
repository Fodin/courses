import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 13.2: Saga Orchestration
// Task 13.2: Saga Orchestration
// ============================================================
//
// Goal: implement an Orchestration Saga visualizer with a central
// SagaOrchestrator that sends commands to services and receives replies.
// Visualize as an SVG diagram: orchestrator in the center, services around it.
// Arrows animate between orchestrator and services during execution.

// Reuse StepStatus from task 13.1 (or redeclare here):
// type StepStatus = 'idle' | 'running' | 'success' | 'failed' | 'compensating' | 'compensated'

// TODO: Define the OrchestratorStep interface.
// TODO: Определите интерфейс OrchestratorStep.
// Fields: id: string, service: string, command: string, reply: string,
//         compensationCommand: string, x: number, y: number, color: string, status: StepStatus
// Поля: id: string, service: string, command: string, reply: string,
//       compensationCommand: string, x: number, y: number, color: string, status: StepStatus
// interface OrchestratorStep { ... }

// TODO: Declare ORCH_STEPS — array of 4 steps (SVG positions for a 500×360 viewBox):
// TODO: Объявите ORCH_STEPS — массив из 4 шагов (SVG-позиции для viewBox 500×360):
// 1. PaymentService:      command 'ProcessPayment',    reply 'PaymentProcessed',    compensation 'RefundPayment',    x: 60,  y: 80,  color '#38a169'
// 2. InventoryService:    command 'ReserveInventory',  reply 'InventoryReserved',   compensation 'ReleaseInventory', x: 310, y: 80,  color '#ed8936'
// 3. ShippingService:     command 'ScheduleShipping',  reply 'ShippingScheduled',   compensation 'CancelShipping',   x: 60,  y: 250, color '#805ad5'
// 4. NotificationService: command 'SendConfirmation',  reply 'ConfirmationSent',    compensation 'SendCancellation', x: 310, y: 250, color '#e53e3e'
// const ORCH_STEPS: OrchestratorStep[] = [...]

// Orchestrator node position (center of SVG):
// Позиция узла оркестратора (центр SVG):
// const ORCHESTRATOR = { x: 170, y: 155 }

// TODO: Define the Arrow interface.
// TODO: Определите интерфейс Arrow.
// Fields: fromX, fromY, toX, toY: number, color: string, label: string, reverse?: boolean
// Поля: fromX, fromY, toX, toY: number, color: string, label: string, reverse?: boolean
// interface Arrow { ... }

// STATUS_LABELS and STATUS_COLORS — same as task 13.1
// STATUS_LABELS и STATUS_COLORS — те же, что в задании 13.1

export function Task13_2() {
  const { t } = useLanguage()

  // TODO: Declare state:
  // TODO: Объявите состояние:
  // steps: OrchestratorStep[] (initial: ORCH_STEPS)
  // steps: OrchestratorStep[] (начальное: ORCH_STEPS)
  // failAt: number (default 1 — fail on InventoryService)
  // failAt: number (по умолчанию 1 — ошибка на InventoryService)
  // running: boolean
  // currentArrow: Arrow | null
  // log: string[]
  // phase: 'idle' | 'forward' | 'compensating' | 'done'
  // sagaState: string (default 'STARTED') — displayed as a badge
  // sagaState: string (по умолчанию 'STARTED') — отображается как бейдж
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
  // Размеры узлов для SVG-рендеринга
  const NODE_W = 130
  const NODE_H = 55
  const ORC_W = 120
  const ORC_H = 50

  // TODO: Implement getCenter(x, y, w, h): returns { cx: x + w/2, cy: y + h/2 }
  // TODO: Реализуйте getCenter(x, y, w, h): возвращает { cx: x + w/2, cy: y + h/2 }
  // const getCenter = (x: number, y: number, w: number, h: number) => ({ cx: ..., cy: ... })

  // TODO: Implement makeArrow(step, label, reverse, color): Arrow
  // TODO: Реализуйте makeArrow(step, label, reverse, color): Arrow
  // When reverse = false: arrow from orchestrator center to step center
  // При reverse = false: стрелка от центра оркестратора к центру шага
  // When reverse = true:  arrow from step center to orchestrator center
  // При reverse = true:  стрелка от центра шага к центру оркестратора
  // Use getCenter with ORCHESTRATOR position and ORC_W/ORC_H, and step position and NODE_W/NODE_H
  // Используйте getCenter с позицией ORCHESTRATOR и ORC_W/ORC_H, и позицией шага и NODE_W/NODE_H
  // const makeArrow = (step: OrchestratorStep, label: string, reverse: boolean, color: string): Arrow => { ... }

  // TODO: Implement runSaga:
  // TODO: Реализуйте runSaga:
  // 1. Reset: abortRef.current = false, setRunning(true), setPhase('forward'),
  //    setLog(['[ORCHESTRATOR] Saga запущена. Шаг 1: обработка платежа']),
  //    setSagaState('STARTED'), reset steps to ORCH_STEPS idle, setCurrentArrow(null)
  // 1. Сброс: abortRef.current = false, setRunning(true), setPhase('forward'),
  //    setLog(['[ORCHESTRATOR] Saga запущена. Шаг 1: обработка платежа']),
  //    setSagaState('STARTED'), сбросить steps в ORCH_STEPS idle, setCurrentArrow(null)
  // 2. Forward pass for each step (index idx):
  // 2. Прямой проход для каждого шага (индекс idx):
  //    - setCurrentArrow(makeArrow(step, step.command, false, '#4f86f7')) — blue command arrow
  //    - setCurrentArrow(makeArrow(step, step.command, false, '#4f86f7')) — синяя стрелка команды
  //    - status → 'running', addLog('[ORCHESTRATOR] -> {service}: {command}')
  //    - setSagaState('EXECUTING: {command}')
  //    - await sleep(800)
  //    - if idx === failAt:
  //        setCurrentArrow(makeArrow(step, 'ERROR', true, '#e53e3e')) — red error arrow
  //        setCurrentArrow(makeArrow(step, 'ERROR', true, '#e53e3e')) — красная стрелка ошибки
  //        status → 'failed', addLog('[ERROR] {service} вернул ошибку! Компенсация...')
  //        status → 'failed', addLog('[ERROR] {service} returned error! Compensating...')
  //        setSagaState('COMPENSATING'), failedAt = idx, await sleep(600), break
  //    - else:
  //        setCurrentArrow(makeArrow(step, step.reply, true, '#38a169')) — green reply arrow
  //        setCurrentArrow(makeArrow(step, step.reply, true, '#38a169')) — зелёная стрелка ответа
  //        status → 'success', addLog('[OK] {service} -> Orchestrator: {reply}')
  //        await sleep(600)
  // 3. If failedAt === -1: setCurrentArrow(null), setSagaState('COMPLETED'),
  //    addLog('[ORCHESTRATOR] Saga завершена успешно!'), setPhase('done'), setRunning(false), return
  // 3. Если failedAt === -1: setCurrentArrow(null), setSagaState('COMPLETED'),
  //    addLog('[ORCHESTRATOR] Saga completed successfully!'), setPhase('done'), setRunning(false), return
  // 4. Compensation: setPhase('compensating')
  // 4. Компенсация: setPhase('compensating')
  //    Loop from failedAt - 1 down to 0:
  //    Цикл от failedAt - 1 до 0:
  //    - makeArrow orange with compensationCommand (forward direction)
  //    - makeArrow оранжевая с compensationCommand (прямое направление)
  //    - status → 'compensating', addLog('[COMPENSATE] Orchestrator -> {service}: {compensationCommand}')
  //    - await sleep(800)
  //    - makeArrow grey with 'ACK' (reverse direction)
  //    - makeArrow серая с 'ACK' (обратное направление)
  //    - status → 'compensated', addLog('[ACK] {service} компенсация выполнена')
  //    - status → 'compensated', addLog('[ACK] {service} compensation completed')
  //    - await sleep(400)
  // 5. setCurrentArrow(null), setSagaState('ROLLED_BACK'), addLog('[ORCHESTRATOR] Rollback завершён.')
  // 5. setCurrentArrow(null), setSagaState('ROLLED_BACK'), addLog('[ORCHESTRATOR] Rollback completed.')
  //    setPhase('done'), setRunning(false)
  const runSaga = async () => {
    // TODO: implement
  }

  // TODO: Implement reset:
  // TODO: Реализуйте reset:
  // abortRef.current = true, reset steps, clear arrow and log,
  // abortRef.current = true, сбросить steps, очистить стрелку и лог,
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
      {/* TODO: Элементы управления — flex-строка с: */}
      {/* label "Ошибка в сервисе:", <select> (disabled when running) with "Без ошибок" + ORCH_STEPS options */}
      {/* метка "Ошибка в сервисе:", <select> (отключён когда running) с "Без ошибок" + варианты ORCH_STEPS */}
      {/* button "Запустить" / "Сбросить" */}
      {/* кнопка "Запустить" / "Сбросить" */}
      {/* sagaState badge — background changes: compensating → pink, done → green, else blue */}
      {/* бейдж sagaState — фон меняется: compensating → розовый, done → зелёный, иначе синий */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* TODO: controls and badge */}
      </div>

      {/* TODO: SVG diagram */}
      {/* TODO: SVG-диаграмма */}
      {/* viewBox={`0 0 ${SVG_W} ${SVG_H}`}, border, borderRadius, background '#fafafa' */}
      {/* Elements: */}
      {/* Элементы: */}
      {/* 1. Animated arrow (currentArrow): <line> with strokeDasharray="6 3" and 'dashMove' animation */}
      {/* 1. Анимированная стрелка (currentArrow): <line> с strokeDasharray="6 3" и анимацией 'dashMove' */}
      {/* 2. Arrow label: <text> at midpoint of line, above it (y - 6) */}
      {/* 2. Метка стрелки: <text> в середине линии, выше неё (y - 6) */}
      {/* 3. Orchestrator rectangle: x=ORCHESTRATOR.x, y=ORCHESTRATOR.y, w=ORC_W, h=ORC_H */}
      {/*    fill changes by phase; stroke '#4f86f7'; labels: "Orchestrator" + "SagaCoordinator" */}
      {/* 3. Прямоугольник оркестратора: x=ORCHESTRATOR.x, y=ORCHESTRATOR.y, w=ORC_W, h=ORC_H */}
      {/*    fill меняется по фазе; stroke '#4f86f7'; метки: "Orchestrator" + "SagaCoordinator" */}
      {/* 4. Service nodes: steps.map — rect colored by STATUS_COLORS, service name, status label */}
      {/* 4. Узлы сервисов: steps.map — rect, окрашенный в STATUS_COLORS, имя сервиса, метка статуса */}
      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ border: '1px solid #eee', borderRadius: '12px', background: '#fafafa', maxHeight: '360px', marginBottom: '1rem' }}
      >
        {/* TODO: SVG elements */}
      </svg>

      {/* TODO: Event log — dark block */}
      {/* TODO: Лог событий — тёмный блок */}
      {/* Empty state text, lines colored: [ERROR] red, [COMPENSATE] orange, [ORCHESTRATOR] cyan '#90cdf4', [OK] green, else grey */}
      {/* Текст пустого состояния, строки окрашены: [ERROR] красный, [COMPENSATE] оранжевый, [ORCHESTRATOR] голубой '#90cdf4', [OK] зелёный, иначе серый */}
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
