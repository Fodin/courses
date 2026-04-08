import { useState } from 'react'
import { useLanguage } from '@courses/platform'

// ============================================================
// Задание 11.1: Архитектурное сравнение — интерактивная таблица
// ============================================================

interface BrokerRow {
  broker: string
  model: string
  ordering: string
  throughput: string
  latency: string
  persistence: string
  protocol: string
  clustering: string
  color: string
  details: {
    model: string
    ordering: string
    throughput: string
    latency: string
    persistence: string
    protocol: string
    clustering: string
  }
}

const BROKERS: BrokerRow[] = [
  {
    broker: 'Apache Kafka',
    model: 'Log (Pull)',
    ordering: 'Per partition',
    throughput: '★★★★★',
    latency: '★★★ (ms)',
    persistence: 'Log-structured',
    protocol: 'Kafka binary',
    clustering: 'KRaft / ZooKeeper',
    color: '#e74c3c',
    details: {
      model:
        'Distributed commit log. Producer пишет в конец лога, consumer сам читает по offset. Сообщения хранятся независимо от потребления.',
      ordering:
        'Строгий порядок внутри партиции. Между партициями — нет. Глобальный порядок = 1 партиция (ограничивает масштаб).',
      throughput:
        'До 1-2 млн msg/s на кластере. Page cache Linux + sequential I/O + batch writes. Zero-copy (sendfile) для consumer.',
      latency:
        'P99 ~ 5-15ms при стандартных настройках. С acks=all и fsync — выше. При linger.ms=0 ниже, но throughput падает.',
      persistence:
        'Данные на диске всегда. Retention по времени (7 дней) или по размеру. Log compaction для последнего значения по ключу.',
      protocol:
        'Собственный бинарный протокол поверх TCP. Версионированный API (ApiVersion). Обратная совместимость брокеров и клиентов.',
      clustering:
        'KRaft (Kafka 3.x) — встроенный Raft, без ZooKeeper. Automatic leader election per partition. ISR (in-sync replicas).',
    },
  },
  {
    broker: 'RabbitMQ',
    model: 'Queue (Push)',
    ordering: 'Per queue (FIFO)',
    throughput: '★★★ (50K+)',
    latency: '★★★★ (sub-ms)',
    persistence: 'Mnesia + дисковые очереди',
    protocol: 'AMQP 0-9-1',
    clustering: 'Erlang cluster',
    color: '#e67e22',
    details: {
      model:
        'Smart broker / dumb consumer. Exchange routing: direct, fanout, topic, headers. Очередь хранит сообщения до ACK.',
      ordering:
        'FIFO в пределах очереди. При multiple consumers без prefetch count порядок может нарушиться. Priority queue меняет порядок.',
      throughput:
        '50-100K msg/s на одной ноде при persistent messages. Без persistence — до 300K. Quorum queues медленнее classic.',
      latency:
        'Sub-millisecond для in-memory non-persistent. С confirms + persistence — 1-5ms. Отличный для RPC-паттернов.',
      persistence:
        'Classic queues: Mnesia metadata + отдельные файлы сообщений. Quorum queues: Raft-based, лучшая надёжность.',
      protocol:
        'AMQP 0-9-1 (основной), MQTT 3.1/5.0, STOMP, HTTP API. AMQP 1.0 как плагин. Богатая экосистема клиентов.',
      clustering:
        'Native Erlang distribution. Classic queues: master/mirror. Quorum queues: Raft (рекомендуется). Shovel/Federation для geo-distribution.',
    },
  },
  {
    broker: 'NATS',
    model: 'PubSub (Push/Pull)',
    ordering: 'Per subject (JetStream)',
    throughput: '★★★★ (multi-M)',
    latency: '★★★★★ (< 1ms)',
    persistence: 'JetStream (опц.)',
    protocol: 'NATS text/binary',
    clustering: 'RAFT (JetStream)',
    color: '#27ae60',
    details: {
      model:
        'Core NATS: fire-and-forget at-most-once. JetStream: persistent streams с at-least-once / exactly-once. Subjects как адресация.',
      ordering:
        'Core NATS: нет гарантий при failover. JetStream: строгий порядок в stream по subject. Consumer sequence tracking.',
      throughput:
        'Core NATS: до 10-20 млн msg/s (in-memory, no disk). JetStream: ~500K-1M msg/s с persistence. Самый быстрый для коротких сообщений.',
      latency:
        'Sub-millisecond стабильно. P99 < 1ms для Core NATS. Написан на Go, минимальный overhead. Отлично для IoT и edge.',
      persistence:
        'Core NATS: нет (только в памяти). JetStream: файловый storage (B-tree индекс), object store, key-value store поверх streams.',
      protocol:
        'Простой текстовый протокол: PUB/SUB/MSG/CONNECT. Также бинарный (NATS 2.x). WebSocket, MQTT gateway. Минималистичный.',
      clustering:
        'NATS cluster (gossip + Raft). JetStream Meta Group для управления. Leaf nodes для geo-distributed edge deployments.',
    },
  },
  {
    broker: 'Redis Streams',
    model: 'Log + Consumer Groups',
    ordering: 'Global (per stream)',
    throughput: '★★★ (100K+)',
    latency: '★★★★★ (< 1ms)',
    persistence: 'RDB/AOF (опц.)',
    protocol: 'RESP3',
    clustering: 'Redis Cluster',
    color: '#8e44ad',
    details: {
      model:
        'XADD / XREAD / XREADGROUP. Stream = append-only log с ID (timestamp-sequence). Consumer groups с ACK-подтверждением.',
      ordering:
        'Строгий глобальный порядок в пределах стрима. ID монотонно возрастает. Нет партиционирования внутри одного stream.',
      throughput:
        '100-200K msg/s. Упирается в single-threaded Redis для write. Шардирование по разным streams/keys для масштаба.',
      latency:
        'Sub-millisecond (in-memory). При AOF fsync каждую запись — деградация. Лучший choice если Redis уже в стеке.',
      persistence:
        'RDB (snapshots) + AOF (append-only file). MAXLEN для ограничения размера стрима. Без persistence — теряет при рестарте.',
      protocol:
        'RESP3 (Redis Serialization Protocol). Текстовый с бинарными данными. Миллионы клиентских библиотек для всех языков.',
      clustering:
        'Redis Cluster: hash slots, автоматический resharding. Redis Sentinel для HA без шардирования. Redis Stack для расширений.',
    },
  },
  {
    broker: 'Apache Pulsar',
    model: 'Log + Queue hybrid',
    ordering: 'Per partition',
    throughput: '★★★★ (1M+)',
    latency: '★★★★ (low)',
    persistence: 'BookKeeper (WAL)',
    protocol: 'Pulsar binary',
    clustering: 'Broker + BookKeeper',
    color: '#2980b9',
    details: {
      model:
        'Unified: queue (exclusive/shared/failover) + streaming (key_shared). Compute/storage separation. Broker stateless.',
      ordering:
        'Строгий порядок в партиции (как Kafka). Key_shared: по ключу к конкретному consumer. Shared: round-robin без порядка.',
      throughput:
        'До 1M+ msg/s. Stateless brokers масштабируются независимо от storage (BookKeeper). Лучше Kafka при burst workloads.',
      latency:
        '5-15ms при репликации через BookKeeper. Меньше чем Kafka при малых batch. Geo-replication built-in.',
      persistence:
        'Apache BookKeeper: WAL + ledgers. Tiered storage: автоматический offload старых данных в S3/GCS/Azure. Zero-copy reads.',
      protocol:
        'Собственный бинарный поверх TCP. Также: Kafka protocol compatibility layer, AMQP, MQTT, STOMP через protocols.io.',
      clustering:
        'Stateless brokers + BookKeeper ensemble + ZooKeeper/etcd для metadata. Geo-replication через отдельные кластеры.',
    },
  },
]

