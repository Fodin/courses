// ============================================
// Level 4: RabbitMQ Architecture and Basics — Solutions
// ============================================

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 4.1: RabbitMQ Architecture Map
// ============================================

type ArchLayer = 'erlang' | 'node' | 'vhost' | 'exchange' | 'queue' | 'binding'

interface LayerInfo {
  id: ArchLayer
  label: string
  emoji: string
  color: string
  bgColor: string
  borderColor: string
  description: string
  details: string[]
  children: ArchLayer[]
}

const LAYERS: LayerInfo[] = [
  {
    id: 'erlang',
    label: 'Erlang VM (BEAM)',
    emoji: '⚙️',
    color: '#4A148C',
    bgColor: '#EDE7F6',
    borderColor: '#7B1FA2',
    description: 'Виртуальная машина Erlang — основа надёжности RabbitMQ',
    details: [
      'Легковесные процессы (миллионы одновременно)',
      'Supervision trees — автоматический перезапуск упавших процессов',
      'Hot code loading — обновление без остановки',
      'Встроенное распределённое программирование',
      'Изоляция ошибок — сбой одного процесса не убивает систему',
    ],
    children: ['node'],
  },
  {
    id: 'node',
    label: 'RabbitMQ Node',
    emoji: '🖥️',
    color: '#1565C0',
    bgColor: '#E3F2FD',
    borderColor: '#1976D2',
    description: 'Узел RabbitMQ — один запущенный экземпляр брокера',
    details: [
      'Имя: rabbit@hostname',
      'Disk node: хранит метаданные на диске (рекомендуется)',
      'RAM node: хранит только в памяти (быстрее, но не для кластера)',
      'Несколько нод образуют кластер',
      'Quorum queues требуют нечётное число нод',
    ],
    children: ['vhost'],
  },
  {
    id: 'vhost',
    label: 'Virtual Host',
    emoji: '🏠',
    color: '#00695C',
    bgColor: '#E0F2F1',
    borderColor: '#00897B',
    description: 'Virtual Host — пространство изоляции внутри брокера',
    details: [
      'Полная изоляция: exchanges, queues, bindings',
      'Права доступа задаются на уровне vhost',
      'Дефолтный vhost: "/"',
      'Типичное использование: /production, /staging, /dev',
      'Пользователь может иметь доступ к нескольким vhost',
    ],
    children: ['exchange', 'queue'],
  },
  {
    id: 'exchange',
    label: 'Exchange',
    emoji: '🔀',
    color: '#E65100',
    bgColor: '#FFF3E0',
    borderColor: '#F57C00',
    description: 'Exchange — маршрутизатор сообщений. Принимает и распределяет по очередям',
    details: [
      'Direct: routing key точно совпадает с binding key',
      'Fanout: рассылает всем привязанным очередям',
      'Topic: wildcard-паттерны (* и #) в routing key',
      'Headers: маршрутизация по заголовкам сообщения',
      'Default exchange: routing key = имя очереди',
    ],
    children: ['binding'],
  },
  {
    id: 'queue',
    label: 'Queue',
    emoji: '📬',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    borderColor: '#388E3C',
    description: 'Queue — буфер сообщений, ожидающих обработки',
    details: [
      'Classic Queue: стандартная очередь с master/mirror',
      'Quorum Queue: распределённая, основана на Raft',
      'Stream: только добавление, как Kafka topic',
      'TTL, max-length, dead-letter-exchange — параметры очереди',
      'Durable: переживает перезапуск брокера',
    ],
    children: [],
  },
  {
    id: 'binding',
    label: 'Binding',
    emoji: '🔗',
    color: '#C62828',
    bgColor: '#FFEBEE',
    borderColor: '#D32F2F',
    description: 'Binding — правило связи между Exchange и Queue',
    details: [
      'Binding key: паттерн для сопоставления routing key',
      'Один exchange — много bindings (fan-out)',
      'Одна очередь — много bindings (агрегация)',
      'Headers binding: x-match: all | any',
      'Создаётся через API, Management UI или клиент',
    ],
    children: [],
  },
]

const layerById = (id: ArchLayer): LayerInfo => LAYERS.find(l => l.id === id)!

