import { useState, useMemo } from 'react'

// ============================================
// Задание 9.1: Справочная карточка — Paste Service
// ============================================

export function Task9_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Paste Service — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Metadata vs Content</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Метаданные (SQL)</strong> — shortCode, language, expiresAt, contentKey. ~200 байт/запись.
            <br /><br />
            <strong>Контент (S3)</strong> — сам текст paste. ~10 KB средний, до 10 MB макс.
            <br /><br />
            Разделение позволяет масштабировать хранилища независимо: SQL для поиска, S3 для отдачи.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Content-Addressable Storage</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            S3 key = <code>SHA-256(content)</code>
            <br /><br />
            Одинаковый текст = одинаковый хеш = один объект в S3.
            <br /><br />
            <strong>Дедупликация</strong>: 1000 одинаковых pastes занимают место одного.
            <br /><br />
            При удалении — проверяем reference count.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>CDN + Caching</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>CDN</strong> — кэширует публичные pastes на edge-серверах.
            <br /><br />
            <strong>Redis</strong> — кэширует метаданные (shortCode → contentKey).
            <br /><br />
            <strong>Cache-Control</strong>: max-age = min(1 час, оставшийся TTL paste).
            <br /><br />
            Приватные pastes: <code>Cache-Control: private, no-store</code>.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Capacity Estimation</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>5M pastes/день</strong> → 58 write QPS
            <br />
            <strong>Read:Write = 5:1</strong> → 290 read QPS
            <br />
            <strong>Peak</strong> → ~870 read QPS
            <br />
            <strong>5 лет</strong> → ~91 TB контента (S3), ~1.8 TB метаданных (SQL)
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Expiration & Cleanup</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Background job</strong> — каждые 5 мин удаляет протухшие pastes.
            <br /><br />
            <strong>Lazy check</strong> — при чтении проверяем expiresAt → 410 Gone.
            <br /><br />
            <strong>CDN invalidation</strong> — при удалении чистим кэш CDN.
            <br /><br />
            <strong>S3 cleanup</strong> — удаляем объект только при ref count = 0.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Syntax Highlighting</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Client-side</strong> — Prism.js / highlight.js. Нет нагрузки на сервер.
            <br /><br />
            <strong>Server-side</strong> — pre-render HTML в S3. Мгновенно через CDN.
            <br /><br />
            <strong>Гибрид</strong> — сервер рендерит HTML-версию, клиент переключает тему.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 9.2: Capacity калькулятор
// ============================================

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes.toFixed(0)} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  if (bytes < 1024 ** 4) return `${(bytes / 1024 ** 3).toFixed(2)} GB`
  return `${(bytes / 1024 ** 4).toFixed(2)} TB`
}

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toFixed(0)
}

