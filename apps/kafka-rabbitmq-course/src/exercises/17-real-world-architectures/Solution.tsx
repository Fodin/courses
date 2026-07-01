import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../hooks'

// ============================================
// Задание 17.1: E-Commerce: архитектура заказа
// ============================================

type OrderStep =
  | 'idle'
  | 'api-gateway'
  | 'order-created'
  | 'payment-command'
  | 'payment-processing'
  | 'payment-done'
  | 'inventory-command'
  | 'inventory-reserved'
  | 'order-confirmed'
  | 'notification-sent'
  | 'complete'

interface FlowMessage {
  id: number
  from: string
  to: string
  text: string
  broker: 'rabbitmq' | 'kafka' | 'http'
  step: OrderStep
}

const FLOW_MESSAGES: FlowMessage[] = [
  { id: 1, from: 'Client', to: 'API Gateway', text: 'POST /orders', broker: 'http', step: 'api-gateway' },
  { id: 2, from: 'API Gateway', to: 'OrderService', text: 'CreateOrder command', broker: 'http', step: 'order-created' },
  { id: 3, from: 'OrderService', to: 'RabbitMQ', text: 'order.commands → ProcessPayment', broker: 'rabbitmq', step: 'payment-command' },
  { id: 4, from: 'RabbitMQ', to: 'PaymentService', text: 'Consume ProcessPayment', broker: 'rabbitmq', step: 'payment-processing' },
  { id: 5, from: 'PaymentService', to: 'Kafka', text: 'payment-events → PaymentCompleted', broker: 'kafka', step: 'payment-done' },
  { id: 6, from: 'OrderService', to: 'RabbitMQ', text: 'order.commands → ReserveInventory', broker: 'rabbitmq', step: 'inventory-command' },
  { id: 7, from: 'RabbitMQ', to: 'InventoryService', text: 'Consume ReserveInventory', broker: 'rabbitmq', step: 'inventory-reserved' },
  { id: 8, from: 'InventoryService', to: 'Kafka', text: 'inventory-events → ItemReserved', broker: 'kafka', step: 'order-confirmed' },
  { id: 9, from: 'Kafka', to: 'OrderService', text: 'order-events → OrderConfirmed', broker: 'kafka', step: 'notification-sent' },
  { id: 10, from: 'Kafka', to: 'NotificationService', text: 'notification-events → SendEmail', broker: 'kafka', step: 'complete' },
]

const STEP_LABELS: Record<OrderStep, string> = {
  idle: 'Ожидание',
  'api-gateway': 'API Gateway получил запрос',
  'order-created': 'Заказ создан в OrderService',
  'payment-command': 'Команда оплаты в RabbitMQ',
  'payment-processing': 'PaymentService обрабатывает',
  'payment-done': 'Оплата завершена → Kafka event',
  'inventory-command': 'Команда резервирования → RabbitMQ',
  'inventory-reserved': 'InventoryService резервирует',
  'order-confirmed': 'Товар зарезервирован → Kafka event',
  'notification-sent': 'OrderService подтверждает заказ',
  complete: 'Email отправлен — заказ завершён',
}

const BROKER_COLORS = {
  rabbitmq: '#ff6600',
  kafka: '#3a7ebf',
  http: '#38a169',
}

const BROKER_LABELS = {
  rabbitmq: 'RabbitMQ (команды)',
  kafka: 'Kafka (события)',
  http: 'HTTP/REST',
}

const SERVICE_POSITIONS: Record<string, { x: number; y: number; color: string }> = {
  'Client':            { x: 10,  y: 160, color: '#718096' },
  'API Gateway':       { x: 130, y: 160, color: '#4f86f7' },
  'OrderService':      { x: 260, y: 80,  color: '#4fbe7c' },
  'RabbitMQ':          { x: 390, y: 160, color: '#ff6600' },
  'PaymentService':    { x: 260, y: 240, color: '#b34ff7' },
  'Kafka':             { x: 520, y: 160, color: '#3a7ebf' },
  'InventoryService':  { x: 390, y: 300, color: '#f7d44f' },
  'NotificationService': { x: 520, y: 300, color: '#f74fa0' },
}

const NODE_W = 110
const NODE_H = 36

function getNodeCenter(name: string): { cx: number; cy: number } {
  const pos = SERVICE_POSITIONS[name]
  return { cx: pos.x + NODE_W / 2, cy: pos.y + NODE_H / 2 }
}

