import { useState, useEffect, useRef } from 'react'

// ============================================
// Задание 5.1: Справочная карточка (Message Queues)
// ============================================

export function Task5_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Очереди сообщений — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Queue (Point-to-Point)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Одно сообщение → один consumer.</strong> Используется для распределения задач (load balancing).
            <br />
            Пример: очередь задач на resize изображений — 5 воркеров разбирают по одной.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Topic (Pub/Sub)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Одно сообщение → все подписчики.</strong> Используется для оповещения (fanout).
            <br />
            Пример: OrderCreated → email, analytics, inventory, fraud — каждый получит копию.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Гарантии доставки</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>At-most-once</strong> — может потеряться (логи, метрики).
            <br />
            <strong>At-least-once</strong> — может дублироваться, нужна idempotency (платежи, заказы).
            <br />
            <strong>Exactly-once</strong> — только внутри Kafka (дорого и сложно).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Dead Letter Queue</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>DLQ</strong> — очередь для сообщений, которые не удалось обработать после N попыток.
            <br />
            Без DLQ: poison message блокирует всю очередь бесконечным retry.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>RabbitMQ vs Kafka</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>RabbitMQ</strong> — message broker, умная маршрутизация, удаляет после ack. Task queues.
            <br />
            <strong>Kafka</strong> — event log, append-only, хранит историю. Streaming, аналитика, CQRS.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Backpressure и Idempotency</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Backpressure</strong> — bounded queue + auto-scaling consumers при перегрузке.
            <br />
            <strong>Idempotency</strong> — уникальный ключ + дедупликация. Must have для at-least-once.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 5.2: Визуализатор очереди сообщений
// ============================================

type DeliveryMode = 'at-most-once' | 'at-least-once'

interface LogEntry {
  id: number
  time: string
  type: 'produced' | 'consumed' | 'error' | 'dlq' | 'lost'
  message: string
}

const QUEUE_CAPACITY = 100

