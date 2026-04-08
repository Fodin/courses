// ============================================
// Level 8: Kafka Basics — Solutions
// ============================================

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 8.1: Kafka Cluster — Brokers & Controller
// ============================================

interface Partition {
  id: number
  topic: string
  role: 'leader' | 'follower'
  isr: boolean
}

interface Broker {
  id: number
  host: string
  port: number
  isController: boolean
  rack: string
  partitions: Partition[]
  color: string
  bgColor: string
}

const initialBrokers: Broker[] = [
  {
    id: 1,
    host: 'kafka-1',
    port: 9092,
    isController: true,
    rack: 'rack-a',
    color: '#1565C0',
    bgColor: '#E3F2FD',
    partitions: [
      { id: 0, topic: 'orders', role: 'leader', isr: true },
      { id: 1, topic: 'orders', role: 'follower', isr: true },
      { id: 0, topic: 'payments', role: 'leader', isr: true },
      { id: 1, topic: 'payments', role: 'follower', isr: false },
    ],
  },
  {
    id: 2,
    host: 'kafka-2',
    port: 9092,
    isController: false,
    rack: 'rack-a',
    color: '#6A1B9A',
    bgColor: '#F3E5F5',
    partitions: [
      { id: 1, topic: 'orders', role: 'leader', isr: true },
      { id: 2, topic: 'orders', role: 'follower', isr: true },
      { id: 1, topic: 'payments', role: 'leader', isr: true },
      { id: 2, topic: 'payments', role: 'follower', isr: true },
    ],
  },
  {
    id: 3,
    host: 'kafka-3',
    port: 9092,
    isController: false,
    rack: 'rack-b',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    partitions: [
      { id: 2, topic: 'orders', role: 'leader', isr: true },
      { id: 0, topic: 'orders', role: 'follower', isr: true },
      { id: 2, topic: 'payments', role: 'leader', isr: true },
      { id: 0, topic: 'payments', role: 'follower', isr: true },
    ],
  },
]

