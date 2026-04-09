import { useState, useCallback } from 'react'

// =====================================================
// Task 13.1: Strangler Fig Visualizer
// =====================================================

type DomainId = 'catalog' | 'cart' | 'checkout' | 'profile' | 'admin' | 'analytics'

type DomainStatus = 'monolith' | 'extracting' | 'mfe'

type Domain = {
  id: DomainId
  label: string
  color: string
  bgColor: string
  locPercent: number
  dependencies: DomainId[]
  teamSize: number
  changeFreq: 'низкая' | 'средняя' | 'высокая'
  status: DomainStatus
}

type Connection = {
  from: DomainId
  to: DomainId
  type: 'direct' | 'eventbus'
}

const INITIAL_DOMAINS: Domain[] = [
  {
    id: 'catalog',
    label: 'Каталог',
    color: '#fff',
    bgColor: '#1565c0',
    locPercent: 22,
    dependencies: [],
    teamSize: 4,
    changeFreq: 'высокая',
    status: 'monolith',
  },
  {
    id: 'cart',
    label: 'Корзина',
    color: '#fff',
    bgColor: '#2e7d32',
    locPercent: 14,
    dependencies: ['catalog'],
    teamSize: 2,
    changeFreq: 'средняя',
    status: 'monolith',
  },
  {
    id: 'checkout',
    label: 'Оформление',
    color: '#fff',
    bgColor: '#6a1b9a',
    locPercent: 18,
    dependencies: ['cart', 'catalog'],
    teamSize: 3,
    changeFreq: 'низкая',
    status: 'monolith',
  },
  {
    id: 'profile',
    label: 'Профиль',
    color: '#fff',
    bgColor: '#e65100',
    locPercent: 12,
    dependencies: [],
    teamSize: 2,
    changeFreq: 'низкая',
    status: 'monolith',
  },
  {
    id: 'admin',
    label: 'Админка',
    color: '#fff',
    bgColor: '#4e342e',
    locPercent: 20,
    dependencies: ['catalog'],
    teamSize: 3,
    changeFreq: 'средняя',
    status: 'monolith',
  },
  {
    id: 'analytics',
    label: 'Аналитика',
    color: '#fff',
    bgColor: '#00695c',
    locPercent: 14,
    dependencies: [],
    teamSize: 1,
    changeFreq: 'низкая',
    status: 'monolith',
  },
]

const INITIAL_CONNECTIONS: Connection[] = [
  { from: 'cart', to: 'catalog', type: 'direct' },
  { from: 'checkout', to: 'cart', type: 'direct' },
  { from: 'checkout', to: 'catalog', type: 'direct' },
  { from: 'admin', to: 'catalog', type: 'direct' },
]

function getDependencyWarning(domain: Domain, domains: Domain[]): string | null {
  const blockers = domain.dependencies.filter(depId => {
    const dep = domains.find(d => d.id === depId)
    return dep && dep.status === 'monolith'
  })
  if (blockers.length === 0) return null
  const names = blockers.map(id => domains.find(d => d.id === id)!.label).join(', ')
  return `${domain.label} зависит от: ${names} — рекомендуется извлечь сначала`
}

