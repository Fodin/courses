import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 1.1: REST vs gRPC Simulator — Solution
// ============================================

type Protocol = 'REST' | 'gRPC'

interface RequestStats {
  protocol: Protocol
  latency: number
  payloadSize: number
  overhead: number
  encoding: string
  transport: string
}

const PROTOCOL_STATS: Record<Protocol, RequestStats> = {
  REST: {
    protocol: 'REST',
    latency: 45,
    payloadSize: 1240,
    overhead: 840,
    encoding: 'JSON (text)',
    transport: 'HTTP/1.1',
  },
  gRPC: {
    protocol: 'gRPC',
    latency: 12,
    payloadSize: 320,
    overhead: 80,
    encoding: 'Protobuf (binary)',
    transport: 'HTTP/2',
  },
}

interface LogEntry {
  id: number
  protocol: Protocol
  direction: 'request' | 'response'
  message: string
  time: number
}

const REST_REQUEST = `POST /api/v1/users HTTP/1.1
Host: user-service:8080
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
X-Request-ID: 7f3a2b1c-4d5e-6f7a
X-Correlation-ID: order-svc-req-001
User-Agent: order-service/1.0

{
  "id": "usr_42",
  "name": "Alice",
  "email": "alice@example.com",
  "address": {
    "city": "Moscow",
    "zip": "101000"
  }
}`

const REST_RESPONSE = `HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 248
X-Request-ID: 7f3a2b1c-4d5e-6f7a
Cache-Control: no-store

{
  "status": "success",
  "data": {
    "id": "usr_42",
    "name": "Alice",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}`

const GRPC_REQUEST = `// user.proto
message CreateUserRequest {
  string id    = 1;  // "usr_42"    → 7 bytes
  string name  = 2;  // "Alice"     → 7 bytes
  string email = 3;  // "alice@..." → 22 bytes
}

// Binary frame (HTTP/2):
// [00][00][28][00][00][00][00][00][01]
//  flags  length  stream_id
// 0x0A 06 75 73 72 5F 34 32  (field 1: "usr_42")
// 0x12 05 41 6C 69 63 65      (field 2: "Alice")
// 0x1A 11 61 6C 69 63 65 40  (field 3: email...)

Payload: 40 bytes vs JSON 248 bytes`

const GRPC_RESPONSE = `// user.proto
message CreateUserResponse {
  string id         = 1;
  string name       = 2;
  string created_at = 3;
}

// Binary frame:
// 0x0A 06 75 73 72 5F 34 32  (id)
// 0x12 05 41 6C 69 63 65      (name)
// 0x1A 14 32 30 32 34 2D...  (timestamp)

Payload: 38 bytes vs JSON 120 bytes
Status: grpc-status: 0 (OK)`

