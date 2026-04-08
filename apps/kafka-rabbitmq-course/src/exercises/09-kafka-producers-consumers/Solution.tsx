import { useState, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.1: Стратегии партиционирования
// ============================================

type PartitionStrategy = 'round-robin' | 'key-based' | 'custom'

interface KafkaMessage {
  id: number
  key: string | null
  value: string
  partition: number
  strategy: PartitionStrategy
  color: string
}

const PARTITION_COLORS = ['#4fc3f7', '#a5d6a7', '#ffb74d']

function getPartitionRoundRobin(msgId: number, total: number): number {
  return msgId % total
}

function getPartitionByKey(key: string | null, total: number): number {
  if (!key) return 0
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % total
  }
  return Math.abs(hash) % total
}

function getPartitionCustom(value: string, total: number): number {
  // Priority messages go to partition 0, errors to partition 1, rest to partition 2
  if (value.includes('CRITICAL') || value.includes('HIGH')) return 0
  if (value.includes('ERROR') || value.includes('WARN')) return 1
  return (total > 2 ? total - 1 : 1)
}

const SAMPLE_MESSAGES = [
  { key: 'user-101', value: 'OrderPlaced: item A' },
  { key: 'user-202', value: 'PaymentReceived: $50' },
  { key: 'user-101', value: 'OrderShipped: item A' },
  { key: null, value: 'ERROR: DB connection failed' },
  { key: 'user-303', value: 'CRITICAL: fraud detected' },
  { key: 'user-202', value: 'OrderCancelled: item B' },
  { key: null, value: 'WARN: high latency' },
  { key: 'user-404', value: 'ProfileUpdated' },
  { key: 'user-101', value: 'HIGH priority: restock' },
  { key: 'user-303', value: 'OrderPlaced: item C' },
]

