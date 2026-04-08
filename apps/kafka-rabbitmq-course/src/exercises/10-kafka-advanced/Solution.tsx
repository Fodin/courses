import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 10.1: Kafka Streams — topology visualization
// ============================================

type NodeType = 'source' | 'filter' | 'map' | 'groupby' | 'aggregate' | 'sink'

interface TopologyNode {
  id: string
  type: NodeType
  label: string
  config: Record<string, string>
  description: string
}

interface Message {
  key: string
  value: string
  passed: boolean
}

const TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: 'source',
    type: 'source',
    label: 'Source',
    config: { topic: 'orders', bootstrap: 'localhost:9092', 'auto.offset.reset': 'earliest' },
    description: 'Читает сырые события из входного топика Kafka',
  },
  {
    id: 'filter',
    type: 'filter',
    label: 'Filter',
    config: { predicate: 'amount > 100', 'null.handling': 'skip' },
    description: 'Пропускает только заказы с суммой > 100 рублей',
  },
  {
    id: 'map',
    type: 'map',
    label: 'Map / Transform',
    config: { 'key.selector': 'order.userId', 'value.mapper': 'enrichWithUserData()', 'schema.registry': 'http://registry:8081' },
    description: 'Переключает ключ на userId и обогащает данными пользователя',
  },
  {
    id: 'groupby',
    type: 'groupby',
    label: 'GroupBy',
    config: { 'key.fn': 'userId', 'repartition.topic': 'orders-repartitioned-0', partitions: '12' },
    description: 'Перераспределяет поток по userId — создаёт внутренний repartition-топик',
  },
  {
    id: 'aggregate',
    type: 'aggregate',
    label: 'Aggregate',
    config: { 'window.type': 'Tumbling', 'window.size': '1 hour', 'state.store': 'RocksDB', 'changelog.topic': 'orders-agg-changelog' },
    description: 'Суммирует объём заказов по пользователю за час, хранит состояние в RocksDB',
  },
  {
    id: 'sink',
    type: 'sink',
    label: 'Sink',
    config: { topic: 'user-order-stats', acks: 'all', 'replication.factor': '3' },
    description: 'Записывает агрегированные результаты в выходной топик',
  },
]

const NODE_COLORS: Record<NodeType, string> = {
  source: '#2d6a4f',
  filter: '#1e6091',
  map: '#6a1e6e',
  groupby: '#7a4f00',
  aggregate: '#6b1a1a',
  sink: '#1a4a1a',
}

const SAMPLE_MESSAGES: Message[] = [
  { key: 'order-1', value: '{"userId":"u1","amount":250}', passed: true },
  { key: 'order-2', value: '{"userId":"u2","amount":50}', passed: false },
  { key: 'order-3', value: '{"userId":"u1","amount":180}', passed: true },
  { key: 'order-4', value: '{"userId":"u3","amount":30}', passed: false },
  { key: 'order-5', value: '{"userId":"u2","amount":420}', passed: true },
]

