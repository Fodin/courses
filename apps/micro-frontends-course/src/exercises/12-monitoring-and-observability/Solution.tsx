import { useState, useCallback, useRef } from 'react'

// =====================================================
// Task 12.1: Error Boundary & Circuit Breaker Simulator
// =====================================================

type MfeId = 'catalog' | 'cart' | 'profile'
type CircuitState = 'closed' | 'open' | 'half-open'

type CircuitBreaker = {
  state: CircuitState
  errorCount: number
  threshold: number
  lastOpenedAt: number | null
  timeoutSec: number
}

type MfeConfig = {
  id: MfeId
  label: string
  team: string
  color: string
}

type ErrorLogEntry = {
  id: number
  timestamp: string
  mfe: string
  team: string
  message: string
  circuitState: CircuitState
}

const MFE_CONFIGS: MfeConfig[] = [
  { id: 'catalog', label: 'Каталог', team: 'team-catalog', color: '#26a69a' },
  { id: 'cart', label: 'Корзина', team: 'team-cart', color: '#ef5350' },
  { id: 'profile', label: 'Профиль', team: 'team-profile', color: '#ffa726' },
]

const CIRCUIT_COLORS: Record<CircuitState, string> = {
  closed: '#4caf50',
  open: '#f44336',
  'half-open': '#ff9800',
}

const CIRCUIT_LABELS: Record<CircuitState, string> = {
  closed: 'Closed',
  open: 'Open',
  'half-open': 'Half-Open',
}

