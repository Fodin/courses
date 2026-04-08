import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 16.1: Consumer Lag дашборд
// ============================================

interface PartitionStats {
  partition: number
  logEndOffset: number
  committedOffset: number
  lag: number
}

interface ConsumerGroup {
  id: string
  topic: string
  partitions: PartitionStats[]
}

function getLagColor(lag: number, threshold: { yellow: number; red: number }): string {
  if (lag >= threshold.red) return '#e53e3e'
  if (lag >= threshold.yellow) return '#ed8936'
  return '#38a169'
}

function getLagLabel(lag: number, threshold: { yellow: number; red: number }): string {
  if (lag >= threshold.red) return 'CRITICAL'
  if (lag >= threshold.yellow) return 'GROWING'
  return 'OK'
}

const THRESHOLDS = { yellow: 500, red: 2000 }

const INITIAL_GROUPS: ConsumerGroup[] = [
  {
    id: 'orders-consumer',
    topic: 'orders',
    partitions: [
      { partition: 0, logEndOffset: 10420, committedOffset: 10418, lag: 2 },
      { partition: 1, logEndOffset: 10380, committedOffset: 10375, lag: 5 },
      { partition: 2, logEndOffset: 10510, committedOffset: 10509, lag: 1 },
    ],
  },
  {
    id: 'analytics-consumer',
    topic: 'events',
    partitions: [
      { partition: 0, logEndOffset: 85000, committedOffset: 84300, lag: 700 },
      { partition: 1, logEndOffset: 83200, committedOffset: 82000, lag: 1200 },
      { partition: 2, logEndOffset: 86100, committedOffset: 83900, lag: 2200 },
    ],
  },
]