export function Task4_1_Solution() {
  const { t } = useLanguage()
  const [selected, setSelected] = useState<ArchLayer | null>(null)
  const [zoomed, setZoomed] = useState<ArchLayer | null>(null)

  const selectedLayer = selected ? layerById(selected) : null
  const zoomedLayer = zoomed ? layerById(zoomed) : null

  const handleClick = (id: ArchLayer) => {
    if (zoomed === id) {
      setZoomed(null)
      setSelected(id)
    } else if (selected === id) {
      setZoomed(id)
    } else {
      setSelected(id)
      setZoomed(null)
    }
  }

  const containerStyle: React.CSSProperties = {
    padding: '1rem',
    fontFamily: 'sans-serif',
    maxWidth: '960px',
  }

  const layerBoxStyle = (layer: LayerInfo, isSelected: boolean, isZoomed: boolean): React.CSSProperties => ({
    border: `2px solid ${isZoomed ? layer.color : isSelected ? layer.borderColor : '#ddd'}`,
    borderRadius: '10px',
    padding: isZoomed ? '1rem 1.25rem' : '0.6rem 1rem',
    background: isSelected || isZoomed ? layer.bgColor : '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: isZoomed ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isZoomed ? `0 4px 16px ${layer.color}33` : isSelected ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
  })

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.4.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Кликните по слою для информации. Второй клик — зум с подробностями.
      </p>

      {/* Architecture layers — nested visual */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* Left: layered diagram */}
        <div style={{ flex: '0 0 auto', minWidth: '340px' }}>

          {/* Erlang VM */}
          <div
            onClick={() => handleClick('erlang')}
            style={{
              ...layerBoxStyle(layerById('erlang'), selected === 'erlang', zoomed === 'erlang'),
              border: `2px dashed ${zoomed === 'erlang' ? '#7B1FA2' : selected === 'erlang' ? '#7B1FA2' : '#ccc'}`,
              background: selected === 'erlang' || zoomed === 'erlang' ? '#EDE7F6' : '#f9f9fb',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>⚙️</span>
              <span style={{ fontWeight: 700, color: '#4A148C', fontSize: '0.9rem' }}>Erlang VM (BEAM)</span>
              <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: 'auto' }}>клик для деталей</span>
            </div>

            {/* Node */}
            <div
              onClick={e => { e.stopPropagation(); handleClick('node') }}
              style={{
                ...layerBoxStyle(layerById('node'), selected === 'node', zoomed === 'node'),
                marginBottom: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🖥️</span>
                <span style={{ fontWeight: 700, color: '#1565C0', fontSize: '0.85rem' }}>rabbit@node-1</span>
              </div>

              {/* VHost */}
              <div
                onClick={e => { e.stopPropagation(); handleClick('vhost') }}
                style={{
                  ...layerBoxStyle(layerById('vhost'), selected === 'vhost', zoomed === 'vhost'),
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>🏠</span>
                  <span style={{ fontWeight: 700, color: '#00695C', fontSize: '0.85rem' }}>vhost: /production</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {/* Exchange */}
                  <div
                    onClick={e => { e.stopPropagation(); handleClick('exchange') }}
                    style={layerBoxStyle(layerById('exchange'), selected === 'exchange', zoomed === 'exchange')}
                  >
                    <div style={{ fontSize: '0.85rem' }}>🔀</div>
                    <div style={{ fontWeight: 600, color: '#E65100', fontSize: '0.75rem', marginTop: '2px' }}>Exchange</div>
                    <div style={{ fontSize: '0.7rem', color: '#888' }}>orders.direct</div>
                  </div>

                  {/* Queue */}
                  <div
                    onClick={e => { e.stopPropagation(); handleClick('queue') }}
                    style={layerBoxStyle(layerById('queue'), selected === 'queue', zoomed === 'queue')}
                  >
                    <div style={{ fontSize: '0.85rem' }}>📬</div>
                    <div style={{ fontWeight: 600, color: '#2E7D32', fontSize: '0.75rem', marginTop: '2px' }}>Queue</div>
                    <div style={{ fontSize: '0.7rem', color: '#888' }}>orders.created</div>
                  </div>
                </div>

                {/* Binding */}
                <div
                  onClick={e => { e.stopPropagation(); handleClick('binding') }}
                  style={{
                    ...layerBoxStyle(layerById('binding'), selected === 'binding', zoomed === 'binding'),
                    marginTop: '0.5rem',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.8rem' }}>🔗</span>
                  <span style={{ fontWeight: 600, color: '#C62828', fontSize: '0.75rem', marginLeft: '0.4rem' }}>
                    Binding: routing_key = "order.created"
                  </span>
                </div>
              </div>

              {/* Second vhost hint */}
              <div
                style={{
                  border: '1px dashed #ccc',
                  borderRadius: '6px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.75rem',
                  color: '#aaa',
                  textAlign: 'center',
                }}
              >
                🏠 vhost: /staging (изолирован)
              </div>
            </div>
          </div>
        </div>

        {/* Right: info panel */}
        <div style={{ flex: 1 }}>
          {selectedLayer ? (
            <div
              style={{
                border: `2px solid ${selectedLayer.borderColor}`,
                borderRadius: '10px',
                padding: '1.25rem',
                background: selectedLayer.bgColor,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{selectedLayer.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: selectedLayer.color }}>
                    {selectedLayer.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                    {zoomed ? 'Режим зума — все подробности' : 'Кликните ещё раз для зума'}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#333', marginBottom: '1rem', lineHeight: 1.5 }}>
                {selectedLayer.description}
              </p>

              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: selectedLayer.color }}>
                Ключевые факты:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                {(zoomed ? selectedLayer.details : selectedLayer.details.slice(0, 3)).map((d, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', marginBottom: '0.4rem', color: '#444', lineHeight: 1.4 }}>
                    {d}
                  </li>
                ))}
              </ul>

              {!zoomed && selectedLayer.details.length > 3 && (
                <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
                  + ещё {selectedLayer.details.length - 3} пункта — кликните для зума
                </div>
              )}

              {selectedLayer.children.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${selectedLayer.borderColor}` }}>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.4rem' }}>
                    Содержит:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selectedLayer.children.map(childId => {
                      const child = layerById(childId)
                      return (
                        <span
                          key={childId}
                          onClick={() => handleClick(childId)}
                          style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: child.bgColor,
                            border: `1px solid ${child.borderColor}`,
                            color: child.color,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          {child.emoji} {child.label}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                border: '2px dashed #ddd',
                borderRadius: '10px',
                padding: '2rem',
                textAlign: 'center',
                color: '#bbb',
                background: '#fafafa',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👈</div>
              <div style={{ fontSize: '0.9rem' }}>
                Кликните на любой слой архитектуры слева, чтобы увидеть описание
              </div>
            </div>
          )}

          {/* Legend */}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {LAYERS.map(l => (
              <div
                key={l.id}
                onClick={() => handleClick(l.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '3px 8px',
                  borderRadius: '8px',
                  border: `1px solid ${selected === l.id ? l.borderColor : '#eee'}`,
                  background: selected === l.id ? l.bgColor : '#fff',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  color: l.color,
                  fontWeight: selected === l.id ? 700 : 400,
                }}
              >
                <span>{l.emoji}</span>
                <span>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 4.2: Management UI Dashboard Simulator
// ============================================

interface QueueStats {
  name: string
  vhost: string
  type: 'classic' | 'quorum' | 'stream'
  state: 'running' | 'idle' | 'flow'
  messages: number
  messagesReady: number
  messagesUnacked: number
  publishRate: number
  deliverRate: number
  consumers: number
  memory: number
}

interface ConnectionInfo {
  name: string
  user: string
  vhost: string
  state: 'running' | 'blocked' | 'flow'
  channels: number
  sendRate: number
  recvRate: number
}

const INITIAL_QUEUES: QueueStats[] = [
  {
    name: 'orders.created',
    vhost: '/production',
    type: 'quorum',
    state: 'running',
    messages: 142,
    messagesReady: 140,
    messagesUnacked: 2,
    publishRate: 38.4,
    deliverRate: 36.1,
    consumers: 3,
    memory: 2048,
  },
  {
    name: 'payments.pending',
    vhost: '/production',
    type: 'quorum',
    state: 'running',
    messages: 7,
    messagesReady: 7,
    messagesUnacked: 0,
    publishRate: 12.0,
    deliverRate: 12.3,
    consumers: 2,
    memory: 512,
  },
  {
    name: 'notifications.email',
    vhost: '/production',
    type: 'classic',
    state: 'idle',
    messages: 0,
    messagesReady: 0,
    messagesUnacked: 0,
    publishRate: 0,
    deliverRate: 0,
    consumers: 1,
    memory: 256,
  },
  {
    name: 'audit.events',
    vhost: '/production',
    type: 'stream',
    state: 'running',
    messages: 84120,
    messagesReady: 84120,
    messagesUnacked: 0,
    publishRate: 220.5,
    deliverRate: 218.9,
    consumers: 5,
    memory: 16384,
  },
  {
    name: 'dead.letter',
    vhost: '/production',
    type: 'classic',
    state: 'idle',
    messages: 23,
    messagesReady: 23,
    messagesUnacked: 0,
    publishRate: 0,
    deliverRate: 0,
    consumers: 0,
    memory: 128,
  },
]

const INITIAL_CONNECTIONS: ConnectionInfo[] = [
  { name: 'order-service:52341', user: 'app_user', vhost: '/production', state: 'running', channels: 2, sendRate: 38.4, recvRate: 36.1 },
  { name: 'payment-service:44210', user: 'app_user', vhost: '/production', state: 'running', channels: 1, sendRate: 12.0, recvRate: 12.3 },
  { name: 'notification-svc:51100', user: 'app_user', vhost: '/production', state: 'running', channels: 1, sendRate: 0, recvRate: 0 },
  { name: 'audit-service:60001', user: 'monitor', vhost: '/production', state: 'running', channels: 3, sendRate: 220.5, recvRate: 218.9 },
]

type DashTab = 'overview' | 'queues' | 'connections'

export function Task4_2_Solution() {
  const { t } = useLanguage()
  const [queues, setQueues] = useState<QueueStats[]>(INITIAL_QUEUES)
  const [connections] = useState<ConnectionInfo[]>(INITIAL_CONNECTIONS)
  const [activeTab, setActiveTab] = useState<DashTab>('overview')
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Animate rates
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTick(t => t + 1)
      setQueues(prev =>
        prev.map(q => {
          if (q.state === 'idle') return q
          const delta = (Math.random() - 0.48) * 4
          const newPub = Math.max(0, q.publishRate + delta)
          const newDel = Math.max(0, q.deliverRate + delta * 0.9)
          const msgDelta = Math.round((newPub - newDel) * 0.1)
          return {
            ...q,
            publishRate: Math.round(newPub * 10) / 10,
            deliverRate: Math.round(newDel * 10) / 10,
            messages: Math.max(0, q.messages + msgDelta),
            messagesReady: Math.max(0, q.messagesReady + msgDelta),
          }
        })
      )
    }, 1500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const totalMessages = queues.reduce((s, q) => s + q.messages, 0)
  const totalPublish = queues.reduce((s, q) => s + q.publishRate, 0)
  const totalDeliver = queues.reduce((s, q) => s + q.deliverRate, 0)

  const queueTypeColor = (type: QueueStats['type']) =>
    type === 'quorum' ? '#1565C0' : type === 'stream' ? '#6A1B9A' : '#555'
  const queueTypeBg = (type: QueueStats['type']) =>
    type === 'quorum' ? '#E3F2FD' : type === 'stream' ? '#EDE7F6' : '#f5f5f5'

  const stateColor = (state: string) =>
    state === 'running' ? '#2E7D32' : state === 'idle' ? '#888' : '#E65100'
  const stateDot = (state: string) =>
    state === 'running' ? '🟢' : state === 'idle' ? '⚪' : '🟠'

  const RateBar = ({ value, max, color }: { value: number; max: number; color: string }) => (
    <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${Math.min(100, (value / max) * 100)}%`,
          background: color,
          borderRadius: '3px',
          transition: 'width 0.8s ease',
        }}
      />
    </div>
  )

  const tabStyle = (tab: DashTab): React.CSSProperties => ({
    padding: '0.4rem 1rem',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid #FF6600' : '2px solid transparent',
    background: 'transparent',
    cursor: 'pointer',
    fontWeight: activeTab === tab ? 700 : 400,
    color: activeTab === tab ? '#FF6600' : '#555',
    fontSize: '0.85rem',
  })

  const selectedQ = selectedQueue ? queues.find(q => q.name === selectedQueue) : null

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '960px', border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>
      {/* Management UI Header */}
      <div style={{ background: '#FF6600', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
          RabbitMQ Management
        </div>
        <div style={{ color: '#FFD580', fontSize: '0.8rem' }}>
          rabbit@prod-node-1 | v3.12.4 | Erlang 26.1
        </div>
        <div style={{ marginLeft: 'auto', color: '#fff', fontSize: '0.75rem' }}>
          {new Date().toLocaleTimeString()} <span style={{ opacity: 0.7 }}>(live)</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #eee', padding: '0 1rem', background: '#fafafa', display: 'flex' }}>
        {(['overview', 'queues', 'connections'] as DashTab[]).map(tab => (
          <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
            {tab === 'overview' ? '📊 Overview' : tab === 'queues' ? '📬 Queues' : '🔌 Connections'}
          </button>
        ))}
      </div>

      <div style={{ padding: '1rem' }}>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Queues', value: queues.length, color: '#1565C0', emoji: '📬' },
                { label: 'Messages', value: totalMessages.toLocaleString(), color: '#2E7D32', emoji: '✉️' },
                { label: 'Publish/s', value: `${totalPublish.toFixed(1)}`, color: '#E65100', emoji: '📤' },
                { label: 'Deliver/s', value: `${totalDeliver.toFixed(1)}`, color: '#6A1B9A', emoji: '📥' },
              ].map(card => (
                <div
                  key={card.label}
                  style={{
                    border: `1px solid ${card.color}33`,
                    borderRadius: '8px',
                    padding: '0.75rem',
                    background: `${card.color}08`,
                  }}
                >
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{card.emoji}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: card.color }}>{card.value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* Node info */}
            <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#333', fontSize: '0.9rem' }}>
                Node rabbit@prod-node-1
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                {[
                  { k: 'Disk free', v: '47.2 GB', ok: true },
                  { k: 'Memory used', v: '512 MB / 8 GB', ok: true },
                  { k: 'FD used', v: '142 / 65536', ok: true },
                  { k: 'Sockets', v: '84 / 58892', ok: true },
                  { k: 'Erlang processes', v: '412 / 1048576', ok: true },
                  { k: 'Uptime', v: '14d 6h 32m', ok: true },
                ].map(row => (
                  <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: '#666' }}>{row.k}</span>
                    <span style={{ fontFamily: 'monospace', color: row.ok ? '#2E7D32' : '#C62828', fontWeight: 600 }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate chart — simplified sparklines */}
            <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                Message rates (анимированные)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {queues.filter(q => q.state !== 'idle').map(q => (
                  <div key={q.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '2px' }}>
                      <span style={{ fontFamily: 'monospace' }}>{q.name}</span>
                      <span style={{ color: '#E65100' }}>↑{q.publishRate}/s</span>
                      <span style={{ color: '#2E7D32' }}>↓{q.deliverRate}/s</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                      <RateBar value={q.publishRate} max={300} color='#E65100' />
                      <RateBar value={q.deliverRate} max={300} color='#2E7D32' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QUEUES TAB */}
        {activeTab === 'queues' && (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #eee' }}>
                  {['Очередь', 'Тип', 'Статус', 'Messages', 'Ready', 'Unacked', 'Publish/s', 'Deliver/s', 'Consumers'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queues.map(q => (
                  <tr
                    key={q.name}
                    onClick={() => setSelectedQueue(selectedQueue === q.name ? null : q.name)}
                    style={{
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      background: selectedQueue === q.name ? '#FFF8E1' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', fontWeight: 600, color: '#333' }}>
                      {q.name}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '8px',
                        background: queueTypeBg(q.type),
                        color: queueTypeColor(q.type),
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        {q.type}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>
                      <span style={{ color: stateColor(q.state), fontSize: '0.85rem' }}>
                        {stateDot(q.state)} {q.state}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: q.messages > 100 ? 700 : 400, color: q.messages > 1000 ? '#C62828' : '#333' }}>
                      {q.messages.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#555' }}>{q.messagesReady}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: q.messagesUnacked > 0 ? '#E65100' : '#555' }}>
                      {q.messagesUnacked}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#E65100', fontFamily: 'monospace' }}>
                      {q.publishRate.toFixed(1)}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#2E7D32', fontFamily: 'monospace' }}>
                      {q.deliverRate.toFixed(1)}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: q.consumers === 0 ? '#C62828' : '#555' }}>
                      {q.consumers === 0 ? '⚠️ 0' : q.consumers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Queue detail panel */}
            {selectedQ && (
              <div style={{ marginTop: '1rem', border: '1px solid #FFB300', borderRadius: '8px', padding: '1rem', background: '#FFFDE7' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#F57F17' }}>
                  Детали: {selectedQ.name}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
                  {[
                    ['Virtual Host', selectedQ.vhost],
                    ['Queue Type', selectedQ.type],
                    ['Consumers', selectedQ.consumers.toString()],
                    ['Memory', `${selectedQ.memory} KB`],
                    ['Messages Total', selectedQ.messages.toLocaleString()],
                    ['Messages Ready', selectedQ.messagesReady.toLocaleString()],
                    ['Messages Unacked', selectedQ.messagesUnacked.toString()],
                    ['Publish rate', `${selectedQ.publishRate}/s`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #FFF176' }}>
                      <span style={{ color: '#666' }}>{k}</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#333' }}>{v}</span>
                    </div>
                  ))}
                </div>
                {selectedQ.consumers === 0 && (
                  <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#FFEBEE', borderRadius: '6px', fontSize: '0.8rem', color: '#C62828' }}>
                    ⚠️ У очереди нет активных consumers — сообщения накапливаются
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CONNECTIONS TAB */}
        {activeTab === 'connections' && (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #eee' }}>
                  {['Соединение', 'Пользователь', 'VHost', 'Статус', 'Channels', 'Send/s', 'Recv/s'].map(h => (
                    <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, color: '#555' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {connections.map(c => (
                  <tr key={c.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#333' }}>
                      {c.name}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#1565C0', fontWeight: 600 }}>{c.user}</td>
                    <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', color: '#00695C' }}>{c.vhost}</td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>
                      <span style={{ color: stateColor(c.state) }}>
                        {stateDot(c.state)} {c.state}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#555' }}>{c.channels}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#E65100', fontFamily: 'monospace' }}>
                      {(c.sendRate + (Math.random() - 0.5) * 2).toFixed(1)}
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: '#2E7D32', fontFamily: 'monospace' }}>
                      {(c.recvRate + (Math.random() - 0.5) * 2).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#E8F5E9', borderRadius: '8px', fontSize: '0.8rem', color: '#2E7D32' }}>
              Всего соединений: <strong>{connections.length}</strong> | Channels: <strong>{connections.reduce((s, c) => s + c.channels, 0)}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '0.5rem 1rem', background: '#f9f9f9', borderTop: '1px solid #eee', fontSize: '0.75rem', color: '#aaa', display: 'flex', justifyContent: 'space-between' }}>
        <span>Management Plugin v3.12.4</span>
        <span>Обновление каждые 1.5с | tick: {tick}</span>
      </div>
    </div>
  )
}

// ============================================
// Task 4.3: Virtual Hosts and Permissions Matrix
// ============================================

interface VHost {
  name: string
  description: string
  tags: string[]
  created: string
}

interface RmqUser {
  username: string
  tags: string[]
  color: string
}

interface Permission {
  user: string
  vhost: string
  configure: string
  write: string
  read: string
}

const DEFAULT_VHOSTS: VHost[] = [
  { name: '/', description: 'Default virtual host', tags: ['default'], created: '2024-01-01' },
  { name: '/production', description: 'Production environment', tags: ['prod'], created: '2024-03-15' },
  { name: '/staging', description: 'Staging environment', tags: ['staging'], created: '2024-03-15' },
]

const DEFAULT_USERS: RmqUser[] = [
  { username: 'admin', tags: ['administrator'], color: '#C62828' },
  { username: 'app_user', tags: ['none'], color: '#1565C0' },
  { username: 'monitor', tags: ['monitoring'], color: '#2E7D32' },
]

const DEFAULT_PERMISSIONS: Permission[] = [
  { user: 'admin', vhost: '/', configure: '.*', write: '.*', read: '.*' },
  { user: 'admin', vhost: '/production', configure: '.*', write: '.*', read: '.*' },
  { user: 'app_user', vhost: '/production', configure: '', write: 'orders\\..*|payments\\..*', read: 'orders\\..*|payments\\..*' },
  { user: 'monitor', vhost: '/production', configure: '', write: '', read: '.*' },
]

const RESOURCE_NAMES = ['orders.created', 'payments.pending', 'notifications.email', 'audit.events', 'amq.topic', 'amq.direct']

function matchesRegex(pattern: string, name: string): boolean {
  if (!pattern) return false
  try {
    return new RegExp(`^${pattern}$`).test(name)
  } catch {
    return false
  }
}

export function Task4_3_Solution() {
  const { t } = useLanguage()
  const [vhosts, setVhosts] = useState<VHost[]>(DEFAULT_VHOSTS)
  const [users] = useState<RmqUser[]>(DEFAULT_USERS)
  const [permissions, setPermissions] = useState<Permission[]>(DEFAULT_PERMISSIONS)
  const [selectedVhost, setSelectedVhost] = useState<string>('/production')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newVhostName, setNewVhostName] = useState('')
  const [editPerm, setEditPerm] = useState<Permission | null>(null)
  const [editFields, setEditFields] = useState({ configure: '', write: '', read: '' })
  const [activeTab, setActiveTab] = useState<'matrix' | 'editor'>('matrix')

  const getPermission = (user: string, vhost: string): Permission | undefined =>
    permissions.find(p => p.user === user && p.vhost === vhost)

  const hasAccess = (pattern: string, resource: string): boolean =>
    matchesRegex(pattern, resource)

  const startEdit = (user: string, vhost: string) => {
    const perm = getPermission(user, vhost) || { user, vhost, configure: '', write: '', read: '' }
    setEditPerm(perm)
    setEditFields({ configure: perm.configure, write: perm.write, read: perm.read })
    setActiveTab('editor')
  }

  const savePerm = () => {
    if (!editPerm) return
    const updated = { ...editPerm, ...editFields }
    setPermissions(prev => {
      const idx = prev.findIndex(p => p.user === updated.user && p.vhost === updated.vhost)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = updated
        return next
      }
      return [...prev, updated]
    })
    setEditPerm(null)
    setActiveTab('matrix')
  }

  const addVhost = () => {
    const name = newVhostName.trim()
    if (!name || vhosts.find(v => v.name === name)) return
    setVhosts(prev => [...prev, {
      name,
      description: 'Новый virtual host',
      tags: [],
      created: new Date().toISOString().split('T')[0],
    }])
    setNewVhostName('')
  }

  const deleteVhost = (name: string) => {
    if (name === '/') return
    setVhosts(prev => prev.filter(v => v.name !== name))
    setPermissions(prev => prev.filter(p => p.vhost !== name))
  }

  const userForDisplay = users.find(u => u.username === selectedUser)

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '960px', padding: '1rem' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>{t('task.4.3')}</h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Создавайте Virtual Hosts, управляйте пользователями и назначайте permissions через regex-паттерны.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem' }}>
        {/* LEFT: VHosts panel */}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Virtual Hosts
          </div>
          {vhosts.map(v => (
            <div
              key={v.name}
              onClick={() => setSelectedVhost(v.name)}
              style={{
                border: `2px solid ${selectedVhost === v.name ? '#FF6600' : '#eee'}`,
                borderRadius: '8px',
                padding: '0.6rem 0.75rem',
                marginBottom: '0.4rem',
                cursor: 'pointer',
                background: selectedVhost === v.name ? '#FFF3E0' : '#fafafa',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.85rem', color: selectedVhost === v.name ? '#E65100' : '#333' }}>
                  {v.name}
                </span>
                {v.name !== '/' && (
                  <button
                    onClick={e => { e.stopPropagation(); deleteVhost(v.name) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '0.8rem', padding: '0' }}
                    title='Удалить vhost'
                  >
                    ✕
                  </button>
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '2px' }}>{v.description}</div>
            </div>
          ))}

          {/* Add vhost */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
            <input
              value={newVhostName}
              onChange={e => setNewVhostName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addVhost()}
              placeholder='/new-vhost'
              style={{
                flex: 1,
                padding: '0.4rem 0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
              }}
            />
            <button
              onClick={addVhost}
              style={{
                padding: '0.4rem 0.6rem',
                background: '#FF6600',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              +
            </button>
          </div>

          {/* Users list */}
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem', marginTop: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Пользователи
          </div>
          {users.map(u => (
            <div
              key={u.username}
              onClick={() => setSelectedUser(selectedUser === u.username ? null : u.username)}
              style={{
                border: `2px solid ${selectedUser === u.username ? u.color : '#eee'}`,
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                marginBottom: '0.4rem',
                cursor: 'pointer',
                background: selectedUser === u.username ? `${u.color}10` : '#fafafa',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: u.color, flexShrink: 0 }} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>{u.username}</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#888', background: '#f0f0f0', padding: '1px 6px', borderRadius: '8px' }}>
                {u.tags[0]}
              </span>
            </div>
          ))}
        </div>

        {/* RIGHT: Matrix / Editor */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {([['matrix', '🔐 Матрица прав'], ['editor', '✏️ Редактор']] as const).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'matrix' | 'editor')}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  background: activeTab === tab ? '#1565C0' : '#fff',
                  color: activeTab === tab ? '#fff' : '#333',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab ? 600 : 400,
                  fontSize: '0.85rem',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* MATRIX VIEW */}
          {activeTab === 'matrix' && (
            <div>
              <div style={{ marginBottom: '0.75rem', fontSize: '0.82rem', color: '#666' }}>
                VHost: <strong style={{ fontFamily: 'monospace', color: '#E65100' }}>{selectedVhost}</strong>
                {selectedUser && (
                  <span> | Пользователь: <strong style={{ color: userForDisplay?.color }}>{selectedUser}</strong></span>
                )}
              </div>

              {/* Permissions table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #eee', color: '#555' }}>Пользователь</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #eee', color: '#E65100' }}>Configure</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #eee', color: '#1565C0' }}>Write</th>
                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #eee', color: '#2E7D32' }}>Read</th>
                    <th style={{ padding: '0.5rem 0.75rem', border: '1px solid #eee', color: '#555' }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => {
                    const perm = getPermission(user.username, selectedVhost)
                    return (
                      <tr
                        key={user.username}
                        style={{
                          background: selectedUser === user.username ? `${user.color}08` : 'transparent',
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #eee' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: user.color }} />
                            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{user.username}</span>
                          </div>
                        </td>
                        {(['configure', 'write', 'read'] as const).map(pType => {
                          const val = perm ? perm[pType] : ''
                          const isEmpty = !val
                          const isAll = val === '.*'
                          return (
                            <td key={pType} style={{ padding: '0.5rem 0.75rem', border: '1px solid #eee' }}>
                              {isEmpty ? (
                                <span style={{ color: '#bbb', fontSize: '0.75rem' }}>нет доступа</span>
                              ) : (
                                <span style={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.78rem',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: isAll ? '#E8F5E9' : '#E3F2FD',
                                  color: isAll ? '#2E7D32' : '#1565C0',
                                  fontWeight: 600,
                                }}>
                                  {val}
                                </span>
                              )}
                            </td>
                          )
                        })}
                        <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #eee', textAlign: 'center' }}>
                          <button
                            onClick={() => startEdit(user.username, selectedVhost)}
                            style={{
                              padding: '3px 8px',
                              background: '#1565C0',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                            }}
                          >
                            Изменить
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Resource access check */}
              {selectedUser && (
                <div style={{ marginTop: '1rem', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.85rem', color: '#333' }}>
                    Доступ пользователя <span style={{ color: userForDisplay?.color }}>{selectedUser}</span> к ресурсам в {selectedVhost}:
                  </div>
                  <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f9f9f9' }}>
                        <th style={{ padding: '4px 8px', textAlign: 'left', border: '1px solid #eee', color: '#555' }}>Ресурс</th>
                        <th style={{ padding: '4px 8px', textAlign: 'center', border: '1px solid #eee', color: '#E65100' }}>Configure</th>
                        <th style={{ padding: '4px 8px', textAlign: 'center', border: '1px solid #eee', color: '#1565C0' }}>Write</th>
                        <th style={{ padding: '4px 8px', textAlign: 'center', border: '1px solid #eee', color: '#2E7D32' }}>Read</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RESOURCE_NAMES.map(res => {
                        const perm = getPermission(selectedUser, selectedVhost)
                        const canConfigure = perm ? hasAccess(perm.configure, res) : false
                        const canWrite = perm ? hasAccess(perm.write, res) : false
                        const canRead = perm ? hasAccess(perm.read, res) : false
                        return (
                          <tr key={res} style={{ borderBottom: '1px solid #f5f5f5' }}>
                            <td style={{ padding: '4px 8px', fontFamily: 'monospace', border: '1px solid #eee' }}>{res}</td>
                            {[canConfigure, canWrite, canRead].map((ok, i) => (
                              <td key={i} style={{ padding: '4px 8px', textAlign: 'center', border: '1px solid #eee' }}>
                                <span style={{ color: ok ? '#2E7D32' : '#ccc' }}>{ok ? '✅' : '—'}</span>
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* EDITOR VIEW */}
          {activeTab === 'editor' && (
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.25rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '1rem', color: '#333' }}>
                Редактировать права
                {editPerm && (
                  <span style={{ fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.5rem', color: '#666' }}>
                    — {editPerm.user} @ {editPerm.vhost}
                  </span>
                )}
              </div>

              {!editPerm ? (
                <div style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
                  Выберите пользователя в матрице прав и нажмите "Изменить"
                </div>
              ) : (
                <div>
                  {([
                    { key: 'configure', label: 'Configure', color: '#E65100', hint: 'Создание/удаление ресурсов (очереди, exchange)' },
                    { key: 'write', label: 'Write', color: '#1565C0', hint: 'Публикация сообщений' },
                    { key: 'read', label: 'Read', color: '#2E7D32', hint: 'Получение/подписка на сообщения' },
                  ] as const).map(({ key, label, color, hint }) => {
                    const val = editFields[key]
                    let matchCount = 0
                    try {
                      if (val) matchCount = RESOURCE_NAMES.filter(r => matchesRegex(val, r)).length
                    } catch { matchCount = 0 }
                    return (
                      <div key={key} style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color, marginBottom: '4px' }}>
                          {label}
                          <span style={{ fontWeight: 400, color: '#888', marginLeft: '0.5rem', fontSize: '0.78rem' }}>— {hint}</span>
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            value={val}
                            onChange={e => setEditFields(f => ({ ...f, [key]: e.target.value }))}
                            placeholder='.*'
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              fontFamily: 'monospace',
                              fontSize: '0.85rem',
                              border: `2px solid ${val ? color + '66' : '#ddd'}`,
                              borderRadius: '6px',
                            }}
                          />
                          {val && (
                            <span style={{ fontSize: '0.78rem', color: matchCount > 0 ? '#2E7D32' : '#aaa', whiteSpace: 'nowrap' }}>
                              {matchCount > 0 ? `✅ ${matchCount} ресурс(а)` : '0 совпадений'}
                            </span>
                          )}
                        </div>
                        {val && matchCount > 0 && (
                          <div style={{ marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {RESOURCE_NAMES.filter(r => matchesRegex(val, r)).map(r => (
                              <span
                                key={r}
                                style={{
                                  padding: '1px 6px',
                                  borderRadius: '8px',
                                  background: `${color}15`,
                                  color,
                                  fontSize: '0.72rem',
                                  fontFamily: 'monospace',
                                  border: `1px solid ${color}33`,
                                }}
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Regex hints */}
                  <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#F3F4F6', borderRadius: '6px', fontSize: '0.78rem', color: '#555' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Примеры regex:</div>
                    <div style={{ fontFamily: 'monospace', lineHeight: 1.8 }}>
                      <div><span style={{ color: '#1565C0' }}>.*</span> — полный доступ ко всем ресурсам</div>
                      <div><span style={{ color: '#1565C0' }}>orders\..*</span> — все ресурсы, начинающиеся с "orders."</div>
                      <div><span style={{ color: '#1565C0' }}>orders\..*|payments\..*</span> — orders.* или payments.*</div>
                      <div><span style={{ color: '#1565C0' }}></span> (пусто) — доступ запрещён</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={savePerm}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: '#2E7D32',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => { setEditPerm(null); setActiveTab('matrix') }}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: '#f5f5f5',
                        color: '#555',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
