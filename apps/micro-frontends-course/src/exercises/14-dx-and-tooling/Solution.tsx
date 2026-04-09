import { useState, useCallback } from 'react'

// =====================================================
// Task 14.1: Monorepo vs Polyrepo Visualizer
// =====================================================

type RepoMode = 'monorepo' | 'polyrepo'

type MfeEntry = {
  id: string
  label: string
  color: string
}

type DependencyEdge = {
  from: string
  to: string
}

const INITIAL_MFES: MfeEntry[] = [
  { id: 'shell', label: 'Shell', color: '#1565c0' },
  { id: 'catalog', label: 'Catalog MFE', color: '#2e7d32' },
  { id: 'cart', label: 'Cart MFE', color: '#6a1b9a' },
  { id: 'checkout', label: 'Checkout MFE', color: '#e65100' },
]

const SHARED_PACKAGES = [
  { id: 'ui-kit', label: 'ui-kit', color: '#00695c' },
  { id: 'utils', label: 'utils', color: '#37474f' },
  { id: 'types', label: 'types', color: '#4527a0' },
]

const INITIAL_EDGES: DependencyEdge[] = [
  { from: 'shell', to: 'catalog' },
  { from: 'shell', to: 'cart' },
  { from: 'shell', to: 'checkout' },
  { from: 'catalog', to: 'ui-kit' },
  { from: 'cart', to: 'ui-kit' },
  { from: 'checkout', to: 'ui-kit' },
  { from: 'checkout', to: 'cart' },
  { from: 'catalog', to: 'utils' },
  { from: 'cart', to: 'types' },
]

const BASE_CI_MONOREPO_SEC = 45
const CI_PER_MFE_POLYREPO_SEC = 30
const BASE_CI_POLYREPO_SEC = 120

function MonorepoTree({ mfes }: { mfes: MfeEntry[] }) {
  const s = (style: React.CSSProperties) => style
  return (
    <div style={s({ fontFamily: 'monospace', fontSize: 13, color: '#94a3b8', lineHeight: 1.8 })}>
      <div style={s({ color: '#e2e8f0', fontWeight: 600 })}>company-monorepo/</div>
      <div style={s({ paddingLeft: 16 })}>
        <div style={s({ color: '#60a5fa' })}>apps/</div>
        {mfes.map(m => (
          <div key={m.id} style={s({ paddingLeft: 32, color: '#86efac' })}>
            {m.id}/
            <span style={s({ color: '#64748b', paddingLeft: 8 })}>package.json, src/</span>
          </div>
        ))}
        <div style={s({ color: '#60a5fa', marginTop: 4 })}>packages/</div>
        {SHARED_PACKAGES.map(p => (
          <div key={p.id} style={s({ paddingLeft: 32, color: '#fbbf24' })}>
            {p.id}/
            <span style={s({ color: '#64748b', paddingLeft: 8 })}>package.json, src/</span>
          </div>
        ))}
        <div style={s({ color: '#64748b', marginTop: 4 })}>nx.json</div>
        <div style={s({ color: '#64748b' })}>pnpm-workspace.yaml</div>
        <div style={s({ color: '#64748b' })}>tsconfig.base.json</div>
      </div>
    </div>
  )
}

function PolyrepoTree({ mfes }: { mfes: MfeEntry[] }) {
  const s = (style: React.CSSProperties) => style
  return (
    <div style={s({ fontFamily: 'monospace', fontSize: 13, color: '#94a3b8', lineHeight: 1.8 })}>
      <div style={s({ color: '#e2e8f0', fontWeight: 600, marginBottom: 6 })}>
        Отдельные репозитории:
      </div>
      {mfes.map(m => (
        <div key={m.id} style={s({ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 4 })}>
          <span style={s({ color: '#f472b6' })}>⬡</span>
          <span style={s({ color: '#86efac' })}>github.com/company/{m.id}</span>
          <span style={s({ color: '#64748b', fontSize: 11 })}>CI/CD: собственный</span>
        </div>
      ))}
      {SHARED_PACKAGES.map(p => (
        <div key={p.id} style={s({ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 4 })}>
          <span style={s({ color: '#f59e0b' })}>⬡</span>
          <span style={s({ color: '#fbbf24' })}>github.com/company/{p.id}</span>
          <span style={s({ color: '#64748b', fontSize: 11 })}>npm: @company/{p.id}</span>
        </div>
      ))}
    </div>
  )
}

