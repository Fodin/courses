import { useState, useCallback } from 'react'

// ============================================
// Задание 13.1: Справочная карточка — News Feed
// ============================================

export function Task13_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>News Feed System (Twitter/Instagram) — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Fan-out on Write (Push)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Принцип</strong>: при публикации поста — сразу записать postId в ленту каждого подписчика (Redis list).
            <br /><br />
            <strong>Плюсы</strong>: чтение ленты мгновенное (O(1) — готовый список), простая пагинация.
            <br /><br />
            <strong>Минусы</strong>: write amplification (N записей на 1 пост), расход памяти, задержка для селебрити.
            <br /><br />
            <strong>Подходит</strong>: для обычных пользователей ({'<'} 10K followers).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Fan-out on Read (Pull)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Принцип</strong>: при запросе ленты — собрать посты из каждой подписки и merge-ить.
            <br /><br />
            <strong>Плюсы</strong>: запись моментальная (1 запись), нет дублирования, celebrity-friendly.
            <br /><br />
            <strong>Минусы</strong>: чтение медленное (300 подписок = 300 запросов + merge), сложная пагинация.
            <br /><br />
            <strong>Подходит</strong>: для селебрити ({'>'}10K followers).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Hybrid-подход</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Push для обычных</strong>: {'<'} 10K followers — fan-out on write при публикации.
            <br /><br />
            <strong>Pull для селебрити</strong>: {'>'} 10K followers — посты только в Posts DB, подтягиваются при чтении.
            <br /><br />
            <strong>При чтении</strong>: merge кешированных postId (push) + свежих постов от селебрити (pull).
            <br /><br />
            <strong>Используют</strong>: Twitter, Instagram, Facebook.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Feed Ranking Pipeline</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>1. Retrieval</strong> — отобрать 1000+ кандидатов из подписок.
            <br /><br />
            <strong>2. Scoring</strong> — ML-модель: freshness (30%) + affinity (40%) + engagement (20%) + content type (10%).
            <br /><br />
            <strong>3. Filtering</strong> — убрать spam, blocked, уже просмотренные.
            <br /><br />
            <strong>4. Diversification</strong> — не 10 постов от одного автора подряд.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Social Graph</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Graph DB</strong> (Neo4j/TAO) — для графовых запросов: friends of friends, рекомендации.
            <br /><br />
            <strong>Redis cache</strong> — для горячих данных: is_following, followers count, список followers.
            <br /><br />
            <strong>Sharding</strong> — по followeeId: все followers одного user на одном шарде.
            <br /><br />
            <strong>Hot spots</strong> — chunked followers list для селебрити (50M followers).
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Feed Caching</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Feed cache</strong> — Redis list с postId per user (не полные посты!).
            <br /><br />
            <strong>Post cache</strong> — отдельный ключ post:{'{'}id{'}'} для дедупликации.
            <br /><br />
            <strong>Инвалидация</strong> — инкрементальная (lpush нового postId) + TTL 5 мин fallback.
            <br /><br />
            <strong>Многослойный</strong>: CDN (media) → Redis (feed, posts) → MySQL (source of truth).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 13.2: Fan-out калькулятор
// ============================================

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toFixed(0)
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_099_511_627_776) return (bytes / 1_099_511_627_776).toFixed(1) + ' TB'
  if (bytes >= 1_073_741_824) return (bytes / 1_073_741_824).toFixed(1) + ' GB'
  if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

function formatDuration(seconds: number): string {
  if (seconds >= 3600) return (seconds / 3600).toFixed(1) + ' ч'
  if (seconds >= 60) return (seconds / 60).toFixed(1) + ' мин'
  if (seconds >= 1) return seconds.toFixed(1) + ' сек'
  return (seconds * 1000).toFixed(0) + ' мс'
}

