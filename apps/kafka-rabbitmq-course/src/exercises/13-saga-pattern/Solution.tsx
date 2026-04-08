import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 13.1: Saga Choreography
// ============================================

type StepStatus = 'idle' | 'running' | 'success' | 'failed' | 'compensating' | 'compensated'

interface ChoreographyStep {
  id: string
  service: string
  event: string
  compensationEvent: string
  color: string
  status: StepStatus
}

const INITIAL_STEPS: ChoreographyStep[] = [
  {
    id: 'order',
    service: 'OrderService',
    event: 'order.created',
    compensationEvent: 'order.cancelled',
    color: '#4f86f7',
    status: 'idle',
  },
  {
    id: 'payment',
    service: 'PaymentService',
    event: 'payment.processed',
    compensationEvent: 'payment.refunded',
    color: '#38a169',
    status: 'idle',
  },
  {
    id: 'inventory',
    service: 'InventoryService',
    event: 'inventory.reserved',
    compensationEvent: 'inventory.released',
    color: '#ed8936',
    status: 'idle',
  },
  {
    id: 'shipping',
    service: 'ShippingService',
    event: 'shipping.scheduled',
    compensationEvent: 'shipping.cancelled',
    color: '#805ad5',
    status: 'idle',
  },
]

const STATUS_LABELS: Record<StepStatus, string> = {
  idle: 'Ожидание',
  running: 'Выполняется...',
  success: 'Успешно',
  failed: 'Ошибка',
  compensating: 'Откат...',
  compensated: 'Откатано',
}

const STATUS_COLORS: Record<StepStatus, string> = {
  idle: '#9ca3af',
  running: '#f59e0b',
  success: '#38a169',
  failed: '#e53e3e',
  compensating: '#f59e0b',
  compensated: '#718096',
}