function CIPipeline({ mode, mfes }: { mode: RepoMode; mfes: MfeEntry[] }) {
  const s = (style: React.CSSProperties) => style
  const changedMfe = mfes[1] // catalog — affected

  if (mode === 'monorepo') {
    const steps = [
      { id: 'detect', label: 'nx affected', active: true, note: 'обнаружен 1 MFE' },
      { id: 'build-catalog', label: `build: ${changedMfe?.label ?? 'catalog'}`, active: true, note: 'изменён' },
      { id: 'build-others', label: `build: остальные ${mfes.length - 1}`, active: false, note: '⏭ пропущено' },
      { id: 'test', label: 'test: affected only', active: true, note: '' },
      { id: 'deploy', label: 'deploy: affected', active: true, note: '' },
    ]
    return (
      <div>
        <div style={s({ fontSize: 12, color: '#4ade80', marginBottom: 8 })}>
          CI время: ~{BASE_CI_MONOREPO_SEC} сек (affected-only, не растёт)
        </div>
        <div style={s({ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' })}>
          {steps.map((step, i) => (
            <div key={step.id} style={s({ display: 'flex', alignItems: 'center', gap: 4 })}>
              <div style={s({
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 12,
                background: step.active ? '#1a3a2a' : '#1e293b',
                border: `1px solid ${step.active ? '#4ade80' : '#334155'}`,
                color: step.active ? '#86efac' : '#475569',
                position: 'relative',
              })}>
                {step.label}
                {step.note && (
                  <span style={s({ fontSize: 10, color: step.active ? '#4ade80' : '#475569', display: 'block' })}>
                    {step.note}
                  </span>
                )}
              </div>
              {i < steps.length - 1 && (
                <span style={s({ color: step.active ? '#4ade80' : '#334155' })}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // polyrepo pipeline
  return (
    <div>
      <div style={s({ fontSize: 12, color: '#f87171', marginBottom: 8 })}>
        CI время: ~{BASE_CI_POLYREPO_SEC + (mfes.length - 4) * CI_PER_MFE_POLYREPO_SEC} сек (полный прогон каждого репо)
      </div>
      <div style={s({ display: 'flex', flexDirection: 'column', gap: 4 })}>
        {mfes.map(m => (
          <div key={m.id} style={s({ display: 'flex', alignItems: 'center', gap: 4 })}>
            <div style={s({ width: 100, fontSize: 11, color: '#94a3b8' })}>{m.label}:</div>
            {['clone', 'install', 'lint', 'build', 'test', 'deploy'].map((step, i) => (
              <div key={step} style={s({ display: 'flex', alignItems: 'center', gap: 2 })}>
                <div style={s({
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontSize: 11,
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#94a3b8',
                })}>
                  {step}
                </div>
                {i < 5 && <span style={s({ color: '#334155', fontSize: 10 })}>→</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function DependencyGraph({ mfes, edges }: { mfes: MfeEntry[]; edges: DependencyEdge[] }) {
  const s = (style: React.CSSProperties) => style
  const allNodes = [...mfes, ...SHARED_PACKAGES]

  return (
    <div style={s({ display: 'flex', flexWrap: 'wrap', gap: 8 })}>
      <div style={s({ width: '100%', fontSize: 12, color: '#64748b', marginBottom: 4 })}>
        Граф зависимостей:
      </div>
      <div style={s({ display: 'flex', gap: 16, flexWrap: 'wrap' })}>
        <div>
          <div style={s({ fontSize: 11, color: '#64748b', marginBottom: 4 })}>MFE</div>
          {mfes.map(m => (
            <div key={m.id} style={s({
              padding: '4px 10px',
              borderRadius: 6,
              background: m.color + '22',
              border: `1px solid ${m.color}`,
              color: '#e2e8f0',
              fontSize: 12,
              marginBottom: 4,
            })}>
              {m.label}
            </div>
          ))}
        </div>
        <div style={s({ display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#334155', fontSize: 18 })}>
          →
        </div>
        <div>
          <div style={s({ fontSize: 11, color: '#64748b', marginBottom: 4 })}>Shared</div>
          {SHARED_PACKAGES.map(p => (
            <div key={p.id} style={s({
              padding: '4px 10px',
              borderRadius: 6,
              background: '#1e293b',
              border: '1px solid #fbbf24',
              color: '#fbbf24',
              fontSize: 12,
              marginBottom: 4,
            })}>
              @company/{p.id}
            </div>
          ))}
        </div>
      </div>
      <div style={s({ width: '100%', fontSize: 11, color: '#475569', marginTop: 4 })}>
        {edges.filter(e => SHARED_PACKAGES.some(p => p.id === e.to)).map(e => {
          const fromNode = allNodes.find(n => n.id === e.from)
          return (
            <span key={`${e.from}-${e.to}`} style={s({ marginRight: 12 })}>
              {fromNode?.label ?? e.from} → @company/{e.to}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function ComparisonTable({ mode, mfeCount }: { mode: RepoMode; mfeCount: number }) {
  const s = (style: React.CSSProperties) => style
  const rows = [
    {
      label: 'Cross-MFE рефакторинг',
      mono: '1 PR, atomic commit',
      poly: `${mfeCount} PR в ${mfeCount} репо`,
      monoBetter: true,
    },
    {
      label: 'CI при изменении shared',
      mono: 'Affected-only (~45 сек)',
      poly: `Все репо (~${BASE_CI_POLYREPO_SEC + (mfeCount - 4) * CI_PER_MFE_POLYREPO_SEC} сек)`,
      monoBetter: true,
    },
    {
      label: 'Onboarding',
      mono: 'git clone 1 репо',
      poly: `git clone ${mfeCount + SHARED_PACKAGES.length} репо`,
      monoBetter: true,
    },
    {
      label: 'Консистентность зависимостей',
      mono: 'Гарантирована (workspace:*)',
      poly: 'Ручная синхронизация',
      monoBetter: true,
    },
    {
      label: 'Изоляция команд',
      mono: 'Требует дисциплины (boundaries)',
      poly: 'Изолирована по умолчанию',
      monoBetter: false,
    },
  ]

  return (
    <div style={s({ overflowX: 'auto' })}>
      <table style={s({ width: '100%', borderCollapse: 'collapse', fontSize: 13 })}>
        <thead>
          <tr>
            <th style={s({ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 500, borderBottom: '1px solid #1e293b' })}>Критерий</th>
            <th style={s({ textAlign: 'left', padding: '8px 12px', color: '#4ade80', fontWeight: 500, borderBottom: '1px solid #1e293b' })}>Monorepo</th>
            <th style={s({ textAlign: 'left', padding: '8px 12px', color: '#f87171', fontWeight: 500, borderBottom: '1px solid #1e293b' })}>Polyrepo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.label}>
              <td style={s({ padding: '8px 12px', color: '#94a3b8', borderBottom: '1px solid #0f172a' })}>{row.label}</td>
              <td style={s({
                padding: '8px 12px',
                borderBottom: '1px solid #0f172a',
                color: row.monoBetter ? '#4ade80' : '#f87171',
              })}>
                {row.monoBetter ? '✅ ' : '⚠️ '}{row.mono}
              </td>
              <td style={s({
                padding: '8px 12px',
                borderBottom: '1px solid #0f172a',
                color: row.monoBetter ? '#f87171' : '#4ade80',
              })}>
                {row.monoBetter ? '⚠️ ' : '✅ '}{row.poly}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Task14_1_Solution() {
  const [mode, setMode] = useState<RepoMode>('monorepo')
  const [mfes, setMfes] = useState<MfeEntry[]>(INITIAL_MFES)
  const [edges] = useState<DependencyEdge[]>(INITIAL_EDGES)

  const s = (style: React.CSSProperties): React.CSSProperties => style

  const addMfe = useCallback(() => {
    const idx = mfes.length - INITIAL_MFES.length
    const colors = ['#b45309', '#7c3aed', '#0369a1', '#b91c1c', '#047857']
    const names = ['payments', 'profile', 'notifications', 'search', 'reviews']
    const name = names[idx % names.length] + (idx >= names.length ? `-${Math.floor(idx / names.length) + 1}` : '')
    setMfes(prev => [
      ...prev,
      { id: name, label: `${name.charAt(0).toUpperCase() + name.slice(1)} MFE`, color: colors[idx % colors.length] },
    ])
  }, [mfes.length])

  const monoCiSec = BASE_CI_MONOREPO_SEC
  const polyCiSec = BASE_CI_POLYREPO_SEC + (mfes.length - INITIAL_MFES.length) * CI_PER_MFE_POLYREPO_SEC

  const metrics = mode === 'monorepo'
    ? [
        { label: 'Время CI', value: `~${monoCiSec} сек`, color: '#4ade80' },
        { label: 'Cross-MFE рефакторинг', value: 'Лёгкий', color: '#4ade80' },
        { label: 'Onboarding', value: 'clone 1 репо', color: '#4ade80' },
        { label: 'Консистентность deps', value: 'Авто', color: '#4ade80' },
      ]
    : [
        { label: 'Время CI', value: `~${polyCiSec} сек`, color: '#f87171' },
        { label: 'Cross-MFE рефакторинг', value: 'Сложный', color: '#f87171' },
        { label: 'Onboarding', value: `clone ${mfes.length + SHARED_PACKAGES.length} репо`, color: '#f87171' },
        { label: 'Консистентность deps', value: 'Ручная', color: '#fbbf24' },
      ]

  return (
    <div style={s({ background: '#0f172a', minHeight: '100vh', padding: 24, fontFamily: 'system-ui, sans-serif', color: '#e2e8f0' })}>
      <h2 style={s({ fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#f1f5f9' })}>
        Визуализатор: Monorepo vs Polyrepo
      </h2>
      <p style={s({ color: '#64748b', fontSize: 14, marginBottom: 24 })}>
        Сравните подходы к организации кода в MFE-архитектуре
      </p>

      {/* Mode switcher */}
      <div style={s({ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' })}>
        {(['monorepo', 'polyrepo'] as RepoMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={s({
              padding: '8px 20px',
              borderRadius: 8,
              border: `2px solid ${mode === m ? '#3b82f6' : '#1e293b'}`,
              background: mode === m ? '#1d4ed8' : '#1e293b',
              color: mode === m ? '#fff' : '#64748b',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              textTransform: 'capitalize',
            })}
          >
            {m === 'monorepo' ? 'Monorepo' : 'Polyrepo'}
          </button>
        ))}
        <button
          onClick={addMfe}
          style={s({
            marginLeft: 16,
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #334155',
            background: '#0f172a',
            color: '#94a3b8',
            fontSize: 13,
            cursor: 'pointer',
          })}
        >
          + Добавить MFE
        </button>
        <span style={s({ fontSize: 13, color: '#475569' })}>
          Всего MFE: {mfes.length}
        </span>
      </div>

      {/* Metrics */}
      <div style={s({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 })}>
        {metrics.map(m => (
          <div key={m.label} style={s({
            background: '#1e293b',
            borderRadius: 10,
            padding: '12px 16px',
            border: '1px solid #334155',
          })}>
            <div style={s({ fontSize: 11, color: '#64748b', marginBottom: 4 })}>{m.label}</div>
            <div style={s({ fontSize: 18, fontWeight: 700, color: m.color })}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={s({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 })}>
        {/* File tree */}
        <div style={s({ background: '#1e293b', borderRadius: 10, padding: 16, border: '1px solid #334155' })}>
          <div style={s({ fontSize: 13, color: '#64748b', marginBottom: 12 })}>
            {mode === 'monorepo' ? '📁 Структура папок' : '⬡ Репозитории'}
          </div>
          {mode === 'monorepo'
            ? <MonorepoTree mfes={mfes} />
            : <PolyrepoTree mfes={mfes} />
          }
        </div>

        {/* Dep graph */}
        <div style={s({ background: '#1e293b', borderRadius: 10, padding: 16, border: '1px solid #334155' })}>
          <div style={s({ fontSize: 13, color: '#64748b', marginBottom: 12 })}>🔗 Граф зависимостей</div>
          <DependencyGraph mfes={mfes} edges={edges} />
        </div>
      </div>

      {/* CI Pipeline */}
      <div style={s({ background: '#1e293b', borderRadius: 10, padding: 16, border: '1px solid #334155', marginBottom: 24 })}>
        <div style={s({ fontSize: 13, color: '#64748b', marginBottom: 12 })}>
          ⚙️ CI Pipeline при изменении одного MFE
        </div>
        <CIPipeline mode={mode} mfes={mfes} />
      </div>

      {/* Comparison table */}
      <div style={s({ background: '#1e293b', borderRadius: 10, padding: 16, border: '1px solid #334155' })}>
        <div style={s({ fontSize: 13, color: '#64748b', marginBottom: 12 })}>📊 Сравнительная таблица</div>
        <ComparisonTable mode={mode} mfeCount={mfes.length} />
      </div>
    </div>
  )
}

// =====================================================
// Task 14.2: Workspace Config Constructor
// =====================================================

type WorkspaceTool = 'nx' | 'turborepo' | 'pnpm'
type PackageType = 'app' | 'library' | 'shared'

type MfePackage = {
  id: string
  name: string
  type: PackageType
  deps: string[]
}

const PREDEFINED_SHARED: MfePackage[] = [
  { id: 'ui-kit', name: 'ui-kit', type: 'shared', deps: [] },
  { id: 'utils', name: 'utils', type: 'shared', deps: [] },
  { id: 'types', name: 'types', type: 'shared', deps: [] },
  { id: 'config', name: 'config', type: 'shared', deps: [] },
]

function detectCycles(packages: MfePackage[]): string[][] {
  const graph: Record<string, string[]> = {}
  for (const pkg of packages) {
    graph[pkg.name] = pkg.deps
  }

  const cycles: string[][] = []
  const visited = new Set<string>()
  const inStack = new Set<string>()

  function dfs(node: string, path: string[]): void {
    if (inStack.has(node)) {
      const cycleStart = path.indexOf(node)
      cycles.push([...path.slice(cycleStart), node])
      return
    }
    if (visited.has(node)) return

    visited.add(node)
    inStack.add(node)

    for (const dep of graph[node] ?? []) {
      if (dep in graph) {
        dfs(dep, [...path, node])
      }
    }

    inStack.delete(node)
  }

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      dfs(node, [])
    }
  }

  return cycles
}

function generateNxConfig(packages: MfePackage[]): string {
  const apps = packages.filter(p => p.type === 'app')
  const libs = [...PREDEFINED_SHARED, ...packages.filter(p => p.type !== 'app')]
  const projects: Record<string, string> = {}
  for (const p of apps) projects[p.name] = `apps/${p.name}`
  for (const p of libs) projects[p.name] = `packages/${p.name}`

  return JSON.stringify({
    affected: { defaultBase: 'main' },
    tasksRunnerOptions: {
      default: {
        runner: 'nx/tasks-runners/default',
        options: { cacheableOperations: ['build', 'test', 'lint'] },
      },
    },
    projects,
  }, null, 2)
}

function generateTurboConfig(_packages: MfePackage[]): string {
  return JSON.stringify({
    $schema: 'https://turbo.build/schema.json',
    pipeline: {
      build: {
        dependsOn: ['^build'],
        outputs: ['dist/**'],
      },
      dev: {
        cache: false,
        persistent: true,
      },
      lint: {
        outputs: [],
      },
      test: {
        dependsOn: ['build'],
      },
    },
  }, null, 2)
}

function generatePnpmConfig(packages: MfePackage[]): string {
  const hasApps = packages.some(p => p.type === 'app')
  const hasLibs = packages.some(p => p.type === 'library') || PREDEFINED_SHARED.length > 0
  const lines = ['packages:']
  if (hasApps) lines.push("  - 'apps/*'")
  if (hasLibs) lines.push("  - 'packages/*'")
  return lines.join('\n')
}

const TOOL_DESCRIPTIONS: Record<WorkspaceTool, { label: string; desc: string; badge: string }> = {
  nx: {
    label: 'Nx',
    desc: 'Полноценная платформа: affected builds, dep graph, code generators, module boundaries',
    badge: 'Рекомендуется для больших команд',
  },
  turborepo: {
    label: 'Turborepo',
    desc: 'Быстрая сборка через pipeline и Remote Cache, минималистичная конфигурация',
    badge: 'Хорошо для средних команд',
  },
  pnpm: {
    label: 'PNPM Workspaces',
    desc: 'Базовое управление зависимостями через workspaces, без оркестрации сборки',
    badge: 'Простой старт',
  },
}

export function Task14_2_Solution() {
  const [tool, setTool] = useState<WorkspaceTool>('nx')
  const [packages, setPackages] = useState<MfePackage[]>([])
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<PackageType>('app')
  const [newDeps, setNewDeps] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [nameError, setNameError] = useState('')

  const s = (style: React.CSSProperties): React.CSSProperties => style

  const allPackages = [...PREDEFINED_SHARED, ...packages]

  const cycles = detectCycles(allPackages)

  const generatedConfig = (() => {
    if (tool === 'nx') return generateNxConfig(packages)
    if (tool === 'turborepo') return generateTurboConfig(packages)
    return generatePnpmConfig(packages)
  })()

  const configLabel = tool === 'nx' ? 'nx.json' : tool === 'turborepo' ? 'turbo.json' : 'pnpm-workspace.yaml'

  const toggleDep = (dep: string) => {
    setNewDeps(prev => prev.includes(dep) ? prev.filter(d => d !== dep) : [...prev, dep])
  }

  const addPackage = () => {
    const trimmed = newName.trim().toLowerCase().replace(/\s+/g, '-')
    if (!trimmed) { setNameError('Введите название'); return }
    if (!/^[a-z][a-z0-9-]*$/.test(trimmed)) { setNameError('Только строчные буквы, цифры, дефисы'); return }
    if (allPackages.some(p => p.name === trimmed)) { setNameError('Такой пакет уже существует'); return }
    setNameError('')
    setPackages(prev => [...prev, { id: trimmed, name: trimmed, type: newType, deps: newDeps }])
    setNewName('')
    setNewType('app')
    setNewDeps([])
  }

  const removePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id))
  }

  const copyConfig = () => {
    navigator.clipboard.writeText(generatedConfig).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={s({ background: '#0f172a', minHeight: '100vh', padding: 24, fontFamily: 'system-ui, sans-serif', color: '#e2e8f0' })}>
      <h2 style={s({ fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#f1f5f9' })}>
        Конструктор: workspace конфигурация
      </h2>
      <p style={s({ color: '#64748b', fontSize: 14, marginBottom: 24 })}>
        Выберите инструмент, добавьте MFE и получите готовую конфигурацию
      </p>

      <div style={s({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 })}>
        {/* Left panel */}
        <div style={s({ display: 'flex', flexDirection: 'column', gap: 16 })}>

          {/* Tool selector */}
          <div style={s({ background: '#1e293b', borderRadius: 10, padding: 16, border: '1px solid #334155' })}>
            <div style={s({ fontSize: 13, color: '#64748b', marginBottom: 12 })}>⚙️ Инструмент</div>
            <div style={s({ display: 'flex', flexDirection: 'column', gap: 8 })}>
              {(Object.keys(TOOL_DESCRIPTIONS) as WorkspaceTool[]).map(t => {
                const info = TOOL_DESCRIPTIONS[t]
                return (
                  <button
                    key={t}
                    onClick={() => setTool(t)}
                    style={s({
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: `2px solid ${tool === t ? '#3b82f6' : '#334155'}`,
                      background: tool === t ? '#1d4ed822' : 'transparent',
                      color: '#e2e8f0',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    })}
                  >
                    <div style={s({ display: 'flex', alignItems: 'center', gap: 8 })}>
                      <span style={s({ fontWeight: 600, color: tool === t ? '#60a5fa' : '#94a3b8' })}>{info.label}</span>
                      <span style={s({
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: tool === t ? '#1d4ed8' : '#1e293b',
                        color: tool === t ? '#93c5fd' : '#475569',
                      })}>
                        {info.badge}
                      </span>
                    </div>
                    <span style={s({ fontSize: 11, color: '#64748b' })}>{info.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Shared packages */}
          <div style={s({ background: '#1e293b', borderRadius: 10, padding: 16, border: '1px solid #334155' })}>
            <div style={s({ fontSize: 13, color: '#64748b', marginBottom: 10 })}>📦 Shared пакеты (предустановленные)</div>
            <div style={s({ display: 'flex', flexWrap: 'wrap', gap: 6 })}>
              {PREDEFINED_SHARED.map(p => (
                <span key={p.id} style={s({
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: '#1a2a1a',
                  border: '1px solid #4ade80',
                  color: '#4ade80',
                  fontSize: 12,
                })}>
                  @company/{p.name}
                </span>
              ))}
            </div>
          </div>

          {/* Add MFE form */}
          <div style={s({ background: '#1e293b', borderRadius: 10, padding: 16, border: '1px solid #334155' })}>
            <div style={s({ fontSize: 13, color: '#64748b', marginBottom: 12 })}>➕ Добавить MFE / пакет</div>
            <div style={s({ display: 'flex', flexDirection: 'column', gap: 10 })}>
              <div>
                <label style={s({ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 })}>Название</label>
                <input
                  value={newName}
                  onChange={e => { setNewName(e.target.value); setNameError('') }}
                  placeholder='catalog-mfe'
                  style={s({
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: `1px solid ${nameError ? '#f87171' : '#334155'}`,
                    background: '#0f172a',
                    color: '#e2e8f0',
                    fontSize: 13,
                    boxSizing: 'border-box',
                  })}
                />
                {nameError && <div style={s({ fontSize: 11, color: '#f87171', marginTop: 3 })}>{nameError}</div>}
              </div>
              <div>
                <label style={s({ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 })}>Тип</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as PackageType)}
                  style={s({
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #334155',
                    background: '#0f172a',
                    color: '#e2e8f0',
                    fontSize: 13,
                    boxSizing: 'border-box',
                  })}
                >
                  <option value='app'>app — MFE приложение</option>
                  <option value='library'>library — внутренняя библиотека</option>
                  <option value='shared'>shared — общий пакет</option>
                </select>
              </div>
              <div>
                <label style={s({ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 })}>Зависимости</label>
                <div style={s({ display: 'flex', flexWrap: 'wrap', gap: 6 })}>
                  {allPackages.map(p => (
                    <label key={p.id} style={s({
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '3px 8px',
                      borderRadius: 5,
                      background: newDeps.includes(p.name) ? '#1d4ed822' : '#0f172a',
                      border: `1px solid ${newDeps.includes(p.name) ? '#3b82f6' : '#334155'}`,
                      cursor: 'pointer',
                      fontSize: 12,
                      color: newDeps.includes(p.name) ? '#93c5fd' : '#64748b',
                    })}>
                      <input
                        type='checkbox'
                        checked={newDeps.includes(p.name)}
                        onChange={() => toggleDep(p.name)}
                        style={s({ width: 12, height: 12, accentColor: '#3b82f6' })}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={addPackage}
                style={s({
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#1d4ed8',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                })}
              >
                Добавить
              </button>
            </div>
          </div>

          {/* Added packages list */}
          {packages.length > 0 && (
            <div style={s({ background: '#1e293b', borderRadius: 10, padding: 16, border: '1px solid #334155' })}>
              <div style={s({ fontSize: 13, color: '#64748b', marginBottom: 10 })}>📋 Добавленные пакеты</div>
              <div style={s({ display: 'flex', flexDirection: 'column', gap: 6 })}>
                {packages.map(p => (
                  <div key={p.id} style={s({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 6,
                    background: '#0f172a',
                    border: '1px solid #334155',
                  })}>
                    <div>
                      <span style={s({ fontWeight: 600, fontSize: 13, color: '#e2e8f0' })}>{p.name}</span>
                      <span style={s({
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 4,
                        marginLeft: 8,
                        background: p.type === 'app' ? '#1d4ed822' : p.type === 'library' ? '#6a1b9a22' : '#1a3a2a',
                        color: p.type === 'app' ? '#60a5fa' : p.type === 'library' ? '#c084fc' : '#4ade80',
                      })}>
                        {p.type}
                      </span>
                      {p.deps.length > 0 && (
                        <span style={s({ fontSize: 11, color: '#64748b', marginLeft: 8 })}>
                          deps: {p.deps.join(', ')}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removePackage(p.id)}
                      style={s({
                        padding: '2px 8px',
                        borderRadius: 4,
                        border: '1px solid #7f1d1d',
                        background: 'transparent',
                        color: '#f87171',
                        fontSize: 11,
                        cursor: 'pointer',
                      })}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right panel: config preview */}
        <div style={s({ display: 'flex', flexDirection: 'column', gap: 16 })}>
          {/* Cycle warning */}
          {cycles.length > 0 && (
            <div style={s({
              background: '#7f1d1d',
              borderRadius: 10,
              padding: 14,
              border: '1px solid #ef4444',
            })}>
              <div style={s({ fontSize: 13, fontWeight: 600, color: '#fca5a5', marginBottom: 6 })}>
                ⚠️ Обнаружены циклические зависимости!
              </div>
              {cycles.map((cycle, i) => (
                <div key={i} style={s({ fontSize: 12, color: '#fca5a5', fontFamily: 'monospace' })}>
                  {cycle.join(' → ')}
                </div>
              ))}
              <div style={s({ fontSize: 11, color: '#f87171', marginTop: 8 })}>
                Вынесите общую логику в shared-пакет без зависимостей на app-уровень
              </div>
            </div>
          )}

          {/* Config preview */}
          <div style={s({ background: '#1e293b', borderRadius: 10, padding: 16, border: '1px solid #334155', flex: 1 })}>
            <div style={s({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 })}>
              <div style={s({ fontSize: 13, color: '#64748b' })}>
                📄 {configLabel}
              </div>
              <button
                onClick={copyConfig}
                style={s({
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: '1px solid #334155',
                  background: copied ? '#1a3a2a' : '#0f172a',
                  color: copied ? '#4ade80' : '#94a3b8',
                  fontSize: 12,
                  cursor: 'pointer',
                })}
              >
                {copied ? '✓ Скопировано' : '⎘ Скопировать'}
              </button>
            </div>
            <pre style={s({
              margin: 0,
              padding: 14,
              borderRadius: 8,
              background: '#0f172a',
              border: '1px solid #1e293b',
              color: '#86efac',
              fontSize: 12,
              fontFamily: 'monospace',
              lineHeight: 1.6,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              maxHeight: 400,
              overflowY: 'auto',
            })}>
              {generatedConfig}
            </pre>
          </div>

          {/* Tips */}
          <div style={s({ background: '#1e293b', borderRadius: 10, padding: 16, border: '1px solid #334155' })}>
            <div style={s({ fontSize: 13, color: '#64748b', marginBottom: 10 })}>
              💡 Подсказки для {TOOL_DESCRIPTIONS[tool].label}
            </div>
            <div style={s({ display: 'flex', flexDirection: 'column', gap: 6 })}>
              {tool === 'nx' && [
                'nx affected --target=build — собирает только изменённые проекты',
                'nx graph — визуализирует граф зависимостей в браузере',
                '@nrwl/enforce-module-boundaries — запрещает импорты между MFE',
              ].map(tip => (
                <div key={tip} style={s({ fontSize: 12, color: '#94a3b8', display: 'flex', gap: 6 })}>
                  <span style={s({ color: '#4ade80' })}>→</span> {tip}
                </div>
              ))}
              {tool === 'turborepo' && [
                'turbo run build --filter=catalog-mfe — сборка одного MFE и его deps',
                'turbo run dev --parallel — запуск dev серверов всех MFE',
                'TURBO_TEAM + TURBO_TOKEN — настройка Remote Cache',
              ].map(tip => (
                <div key={tip} style={s({ fontSize: 12, color: '#94a3b8', display: 'flex', gap: 6 })}>
                  <span style={s({ color: '#fbbf24' })}>→</span> {tip}
                </div>
              ))}
              {tool === 'pnpm' && [
                'pnpm -r build — рекурсивная сборка всех пакетов',
                'workspace:* — ссылка на локальный пакет, не npm registry',
                'pnpm --filter catalog-mfe dev — запуск одного MFE',
              ].map(tip => (
                <div key={tip} style={s({ fontSize: 12, color: '#94a3b8', display: 'flex', gap: 6 })}>
                  <span style={s({ color: '#c084fc' })}>→</span> {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
