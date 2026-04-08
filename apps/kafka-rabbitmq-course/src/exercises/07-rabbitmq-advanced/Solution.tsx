// ============================================
// Level 7: RabbitMQ Advanced Patterns — Solutions
// ============================================

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 7.1: Dead Letter Exchange
// ============================================

type MessageStatus =
  | 'queued'
  | 'processing'
  | 'rejected'
  | 'expired'
  | 'dead-lettered'
  | 'delivered'

interface TrackedMessage {
  id: string
  body: string
  ttl: number | null
  rejectReason: 'nack' | 'expired' | 'maxlen' | null
  status: MessageStatus
  route: string[]
  timestamp: number
}

const DLX_CONFIG = {
  mainExchange: 'orders.exchange',
  mainQueue: 'orders.queue',
  dlx: 'orders.dlx',
  dlq: 'orders.dead-letter',
  dlxRoutingKey: 'dead',
}

function StatusBadge({ status }: { status: MessageStatus }) {
  const map: Record<MessageStatus, { label: string; bg: string; color: string }> = {
    queued: { label: 'QUEUED', bg: '#E3F2FD', color: '#1565C0' },
    processing: { label: 'PROCESSING', bg: '#FFF9C4', color: '#F57F17' },
    rejected: { label: 'REJECTED', bg: '#FFEBEE', color: '#C62828' },
    expired: { label: 'EXPIRED', bg: '#FCE4EC', color: '#880E4F' },
    'dead-lettered': { label: 'DEAD LETTERED', bg: '#F3E5F5', color: '#6A1B9A' },
    delivered: { label: 'DELIVERED', bg: '#E8F5E9', color: '#2E7D32' },
  }
  const s = map[status]
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: '10px',
        fontSize: '0.72rem',
        fontWeight: 700,
        background: s.bg,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  )
}