export function Task17_1_Solution() {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(1200)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const visibleMessages = FLOW_MESSAGES.slice(0, currentStep + 1)
  const currentStepName: OrderStep = currentStep < 0
    ? 'idle'
    : (FLOW_MESSAGES[currentStep]?.step ?? 'idle')

  const startFlow = () => {
    setCurrentStep(-1)
    setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    if (currentStep >= FLOW_MESSAGES.length - 1) {
      setRunning(false)
      return
    }
    timerRef.current = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, speed)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [running, currentStep, speed])

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setRunning(false)
    setCurrentStep(-1)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.17.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Нажми «Создать заказ» и наблюдай, как сообщения текут через RabbitMQ (команды)
        и Kafka (события). Оранжевый — RabbitMQ, синий — Kafka, зелёный — HTTP.
      </p>

      {/* Диаграмма */}
      <div style={{ overflowX: 'auto' }}>
        <svg
          viewBox="0 0 650 360"
          width="100%"
          style={{ border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fafafa', minWidth: '520px' }}
        >
          {/* Стрелки активных сообщений */}
          {visibleMessages.map(msg => {
            const from = getNodeCenter(msg.from)
            const to = getNodeCenter(msg.to)
            const isLatest = msg.id === visibleMessages[visibleMessages.length - 1]?.id
            const color = BROKER_COLORS[msg.broker]
            const dx = to.cx - from.cx
            const dy = to.cy - from.cy
            const len = Math.sqrt(dx * dx + dy * dy)
            const ux = dx / len
            const uy = dy / len
            const x1 = from.cx + ux * (NODE_W / 2 + 2)
            const y1 = from.cy + uy * (NODE_H / 2 + 2)
            const x2 = to.cx - ux * (NODE_W / 2 + 8)
            const y2 = to.cy - uy * (NODE_H / 2 + 8)
            return (
              <g key={msg.id}>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={color}
                  strokeWidth={isLatest ? 2.5 : 1.5}
                  strokeOpacity={isLatest ? 1 : 0.35}
                  markerEnd={`url(#arrow-${msg.broker})`}
                  style={{ transition: 'all 0.3s ease' }}
                />
                {isLatest && (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 6}
                    textAnchor="middle"
                    fontSize={9}
                    fill={color}
                    fontWeight={600}
                    style={{ pointerEvents: 'none' }}
                  >
                    {msg.text.length > 22 ? msg.text.slice(0, 20) + '...' : msg.text}
                  </text>
                )}
              </g>
            )
          })}

          {/* Определения стрелок */}
          <defs>
            {Object.entries(BROKER_COLORS).map(([broker, color]) => (
              <marker
                key={broker}
                id={`arrow-${broker}`}
                markerWidth="8" markerHeight="8"
                refX="6" refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L8,3 z" fill={color} />
              </marker>
            ))}
          </defs>

          {/* Узлы сервисов */}
          {Object.entries(SERVICE_POSITIONS).map(([name, pos]) => {
            const isActive = visibleMessages.some(m => m.from === name || m.to === name)
            const isCurrentSender = visibleMessages[currentStep]?.from === name
            const isCurrentReceiver = visibleMessages[currentStep]?.to === name
            const highlight = isCurrentSender || isCurrentReceiver
            return (
              <g key={name} transform={`translate(${pos.x}, ${pos.y})`}>
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  fill={highlight ? pos.color : '#fff'}
                  stroke={isActive ? pos.color : '#ddd'}
                  strokeWidth={highlight ? 2.5 : 1.5}
                  style={{ transition: 'all 0.35s ease' }}
                />
                <text
                  x={NODE_W / 2}
                  y={NODE_H / 2 + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={highlight ? 700 : 500}
                  fill={highlight ? '#fff' : '#333'}
                  style={{ pointerEvents: 'none', transition: 'all 0.35s ease' }}
                >
                  {name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Статус шага */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        background: currentStep < 0 ? '#f7f7f7' : '#ebf8ff',
        border: `1px solid ${currentStep < 0 ? '#e2e8f0' : '#90cdf4'}`,
        fontSize: '0.9rem',
        fontWeight: 600,
        color: currentStep < 0 ? '#999' : '#2b6cb0',
        transition: 'all 0.3s ease',
        minHeight: '42px',
      }}>
        {currentStep >= 0 && <span style={{ marginRight: '0.5rem' }}>
          <span style={{
            display: 'inline-block',
            width: '10px', height: '10px',
            borderRadius: '50%',
            background: BROKER_COLORS[FLOW_MESSAGES[currentStep]?.broker ?? 'http'],
            marginRight: '6px',
            verticalAlign: 'middle',
          }} />
        </span>}
        {STEP_LABELS[currentStepName]}
        {currentStep >= 0 && (
          <span style={{ float: 'right', fontWeight: 400, color: '#718096', fontSize: '0.8rem' }}>
            шаг {currentStep + 1} / {FLOW_MESSAGES.length}
          </span>
        )}
      </div>

      {/* Журнал сообщений */}
      {visibleMessages.length > 0 && (
        <div style={{
          marginTop: '0.75rem',
          maxHeight: '180px',
          overflowY: 'auto',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
        }}>
          {visibleMessages.map((msg, idx) => (
            <div
              key={msg.id}
              style={{
                padding: '0.4rem 0.75rem',
                background: idx === visibleMessages.length - 1 ? `${BROKER_COLORS[msg.broker]}18` : '#fff',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
              }}
            >
              <span style={{
                display: 'inline-block',
                minWidth: '70px',
                padding: '1px 6px',
                borderRadius: '4px',
                background: BROKER_COLORS[msg.broker],
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.72rem',
                textAlign: 'center',
              }}>
                {BROKER_LABELS[msg.broker].split(' ')[0]}
              </span>
              <span style={{ color: '#555' }}>
                <strong>{msg.from}</strong> → <strong>{msg.to}</strong>: {msg.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Легенда */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {Object.entries(BROKER_LABELS).map(([broker, label]) => (
          <div key={broker} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
            <div style={{
              width: '12px', height: '3px',
              background: BROKER_COLORS[broker as keyof typeof BROKER_COLORS],
              borderRadius: '2px',
            }} />
            <span style={{ color: '#555' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Управление */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={startFlow}
          disabled={running}
          style={{
            padding: '0.5rem 1.25rem',
            background: running ? '#a0aec0' : '#4fbe7c',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: running ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {running ? 'Выполняется...' : 'Создать заказ'}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            background: '#e2e8f0',
            color: '#4a5568',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Сбросить
        </button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
          Скорость:
          <select
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
          >
            <option value={2000}>Медленно</option>
            <option value={1200}>Нормально</option>
            <option value={600}>Быстро</option>
          </select>
        </label>
      </div>

      {currentStepName === 'complete' && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f0fff4',
          border: '1px solid #68d391',
          borderRadius: '8px',
          color: '#276749',
          fontWeight: 600,
        }}>
          Заказ успешно обработан! RabbitMQ доставил команды (Commands), Kafka распределил события (Events).
          Это классическая гибридная архитектура: RabbitMQ для управляющих команд, Kafka для событийного лога.
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 17.2: Централизованное логирование: ELK + Kafka
// ============================================

interface LogEntry {
  id: number
  service: string
  level: 'INFO' | 'WARN' | 'ERROR'
  message: string
  topic: string
  partition: number
  timestamp: string
}

const SERVICES_LOG = ['api-gateway', 'order-service', 'payment-service', 'inventory-service', 'notification-service']

const SERVICE_COLORS: Record<string, string> = {
  'api-gateway':          '#4f86f7',
  'order-service':        '#4fbe7c',
  'payment-service':      '#b34ff7',
  'inventory-service':    '#f7d44f',
  'notification-service': '#f74fa0',
}

const LOG_TEMPLATES: Array<{ service: string; level: 'INFO' | 'WARN' | 'ERROR'; message: string }> = [
  { service: 'api-gateway',          level: 'INFO',  message: 'Request received: POST /orders, user=42' },
  { service: 'order-service',        level: 'INFO',  message: 'Order created: order_id=8821, amount=3200' },
  { service: 'payment-service',      level: 'INFO',  message: 'Payment authorized: txn=TXN-991' },
  { service: 'inventory-service',    level: 'WARN',  message: 'Low stock alert: item_id=441, qty=3' },
  { service: 'notification-service', level: 'INFO',  message: 'Email sent: user@example.com' },
  { service: 'api-gateway',          level: 'ERROR', message: 'Rate limit exceeded: ip=10.0.0.5' },
  { service: 'order-service',        level: 'WARN',  message: 'Retry attempt 2/3 for order_id=8822' },
  { service: 'payment-service',      level: 'ERROR', message: 'Payment declined: card_type=VISA, code=insufficient_funds' },
  { service: 'inventory-service',    level: 'INFO',  message: 'Item reserved: item_id=441, order_id=8821' },
  { service: 'api-gateway',          level: 'INFO',  message: 'Response sent: 201 Created, latency=142ms' },
  { service: 'order-service',        level: 'INFO',  message: 'OrderConfirmed event published' },
  { service: 'notification-service', level: 'ERROR', message: 'SMTP timeout, retrying in 5s' },
]

const LEVEL_COLORS: Record<string, string> = {
  INFO:  '#38a169',
  WARN:  '#d69e2e',
  ERROR: '#e53e3e',
}

function getPartition(service: string): number {
  return SERVICES_LOG.indexOf(service) % 3
}

function genTimestamp(): string {
  const now = new Date()
  return now.toISOString().slice(11, 23)
}

export function Task17_2_Solution() {
  const { t } = useLanguage()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [streaming, setStreaming] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL')
  const [filterService, setFilterService] = useState<string>('ALL')
  const [totalConsumed, setTotalConsumed] = useState(0)
  const counterRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startStreaming = () => {
    if (streaming) return
    setStreaming(true)
    timerRef.current = setInterval(() => {
      const template = LOG_TEMPLATES[counterRef.current % LOG_TEMPLATES.length]
      counterRef.current += 1
      const entry: LogEntry = {
        id: counterRef.current,
        service: template.service,
        level: template.level,
        message: template.message,
        topic: `logs.${template.service}`,
        partition: getPartition(template.service),
        timestamp: genTimestamp(),
      }
      setLogs(prev => [entry, ...prev].slice(0, 60))
      setTotalConsumed(n => n + 1)
    }, 700)
  }

  const stopStreaming = () => {
    setStreaming(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const clearLogs = () => {
    stopStreaming()
    setLogs([])
    setTotalConsumed(0)
    counterRef.current = 0
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false
    if (filterService !== 'ALL' && log.service !== filterService) return false
    if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const topicCounts: Record<string, number> = {}
  logs.forEach(l => { topicCounts[l.topic] = (topicCounts[l.topic] ?? 0) + 1 })

  const levelCounts = { INFO: 0, WARN: 0, ERROR: 0 }
  logs.forEach(l => { levelCounts[l.level] += 1 })

  return (
    <div className="exercise-container">
      <h2>{t('task.17.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Запусти поток логов. Каждый сервис пишет в свой Kafka topic (logs.service-name),
        consumer (Logstash) читает все топики и кладёт в Elasticsearch.
        Используй фильтры для поиска — это Kibana-style интерфейс.
      </p>

      {/* Pipeline визуализация */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        background: '#f8f9fa',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        fontSize: '0.8rem',
        fontWeight: 600,
      }}>
        {SERVICES_LOG.map(svc => (
          <div key={svc} style={{
            padding: '4px 10px',
            borderRadius: '6px',
            background: SERVICE_COLORS[svc],
            color: '#fff',
            fontSize: '0.75rem',
          }}>
            {svc}
          </div>
        ))}
        <div style={{ color: '#999', fontSize: '1rem' }}>→</div>
        <div style={{
          padding: '4px 10px',
          borderRadius: '6px',
          background: '#3a7ebf',
          color: '#fff',
        }}>
          Kafka (logs.*)
        </div>
        <div style={{ color: '#999', fontSize: '1rem' }}>→</div>
        <div style={{
          padding: '4px 10px',
          borderRadius: '6px',
          background: '#f7844f',
          color: '#fff',
        }}>
          Logstash
        </div>
        <div style={{ color: '#999', fontSize: '1rem' }}>→</div>
        <div style={{
          padding: '4px 10px',
          borderRadius: '6px',
          background: '#38a169',
          color: '#fff',
        }}>
          Elasticsearch
        </div>
        <div style={{ color: '#999', fontSize: '1rem' }}>→</div>
        <div style={{
          padding: '4px 10px',
          borderRadius: '6px',
          background: '#b34ff7',
          color: '#fff',
        }}>
          Kibana UI
        </div>
      </div>

      {/* Kafka topics / партиции */}
      {logs.length > 0 && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          background: '#ebf8ff',
          borderRadius: '8px',
          border: '1px solid #90cdf4',
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#2b6cb0', marginBottom: '0.5rem' }}>
            Kafka Topics (partition by service)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.entries(topicCounts).map(([topic, count]) => {
              const svc = topic.replace('logs.', '')
              return (
                <div key={topic} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: '#fff',
                  border: `1px solid ${SERVICE_COLORS[svc] ?? '#ccc'}`,
                  fontSize: '0.75rem',
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '8px', height: '8px',
                    borderRadius: '50%',
                    background: SERVICE_COLORS[svc] ?? '#999',
                  }} />
                  <span style={{ fontFamily: 'monospace', color: '#444' }}>{topic}</span>
                  <span style={{
                    background: SERVICE_COLORS[svc] ?? '#999',
                    color: '#fff',
                    borderRadius: '3px',
                    padding: '0 4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}>
                    {count}
                  </span>
                  <span style={{ color: '#888', fontSize: '0.7rem' }}>
                    p{getPartition(svc)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Статистика */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap',
      }}>
        <div style={{ padding: '0.5rem 1rem', background: '#f0fff4', borderRadius: '8px', border: '1px solid #c6f6d5', fontSize: '0.82rem' }}>
          <strong style={{ color: '#276749' }}>INFO: {levelCounts.INFO}</strong>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fefcbf', fontSize: '0.82rem' }}>
          <strong style={{ color: '#7b341e' }}>WARN: {levelCounts.WARN}</strong>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fed7d7', fontSize: '0.82rem' }}>
          <strong style={{ color: '#c53030' }}>ERROR: {levelCounts.ERROR}</strong>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
          <strong style={{ color: '#4a5568' }}>Всего в Elasticsearch: {totalConsumed}</strong>
        </div>
      </div>

      {/* Фильтры (Kibana-style) */}
      <div style={{
        display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap',
        padding: '0.75rem',
        background: '#1a1a2e',
        borderRadius: '8px',
      }}>
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            flex: '1 1 180px',
            padding: '0.4rem 0.75rem',
            background: '#16213e',
            border: '1px solid #0f3460',
            borderRadius: '6px',
            color: '#e0e0e0',
            fontSize: '0.82rem',
            fontFamily: 'monospace',
            outline: 'none',
          }}
        />
        <select
          value={filterLevel}
          onChange={e => setFilterLevel(e.target.value as typeof filterLevel)}
          style={{
            padding: '0.4rem 0.6rem',
            background: '#16213e',
            border: '1px solid #0f3460',
            borderRadius: '6px',
            color: '#e0e0e0',
            fontSize: '0.82rem',
          }}
        >
          <option value="ALL">All levels</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
        </select>
        <select
          value={filterService}
          onChange={e => setFilterService(e.target.value)}
          style={{
            padding: '0.4rem 0.6rem',
            background: '#16213e',
            border: '1px solid #0f3460',
            borderRadius: '6px',
            color: '#e0e0e0',
            fontSize: '0.82rem',
          }}
        >
          <option value="ALL">All services</option>
          {SERVICES_LOG.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Лог-стрим */}
      <div style={{
        background: '#0d0d0d',
        borderRadius: '8px',
        minHeight: '220px',
        maxHeight: '320px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.77rem',
        padding: '0.5rem',
        border: '1px solid #333',
      }}>
        {filteredLogs.length === 0 ? (
          <div style={{ color: '#555', padding: '1rem', textAlign: 'center' }}>
            {logs.length === 0 ? 'Запусти поток для получения логов...' : 'Нет совпадений по фильтру'}
          </div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div
              key={log.id}
              style={{
                padding: '2px 4px',
                borderRadius: '3px',
                background: idx === 0 ? '#1a1a1a' : 'transparent',
                marginBottom: '1px',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-start',
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: '#666', flexShrink: 0 }}>{log.timestamp}</span>
              <span style={{
                color: LEVEL_COLORS[log.level],
                fontWeight: 700,
                flexShrink: 0,
                minWidth: '42px',
              }}>
                {log.level}
              </span>
              <span style={{
                color: SERVICE_COLORS[log.service] ?? '#999',
                flexShrink: 0,
                maxWidth: '140px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                [{log.service}]
              </span>
              <span style={{ color: '#d0d0d0' }}>{log.message}</span>
            </div>
          ))
        )}
      </div>

      {/* Управление */}
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={streaming ? stopStreaming : startStreaming}
          style={{
            padding: '0.5rem 1.25rem',
            background: streaming ? '#e53e3e' : '#38a169',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {streaming ? 'Остановить поток' : 'Запустить поток логов'}
        </button>
        <button
          onClick={clearLogs}
          style={{
            padding: '0.5rem 1rem',
            background: '#e2e8f0',
            color: '#4a5568',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Очистить
        </button>
      </div>
    </div>
  )
}

// ============================================
// Задание 17.3: Выбор архитектуры: интерактивный кейс
// ============================================

interface Scenario {
  id: string
  title: string
  description: string
  requirements: string[]
  constraints: string[]
  scale: string
}

interface ArchOption {
  id: string
  label: string
  icon: string
  description: string
}

interface Pattern {
  id: string
  label: string
  icon: string
  description: string
}

interface ScenarioAnswer {
  broker: string
  patterns: string[]
}

interface EvaluationResult {
  score: number
  maxScore: number
  feedback: string[]
  verdict: 'excellent' | 'good' | 'partial' | 'poor'
}

const SCENARIOS: Scenario[] = [
  {
    id: 'ecommerce',
    title: 'E-commerce платформа',
    description: 'Маркетплейс с 500 продавцами, 100k пользователей в день. Заказы, оплата, склад, уведомления.',
    requirements: [
      'Гарантированная доставка команд (заказ ДОЛЖЕН попасть в обработку)',
      'Исторический лог всех событий (финансовая аудит)',
      'Несколько независимых потребителей событий',
      'Routing платёжных команд по приоритету (VIP / обычные)',
    ],
    constraints: [
      'Команда 20 разработчиков',
      'Уже есть Kubernetes',
      'Нет требования replay старых событий чаще 1 раза в квартал',
    ],
    scale: '100k заказов/день, пиковая нагрузка ×5',
  },
  {
    id: 'iot',
    title: 'IoT платформа телеметрии',
    description: '50,000 датчиков на производстве. Каждый шлёт метрики раз в секунду. ML-модели анализируют аномалии.',
    requirements: [
      'Огромный throughput: 50k msg/sec и выше',
      'Replay данных для переобучения ML-моделей',
      'Партицирование по device_id для упорядоченной обработки',
      'Удержание данных 30 дней',
    ],
    constraints: [
      'Датчики не переотправляют при ошибке — данные потеряны навсегда',
      'ML команда хочет независимый доступ к данным',
      'Бюджет ограничен — одна система',
    ],
    scale: '50,000 устройств × 1 msg/sec = 50k msg/sec',
  },
  {
    id: 'fintech',
    title: 'Банковские переводы (Fintech)',
    description: 'Сервис межбанковских переводов. Каждый перевод — Saga из 5 шагов с компенсациями.',
    requirements: [
      'Exactly-once семантика для финансовых транзакций',
      'Saga с чёткими compensation actions',
      'Приоритизация переводов (срочные / обычные)',
      'Dead Letter Queue для застрявших транзакций',
    ],
    constraints: [
      '30 тыс. переводов/день, строгий SLA',
      'Регулятор требует полного аудит-лога',
      'Среднее время обработки < 3 сек',
    ],
    scale: '30k transfers/day, p99 latency < 3s',
  },
]

const ARCH_OPTIONS: ArchOption[] = [
  {
    id: 'kafka-only',
    label: 'Только Kafka',
    icon: 'K',
    description: 'Apache Kafka как единственный брокер',
  },
  {
    id: 'rabbitmq-only',
    label: 'Только RabbitMQ',
    icon: 'R',
    description: 'RabbitMQ как единственный брокер',
  },
  {
    id: 'hybrid',
    label: 'Гибрид (RabbitMQ + Kafka)',
    icon: 'H',
    description: 'RabbitMQ для команд, Kafka для событий',
  },
  {
    id: 'pulsar',
    label: 'Apache Pulsar',
    icon: 'P',
    description: 'Унифицированный брокер с поддержкой обеих моделей',
  },
]

const PATTERNS: Pattern[] = [
  { id: 'saga',        label: 'Saga Pattern',           icon: 'S', description: 'Распределённые транзакции через компенсации' },
  { id: 'cqrs',        label: 'CQRS',                   icon: 'C', description: 'Разделение команд и запросов' },
  { id: 'outbox',      label: 'Transactional Outbox',   icon: 'O', description: 'Надёжная публикация событий из БД' },
  { id: 'dlq',         label: 'Dead Letter Queue',      icon: 'D', description: 'Изоляция проблемных сообщений' },
  { id: 'event-source',label: 'Event Sourcing',         icon: 'E', description: 'Хранение состояния как лог событий' },
  { id: 'priority',    label: 'Priority Queue',         icon: 'P', description: 'Обработка по приоритету' },
  { id: 'competing',   label: 'Competing Consumers',    icon: 'CC', description: 'Параллельная обработка несколькими воркерами' },
  { id: 'fanout',      label: 'Fan-out / Pub-Sub',      icon: 'F', description: 'Один publisher → множество подписчиков' },
]

interface ScoringRule {
  broker: string[]
  patterns: string[]
  reason: string
}

const SCORING: Record<string, ScoringRule> = {
  ecommerce: {
    broker: ['hybrid', 'kafka-only'],
    patterns: ['saga', 'outbox', 'dlq', 'fanout', 'priority'],
    reason: 'E-commerce: гибрид оптимален — RabbitMQ для routing команд по приоритету, Kafka для аудит-лога событий. Обязательны Saga (многошаговый заказ), Outbox (надёжность), DLQ (обработка ошибок), Fan-out (NotificationService). Priority Queue нужна для VIP.',
  },
  iot: {
    broker: ['kafka-only', 'pulsar'],
    patterns: ['competing', 'fanout', 'event-source'],
    reason: 'IoT: только Kafka / Pulsar — нужны replay, удержание данных, партицирование по device_id, огромный throughput. RabbitMQ не подходит — не поддерживает replay. Competing Consumers нужны для параллельной ML-обработки. Event Sourcing — данные сенсоров это и есть лог событий.',
  },
  fintech: {
    broker: ['rabbitmq-only', 'hybrid'],
    patterns: ['saga', 'dlq', 'outbox', 'priority', 'cqrs'],
    reason: 'Fintech: RabbitMQ (или гибрид) с Saga — именно RabbitMQ хорошо поддерживает exactly-once через publisher confirms + ack. DLQ обязателен для застрявших транзакций. Priority Queue — срочные переводы. Outbox — надёжная публикация. CQRS — разделение команды перевода и запроса баланса.',
  },
}

function evaluateAnswer(scenarioId: string, answer: ScenarioAnswer): EvaluationResult {
  const scoring = SCORING[scenarioId]
  const feedback: string[] = []
  let score = 0
  const maxScore = 10

  // Брокер: 4 балла
  const brokerCorrect = scoring.broker.includes(answer.broker)
  if (brokerCorrect) {
    score += 4
    feedback.push(`Выбор брокера правильный (${ARCH_OPTIONS.find(a => a.id === answer.broker)?.label})`)
  } else {
    feedback.push(`Брокер не оптимален для этого сценария. Лучше: ${scoring.broker.map(b => ARCH_OPTIONS.find(a => a.id === b)?.label).join(' или ')}`)
  }

  // Паттерны: до 6 баллов
  const matchedPatterns = answer.patterns.filter(p => scoring.patterns.includes(p))
  const wrongPatterns = answer.patterns.filter(p => !scoring.patterns.includes(p))
  const missedPatterns = scoring.patterns.filter(p => !answer.patterns.includes(p))

  score += Math.min(6, matchedPatterns.length * 2)

  if (matchedPatterns.length > 0) {
    feedback.push(`Верные паттерны: ${matchedPatterns.map(p => PATTERNS.find(pt => pt.id === p)?.label).join(', ')}`)
  }
  if (wrongPatterns.length > 0) {
    feedback.push(`Лишние паттерны: ${wrongPatterns.map(p => PATTERNS.find(pt => pt.id === p)?.label).join(', ')} — не нужны в этом сценарии`)
  }
  if (missedPatterns.length > 0) {
    feedback.push(`Пропущены важные паттерны: ${missedPatterns.map(p => PATTERNS.find(pt => pt.id === p)?.label).join(', ')}`)
  }

  feedback.push(`Обоснование: ${scoring.reason}`)

  const verdict: EvaluationResult['verdict'] =
    score >= 9 ? 'excellent' :
    score >= 7 ? 'good' :
    score >= 4 ? 'partial' : 'poor'

  return { score, maxScore, feedback, verdict }
}

const VERDICT_CONFIG = {
  excellent: { label: 'Отлично!',       color: '#38a169', bg: '#f0fff4', border: '#68d391' },
  good:      { label: 'Хорошо!',         color: '#3182ce', bg: '#ebf8ff', border: '#90cdf4' },
  partial:   { label: 'Частично верно',  color: '#d69e2e', bg: '#fffbeb', border: '#f6e05e' },
  poor:      { label: 'Нужно пересмотреть', color: '#e53e3e', bg: '#fff5f5', border: '#fc8181' },
}

export function Task17_3_Solution() {
  const { t } = useLanguage()
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [selectedBroker, setSelectedBroker] = useState<string>('')
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([])
  const [result, setResult] = useState<EvaluationResult | null>(null)

  const scenario = SCENARIOS[scenarioIdx]

  const handleScenarioChange = (idx: number) => {
    setScenarioIdx(idx)
    setSelectedBroker('')
    setSelectedPatterns([])
    setResult(null)
  }

  const togglePattern = (id: string) => {
    setSelectedPatterns(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
    setResult(null)
  }

  const handleBrokerChange = (id: string) => {
    setSelectedBroker(id)
    setResult(null)
  }

  const handleEvaluate = () => {
    if (!selectedBroker || selectedPatterns.length === 0) return
    setResult(evaluateAnswer(scenario.id, { broker: selectedBroker, patterns: selectedPatterns }))
  }

  const handleReset = () => {
    setSelectedBroker('')
    setSelectedPatterns([])
    setResult(null)
  }

  const verdictCfg = result ? VERDICT_CONFIG[result.verdict] : null

  return (
    <div className="exercise-container">
      <h2>{t('task.17.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Изучи бизнес-сценарий. Выбери оптимальный брокер и паттерны.
        Компонент оценит твой выбор и объяснит правильный ответ.
      </p>

      {/* Выбор сценария */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {SCENARIOS.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => handleScenarioChange(idx)}
            style={{
              padding: '0.45rem 1rem',
              border: '2px solid',
              borderColor: scenarioIdx === idx ? '#4f86f7' : '#e2e8f0',
              borderRadius: '8px',
              background: scenarioIdx === idx ? '#4f86f7' : '#fff',
              color: scenarioIdx === idx ? '#fff' : '#4a5568',
              cursor: 'pointer',
              fontWeight: scenarioIdx === idx ? 700 : 500,
              fontSize: '0.85rem',
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Описание сценария */}
      <div style={{
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        marginBottom: '1.25rem',
      }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
          {scenario.title}
        </div>
        <p style={{ color: '#555', fontSize: '0.88rem', margin: '0 0 0.75rem' }}>
          {scenario.description}
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#4f86f7', marginBottom: '0.35rem' }}>
              Требования:
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#444' }}>
              {scenario.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#e53e3e', marginBottom: '0.35rem' }}>
              Ограничения:
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#444' }}>
              {scenario.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </div>
        <div style={{
          marginTop: '0.75rem',
          display: 'inline-block',
          padding: '3px 10px',
          background: '#ebf8ff',
          borderRadius: '6px',
          fontSize: '0.78rem',
          color: '#2b6cb0',
          fontWeight: 600,
        }}>
          Масштаб: {scenario.scale}
        </div>
      </div>

      {/* Выбор брокера */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem', color: '#2d3748' }}>
          Выбери брокер сообщений:
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {ARCH_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleBrokerChange(opt.id)}
              style={{
                padding: '0.5rem 0.85rem',
                border: '2px solid',
                borderColor: selectedBroker === opt.id ? '#4f86f7' : '#e2e8f0',
                borderRadius: '8px',
                background: selectedBroker === opt.id ? '#ebf8ff' : '#fff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                textAlign: 'left',
                minWidth: '130px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: selectedBroker === opt.id ? '#2b6cb0' : '#333' }}>
                <span style={{
                  display: 'inline-block',
                  width: '20px', height: '20px',
                  borderRadius: '4px',
                  background: selectedBroker === opt.id ? '#4f86f7' : '#e2e8f0',
                  color: selectedBroker === opt.id ? '#fff' : '#999',
                  fontWeight: 900,
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  lineHeight: '20px',
                  marginRight: '6px',
                }}>
                  {opt.icon}
                </span>
                {opt.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#718096', paddingLeft: '26px' }}>
                {opt.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Выбор паттернов */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem', color: '#2d3748' }}>
          Выбери необходимые паттерны (можно несколько):
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {PATTERNS.map(pt => {
            const selected = selectedPatterns.includes(pt.id)
            return (
              <button
                key={pt.id}
                onClick={() => togglePattern(pt.id)}
                style={{
                  padding: '0.4rem 0.8rem',
                  border: '2px solid',
                  borderColor: selected ? '#38a169' : '#e2e8f0',
                  borderRadius: '8px',
                  background: selected ? '#f0fff4' : '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.15rem',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  minWidth: '140px',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: selected ? '#276749' : '#333' }}>
                  {selected && <span style={{ marginRight: '4px' }}>✓</span>}
                  {pt.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#718096' }}>
                  {pt.description}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Кнопки */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button
          onClick={handleEvaluate}
          disabled={!selectedBroker || selectedPatterns.length === 0}
          style={{
            padding: '0.55rem 1.5rem',
            background: (!selectedBroker || selectedPatterns.length === 0) ? '#a0aec0' : '#4f86f7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: (!selectedBroker || selectedPatterns.length === 0) ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          Оценить решение
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '0.55rem 1rem',
            background: '#e2e8f0',
            color: '#4a5568',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Сбросить
        </button>
      </div>

      {/* Результат оценки */}
      {result && verdictCfg && (
        <div style={{
          padding: '1rem',
          background: verdictCfg.bg,
          border: `2px solid ${verdictCfg.border}`,
          borderRadius: '10px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: verdictCfg.color }}>
              {verdictCfg.label}
            </span>
            <span style={{
              fontWeight: 700,
              fontSize: '1.1rem',
              color: verdictCfg.color,
              background: '#fff',
              padding: '2px 10px',
              borderRadius: '6px',
              border: `1px solid ${verdictCfg.border}`,
            }}>
              {result.score} / {result.maxScore}
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.85rem', color: '#444' }}>
            {result.feedback.map((fb, i) => (
              <li key={i} style={{ marginBottom: '0.35rem', lineHeight: 1.5 }}>{fb}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