export function Task8_1_Solution() {
  const { t } = useLanguage()
  const [selectedBroker, setSelectedBroker] = useState<number | null>(null)
  const [brokers, setBrokers] = useState<Broker[]>(initialBrokers)
  const [log, setLog] = useState<string[]>([])
  const [mode, setMode] = useState<'zookeeper' | 'kraft'>('kraft')

  const addLog = (msg: string) => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 12))
  }

  const simulateControllerFailover = () => {
    const currentController = brokers.find(b => b.isController)
    if (!currentController) return
    const others = brokers.filter(b => !b.isController)
    const newController = others[Math.floor(Math.random() * others.length)]
    setBrokers(prev =>
      prev.map(b => ({ ...b, isController: b.id === newController.id }))
    )
    addLog(`Broker-${currentController.id} упал. Начинается выбор нового контроллера...`)
    addLog(`Broker-${newController.id} стал новым контроллером (${mode === 'kraft' ? 'KRaft Raft consensus' : 'ZooKeeper election'})`)
    if (selectedBroker === currentController.id) setSelectedBroker(newController.id)
  }

  const selected = brokers.find(b => b.id === selectedBroker)

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.8.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Кластер Apache Kafka из 3 брокеров. Кликни на брокер, чтобы увидеть его партиции.
      </p>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['kraft', 'zookeeper'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: mode === m ? '#1565C0' : '#fff',
              color: mode === m ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: mode === m ? 700 : 400,
            }}
          >
            {m === 'kraft' ? 'KRaft Mode' : 'ZooKeeper Mode'}
          </button>
        ))}
      </div>

      {/* Cluster diagram */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.25rem',
          background: '#f8f9fa',
          padding: '1.25rem',
          borderRadius: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* ZooKeeper / KRaft controller node */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '2px solid #E65100',
              background: '#FFF3E0',
              textAlign: 'center',
              minWidth: '130px',
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>{mode === 'kraft' ? '⚙️' : '🐘'}</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#E65100' }}>
              {mode === 'kraft' ? 'KRaft Controller' : 'ZooKeeper'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.25rem' }}>
              {mode === 'kraft' ? 'built-in Raft' : 'external cluster'}
            </div>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#999' }}>управление кластером</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', color: '#999', fontSize: '1.2rem' }}>
          ⟷
        </div>

        {/* Brokers */}
        {brokers.map(broker => (
          <div
            key={broker.id}
            onClick={() => setSelectedBroker(selectedBroker === broker.id ? null : broker.id)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: `2px solid ${selectedBroker === broker.id ? broker.color : '#ddd'}`,
              background: selectedBroker === broker.id ? broker.bgColor : '#fff',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: '130px',
              position: 'relative',
            }}
          >
            {broker.isController && (
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: '#E65100',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '2px 7px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                }}
              >
                CONTROLLER
              </div>
            )}
            <div style={{ fontSize: '1.5rem' }}>🖥️</div>
            <div style={{ fontWeight: 700, color: broker.color, fontSize: '0.9rem' }}>
              Broker-{broker.id}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#666', fontFamily: 'monospace' }}>
              {broker.host}:{broker.port}
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                color: '#999',
                marginTop: '0.25rem',
                padding: '2px 6px',
                background: '#f0f0f0',
                borderRadius: '8px',
                display: 'inline-block',
              }}
            >
              {broker.rack}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#555', marginTop: '0.4rem' }}>
              {broker.partitions.length} партиций
            </div>
          </div>
        ))}
      </div>

      {/* Selected broker partitions */}
      {selected && (
        <div
          style={{
            marginBottom: '1.25rem',
            padding: '1rem',
            border: `2px solid ${selected.color}`,
            borderRadius: '10px',
            background: selected.bgColor,
          }}
        >
          <h3 style={{ color: selected.color, marginBottom: '0.75rem', fontSize: '1rem' }}>
            Broker-{selected.id} — партиции
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {selected.partitions.map((p, i) => (
              <div
                key={i}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${p.role === 'leader' ? selected.color : '#ccc'}`,
                  background: p.role === 'leader' ? '#fff' : '#f5f5f5',
                  fontSize: '0.8rem',
                  minWidth: '120px',
                }}
              >
                <div style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                  {p.topic} [{p.id}]
                </div>
                <div
                  style={{
                    color: p.role === 'leader' ? selected.color : '#888',
                    fontWeight: p.role === 'leader' ? 700 : 400,
                    fontSize: '0.75rem',
                    marginTop: '2px',
                  }}
                >
                  {p.role === 'leader' ? '★ Leader' : '○ Follower'}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: p.isr ? '#2E7D32' : '#C62828',
                    marginTop: '2px',
                  }}
                >
                  {p.isr ? '✅ ISR' : '❌ Out of ISR'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controller failover simulation */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={simulateControllerFailover}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#C62828',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Симулировать падение контроллера
        </button>
        <button
          onClick={() => setBrokers(initialBrokers)}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#f5f5f5',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Сбросить кластер
        </button>
      </div>

      {/* Info panel */}
      <div
        style={{
          padding: '0.75rem 1rem',
          background: '#FFF8E1',
          border: '1px solid #FFE082',
          borderRadius: '8px',
          fontSize: '0.82rem',
          marginBottom: '1rem',
        }}
      >
        <strong>Режим {mode === 'kraft' ? 'KRaft' : 'ZooKeeper'}:</strong>{' '}
        {mode === 'kraft'
          ? 'Контроллер встроен в брокер. Используется Raft-консенсус. Нет внешних зависимостей. Kafka 2.8+ (production с 3.3+).'
          : 'ZooKeeper — внешний сервис для хранения метаданных. Устарел, deprecated в Kafka 3.x, удалён в 4.0.'}
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <strong style={{ fontSize: '0.85rem' }}>Лог событий кластера</strong>
            <button
              onClick={() => setLog([])}
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#f5f5f5',
                cursor: 'pointer',
              }}
            >
              Очистить
            </button>
          </div>
          <div
            style={{
              background: '#0d1117',
              color: '#58a6ff',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              padding: '0.75rem',
              borderRadius: '8px',
              maxHeight: '160px',
              overflowY: 'auto',
            }}
          >
            {log.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 8.2: Append-only Log Visualization
// ============================================

interface LogRecord {
  offset: number
  key: string
  value: string
  timestamp: string
  size: number
}

const generateTimestamp = (base: number, offsetMs: number) => {
  const d = new Date(base + offsetMs)
  return d.toISOString().replace('T', ' ').substring(0, 19)
}

const BASE_TS = new Date('2024-01-15T10:00:00').getTime()

const initialRecords: LogRecord[] = [
  { offset: 0, key: 'user-1', value: '{"event":"registered","userId":1}', timestamp: generateTimestamp(BASE_TS, 0), size: 52 },
  { offset: 1, key: 'user-2', value: '{"event":"registered","userId":2}', timestamp: generateTimestamp(BASE_TS, 3200), size: 52 },
  { offset: 2, key: 'user-1', value: '{"event":"login","userId":1}', timestamp: generateTimestamp(BASE_TS, 8100), size: 44 },
  { offset: 3, key: 'order-1', value: '{"event":"created","orderId":1,"userId":1}', timestamp: generateTimestamp(BASE_TS, 15400), size: 61 },
  { offset: 4, key: 'user-3', value: '{"event":"registered","userId":3}', timestamp: generateTimestamp(BASE_TS, 22000), size: 52 },
]

export function Task8_2_Solution() {
  const { t } = useLanguage()
  const [records, setRecords] = useState<LogRecord[]>(initialRecords)
  const [consumerOffset, setConsumerOffset] = useState(0)
  const [newKey, setNewKey] = useState('user-4')
  const [newValue, setNewValue] = useState('{"event":"registered","userId":4}')
  const [selectedOffset, setSelectedOffset] = useState<number | null>(null)
  const [readLog, setReadLog] = useState<string[]>([])

  const appendRecord = () => {
    if (!newKey.trim() || !newValue.trim()) return
    const nextOffset = records.length
    const newRecord: LogRecord = {
      offset: nextOffset,
      key: newKey.trim(),
      value: newValue.trim(),
      timestamp: generateTimestamp(BASE_TS, nextOffset * 7000 + 28000),
      size: newKey.length + newValue.length + 10,
    }
    setRecords(prev => [...prev, newRecord])
    setReadLog(prev => [
      `[APPEND] offset=${nextOffset} key="${newKey}" → записано в конец лога`,
      ...prev,
    ].slice(0, 15))
  }

  const readFromOffset = (startOffset: number) => {
    const toRead = records.slice(startOffset)
    setConsumerOffset(startOffset)
    const lines = toRead.map(r => `[READ] offset=${r.offset} key="${r.key}" value=${r.value}`)
    setReadLog(prev => [...lines, `[SEEK] consumer → offset ${startOffset}`, ...prev].slice(0, 15))
  }

  const selected = selectedOffset !== null ? records[selectedOffset] : null

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.8.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Kafka хранит сообщения как append-only лог. Каждое сообщение получает монотонно возрастающий offset.
      </p>

      {/* Key concepts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        {[
          { icon: '📝', title: 'Append-only', desc: 'Записи только добавляются в конец. Никакого изменения или удаления.' },
          { icon: '🔢', title: 'Offset', desc: 'Каждая запись имеет уникальный монотонный номер — offset. Начинается с 0.' },
          { icon: '♾️', title: 'Immutable', desc: 'Написанные данные неизменяемы. Consumer читает любой диапазон офсетов.' },
        ].map(card => (
          <div
            key={card.title}
            style={{
              padding: '0.75rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              background: '#fafafa',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{card.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{card.title}</div>
            <div style={{ fontSize: '0.78rem', color: '#666' }}>{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Log visualization */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>
          Partition Log — {records.length} записей
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '0', minWidth: 'max-content' }}>
            {records.map((r, i) => (
              <div
                key={r.offset}
                onClick={() => setSelectedOffset(selectedOffset === r.offset ? null : r.offset)}
                style={{
                  border: `2px solid ${selectedOffset === r.offset ? '#1565C0' : i < consumerOffset ? '#A5D6A7' : i === consumerOffset ? '#FFB300' : '#ddd'}`,
                  borderRadius: '6px',
                  padding: '0.5rem 0.6rem',
                  minWidth: '90px',
                  background:
                    selectedOffset === r.offset
                      ? '#E3F2FD'
                      : i < consumerOffset
                      ? '#F1F8E9'
                      : i === consumerOffset
                      ? '#FFF8E1'
                      : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  marginRight: i < records.length - 1 ? '-1px' : 0,
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#1565C0',
                    fontFamily: 'monospace',
                  }}
                >
                  offset={r.offset}
                </div>
                <div
                  style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#555', marginTop: '2px' }}
                >
                  {r.key}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#888', marginTop: '2px' }}>
                  {r.size} bytes
                </div>
                {i < consumerOffset && (
                  <div style={{ fontSize: '0.6rem', color: '#2E7D32', marginTop: '2px' }}>✅ прочитано</div>
                )}
                {i === consumerOffset && (
                  <div style={{ fontSize: '0.6rem', color: '#F57F17', marginTop: '2px' }}>👁 позиция</div>
                )}
              </div>
            ))}
            {/* Append arrow */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.75rem',
                color: '#1565C0',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}
            >
              →
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                border: '2px dashed #90CAF9',
                borderRadius: '6px',
                color: '#90CAF9',
                fontSize: '0.75rem',
                background: '#F8FBFF',
              }}
            >
              след. запись
            </div>
          </div>
        </div>
      </div>

      {/* Selected record detail */}
      {selected && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: '#E3F2FD',
            border: '1px solid #90CAF9',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
          }}
        >
          <strong>Запись offset={selected.offset}:</strong>
          <div>key: "{selected.key}"</div>
          <div>value: {selected.value}</div>
          <div>timestamp: {selected.timestamp}</div>
          <div>size: {selected.size} bytes</div>
        </div>
      )}

      {/* Consumer offset control */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>
          Consumer — чтение с offset
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          {records.map(r => (
            <button
              key={r.offset}
              onClick={() => readFromOffset(r.offset)}
              style={{
                padding: '0.35rem 0.7rem',
                border: `1px solid ${consumerOffset === r.offset ? '#1565C0' : '#ddd'}`,
                borderRadius: '5px',
                background: consumerOffset === r.offset ? '#1565C0' : '#fff',
                color: consumerOffset === r.offset ? '#fff' : '#333',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              от offset={r.offset}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          Consumer читает с offset={consumerOffset}. Прочитано: {records.slice(consumerOffset).length} сообщений.
        </div>
      </div>

      {/* Append new record */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>Записать сообщение в лог</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <input
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            placeholder="key"
            style={{
              padding: '0.4rem 0.6rem',
              fontFamily: 'monospace',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '0.82rem',
              width: '120px',
            }}
          />
          <input
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            placeholder='{"event":"...","userId":4}'
            style={{
              padding: '0.4rem 0.6rem',
              fontFamily: 'monospace',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '0.82rem',
              flex: 1,
              minWidth: '200px',
            }}
          />
          <button
            onClick={appendRecord}
            style={{
              padding: '0.4rem 1rem',
              background: '#1565C0',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Append
          </button>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#888' }}>
          Новая запись будет добавлена в конец лога с offset={records.length}
        </div>
      </div>

      {/* Log */}
      {readLog.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <strong style={{ fontSize: '0.85rem' }}>Лог операций</strong>
            <button
              onClick={() => setReadLog([])}
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#f5f5f5',
                cursor: 'pointer',
              }}
            >
              Очистить
            </button>
          </div>
          <div
            style={{
              background: '#0d1117',
              color: '#39d353',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              padding: '0.75rem',
              borderRadius: '8px',
              maxHeight: '180px',
              overflowY: 'auto',
            }}
          >
            {readLog.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 8.3: Topics & Partitions
// ============================================

interface TopicConfig {
  name: string
  partitions: number
  replicationFactor: number
  color: string
  bgColor: string
}

interface Message83 {
  id: number
  key: string
  value: string
  partition: number
  offset: number
  color: string
}

function hashKey(key: string, partitions: number): number {
  // Murmur2-like simple hash
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % partitions
}

const TOPIC_COLORS: Array<{ color: string; bgColor: string }> = [
  { color: '#1565C0', bgColor: '#E3F2FD' },
  { color: '#6A1B9A', bgColor: '#F3E5F5' },
  { color: '#2E7D32', bgColor: '#E8F5E9' },
]

export function Task8_3_Solution() {
  const { t } = useLanguage()
  const [topics, setTopics] = useState<TopicConfig[]>([
    { name: 'orders', partitions: 3, replicationFactor: 2, ...TOPIC_COLORS[0] },
    { name: 'payments', partitions: 2, replicationFactor: 2, ...TOPIC_COLORS[1] },
  ])
  const [selectedTopic, setSelectedTopic] = useState<string>('orders')
  const [messages, setMessages] = useState<Record<string, Message83[]>>({ orders: [], payments: [] })
  const [newTopicName, setNewTopicName] = useState('')
  const [newTopicPartitions, setNewTopicPartitions] = useState(3)
  const [msgKey, setMsgKey] = useState('user-1')
  const [msgValue, setMsgValue] = useState('{"amount":100}')
  const [msgLog, setMsgLog] = useState<string[]>([])
  const [nextId, setNextId] = useState(1)

  const currentTopic = topics.find(t => t.name === selectedTopic)

  const sendMessage = () => {
    if (!currentTopic || !msgKey.trim() || !msgValue.trim()) return
    const partition = msgKey.trim() === '' ? 0 : hashKey(msgKey.trim(), currentTopic.partitions)
    const topicMsgs = messages[currentTopic.name] || []
    const partitionMsgs = topicMsgs.filter(m => m.partition === partition)
    const offset = partitionMsgs.length

    const msg: Message83 = {
      id: nextId,
      key: msgKey.trim(),
      value: msgValue.trim(),
      partition,
      offset,
      color: currentTopic.color,
    }

    setMessages(prev => ({
      ...prev,
      [currentTopic.name]: [...(prev[currentTopic.name] || []), msg],
    }))
    setNextId(prev => prev + 1)
    setMsgLog(prev =>
      [
        `[SEND] topic=${currentTopic.name} key="${msgKey}" → partition=${partition} offset=${offset}`,
        `  hash("${msgKey}") % ${currentTopic.partitions} = ${partition}`,
        ...prev,
      ].slice(0, 16)
    )
  }

  const addTopic = () => {
    if (!newTopicName.trim() || topics.find(t => t.name === newTopicName.trim())) return
    const colorIdx = topics.length % TOPIC_COLORS.length
    setTopics(prev => [
      ...prev,
      {
        name: newTopicName.trim(),
        partitions: newTopicPartitions,
        replicationFactor: 2,
        ...TOPIC_COLORS[colorIdx],
      },
    ])
    setMessages(prev => ({ ...prev, [newTopicName.trim()]: [] }))
    setSelectedTopic(newTopicName.trim())
    setNewTopicName('')
  }

  const getPartitionMessages = (topicName: string, partition: number) =>
    (messages[topicName] || []).filter(m => m.partition === partition)

  const totalMessages = Object.values(messages).flat().length

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.8.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Создавай topics, отправляй сообщения с ключами и наблюдай за партиционированием.
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Topics', value: topics.length, color: '#1565C0' },
          { label: 'Всего партиций', value: topics.reduce((s, t) => s + t.partitions, 0), color: '#6A1B9A' },
          { label: 'Сообщений', value: totalMessages, color: '#2E7D32' },
        ].map(s => (
          <div
            key={s.label}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              background: '#fafafa',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Topics list */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {topics.map(topic => (
          <button
            key={topic.name}
            onClick={() => setSelectedTopic(topic.name)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              border: `2px solid ${selectedTopic === topic.name ? topic.color : '#ddd'}`,
              background: selectedTopic === topic.name ? topic.bgColor : '#fff',
              color: topic.color,
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: selectedTopic === topic.name ? 700 : 400,
            }}
          >
            {topic.name} ({topic.partitions}p)
          </button>
        ))}
      </div>

      {/* Create topic */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          padding: '0.75rem',
          background: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <input
          value={newTopicName}
          onChange={e => setNewTopicName(e.target.value)}
          placeholder="Имя нового topic"
          style={{
            padding: '0.4rem 0.6rem',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '0.85rem',
            flex: 1,
            minWidth: '150px',
          }}
        />
        <select
          value={newTopicPartitions}
          onChange={e => setNewTopicPartitions(Number(e.target.value))}
          style={{
            padding: '0.4rem 0.6rem',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '0.85rem',
          }}
        >
          {[1, 2, 3, 4, 6, 8].map(n => (
            <option key={n} value={n}>
              {n} партиций
            </option>
          ))}
        </select>
        <button
          onClick={addTopic}
          disabled={!newTopicName.trim()}
          style={{
            padding: '0.4rem 1rem',
            background: newTopicName.trim() ? '#2E7D32' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: newTopicName.trim() ? 'pointer' : 'not-allowed',
            fontSize: '0.85rem',
          }}
        >
          Создать Topic
        </button>
      </div>

      {/* Partition lanes */}
      {currentTopic && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>
            Topic: <span style={{ color: currentTopic.color }}>{currentTopic.name}</span> —{' '}
            {currentTopic.partitions} партиций, replication factor: {currentTopic.replicationFactor}
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {Array.from({ length: currentTopic.partitions }, (_, p) => {
              const pMsgs = getPartitionMessages(currentTopic.name, p)
              return (
                <div
                  key={p}
                  style={{
                    minWidth: '200px',
                    border: `2px solid ${currentTopic.color}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      background: currentTopic.color,
                      color: '#fff',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    Partition {p} ({pMsgs.length} msg)
                  </div>
                  <div
                    style={{
                      padding: '0.5rem',
                      background: currentTopic.bgColor,
                      minHeight: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem',
                    }}
                  >
                    {pMsgs.length === 0 ? (
                      <div style={{ color: '#aaa', fontSize: '0.75rem', padding: '0.5rem' }}>
                        Нет сообщений
                      </div>
                    ) : (
                      pMsgs.map((m, idx) => (
                        <div
                          key={m.id}
                          style={{
                            padding: '0.3rem 0.5rem',
                            background: '#fff',
                            borderRadius: '4px',
                            border: `1px solid ${currentTopic.color}30`,
                            fontSize: '0.72rem',
                          }}
                        >
                          <div style={{ fontFamily: 'monospace', color: '#888' }}>offset={idx}</div>
                          <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>key: {m.key}</div>
                          <div
                            style={{
                              color: '#555',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '160px',
                            }}
                          >
                            {m.value}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Send message */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>Отправить сообщение</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <input
            value={msgKey}
            onChange={e => setMsgKey(e.target.value)}
            placeholder="key (влияет на партицию)"
            style={{
              padding: '0.4rem 0.6rem',
              fontFamily: 'monospace',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '0.82rem',
              width: '160px',
            }}
          />
          <input
            value={msgValue}
            onChange={e => setMsgValue(e.target.value)}
            placeholder='{"amount":100}'
            style={{
              padding: '0.4rem 0.6rem',
              fontFamily: 'monospace',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '0.82rem',
              flex: 1,
              minWidth: '160px',
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: '0.4rem 1.25rem',
              background: currentTopic?.color || '#1565C0',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Отправить
          </button>
        </div>
        {currentTopic && msgKey.trim() && (
          <div
            style={{
              fontSize: '0.8rem',
              color: '#555',
              padding: '0.4rem 0.75rem',
              background: '#FFF8E1',
              border: '1px solid #FFE082',
              borderRadius: '6px',
              display: 'inline-block',
            }}
          >
            hash("{msgKey}") % {currentTopic.partitions} ={' '}
            <strong style={{ color: '#E65100' }}>partition {hashKey(msgKey, currentTopic.partitions)}</strong>
          </div>
        )}
      </div>

      {/* Quick key buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#666', alignSelf: 'center' }}>Быстрые ключи:</span>
        {['user-1', 'user-2', 'user-3', 'order-1', 'order-2', 'payment-1'].map(k => (
          <button
            key={k}
            onClick={() => setMsgKey(k)}
            style={{
              padding: '0.25rem 0.6rem',
              border: '1px solid #ddd',
              borderRadius: '12px',
              background: msgKey === k ? '#E3F2FD' : '#fff',
              color: '#333',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontFamily: 'monospace',
            }}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Log */}
      {msgLog.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <strong style={{ fontSize: '0.85rem' }}>Лог партиционирования</strong>
            <button
              onClick={() => setMsgLog([])}
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#f5f5f5',
                cursor: 'pointer',
              }}
            >
              Очистить
            </button>
          </div>
          <div
            style={{
              background: '#0d1117',
              color: '#f0883e',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              padding: '0.75rem',
              borderRadius: '8px',
              maxHeight: '180px',
              overflowY: 'auto',
            }}
          >
            {msgLog.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