const CRITERIA = ['model', 'ordering', 'throughput', 'latency', 'persistence', 'protocol', 'clustering'] as const
type Criterion = (typeof CRITERIA)[number]

const CRITERION_LABELS: Record<Criterion, string> = {
  model: 'Модель',
  ordering: 'Ordering',
  throughput: 'Throughput',
  latency: 'Latency',
  persistence: 'Persistence',
  protocol: 'Protocol',
  clustering: 'Clustering',
}

export function Task11_1_Solution() {
  const { t } = useLanguage()
  const [detailBroker, setDetailBroker] = useState<string | null>(null)
  const [detailCriterion, setDetailCriterion] = useState<Criterion | null>(null)
  const [highlightBroker, setHighlightBroker] = useState<string | null>(null)

  const selectedBroker = BROKERS.find((b) => b.broker === detailBroker)

  return (
    <div className="exercise-container">
      <h2>{t('task.11.1')}</h2>

      <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Нажмите на строку брокера или на ячейку критерия для детального объяснения.
      </p>

      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444' }}>
              <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left', color: '#ccc', minWidth: 130 }}>Брокер</th>
              {CRITERIA.map((c) => (
                <th key={c} style={{ padding: '0.6rem 0.5rem', textAlign: 'left', color: '#ccc', minWidth: 90 }}>
                  {CRITERION_LABELS[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BROKERS.map((b) => (
              <tr
                key={b.broker}
                style={{
                  borderBottom: '1px solid #333',
                  background: highlightBroker === b.broker ? 'rgba(255,255,255,0.05)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={() => setHighlightBroker(b.broker)}
                onMouseLeave={() => setHighlightBroker(null)}
              >
                <td
                  style={{ padding: '0.5rem 0.8rem', fontWeight: 'bold', color: b.color, whiteSpace: 'nowrap' }}
                  onClick={() => setDetailBroker(detailBroker === b.broker ? null : b.broker)}
                >
                  {b.broker}
                  <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: 6 }}>
                    {detailBroker === b.broker ? '▲' : '▼'}
                  </span>
                </td>
                {CRITERIA.map((c) => (
                  <td
                    key={c}
                    style={{
                      padding: '0.5rem',
                      color:
                        detailBroker === b.broker && detailCriterion === c
                          ? '#fff'
                          : '#bbb',
                      background:
                        detailBroker === b.broker && detailCriterion === c
                          ? 'rgba(255,255,255,0.1)'
                          : 'transparent',
                      cursor: 'pointer',
                      borderRadius: 4,
                    }}
                    onClick={() => {
                      setDetailBroker(b.broker)
                      setDetailCriterion(detailCriterion === c && detailBroker === b.broker ? null : c)
                    }}
                  >
                    {b[c]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBroker && (
        <div
          style={{
            border: `2px solid ${selectedBroker.color}`,
            borderRadius: 8,
            padding: '1rem 1.25rem',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ color: selectedBroker.color, marginBottom: '0.75rem' }}>{selectedBroker.broker}</h3>
          {detailCriterion ? (
            <div>
              <div style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                {CRITERION_LABELS[detailCriterion]}
              </div>
              <p style={{ margin: 0, lineHeight: 1.6 }}>{selectedBroker.details[detailCriterion]}</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {CRITERIA.map((c) => (
                <div
                  key={c}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 6,
                    padding: '0.6rem 0.75rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => setDetailCriterion(c)}
                >
                  <div style={{ color: '#aaa', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                    {CRITERION_LABELS[c]}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#ddd' }}>{selectedBroker.details[c].slice(0, 80)}…</div>
                </div>
              ))}
            </div>
          )}
          <button
            style={{ marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.25rem 0.6rem' }}
            onClick={() => {
              setDetailBroker(null)
              setDetailCriterion(null)
            }}
          >
            Закрыть
          </button>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          padding: '0.75rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 6,
          fontSize: '0.8rem',
          color: '#aaa',
        }}
      >
        {BROKERS.map((b) => (
          <span key={b.broker} style={{ color: b.color, fontWeight: 'bold' }}>
            {b.broker}
          </span>
        ))}
        <span style={{ marginLeft: 'auto' }}>5 брокеров · 7 критериев</span>
      </div>
    </div>
  )
}

// ============================================================
// Задание 11.2: Модели доставки — визуальное сравнение
// ============================================================

type BrokerModel = 'rabbitmq' | 'kafka' | 'nats' | 'redis' | 'pulsar'

interface MessageParticle {
  id: number
  x: number
  progress: number
  active: boolean
}

interface ModelConfig {
  name: string
  color: string
  delivery: string
  guarantee: string
  brokerRole: string
  consumerRole: string
  description: string
  flow: string[]
}

const MODEL_CONFIGS: Record<BrokerModel, ModelConfig> = {
  rabbitmq: {
    name: 'RabbitMQ',
    color: '#e67e22',
    delivery: 'Push (AMQP)',
    guarantee: 'At-least-once',
    brokerRole: 'Smart broker',
    consumerRole: 'Dumb consumer',
    description:
      'Брокер активно доставляет сообщения: маршрутизирует через Exchange, управляет очередями, треккит ACK/NACK. Consumer пассивно получает по prefetch.',
    flow: [
      'Producer → Exchange (direct/fanout/topic)',
      'Exchange → Queue binding по routing key',
      'Broker → Consumer push по prefetch count',
      'Consumer → Broker ACK (basic.ack)',
      'При NACK → requeue или DLX',
    ],
  },
  kafka: {
    name: 'Apache Kafka',
    color: '#e74c3c',
    delivery: 'Pull (Kafka protocol)',
    guarantee: 'At-least-once / Exactly-once',
    brokerRole: 'Dumb broker',
    consumerRole: 'Smart consumer',
    description:
      'Broker просто хранит лог. Consumer сам решает когда и с какого offset читать. Consumer Group координирует partition assignment через GroupCoordinator.',
    flow: [
      'Producer → Topic Partition (по ключу или round-robin)',
      'Broker хранит в log-сегментах на диске',
      'Consumer poll() по offset — сам управляет скоростью',
      'Consumer Group Coordinator → partition assignment',
      'Commit offset → __consumer_offsets topic',
    ],
  },
  nats: {
    name: 'NATS',
    color: '#27ae60',
    delivery: 'Push (Core) / Pull (JetStream)',
    guarantee: 'At-most-once (Core) / At-least-once (JetStream)',
    brokerRole: 'Minimal router',
    consumerRole: 'Subject subscriber',
    description:
      'Core NATS: fire-and-forget. Если subscriber offline — сообщение теряется. JetStream добавляет persistence и consumer groups с pull/push режимами.',
    flow: [
      'Publisher → NATS Server (subject routing)',
      'Server → все активные subscribers на subject',
      'Core: если нет subscribers — сообщение dropped',
      'JetStream: сообщение сохраняется в Stream',
      'JetStream Consumer: push-based или pull-based с ACK',
    ],
  },
  redis: {
    name: 'Redis Streams',
    color: '#8e44ad',
    delivery: 'Pull (XREADGROUP)',
    guarantee: 'At-least-once (с ACK)',
    brokerRole: 'In-memory log',
    consumerRole: 'Consumer group member',
    description:
      'Stream — append-only лог с автогенерируемым ID. XREADGROUP позволяет нескольким consumers читать из одного stream с распределением сообщений и ACK через XACK.',
    flow: [
      'XADD stream * field value → новый ID',
      'XREADGROUP GROUP grp consumer STREAMS stream >',
      'Redis доставляет непрочитанные (>) сообщения',
      'Consumer обрабатывает → XACK stream grp id',
      'XPENDING → pending (unACKed) сообщения для retry',
    ],
  },
  pulsar: {
    name: 'Apache Pulsar',
    color: '#2980b9',
    delivery: 'Push + Pull hybrid',
    guarantee: 'At-least-once / Exactly-once',
    brokerRole: 'Stateless broker + BookKeeper',
    consumerRole: 'Subscription type',
    description:
      'Pulsar разделяет compute (stateless broker) и storage (BookKeeper). Поддерживает 4 типа subscriptions: Exclusive, Shared, Failover, Key_Shared — каждый для своего сценария.',
    flow: [
      'Producer → Stateless Broker → BookKeeper Bookie',
      'BookKeeper: WAL запись в ledger (кворум нод)',
      'Broker читает из BookKeeper и пушит subscriber',
      'Subscription types: Exclusive/Shared/Failover/Key_Shared',
      'ACK: Individual или Cumulative; Negative ACK для retry',
    ],
  },
}

const BROKER_MODELS: BrokerModel[] = ['rabbitmq', 'kafka', 'nats', 'redis', 'pulsar']

export function Task11_2_Solution() {
  const { t } = useLanguage()
  const [selected, setSelected] = useState<BrokerModel>('rabbitmq')
  const [particles, setParticles] = useState<MessageParticle[]>([])
  const [running, setRunning] = useState(false)
  const [msgCount, setMsgCount] = useState(0)

  const config = MODEL_CONFIGS[selected]

  const sendMessage = () => {
    const id = Date.now()
    setParticles((prev) => [...prev.slice(-8), { id, x: 0, progress: 0, active: true }])
    setMsgCount((c) => c + 1)

    let prog = 0
    const interval = setInterval(() => {
      prog += 5
      setParticles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, progress: Math.min(prog, 100) } : p))
      )
      if (prog >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== id))
        }, 600)
      }
    }, 40)
  }

  const startAuto = () => {
    if (running) {
      setRunning(false)
      return
    }
    setRunning(true)
    let count = 0
    const iv = setInterval(() => {
      sendMessage()
      count++
      if (count >= 12) {
        clearInterval(iv)
        setRunning(false)
      }
    }, 350)
  }

  const brokerX = 42
  const consumerX = 78

  return (
    <div className="exercise-container">
      <h2>{t('task.11.2')}</h2>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {BROKER_MODELS.map((m) => (
          <button
            key={m}
            onClick={() => {
              setSelected(m)
              setParticles([])
              setMsgCount(0)
              setRunning(false)
            }}
            style={{
              fontWeight: selected === m ? 'bold' : 'normal',
              borderBottom: selected === m ? `3px solid ${MODEL_CONFIGS[m].color}` : '3px solid transparent',
              paddingBottom: 4,
            }}
          >
            {MODEL_CONFIGS[m].name}
          </button>
        ))}
      </div>

      <div
        style={{
          border: `1px solid ${config.color}`,
          borderRadius: 8,
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            fontSize: '0.85rem',
            marginBottom: '0.75rem',
          }}
        >
          <div>
            <span style={{ color: '#888' }}>Доставка: </span>
            <span style={{ color: config.color }}>{config.delivery}</span>
          </div>
          <div>
            <span style={{ color: '#888' }}>Гарантия: </span>
            <span style={{ color: '#ddd' }}>{config.guarantee}</span>
          </div>
          <div>
            <span style={{ color: '#888' }}>Broker role: </span>
            <span style={{ color: '#ddd' }}>{config.brokerRole}</span>
          </div>
          <div>
            <span style={{ color: '#888' }}>Consumer role: </span>
            <span style={{ color: '#ddd' }}>{config.consumerRole}</span>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#ccc', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
          {config.description}
        </p>

        {/* Анимированная схема */}
        <div style={{ position: 'relative', height: 90, background: 'rgba(0,0,0,0.3)', borderRadius: 6, marginBottom: '0.75rem', overflow: 'hidden' }}>
          {/* Producer */}
          <div
            style={{
              position: 'absolute',
              left: '3%',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#444',
              border: '1px solid #666',
              borderRadius: 4,
              padding: '0.3rem 0.5rem',
              fontSize: '0.7rem',
              color: '#ccc',
              whiteSpace: 'nowrap',
            }}
          >
            Producer
          </div>
          {/* Broker */}
          <div
            style={{
              position: 'absolute',
              left: `${brokerX - 5}%`,
              top: '50%',
              transform: 'translateY(-50%)',
              background: config.color + '33',
              border: `2px solid ${config.color}`,
              borderRadius: 6,
              padding: '0.3rem 0.6rem',
              fontSize: '0.7rem',
              color: config.color,
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
            }}
          >
            {config.name}
          </div>
          {/* Consumer */}
          <div
            style={{
              position: 'absolute',
              left: `${consumerX + 8}%`,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#444',
              border: '1px solid #666',
              borderRadius: 4,
              padding: '0.3rem 0.5rem',
              fontSize: '0.7rem',
              color: '#ccc',
              whiteSpace: 'nowrap',
            }}
          >
            Consumer
          </div>
          {/* Линии */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
            <line x1="13%" y1="50%" x2={`${brokerX - 5}%`} y2="50%" stroke="#555" strokeWidth="1" strokeDasharray="4 3" />
            <line x1={`${brokerX + 5}%`} y1="50%" x2={`${consumerX + 8}%`} y2="50%" stroke="#555" strokeWidth="1" strokeDasharray="4 3" />
          </svg>
          {/* Частицы */}
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                left: `${p.progress}%`,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: config.color,
                boxShadow: `0 0 6px ${config.color}`,
                transition: 'left 0.04s linear',
                opacity: p.progress > 90 ? (100 - p.progress) / 10 : 1,
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
          <button onClick={sendMessage} style={{ fontSize: '0.8rem' }}>
            Отправить сообщение
          </button>
          <button onClick={startAuto} style={{ fontSize: '0.8rem' }}>
            {running ? 'Стоп' : 'Авто x12'}
          </button>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>Отправлено: {msgCount}</span>
        </div>

        <div style={{ fontSize: '0.8rem' }}>
          <div style={{ color: '#aaa', marginBottom: '0.3rem', fontWeight: 'bold' }}>Поток сообщений:</div>
          {config.flow.map((step, i) => (
            <div key={i} style={{ padding: '0.2rem 0', color: '#bbb', display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: config.color, minWidth: 20 }}>{i + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Задание 11.3: Decision Tree — какой брокер выбрать?
// ============================================================

interface TreeNode {
  id: string
  question?: string
  yes?: string
  no?: string
  result?: string
  broker?: string
  color?: string
  explanation?: string
  useCases?: string[]
}

const TREE_NODES: Record<string, TreeNode> = {
  root: {
    id: 'root',
    question: 'Нужна ли гарантированная доставка сообщений (at-least-once или exactly-once)?',
    yes: 'q_replay',
    no: 'r_nats_core',
  },
  q_replay: {
    id: 'q_replay',
    question: 'Нужен ли replay / повторное чтение прошлых сообщений?',
    yes: 'q_throughput',
    no: 'q_routing',
  },
  q_throughput: {
    id: 'q_throughput',
    question: 'Ожидаемый throughput > 500K msg/s или нужно хранить TB данных?',
    yes: 'q_tiered',
    no: 'q_ops_kafka',
  },
  q_tiered: {
    id: 'q_tiered',
    question: 'Нужен tiered storage (автоматический offload в S3/GCS) или geo-replication?',
    yes: 'r_pulsar',
    no: 'r_kafka',
  },
  q_ops_kafka: {
    id: 'q_ops_kafka',
    question: 'Есть опыт работы с Kafka или Redis уже в стеке?',
    yes: 'r_kafka_small',
    no: 'q_nats_js',
  },
  q_nats_js: {
    id: 'q_nats_js',
    question: 'Важна минимальная операционная сложность и лёгкий деплой?',
    yes: 'r_nats_js',
    no: 'r_kafka_small',
  },
  q_routing: {
    id: 'q_routing',
    question: 'Нужна сложная маршрутизация (topic patterns, headers, dead-letter queues, RPC)?',
    yes: 'r_rabbitmq',
    no: 'q_redis_existing',
  },
  q_redis_existing: {
    id: 'q_redis_existing',
    question: 'Redis уже используется в инфраструктуре?',
    yes: 'r_redis_streams',
    no: 'q_latency',
  },
  q_latency: {
    id: 'q_latency',
    question: 'Критична сверхнизкая latency (< 1ms) для IoT / edge / real-time?',
    yes: 'r_nats_core',
    no: 'r_rabbitmq',
  },
  r_kafka: {
    id: 'r_kafka',
    result: 'Apache Kafka',
    broker: 'kafka',
    color: '#e74c3c',
    explanation:
      'Kafka — оптимальный выбор для высоконагруженных систем с большими объёмами данных. Распределённый commit log, высокий throughput, долгосрочное хранение, экосистема Kafka Streams / ksqlDB.',
    useCases: ['Event sourcing', 'Stream processing (Kafka Streams)', 'Data pipeline / ETL', 'Audit log', 'Metrics & logs aggregation'],
  },
  r_pulsar: {
    id: 'r_pulsar',
    result: 'Apache Pulsar',
    broker: 'pulsar',
    color: '#2980b9',
    explanation:
      'Pulsar превосходит Kafka при нужде в tiered storage, geo-replication из коробки и более гибкой модели подписок. Stateless brokers легко масштабируются независимо от storage.',
    useCases: ['Multi-region / geo-distributed', 'Tiered storage (hot/warm/cold)', 'Mixed queue+streaming workloads', 'Multi-tenant SaaS'],
  },
  r_kafka_small: {
    id: 'r_kafka_small',
    result: 'Apache Kafka (или Redis Streams)',
    broker: 'kafka',
    color: '#e74c3c',
    explanation:
      'Kafka подходит и для умеренных нагрузок. Если в стеке уже есть Redis — Redis Streams проще для начала: нет отдельного кластера, используете уже имеющуюся инфраструктуру.',
    useCases: ['Event log с replay', 'Task queues с историей', 'Audit trail', 'Message deduplication'],
  },
  r_nats_js: {
    id: 'r_nats_js',
    result: 'NATS JetStream',
    broker: 'nats',
    color: '#27ae60',
    explanation:
      'NATS JetStream — самый простой в деплое брокер с persistence. Один бинарный файл, нет зависимостей. При этом даёт at-least-once, consumer groups и key-value store.',
    useCases: ['Microservices messaging', 'IoT с persistence', 'Edge / embedded deployments', 'Service mesh messaging'],
  },
  r_rabbitmq: {
    id: 'r_rabbitmq',
    result: 'RabbitMQ',
    broker: 'rabbitmq',
    color: '#e67e22',
    explanation:
      'RabbitMQ — лучший выбор для сложной маршрутизации, RPC-паттернов, work queues с priority и dead-letter exchanges. AMQP 0-9-1 — богатый протокол с многолетней экосистемой.',
    useCases: ['Task / work queues', 'RPC over messaging', 'Complex routing (topic/headers)', 'Priority queues', 'Request/Reply pattern'],
  },
  r_redis_streams: {
    id: 'r_redis_streams',
    result: 'Redis Streams',
    broker: 'redis',
    color: '#8e44ad',
    explanation:
      'Если Redis уже есть — добавьте стриминг без нового сервиса. XADD/XREADGROUP даёт consumer groups, ACK, pending messages. Лимит: single-threaded writes, не для high-throughput.',
    useCases: ['Activity feeds', 'Real-time notifications', 'Event log (small scale)', 'Sensor data ingestion (small)'],
  },
  r_nats_core: {
    id: 'r_nats_core',
    result: 'NATS (Core)',
    broker: 'nats',
    color: '#27ae60',
    explanation:
      'NATS Core — fire-and-forget pub/sub с минимальной latency. Идеален когда потеря сообщений допустима: live metrics, presence notifications, команды управления IoT-устройствами.',
    useCases: ['Live telemetry / metrics', 'Presence / online status', 'Control plane commands', 'Fan-out notifications', 'Service discovery'],
  },
}

const BROKER_COLORS: Record<string, string> = {
  kafka: '#e74c3c',
  rabbitmq: '#e67e22',
  nats: '#27ae60',
  redis: '#8e44ad',
  pulsar: '#2980b9',
}

export function Task11_3_Solution() {
  const { t } = useLanguage()
  const [path, setPath] = useState<string[]>(['root'])
  const [answers, setAnswers] = useState<Record<string, boolean>>({})

  const currentNodeId = path[path.length - 1]
  const currentNode = TREE_NODES[currentNodeId]

  const answer = (yes: boolean) => {
    const next = yes ? currentNode.yes : currentNode.no
    if (!next) return
    setAnswers((prev) => ({ ...prev, [currentNodeId]: yes }))
    setPath((prev) => [...prev, next])
  }

  const back = () => {
    if (path.length <= 1) return
    const prev = path[path.length - 2]
    setAnswers((a) => {
      const copy = { ...a }
      delete copy[prev]
      return copy
    })
    setPath((p) => p.slice(0, -1))
  }

  const reset = () => {
    setPath(['root'])
    setAnswers({})
  }

  const isResult = Boolean(currentNode.result)

  return (
    <div className="exercise-container">
      <h2>{t('task.11.3')}</h2>

      {/* Хлебные крошки */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#888' }}>
        {path.map((nodeId, i) => {
          const node = TREE_NODES[nodeId]
          const isLast = i === path.length - 1
          const answeredYes = answers[nodeId]
          return (
            <span key={nodeId} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {i > 0 && <span style={{ color: '#555' }}>→</span>}
              <span style={{ color: isLast ? '#fff' : '#888' }}>
                {node.result ? node.result : `Вопрос ${i + 1}`}
              </span>
              {!isLast && answers[nodeId] !== undefined && (
                <span style={{ color: answers[nodeId] ? '#4caf50' : '#f44336', fontSize: '0.75rem' }}>
                  ({answers[nodeId] ? 'Да' : 'Нет'})
                </span>
              )}
            </span>
          )
        })}
      </div>

      {/* Текущий узел */}
      <div
        style={{
          border: `2px solid ${isResult ? (currentNode.color ?? '#888') : '#555'}`,
          borderRadius: 10,
          padding: '1.25rem',
          marginBottom: '1rem',
          minHeight: 140,
        }}
      >
        {isResult ? (
          <div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Рекомендация</div>
            <h3 style={{ color: currentNode.color, marginBottom: '0.75rem', fontSize: '1.3rem' }}>
              {currentNode.result}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '0.75rem', lineHeight: 1.6 }}>
              {currentNode.explanation}
            </p>
            <div style={{ fontSize: '0.85rem' }}>
              <div style={{ color: '#aaa', marginBottom: '0.4rem', fontWeight: 'bold' }}>Use cases:</div>
              {currentNode.useCases?.map((uc, i) => (
                <div key={i} style={{ color: '#bbb', padding: '0.15rem 0' }}>
                  • {uc}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem' }}>
              Шаг {path.length} из ~5
            </div>
            <p style={{ fontSize: '1rem', color: '#eee', marginBottom: '1.25rem', lineHeight: 1.5, fontWeight: 'bold' }}>
              {currentNode.question}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => answer(true)}
                style={{
                  background: '#1a4a1a',
                  border: '1px solid #4caf50',
                  color: '#4caf50',
                  padding: '0.5rem 1.5rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                Да
              </button>
              <button
                onClick={() => answer(false)}
                style={{
                  background: '#4a1a1a',
                  border: '1px solid #f44336',
                  color: '#f44336',
                  padding: '0.5rem 1.5rem',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                Нет
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {path.length > 1 && (
          <button onClick={back} style={{ fontSize: '0.85rem' }}>
            Назад
          </button>
        )}
        {path.length > 1 && (
          <button onClick={reset} style={{ fontSize: '0.85rem' }}>
            Начать заново
          </button>
        )}
      </div>

      {/* Все брокеры снизу */}
      <div
        style={{
          marginTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '0.5rem',
        }}
      >
        {Object.entries(BROKER_COLORS).map(([key, color]) => (
          <div
            key={key}
            style={{
              border: `1px solid ${color}33`,
              borderRadius: 6,
              padding: '0.5rem 0.6rem',
              fontSize: '0.78rem',
              color: '#aaa',
            }}
          >
            <div style={{ color, fontWeight: 'bold', marginBottom: '0.2rem' }}>
              {key === 'kafka' ? 'Apache Kafka' : key === 'rabbitmq' ? 'RabbitMQ' : key === 'nats' ? 'NATS' : key === 'redis' ? 'Redis Streams' : 'Apache Pulsar'}
            </div>
            <div style={{ color: '#666' }}>
              {key === 'kafka'
                ? 'High-throughput log'
                : key === 'rabbitmq'
                ? 'Smart routing'
                : key === 'nats'
                ? 'Low-latency'
                : key === 'redis'
                ? 'Redis-native'
                : 'Geo-distributed'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Задание 11.4: Benchmark Dashboard
// ============================================================

interface BenchScenario {
  id: string
  name: string
  description: string
}

interface BrokerBenchmark {
  broker: string
  color: string
  throughput: Record<string, number>
  p99Latency: Record<string, number>
  msgSizeImpact: { size: string; throughput: number; latency: number }[]
}

const BENCH_SCENARIOS: BenchScenario[] = [
  { id: 'small_persist', name: 'Small + Persistent', description: '1KB сообщения, 3x replication, fsync, at-least-once' },
  { id: 'small_fast', name: 'Small + Fast', description: '1KB сообщения, in-memory / no fsync, at-most-once' },
  { id: 'large_persist', name: 'Large + Persistent', description: '100KB сообщения, 3x replication, disk flush' },
  { id: 'fanout', name: 'Fan-out 10 consumers', description: '1KB, 10 параллельных потребителей на одном топике' },
]

const BENCH_DATA: BrokerBenchmark[] = [
  {
    broker: 'Apache Kafka',
    color: '#e74c3c',
    throughput: { small_persist: 800000, small_fast: 2000000, large_persist: 95000, fanout: 750000 },
    p99Latency: { small_persist: 12, small_fast: 4, large_persist: 35, fanout: 18 },
    msgSizeImpact: [
      { size: '100B', throughput: 2500000, latency: 2 },
      { size: '1KB', throughput: 1200000, latency: 4 },
      { size: '10KB', throughput: 300000, latency: 8 },
      { size: '100KB', throughput: 95000, latency: 35 },
      { size: '1MB', throughput: 8000, latency: 120 },
    ],
  },
  {
    broker: 'RabbitMQ',
    color: '#e67e22',
    throughput: { small_persist: 45000, small_fast: 280000, large_persist: 8000, fanout: 120000 },
    p99Latency: { small_persist: 8, small_fast: 1, large_persist: 45, fanout: 12 },
    msgSizeImpact: [
      { size: '100B', throughput: 350000, latency: 0.8 },
      { size: '1KB', throughput: 200000, latency: 1.2 },
      { size: '10KB', throughput: 60000, latency: 5 },
      { size: '100KB', throughput: 8000, latency: 45 },
      { size: '1MB', throughput: 1200, latency: 180 },
    ],
  },
  {
    broker: 'NATS',
    color: '#27ae60',
    throughput: { small_persist: 450000, small_fast: 8000000, large_persist: 40000, fanout: 5000000 },
    p99Latency: { small_persist: 5, small_fast: 0.3, large_persist: 25, fanout: 0.5 },
    msgSizeImpact: [
      { size: '100B', throughput: 12000000, latency: 0.2 },
      { size: '1KB', throughput: 6000000, latency: 0.3 },
      { size: '10KB', throughput: 800000, latency: 1 },
      { size: '100KB', throughput: 120000, latency: 6 },
      { size: '1MB', throughput: 15000, latency: 50 },
    ],
  },
  {
    broker: 'Redis Streams',
    color: '#8e44ad',
    throughput: { small_persist: 120000, small_fast: 900000, large_persist: 12000, fanout: 200000 },
    p99Latency: { small_persist: 3, small_fast: 0.5, large_persist: 20, fanout: 2 },
    msgSizeImpact: [
      { size: '100B', throughput: 1200000, latency: 0.3 },
      { size: '1KB', throughput: 700000, latency: 0.5 },
      { size: '10KB', throughput: 150000, latency: 2 },
      { size: '100KB', throughput: 20000, latency: 15 },
      { size: '1MB', throughput: 2500, latency: 120 },
    ],
  },
  {
    broker: 'Apache Pulsar',
    color: '#2980b9',
    throughput: { small_persist: 750000, small_fast: 1500000, large_persist: 85000, fanout: 700000 },
    p99Latency: { small_persist: 10, small_fast: 3, large_persist: 30, fanout: 15 },
    msgSizeImpact: [
      { size: '100B', throughput: 2000000, latency: 2 },
      { size: '1KB', throughput: 1000000, latency: 3 },
      { size: '10KB', throughput: 250000, latency: 8 },
      { size: '100KB', throughput: 85000, latency: 30 },
      { size: '1MB', throughput: 7000, latency: 100 },
    ],
  },
]

function formatNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
  return String(n)
}

type BenchView = 'throughput' | 'latency' | 'msgsize'

export function Task11_4_Solution() {
  const { t } = useLanguage()
  const [scenario, setScenario] = useState<string>('small_persist')
  const [view, setView] = useState<BenchView>('throughput')
  const [selectedBrokers, setSelectedBrokers] = useState<Set<string>>(
    new Set(BENCH_DATA.map((b) => b.broker))
  )
  const [msgSizeBroker, setMsgSizeBroker] = useState('Apache Kafka')

  const toggleBroker = (broker: string) => {
    setSelectedBrokers((prev) => {
      const next = new Set(prev)
      if (next.has(broker)) {
        if (next.size > 1) next.delete(broker)
      } else {
        next.add(broker)
      }
      return next
    })
  }

  const visibleData = BENCH_DATA.filter((b) => selectedBrokers.has(b.broker))

  const maxThroughput = Math.max(...visibleData.map((b) => b.throughput[scenario] ?? 0))
  const maxLatency = Math.max(...visibleData.map((b) => b.p99Latency[scenario] ?? 0))

  const scenarioConfig = BENCH_SCENARIOS.find((s) => s.id === scenario)!

  const msgSizeData = BENCH_DATA.find((b) => b.broker === msgSizeBroker)?.msgSizeImpact ?? []
  const maxMsgThroughput = Math.max(...msgSizeData.map((d) => d.throughput))

  return (
    <div className="exercise-container">
      <h2>{t('task.11.4')}</h2>

      {/* Фильтры */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {BENCH_DATA.map((b) => (
          <button
            key={b.broker}
            onClick={() => toggleBroker(b.broker)}
            style={{
              fontSize: '0.8rem',
              opacity: selectedBrokers.has(b.broker) ? 1 : 0.4,
              borderBottom: selectedBrokers.has(b.broker) ? `3px solid ${b.color}` : '3px solid transparent',
              paddingBottom: 3,
            }}
          >
            {b.broker}
          </button>
        ))}
      </div>

      {/* Вкладки */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {(['throughput', 'latency', 'msgsize'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{ fontWeight: view === v ? 'bold' : 'normal', fontSize: '0.85rem' }}
          >
            {v === 'throughput' ? 'Throughput' : v === 'latency' ? 'P99 Latency' : 'Msg Size Impact'}
          </button>
        ))}
      </div>

      {view !== 'msgsize' && (
        <>
          {/* Сценарии */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {BENCH_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                style={{
                  fontSize: '0.78rem',
                  background: scenario === s.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: scenario === s.id ? '1px solid #888' : '1px solid #444',
                }}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 6,
              padding: '0.5rem 0.75rem',
              fontSize: '0.8rem',
              color: '#888',
              marginBottom: '1rem',
            }}
          >
            {scenarioConfig.description}
          </div>

          {/* Бар-чарт */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                fontSize: '0.85rem',
                color: '#aaa',
                marginBottom: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              {view === 'throughput' ? 'Throughput (msg/s)' : 'P99 Latency (ms)'}
            </div>
            {visibleData.map((b) => {
              const value = view === 'throughput' ? b.throughput[scenario] : b.p99Latency[scenario]
              const maxVal = view === 'throughput' ? maxThroughput : maxLatency
              const pct = maxVal > 0 ? (value / maxVal) * 100 : 0
              // Для latency: чем меньше — тем лучше, поэтому инвертируем цвет
              const isGood = view === 'throughput' ? pct > 60 : pct < 30
              return (
                <div key={b.broker} style={{ marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      marginBottom: '0.2rem',
                    }}
                  >
                    <span style={{ color: b.color }}>{b.broker}</span>
                    <span style={{ color: isGood ? '#4caf50' : '#888', fontFamily: 'monospace' }}>
                      {view === 'throughput' ? formatNum(value) : `${value}ms`}
                    </span>
                  </div>
                  <div style={{ background: '#333', borderRadius: 4, height: 20, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: view === 'latency' && pct > 60 ? '#c0392b' : b.color,
                        borderRadius: 4,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {view === 'msgsize' && (
        <div>
          <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {BENCH_DATA.map((b) => (
              <button
                key={b.broker}
                onClick={() => setMsgSizeBroker(b.broker)}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: msgSizeBroker === b.broker ? 'bold' : 'normal',
                  borderBottom: msgSizeBroker === b.broker ? `3px solid ${b.color}` : '3px solid transparent',
                  color: b.color,
                }}
              >
                {b.broker}
              </button>
            ))}
          </div>

          <div
            style={{
              fontSize: '0.85rem',
              color: '#aaa',
              marginBottom: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            Влияние размера сообщения на throughput (msg/s)
          </div>

          {msgSizeData.map((d) => {
            const pct = maxMsgThroughput > 0 ? (d.throughput / maxMsgThroughput) * 100 : 0
            const brokerColor = BENCH_DATA.find((b) => b.broker === msgSizeBroker)?.color ?? '#888'
            return (
              <div key={d.size} style={{ marginBottom: '0.65rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    marginBottom: '0.2rem',
                    color: '#bbb',
                  }}
                >
                  <span style={{ fontFamily: 'monospace', minWidth: 50 }}>{d.size}</span>
                  <span style={{ fontFamily: 'monospace', color: '#ddd' }}>
                    {formatNum(d.throughput)} msg/s · p99: {d.latency}ms
                  </span>
                </div>
                <div style={{ background: '#333', borderRadius: 4, height: 16, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: brokerColor,
                      borderRadius: 4,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            )
          })}

          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 6,
              fontSize: '0.82rem',
              color: '#aaa',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: '#ddd' }}>Вывод:</strong> У всех брокеров throughput (msg/s) падает с ростом
            размера сообщения. При 100KB+ Kafka и Pulsar остаются конкурентоспособными благодаря batch и zero-copy.
            NATS теряет преимущество при больших сообщениях. RabbitMQ лучше всего работает с маленькими (100B-10KB).
          </div>
        </div>
      )}

      {/* Заметка по методологии */}
      <div
        style={{
          padding: '0.75rem',
          background: 'rgba(255,165,0,0.08)',
          border: '1px solid rgba(255,165,0,0.3)',
          borderRadius: 6,
          fontSize: '0.78rem',
          color: '#888',
          lineHeight: 1.5,
        }}
      >
        Данные основаны на публичных бенчмарках (Confluent, NATS.io, CloudAMQP, RedisLabs, DataStax, 2022-2024).
        Цифры приблизительны: реальные результаты зависят от hardware, network, batch size, replication factor,
        количества producers/consumers и конфигурации брокера.
      </div>
    </div>
  )
}
