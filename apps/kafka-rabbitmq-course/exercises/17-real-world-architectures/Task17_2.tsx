import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 17.2: Централизованное логирование
// ============================================================
//
// Goal: simulate a centralized logging pipeline based on ELK + Kafka.
// Microservices write logs to individual Kafka topics (logs.service-name).
// Logstash consumes them and indexes into Elasticsearch.
// The user sees a live Kibana-style log stream with filters.

// TODO: Define the LogEntry interface.
// Fields: id: number, service: string, level: 'INFO' | 'WARN' | 'ERROR',
//         message: string, topic: string, partition: number, timestamp: string
// interface LogEntry { ... }

// TODO: Declare SERVICES_LOG: string[] — 5 service names:
// 'api-gateway', 'order-service', 'payment-service',
// 'inventory-service', 'notification-service'
// const SERVICES_LOG = [...]

// TODO: Declare SERVICE_COLORS: Record<string, string>
// Each service gets its own distinct color.
// const SERVICE_COLORS: Record<string, string> = { ... }

// TODO: Declare LOG_TEMPLATES — array of 12 objects { service, level, message }
// Include realistic messages: HTTP requests, order creation, payment errors,
// low stock warnings, email send, etc.
// const LOG_TEMPLATES = [...]

// TODO: Declare LEVEL_COLORS: Record<string, string>
// INFO → '#38a169' (green), WARN → '#d69e2e' (yellow), ERROR → '#e53e3e' (red)
// const LEVEL_COLORS: Record<string, string> = { ... }

// TODO: Implement getPartition(service: string): number
// Returns SERVICES_LOG.indexOf(service) % 3
// function getPartition(service: string): number { ... }

// TODO: Implement genTimestamp(): string
// Returns current time as 'HH:MM:SS.mmm' (12 chars from new Date().toISOString().slice(11, 23))
// function genTimestamp(): string { ... }

export function Task17_2() {
  const { t } = useLanguage()

  // TODO: Declare state:
  // logs: LogEntry[] — current log entries (initial: [])
  // streaming: boolean — whether the interval is running (initial: false)
  // searchTerm: string — text search filter (initial: '')
  // filterLevel: 'ALL' | 'INFO' | 'WARN' | 'ERROR' (initial: 'ALL')
  // filterService: string (initial: 'ALL')
  // totalConsumed: number — total events processed (initial: 0)
  // counterRef via useRef(0) — cycles through LOG_TEMPLATES
  // timerRef via useRef<ReturnType<typeof setInterval> | null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [streaming, setStreaming] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL')
  const [filterService, setFilterService] = useState('ALL')
  const [totalConsumed, setTotalConsumed] = useState(0)
  const counterRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // TODO: Implement startStreaming:
  // Guard: if already streaming, return.
  // Set streaming to true.
  // Start setInterval every 700ms:
  //   - Pick template = LOG_TEMPLATES[counterRef.current % LOG_TEMPLATES.length]
  //   - Increment counterRef.current
  //   - Build LogEntry: { id: counterRef.current, service, level, message,
  //       topic: `logs.${template.service}`, partition: getPartition(template.service),
  //       timestamp: genTimestamp() }
  //   - Prepend to logs (keep at most 60 entries): setLogs(prev => [entry, ...prev].slice(0, 60))
  //   - Increment totalConsumed
  const startStreaming = () => {
    // TODO: implement
  }

  // TODO: Implement stopStreaming:
  // Set streaming to false and clear timerRef.
  const stopStreaming = () => {
    // TODO: implement
  }

  // TODO: Implement clearLogs:
  // Call stopStreaming, then reset logs to [], totalConsumed to 0, counterRef.current to 0.
  const clearLogs = () => {
    // TODO: implement
  }

  // TODO: Add useEffect cleanup:
  // On unmount, clear timerRef to prevent memory leaks.
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  // TODO: Derive filteredLogs: LogEntry[]
  // Apply three simultaneous filters:
  //   1. filterLevel !== 'ALL' → log.level must match
  //   2. filterService !== 'ALL' → log.service must match
  //   3. searchTerm non-empty → log.message.toLowerCase().includes(searchTerm.toLowerCase())
  // const filteredLogs = logs.filter(...)

  // TODO: Compute topicCounts: Record<string, number>
  // Count how many entries exist per log.topic.
  // const topicCounts: Record<string, number> = {}
  // logs.forEach(l => { topicCounts[l.topic] = (topicCounts[l.topic] ?? 0) + 1 })

  // TODO: Compute levelCounts: { INFO: number; WARN: number; ERROR: number }
  // const levelCounts = { INFO: 0, WARN: 0, ERROR: 0 }
  // logs.forEach(l => { levelCounts[l.level] += 1 })

  return (
    <div className="exercise-container">
      <h2>{t('task.17.2')}</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Запусти поток логов. Каждый сервис пишет в свой Kafka topic (logs.service-name),
        consumer (Logstash) читает все топики и кладёт в Elasticsearch.
        Используй фильтры для поиска — это Kibana-style интерфейс.
      </p>

      {/* TODO: Pipeline visualization — horizontal row of colored badges:
          [api-gateway] [order-service] ... → [Kafka (logs.*)] → [Logstash] → [Elasticsearch] → [Kibana UI]
          Use SERVICE_COLORS for service badges. */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        background: '#f8f9fa',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        fontSize: '0.8rem',
        fontWeight: 600,
      }}>
        {/* TODO: render pipeline badges */}
      </div>

      {/* TODO: Kafka topics block — only render when logs.length > 0.
          Show topicCounts: for each topic a badge with service color, topic name,
          message count, and partition number (via getPartition). */}

      {/* TODO: Stats row — four colored boxes:
          INFO count (green), WARN count (yellow), ERROR count (red),
          "Всего в Elasticsearch: totalConsumed" (grey) */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* TODO: render stats */}
      </div>

      {/* TODO: Kibana-style filter panel (dark background #1a1a2e):
          - Text input for searchTerm (placeholder "Search logs...")
          - <select> for filterLevel: ALL, INFO, WARN, ERROR
          - <select> for filterService: ALL, then each of SERVICES_LOG */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '0.75rem',
        flexWrap: 'wrap',
        padding: '0.75rem',
        background: '#1a1a2e',
        borderRadius: '8px',
      }}>
        {/* TODO: render filters */}
      </div>

      {/* TODO: Log stream — dark terminal block (background #0d0d0d).
          Render filteredLogs. Each row: timestamp | LEVEL | [service] | message
          Color each part: timestamp → '#666', level → LEVEL_COLORS[level],
          service → SERVICE_COLORS[service], message → '#d0d0d0'.
          First row (idx === 0) has background '#1a1a1a'.
          If filteredLogs is empty: show placeholder text. */}
      <div style={{
        background: '#0d0d0d',
        borderRadius: '8px',
        minHeight: '220px',
        maxHeight: '320px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.77rem',
        padding: '0.5rem',
        border: '1px solid #333',
      }}>
        {/* TODO: render log entries */}
      </div>

      {/* TODO: Controls row:
          - Toggle button: "Запустить поток логов" (green) / "Остановить поток" (red)
            — calls startStreaming or stopStreaming based on streaming state
          - Button "Очистить" (grey) → calls clearLogs */}
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
        {/* TODO: render controls */}
      </div>
    </div>
  )
}