export function Task7_1_Solution() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<TrackedMessage[]>([])
  const [selectedMsg, setSelectedMsg] = useState<TrackedMessage | null>(null)
  const [msgBody, setMsgBody] = useState('order-123')
  const [ttlMs, setTtlMs] = useState<number | null>(3000)
  const [rejectMode, setRejectMode] = useState<'nack' | 'expired' | 'maxlen'>('nack')
  const timerRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const clearAll = () => {
    Object.values(timerRefs.current).forEach(clearTimeout)
    timerRefs.current = {}
    setMessages([])
    setSelectedMsg(null)
  }

  const updateMsg = (id: string, patch: Partial<TrackedMessage>) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id !== id) return m
        const updated = { ...m, ...patch }
        setSelectedMsg(sel => (sel?.id === id ? updated : sel))
        return updated
      }),
    )
  }

  const publishMessage = () => {
    const id = `msg-${Date.now()}`
    const msg: TrackedMessage = {
      id,
      body: msgBody || 'message',
      ttl: ttlMs,
      rejectReason: rejectMode,
      status: 'queued',
      route: [`→ ${DLX_CONFIG.mainExchange}`, `→ ${DLX_CONFIG.mainQueue}`],
      timestamp: Date.now(),
    }
    setMessages(prev => [msg, ...prev])

    // step 1 — enter processing
    const t1 = setTimeout(() => {
      updateMsg(id, { status: 'processing' })

      if (rejectMode === 'expired' && ttlMs) {
        // TTL expiry path
        const t2 = setTimeout(() => {
          updateMsg(id, {
            status: 'expired',
            route: [
              ...msg.route,
              `x-message-ttl: ${ttlMs}ms истёк`,
              `→ ${DLX_CONFIG.dlx} (x-dead-letter-exchange)`,
            ],
          })
          const t3 = setTimeout(() => {
            updateMsg(id, {
              status: 'dead-lettered',
              route: [
                ...msg.route,
                `x-message-ttl: ${ttlMs}ms истёк`,
                `→ ${DLX_CONFIG.dlx}`,
                `routing-key: "${DLX_CONFIG.dlxRoutingKey}"`,
                `→ ${DLX_CONFIG.dlq}`,
              ],
            })
          }, 800)
          timerRefs.current[`${id}-t3`] = t3
        }, ttlMs)
        timerRefs.current[`${id}-t2`] = t2
      } else if (rejectMode === 'maxlen') {
        const t2 = setTimeout(() => {
          updateMsg(id, {
            status: 'rejected',
            route: [
              ...msg.route,
              'x-max-length: 5 — очередь переполнена',
              `→ ${DLX_CONFIG.dlx}`,
            ],
          })
          const t3 = setTimeout(() => {
            updateMsg(id, {
              status: 'dead-lettered',
              route: [
                ...msg.route,
                'x-max-length: 5 — очередь переполнена',
                `→ ${DLX_CONFIG.dlx}`,
                `→ ${DLX_CONFIG.dlq}`,
              ],
            })
          }, 700)
          timerRefs.current[`${id}-t3`] = t3
        }, 1200)
        timerRefs.current[`${id}-t2`] = t2
      } else {
        // NACK path
        const t2 = setTimeout(() => {
          updateMsg(id, {
            status: 'rejected',
            route: [...msg.route, 'consumer NACK (requeue=false)', `→ ${DLX_CONFIG.dlx}`],
          })
          const t3 = setTimeout(() => {
            updateMsg(id, {
              status: 'dead-lettered',
              route: [
                ...msg.route,
                'consumer NACK (requeue=false)',
                `→ ${DLX_CONFIG.dlx}`,
                `routing-key: "${DLX_CONFIG.dlxRoutingKey}"`,
                `→ ${DLX_CONFIG.dlq}`,
              ],
            })
          }, 700)
          timerRefs.current[`${id}-t3`] = t3
        }, 1500)
        timerRefs.current[`${id}-t2`] = t2
      }
    }, 600)
    timerRefs.current[`${id}-t1`] = t1
  }

  useEffect(() => {
    return () => {
      Object.values(timerRefs.current).forEach(clearTimeout)
    }
  }, [])

  const mainQueue = messages.filter(m =>
    ['queued', 'processing'].includes(m.status),
  )
  const dlq = messages.filter(m => m.status === 'dead-lettered')

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.7.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Визуализация DLX flow: сообщения отклоняются или истекают и попадают в Dead Letter Queue.
      </p>

      {/* Config card */}
      <div
        style={{
          background: '#F8F9FA',
          border: '1px solid #E0E0E0',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.5rem',
          fontSize: '0.82rem',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'sans-serif' }}>
          Конфигурация очереди
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
          <span style={{ color: '#666' }}>x-dead-letter-exchange:</span>
          <span style={{ color: '#6A1B9A' }}>&quot;{DLX_CONFIG.dlx}&quot;</span>
          <span style={{ color: '#666' }}>x-dead-letter-routing-key:</span>
          <span style={{ color: '#6A1B9A' }}>&quot;{DLX_CONFIG.dlxRoutingKey}&quot;</span>
          <span style={{ color: '#666' }}>x-message-ttl:</span>
          <span style={{ color: '#E65100' }}>{ttlMs ?? 'не задан'} мс</span>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#555' }}>
            Тело сообщения
          </label>
          <input
            value={msgBody}
            onChange={e => setMsgBody(e.target.value)}
            style={{
              padding: '0.45rem 0.7rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              width: '160px',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#555' }}>
            Причина DLX
          </label>
          <select
            value={rejectMode}
            onChange={e => setRejectMode(e.target.value as typeof rejectMode)}
            style={{
              padding: '0.45rem 0.7rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '0.85rem',
            }}
          >
            <option value="nack">NACK (rejected)</option>
            <option value="expired">TTL Expired</option>
            <option value="maxlen">Max Length</option>
          </select>
        </div>
        {rejectMode === 'expired' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#555' }}>
              TTL (мс)
            </label>
            <select
              value={ttlMs ?? ''}
              onChange={e => setTtlMs(Number(e.target.value))}
              style={{
                padding: '0.45rem 0.7rem',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '0.85rem',
              }}
            >
              <option value={1000}>1 000</option>
              <option value={2000}>2 000</option>
              <option value={3000}>3 000</option>
            </select>
          </div>
        )}
        <button
          onClick={publishMessage}
          style={{
            padding: '0.5rem 1.2rem',
            background: '#1565C0',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Опубликовать
        </button>
        {messages.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              padding: '0.5rem 1rem',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Очистить
          </button>
        )}
      </div>

      {/* Queue diagram */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Main queue */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '0.85rem',
              marginBottom: '0.5rem',
              color: '#1565C0',
            }}
          >
            {DLX_CONFIG.mainQueue}
            <span
              style={{
                marginLeft: '0.5rem',
                background: '#E3F2FD',
                color: '#1565C0',
                padding: '1px 6px',
                borderRadius: '8px',
                fontSize: '0.75rem',
              }}
            >
              {mainQueue.length}
            </span>
          </div>
          <div
            style={{
              border: '2px solid #90CAF9',
              borderRadius: '8px',
              padding: '0.75rem',
              minHeight: '80px',
              background: '#FAFAFA',
            }}
          >
            {mainQueue.length === 0 ? (
              <div style={{ color: '#aaa', fontSize: '0.82rem' }}>Пусто</div>
            ) : (
              mainQueue.map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMsg(m)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 6px',
                    marginBottom: '4px',
                    borderRadius: '4px',
                    background: selectedMsg?.id === m.id ? '#E3F2FD' : '#fff',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                  }}
                >
                  <span style={{ fontFamily: 'monospace' }}>{m.body}</span>
                  <StatusBadge status={m.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C62828',
            fontWeight: 700,
            fontSize: '1.5rem',
            minWidth: '40px',
          }}
        >
          →
          <div style={{ fontSize: '0.65rem', color: '#888', textAlign: 'center', marginTop: '4px' }}>
            DLX
          </div>
        </div>

        {/* DLQ */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '0.85rem',
              marginBottom: '0.5rem',
              color: '#6A1B9A',
            }}
          >
            {DLX_CONFIG.dlq}
            <span
              style={{
                marginLeft: '0.5rem',
                background: '#F3E5F5',
                color: '#6A1B9A',
                padding: '1px 6px',
                borderRadius: '8px',
                fontSize: '0.75rem',
              }}
            >
              {dlq.length}
            </span>
          </div>
          <div
            style={{
              border: '2px solid #CE93D8',
              borderRadius: '8px',
              padding: '0.75rem',
              minHeight: '80px',
              background: '#FAFAFA',
            }}
          >
            {dlq.length === 0 ? (
              <div style={{ color: '#aaa', fontSize: '0.82rem' }}>Пусто</div>
            ) : (
              dlq.map(m => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMsg(m)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 6px',
                    marginBottom: '4px',
                    borderRadius: '4px',
                    background: selectedMsg?.id === m.id ? '#F3E5F5' : '#fff',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                  }}
                >
                  <span style={{ fontFamily: 'monospace' }}>{m.body}</span>
                  <StatusBadge status={m.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* All messages with route */}
      {messages.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Все сообщения</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {messages.map(m => (
              <div
                key={m.id}
                onClick={() => setSelectedMsg(selectedMsg?.id === m.id ? null : m)}
                style={{
                  border: `1px solid ${selectedMsg?.id === m.id ? '#6A1B9A' : '#E0E0E0'}`,
                  borderRadius: '8px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  background: selectedMsg?.id === m.id ? '#F9F0FF' : '#fff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: selectedMsg?.id === m.id ? '0.5rem' : 0,
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{m.body}</span>
                  <StatusBadge status={m.status} />
                </div>
                {selectedMsg?.id === m.id && (
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.78rem',
                      color: '#555',
                      paddingLeft: '0.5rem',
                      borderLeft: '3px solid #CE93D8',
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: '4px', color: '#6A1B9A' }}>
                      Маршрут сообщения:
                    </div>
                    {m.route.map((step, i) => (
                      <div key={i} style={{ marginBottom: '2px' }}>
                        {i === 0 ? '' : '  '}
                        {step}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 7.2: RPC pattern via RabbitMQ
// ============================================

interface RpcCall {
  correlationId: string
  requestBody: string
  replyTo: string
  status: 'pending' | 'processing' | 'completed' | 'timeout'
  response: string | null
  startedAt: number
  completedAt: number | null
}

type RpcStep =
  | { type: 'client-send'; correlationId: string; msg: string }
  | { type: 'server-recv'; correlationId: string }
  | { type: 'server-process'; correlationId: string }
  | { type: 'server-reply'; correlationId: string; result: string }
  | { type: 'client-recv'; correlationId: string; result: string }
  | { type: 'timeout'; correlationId: string }

function generateCorrelationId(): string {
  return `corr-${Math.random().toString(36).slice(2, 8)}`
}

const RPC_OPERATIONS = [
  {
    label: 'Получить курс USD',
    request: '{ "op": "getRate", "from": "USD", "to": "RUB" }',
    response: ((): string => `{ "rate": ${(87 + Math.random() * 3).toFixed(2)}, "ts": ${Date.now()} }`)
  },
  {
    label: 'Подтвердить заказ',
    request: '{ "op": "confirmOrder", "orderId": "42" }',
    response: (() => '{ "status": "confirmed", "eta": "2h" }')
  },
  {
    label: 'Вычислить скидку',
    request: '{ "op": "calcDiscount", "userId": "u99", "amount": 5000 }',
    response: (() => '{ "discount": 15, "finalAmount": 4250 }')
  },
]

export function Task7_2_Solution() {
  const { t } = useLanguage()
  const [calls, setCalls] = useState<RpcCall[]>([])
  const [sequence, setSequence] = useState<RpcStep[]>([])
  const [selectedOp, setSelectedOp] = useState(0)
  const [simulateTimeout, setSimulateTimeout] = useState(false)
  const timerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const clearAll = () => {
    Object.values(timerRef.current).forEach(clearTimeout)
    timerRef.current = {}
    setCalls([])
    setSequence([])
  }

  const sendRpc = () => {
    const correlationId = generateCorrelationId()
    const replyTo = `amq.gen-${Math.random().toString(36).slice(2, 10)}`
    const op = RPC_OPERATIONS[selectedOp]
    const call: RpcCall = {
      correlationId,
      requestBody: op.request,
      replyTo,
      status: 'pending',
      response: null,
      startedAt: Date.now(),
      completedAt: null,
    }

    setCalls(prev => [call, ...prev])
    addStep({ type: 'client-send', correlationId, msg: op.request })

    const updateCall = (patch: Partial<RpcCall>) => {
      setCalls(prev => prev.map(c => (c.correlationId === correlationId ? { ...c, ...patch } : c)))
    }

    if (simulateTimeout) {
      // no server response — timeout
      timerRef.current[`${correlationId}-timeout`] = setTimeout(() => {
        updateCall({ status: 'timeout' })
        addStep({ type: 'timeout', correlationId })
      }, 4000)
      return
    }

    timerRef.current[`${correlationId}-t1`] = setTimeout(() => {
      updateCall({ status: 'processing' })
      addStep({ type: 'server-recv', correlationId })

      timerRef.current[`${correlationId}-t2`] = setTimeout(() => {
        addStep({ type: 'server-process', correlationId })

        timerRef.current[`${correlationId}-t3`] = setTimeout(() => {
          const result = op.response()
          addStep({ type: 'server-reply', correlationId, result })

          timerRef.current[`${correlationId}-t4`] = setTimeout(() => {
            updateCall({ status: 'completed', response: result, completedAt: Date.now() })
            addStep({ type: 'client-recv', correlationId, result })
          }, 500)
        }, 800)
      }, 600)
    }, 500)
  }

  const addStep = (step: RpcStep) => {
    setSequence(prev => [...prev, step])
  }

  useEffect(() => {
    return () => {
      Object.values(timerRef.current).forEach(clearTimeout)
    }
  }, [])

  const stepIcon: Record<RpcStep['type'], string> = {
    'client-send': '📤',
    'server-recv': '📥',
    'server-process': '⚙️',
    'server-reply': '📤',
    'client-recv': '📥',
    timeout: '⏰',
  }

  const stepColor: Record<RpcStep['type'], string> = {
    'client-send': '#1565C0',
    'server-recv': '#2E7D32',
    'server-process': '#E65100',
    'server-reply': '#2E7D32',
    'client-recv': '#1565C0',
    timeout: '#C62828',
  }

  const stepLabel: Record<RpcStep['type'], string> = {
    'client-send': 'CLIENT → rpc.queue',
    'server-recv': 'SERVER получил запрос',
    'server-process': 'SERVER обрабатывает...',
    'server-reply': 'SERVER → reply-to queue',
    'client-recv': 'CLIENT получил ответ',
    timeout: 'TIMEOUT — нет ответа',
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.7.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Симулятор RPC поверх RabbitMQ: correlation ID, reply-to queue, sequence diagram.
      </p>

      {/* RPC pattern diagram */}
      <div
        style={{
          background: '#F8F9FA',
          border: '1px solid #E0E0E0',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.5rem',
          fontSize: '0.82rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            fontFamily: 'monospace',
          }}
        >
          <span style={{ background: '#E3F2FD', color: '#1565C0', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
            CLIENT
          </span>
          <span style={{ color: '#666' }}>
            →[request + reply-to + correlationId]→
          </span>
          <span style={{ background: '#F3E5F5', color: '#6A1B9A', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
            rpc.queue
          </span>
          <span style={{ color: '#666' }}>→</span>
          <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
            SERVER
          </span>
          <span style={{ color: '#666' }}>→[response + correlationId]→</span>
          <span style={{ background: '#FFF9C4', color: '#F57F17', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
            reply-to
          </span>
          <span style={{ color: '#666' }}>→</span>
          <span style={{ background: '#E3F2FD', color: '#1565C0', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
            CLIENT
          </span>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#555' }}>
            Операция
          </label>
          <select
            value={selectedOp}
            onChange={e => setSelectedOp(Number(e.target.value))}
            style={{
              padding: '0.45rem 0.7rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '0.85rem',
            }}
          >
            {RPC_OPERATIONS.map((op, i) => (
              <option key={i} value={i}>
                {op.label}
              </option>
            ))}
          </select>
        </div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={simulateTimeout}
            onChange={e => setSimulateTimeout(e.target.checked)}
          />
          Симулировать timeout
        </label>
        <button
          onClick={sendRpc}
          style={{
            padding: '0.5rem 1.2rem',
            background: '#1565C0',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Отправить RPC
        </button>
        {(calls.length > 0 || sequence.length > 0) && (
          <button
            onClick={clearAll}
            style={{
              padding: '0.5rem 1rem',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Очистить
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Active calls */}
        <div>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Активные вызовы</h3>
          {calls.length === 0 ? (
            <div style={{ color: '#aaa', fontSize: '0.85rem' }}>Нет вызовов</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {calls.map(c => (
                <div
                  key={c.correlationId}
                  style={{
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.82rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontFamily: 'monospace', color: '#6A1B9A', fontWeight: 700 }}>
                      {c.correlationId}
                    </span>
                    <span
                      style={{
                        padding: '1px 7px',
                        borderRadius: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background:
                          c.status === 'completed'
                            ? '#E8F5E9'
                            : c.status === 'timeout'
                              ? '#FFEBEE'
                              : c.status === 'processing'
                                ? '#FFF9C4'
                                : '#E3F2FD',
                        color:
                          c.status === 'completed'
                            ? '#2E7D32'
                            : c.status === 'timeout'
                              ? '#C62828'
                              : c.status === 'processing'
                                ? '#F57F17'
                                : '#1565C0',
                      }}
                    >
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ color: '#666', marginBottom: '2px' }}>
                    reply-to:{' '}
                    <span style={{ fontFamily: 'monospace', color: '#E65100' }}>{c.replyTo}</span>
                  </div>
                  {c.response && (
                    <div
                      style={{
                        marginTop: '0.35rem',
                        fontFamily: 'monospace',
                        color: '#2E7D32',
                        fontSize: '0.78rem',
                        background: '#F1F8E9',
                        padding: '4px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {c.response}
                    </div>
                  )}
                  {c.completedAt && (
                    <div style={{ color: '#aaa', marginTop: '4px', fontSize: '0.75rem' }}>
                      RTT: {c.completedAt - c.startedAt} мс
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sequence */}
        <div>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Sequence Diagram</h3>
          {sequence.length === 0 ? (
            <div style={{ color: '#aaa', fontSize: '0.85rem' }}>Отправьте RPC-вызов</div>
          ) : (
            <div
              style={{
                background: '#1a1a2e',
                borderRadius: '8px',
                padding: '0.75rem',
                maxHeight: '360px',
                overflowY: 'auto',
              }}
            >
              {sequence.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'flex-start',
                    marginBottom: '6px',
                    fontSize: '0.78rem',
                    fontFamily: 'monospace',
                    color: stepColor[step.type],
                  }}
                >
                  <span>{stepIcon[step.type]}</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{stepLabel[step.type]}</div>
                    <div style={{ color: '#888', fontSize: '0.72rem' }}>
                      corr: {step.correlationId}
                      {'msg' in step && step.msg && (
                        <span style={{ color: '#aaa' }}> | {step.msg.slice(0, 40)}...</span>
                      )}
                      {'result' in step && step.result && (
                        <span style={{ color: '#00cc66' }}> | {step.result.slice(0, 40)}...</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 7.3: Priority Queue & Delayed Messages
// ============================================

interface PriorityMessage {
  id: string
  body: string
  priority: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  status: 'queued' | 'consumed'
  enqueuedAt: number
}

interface DelayedMessage {
  id: string
  body: string
  delayMs: number
  scheduledAt: number
  deliveredAt: number | null
  status: 'scheduled' | 'delivered'
}

const PRIORITY_COLORS: Record<number, { bg: string; color: string; label: string }> = {
  10: { bg: '#FFEBEE', color: '#B71C1C', label: 'CRITICAL' },
  9: { bg: '#FCE4EC', color: '#C62828', label: 'URGENT' },
  8: { bg: '#FFF3E0', color: '#E65100', label: 'HIGH' },
  7: { bg: '#FFF8E1', color: '#F57F17', label: 'ELEVATED' },
  5: { bg: '#E8F5E9', color: '#2E7D32', label: 'NORMAL' },
  3: { bg: '#E3F2FD', color: '#1565C0', label: 'LOW' },
  1: { bg: '#F3E5F5', color: '#6A1B9A', label: 'BACKGROUND' },
  0: { bg: '#F5F5F5', color: '#757575', label: 'MINIMAL' },
}

function getPriorityMeta(p: number) {
  const keys = Object.keys(PRIORITY_COLORS)
    .map(Number)
    .sort((a, b) => b - a)
  for (const k of keys) {
    if (p >= k) return PRIORITY_COLORS[k]
  }
  return PRIORITY_COLORS[0]
}

export function Task7_3_Solution() {
  const { t } = useLanguage()
  const [tab, setTab] = useState<'priority' | 'delayed'>('priority')

  // -- Priority Queue state --
  const [pQueue, setPQueue] = useState<PriorityMessage[]>([])
  const [msgBody, setMsgBody] = useState('task')
  const [msgPriority, setMsgPriority] = useState<PriorityMessage['priority']>(5)
  const [consuming, setConsuming] = useState(false)
  const consumeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const enqueuePriority = () => {
    const msg: PriorityMessage = {
      id: `p-${Date.now()}`,
      body: `${msgBody}-${Date.now().toString().slice(-4)}`,
      priority: msgPriority,
      status: 'queued',
      enqueuedAt: Date.now(),
    }
    setPQueue(prev => [...prev, msg])
  }

  const sortedQueue = [...pQueue]
    .filter(m => m.status === 'queued')
    .sort((a, b) => b.priority - a.priority)

  const consumedList = pQueue.filter(m => m.status === 'consumed')

  const consumeNext = () => {
    const next = sortedQueue[0]
    if (!next) return
    setPQueue(prev => prev.map(m => (m.id === next.id ? { ...m, status: 'consumed' } : m)))
  }

  const startAutoConsume = () => {
    setConsuming(true)
  }

  const stopAutoConsume = () => {
    setConsuming(false)
    if (consumeRef.current) clearInterval(consumeRef.current)
  }

  useEffect(() => {
    if (consuming) {
      const interval = setInterval(() => {
        setPQueue(prev => {
          const sorted = [...prev]
            .filter(m => m.status === 'queued')
            .sort((a, b) => b.priority - a.priority)
          if (sorted.length === 0) {
            setConsuming(false)
            clearInterval(interval)
            return prev
          }
          const next = sorted[0]
          return prev.map(m => (m.id === next.id ? { ...m, status: 'consumed' } : m))
        })
      }, 600)
      consumeRef.current = interval
      return () => clearInterval(interval)
    }
  }, [consuming])

  // -- Delayed Messages state --
  const [delayedMsgs, setDelayedMsgs] = useState<DelayedMessage[]>([])
  const [delayInput, setDelayInput] = useState(3000)
  const [delayBody, setDelayBody] = useState('delayed-task')
  const delayTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 200)
    return () => clearInterval(id)
  }, [])

  const scheduleMessage = () => {
    const id = `d-${Date.now()}`
    const now = Date.now()
    const msg: DelayedMessage = {
      id,
      body: `${delayBody}-${now.toString().slice(-4)}`,
      delayMs: delayInput,
      scheduledAt: now,
      deliveredAt: null,
      status: 'scheduled',
    }
    setDelayedMsgs(prev => [msg, ...prev])

    delayTimers.current[id] = setTimeout(() => {
      setDelayedMsgs(prev =>
        prev.map(m =>
          m.id === id ? { ...m, status: 'delivered', deliveredAt: Date.now() } : m,
        ),
      )
    }, delayInput)
  }

  useEffect(() => {
    return () => {
      Object.values(delayTimers.current).forEach(clearTimeout)
    }
  }, [])

  const clearPriority = () => {
    stopAutoConsume()
    setPQueue([])
  }

  const clearDelayed = () => {
    Object.values(delayTimers.current).forEach(clearTimeout)
    delayTimers.current = {}
    setDelayedMsgs([])
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.7.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        Priority Queue: сообщения с высоким приоритетом потребляются первыми. Delayed Messages:
        планировщик с визуальным таймером.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['priority', 'delayed'] as const).map(tab_ => (
          <button
            key={tab_}
            onClick={() => setTab(tab_)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: tab === tab_ ? '#1565C0' : '#fff',
              color: tab === tab_ ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: tab === tab_ ? 700 : 400,
            }}
          >
            {tab_ === 'priority' ? 'Priority Queue' : 'Delayed Messages'}
          </button>
        ))}
      </div>

      {tab === 'priority' ? (
        <div>
          {/* Config hint */}
          <div
            style={{
              background: '#F8F9FA',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              padding: '0.75rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ color: '#666' }}>x-max-priority: </span>
            <span style={{ color: '#C62828', fontWeight: 700 }}>10</span>
            <span style={{ color: '#aaa', marginLeft: '1rem' }}>
              // диапазон приоритетов 0–10
            </span>
          </div>

          {/* Controls */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#555' }}>
                Сообщение
              </label>
              <input
                value={msgBody}
                onChange={e => setMsgBody(e.target.value)}
                style={{
                  padding: '0.45rem 0.7rem',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  width: '140px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#555' }}>
                Приоритет
              </label>
              <select
                value={msgPriority}
                onChange={e => setMsgPriority(Number(e.target.value) as PriorityMessage['priority'])}
                style={{
                  padding: '0.45rem 0.7rem',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                }}
              >
                {[10, 9, 8, 7, 5, 3, 1, 0].map(p => {
                  const meta = getPriorityMeta(p)
                  return (
                    <option key={p} value={p}>
                      {p} — {meta.label}
                    </option>
                  )
                })}
              </select>
            </div>
            <button
              onClick={enqueuePriority}
              style={{
                padding: '0.5rem 1rem',
                background: '#1565C0',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              Enqueue
            </button>
            <button
              onClick={consumeNext}
              disabled={sortedQueue.length === 0}
              style={{
                padding: '0.5rem 1rem',
                background: sortedQueue.length === 0 ? '#E0E0E0' : '#2E7D32',
                color: sortedQueue.length === 0 ? '#aaa' : '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: sortedQueue.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              Consume 1
            </button>
            <button
              onClick={consuming ? stopAutoConsume : startAutoConsume}
              disabled={sortedQueue.length === 0 && !consuming}
              style={{
                padding: '0.5rem 1rem',
                background: consuming ? '#E65100' : '#6A1B9A',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              {consuming ? 'Stop Auto' : 'Auto Consume'}
            </button>
            {pQueue.length > 0 && (
              <button
                onClick={clearPriority}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Очистить
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Queue (sorted by priority) */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#1565C0' }}>
                Очередь (сортировка по приоритету)
                <span
                  style={{
                    marginLeft: '0.5rem',
                    background: '#E3F2FD',
                    color: '#1565C0',
                    padding: '1px 6px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                  }}
                >
                  {sortedQueue.length}
                </span>
              </div>
              <div
                style={{
                  border: '2px solid #90CAF9',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  minHeight: '80px',
                  background: '#FAFAFA',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {sortedQueue.length === 0 && (
                  <div style={{ color: '#aaa', fontSize: '0.82rem' }}>Добавьте сообщения</div>
                )}
                {sortedQueue.map((m, idx) => {
                  const meta = getPriorityMeta(m.priority)
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: idx === 0 ? meta.bg : '#fff',
                        border: `1px solid ${idx === 0 ? meta.color : '#E0E0E0'}`,
                        fontSize: '0.82rem',
                      }}
                    >
                      <span style={{ fontFamily: 'monospace' }}>{m.body}</span>
                      <span
                        style={{
                          padding: '1px 7px',
                          borderRadius: '8px',
                          background: meta.bg,
                          color: meta.color,
                          fontWeight: 700,
                          fontSize: '0.72rem',
                        }}
                      >
                        P{m.priority} {meta.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Consumed */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#2E7D32' }}>
                Потреблено
                <span
                  style={{
                    marginLeft: '0.5rem',
                    background: '#E8F5E9',
                    color: '#2E7D32',
                    padding: '1px 6px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                  }}
                >
                  {consumedList.length}
                </span>
              </div>
              <div
                style={{
                  border: '2px solid #A5D6A7',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  minHeight: '80px',
                  background: '#FAFAFA',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {consumedList.length === 0 && (
                  <div style={{ color: '#aaa', fontSize: '0.82rem' }}>Нет потреблённых</div>
                )}
                {[...consumedList].reverse().map(m => {
                  const meta = getPriorityMeta(m.priority)
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: '#fff',
                        border: '1px solid #E0E0E0',
                        fontSize: '0.82rem',
                        opacity: 0.85,
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', textDecoration: 'line-through', color: '#aaa' }}>
                        {m.body}
                      </span>
                      <span
                        style={{
                          padding: '1px 7px',
                          borderRadius: '8px',
                          background: meta.bg,
                          color: meta.color,
                          fontWeight: 700,
                          fontSize: '0.72rem',
                        }}
                      >
                        P{m.priority}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Delayed messages config */}
          <div
            style={{
              background: '#F8F9FA',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              padding: '0.75rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ color: '#666' }}>x-delayed-type: </span>
            <span style={{ color: '#6A1B9A', fontWeight: 700 }}>&quot;direct&quot;</span>
            <span style={{ color: '#aaa', marginLeft: '1rem' }}>
              // rabbitmq-delayed-message-exchange plugin
            </span>
          </div>

          {/* Controls */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#555' }}>
                Сообщение
              </label>
              <input
                value={delayBody}
                onChange={e => setDelayBody(e.target.value)}
                style={{
                  padding: '0.45rem 0.7rem',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  width: '160px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#555' }}>
                Задержка
              </label>
              <select
                value={delayInput}
                onChange={e => setDelayInput(Number(e.target.value))}
                style={{
                  padding: '0.45rem 0.7rem',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                }}
              >
                <option value={2000}>2 сек</option>
                <option value={4000}>4 сек</option>
                <option value={6000}>6 сек</option>
                <option value={10000}>10 сек</option>
              </select>
            </div>
            <button
              onClick={scheduleMessage}
              style={{
                padding: '0.5rem 1.2rem',
                background: '#E65100',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Запланировать
            </button>
            {delayedMsgs.length > 0 && (
              <button
                onClick={clearDelayed}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Очистить
              </button>
            )}
          </div>

          {/* Delayed messages list */}
          {delayedMsgs.length === 0 ? (
            <div style={{ color: '#aaa', fontSize: '0.85rem' }}>Запланируйте сообщение</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {delayedMsgs.map(m => {
                const now = Date.now()
                const elapsed = now - m.scheduledAt
                const progress =
                  m.status === 'delivered' ? 100 : Math.min((elapsed / m.delayMs) * 100, 100)
                const remaining =
                  m.status === 'delivered'
                    ? 0
                    : Math.max(0, Math.ceil((m.delayMs - elapsed) / 1000))

                return (
                  <div
                    key={m.id}
                    style={{
                      border: `1px solid ${m.status === 'delivered' ? '#A5D6A7' : '#FFB74D'}`,
                      borderRadius: '10px',
                      padding: '0.75rem',
                      background: m.status === 'delivered' ? '#F1F8E9' : '#FFFDE7',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }}>
                        {m.body}
                      </span>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: m.status === 'delivered' ? '#E8F5E9' : '#FFF3E0',
                          color: m.status === 'delivered' ? '#2E7D32' : '#E65100',
                        }}
                      >
                        {m.status === 'delivered' ? 'DELIVERED' : `${remaining}s`}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div
                      style={{
                        background: '#E0E0E0',
                        borderRadius: '4px',
                        height: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${progress}%`,
                          background: m.status === 'delivered' ? '#4CAF50' : '#FF9800',
                          transition: 'width 0.2s ease',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: '#888' }}>
                      <span>x-delay: {m.delayMs}ms</span>
                      {m.deliveredAt && (
                        <span>
                          доставлено через {m.deliveredAt - m.scheduledAt} мс
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
