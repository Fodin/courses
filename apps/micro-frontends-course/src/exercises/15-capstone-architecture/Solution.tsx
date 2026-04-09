import { useState, useCallback } from 'react'

// =====================================================
// Task 15.1: E-Commerce Architecture Visualizer
// =====================================================

type ArchView = 'dependency' | 'deploy' | 'team' | 'traffic'

type MfeNode = {
  id: string
  label: string
  color: string
  team: string
  teamColor: string
  framework: string
  routes: string[]
  sharedDeps: string[]
  emits: string[]
  listens: string[]
  deployStrategy: string
  canary: number
  version: string
  requestPct: number
  latency: number
  errorRate: number
  slo: string
}

type SharedLib = {
  id: string
  label: string
  version: string
  usedBy: string[]
}

const MFE_NODES: MfeNode[] = [
  {
    id: 'shell',
    label: 'Shell',
    color: '#1e40af',
    team: 'Platform',
    teamColor: '#3b82f6',
    framework: 'React 18',
    routes: ['/', '/*'],
    sharedDeps: ['react', 'react-dom', 'react-router-dom'],
    emits: ['user:logout', 'global:error'],
    listens: ['mfe:ready', 'auth:changed'],
    deployStrategy: 'Blue/Green',
    canary: 0,
    version: '2.4.1',
    requestPct: 100,
    latency: 42,
    errorRate: 0.1,
    slo: '99.9%',
  },
  {
    id: 'catalog',
    label: 'Catalog MFE',
    color: '#166534',
    team: 'Commerce',
    teamColor: '#22c55e',
    framework: 'React 18 + Next.js',
    routes: ['/catalog', '/catalog/:id', '/search'],
    sharedDeps: ['react', 'react-dom', 'ui-kit', 'analytics'],
    emits: ['cart:add', 'product:viewed', 'search:query'],
    listens: ['user:logout', 'cart:updated'],
    deployStrategy: 'Canary',
    canary: 15,
    version: '3.1.0',
    requestPct: 68,
    latency: 87,
    errorRate: 0.3,
    slo: '99.5%',
  },
  {
    id: 'cart',
    label: 'Cart MFE',
    color: '#7c2d12',
    team: 'Commerce',
    teamColor: '#22c55e',
    framework: 'React 18',
    routes: ['/cart'],
    sharedDeps: ['react', 'react-dom', 'ui-kit'],
    emits: ['checkout:start', 'cart:updated', 'cart:cleared'],
    listens: ['cart:add', 'user:logout', 'payment:failed'],
    deployStrategy: 'Rolling',
    canary: 0,
    version: '1.8.3',
    requestPct: 32,
    latency: 54,
    errorRate: 0.2,
    slo: '99.5%',
  },
  {
    id: 'checkout',
    label: 'Checkout MFE',
    color: '#4a1d96',
    team: 'Payments',
    teamColor: '#a855f7',
    framework: 'React 18',
    routes: ['/checkout', '/checkout/confirm'],
    sharedDeps: ['react', 'react-dom', 'ui-kit', 'analytics'],
    emits: ['payment:success', 'payment:failed', 'order:created'],
    listens: ['checkout:start', 'user:logout'],
    deployStrategy: 'Blue/Green',
    canary: 0,
    version: '2.0.1',
    requestPct: 18,
    latency: 312,
    errorRate: 0.05,
    slo: '99.95%',
  },
  {
    id: 'profile',
    label: 'Profile MFE',
    color: '#0c4a6e',
    team: 'Identity',
    teamColor: '#0ea5e9',
    framework: 'React 18',
    routes: ['/profile', '/profile/orders', '/profile/settings'],
    sharedDeps: ['react', 'react-dom', 'ui-kit'],
    emits: ['auth:changed', 'user:updated'],
    listens: ['user:logout', 'order:created'],
    deployStrategy: 'Rolling',
    canary: 0,
    version: '1.5.2',
    requestPct: 22,
    latency: 78,
    errorRate: 0.15,
    slo: '99.5%',
  },
  {
    id: 'admin',
    label: 'Admin MFE',
    color: '#3f3f46',
    team: 'Internal',
    teamColor: '#a1a1aa',
    framework: 'React 18 + Vite',
    routes: ['/admin', '/admin/*'],
    sharedDeps: ['react', 'react-dom', 'ui-kit'],
    emits: ['admin:action'],
    listens: ['global:error'],
    deployStrategy: 'Direct',
    canary: 0,
    version: '1.2.0',
    requestPct: 5,
    latency: 95,
    errorRate: 0.4,
    slo: '99%',
  },
]

const SHARED_LIBS: SharedLib[] = [
  { id: 'react', label: 'react@18.3', version: '18.3.0', usedBy: ['shell', 'catalog', 'cart', 'checkout', 'profile', 'admin'] },
  { id: 'react-dom', label: 'react-dom@18.3', version: '18.3.0', usedBy: ['shell', 'catalog', 'cart', 'checkout', 'profile', 'admin'] },
  { id: 'ui-kit', label: '@company/ui-kit', version: '4.2.0', usedBy: ['catalog', 'cart', 'checkout', 'profile', 'admin'] },
  { id: 'analytics', label: '@company/analytics', version: '2.1.0', usedBy: ['catalog', 'checkout'] },
  { id: 'react-router-dom', label: 'react-router-dom@6', version: '6.26.0', usedBy: ['shell'] },
]

const VIEW_LABELS: Record<ArchView, string> = {
  dependency: 'Зависимости',
  deploy: 'Deploy',
  team: 'Команды',
  traffic: 'Трафик',
}

function s(style: React.CSSProperties): React.CSSProperties { return style }

