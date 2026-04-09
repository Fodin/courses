import { useState, useEffect, useRef } from 'react'

// =====================================================
// Task 10.1: Deploy Pipeline Simulator
// =====================================================

type MfeId = 'shell' | 'catalog' | 'cart' | 'profile'

type PipelineStage = 'idle' | 'build' | 'test' | 'publish' | 'canary' | 'done' | 'rolledback'

type CanaryStep = 5 | 25 | 50 | 100

type MfeState = {
  id: MfeId
  label: string
  currentVersion: string
  previousVersion: string | null
  pendingVersion: string
  deployedAt: string
  stage: PipelineStage
  stageProgress: number
  canaryPercent: CanaryStep
  color: string
}

type LogEntry = {
  id: number
  time: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
}

const STAGE_LABELS: Record<PipelineStage, string> = {
  idle: 'Ожидание',
  build: 'Build',
  test: 'Test',
  publish: 'Publish',
  canary: 'Canary',
  done: 'Deployed',
  rolledback: 'Rolled back',
}

const STAGE_DURATIONS: Record<string, number> = {
  build: 2000,
  test: 1500,
  publish: 1000,
}

const INITIAL_MFES: MfeState[] = [
  {
    id: 'shell',
    label: 'Shell',
    currentVersion: '2.3.1',
    previousVersion: '2.3.0',
    pendingVersion: '2.4.0',
    deployedAt: '2026-04-08 14:22',
    stage: 'idle',
    stageProgress: 0,
    canaryPercent: 5,
    color: '#5c6bc0',
  },
  {
    id: 'catalog',
    label: 'Catalog',
    currentVersion: '1.5.2',
    previousVersion: '1.5.1',
    pendingVersion: '1.6.0',
    deployedAt: '2026-04-09 09:10',
    stage: 'idle',
    stageProgress: 0,
    canaryPercent: 5,
    color: '#26a69a',
  },
  {
    id: 'cart',
    label: 'Cart',
    currentVersion: '3.0.0',
    previousVersion: '2.9.5',
    pendingVersion: '3.1.0',
    deployedAt: '2026-04-07 17:45',
    stage: 'idle',
    stageProgress: 0,
    canaryPercent: 5,
    color: '#ef5350',
  },
  {
    id: 'profile',
    label: 'Profile',
    currentVersion: '1.2.0',
    previousVersion: '1.1.9',
    pendingVersion: '1.3.0',
    deployedAt: '2026-04-09 11:30',
    stage: 'idle',
    stageProgress: 0,
    canaryPercent: 5,
    color: '#ffa726',
  },
]

