import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Задание 6.1: Publisher Confirms — Решение
// ============================================

type ConfirmMode = 'individual' | 'batch' | 'async'
type MessageStatus = 'pending' | 'sent' | 'confirmed' | 'nacked'

interface PublishMessage {
  id: number
  body: string
  status: MessageStatus
  deliveryTag: number
  timestamp: number
}

interface ConfirmEvent {
  type: 'ack' | 'nack'
  deliveryTag: number
  multiple: boolean
  time: number
}

export function Task6_1_Solution() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<ConfirmMode>('individual')
  const [messages, setMessages] = useState<PublishMessage[]>([])
  const [events, setEvents] = useState<ConfirmEvent[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [nackProbability, setNackProbability] = useState(10)
  const [batchSize, setBatchSize] = useState(5)
  const counterRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setMessages([])
    setEvents([])
    setIsRunning(false)
    counterRef.current = 0
  }

  const publishMessages = async (count: number) => {
    setIsRunning(true)
    const newMessages: PublishMessage[] = []

    for (let i = 0; i < count; i++) {
      counterRef.current += 1
      const msg: PublishMessage = {
        id: counterRef.current,
        body: `order-${String(counterRef.current).padStart(3, '0')}`,
        status: 'pending',
        deliveryTag: counterRef.current,
        timestamp: Date.now(),
      }
      newMessages.push(msg)
    }

    setMessages((prev) => [...prev, ...newMessages])

    if (mode === 'individual') {
      // Каждое сообщение подтверждается по одному
      for (let i = 0; i < newMessages.length; i++) {
        await delay(300 + Math.random() * 200)
        const msg = newMessages[i]
        const isNack = Math.random() * 100 < nackProbability
        const eventType = isNack ? 'nack' : 'ack'

        setMessages((prev) =>
          prev.map((m) =>
            m.deliveryTag === msg.deliveryTag
              ? { ...m, status: isNack ? 'nacked' : 'confirmed' }
              : m
          )
        )
        setEvents((prev) => [
          ...prev,
          {
            type: eventType,
            deliveryTag: msg.deliveryTag,
            multiple: false,
            time: Date.now(),
          },
        ])
      }
    } else if (mode === 'batch') {
      // Batch: подтверждаем группами
      const batches = chunk(newMessages, batchSize)
      for (const batch of batches) {
        await delay(400 + Math.random() * 300)
        const lastTag = batch[batch.length - 1].deliveryTag
        const isNack = Math.random() * 100 < nackProbability

        setMessages((prev) =>
          prev.map((m) =>
            batch.some((b) => b.deliveryTag === m.deliveryTag)
              ? { ...m, status: isNack ? 'nacked' : 'confirmed' }
              : m
          )
        )
        setEvents((prev) => [
          ...prev,
          {
            type: isNack ? 'nack' : 'ack',
            deliveryTag: lastTag,
            multiple: true,
            time: Date.now(),
          },
        ])
      }
    } else {
      // Async: отправляем все сразу, подтверждения приходят асинхронно в случайном порядке
      const shuffled = [...newMessages].sort(() => Math.random() - 0.5)
      setMessages((prev) =>
        prev.map((m) =>
          newMessages.some((n) => n.deliveryTag === m.deliveryTag)
            ? { ...m, status: 'sent' }
            : m
        )
      )

      for (const msg of shuffled) {
        const waitTime = 100 + Math.random() * 800
        setTimeout(() => {
          const isNack = Math.random() * 100 < nackProbability
          setMessages((prev) =>
            prev.map((m) =>
              m.deliveryTag === msg.deliveryTag
                ? { ...m, status: isNack ? 'nacked' : 'confirmed' }
                : m
            )
          )
          setEvents((prev) => [
            ...prev,
            {
              type: isNack ? 'nack' : 'ack',
              deliveryTag: msg.deliveryTag,
              multiple: false,
              time: Date.now(),
            },
          ])
        }, waitTime)
      }
    }

    setIsRunning(false)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const statusColor = (status: MessageStatus) => {
    switch (status) {
      case 'pending': return '#888'
      case 'sent': return '#4fc3f7'
      case 'confirmed': return '#66bb6a'
      case 'nacked': return '#ef5350'
    }
  }

  const statusLabel = (status: MessageStatus) => {
    switch (status) {
      case 'pending': return 'pending'
      case 'sent': return 'sent'
      case 'confirmed': return 'ACK'
      case 'nacked': return 'NACK'
    }
  }

  const confirmed = messages.filter((m) => m.status === 'confirmed').length
  const nacked = messages.filter((m) => m.status === 'nacked').length
  const pending = messages.filter((m) => m.status === 'pending' || m.status === 'sent').length

  return (
    <div className="exercise-container">
      <h2>{t('task.6.1')}</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#aaa' }}>
            Режим подтверждений:
          </label>
          <select
            value={mode}
            onChange={(e) => { reset(); setMode(e.target.value as ConfirmMode) }}
            style={{ padding: '0.3rem 0.5rem', background: '#2d2d2d', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
          >
            <option value="individual">Individual (1 ACK = 1 msg)</option>
            <option value="batch">Batch (1 ACK = N msgs)</option>
            <option value="async">Async (параллельные ACK)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#aaa' }}>
            NACK вероятность: {nackProbability}%
          </label>
          <input
            type="range"
            min={0}
            max={50}
            value={nackProbability}
            onChange={(e) => setNackProbability(Number(e.target.value))}
            style={{ width: '120px' }}
          />
        </div>

        {mode === 'batch' && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#aaa' }}>
              Batch size: {batchSize}
            </label>
            <input
              type="range"
              min={2}
              max={10}
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              style={{ width: '100px' }}
            />
          </div>
        )}

        <button
          onClick={() => publishMessages(10)}
          disabled={isRunning}
          style={{ padding: '0.4rem 0.9rem' }}
        >
          {isRunning ? 'Отправка...' : 'Отправить 10 сообщений'}
        </button>
        <button onClick={reset} style={{ padding: '0.4rem 0.9rem' }}>
          Сброс
        </button>
      </div>

      {/* Статистика */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <span style={{ color: '#66bb6a' }}>ACK: {confirmed}</span>
        <span style={{ color: '#ef5350' }}>NACK: {nacked}</span>
        <span style={{ color: '#888' }}>In flight: {pending}</span>
      </div>

      {/* Sequence diagram — сообщения */}
      {messages.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.4rem' }}>
            Producer → Broker — sequence diagram:
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            {/* Колонка Producer */}
            <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
              <div style={{ background: '#1565c0', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '4px', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                Producer
              </div>
              {messages.map((m) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', height: '28px', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.75rem', color: '#aaa', marginRight: '0.3rem' }}>
                    #{m.deliveryTag}
                  </span>
                  <span style={{ fontSize: '0.75rem', background: '#333', padding: '0.1rem 0.4rem', borderRadius: '3px', color: '#fff' }}>
                    {m.body}
                  </span>
                </div>
              ))}
            </div>

            {/* Стрелки */}
            <div style={{ flex: '0 0 60px', textAlign: 'center' }}>
              <div style={{ height: '34px' }} />
              {messages.map((m) => (
                <div key={m.id} style={{ height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {(m.status === 'confirmed' || m.status === 'nacked') ? (
                    <span style={{ fontSize: '0.9rem', color: statusColor(m.status) }}>
                      {m.status === 'confirmed' ? '⟺' : '✗'}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.9rem', color: '#555' }}>→</span>
                  )}
                </div>
              ))}
            </div>

            {/* Колонка Broker */}
            <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
              <div style={{ background: '#6a1b9a', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '4px', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                Broker
              </div>
              {messages.map((m) => (
                <div key={m.id} style={{ height: '28px', display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    color: statusColor(m.status),
                    minWidth: '60px',
                  }}>
                    {statusLabel(m.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* События подтверждений */}
      {events.length > 0 && (
        <div>
          <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.4rem' }}>
            Confirm events ({mode}):
          </div>
          <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#1e1e1e', padding: '0.5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {events.map((e, i) => (
              <div key={i} style={{ color: e.type === 'ack' ? '#66bb6a' : '#ef5350', marginBottom: '0.2rem' }}>
                {e.type === 'ack' ? 'basicAck' : 'basicNack'}(deliveryTag={e.deliveryTag}, multiple={String(e.multiple)})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Описание режимов */}
      <div style={{ marginTop: '1rem', background: '#1e1e1e', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#aaa' }}>
        {mode === 'individual' && (
          <>
            <strong style={{ color: '#fff' }}>Individual confirms:</strong> брокер подтверждает каждое сообщение отдельно.
            Надёжно, но медленно — 1 RTT на каждое сообщение.
          </>
        )}
        {mode === 'batch' && (
          <>
            <strong style={{ color: '#fff' }}>Batch confirms:</strong> producer отправляет batch, брокер подтверждает
            одним ACK с multiple=true. Если NACK — нужно повторить весь batch.
          </>
        )}
        {mode === 'async' && (
          <>
            <strong style={{ color: '#fff' }}>Async confirms:</strong> producer отправляет все сообщения без ожидания,
            ACK/NACK приходят асинхронно в callback. Максимальная пропускная способность.
          </>
        )}
      </div>
    </div>
  )
}

// ============================================
// Задание 6.2: Consumer Prefetch — Решение
// ============================================

interface ConsumerState {
  id: number
  name: string
  speed: number // мс на сообщение
  queue: number[]
  processed: number
  color: string
}

interface QueueMessage {
  id: number
  assignedTo: number | null
}

export function Task6_2_Solution() {
  const { t } = useLanguage()
  const [prefetchCount, setPrefetchCount] = useState(3)
  const [isRunning, setIsRunning] = useState(false)
  const [totalMessages] = useState(20)
  const [queueMessages, setQueueMessages] = useState<QueueMessage[]>([])
  const [consumers, setConsumers] = useState<ConsumerState[]>([
    { id: 1, name: 'Consumer-1 (быстрый)', speed: 300, queue: [], processed: 0, color: '#42a5f5' },
    { id: 2, name: 'Consumer-2 (медленный)', speed: 1200, queue: [], processed: 0, color: '#ef9a9a' },
  ])
  const [log, setLog] = useState<string[]>([])
  const runningRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const reset = () => {
    runningRef.current = false
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRunning(false)
    setQueueMessages([])
    setLog([])
    setConsumers((prev) => prev.map((c) => ({ ...c, queue: [], processed: 0 })))
  }

  const runSimulation = () => {
    reset()

    const msgs: QueueMessage[] = Array.from({ length: totalMessages }, (_, i) => ({
      id: i + 1,
      assignedTo: null,
    }))
    setQueueMessages(msgs)

    const simConsumers: ConsumerState[] = [
      { id: 1, name: 'Consumer-1 (быстрый)', speed: 300, queue: [], processed: 0, color: '#42a5f5' },
      { id: 2, name: 'Consumer-2 (медленный)', speed: 1200, queue: [], processed: 0, color: '#ef9a9a' },
    ]
    setConsumers(simConsumers)

    runningRef.current = true
    setIsRunning(true)

    // Симулируем распределение сообщений с учётом prefetch
    let unassigned = [...msgs]
    const consState = simConsumers.map((c) => ({ ...c, inFlight: 0, nextFreeAt: Date.now() }))

    const simLogs: string[] = []
    let time = 0

    const tick = () => {
      if (!runningRef.current) return

      time += 50
      const now = Date.now()

      // Освобождаем завершённые сообщения
      consState.forEach((c) => {
        if (c.inFlight > 0 && now >= c.nextFreeAt) {
          const freed = Math.min(c.inFlight, 1)
          c.inFlight -= freed
          c.processed += freed

          setConsumers((prev) =>
            prev.map((pc) =>
              pc.id === c.id ? { ...pc, processed: c.processed, queue: Array.from({ length: c.inFlight }, (_, i) => i + 1) } : pc
            )
          )
        }
      })

      // Назначаем новые сообщения
      while (unassigned.length > 0) {
        const consumer = consState.find((c) => c.inFlight < prefetchCount)
        if (!consumer) break

        const msg = unassigned.shift()!
        consumer.inFlight++
        consumer.nextFreeAt = now + consumer.speed * consumer.inFlight
        msg.assignedTo = consumer.id

        simLogs.push(`[${time}ms] msg-${msg.id} → ${consumer.name} (in-flight: ${consumer.inFlight}/${prefetchCount})`)
        if (simLogs.length > 30) simLogs.shift()

        setLog([...simLogs])
        setQueueMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, assignedTo: consumer.id } : m))
        )
        setConsumers((prev) =>
          prev.map((pc) =>
            pc.id === consumer.id
              ? { ...pc, queue: Array.from({ length: consumer.inFlight }, (_, i) => i + 1) }
              : pc
          )
        )
      }

      const allDone = consState.every((c) => c.inFlight === 0) && unassigned.length === 0
      if (allDone) {
        runningRef.current = false
        setIsRunning(false)
        if (intervalRef.current) clearInterval(intervalRef.current)
        setLog((prev) => [...prev, `Симуляция завершена! Время: ~${time}ms`])
      }
    }

    intervalRef.current = setInterval(tick, 50)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      runningRef.current = false
    }
  }, [])

  const unassignedCount = queueMessages.filter((m) => m.assignedTo === null).length
  const assignedCount = queueMessages.filter((m) => m.assignedTo !== null).length

  return (
    <div className="exercise-container">
      <h2>{t('task.6.2')}</h2>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', color: '#aaa' }}>
            prefetchCount (QoS): {prefetchCount}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={prefetchCount}
            onChange={(e) => setPrefetchCount(Number(e.target.value))}
            style={{ width: '160px' }}
          />
          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>
            {prefetchCount === 1 && 'Round-robin, равномерно'}
            {prefetchCount >= 2 && prefetchCount <= 4 && 'Умеренный буфер'}
            {prefetchCount >= 5 && prefetchCount <= 7 && 'Большой буфер'}
            {prefetchCount >= 8 && 'Высокая параллельность'}
          </div>
        </div>

        <button onClick={runSimulation} disabled={isRunning} style={{ padding: '0.4rem 0.9rem' }}>
          {isRunning ? 'Симуляция...' : 'Запустить симуляцию'}
        </button>
        <button onClick={reset} style={{ padding: '0.4rem 0.9rem' }}>
          Сброс
        </button>
      </div>

      {/* Очередь */}
      {queueMessages.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Queue ({unassignedCount} ожидают, {assignedCount} распределено):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {queueMessages.map((m) => {
              const consumer = consumers.find((c) => c.id === m.assignedTo)
              return (
                <div
                  key={m.id}
                  title={`msg-${m.id}${consumer ? ` → ${consumer.name}` : ''}`}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    background: consumer ? consumer.color : '#444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    color: '#fff',
                    fontWeight: 'bold',
                    transition: 'background 0.3s',
                  }}
                >
                  {m.id}
                </div>
              )
            })}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.3rem', display: 'flex', gap: '1rem' }}>
            {consumers.map((c) => (
              <span key={c.id}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', background: c.color, borderRadius: '2px', marginRight: '4px' }} />
                {c.name}
              </span>
            ))}
            <span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#444', borderRadius: '2px', marginRight: '4px' }} />
              Ожидает
            </span>
          </div>
        </div>
      )}

      {/* Consumers */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {consumers.map((c) => (
          <div
            key={c.id}
            style={{
              flex: 1,
              background: '#1e1e1e',
              border: `2px solid ${c.color}`,
              borderRadius: '8px',
              padding: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: c.color, marginBottom: '0.5rem' }}>
              {c.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>
              Скорость: {c.speed}мс/сообщение
            </div>
            <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem' }}>
              In-flight: {c.queue.length}/{prefetchCount}
            </div>

            {/* Prefetch buffer */}
            <div style={{ display: 'flex', gap: '3px', marginBottom: '0.5rem' }}>
              {Array.from({ length: prefetchCount }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '3px',
                    background: i < c.queue.length ? c.color : '#333',
                    border: '1px solid #555',
                    transition: 'background 0.2s',
                  }}
                />
              ))}
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>
              Обработано: {c.processed}
            </div>
          </div>
        ))}
      </div>

      {/* Лог */}
      {log.length > 0 && (
        <div style={{ background: '#1e1e1e', padding: '0.5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem', maxHeight: '160px', overflowY: 'auto' }}>
          {log.slice(-20).map((line, i) => (
            <div key={i} style={{ color: line.includes('завершена') ? '#66bb6a' : '#aaa', marginBottom: '0.15rem' }}>
              {line}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1rem', background: '#1e1e1e', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', color: '#aaa' }}>
        <strong style={{ color: '#fff' }}>Наблюдение:</strong> при prefetch=1 сообщения распределяются
        round-robin, но медленный consumer тормозит. При большом prefetch быстрый consumer
        "захватывает" больше сообщений и обрабатывает их быстрее.
      </div>
    </div>
  )
}

// ============================================
// Задание 6.3: Durable vs Transient — Решение
// ============================================

interface QueueConfig {
  name: string
  durable: boolean
  exclusive: boolean
}

interface MessageConfig {
  body: string
  persistent: boolean
}

interface BrokerMessage {
  id: number
  body: string
  persistent: boolean
  queueName: string
  survived: boolean | null
}

interface BrokerQueue {
  config: QueueConfig
  messages: BrokerMessage[]
}

export function Task6_3_Solution() {
  const { t } = useLanguage()
  const [durableQueue, setDurableQueue] = useState(true)
  const [persistentMessages, setPersistentMessages] = useState(true)
  const [queues, setQueues] = useState<BrokerQueue[]>([])
  const [brokerRestarted, setBrokerRestarted] = useState(false)
  const [brokerOnline, setBrokerOnline] = useState(true)
  const [msgCounter, setMsgCounter] = useState(0)
  const [restartLog, setRestartLog] = useState<string[]>([])

  const addQueue = () => {
    const name = durableQueue ? 'orders.durable' : 'orders.transient'
    const existing = queues.find((q) => q.config.name === name)
    if (existing) return

    const config: QueueConfig = {
      name,
      durable: durableQueue,
      exclusive: false,
    }
    setQueues((prev) => [...prev, { config, messages: [] }])
    setRestartLog((prev) => [
      ...prev,
      `[declare] queue="${name}" durable=${durableQueue} exclusive=false`,
    ])
  }

  const publishMessage = (queueName: string) => {
    if (!brokerOnline) return
    const newId = msgCounter + 1
    setMsgCounter(newId)

    const msg: BrokerMessage = {
      id: newId,
      body: `msg-${String(newId).padStart(3, '0')}`,
      persistent: persistentMessages,
      queueName,
      survived: null,
    }

    setQueues((prev) =>
      prev.map((q) =>
        q.config.name === queueName
          ? { ...q, messages: [...q.messages, msg] }
          : q
      )
    )
    setRestartLog((prev) => [
      ...prev,
      `[publish] "${msg.body}" → "${queueName}" deliveryMode=${persistentMessages ? 2 : 1} (${persistentMessages ? 'persistent' : 'transient'})`,
    ])
  }

  const restartBroker = async () => {
    if (!brokerOnline) return
    setBrokerOnline(false)
    setBrokerRestarted(false)
    setRestartLog((prev) => [...prev, '[broker] STOPPING...'])

    await delay(800)

    // Применяем правила выживания
    setQueues((prev) =>
      prev
        .filter((q) => q.config.durable) // non-durable очереди удаляются
        .map((q) => ({
          ...q,
          messages: q.messages
            .filter((m) => m.persistent) // non-persistent сообщения теряются
            .map((m) => ({ ...m, survived: true })),
        }))
    )

    await delay(400)

    setBrokerOnline(true)
    setBrokerRestarted(true)
    setRestartLog((prev) => [
      ...prev,
      '[broker] STARTING...',
      '[broker] ONLINE — восстановлены только durable queues с persistent messages',
    ])
  }

  const resetAll = () => {
    setQueues([])
    setBrokerRestarted(false)
    setBrokerOnline(true)
    setMsgCounter(0)
    setRestartLog([])
  }

  const totalMessages = queues.reduce((sum, q) => sum + q.messages.length, 0)

  return (
    <div className="exercise-container">
      <h2>{t('task.6.3')}</h2>

      {/* Настройки */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '8px', minWidth: '200px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.75rem' }}>
            Конфигурация очереди
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#aaa', cursor: 'pointer', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              checked={durableQueue}
              onChange={(e) => setDurableQueue(e.target.checked)}
            />
            durable: {durableQueue ? 'true' : 'false'}
          </label>
          <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.75rem' }}>
            {durableQueue ? 'Очередь переживёт перезапуск' : 'Очередь исчезнет при перезапуске'}
          </div>
          <button
            onClick={addQueue}
            style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem', width: '100%' }}
          >
            Объявить очередь
          </button>
        </div>

        <div style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '8px', minWidth: '200px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.75rem' }}>
            Публикация сообщения
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#aaa', cursor: 'pointer', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              checked={persistentMessages}
              onChange={(e) => setPersistentMessages(e.target.checked)}
            />
            persistent (deliveryMode=2)
          </label>
          <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.75rem' }}>
            {persistentMessages ? 'Запишется на диск' : 'Только в памяти'}
          </div>
          {queues.map((q) => (
            <button
              key={q.config.name}
              onClick={() => publishMessage(q.config.name)}
              disabled={!brokerOnline}
              style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem', width: '100%', marginBottom: '0.3rem' }}
            >
              → {q.config.name}
            </button>
          ))}
          {queues.length === 0 && (
            <div style={{ fontSize: '0.75rem', color: '#888' }}>Сначала объявите очередь</div>
          )}
        </div>

        <div style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '8px', minWidth: '200px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.75rem' }}>
            Брокер
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: brokerOnline ? '#66bb6a' : '#ef5350' }} />
            <span style={{ fontSize: '0.85rem', color: brokerOnline ? '#66bb6a' : '#ef5350' }}>
              {brokerOnline ? 'Online' : 'Restarting...'}
            </span>
          </div>
          <button
            onClick={restartBroker}
            disabled={!brokerOnline || totalMessages === 0}
            style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem', width: '100%', marginBottom: '0.5rem', background: '#c62828', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Перезапустить брокер
          </button>
          <button
            onClick={resetAll}
            style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem', width: '100%' }}
          >
            Сброс
          </button>
        </div>
      </div>

      {/* Визуализация очередей */}
      {queues.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Состояние очередей {brokerRestarted && <span style={{ color: '#66bb6a' }}>(после перезапуска)</span>}:
          </div>
          {queues.map((q) => (
            <div
              key={q.config.name}
              style={{
                background: '#1e1e1e',
                border: `2px solid ${q.config.durable ? '#66bb6a' : '#ef9a9a'}`,
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold', color: q.config.durable ? '#66bb6a' : '#ef9a9a' }}>
                  {q.config.name}
                </span>
                <span style={{ fontSize: '0.75rem', background: q.config.durable ? '#1b5e20' : '#b71c1c', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                  {q.config.durable ? 'durable' : 'transient'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                  {q.messages.length} сообщений
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {q.messages.map((m) => (
                  <div
                    key={m.id}
                    title={`${m.body} | ${m.persistent ? 'persistent' : 'transient'}`}
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      background: m.survived === true ? '#1b5e20' : m.persistent ? '#0d47a1' : '#880e4f',
                      color: '#fff',
                      fontSize: '0.75rem',
                      border: m.survived === true ? '1px solid #66bb6a' : 'none',
                    }}
                  >
                    {m.body}
                    {m.survived === true && ' ✓'}
                    {!m.persistent && (
                      <span style={{ opacity: 0.7 }}> (mem)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Результат после перезапуска */}
      {brokerRestarted && (
        <div style={{ background: '#1b3a1b', border: '1px solid #66bb6a', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ color: '#66bb6a', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Брокер перезапущен. Результат:
          </div>
          <div style={{ fontSize: '0.85rem', color: '#aaa' }}>
            <div>✅ <strong>Выжили:</strong> durable очереди + persistent сообщения</div>
            <div>❌ <strong>Потеряны:</strong> transient очереди + non-persistent сообщения в durable очередях</div>
          </div>
        </div>
      )}

      {/* Матрица выживания */}
      <div style={{ marginBottom: '1rem', overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', fontSize: '0.8rem', width: '100%' }}>
          <thead>
            <tr style={{ background: '#333' }}>
              <th style={{ padding: '0.4rem 0.75rem', textAlign: 'left', color: '#aaa' }}>Очередь \ Сообщение</th>
              <th style={{ padding: '0.4rem 0.75rem', textAlign: 'center', color: '#aaa' }}>transient (mode=1)</th>
              <th style={{ padding: '0.4rem 0.75rem', textAlign: 'center', color: '#aaa' }}>persistent (mode=2)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '0.4rem 0.75rem', color: '#aaa' }}>transient queue</td>
              <td style={{ padding: '0.4rem 0.75rem', textAlign: 'center', color: '#ef5350' }}>❌ Потеряно</td>
              <td style={{ padding: '0.4rem 0.75rem', textAlign: 'center', color: '#ef5350' }}>❌ Потеряно</td>
            </tr>
            <tr>
              <td style={{ padding: '0.4rem 0.75rem', color: '#aaa' }}>durable queue</td>
              <td style={{ padding: '0.4rem 0.75rem', textAlign: 'center', color: '#ffa726' }}>⚠️ Потеряно</td>
              <td style={{ padding: '0.4rem 0.75rem', textAlign: 'center', color: '#66bb6a' }}>✅ Выжило</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Лог */}
      {restartLog.length > 0 && (
        <div style={{ background: '#1e1e1e', padding: '0.5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem', maxHeight: '150px', overflowY: 'auto' }}>
          {restartLog.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.startsWith('[broker]') ? (line.includes('ONLINE') ? '#66bb6a' : '#ffa726') :
                  line.startsWith('[declare]') ? '#4fc3f7' :
                    line.startsWith('[publish]') ? '#ce9178' : '#aaa',
                marginBottom: '0.15rem',
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Утилиты
// ============================================

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}
