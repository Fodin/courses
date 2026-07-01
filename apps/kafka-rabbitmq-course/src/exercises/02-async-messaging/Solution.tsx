import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../../hooks'

// ============================================
// Задание 2.1: Sync vs Async — визуальное сравнение
// ============================================

type ServiceStatus = 'idle' | 'waiting' | 'processing' | 'done' | 'error'

interface ServiceState {
  name: string
  status: ServiceStatus
  duration: number
}

const STATUS_COLORS: Record<ServiceStatus, { bg: string; border: string; text: string }> = {
  idle: { bg: '#f0f0f0', border: '#ccc', text: '#666' },
  waiting: { bg: '#fff3cd', border: '#ffc107', text: '#856404' },
  processing: { bg: '#cfe2ff', border: '#0d6efd', text: '#084298' },
  done: { bg: '#d1e7dd', border: '#198754', text: '#0a3622' },
  error: { bg: '#f8d7da', border: '#dc3545', text: '#58151c' },
}

const STATUS_LABELS: Record<ServiceStatus, string> = {
  idle: 'ожидание',
  waiting: 'заблокирован',
  processing: 'обработка',
  done: 'готово',
  error: 'ошибка',
}

function ServiceBox({
  service,
  isDark,
}: {
  service: ServiceState
  isDark: boolean
}) {
  const colors = STATUS_COLORS[service.status]
  const bgColor = isDark
    ? service.status === 'idle'
      ? '#21262d'
      : service.status === 'waiting'
        ? '#3d2c00'
        : service.status === 'processing'
          ? '#0d2b5e'
          : service.status === 'done'
            ? '#0a3622'
            : '#3d0a0f'
    : colors.bg

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        border: `2px solid ${colors.border}`,
        background: bgColor,
        color: isDark ? '#e6edf3' : colors.text,
        minWidth: '120px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
        {service.name}
      </div>
      <div style={{ fontSize: '0.75rem', color: colors.border }}>
        {STATUS_LABELS[service.status]}
      </div>
      {service.status === 'processing' && (
        <div
          style={{
            marginTop: '6px',
            height: '3px',
            borderRadius: '2px',
            background: colors.border,
            animation: 'pulse 1s ease-in-out infinite',
          }}
        />
      )}
    </div>
  )
}

const SYNC_SERVICES: ServiceState[] = [
  { name: 'Order Service', status: 'idle', duration: 800 },
  { name: 'Payment Service', status: 'idle', duration: 1200 },
  { name: 'Inventory Service', status: 'idle', duration: 700 },
  { name: 'Notification Service', status: 'idle', duration: 500 },
]

const ASYNC_SERVICES: ServiceState[] = [
  { name: 'Order Service', status: 'idle', duration: 300 },
  { name: 'Message Queue', status: 'idle', duration: 100 },
  { name: 'Payment Worker', status: 'idle', duration: 1200 },
  { name: 'Inventory Worker', status: 'idle', duration: 700 },
]

