import { useState, useMemo } from 'react'

// ============================================
// Задание 4.1: Справочная карточка (SQL vs NoSQL, CAP, ACID/BASE)
// ============================================

export function Task4_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Базы данных — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>SQL (реляционные)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>PostgreSQL, MySQL</strong> — таблицы со строгой схемой, JOIN, транзакции (ACID).
            <br />
            Когда: финансы, e-commerce, сложные запросы, нормализованные данные.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>NoSQL — 4 типа</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Document</strong> (MongoDB) — вложенные JSON. <strong>Key-Value</strong> (Redis) — максимальная скорость.
            <br />
            <strong>Column-Family</strong> (Cassandra) — огромные объёмы записи. <strong>Graph</strong> (Neo4j) — связи.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>ACID vs BASE</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>ACID</strong> — Atomicity, Consistency, Isolation, Durability. Строгие гарантии (банки).
            <br />
            <strong>BASE</strong> — Basically Available, Soft state, Eventual consistency. Быстро, но данные могут временно расходиться.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>CAP-теорема</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            В распределённой системе при partition выбирайте:
            <br />
            <strong>CP</strong> — консистентность (MongoDB, HBase). <strong>AP</strong> — доступность (Cassandra, DynamoDB).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Репликация и шардирование</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Репликация</strong> — копирование данных (Master-Slave, Master-Master). Масштабирует чтение.
            <br />
            <strong>Шардирование</strong> — разделение данных (Range, Hash, Directory). Масштабирует всё.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Индексы</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>B-tree</strong> — универсальный (=, &gt;, &lt;, BETWEEN, ORDER BY). <strong>Hash</strong> — только =.
            <br />
            <strong>Composite (A, B, C)</strong> — leftmost prefix: работает для A, A+B, A+B+C.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 4.2: Визуализатор шардирования
// ============================================

type ShardStrategy = 'range' | 'hash' | 'geographic'

interface UserRecord {
  userId: number
  region: 'US' | 'EU' | 'Asia'
  createdAt: string
}

function simpleHash(n: number): number {
  let h = n * 2654435761
  h = ((h >>> 16) ^ h) * 0x45d9f3b
  h = ((h >>> 16) ^ h)
  return Math.abs(h)
}

function generateData(): UserRecord[] {
  const regions: Array<'US' | 'EU' | 'Asia'> = ['US', 'US', 'US', 'US', 'US', 'US', 'US', 'US', 'EU', 'EU', 'EU', 'EU', 'EU', 'Asia', 'Asia', 'Asia', 'Asia', 'Asia', 'Asia', 'Asia']
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  return Array.from({ length: 20 }, (_, i) => ({
    userId: i + 1,
    region: regions[i],
    createdAt: `2024-${months[i % 12]}-${String((i % 28) + 1).padStart(2, '0')}`,
  }))
}

function getShardForRecord(record: UserRecord, strategy: ShardStrategy): number {
  switch (strategy) {
    case 'range':
      if (record.userId <= 7) return 0
      if (record.userId <= 14) return 1
      return 2
    case 'hash':
      return simpleHash(record.userId) % 3
    case 'geographic':
      if (record.region === 'US') return 0
      if (record.region === 'EU') return 1
      return 2
  }
}

const strategyLabels: Record<ShardStrategy, string> = {
  range: 'Range (по user_id)',
  hash: 'Hash (hash(user_id) % 3)',
  geographic: 'Geographic (по региону)',
}

const shardNames: Record<ShardStrategy, string[]> = {
  range: ['Shard 1 (id 1-7)', 'Shard 2 (id 8-14)', 'Shard 3 (id 15-20)'],
  hash: ['Shard 1 (hash%3=0)', 'Shard 2 (hash%3=1)', 'Shard 3 (hash%3=2)'],
  geographic: ['Shard 1 (US)', 'Shard 2 (EU)', 'Shard 3 (Asia)'],
}