const ERROR_MESSAGES = [
  'TypeError: Cannot read properties of undefined',
  'ChunkLoadError: Loading chunk failed',
  'NetworkError: Failed to fetch remote entry',
  'ReferenceError: module is not defined',
  'SyntaxError: Unexpected token in JSON',
]

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function Task12_1_Solution() {
  const [boundaryEnabled, setBoundaryEnabled] = useState(true)
  const [crashed, setCrashed] = useState(false)
  const [errorStates, setErrorStates] = useState<Record<MfeId, boolean>>({
    catalog: false,
    cart: false,
    profile: false,
  })
  const [circuits, setCircuits] = useState<Record<MfeId, CircuitBreaker>>({
    catalog: { state: 'closed', errorCount: 0, threshold: 3, lastOpenedAt: null, timeoutSec: 10 },
    cart: { state: 'closed', errorCount: 0, threshold: 3, lastOpenedAt: null, timeoutSec: 10 },
    profile: { state: 'closed', errorCount: 0, threshold: 3, lastOpenedAt: null, timeoutSec: 10 },
  })
  const [errorLog, setErrorLog] = useState<ErrorLogEntry[]>([])
  const logIdRef = useRef(0)

  const addLog = useCallback((mfeId: MfeId, msg: string, circuitState: CircuitState) => {
    const cfg = MFE_CONFIGS.find(m => m.id === mfeId)!
    logIdRef.current += 1
    setErrorLog(prev => [
      {
        id: logIdRef.current,
        timestamp: formatTime(Date.now()),
        mfe: cfg.label,
        team: cfg.team,
        message: msg,
        circuitState,
      },
      ...prev.slice(0, 19),
    ])
  }, [])

  const injectError = useCallback(
    (mfeId: MfeId) => {
      const circuit = circuits[mfeId]

      if (circuit.state === 'open') {
        addLog(mfeId, 'Circuit OPEN — запрос отклонён (fast fail)', 'open')
        return
      }

      const errMsg = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]

      if (!boundaryEnabled) {
        setCrashed(true)
        addLog(mfeId, errMsg + ' [ПОЛНЫЙ КРАШ ПРИЛОЖЕНИЯ]', circuit.state)
        return
      }

      const newCount = circuit.errorCount + 1
      let newState: CircuitState = circuit.state

      if (circuit.state === 'half-open') {
        newState = 'open'
        addLog(mfeId, errMsg + ' [Half-Open → Open]', 'open')
      } else if (newCount >= circuit.threshold) {
        newState = 'open'
        addLog(mfeId, errMsg + ` [Closed → Open после ${newCount} ошибок]`, 'open')
      } else {
        addLog(mfeId, errMsg, circuit.state)
      }

      setCircuits(prev => ({
        ...prev,
        [mfeId]: {
          ...prev[mfeId],
          errorCount: newCount,
          state: newState,
          lastOpenedAt: newState === 'open' ? Date.now() : prev[mfeId].lastOpenedAt,
        },
      }))

      setErrorStates(prev => ({ ...prev, [mfeId]: true }))
    },
    [boundaryEnabled, circuits, addLog],
  )

  const tryHalfOpen = useCallback(
    (mfeId: MfeId) => {
      const circuit = circuits[mfeId]
      if (circuit.state !== 'open') return

      const elapsed = circuit.lastOpenedAt ? (Date.now() - circuit.lastOpenedAt) / 1000 : 0
      if (elapsed < circuit.timeoutSec) {
        addLog(
          mfeId,
          `Circuit OPEN — подождите ещё ${Math.ceil(circuit.timeoutSec - elapsed)} сек`,
          'open',
        )
        return
      }

      setCircuits(prev => ({
        ...prev,
        [mfeId]: { ...prev[mfeId], state: 'half-open' },
      }))
      addLog(mfeId, 'Open → Half-Open (проба)', 'half-open')
    },
    [circuits, addLog],
  )

  const resetMfe = useCallback(
    (mfeId: MfeId) => {
      setCircuits(prev => ({
        ...prev,
        [mfeId]: { ...prev[mfeId], state: 'closed', errorCount: 0, lastOpenedAt: null },
      }))
      setErrorStates(prev => ({ ...prev, [mfeId]: false }))
      addLog(mfeId, 'MFE восстановлен (Half-Open → Closed)', 'closed')
    },
    [addLog],
  )

  const resetAll = useCallback(() => {
    setCrashed(false)
    setErrorStates({ catalog: false, cart: false, profile: false })
    setCircuits({
      catalog: { state: 'closed', errorCount: 0, threshold: 3, lastOpenedAt: null, timeoutSec: 10 },
      cart: { state: 'closed', errorCount: 0, threshold: 3, lastOpenedAt: null, timeoutSec: 10 },
      profile: { state: 'closed', errorCount: 0, threshold: 3, lastOpenedAt: null, timeoutSec: 10 },
    })
  }, [])

  const root: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    fontFamily: 'monospace',
    minHeight: '100vh',
    padding: '24px',
    boxSizing: 'border-box',
  }

  if (crashed) {
    return (
      <div
        style={{
          ...root,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a0000',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>💥</div>
        <div
          style={{ color: '#f44336', fontSize: 24, fontWeight: 700, marginBottom: 8 }}
        >
          Приложение упало
        </div>
        <div style={{ color: '#ef9a9a', marginBottom: 24, textAlign: 'center' }}>
          Ошибка в MFE распространилась на весь Shell.
          <br />
          Без Error Boundary — один сбойный MFE кладёт всё приложение.
        </div>
        <button
          onClick={resetAll}
          style={{
            background: '#f44336',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 24px',
            cursor: 'pointer',
            fontSize: 14,
            fontFamily: 'monospace',
          }}
        >
          Перезапустить приложение
        </button>
      </div>
    )
  }

  return (
    <div style={root}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>
            Error Boundary & Circuit Breaker
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            Симулятор мониторинга MFE — инъекция ошибок и изоляция сбоев
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>Error Boundary:</span>
          <button
            onClick={() => setBoundaryEnabled(v => !v)}
            style={{
              background: boundaryEnabled ? '#1e3a5f' : '#3a1f1f',
              border: `2px solid ${boundaryEnabled ? '#3b82f6' : '#f44336'}`,
              color: boundaryEnabled ? '#3b82f6' : '#f44336',
              borderRadius: 6,
              padding: '6px 16px',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'monospace',
              fontWeight: 700,
            }}
          >
            {boundaryEnabled ? 'ВКЛ' : 'ВЫКЛ'}
          </button>
          <button
            onClick={resetAll}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#94a3b8',
              borderRadius: 6,
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'monospace',
            }}
          >
            Сбросить всё
          </button>
        </div>
      </div>

      {/* Mode hint */}
      <div
        style={{
          background: boundaryEnabled ? '#0f2744' : '#2a0f0f',
          border: `1px solid ${boundaryEnabled ? '#1d4ed8' : '#dc2626'}`,
          borderRadius: 8,
          padding: '10px 16px',
          marginBottom: 20,
          fontSize: 12,
          color: boundaryEnabled ? '#93c5fd' : '#fca5a5',
        }}
      >
        {boundaryEnabled
          ? 'Режим: С Error Boundary — ошибка изолируется внутри MFE, остальные продолжают работать'
          : 'Режим: БЕЗ Error Boundary — первая же ошибка в любом MFE кладёт всё приложение'}
      </div>

      {/* Shell + MFEs */}
      <div
        style={{
          border: '2px solid #334155',
          borderRadius: 10,
          padding: '16px',
          marginBottom: 20,
          background: '#1e293b',
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: '#64748b',
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Shell Application
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {MFE_CONFIGS.map(mfe => {
            const circuit = circuits[mfe.id]
            const hasError = errorStates[mfe.id]
            const isOpen = circuit.state === 'open'
            const isHalfOpen = circuit.state === 'half-open'

            return (
              <div
                key={mfe.id}
                style={{
                  border: `2px solid ${hasError && boundaryEnabled ? '#f44336' : mfe.color}`,
                  borderRadius: 8,
                  padding: 14,
                  background: hasError && boundaryEnabled ? '#1a0a0a' : '#0f172a',
                  position: 'relative',
                }}
              >
                {/* MFE Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: mfe.color, fontSize: 14 }}>
                      {mfe.label} MFE
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{mfe.team}</div>
                  </div>
                  <div
                    style={{
                      background: CIRCUIT_COLORS[circuit.state],
                      color: '#fff',
                      borderRadius: 4,
                      padding: '2px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {CIRCUIT_LABELS[circuit.state]}
                  </div>
                </div>

                {/* Error Count */}
                <div
                  style={{
                    fontSize: 12,
                    color: '#94a3b8',
                    marginBottom: 10,
                  }}
                >
                  Ошибок: {circuit.errorCount} / {circuit.threshold} (порог)
                </div>

                {/* MFE Content */}
                {hasError && boundaryEnabled ? (
                  <div
                    style={{
                      background: '#2d1515',
                      border: '1px solid #f44336',
                      borderRadius: 6,
                      padding: '10px',
                      marginBottom: 10,
                      fontSize: 12,
                      color: '#ef9a9a',
                      textAlign: 'center',
                    }}
                  >
                    Ошибка в {mfe.label} MFE
                    <br />
                    <span style={{ color: '#64748b', fontSize: 11 }}>Fallback отображён</span>
                  </div>
                ) : isOpen ? (
                  <div
                    style={{
                      background: '#1a1500',
                      border: '1px solid #ff9800',
                      borderRadius: 6,
                      padding: '10px',
                      marginBottom: 10,
                      fontSize: 12,
                      color: '#ffcc80',
                      textAlign: 'center',
                    }}
                  >
                    Circuit OPEN
                    <br />
                    <span style={{ color: '#64748b', fontSize: 11 }}>запросы блокируются</span>
                  </div>
                ) : (
                  <div
                    style={{
                      background: '#0a1628',
                      borderRadius: 6,
                      padding: '10px',
                      marginBottom: 10,
                      fontSize: 12,
                      color: '#64748b',
                      textAlign: 'center',
                    }}
                  >
                    {isHalfOpen ? 'Проба соединения...' : 'Работает нормально'}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => injectError(mfe.id)}
                    style={{
                      background: '#3a1515',
                      border: '1px solid #f44336',
                      color: '#f44336',
                      borderRadius: 5,
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontSize: 11,
                      fontFamily: 'monospace',
                      flex: 1,
                    }}
                  >
                    Инъекция ошибки
                  </button>
                  {isOpen && (
                    <button
                      onClick={() => tryHalfOpen(mfe.id)}
                      style={{
                        background: '#2a1f00',
                        border: '1px solid #ff9800',
                        color: '#ff9800',
                        borderRadius: 5,
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontFamily: 'monospace',
                        flex: 1,
                      }}
                    >
                      Попробовать снова
                    </button>
                  )}
                  {isHalfOpen && (
                    <button
                      onClick={() => resetMfe(mfe.id)}
                      style={{
                        background: '#0f2a1a',
                        border: '1px solid #4caf50',
                        color: '#4caf50',
                        borderRadius: 5,
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontFamily: 'monospace',
                        flex: 1,
                      }}
                    >
                      Восстановить
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Error Log */}
      <div
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: 8,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: '#64748b',
            marginBottom: 10,
            textTransform: 'uppercase',
            letterSpacing: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Error Log (с тегами MFE / team)</span>
          <span style={{ color: '#334155' }}>{errorLog.length} записей</span>
        </div>
        {errorLog.length === 0 ? (
          <div style={{ color: '#334155', fontSize: 12, textAlign: 'center', padding: 16 }}>
            Лог пуст — нажмите «Инъекция ошибки» на любом MFE
          </div>
        ) : (
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {errorLog.map(entry => (
              <div
                key={entry.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 80px 90px 1fr 80px',
                  gap: 8,
                  fontSize: 11,
                  borderBottom: '1px solid #1e293b',
                  padding: '5px 0',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#64748b' }}>{entry.timestamp}</span>
                <span
                  style={{
                    background: '#0f172a',
                    borderRadius: 3,
                    padding: '1px 6px',
                    color: '#7dd3fc',
                  }}
                >
                  {entry.mfe}
                </span>
                <span style={{ color: '#94a3b8', fontSize: 10 }}>{entry.team}</span>
                <span style={{ color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {entry.message}
                </span>
                <span
                  style={{
                    background: CIRCUIT_COLORS[entry.circuitState],
                    color: '#fff',
                    borderRadius: 3,
                    padding: '1px 6px',
                    fontSize: 10,
                    textAlign: 'center',
                  }}
                >
                  {CIRCUIT_LABELS[entry.circuitState]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Circuit Breaker State Machine hint */}
      <div
        style={{
          marginTop: 16,
          background: '#0f1f33',
          border: '1px solid #1d4ed8',
          borderRadius: 8,
          padding: '12px 16px',
          fontSize: 12,
          color: '#93c5fd',
        }}
      >
        <span style={{ fontWeight: 700, marginRight: 8 }}>Circuit Breaker:</span>
        <span style={{ color: '#4caf50' }}>Closed</span>
        <span style={{ color: '#64748b' }}> → N ошибок → </span>
        <span style={{ color: '#f44336' }}>Open</span>
        <span style={{ color: '#64748b' }}> → таймаут → </span>
        <span style={{ color: '#ff9800' }}>Half-Open</span>
        <span style={{ color: '#64748b' }}> → успех → </span>
        <span style={{ color: '#4caf50' }}>Closed</span>
        <span style={{ color: '#64748b' }}> / ошибка → </span>
        <span style={{ color: '#f44336' }}>Open</span>
      </div>
    </div>
  )
}

// =====================================================
// Task 12.2: Monitoring Config Builder
// =====================================================

type AlertChannel = 'Slack' | 'PagerDuty' | 'Email'

type MfeMonitoringConfig = {
  id: string
  name: string
  teamOwner: string
  slo: number
  alertChannel: AlertChannel
  healthCheckUrl: string
  cbThreshold: number
  cbTimeoutSec: number
  cbResetTimeoutSec: number
}

type ValidationError = {
  field: string
  message: string
}

const DEFAULT_CONFIGS: MfeMonitoringConfig[] = [
  {
    id: 'catalog',
    name: 'Catalog MFE',
    teamOwner: 'team-catalog',
    slo: 99.9,
    alertChannel: 'PagerDuty',
    healthCheckUrl: 'https://cdn.example.com/catalog/health',
    cbThreshold: 5,
    cbTimeoutSec: 30,
    cbResetTimeoutSec: 60,
  },
  {
    id: 'cart',
    name: 'Cart MFE',
    teamOwner: 'team-cart',
    slo: 99.95,
    alertChannel: 'PagerDuty',
    healthCheckUrl: 'https://cdn.example.com/cart/health',
    cbThreshold: 3,
    cbTimeoutSec: 20,
    cbResetTimeoutSec: 120,
  },
  {
    id: 'profile',
    name: 'Profile MFE',
    teamOwner: 'team-profile',
    slo: 99.5,
    alertChannel: 'Slack',
    healthCheckUrl: 'https://cdn.example.com/profile/health',
    cbThreshold: 10,
    cbTimeoutSec: 60,
    cbResetTimeoutSec: 300,
  },
]

function validateConfigs(configs: MfeMonitoringConfig[]): Record<string, ValidationError[]> {
  const errors: Record<string, ValidationError[]> = {}
  for (const cfg of configs) {
    const errs: ValidationError[] = []
    if (!cfg.teamOwner.trim()) errs.push({ field: 'teamOwner', message: 'Укажите владельца команды' })
    if (cfg.slo < 99) errs.push({ field: 'slo', message: 'SLO должен быть >= 99%' })
    if (!cfg.healthCheckUrl.startsWith('http')) errs.push({ field: 'healthCheckUrl', message: 'URL должен начинаться с http' })
    if (cfg.cbThreshold <= 0) errs.push({ field: 'cbThreshold', message: 'Threshold должен быть > 0' })
    if (errs.length > 0) errors[cfg.id] = errs
  }
  return errors
}

function generateManifest(configs: MfeMonitoringConfig[]): string {
  const manifest = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    mfes: configs.map(c => ({
      name: c.name,
      ownership: {
        team: c.teamOwner,
      },
      slo: {
        availability: c.slo,
        errorBudgetPercent: parseFloat((100 - c.slo).toFixed(4)),
        errorBudgetMinPerMonth: parseFloat(((100 - c.slo) / 100 * 43800).toFixed(1)),
      },
      alerting: {
        channel: c.alertChannel,
        threshold: `${100 - c.slo}% error rate`,
      },
      healthCheck: {
        url: c.healthCheckUrl,
        intervalSec: 30,
      },
      circuitBreaker: {
        errorThreshold: c.cbThreshold,
        openTimeoutSec: c.cbTimeoutSec,
        halfOpenResetTimeoutSec: c.cbResetTimeoutSec,
      },
    })),
  }
  return JSON.stringify(manifest, null, 2)
}

export function Task12_2_Solution() {
  const [configs, setConfigs] = useState<MfeMonitoringConfig[]>(DEFAULT_CONFIGS)
  const [showJson, setShowJson] = useState(false)
  const [copied, setCopied] = useState(false)

  const validationErrors = validateConfigs(configs)
  const isValid = Object.keys(validationErrors).length === 0

  const updateConfig = useCallback((id: string, field: keyof MfeMonitoringConfig, value: string | number) => {
    setConfigs(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c)),
    )
  }, [])

  const manifest = generateManifest(configs)

  const copyJson = () => {
    navigator.clipboard.writeText(manifest).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const cell: React.CSSProperties = {
    padding: '8px 10px',
    verticalAlign: 'middle',
    fontSize: 12,
    borderBottom: '1px solid #1e293b',
  }

  const input: React.CSSProperties = {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 4,
    color: '#e2e8f0',
    fontSize: 12,
    fontFamily: 'monospace',
    padding: '4px 8px',
    width: '100%',
    boxSizing: 'border-box',
  }

  const root: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    fontFamily: 'monospace',
    minHeight: '100vh',
    padding: '24px',
    boxSizing: 'border-box',
  }

  return (
    <div style={root}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>
          Конструктор мониторинг-конфигурации
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
          Настройте SLO, алерты и Circuit Breaker для каждого MFE — получите monitoring manifest
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: '#1e293b',
          borderRadius: 10,
          border: '1px solid #334155',
          overflow: 'auto',
          marginBottom: 16,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              {[
                'MFE',
                'Team Owner',
                'SLO %',
                'Error Budget',
                'Alert Channel',
                'Health-Check URL',
                'CB Threshold',
                'CB Open (сек)',
                'CB Reset (сек)',
              ].map(h => (
                <th
                  key={h}
                  style={{
                    ...cell,
                    color: '#64748b',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {configs.map(cfg => {
              const errs = validationErrors[cfg.id] ?? []
              const errFields = errs.map(e => e.field)
              const errorBudget = parseFloat((100 - cfg.slo).toFixed(4))
              const minutesPerMonth = parseFloat(((100 - cfg.slo) / 100 * 43800).toFixed(1))

              return (
                <tr key={cfg.id}>
                  <td style={{ ...cell, color: '#7dd3fc', fontWeight: 700 }}>{cfg.name}</td>
                  <td style={cell}>
                    <input
                      style={{
                        ...input,
                        border: errFields.includes('teamOwner')
                          ? '1px solid #f44336'
                          : '1px solid #334155',
                      }}
                      value={cfg.teamOwner}
                      onChange={e => updateConfig(cfg.id, 'teamOwner', e.target.value)}
                    />
                  </td>
                  <td style={cell}>
                    <input
                      type="number"
                      min={99}
                      max={99.999}
                      step={0.01}
                      style={{
                        ...input,
                        width: 80,
                        border: errFields.includes('slo')
                          ? '1px solid #f44336'
                          : '1px solid #334155',
                      }}
                      value={cfg.slo}
                      onChange={e => updateConfig(cfg.id, 'slo', parseFloat(e.target.value))}
                    />
                  </td>
                  <td style={{ ...cell, color: errorBudget < 0.05 ? '#f44336' : '#ffa726' }}>
                    <div>{errorBudget}%</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{minutesPerMonth} мин/мес</div>
                  </td>
                  <td style={cell}>
                    <select
                      style={{ ...input, width: 110, cursor: 'pointer' }}
                      value={cfg.alertChannel}
                      onChange={e => updateConfig(cfg.id, 'alertChannel', e.target.value)}
                    >
                      <option>Slack</option>
                      <option>PagerDuty</option>
                      <option>Email</option>
                    </select>
                  </td>
                  <td style={cell}>
                    <input
                      style={{
                        ...input,
                        width: 200,
                        border: errFields.includes('healthCheckUrl')
                          ? '1px solid #f44336'
                          : '1px solid #334155',
                      }}
                      value={cfg.healthCheckUrl}
                      onChange={e => updateConfig(cfg.id, 'healthCheckUrl', e.target.value)}
                    />
                  </td>
                  <td style={cell}>
                    <input
                      type="number"
                      min={1}
                      style={{
                        ...input,
                        width: 60,
                        border: errFields.includes('cbThreshold')
                          ? '1px solid #f44336'
                          : '1px solid #334155',
                      }}
                      value={cfg.cbThreshold}
                      onChange={e => updateConfig(cfg.id, 'cbThreshold', parseInt(e.target.value, 10))}
                    />
                  </td>
                  <td style={cell}>
                    <input
                      type="number"
                      min={1}
                      style={{ ...input, width: 60 }}
                      value={cfg.cbTimeoutSec}
                      onChange={e => updateConfig(cfg.id, 'cbTimeoutSec', parseInt(e.target.value, 10))}
                    />
                  </td>
                  <td style={cell}>
                    <input
                      type="number"
                      min={1}
                      style={{ ...input, width: 60 }}
                      value={cfg.cbResetTimeoutSec}
                      onChange={e => updateConfig(cfg.id, 'cbResetTimeoutSec', parseInt(e.target.value, 10))}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Validation errors */}
      {!isValid && (
        <div
          style={{
            background: '#2d1515',
            border: '1px solid #f44336',
            borderRadius: 8,
            padding: '10px 16px',
            marginBottom: 16,
          }}
        >
          {Object.entries(validationErrors).map(([id, errs]) => (
            <div key={id} style={{ marginBottom: 4 }}>
              {errs.map(e => (
                <div key={e.field} style={{ fontSize: 12, color: '#ef9a9a' }}>
                  {configs.find(c => c.id === id)?.name}: {e.message}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Generate button */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button
          onClick={() => setShowJson(v => !v)}
          disabled={!isValid}
          style={{
            background: isValid ? '#1d4ed8' : '#1e293b',
            border: `1px solid ${isValid ? '#3b82f6' : '#334155'}`,
            color: isValid ? '#fff' : '#475569',
            borderRadius: 6,
            padding: '8px 20px',
            cursor: isValid ? 'pointer' : 'not-allowed',
            fontSize: 13,
            fontFamily: 'monospace',
            fontWeight: 600,
          }}
        >
          {showJson ? 'Скрыть манифест' : 'Сгенерировать манифест'}
        </button>
        {isValid && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 12,
              color: '#4caf50',
            }}
          >
            Валидация пройдена — все MFE настроены корректно
          </div>
        )}
      </div>

      {/* JSON Output */}
      {showJson && (
        <div
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderBottom: '1px solid #334155',
              background: '#0f172a',
            }}
          >
            <span style={{ fontSize: 12, color: '#64748b' }}>monitoring-manifest.json</span>
            <button
              onClick={copyJson}
              style={{
                background: copied ? '#0f2a1a' : '#1e293b',
                border: `1px solid ${copied ? '#4caf50' : '#334155'}`,
                color: copied ? '#4caf50' : '#94a3b8',
                borderRadius: 5,
                padding: '4px 12px',
                cursor: 'pointer',
                fontSize: 11,
                fontFamily: 'monospace',
              }}
            >
              {copied ? 'Скопировано!' : 'Копировать'}
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: '16px',
              fontSize: 12,
              color: '#a5f3fc',
              overflowX: 'auto',
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            {manifest}
          </pre>
        </div>
      )}
    </div>
  )
}