export function Task13_1_Solution() {
  const { t } = useLanguage()
  const [steps, setSteps] = useState<ChoreographyStep[]>(INITIAL_STEPS)
  const [failAt, setFailAt] = useState<number>(2)
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const [phase, setPhase] = useState<'idle' | 'forward' | 'compensating' | 'done'>('idle')
  const abortRef = useRef(false)

  const addLog = (msg: string) => setLog(prev => [...prev, msg])

  const sleep = (ms: number) => new Promise<void>(resolve => {
    const timer = setTimeout(resolve, ms)
    return () => clearTimeout(timer)
  })

  const runSaga = async () => {
    abortRef.current = false
    setRunning(true)
    setPhase('forward')
    setLog([])
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'idle' })))

    let failedAt = -1

    for (let i = 0; i < INITIAL_STEPS.length; i++) {
      if (abortRef.current) break

      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s))
      addLog(`[EVENT] ${INITIAL_STEPS[i].event} опубликовано`)
      await sleep(700)

      if (i === failAt) {
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'failed' } : s))
        addLog(`[ERROR] ${INITIAL_STEPS[i].service} вернул ошибку! Запуск компенсации...`)
        failedAt = i
        break
      } else {
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'success' } : s))
        addLog(`[OK] ${INITIAL_STEPS[i].service} обработал событие`)
        await sleep(300)
      }
    }

    if (failedAt === -1) {
      setPhase('done')
      addLog('[SAGA] Заказ успешно обработан всеми сервисами!')
      setRunning(false)
      return
    }

    // Компенсация в обратном порядке
    setPhase('compensating')
    await sleep(400)

    for (let i = failedAt - 1; i >= 0; i--) {
      if (abortRef.current) break

      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'compensating' } : s))
      addLog(`[COMPENSATE] ${INITIAL_STEPS[i].compensationEvent} опубликовано`)
      await sleep(700)

      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'compensated' } : s))
      addLog(`[OK] ${INITIAL_STEPS[i].service} выполнил компенсацию`)
      await sleep(300)
    }

    addLog('[SAGA] Компенсация завершена. Система вернулась в исходное состояние.')
    setPhase('done')
    setRunning(false)
  }

  const reset = () => {
    abortRef.current = true
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'idle' })))
    setLog([])
    setPhase('idle')
    setRunning(false)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.13.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Choreography Saga для e-commerce заказа. Каждый сервис слушает события
        предыдущего и публикует своё. При ошибке — компенсирующие события в обратном порядке.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ошибка на шаге:</label>
        <select
          value={failAt}
          onChange={e => setFailAt(Number(e.target.value))}
          disabled={running}
          style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}
        >
          <option value={-1}>Без ошибок (успех)</option>
          {INITIAL_STEPS.map((s, i) => (
            <option key={s.id} value={i}>{s.service}</option>
          ))}
        </select>

        <button
          onClick={running ? reset : runSaga}
          style={{
            padding: '0.5rem 1.25rem',
            background: running ? '#718096' : '#4f86f7',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {running ? 'Сбросить' : 'Запустить Saga'}
        </button>
      </div>

      {/* Цепочка сервисов */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2rem', overflowX: 'auto' }}>
        {steps.map((step, idx) => (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              border: `2px solid ${step.status === 'idle' ? '#e2e8f0' : STATUS_COLORS[step.status]}`,
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              minWidth: '130px',
              textAlign: 'center',
              background: step.status === 'idle' ? '#fafafa' : `${STATUS_COLORS[step.status]}12`,
              transition: 'all 0.3s ease',
              position: 'relative',
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: STATUS_COLORS[step.status],
                margin: '0 auto 0.4rem',
                transition: 'background 0.3s ease',
                animation: step.status === 'running' || step.status === 'compensating'
                  ? 'pulse 0.8s ease-in-out infinite' : 'none',
              }} />
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#333', marginBottom: '0.25rem' }}>
                {step.service}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#888', marginBottom: '0.3rem' }}>
                {step.status === 'compensated' || step.status === 'compensating'
                  ? step.compensationEvent
                  : step.event}
              </div>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: STATUS_COLORS[step.status],
              }}>
                {STATUS_LABELS[step.status]}
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0 4px',
              }}>
                <div style={{
                  width: '32px',
                  height: '2px',
                  background: phase === 'compensating' && steps[idx].status === 'compensating'
                    ? '#e53e3e'
                    : steps[idx].status === 'success' ? '#38a169' : '#e2e8f0',
                  transition: 'background 0.3s ease',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    right: '-4px',
                    top: '-4px',
                    fontSize: '0.6rem',
                    color: steps[idx].status === 'success' ? '#38a169' : '#e2e8f0',
                  }}>
                    {phase === 'compensating' && (steps[idx].status === 'compensating' || steps[idx].status === 'compensated') ? '←' : '→'}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Легенда */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {([['#38a169', 'Forward path (success)'], ['#e53e3e', 'Compensation path (rollback)']] as const).map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '24px', height: '3px', background: color, borderRadius: '2px' }} />
            <span style={{ fontSize: '0.78rem', color: '#555' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Лог событий */}
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
        {log.length === 0
          ? <span style={{ color: '#4a5568' }}>// Нажмите "Запустить Saga" для начала симуляции</span>
          : log.map((line, i) => (
            <div key={i} style={{
              color: line.startsWith('[ERROR]') ? '#fc8181'
                : line.startsWith('[COMPENSATE]') ? '#f6ad55'
                : line.startsWith('[SAGA]') ? '#68d391'
                : '#a0aec0',
              marginBottom: '0.15rem',
            }}>
              {line}
            </div>
          ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}

// ============================================
// Задание 13.2: Saga Orchestration
// ============================================

interface OrchestratorStep {
  id: string
  service: string
  command: string
  reply: string
  compensationCommand: string
  x: number
  y: number
  color: string
  status: StepStatus
}

const ORCH_STEPS: OrchestratorStep[] = [
  {
    id: 'payment',
    service: 'PaymentService',
    command: 'ProcessPayment',
    reply: 'PaymentProcessed',
    compensationCommand: 'RefundPayment',
    x: 60,
    y: 80,
    color: '#38a169',
    status: 'idle',
  },
  {
    id: 'inventory',
    service: 'InventoryService',
    command: 'ReserveInventory',
    reply: 'InventoryReserved',
    compensationCommand: 'ReleaseInventory',
    x: 310,
    y: 80,
    color: '#ed8936',
    status: 'idle',
  },
  {
    id: 'shipping',
    service: 'ShippingService',
    command: 'ScheduleShipping',
    reply: 'ShippingScheduled',
    compensationCommand: 'CancelShipping',
    x: 60,
    y: 250,
    color: '#805ad5',
    status: 'idle',
  },
  {
    id: 'notification',
    service: 'NotificationService',
    command: 'SendConfirmation',
    reply: 'ConfirmationSent',
    compensationCommand: 'SendCancellation',
    x: 310,
    y: 250,
    color: '#e53e3e',
    status: 'idle',
  },
]

const ORCHESTRATOR = { x: 170, y: 155 }

interface Arrow {
  fromX: number
  fromY: number
  toX: number
  toY: number
  color: string
  label: string
  reverse?: boolean
}

export function Task13_2_Solution() {
  const { t } = useLanguage()
  const [steps, setSteps] = useState<OrchestratorStep[]>(ORCH_STEPS)
  const [failAt, setFailAt] = useState<number>(1)
  const [running, setRunning] = useState(false)
  const [currentArrow, setCurrentArrow] = useState<Arrow | null>(null)
  const [log, setLog] = useState<string[]>([])
  const [phase, setPhase] = useState<'idle' | 'forward' | 'compensating' | 'done'>('idle')
  const [sagaState, setSagaState] = useState<string>('STARTED')
  const abortRef = useRef(false)

  const addLog = (msg: string) => setLog(prev => [...prev, msg])
  const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

  const NODE_W = 130
  const NODE_H = 55
  const ORC_W = 120
  const ORC_H = 50

  const getCenter = (x: number, y: number, w: number, h: number) => ({
    cx: x + w / 2,
    cy: y + h / 2,
  })

  const makeArrow = (
    step: OrchestratorStep,
    label: string,
    reverse: boolean,
    color: string
  ): Arrow => {
    const from = getCenter(ORCHESTRATOR.x, ORCHESTRATOR.y, ORC_W, ORC_H)
    const to = getCenter(step.x, step.y, NODE_W, NODE_H)
    return reverse
      ? { fromX: to.cx, fromY: to.cy, toX: from.cx, toY: from.cy, color, label, reverse: true }
      : { fromX: from.cx, fromY: from.cy, toX: to.cx, toY: to.cy, color, label }
  }

  const runSaga = async () => {
    abortRef.current = false
    setRunning(true)
    setPhase('forward')
    setLog(['[ORCHESTRATOR] Saga запущена. Шаг 1: обработка платежа'])
    setSagaState('STARTED')
    setSteps(ORCH_STEPS.map(s => ({ ...s, status: 'idle' })))
    setCurrentArrow(null)

    const executionOrder = [0, 1, 2, 3]
    let failedAt = -1

    for (const idx of executionOrder) {
      if (abortRef.current) break
      const step = ORCH_STEPS[idx]

      // Команда от оркестратора к сервису
      setCurrentArrow(makeArrow(step, step.command, false, '#4f86f7'))
      setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status: 'running' } : s))
      addLog(`[ORCHESTRATOR] -> ${step.service}: ${step.command}`)
      setSagaState(`EXECUTING: ${step.command}`)
      await sleep(800)

      if (idx === failAt) {
        // Сервис вернул ошибку
        setCurrentArrow(makeArrow(step, 'ERROR', true, '#e53e3e'))
        setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status: 'failed' } : s))
        addLog(`[ERROR] ${step.service} вернул ошибку! Компенсация...`)
        setSagaState('COMPENSATING')
        failedAt = idx
        await sleep(600)
        break
      }

      // Успешный ответ
      setCurrentArrow(makeArrow(step, step.reply, true, '#38a169'))
      setSteps(prev => prev.map((s, i) => i === idx ? { ...s, status: 'success' } : s))
      addLog(`[OK] ${step.service} -> Orchestrator: ${step.reply}`)
      await sleep(600)
    }

    if (failedAt === -1) {
      setCurrentArrow(null)
      setSagaState('COMPLETED')
      addLog('[ORCHESTRATOR] Saga завершена успешно!')
      setPhase('done')
      setRunning(false)
      return
    }

    // Компенсация
    setPhase('compensating')
    for (let i = failedAt - 1; i >= 0; i--) {
      if (abortRef.current) break
      const step = ORCH_STEPS[i]

      setCurrentArrow(makeArrow(step, step.compensationCommand, false, '#f59e0b'))
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'compensating' } : s))
      addLog(`[COMPENSATE] Orchestrator -> ${step.service}: ${step.compensationCommand}`)
      await sleep(800)

      setCurrentArrow(makeArrow(step, 'ACK', true, '#718096'))
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'compensated' } : s))
      addLog(`[ACK] ${step.service} компенсация выполнена`)
      await sleep(400)
    }

    setCurrentArrow(null)
    setSagaState('ROLLED_BACK')
    addLog('[ORCHESTRATOR] Rollback завершён.')
    setPhase('done')
    setRunning(false)
  }

  const reset = () => {
    abortRef.current = true
    setSteps(ORCH_STEPS.map(s => ({ ...s, status: 'idle' })))
    setCurrentArrow(null)
    setLog([])
    setPhase('idle')
    setSagaState('STARTED')
    setRunning(false)
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ошибка в сервисе:</label>
        <select
          value={failAt}
          onChange={e => setFailAt(Number(e.target.value))}
          disabled={running}
          style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #ddd' }}
        >
          <option value={-1}>Без ошибок</option>
          {ORCH_STEPS.map((s, i) => (
            <option key={s.id} value={i}>{s.service}</option>
          ))}
        </select>

        <button
          onClick={running ? reset : runSaga}
          style={{
            padding: '0.5rem 1.25rem',
            background: running ? '#718096' : '#4f86f7',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {running ? 'Сбросить' : 'Запустить'}
        </button>

        <div style={{
          padding: '0.3rem 0.75rem',
          background: phase === 'compensating' ? '#fff5f0' : phase === 'done' ? '#f0fff4' : '#f0f4ff',
          border: `1px solid ${phase === 'compensating' ? '#fc8181' : phase === 'done' ? '#68d391' : '#90cdf4'}`,
          borderRadius: '6px',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: phase === 'compensating' ? '#c53030' : phase === 'done' ? '#276749' : '#2b6cb0',
        }}>
          {sagaState}
        </div>
      </div>

      {/* SVG диаграмма */}
      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ border: '1px solid #eee', borderRadius: '12px', background: '#fafafa', maxHeight: '360px', marginBottom: '1rem' }}
      >
        {/* Стрелка анимированная */}
        {currentArrow && (
          <line
            x1={currentArrow.fromX}
            y1={currentArrow.fromY}
            x2={currentArrow.toX}
            y2={currentArrow.toY}
            stroke={currentArrow.color}
            strokeWidth={2.5}
            strokeDasharray="6 3"
            style={{ animation: 'dashMove 0.4s linear infinite' }}
          />
        )}
        {currentArrow && (
          <text
            x={(currentArrow.fromX + currentArrow.toX) / 2}
            y={(currentArrow.fromY + currentArrow.toY) / 2 - 6}
            textAnchor="middle"
            fontSize={10}
            fill={currentArrow.color}
            fontWeight={600}
          >
            {currentArrow.label}
          </text>
        )}

        {/* Оркестратор */}
        <rect
          x={ORCHESTRATOR.x}
          y={ORCHESTRATOR.y}
          width={ORC_W}
          height={ORC_H}
          rx={10}
          fill={phase === 'compensating' ? '#fff5f5' : phase === 'done' && sagaState === 'COMPLETED' ? '#f0fff4' : '#ebf4ff'}
          stroke={phase === 'compensating' ? '#e53e3e' : '#4f86f7'}
          strokeWidth={2.5}
          style={{ transition: 'all 0.3s ease' }}
        />
        <text x={ORCHESTRATOR.x + ORC_W / 2} y={ORCHESTRATOR.y + 20} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2b6cb0">
          Orchestrator
        </text>
        <text x={ORCHESTRATOR.x + ORC_W / 2} y={ORCHESTRATOR.y + 36} textAnchor="middle" fontSize={9} fill="#718096">
          SagaCoordinator
        </text>

        {/* Сервисы */}
        {steps.map(step => (
          <g key={step.id}>
            <rect
              x={step.x}
              y={step.y}
              width={NODE_W}
              height={NODE_H}
              rx={8}
              fill={step.status === 'idle' ? '#fff'
                : step.status === 'success' ? `${step.color}15`
                : step.status === 'failed' ? '#fff5f5'
                : step.status === 'compensated' ? '#f7fafc'
                : `${step.color}10`}
              stroke={STATUS_COLORS[step.status]}
              strokeWidth={step.status !== 'idle' ? 2 : 1.5}
              style={{ transition: 'all 0.3s ease' }}
            />
            <text x={step.x + NODE_W / 2} y={step.y + 20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#333">
              {step.service}
            </text>
            <text x={step.x + NODE_W / 2} y={step.y + 36} textAnchor="middle" fontSize={9} fill={STATUS_COLORS[step.status]}>
              {STATUS_LABELS[step.status]}
            </text>
          </g>
        ))}
      </svg>

      {/* Лог */}
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
        {log.length === 0
          ? <span style={{ color: '#4a5568' }}>// Нажмите "Запустить" для симуляции оркестрации</span>
          : log.map((line, i) => (
            <div key={i} style={{
              color: line.startsWith('[ERROR]') ? '#fc8181'
                : line.startsWith('[COMPENSATE]') ? '#f6ad55'
                : line.startsWith('[ORCHESTRATOR]') ? '#90cdf4'
                : line.startsWith('[OK]') ? '#68d391'
                : '#a0aec0',
              marginBottom: '0.15rem',
            }}>
              {line}
            </div>
          ))}
      </div>

      <style>{`
        @keyframes dashMove {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -18; }
        }
      `}</style>
    </div>
  )
}

