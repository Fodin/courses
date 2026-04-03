import { useState } from 'react'

// ============================================
// Задание 3.1: Справочная карточка по паттернам кэширования
// ============================================

export function Task3_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Кэширование — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Паттерны чтения</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Cache-Aside</strong> — приложение проверяет кэш, при miss идёт в БД и записывает в кэш. Самый популярный.
            <br />
            <strong>Read-Through</strong> — кэш сам ходит в БД при miss. Проще код, но нужна поддержка кэша.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Паттерны записи</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Write-Through</strong> — запись в кэш и синхронно в БД. Надёжно, но медленнее.
            <br />
            <strong>Write-Behind</strong> — запись в кэш, в БД асинхронно. Быстро, но рискованно.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Eviction Policies</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>LRU</strong> — удаляем давно не использованное. Универсальная.
            <br />
            <strong>LFU</strong> — удаляем редко используемое. Для «горячих» ключей.
            <br />
            <strong>FIFO</strong> — удаляем самое старое. Простой сценарий.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Проблемы</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Stampede</strong> — TTL истёк, тысячи запросов в БД. Решение: mutex lock.
            <br />
            <strong>Penetration</strong> — запросы к несуществующим ключам. Решение: кэш null, Bloom Filter.
            <br />
            <strong>Avalanche</strong> — массовая инвалидация. Решение: TTL с jitter.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>HTTP Cache Headers</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Cache-Control: public, max-age=31536000, immutable</strong> — статика на год.
            <br />
            <strong>Cache-Control: private, must-revalidate</strong> — приватные данные + ETag.
            <br />
            <strong>Cache-Control: no-store</strong> — запрет кэширования.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Redis vs Memcached</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Redis</strong> — структуры данных, персистенция, репликация, pub/sub. Выбор по умолчанию.
            <br />
            <strong>Memcached</strong> — только строки, многопоточный. Для простого кэширования огромных объёмов.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 3.2: Симулятор кэша (LRU / LFU / FIFO)
// ============================================

type EvictionPolicy = 'LRU' | 'LFU' | 'FIFO'

interface CacheEntry {
  key: string
  frequency: number
  lastAccess: number
  insertOrder: number
}

interface CacheLogEntry {
  type: 'hit' | 'miss'
  key: string
  evicted: string | null
}

