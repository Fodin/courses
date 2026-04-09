import { useState } from 'react'

// ============================================
// Task 1.1: MFE Topology Visualizer
// ============================================

type SplitMode = 'vertical' | 'horizontal'

interface Zone {
  id: string
  label: string
  row: number
  col: number
  rowSpan?: number
  colSpan?: number
}

interface TeamAssignment {
  zoneId: string
  teamId: string
}

const ZONES: Zone[] = [
  { id: 'header', label: 'Header', row: 1, col: 1, colSpan: 3 },
  { id: 'nav', label: 'Nav / Sidebar', row: 2, col: 1 },
  { id: 'content-main', label: 'Content Main', row: 2, col: 2 },
  { id: 'content-aside', label: 'Content Aside', row: 2, col: 3 },
  { id: 'footer', label: 'Footer', row: 3, col: 1, colSpan: 3 },
]

interface TeamDef {
  id: string
  name: string
  color: string
  domain: string
}

const TEAMS: TeamDef[] = [
  { id: 'team-catalog', name: 'Team Catalog', color: '#1976d2', domain: 'Каталог' },
  { id: 'team-cart', name: 'Team Cart', color: '#388e3c', domain: 'Корзина' },
  { id: 'team-user', name: 'Team User', color: '#f57c00', domain: 'Профиль' },
  { id: 'team-search', name: 'Team Search', color: '#7b1fa2', domain: 'Поиск' },
  { id: 'none', name: '— не назначено —', color: '#bdbdbd', domain: '' },
]

const VERTICAL_PRESETS: Record<string, string> = {
  header: 'team-catalog',
  nav: 'team-search',
  'content-main': 'team-catalog',
  'content-aside': 'team-cart',
  footer: 'team-user',
}

const HORIZONTAL_PRESETS: Record<string, string> = {
  header: 'team-user',
  nav: 'team-user',
  'content-main': 'team-catalog',
  'content-aside': 'team-catalog',
  footer: 'team-user',
}

function getTeam(id: string): TeamDef {
  return TEAMS.find(t => t.id === id) ?? TEAMS[TEAMS.length - 1]
}

function getZoneProblems(assignments: TeamAssignment[], mode: SplitMode): string[] {
  const problems: string[] = []
  const teamZoneCounts: Record<string, number> = {}
  assignments.forEach(a => {
    if (a.teamId !== 'none') {
      teamZoneCounts[a.teamId] = (teamZoneCounts[a.teamId] ?? 0) + 1
    }
  })

  if (mode === 'vertical') {
    const headerOwner = assignments.find(a => a.zoneId === 'header')?.teamId
    const footerOwner = assignments.find(a => a.zoneId === 'footer')?.teamId
    if (headerOwner && footerOwner && headerOwner !== footerOwner && headerOwner !== 'none' && footerOwner !== 'none') {
      problems.push('Header и Footer принадлежат разным командам — сложно поддерживать единую навигацию')
    }
    const teamsWithManyZones = Object.entries(teamZoneCounts).filter(([, c]) => c > 2)
    if (teamsWithManyZones.length > 0) {
      problems.push('Команда владеет >2 зонами — возможно, нарушены границы домена')
    }
  }

  if (mode === 'horizontal') {
    const uniqueTeams = new Set(assignments.filter(a => a.teamId !== 'none').map(a => a.teamId))
    if (uniqueTeams.size > 2) {
      problems.push('Горизонтальное разделение лучше работает с 1-2 командами на слой')
    }
    const contentMain = assignments.find(a => a.zoneId === 'content-main')?.teamId
    const contentAside = assignments.find(a => a.zoneId === 'content-aside')?.teamId
    if (contentMain && contentAside && contentMain !== contentAside) {
      problems.push('Content Main и Content Aside под разными командами — проблема согласованности UI')
    }
  }

  if (Object.keys(teamZoneCounts).length === 0) {
    problems.push('Ни одна зона не назначена команде')
  }

  return problems
}