export function Task9_1_Solution() {
  const { t } = useLanguage()
  const [strategy, setStrategy] = useState<PartitionStrategy>('round-robin')
  const [messages, setMessages] = useState<KafkaMessage[]>([])
  const [partitionCount] = useState(3)
  const [counter, setCounter] = useState(0)

  const sendAll = useCallback(() => {
    const newMessages: KafkaMessage[] = SAMPLE_MESSAGES.map((m, idx) => {
      let partition: number
      if (strategy === 'round-robin') {
        partition = getPartitionRoundRobin(idx, partitionCount)
      } else if (strategy === 'key-based') {
        partition = getPartitionByKey(m.key, partitionCount)
      } else {
        partition = getPartitionCustom(m.value, partitionCount)
      }
      return {
        id: idx,
        key: m.key,
        value: m.value,
        partition,
        strategy,
        color: PARTITION_COLORS[partition] ?? '#aaa',
      }
    })
    setMessages(newMessages)
    setCounter((c) => c + 1)
  }, [strategy, partitionCount])

  const partitions = Array.from({ length: partitionCount }, (_, i) => ({
    id: i,
    messages: messages.filter((m) => m.partition === i),
  }))

  const strategyDesc: Record<PartitionStrategy, string> = {
    'round-robin': 'Сообщения без ключа распределяются по очереди: P0, P1, P2, P0, P1...',
    'key-based': 'hash(key) % numPartitions — одинаковый ключ всегда в одну партицию',
    'custom': 'Кастомный партиционер: CRITICAL/HIGH → P0, ERROR/WARN → P1, остальное → P2',
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.9.1')}</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['round-robin', 'key-based', 'custom'] as PartitionStrategy[]).map((s) => (
          <button
            key={s}
            onClick={() => { setStrategy(s); setMessages([]) }}
            style={{
              fontWeight: strategy === s ? 'bold' : 'normal',
              background: strategy === s ? '#2d5a8e' : undefined,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{
        background: '#1e2d3d',
        border: '1px solid #2d5a8e',
        borderRadius: '6px',
        padding: '0.75rem',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        color: '#7ec8e3',
      }}>
        {strategyDesc[strategy]}
      </div>

      <button onClick={sendAll} style={{ marginBottom: '1.5rem' }}>
        Отправить {SAMPLE_MESSAGES.length} сообщений (попытка {counter + 1})
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${partitionCount}, 1fr)`, gap: '1rem' }}>
        {partitions.map((p) => (
          <div key={p.id} style={{
            background: '#1a1a2e',
            border: `2px solid ${PARTITION_COLORS[p.id]}`,
            borderRadius: '8px',
            padding: '0.75rem',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}>
              <strong style={{ color: PARTITION_COLORS[p.id] }}>Partition {p.id}</strong>
              <span style={{
                background: PARTITION_COLORS[p.id],
                color: '#000',
                borderRadius: '12px',
                padding: '0 0.5rem',
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}>
                {p.messages.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minHeight: '80px' }}>
              {p.messages.map((msg) => (
                <div key={msg.id} style={{
                  background: '#0d1117',
                  borderLeft: `3px solid ${msg.color}`,
                  borderRadius: '4px',
                  padding: '0.3rem 0.5rem',
                  fontSize: '0.75rem',
                }}>
                  {msg.key && (
                    <div style={{ color: '#888', marginBottom: '0.1rem' }}>
                      key: <span style={{ color: '#ce9178' }}>{msg.key}</span>
                    </div>
                  )}
                  <div style={{ color: '#d4d4d4', wordBreak: 'break-word' }}>{msg.value}</div>
                </div>
              ))}
              {p.messages.length === 0 && (
                <div style={{ color: '#555', fontSize: '0.8rem', paddingTop: '0.5rem' }}>
                  нет сообщений
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {messages.length > 0 && strategy === 'key-based' && (
        <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>
          Заметьте: user-101 и user-303 всегда попадают в одну партицию — это гарантирует порядок событий для одного пользователя.
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 9.2: Consumer Groups — параллельная обработка
// ============================================

interface Consumer {
  id: string
  partitions: number[]
  status: 'active' | 'rebalancing' | 'joining'
  processed: number
}

function assignPartitions(consumers: Consumer[], totalPartitions: number): Consumer[] {
  if (consumers.length === 0) return []
  const sorted = [...consumers]
  const assignment: Consumer[] = sorted.map((c) => ({ ...c, partitions: [] }))

  for (let p = 0; p < totalPartitions; p++) {
    const idx = p % assignment.length
    assignment[idx].partitions.push(p)
  }
  return assignment
}

const CONSUMER_COLORS = ['#4fc3f7', '#a5d6a7', '#ffb74d', '#f48fb1', '#ce93d8']
const TOTAL_PARTITIONS = 6

export function Task9_2_Solution() {
  const { t } = useLanguage()
  const [consumers, setConsumers] = useState<Consumer[]>([
    { id: 'consumer-1', partitions: [0, 1], status: 'active', processed: 0 },
    { id: 'consumer-2', partitions: [2, 3], status: 'active', processed: 0 },
    { id: 'consumer-3', partitions: [4, 5], status: 'active', processed: 0 },
  ])
  const [rebalancing, setRebalancing] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const addConsumer = () => {
    if (consumers.length >= 6) return
    const newId = `consumer-${Date.now()}`
    const newConsumer: Consumer = { id: newId, partitions: [], status: 'joining', processed: 0 }
    const tempList = [...consumers, newConsumer]

    setRebalancing(true)
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${newId} подключается — начат rebalancing...`, ...prev.slice(0, 9)])

    setTimeout(() => {
      const assigned = assignPartitions(
        tempList.map((c) => ({ ...c, status: 'rebalancing' as const })),
        TOTAL_PARTITIONS,
      )
      setConsumers(assigned)
      setLog((prev) => [`[${new Date().toLocaleTimeString()}] Rebalancing завершён — партиции переназначены`, ...prev.slice(0, 9)])
      setRebalancing(false)
    }, 1200)
  }

  const removeConsumer = (id: string) => {
    if (consumers.length <= 1) return
    setRebalancing(true)
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${id} отключился — начат rebalancing...`, ...prev.slice(0, 9)])

    setTimeout(() => {
      const remaining = consumers.filter((c) => c.id !== id)
      const assigned = assignPartitions(remaining, TOTAL_PARTITIONS)
      setConsumers(assigned)
      setLog((prev) => [`[${new Date().toLocaleTimeString()}] Rebalancing завершён`, ...prev.slice(0, 9)])
      setRebalancing(false)
    }, 1200)
  }

  const simulateMessages = () => {
    setConsumers((prev) =>
      prev.map((c) => ({
        ...c,
        processed: c.processed + c.partitions.length * Math.floor(Math.random() * 5 + 3),
      })),
    )
    setLog((prev) => [`[${new Date().toLocaleTimeString()}] Отправлено сообщений во все партиции`, ...prev.slice(0, 9)])
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.9.2')}</h2>

      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#888' }}>
        Consumer group: <strong style={{ color: '#4fc3f7' }}>orders-processor</strong>
        {' | '}Партиций: <strong style={{ color: '#ffb74d' }}>{TOTAL_PARTITIONS}</strong>
        {' | '}Consumers: <strong style={{ color: '#a5d6a7' }}>{consumers.length}</strong>
        {consumers.length > TOTAL_PARTITIONS && (
          <span style={{ color: '#f48fb1', marginLeft: '0.5rem' }}>
            ({consumers.length - TOTAL_PARTITIONS} idle — больше consumers чем партиций)
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={addConsumer} disabled={rebalancing || consumers.length >= 6}>
          + Добавить consumer
        </button>
        <button onClick={simulateMessages} disabled={rebalancing}>
          Отправить сообщения
        </button>
      </div>

      {rebalancing && (
        <div style={{
          background: '#3d2900',
          border: '1px solid #ffb74d',
          borderRadius: '6px',
          padding: '0.5rem 1rem',
          marginBottom: '1rem',
          color: '#ffb74d',
          fontSize: '0.9rem',
        }}>
          Rebalancing в процессе... (все consumers временно приостановлены)
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {Array.from({ length: TOTAL_PARTITIONS }, (_, i) => {
          const owner = consumers.find((c) => c.partitions.includes(i))
          const ownerIdx = owner ? consumers.findIndex((c) => c.id === owner.id) : -1
          return (
            <div key={i} style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              background: owner ? CONSUMER_COLORS[ownerIdx % CONSUMER_COLORS.length] : '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              color: '#000',
              flexShrink: 0,
            }}>
              P{i}
            </div>
          )
        })}
        <div style={{ fontSize: '0.8rem', color: '#888', alignSelf: 'center', marginLeft: '0.5rem' }}>
          Партиции (цвет = consumer)
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {consumers.map((c, idx) => (
          <div key={c.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: '#1a1a2e',
            border: `2px solid ${CONSUMER_COLORS[idx % CONSUMER_COLORS.length]}`,
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: rebalancing ? '#ffb74d' : CONSUMER_COLORS[idx % CONSUMER_COLORS.length],
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', minWidth: '130px' }}>{c.id}</span>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', flex: 1 }}>
              {c.partitions.length > 0 ? c.partitions.map((p) => (
                <span key={p} style={{
                  background: CONSUMER_COLORS[idx % CONSUMER_COLORS.length],
                  color: '#000',
                  borderRadius: '4px',
                  padding: '0 0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>
                  P{p}
                </span>
              )) : (
                <span style={{ color: '#666', fontSize: '0.8rem' }}>нет партиций (idle)</span>
              )}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#888', minWidth: '80px' }}>
              обработано: {c.processed}
            </span>
            <button
              onClick={() => removeConsumer(c.id)}
              disabled={rebalancing || consumers.length <= 1}
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      {log.length > 0 && (
        <div style={{
          background: '#0d1117',
          borderRadius: '6px',
          padding: '0.75rem',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          color: '#888',
          maxHeight: '150px',
          overflowY: 'auto',
        }}>
          {log.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 9.3: Offset Management
// ============================================

interface PartitionOffsets {
  id: number
  logEndOffset: number
  currentOffset: number
  committedOffset: number
}

export function Task9_3_Solution() {
  const { t } = useLanguage()
  const [partitions, setPartitions] = useState<PartitionOffsets[]>([
    { id: 0, logEndOffset: 20, currentOffset: 15, committedOffset: 12 },
    { id: 1, logEndOffset: 18, currentOffset: 18, committedOffset: 18 },
    { id: 2, logEndOffset: 25, currentOffset: 22, committedOffset: 20 },
  ])
  const [log, setLog] = useState<string[]>([])
  const [crashed, setCrashed] = useState(false)

  const produce = (partitionId: number) => {
    setPartitions((prev) =>
      prev.map((p) =>
        p.id === partitionId ? { ...p, logEndOffset: p.logEndOffset + 1 } : p,
      ),
    )
    setLog((prev) => [`[P${partitionId}] Новое сообщение: offset ${partitions.find(p => p.id === partitionId)!.logEndOffset}`, ...prev.slice(0, 14)])
  }

  const consume = (partitionId: number) => {
    setPartitions((prev) =>
      prev.map((p) => {
        if (p.id !== partitionId) return p
        if (p.currentOffset >= p.logEndOffset) return p
        return { ...p, currentOffset: p.currentOffset + 1 }
      }),
    )
    const p = partitions.find((p) => p.id === partitionId)!
    setLog((prev) => [`[P${partitionId}] Consumed offset ${p.currentOffset}`, ...prev.slice(0, 14)])
  }

  const commit = (partitionId: number) => {
    setPartitions((prev) =>
      prev.map((p) =>
        p.id === partitionId ? { ...p, committedOffset: p.currentOffset } : p,
      ),
    )
    const p = partitions.find((p) => p.id === partitionId)!
    setLog((prev) => [`[P${partitionId}] Committed offset ${p.currentOffset} -> __consumer_offsets`, ...prev.slice(0, 14)])
  }

  const crash = () => {
    setCrashed(true)
    setLog((prev) => ['[CRASH] Consumer упал! current offset потерян...', ...prev.slice(0, 14)])
    setTimeout(() => {
      setPartitions((prev) =>
        prev.map((p) => ({ ...p, currentOffset: p.committedOffset })),
      )
      setCrashed(false)
      setLog((prev) => ['[RESTART] Consumer перезапущен — читает с committed offset', ...prev.slice(0, 14)])
    }, 1500)
  }

  const commitAll = () => {
    setPartitions((prev) => prev.map((p) => ({ ...p, committedOffset: p.currentOffset })))
    setLog((prev) => ['[ALL] Все offset закоммичены', ...prev.slice(0, 14)])
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.9.3')}</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#4fc3f7' }}>current offset — текущая позиция чтения</span>
        <span style={{ color: '#a5d6a7' }}>committed offset — сохранено в __consumer_offsets</span>
        <span style={{ color: '#ffb74d' }}>log-end offset — последнее записанное</span>
        <span style={{ color: '#f48fb1' }}>gap — сообщения для повторной обработки при crash</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={commitAll} disabled={crashed}>Закоммитить все</button>
        <button
          onClick={crash}
          disabled={crashed}
          style={{ background: crashed ? '#555' : '#8b2020', color: '#fff' }}
        >
          {crashed ? 'Перезапуск...' : 'Crash consumer'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
        {partitions.map((p) => {
          const lag = p.logEndOffset - p.currentOffset
          const gap = p.currentOffset - p.committedOffset
          return (
            <div key={p.id} style={{
              background: '#1a1a2e',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '0.75rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong>Partition {p.id}</strong>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => produce(p.id)} disabled={crashed} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                    Produce
                  </button>
                  <button onClick={() => consume(p.id)} disabled={crashed || p.currentOffset >= p.logEndOffset} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                    Consume
                  </button>
                  <button onClick={() => commit(p.id)} disabled={crashed || p.committedOffset === p.currentOffset} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                    Commit
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative', height: '28px', background: '#0d1117', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${(p.committedOffset / p.logEndOffset) * 100}%`,
                  background: '#1b5e20',
                  transition: 'width 0.3s',
                }} />
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${(p.currentOffset / p.logEndOffset) * 100}%`,
                  background: 'rgba(79, 195, 247, 0.25)',
                  transition: 'width 0.3s',
                }} />
                <div style={{
                  position: 'absolute',
                  left: `${(p.committedOffset / p.logEndOffset) * 100}%`,
                  top: 0,
                  height: '100%',
                  width: `${((p.currentOffset - p.committedOffset) / p.logEndOffset) * 100}%`,
                  background: 'rgba(244, 143, 177, 0.4)',
                  transition: 'all 0.3s',
                }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  color: '#fff',
                  fontFamily: 'monospace',
                }}>
                  committed={p.committedOffset} | current={p.currentOffset} | log-end={p.logEndOffset}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#f48fb1' }}>gap: {gap} (будут повторно обработаны после crash)</span>
                <span style={{ color: lag > 0 ? '#ffb74d' : '#888' }}>lag: {lag}</span>
              </div>
            </div>
          )
        })}
      </div>

      {log.length > 0 && (
        <div style={{
          background: '#0d1117',
          borderRadius: '6px',
          padding: '0.75rem',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          color: '#888',
          maxHeight: '180px',
          overflowY: 'auto',
        }}>
          {log.map((line, i) => (
            <div key={i} style={{
              color: line.includes('CRASH') ? '#f48fb1'
                : line.includes('RESTART') ? '#a5d6a7'
                  : line.includes('Committed') ? '#4fc3f7'
                    : '#888',
            }}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 9.4: Consumer Rebalancing — визуализация
// ============================================

type RebalanceStrategy = 'eager' | 'cooperative'

interface RebalanceEvent {
  time: number
  label: string
  type: 'join' | 'leave' | 'stop' | 'resume' | 'assign' | 'revoke' | 'sync'
  consumer?: string
}

function buildEagerTimeline(action: 'join' | 'leave', consumerName: string): RebalanceEvent[] {
  const events: RebalanceEvent[] = [
    { time: 0, label: `${consumerName} ${action === 'join' ? 'подключается' : 'отключается'}`, type: action === 'join' ? 'join' : 'leave', consumer: consumerName },
    { time: 100, label: 'ВСЕ consumers останавливают потребление (stop-the-world)', type: 'stop' },
    { time: 200, label: 'Coordinator: все партиции отозваны (revoke all)', type: 'revoke' },
    { time: 400, label: 'Group Leader вычисляет новое распределение', type: 'sync' },
    { time: 600, label: 'Все consumers получают новые партиции', type: 'assign' },
    { time: 700, label: 'Все consumers возобновляют потребление', type: 'resume' },
  ]
  return events
}

function buildCooperativeTimeline(action: 'join' | 'leave', consumerName: string): RebalanceEvent[] {
  if (action === 'join') {
    return [
      { time: 0, label: `${consumerName} подключается к группе`, type: 'join', consumer: consumerName },
      { time: 100, label: 'Round 1: только нужные партиции отзываются', type: 'revoke' },
      { time: 200, label: 'Остальные consumers ПРОДОЛЖАЮТ работу', type: 'resume' },
      { time: 350, label: 'Round 2: новые партиции назначаются новому consumer', type: 'assign' },
      { time: 450, label: 'Полноценная работа всей группы восстановлена', type: 'resume' },
    ]
  }
  return [
    { time: 0, label: `${consumerName} начинает graceful shutdown`, type: 'leave', consumer: consumerName },
    { time: 100, label: `${consumerName} добровольно отдаёт свои партиции`, type: 'revoke' },
    { time: 200, label: 'Round 1: партиции перераспределяются без остановки', type: 'assign' },
    { time: 300, label: 'Остальные consumers не прерывали работу', type: 'resume' },
    { time: 400, label: `${consumerName} завершил shutdown`, type: 'leave' },
  ]
}

const EVENT_COLORS: Record<RebalanceEvent['type'], string> = {
  join: '#a5d6a7',
  leave: '#f48fb1',
  stop: '#ff5252',
  resume: '#4fc3f7',
  assign: '#a5d6a7',
  revoke: '#ffb74d',
  sync: '#ce93d8',
}

export function Task9_4_Solution() {
  const { t } = useLanguage()
  const [strategy, setStrategy] = useState<RebalanceStrategy>('eager')
  const [action, setAction] = useState<'join' | 'leave'>('join')
  const [timeline, setTimeline] = useState<RebalanceEvent[]>([])
  const [playing, setPlaying] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)

  const runSimulation = () => {
    const consumerName = action === 'join' ? 'consumer-4' : 'consumer-2'
    const events = strategy === 'eager'
      ? buildEagerTimeline(action, consumerName)
      : buildCooperativeTimeline(action, consumerName)
    setTimeline(events)
    setVisibleCount(0)
    setPlaying(true)

    events.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleCount(idx + 1)
        if (idx === events.length - 1) setPlaying(false)
      }, idx * 700)
    })
  }

  const eagerDesc = 'Все consumers останавливаются ("stop-the-world"), все партиции отзываются и назначаются заново. Простой в обработке 500ms–2s.'
  const cooperativeDesc = 'Только необходимые партиции перераспределяются. Остальные consumers продолжают работу. Два round trip, но без полного останова.'

  return (
    <div className="exercise-container">
      <h2>{t('task.9.4')}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {(['eager', 'cooperative'] as RebalanceStrategy[]).map((s) => (
          <div
            key={s}
            onClick={() => { setStrategy(s); setTimeline([]); setVisibleCount(0) }}
            style={{
              border: `2px solid ${strategy === s ? '#4fc3f7' : '#333'}`,
              borderRadius: '8px',
              padding: '0.75rem',
              cursor: 'pointer',
              background: strategy === s ? '#0d2137' : '#1a1a2e',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontWeight: 'bold', color: strategy === s ? '#4fc3f7' : '#888', marginBottom: '0.4rem' }}>
              {s === 'eager' ? 'Eager Rebalancing' : 'Cooperative Sticky'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.4 }}>
              {s === 'eager' ? eagerDesc : cooperativeDesc}
            </div>
            {s === 'eager' && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#ff5252' }}>
                Stop-the-world: все consumers ждут
              </div>
            )}
            {s === 'cooperative' && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#a5d6a7' }}>
                Incremental: минимальное прерывание
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setAction('join')}
          style={{ fontWeight: action === 'join' ? 'bold' : 'normal', background: action === 'join' ? '#1b5e20' : undefined }}
        >
          Consumer Join
        </button>
        <button
          onClick={() => setAction('leave')}
          style={{ fontWeight: action === 'leave' ? 'bold' : 'normal', background: action === 'leave' ? '#7b1f1f' : undefined }}
        >
          Consumer Leave
        </button>
      </div>

      <button onClick={runSimulation} disabled={playing} style={{ marginBottom: '1.5rem' }}>
        {playing ? 'Симуляция...' : 'Запустить симуляцию'}
      </button>

      {timeline.length > 0 && (
        <div style={{ position: 'relative', paddingLeft: '16px' }}>
          <div style={{
            position: 'absolute',
            left: '7px',
            top: 0,
            bottom: 0,
            width: '2px',
            background: '#333',
          }} />
          {timeline.slice(0, visibleCount).map((event, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              marginBottom: '0.75rem',
              opacity: 1,
              transition: 'opacity 0.3s',
            }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: EVENT_COLORS[event.type],
                flexShrink: 0,
                marginTop: '3px',
                zIndex: 1,
              }} />
              <div style={{
                background: '#1a1a2e',
                border: `1px solid ${EVENT_COLORS[event.type]}`,
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                flex: 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ color: EVENT_COLORS[event.type], fontWeight: 'bold', fontSize: '0.8rem' }}>
                    {event.type.toUpperCase()}
                  </span>
                  <span style={{ color: '#555', fontSize: '0.75rem' }}>t+{event.time}ms</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#d4d4d4' }}>{event.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {timeline.length > 0 && visibleCount === timeline.length && (
        <div style={{
          background: strategy === 'eager' ? '#3d1a00' : '#0d2a0d',
          border: `1px solid ${strategy === 'eager' ? '#ff5252' : '#a5d6a7'}`,
          borderRadius: '8px',
          padding: '0.75rem',
          marginTop: '1rem',
          fontSize: '0.85rem',
        }}>
          {strategy === 'eager' ? (
            <span style={{ color: '#ff5252' }}>
              Итог: полная пауза потребления на ~{action === 'join' ? '700' : '600'}ms.
              При большом числе consumers и сообщений это ощутимо.
              Используется до Kafka 2.4 по умолчанию.
            </span>
          ) : (
            <span style={{ color: '#a5d6a7' }}>
              Итог: incremental rebalancing — большинство consumers не прерывались.
              CooperativeStickyAssignor (Kafka 2.4+) — рекомендуемая стратегия для продакшена.
            </span>
          )}
        </div>
      )}
    </div>
  )
}
