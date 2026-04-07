// ============================================
// Level 0: Introduction to MQTT — Solutions
// ============================================

import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================
// Task 0.1: MQTT Protocol and pub/sub model
// ============================================

interface PubSubNode {
  id: string
  type: 'publisher' | 'broker' | 'subscriber'
  label: string
  description: string
  color: string
  bgColor: string
}

interface Message {
  id: number
  topic: string
  payload: string
  qos: 0 | 1 | 2
  from: string
  to: string[]
}

const nodes: PubSubNode[] = [
  {
    id: 'temp_sensor',
    type: 'publisher',
    label: 'Датчик температуры',
    description: 'Публикует: home/sensor/temperature',
    color: '#1565C0',
    bgColor: '#E3F2FD',
  },
  {
    id: 'door_sensor',
    type: 'publisher',
    label: 'Датчик двери',
    description: 'Публикует: home/door/status',
    color: '#1565C0',
    bgColor: '#E3F2FD',
  },
  {
    id: 'broker',
    type: 'broker',
    label: 'Mosquitto Broker',
    description: 'Маршрутизирует сообщения',
    color: '#6A1B9A',
    bgColor: '#F3E5F5',
  },
  {
    id: 'dashboard',
    type: 'subscriber',
    label: 'Веб-дашборд',
    description: 'Подписан: home/#',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
  },
  {
    id: 'automator',
    type: 'subscriber',
    label: 'Автоматизация',
    description: 'Подписан: home/sensor/+',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
  },
  {
    id: 'logger',
    type: 'subscriber',
    label: 'Логгер данных',
    description: 'Подписан: home/+/status',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
  },
]

const exampleMessages: Message[] = [
  {
    id: 1,
    topic: 'home/sensor/temperature',
    payload: '{ "value": 23.5, "unit": "C" }',
    qos: 0,
    from: 'Датчик температуры',
    to: ['Веб-дашборд', 'Автоматизация'],
  },
  {
    id: 2,
    topic: 'home/door/status',
    payload: '{ "state": "open", "ts": 1712345678 }',
    qos: 1,
    from: 'Датчик двери',
    to: ['Веб-дашборд', 'Логгер данных'],
  },
]