function MfeCard({ node, selected, onClick, view }: { node: MfeNode; selected: boolean; onClick: () => void; view: ArchView }) {
  const getBadge = () => {
    if (view === 'deploy') {
      return (
        <div style={s({ display: 'flex', gap: 6, marginTop: 4 })}>
          <span style={s({ background: '#1e293b', color: '#94a3b8', fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
            v{node.version}
          </span>
          <span style={s({ background: node.canary > 0 ? '#78350f' : '#14532d', color: node.canary > 0 ? '#fbbf24' : '#86efac', fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
            {node.canary > 0 ? `canary ${node.canary}%` : node.deployStrategy}
          </span>
        </div>
      )
    }
    if (view === 'team') {
      return (
        <div style={s({ display: 'flex', gap: 6, marginTop: 4 })}>
          <span style={s({ background: '#1e293b', color: node.teamColor, fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
            {node.team}
          </span>
          <span style={s({ background: '#1e293b', color: '#94a3b8', fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
            SLO: {node.slo}
          </span>
        </div>
      )
    }
    if (view === 'traffic') {
      const latencyColor = node.latency > 200 ? '#f87171' : node.latency > 100 ? '#fbbf24' : '#86efac'
      return (
        <div style={s({ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' })}>
          <span style={s({ background: '#1e293b', color: '#60a5fa', fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
            {node.requestPct}% трафика
          </span>
          <span style={s({ background: '#1e293b', color: latencyColor, fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
            p50: {node.latency}ms
          </span>
          <span style={s({ background: '#1e293b', color: node.errorRate > 0.3 ? '#f87171' : '#86efac', fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
            err: {node.errorRate}%
          </span>
        </div>
      )
    }
    return (
      <div style={s({ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' })}>
        {node.sharedDeps.slice(0, 3).map(d => (
          <span key={d} style={s({ background: '#1e293b', color: '#94a3b8', fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
            {d}
          </span>
        ))}
        {node.sharedDeps.length > 3 && (
          <span style={s({ background: '#1e293b', color: '#64748b', fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
            +{node.sharedDeps.length - 3}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      style={s({
        background: selected ? `${node.color}33` : '#1e293b',
        border: `2px solid ${selected ? node.color : '#334155'}`,
        borderRadius: 10,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        minWidth: 160,
      })}
    >
      <div style={s({ display: 'flex', alignItems: 'center', gap: 8 })}>
        <div style={s({ width: 10, height: 10, borderRadius: '50%', background: node.color, flexShrink: 0 })} />
        <span style={s({ color: '#e2e8f0', fontWeight: 600, fontSize: 13 })}>{node.label}</span>
      </div>
      {getBadge()}
    </div>
  )
}

function DetailPanel({ node, onClose }: { node: MfeNode; onClose: () => void }) {
  return (
    <div style={s({
      background: '#0f172a',
      border: `1px solid ${node.color}`,
      borderRadius: 12,
      padding: 20,
      marginTop: 16,
    })}>
      <div style={s({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 })}>
        <div style={s({ display: 'flex', alignItems: 'center', gap: 10 })}>
          <div style={s({ width: 14, height: 14, borderRadius: '50%', background: node.color })} />
          <span style={s({ color: '#f1f5f9', fontWeight: 700, fontSize: 16 })}>{node.label}</span>
          <span style={s({ background: '#1e293b', color: node.teamColor, fontSize: 11, padding: '2px 8px', borderRadius: 4 })}>
            {node.team}
          </span>
        </div>
        <button
          onClick={onClose}
          style={s({ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18 })}
        >
          ×
        </button>
      </div>
      <div style={s({ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, fontSize: 12 })}>
        <div>
          <div style={s({ color: '#64748b', marginBottom: 6, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' })}>
            Технологии
          </div>
          <div style={s({ color: '#94a3b8', marginBottom: 4 })}>Framework: <span style={s({ color: '#e2e8f0' })}>{node.framework}</span></div>
          <div style={s({ color: '#94a3b8', marginBottom: 4 })}>Версия: <span style={s({ color: '#86efac' })}>v{node.version}</span></div>
          <div style={s({ color: '#94a3b8', marginBottom: 4 })}>Deploy: <span style={s({ color: '#60a5fa' })}>{node.deployStrategy}</span></div>
          {node.canary > 0 && <div style={s({ color: '#94a3b8' })}>Canary: <span style={s({ color: '#fbbf24' })}>{node.canary}%</span></div>}
        </div>
        <div>
          <div style={s({ color: '#64748b', marginBottom: 6, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' })}>
            Events
          </div>
          <div style={s({ color: '#64748b', marginBottom: 4, fontSize: 11 })}>Публикует:</div>
          {node.emits.map(e => (
            <div key={e} style={s({ color: '#fbbf24', marginBottom: 2 })}>↑ {e}</div>
          ))}
          <div style={s({ color: '#64748b', marginBottom: 4, fontSize: 11, marginTop: 6 })}>Слушает:</div>
          {node.listens.map(e => (
            <div key={e} style={s({ color: '#86efac', marginBottom: 2 })}>↓ {e}</div>
          ))}
        </div>
        <div>
          <div style={s({ color: '#64748b', marginBottom: 6, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' })}>
            Метрики
          </div>
          <div style={s({ color: '#94a3b8', marginBottom: 4 })}>SLO: <span style={s({ color: '#86efac' })}>{node.slo}</span></div>
          <div style={s({ color: '#94a3b8', marginBottom: 4 })}>Трафик: <span style={s({ color: '#60a5fa' })}>{node.requestPct}%</span></div>
          <div style={s({ color: '#94a3b8', marginBottom: 4 })}>Latency: <span style={s({ color: node.latency > 200 ? '#f87171' : '#86efac' })}>{node.latency}ms</span></div>
          <div style={s({ color: '#94a3b8', marginBottom: 8 })}>Ошибки: <span style={s({ color: node.errorRate > 0.3 ? '#f87171' : '#86efac' })}>{node.errorRate}%</span></div>
          <div style={s({ color: '#64748b', marginBottom: 4, fontSize: 11 })}>Маршруты:</div>
          {node.routes.map(r => (
            <div key={r} style={s({ color: '#c084fc', marginBottom: 2, fontFamily: 'monospace', fontSize: 11 })}>{r}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DependencyView({ mfes, libs, selected, onSelect }: { mfes: MfeNode[]; libs: SharedLib[]; selected: string | null; onSelect: (id: string | null) => void }) {
  return (
    <div>
      <div style={s({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 })}>
        {mfes.map(node => (
          <MfeCard key={node.id} node={node} selected={selected === node.id} onClick={() => onSelect(selected === node.id ? null : node.id)} view="dependency" />
        ))}
      </div>
      <div style={s({ background: '#0f172a', borderRadius: 10, padding: 16, marginBottom: 16 })}>
        <div style={s({ color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 })}>
          Shared Libraries (Module Federation singletons)
        </div>
        <div style={s({ display: 'flex', gap: 10, flexWrap: 'wrap' })}>
          {libs.map(lib => (
            <div key={lib.id} style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px' })}>
              <div style={s({ color: '#fbbf24', fontSize: 12, fontWeight: 600 })}>{lib.label}</div>
              <div style={s({ color: '#64748b', fontSize: 10, marginTop: 2 })}>
                {lib.usedBy.length} MFE используют
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={s({ background: '#0f172a', borderRadius: 10, padding: 16 })}>
        <div style={s({ color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 })}>
          Граф зависимостей: MFE → shared libs
        </div>
        {mfes.map(node => (
          <div key={node.id} style={s({ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 })}>
            <div style={s({ width: 8, height: 8, borderRadius: '50%', background: node.color, flexShrink: 0 })} />
            <span style={s({ color: '#e2e8f0', fontSize: 12, width: 120 })}>{node.label}</span>
            <span style={s({ color: '#334155', fontSize: 12 })}>→</span>
            <div style={s({ display: 'flex', gap: 6, flexWrap: 'wrap' })}>
              {node.sharedDeps.map(dep => (
                <span key={dep} style={s({ background: '#1e293b', color: '#94a3b8', fontSize: 11, padding: '1px 6px', borderRadius: 4 })}>
                  {dep}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DeployView({ mfes, selected, onSelect }: { mfes: MfeNode[]; selected: string | null; onSelect: (id: string | null) => void }) {
  const strategies = ['Blue/Green', 'Canary', 'Rolling', 'Direct']
  const strategyColors: Record<string, string> = {
    'Blue/Green': '#3b82f6',
    'Canary': '#fbbf24',
    'Rolling': '#22c55e',
    'Direct': '#94a3b8',
  }

  return (
    <div>
      <div style={s({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 })}>
        {mfes.map(node => (
          <MfeCard key={node.id} node={node} selected={selected === node.id} onClick={() => onSelect(selected === node.id ? null : node.id)} view="deploy" />
        ))}
      </div>
      <div style={s({ background: '#0f172a', borderRadius: 10, padding: 16 })}>
        <div style={s({ color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 })}>
          Deploy Pipeline по стратегиям
        </div>
        {strategies.map(strategy => {
          const stratMfes = mfes.filter(m => m.deployStrategy === strategy)
          if (stratMfes.length === 0) return null
          return (
            <div key={strategy} style={s({ marginBottom: 16 })}>
              <div style={s({ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 })}>
                <div style={s({ width: 10, height: 10, borderRadius: 2, background: strategyColors[strategy] })} />
                <span style={s({ color: strategyColors[strategy], fontWeight: 600, fontSize: 12 })}>{strategy}</span>
              </div>
              <div style={s({ display: 'flex', gap: 8, flexWrap: 'wrap' })}>
                {stratMfes.map(mfe => (
                  <div key={mfe.id} style={s({ display: 'flex', alignItems: 'center', gap: 4 })}>
                    <span style={s({ background: '#1e293b', color: '#e2e8f0', fontSize: 11, padding: '4px 8px', borderRadius: 4 })}>
                      {mfe.label}
                    </span>
                    <span style={s({ color: '#64748b', fontSize: 10 })}>v{mfe.version}</span>
                    {mfe.canary > 0 && (
                      <span style={s({ background: '#78350f', color: '#fbbf24', fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
                        {mfe.canary}% canary
                      </span>
                    )}
                    <span style={s({ color: '#334155', fontSize: 10 })}>→</span>
                    <span style={s({ background: '#14532d', color: '#86efac', fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
                      live
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TeamView({ mfes, selected, onSelect }: { mfes: MfeNode[]; selected: string | null; onSelect: (id: string | null) => void }) {
  const teams = Array.from(new Set(mfes.map(m => m.team)))

  return (
    <div>
      <div style={s({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 })}>
        {mfes.map(node => (
          <MfeCard key={node.id} node={node} selected={selected === node.id} onClick={() => onSelect(selected === node.id ? null : node.id)} view="team" />
        ))}
      </div>
      <div style={s({ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 })}>
        {teams.map(team => {
          const teamMfes = mfes.filter(m => m.team === team)
          const teamColor = teamMfes[0]?.teamColor || '#94a3b8'
          return (
            <div key={team} style={s({ background: '#0f172a', border: `1px solid ${teamColor}44`, borderRadius: 10, padding: 14 })}>
              <div style={s({ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 })}>
                <div style={s({ width: 10, height: 10, borderRadius: '50%', background: teamColor })} />
                <span style={s({ color: teamColor, fontWeight: 700, fontSize: 14 })}>Команда {team}</span>
                <span style={s({ color: '#64748b', fontSize: 12 })}>({teamMfes.length} MFE)</span>
              </div>
              {teamMfes.map(mfe => (
                <div key={mfe.id} style={s({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, padding: '4px 0', borderBottom: '1px solid #1e293b' })}>
                  <span style={s({ color: '#e2e8f0', fontSize: 12 })}>{mfe.label}</span>
                  <div style={s({ display: 'flex', gap: 6 })}>
                    <span style={s({ background: '#1e293b', color: '#94a3b8', fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
                      SLO: {mfe.slo}
                    </span>
                    <span style={s({ background: '#1e293b', color: '#60a5fa', fontSize: 10, padding: '2px 6px', borderRadius: 4 })}>
                      {mfe.framework.split(' ')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TrafficView({ mfes, selected, onSelect }: { mfes: MfeNode[]; selected: string | null; onSelect: (id: string | null) => void }) {
  const maxLatency = Math.max(...mfes.map(m => m.latency))

  return (
    <div>
      <div style={s({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 })}>
        {mfes.map(node => (
          <MfeCard key={node.id} node={node} selected={selected === node.id} onClick={() => onSelect(selected === node.id ? null : node.id)} view="traffic" />
        ))}
      </div>
      <div style={s({ background: '#0f172a', borderRadius: 10, padding: 16 })}>
        <div style={s({ color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 })}>
          Latency (p50, ms)
        </div>
        {mfes.map(node => (
          <div key={node.id} style={s({ marginBottom: 10 })}>
            <div style={s({ display: 'flex', justifyContent: 'space-between', marginBottom: 4 })}>
              <span style={s({ color: '#e2e8f0', fontSize: 12 })}>{node.label}</span>
              <span style={s({ color: node.latency > 200 ? '#f87171' : '#86efac', fontSize: 12 })}>
                {node.latency}ms
              </span>
            </div>
            <div style={s({ background: '#1e293b', borderRadius: 4, height: 8 })}>
              <div style={s({
                background: node.latency > 200 ? '#ef4444' : node.latency > 100 ? '#f59e0b' : '#22c55e',
                height: 8,
                borderRadius: 4,
                width: `${(node.latency / maxLatency) * 100}%`,
                transition: 'width 0.3s',
              })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Task15_1_Solution() {
  const [view, setView] = useState<ArchView>('dependency')
  const [selected, setSelected] = useState<string | null>(null)

  const selectedNode = MFE_NODES.find(n => n.id === selected) || null

  const handleSelect = useCallback((id: string | null) => {
    setSelected(id)
  }, [])

  return (
    <div style={s({ background: '#0f172a', minHeight: '100vh', padding: 24, fontFamily: 'system-ui, sans-serif', color: '#e2e8f0' })}>
      <div style={s({ maxWidth: 900, margin: '0 auto' })}>
        <div style={s({ marginBottom: 24 })}>
          <h2 style={s({ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 4 })}>
            E-Commerce MFE Platform
          </h2>
          <p style={s({ color: '#64748b', fontSize: 13, margin: 0 })}>
            Shell + 5 микрофронтендов. Кликните на MFE для подробностей.
          </p>
        </div>

        {/* View Switcher */}
        <div style={s({ display: 'flex', gap: 8, marginBottom: 20, background: '#1e293b', padding: 4, borderRadius: 10, width: 'fit-content' })}>
          {(Object.keys(VIEW_LABELS) as ArchView[]).map(v => (
            <button
              key={v}
              onClick={() => { setView(v); setSelected(null) }}
              style={s({
                background: view === v ? '#3b82f6' : 'none',
                border: 'none',
                color: view === v ? '#fff' : '#94a3b8',
                padding: '6px 16px',
                borderRadius: 7,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: view === v ? 600 : 400,
                transition: 'all 0.2s',
              })}
            >
              {VIEW_LABELS[v]}
            </button>
          ))}
        </div>

        {/* Main View */}
        {view === 'dependency' && (
          <DependencyView mfes={MFE_NODES} libs={SHARED_LIBS} selected={selected} onSelect={handleSelect} />
        )}
        {view === 'deploy' && (
          <DeployView mfes={MFE_NODES} selected={selected} onSelect={handleSelect} />
        )}
        {view === 'team' && (
          <TeamView mfes={MFE_NODES} selected={selected} onSelect={handleSelect} />
        )}
        {view === 'traffic' && (
          <TrafficView mfes={MFE_NODES} selected={selected} onSelect={handleSelect} />
        )}

        {/* Detail Panel */}
        {selectedNode && (
          <DetailPanel node={selectedNode} onClose={() => setSelected(null)} />
        )}

        {/* Architecture Summary */}
        <div style={s({ marginTop: 20, background: '#1e293b', borderRadius: 10, padding: 14 })}>
          <div style={s({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 })}>
            {[
              { label: 'MFE всего', value: `${MFE_NODES.length}`, color: '#60a5fa' },
              { label: 'Команд', value: `${new Set(MFE_NODES.map(m => m.team)).size}`, color: '#a855f7' },
              { label: 'Shared libs', value: `${SHARED_LIBS.length}`, color: '#fbbf24' },
              { label: 'Canary active', value: `${MFE_NODES.filter(m => m.canary > 0).length}`, color: '#f97316' },
            ].map(item => (
              <div key={item.label} style={s({ textAlign: 'center' })}>
                <div style={s({ color: item.color, fontSize: 22, fontWeight: 700 })}>{item.value}</div>
                <div style={s({ color: '#64748b', fontSize: 11 })}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// =====================================================
// Task 15.2: Architecture Document Wizard
// =====================================================

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6

type MfeEntry = {
  name: string
  domain: string
  framework: string
  team: string
}

type SharedDepConfig = {
  dep: string
  strategy: 'module-federation' | 'import-map' | 'cdn'
  singleton: boolean
}

type CommContract = {
  from: string
  to: string
  event: string
  payload: string
}

type RoutingEntry = {
  mfe: string
  path: string
  lazy: boolean
}

type DeployConfig = {
  mfe: string
  strategy: string
  rollback: boolean
}

type MonitoringConfig = {
  mfe: string
  slo: string
  errorBoundary: boolean
  circuitBreaker: boolean
}

const STEP_LABELS: Record<WizardStep, string> = {
  1: 'MFE',
  2: 'Shared Deps',
  3: 'Contracts',
  4: 'Routing',
  5: 'Deploy',
  6: 'Monitoring',
}

const FRAMEWORK_OPTIONS = ['React 18', 'Vue 3', 'Angular 17', 'Svelte 5', 'React 18 + Next.js']
const DEPLOY_STRATEGIES = ['Blue/Green', 'Canary', 'Rolling', 'Feature Flags', 'Direct']
const SLO_OPTIONS = ['99%', '99.5%', '99.9%', '99.95%', '99.99%']
const SHARED_DEP_OPTIONS = ['react', 'react-dom', 'vue', 'rxjs', '@company/ui-kit', '@company/utils', '@company/analytics', 'zustand', 'i18next']

const CHECKLIST_ITEMS = [
  { key: 'hasMfe', label: 'Определены все MFE', fn: (w: WizardState) => w.mfes.length >= 2 },
  { key: 'hasDomain', label: 'У каждого MFE есть домен', fn: (w: WizardState) => w.mfes.every(m => m.domain.trim().length > 0) },
  { key: 'hasTeam', label: 'У каждого MFE есть команда', fn: (w: WizardState) => w.mfes.every(m => m.team.trim().length > 0) },
  { key: 'hasSharedDeps', label: 'Настроены shared зависимости', fn: (w: WizardState) => w.sharedDeps.length > 0 },
  { key: 'hasContracts', label: 'Определены event-контракты', fn: (w: WizardState) => w.contracts.length > 0 },
  { key: 'hasRouting', label: 'Настроена маршрутизация', fn: (w: WizardState) => w.routing.length > 0 },
  { key: 'hasDeploy', label: 'Выбраны стратегии деплоя', fn: (w: WizardState) => w.deployConfigs.length > 0 },
  { key: 'hasRollback', label: 'Настроен rollback', fn: (w: WizardState) => w.deployConfigs.some(d => d.rollback) },
  { key: 'hasMonitoring', label: 'Настроен мониторинг', fn: (w: WizardState) => w.monitoring.length > 0 },
  { key: 'hasErrorBoundary', label: 'Error boundary на каждом MFE', fn: (w: WizardState) => w.monitoring.every(m => m.errorBoundary) },
]

type WizardState = {
  mfes: MfeEntry[]
  sharedDeps: SharedDepConfig[]
  contracts: CommContract[]
  routing: RoutingEntry[]
  deployConfigs: DeployConfig[]
  monitoring: MonitoringConfig[]
}

function ProgressBar({ step, total }: { step: WizardStep; total: number }) {
  return (
    <div style={s({ display: 'flex', gap: 0, marginBottom: 24, borderRadius: 10, overflow: 'hidden' })}>
      {Array.from({ length: total }, (_, i) => {
        const stepNum = (i + 1) as WizardStep
        const isDone = stepNum < step
        const isCurrent = stepNum === step
        return (
          <div
            key={i}
            style={s({
              flex: 1,
              padding: '8px 4px',
              background: isDone ? '#1d4ed8' : isCurrent ? '#3b82f6' : '#1e293b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              borderRight: i < total - 1 ? '1px solid #0f172a' : 'none',
              transition: 'background 0.3s',
            })}
          >
            <span style={s({ color: isDone || isCurrent ? '#fff' : '#475569', fontSize: 10, fontWeight: isCurrent ? 700 : 400 })}>
              {isDone ? '✓' : stepNum}
            </span>
            <span style={s({ color: isDone || isCurrent ? '#bfdbfe' : '#475569', fontSize: 9 })}>
              {STEP_LABELS[stepNum]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function Step1Mfes({ mfes, onChange }: { mfes: MfeEntry[]; onChange: (mfes: MfeEntry[]) => void }) {
  const addMfe = () => {
    onChange([...mfes, { name: '', domain: '', framework: 'React 18', team: '' }])
  }
  const removeMfe = (i: number) => {
    onChange(mfes.filter((_, idx) => idx !== i))
  }
  const updateMfe = (i: number, field: keyof MfeEntry, value: string) => {
    const updated = mfes.map((m, idx) => idx === i ? { ...m, [field]: value } : m)
    onChange(updated)
  }

  return (
    <div>
      <h3 style={s({ color: '#f1f5f9', fontWeight: 600, marginTop: 0, marginBottom: 4 })}>Шаг 1: Определите MFE</h3>
      <p style={s({ color: '#64748b', fontSize: 13, marginBottom: 16 })}>Добавьте микрофронтенды вашей платформы. Минимум 2 MFE.</p>
      {mfes.map((mfe, i) => (
        <div key={i} style={s({ background: '#0f172a', borderRadius: 8, padding: 14, marginBottom: 10 })}>
          <div style={s({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 })}>
            <div>
              <label style={s({ color: '#64748b', fontSize: 11, display: 'block', marginBottom: 4 })}>Название MFE</label>
              <input
                value={mfe.name}
                onChange={e => updateMfe(i, 'name', e.target.value)}
                placeholder="catalog-mfe"
                style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 10px', color: '#e2e8f0', width: '100%', boxSizing: 'border-box', fontSize: 13 })}
              />
            </div>
            <div>
              <label style={s({ color: '#64748b', fontSize: 11, display: 'block', marginBottom: 4 })}>Домен</label>
              <input
                value={mfe.domain}
                onChange={e => updateMfe(i, 'domain', e.target.value)}
                placeholder="Каталог товаров"
                style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 10px', color: '#e2e8f0', width: '100%', boxSizing: 'border-box', fontSize: 13 })}
              />
            </div>
            <div>
              <label style={s({ color: '#64748b', fontSize: 11, display: 'block', marginBottom: 4 })}>Framework</label>
              <select
                value={mfe.framework}
                onChange={e => updateMfe(i, 'framework', e.target.value)}
                style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 10px', color: '#e2e8f0', width: '100%', boxSizing: 'border-box', fontSize: 13 })}
              >
                {FRAMEWORK_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={s({ color: '#64748b', fontSize: 11, display: 'block', marginBottom: 4 })}>Команда</label>
              <input
                value={mfe.team}
                onChange={e => updateMfe(i, 'team', e.target.value)}
                placeholder="Commerce Team"
                style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 10px', color: '#e2e8f0', width: '100%', boxSizing: 'border-box', fontSize: 13 })}
              />
            </div>
          </div>
          <button
            onClick={() => removeMfe(i)}
            style={s({ background: '#1e293b', border: '1px solid #334155', color: '#f87171', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 })}
          >
            Удалить
          </button>
        </div>
      ))}
      <button
        onClick={addMfe}
        style={s({ background: '#1d4ed8', border: 'none', color: '#fff', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 })}
      >
        + Добавить MFE
      </button>
    </div>
  )
}

function Step2SharedDeps({ deps, onChange }: { deps: SharedDepConfig[]; onChange: (deps: SharedDepConfig[]) => void }) {
  const addDep = (dep: string) => {
    if (deps.find(d => d.dep === dep)) return
    onChange([...deps, { dep, strategy: 'module-federation', singleton: true }])
  }
  const removeDep = (dep: string) => {
    onChange(deps.filter(d => d.dep !== dep))
  }
  const updateDep = (dep: string, field: keyof SharedDepConfig, value: string | boolean) => {
    onChange(deps.map(d => d.dep === dep ? { ...d, [field]: value } : d))
  }

  return (
    <div>
      <h3 style={s({ color: '#f1f5f9', fontWeight: 600, marginTop: 0, marginBottom: 4 })}>Шаг 2: Shared Dependencies</h3>
      <p style={s({ color: '#64748b', fontSize: 13, marginBottom: 16 })}>Выберите зависимости для совместного использования и стратегию.</p>
      <div style={s({ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 })}>
        {SHARED_DEP_OPTIONS.map(dep => (
          <button
            key={dep}
            onClick={() => addDep(dep)}
            style={s({
              background: deps.find(d => d.dep === dep) ? '#1d4ed8' : '#1e293b',
              border: `1px solid ${deps.find(d => d.dep === dep) ? '#3b82f6' : '#334155'}`,
              color: deps.find(d => d.dep === dep) ? '#fff' : '#94a3b8',
              borderRadius: 6,
              padding: '5px 10px',
              cursor: 'pointer',
              fontSize: 12,
            })}
          >
            {dep}
          </button>
        ))}
      </div>
      {deps.map(dep => (
        <div key={dep.dep} style={s({ background: '#0f172a', borderRadius: 8, padding: 12, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' })}>
          <span style={s({ color: '#fbbf24', fontSize: 13, fontWeight: 600, minWidth: 150 })}>{dep.dep}</span>
          <select
            value={dep.strategy}
            onChange={e => updateDep(dep.dep, 'strategy', e.target.value)}
            style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '5px 8px', color: '#e2e8f0', fontSize: 12 })}
          >
            <option value="module-federation">Module Federation</option>
            <option value="import-map">Import Map</option>
            <option value="cdn">CDN</option>
          </select>
          <label style={s({ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' })}>
            <input
              type="checkbox"
              checked={dep.singleton}
              onChange={e => updateDep(dep.dep, 'singleton', e.target.checked)}
            />
            <span style={s({ color: '#94a3b8', fontSize: 12 })}>singleton</span>
          </label>
          <button
            onClick={() => removeDep(dep.dep)}
            style={s({ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 16, marginLeft: 'auto' })}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

function Step3Contracts({ mfes, contracts, onChange }: { mfes: MfeEntry[]; contracts: CommContract[]; onChange: (c: CommContract[]) => void }) {
  const addContract = () => {
    if (mfes.length < 2) return
    onChange([...contracts, { from: mfes[0]?.name || '', to: mfes[1]?.name || '', event: '', payload: '' }])
  }
  const removeContract = (i: number) => {
    onChange(contracts.filter((_, idx) => idx !== i))
  }
  const updateContract = (i: number, field: keyof CommContract, value: string) => {
    onChange(contracts.map((c, idx) => idx === i ? { ...c, [field]: value } : c))
  }

  return (
    <div>
      <h3 style={s({ color: '#f1f5f9', fontWeight: 600, marginTop: 0, marginBottom: 4 })}>Шаг 3: Communication Contracts</h3>
      <p style={s({ color: '#64748b', fontSize: 13, marginBottom: 16 })}>Определите события между MFE: кто публикует, кто слушает.</p>
      {contracts.map((c, i) => (
        <div key={i} style={s({ background: '#0f172a', borderRadius: 8, padding: 12, marginBottom: 10 })}>
          <div style={s({ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'end', marginBottom: 8 })}>
            <div>
              <label style={s({ color: '#64748b', fontSize: 11, display: 'block', marginBottom: 4 })}>Источник (emit)</label>
              <select
                value={c.from}
                onChange={e => updateContract(i, 'from', e.target.value)}
                style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 8px', color: '#e2e8f0', width: '100%', fontSize: 12 })}
              >
                {mfes.map(m => <option key={m.name} value={m.name}>{m.name || 'unnamed'}</option>)}
              </select>
            </div>
            <span style={s({ color: '#fbbf24', fontSize: 18, paddingBottom: 4 })}>→</span>
            <div>
              <label style={s({ color: '#64748b', fontSize: 11, display: 'block', marginBottom: 4 })}>Получатель (listen)</label>
              <select
                value={c.to}
                onChange={e => updateContract(i, 'to', e.target.value)}
                style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 8px', color: '#e2e8f0', width: '100%', fontSize: 12 })}
              >
                {mfes.map(m => <option key={m.name} value={m.name}>{m.name || 'unnamed'}</option>)}
              </select>
            </div>
          </div>
          <div style={s({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 })}>
            <div>
              <label style={s({ color: '#64748b', fontSize: 11, display: 'block', marginBottom: 4 })}>Событие</label>
              <input
                value={c.event}
                onChange={e => updateContract(i, 'event', e.target.value)}
                placeholder="cart:add"
                style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 10px', color: '#e2e8f0', width: '100%', boxSizing: 'border-box', fontSize: 12, fontFamily: 'monospace' })}
              />
            </div>
            <div>
              <label style={s({ color: '#64748b', fontSize: 11, display: 'block', marginBottom: 4 })}>Payload (тип)</label>
              <input
                value={c.payload}
                onChange={e => updateContract(i, 'payload', e.target.value)}
                placeholder="{ productId: string, qty: number }"
                style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 10px', color: '#e2e8f0', width: '100%', boxSizing: 'border-box', fontSize: 12, fontFamily: 'monospace' })}
              />
            </div>
          </div>
          <button
            onClick={() => removeContract(i)}
            style={s({ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 12, marginTop: 8 })}
          >
            Удалить контракт
          </button>
        </div>
      ))}
      <button
        onClick={addContract}
        disabled={mfes.length < 2}
        style={s({ background: mfes.length < 2 ? '#1e293b' : '#1d4ed8', border: 'none', color: mfes.length < 2 ? '#64748b' : '#fff', borderRadius: 8, padding: '8px 16px', cursor: mfes.length < 2 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 })}
      >
        + Добавить контракт
      </button>
      {mfes.length < 2 && (
        <p style={s({ color: '#f59e0b', fontSize: 12, marginTop: 8 })}>Сначала добавьте минимум 2 MFE на шаге 1</p>
      )}
    </div>
  )
}

function Step4Routing({ mfes, routing, onChange }: { mfes: MfeEntry[]; routing: RoutingEntry[]; onChange: (r: RoutingEntry[]) => void }) {
  const addRoute = () => {
    onChange([...routing, { mfe: mfes[0]?.name || '', path: '', lazy: true }])
  }
  const removeRoute = (i: number) => {
    onChange(routing.filter((_, idx) => idx !== i))
  }
  const updateRoute = (i: number, field: keyof RoutingEntry, value: string | boolean) => {
    onChange(routing.map((r, idx) => idx === i ? { ...r, [field]: value } : r))
  }

  return (
    <div>
      <h3 style={s({ color: '#f1f5f9', fontWeight: 600, marginTop: 0, marginBottom: 4 })}>Шаг 4: Routing</h3>
      <p style={s({ color: '#64748b', fontSize: 13, marginBottom: 16 })}>Маршруты shell → MFE. Используйте lazy loading для производительности.</p>
      {routing.map((r, i) => (
        <div key={i} style={s({ background: '#0f172a', borderRadius: 8, padding: 12, marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' })}>
          <select
            value={r.mfe}
            onChange={e => updateRoute(i, 'mfe', e.target.value)}
            style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 8px', color: '#e2e8f0', fontSize: 12 })}
          >
            {mfes.map(m => <option key={m.name} value={m.name}>{m.name || 'unnamed'}</option>)}
          </select>
          <span style={s({ color: '#64748b', fontSize: 14 })}>→</span>
          <input
            value={r.path}
            onChange={e => updateRoute(i, 'path', e.target.value)}
            placeholder="/catalog"
            style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 10px', color: '#c084fc', fontSize: 12, fontFamily: 'monospace', flex: 1, minWidth: 100 })}
          />
          <label style={s({ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' })}>
            <input
              type="checkbox"
              checked={r.lazy}
              onChange={e => updateRoute(i, 'lazy', e.target.checked)}
            />
            <span style={s({ color: '#94a3b8', fontSize: 12 })}>lazy</span>
          </label>
          <button
            onClick={() => removeRoute(i)}
            style={s({ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 16 })}
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={addRoute}
        disabled={mfes.length === 0}
        style={s({ background: mfes.length === 0 ? '#1e293b' : '#1d4ed8', border: 'none', color: mfes.length === 0 ? '#64748b' : '#fff', borderRadius: 8, padding: '8px 16px', cursor: mfes.length === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 })}
      >
        + Добавить маршрут
      </button>
    </div>
  )
}

function Step5Deploy({ mfes, configs, onChange }: { mfes: MfeEntry[]; configs: DeployConfig[]; onChange: (c: DeployConfig[]) => void }) {
  const ensureAll = useCallback(() => {
    const existing = new Set(configs.map(c => c.mfe))
    const missing = mfes.filter(m => !existing.has(m.name) && m.name)
    if (missing.length > 0) {
      onChange([...configs, ...missing.map(m => ({ mfe: m.name, strategy: 'Blue/Green', rollback: true }))])
    }
  }, [mfes, configs, onChange])

  const updateConfig = (mfe: string, field: keyof DeployConfig, value: string | boolean) => {
    onChange(configs.map(c => c.mfe === mfe ? { ...c, [field]: value } : c))
  }

  return (
    <div>
      <h3 style={s({ color: '#f1f5f9', fontWeight: 600, marginTop: 0, marginBottom: 4 })}>Шаг 5: Deploy Strategy</h3>
      <p style={s({ color: '#64748b', fontSize: 13, marginBottom: 12 })}>Выберите стратегию деплоя для каждого MFE.</p>
      <button
        onClick={ensureAll}
        style={s({ background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12, marginBottom: 12 })}
      >
        Автозаполнить все MFE
      </button>
      {configs.map(cfg => (
        <div key={cfg.mfe} style={s({ background: '#0f172a', borderRadius: 8, padding: 12, marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' })}>
          <span style={s({ color: '#e2e8f0', fontSize: 13, fontWeight: 600, minWidth: 120 })}>{cfg.mfe}</span>
          <select
            value={cfg.strategy}
            onChange={e => updateConfig(cfg.mfe, 'strategy', e.target.value)}
            style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '6px 8px', color: '#e2e8f0', fontSize: 12 })}
          >
            {DEPLOY_STRATEGIES.map(s2 => <option key={s2} value={s2}>{s2}</option>)}
          </select>
          <label style={s({ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' })}>
            <input
              type="checkbox"
              checked={cfg.rollback}
              onChange={e => updateConfig(cfg.mfe, 'rollback', e.target.checked)}
            />
            <span style={s({ color: '#94a3b8', fontSize: 12 })}>auto rollback</span>
          </label>
        </div>
      ))}
    </div>
  )
}

function Step6Monitoring({ mfes, monitoring, onChange }: { mfes: MfeEntry[]; monitoring: MonitoringConfig[]; onChange: (m: MonitoringConfig[]) => void }) {
  const ensureAll = useCallback(() => {
    const existing = new Set(monitoring.map(m => m.mfe))
    const missing = mfes.filter(m => !existing.has(m.name) && m.name)
    if (missing.length > 0) {
      onChange([...monitoring, ...missing.map(m => ({ mfe: m.name, slo: '99.5%', errorBoundary: true, circuitBreaker: false }))])
    }
  }, [mfes, monitoring, onChange])

  const updateMonitoring = (mfe: string, field: keyof MonitoringConfig, value: string | boolean) => {
    onChange(monitoring.map(m => m.mfe === mfe ? { ...m, [field]: value } : m))
  }

  return (
    <div>
      <h3 style={s({ color: '#f1f5f9', fontWeight: 600, marginTop: 0, marginBottom: 4 })}>Шаг 6: Monitoring & SLO</h3>
      <p style={s({ color: '#64748b', fontSize: 13, marginBottom: 12 })}>SLO, error boundary и circuit breaker для каждого MFE.</p>
      <button
        onClick={ensureAll}
        style={s({ background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12, marginBottom: 12 })}
      >
        Автозаполнить все MFE
      </button>
      {monitoring.map(m => (
        <div key={m.mfe} style={s({ background: '#0f172a', borderRadius: 8, padding: 12, marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' })}>
          <span style={s({ color: '#e2e8f0', fontSize: 13, fontWeight: 600, minWidth: 120 })}>{m.mfe}</span>
          <div>
            <label style={s({ color: '#64748b', fontSize: 10, display: 'block', marginBottom: 2 })}>SLO</label>
            <select
              value={m.slo}
              onChange={e => updateMonitoring(m.mfe, 'slo', e.target.value)}
              style={s({ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: '5px 8px', color: '#e2e8f0', fontSize: 12 })}
            >
              {SLO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <label style={s({ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' })}>
            <input
              type="checkbox"
              checked={m.errorBoundary}
              onChange={e => updateMonitoring(m.mfe, 'errorBoundary', e.target.checked)}
            />
            <span style={s({ color: '#94a3b8', fontSize: 12 })}>Error Boundary</span>
          </label>
          <label style={s({ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' })}>
            <input
              type="checkbox"
              checked={m.circuitBreaker}
              onChange={e => updateMonitoring(m.mfe, 'circuitBreaker', e.target.checked)}
            />
            <span style={s({ color: '#94a3b8', fontSize: 12 })}>Circuit Breaker</span>
          </label>
        </div>
      ))}
    </div>
  )
}

function AdrDocument({ state }: { state: WizardState }) {
  const score = CHECKLIST_ITEMS.filter(item => item.fn(state)).length

  const lines: string[] = [
    '# Architecture Decision Record',
    '## MFE Platform Design',
    '',
    `**Дата:** ${new Date().toLocaleDateString('ru-RU')}`,
    `**Статус:** Draft`,
    '',
    '## 1. Микрофронтенды',
    '',
    ...state.mfes.map(m => `- **${m.name}** (${m.domain}) — ${m.framework}, команда: ${m.team}`),
    '',
    '## 2. Shared Dependencies',
    '',
    ...state.sharedDeps.map(d => `- \`${d.dep}\` — стратегия: ${d.strategy}${d.singleton ? ', singleton' : ''}`),
    '',
    '## 3. Communication Contracts',
    '',
    ...state.contracts.map(c => `- \`${c.event}\`: ${c.from} → ${c.to} (payload: ${c.payload})`),
    '',
    '## 4. Routing',
    '',
    ...state.routing.map(r => `- \`${r.path}\` → ${r.mfe}${r.lazy ? ' (lazy)' : ''}`),
    '',
    '## 5. Deploy Strategy',
    '',
    ...state.deployConfigs.map(d => `- **${d.mfe}**: ${d.strategy}${d.rollback ? ', auto rollback' : ''}`),
    '',
    '## 6. Monitoring',
    '',
    ...state.monitoring.map(m => `- **${m.mfe}**: SLO ${m.slo}${m.errorBoundary ? ', ErrorBoundary' : ''}${m.circuitBreaker ? ', CircuitBreaker' : ''}`),
  ]

  const adrText = lines.join('\n')

  const copy = () => {
    navigator.clipboard.writeText(adrText).catch(() => {})
  }

  return (
    <div>
      <div style={s({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 })}>
        <h3 style={s({ color: '#f1f5f9', fontWeight: 700, margin: 0, fontSize: 18 })}>
          Архитектурный документ готов
        </h3>
        <div style={s({ display: 'flex', alignItems: 'center', gap: 10 })}>
          <span style={s({ color: score >= 8 ? '#86efac' : score >= 5 ? '#fbbf24' : '#f87171', fontSize: 14, fontWeight: 600 })}>
            {score}/{CHECKLIST_ITEMS.length} чеклист
          </span>
          <button
            onClick={copy}
            style={s({ background: '#1d4ed8', border: 'none', color: '#fff', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13 })}
          >
            Скопировать ADR
          </button>
        </div>
      </div>

      <div style={s({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 })}>
        <div style={s({ background: '#0f172a', borderRadius: 10, padding: 16, fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', lineHeight: 1.8, maxHeight: 400, overflow: 'auto', whiteSpace: 'pre-wrap' })}>
          {adrText}
        </div>
        <div style={s({ background: '#0f172a', borderRadius: 10, padding: 16 })}>
          <div style={s({ color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 })}>
            Checklist архитектора
          </div>
          {CHECKLIST_ITEMS.map(item => {
            const ok = item.fn(state)
            return (
              <div key={item.key} style={s({ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 })}>
                <span style={s({ fontSize: 14, color: ok ? '#86efac' : '#f87171' })}>
                  {ok ? '✓' : '✗'}
                </span>
                <span style={s({ fontSize: 12, color: ok ? '#e2e8f0' : '#94a3b8' })}>
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function Task15_2_Solution() {
  const [step, setStep] = useState<WizardStep>(1)
  const [state, setState] = useState<WizardState>({
    mfes: [
      { name: 'shell', domain: 'Оркестратор', framework: 'React 18', team: 'Platform' },
      { name: 'catalog-mfe', domain: 'Каталог товаров', framework: 'React 18', team: 'Commerce' },
    ],
    sharedDeps: [
      { dep: 'react', strategy: 'module-federation', singleton: true },
      { dep: 'react-dom', strategy: 'module-federation', singleton: true },
    ],
    contracts: [],
    routing: [
      { mfe: 'catalog-mfe', path: '/catalog', lazy: true },
    ],
    deployConfigs: [
      { mfe: 'shell', strategy: 'Blue/Green', rollback: true },
      { mfe: 'catalog-mfe', strategy: 'Canary', rollback: true },
    ],
    monitoring: [
      { mfe: 'shell', slo: '99.9%', errorBoundary: true, circuitBreaker: false },
      { mfe: 'catalog-mfe', slo: '99.5%', errorBoundary: true, circuitBreaker: false },
    ],
  })

  const [showAdr, setShowAdr] = useState(false)

  return (
    <div style={s({ background: '#0f172a', minHeight: '100vh', padding: 24, fontFamily: 'system-ui, sans-serif' })}>
      <div style={s({ maxWidth: 800, margin: '0 auto' })}>
        <div style={s({ marginBottom: 20 })}>
          <h2 style={s({ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 4 })}>
            Мастер архитектурного документа
          </h2>
          <p style={s({ color: '#64748b', fontSize: 13, margin: 0 })}>
            Пошаговый конструктор ADR для MFE-платформы
          </p>
        </div>

        <ProgressBar step={step} total={6} />

        <div style={s({ background: '#1e293b', borderRadius: 12, padding: 24, marginBottom: 16 })}>
          {step === 1 && <Step1Mfes mfes={state.mfes} onChange={mfes => setState(prev => ({ ...prev, mfes }))} />}
          {step === 2 && <Step2SharedDeps deps={state.sharedDeps} onChange={sharedDeps => setState(prev => ({ ...prev, sharedDeps }))} />}
          {step === 3 && <Step3Contracts mfes={state.mfes} contracts={state.contracts} onChange={contracts => setState(prev => ({ ...prev, contracts }))} />}
          {step === 4 && <Step4Routing mfes={state.mfes} routing={state.routing} onChange={routing => setState(prev => ({ ...prev, routing }))} />}
          {step === 5 && <Step5Deploy mfes={state.mfes} configs={state.deployConfigs} onChange={deployConfigs => setState(prev => ({ ...prev, deployConfigs }))} />}
          {step === 6 && <Step6Monitoring mfes={state.mfes} monitoring={state.monitoring} onChange={monitoring => setState(prev => ({ ...prev, monitoring }))} />}
        </div>

        <div style={s({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
          <button
            onClick={() => setStep(prev => (prev > 1 ? (prev - 1) as WizardStep : prev))}
            disabled={step === 1}
            style={s({ background: step === 1 ? '#1e293b' : '#334155', border: 'none', color: step === 1 ? '#64748b' : '#e2e8f0', borderRadius: 8, padding: '10px 20px', cursor: step === 1 ? 'not-allowed' : 'pointer', fontSize: 14 })}
          >
            Назад
          </button>
          {step < 6 ? (
            <button
              onClick={() => setStep(prev => (prev < 6 ? (prev + 1) as WizardStep : prev))}
              style={s({ background: '#1d4ed8', border: 'none', color: '#fff', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 600 })}
            >
              Далее →
            </button>
          ) : (
            <button
              onClick={() => setShowAdr(true)}
              style={s({ background: '#059669', border: 'none', color: '#fff', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 600 })}
            >
              Сгенерировать ADR
            </button>
          )}
        </div>

        {showAdr && (
          <div style={s({ marginTop: 24 })}>
            <AdrDocument state={state} />
          </div>
        )}
      </div>
    </div>
  )
}

// =====================================================
// Task 15.3: Decision Matrix
// =====================================================

type TechChoice = {
  integration: string
  repoStructure: string
  deployStrategy: string
}

type Scenario = {
  id: string
  title: string
  description: string
  constraints: string[]
  expertChoice: TechChoice
  expertRationale: string
  matchCriteria: (choice: TechChoice) => { score: number; feedback: string }
}

const INTEGRATION_OPTIONS = [
  'Module Federation (Webpack 5)',
  'Single-SPA',
  'Web Components (Custom Elements)',
  'Module Federation + Single-SPA',
  'Import Maps (native ESM)',
]

const REPO_OPTIONS = [
  'Monorepo (Nx)',
  'Monorepo (Turborepo)',
  'Monorepo (PNPM workspaces)',
  'Polyrepo',
]

const DEPLOY_OPTIONS = [
  'Independent deploy (versioned URLs)',
  'Canary + Feature Flags',
  'Blue/Green',
  'Synchronized releases',
  'Rolling deploy',
]

const SCENARIOS: Scenario[] = [
  {
    id: 'startup',
    title: 'Стартап: быстрый рост',
    description: 'E-commerce стартап с 3 командами, стек — только React. Нужно быстро масштабироваться, MVP уже в проде.',
    constraints: [
      '3 команды, все знают только React',
      'Нет legacy, чистый старт',
      'Скорость разработки важнее изоляции',
      'Ограниченный DevOps-ресурс',
      'Планируется рост до 5 команд за год',
    ],
    expertChoice: {
      integration: 'Module Federation (Webpack 5)',
      repoStructure: 'Monorepo (Nx)',
      deployStrategy: 'Independent deploy (versioned URLs)',
    },
    expertRationale: 'Module Federation — оптимален для однородного React-стека: нативная поддержка, sharing react/react-dom из коробки. Nx monorepo ускоряет разработку — единый репо, shared конфиги, affected-only CI. Independent deploy даёт свободу командам деплоить без координации.',
    matchCriteria: (choice) => {
      let score = 0
      const feedback: string[] = []
      if (choice.integration === 'Module Federation (Webpack 5)') { score++; feedback.push('MF — правильный выбор для React-only стека') }
      else if (choice.integration === 'Module Federation + Single-SPA') { score += 0.5; feedback.push('MF + Single-SPA — избыточно для стартапа, но работает') }
      else feedback.push(`${choice.integration} — оверинжиниринг или неподходящий инструмент для React-only стека`)
      if (choice.repoStructure.startsWith('Monorepo')) { score++; feedback.push('Monorepo ускорит разработку и рефакторинг') }
      else feedback.push('Polyrepo замедлит координацию на раннем этапе')
      if (choice.deployStrategy === 'Independent deploy (versioned URLs)') { score++; feedback.push('Independent deploy — максимальная независимость команд') }
      else if (choice.deployStrategy === 'Canary + Feature Flags') { score += 0.5; feedback.push('Canary полезен, но требует больше DevOps-ресурса') }
      else feedback.push('Synchronized releases убивает независимость MFE')
      return { score: Math.round(score), feedback: feedback.join('. ') }
    },
  },
  {
    id: 'bank',
    title: 'Банк: строгая безопасность',
    description: 'Крупный банк, 10 команд, смешанный стек Angular + React. Регуляторные требования, аудиты безопасности, изоляция критична.',
    constraints: [
      '10 команд, Angular (legacy) + React (новые)',
      'Регуляторные требования PCI DSS',
      'Строгая изоляция: платёжный MFE нельзя зависеть от других',
      'Медленные циклы релизов (2 недели)',
      'Sandbox окружения для каждого MFE',
    ],
    expertChoice: {
      integration: 'Web Components (Custom Elements)',
      repoStructure: 'Polyrepo',
      deployStrategy: 'Blue/Green',
    },
    expertRationale: 'Web Components обеспечивают максимальную изоляцию через Shadow DOM — Angular и React MFE не влияют на CSS и JS друг друга. Polyrepo даёт явные границы доступа и ответственности. Blue/Green — стандарт для банков: нет downtime, мгновенный rollback.',
    matchCriteria: (choice) => {
      let score = 0
      const feedback: string[] = []
      if (choice.integration === 'Web Components (Custom Elements)') { score++; feedback.push('Web Components — максимальная изоляция для разных фреймворков') }
      else if (choice.integration === 'Module Federation + Single-SPA') { score += 0.5; feedback.push('Возможно, но сложнее обеспечить изоляцию между Angular и React') }
      else feedback.push(`${choice.integration} плохо работает с mix Angular+React или недостаточно изолирован`)
      if (choice.repoStructure === 'Polyrepo') { score++; feedback.push('Polyrepo — явные границы доступа, соответствие security requirements') }
      else feedback.push('Monorepo создаёт риск непреднамеренного доступа к коду других MFE')
      if (choice.deployStrategy === 'Blue/Green') { score++; feedback.push('Blue/Green — стандарт для финансовых систем: нулевой downtime') }
      else if (choice.deployStrategy === 'Rolling deploy') { score += 0.5; feedback.push('Rolling допустим, но Blue/Green надёжнее для критичных систем') }
      else feedback.push('Canary и synchronized releases менее подходят для банковских требований')
      return { score: Math.round(score), feedback: feedback.join('. ') }
    },
  },
  {
    id: 'ecommerce',
    title: 'E-commerce: SEO и SSR',
    description: 'Зрелый e-commerce, 5 команд, React, SEO критичен для каталога и карточек товаров. Высокая нагрузка, CDN, кэширование.',
    constraints: [
      '5 команд, React everywhere',
      'SEO критичен: каталог, карточки, категории',
      'SSR для catalog и checkout MFE',
      'CDN кэширование страниц',
      'Core Web Vitals в приоритете',
    ],
    expertChoice: {
      integration: 'Module Federation (Webpack 5)',
      repoStructure: 'Monorepo (Nx)',
      deployStrategy: 'Canary + Feature Flags',
    },
    expertRationale: 'Module Federation поддерживает SSR через Next.js + Module Federation — лучший вариант для React с SEO. Monorepo (Nx) обеспечивает shared типы и конфиги для SSR/CSR MFE. Canary + Feature Flags — безопасный способ выкатывать изменения на высоконагруженный каталог без риска упасть в Яндекс.Вебмастер.',
    matchCriteria: (choice) => {
      let score = 0
      const feedback: string[] = []
      if (choice.integration === 'Module Federation (Webpack 5)') { score++; feedback.push('MF с Next.js поддерживает SSR для SEO-критичных MFE') }
      else if (choice.integration === 'Module Federation + Single-SPA') { score += 0.5; feedback.push('Работает, но Single-SPA осложняет SSR') }
      else feedback.push(`${choice.integration} плохо подходит для SSR + SEO в React-экосистеме`)
      if (choice.repoStructure.startsWith('Monorepo')) { score++; feedback.push('Monorepo упрощает shared SSR конфиги и типы') }
      else feedback.push('Polyrepo усложнит синхронизацию SSR конфигураций')
      if (choice.deployStrategy === 'Canary + Feature Flags') { score++; feedback.push('Canary + FF — безопасный деплой для SEO: нет риска crawler увидит сломанный MFE') }
      else if (choice.deployStrategy === 'Blue/Green') { score += 0.5; feedback.push('Blue/Green тоже безопасен, но Canary даёт больше контроля') }
      else feedback.push('Другие стратегии несут риски для SEO при проблемах деплоя')
      return { score: Math.round(score), feedback: feedback.join('. ') }
    },
  },
  {
    id: 'saas',
    title: 'SaaS: multi-tenant, white-label',
    description: 'SaaS-платформа, 8 команд, нужно поддерживать разные темы/бренды для клиентов, runtime customization.',
    constraints: [
      '8 команд, React + Vue в разных MFE',
      'White-label: каждый клиент — своя тема и брендинг',
      'Runtime customization без редеплоя',
      'Tenant isolation: данные и конфиги',
      'Design tokens должны применяться глобально',
    ],
    expertChoice: {
      integration: 'Module Federation + Single-SPA',
      repoStructure: 'Monorepo (Nx)',
      deployStrategy: 'Independent deploy (versioned URLs)',
    },
    expertRationale: 'Module Federation + Single-SPA дают максимальный контроль над runtime оркестрацией — Single-SPA позволяет динамически монтировать разные MFE в зависимости от tenant конфига. Nx monorepo для shared design tokens и tenant конфигов. Independent deploy — MFE обновляются независимо, tenant конфиг указывает какую версию загружать.',
    matchCriteria: (choice) => {
      let score = 0
      const feedback: string[] = []
      if (choice.integration === 'Module Federation + Single-SPA') { score++; feedback.push('MF + Single-SPA — идеально для runtime tenant-based оркестрации') }
      else if (choice.integration === 'Module Federation (Webpack 5)') { score += 0.5; feedback.push('MF один работает, но Single-SPA упрощает tenant routing') }
      else feedback.push(`${choice.integration} менее гибок для multi-tenant runtime customization`)
      if (choice.repoStructure.startsWith('Monorepo')) { score++; feedback.push('Monorepo для shared design tokens и tenant конфигов — правильно') }
      else feedback.push('Polyrepo усложнит синхронизацию design tokens между MFE')
      if (choice.deployStrategy === 'Independent deploy (versioned URLs)') { score++; feedback.push('Independent deploy с versioned URLs позволяет tenant указывать нужную версию MFE') }
      else if (choice.deployStrategy === 'Canary + Feature Flags') { score += 0.5; feedback.push('FF полезны для tenant customization, но versioned URLs дают больше контроля') }
      else feedback.push('Synchronized releases нарушают независимость tenant конфигурации')
      return { score: Math.round(score), feedback: feedback.join('. ') }
    },
  },
]

export function Task15_3_Solution() {
  const [activeScenario, setActiveScenario] = useState(0)
  const [choices, setChoices] = useState<Record<string, TechChoice>>(
    Object.fromEntries(SCENARIOS.map(sc => [sc.id, { integration: '', repoStructure: '', deployStrategy: '' }]))
  )
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [totalScore, setTotalScore] = useState<number | null>(null)

  const scenario = SCENARIOS[activeScenario]
  const currentChoice = choices[scenario.id]
  const isRevealed = revealed[scenario.id]

  const updateChoice = (field: keyof TechChoice, value: string) => {
    setChoices(prev => ({
      ...prev,
      [scenario.id]: { ...prev[scenario.id], [field]: value },
    }))
    setRevealed(prev => ({ ...prev, [scenario.id]: false }))
    setTotalScore(null)
  }

  const reveal = () => {
    if (!currentChoice.integration || !currentChoice.repoStructure || !currentChoice.deployStrategy) return
    setRevealed(prev => ({ ...prev, [scenario.id]: true }))
  }

  const calculateTotal = () => {
    let total = 0
    let count = 0
    SCENARIOS.forEach(sc => {
      const choice = choices[sc.id]
      if (choice.integration && choice.repoStructure && choice.deployStrategy) {
        total += sc.matchCriteria(choice).score
        count++
      }
    })
    setTotalScore(count === SCENARIOS.length ? total : null)
  }

  const matchResult = isRevealed ? scenario.matchCriteria(currentChoice) : null
  const allFilled = SCENARIOS.every(sc => {
    const c = choices[sc.id]
    return c.integration && c.repoStructure && c.deployStrategy
  })

  return (
    <div style={s({ background: '#0f172a', minHeight: '100vh', padding: 24, fontFamily: 'system-ui, sans-serif' })}>
      <div style={s({ maxWidth: 900, margin: '0 auto' })}>
        <div style={s({ marginBottom: 20 })}>
          <h2 style={s({ color: '#f1f5f9', fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 4 })}>
            Decision Matrix: выбор технологий
          </h2>
          <p style={s({ color: '#64748b', fontSize: 13, margin: 0 })}>
            4 реальных кейса. Выберите стек для каждого и сравните с экспертной рекомендацией.
          </p>
        </div>

        {/* Scenario Tabs */}
        <div style={s({ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' })}>
          {SCENARIOS.map((sc, i) => {
            const c = choices[sc.id]
            const done = !!(c.integration && c.repoStructure && c.deployStrategy)
            return (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(i)}
                style={s({
                  background: activeScenario === i ? '#1d4ed8' : '#1e293b',
                  border: `2px solid ${activeScenario === i ? '#3b82f6' : done ? '#22c55e' : '#334155'}`,
                  color: activeScenario === i ? '#fff' : done ? '#86efac' : '#94a3b8',
                  borderRadius: 8,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: activeScenario === i ? 600 : 400,
                })}
              >
                {done && '✓ '}{sc.title}
              </button>
            )
          })}
        </div>

        {/* Scenario Card */}
        <div style={s({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 })}>
          <div>
            <div style={s({ background: '#1e293b', borderRadius: 12, padding: 18, marginBottom: 12 })}>
              <h3 style={s({ color: '#f1f5f9', fontWeight: 700, margin: 0, marginBottom: 8, fontSize: 16 })}>{scenario.title}</h3>
              <p style={s({ color: '#94a3b8', fontSize: 13, marginTop: 0, marginBottom: 12, lineHeight: 1.6 })}>{scenario.description}</p>
              <div style={s({ color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 })}>
                Ограничения / требования
              </div>
              {scenario.constraints.map((c, i) => (
                <div key={i} style={s({ display: 'flex', gap: 8, marginBottom: 6 })}>
                  <span style={s({ color: '#f59e0b', flexShrink: 0 })}>•</span>
                  <span style={s({ color: '#94a3b8', fontSize: 12, lineHeight: 1.5 })}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={s({ background: '#1e293b', borderRadius: 12, padding: 18, marginBottom: 12 })}>
              <div style={s({ color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 })}>
                Ваш выбор
              </div>

              <div style={s({ marginBottom: 12 })}>
                <label style={s({ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 6 })}>Интеграция (как связать MFE)</label>
                <select
                  value={currentChoice.integration}
                  onChange={e => updateChoice('integration', e.target.value)}
                  style={s({ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px', color: '#e2e8f0', width: '100%', fontSize: 13 })}
                >
                  <option value="">-- выберите --</option>
                  {INTEGRATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div style={s({ marginBottom: 12 })}>
                <label style={s({ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 6 })}>Структура репозиториев</label>
                <select
                  value={currentChoice.repoStructure}
                  onChange={e => updateChoice('repoStructure', e.target.value)}
                  style={s({ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px', color: '#e2e8f0', width: '100%', fontSize: 13 })}
                >
                  <option value="">-- выберите --</option>
                  {REPO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div style={s({ marginBottom: 16 })}>
                <label style={s({ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 6 })}>Стратегия деплоя</label>
                <select
                  value={currentChoice.deployStrategy}
                  onChange={e => updateChoice('deployStrategy', e.target.value)}
                  style={s({ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px', color: '#e2e8f0', width: '100%', fontSize: 13 })}
                >
                  <option value="">-- выберите --</option>
                  {DEPLOY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <button
                onClick={reveal}
                disabled={!currentChoice.integration || !currentChoice.repoStructure || !currentChoice.deployStrategy}
                style={s({
                  background: currentChoice.integration && currentChoice.repoStructure && currentChoice.deployStrategy ? '#1d4ed8' : '#1e293b',
                  border: 'none',
                  color: currentChoice.integration && currentChoice.repoStructure && currentChoice.deployStrategy ? '#fff' : '#64748b',
                  borderRadius: 8,
                  padding: '10px 20px',
                  cursor: currentChoice.integration && currentChoice.repoStructure && currentChoice.deployStrategy ? 'pointer' : 'not-allowed',
                  fontSize: 13,
                  fontWeight: 600,
                  width: '100%',
                })}
              >
                Показать экспертную рекомендацию
              </button>
            </div>

            {/* Expert Recommendation */}
            {isRevealed && matchResult && (
              <div style={s({
                background: matchResult.score === 3 ? '#14532d' : matchResult.score === 2 ? '#78350f' : '#3b1f1f',
                border: `1px solid ${matchResult.score === 3 ? '#22c55e' : matchResult.score === 2 ? '#f59e0b' : '#ef4444'}`,
                borderRadius: 12,
                padding: 16,
              })}>
                <div style={s({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 })}>
                  <span style={s({ color: matchResult.score === 3 ? '#86efac' : matchResult.score === 2 ? '#fbbf24' : '#f87171', fontWeight: 700, fontSize: 15 })}>
                    {matchResult.score === 3 ? 'Отличное решение!' : matchResult.score === 2 ? 'Хорошо, но не идеально' : matchResult.score <= 1 ? 'Не оптимально' : 'Частично верно'}
                  </span>
                  <span style={s({ color: '#e2e8f0', fontWeight: 700, fontSize: 18 })}>
                    {matchResult.score}/3
                  </span>
                </div>
                <p style={s({ color: '#cbd5e1', fontSize: 12, margin: 0, marginBottom: 10, lineHeight: 1.6 })}>
                  {matchResult.feedback}
                </p>
                <div style={s({ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 })}>
                  <div style={s({ color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 })}>
                    Экспертная рекомендация
                  </div>
                  {[
                    { label: 'Интеграция', value: scenario.expertChoice.integration },
                    { label: 'Репозиторий', value: scenario.expertChoice.repoStructure },
                    { label: 'Deploy', value: scenario.expertChoice.deployStrategy },
                  ].map(item => (
                    <div key={item.label} style={s({ display: 'flex', gap: 8, marginBottom: 4 })}>
                      <span style={s({ color: '#64748b', fontSize: 12, minWidth: 80 })}>{item.label}:</span>
                      <span style={s({ color: '#86efac', fontSize: 12 })}>{item.value}</span>
                    </div>
                  ))}
                  <p style={s({ color: '#94a3b8', fontSize: 11, margin: 0, marginTop: 8, lineHeight: 1.6 })}>
                    {scenario.expertRationale}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Total Score */}
        <div style={s({ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 })}>
          <button
            onClick={calculateTotal}
            disabled={!allFilled}
            style={s({
              background: allFilled ? '#059669' : '#1e293b',
              border: 'none',
              color: allFilled ? '#fff' : '#64748b',
              borderRadius: 8,
              padding: '10px 24px',
              cursor: allFilled ? 'pointer' : 'not-allowed',
              fontSize: 14,
              fontWeight: 600,
            })}
          >
            Итоговый счёт
          </button>
          {!allFilled && (
            <span style={s({ color: '#64748b', fontSize: 13 })}>
              Заполните все {SCENARIOS.length} сценария
            </span>
          )}
          {totalScore !== null && (
            <div style={s({
              background: totalScore >= 10 ? '#14532d' : totalScore >= 7 ? '#78350f' : '#3b1f1f',
              border: `1px solid ${totalScore >= 10 ? '#22c55e' : totalScore >= 7 ? '#f59e0b' : '#ef4444'}`,
              borderRadius: 10,
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            })}>
              <span style={s({ color: '#e2e8f0', fontSize: 15, fontWeight: 700 })}>
                {totalScore}/{SCENARIOS.length * 3} баллов
              </span>
              <span style={s({ color: totalScore >= 10 ? '#86efac' : totalScore >= 7 ? '#fbbf24' : '#f87171', fontSize: 14 })}>
                {totalScore >= 10 ? 'Архитектор уровня Senior' : totalScore >= 7 ? 'Хорошее понимание' : 'Изучите теорию глубже'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