export function Task3_2_Solution() {
  const [policy, setPolicy] = useState<EvictionPolicy>('LRU')
  const [cacheSize] = useState(4)
  const [cache, setCache] = useState<CacheEntry[]>([])
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [log, setLog] = useState<CacheLogEntry[]>([])
  const [customKey, setCustomKey] = useState('')
  const [accessCounter, setAccessCounter] = useState(0)
  const [insertCounter, setInsertCounter] = useState(0)

  const quickKeys = ['A', 'B', 'C', 'D', 'E', 'F']

  const findEvictionTarget = (entries: CacheEntry[]): number => {
    if (entries.length === 0) return -1
    switch (policy) {
      case 'LRU': {
        let minIdx = 0
        for (let i = 1; i < entries.length; i++) {
          if (entries[i].lastAccess < entries[minIdx].lastAccess) minIdx = i
        }
        return minIdx
      }
      case 'LFU': {
        let minIdx = 0
        for (let i = 1; i < entries.length; i++) {
          if (
            entries[i].frequency < entries[minIdx].frequency ||
            (entries[i].frequency === entries[minIdx].frequency &&
              entries[i].lastAccess < entries[minIdx].lastAccess)
          ) {
            minIdx = i
          }
        }
        return minIdx
      }
      case 'FIFO': {
        let minIdx = 0
        for (let i = 1; i < entries.length; i++) {
          if (entries[i].insertOrder < entries[minIdx].insertOrder) minIdx = i
        }
        return minIdx
      }
    }
  }

  const accessKey = (key: string) => {
    if (!key.trim()) return
    const k = key.trim().toUpperCase()
    const newAccess = accessCounter + 1
    setAccessCounter(newAccess)

    setCache(prev => {
      const existing = prev.findIndex(e => e.key === k)
      if (existing !== -1) {
        // HIT
        setHits(h => h + 1)
        const hitEntry: CacheLogEntry = { type: 'hit', key: k, evicted: null }
        setLog(l => [hitEntry, ...l].slice(0, 20))
        return prev.map((e, i) =>
          i === existing
            ? { ...e, frequency: e.frequency + 1, lastAccess: newAccess }
            : e
        )
      }

      // MISS
      setMisses(m => m + 1)
      const newInsert = insertCounter + 1
      setInsertCounter(newInsert)
      const newEntry: CacheEntry = {
        key: k,
        frequency: 1,
        lastAccess: newAccess,
        insertOrder: newInsert,
      }

      if (prev.length < cacheSize) {
        const missEntry: CacheLogEntry = { type: 'miss', key: k, evicted: null }
        setLog(l => [missEntry, ...l].slice(0, 20))
        return [...prev, newEntry]
      }

      const evictIdx = findEvictionTarget(prev)
      const evictedKey = prev[evictIdx].key
      const evictEntry: CacheLogEntry = { type: 'miss', key: k, evicted: evictedKey }
      setLog(l => [evictEntry, ...l].slice(0, 20))
      return prev.map((e, i) => (i === evictIdx ? newEntry : e))
    })
  }

  const reset = () => {
    setCache([])
    setHits(0)
    setMisses(0)
    setLog([])
    setAccessCounter(0)
    setInsertCounter(0)
  }

  const switchPolicy = (p: EvictionPolicy) => {
    setPolicy(p)
    reset()
  }

  const total = hits + misses
  const hitRatio = total > 0 ? ((hits / total) * 100).toFixed(1) : '—'

  const policyDescriptions: Record<EvictionPolicy, string> = {
    LRU: 'Вытесняет элемент, к которому дольше всего не обращались (Least Recently Used)',
    LFU: 'Вытесняет элемент с наименьшим числом обращений (Least Frequently Used)',
    FIFO: 'Вытесняет элемент, добавленный в кэш раньше всех (First In First Out)',
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Симулятор кэша</h2>

      {/* Policy selector */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>Стратегия вытеснения</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['LRU', 'LFU', 'FIFO'] as EvictionPolicy[]).map(p => (
            <button
              key={p}
              onClick={() => switchPolicy(p)}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${policy === p ? '#1976d2' : '#e0e0e0'}`,
                background: policy === p ? '#1976d2' : 'white',
                color: policy === p ? 'white' : '#333',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#666' }}>
          {policyDescriptions[policy]}
        </p>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Быстрый запрос:</span>
        {quickKeys.map(k => (
          <button
            key={k}
            onClick={() => accessKey(k)}
            style={{
              padding: '0.4rem 0.8rem',
              background: cache.some(e => e.key === k) ? '#c8e6c9' : '#fff',
              border: `1px solid ${cache.some(e => e.key === k) ? '#4caf50' : '#ccc'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.85rem',
            }}
          >
            {k}
          </button>
        ))}
        <span style={{ color: '#999' }}>|</span>
        <input
          type="text"
          value={customKey}
          onChange={e => setCustomKey(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              accessKey(customKey)
              setCustomKey('')
            }
          }}
          placeholder="Свой ключ"
          style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }}
        />
        <button
          onClick={() => { accessKey(customKey); setCustomKey('') }}
          style={{
            padding: '0.4rem 0.8rem',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Запросить
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.4rem 0.8rem',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Сброс
        </button>
      </div>

      {/* Cache visualization */}
      <div style={{
        padding: '1rem',
        background: '#fafafa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        marginBottom: '1rem',
      }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>
          Кэш ({cache.length}/{cacheSize})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cacheSize}, 1fr)`, gap: '0.5rem' }}>
          {Array.from({ length: cacheSize }).map((_, i) => {
            const entry = cache[i]
            const isEvictionTarget =
              cache.length === cacheSize && entry
                ? findEvictionTarget(cache) === i
                : false
            return (
              <div
                key={i}
                style={{
                  padding: '0.75rem',
                  background: entry
                    ? isEvictionTarget
                      ? '#ffebee'
                      : '#e8f5e9'
                    : '#f5f5f5',
                  border: `2px solid ${
                    entry
                      ? isEvictionTarget
                        ? '#ef5350'
                        : '#66bb6a'
                      : '#e0e0e0'
                  }`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  minHeight: '80px',
                }}
              >
                {entry ? (
                  <>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {entry.key}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>
                      {policy === 'LFU' && (
                        <div>Частота: <strong>{entry.frequency}</strong></div>
                      )}
                      {policy === 'LRU' && (
                        <div>Последний доступ: <strong>#{entry.lastAccess}</strong></div>
                      )}
                      {policy === 'FIFO' && (
                        <div>Порядок: <strong>#{entry.insertOrder}</strong></div>
                      )}
                    </div>
                    {isEvictionTarget && (
                      <div style={{ fontSize: '0.7rem', color: '#ef5350', fontWeight: 'bold', marginTop: '0.25rem' }}>
                        Будет вытеснен
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ color: '#bbb', fontSize: '0.85rem', marginTop: '1rem' }}>Пусто</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>Hits</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#388e3c' }}>{hits}</div>
        </div>
        <div style={{ padding: '1rem', background: '#ffebee', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>Misses</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d32f2f' }}>{misses}</div>
        </div>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>Hit Ratio</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2' }}>{hitRatio}%</div>
        </div>
      </div>

      {/* Log */}
      <div style={{
        padding: '1rem',
        background: '#263238',
        borderRadius: '8px',
        maxHeight: '200px',
        overflowY: 'auto',
      }}>
        <h4 style={{ margin: '0 0 0.5rem', color: '#b0bec5', fontSize: '0.8rem' }}>Лог операций</h4>
        {log.length === 0 ? (
          <div style={{ color: '#78909c', fontSize: '0.8rem' }}>Пока нет операций...</div>
        ) : (
          log.map((entry, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                color: entry.type === 'hit' ? '#66bb6a' : '#ef5350',
                marginBottom: '0.15rem',
              }}
            >
              {entry.type === 'hit'
                ? `HIT:  ${entry.key}`
                : `MISS: ${entry.key}${entry.evicted ? ` → вытеснен ${entry.evicted}` : ' (добавлен в кэш)'}`}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ============================================
// Задание 3.3: Калькулятор кэш-стратегии
// ============================================

interface Recommendation {
  pattern: string
  patternDescription: string
  ttl: string
  stampede: boolean
  stampedeMethod: string
  warming: boolean
  explanation: string
  confidence: number
}

function computeRecommendation(
  readRatio: number,
  staleTolerance: number,
  trafficVolume: number
): Recommendation {
  const isReadHeavy = readRatio >= 70
  const isWriteHeavy = readRatio <= 30
  const isBalanced = !isReadHeavy && !isWriteHeavy
  const lowStale = staleTolerance <= 20
  const highStale = staleTolerance >= 60
  const highTraffic = trafficVolume >= 70

  let pattern = ''
  let patternDescription = ''
  let ttl = ''
  let stampede = false
  let stampedeMethod = ''
  let warming = false
  let explanation = ''
  let confidence = 75

  if (isReadHeavy && highStale) {
    pattern = 'Cache-Aside'
    patternDescription = 'Приложение проверяет кэш, при miss идёт в БД и записывает в кэш'
    ttl = '5-30 минут'
    stampede = highTraffic
    stampedeMethod = highTraffic ? 'Mutex lock + early refresh' : ''
    warming = highTraffic
    explanation =
      'Высокая доля чтений и допустимая устаревшесть — идеальный сценарий для Cache-Aside. ' +
      'Длинный TTL максимизирует hit ratio, а данные не критичны к свежести.'
    confidence = 95
  } else if (isReadHeavy && lowStale) {
    pattern = 'Cache-Aside + Event-based инвалидация'
    patternDescription = 'Cache-Aside с немедленным удалением ключа при изменении данных'
    ttl = '30-60 секунд'
    stampede = highTraffic
    stampedeMethod = highTraffic ? 'Mutex lock' : ''
    warming = true
    explanation =
      'Много чтений, но данные должны быть свежими. Cache-Aside с коротким TTL как подстраховка, ' +
      'а event-based инвалидация при каждой записи гарантирует актуальность.'
    confidence = 85
  } else if (isWriteHeavy && lowStale) {
    pattern = 'Write-Through'
    patternDescription = 'Запись в кэш, кэш синхронно пишет в БД — данные всегда актуальны'
    ttl = '1-5 минут'
    stampede = false
    stampedeMethod = ''
    warming = false
    explanation =
      'Много записей и нулевая толерантность к устаревшим данным — Write-Through гарантирует, ' +
      'что кэш всегда содержит актуальную версию. Записи медленнее, зато консистентность.'
    confidence = 90
  } else if (isWriteHeavy && highStale) {
    pattern = 'Write-Behind (Write-Back)'
    patternDescription = 'Запись в кэш, в БД — асинхронно пачками'
    ttl = '5-15 минут'
    stampede = false
    stampedeMethod = ''
    warming = false
    explanation =
      'Много записей и допустимая задержка — Write-Behind обеспечивает максимальную скорость записи. ' +
      'Данные буферизуются в кэше и отправляются в БД пачками. Риск: потеря данных при сбое кэша.'
    confidence = 80
  } else if (isBalanced && lowStale) {
    pattern = 'Cache-Aside + Write-Through'
    patternDescription = 'Cache-Aside для чтения, Write-Through для записи — баланс скорости и консистентности'
    ttl = '1-3 минуты'
    stampede = highTraffic
    stampedeMethod = highTraffic ? 'Mutex lock' : ''
    warming = true
    explanation =
      'Сбалансированная нагрузка с требованием свежести — комбинация паттернов. ' +
      'Write-Through обновляет кэш при каждой записи, Cache-Aside загружает данные при чтении.'
    confidence = 75
  } else {
    pattern = 'Cache-Aside + Write-Behind'
    patternDescription = 'Cache-Aside для чтения, Write-Behind для быстрой записи'
    ttl = '3-10 минут'
    stampede = highTraffic
    stampedeMethod = highTraffic ? 'Early refresh' : ''
    warming = highTraffic
    explanation =
      'Сбалансированная нагрузка с допустимой устаревшестью — Cache-Aside для чтений, ' +
      'Write-Behind для быстрой буферизованной записи. Хороший компромисс производительности.'
    confidence = 70
  }

  if (highTraffic && !stampede) {
    stampede = true
    stampedeMethod = 'Mutex lock'
  }

  return { pattern, patternDescription, ttl, stampede, stampedeMethod, warming, explanation, confidence }
}

export function Task3_3_Solution() {
  const [readRatio, setReadRatio] = useState(80)
  const [staleTolerance, setStaleTolerance] = useState(50)
  const [trafficVolume, setTrafficVolume] = useState(50)

  const rec = computeRecommendation(readRatio, staleTolerance, trafficVolume)

  const sliderStyle = {
    width: '100%',
    accentColor: '#1976d2',
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Калькулятор кэш-стратегии</h2>

      {/* Sliders */}
      <div style={{
        padding: '1.5rem',
        background: '#fafafa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        marginBottom: '1.5rem',
      }}>
        <h3 style={{ margin: '0 0 1rem' }}>Параметры нагрузки</h3>

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Read / Write ratio</label>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              {readRatio}% чтение / {100 - readRatio}% запись
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={readRatio}
            onChange={e => setReadRatio(Number(e.target.value))}
            style={sliderStyle}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#999' }}>
            <span>100% запись</span>
            <span>сбалансировано</span>
            <span>100% чтение</span>
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Допустимая устаревшесть (Stale tolerance)</label>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              {staleTolerance <= 10
                ? 'Данные всегда свежие'
                : staleTolerance <= 30
                  ? 'Секунды'
                  : staleTolerance <= 60
                    ? 'Минуты'
                    : staleTolerance <= 80
                      ? 'Десятки минут'
                      : 'До часа'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={staleTolerance}
            onChange={e => setStaleTolerance(Number(e.target.value))}
            style={sliderStyle}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#999' }}>
            <span>0 сек (свежие)</span>
            <span>минуты</span>
            <span>до 1 часа</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Объём трафика</label>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              {trafficVolume <= 25
                ? 'Низкий (<100 RPS)'
                : trafficVolume <= 50
                  ? 'Средний (~1K RPS)'
                  : trafficVolume <= 75
                    ? 'Высокий (~10K RPS)'
                    : 'Очень высокий (100K+ RPS)'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={trafficVolume}
            onChange={e => setTrafficVolume(Number(e.target.value))}
            style={sliderStyle}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#999' }}>
            <span>Низкий</span>
            <span>Средний</span>
            <span>Очень высокий</span>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div style={{
        padding: '1.5rem',
        background: '#e3f2fd',
        borderRadius: '8px',
        border: '2px solid #1976d2',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0 }}>Рекомендация</h3>
          <div style={{
            padding: '0.25rem 0.75rem',
            background: rec.confidence >= 85 ? '#4caf50' : rec.confidence >= 70 ? '#ff9800' : '#f44336',
            color: 'white',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}>
            Уверенность: {rec.confidence}%
          </div>
        </div>

        <div style={{
          padding: '1rem',
          background: 'white',
          borderRadius: '8px',
          marginBottom: '1rem',
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1976d2', marginBottom: '0.25rem' }}>
            {rec.pattern}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>{rec.patternDescription}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.15rem' }}>TTL</div>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{rec.ttl}</div>
          </div>
          <div style={{ padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.15rem' }}>Stampede protection</div>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: rec.stampede ? '#e65100' : '#388e3c' }}>
              {rec.stampede ? rec.stampedeMethod : 'Не требуется'}
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.15rem' }}>Cache warming</div>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: rec.warming ? '#e65100' : '#388e3c' }}>
              {rec.warming ? 'Рекомендуется' : 'Не обязательно'}
            </div>
          </div>
          <div style={{ padding: '0.75rem', background: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.15rem' }}>Jitter для TTL</div>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#e65100' }}>
              Всегда рекомендуется
            </div>
          </div>
        </div>

        <div style={{
          padding: '1rem',
          background: '#fff8e1',
          borderRadius: '8px',
          fontSize: '0.85rem',
          lineHeight: 1.6,
        }}>
          <strong>Почему этот паттерн:</strong> {rec.explanation}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 3.4: Многоуровневый кэш для новостного сайта
// ============================================

interface ContentRow {
  type: string
  label: string
  layers: Record<string, boolean>
  ttls: Record<string, string>
  invalidation: string
  stampedeProtection: string
  estimatedHitRatio: number
}

const CACHE_LAYERS = ['Browser', 'CDN', 'Redis', 'DB Query Cache'] as const

const DEFAULT_ROWS: ContentRow[] = [
  {
    type: 'static',
    label: 'Статика (JS/CSS/img)',
    layers: { Browser: true, CDN: true, Redis: false, 'DB Query Cache': false },
    ttls: { Browser: '1 год', CDN: '1 год', Redis: '—', 'DB Query Cache': '—' },
    invalidation: 'Versioned filename (app.a1b2c3.js)',
    stampedeProtection: 'Не нужна',
    estimatedHitRatio: 99,
  },
  {
    type: 'api',
    label: 'API-ответы (статьи, каталог)',
    layers: { Browser: false, CDN: true, Redis: true, 'DB Query Cache': true },
    ttls: { Browser: '—', CDN: '5 мин', Redis: '1 мин', 'DB Query Cache': 'авто' },
    invalidation: 'TTL + event-based (при публикации)',
    stampedeProtection: 'Mutex lock',
    estimatedHitRatio: 92,
  },
  {
    type: 'user',
    label: 'Пользовательский (лента, профиль)',
    layers: { Browser: false, CDN: false, Redis: true, 'DB Query Cache': false },
    ttls: { Browser: '—', CDN: '—', Redis: '30 сек', 'DB Query Cache': '—' },
    invalidation: 'Event-based (при действии пользователя)',
    stampedeProtection: 'Не нужна (персональные данные)',
    estimatedHitRatio: 75,
  },
]

export function Task3_4_Solution() {
  const [rows, setRows] = useState<ContentRow[]>(DEFAULT_ROWS)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)

  const toggleLayer = (rowIdx: number, layer: string) => {
    setRows(prev => prev.map((r, i) => {
      if (i !== rowIdx) return r
      const newLayers = { ...r.layers, [layer]: !r.layers[layer] }
      const newTtls = { ...r.ttls }
      if (!newLayers[layer]) {
        newTtls[layer] = '—'
      } else {
        newTtls[layer] = layer === 'Browser' ? '5 мин' : layer === 'CDN' ? '5 мин' : layer === 'Redis' ? '1 мин' : 'авто'
      }
      return { ...r, layers: newLayers, ttls: newTtls }
    }))
  }

  const updateTtl = (rowIdx: number, layer: string, value: string) => {
    setRows(prev => prev.map((r, i) =>
      i === rowIdx ? { ...r, ttls: { ...r.ttls, [layer]: value } } : r
    ))
  }

  const updateField = (rowIdx: number, field: 'invalidation' | 'stampedeProtection', value: string) => {
    setRows(prev => prev.map((r, i) =>
      i === rowIdx ? { ...r, [field]: value } : r
    ))
  }

  const updateHitRatio = (rowIdx: number, value: number) => {
    setRows(prev => prev.map((r, i) =>
      i === rowIdx ? { ...r, estimatedHitRatio: value } : r
    ))
  }

  const rowColors: Record<string, string> = {
    static: '#e3f2fd',
    api: '#e8f5e9',
    user: '#fff3e0',
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Многоуровневый кэш: новостной сайт</h2>

      {/* Table */}
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>
                Тип контента
              </th>
              {CACHE_LAYERS.map(layer => (
                <th key={layer} style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>
                  {layer}
                </th>
              ))}
              <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>
                Инвалидация
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>
                Stampede
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>
                Hit Ratio
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={row.type}
                onClick={() => setSelectedRow(selectedRow === ri ? null : ri)}
                style={{
                  background: rowColors[row.type],
                  cursor: 'pointer',
                  borderBottom: '1px solid #e0e0e0',
                }}
              >
                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                  {row.label}
                </td>
                {CACHE_LAYERS.map(layer => (
                  <td key={layer} style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLayer(ri, layer)
                        }}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: 'none',
                          background: row.layers[layer] ? '#4caf50' : '#e0e0e0',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {row.layers[layer] ? '✓' : ''}
                      </button>
                    </div>
                    {row.layers[layer] && (
                      <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#555' }}>
                        {row.ttls[layer]}
                      </div>
                    )}
                  </td>
                ))}
                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem' }}>
                  {row.invalidation}
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem' }}>
                  {row.stampedeProtection}
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    background: row.estimatedHitRatio >= 90 ? '#4caf50' : row.estimatedHitRatio >= 70 ? '#ff9800' : '#f44336',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                  }}>
                    {row.estimatedHitRatio}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit panel */}
      {selectedRow !== null && (
        <div style={{
          padding: '1.5rem',
          background: '#fafafa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{ margin: '0 0 1rem' }}>
            Редактирование: {rows[selectedRow].label}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {CACHE_LAYERS.filter(l => rows[selectedRow].layers[l]).map(layer => (
              <div key={layer}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>TTL: {layer}</label>
                <select
                  value={rows[selectedRow].ttls[layer]}
                  onChange={e => updateTtl(selectedRow, layer, e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', marginTop: '0.25rem' }}
                >
                  {['5 сек', '30 сек', '1 мин', '5 мин', '15 мин', '1 час', '1 день', '1 год', 'авто'].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            ))}

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Инвалидация</label>
              <select
                value={rows[selectedRow].invalidation}
                onChange={e => updateField(selectedRow, 'invalidation', e.target.value)}
                style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', marginTop: '0.25rem' }}
              >
                <option>TTL only</option>
                <option>TTL + event-based (при публикации)</option>
                <option>Event-based (при действии пользователя)</option>
                <option>Versioned filename (app.a1b2c3.js)</option>
                <option>Versioned keys</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Stampede Protection</label>
              <select
                value={rows[selectedRow].stampedeProtection}
                onChange={e => updateField(selectedRow, 'stampedeProtection', e.target.value)}
                style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', marginTop: '0.25rem' }}
              >
                <option>Не нужна</option>
                <option>Mutex lock</option>
                <option>Early refresh</option>
                <option>Mutex lock + early refresh</option>
                <option>Не нужна (персональные данные)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                Расчётный Hit Ratio: {rows[selectedRow].estimatedHitRatio}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={rows[selectedRow].estimatedHitRatio}
                onChange={e => updateHitRatio(selectedRow, Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.25rem', accentColor: '#1976d2' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Request flow visualization */}
      <div style={{
        padding: '1.5rem',
        background: '#fafafa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
      }}>
        <h3 style={{ margin: '0 0 1rem' }}>Путь запроса (карта кэширования)</h3>
        {rows.map(row => {
          const activeLayers = CACHE_LAYERS.filter(l => row.layers[l])
          return (
            <div key={row.type} style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {row.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '0.3rem 0.6rem',
                  background: '#90caf9',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>
                  Request
                </span>
                {activeLayers.map((layer, i) => (
                  <span key={layer} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: '#999', fontSize: '0.8rem' }}>→</span>
                    <span style={{
                      padding: '0.3rem 0.6rem',
                      background: rowColors[row.type],
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                    }}>
                      {layer} ({row.ttls[layer]})
                    </span>
                    {i === activeLayers.length - 1 && (
                      <>
                        <span style={{ color: '#999', fontSize: '0.8rem' }}>→</span>
                        <span style={{
                          padding: '0.3rem 0.6rem',
                          background: '#ffcdd2',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        }}>
                          DB
                        </span>
                      </>
                    )}
                  </span>
                ))}
                {activeLayers.length === 0 && (
                  <>
                    <span style={{ color: '#999', fontSize: '0.8rem' }}>→</span>
                    <span style={{
                      padding: '0.3rem 0.6rem',
                      background: '#ffcdd2',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}>
                      DB (без кэша!)
                    </span>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