export function Task13_1_Solution() {
  const [domains, setDomains] = useState<Domain[]>(INITIAL_DOMAINS)
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS)
  const [warning, setWarning] = useState<string | null>(null)
  const [extractingId, setExtractingId] = useState<DomainId | null>(null)

  const mfeDomains = domains.filter(d => d.status === 'mfe')
  const monolithDomains = domains.filter(d => d.status === 'monolith' || d.status === 'extracting')

  const totalLoc = domains.reduce((sum, d) => sum + d.locPercent, 0)
  const mfeLoc = mfeDomains.reduce((sum, d) => sum + d.locPercent, 0)
  const migrationProgress = Math.round((mfeLoc / totalLoc) * 100)

  const directConnections = connections.filter(c => c.type === 'direct')
  const eventbusConnections = connections.filter(c => c.type === 'eventbus')

  const trafficInMfe = mfeDomains.length === 0
    ? 0
    : Math.round((mfeDomains.reduce((sum, d) => sum + d.locPercent, 0) / totalLoc) * 100)

  const handleExtract = useCallback((domain: Domain) => {
    const warn = getDependencyWarning(domain, domains)
    if (warn) {
      setWarning(warn)
      return
    }
    setWarning(null)
    setExtractingId(domain.id)

    setTimeout(() => {
      setDomains(prev =>
        prev.map(d => d.id === domain.id ? { ...d, status: 'mfe' } : d)
      )
      // convert direct connections from this domain to eventbus
      setConnections(prev =>
        prev.map(c =>
          (c.from === domain.id || c.to === domain.id)
            ? { ...c, type: 'eventbus' }
            : c
        )
      )
      setExtractingId(null)
    }, 700)
  }, [domains])

  const handleReturn = useCallback((domain: Domain) => {
    setWarning(null)
    setDomains(prev =>
      prev.map(d => d.id === domain.id ? { ...d, status: 'monolith' } : d)
    )
    setConnections(prev =>
      prev.map(c =>
        (c.from === domain.id || c.to === domain.id)
          ? { ...c, type: 'direct' }
          : c
      )
    )
  }, [])

  const progressColor = migrationProgress < 30
    ? '#ef5350'
    : migrationProgress < 70
      ? '#ffa726'
      : '#66bb6a'

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#0f172a', color: '#e2e8f0', minHeight: '100vh', padding: '24px' }}>
      <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700 }}>
        Strangler Fig Visualizer
      </h2>
      <p style={{ margin: '0 0 24px', color: '#94a3b8', fontSize: '14px' }}>
        Постепенная замена монолита микрофронтендами
      </p>

      {/* Metrics Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Прогресс миграции', value: `${migrationProgress}%`, color: progressColor },
          { label: 'MFE извлечено', value: `${mfeDomains.length} / ${domains.length}`, color: '#60a5fa' },
          { label: 'Прямые связи', value: String(directConnections.length), color: '#f87171' },
          { label: 'Через EventBus', value: String(eventbusConnections.length), color: '#4ade80' },
          { label: 'Трафик в MFE', value: `${trafficInMfe}%`, color: '#c084fc' },
        ].map(m => (
          <div key={m.label} style={{
            background: '#1e293b', borderRadius: '8px', padding: '12px 18px',
            flex: '1', minWidth: '130px',
          }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
          Прогресс миграции: {migrationProgress}% кода перенесено в MFE
        </div>
        <div style={{ background: '#1e293b', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
          <div style={{
            width: `${migrationProgress}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${progressColor}, ${progressColor}cc)`,
            borderRadius: '999px',
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>

      {/* Warning */}
      {warning && (
        <div style={{
          background: '#7c2d12', border: '1px solid #ea580c', borderRadius: '8px',
          padding: '10px 16px', marginBottom: '16px', fontSize: '13px', color: '#fed7aa',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          {warning}
          <button
            onClick={() => setWarning(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fed7aa', cursor: 'pointer', fontSize: '16px' }}
          >×</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Monolith Block */}
        <div>
          <div style={{
            background: '#1e293b', border: '2px dashed #475569', borderRadius: '12px', padding: '16px',
          }}>
            <div style={{
              fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase',
              letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>🏛️</span> Монолит
              <span style={{
                marginLeft: 'auto', background: '#0f172a', borderRadius: '4px',
                padding: '2px 8px', color: '#94a3b8', fontSize: '11px',
              }}>
                {monolithDomains.length} доменов
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {monolithDomains.map(domain => (
                <div
                  key={domain.id}
                  style={{
                    background: domain.bgColor,
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    opacity: extractingId === domain.id ? 0.5 : 1,
                    transform: extractingId === domain.id ? 'scale(0.97)' : 'scale(1)',
                    transition: 'opacity 0.4s, transform 0.4s',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: domain.color }}>{domain.label}</div>
                    <div style={{ fontSize: '11px', color: `${domain.color}cc`, marginTop: '2px' }}>
                      {domain.locPercent}% LOC · {domain.teamSize} чел · изменения: {domain.changeFreq}
                    </div>
                    {domain.dependencies.length > 0 && (
                      <div style={{ fontSize: '11px', color: `${domain.color}99`, marginTop: '2px' }}>
                        Зависит от: {domain.dependencies.map(id => domains.find(d => d.id === id)!.label).join(', ')}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleExtract(domain)}
                    disabled={extractingId !== null}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      cursor: extractingId !== null ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {extractingId === domain.id ? 'Извлечение...' : 'Извлечь →'}
                  </button>
                </div>
              ))}
              {monolithDomains.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: '#4ade80', fontSize: '14px' }}>
                  ✅ Монолит полностью заменён
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MFE Blocks */}
        <div>
          <div style={{
            background: '#0d1f0d', border: '2px solid #166534', borderRadius: '12px', padding: '16px',
            minHeight: '120px',
          }}>
            <div style={{
              fontSize: '12px', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase',
              letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>🧩</span> Микрофронтенды
              <span style={{
                marginLeft: 'auto', background: '#052e16', borderRadius: '4px',
                padding: '2px 8px', color: '#4ade80', fontSize: '11px',
              }}>
                {mfeDomains.length} MFE
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mfeDomains.map(domain => (
                <div
                  key={domain.id}
                  style={{
                    background: domain.bgColor,
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: '2px solid #4ade80',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: domain.color }}>{domain.label} MFE</div>
                    <div style={{ fontSize: '11px', color: `${domain.color}cc`, marginTop: '2px' }}>
                      {domain.locPercent}% LOC · EventBus коммуникация
                    </div>
                    <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '2px' }}>
                      ✅ Независимый деплой
                    </div>
                  </div>
                  <button
                    onClick={() => handleReturn(domain)}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '4px 10px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ← Вернуть
                  </button>
                </div>
              ))}
              {mfeDomains.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: '#475569', fontSize: '14px' }}>
                  Нет MFE — нажмите «Извлечь» в монолите
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Connections Legend */}
      <div style={{ marginTop: '20px', background: '#1e293b', borderRadius: '8px', padding: '14px 16px' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Связи между доменами
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {connections.map((c, i) => {
            const from = domains.find(d => d.id === c.from)!
            const to = domains.find(d => d.id === c.to)!
            return (
              <span key={i} style={{
                background: c.type === 'direct' ? '#7f1d1d' : '#052e16',
                border: `1px solid ${c.type === 'direct' ? '#ef4444' : '#22c55e'}`,
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '12px',
                color: c.type === 'direct' ? '#fca5a5' : '#86efac',
              }}>
                {from.label} → {to.label}
                <span style={{ marginLeft: '4px', opacity: 0.7 }}>
                  {c.type === 'direct' ? '⚡ прямая' : '📡 EventBus'}
                </span>
              </span>
            )
          })}
        </div>
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#64748b' }}>
          ⚡ Прямые связи (красные) — плохо: создают coupling между MFE и монолитом.
          При извлечении автоматически конвертируются в 📡 EventBus (зелёные).
        </div>
      </div>
    </div>
  )
}

// =====================================================
// Task 13.2: Migration Plan Constructor
// =====================================================

type DomainSize = 'S' | 'M' | 'L' | 'XL'
type Criticality = 'low' | 'medium' | 'high' | 'critical'
type ChangeFrequency = 'rare' | 'monthly' | 'weekly' | 'daily'

type PlanDomain = {
  id: string
  name: string
  size: DomainSize
  apiDeps: number
  sharedState: number
  criticality: Criticality
  changeFreq: ChangeFrequency
}

type MigrationPhase = {
  phase: number
  label: string
  domains: string[]
  complexity: 'низкая' | 'средняя' | 'высокая'
  risks: string[]
  recommendations: string[]
  weeks: number
}

const SIZE_LOC: Record<DomainSize, string> = {
  S: '~5K LOC',
  M: '~15K LOC',
  L: '~40K LOC',
  XL: '~100K LOC',
}

const CRITICALITY_LABELS: Record<Criticality, string> = {
  low: 'Низкая',
  medium: 'Средняя',
  high: 'Высокая',
  critical: 'Критическая',
}

const FREQ_LABELS: Record<ChangeFrequency, string> = {
  rare: 'Редко',
  monthly: 'Ежемесячно',
  weekly: 'Еженедельно',
  daily: 'Ежедневно',
}

const INITIAL_PLAN_DOMAINS: PlanDomain[] = [
  { id: '1', name: 'Аналитика', size: 'S', apiDeps: 1, sharedState: 0, criticality: 'low', changeFreq: 'rare' },
  { id: '2', name: 'Профиль', size: 'S', apiDeps: 2, sharedState: 1, criticality: 'low', changeFreq: 'monthly' },
  { id: '3', name: 'Каталог', size: 'L', apiDeps: 5, sharedState: 2, criticality: 'high', changeFreq: 'daily' },
  { id: '4', name: 'Корзина', size: 'M', apiDeps: 4, sharedState: 3, criticality: 'high', changeFreq: 'weekly' },
  { id: '5', name: 'Оформление', size: 'L', apiDeps: 8, sharedState: 4, criticality: 'critical', changeFreq: 'weekly' },
  { id: '6', name: 'Админка', size: 'XL', apiDeps: 12, sharedState: 6, criticality: 'medium', changeFreq: 'monthly' },
]

function calcScore(d: PlanDomain): number {
  // Higher score = higher priority for early extraction
  // High freq = +, low criticality = +, low deps = +, small size = +
  const freqScore: Record<ChangeFrequency, number> = { daily: 40, weekly: 30, monthly: 15, rare: 5 }
  const critScore: Record<Criticality, number> = { low: 30, medium: 20, high: 10, critical: 0 }
  const sizeScore: Record<DomainSize, number> = { S: 20, M: 15, L: 5, XL: 0 }
  const depsPenalty = (d.apiDeps + d.sharedState) * 2
  return freqScore[d.changeFreq] + critScore[d.criticality] + sizeScore[d.size] - depsPenalty
}

function generateRoadmap(domains: PlanDomain[]): MigrationPhase[] {
  const sorted = [...domains].sort((a, b) => calcScore(b) - calcScore(a))

  const phases: MigrationPhase[] = []
  const chunkSize = Math.ceil(sorted.length / 3)
  const chunks = [
    sorted.slice(0, chunkSize),
    sorted.slice(chunkSize, chunkSize * 2),
    sorted.slice(chunkSize * 2),
  ].filter(c => c.length > 0)

  const complexityMap: ('низкая' | 'средняя' | 'высокая')[] = ['низкая', 'средняя', 'высокая']

  chunks.forEach((chunk, idx) => {
    const hasHighCrit = chunk.some(d => d.criticality === 'critical' || d.criticality === 'high')
    const hasHighDeps = chunk.some(d => d.apiDeps > 6 || d.sharedState > 3)
    const hasLargeSize = chunk.some(d => d.size === 'XL' || d.size === 'L')

    const risks: string[] = []
    const recs: string[] = []

    if (hasHighCrit && idx === 0) {
      risks.push('Критичный домен в первой фазе — высокий риск')
      recs.push('Рассмотрите перенос в более позднюю фазу')
    }
    if (hasHighDeps) {
      risks.push('Высокое число зависимостей — сложная декуплинг-работа')
      recs.push('Выделите shared-сервисы до начала фазы')
    }
    if (hasLargeSize) {
      risks.push('Крупный домен — длительная миграция')
      recs.push('Разбейте домен на поддомены перед извлечением')
    }
    if (!hasHighCrit && !hasHighDeps) {
      recs.push('Идеальный кандидат для пилотного MFE')
    }
    if (idx === 0) {
      recs.push('Начните с настройки shell и Module Federation инфраструктуры')
    }

    const complexity: 'низкая' | 'средняя' | 'высокая' = hasHighCrit && hasHighDeps
      ? 'высокая'
      : hasHighCrit || hasHighDeps || hasLargeSize
        ? 'средняя'
        : 'низкая'

    const baseWeeks = chunk.reduce((sum, d) => {
      const w = { S: 2, M: 4, L: 8, XL: 14 }
      return sum + w[d.size]
    }, 0)

    phases.push({
      phase: idx + 1,
      label: `Фаза ${idx + 1}`,
      domains: chunk.map(d => d.name),
      complexity,
      risks: risks.length > 0 ? risks : ['Риски минимальны'],
      recommendations: recs,
      weeks: baseWeeks,
    })
  })

  return phases
}

const COMPLEXITY_COLOR: Record<string, string> = {
  'низкая': '#22c55e',
  'средняя': '#fbbf24',
  'высокая': '#ef4444',
}

export function Task13_2_Solution() {
  const [domains, setDomains] = useState<PlanDomain[]>(INITIAL_PLAN_DOMAINS)
  const [roadmap, setRoadmap] = useState<MigrationPhase[] | null>(null)
  const [newName, setNewName] = useState('')

  const updateDomain = useCallback((id: string, field: keyof PlanDomain, value: string | number) => {
    setDomains(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d))
    setRoadmap(null)
  }, [])

  const removeDomain = useCallback((id: string) => {
    setDomains(prev => prev.filter(d => d.id !== id))
    setRoadmap(null)
  }, [])

  const addDomain = useCallback(() => {
    const name = newName.trim()
    if (!name) return
    const newD: PlanDomain = {
      id: Date.now().toString(),
      name,
      size: 'M',
      apiDeps: 2,
      sharedState: 1,
      criticality: 'medium',
      changeFreq: 'monthly',
    }
    setDomains(prev => [...prev, newD])
    setNewName('')
    setRoadmap(null)
  }, [newName])

  const handleGenerate = useCallback(() => {
    setRoadmap(generateRoadmap(domains))
  }, [domains])

  const sortedDomains = [...domains].sort((a, b) => calcScore(b) - calcScore(a))
  const maxScore = Math.max(...domains.map(calcScore))

  const totalWeeks = roadmap ? roadmap.reduce((sum, p) => sum + p.weeks, 0) : null

  const selectStyle = {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '4px',
    color: '#e2e8f0',
    padding: '3px 6px',
    fontSize: '12px',
  }

  const inputStyle = {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '4px',
    color: '#e2e8f0',
    padding: '3px 6px',
    fontSize: '12px',
    width: '48px',
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#0f172a', color: '#e2e8f0', minHeight: '100vh', padding: '24px' }}>
      <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700 }}>
        Конструктор плана миграции
      </h2>
      <p style={{ margin: '0 0 24px', color: '#94a3b8', fontSize: '14px' }}>
        Введите характеристики доменов — система ранжирует приоритеты извлечения и сгенерирует roadmap
      </p>

      {/* Domain Table */}
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', marginBottom: '20px', overflowX: 'auto' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Домены монолита
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
              {['Домен', 'Размер', 'API-зав.', 'Shared state', 'Критичность', 'Изменения', 'Приоритет', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedDomains.map((domain, idx) => {
              const score = calcScore(domain)
              const barWidth = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
              const isTop = idx === 0
              return (
                <tr key={domain.id} style={{
                  borderTop: '1px solid #0f172a',
                  background: isTop ? 'rgba(34,197,94,0.05)' : undefined,
                }}>
                  <td style={{ padding: '6px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isTop && <span title="Первый кандидат">🥇</span>}
                      <span style={{ fontWeight: isTop ? 600 : 400 }}>{domain.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <select
                      value={domain.size}
                      onChange={e => updateDomain(domain.id, 'size', e.target.value as DomainSize)}
                      style={selectStyle}
                    >
                      {(['S', 'M', 'L', 'XL'] as DomainSize[]).map(s => (
                        <option key={s} value={s}>{s} ({SIZE_LOC[s]})</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <input
                      type="number" min={0} max={20}
                      value={domain.apiDeps}
                      onChange={e => updateDomain(domain.id, 'apiDeps', Number(e.target.value))}
                      style={inputStyle}
                    />
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <input
                      type="number" min={0} max={10}
                      value={domain.sharedState}
                      onChange={e => updateDomain(domain.id, 'sharedState', Number(e.target.value))}
                      style={inputStyle}
                    />
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <select
                      value={domain.criticality}
                      onChange={e => updateDomain(domain.id, 'criticality', e.target.value as Criticality)}
                      style={selectStyle}
                    >
                      {(['low', 'medium', 'high', 'critical'] as Criticality[]).map(c => (
                        <option key={c} value={c}>{CRITICALITY_LABELS[c]}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <select
                      value={domain.changeFreq}
                      onChange={e => updateDomain(domain.id, 'changeFreq', e.target.value as ChangeFrequency)}
                      style={selectStyle}
                    >
                      {(['rare', 'monthly', 'weekly', 'daily'] as ChangeFrequency[]).map(f => (
                        <option key={f} value={f}>{FREQ_LABELS[f]}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '6px 8px', minWidth: '120px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '3px' }}>
                      Очки: {score}
                    </div>
                    <div style={{ background: '#0f172a', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${barWidth}%`, height: '100%',
                        background: barWidth > 66 ? '#22c55e' : barWidth > 33 ? '#fbbf24' : '#ef4444',
                        borderRadius: '999px', transition: 'width 0.3s',
                      }} />
                    </div>
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <button
                      onClick={() => removeDomain(domain.id)}
                      style={{
                        background: 'none', border: 'none',
                        color: '#64748b', cursor: 'pointer', fontSize: '16px', lineHeight: 1,
                      }}
                      title="Удалить домен"
                    >×</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Add domain row */}
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Название домена"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addDomain()}
            style={{
              background: '#0f172a', border: '1px solid #334155', borderRadius: '6px',
              color: '#e2e8f0', padding: '6px 10px', fontSize: '13px', width: '180px',
            }}
          />
          <button
            onClick={addDomain}
            style={{
              background: '#1d4ed8', border: 'none', borderRadius: '6px',
              color: '#fff', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
            }}
          >
            + Добавить
          </button>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={domains.length === 0}
        style={{
          background: domains.length === 0 ? '#1e293b' : 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
          border: 'none', borderRadius: '8px', color: '#fff',
          padding: '12px 28px', fontSize: '14px', fontWeight: 700,
          cursor: domains.length === 0 ? 'not-allowed' : 'pointer',
          marginBottom: '24px', width: '100%',
          opacity: domains.length === 0 ? 0.5 : 1,
        }}
      >
        Сгенерировать Migration Roadmap
      </button>

      {/* Roadmap */}
      {roadmap && (
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Migration Roadmap</h3>
            <span style={{
              background: '#1e293b', borderRadius: '6px', padding: '3px 10px',
              fontSize: '13px', color: '#94a3b8',
            }}>
              Итого: ~{totalWeeks} недель
            </span>
          </div>

          {/* Timeline */}
          <div style={{
            display: 'flex', gap: '4px', marginBottom: '24px', background: '#1e293b',
            borderRadius: '8px', padding: '12px', flexWrap: 'wrap',
          }}>
            {roadmap.map(phase => (
              <div key={phase.phase} style={{
                flex: phase.weeks,
                minWidth: '60px',
                background: phase.complexity === 'низкая' ? '#052e16' : phase.complexity === 'средняя' ? '#422006' : '#450a0a',
                border: `1px solid ${COMPLEXITY_COLOR[phase.complexity]}`,
                borderRadius: '6px',
                padding: '8px 10px',
                fontSize: '12px',
              }}>
                <div style={{ fontWeight: 700, color: COMPLEXITY_COLOR[phase.complexity], marginBottom: '4px' }}>
                  {phase.label}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>{phase.domains.join(', ')}</div>
                <div style={{ color: '#64748b', fontSize: '10px', marginTop: '4px' }}>~{phase.weeks} нед.</div>
              </div>
            ))}
          </div>

          {/* Phase Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {roadmap.map(phase => (
              <div key={phase.phase} style={{
                background: '#1e293b', borderRadius: '12px', padding: '16px',
                borderLeft: `4px solid ${COMPLEXITY_COLOR[phase.complexity]}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{phase.label}</div>
                  <div style={{
                    background: COMPLEXITY_COLOR[phase.complexity] + '22',
                    border: `1px solid ${COMPLEXITY_COLOR[phase.complexity]}`,
                    borderRadius: '4px', padding: '2px 8px',
                    fontSize: '12px', color: COMPLEXITY_COLOR[phase.complexity],
                  }}>
                    Сложность: {phase.complexity}
                  </div>
                  <div style={{ marginLeft: 'auto', color: '#64748b', fontSize: '13px' }}>
                    ~{phase.weeks} недель
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
                    ДОМЕНЫ:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {phase.domains.map(name => (
                      <span key={name} style={{
                        background: '#0f172a', border: '1px solid #334155',
                        borderRadius: '4px', padding: '3px 10px',
                        fontSize: '13px', fontWeight: 600,
                      }}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '6px', fontWeight: 600 }}>
                      ⚠️ РИСКИ:
                    </div>
                    {phase.risks.map((r, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '3px' }}>
                        • {r}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#22c55e', marginBottom: '6px', fontWeight: 600 }}>
                      💡 РЕКОМЕНДАЦИИ:
                    </div>
                    {phase.recommendations.map((r, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '3px' }}>
                        • {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Priority formula note */}
          <div style={{
            marginTop: '16px', background: '#1e293b', borderRadius: '8px', padding: '12px 16px',
            fontSize: '12px', color: '#64748b',
          }}>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Формула приоритетизации:</span>
            {' '}Очки = частота_изменений + (4 − критичность) × 10 + (4 − размер) × 7 − (API_зависимости + shared_state) × 2.
            Высокий балл = первый кандидат на извлечение.
          </div>
        </div>
      )}
    </div>
  )
}