export function Task2_1_Solution() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [syncServices, setSyncServices] = useState<ServiceState[]>(SYNC_SERVICES)
  const [asyncServices, setAsyncServices] = useState<ServiceState[]>(ASYNC_SERVICES)
  const [syncRunning, setSyncRunning] = useState(false)
  const [asyncRunning, setAsyncRunning] = useState(false)
  const [syncTime, setSyncTime] = useState<number | null>(null)
  const [asyncTime, setAsyncTime] = useState<number | null>(null)
  const [syncDone, setSyncDone] = useState(false)
  const [asyncDone, setAsyncDone] = useState(false)

  const syncStartRef = useRef<number>(0)
  const asyncStartRef = useRef<number>(0)

  const resetSync = () => {
    setSyncServices(SYNC_SERVICES.map(s => ({ ...s, status: 'idle' })))
    setSyncRunning(false)
    setSyncTime(null)
    setSyncDone(false)
  }

  const resetAsync = () => {
    setAsyncServices(ASYNC_SERVICES.map(s => ({ ...s, status: 'idle' })))
    setAsyncRunning(false)
    setAsyncTime(null)
    setAsyncDone(false)
  }

  const runSync = useCallback(async () => {
    resetSync()
    setSyncRunning(true)
    syncStartRef.current = Date.now()

    // Sequential — each service waits for the previous
    for (let i = 0; i < SYNC_SERVICES.length; i++) {
      // Mark current as processing, previous as waiting
      setSyncServices(prev =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? 'done' : idx === i ? 'processing' : 'waiting',
        }))
      )
      await new Promise(r => setTimeout(r, SYNC_SERVICES[i].duration))
    }

    setSyncServices(prev => prev.map(s => ({ ...s, status: 'done' })))
    setSyncTime(Date.now() - syncStartRef.current)
    setSyncRunning(false)
    setSyncDone(true)
  }, [])

  const runAsync = useCallback(async () => {
    resetAsync()
    setAsyncRunning(true)
    asyncStartRef.current = Date.now()

    // Order Service publishes message and returns immediately
    setAsyncServices(prev =>
      prev.map((s, idx) => ({
        ...s,
        status: idx === 0 ? 'processing' : 'idle',
      }))
    )
    await new Promise(r => setTimeout(r, 300))

    // Order Service done, message in queue
    setAsyncServices(prev =>
      prev.map((s, idx) => ({
        ...s,
        status: idx === 0 ? 'done' : idx === 1 ? 'processing' : 'idle',
      }))
    )
    await new Promise(r => setTimeout(r, 200))

    // Workers pick up concurrently
    setAsyncServices(prev =>
      prev.map((s, idx) => ({
        ...s,
        status: idx <= 1 ? 'done' : 'processing',
      }))
    )

    // Workers finish at their own pace
    await new Promise(r => setTimeout(r, Math.max(1200, 700)))
    setAsyncServices(prev => prev.map(s => ({ ...s, status: 'done' })))
    setAsyncTime(Date.now() - asyncStartRef.current)
    setAsyncRunning(false)
    setAsyncDone(true)
  }, [])

  const cardBg = isDark ? '#161b22' : '#f8f9fa'
  const borderColor = isDark ? '#30363d' : '#dee2e6'

  return (
    <div className="exercise-container">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes arrow-move {
          0% { opacity: 0; transform: translateX(-10px); }
          50% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(10px); }
        }
      `}</style>
      <h2>Задание 2.1: Sync vs Async — визуальное сравнение</h2>
      <p style={{ color: isDark ? '#8b949e' : '#666', marginBottom: '1.5rem' }}>
        Запустите обе анимации и сравните, как синхронная цепочка блокирует сервисы, а
        асинхронная коммуникация через очередь позволяет Order Service вернуться сразу.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
        }}
      >
        {/* Sync panel */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            background: cardBg,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1rem', color: isDark ? '#e6edf3' : '#213547' }}>
              Синхронный вызов
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '12px',
                background: '#dc3545',
                color: '#fff',
              }}
            >
              HTTP/gRPC
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
            {syncServices.map((svc, idx) => (
              <div key={svc.name}>
                <ServiceBox service={svc} isDark={isDark} />
                {idx < syncServices.length - 1 && (
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      color: isDark ? '#8b949e' : '#aaa',
                      margin: '2px 0',
                      animation:
                        svc.status === 'processing' ? 'arrow-move 0.8s ease-in-out infinite' : 'none',
                    }}
                  >
                    {'\u2193'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {syncDone && syncTime !== null && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                background: isDark ? '#0a3622' : '#d1e7dd',
                color: isDark ? '#75b798' : '#0a3622',
                fontSize: '0.85rem',
                marginBottom: '0.75rem',
              }}
            >
              Общее время: <strong>{syncTime} мс</strong>
              <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                (сумма всех шагов — каждый ждёт предыдущего)
              </div>
            </div>
          )}

          <button
            onClick={runSync}
            disabled={syncRunning}
            style={{ width: '100%' }}
          >
            {syncRunning ? 'Выполняется...' : 'Запустить синхронно'}
          </button>
        </div>

        {/* Async panel */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            background: cardBg,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1rem', color: isDark ? '#e6edf3' : '#213547' }}>
              Асинхронная очередь
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '12px',
                background: '#198754',
                color: '#fff',
              }}
            >
              Message Queue
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
            {asyncServices.map((svc, idx) => (
              <div key={svc.name}>
                <ServiceBox service={svc} isDark={isDark} />
                {idx < asyncServices.length - 1 && (
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: idx === 1 ? '1rem' : '1.2rem',
                      color: isDark ? '#8b949e' : '#aaa',
                      margin: '2px 0',
                    }}
                  >
                    {idx === 1 ? '\u21a4 \u21a6' : '\u2193'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {asyncDone && asyncTime !== null && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                background: isDark ? '#0a3622' : '#d1e7dd',
                color: isDark ? '#75b798' : '#0a3622',
                fontSize: '0.85rem',
                marginBottom: '0.75rem',
              }}
            >
              Общее время: <strong>{asyncTime} мс</strong>
              <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                (Order Service вернулся через ~300 мс, workers работали параллельно)
              </div>
            </div>
          )}

          <button
            onClick={runAsync}
            disabled={asyncRunning}
            style={{ width: '100%' }}
          >
            {asyncRunning ? 'Выполняется...' : 'Запустить асинхронно'}
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          borderRadius: '8px',
          background: isDark ? '#21262d' : '#fff8e1',
          border: `1px solid ${isDark ? '#30363d' : '#ffe082'}`,
          fontSize: '0.9rem',
          color: isDark ? '#e6edf3' : '#5d4037',
        }}
      >
        <strong>Ключевой вывод:</strong> В синхронной модели Order Service заблокирован до
        завершения всей цепочки. В асинхронной — он отправляет сообщение в очередь и
        возвращает ответ клиенту немедленно, а workers обрабатывают задачи независимо.
      </div>
    </div>
  )
}

// ============================================
// Задание 2.2: Point-to-Point очередь — симулятор
// ============================================

interface Message {
  id: number
  text: string
  status: 'in-queue' | 'processing' | 'done'
  consumerId?: number
}

interface Consumer {
  id: number
  name: string
  busy: boolean
  processedCount: number
}

export function Task2_2_Solution() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [queue, setQueue] = useState<Message[]>([])
  const [consumers, setConsumers] = useState<Consumer[]>([
    { id: 1, name: 'Consumer A', busy: false, processedCount: 0 },
    { id: 2, name: 'Consumer B', busy: false, processedCount: 0 },
  ])
  const [history, setHistory] = useState<string[]>([])
  const [msgCounter, setMsgCounter] = useState(1)
  const [autoProducing, setAutoProducing] = useState(false)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const processingRef = useRef(false)

  const PROCESS_TIME = 1500

  const pushMessage = useCallback((text?: string) => {
    const msgText = text ?? `Order #${msgCounter}`
    setMsgCounter(c => c + 1)
    const id = Date.now() + Math.random()
    setQueue(prev => [...prev, { id, text: msgText, status: 'in-queue' }])
    setHistory(prev => [`[${new Date().toLocaleTimeString()}] Producer -> Queue: "${msgText}"`, ...prev.slice(0, 19)])
  }, [msgCounter])

  // Processing loop
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue(currentQueue => {
        if (currentQueue.filter(m => m.status === 'in-queue').length === 0) return currentQueue

        setConsumers(currentConsumers => {
          const freeConsumer = currentConsumers.find(c => !c.busy)
          if (!freeConsumer) return currentConsumers

          const firstMsg = currentQueue.find(m => m.status === 'in-queue')
          if (!firstMsg) return currentConsumers

          // Mark consumer as busy
          const updatedConsumers = currentConsumers.map(c =>
            c.id === freeConsumer.id ? { ...c, busy: true } : c
          )

          // Mark message as processing
          setQueue(q =>
            q.map(m =>
              m.id === firstMsg.id
                ? { ...m, status: 'processing' as const, consumerId: freeConsumer.id }
                : m
            )
          )

          setHistory(prev => [
            `[${new Date().toLocaleTimeString()}] ${freeConsumer.name} <- Queue: "${firstMsg.text}"`,
            ...prev.slice(0, 19),
          ])

          // Free consumer after processing
          setTimeout(() => {
            setQueue(q => q.filter(m => m.id !== firstMsg.id))
            setConsumers(c =>
              c.map(con =>
                con.id === freeConsumer.id
                  ? { ...con, busy: false, processedCount: con.processedCount + 1 }
                  : con
              )
            )
            setHistory(prev => [
              `[${new Date().toLocaleTimeString()}] ${freeConsumer.name} DONE: "${firstMsg.text}"`,
              ...prev.slice(0, 19),
            ])
          }, PROCESS_TIME)

          return updatedConsumers
        })

        return currentQueue
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  const toggleAutoProducing = () => {
    if (autoProducing) {
      if (autoRef.current) clearInterval(autoRef.current)
      setAutoProducing(false)
    } else {
      setAutoProducing(true)
      autoRef.current = setInterval(() => {
        setMsgCounter(c => {
          const text = `Order #${c}`
          const id = Date.now() + Math.random()
          setQueue(prev => [...prev, { id, text, status: 'in-queue' }])
          setHistory(prev => [
            `[${new Date().toLocaleTimeString()}] Producer -> Queue: "${text}"`,
            ...prev.slice(0, 19),
          ])
          return c + 1
        })
      }, 800)
    }
  }

  const addConsumer = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F']
    setConsumers(prev => {
      if (prev.length >= 4) return prev
      const nextLetter = letters[prev.length]
      return [...prev, { id: Date.now(), name: `Consumer ${nextLetter}`, busy: false, processedCount: 0 }]
    })
  }

  const removeConsumer = () => {
    setConsumers(prev => {
      if (prev.length <= 1) return prev
      const last = prev[prev.length - 1]
      if (last.busy) return prev
      return prev.slice(0, -1)
    })
  }

  const cardBg = isDark ? '#161b22' : '#f8f9fa'
  const borderColor = isDark ? '#30363d' : '#dee2e6'
  const textColor = isDark ? '#e6edf3' : '#213547'
  const mutedColor = isDark ? '#8b949e' : '#6c757d'

  const queueMsgs = queue.filter(m => m.status === 'in-queue')
  const processingMsgs = queue.filter(m => m.status === 'processing')

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Point-to-Point очередь — симулятор</h2>
      <p style={{ color: mutedColor, marginBottom: '1.5rem' }}>
        Каждое сообщение доставляется ровно одному consumer. Competing consumers
        параллельно разбирают очередь — добавьте больше consumers, чтобы увеличить
        пропускную способность.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => pushMessage()}>
          + Отправить сообщение
        </button>
        <button
          onClick={toggleAutoProducing}
          style={{
            background: autoProducing ? '#dc3545' : undefined,
            borderColor: autoProducing ? '#dc3545' : undefined,
          }}
        >
          {autoProducing ? 'Остановить поток' : 'Авто-поток (800мс)'}
        </button>
        <button onClick={addConsumer} disabled={consumers.length >= 4}>
          + Consumer
        </button>
        <button onClick={removeConsumer} disabled={consumers.length <= 1}>
          - Consumer
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'start' }}>
        {/* Queue */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '10px',
            border: `1px solid ${borderColor}`,
            background: cardBg,
            minHeight: '200px',
          }}
        >
          <div style={{ fontWeight: 600, color: textColor, marginBottom: '0.75rem' }}>
            Очередь ({queueMsgs.length} сообщений)
          </div>
          {queueMsgs.length === 0 ? (
            <div style={{ color: mutedColor, fontSize: '0.85rem', fontStyle: 'italic' }}>
              Очередь пуста
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {queueMsgs.slice(0, 8).map(msg => (
                <div
                  key={msg.id}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: isDark ? '#0d2b5e' : '#cfe2ff',
                    color: isDark ? '#79b8ff' : '#084298',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{'[MSG]'}</span>
                  <span>{msg.text}</span>
                </div>
              ))}
              {queueMsgs.length > 8 && (
                <div style={{ color: mutedColor, fontSize: '0.75rem' }}>
                  ...ещё {queueMsgs.length - 8}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Arrow */}
        <div style={{ paddingTop: '3rem', color: mutedColor, fontSize: '1.5rem' }}>
          {'\u2192'}
        </div>

        {/* Consumers */}
        <div
          style={{
            padding: '1rem',
            borderRadius: '10px',
            border: `1px solid ${borderColor}`,
            background: cardBg,
            minHeight: '200px',
          }}
        >
          <div style={{ fontWeight: 600, color: textColor, marginBottom: '0.75rem' }}>
            Consumers
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {consumers.map(consumer => {
              const msg = processingMsgs.find(m => m.consumerId === consumer.id)
              return (
                <div
                  key={consumer.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `2px solid ${consumer.busy ? '#0d6efd' : (isDark ? '#30363d' : '#dee2e6')}`,
                    background: consumer.busy
                      ? isDark ? '#0d2b5e' : '#e7f1ff'
                      : isDark ? '#21262d' : '#fff',
                    transition: 'all 0.3s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: textColor }}>
                      {consumer.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        background: consumer.busy ? '#0d6efd' : (isDark ? '#30363d' : '#e9ecef'),
                        color: consumer.busy ? '#fff' : mutedColor,
                      }}
                    >
                      {consumer.busy ? 'занят' : 'свободен'}
                    </span>
                  </div>
                  {msg && (
                    <div style={{ fontSize: '0.75rem', color: isDark ? '#79b8ff' : '#0d6efd' }}>
                      Обрабатывает: {msg.text}
                    </div>
                  )}
                  <div style={{ fontSize: '0.72rem', color: mutedColor, marginTop: '2px' }}>
                    Обработано: {consumer.processedCount}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Log */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          borderRadius: '8px',
          background: isDark ? '#0d1117' : '#1e1e1e',
          maxHeight: '160px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.78rem',
        }}
      >
        {history.length === 0 ? (
          <div style={{ color: '#666' }}>Лог событий...</div>
        ) : (
          history.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.includes('DONE') ? '#4caf50' : line.includes('Queue:') && line.includes('<-') ? '#79b8ff' : '#e6edf3',
                marginBottom: '2px',
              }}
            >
              {line}
            </div>
          ))
        )}
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          background: isDark ? '#21262d' : '#fff8e1',
          border: `1px solid ${isDark ? '#30363d' : '#ffe082'}`,
          fontSize: '0.85rem',
          color: isDark ? '#e6edf3' : '#5d4037',
        }}
      >
        <strong>Competing Consumers:</strong> каждое сообщение обрабатывается ровно одним
        consumer. Добавляйте consumers для горизонтального масштабирования пропускной
        способности.
      </div>
    </div>
  )
}