export function Task10_1_Solution() {
  const { t } = useLanguage()
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null)
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [processedMessages, setProcessedMessages] = useState<Message[]>([])

  const simulateStep = () => {
    if (step < TOPOLOGY_NODES.length) {
      const node = TOPOLOGY_NODES[step]
      if (node.type === 'filter') {
        setProcessedMessages(SAMPLE_MESSAGES.filter((m) => m.passed))
      } else if (step === 0) {
        setProcessedMessages(SAMPLE_MESSAGES)
      }
      setStep((s) => s + 1)
    }
  }

  const reset = () => {
    setStep(0)
    setProcessedMessages([])
    setIsPlaying(false)
    setSelectedNode(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.10.1')}</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', color: '#aaa' }}>
            Stream Processing Topology
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {TOPOLOGY_NODES.map((node, i) => {
              const isActive = step > i
              const isCurrent = step === i
              const isSelected = selectedNode?.id === node.id
              return (
                <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <button
                    onClick={() => setSelectedNode(isSelected ? null : node)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 1rem',
                      background: isActive
                        ? NODE_COLORS[node.type]
                        : isCurrent
                          ? '#444'
                          : '#2a2a2a',
                      color: isActive ? '#fff' : '#888',
                      border: isSelected ? '2px solid #fff' : '1px solid #444',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {node.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                      {isActive ? 'ACTIVE' : 'IDLE'}
                    </span>
                  </button>
                  {i < TOPOLOGY_NODES.length - 1 && (
                    <div
                      style={{
                        width: '2px',
                        height: '16px',
                        background: isActive ? '#4ec9b0' : '#333',
                        transition: 'background 0.3s',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button onClick={simulateStep} disabled={step >= TOPOLOGY_NODES.length}>
              Следующий шаг ({step}/{TOPOLOGY_NODES.length})
            </button>
            <button onClick={reset}>Сброс</button>
          </div>
        </div>

        <div style={{ flex: '1 1 300px' }}>
          {selectedNode ? (
            <div
              style={{
                background: '#1a1a2e',
                border: `1px solid ${NODE_COLORS[selectedNode.type]}`,
                borderRadius: '8px',
                padding: '1rem',
              }}
            >
              <h4 style={{ color: '#4ec9b0', marginBottom: '0.5rem' }}>
                {selectedNode.label}
              </h4>
              <p style={{ color: '#ccc', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                {selectedNode.description}
              </p>
              <div style={{ fontSize: '0.8rem' }}>
                <div style={{ color: '#888', marginBottom: '0.4rem' }}>Конфигурация:</div>
                {Object.entries(selectedNode.config).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#9cdcfe', fontFamily: 'monospace', flexShrink: 0 }}>
                      {k}:
                    </span>
                    <span style={{ color: '#ce9178', fontFamily: 'monospace' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                background: '#1a1a2e',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '1rem',
                color: '#666',
                fontSize: '0.875rem',
              }}
            >
              Нажмите на оператор для просмотра конфигурации
            </div>
          )}

          {processedMessages.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                Сообщения после Filter ({processedMessages.length} из {SAMPLE_MESSAGES.length}):
              </div>
              {processedMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    background: '#0d1117',
                    border: '1px solid #2d6a4f',
                    borderRadius: '4px',
                    padding: '0.4rem 0.6rem',
                    marginBottom: '0.25rem',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                  }}
                >
                  <span style={{ color: '#9cdcfe' }}>{msg.key}</span>
                  <span style={{ color: '#666' }}>{' => '}</span>
                  <span style={{ color: '#ce9178' }}>{msg.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          background: '#0d1117',
          border: '1px solid #333',
          borderRadius: '6px',
          padding: '0.75rem',
          fontSize: '0.8rem',
          color: '#888',
        }}
      >
        <strong style={{ color: '#ccc' }}>Как читать топологию:</strong> данные текут сверху вниз.
        Каждый оператор получает KStream и возвращает преобразованный KStream.
        GroupBy создаёт repartition-топик для гарантии того, что все записи с одним ключом
        попадут в одну задачу (task). Aggregate требует state store (RocksDB).
      </div>
    </div>
  )
}

// ============================================
// Task 10.2: Compacted Topics — key-value store
// ============================================

interface KafkaRecord {
  offset: number
  key: string
  value: string | null
  timestamp: string
  isTombstone?: boolean
}

const INITIAL_RECORDS: KafkaRecord[] = [
  { offset: 0, key: 'user:1', value: '{"name":"Alice","city":"Moscow"}', timestamp: '10:00:01' },
  { offset: 1, key: 'user:2', value: '{"name":"Bob","city":"SPb"}', timestamp: '10:00:15' },
  { offset: 2, key: 'user:1', value: '{"name":"Alice","city":"Kazan"}', timestamp: '10:01:02' },
  { offset: 3, key: 'user:3', value: '{"name":"Charlie","city":"Ekb"}', timestamp: '10:01:30' },
  { offset: 4, key: 'user:2', value: '{"name":"Bob","city":"Novosibirsk"}', timestamp: '10:02:10' },
  { offset: 5, key: 'user:1', value: '{"name":"Alice","city":"Sochi"}', timestamp: '10:02:45' },
  { offset: 6, key: 'user:3', value: null, timestamp: '10:03:00', isTombstone: true },
  { offset: 7, key: 'user:4', value: '{"name":"Dave","city":"Samara"}', timestamp: '10:03:20' },
  { offset: 8, key: 'user:2', value: '{"name":"Bob","city":"Krasnodar"}', timestamp: '10:04:05' },
]

function runCompaction(records: KafkaRecord[]): KafkaRecord[] {
  const latest = new Map<string, KafkaRecord>()
  for (const r of records) {
    latest.set(r.key, r)
  }
  return Array.from(latest.values())
    .filter((r) => !r.isTombstone)
    .sort((a, b) => a.offset - b.offset)
}

export function Task10_2_Solution() {
  const { t } = useLanguage()
  const [compacted, setCompacted] = useState(false)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [addKey, setAddKey] = useState('user:5')
  const [addValue, setAddValue] = useState('{"name":"Eve","city":"Omsk"}')
  const [records, setRecords] = useState<KafkaRecord[]>(INITIAL_RECORDS)

  const currentRecords = compacted ? runCompaction(records) : records
  const keys = Array.from(new Set(records.map((r) => r.key)))

  const handleAddRecord = () => {
    const newRecord: KafkaRecord = {
      offset: Math.max(...records.map((r) => r.offset)) + 1,
      key: addKey,
      value: addValue || null,
      timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isTombstone: !addValue,
    }
    setRecords((prev) => [...prev, newRecord])
  }

  const handleDeleteKey = (key: string) => {
    const tombstone: KafkaRecord = {
      offset: Math.max(...records.map((r) => r.offset)) + 1,
      key,
      value: null,
      timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isTombstone: true,
    }
    setRecords((prev) => [...prev, tombstone])
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.10.2')}</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ flex: '1 1 340px' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#aaa' }}>
              {compacted ? 'После compaction' : 'До compaction'} ({currentRecords.length} записей)
            </h3>
            <button
              onClick={() => setCompacted((v) => !v)}
              style={{
                background: compacted ? '#2d6a4f' : '#6b1a1a',
                border: 'none',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {compacted ? 'Показать всё' : 'Запустить Compaction'}
            </button>
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '360px' }}>
            {currentRecords.map((r) => {
              const isDuplicate =
                !compacted && records.filter((x) => x.key === r.key).some((x) => x.offset > r.offset)
              const isHighlighted = selectedKey === r.key
              return (
                <div
                  key={r.offset}
                  onClick={() => setSelectedKey(isHighlighted ? null : r.key)}
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    padding: '0.35rem 0.5rem',
                    marginBottom: '0.2rem',
                    background: r.isTombstone
                      ? '#2a1a1a'
                      : isHighlighted
                        ? '#1a2d1a'
                        : isDuplicate
                          ? '#2a2a1a'
                          : '#1a1a1a',
                    border: `1px solid ${r.isTombstone ? '#6b1a1a' : isHighlighted ? '#2d6a4f' : isDuplicate ? '#7a4f00' : '#333'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontFamily: 'monospace',
                    opacity: isDuplicate && !compacted ? 0.6 : 1,
                  }}
                >
                  <span style={{ color: '#666', minWidth: '28px' }}>#{r.offset}</span>
                  <span style={{ color: '#9cdcfe', minWidth: '80px' }}>{r.key}</span>
                  <span style={{ color: r.isTombstone ? '#f44' : '#ce9178', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.isTombstone ? 'TOMBSTONE (null)' : r.value}
                  </span>
                  <span style={{ color: '#555' }}>{r.timestamp}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>
              Добавить запись:
            </div>
            <input
              value={addKey}
              onChange={(e) => setAddKey(e.target.value)}
              placeholder="Ключ (key)"
              style={{ display: 'block', width: '100%', marginBottom: '0.4rem', padding: '0.3rem', fontFamily: 'monospace', fontSize: '0.8rem', background: '#0d1117', border: '1px solid #444', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
            />
            <input
              value={addValue}
              onChange={(e) => setAddValue(e.target.value)}
              placeholder='Value (пусто = tombstone)'
              style={{ display: 'block', width: '100%', marginBottom: '0.4rem', padding: '0.3rem', fontFamily: 'monospace', fontSize: '0.8rem', background: '#0d1117', border: '1px solid #444', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={handleAddRecord} style={{ flex: 1, fontSize: '0.8rem' }}>
                Добавить
              </button>
              <button
                onClick={() => setRecords(INITIAL_RECORDS)}
                style={{ fontSize: '0.8rem', background: '#333' }}
              >
                Сброс
              </button>
            </div>
          </div>

          <div style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>
              Удалить ключ (Tombstone):
            </div>
            {keys.map((k) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#9cdcfe' }}>{k}</span>
                <button
                  onClick={() => handleDeleteKey(k)}
                  style={{ fontSize: '0.75rem', background: '#6b1a1a', padding: '0.15rem 0.5rem' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div style={{ background: '#0d1117', border: '1px solid #333', borderRadius: '6px', padding: '0.6rem', fontSize: '0.78rem', color: '#888' }}>
            <div style={{ marginBottom: '0.3rem' }}>
              <span style={{ background: '#7a4f00', padding: '0 4px', borderRadius: '2px', color: '#ffc', marginRight: '4px' }}>жёлтый</span>
              дублированная запись (старая версия)
            </div>
            <div style={{ marginBottom: '0.3rem' }}>
              <span style={{ background: '#6b1a1a', padding: '0 4px', borderRadius: '2px', color: '#fcc', marginRight: '4px' }}>красный</span>
              tombstone — маркер удаления
            </div>
            <div>
              <span style={{ background: '#1e6091', padding: '0 4px', borderRadius: '2px', color: '#cef', marginRight: '4px' }}>синий</span>
              после compaction — только последние версии
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#0d1117',
          border: '1px solid #333',
          borderRadius: '6px',
          padding: '0.75rem',
          fontSize: '0.8rem',
          color: '#888',
        }}
      >
        <strong style={{ color: '#ccc' }}>Log Compaction:</strong> cleaner thread Kafka периодически
        сканирует сегменты лога и оставляет только <em>последнюю</em> запись для каждого ключа.
        Tombstone (null value) сигнализирует удаление — после compaction запись исчезает полностью.
        Use cases: user profiles, product catalog, configuration store, materialized views для Kafka Streams.
      </div>
    </div>
  )
}

// ============================================
// Task 10.3: Exactly-Once Semantics — Kafka transactions
// ============================================

type TxState = 'idle' | 'begin' | 'produce' | 'commit' | 'abort' | 'committed' | 'aborted'

interface TxMessage {
  topic: string
  partition: number
  key: string
  value: string
  txId: string
}

const TX_MESSAGES: TxMessage[] = [
  { topic: 'payments', partition: 0, key: 'order-42', value: '{"status":"PAID","amount":500}', txId: 'tx-001' },
  { topic: 'inventory', partition: 2, key: 'item-99', value: '{"reserved":1,"orderId":"order-42"}', txId: 'tx-001' },
  { topic: 'notifications', partition: 1, key: 'user-7', value: '{"type":"PAYMENT_CONFIRMED"}', txId: 'tx-001' },
]

const TX_STEPS: Array<{ state: TxState; label: string; description: string; coordinatorAction: string }> = [
  {
    state: 'begin',
    label: '1. beginTransaction()',
    description: 'Producer начинает транзакцию. Transaction Coordinator регистрирует TX в __transaction_state, присваивает epoch для фенсинга зомби-продюсеров.',
    coordinatorAction: 'Запись в __transaction_state: {txId:"tx-001", state:ONGOING, epoch:1}',
  },
  {
    state: 'produce',
    label: '2. produce() в несколько топиков',
    description: 'Producer атомарно записывает сообщения в payments, inventory, notifications. Сообщения видны consumer-у только в режиме read_committed после commit.',
    coordinatorAction: 'Tracking partitions: payments-0, inventory-2, notifications-1',
  },
  {
    state: 'commit',
    label: '3. commitTransaction()',
    description: 'Producer запрашивает commit у Transaction Coordinator. Coordinator записывает PREPARE_COMMIT, затем COMMITTED в __transaction_state. Данные становятся видимы.',
    coordinatorAction: '__transaction_state: {txId:"tx-001", state:COMMITTED}',
  },
]

const ABORT_STEPS: Array<{ state: TxState; label: string; description: string; coordinatorAction: string }> = [
  {
    state: 'begin',
    label: '1. beginTransaction()',
    description: 'Producer начинает транзакцию. Транзакционный ID должен быть стабильным при перезапуске producer-а.',
    coordinatorAction: 'Запись в __transaction_state: {txId:"tx-002", state:ONGOING, epoch:1}',
  },
  {
    state: 'produce',
    label: '2. produce() — частичная запись',
    description: 'Записано только первое сообщение. Симуляция сбоя: producer crash / network error / timeout.',
    coordinatorAction: 'Tracking partitions: payments-0 (ТОЛЬКО payments записан!)',
  },
  {
    state: 'abort',
    label: '3. abortTransaction() / Timeout',
    description: 'Producer вызывает abortTransaction() или Transaction Coordinator автоматически прерывает транзакцию по transaction.timeout.ms (15 мин по умолчанию). Все частичные записи откатываются.',
    coordinatorAction: '__transaction_state: {txId:"tx-002", state:ABORTED} → отправка abort markers во все partitions',
  },
]

export function Task10_3_Solution() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'commit' | 'abort'>('commit')
  const [stepIndex, setStepIndex] = useState(-1)
  const [producerConfig, setProducerConfig] = useState({
    transactional_id: 'order-processor-1',
    enable_idempotence: 'true',
    acks: 'all',
    retries: '2147483647',
  })

  const steps = mode === 'commit' ? TX_STEPS : ABORT_STEPS
  const currentStep = stepIndex >= 0 ? steps[stepIndex] : null

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1)
  }
  const handleReset = () => setStepIndex(-1)

  const getMessageOpacity = (msgIndex: number) => {
    if (stepIndex < 1) return 0.3
    if (mode === 'abort' && msgIndex > 0 && stepIndex >= 1) return 0.2
    return stepIndex >= 2 ? 1 : 0.7
  }

  const getMessageBorderColor = (msgIndex: number) => {
    if (stepIndex < 1) return '#333'
    if (mode === 'abort' && msgIndex > 0) return '#6b1a1a'
    if (stepIndex >= 2) return mode === 'commit' ? '#2d6a4f' : '#6b1a1a'
    return '#7a4f00'
  }

  const finalState = stepIndex === steps.length - 1
    ? (mode === 'commit' ? 'COMMITTED' : 'ABORTED')
    : null

  return (
    <div className="exercise-container">
      <h2>{t('task.10.3')}</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => { setMode('commit'); setStepIndex(-1) }}
          style={{
            background: mode === 'commit' ? '#2d6a4f' : '#222',
            border: `1px solid ${mode === 'commit' ? '#2d6a4f' : '#444'}`,
            color: '#fff',
            padding: '0.4rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Successful Commit
        </button>
        <button
          onClick={() => { setMode('abort'); setStepIndex(-1) }}
          style={{
            background: mode === 'abort' ? '#6b1a1a' : '#222',
            border: `1px solid ${mode === 'abort' ? '#6b1a1a' : '#444'}`,
            color: '#fff',
            padding: '0.4rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Failure & Abort
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Producer Config
          </h3>
          <div
            style={{
              background: '#0d1117',
              border: '1px solid #333',
              borderRadius: '6px',
              padding: '0.6rem',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              marginBottom: '1rem',
            }}
          >
            {Object.entries(producerConfig).map(([k, v]) => (
              <div key={k} style={{ marginBottom: '0.2rem' }}>
                <span style={{ color: '#9cdcfe' }}>{k.replace(/_/g, '.')}:</span>{' '}
                <span style={{ color: '#ce9178' }}>{v}</span>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Сообщения в транзакции
          </h3>
          {TX_MESSAGES.map((msg, i) => (
            <div
              key={i}
              style={{
                background: '#1a1a1a',
                border: `1px solid ${getMessageBorderColor(i)}`,
                borderRadius: '4px',
                padding: '0.4rem 0.6rem',
                marginBottom: '0.3rem',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                opacity: getMessageOpacity(i),
                transition: 'all 0.3s',
              }}
            >
              <div style={{ color: '#888', marginBottom: '0.1rem' }}>
                {msg.topic} [partition {msg.partition}]
              </div>
              <div>
                <span style={{ color: '#9cdcfe' }}>{msg.key}</span>
                <span style={{ color: '#666' }}> → </span>
                <span style={{ color: '#ce9178' }}>{msg.value}</span>
              </div>
              {mode === 'abort' && i > 0 && stepIndex >= 1 && (
                <div style={{ color: '#f66', fontSize: '0.72rem', marginTop: '0.1rem' }}>
                  НЕ ЗАПИСАН (сбой)
                </div>
              )}
            </div>
          ))}

          {finalState && (
            <div
              style={{
                marginTop: '0.5rem',
                padding: '0.6rem',
                background: finalState === 'COMMITTED' ? '#0d2b1a' : '#2b0d0d',
                border: `1px solid ${finalState === 'COMMITTED' ? '#2d6a4f' : '#6b1a1a'}`,
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: 'bold',
                color: finalState === 'COMMITTED' ? '#4ec9b0' : '#f66',
              }}
            >
              Транзакция: {finalState}
            </div>
          )}
        </div>

        <div style={{ flex: '1 1 320px' }}>
          <h3 style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
            Transaction Coordinator
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: stepIndex > i ? '#1a2d1a' : stepIndex === i ? '#1a1a2d' : '#1a1a1a',
                  border: `1px solid ${stepIndex > i ? '#2d6a4f' : stepIndex === i ? '#4040a0' : '#333'}`,
                  borderRadius: '4px',
                  fontSize: '0.82rem',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ color: stepIndex >= i ? '#fff' : '#666', fontWeight: stepIndex === i ? 'bold' : 'normal' }}>
                  {step.label}
                </div>
                {stepIndex >= i && (
                  <div style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                    {step.coordinatorAction}
                  </div>
                )}
              </div>
            ))}
          </div>

          {currentStep && (
            <div
              style={{
                background: '#1a1a2e',
                border: '1px solid #444',
                borderRadius: '6px',
                padding: '0.75rem',
                fontSize: '0.82rem',
                color: '#ccc',
                marginBottom: '1rem',
              }}
            >
              <div style={{ color: '#4ec9b0', fontWeight: 'bold', marginBottom: '0.3rem' }}>
                {currentStep.label}
              </div>
              {currentStep.description}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleNext} disabled={stepIndex >= steps.length - 1}>
              {stepIndex === -1 ? 'Начать симуляцию' : 'Следующий шаг'}
            </button>
            <button onClick={handleReset}>Сброс</button>
          </div>

          <div
            style={{
              marginTop: '1rem',
              background: '#0d1117',
              border: '1px solid #333',
              borderRadius: '6px',
              padding: '0.6rem',
              fontSize: '0.78rem',
              color: '#888',
            }}
          >
            <div style={{ color: '#ccc', marginBottom: '0.3rem' }}>__transaction_state топик:</div>
            <div>Внутренний топик Kafka (50 partitions по умолчанию). Хранит состояние всех активных и завершённых транзакций. Coordinator определяется по: hash(transactional.id) % 50</div>
            <div style={{ marginTop: '0.4rem', color: '#ccc' }}>Isolation levels:</div>
            <div><span style={{ color: '#4ec9b0' }}>read_committed</span> — только завершённые транзакции</div>
            <div><span style={{ color: '#ce9178' }}>read_uncommitted</span> — все сообщения (по умолчанию)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