export function Task4_2_Solution() {
  const [strategy, setStrategy] = useState<ShardStrategy>('range')
  const data = useMemo(() => generateData(), [])

  const distribution = useMemo(() => {
    const counts = [0, 0, 0]
    const shardRecords: UserRecord[][] = [[], [], []]
    for (const record of data) {
      const shard = getShardForRecord(record, strategy)
      counts[shard]++
      shardRecords[shard].push(record)
    }
    return { counts, shardRecords }
  }, [data, strategy])

  const maxCount = Math.max(...distribution.counts)
  const isHotSpot = (count: number) => count > data.length * 0.5

  const stdDev = useMemo(() => {
    const mean = data.length / 3
    const variance = distribution.counts.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / 3
    return Math.sqrt(variance).toFixed(1)
  }, [distribution.counts, data.length])

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Визуализатор шардирования</h2>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Стратегия:</strong>{' '}
        {(Object.keys(strategyLabels) as ShardStrategy[]).map((s) => (
          <button
            key={s}
            onClick={() => setStrategy(s)}
            style={{
              margin: '0 0.25rem',
              padding: '0.4rem 0.8rem',
              background: strategy === s ? '#1976d2' : '#e0e0e0',
              color: strategy === s ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: strategy === s ? 'bold' : 'normal',
            }}
          >
            {strategyLabels[s]}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Распределение по шардам</h3>
        {distribution.counts.map((count, i) => (
          <div key={i} style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <strong>{shardNames[strategy][i]}</strong>
              <span style={{
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                background: isHotSpot(count) ? '#ffcdd2' : '#e8f5e9',
                color: isHotSpot(count) ? '#c62828' : '#2e7d32',
              }}>
                {count} записей {isHotSpot(count) ? '🔥 HOT SPOT' : ''}
              </span>
            </div>
            <div style={{ background: '#e0e0e0', borderRadius: '4px', height: '24px', width: '100%' }}>
              <div
                style={{
                  background: isHotSpot(count) ? '#ef5350' : '#66bb6a',
                  borderRadius: '4px',
                  height: '24px',
                  width: `${(count / maxCount) * 100}%`,
                  transition: 'width 0.3s ease',
                  minWidth: count > 0 ? '2px' : '0',
                }}
              />
            </div>
          </div>
        ))}
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          Стандартное отклонение: <strong>{stdDev}</strong> (идеально: 0, чем меньше — тем равномернее)
        </div>
      </div>

      <h3>Таблица данных</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd', textAlign: 'left' }}>user_id</th>
              <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd', textAlign: 'left' }}>region</th>
              <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd', textAlign: 'left' }}>created_at</th>
              <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Шард</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => {
              const shard = getShardForRecord(record, strategy)
              const colors = ['#e3f2fd', '#e8f5e9', '#fff3e0']
              return (
                <tr key={record.userId} style={{ background: colors[shard] }}>
                  <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee' }}>{record.userId}</td>
                  <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee' }}>{record.region}</td>
                  <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee' }}>{record.createdAt}</td>
                  <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                    Shard {shard + 1}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// Задание 4.3: DB Recommender
// ============================================

type DataStructure = 'tabular' | 'document' | 'key-value' | 'graph'

interface DbRecommendation {
  db: string
  description: string
  explanation: string
  warnings: string[]
  confidence: 'high' | 'medium' | 'low'
  alternatives: Array<{ db: string; when: string }>
}

function getRecommendation(
  readWriteRatio: number,
  consistency: number,
  dataStructure: DataStructure,
  scale: number
): DbRecommendation {
  // Key-value always Redis
  if (dataStructure === 'key-value') {
    return {
      db: 'Redis',
      description: 'In-memory key-value store',
      explanation: 'Для key-value данных Redis обеспечивает минимальную латентность (<1 мс) и поддерживает TTL, pub/sub, Lua-скрипты. Идеален для кэша, сессий, счётчиков, очередей.',
      warnings: scale > 70 ? ['При очень большом объёме данных Redis ограничен RAM. Рассмотрите Redis Cluster или DynamoDB для петабайтных нагрузок.'] : [],
      confidence: 'high',
      alternatives: [
        { db: 'DynamoDB', when: 'Нужна управляемая serverless key-value БД с автошардированием' },
        { db: 'Memcached', when: 'Только кэширование строк, максимальная утилизация CPU' },
      ],
    }
  }

  // Graph always Neo4j
  if (dataStructure === 'graph') {
    return {
      db: 'Neo4j',
      description: 'Graph database',
      explanation: 'Для данных со сложными связями (соцсети, рекомендации, фрод-детекция) графовая БД выполняет обход связей за O(1) на ребро, вместо множественных JOIN в SQL.',
      warnings: consistency > 70 ? ['Neo4j поддерживает ACID-транзакции, но горизонтальное масштабирование ограничено. Для очень больших графов рассмотрите Amazon Neptune.'] : [],
      confidence: 'high',
      alternatives: [
        { db: 'Amazon Neptune', when: 'Managed service, масштабирование в облаке' },
        { db: 'PostgreSQL + recursive CTE', when: 'Простые иерархии, не хочется добавлять новую БД' },
      ],
    }
  }

  // Document
  if (dataStructure === 'document') {
    if (consistency > 70) {
      return {
        db: 'PostgreSQL (JSONB)',
        description: 'Реляционная БД с поддержкой JSON',
        explanation: 'PostgreSQL JSONB позволяет хранить документы с гибкой схемой, сохраняя ACID-гарантии и возможности SQL. GIN-индексы обеспечивают быстрый поиск по JSON-полям.',
        warnings: ['JSONB в PostgreSQL медленнее нативной документной БД для глубоко вложенных структур.'],
        confidence: 'medium',
        alternatives: [
          { db: 'MongoDB', when: 'Eventual consistency допустима, нужна нативная работа с документами' },
        ],
      }
    }
    return {
      db: 'MongoDB',
      description: 'Document database',
      explanation: 'MongoDB хранит данные как JSON-документы с вложенными структурами. Гибкая схема, горизонтальное масштабирование (sharding), rich query language. Идеален для каталогов, CMS, профилей.',
      warnings: readWriteRatio < 30 ? ['MongoDB менее эффективна для write-heavy нагрузок по сравнению с Cassandra.'] : [],
      confidence: readWriteRatio > 50 ? 'high' : 'medium',
      alternatives: [
        { db: 'PostgreSQL JSONB', when: 'Нужны ACID-транзакции + документная модель' },
        { db: 'CouchDB', when: 'Нужна оффлайн-синхронизация (CouchDB Sync)' },
      ],
    }
  }

  // Tabular
  if (consistency > 60) {
    const warnings: string[] = []
    if (scale > 80) {
      warnings.push('При миллиардах записей потребуется шардирование (Citus, pg_shard) — это значительно усложнит архитектуру.')
    }
    return {
      db: 'PostgreSQL',
      description: 'Реляционная БД (SQL)',
      explanation: 'PostgreSQL обеспечивает ACID-транзакции, мощные JOIN, строгую типизацию и богатую экосистему расширений. Лучший выбор по умолчанию для структурированных данных с strong consistency.',
      warnings,
      confidence: scale > 80 ? 'medium' : 'high',
      alternatives: [
        { db: 'MySQL', when: 'Простые запросы, более широкая поддержка хостингов' },
        { db: 'CockroachDB', when: 'Нужен распределённый SQL с автошардированием' },
      ],
    }
  }

  if (readWriteRatio < 40 || scale > 70) {
    return {
      db: 'Cassandra',
      description: 'Column-family distributed database',
      explanation: 'Cassandra оптимизирована для write-heavy нагрузок с eventual consistency. Линейное горизонтальное масштабирование, нет single point of failure. Идеальна для логов, IoT, временных рядов.',
      warnings: ['Cassandra не поддерживает JOIN и имеет ограниченную модель запросов — проектируйте таблицы под конкретные запросы (query-driven design).'],
      confidence: readWriteRatio < 30 ? 'high' : 'medium',
      alternatives: [
        { db: 'ScyllaDB', when: 'Совместима с Cassandra, но быстрее (C++ вместо Java)' },
        { db: 'PostgreSQL', when: 'Масштаб позволяет обойтись одним сервером' },
      ],
    }
  }

  return {
    db: 'PostgreSQL',
    description: 'Реляционная БД (SQL)',
    explanation: 'При неоднозначных параметрах PostgreSQL — безопасный выбор по умолчанию. Поддерживает JSONB для гибкости, расширения (PostGIS, pg_trgm), партиционирование для масштабирования.',
    warnings: ['Для очень специфических нагрузок (time-series, full-text search) специализированные БД могут быть эффективнее.'],
    confidence: 'medium',
    alternatives: [
      { db: 'MongoDB', when: 'Данные скорее документные, чем табличные' },
      { db: 'Cassandra', when: 'Write-heavy нагрузка с eventual consistency' },
    ],
  }
}

const dataStructureLabels: Record<DataStructure, string> = {
  tabular: 'Tabular (таблицы)',
  document: 'Document (JSON)',
  'key-value': 'Key-Value',
  graph: 'Graph (связи)',
}

const confidenceColors: Record<string, { bg: string; text: string }> = {
  high: { bg: '#e8f5e9', text: '#2e7d32' },
  medium: { bg: '#fff3e0', text: '#e65100' },
  low: { bg: '#fce4ec', text: '#c62828' },
}

const confidenceLabels: Record<string, string> = {
  high: 'Высокая',
  medium: 'Средняя',
  low: 'Низкая',
}

export function Task4_3_Solution() {
  const [readWriteRatio, setReadWriteRatio] = useState(70)
  const [consistency, setConsistency] = useState(50)
  const [dataStructure, setDataStructure] = useState<DataStructure>('tabular')
  const [scale, setScale] = useState(30)

  const recommendation = useMemo(
    () => getRecommendation(readWriteRatio, consistency, dataStructure, scale),
    [readWriteRatio, consistency, dataStructure, scale]
  )

  const confStyle = confidenceColors[recommendation.confidence]

  return (
    <div style={{ padding: '1rem' }}>
      <h2>DB Recommender — выбор базы данных</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Read/Write Ratio: {readWriteRatio}% чтение / {100 - readWriteRatio}% запись
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={readWriteRatio}
            onChange={(e) => setReadWriteRatio(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#999' }}>
            <span>Write-heavy</span>
            <span>Read-heavy</span>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Consistency: {consistency < 40 ? 'Eventual' : consistency < 70 ? 'Tunable' : 'Strong (ACID)'}
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={consistency}
            onChange={(e) => setConsistency(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#999' }}>
            <span>Eventual</span>
            <span>Strong</span>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Структура данных
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {(Object.keys(dataStructureLabels) as DataStructure[]).map((ds) => (
              <button
                key={ds}
                onClick={() => setDataStructure(ds)}
                style={{
                  padding: '0.3rem 0.6rem',
                  background: dataStructure === ds ? '#1976d2' : '#e0e0e0',
                  color: dataStructure === ds ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {dataStructureLabels[ds]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Масштаб: {scale < 30 ? 'тысячи' : scale < 60 ? 'миллионы' : scale < 85 ? 'сотни миллионов' : 'миллиарды'} записей
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#999' }}>
            <span>Тысячи</span>
            <span>Миллиарды</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '1.5rem', background: '#f5f5f5', borderRadius: '8px', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Рекомендация: {recommendation.db}</h3>
          <span style={{
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            background: confStyle.bg,
            color: confStyle.text,
          }}>
            Уверенность: {confidenceLabels[recommendation.confidence]}
          </span>
        </div>
        <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.9rem' }}>
          {recommendation.description}
        </p>
        <p style={{ margin: '0 0 1rem' }}>{recommendation.explanation}</p>

        {recommendation.warnings.length > 0 && (
          <div style={{ padding: '0.75rem', background: '#fff3e0', borderRadius: '6px', marginBottom: '1rem' }}>
            <strong style={{ color: '#e65100' }}>Предупреждения:</strong>
            {recommendation.warnings.map((w, i) => (
              <p key={i} style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>{w}</p>
            ))}
          </div>
        )}

        <div>
          <strong>Альтернативы:</strong>
          {recommendation.alternatives.map((alt, i) => (
            <p key={i} style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
              <strong>{alt.db}</strong> — {alt.when}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 4.4: Схема репликации и шардирования для соцсети
// ============================================

type DbType = 'PostgreSQL' | 'MongoDB' | 'Cassandra' | 'Redis'
type ShardKey = 'user_id' | 'post_id' | 'date' | 'region' | 'none'
type ReplicationType = 'Master-Slave' | 'Master-Master' | 'None'

interface EntityChoice {
  db: DbType
  shardKey: ShardKey
  replication: ReplicationType
}

interface EntityConfig {
  name: string
  description: string
  reference: EntityChoice
  referenceExplanation: string
}

const entities: EntityConfig[] = [
  {
    name: 'Profiles',
    description: 'Профили пользователей (имя, аватар, био)',
    reference: { db: 'PostgreSQL', shardKey: 'user_id', replication: 'Master-Slave' },
    referenceExplanation: 'PostgreSQL: строгая схема, ACID для обновлений профиля. Shard by user_id: каждый профиль на своём шарде. Master-Slave: read-heavy (профиль просматривают чаще, чем редактируют).',
  },
  {
    name: 'Posts',
    description: 'Посты (текст, медиа, автор, дата)',
    reference: { db: 'Cassandra', shardKey: 'user_id', replication: 'Master-Slave' },
    referenceExplanation: 'Cassandra: write-heavy (новые посты постоянно), eventual consistency допустима. Shard by user_id: лента автора на одном шарде. Master-Slave: чтение ленты масштабируется через реплики.',
  },
  {
    name: 'Likes',
    description: 'Лайки (кто, что, когда)',
    reference: { db: 'Redis', shardKey: 'post_id', replication: 'Master-Slave' },
    referenceExplanation: 'Redis: быстрые счётчики (INCR), sets для отслеживания \"кто лайкнул\". Shard by post_id: все лайки поста на одном шарде. Master-Slave: read-heavy (показываем количество лайков).',
  },
  {
    name: 'Comments',
    description: 'Комментарии (текст, автор, пост, дата)',
    reference: { db: 'Cassandra', shardKey: 'post_id', replication: 'Master-Slave' },
    referenceExplanation: 'Cassandra: write-heavy, хронологический порядок (TimeSeries-паттерн). Shard by post_id: все комментарии к посту на одном шарде для быстрого чтения. Master-Slave: масштабирование чтения.',
  },
]

const dbOptions: DbType[] = ['PostgreSQL', 'MongoDB', 'Cassandra', 'Redis']
const shardKeyOptions: ShardKey[] = ['user_id', 'post_id', 'date', 'region', 'none']
const replicationOptions: ReplicationType[] = ['Master-Slave', 'Master-Master', 'None']

type Grade = 'correct' | 'partial' | 'wrong'

function gradeChoice(choice: EntityChoice, reference: EntityChoice): { grade: Grade; feedback: string } {
  let score = 0
  const issues: string[] = []

  if (choice.db === reference.db) {
    score += 2
  } else {
    issues.push(`Тип БД: лучше ${reference.db}`)
  }

  if (choice.shardKey === reference.shardKey) {
    score += 1
  } else if (choice.shardKey !== 'none') {
    score += 0.5
    issues.push(`Sharding key: лучше ${reference.shardKey}`)
  } else {
    issues.push(`Sharding key: стоит шардировать по ${reference.shardKey}`)
  }

  if (choice.replication === reference.replication) {
    score += 1
  } else if (choice.replication !== 'None') {
    score += 0.5
    issues.push(`Replication: лучше ${reference.replication}`)
  } else {
    issues.push(`Replication: стоит использовать ${reference.replication}`)
  }

  if (score >= 3.5) return { grade: 'correct', feedback: 'Отличный выбор!' }
  if (score >= 2) return { grade: 'partial', feedback: issues.join('. ') + '.' }
  return { grade: 'wrong', feedback: issues.join('. ') + '.' }
}

const gradeColors: Record<Grade, { bg: string; text: string; label: string }> = {
  correct: { bg: '#e8f5e9', text: '#2e7d32', label: 'Верно' },
  partial: { bg: '#fff3e0', text: '#e65100', label: 'Частично' },
  wrong: { bg: '#fce4ec', text: '#c62828', label: 'Неверно' },
}

export function Task4_4_Solution() {
  const [choices, setChoices] = useState<EntityChoice[]>(
    entities.map(() => ({ db: 'PostgreSQL', shardKey: 'none', replication: 'None' }))
  )
  const [checked, setChecked] = useState(false)
  const [showReference, setShowReference] = useState(false)

  const updateChoice = (index: number, field: keyof EntityChoice, value: string) => {
    setChoices((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
    setChecked(false)
    setShowReference(false)
  }

  const results = checked
    ? entities.map((e, i) => gradeChoice(choices[i], e.reference))
    : null

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Схема хранения для соцсети</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Для каждой сущности выберите тип БД, ключ шардирования и стратегию репликации.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Сущность</th>
              <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Тип БД</th>
              <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Sharding Key</th>
              <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Replication</th>
              {results && <th style={{ padding: '0.5rem', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Оценка</th>}
            </tr>
          </thead>
          <tbody>
            {entities.map((entity, i) => {
              const result = results ? results[i] : null
              const rowBg = result ? gradeColors[result.grade].bg : 'white'
              return (
                <tr key={entity.name} style={{ background: rowBg }}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                    <strong>{entity.name}</strong>
                    <br />
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>{entity.description}</span>
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                    <select
                      value={choices[i].db}
                      onChange={(e) => updateChoice(i, 'db', e.target.value)}
                      style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      {dbOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                    <select
                      value={choices[i].shardKey}
                      onChange={(e) => updateChoice(i, 'shardKey', e.target.value)}
                      style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      {shardKeyOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                    <select
                      value={choices[i].replication}
                      onChange={(e) => updateChoice(i, 'replication', e.target.value)}
                      style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      {replicationOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  {result && (
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        background: gradeColors[result.grade].bg,
                        color: gradeColors[result.grade].text,
                        border: `1px solid ${gradeColors[result.grade].text}`,
                      }}>
                        {gradeColors[result.grade].label}
                      </span>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#666' }}>
                        {result.feedback}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setChecked(true)}
          style={{
            padding: '0.5rem 1.5rem',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Проверить
        </button>
        <button
          onClick={() => setShowReference(!showReference)}
          style={{
            padding: '0.5rem 1.5rem',
            background: showReference ? '#e65100' : '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {showReference ? 'Скрыть эталон' : 'Показать эталон'}
        </button>
        <button
          onClick={() => {
            setChoices(entities.map(() => ({ db: 'PostgreSQL', shardKey: 'none', replication: 'None' })))
            setChecked(false)
            setShowReference(false)
          }}
          style={{
            padding: '0.5rem 1.5rem',
            background: '#e0e0e0',
            color: '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Сбросить
        </button>
      </div>

      {showReference && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Эталонное решение</h3>
          {entities.map((entity) => (
            <div
              key={entity.name}
              style={{
                padding: '1rem',
                marginBottom: '0.75rem',
                background: '#e3f2fd',
                borderRadius: '8px',
                borderLeft: '4px solid #1976d2',
              }}
            >
              <strong>{entity.name}</strong>: {entity.reference.db} / shard by {entity.reference.shardKey} / {entity.reference.replication}
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#444' }}>
                {entity.referenceExplanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