export function Task0_1_Solution() {
  const { t } = useLanguage()
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [log, setLog] = useState<string[]>([])

  const publishMessage = (msg: Message) => {
    setSelectedMessage(msg)
    setLog(prev => [
      `[${new Date().toLocaleTimeString()}] PUBLISH → topic: "${msg.topic}" | QoS: ${msg.qos}`,
      `[${new Date().toLocaleTimeString()}] BROKER   ← получил от "${msg.from}"`,
      ...msg.to.map(
        sub =>
          `[${new Date().toLocaleTimeString()}] DELIVER  → "${sub}" подписан на "${msg.topic}"`,
      ),
      ...prev,
    ])
  }

  const publishers = nodes.filter(n => n.type === 'publisher')
  const subscribers = nodes.filter(n => n.type === 'subscriber')
  const broker = nodes.find(n => n.type === 'broker')!

  const nodeStyle = (node: PubSubNode): React.CSSProperties => ({
    border: `2px solid ${activeNode === node.id ? node.color : '#ddd'}`,
    borderRadius: '8px',
    padding: '0.75rem',
    background: activeNode === node.id ? node.bgColor : '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '160px',
    textAlign: 'center',
  })

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{t('solution.level0.protocolTitle')}</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        {t('solution.level0.protocolDesc')}
      </p>

      {/* Architecture diagram */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          overflowX: 'auto',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '12px',
        }}
      >
        {/* Publishers column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#1565C0',
              textAlign: 'center',
              marginBottom: '0.25rem',
            }}
          >
            PUBLISHERS
          </div>
          {publishers.map(node => (
            <div
              key={node.id}
              style={nodeStyle(node)}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
            >
              <div style={{ fontSize: '1.5rem' }}>📡</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: node.color }}>
                {node.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.25rem' }}>
                {node.description}
              </div>
            </div>
          ))}
        </div>

        {/* Arrow pub → broker */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '4px' }}>PUBLISH</div>
          <div style={{ fontSize: '1.5rem', color: '#1565C0' }}>→</div>
        </div>

        {/* Broker */}
        <div style={nodeStyle(broker)} onClick={() => setActiveNode('broker')}>
          <div style={{ fontSize: '2rem' }}>🔀</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: broker.color }}>
            {broker.label}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.25rem' }}>
            {broker.description}
          </div>
        </div>

        {/* Arrow broker → sub */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '4px' }}>DELIVER</div>
          <div style={{ fontSize: '1.5rem', color: '#2E7D32' }}>→</div>
        </div>

        {/* Subscribers column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#2E7D32',
              textAlign: 'center',
              marginBottom: '0.25rem',
            }}
          >
            SUBSCRIBERS
          </div>
          {subscribers.map(node => (
            <div
              key={node.id}
              style={nodeStyle(node)}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
            >
              <div style={{ fontSize: '1.5rem' }}>💻</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: node.color }}>
                {node.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.25rem' }}>
                {node.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulate message publishing */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>{t('solution.level0.simulatePublish')}</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {exampleMessages.map(msg => (
            <button
              key={msg.id}
              onClick={() => publishMessage(msg)}
              style={{
                padding: '0.5rem 1rem',
                background: '#1565C0',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              📤 {msg.from}
            </button>
          ))}
        </div>

        {selectedMessage && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: '#E8F5E9',
              borderRadius: '8px',
              border: '1px solid #A5D6A7',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
              {t('solution.level0.publishedMessage')}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <div>
                <b>{t('solution.level0.topic')}:</b> {selectedMessage.topic}
              </div>
              <div>
                <b>{t('solution.level0.payload')}:</b> {selectedMessage.payload}
              </div>
              <div>
                <b>QoS:</b> {selectedMessage.qos}
              </div>
              <div>
                <b>{t('solution.level0.recipients')}:</b> {selectedMessage.to.join(', ')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event log */}
      {log.length > 0 && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <h3 style={{ margin: 0 }}>{t('solution.level0.eventLog')}</h3>
            <button
              onClick={() => setLog([])}
              style={{
                padding: '0.25rem 0.75rem',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {t('solution.level0.clear')}
            </button>
          </div>
          <div
            style={{
              background: '#1a1a2e',
              color: '#00ff88',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              padding: '0.75rem',
              borderRadius: '8px',
              maxHeight: '180px',
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
// Task 0.2: Architecture: broker, clients, topics
// ============================================

interface TopicNode {
  name: string
  full: string
  children?: TopicNode[]
  hasMessage?: boolean
  retained?: boolean
}

const topicTree: TopicNode = {
  name: 'home',
  full: 'home',
  children: [
    {
      name: 'sensor',
      full: 'home/sensor',
      children: [
        { name: 'temperature', full: 'home/sensor/temperature', hasMessage: true, retained: true },
        { name: 'humidity', full: 'home/sensor/humidity', hasMessage: true, retained: false },
        { name: 'pressure', full: 'home/sensor/pressure', hasMessage: false },
      ],
    },
    {
      name: 'light',
      full: 'home/light',
      children: [
        { name: 'living_room', full: 'home/light/living_room', hasMessage: true, retained: true },
        { name: 'bedroom', full: 'home/light/bedroom', hasMessage: false },
      ],
    },
    {
      name: 'door',
      full: 'home/door',
      children: [{ name: 'status', full: 'home/door/status', hasMessage: true, retained: true }],
    },
  ],
}

const connectionInfo = {
  host: '192.168.1.1',
  port: 1883,
  keepalive: 60,
  clientId: 'openwrt-mosquitto',
  protocolVersion: 'MQTTv5',
}

function renderTopicNode(
  node: TopicNode,
  depth: number,
  selectedTopic: string | null,
  onSelect: (t: string) => void,
) {
  const isSelected = selectedTopic === node.full
  return (
    <div key={node.full} style={{ marginLeft: depth * 20 }}>
      <div
        onClick={() => onSelect(node.full)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          background: isSelected ? '#E3F2FD' : 'transparent',
          border: isSelected ? '1px solid #90CAF9' : '1px solid transparent',
          marginBottom: '2px',
        }}
      >
        <span>{node.children ? '📁' : '📄'}</span>
        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: depth === 0 ? 700 : 400 }}>
          {node.name}
        </span>
        {node.hasMessage && (
          <span
            style={{
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: '10px',
              background: node.retained ? '#FFF9C4' : '#E8F5E9',
              color: node.retained ? '#F57F17' : '#2E7D32',
              border: `1px solid ${node.retained ? '#FFE082' : '#A5D6A7'}`,
            }}
          >
            {node.retained ? '📌 retained' : '✉️ msg'}
          </span>
        )}
      </div>
      {node.children?.map(child => renderTopicNode(child, depth + 1, selectedTopic, onSelect))}
    </div>
  )
}

export function Task0_2_Solution() {
  const { t } = useLanguage()
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [subscribeInput, setSubscribeInput] = useState('home/sensor/+')
  const [matchedTopics, setMatchedTopics] = useState<string[]>([])

  const allLeafTopics = [
    'home/sensor/temperature',
    'home/sensor/humidity',
    'home/sensor/pressure',
    'home/light/living_room',
    'home/light/bedroom',
    'home/door/status',
  ]

  const matchWildcard = (pattern: string, topic: string): boolean => {
    const patParts = pattern.split('/')
    const topParts = topic.split('/')
    for (let i = 0; i < patParts.length; i++) {
      if (patParts[i] === '#') return true
      if (patParts[i] === '+') continue
      if (patParts[i] !== topParts[i]) return false
    }
    return patParts.length === topParts.length
  }

  const testSubscription = () => {
    const matched = allLeafTopics.filter(t => matchWildcard(subscribeInput, t))
    setMatchedTopics(matched)
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{t('solution.level0.architectureTitle')}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Topic tree */}
        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>{t('solution.level0.topicTree')}</h3>
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              background: '#fafafa',
            }}
          >
            {renderTopicNode(topicTree, 0, selectedTopic, setSelectedTopic)}
          </div>
          {selectedTopic && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                background: '#E3F2FD',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
              }}
            >
              <b>{t('solution.level0.selectedTopic')}:</b> {selectedTopic}
            </div>
          )}
        </div>

        {/* Connection info */}
        <div>
          <h3 style={{ marginBottom: '0.75rem' }}>{t('solution.level0.connectionParams')}</h3>
          <div
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              background: '#fafafa',
            }}
          >
            {Object.entries(connectionInfo).map(([key, val]) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: '1px solid #eee',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ color: '#666', fontFamily: 'monospace' }}>{key}</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace', color: '#1565C0' }}>
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Wildcard tester */}
          <h3 style={{ marginTop: '1.25rem', marginBottom: '0.75rem' }}>{t('solution.level0.subscriptionTester')}</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              value={subscribeInput}
              onChange={e => setSubscribeInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem',
                fontFamily: 'monospace',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
              placeholder="home/sensor/+"
            />
            <button
              onClick={testSubscription}
              style={{
                padding: '0.5rem 1rem',
                background: '#6A1B9A',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {t('solution.level0.test')}
            </button>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
            {t('solution.level0.wildcardHint')}
          </div>
          {matchedTopics.length > 0 && (
            <div>
              <div style={{ fontSize: '0.8rem', color: '#2E7D32', marginBottom: '0.25rem' }}>
                {t('solution.level0.matches')}: {matchedTopics.length}
              </div>
              {matchedTopics.map(topic => (
                <div
                  key={topic}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    padding: '4px 8px',
                    background: '#E8F5E9',
                    borderRadius: '4px',
                    marginBottom: '4px',
                  }}
                >
                  ✅ {topic}
                </div>
              ))}
            </div>
          )}
          {matchedTopics.length === 0 && subscribeInput && (
            <div style={{ fontSize: '0.8rem', color: '#999' }}>
              {t('solution.level0.testPrompt')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 0.3: MQTT vs HTTP/WebSocket/AMQP
// ============================================

interface Protocol {
  name: string
  shortName: string
  color: string
  bgColor: string
  pattern: string
  overhead: string
  persistent: string
  qos: string
  broker: string
  bidirectional: string
  iot: 'excellent' | 'good' | 'fair' | 'poor'
  useCases: string[]
  pros: string[]
  cons: string[]
}

const protocols: Protocol[] = [
  {
    name: 'MQTT v5',
    shortName: 'MQTT',
    color: '#6A1B9A',
    bgColor: '#F3E5F5',
    pattern: 'Pub/Sub через брокер',
    overhead: 'Минимальный (2 байта заголовок)',
    persistent: 'Да (постоянные сессии)',
    qos: 'QoS 0 / 1 / 2',
    broker: 'Обязателен',
    bidirectional: 'Да (асинхронно)',
    iot: 'excellent',
    useCases: ['IoT датчики', 'Умный дом', 'Телеметрия', 'M2M связь'],
    pros: ['Малый размер пакетов', 'Низкое энергопотребление', 'Надёжная доставка (QoS)', 'LWT для обнаружения отключений'],
    cons: ['Требует брокер', 'Нет запросов/ответов из коробки', 'Базовая безопасность без TLS'],
  },
  {
    name: 'HTTP/REST',
    shortName: 'HTTP',
    color: '#1565C0',
    bgColor: '#E3F2FD',
    pattern: 'Запрос / Ответ',
    overhead: 'Большой (заголовки 200-800 байт)',
    persistent: 'Нет (каждый запрос новый)',
    qos: 'Нет встроенного',
    broker: 'Не нужен',
    bidirectional: 'Только polling / SSE',
    iot: 'fair',
    useCases: ['REST API', 'Веб-приложения', 'Микросервисы'],
    pros: ['Простота', 'Широкая поддержка', 'Удобная отладка', 'Stateless'],
    cons: ['Высокий оверхед', 'Нет push от сервера', 'Polling неэффективен', 'Плохо для батарейных устройств'],
  },
  {
    name: 'WebSocket',
    shortName: 'WS',
    color: '#E65100',
    bgColor: '#FFF3E0',
    pattern: 'Двунаправленный канал',
    overhead: 'Малый (после handshake)',
    persistent: 'Да (долгосрочное соединение)',
    qos: 'Нет встроенного',
    broker: 'Не нужен (но часто используют)',
    bidirectional: 'Да (полнодуплекс)',
    iot: 'good',
    useCases: ['Чаты', 'Онлайн игры', 'Real-time дашборды', 'MQTT over WebSocket'],
    pros: ['Двусторонняя связь', 'Малый оверхед после коннекта', 'Поддержка браузерами'],
    cons: ['HTTP handshake при старте', 'Нет роутинга сообщений', 'Нет QoS'],
  },
  {
    name: 'AMQP 1.0',
    shortName: 'AMQP',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    pattern: 'Очереди + Pub/Sub',
    overhead: 'Средний (бинарный протокол)',
    persistent: 'Да',
    qos: 'ACK, транзакции',
    broker: 'Обязателен (RabbitMQ, etc.)',
    bidirectional: 'Да',
    iot: 'poor',
    useCases: ['Корпоративный messaging', 'Финансовые системы', 'Транзакционные очереди'],
    pros: ['Гарантия доставки', 'Транзакции', 'Routing rules', 'Корпоративные стандарты'],
    cons: ['Тяжёлый протокол', 'Не подходит для IoT', 'Сложная настройка', 'Высокое потребление ресурсов'],
  },
]

const comparisonRows = [
  { label: 'Паттерн', key: 'pattern' },
  { label: 'Заголовки (overhead)', key: 'overhead' },
  { label: 'Persistent соединение', key: 'persistent' },
  { label: 'Гарантия доставки', key: 'qos' },
  { label: 'Нужен брокер', key: 'broker' },
  { label: 'Двунаправленность', key: 'bidirectional' },
] as const

const iotRating: Record<Protocol['iot'], { label: string; color: string }> = {
  excellent: { label: '★★★★★', color: '#2E7D32' },
  good: { label: '★★★★☆', color: '#558B2F' },
  fair: { label: '★★★☆☆', color: '#F57F17' },
  poor: { label: '★★☆☆☆', color: '#C62828' },
}

export function Task0_3_Solution() {
  const { t } = useLanguage()
  const [activeProtocol, setActiveProtocol] = useState<string>('MQTT v5')
  const [view, setView] = useState<'table' | 'detail'>('table')

  const active = protocols.find(p => p.name === activeProtocol)!

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{t('solution.level0.comparisonTitle')}</h2>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        {t('solution.level0.comparisonDesc')}
      </p>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['table', 'detail'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: view === v ? '#6A1B9A' : '#fff',
              color: view === v ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {v === 'table' ? `📊 ${t('solution.level0.comparison')}` : `🔍 ${t('solution.level0.details')}`}
          </button>
        ))}
      </div>

      {view === 'table' ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    border: '1px solid #ddd',
                    minWidth: '160px',
                  }}
                >
                  {t('solution.level0.criteria')}
                </th>
                {protocols.map(p => (
                  <th
                    key={p.name}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      background: p.bgColor,
                      color: p.color,
                      fontWeight: 700,
                    }}
                  >
                    {p.shortName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(row => (
                <tr key={row.key}>
                  <td
                    style={{
                      padding: '0.6rem 0.75rem',
                      border: '1px solid #ddd',
                      fontWeight: 600,
                      color: '#444',
                    }}
                  >
                    {row.label}
                  </td>
                  {protocols.map(p => (
                    <td
                      key={p.name}
                      style={{
                        padding: '0.6rem 0.75rem',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.82rem',
                      }}
                    >
                      {p[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr style={{ background: '#fafafa' }}>
                <td
                  style={{ padding: '0.6rem 0.75rem', border: '1px solid #ddd', fontWeight: 600 }}
                >
                  {t('solution.level0.iotSuitability')}
                </td>
                {protocols.map(p => (
                  <td
                    key={p.name}
                    style={{
                      padding: '0.6rem 0.75rem',
                      border: '1px solid #ddd',
                      textAlign: 'center',
                      color: iotRating[p.iot].color,
                      fontWeight: 700,
                    }}
                  >
                    {iotRating[p.iot].label}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          {/* Protocol selector */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {protocols.map(p => (
              <button
                key={p.name}
                onClick={() => setActiveProtocol(p.name)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: `2px solid ${activeProtocol === p.name ? p.color : '#ddd'}`,
                  background: activeProtocol === p.name ? p.bgColor : '#fff',
                  color: p.color,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {p.shortName}
              </button>
            ))}
          </div>

          {/* Detail view */}
          <div
            style={{
              border: `2px solid ${active.color}`,
              borderRadius: '12px',
              padding: '1.25rem',
              background: active.bgColor,
            }}
          >
            <h3 style={{ color: active.color, marginBottom: '1rem' }}>{active.name}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>{t('solution.level0.pros')}</h4>
                {active.pros.map(p => (
                  <div key={p} style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                    ✅ {p}
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>{t('solution.level0.cons')}</h4>
                {active.cons.map(c => (
                  <div key={c} style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                    ❌ {c}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>{t('solution.level0.useCases')}</h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {active.useCases.map(u => (
                  <span
                    key={u}
                    style={{
                      padding: '4px 10px',
                      background: '#fff',
                      border: `1px solid ${active.color}`,
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      color: active.color,
                    }}
                  >
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