export function Task13_2_Solution() {
  const [avgFollowers, setAvgFollowers] = useState(500)
  const [postRate, setPostRate] = useState(6000)
  const [celebrityThreshold, setCelebrityThreshold] = useState(10000)

  const AVG_FOLLOWING = 300
  const FEED_READS_PER_SEC = 36000
  const REDIS_OPS_PER_SEC = 100000
  const POST_ID_SIZE = 8
  const TOTAL_USERS = 500_000_000
  const FEED_SIZE = 1000

  // Push calculations
  const pushWriteOps = postRate * avgFollowers
  const pushReadOps = FEED_READS_PER_SEC
  const pushTotalOps = pushWriteOps + pushReadOps
  const pushStoragePerUser = FEED_SIZE * POST_ID_SIZE
  const pushTotalStorage = TOTAL_USERS * pushStoragePerUser
  const pushLatencyWrite = avgFollowers / REDIS_OPS_PER_SEC
  const pushLatencyRead = 0.001

  // Pull calculations
  const pullWriteOps = postRate
  const pullReadOps = FEED_READS_PER_SEC * AVG_FOLLOWING
  const pullTotalOps = pullWriteOps + pullReadOps
  const pullStoragePerUser = 0
  const pullTotalStorage = 0
  const pullLatencyWrite = 0.001
  const pullLatencyRead = AVG_FOLLOWING * 0.001

  // Crossover point
  const crossoverFollowers = Math.round(FEED_READS_PER_SEC * AVG_FOLLOWING / postRate)

  // Hybrid calculations
  const regularUserRatio = celebrityThreshold < avgFollowers ? 0.5 : 0.95
  const hybridPushOps = postRate * regularUserRatio * Math.min(avgFollowers, celebrityThreshold)
  const celebrityFollowingPerUser = Math.round(AVG_FOLLOWING * (1 - regularUserRatio))
  const hybridPullOps = FEED_READS_PER_SEC * Math.max(celebrityFollowingPerUser, 5)
  const hybridTotalOps = hybridPushOps + hybridPullOps + FEED_READS_PER_SEC
  const hybridSavingsVsPush = pushTotalOps > 0 ? ((pushTotalOps - hybridTotalOps) / pushTotalOps * 100) : 0

  const betterWrite = pushWriteOps <= pullWriteOps ? 'push' : 'pull'
  const betterRead = pushReadOps <= pullReadOps ? 'push' : 'pull'
  const betterTotal = pushTotalOps <= pullTotalOps ? 'push' : 'pull'

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Fan-out калькулятор: Push vs Pull vs Hybrid</h2>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Avg Followers: {formatNumber(avgFollowers)}
          </label>
          <input
            type="range"
            min={100}
            max={1000000}
            step={100}
            value={avgFollowers}
            onChange={e => setAvgFollowers(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888' }}>
            <span>100</span><span>1M</span>
          </div>
        </div>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Post Rate: {formatNumber(postRate)} posts/sec
          </label>
          <input
            type="range"
            min={1000}
            max={100000}
            step={500}
            value={postRate}
            onChange={e => setPostRate(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888' }}>
            <span>1K</span><span>100K</span>
          </div>
        </div>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
            Celebrity Threshold: {formatNumber(celebrityThreshold)}
          </label>
          <input
            type="range"
            min={1000}
            max={100000}
            step={1000}
            value={celebrityThreshold}
            onChange={e => setCelebrityThreshold(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888' }}>
            <span>1K</span><span>100K</span>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>Сравнение подходов</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#e0e0e0' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ccc' }}>Метрика</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ccc' }}>Push (Fan-out on Write)</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ccc' }}>Pull (Fan-out on Read)</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ccc' }}>Hybrid</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', fontWeight: 'bold' }}>Write ops/sec</td>
              <td style={{
                padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center',
                background: betterWrite === 'push' ? '#e8f5e9' : '#ffebee',
              }}>
                {formatNumber(pushWriteOps)}
              </td>
              <td style={{
                padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center',
                background: betterWrite === 'pull' ? '#e8f5e9' : '#ffebee',
              }}>
                {formatNumber(pullWriteOps)}
              </td>
              <td style={{
                padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center',
                background: '#e3f2fd',
              }}>
                {formatNumber(hybridPushOps)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', fontWeight: 'bold' }}>Read ops/sec</td>
              <td style={{
                padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center',
                background: betterRead === 'push' ? '#e8f5e9' : '#ffebee',
              }}>
                {formatNumber(pushReadOps)}
              </td>
              <td style={{
                padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center',
                background: betterRead === 'pull' ? '#e8f5e9' : '#ffebee',
              }}>
                {formatNumber(pullReadOps)}
              </td>
              <td style={{
                padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center',
                background: '#e3f2fd',
              }}>
                {formatNumber(hybridPullOps + FEED_READS_PER_SEC)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', fontWeight: 'bold' }}>Total ops/sec</td>
              <td style={{
                padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center',
                fontWeight: 'bold',
                background: betterTotal === 'push' ? '#c8e6c9' : '#ffcdd2',
              }}>
                {formatNumber(pushTotalOps)}
              </td>
              <td style={{
                padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center',
                fontWeight: 'bold',
                background: betterTotal === 'pull' ? '#c8e6c9' : '#ffcdd2',
              }}>
                {formatNumber(pullTotalOps)}
              </td>
              <td style={{
                padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center',
                fontWeight: 'bold',
                background: '#bbdefb',
              }}>
                {formatNumber(hybridTotalOps)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', fontWeight: 'bold' }}>Write latency</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center' }}>
                {formatDuration(pushLatencyWrite)}
              </td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center' }}>
                {formatDuration(pullLatencyWrite)}
              </td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center' }}>
                {formatDuration(Math.min(celebrityThreshold, avgFollowers) / REDIS_OPS_PER_SEC)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', fontWeight: 'bold' }}>Read latency</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center' }}>
                {formatDuration(pushLatencyRead)}
              </td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center' }}>
                {formatDuration(pullLatencyRead)}
              </td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center' }}>
                {formatDuration(0.001 + Math.max(celebrityFollowingPerUser, 5) * 0.001)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', fontWeight: 'bold' }}>Storage (feed cache)</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center' }}>
                {formatBytes(pushTotalStorage)}
              </td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center' }}>
                0 (no cache)
              </td>
              <td style={{ padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center' }}>
                {formatBytes(pushTotalStorage * regularUserRatio)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Crossover point & Hybrid savings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Crossover Point</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Push становится дороже Pull при <strong>{formatNumber(crossoverFollowers)} followers</strong>.
            <br /><br />
            При текущих {formatNumber(avgFollowers)} followers —{' '}
            <strong style={{ color: avgFollowers < crossoverFollowers ? '#4caf50' : '#f44336' }}>
              {avgFollowers < crossoverFollowers ? 'Push выгоднее' : 'Pull выгоднее'}
            </strong>.
            <br /><br />
            <span style={{ fontSize: '0.8rem', color: '#666' }}>
              Формула: crossover = feed_reads/sec x avg_following / post_rate
              = {formatNumber(FEED_READS_PER_SEC)} x {AVG_FOLLOWING} / {formatNumber(postRate)}
              = {formatNumber(crossoverFollowers)}
            </span>
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Hybrid экономия</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Celebrity threshold: <strong>{formatNumber(celebrityThreshold)}</strong>
            <br /><br />
            Hybrid total ops: <strong>{formatNumber(hybridTotalOps)}</strong>
            <br />
            vs Pure Push: <strong>{formatNumber(pushTotalOps)}</strong>
            <br /><br />
            Экономия: <strong style={{ color: hybridSavingsVsPush > 0 ? '#4caf50' : '#f44336' }}>
              {hybridSavingsVsPush > 0 ? '+' : ''}{hybridSavingsVsPush.toFixed(1)}%
            </strong> меньше операций, чем чистый Push.
            <br /><br />
            <span style={{ fontSize: '0.8rem', color: '#666' }}>
              ~{(regularUserRatio * 100).toFixed(0)}% пользователей обслуживаются Push,
              ~{((1 - regularUserRatio) * 100).toFixed(0)}% — Pull
            </span>
          </p>
        </div>
      </div>

      {/* Visual bar chart */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 0.75rem' }}>Total ops/sec (визуализация)</h4>
        {(() => {
          const maxOps = Math.max(pushTotalOps, pullTotalOps, hybridTotalOps)
          const items = [
            { label: 'Push', value: pushTotalOps, color: '#ef5350' },
            { label: 'Pull', value: pullTotalOps, color: '#42a5f5' },
            { label: 'Hybrid', value: hybridTotalOps, color: '#66bb6a' },
          ]
          return items.map(item => (
            <div key={item.label} style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '50px', fontWeight: 'bold', fontSize: '0.85rem' }}>{item.label}</span>
                <div style={{
                  flex: 1,
                  background: '#e0e0e0',
                  borderRadius: '4px',
                  height: '24px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${Math.max(1, (item.value / maxOps) * 100)}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '0.5rem',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    minWidth: '60px',
                  }}>
                    {formatNumber(item.value)}
                  </div>
                </div>
              </div>
            </div>
          ))
        })()}
      </div>
    </div>
  )
}

// ============================================
// Задание 13.3: Проектирование социального графа
// ============================================

interface GraphEntity {
  name: string
  fields: string[]
  dbChoice: string
  shardingKey: string
  description: string
}

interface GraphAnswer {
  entityIndex: number
  selectedDb: string
  selectedSharding: string
}

const GRAPH_ENTITIES: GraphEntity[] = [
  {
    name: 'follows',
    fields: ['followerId: string', 'followeeId: string', 'createdAt: timestamp'],
    dbChoice: 'Graph DB (Neo4j/TAO)',
    shardingKey: 'followeeId',
    description: 'Связь "подписан на". Основной запрос: getFollowers(userId) — все подписчики конкретного пользователя.',
  },
  {
    name: 'blocks',
    fields: ['blockerId: string', 'blockedId: string', 'createdAt: timestamp'],
    dbChoice: 'Graph DB (Neo4j/TAO)',
    shardingKey: 'blockerId',
    description: 'Связь "заблокировал". Основной запрос: isBlocked(blockerId, blockedId) — проверка при показе ленты.',
  },
  {
    name: 'user_stats',
    fields: ['userId: string', 'followersCount: number', 'followingCount: number', 'postsCount: number'],
    dbChoice: 'Redis + MySQL',
    shardingKey: 'userId',
    description: 'Счётчики пользователя. Redis для горячих данных (отображение профиля), MySQL как source of truth.',
  },
  {
    name: 'recommendations_cache',
    fields: ['userId: string', 'recommendedIds: string[]', 'score: number[]', 'updatedAt: timestamp'],
    dbChoice: 'Redis',
    shardingKey: 'userId',
    description: 'Кеш рекомендаций подписок. Пересчитывается периодически (раз в час) на основе графовых запросов (friends of friends).',
  },
]

const DB_OPTIONS = ['Graph DB (Neo4j/TAO)', 'Redis', 'Redis + MySQL', 'PostgreSQL', 'Cassandra', 'MongoDB']
const SHARDING_OPTIONS = ['followerId', 'followeeId', 'blockerId', 'blockedId', 'userId', 'chatId']

export function Task13_3_Solution() {
  const [answers, setAnswers] = useState<GraphAnswer[]>(
    GRAPH_ENTITIES.map((_, i) => ({ entityIndex: i, selectedDb: '', selectedSharding: '' }))
  )
  const [checked, setChecked] = useState(false)
  const [showHints, setShowHints] = useState(false)

  const updateAnswer = useCallback((index: number, field: 'selectedDb' | 'selectedSharding', value: string) => {
    setAnswers(prev => prev.map((a, i) =>
      i === index ? { ...a, [field]: value } : a
    ))
    setChecked(false)
  }, [])

  const checkAnswers = useCallback(() => {
    setChecked(true)
  }, [])

  const resetAll = useCallback(() => {
    setAnswers(GRAPH_ENTITIES.map((_, i) => ({ entityIndex: i, selectedDb: '', selectedSharding: '' })))
    setChecked(false)
    setShowHints(false)
  }, [])

  const correctCount = checked
    ? answers.filter((a, i) =>
        a.selectedDb === GRAPH_ENTITIES[i].dbChoice &&
        a.selectedSharding === GRAPH_ENTITIES[i].shardingKey
      ).length
    : 0

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Проектирование социального графа</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Для каждой сущности выберите подходящую БД и ключ шардирования. Затем нажмите «Проверить».
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={checkAnswers}
          style={{
            padding: '0.5rem 1.5rem', borderRadius: '6px', border: 'none',
            background: '#4caf50', color: 'white', cursor: 'pointer', fontWeight: 'bold',
          }}
        >
          Проверить
        </button>
        <button
          onClick={() => setShowHints(!showHints)}
          style={{
            padding: '0.5rem 1.5rem', borderRadius: '6px', border: '1px solid #2196f3',
            background: 'white', color: '#2196f3', cursor: 'pointer',
          }}
        >
          {showHints ? 'Скрыть подсказки' : 'Показать подсказки'}
        </button>
        <button
          onClick={resetAll}
          style={{
            padding: '0.5rem 1.5rem', borderRadius: '6px', border: '1px solid #999',
            background: 'white', color: '#666', cursor: 'pointer',
          }}
        >
          Сбросить
        </button>
      </div>

      {checked && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem',
          background: correctCount === GRAPH_ENTITIES.length ? '#e8f5e9' : '#fff3e0',
          border: `1px solid ${correctCount === GRAPH_ENTITIES.length ? '#4caf50' : '#ff9800'}`,
        }}>
          Правильных: <strong>{correctCount}</strong> из <strong>{GRAPH_ENTITIES.length}</strong>
          {correctCount === GRAPH_ENTITIES.length && ' — Отлично! Все ответы верны!'}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {GRAPH_ENTITIES.map((entity, index) => {
          const answer = answers[index]
          const isDbCorrect = checked && answer.selectedDb === entity.dbChoice
          const isShardCorrect = checked && answer.selectedSharding === entity.shardingKey
          const isDbWrong = checked && answer.selectedDb !== '' && answer.selectedDb !== entity.dbChoice
          const isShardWrong = checked && answer.selectedSharding !== '' && answer.selectedSharding !== entity.shardingKey

          return (
            <div
              key={entity.name}
              style={{
                padding: '1rem', borderRadius: '8px',
                border: `2px solid ${checked ? (isDbCorrect && isShardCorrect ? '#4caf50' : '#ff9800') : '#e0e0e0'}`,
                background: checked ? (isDbCorrect && isShardCorrect ? '#f1f8e9' : '#fff8e1') : 'white',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem' }}>{entity.name}</h4>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#666' }}>
                    {entity.description}
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                    Поля: {entity.fields.join(' | ')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
                    БД {isDbCorrect && ' ✅'}{isDbWrong && ' ❌'}
                  </label>
                  <select
                    value={answer.selectedDb}
                    onChange={e => updateAnswer(index, 'selectedDb', e.target.value)}
                    style={{
                      width: '100%', padding: '0.5rem', borderRadius: '4px',
                      border: `1px solid ${isDbCorrect ? '#4caf50' : isDbWrong ? '#f44336' : '#ccc'}`,
                      background: isDbCorrect ? '#e8f5e9' : isDbWrong ? '#ffebee' : 'white',
                    }}
                  >
                    <option value="">Выберите БД...</option>
                    {DB_OPTIONS.map(db => (
                      <option key={db} value={db}>{db}</option>
                    ))}
                  </select>
                  {isDbWrong && (
                    <div style={{ fontSize: '0.8rem', color: '#f44336', marginTop: '0.25rem' }}>
                      Правильно: {entity.dbChoice}
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
                    Sharding Key {isShardCorrect && ' ✅'}{isShardWrong && ' ❌'}
                  </label>
                  <select
                    value={answer.selectedSharding}
                    onChange={e => updateAnswer(index, 'selectedSharding', e.target.value)}
                    style={{
                      width: '100%', padding: '0.5rem', borderRadius: '4px',
                      border: `1px solid ${isShardCorrect ? '#4caf50' : isShardWrong ? '#f44336' : '#ccc'}`,
                      background: isShardCorrect ? '#e8f5e9' : isShardWrong ? '#ffebee' : 'white',
                    }}
                  >
                    <option value="">Выберите ключ...</option>
                    {SHARDING_OPTIONS.map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                  {isShardWrong && (
                    <div style={{ fontSize: '0.8rem', color: '#f44336', marginTop: '0.25rem' }}>
                      Правильно: {entity.shardingKey}
                    </div>
                  )}
                </div>
              </div>

              {showHints && (
                <div style={{
                  marginTop: '0.5rem', padding: '0.5rem',
                  background: '#e3f2fd', borderRadius: '4px', fontSize: '0.8rem',
                }}>
                  <strong>Подсказка:</strong> Основной запрос к этой сущности —{' '}
                  {entity.name === 'follows' && 'getFollowers(userId), т.е. «кто подписан на X». Какой ключ позволит получить всех followers за один запрос к одному шарду?'}
                  {entity.name === 'blocks' && 'isBlocked(blockerId, blockedId) и getBlocked(blockerId). Кто инициирует блокировку — по тому и шардируем.'}
                  {entity.name === 'user_stats' && 'getStats(userId). Счётчики привязаны к пользователю. Нужна и скорость (Redis), и надёжность (MySQL).'}
                  {entity.name === 'recommendations_cache' && 'getRecommendations(userId). Кеш привязан к пользователю, пересчитывается асинхронно.'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Reference: Key queries */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 0.5rem' }}>Основные запросы к социальному графу</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#e0e0e0' }}>
              <th style={{ padding: '0.4rem', textAlign: 'left', border: '1px solid #ccc' }}>Запрос</th>
              <th style={{ padding: '0.4rem', textAlign: 'left', border: '1px solid #ccc' }}>Источник</th>
              <th style={{ padding: '0.4rem', textAlign: 'left', border: '1px solid #ccc' }}>Сложность</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['getFollowers(userId)', 'Graph DB (sharded by followeeId)', 'O(N) — один шард'],
              ['getFollowing(userId)', 'Graph DB (scatter-gather по followerId)', 'O(N) — несколько шардов'],
              ['isFollowing(A, B)', 'Redis cache (SET following:A)', 'O(1)'],
              ['mutualFollowers(A, B)', 'Graph DB traversal', 'O(N) — intersection'],
              ['recommendFollows(userId)', 'Graph DB (friends of friends)', 'O(N^2) — кешировать!'],
              ['getFollowersCount(userId)', 'Redis (counter)', 'O(1)'],
            ].map(([query, source, complexity]) => (
              <tr key={query}>
                <td style={{ padding: '0.4rem', border: '1px solid #ccc', fontFamily: 'monospace' }}>{query}</td>
                <td style={{ padding: '0.4rem', border: '1px solid #ccc' }}>{source}</td>
                <td style={{ padding: '0.4rem', border: '1px solid #ccc' }}>{complexity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// Задание 13.4: Полный дизайн News Feed
// ============================================

interface DesignSection {
  title: string
  icon: string
  items: { label: string; detail: string }[]
}

const DESIGN_SECTIONS: DesignSection[] = [
  {
    title: 'Requirements',
    icon: '📋',
    items: [
      { label: 'FR1: Публикация поста', detail: 'Текст, фото, видео. Pre-signed URL для медиа → S3 напрямую.' },
      { label: 'FR2: Персональная лента', detail: 'Посты от подписок, отсортированные по relevance или хронологии.' },
      { label: 'FR3: Follow/Unfollow', detail: 'Управление подписками. При unfollow — удалить посты из кешированной ленты.' },
      { label: 'FR4: Feed Ranking', detail: 'Хронологический (reverse chronological) и алгоритмический режимы.' },
      { label: 'FR5: Infinite Scroll', detail: 'Cursor-based пагинация (postId), не offset-based.' },
      { label: 'NFR: Задержка < 200 мс', detail: 'Лента загружается из кеша. Cache miss — rebuild за < 500 мс.' },
      { label: 'NFR: DAU 200M, QPS 36K read', detail: '200M DAU × 5 открытий/день / 86400 = 12K RPS, пик × 3 = 36K RPS.' },
      { label: 'NFR: Eventual consistency', detail: 'Пост может появиться в лентах с задержкой 1-5 сек — приемлемо.' },
    ],
  },
  {
    title: 'Fan-out Strategy',
    icon: '🔄',
    items: [
      { label: 'Push (< 10K followers)', detail: 'При публикации → Kafka → Fan-out Service → lpush postId в Redis-ленту каждого follower. Быстрое чтение.' },
      { label: 'Pull (> 10K followers)', detail: 'Пост только в Posts DB. При чтении ленты — запросить последние посты от каждого celebrity. Merge с cached feed.' },
      { label: 'Hybrid merge', detail: 'getFeed(): cached push postIds + fresh pull posts from celebrities → rank → paginate.' },
      { label: 'Celebrity threshold', detail: '~10K followers. Ниже — push (10K записей = 100 мс). Выше — pull (100K+ записей = секунды).' },
      { label: 'Fan-out async via Kafka', detail: 'Post Service → Kafka (partition by authorId) → Fan-out workers → Redis. Не блокирует публикацию.' },
      { label: 'Feed cache: Redis list', detail: 'Ключ feed:{userId}, хранит до 1000 postId. LPUSH + LTRIM. TTL 5 минут fallback.' },
    ],
  },
  {
    title: 'Social Graph',
    icon: '👥',
    items: [
      { label: 'Graph DB (Neo4j/TAO)', detail: 'Хранение связей follows/blocks. Графовые запросы: friends of friends, mutual followers, рекомендации.' },
      { label: 'Redis cache', detail: 'SET following:{userId} — для быстрого isFollowing() check. Counter followers_count:{userId}.' },
      { label: 'Sharding by followeeId', detail: 'Все followers одного user на одном шарде. getFollowers() — один шард, getFollowing() — scatter-gather (реже нужен).' },
      { label: 'Hot spots: chunked lists', detail: 'Селебрити: followers:elon:chunk:1..N. Fan-out читает chunks параллельно с разных шардов.' },
      { label: 'Recommendations', detail: 'Friends of friends через Graph DB traversal. Кешировать в Redis, пересчитывать раз в час.' },
    ],
  },
  {
    title: 'Feed Ranking Pipeline',
    icon: '🧠',
    items: [
      { label: '1. Retrieval', detail: 'Отобрать 1000+ кандидатов: cached feed (push) + celebrity posts (pull) + ads.' },
      { label: '2. Scoring (ML-модель)', detail: 'Факторы: freshness (30%), affinity (40%), engagement (20%), content type (10%). TensorFlow Serving.' },
      { label: '3. Filtering', detail: 'Убрать: spam, blocked authors, уже просмотренные (bloom filter), дубли.' },
      { label: '4. Diversification', detail: 'Не более 2 постов подряд от одного автора. Чередовать типы контента (фото, текст, видео).' },
      { label: 'Caching scored feed', detail: 'Результат ранжирования кешируется. При scroll — пагинация по готовому списку. Пересчёт по TTL или событию.' },
      { label: 'Инкрементальное обновление', detail: 'Новый пост → вставить в scored list по score, не пересчитывать всё.' },
    ],
  },
  {
    title: 'Architecture & Storage',
    icon: '🏗️',
    items: [
      { label: 'API Gateway → Feed Service', detail: 'getFeed(userId, cursor, limit). Feed Service: merge cached + celebrity + rank.' },
      { label: 'Post Service → Kafka → Fan-out', detail: 'Публикация → сохранить в MySQL → Kafka event → Fan-out workers → Redis feeds.' },
      { label: 'Posts DB: MySQL (sharded)', detail: 'Sharding по authorId. Все посты автора на одном шарде. Индекс (authorId, createdAt DESC).' },
      { label: 'Feed Cache: Redis Cluster', detail: 'List feed:{userId} с 1000 postId. Отдельный кеш post:{id} для данных поста.' },
      { label: 'Media: S3 + CDN', detail: 'Pre-signed URL upload. Thumbnails через Lambda. CloudFront/Akamai для раздачи.' },
      { label: 'Ranking: TensorFlow Serving', detail: 'ML-модель scoring. Batch inference. Feature store для user/post features.' },
    ],
  },
  {
    title: 'Scaling & Reliability',
    icon: '📈',
    items: [
      { label: 'Redis Cluster: 100+ nodes', detail: 'Sharding feed cache по userId. ~4 TB для 500M users × 1000 postId × 8 bytes.' },
      { label: 'Kafka: 1000+ partitions', detail: 'Fan-out events partitioned by authorId. Consumer groups для параллельной обработки.' },
      { label: 'Fan-out workers: auto-scale', detail: 'При пиковой нагрузке (celebrity post) — scale up workers. Backpressure через Kafka lag.' },
      { label: 'Circuit breaker on Ranking', detail: 'Если ML-модель медленная → fallback на хронологическую сортировку. Graceful degradation.' },
      { label: 'Cache warming', detail: 'При cache miss — async rebuild feed. Показать stale cached version пока строится новая.' },
      { label: 'Monitoring', detail: 'Feed latency P99, fan-out lag, cache hit ratio, ranking model latency. Alert на аномалии.' },
    ],
  },
]

export function Task13_4_Solution() {
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({ 0: true })

  const toggleSection = useCallback((index: number) => {
    setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }))
  }, [])

  const expandAll = useCallback(() => {
    const all: Record<number, boolean> = {}
    DESIGN_SECTIONS.forEach((_, i) => { all[i] = true })
    setExpandedSections(all)
  }, [])

  const collapseAll = useCallback(() => {
    setExpandedSections({})
  }, [])

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Полный дизайн: News Feed System</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Раскройте каждую секцию для детального описания. Используйте как reference при подготовке к System Design интервью.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={expandAll}
          style={{
            padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #2196f3',
            background: 'white', color: '#2196f3', cursor: 'pointer', fontSize: '0.85rem',
          }}
        >
          Раскрыть все
        </button>
        <button
          onClick={collapseAll}
          style={{
            padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #999',
            background: 'white', color: '#666', cursor: 'pointer', fontSize: '0.85rem',
          }}
        >
          Свернуть все
        </button>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {DESIGN_SECTIONS.map((section, sectionIndex) => {
          const isExpanded = expandedSections[sectionIndex] ?? false

          return (
            <div
              key={section.title}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => toggleSection(sectionIndex)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isExpanded ? '#f5f5f5' : 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}
              >
                <span>{section.icon} {section.title}</span>
                <span style={{ fontSize: '1.2rem', color: '#666' }}>
                  {isExpanded ? '▾' : '▸'}
                </span>
              </button>

              {isExpanded && (
                <div style={{ padding: '0 1rem 1rem' }}>
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      style={{
                        padding: '0.5rem 0',
                        borderBottom: itemIndex < section.items.length - 1 ? '1px solid #f0f0f0' : 'none',
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.4 }}>
                        {item.detail}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Architecture summary */}
      <div style={{
        marginTop: '1.5rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px',
        border: '1px solid #4caf50',
      }}>
        <h4 style={{ margin: '0 0 0.5rem' }}>Ключевые решения (шпаргалка для интервью)</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <tbody>
            {[
              ['Fan-out', 'Hybrid: push (< 10K followers) + pull (celebrities)'],
              ['Feed Cache', 'Redis list с postId per user, TTL 5 мин'],
              ['Social Graph', 'Graph DB + Redis cache, sharding by followeeId'],
              ['Ranking', 'ML pipeline: retrieval → scoring → filtering → diversification'],
              ['Posts DB', 'MySQL sharded by authorId'],
              ['Async', 'Kafka для fan-out, partition by authorId'],
              ['Media', 'S3 + CDN, pre-signed URL upload'],
              ['Pagination', 'Cursor-based (postId), не offset'],
            ].map(([aspect, solution]) => (
              <tr key={aspect}>
                <td style={{ padding: '0.4rem', fontWeight: 'bold', width: '120px', verticalAlign: 'top' }}>
                  {aspect}
                </td>
                <td style={{ padding: '0.4rem' }}>{solution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