// ============================================
// Задание 13.3: Компенсирующие действия
// ============================================

interface CompensationStep {
  id: string
  stepNumber: number
  service: string
  action: string
  compensationAction: string
  effect: string
  compensationEffect: string
  color: string
  status: 'idle' | 'done' | 'failed' | 'compensating' | 'compensated'
}

const COMP_STEPS: CompensationStep[] = [
  {
    id: 'order',
    stepNumber: 1,
    service: 'OrderService',
    action: 'Создать заказ',
    compensationAction: 'Отменить заказ',
    effect: 'ORDER #1234 создан, статус: PENDING',
    compensationEffect: 'ORDER #1234 отменён, статус: CANCELLED',
    color: '#4f86f7',
    status: 'idle',
  },
  {
    id: 'payment',
    stepNumber: 2,
    service: 'PaymentService',
    action: 'Списать средства',
    compensationAction: 'Вернуть средства',
    effect: '$99.99 списано с карты *1234',
    compensationEffect: '$99.99 возвращено на карту *1234',
    color: '#38a169',
    status: 'idle',
  },
  {
    id: 'inventory',
    stepNumber: 3,
    service: 'InventoryService',
    action: 'Зарезервировать товар',
    compensationAction: 'Снять резервирование',
    effect: 'SKU-555 зарезервирован (остаток: 9)',
    compensationEffect: 'SKU-555 освобождён (остаток: 10)',
    color: '#ed8936',
    status: 'idle',
  },
  {
    id: 'shipping',
    stepNumber: 4,
    service: 'ShippingService',
    action: 'Создать доставку',
    compensationAction: 'Отменить доставку',
    effect: 'Delivery #D789 создана в системе',
    compensationEffect: 'Delivery #D789 отменена',
    color: '#805ad5',
    status: 'idle',
  },
]