function formatTime() {
  return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function Task10_1_Solution() {
  const [mfes, setMfes] = useState<MfeState[]>(INITIAL_MFES)
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 0, time: '14:22:01', message: 'Shell v2.3.1 успешно задеплоен', type: 'success' },
    { id: 1, time: '09:10:33', message: 'Catalog v1.5.2 успешно задеплоен', type: 'success' },
    { id: 2, time: '17:45:12', message: 'Cart v3.0.0 успешно задеплоен', type: 'success' },
    { id: 3, time: '11:30:08', message: 'Profile v1.2.0 успешно задеплоен', type: 'success' },
  ])
  const logCounter = useRef(4)
  const timerRefs = useRef<Record<MfeId, ReturnType<typeof setTimeout> | null>>({
    shell: null, catalog: null, cart: null, profile: null,
  })

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [
      { id: logCounter.current++, time: formatTime(), message, type },
      ...prev.slice(0, 29),
    ])
  }

  const updateMfe = (id: MfeId, patch: Partial<MfeState>) => {
    setMfes(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }

  const runStage = (id: MfeId, stage: 'build' | 'test' | 'publish', onDone: () => void) => {
    updateMfe(id, { stage, stageProgress: 0 })
    const duration = STAGE_DURATIONS[stage]
    const steps = 20
    const interval = duration / steps
    let step = 0

    const tick = () => {
      step++
      const progress = Math.round((step / steps) * 100)
      updateMfe(id, { stageProgress: progress })
      if (step < steps) {
        timerRefs.current[id] = setTimeout(tick, interval)
      } else {
        onDone()
      }
    }
    timerRefs.current[id] = setTimeout(tick, interval)
  }

  const startDeploy = (id: MfeId) => {
    const mfe = mfes.find(m => m.id === id)
    if (!mfe || mfe.stage !== 'idle') return

    addLog(`Запуск деплоя ${mfe.label} ${mfe.pendingVersion}...`, 'info')

    runStage(id, 'build', () => {
      addLog(`[${mfe.label}] Build завершён`, 'info')
      runStage(id, 'test', () => {
        addLog(`[${mfe.label}] Тесты прошли`, 'info')
        runStage(id, 'publish', () => {
          addLog(`[${mfe.label}] Артефакт опубликован на CDN`, 'info')
          updateMfe(id, { stage: 'canary', stageProgress: 100, canaryPercent: 5 })
          addLog(`[${mfe.label}] Canary запущен: 5% трафика → ${mfe.pendingVersion}`, 'warning')
        })
      })
    })
  }

  const promote = (id: MfeId) => {
    const mfe = mfes.find(m => m.id === id)
    if (!mfe || mfe.stage !== 'canary') return

    const steps: CanaryStep[] = [5, 25, 50, 100]
    const currentIndex = steps.indexOf(mfe.canaryPercent)
    const nextPercent = steps[currentIndex + 1]

    if (!nextPercent) return

    if (nextPercent === 100) {
      updateMfe(id, {
        stage: 'done',
        currentVersion: mfe.pendingVersion,
        previousVersion: mfe.currentVersion,
        deployedAt: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
        canaryPercent: 100,
      })
      addLog(`[${mfe.label}] 100% трафика → ${mfe.pendingVersion}. Деплой завершён!`, 'success')
    } else {
      updateMfe(id, { canaryPercent: nextPercent as CanaryStep })
      addLog(`[${mfe.label}] Canary promoted: ${nextPercent}% трафика → ${mfe.pendingVersion}`, 'warning')
    }
  }

  const rollback = (id: MfeId) => {
    const mfe = mfes.find(m => m.id === id)
    if (!mfe || mfe.stage !== 'canary') return

    updateMfe(id, { stage: 'rolledback', canaryPercent: 5 })
    addLog(
      `[${mfe.label}] Rollback: ${mfe.pendingVersion} → ${mfe.currentVersion}`,
      'error',
    )
    setTimeout(() => updateMfe(id, { stage: 'idle' }), 2000)
  }

  const reset = (id: MfeId) => {
    updateMfe(id, { stage: 'idle', stageProgress: 0, canaryPercent: 5 })
  }

  useEffect(() => {
    return () => {
      Object.values(timerRefs.current).forEach(t => { if (t) clearTimeout(t) })
    }
  }, [])

  const stageOrder: PipelineStage[] = ['build', 'test', 'publish', 'canary', 'done']

  const getStageColor = (stage: PipelineStage) => {
    if (stage === 'done') return '#4caf50'
    if (stage === 'rolledback') return '#ef5350'
    if (stage === 'canary') return '#ffa726'
    if (stage === 'idle') return '#9e9e9e'
    return '#2196f3'
  }

  const logColor: Record<LogEntry['type'], string> = {
    info: '#90caf9',
    success: '#a5d6a7',
    error: '#ef9a9a',
    warning: '#ffe082',
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '960px', margin: '0 auto', background: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: '#1a1a2e' }}>Симулятор Deploy Pipeline</h2>
      <p style={{ margin: '0 0 24px', color: '#666', fontSize: '14px' }}>Деплой и версионирование MFE с поддержкой canary и rollback</p>

      {/* MFE cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {mfes.map(mfe => (
          <div key={mfe.id} style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            border: `2px solid ${mfe.stage === 'idle' || mfe.stage === 'done' || mfe.stage === 'rolledback' ? '#e0e0e0' : mfe.color}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'border-color 0.3s',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: mfe.color }} />
                <span style={{ fontWeight: 700, fontSize: '16px', color: '#1a1a2e' }}>{mfe.label}</span>
              </div>
              <span style={{
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                background: getStageColor(mfe.stage) + '22',
                color: getStageColor(mfe.stage),
              }}>
                {STAGE_LABELS[mfe.stage]}
              </span>
            </div>

            {/* Versions */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', fontSize: '13px' }}>
              <div style={{ background: '#f1f8e9', borderRadius: '6px', padding: '6px 10px' }}>
                <span style={{ color: '#666' }}>Текущая </span>
                <span style={{ fontWeight: 700, color: '#388e3c', fontFamily: 'monospace' }}>v{mfe.currentVersion}</span>
              </div>
              <div style={{ background: '#e3f2fd', borderRadius: '6px', padding: '6px 10px' }}>
                <span style={{ color: '#666' }}>Новая </span>
                <span style={{ fontWeight: 700, color: '#1565c0', fontFamily: 'monospace' }}>v{mfe.pendingVersion}</span>
              </div>
            </div>

            {/* Pipeline progress */}
            {mfe.stage !== 'idle' && mfe.stage !== 'done' && mfe.stage !== 'rolledback' && mfe.stage !== 'canary' && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                  {stageOrder.filter(s => s !== 'canary' && s !== 'done').map(s => (
                    <div key={s} style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      background: stageOrder.indexOf(s) < stageOrder.indexOf(mfe.stage)
                        ? '#4caf50'
                        : s === mfe.stage ? mfe.color : '#e0e0e0',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  {STAGE_LABELS[mfe.stage]}: {mfe.stageProgress}%
                </div>
                <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${mfe.stageProgress}%`,
                    background: mfe.color,
                    borderRadius: '3px',
                    transition: 'width 0.1s linear',
                  }} />
                </div>
              </div>
            )}

            {/* Canary controls */}
            {mfe.stage === 'canary' && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', color: '#e65100', fontWeight: 600, marginBottom: '8px' }}>
                  Canary: {mfe.canaryPercent}% трафика → v{mfe.pendingVersion}
                </div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                  {([5, 25, 50, 100] as CanaryStep[]).map(step => (
                    <div key={step} style={{
                      flex: 1,
                      height: '24px',
                      borderRadius: '4px',
                      background: step <= mfe.canaryPercent ? '#ffa726' : '#fff3e0',
                      border: '1px solid #ffe0b2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: step <= mfe.canaryPercent ? '#fff' : '#e65100',
                    }}>
                      {step}%
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => promote(mfe.id)}
                    disabled={mfe.canaryPercent === 100}
                    style={{
                      flex: 1,
                      padding: '7px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#4caf50',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: mfe.canaryPercent === 100 ? 'not-allowed' : 'pointer',
                      opacity: mfe.canaryPercent === 100 ? 0.5 : 1,
                    }}
                  >
                    Promote →
                  </button>
                  <button
                    onClick={() => rollback(mfe.id)}
                    style={{
                      flex: 1,
                      padding: '7px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#ef5350',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Rollback
                  </button>
                </div>
              </div>
            )}

            {/* Done state */}
            {mfe.stage === 'done' && (
              <div style={{ marginBottom: '14px', padding: '8px 12px', background: '#f1f8e9', borderRadius: '8px', fontSize: '13px', color: '#388e3c' }}>
                Deployed {mfe.deployedAt}
              </div>
            )}

            {/* Rolledback state */}
            {mfe.stage === 'rolledback' && (
              <div style={{ marginBottom: '14px', padding: '8px 12px', background: '#ffebee', borderRadius: '8px', fontSize: '13px', color: '#c62828' }}>
                Откат выполнен. Активна v{mfe.currentVersion}
              </div>
            )}

            {/* Deploy button */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => startDeploy(mfe.id)}
                disabled={mfe.stage !== 'idle'}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: mfe.stage === 'idle' ? mfe.color : '#e0e0e0',
                  color: mfe.stage === 'idle' ? '#fff' : '#999',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: mfe.stage === 'idle' ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s',
                }}
              >
                Деплой v{mfe.pendingVersion}
              </button>
              {(mfe.stage === 'done' || mfe.stage === 'rolledback') && (
                <button
                  onClick={() => reset(mfe.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    background: '#fff',
                    color: '#666',
                    fontWeight: 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Сбросить
                </button>
              )}
            </div>

            {/* Meta */}
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#aaa' }}>
              Предыдущая: v{mfe.previousVersion} · Задеплоен: {mfe.deployedAt}
            </div>
          </div>
        ))}
      </div>

      {/* Registry table */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: '15px', color: '#1a1a2e' }}>Реестр версий</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              {['MFE', 'Текущая версия', 'Предыдущая', 'Статус', 'Задеплоен'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#666', borderBottom: '1px solid #e0e0e0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mfes.map(mfe => (
              <tr key={mfe.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600, color: mfe.color }}>{mfe.label}</td>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#388e3c', fontWeight: 700 }}>v{mfe.stage === 'done' ? mfe.currentVersion : mfe.currentVersion}</td>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#999' }}>{mfe.previousVersion ? `v${mfe.previousVersion}` : '—'}</td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: getStageColor(mfe.stage) + '22',
                    color: getStageColor(mfe.stage),
                  }}>
                    {STAGE_LABELS[mfe.stage]}
                  </span>
                </td>
                <td style={{ padding: '8px 12px', color: '#666' }}>{mfe.deployedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Event log */}
      <div style={{ background: '#1e1e2e', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '15px', color: '#cdd6f4' }}>Лог событий</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {logs.map(log => (
            <div key={log.id} style={{ display: 'flex', gap: '12px', fontSize: '12px', fontFamily: 'monospace' }}>
              <span style={{ color: '#585b70', minWidth: '80px' }}>{log.time}</span>
              <span style={{ color: logColor[log.type] }}>{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// =====================================================
// Task 10.2: Versioning Strategy Builder
// =====================================================

type VersionStrategy = 'semver' | 'content-hash' | 'latest'
type CacheTTL = 'no-cache' | '1h' | '1d' | '1w' | 'immutable'
type RollbackPolicy = 'auto-on-error' | 'manual' | 'disabled'

type MfeConfig = {
  id: string
  name: string
  strategy: VersionStrategy
  cacheTTL: CacheTTL
  canaryPercent: number
  rollbackPolicy: RollbackPolicy
}

type ValidationWarning = {
  mfeId: string
  field: string
  message: string
  severity: 'error' | 'warning'
}

const STRATEGY_LABELS: Record<VersionStrategy, string> = {
  'semver': 'SemVer',
  'content-hash': 'Content Hash',
  'latest': 'Latest',
}

const TTL_LABELS: Record<CacheTTL, string> = {
  'no-cache': 'No-cache',
  '1h': '1 час',
  '1d': '1 день',
  '1w': '1 неделя',
  'immutable': 'Immutable',
}

const ROLLBACK_LABELS: Record<RollbackPolicy, string> = {
  'auto-on-error': 'Авто (при ошибке)',
  'manual': 'Ручной',
  'disabled': 'Отключён',
}

function generateUrl(name: string, strategy: VersionStrategy): string {
  if (strategy === 'semver') return `/mfe/${name}/1.0.0/remoteEntry.js`
  if (strategy === 'content-hash') return `/mfe/${name}/abc1d2e3/remoteEntry.js`
  return `/mfe/${name}/latest/remoteEntry.js`
}

function generateManifest(configs: MfeConfig[]): string {
  const manifest = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    remotes: configs.reduce((acc, c) => {
      acc[c.name] = {
        url: generateUrl(c.name, c.strategy),
        versionStrategy: c.strategy,
        cache: {
          ttl: c.cacheTTL,
          immutable: c.cacheTTL === 'immutable',
        },
        canary: {
          enabled: c.canaryPercent > 0,
          percent: c.canaryPercent,
        },
        rollback: {
          policy: c.rollbackPolicy,
        },
      }
      return acc
    }, {} as Record<string, unknown>),
  }
  return JSON.stringify(manifest, null, 2)
}

function validate(configs: MfeConfig[]): ValidationWarning[] {
  const warnings: ValidationWarning[] = []

  configs.forEach(c => {
    if (c.name.toLowerCase() === 'shell' && c.strategy === 'latest') {
      warnings.push({
        mfeId: c.id,
        field: 'strategy',
        message: `${c.name}: Shell не может использовать "latest" — риск нестабильности всего приложения`,
        severity: 'error',
      })
    }

    if (c.canaryPercent > 0 && c.rollbackPolicy === 'disabled') {
      warnings.push({
        mfeId: c.id,
        field: 'rollback',
        message: `${c.name}: Canary > 0% с отключённым rollback — некого будет откатить при ошибке`,
        severity: 'error',
      })
    }

    if (c.cacheTTL === 'immutable' && c.strategy === 'latest') {
      warnings.push({
        mfeId: c.id,
        field: 'cache',
        message: `${c.name}: Immutable cache с "latest" стратегией — браузер никогда не запросит новую версию`,
        severity: 'error',
      })
    }

    if (c.strategy === 'latest' && c.cacheTTL !== 'no-cache') {
      warnings.push({
        mfeId: c.id,
        field: 'cache',
        message: `${c.name}: "Latest" стратегия требует no-cache, иначе браузер будет кешировать старую версию`,
        severity: 'warning',
      })
    }

    if (c.canaryPercent === 100) {
      warnings.push({
        mfeId: c.id,
        field: 'canary',
        message: `${c.name}: Canary 100% — это не canary, это просто деплой. Укажите значение до 50%.`,
        severity: 'warning',
      })
    }
  })

  return warnings
}

const INITIAL_CONFIGS: MfeConfig[] = [
  { id: '1', name: 'shell', strategy: 'semver', cacheTTL: '1d', canaryPercent: 5, rollbackPolicy: 'auto-on-error' },
  { id: '2', name: 'catalog', strategy: 'content-hash', cacheTTL: 'immutable', canaryPercent: 10, rollbackPolicy: 'auto-on-error' },
  { id: '3', name: 'cart', strategy: 'semver', cacheTTL: '1h', canaryPercent: 5, rollbackPolicy: 'manual' },
]

let nextConfigId = 4

export function Task10_2_Solution() {
  const [configs, setConfigs] = useState<MfeConfig[]>(INITIAL_CONFIGS)
  const [activeTab, setActiveTab] = useState<'table' | 'manifest'>('table')

  const warnings = validate(configs)
  const errors = warnings.filter(w => w.severity === 'error')
  const warningsList = warnings.filter(w => w.severity === 'warning')

  const updateConfig = (id: string, patch: Partial<MfeConfig>) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
  }

  const addMfe = () => {
    setConfigs(prev => [...prev, {
      id: String(nextConfigId++),
      name: `mfe-${nextConfigId - 1}`,
      strategy: 'semver',
      cacheTTL: '1d',
      canaryPercent: 5,
      rollbackPolicy: 'auto-on-error',
    }])
  }

  const removeMfe = (id: string) => {
    setConfigs(prev => prev.filter(c => c.id !== id))
  }

  const selectStyle: React.CSSProperties = {
    padding: '5px 8px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    fontSize: '12px',
    background: '#fff',
    cursor: 'pointer',
    width: '100%',
  }

  const inputStyle: React.CSSProperties = {
    padding: '5px 8px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    fontSize: '12px',
    width: '100%',
    boxSizing: 'border-box',
  }

  const strategyColor: Record<VersionStrategy, string> = {
    'semver': '#5c6bc0',
    'content-hash': '#26a69a',
    'latest': '#ef5350',
  }

  const getConfigWarnings = (id: string) => warnings.filter(w => w.mfeId === id)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '960px', margin: '0 auto', background: '#f8f9fa', minHeight: '100vh' }}>
      <h2 style={{ margin: '0 0 4px', fontSize: '20px', color: '#1a1a2e' }}>Конструктор стратегии версионирования</h2>
      <p style={{ margin: '0 0 24px', color: '#666', fontSize: '14px' }}>Настройте версионирование и кеширование для каждого MFE</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#e0e0e0', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
        {(['table', 'manifest'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 18px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === tab ? '#fff' : 'transparent',
              color: activeTab === tab ? '#1a1a2e' : '#666',
              fontWeight: activeTab === tab ? 600 : 400,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {tab === 'table' ? 'Настройка MFE' : 'Deployment Manifest'}
          </button>
        ))}
      </div>

      {activeTab === 'table' && (
        <>
          {/* Config table */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  {['MFE Name', 'Стратегия', 'URL Pattern', 'Cache TTL', 'Canary %', 'Rollback', ''].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#666', borderBottom: '1px solid #e0e0e0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {configs.map(config => {
                  const cfgWarnings = getConfigWarnings(config.id)
                  const hasError = cfgWarnings.some(w => w.severity === 'error')
                  return (
                    <tr key={config.id} style={{ borderBottom: '1px solid #f0f0f0', background: hasError ? '#fff8f8' : 'transparent' }}>
                      <td style={{ padding: '8px 12px' }}>
                        <input
                          value={config.name}
                          onChange={e => updateConfig(config.id, { name: e.target.value })}
                          style={{ ...inputStyle, width: '100px', fontFamily: 'monospace' }}
                        />
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <select
                          value={config.strategy}
                          onChange={e => updateConfig(config.id, { strategy: e.target.value as VersionStrategy })}
                          style={{ ...selectStyle, color: strategyColor[config.strategy], fontWeight: 600 }}
                        >
                          {(Object.keys(STRATEGY_LABELS) as VersionStrategy[]).map(s => (
                            <option key={s} value={s}>{STRATEGY_LABELS[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <code style={{ fontSize: '11px', color: '#555', background: '#f5f5f5', padding: '3px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                          {generateUrl(config.name, config.strategy)}
                        </code>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <select
                          value={config.cacheTTL}
                          onChange={e => updateConfig(config.id, { cacheTTL: e.target.value as CacheTTL })}
                          style={selectStyle}
                        >
                          {(Object.keys(TTL_LABELS) as CacheTTL[]).map(t => (
                            <option key={t} value={t}>{TTL_LABELS[t]}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '8px 12px', minWidth: '120px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={config.canaryPercent}
                            onChange={e => updateConfig(config.id, { canaryPercent: Number(e.target.value) })}
                            style={{ width: '80px' }}
                          />
                          <span style={{ minWidth: '32px', fontSize: '12px', fontWeight: 600, color: '#e65100' }}>{config.canaryPercent}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <select
                          value={config.rollbackPolicy}
                          onChange={e => updateConfig(config.id, { rollbackPolicy: e.target.value as RollbackPolicy })}
                          style={selectStyle}
                        >
                          {(Object.keys(ROLLBACK_LABELS) as RollbackPolicy[]).map(r => (
                            <option key={r} value={r}>{ROLLBACK_LABELS[r]}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <button
                          onClick={() => removeMfe(config.id)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid #ffcdd2',
                            background: '#fff',
                            color: '#ef5350',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <button
              onClick={addMfe}
              style={{
                marginTop: '14px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px dashed #90caf9',
                background: '#e3f2fd',
                color: '#1565c0',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              + Добавить MFE
            </button>
          </div>

          {/* Warnings / Errors */}
          {warnings.length > 0 && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#1a1a2e' }}>
                Предупреждения о рисках
                {errors.length > 0 && (
                  <span style={{ marginLeft: '8px', padding: '2px 8px', borderRadius: '10px', background: '#ffebee', color: '#c62828', fontSize: '12px' }}>
                    {errors.length} ошибок
                  </span>
                )}
                {warningsList.length > 0 && (
                  <span style={{ marginLeft: '6px', padding: '2px 8px', borderRadius: '10px', background: '#fff8e1', color: '#e65100', fontSize: '12px' }}>
                    {warningsList.length} предупреждений
                  </span>
                )}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {warnings.map((w, i) => (
                  <div key={i} style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${w.severity === 'error' ? '#ffcdd2' : '#ffe0b2'}`,
                    background: w.severity === 'error' ? '#ffebee' : '#fff8e1',
                    fontSize: '13px',
                    color: w.severity === 'error' ? '#c62828' : '#e65100',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-start',
                  }}>
                    <span>{w.severity === 'error' ? '⛔' : '⚠️'}</span>
                    <span>{w.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'manifest' && (
        <div style={{ background: '#1e1e2e', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', color: '#cdd6f4' }}>deployment-manifest.json</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {errors.length > 0 && (
                <span style={{ padding: '3px 10px', borderRadius: '10px', background: '#c62828', color: '#fff', fontSize: '11px', fontWeight: 600 }}>
                  {errors.length} ошибок конфигурации
                </span>
              )}
              <span style={{ padding: '3px 10px', borderRadius: '10px', background: '#313244', color: '#a6e3a1', fontSize: '11px' }}>
                {configs.length} remotes
              </span>
            </div>
          </div>
          <pre style={{
            margin: 0,
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#cdd6f4',
            overflowX: 'auto',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
          }}>
            {generateManifest(configs)}
          </pre>
        </div>
      )}

      {/* Strategy legend */}
      <div style={{ marginTop: '16px', background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', color: '#1a1a2e' }}>Справка по стратегиям</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {(Object.entries({
            semver: { title: 'SemVer', url: '/mfe/cart/1.2.0/...', desc: 'Версия явно указана. Контролируемый деплой, простой rollback.', when: 'Рекомендуется для shell и критичных MFE.' },
            'content-hash': { title: 'Content Hash', url: '/mfe/cart/a3b9f2c1/...', desc: 'URL уникален для каждой сборки. Идеален для immutable cache.', when: 'Рекомендуется для MFE с частыми обновлениями.' },
            latest: { title: 'Latest', url: '/mfe/cart/latest/...', desc: 'Всегда последняя версия. Требует no-cache. Риск нестабильности.', when: 'Только для dev/staging окружений.' },
          }) as [VersionStrategy, { title: string, url: string, desc: string, when: string }][]).map(([key, info]) => (
            <div key={key} style={{
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${strategyColor[key]}33`,
              background: strategyColor[key] + '0a',
            }}>
              <div style={{ fontWeight: 700, color: strategyColor[key], marginBottom: '4px', fontSize: '13px' }}>{info.title}</div>
              <code style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '6px' }}>{info.url}</code>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>{info.desc}</div>
              <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>{info.when}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