export function Task1_1_Solution() {
  const [mode, setMode] = useState<SplitMode>('vertical')
  const [assignments, setAssignments] = useState<TeamAssignment[]>(
    ZONES.map(z => ({ zoneId: z.id, teamId: VERTICAL_PRESETS[z.id] ?? 'none' }))
  )

  function applyPreset(newMode: SplitMode) {
    const presets = newMode === 'vertical' ? VERTICAL_PRESETS : HORIZONTAL_PRESETS
    setAssignments(ZONES.map(z => ({ zoneId: z.id, teamId: presets[z.id] ?? 'none' })))
    setMode(newMode)
  }

  function assign(zoneId: string, teamId: string) {
    setAssignments(prev => prev.map(a => a.zoneId === zoneId ? { ...a, teamId } : a))
  }

  const problems = getZoneProblems(assignments, mode)

  // team stats
  const teamStats = TEAMS.filter(t => t.id !== 'none').map(team => {
    const zones = assignments.filter(a => a.teamId === team.id).map(a => ZONES.find(z => z.id === a.zoneId)?.label ?? a.zoneId)
    return { team, zones }
  }).filter(s => s.zones.length > 0)

  const containerStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    padding: '1.5rem',
    maxWidth: '820px',
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1.8fr 1fr',
    gridTemplateRows: 'auto auto auto',
    gap: '8px',
    marginBottom: '1.5rem',
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ margin: '0 0 0.25rem' }}>Визуализатор топологии MFE</h2>
      <p style={{ color: '#666', margin: '0 0 1.25rem', fontSize: '0.9rem' }}>
        Назначайте команды на зоны страницы и переключайте режим разделения
      </p>

      {/* Mode switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
        {(['vertical', 'horizontal'] as SplitMode[]).map(m => (
          <button
            key={m}
            onClick={() => applyPreset(m)}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: mode === m ? 700 : 400,
              background: mode === m ? '#1976d2' : '#e3eaf5',
              color: mode === m ? '#fff' : '#333',
              fontSize: '0.9rem',
              transition: 'all 0.15s',
            }}
          >
            {m === 'vertical' ? 'Vertical Split (по домену)' : 'Horizontal Split (по слою)'}
          </button>
        ))}
      </div>

      {/* Description */}
      <div style={{ background: mode === 'vertical' ? '#e8f5e9' : '#e3f2fd', borderRadius: '8px', padding: '10px 14px', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#444' }}>
        {mode === 'vertical'
          ? 'Vertical Split: каждая команда владеет целым доменом (feature/domain ownership). Команда контролирует несколько зон, связанных одной бизнес-функцией.'
          : 'Horizontal Split: команды делят страницу по слоям (header-команда, content-команда, footer-команда). Один компонент — одна ответственность.'}
      </div>

      {/* Page map grid */}
      <div style={gridStyle}>
        {ZONES.map(zone => {
          const assignment = assignments.find(a => a.zoneId === zone.id)
          const team = getTeam(assignment?.teamId ?? 'none')
          const gridColumn = zone.colSpan
            ? `${zone.col} / span ${zone.colSpan}`
            : `${zone.col}`
          const gridRow = `${zone.row}`
          return (
            <div
              key={zone.id}
              style={{
                gridColumn,
                gridRow,
                background: team.id !== 'none' ? team.color + '22' : '#f5f5f5',
                border: `2px solid ${team.id !== 'none' ? team.color : '#ccc'}`,
                borderRadius: '8px',
                padding: '10px 12px',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px', color: '#333' }}>{zone.label}</div>
              <select
                value={assignment?.teamId ?? 'none'}
                onChange={e => assign(zone.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  border: `1px solid ${team.color}`,
                  fontSize: '0.8rem',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                {TEAMS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {team.id !== 'none' && (
                <div style={{
                  marginTop: '5px',
                  display: 'inline-block',
                  background: team.color,
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '2px 7px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}>
                  {team.domain}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Team stats table */}
      {teamStats.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.6rem', color: '#444' }}>Распределение зон по командам</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ textAlign: 'left', padding: '6px 10px', borderRadius: '4px 0 0 4px' }}>Команда</th>
                <th style={{ textAlign: 'center', padding: '6px 10px' }}>Зон</th>
                <th style={{ textAlign: 'left', padding: '6px 10px', borderRadius: '0 4px 4px 0' }}>Зоны</th>
              </tr>
            </thead>
            <tbody>
              {teamStats.map(({ team, zones }) => (
                <tr key={team.id}>
                  <td style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: team.color }} />
                    {team.name}
                  </td>
                  <td style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 700, color: team.color }}>{zones.length}</td>
                  <td style={{ padding: '6px 10px', color: '#555' }}>{zones.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Problems / warnings */}
      {problems.length > 0 && (
        <div style={{ background: '#fff3e0', border: '1px solid #ffb74d', borderRadius: '8px', padding: '10px 14px' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#e65100', marginBottom: '6px' }}>Потенциальные проблемы</div>
          {problems.map((p, i) => (
            <div key={i} style={{ fontSize: '0.83rem', color: '#bf360c', marginBottom: '3px' }}>⚠️ {p}</div>
          ))}
        </div>
      )}

      {problems.length === 0 && teamStats.length > 0 && (
        <div style={{ background: '#e8f5e9', border: '1px solid #81c784', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: '#2e7d32' }}>
          Текущее распределение выглядит консистентным для режима «{mode === 'vertical' ? 'Vertical' : 'Horizontal'} Split»
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 1.2: ADR Constructor
// ============================================

type CompositionType = 'client-side' | 'server-side' | 'edge-side' | 'build-time'
type SplitStrategy = 'vertical' | 'horizontal' | 'hybrid'
type SharedLib = 'React' | 'Router' | 'Design System' | 'State Manager' | 'HTTP Client'
type CommPattern = 'Custom Events' | 'Shared State' | 'URL' | 'Props/Callbacks'
type DeployStrategy = 'independent' | 'coordinated' | 'monorepo'

interface AdrState {
  composition: CompositionType | null
  split: SplitStrategy | null
  sharedLibs: SharedLib[]
  communication: CommPattern[]
  deployment: DeployStrategy | null
}

const COMPOSITION_INFO: Record<CompositionType, { label: string; desc: string; pros: string; cons: string }> = {
  'client-side': {
    label: 'Client-side (CSR)',
    desc: 'Shell загружает remote-приложения в браузере через Module Federation или dynamic import',
    pros: 'Простое развёртывание, независимые релизы',
    cons: 'Долгий первый рендер, проблемы SEO',
  },
  'server-side': {
    label: 'Server-side (SSR)',
    desc: 'Сервер собирает HTML из фрагментов разных сервисов (Tailor, Podium, Mosaic)',
    pros: 'SEO, быстрый FCP, работает без JS',
    cons: 'Сложная инфраструктура, гидрация, latency зависимостей',
  },
  'edge-side': {
    label: 'Edge-side (ESI / CF Workers)',
    desc: 'CDN/Edge склеивает фрагменты перед отправкой клиенту',
    pros: 'Минимальная задержка, кешируемость по зонам',
    cons: 'Vendor lock-in, ограниченный runtime',
  },
  'build-time': {
    label: 'Build-time (NPM packages)',
    desc: 'MFE публикуются как npm-пакеты и собираются вместе при билде shell',
    pros: 'Максимальная типобезопасность, tree-shaking',
    cons: 'Нет независимых деплоев — нарушает основной принцип MFE',
  },
}

const SPLIT_INFO: Record<SplitStrategy, { label: string; desc: string }> = {
  vertical: { label: 'Vertical (по домену)', desc: 'Команда владеет полным доменом: от UI до API. Высокая автономия.' },
  horizontal: { label: 'Horizontal (по слою)', desc: 'Команды по техническим слоям: header-команда, content-команда. Проще согласовывать стиль.' },
  hybrid: { label: 'Hybrid', desc: 'Комбинация: общий shell-слой + вертикальные домены внутри.' },
}

const SHARED_LIBS: SharedLib[] = ['React', 'Router', 'Design System', 'State Manager', 'HTTP Client']

const COMM_PATTERNS: CommPattern[] = ['Custom Events', 'Shared State', 'URL', 'Props/Callbacks']

const DEPLOY_INFO: Record<DeployStrategy, { label: string; desc: string }> = {
  independent: { label: 'Независимые деплои', desc: 'Каждый MFE деплоится отдельно в любое время' },
  coordinated: { label: 'Координированные деплои', desc: 'Команды согласуют окна деплоя для совместимости' },
  monorepo: { label: 'Monorepo + общий CI', desc: 'Всё в одном репо, деплой при изменении компонента' },
}

function getConflicts(state: AdrState): string[] {
  const warnings: string[] = []
  if (state.composition === 'server-side' && state.communication.includes('Shared State')) {
    warnings.push('Server-side composition + Shared State (Redux/Zustand) → проблема гидрации: стейт на сервере не совпадёт с клиентским')
  }
  if (state.composition === 'build-time' && state.deployment === 'independent') {
    warnings.push('Build-time composition не поддерживает независимые деплои — это противоречие: релизы будут заблокированы')
  }
  if (state.sharedLibs.includes('State Manager') && state.split === 'vertical') {
    warnings.push('Shared State Manager + Vertical split: команды будут конкурировать за глобальный стор — рассмотрите изолированные сторы')
  }
  if (state.communication.includes('Shared State') && state.deployment === 'independent') {
    warnings.push('Shared State при независимых деплоях: версии стейт-менеджера могут расходиться → runtime-ошибки')
  }
  if (state.sharedLibs.length === 0 && state.composition === 'client-side') {
    warnings.push('Нет shared React → каждый MFE принесёт свою копию React (увеличение бандла, потеря контекстов)')
  }
  if (state.split === 'horizontal' && state.deployment === 'independent') {
    warnings.push('Horizontal split + независимые деплои: layout-команда блокирует остальных при изменении сетки')
  }
  return warnings
}

function generateAdr(state: AdrState): string {
  const comp = state.composition ? COMPOSITION_INFO[state.composition] : null
  const split = state.split ? SPLIT_INFO[state.split] : null
  const deploy = state.deployment ? DEPLOY_INFO[state.deployment] : null

  const date = new Date().toISOString().split('T')[0]

  return `# ADR-001: Архитектура микрофронтендов
Статус: Proposed
Дата: ${date}

## Контекст
Команда принимает решение об архитектуре micro-frontend приложения.
Необходимо определить стратегию композиции, разделения ответственности
и технического взаимодействия между командами.

## Решение

### Тип композиции: ${comp ? comp.label : '(не выбрано)'}
${comp ? comp.desc : ''}

### Стратегия разделения: ${split ? split.label : '(не выбрано)'}
${split ? split.desc : ''}

### Shared-зависимости
${state.sharedLibs.length > 0 ? state.sharedLibs.map(l => `- ${l}`).join('\n') : '- Нет (полная изоляция)'}

### Коммуникация между MFE
${state.communication.length > 0 ? state.communication.map(c => `- ${c}`).join('\n') : '- Не определено'}

### Стратегия деплоя: ${deploy ? deploy.label : '(не выбрано)'}
${deploy ? deploy.desc : ''}

## Последствия

### Преимущества
${comp ? `- ${comp.pros}` : ''}
${split === SPLIT_INFO['vertical'] ? '- Высокая автономия команд' : '- Согласованность UI'}
${deploy?.label === 'Независимые деплои' ? '- Быстрые независимые релизы' : '- Предсказуемые совместные релизы'}

### Риски
${comp ? `- ${comp.cons}` : ''}
${state.sharedLibs.includes('State Manager') ? '- Сложность управления глобальным состоянием' : ''}
${state.communication.includes('Custom Events') ? '- Custom Events: отсутствие типизации, трудно трассировать' : ''}
`.trim()
}

const STEPS = [
  'Тип композиции',
  'Стратегия split',
  'Shared-библиотеки',
  'Коммуникация',
  'Деплой',
  'Результат',
]

export function Task1_2_Solution() {
  const [step, setStep] = useState(0)
  const [state, setState] = useState<AdrState>({
    composition: null,
    split: null,
    sharedLibs: [],
    communication: [],
    deployment: null,
  })
  const [copied, setCopied] = useState(false)

  const conflicts = getConflicts(state)
  const adrText = generateAdr(state)

  function toggleLib(lib: SharedLib) {
    setState(prev => ({
      ...prev,
      sharedLibs: prev.sharedLibs.includes(lib)
        ? prev.sharedLibs.filter(l => l !== lib)
        : [...prev.sharedLibs, lib],
    }))
  }

  function toggleComm(c: CommPattern) {
    setState(prev => ({
      ...prev,
      communication: prev.communication.includes(c)
        ? prev.communication.filter(x => x !== c)
        : [...prev.communication, c],
    }))
  }

  function copyAdr() {
    navigator.clipboard.writeText(adrText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const containerStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    padding: '1.5rem',
    maxWidth: '720px',
  }

  const stepBtnStyle = (active: boolean, done: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: active ? 700 : 400,
    background: active ? '#1976d2' : done ? '#e8f5e9' : '#f0f0f0',
    color: active ? '#fff' : done ? '#2e7d32' : '#666',
  })

  const radioStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }

  const optionStyle = (selected: boolean): React.CSSProperties => ({
    padding: '10px 14px',
    borderRadius: '8px',
    border: `2px solid ${selected ? '#1976d2' : '#e0e0e0'}`,
    cursor: 'pointer',
    background: selected ? '#e3f2fd' : '#fafafa',
    transition: 'all 0.15s',
  })

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ margin: '0 0 0.25rem' }}>Конструктор ADR</h2>
      <p style={{ color: '#666', margin: '0 0 1.25rem', fontSize: '0.9rem' }}>
        Architecture Decision Record для микрофронтенд-архитектуры
      </p>

      {/* Step navigation */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={stepBtnStyle(step === i, i < step)}>
            {i < step ? '✓ ' : ''}{s}
          </button>
        ))}
      </div>

      {/* Step 0: Composition */}
      {step === 0 && (
        <div>
          <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem' }}>Выберите тип композиции</h3>
          <div style={radioStyle}>
            {(Object.keys(COMPOSITION_INFO) as CompositionType[]).map(key => {
              const info = COMPOSITION_INFO[key]
              const selected = state.composition === key
              return (
                <div key={key} style={optionStyle(selected)} onClick={() => setState(p => ({ ...p, composition: key }))}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px' }}>{info.label}</div>
                  <div style={{ fontSize: '0.82rem', color: '#555', marginBottom: '4px' }}>{info.desc}</div>
                  <div style={{ fontSize: '0.78rem', color: '#2e7d32' }}>+ {info.pros}</div>
                  <div style={{ fontSize: '0.78rem', color: '#c62828' }}>- {info.cons}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 1: Split strategy */}
      {step === 1 && (
        <div>
          <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem' }}>Стратегия разделения</h3>
          <div style={radioStyle}>
            {(Object.keys(SPLIT_INFO) as SplitStrategy[]).map(key => {
              const info = SPLIT_INFO[key]
              const selected = state.split === key
              return (
                <div key={key} style={optionStyle(selected)} onClick={() => setState(p => ({ ...p, split: key }))}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px' }}>{info.label}</div>
                  <div style={{ fontSize: '0.82rem', color: '#555' }}>{info.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 2: Shared libs */}
      {step === 2 && (
        <div>
          <h3 style={{ fontSize: '1rem', margin: '0 0 0.4rem' }}>Shared-библиотеки</h3>
          <p style={{ fontSize: '0.83rem', color: '#666', margin: '0 0 0.75rem' }}>
            Что будет разделено между MFE через singleton в Module Federation? Меньше — лучше для изоляции, больше — меньше дублирования.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SHARED_LIBS.map(lib => {
              const active = state.sharedLibs.includes(lib)
              return (
                <button
                  key={lib}
                  onClick={() => toggleLib(lib)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: `2px solid ${active ? '#1976d2' : '#ccc'}`,
                    background: active ? '#1976d2' : '#fff',
                    color: active ? '#fff' : '#333',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: active ? 700 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {lib}
                </button>
              )
            })}
          </div>
          {state.sharedLibs.length === 0 && (
            <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#f57c00' }}>
              Без shared React каждый MFE загрузит свою копию (~130KB gzip каждая)
            </div>
          )}
        </div>
      )}

      {/* Step 3: Communication */}
      {step === 3 && (
        <div>
          <h3 style={{ fontSize: '1rem', margin: '0 0 0.4rem' }}>Паттерны коммуникации</h3>
          <p style={{ fontSize: '0.83rem', color: '#666', margin: '0 0 0.75rem' }}>
            Как MFE будут обмениваться данными? Можно выбрать несколько.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {COMM_PATTERNS.map(p => {
              const active = state.communication.includes(p)
              const hints: Record<CommPattern, string> = {
                'Custom Events': 'window.dispatchEvent — слабая связность, трудно типизировать',
                'Shared State': 'Redux/Zustand singleton — простота, но риск coupling',
                'URL': 'Query params / path — прозрачно, персистентно, без JS',
                'Props/Callbacks': 'Прямая передача через оркестратор — сильная связность',
              }
              return (
                <div
                  key={p}
                  style={optionStyle(active)}
                  onClick={() => toggleComm(p)}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p}</div>
                  <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '2px' }}>{hints[p]}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 4: Deployment */}
      {step === 4 && (
        <div>
          <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem' }}>Стратегия деплоя</h3>
          <div style={radioStyle}>
            {(Object.keys(DEPLOY_INFO) as DeployStrategy[]).map(key => {
              const info = DEPLOY_INFO[key]
              const selected = state.deployment === key
              return (
                <div key={key} style={optionStyle(selected)} onClick={() => setState(p => ({ ...p, deployment: key }))}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px' }}>{info.label}</div>
                  <div style={{ fontSize: '0.82rem', color: '#555' }}>{info.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 5: Result */}
      {step === 5 && (
        <div>
          <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem' }}>Сгенерированный ADR</h3>

          {/* Conflict warnings */}
          {conflicts.length > 0 && (
            <div style={{ background: '#fff3e0', border: '1px solid #ffb74d', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#e65100', marginBottom: '6px' }}>Конфликты в архитектурных решениях</div>
              {conflicts.map((w, i) => (
                <div key={i} style={{ fontSize: '0.82rem', color: '#bf360c', marginBottom: '4px' }}>⚠️ {w}</div>
              ))}
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <pre style={{
              background: '#263238',
              color: '#eceff1',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '0.78rem',
              lineHeight: '1.6',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {adrText}
            </pre>
            <button
              onClick={copyAdr}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '5px 12px',
                borderRadius: '5px',
                border: 'none',
                background: copied ? '#4caf50' : '#546e7a',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.78rem',
                transition: 'background 0.2s',
              }}
            >
              {copied ? 'Скопировано!' : 'Скопировать ADR'}
            </button>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem', justifyContent: 'space-between' }}>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{ padding: '8px 18px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', cursor: step === 0 ? 'default' : 'pointer', color: step === 0 ? '#bbb' : '#333' }}
        >
          Назад
        </button>
        <button
          onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#1976d2', color: '#fff', cursor: step === STEPS.length - 1 ? 'default' : 'pointer', opacity: step === STEPS.length - 1 ? 0.5 : 1 }}
        >
          Далее
        </button>
      </div>
    </div>
  )
}