export function Task13_3_Solution() {
  const { t } = useLanguage()
  const [steps, setSteps] = useState<CompensationStep[]>(COMP_STEPS)
  const [failAtStep, setFailAtStep] = useState<number>(2)
  const [running, setRunning] = useState(false)
  const [effects, setEffects] = useState<string[]>([])
  const [phase, setPhase] = useState<'idle' | 'forward' | 'compensating' | 'done'>('idle')
  const abortRef = useRef(false)

  const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

  const runSimulation = async () => {
    abortRef.current = false
    setRunning(true)
    setPhase('forward')
    setEffects([])
    setSteps(COMP_STEPS.map(s => ({ ...s, status: 'idle' })))

    let failedAt = -1

    for (let i = 0; i < COMP_STEPS.length; i++) {
      if (abortRef.current) break
      const step = COMP_STEPS[i]

      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'done' } : s))

      if (i === failAtStep) {
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'failed' } : s))
        setEffects(prev => [...prev, `[FAILURE] Шаг ${step.stepNumber}: ${step.service} - ошибка выполнения`])
        failedAt = i
        await sleep(500)
        break
      }

      setEffects(prev => [...prev, `[DONE] Шаг ${step.stepNumber}: ${step.effect}`])
      await sleep(600)
    }

    if (failedAt === -1) {
      setPhase('done')
      setEffects(prev => [...prev, '[SUCCESS] Все шаги выполнены успешно!'])
      setRunning(false)
      return
    }

    setPhase('compensating')
    setEffects(prev => [...prev, '--- Начало компенсации (в обратном порядке) ---'])
    await sleep(400)

    for (let i = failedAt - 1; i >= 0; i--) {
      if (abortRef.current) break
      const step = COMP_STEPS[i]

      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'compensating' } : s))
      await sleep(700)

      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'compensated' } : s))
      setEffects(prev => [...prev, `[COMPENSATED] Шаг ${step.stepNumber}: ${step.compensationEffect}`])
      await sleep(400)
    }

    setEffects(prev => [...prev, '--- Компенсация завершена. Данные восстановлены ---'])
    setPhase('done')
    setRunning(false)
  }

  const reset = () => {
    abortRef.current = true
    setSteps(COMP_STEPS.map(s => ({ ...s, status: 'idle' })))
    setEffects([])
    setPhase('idle')
    setRunning(false)
  }

  const getStepBg = (status: CompensationStep['status'], color: string) => {
    if (status === 'idle') return '#fafafa'
    if (status === 'done') return `${color}12`
    if (status === 'failed') return '#fff5f5'
    if (status === 'compensating') return '#fffbf0'
    if (status === 'compensated') return '#f7f8fa'
    return '#fff'
  }

  const getStepBorderColor = (status: CompensationStep['status'], color: string) => {
    if (status === 'idle') return '#e2e8f0'
    if (status === 'done') return color
    if (status === 'failed') return '#e53e3e'
    if (status === 'compensating') return '#f59e0b'
    if (status === 'compensated') return '#9ca3af'
    return '#e2e8f0'
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.13.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Симулятор компенсирующих действий. Выберите шаг, который упадёт, —
        и наблюдайте, как система в обратном порядке отменяет уже совершённые действия.
      </p>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 600 }}>Падает шаг:</label>
        {COMP_STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => !running && setFailAtStep(i)}
            disabled={running}
            style={{
              padding: '0.35rem 0.75rem',
              border: `2px solid ${failAtStep === i ? '#e53e3e' : '#e2e8f0'}`,
              borderRadius: '6px',
              background: failAtStep === i ? '#fff5f5' : '#fff',
              color: failAtStep === i ? '#c53030' : '#555',
              cursor: running ? 'default' : 'pointer',
              fontWeight: failAtStep === i ? 700 : 400,
              fontSize: '0.85rem',
            }}
          >
            Шаг {s.stepNumber}
          </button>
        ))}
        <button
          onClick={() => !running && setFailAtStep(-1)}
          disabled={running}
          style={{
            padding: '0.35rem 0.75rem',
            border: `2px solid ${failAtStep === -1 ? '#38a169' : '#e2e8f0'}`,
            borderRadius: '6px',
            background: failAtStep === -1 ? '#f0fff4' : '#fff',
            color: failAtStep === -1 ? '#276749' : '#555',
            cursor: running ? 'default' : 'pointer',
            fontWeight: failAtStep === -1 ? 700 : 400,
            fontSize: '0.85rem',
          }}
        >
          Без ошибок
        </button>

        <button
          onClick={running ? reset : runSimulation}
          style={{
            padding: '0.5rem 1.25rem',
            background: running ? '#718096' : '#4f86f7',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            marginLeft: 'auto',
          }}
        >
          {running ? 'Сбросить' : 'Симулировать'}
        </button>
      </div>

      {/* Шаги */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {steps.map((step, idx) => (
          <div key={step.id} style={{ display: 'flex', gap: '0' }}>
            {/* Номер и коннектор */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: getStepBorderColor(step.status, step.color),
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0,
                transition: 'background 0.3s ease',
              }}>
                {step.stepNumber}
              </div>
              {idx < steps.length - 1 && (
                <div style={{
                  width: '2px',
                  flex: 1,
                  minHeight: '12px',
                  background: phase === 'compensating' && step.status === 'compensated'
                    ? '#e53e3e' : step.status === 'done' ? step.color : '#e2e8f0',
                  transition: 'background 0.3s ease',
                  marginTop: '2px',
                }} />
              )}
            </div>

            {/* Карточка шага */}
            <div style={{
              flex: 1,
              border: `2px solid ${getStepBorderColor(step.status, step.color)}`,
              borderRadius: '8px',
              padding: '0.6rem 0.9rem',
              background: getStepBg(step.status, step.color),
              transition: 'all 0.3s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.25rem' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#333' }}>{step.service}</span>
                  <span style={{ color: '#888', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                    {step.status === 'compensating' || step.status === 'compensated'
                      ? step.compensationAction
                      : step.action}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {step.status !== 'idle' && (
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: getStepBorderColor(step.status, step.color),
                      background: `${getStepBorderColor(step.status, step.color)}15`,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                    }}>
                      {STATUS_LABELS[step.status]}
                    </span>
                  )}
                </div>
              </div>

              {step.status !== 'idle' && (
                <div style={{
                  marginTop: '0.35rem',
                  fontSize: '0.75rem',
                  color: step.status === 'failed' ? '#c53030'
                    : step.status === 'compensated' ? '#718096'
                    : step.status === 'compensating' ? '#b7791f'
                    : '#555',
                  fontFamily: 'monospace',
                }}>
                  {step.status === 'compensating' || step.status === 'compensated'
                    ? step.compensationEffect
                    : step.status === 'failed'
                    ? `ОШИБКА: ${step.service} вернул исключение`
                    : step.effect}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Лог эффектов */}
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
          {effects.map((line, i) => (
            <div key={i} style={{
              color: line.startsWith('[FAILURE]') ? '#fc8181'
                : line.startsWith('[COMPENSATED]') ? '#f6ad55'
                : line.startsWith('[SUCCESS]') ? '#68d391'
                : line.startsWith('---') ? '#718096'
                : '#a0aec0',
              marginBottom: '0.15rem',
            }}>
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Итоговая статистика */}
      {phase === 'done' && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          background: failAtStep === -1 ? '#f0fff4' : '#fff5f5',
          border: `1px solid ${failAtStep === -1 ? '#68d391' : '#fc8181'}`,
          fontSize: '0.85rem',
          color: failAtStep === -1 ? '#276749' : '#c53030',
        }}>
          {failAtStep === -1
            ? 'Saga выполнена успешно. Все 4 шага зафиксированы.'
            : `Шаг ${failAtStep + 1} завершился ошибкой. Откатано ${failAtStep} шаг(ов). Система консистентна.`}
        </div>
      )}
    </div>
  )
}