export function Task16_1_Solution() {
  const { t } = useLanguage()
  const [groups, setGroups] = useState<ConsumerGroup[]>(INITIAL_GROUPS)
  const [slowdown, setSlowdown] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Симуляция роста/сжатия лага
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setGroups(prev =>
        prev.map(group => ({
          ...group,
          partitions: group.partitions.map(p => {
            const produce = Math.floor(Math.random() * 120) + 40
            const consume = slowdown
              ? Math.floor(Math.random() * 20) + 5
              : Math.floor(Math.random() * 110) + 40
            const newLeo = p.logEndOffset + produce
            const newCommitted = Math.min(p.committedOffset + consume, newLeo)
            return {
              ...p,
              logEndOffset: newLeo,
              committedOffset: newCommitted,
              lag: newLeo - newCommitted,
            }
          }),
        }))
      )
    }, 1200)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [slowdown])

  const totalLag = groups.reduce(
    (acc, g) => acc + g.partitions.reduce((a, p) => a + p.lag, 0),
    0
  )

  return (
    <div className="exercise-container">
      <h2>{t('task.16.1')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Consumer Lag показывает, насколько consumer отстаёт от producer. Зелёный — норма,
        жёлтый — lag растёт, красный — критическое отставание.
      </p>

      {/* Управление */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSlowdown(v => !v)}
          style={{
            padding: '0.5rem 1.25rem',
            background: slowdown ? '#e53e3e' : '#38a169',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {slowdown ? 'Consumer замедлен (симуляция инцидента)' : 'Consumer работает нормально'}
        </button>
        <div style={{
          padding: '0.4rem 0.9rem',
          background: '#f0f0f0',
          borderRadius: '6px',
          fontSize: '0.85rem',
        }}>
          Суммарный lag: <strong style={{ color: getLagColor(totalLag, { yellow: 2000, red: 8000 }) }}>{totalLag.toLocaleString()}</strong>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#999' }}>
          Обновление каждые 1.2 сек
        </div>
      </div>

      {/* Легенда */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {[
          { color: '#38a169', label: `OK (< ${THRESHOLDS.yellow})` },
          { color: '#ed8936', label: `GROWING (${THRESHOLDS.yellow}–${THRESHOLDS.red})` },
          { color: '#e53e3e', label: `CRITICAL (> ${THRESHOLDS.red})` },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: '0.78rem', color: '#666' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Consumer groups */}
      {groups.map(group => {
        const groupLag = group.partitions.reduce((a, p) => a + p.lag, 0)
        const groupColor = getLagColor(groupLag, { yellow: 1000, red: 4000 })
        return (
          <div
            key={group.id}
            style={{
              border: `2px solid ${groupColor}`,
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1rem',
              background: `${groupColor}08`,
              transition: 'border-color 0.4s ease, background 0.4s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.95rem' }}>{group.id}</span>
                <span style={{ color: '#888', fontSize: '0.82rem', marginLeft: '0.6rem' }}>
                  topic: <code style={{ background: '#f0f0f0', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>{group.topic}</code>
                </span>
              </div>
              <span style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                background: groupColor,
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}>
                {getLagLabel(groupLag, { yellow: 1000, red: 4000 })} — lag: {groupLag.toLocaleString()}
              </span>
            </div>

            {/* Партиции */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Заголовок */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr 1fr 90px',
                gap: '0.5rem',
                fontSize: '0.72rem',
                color: '#999',
                fontWeight: 600,
                textTransform: 'uppercase',
                paddingBottom: '0.25rem',
                borderBottom: '1px solid #eee',
              }}>
                <span>Partition</span>
                <span>Log-End Offset</span>
                <span>Committed Offset</span>
                <span>Lag (визуально)</span>
                <span>Статус</span>
              </div>

              {group.partitions.map(p => {
                const pColor = getLagColor(p.lag, THRESHOLDS)
                const lagPercent = Math.min((p.lag / (p.logEndOffset * 0.05 + 1)) * 100, 100)
                return (
                  <div
                    key={p.partition}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 1fr 1fr 90px',
                      gap: '0.5rem',
                      alignItems: 'center',
                      fontSize: '0.82rem',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#555' }}>P{p.partition}</span>
                    <span style={{ fontFamily: 'monospace' }}>{p.logEndOffset.toLocaleString()}</span>
                    <span style={{ fontFamily: 'monospace' }}>{p.committedOffset.toLocaleString()}</span>
                    {/* Визуальная шкала лага */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${lagPercent}%`,
                          background: pColor,
                          borderRadius: '4px',
                          transition: 'width 0.4s ease, background 0.4s ease',
                        }} />
                      </div>
                      <span style={{ fontFamily: 'monospace', color: pColor, fontWeight: 600, minWidth: '45px', textAlign: 'right', transition: 'color 0.4s ease' }}>
                        {p.lag.toLocaleString()}
                      </span>
                    </div>
                    <span style={{
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: `${pColor}20`,
                      color: pColor,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      transition: 'all 0.4s ease',
                    }}>
                      {getLagLabel(p.lag, THRESHOLDS)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#999' }}>
        Нажми кнопку выше, чтобы симулировать замедление consumer и наблюдать рост lag в реальном времени
      </div>
    </div>
  )
}

// ============================================
// Задание 16.2: Distributed Tracing — путь сообщения
// ============================================

interface TraceSpan {
  id: string
  parentId: string | null
  service: string
  operation: string
  startMs: number
  durationMs: number
  status: 'ok' | 'error' | 'slow'
  tags: Record<string, string>
}

interface TraceScenario {
  id: string
  name: string
  traceId: string
  spans: TraceSpan[]
}

const SCENARIOS: TraceScenario[] = [
  {
    id: 'success',
    name: 'Успешный путь',
    traceId: 'abc123def456',
    spans: [
      {
        id: 's1', parentId: null,
        service: 'Service A', operation: 'POST /order',
        startMs: 0, durationMs: 245,
        status: 'ok',
        tags: { 'http.method': 'POST', 'http.status': '200', 'span.kind': 'server' },
      },
      {
        id: 's2', parentId: 's1',
        service: 'Service A', operation: 'kafka.produce → orders',
        startMs: 12, durationMs: 8,
        status: 'ok',
        tags: { 'messaging.system': 'kafka', 'messaging.destination': 'orders', 'messaging.operation': 'send' },
      },
      {
        id: 's3', parentId: 's2',
        service: 'Service B', operation: 'kafka.consume ← orders',
        startMs: 35, durationMs: 18,
        status: 'ok',
        tags: { 'messaging.system': 'kafka', 'messaging.destination': 'orders', 'messaging.operation': 'receive' },
      },
      {
        id: 's4', parentId: 's3',
        service: 'Service B', operation: 'processOrder',
        startMs: 53, durationMs: 75,
        status: 'ok',
        tags: { 'db.system': 'postgres', 'db.statement': 'INSERT INTO orders' },
      },
      {
        id: 's5', parentId: 's4',
        service: 'Service B', operation: 'kafka.produce → notifications',
        startMs: 128, durationMs: 6,
        status: 'ok',
        tags: { 'messaging.system': 'kafka', 'messaging.destination': 'notifications', 'messaging.operation': 'send' },
      },
      {
        id: 's6', parentId: 's5',
        service: 'Service C', operation: 'kafka.consume ← notifications',
        startMs: 148, durationMs: 12,
        status: 'ok',
        tags: { 'messaging.system': 'kafka', 'messaging.destination': 'notifications', 'messaging.operation': 'receive' },
      },
      {
        id: 's7', parentId: 's6',
        service: 'Service C', operation: 'sendEmail',
        startMs: 160, durationMs: 85,
        status: 'ok',
        tags: { 'net.peer.name': 'smtp.example.com', 'net.peer.port': '587' },
      },
    ],
  },
  {
    id: 'slow',
    name: 'Медленный consumer',
    traceId: 'ff9900aa1122',
    spans: [
      {
        id: 's1', parentId: null,
        service: 'Service A', operation: 'POST /order',
        startMs: 0, durationMs: 3850,
        status: 'slow',
        tags: { 'http.method': 'POST', 'http.status': '200', 'span.kind': 'server' },
      },
      {
        id: 's2', parentId: 's1',
        service: 'Service A', operation: 'kafka.produce → orders',
        startMs: 12, durationMs: 9,
        status: 'ok',
        tags: { 'messaging.system': 'kafka', 'messaging.destination': 'orders' },
      },
      {
        id: 's3', parentId: 's2',
        service: 'Service B', operation: 'kafka.consume ← orders',
        startMs: 35, durationMs: 3600,
        status: 'slow',
        tags: { 'messaging.system': 'kafka', 'consumer.lag': '12500' },
      },
      {
        id: 's4', parentId: 's3',
        service: 'Service B', operation: 'processOrder',
        startMs: 3635, durationMs: 80,
        status: 'ok',
        tags: { 'db.system': 'postgres' },
      },
      {
        id: 's5', parentId: 's4',
        service: 'Service B', operation: 'kafka.produce → notifications',
        startMs: 3715, durationMs: 7,
        status: 'ok',
        tags: { 'messaging.system': 'kafka', 'messaging.destination': 'notifications' },
      },
      {
        id: 's6', parentId: 's5',
        service: 'Service C', operation: 'kafka.consume ← notifications',
        startMs: 3730, durationMs: 14,
        status: 'ok',
        tags: { 'messaging.system': 'kafka', 'messaging.destination': 'notifications' },
      },
      {
        id: 's7', parentId: 's6',
        service: 'Service C', operation: 'sendEmail',
        startMs: 3744, durationMs: 106,
        status: 'ok',
        tags: { 'net.peer.name': 'smtp.example.com' },
      },
    ],
  },
  {
    id: 'error',
    name: 'Ошибка в Service B',
    traceId: '1234error5678',
    spans: [
      {
        id: 's1', parentId: null,
        service: 'Service A', operation: 'POST /order',
        startMs: 0, durationMs: 180,
        status: 'error',
        tags: { 'http.method': 'POST', 'http.status': '500' },
      },
      {
        id: 's2', parentId: 's1',
        service: 'Service A', operation: 'kafka.produce → orders',
        startMs: 12, durationMs: 7,
        status: 'ok',
        tags: { 'messaging.system': 'kafka', 'messaging.destination': 'orders' },
      },
      {
        id: 's3', parentId: 's2',
        service: 'Service B', operation: 'kafka.consume ← orders',
        startMs: 35, durationMs: 16,
        status: 'ok',
        tags: { 'messaging.system': 'kafka' },
      },
      {
        id: 's4', parentId: 's3',
        service: 'Service B', operation: 'processOrder',
        startMs: 51, durationMs: 45,
        status: 'error',
        tags: { 'db.system': 'postgres', 'error': 'true', 'error.message': 'duplicate key value violates unique constraint' },
      },
    ],
  },
]

const SERVICE_COLORS: Record<string, string> = {
  'Service A': '#4f86f7',
  'Service B': '#38a169',
  'Service C': '#b34ff7',
}

const SPAN_STATUS_COLORS = {
  ok: '#38a169',
  slow: '#ed8936',
  error: '#e53e3e',
}

export function Task16_2_Solution() {
  const { t } = useLanguage()
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0])
  const [selectedSpan, setSelectedSpan] = useState<TraceSpan | null>(null)

  const totalMs = selectedScenario.spans.reduce(
    (max, s) => Math.max(max, s.startMs + s.durationMs),
    0
  )

  return (
    <div className="exercise-container">
      <h2>{t('task.16.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Distributed tracing показывает полный путь запроса через сервисы.
        Каждый span — это один шаг обработки с метками времени.
      </p>

      {/* Выбор сценария */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => { setSelectedScenario(s); setSelectedSpan(null) }}
            style={{
              padding: '0.4rem 1rem',
              border: `2px solid ${selectedScenario.id === s.id ? '#4f86f7' : '#ddd'}`,
              borderRadius: '6px',
              background: selectedScenario.id === s.id ? '#ebf4ff' : '#fff',
              cursor: 'pointer',
              fontWeight: selectedScenario.id === s.id ? 700 : 400,
              fontSize: '0.85rem',
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Trace info */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', color: '#666' }}>
        <span>Trace ID: <code style={{ background: '#f0f0f0', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>{selectedScenario.traceId}</code></span>
        <span>Duration: <strong style={{ color: '#333' }}>{totalMs}ms</strong></span>
        <span>Spans: <strong style={{ color: '#333' }}>{selectedScenario.spans.length}</strong></span>
        <span>Status: <strong style={{ color: SPAN_STATUS_COLORS[selectedScenario.spans[0].status] }}>
          {selectedScenario.spans[0].status.toUpperCase()}
        </strong></span>
      </div>

      {/* Waterfall diagram */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          background: '#f8f9fa',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.5rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#888',
          textTransform: 'uppercase',
        }}>
          <span>Операция</span>
          <span>Время (0 — {totalMs}ms)</span>
        </div>

        {selectedScenario.spans.map((span, i) => {
          const startPct = (span.startMs / totalMs) * 100
          const widthPct = Math.max((span.durationMs / totalMs) * 100, 0.5)
          const svcColor = SERVICE_COLORS[span.service] || '#888'
          const statusColor = SPAN_STATUS_COLORS[span.status]
          const isSelected = selectedSpan?.id === span.id
          const isKafka = span.operation.includes('kafka')

          return (
            <div
              key={span.id}
              onClick={() => setSelectedSpan(isSelected ? null : span)}
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                borderBottom: i < selectedScenario.spans.length - 1 ? '1px solid #f0f0f0' : 'none',
                padding: '0.4rem 0.75rem',
                cursor: 'pointer',
                background: isSelected ? '#f0f7ff' : 'transparent',
                transition: 'background 0.2s ease',
              }}
            >
              {/* Операция */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: svcColor, flexShrink: 0 }} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: svcColor,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {span.service}
                  </div>
                  <div style={{
                    fontSize: '0.73rem',
                    color: '#555',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {span.operation}
                  </div>
                </div>
              </div>

              {/* Timeline bar */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '4px' }}>
                <div style={{
                  position: 'absolute',
                  left: `${startPct}%`,
                  width: `${widthPct}%`,
                  height: '18px',
                  background: isKafka ? `${statusColor}50` : `${statusColor}20`,
                  border: `1.5px solid ${statusColor}`,
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: statusColor,
                    paddingLeft: '3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}>
                    {span.durationMs}ms
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Детали выбранного span */}
      {selectedSpan && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f8faff',
          border: `2px solid ${SERVICE_COLORS[selectedSpan.service] || '#ddd'}`,
          borderRadius: '8px',
        }}>
          <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: SERVICE_COLORS[selectedSpan.service] }}>
            {selectedSpan.service}: {selectedSpan.operation}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.4rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              Start: <strong>{selectedSpan.startMs}ms</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              Duration: <strong>{selectedSpan.durationMs}ms</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              Status: <strong style={{ color: SPAN_STATUS_COLORS[selectedSpan.status] }}>
                {selectedSpan.status.toUpperCase()}
              </strong>
            </div>
          </div>
          <div style={{ marginTop: '0.6rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600, marginBottom: '0.3rem' }}>TAGS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {Object.entries(selectedSpan.tags).map(([k, v]) => (
                <div key={k} style={{
                  padding: '0.15rem 0.5rem',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  fontSize: '0.73rem',
                  fontFamily: 'monospace',
                }}>
                  <span style={{ color: '#888' }}>{k}=</span>
                  <span style={{ color: '#4f86f7' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#999' }}>
        Кликни на span для просмотра тегов. Видишь как trace ID пробрасывается через Kafka?
      </p>
    </div>
  )
}

// ============================================
// Задание 16.3: Alerting — конфигуратор алертов
// ============================================

type MetricId = 'consumer_lag' | 'queue_depth' | 'publish_rate' | 'error_rate'
type Severity = 'warning' | 'critical'
type AlertState = 'ok' | 'firing' | 'resolved'

interface AlertRule {
  id: string
  metric: MetricId
  threshold: number
  severity: Severity
  enabled: boolean
}

interface AlertFiring {
  ruleId: string
  metric: MetricId
  currentValue: number
  threshold: number
  severity: Severity
  firedAt: number
  state: AlertState
}

const METRIC_META: Record<MetricId, { label: string; unit: string; defaultThreshold: number; min: number; max: number; step: number }> = {
  consumer_lag: { label: 'Consumer Lag', unit: 'msgs', defaultThreshold: 1000, min: 100, max: 10000, step: 100 },
  queue_depth: { label: 'Queue Depth', unit: 'msgs', defaultThreshold: 5000, min: 100, max: 50000, step: 500 },
  publish_rate: { label: 'Publish Rate', unit: 'msg/s', defaultThreshold: 1000, min: 50, max: 5000, step: 50 },
  error_rate: { label: 'Error Rate', unit: '%', defaultThreshold: 1, min: 0.1, max: 10, step: 0.1 },
}

const SEVERITY_COLORS: Record<Severity, string> = {
  warning: '#ed8936',
  critical: '#e53e3e',
}

function generateSimValue(metric: MetricId): number {
  const rand = Math.random()
  switch (metric) {
    case 'consumer_lag': return Math.floor(rand * 3000)
    case 'queue_depth': return Math.floor(rand * 15000)
    case 'publish_rate': return Math.floor(rand * 1200)
    case 'error_rate': return Math.round(rand * 5 * 10) / 10
  }
}

let ruleCounter = 1

export function Task16_3_Solution() {
  const { t } = useLanguage()
  const [rules, setRules] = useState<AlertRule[]>([
    { id: 'r1', metric: 'consumer_lag', threshold: 1000, severity: 'warning', enabled: true },
    { id: 'r2', metric: 'consumer_lag', threshold: 5000, severity: 'critical', enabled: true },
    { id: 'r3', metric: 'error_rate', threshold: 1, severity: 'critical', enabled: true },
  ])
  const [firing, setFiring] = useState<AlertFiring[]>([])
  const [simValues, setSimValues] = useState<Record<MetricId, number>>({
    consumer_lag: 450,
    queue_depth: 2200,
    publish_rate: 380,
    error_rate: 0.3,
  })

  // Новое правило (форма)
  const [newMetric, setNewMetric] = useState<MetricId>('consumer_lag')
  const [newThreshold, setNewThreshold] = useState(1000)
  const [newSeverity, setNewSeverity] = useState<Severity>('warning')

  // Симуляция изменения метрик
  useEffect(() => {
    const interval = setInterval(() => {
      const newVals: Record<MetricId, number> = {
        consumer_lag: generateSimValue('consumer_lag'),
        queue_depth: generateSimValue('queue_depth'),
        publish_rate: generateSimValue('publish_rate'),
        error_rate: generateSimValue('error_rate'),
      }
      setSimValues(newVals)

      // Обновить alerts
      setFiring(prev => {
        const now = Date.now()
        const next: AlertFiring[] = [...prev]

        rules.filter(r => r.enabled).forEach(rule => {
          const val = newVals[rule.metric]
          const isViolating = val > rule.threshold
          const existing = next.find(f => f.ruleId === rule.id && f.state === 'firing')

          if (isViolating && !existing) {
            next.push({
              ruleId: rule.id,
              metric: rule.metric,
              currentValue: val,
              threshold: rule.threshold,
              severity: rule.severity,
              firedAt: now,
              state: 'firing',
            })
          } else if (!isViolating && existing) {
            existing.state = 'resolved'
            existing.currentValue = val
          } else if (isViolating && existing) {
            existing.currentValue = val
          }
        })

        // Удалить resolved через 5 секунд
        return next.filter(f => !(f.state === 'resolved' && now - f.firedAt > 5000))
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [rules])

  const addRule = () => {
    ruleCounter++
    const meta = METRIC_META[newMetric]
    setRules(prev => [...prev, {
      id: `r${ruleCounter}`,
      metric: newMetric,
      threshold: newThreshold,
      severity: newSeverity,
      enabled: true,
    }])
    setNewThreshold(meta.defaultThreshold)
  }

  const removeRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id))
    setFiring(prev => prev.filter(f => f.ruleId !== id))
  }

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  const criticalCount = firing.filter(f => f.severity === 'critical' && f.state === 'firing').length
  const warningCount = firing.filter(f => f.severity === 'warning' && f.state === 'firing').length

  return (
    <div className="exercise-container">
      <h2>{t('task.16.3')}</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Настройте правила алертинга. Метрики симулируются автоматически — наблюдайте срабатывания
        в реальном времени.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Левая колонка: правила */}
        <div>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#444' }}>
            Правила алертинга ({rules.length})
          </h3>

          {/* Форма добавления */}
          <div style={{
            padding: '0.75rem',
            border: '2px dashed #d0d7de',
            borderRadius: '8px',
            marginBottom: '0.75rem',
            background: '#fafbfc',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Новое правило
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <select
                value={newMetric}
                onChange={e => {
                  const m = e.target.value as MetricId
                  setNewMetric(m)
                  setNewThreshold(METRIC_META[m].defaultThreshold)
                }}
                style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.82rem' }}
              >
                {(Object.keys(METRIC_META) as MetricId[]).map(m => (
                  <option key={m} value={m}>{METRIC_META[m].label}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#666' }}>Порог:</span>
                <input
                  type="number"
                  value={newThreshold}
                  min={METRIC_META[newMetric].min}
                  max={METRIC_META[newMetric].max}
                  step={METRIC_META[newMetric].step}
                  onChange={e => setNewThreshold(Number(e.target.value))}
                  style={{ flex: 1, padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.82rem' }}
                />
                <span style={{ fontSize: '0.78rem', color: '#888' }}>{METRIC_META[newMetric].unit}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {(['warning', 'critical'] as Severity[]).map(sev => (
                  <button
                    key={sev}
                    onClick={() => setNewSeverity(sev)}
                    style={{
                      flex: 1,
                      padding: '0.25rem',
                      border: `2px solid ${SEVERITY_COLORS[sev]}`,
                      borderRadius: '4px',
                      background: newSeverity === sev ? SEVERITY_COLORS[sev] : '#fff',
                      color: newSeverity === sev ? '#fff' : SEVERITY_COLORS[sev],
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                    }}
                  >
                    {sev}
                  </button>
                ))}
              </div>
              <button
                onClick={addRule}
                style={{
                  padding: '0.35rem',
                  background: '#4f86f7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                }}
              >
                + Добавить правило
              </button>
            </div>
          </div>

          {/* Список правил */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {rules.map(rule => {
              const meta = METRIC_META[rule.metric]
              const currentVal = simValues[rule.metric]
              const isFiring = firing.some(f => f.ruleId === rule.id && f.state === 'firing')
              return (
                <div
                  key={rule.id}
                  style={{
                    padding: '0.6rem 0.75rem',
                    border: `1.5px solid ${isFiring && rule.enabled ? SEVERITY_COLORS[rule.severity] : '#e2e8f0'}`,
                    borderRadius: '7px',
                    background: isFiring && rule.enabled ? `${SEVERITY_COLORS[rule.severity]}08` : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Переключатель */}
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{meta.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#888' }}>
                      &gt; {rule.threshold} {meta.unit} → {' '}
                      <span style={{ color: SEVERITY_COLORS[rule.severity], fontWeight: 700 }}>
                        {rule.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#888' }}>
                    сейчас: <strong style={{ color: isFiring ? SEVERITY_COLORS[rule.severity] : '#333' }}>
                      {currentVal}{meta.unit === '%' ? '%' : ''}
                    </strong>
                  </div>
                  {isFiring && rule.enabled && (
                    <span style={{
                      padding: '0.1rem 0.35rem',
                      background: SEVERITY_COLORS[rule.severity],
                      color: '#fff',
                      borderRadius: '3px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      animation: 'pulse 1s ease-in-out infinite',
                    }}>
                      FIRING
                    </span>
                  )}
                  <button
                    onClick={() => removeRule(rule.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ccc',
                      fontSize: '1rem',
                      lineHeight: 1,
                      padding: '0 2px',
                    }}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Правая колонка: дашборд */}
        <div>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#444' }}>
            Active Alerts
          </h3>

          {/* Summary */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              flex: 1,
              padding: '0.75rem',
              background: criticalCount > 0 ? '#fff5f5' : '#f0fff4',
              border: `1.5px solid ${criticalCount > 0 ? '#e53e3e' : '#68d391'}`,
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: criticalCount > 0 ? '#e53e3e' : '#38a169' }}>
                {criticalCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>CRITICAL</div>
            </div>
            <div style={{
              flex: 1,
              padding: '0.75rem',
              background: warningCount > 0 ? '#fffaf0' : '#f0fff4',
              border: `1.5px solid ${warningCount > 0 ? '#ed8936' : '#68d391'}`,
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: warningCount > 0 ? '#ed8936' : '#38a169' }}>
                {warningCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>WARNING</div>
            </div>
          </div>

          {/* Текущие значения метрик */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Текущие метрики
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {(Object.keys(METRIC_META) as MetricId[]).map(metric => {
                const meta = METRIC_META[metric]
                const val = simValues[metric]
                const relatedRules = rules.filter(r => r.enabled && r.metric === metric)
                const maxThreshold = relatedRules.reduce((max, r) => Math.max(max, r.threshold), meta.max)
                const pct = Math.min((val / maxThreshold) * 100, 100)
                const isCritical = relatedRules.filter(r => r.severity === 'critical').some(r => val > r.threshold)
                const isWarning = !isCritical && relatedRules.filter(r => r.severity === 'warning').some(r => val > r.threshold)
                const barColor = isCritical ? '#e53e3e' : isWarning ? '#ed8936' : '#38a169'

                return (
                  <div key={metric}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '2px' }}>
                      <span style={{ color: '#555' }}>{meta.label}</span>
                      <span style={{ fontWeight: 600, color: barColor, fontFamily: 'monospace' }}>
                        {val} {meta.unit}
                      </span>
                    </div>
                    <div style={{ height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: barColor,
                        borderRadius: '3px',
                        transition: 'width 0.4s ease, background 0.4s ease',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Список firing alerts */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Алерты
            </div>
            {firing.length === 0 ? (
              <div style={{
                padding: '1rem',
                background: '#f0fff4',
                border: '1px solid #68d391',
                borderRadius: '8px',
                color: '#276749',
                fontSize: '0.82rem',
                textAlign: 'center',
              }}>
                Все метрики в норме
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {firing.map((alert, i) => {
                  const meta = METRIC_META[alert.metric]
                  const color = SEVERITY_COLORS[alert.severity]
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: `1.5px solid ${color}`,
                        borderLeft: `4px solid ${color}`,
                        borderRadius: '6px',
                        background: alert.state === 'resolved' ? '#f9f9f9' : `${color}08`,
                        opacity: alert.state === 'resolved' ? 0.6 : 1,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color }}>
                          [{alert.severity.toUpperCase()}] {meta.label}
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '3px',
                          background: alert.state === 'resolved' ? '#68d391' : color,
                          color: '#fff',
                          fontWeight: 700,
                        }}>
                          {alert.state === 'resolved' ? 'RESOLVED' : 'FIRING'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#666', marginTop: '0.2rem' }}>
                        {alert.currentValue} {meta.unit} &gt; порог {alert.threshold} {meta.unit}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#999' }}>
        Метрики симулируются каждые 2 секунды. Добавьте правила и наблюдайте срабатывания.
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