function formatCost(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`
  return `$${usd.toFixed(2)}`
}

interface CalcInputs {
  pastesPerDay: number
  avgSizeKB: number
  retentionYears: number
  readWriteRatio: number
}

const DEFAULT_INPUTS: CalcInputs = {
  pastesPerDay: 5_000_000,
  avgSizeKB: 10,
  retentionYears: 5,
  readWriteRatio: 5,
}

const S3_COST_PER_GB_MONTH = 0.023
const S3_BANDWIDTH_COST_PER_GB = 0.09
const METADATA_SIZE_BYTES = 200
const QPS_PER_SERVER = 1000

export function Task9_2_Solution() {
  const [inputs, setInputs] = useState<CalcInputs>(DEFAULT_INPUTS)
  const [showGrowth, setShowGrowth] = useState(false)

  const update = (key: keyof CalcInputs, value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num) && num >= 0) {
      setInputs(prev => ({ ...prev, [key]: num }))
    }
  }

  const calc = useMemo(() => {
    const avgSizeBytes = inputs.avgSizeKB * 1024
    const writeQPS = inputs.pastesPerDay / 86400
    const readQPS = writeQPS * inputs.readWriteRatio
    const peakReadQPS = readQPS * 3

    const totalPastes = inputs.pastesPerDay * 365 * inputs.retentionYears
    const contentStorage = totalPastes * avgSizeBytes
    const metadataStorage = totalPastes * METADATA_SIZE_BYTES

    const incomingBW = writeQPS * avgSizeBytes
    const outgoingBW = readQPS * avgSizeBytes
    const peakOutBW = peakReadQPS * avgSizeBytes

    const contentStorageGB = contentStorage / (1024 ** 3)
    const monthlyStorageCost = contentStorageGB * S3_COST_PER_GB_MONTH
    const monthlyBandwidthGB = (outgoingBW * 86400 * 30) / (1024 ** 3)
    const monthlyBandwidthCost = monthlyBandwidthGB * S3_BANDWIDTH_COST_PER_GB
    const totalMonthlyCost = monthlyStorageCost + monthlyBandwidthCost

    const serversNeeded = Math.max(1, Math.ceil(peakReadQPS / QPS_PER_SERVER))

    const growthTable: Array<{
      period: string
      pastes: number
      contentSize: number
      metadataSize: number
      monthlyCost: number
    }> = []

    for (let month = 1; month <= inputs.retentionYears * 12; month++) {
      if (month <= 12 || month % 12 === 0) {
        const pastesAtMonth = inputs.pastesPerDay * 30 * month
        const contentAtMonth = pastesAtMonth * avgSizeBytes
        const metadataAtMonth = pastesAtMonth * METADATA_SIZE_BYTES
        const costAtMonth = (contentAtMonth / (1024 ** 3)) * S3_COST_PER_GB_MONTH + monthlyBandwidthCost
        growthTable.push({
          period: month < 12 ? `${month} мес` : `${month / 12} год${month / 12 >= 5 ? '' : month / 12 >= 2 ? 'а' : ''}`,
          pastes: pastesAtMonth,
          contentSize: contentAtMonth,
          metadataSize: metadataAtMonth,
          monthlyCost: costAtMonth,
        })
      }
    }

    return {
      writeQPS,
      readQPS,
      peakReadQPS,
      totalPastes,
      contentStorage,
      metadataStorage,
      incomingBW,
      outgoingBW,
      peakOutBW,
      monthlyStorageCost,
      monthlyBandwidthCost,
      totalMonthlyCost,
      serversNeeded,
      growthTable,
    }
  }, [inputs])

  const inputStyle = {
    width: '140px',
    padding: '0.4rem 0.6rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '0.95rem',
    textAlign: 'right' as const,
  }

  const labelStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f0f0f0',
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Capacity Calculator: Paste Service</h2>

      {/* Input Parameters */}
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Входные параметры</h3>
        <div style={labelStyle}>
          <span>Pastes / день</span>
          <input
            type="number"
            value={inputs.pastesPerDay}
            onChange={e => update('pastesPerDay', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={labelStyle}>
          <span>Средний размер paste (KB)</span>
          <input
            type="number"
            value={inputs.avgSizeKB}
            onChange={e => update('avgSizeKB', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={labelStyle}>
          <span>Retention (лет)</span>
          <input
            type="number"
            value={inputs.retentionYears}
            onChange={e => update('retentionYears', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ ...labelStyle, borderBottom: 'none' }}>
          <span>Read:Write ratio</span>
          <input
            type="number"
            value={inputs.readWriteRatio}
            onChange={e => update('readWriteRatio', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* QPS */}
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>QPS (Queries Per Second)</h4>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
            <div>Write QPS: <strong>{calc.writeQPS.toFixed(1)}</strong></div>
            <div>Read QPS (avg): <strong>{calc.readQPS.toFixed(1)}</strong></div>
            <div>Read QPS (peak x3): <strong style={{ color: '#d32f2f' }}>{calc.peakReadQPS.toFixed(1)}</strong></div>
          </div>
        </div>

        {/* Storage */}
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Storage ({inputs.retentionYears} лет)</h4>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
            <div>Всего pastes: <strong>{formatNumber(calc.totalPastes)}</strong></div>
            <div>Content (S3): <strong style={{ color: '#2e7d32' }}>{formatBytes(calc.contentStorage)}</strong></div>
            <div>Metadata (SQL): <strong>{formatBytes(calc.metadataStorage)}</strong></div>
          </div>
        </div>

        {/* Bandwidth */}
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Bandwidth</h4>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
            <div>Incoming (upload): <strong>{formatBytes(calc.incomingBW)}/sec</strong></div>
            <div>Outgoing (download): <strong>{formatBytes(calc.outgoingBW)}/sec</strong></div>
            <div>Peak outgoing: <strong style={{ color: '#e65100' }}>{formatBytes(calc.peakOutBW)}/sec</strong></div>
          </div>
        </div>

        {/* Cost & Servers */}
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Стоимость и серверы</h4>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
            <div>S3 storage/мес: <strong>{formatCost(calc.monthlyStorageCost)}</strong></div>
            <div>S3 bandwidth/мес: <strong>{formatCost(calc.monthlyBandwidthCost)}</strong></div>
            <div>Итого S3/мес: <strong style={{ color: '#c62828' }}>{formatCost(calc.totalMonthlyCost)}</strong></div>
            <div>API серверов (peak): <strong>{calc.serversNeeded}</strong></div>
          </div>
        </div>
      </div>

      {/* Growth Table Toggle */}
      <button
        onClick={() => setShowGrowth(!showGrowth)}
        style={{
          padding: '0.5rem 1.5rem',
          background: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}
      >
        {showGrowth ? 'Скрыть таблицу роста' : 'Показать таблицу роста'}
      </button>

      {showGrowth && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Период</th>
                <th style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Pastes (накоп.)</th>
                <th style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Content (S3)</th>
                <th style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Metadata (SQL)</th>
                <th style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '2px solid #ddd' }}>S3 стоимость/мес</th>
              </tr>
            </thead>
            <tbody>
              {calc.growthTable.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee' }}>{row.period}</td>
                  <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatNumber(row.pastes)}</td>
                  <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{formatBytes(row.contentSize)}</td>
                  <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatBytes(row.metadataSize)}</td>
                  <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right', borderBottom: '1px solid #eee', color: '#c62828' }}>{formatCost(row.monthlyCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Visual bar chart */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#263238', borderRadius: '8px' }}>
        <div style={{ color: '#78909c', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          // Рост content storage по периодам
        </div>
        {calc.growthTable.map((row, i) => {
          const maxStorage = calc.growthTable[calc.growthTable.length - 1].contentSize
          const widthPct = maxStorage > 0 ? (row.contentSize / maxStorage) * 100 : 0
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span style={{ color: '#90a4ae', fontSize: '0.8rem', width: '60px', textAlign: 'right', flexShrink: 0 }}>
                {row.period}
              </span>
              <div style={{ flex: 1, background: '#37474f', borderRadius: '4px', height: '20px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${widthPct}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, #42a5f5, ${widthPct > 70 ? '#ef5350' : '#66bb6a'})`,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <span style={{ color: '#e0e0e0', fontSize: '0.8rem', width: '80px', flexShrink: 0 }}>
                {formatBytes(row.contentSize)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// Задание 9.3: Полный System Design — Paste Service
// ============================================

interface DesignSection {
  id: string
  title: string
  content: string
}

const PASTE_DESIGN_SECTIONS: DesignSection[] = [
  {
    id: 'requirements',
    title: '1. Requirements',
    content: `Functional:
  - Создать paste: загрузить текст (до 10 MB), получить уникальную ссылку
  - Прочитать paste по короткой ссылке (без авторизации)
  - Expiration: TTL (10 мин, 1 час, 1 день, 1 неделя, бессрочно)
  - Syntax highlighting по выбранному языку
  - (Опц.) Приватные pastes — доступ по секретному URL
  - (Опц.) Удаление и редактирование автором

Non-Functional:
  - Высокая доступность (99.9%+)
  - Низкая задержка чтения (< 200 мс)
  - Масштаб: 5M+ pastes/день, средний размер 10 KB
  - Read-heavy: чтение:запись = 5:1
  - Durability: paste не теряется до истечения TTL
  - Максимальный размер paste: 10 MB`,
  },
  {
    id: 'capacity',
    title: '2. Capacity Estimation',
    content: `Исходные данные:
  - 5M новых pastes/день
  - Средний размер: 10 KB
  - Read:Write = 5:1
  - Хранение 5 лет

QPS:
  - Write: 5M / 86400 ≈ 58 QPS
  - Read: 58 × 5 = 290 QPS (средний)
  - Peak Read: 290 × 3 = 870 QPS

Storage (5 лет):
  - Всего pastes: 5M × 365 × 5 = 9.1 млрд
  - Content (S3): 9.1B × 10 KB = ~91 TB
  - Metadata (SQL): 9.1B × 200 B = ~1.8 TB

Bandwidth:
  - Incoming: 58 × 10 KB = ~580 KB/sec
  - Outgoing: 290 × 10 KB = ~2.9 MB/sec
  - Peak: 870 × 10 KB = ~8.7 MB/sec

Стоимость S3 (ежемесячно):
  - Storage: ~91 TB × $0.023/GB = ~$2,100/мес (к концу 5 лет)
  - Bandwidth: ~7.5 TB × $0.09/GB = ~$675/мес
  - Итого: ~$2,800/мес (финальный масштаб)`,
  },
  {
    id: 'api',
    title: '3. API Design',
    content: `POST /api/paste
  Body: { content, language?, title?, expiresIn?, isPrivate? }
  Response: { shortCode, url, expiresAt, rawUrl }
  Limits: content <= 10 MB, rate limit 100 req/min

GET /:shortCode
  Response: HTML-страница с подсветкой синтаксиса
  Headers: Cache-Control: public, max-age=min(3600, TTL)
  Если protuh: 410 Gone
  Если не найден: 404

GET /:shortCode/raw
  Response: plain text (Content-Type: text/plain)
  Для curl, wget, API-клиентов

DELETE /api/paste/:shortCode
  Auth: required (author token)
  Response: 204 No Content
  Side-effects: CDN invalidation, cache cleanup

GET /api/paste/:shortCode/meta
  Response: { shortCode, language, createdAt, expiresAt, size, views }`,
  },
  {
    id: 'datamodel',
    title: '4. Data Model',
    content: `=== Metadata (PostgreSQL) ===

  CREATE TABLE pastes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_code VARCHAR(8) UNIQUE NOT NULL,
    title VARCHAR(255),
    language VARCHAR(50),
    content_key VARCHAR(128) NOT NULL,    -- S3 key: "pastes/{sha256}.txt"
    content_size INTEGER NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    author_token VARCHAR(64),             -- для удаления/редактирования
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,                 -- NULL = бессрочно
    view_count BIGINT DEFAULT 0
  );

  CREATE UNIQUE INDEX idx_short_code ON pastes(short_code);
  CREATE INDEX idx_expires ON pastes(expires_at)
    WHERE expires_at IS NOT NULL;
  CREATE INDEX idx_content_key ON pastes(content_key);  -- для ref count

=== Content (S3) ===

  Bucket: paste-bucket
  Key: pastes/{sha256_hash}.txt
  Content-Type: text/plain
  Server-Side Encryption: AES-256

  Адресация по содержимому (CAS):
  - key = SHA-256(content)
  - Дедупликация: одинаковый контент → один объект
  - Reference counting через idx_content_key`,
  },
  {
    id: 'architecture',
    title: '5. Architecture',
    content: `Компоненты:
  [Client] → [CDN (CloudFront)] → [Load Balancer] → [API Server ×N]
                                                      ├→ [Redis] (metadata cache)
                                                      ├→ [PostgreSQL] (metadata, sharded)
                                                      ├→ [S3] (content)
                                                      └→ [Cleanup Worker] (expiration)

Write Path (создание paste):
  1. Client → POST /api/paste { content, language }
  2. LB → API Server
  3. SHA-256(content) → s3Key
  4. S3 HeadObject → если нет, PutObject (дедупликация)
  5. PostgreSQL INSERT (shortCode, contentKey, expiresAt)
  6. Redis SET paste:{shortCode} → metadata
  7. Return { url: "paste.io/abc123" }

Read Path (чтение paste):
  1. Client → GET /abc123
  2. CDN → Cache HIT → мгновенный ответ
  3. CDN MISS → LB → API Server
  4. Redis GET paste:abc123 → metadata
     - MISS → PostgreSQL SELECT → Redis SET
  5. Проверка expiresAt (lazy expiration)
  6. S3 GetObject(contentKey) → content
  7. Формируем ответ → CDN кэширует

Отказоустойчивость:
  - API Server упал → LB → другие инстансы
  - Redis недоступен → fallback на PostgreSQL
  - CDN кэширует → работает даже при проблемах с origin
  - S3: 99.999999999% durability (11 девяток)`,
  },
  {
    id: 'dedup',
    title: '6. Content-Addressable Storage',
    content: `Принцип:
  S3 key = SHA-256(content)
  Одинаковый текст → одинаковый хеш → один файл в S3

Процесс записи:
  1. hash = SHA-256(paste_content)
  2. s3Key = "pastes/{hash}.txt"
  3. HeadObject(s3Key) → exists?
     - Да: skip upload (экономим bandwidth + время)
     - Нет: PutObject(s3Key, content)
  4. INSERT INTO pastes (content_key = s3Key)

Процесс удаления:
  1. DELETE FROM pastes WHERE short_code = ?
  2. SELECT COUNT(*) FROM pastes WHERE content_key = ?
     AND (expires_at IS NULL OR expires_at > NOW())
  3. Если count = 0 → S3 DeleteObject(content_key)
  4. Если count > 0 → НЕ удаляем S3-объект

Экономия:
  - Популярные stack traces, error logs — тысячи копий
  - При 10% дупликатов и 91 TB → экономия ~9 TB
  - + экономия bandwidth при skip upload`,
  },
  {
    id: 'expiration',
    title: '7. Expiration & Cleanup',
    content: `Два механизма:

1. Background Cleanup Job (активный):
  - Запуск каждые 5 минут через cron/scheduler
  - SELECT short_code, content_key FROM pastes
    WHERE expires_at < NOW() LIMIT 1000
  - Для каждого: проверка ref count → удаление S3 → удаление metadata
  - Redis DEL + CDN invalidation
  - Batch processing: 1000 за раз, чтобы не перегрузить БД

2. Lazy Expiration (пассивный):
  - При каждом чтении проверяем expiresAt
  - Если протух: return 410 Gone + ставим в очередь на cleanup
  - Гарантирует, что пользователь НЕ увидит протухший paste

CDN Cache:
  - Cache-Control: max-age = min(3600, secondsUntilExpiry)
  - При удалении paste: cdn.invalidate("/paste/{shortCode}")
  - stale-while-revalidate для фоновой проверки

Rate of expiration:
  - При 5M pastes/день и среднем TTL 1 день → ~5M удалений/день
  - ~58 delete QPS → отдельный worker, не нагружаем API`,
  },
  {
    id: 'scaling',
    title: '8. Scaling & Optimizations',
    content: `API Servers:
  - Stateless → горизонтальное масштабирование
  - Auto-scaling по CPU/QPS
  - При peak 870 QPS и 1000 QPS/сервер → 1-2 сервера (с запасом 3-4)

S3 (Object Storage):
  - Бесконечная ёмкость — не нужно шардировать
  - Автоматическая репликация (11 девяток durability)
  - S3 Intelligent-Tiering: старые pastes → дешёвый класс
  - Transfer Acceleration для глобальных пользователей

PostgreSQL (Metadata):
  - Шардирование по hash(short_code) % N
  - 1.8 TB за 5 лет → 2-4 шарда достаточно
  - Read replicas для аналитики (view_count)
  - Partitioning по created_at для быстрого cleanup

Redis (Cache):
  - Кэш метаданных (shortCode → contentKey + metadata)
  - TTL = 1 час, LRU eviction
  - ~50 GB при кэшировании 20% горячих метаданных
  - Redis Cluster для отказоустойчивости

CDN (CloudFront):
  - Edge-кэширование публичных pastes
  - Снижает нагрузку на origin в 10-100x для популярных pastes
  - Geo-routing → ближайший edge server

Cleanup Workers:
  - Отдельный сервис, не нагружает API
  - Горизонтально масштабируется (partition по диапазонам ID)
  - Dead letter queue для failed cleanups`,
  },
]

export function Task9_3_Solution() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [expandAll, setExpandAll] = useState(false)

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (expandAll) {
      setOpenSections(new Set())
    } else {
      setOpenSections(new Set(PASTE_DESIGN_SECTIONS.map(s => s.id)))
    }
    setExpandAll(!expandAll)
  }

  const getSectionIcon = (id: string) => {
    switch (id) {
      case 'requirements': return '\u{1F4CB}'
      case 'capacity': return '\u{1F9EE}'
      case 'api': return '\u{1F50C}'
      case 'datamodel': return '\u{1F4BE}'
      case 'architecture': return '\u{1F3D7}\uFE0F'
      case 'dedup': return '\u{1F517}'
      case 'expiration': return '\u{1F9F9}'
      case 'scaling': return '\u{1F4C8}'
      default: return '\u{1F4CC}'
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Полный System Design: Paste Service</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Эталонное решение. Раскройте каждую секцию, чтобы увидеть детали. Сравните со своим дизайном.
      </p>

      <button
        onClick={toggleAll}
        style={{
          padding: '0.4rem 1rem',
          marginBottom: '1rem',
          background: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        {expandAll ? 'Свернуть все' : 'Развернуть все'}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {PASTE_DESIGN_SECTIONS.map(section => {
          const isOpen = openSections.has(section.id)
          return (
            <div key={section.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: isOpen ? '#e3f2fd' : '#fafafa',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}
              >
                <span style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>
                  {'\u25B6'}
                </span>
                <span>{getSectionIcon(section.id)}</span>
                <span>{section.title}</span>
              </button>
              {isOpen && (
                <div style={{
                  padding: '1rem',
                  background: '#fafafa',
                  borderTop: '1px solid #e0e0e0',
                }}>
                  <pre style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    color: '#333',
                  }}>
                    {section.content}
                  </pre>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <strong>Чеклист интервью:</strong>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
          1. Requirements (2 мин) → 2. Capacity Estimation (3 мин) → 3. API Design (3 мин)
          <br />
          4. Data Model (3 мин) → 5. Architecture (5 мин) → 6. Content-Addressable Storage (3 мин)
          <br />
          7. Expiration & Cleanup (3 мин) → 8. Scaling (5 мин) → 9. Вопросы интервьюера (5-10 мин)
          <br /><br />
          Итого: ~35-40 минут. Ключевое отличие от URL Shortener — разделение metadata/content и Object Storage.
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
        <strong>Сравнение с URL Shortener:</strong>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.3rem', borderBottom: '1px solid #ddd' }}>Аспект</th>
                <th style={{ textAlign: 'left', padding: '0.3rem', borderBottom: '1px solid #ddd' }}>URL Shortener</th>
                <th style={{ textAlign: 'left', padding: '0.3rem', borderBottom: '1px solid #ddd' }}>Paste Service</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Хранение</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>URL в SQL (~500 B)</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Metadata SQL + Content S3 (~10 KB)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Read:Write</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>100:1</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>5:1</td>
              </tr>
              <tr>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>CDN</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Не нужен (redirect)</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Критически важен (контент)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Дедупликация</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Не нужна</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>CAS (SHA-256)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.3rem' }}>Cleanup</td>
                <td style={{ padding: '0.3rem' }}>Простой DELETE</td>
                <td style={{ padding: '0.3rem' }}>Ref count + S3 delete + CDN invalidation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