export function Task5_2_Solution() {
  const [producerRate, setProducerRate] = useState(5)
  const [consumerRate, setConsumerRate] = useState(5)
  const [consumerCount, setConsumerCount] = useState(1)
  const [errorRate, setErrorRate] = useState(0)
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('at-least-once')
  const [running, setRunning] = useState(false)

  const [queueDepth, setQueueDepth] = useState(0)
  const [processed, setProcessed] = useState(0)
  const [dlqCount, setDlqCount] = useState(0)
  const [lostCount, setLostCount] = useState(0)
  const [totalProduced, setTotalProduced] = useState(0)
  const [retryQueue, setRetryQueue] = useState(0)
  const [logs, setLogs] = useState<LogEntry[]>([])

  const logIdRef = useRef(0)
  const retryMapRef = useRef<Map<number, number>>(new Map())

  const addLog = (type: LogEntry['type'], message: string) => {
    const id = ++logIdRef.current
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setLogs(prev => [{ id, time, type, message }, ...prev].slice(0, 15))
  }

  useEffect(() => {
    if (!running) return

    const interval = setInterval(() => {
      // Producer step
      setQueueDepth(prev => {
        const newDepth = Math.min(prev + producerRate, QUEUE_CAPACITY)
        if (newDepth >= QUEUE_CAPACITY) {
          addLog('produced', `+${producerRate} msg (BACKPRESSURE: queue full!)`)
        } else {
          addLog('produced', `+${producerRate} msg -> queue`)
        }
        return newDepth
      })
      setTotalProduced(prev => prev + producerRate)

      // Consumer step
      const effectiveRate = consumerRate * consumerCount
      setQueueDepth(prev => {
        const toProcess = Math.min(prev, effectiveRate)
        if (toProcess === 0) return prev

        let errors = 0
        let successes = 0
        let dlqAdded = 0
        let lost = 0

        for (let i = 0; i < toProcess; i++) {
          const isError = Math.random() * 100 < errorRate
          if (isError) {
            errors++
            if (deliveryMode === 'at-least-once') {
              const msgId = Date.now() + i
              const currentRetries = retryMapRef.current.get(msgId) || 0
              if (currentRetries >= 2) {
                dlqAdded++
                retryMapRef.current.delete(msgId)
              } else {
                retryMapRef.current.set(msgId, currentRetries + 1)
              }
            } else {
              lost++
            }
          } else {
            successes++
          }
        }

        if (successes > 0) {
          setProcessed(p => p + successes)
          addLog('consumed', `${successes} msg processed OK`)
        }
        if (errors > 0 && deliveryMode === 'at-least-once') {
          const actualDlq = Math.ceil(errors / 3)
          const retried = errors - actualDlq
          if (actualDlq > 0) {
            setDlqCount(d => d + actualDlq)
            addLog('dlq', `${actualDlq} msg -> DLQ (3 retries exceeded)`)
          }
          if (retried > 0) {
            setRetryQueue(r => r + retried)
            addLog('error', `${retried} msg failed, retrying...`)
          }
          return prev - successes - actualDlq
        }
        if (lost > 0) {
          setLostCount(l => l + lost)
          addLog('lost', `${lost} msg LOST (at-most-once, no retry)`)
        }
        return prev - successes - lost
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [running, producerRate, consumerRate, consumerCount, errorRate, deliveryMode])

  const reset = () => {
    setRunning(false)
    setQueueDepth(0)
    setProcessed(0)
    setDlqCount(0)
    setLostCount(0)
    setTotalProduced(0)
    setRetryQueue(0)
    setLogs([])
    retryMapRef.current.clear()
    logIdRef.current = 0
  }

  const queuePercent = Math.round((queueDepth / QUEUE_CAPACITY) * 100)
  const isBackpressure = queueDepth >= QUEUE_CAPACITY * 0.8
  const isOverloaded = queueDepth >= QUEUE_CAPACITY

  const effectiveThroughput = consumerRate * consumerCount
  const statusColor = isOverloaded ? '#c62828' : isBackpressure ? '#e65100' : '#2e7d32'
  const statusText = isOverloaded ? 'OVERLOADED' : isBackpressure ? 'BACKPRESSURE' : 'NORMAL'

  const logColors: Record<LogEntry['type'], string> = {
    produced: '#1565c0',
    consumed: '#2e7d32',
    error: '#e65100',
    dlq: '#c62828',
    lost: '#6a1b9a',
  }

  const btnStyle = (active: boolean) => ({
    padding: '0.3rem 0.7rem',
    margin: '0 0.2rem',
    border: active ? '2px solid #1565c0' : '1px solid #ccc',
    borderRadius: '4px',
    background: active ? '#e3f2fd' : '#fff',
    cursor: 'pointer' as const,
    fontWeight: active ? 'bold' as const : 'normal' as const,
    fontSize: '0.85rem',
  })

  return (
    <div style={{ padding: '1rem', maxWidth: '800px' }}>
      <h2>Визуализатор очереди сообщений</h2>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Producer rate (msg/sec):</strong>
            <div style={{ marginTop: '0.3rem' }}>
              {[1, 5, 10, 20].map(r => (
                <button key={r} style={btnStyle(producerRate === r)} onClick={() => setProducerRate(r)}>{r}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Consumer rate (msg/sec):</strong>
            <div style={{ marginTop: '0.3rem' }}>
              {[1, 5, 10, 20].map(r => (
                <button key={r} style={btnStyle(consumerRate === r)} onClick={() => setConsumerRate(r)}>{r}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Consumer count:</strong>
            <div style={{ marginTop: '0.3rem' }}>
              {[1, 2, 3, 5].map(c => (
                <button key={c} style={btnStyle(consumerCount === c)} onClick={() => setConsumerCount(c)}>{c}</button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Error rate:</strong>
            <div style={{ marginTop: '0.3rem' }}>
              {[0, 10, 30, 50].map(e => (
                <button key={e} style={btnStyle(errorRate === e)} onClick={() => setErrorRate(e)}>{e}%</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Delivery mode:</strong>
            <div style={{ marginTop: '0.3rem' }}>
              <button style={btnStyle(deliveryMode === 'at-least-once')} onClick={() => setDeliveryMode('at-least-once')}>At-Least-Once</button>
              <button style={btnStyle(deliveryMode === 'at-most-once')} onClick={() => setDeliveryMode('at-most-once')}>At-Most-Once</button>
            </div>
          </div>
          <div style={{ marginTop: '0.8rem' }}>
            <button
              onClick={() => setRunning(!running)}
              style={{
                padding: '0.5rem 1.5rem',
                background: running ? '#c62828' : '#2e7d32',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '0.5rem',
                fontSize: '0.9rem',
              }}
            >
              {running ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={reset}
              style={{
                padding: '0.5rem 1.5rem',
                background: '#757575',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Queue visualization */}
      <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <strong>Queue Depth: {queueDepth} / {QUEUE_CAPACITY}</strong>
          <span style={{ padding: '0.2rem 0.6rem', background: statusColor, color: '#fff', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {statusText}
          </span>
        </div>
        <div style={{ width: '100%', height: '30px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${queuePercent}%`,
              height: '100%',
              background: isOverloaded ? '#c62828' : isBackpressure ? '#e65100' : '#2e7d32',
              transition: 'width 0.3s, background 0.3s',
              borderRadius: '4px',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
          <span>Producer: {producerRate} msg/s</span>
          <span>Effective throughput: {effectiveThroughput} msg/s ({consumerCount} x {consumerRate})</span>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.8rem', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1565c0' }}>{totalProduced}</div>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>Produced</div>
        </div>
        <div style={{ padding: '0.8rem', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>{processed}</div>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>Processed</div>
        </div>
        <div style={{ padding: '0.8rem', background: '#fce4ec', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c62828' }}>{dlqCount}</div>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>DLQ</div>
        </div>
        <div style={{ padding: '0.8rem', background: '#f3e5f5', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6a1b9a' }}>{lostCount}</div>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>Lost</div>
        </div>
      </div>

      {/* Event log */}
      <div style={{ padding: '0.8rem', background: '#263238', borderRadius: '8px', maxHeight: '250px', overflowY: 'auto' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {logs.length === 0 ? (
            <div style={{ color: '#78909c' }}>Press Start to begin simulation...</div>
          ) : (
            logs.map(log => (
              <div key={log.id} style={{ color: logColors[log.type], marginBottom: '0.2rem' }}>
                <span style={{ color: '#78909c' }}>[{log.time}]</span>{' '}
                <span style={{ fontWeight: 'bold' }}>{log.type.toUpperCase()}</span>{' '}
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 5.3: Проектирование Event Pipeline
// ============================================

interface PipelineStage {
  id: number
  name: string
  event: string
  pattern: 'Topic (Pub/Sub)' | 'Queue (Point-to-Point)'
  delivery: 'at-least-once' | 'at-most-once'
  idempotencyKey: string
  errorHandling: string
  description: string
  payload: Record<string, unknown>
  statusColor: string
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    name: 'Создание заказа',
    event: 'OrderCreated',
    pattern: 'Topic (Pub/Sub)',
    delivery: 'at-least-once',
    idempotencyKey: 'orderId',
    errorHandling: 'Retry 3x с exponential backoff. DLQ. Оповещение поддержки.',
    description: 'Заказ создан — событие публикуется в topic. Подписчики: Payment, Analytics, Fraud Detection, Inventory.',
    payload: {
      type: 'OrderCreated',
      orderId: 'ord-20240315-001',
      userId: 'usr-42',
      items: [{ productId: 'prod-101', qty: 2, price: 2990 }],
      total: 5980,
      currency: 'RUB',
      timestamp: '2024-03-15T14:30:00Z',
    },
    statusColor: '#1565c0',
  },
  {
    id: 2,
    name: 'Обработка оплаты',
    event: 'PaymentProcessed',
    pattern: 'Queue (Point-to-Point)',
    delivery: 'at-least-once',
    idempotencyKey: 'orderId + paymentAttemptId',
    errorHandling: 'Retry 5x. При неуспехе: PaymentFailed event. Возврат средств при частичном списании.',
    description: 'Payment Service получает OrderCreated, списывает средства. Критичный этап: потеря платежа = потеря денег.',
    payload: {
      type: 'PaymentProcessed',
      orderId: 'ord-20240315-001',
      paymentId: 'pay-78923',
      amount: 5980,
      currency: 'RUB',
      method: 'card',
      status: 'success',
      idempotencyKey: 'ord-20240315-001:attempt-1',
      timestamp: '2024-03-15T14:30:05Z',
    },
    statusColor: '#2e7d32',
  },
  {
    id: 3,
    name: 'Резервирование на складе',
    event: 'InventoryReserved',
    pattern: 'Queue (Point-to-Point)',
    delivery: 'at-least-once',
    idempotencyKey: 'orderId',
    errorHandling: 'Retry 3x. При неуспехе: InventoryFailed -> компенсация (refund). Saga pattern.',
    description: 'Inventory Service резервирует товары. При ошибке — откат оплаты (Saga compensation).',
    payload: {
      type: 'InventoryReserved',
      orderId: 'ord-20240315-001',
      warehouseId: 'wh-moscow-01',
      items: [{ productId: 'prod-101', qty: 2, reserved: true }],
      reservationExpiry: '2024-03-15T15:30:00Z',
      timestamp: '2024-03-15T14:30:08Z',
    },
    statusColor: '#e65100',
  },
  {
    id: 4,
    name: 'Отправка в доставку',
    event: 'ShipmentCreated',
    pattern: 'Queue (Point-to-Point)',
    delivery: 'at-least-once',
    idempotencyKey: 'orderId + shipmentId',
    errorHandling: 'Retry 3x. При неуспехе: ручная обработка (DLQ + alert). Клиент получает уведомление о задержке.',
    description: 'Shipping Service создаёт отправление. Генерирует tracking number.',
    payload: {
      type: 'ShipmentCreated',
      orderId: 'ord-20240315-001',
      shipmentId: 'shp-45601',
      carrier: 'CDEK',
      trackingNumber: 'CDEK-2024-789456',
      estimatedDelivery: '2024-03-18',
      timestamp: '2024-03-15T14:35:00Z',
    },
    statusColor: '#6a1b9a',
  },
  {
    id: 5,
    name: 'Уведомление клиента',
    event: 'NotificationSent',
    pattern: 'Topic (Pub/Sub)',
    delivery: 'at-most-once',
    idempotencyKey: 'orderId + notificationType',
    errorHandling: 'Retry 1x. При неуспехе: логируем, не блокируем pipeline. Дубль уведомления хуже, чем пропуск.',
    description: 'Notification Service отправляет email/push. Допустима потеря (at-most-once) — дубль уведомления раздражает.',
    payload: {
      type: 'NotificationSent',
      orderId: 'ord-20240315-001',
      userId: 'usr-42',
      channel: 'email',
      template: 'order_shipped',
      trackingUrl: 'https://tracking.example.com/CDEK-2024-789456',
      timestamp: '2024-03-15T14:35:02Z',
    },
    statusColor: '#00838f',
  },
]

export function Task5_3_Solution() {
  const [selectedStage, setSelectedStage] = useState(0)

  const stage = PIPELINE_STAGES[selectedStage]

  const labelStyle = {
    fontSize: '0.75rem',
    color: '#777',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.2rem',
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '850px' }}>
      <h2>Event Pipeline: E-commerce Order</h2>

      {/* Flow visualization */}
      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {PIPELINE_STAGES.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setSelectedStage(i)}
              style={{
                padding: '0.6rem 0.8rem',
                background: selectedStage === i ? s.statusColor : '#f5f5f5',
                color: selectedStage === i ? '#fff' : '#333',
                border: selectedStage === i ? `2px solid ${s.statusColor}` : '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: selectedStage === i ? 'bold' : 'normal',
                fontSize: '0.8rem',
                minWidth: '100px',
                textAlign: 'center' as const,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '1.1rem' }}>{i + 1}</div>
              <div>{s.name}</div>
            </button>
            {i < PIPELINE_STAGES.length - 1 && (
              <span style={{ margin: '0 0.2rem', color: '#bbb', fontSize: '1.2rem' }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* Stage details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={labelStyle}>Event</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: stage.statusColor, marginBottom: '0.8rem' }}>
            {stage.event}
          </div>
          <div style={labelStyle}>Description</div>
          <div style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>{stage.description}</div>
        </div>

        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div>
              <div style={labelStyle}>Pattern</div>
              <div style={{
                padding: '0.3rem 0.5rem',
                background: stage.pattern.includes('Topic') ? '#e8f5e9' : '#e3f2fd',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                display: 'inline-block',
              }}>
                {stage.pattern}
              </div>
            </div>
            <div>
              <div style={labelStyle}>Delivery</div>
              <div style={{
                padding: '0.3rem 0.5rem',
                background: stage.delivery === 'at-least-once' ? '#fff3e0' : '#fce4ec',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                display: 'inline-block',
              }}>
                {stage.delivery}
              </div>
            </div>
            <div>
              <div style={labelStyle}>Idempotency Key</div>
              <code style={{
                padding: '0.3rem 0.5rem',
                background: '#e8eaf6',
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}>
                {stage.idempotencyKey}
              </code>
            </div>
            <div>
              <div style={labelStyle}>Error Handling</div>
              <div style={{ fontSize: '0.8rem' }}>{stage.errorHandling}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payload example */}
      <div style={{ padding: '1rem', background: '#263238', borderRadius: '8px' }}>
        <div style={{ color: '#78909c', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          Example Payload — {stage.event}
        </div>
        <pre style={{
          color: '#e0e0e0',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          margin: 0,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.5,
        }}>
          {JSON.stringify(stage.payload, null, 2)}
        </pre>
      </div>

      {/* Summary table */}
      <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
        <h3>Сводная таблица pipeline</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>#</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Stage</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Event</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Pattern</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Delivery</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Idempotency</th>
            </tr>
          </thead>
          <tbody>
            {PIPELINE_STAGES.map((s, i) => (
              <tr
                key={s.id}
                style={{
                  background: selectedStage === i ? '#e3f2fd' : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedStage(i)}
              >
                <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold', color: s.statusColor }}>{s.id}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{s.name}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>{s.event}</code></td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '0.1rem 0.4rem',
                    background: s.pattern.includes('Topic') ? '#e8f5e9' : '#e3f2fd',
                    borderRadius: '3px',
                    fontSize: '0.75rem',
                  }}>
                    {s.pattern.includes('Topic') ? 'Pub/Sub' : 'Queue'}
                  </span>
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '0.1rem 0.4rem',
                    background: s.delivery === 'at-least-once' ? '#fff3e0' : '#fce4ec',
                    borderRadius: '3px',
                    fontSize: '0.75rem',
                  }}>
                    {s.delivery}
                  </span>
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code style={{ fontSize: '0.75rem' }}>{s.idempotencyKey}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