export function Task1_1_Solution() {
  const { t } = useLanguage()
  const [protocol, setProtocol] = useState<Protocol>('REST')
  const [isAnimating, setIsAnimating] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [phase, setPhase] = useState<'idle' | 'requesting' | 'processing' | 'responding' | 'done'>('idle')
  const logIdRef = useRef(0)

  const stats = PROTOCOL_STATS[protocol]

  const addLog = (direction: 'request' | 'response', message: string, time: number) => {
    logIdRef.current += 1
    setLogs(prev => [...prev, { id: logIdRef.current, protocol, direction, message, time }])
  }

  const runSimulation = async () => {
    if (isAnimating) return
    setIsAnimating(true)
    setLogs([])
    setPhase('requesting')

    await new Promise(r => setTimeout(r, 600))
    addLog('request', protocol === 'REST' ? REST_REQUEST : GRPC_REQUEST, 0)
    setPhase('processing')

    await new Promise(r => setTimeout(r, stats.latency * 8))
    setPhase('responding')

    await new Promise(r => setTimeout(r, 400))
    addLog('response', protocol === 'REST' ? REST_RESPONSE : GRPC_RESPONSE, stats.latency)
    setPhase('done')
    setIsAnimating(false)
  }

  const boxStyle = (color: string): React.CSSProperties => ({
    background: color,
    borderRadius: 10,
    padding: '12px 20px',
    fontWeight: 700,
    fontSize: 15,
    color: '#fff',
    minWidth: 120,
    textAlign: 'center',
  })

  const arrowStyle: React.CSSProperties = {
    fontSize: 22,
    color: '#888',
    alignSelf: 'center',
    transition: 'color 0.3s',
  }

  const phaseColor: Record<string, string> = {
    requesting: '#f59e0b',
    processing: '#3b82f6',
    responding: '#10b981',
    done: '#6b7280',
    idle: '#6b7280',
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.1.1')}</h2>

      {/* Protocol Switcher */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {(['REST', 'gRPC'] as Protocol[]).map(p => (
          <button
            key={p}
            onClick={() => { setProtocol(p); setLogs([]); setPhase('idle') }}
            style={{
              padding: '8px 24px',
              borderRadius: 8,
              border: '2px solid',
              borderColor: protocol === p ? (p === 'REST' ? '#f59e0b' : '#3b82f6') : '#444',
              background: protocol === p ? (p === 'REST' ? '#f59e0b' : '#3b82f6') : 'transparent',
              color: protocol === p ? '#fff' : '#aaa',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Services diagram */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={boxStyle('#6366f1')}>Order Service</div>
        <div style={arrowStyle}>
          {phase === 'requesting' ? '→→→' : phase === 'responding' ? '←←←' : '→'}
        </div>
        <div style={boxStyle(phase === 'processing' ? '#3b82f6' : '#10b981')}>
          User Service
          {phase === 'processing' && <div style={{ fontSize: 11, fontWeight: 400 }}>обрабатывает...</div>}
        </div>
      </div>

      {/* Status */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 16px', borderRadius: 20,
        background: phaseColor[phase] + '22',
        border: `1px solid ${phaseColor[phase]}`,
        color: phaseColor[phase],
        fontWeight: 600, fontSize: 13, marginBottom: 20,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: phaseColor[phase], display: 'inline-block' }} />
        {phase === 'idle' && 'Готов к запросу'}
        {phase === 'requesting' && `Отправка ${protocol} запроса...`}
        {phase === 'processing' && 'User Service обрабатывает...'}
        {phase === 'responding' && 'Получение ответа...'}
        {phase === 'done' && `Завершено за ${stats.latency}ms`}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Протокол', value: stats.protocol, color: '#6366f1' },
          { label: 'Transport', value: stats.transport, color: '#8b5cf6' },
          { label: 'Encoding', value: stats.encoding, color: '#ec4899' },
          { label: 'Latency', value: `${stats.latency}ms`, color: '#10b981' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#1e1e2e', borderRadius: 8, padding: '10px 14px',
            borderLeft: `3px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Latency bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
          Размер payload и overhead (байты)
        </div>
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#aaa', marginBottom: 3 }}>
            <span>Полезная нагрузка</span>
            <span>{stats.payloadSize - stats.overhead} bytes</span>
          </div>
          <div style={{ height: 12, background: '#333', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 6, background: '#10b981',
              width: `${((stats.payloadSize - stats.overhead) / 1300) * 100}%`,
              transition: 'width 0.5s',
            }} />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#aaa', marginBottom: 3 }}>
            <span>Overhead (headers, metadata)</span>
            <span>{stats.overhead} bytes</span>
          </div>
          <div style={{ height: 12, background: '#333', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 6, background: '#f59e0b',
              width: `${(stats.overhead / 1300) * 100}%`,
              transition: 'width 0.5s',
            }} />
          </div>
        </div>
      </div>

      {/* Run button */}
      <button
        onClick={runSimulation}
        disabled={isAnimating}
        style={{
          padding: '10px 28px', borderRadius: 8,
          background: isAnimating ? '#333' : '#6366f1',
          color: isAnimating ? '#666' : '#fff',
          border: 'none', fontWeight: 700, fontSize: 14, cursor: isAnimating ? 'not-allowed' : 'pointer',
          marginBottom: 20,
        }}
      >
        {isAnimating ? 'Симуляция...' : `Отправить ${protocol} запрос`}
      </button>

      {/* Log output */}
      {logs.map(log => (
        <div key={log.id} style={{
          background: '#0d1117', borderRadius: 8, padding: 16, marginBottom: 12,
          border: `1px solid ${log.direction === 'request' ? '#f59e0b' : '#10b981'}`,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: 8, fontSize: 12,
          }}>
            <span style={{ color: log.direction === 'request' ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
              {log.direction === 'request' ? `→ ${log.protocol} Request` : `← ${log.protocol} Response`}
            </span>
            {log.time > 0 && <span style={{ color: '#10b981' }}>+{log.time}ms</span>}
          </div>
          <pre style={{ margin: 0, fontSize: 11, color: '#e2e8f0', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {log.message}
          </pre>
        </div>
      ))}
    </div>
  )
}

// ============================================
// Task 1.2: Cascading Failures — Solution
// ============================================

type ServiceName = 'Client' | 'Service A' | 'Service B' | 'Service C' | 'Service D'
type ServiceStatus = 'healthy' | 'failed' | 'timeout' | 'open'

interface Service {
  name: ServiceName
  status: ServiceStatus
  responseTime: number
  circuitOpen: boolean
}

const INITIAL_SERVICES: Service[] = [
  { name: 'Client', status: 'healthy', responseTime: 5, circuitOpen: false },
  { name: 'Service A', status: 'healthy', responseTime: 15, circuitOpen: false },
  { name: 'Service B', status: 'healthy', responseTime: 20, circuitOpen: false },
  { name: 'Service C', status: 'healthy', responseTime: 25, circuitOpen: false },
  { name: 'Service D', status: 'healthy', responseTime: 10, circuitOpen: false },
]

export function Task1_2_Solution() {
  const { t } = useLanguage()
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES.map(s => ({ ...s })))
  const [circuitBreakerEnabled, setCircuitBreakerEnabled] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const [totalTime, setTotalTime] = useState<number | null>(null)

  const reset = () => {
    setServices(INITIAL_SERVICES.map(s => ({ ...s })))
    setLog([])
    setTotalTime(null)
    setIsSimulating(false)
  }

  const failService = (index: number) => {
    setServices(prev => prev.map((s, i) =>
      i === index ? { ...s, status: 'failed' } : s
    ))
    setLog([])
    setTotalTime(null)
  }

  const simulateCascade = async () => {
    if (isSimulating) return
    setIsSimulating(true)
    setLog([])
    setTotalTime(null)

    const timeout = 3000
    const newLog: string[] = []
    let total = 0

    const failedIndex = services.findIndex(s => s.status === 'failed')
    if (failedIndex === -1) {
      newLog.push('Все сервисы здоровы — запрос выполнен успешно!')
      setLog([...newLog])
      setTotalTime(55)
      setIsSimulating(false)
      return
    }

    newLog.push('[ Client ] → Отправка запроса к Service A...')
    setLog([...newLog])
    await new Promise(r => setTimeout(r, 500))

    for (let i = 1; i < services.length; i++) {
      const svc = services[i]

      if (svc.status === 'failed') {
        if (circuitBreakerEnabled && svc.circuitOpen) {
          newLog.push(`[ ${svc.name} ] ⚡ Circuit Breaker OPEN — быстрый отказ (0ms)`)
          setLog([...newLog])
          setServices(prev => prev.map((s, idx) =>
            idx >= i ? { ...s, status: 'open' } : s
          ))
          total += 0
          break
        }

        newLog.push(`[ ${svc.name} ] ❌ Сервис недоступен — ожидание таймаута (${timeout}ms)...`)
        setLog([...newLog])
        await new Promise(r => setTimeout(r, 800))

        total += timeout
        newLog.push(`[ ${svc.name} ] ⏱ Таймаут истёк! Распространение ошибки вверх...`)
        setLog([...newLog])

        // Cascade upstream
        setServices(prev => prev.map((s, idx) =>
          idx <= i && idx > 0 ? { ...s, status: 'timeout' } : s
        ))

        if (circuitBreakerEnabled) {
          setServices(prev => prev.map((s, idx) =>
            idx === i ? { ...s, circuitOpen: true } : s
          ))
          newLog.push(`[ ${svc.name} ] 🔌 Circuit Breaker переходит в OPEN состояние`)
          setLog([...newLog])
        }

        await new Promise(r => setTimeout(r, 400))
        for (let j = i - 1; j >= 0; j--) {
          newLog.push(`[ ${services[j].name} ] ↩ Получен timeout от downstream сервиса`)
          setLog([...newLog])
          total += timeout
          await new Promise(r => setTimeout(r, 300))
        }
        break
      } else {
        newLog.push(`[ ${svc.name} ] ✅ Успешно (${svc.responseTime}ms)`)
        setLog([...newLog])
        total += svc.responseTime
        await new Promise(r => setTimeout(r, 300))
      }
    }

    setTotalTime(total)
    setIsSimulating(false)
  }

  const statusColor: Record<ServiceStatus, string> = {
    healthy: '#10b981',
    failed: '#ef4444',
    timeout: '#f59e0b',
    open: '#6366f1',
  }

  const statusLabel: Record<ServiceStatus, string> = {
    healthy: 'Healthy',
    failed: 'FAILED',
    timeout: 'TIMEOUT',
    open: 'CB Open',
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.1.2')}</h2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        <button
          onClick={simulateCascade}
          disabled={isSimulating}
          style={{
            padding: '9px 22px', borderRadius: 8,
            background: isSimulating ? '#333' : '#6366f1',
            color: isSimulating ? '#666' : '#fff',
            border: 'none', fontWeight: 700, cursor: isSimulating ? 'not-allowed' : 'pointer',
          }}
        >
          {isSimulating ? 'Симуляция...' : 'Симулировать запрос'}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '9px 22px', borderRadius: 8,
            background: 'transparent', color: '#aaa',
            border: '1px solid #444', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Сброс
        </button>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#e2e8f0' }}>
          <div
            onClick={() => setCircuitBreakerEnabled(v => !v)}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: circuitBreakerEnabled ? '#10b981' : '#555',
              position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
            }}
          >
            <div style={{
              position: 'absolute', top: 3, left: circuitBreakerEnabled ? 23 : 3,
              width: 18, height: 18, borderRadius: '50%', background: '#fff',
              transition: 'left 0.2s',
            }} />
          </div>
          <span style={{ fontWeight: 600, color: circuitBreakerEnabled ? '#10b981' : '#888' }}>
            Circuit Breaker {circuitBreakerEnabled ? 'ON' : 'OFF'}
          </span>
        </label>
      </div>

      {/* Services chain */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
        {services.map((svc, i) => (
          <div key={svc.name} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <div style={{
                background: statusColor[svc.status] + '22',
                border: `2px solid ${statusColor[svc.status]}`,
                borderRadius: 10, padding: '10px 16px', textAlign: 'center',
                minWidth: 90, transition: 'all 0.4s',
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#e2e8f0' }}>{svc.name}</div>
                <div style={{ fontSize: 11, color: statusColor[svc.status], fontWeight: 600, marginTop: 2 }}>
                  {statusLabel[svc.status]}
                </div>
                <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{svc.responseTime}ms</div>
              </div>
              {i > 0 && svc.status === 'healthy' && (
                <button
                  onClick={() => failService(i)}
                  style={{
                    fontSize: 10, padding: '3px 10px', borderRadius: 6,
                    background: '#ef444422', border: '1px solid #ef4444',
                    color: '#ef4444', cursor: 'pointer',
                  }}
                >
                  Отказ
                </button>
              )}
            </div>
            {i < services.length - 1 && (
              <div style={{ fontSize: 18, color: '#555', margin: '0 4px', paddingBottom: 28 }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* Total time */}
      {totalTime !== null && (
        <div style={{
          padding: '10px 20px', borderRadius: 8, marginBottom: 16,
          background: totalTime > 5000 ? '#ef444422' : '#10b98122',
          border: `1px solid ${totalTime > 5000 ? '#ef4444' : '#10b981'}`,
          color: totalTime > 5000 ? '#ef4444' : '#10b981',
          fontWeight: 700,
        }}>
          Суммарное время ожидания: {totalTime}ms
          {totalTime > 5000 && ' — Каскадный отказ!'}
          {totalTime <= 100 && ' — Circuit Breaker предотвратил каскад!'}
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div style={{
          background: '#0d1117', borderRadius: 8, padding: 16,
          border: '1px solid #30363d', maxHeight: 280, overflowY: 'auto',
        }}>
          {log.map((entry, i) => (
            <div key={i} style={{
              fontFamily: 'monospace', fontSize: 12, color: '#e2e8f0',
              padding: '3px 0', borderBottom: i < log.length - 1 ? '1px solid #1e2430' : 'none',
            }}>
              {entry}
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {Object.entries(statusColor).map(([status, color]) => (
          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            <span style={{ color: '#aaa' }}>{statusLabel[status as ServiceStatus]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Task 1.3: Service Discovery — Solution
// ============================================

interface ServiceInstance {
  id: string
  name: string
  host: string
  port: number
  status: 'healthy' | 'unhealthy' | 'unknown'
  lastCheck: number
  responseTime: number
  requests: number
}

const SERVICE_TEMPLATES = [
  { name: 'user-service', basePort: 8001 },
  { name: 'order-service', basePort: 8101 },
  { name: 'payment-service', basePort: 8201 },
]

let instanceCounter = 10

function makeInstance(templateIndex: number): ServiceInstance {
  instanceCounter += 1
  const tmpl = SERVICE_TEMPLATES[templateIndex]
  return {
    id: `inst-${instanceCounter}`,
    name: tmpl.name,
    host: `10.0.${templateIndex}.${instanceCounter % 254}`,
    port: tmpl.basePort + (instanceCounter % 10),
    status: 'unknown',
    lastCheck: Date.now(),
    responseTime: 0,
    requests: 0,
  }
}

export function Task1_3_Solution() {
  const { t } = useLanguage()
  const [instances, setInstances] = useState<ServiceInstance[]>([
    { id: 'inst-1', name: 'user-service', host: '10.0.0.1', port: 8001, status: 'healthy', lastCheck: Date.now(), responseTime: 12, requests: 0 },
    { id: 'inst-2', name: 'user-service', host: '10.0.0.2', port: 8002, status: 'healthy', lastCheck: Date.now(), responseTime: 18, requests: 0 },
    { id: 'inst-3', name: 'order-service', host: '10.0.1.1', port: 8101, status: 'healthy', lastCheck: Date.now(), responseTime: 22, requests: 0 },
    { id: 'inst-4', name: 'payment-service', host: '10.0.2.1', port: 8201, status: 'healthy', lastCheck: Date.now(), responseTime: 35, requests: 0 },
  ])
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [lbLog, setLbLog] = useState<string[]>([])
  const [selectedService, setSelectedService] = useState('user-service')
  const [rrIndex, setRrIndex] = useState(0)
  const [isChecking, setIsChecking] = useState(false)

  // Health check simulation
  const runHealthChecks = async () => {
    if (isChecking) return
    setIsChecking(true)
    setInstances(prev => prev.map(inst => ({ ...inst, status: 'unknown' })))
    await new Promise(r => setTimeout(r, 400))

    setInstances(prev => prev.map(inst => {
      // Simulate: unhealthy instances have 20% chance to recover, healthy have 10% to fail
      let newStatus: 'healthy' | 'unhealthy'
      if (inst.status === 'unhealthy') {
        newStatus = Math.random() > 0.7 ? 'healthy' : 'unhealthy'
      } else {
        newStatus = Math.random() > 0.15 ? 'healthy' : 'unhealthy'
      }
      return {
        ...inst,
        status: newStatus,
        lastCheck: Date.now(),
        responseTime: newStatus === 'healthy' ? Math.floor(Math.random() * 40) + 8 : 0,
      }
    }))
    setIsChecking(false)
  }

  const registerInstance = () => {
    const inst = makeInstance(selectedTemplate)
    setInstances(prev => [...prev, inst])
  }

  const deregisterInstance = (id: string) => {
    setInstances(prev => prev.filter(i => i.id !== id))
  }

  const sendRequest = () => {
    const healthy = instances.filter(i => i.name === selectedService && i.status === 'healthy')
    if (healthy.length === 0) {
      setLbLog(prev => [`[${new Date().toLocaleTimeString()}] ERROR: Нет доступных инстансов для ${selectedService}`, ...prev.slice(0, 19)])
      return
    }

    // Round-robin
    const idx = rrIndex % healthy.length
    const target = healthy[idx]
    setRrIndex(v => v + 1)

    setInstances(prev => prev.map(i =>
      i.id === target.id ? { ...i, requests: i.requests + 1 } : i
    ))

    setLbLog(prev => [
      `[${new Date().toLocaleTimeString()}] ${selectedService} → ${target.host}:${target.port} (${target.responseTime}ms)`,
      ...prev.slice(0, 19),
    ])
  }

  const statusColor: Record<string, string> = {
    healthy: '#10b981',
    unhealthy: '#ef4444',
    unknown: '#f59e0b',
  }

  const groupedByName = SERVICE_TEMPLATES.map(t => ({
    name: t.name,
    instances: instances.filter(i => i.name === t.name),
  }))

  return (
    <div className="exercise-container">
      <h2>{t('task.1.3')}</h2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        <select
          value={selectedTemplate}
          onChange={e => setSelectedTemplate(Number(e.target.value))}
          style={{
            padding: '8px 12px', borderRadius: 8, background: '#1e1e2e',
            color: '#e2e8f0', border: '1px solid #444', fontSize: 13,
          }}
        >
          {SERVICE_TEMPLATES.map((t, i) => (
            <option key={t.name} value={i}>{t.name}</option>
          ))}
        </select>
        <button
          onClick={registerInstance}
          style={{
            padding: '8px 18px', borderRadius: 8,
            background: '#10b981', color: '#fff',
            border: 'none', fontWeight: 700, cursor: 'pointer',
          }}
        >
          + Регистрация инстанса
        </button>
        <button
          onClick={runHealthChecks}
          disabled={isChecking}
          style={{
            padding: '8px 18px', borderRadius: 8,
            background: isChecking ? '#333' : '#3b82f6',
            color: isChecking ? '#666' : '#fff',
            border: 'none', fontWeight: 700, cursor: isChecking ? 'not-allowed' : 'pointer',
          }}
        >
          {isChecking ? 'Проверка...' : 'Health Check'}
        </button>
      </div>

      {/* Service Registry */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: 12, fontSize: 15 }}>
          Service Registry
        </div>
        {groupedByName.map(group => (
          <div key={group.name} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 700, marginBottom: 6 }}>
              {group.name}
            </div>
            {group.instances.length === 0 ? (
              <div style={{ fontSize: 12, color: '#555', fontStyle: 'italic' }}>Нет инстансов</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {group.instances.map(inst => (
                  <div key={inst.id} style={{
                    background: '#1e1e2e',
                    border: `1px solid ${statusColor[inst.status]}44`,
                    borderRadius: 8, padding: '8px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: statusColor[inst.status],
                      boxShadow: inst.status === 'healthy' ? `0 0 6px ${statusColor[inst.status]}` : 'none',
                    }} />
                    <div>
                      <div style={{ fontSize: 12, color: '#e2e8f0', fontFamily: 'monospace' }}>
                        {inst.host}:{inst.port}
                      </div>
                      <div style={{ fontSize: 10, color: '#666' }}>
                        {inst.status === 'healthy' ? `${inst.responseTime}ms` : inst.status}
                        {inst.requests > 0 && ` · ${inst.requests} req`}
                      </div>
                    </div>
                    <button
                      onClick={() => deregisterInstance(inst.id)}
                      style={{
                        background: 'transparent', border: 'none',
                        color: '#ef4444', cursor: 'pointer', fontSize: 14, padding: 2,
                      }}
                      title="Дерегистрировать"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load Balancer */}
      <div style={{
        background: '#1e1e2e', borderRadius: 10, padding: 16,
        border: '1px solid #30363d', marginBottom: 20,
      }}>
        <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: 12 }}>
          Load Balancer (Round-Robin)
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
            style={{
              padding: '7px 12px', borderRadius: 8, background: '#0d1117',
              color: '#e2e8f0', border: '1px solid #444', fontSize: 13,
            }}
          >
            {SERVICE_TEMPLATES.map(t => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
          <button
            onClick={sendRequest}
            style={{
              padding: '7px 18px', borderRadius: 8,
              background: '#f59e0b', color: '#000',
              border: 'none', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Маршрутизировать запрос
          </button>
        </div>

        {lbLog.length > 0 && (
          <div style={{
            marginTop: 12, background: '#0d1117', borderRadius: 6, padding: 10,
            maxHeight: 140, overflowY: 'auto',
          }}>
            {lbLog.map((entry, i) => (
              <div key={i} style={{
                fontFamily: 'monospace', fontSize: 11,
                color: entry.startsWith('[') && entry.includes('ERROR') ? '#ef4444' : '#10b981',
                padding: '2px 0',
              }}>
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Всего инстансов', value: instances.length, color: '#6366f1' },
          { label: 'Healthy', value: instances.filter(i => i.status === 'healthy').length, color: '#10b981' },
          { label: 'Unhealthy', value: instances.filter(i => i.status === 'unhealthy').length, color: '#ef4444' },
          { label: 'Всего запросов', value: instances.reduce((a, i) => a + i.requests, 0), color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#1e1e2e', borderRadius: 8, padding: '10px 16px',
            borderLeft: `3px solid ${s.color}`, minWidth: 120,
          }}>
            <div style={{ fontSize: 11, color: '#888' }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