// ============================================
// Задание 2.3: Pub/Sub — fan-out симулятор
// ============================================

interface Subscriber {
  id: number
  name: string
  topic: string
  receivedMessages: Array<{ text: string; timestamp: number }>
}

interface PubSubMessage {
  id: number
  text: string
  topic: string
  x: number
  targetIdx: number
  animating: boolean
}

const TOPICS = ['order.created', 'payment.processed', 'user.registered']

const TOPIC_COLORS: Record<string, { bg: string; border: string; dark: string }> = {
  'order.created': { bg: '#cfe2ff', border: '#0d6efd', dark: '#0d2b5e' },
  'payment.processed': { bg: '#d1e7dd', border: '#198754', dark: '#0a3622' },
  'user.registered': { bg: '#fff3cd', border: '#ffc107', dark: '#3d2c00' },
}

export function Task2_3_Solution() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    { id: 1, name: 'Email Service', topic: 'order.created', receivedMessages: [] },
    { id: 2, name: 'Analytics', topic: 'order.created', receivedMessages: [] },
    { id: 3, name: 'Fraud Detector', topic: 'payment.processed', receivedMessages: [] },
  ])
  const [selectedTopic, setSelectedTopic] = useState<string>('order.created')
  const [animations, setAnimations] = useState<PubSubMessage[]>([])
  const [publishCount, setPublishCount] = useState(0)
  const [newSubName, setNewSubName] = useState('')
  const [newSubTopic, setNewSubTopic] = useState('order.created')
  const subIdCounter = useRef(10)

  const publish = (topic: string) => {
    const msgId = Date.now()
    const msgText = `${topic.split('.')[1].toUpperCase()} #${publishCount + 1}`
    setPublishCount(c => c + 1)

    const topicSubs = subscribers.filter(s => s.topic === topic)
    if (topicSubs.length === 0) return

    // Animate
    const newAnimations: PubSubMessage[] = topicSubs.map((_, idx) => ({
      id: msgId + idx,
      text: msgText,
      topic,
      x: 0,
      targetIdx: idx,
      animating: true,
    }))
    setAnimations(prev => [...prev, ...newAnimations])

    // Deliver to subscribers after animation
    setTimeout(() => {
      setSubscribers(prev =>
        prev.map(sub => {
          if (sub.topic !== topic) return sub
          return {
            ...sub,
            receivedMessages: [
              { text: msgText, timestamp: Date.now() },
              ...sub.receivedMessages.slice(0, 4),
            ],
          }
        })
      )
      setAnimations(prev => prev.filter(a => !newAnimations.map(n => n.id).includes(a.id)))
    }, 800)
  }

  const addSubscriber = () => {
    if (!newSubName.trim()) return
    subIdCounter.current += 1
    setSubscribers(prev => [
      ...prev,
      {
        id: subIdCounter.current,
        name: newSubName.trim(),
        topic: newSubTopic,
        receivedMessages: [],
      },
    ])
    setNewSubName('')
  }

  const removeSubscriber = (id: number) => {
    setSubscribers(prev => prev.filter(s => s.id !== id))
  }

  const cardBg = isDark ? '#161b22' : '#f8f9fa'
  const borderColor = isDark ? '#30363d' : '#dee2e6'
  const textColor = isDark ? '#e6edf3' : '#213547'
  const mutedColor = isDark ? '#8b949e' : '#6c757d'

  return (
    <div className="exercise-container">
      <style>{`
        @keyframes fly-right {
          0% { opacity: 0; transform: scale(0.5) translateX(-20px); }
          30% { opacity: 1; transform: scale(1) translateX(0); }
          80% { opacity: 1; transform: scale(1) translateX(0); }
          100% { opacity: 0; transform: scale(0.8) translateX(20px); }
        }
      `}</style>
      <h2>Задание 2.3: Pub/Sub — fan-out симулятор</h2>
      <p style={{ color: mutedColor, marginBottom: '1.5rem' }}>
        Publisher отправляет сообщение в topic — оно доставляется всем subscribers этого
        топика одновременно. Добавляйте и удаляйте подписчиков динамически.
      </p>

      {/* Publisher */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: '10px',
          border: `2px solid #0d6efd`,
          background: isDark ? '#0d2b5e' : '#e7f1ff',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: isDark ? '#79b8ff' : '#0d6efd',
            marginBottom: '1rem',
            fontSize: '0.95rem',
          }}
        >
          Publisher
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {TOPICS.map(topic => {
            const colors = TOPIC_COLORS[topic]
            const subCount = subscribers.filter(s => s.topic === topic).length
            return (
              <button
                key={topic}
                onClick={() => publish(topic)}
                style={{
                  background: isDark ? colors.dark : colors.bg,
                  border: `2px solid ${colors.border}`,
                  color: isDark ? '#e6edf3' : '#213547',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  position: 'relative',
                }}
              >
                Publish: {topic}
                <span
                  style={{
                    marginLeft: '6px',
                    background: colors.border,
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '0.7rem',
                  }}
                >
                  {subCount} sub{subCount !== 1 ? 's' : ''}
                </span>
                {/* Flying message animations */}
                {animations
                  .filter(a => a.topic === topic)
                  .slice(0, 1)
                  .map(anim => (
                    <span
                      key={anim.id}
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '0',
                        background: colors.border,
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        animation: 'fly-right 0.8s ease-in-out forwards',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        zIndex: 10,
                      }}
                    >
                      {anim.text}
                    </span>
                  ))}
              </button>
            )
          })}
        </div>
      </div>

      {/* Subscribers grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {subscribers.map(sub => {
          const colors = TOPIC_COLORS[sub.topic] || TOPIC_COLORS['order.created']
          const hasAnimation = animations.some(a => a.topic === sub.topic)
          return (
            <div
              key={sub.id}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                border: `2px solid ${hasAnimation ? colors.border : (isDark ? '#30363d' : '#dee2e6')}`,
                background: hasAnimation
                  ? isDark ? colors.dark : colors.bg
                  : isDark ? '#21262d' : '#fff',
                transition: 'all 0.3s',
                position: 'relative',
              }}
            >
              <button
                onClick={() => removeSubscriber(sub.id)}
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: mutedColor,
                  fontSize: '0.75rem',
                  padding: '0 4px',
                  lineHeight: 1,
                }}
              >
                x
              </button>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: textColor, marginBottom: '4px' }}>
                {sub.name}
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: colors.border,
                  padding: '2px 6px',
                  background: isDark ? colors.dark : colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginBottom: '8px',
                }}
              >
                {sub.topic}
              </div>
              {hasAnimation && (
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: colors.border,
                    fontWeight: 600,
                    animation: 'fly-right 0.8s ease-in-out',
                  }}
                >
                  Получает сообщение...
                </div>
              )}
              <div style={{ marginTop: '6px' }}>
                {sub.receivedMessages.length === 0 ? (
                  <div style={{ color: mutedColor, fontSize: '0.75rem' }}>
                    Нет сообщений
                  </div>
                ) : (
                  sub.receivedMessages.slice(0, 3).map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        fontSize: '0.75rem',
                        color: isDark ? '#8b949e' : '#6c757d',
                        marginBottom: '2px',
                      }}
                    >
                      {msg.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add subscriber */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '8px',
          border: `1px dashed ${borderColor}`,
          background: cardBg,
        }}
      >
        <div style={{ fontWeight: 600, color: textColor, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
          Добавить subscriber
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Имя сервиса"
            value={newSubName}
            onChange={e => setNewSubName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSubscriber()}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: `1px solid ${borderColor}`,
              background: isDark ? '#21262d' : '#fff',
              color: textColor,
              fontSize: '0.85rem',
              width: '160px',
            }}
          />
          <select
            value={newSubTopic}
            onChange={e => setNewSubTopic(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: `1px solid ${borderColor}`,
              background: isDark ? '#21262d' : '#fff',
              color: textColor,
              fontSize: '0.85rem',
            }}
          >
            {TOPICS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button onClick={addSubscriber} disabled={!newSubName.trim()}>
            Подписать
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          background: isDark ? '#21262d' : '#fff8e1',
          border: `1px solid ${isDark ? '#30363d' : '#ffe082'}`,
          fontSize: '0.85rem',
          color: isDark ? '#e6edf3' : '#5d4037',
        }}
      >
        <strong>Fan-out:</strong> одно сообщение клонируется и доставляется всем
        subscribers одного топика. Publisher не знает, кто подписан — это ключевое
        отличие от Point-to-Point.
      </div>
    </div>
  )
}
