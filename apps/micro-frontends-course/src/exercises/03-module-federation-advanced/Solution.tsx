import { useState } from 'react'

// =====================================================
// Task 3.1: Shared Version Conflict Simulator
// =====================================================

interface SharedConfig {
  version: string
  singleton: boolean
  strictVersion: boolean
  requiredVersion: string
}

interface ResolutionResult {
  resolvedVersion: string
  status: 'ok' | 'warning' | 'error'
  message: string
  details: string[]
  willDuplicate: boolean
  willError: boolean
}

type Preset = 'compatible' | 'minor-mismatch' | 'major-conflict' | 'duplicate'

const PRESETS: Record<Preset, { label: string; host: SharedConfig; remote: SharedConfig; description: string }> = {
  compatible: {
    label: 'Всё совместимо',
    description: 'Обе стороны используют react@18.2.0, singleton включён. Идеальный сценарий.',
    host: { version: '18.2.0', singleton: true, strictVersion: false, requiredVersion: '^18.0.0' },
    remote: { version: '18.2.0', singleton: true, strictVersion: false, requiredVersion: '^18.0.0' },
  },
  'minor-mismatch': {
    label: 'Minor mismatch',
    description: 'Host использует 18.0.0, remote — 18.3.1. Оба в диапазоне ^18. Предупреждение, но работает.',
    host: { version: '18.0.0', singleton: true, strictVersion: false, requiredVersion: '^18.0.0' },
    remote: { version: '18.3.1', singleton: true, strictVersion: false, requiredVersion: '^18.0.0' },
  },
  'major-conflict': {
    label: 'Major conflict',
    description: 'Host на React 17, remote на React 18. strictVersion у remote — загрузка упадёт с ошибкой.',
    host: { version: '17.0.2', singleton: true, strictVersion: false, requiredVersion: '^17.0.0' },
    remote: { version: '18.2.0', singleton: true, strictVersion: true, requiredVersion: '^18.0.0' },
  },
  duplicate: {
    label: 'Дублирование',
    description: 'singleton выключен на обеих сторонах. Каждый MFE загрузит свою копию React.',
    host: { version: '18.2.0', singleton: false, strictVersion: false, requiredVersion: '^18.0.0' },
    remote: { version: '18.2.0', singleton: false, strictVersion: false, requiredVersion: '^18.0.0' },
  },
}

function parseSemver(v: string): { major: number; minor: number; patch: number } | null {
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!m) return null
  return { major: parseInt(m[1]), minor: parseInt(m[2]), patch: parseInt(m[3]) }
}

function satisfiesRange(version: string, range: string): boolean {
  const v = parseSemver(version)
  if (!v) return false
  const caretMatch = range.match(/^\^(\d+)\.(\d+)\.(\d+)$/)
  if (caretMatch) {
    const req = { major: parseInt(caretMatch[1]), minor: parseInt(caretMatch[2]), patch: parseInt(caretMatch[3]) }
    if (v.major !== req.major) return false
    if (v.major === 0) {
      return v.minor === req.minor && v.patch >= req.patch
    }
    return (v.minor > req.minor) || (v.minor === req.minor && v.patch >= req.patch)
  }
  // exact match fallback
  return version === range
}

function compareVersions(a: string, b: string): number {
  const va = parseSemver(a)
  const vb = parseSemver(b)
  if (!va || !vb) return 0
  if (va.major !== vb.major) return va.major - vb.major
  if (va.minor !== vb.minor) return va.minor - vb.minor
  return va.patch - vb.patch
}

function resolveVersions(host: SharedConfig, remote: SharedConfig): ResolutionResult {
  const details: string[] = []

  // Both singleton off → duplicate
  if (!host.singleton && !remote.singleton) {
    return {
      resolvedVersion: `host: ${host.version} + remote: ${remote.version}`,
      status: 'warning',
      message: 'Дублирование! Два экземпляра React в памяти.',
      details: [
        'singleton: false у обеих сторон',
        `Host загружает react@${host.version}`,
        `Remote загружает react@${remote.version}`,
        'Результат: два экземпляра React — сломаются хуки и Context',
      ],
      willDuplicate: true,
      willError: false,
    }
  }

  // singleton mismatch
  if (host.singleton !== remote.singleton) {
    details.push(`singleton: host=${host.singleton}, remote=${remote.singleton} — несоответствие`)
  }

  // Check if versions are compatible with each other's requiredVersion
  const hostSatisfiesRemote = satisfiesRange(host.version, remote.requiredVersion)
  const remoteSatisfiesHost = satisfiesRange(remote.version, host.requiredVersion)

  // strictVersion check
  if (remote.strictVersion) {
    // remote demands exact match with its requiredVersion range
    if (!satisfiesRange(host.version, remote.requiredVersion) && !satisfiesRange(remote.version, host.requiredVersion)) {
      return {
        resolvedVersion: '—',
        status: 'error',
        message: `Ошибка! strictVersion нарушен: host@${host.version} не попадает в диапазон remote (${remote.requiredVersion})`,
        details: [
          `remote.strictVersion = true`,
          `remote.requiredVersion = "${remote.requiredVersion}"`,
          `host.version = ${host.version} — не соответствует диапазону`,
          'Module Federation выбросит ошибку в runtime: Unsatisfied version',
        ],
        willDuplicate: false,
        willError: true,
      }
    }
  }

  if (host.strictVersion) {
    if (!satisfiesRange(remote.version, host.requiredVersion) && !satisfiesRange(host.version, remote.requiredVersion)) {
      return {
        resolvedVersion: '—',
        status: 'error',
        message: `Ошибка! strictVersion нарушен: remote@${remote.version} не попадает в диапазон host (${host.requiredVersion})`,
        details: [
          `host.strictVersion = true`,
          `host.requiredVersion = "${host.requiredVersion}"`,
          `remote.version = ${remote.version} — не соответствует диапазону`,
          'Module Federation выбросит ошибку в runtime: Unsatisfied version',
        ],
        willDuplicate: false,
        willError: true,
      }
    }
  }

  // Both compatible — pick higher version
  const resolved = compareVersions(host.version, remote.version) >= 0 ? host.version : remote.version
  const versionsMatch = host.version === remote.version

  if (versionsMatch) {
    return {
      resolvedVersion: resolved,
      status: 'ok',
      message: `Идеально! Версии совпадают, будет использован один экземпляр react@${resolved}`,
      details: [
        `host.version = ${host.version}`,
        `remote.version = ${remote.version}`,
        'Версии идентичны, singleton=true → один экземпляр',
        'Хуки, Context, Router работают корректно',
      ],
      willDuplicate: false,
      willError: false,
    }
  }

  const compat = hostSatisfiesRemote || remoteSatisfiesHost
  if (compat) {
    return {
      resolvedVersion: resolved,
      status: 'warning',
      message: `Предупреждение: версии отличаются (${host.version} vs ${remote.version}), но совместимы по semver`,
      details: [
        `host.version = ${host.version} (${host.requiredVersion})`,
        `remote.version = ${remote.version} (${remote.requiredVersion})`,
        `Выбрана более новая: react@${resolved}`,
        'В консоли может появиться предупреждение о несовпадении версий',
        'Поведение обычно корректно, но не гарантировано для всех patch-изменений',
      ],
      willDuplicate: false,
      willError: false,
    }
  }

  return {
    resolvedVersion: '—',
    status: 'error',
    message: `Конфликт версий: ${host.version} и ${remote.version} несовместимы`,
    details: [
      `host.requiredVersion = "${host.requiredVersion}"`,
      `remote.requiredVersion = "${remote.requiredVersion}"`,
      `react@${host.version} не попадает в ${remote.requiredVersion}`,
      `react@${remote.version} не попадает в ${host.requiredVersion}`,
      'Module Federation может загрузить дублирующую копию или выбросить ошибку',
    ],
    willDuplicate: true,
    willError: false,
  }
}

const STATUS_COLORS = {
  ok: { bg: '#e8f5e9', border: '#4caf50', text: '#1b5e20', badge: '#4caf50' },
  warning: { bg: '#fff8e1', border: '#ff9800', text: '#e65100', badge: '#ff9800' },
  error: { bg: '#ffebee', border: '#f44336', text: '#b71c1c', badge: '#f44336' },
}

function SharedConfigPanel({
  label,
  config,
  onChange,
  color,
}: {
  label: string
  config: SharedConfig
  onChange: (c: SharedConfig) => void
  color: string
}) {
  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginBottom: 10,
  }
  const labelStyle: React.CSSProperties = { fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }
  const inputStyle: React.CSSProperties = {
    padding: '5px 8px',
    border: '1px solid #ddd',
    borderRadius: 4,
    fontSize: 13,
    fontFamily: 'monospace',
  }

  return (
    <div style={{
      flex: 1,
      background: '#fafafa',
      border: `2px solid ${color}`,
      borderRadius: 8,
      padding: '14px 16px',
    }}>
      <div style={{ fontWeight: 700, fontSize: 14, color, marginBottom: 12, letterSpacing: '0.02em' }}>{label}</div>
      <div style={fieldStyle}>
        <span style={labelStyle}>version</span>
        <input
          style={inputStyle}
          value={config.version}
          onChange={e => onChange({ ...config, version: e.target.value })}
          placeholder="18.2.0"
        />
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>requiredVersion</span>
        <input
          style={inputStyle}
          value={config.requiredVersion}
          onChange={e => onChange({ ...config, requiredVersion: e.target.value })}
          placeholder="^18.0.0"
        />
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={config.singleton}
            onChange={e => onChange({ ...config, singleton: e.target.checked })}
          />
          singleton
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={config.strictVersion}
            onChange={e => onChange({ ...config, strictVersion: e.target.checked })}
          />
          strictVersion
        </label>
      </div>
    </div>
  )
}

export function Task3_1_Solution() {
  const [host, setHost] = useState<SharedConfig>({
    version: '18.2.0',
    singleton: true,
    strictVersion: false,
    requiredVersion: '^18.0.0',
  })
  const [remote, setRemote] = useState<SharedConfig>({
    version: '18.2.0',
    singleton: true,
    strictVersion: false,
    requiredVersion: '^18.0.0',
  })
  const [result, setResult] = useState<ResolutionResult | null>(null)
  const [activePreset, setActivePreset] = useState<Preset | null>('compatible')

  function applyPreset(key: Preset) {
    const p = PRESETS[key]
    setHost(p.host)
    setRemote(p.remote)
    setResult(null)
    setActivePreset(key)
  }

  function checkCompatibility() {
    setResult(resolveVersions(host, remote))
  }

  const colors = result ? STATUS_COLORS[result.status] : null

  return (
    <div className="exercise-container" style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 780 }}>
      <h3 style={{ marginTop: 0, fontSize: 18, color: '#1a1a2e' }}>
        Симулятор версионных конфликтов shared
      </h3>

      {/* Presets */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8, fontWeight: 600 }}>ПРЕСЕТЫ СЦЕНАРИЕВ</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(Object.entries(PRESETS) as [Preset, typeof PRESETS[Preset]][]).map(([key, p]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: `1px solid ${activePreset === key ? '#1976d2' : '#ddd'}`,
                background: activePreset === key ? '#e3f2fd' : '#fff',
                color: activePreset === key ? '#1976d2' : '#444',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: activePreset === key ? 600 : 400,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        {activePreset && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#666', fontStyle: 'italic' }}>
            {PRESETS[activePreset].description}
          </div>
        )}
      </div>

      {/* Config panels */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <SharedConfigPanel label="Host конфиг" config={host} onChange={c => { setHost(c); setActivePreset(null); setResult(null) }} color="#1565c0" />
        <SharedConfigPanel label="Remote конфиг" config={remote} onChange={c => { setRemote(c); setActivePreset(null); setResult(null) }} color="#7b1fa2" />
      </div>

      <button
        onClick={checkCompatibility}
        style={{
          padding: '9px 22px',
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        Проверить совместимость
      </button>

      {/* Result */}
      {result && colors && (
        <div style={{
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          borderRadius: 8,
          padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{
              background: colors.badge,
              color: '#fff',
              padding: '3px 10px',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
            }}>
              {result.status === 'ok' ? 'OK' : result.status === 'warning' ? 'WARNING' : 'ERROR'}
            </span>
            <span style={{ fontWeight: 600, fontSize: 14, color: colors.text }}>{result.message}</span>
          </div>

          {/* Dependency tree */}
          <div style={{
            background: '#1a1a2e',
            borderRadius: 6,
            padding: '10px 14px',
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#e0e0e0',
            marginBottom: 12,
          }}>
            <div style={{ color: '#90caf9', marginBottom: 4 }}>// Дерево зависимостей</div>
            <div>
              <span style={{ color: '#80cbc4' }}>host</span>
              <span style={{ color: '#fff' }}> → </span>
              <span style={{ color: result.willError ? '#ef9a9a' : result.willDuplicate ? '#ffcc80' : '#a5d6a7' }}>
                react@{host.version}
              </span>
            </div>
            <div>
              <span style={{ color: '#ce93d8' }}>remote</span>
              <span style={{ color: '#fff' }}> → </span>
              <span style={{ color: result.willError ? '#ef9a9a' : result.willDuplicate ? '#ffcc80' : '#a5d6a7' }}>
                react@{remote.version}
              </span>
            </div>
            <div>
              <span style={{ color: '#fff3e0' }}>resolved</span>
              <span style={{ color: '#fff' }}> → </span>
              <span style={{ color: result.willError ? '#ef9a9a' : result.willDuplicate ? '#ffcc80' : '#a5d6a7', fontWeight: 700 }}>
                {result.willError ? 'ERROR' : result.willDuplicate ? `[${host.version}] + [${remote.version}]` : `react@${result.resolvedVersion}`}
              </span>
            </div>
          </div>

          {/* Status indicators */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <div style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: result.willError ? '#ffebee' : '#e8f5e9',
              border: `1px solid ${result.willError ? '#f44336' : '#4caf50'}`,
              fontSize: 12,
              fontWeight: 600,
              color: result.willError ? '#c62828' : '#2e7d32',
            }}>
              {result.willError ? 'Ошибка загрузки' : 'Загрузка OK'}
            </div>
            <div style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: result.willDuplicate ? '#fff3e0' : '#e8f5e9',
              border: `1px solid ${result.willDuplicate ? '#ff9800' : '#4caf50'}`,
              fontSize: 12,
              fontWeight: 600,
              color: result.willDuplicate ? '#e65100' : '#2e7d32',
            }}>
              {result.willDuplicate ? 'Дублирование!' : 'Один экземпляр'}
            </div>
          </div>

          {/* Details list */}
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {result.details.map((d, i) => (
              <li key={i} style={{ fontSize: 13, color: colors.text, marginBottom: 2 }}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// =====================================================
// Task 3.2: Dynamic Remote Registry Builder
// =====================================================

interface RemoteEntry {
  id: string
  name: string
  primaryUrl: string
  fallbackUrl: string
  healthEndpoint: string
  timeout: number
  priority: number
}

interface ValidationErrors {
  [fieldKey: string]: string
}

function generateCode(remotes: RemoteEntry[]): string {
  if (remotes.length === 0) return '// Добавьте хотя бы один remote'

  const registryEntries = remotes
    .map(r => {
      const lines = [
        `    ${r.name}: {`,
        `      primaryUrl: '${r.primaryUrl}',`,
        r.fallbackUrl ? `      fallbackUrl: '${r.fallbackUrl}',` : null,
        r.healthEndpoint ? `      healthEndpoint: '${r.healthEndpoint}',` : null,
        `      timeout: ${r.timeout},`,
        `      priority: ${r.priority},`,
        `    },`,
      ].filter(Boolean)
      return lines.join('\n')
    })
    .join('\n')

  return `// Auto-generated dynamic remote registry
// ${new Date().toISOString().split('T')[0]}

export interface RemoteConfig {
  primaryUrl: string
  fallbackUrl?: string
  healthEndpoint?: string
  timeout: number
  priority: number
}

export const remoteRegistry: Record<string, RemoteConfig> = {
${registryEntries}
}

async function checkHealth(endpoint: string, timeout: number): Promise<boolean> {
  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    const res = await fetch(endpoint, { signal: controller.signal })
    clearTimeout(id)
    return res.ok
  } catch {
    return false
  }
}

export async function loadRemote(name: string): Promise<void> {
  const config = remoteRegistry[name]
  if (!config) throw new Error(\`Remote "\${name}" not found in registry\`)

  const urls = [config.primaryUrl, config.fallbackUrl].filter(Boolean) as string[]

  for (const url of urls) {
    try {
      if (config.healthEndpoint) {
        const healthy = await checkHealth(config.healthEndpoint, config.timeout)
        if (!healthy) {
          console.warn(\`[\${name}] health-check failed for \${url}, trying next...\`)
          continue
        }
      }

      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = url
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(\`Failed to load \${url}\`))
        const timer = setTimeout(
          () => reject(new Error(\`Timeout loading \${url}\`)),
          config.timeout
        )
        script.onload = () => { clearTimeout(timer); resolve() }
        document.head.appendChild(script)
      })
      console.log(\`[\${name}] loaded from \${url}\`)
      return
    } catch (err) {
      console.warn(\`[\${name}] failed to load from \${url}:\`, err)
    }
  }

  throw new Error(\`[\${name}] all URLs failed\`)
}`
}

function validateRemote(r: RemoteEntry, allNames: string[]): ValidationErrors {
  const errors: ValidationErrors = {}
  const urlPattern = /^https?:\/\/.+/

  if (!r.name.trim()) {
    errors.name = 'Имя обязательно'
  } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(r.name)) {
    errors.name = 'Только буквы, цифры, _ (начать с буквы)'
  } else if (allNames.filter(n => n === r.name).length > 1) {
    errors.name = 'Имя должно быть уникальным'
  }

  if (!r.primaryUrl.trim()) {
    errors.primaryUrl = 'Primary URL обязателен'
  } else if (!urlPattern.test(r.primaryUrl)) {
    errors.primaryUrl = 'Должен начинаться с http:// или https://'
  }

  if (r.fallbackUrl && !urlPattern.test(r.fallbackUrl)) {
    errors.fallbackUrl = 'Должен начинаться с http:// или https://'
  }

  if (r.timeout < 1000 || r.timeout > 30000) {
    errors.timeout = 'Timeout: от 1000 до 30000 мс'
  }

  if (r.priority < 1 || r.priority > 10) {
    errors.priority = 'Priority: от 1 до 10'
  }

  return errors
}

function newRemote(): RemoteEntry {
  return {
    id: Math.random().toString(36).slice(2),
    name: '',
    primaryUrl: '',
    fallbackUrl: '',
    healthEndpoint: '',
    timeout: 5000,
    priority: 5,
  }
}

export function Task3_2_Solution() {
  const [remotes, setRemotes] = useState<RemoteEntry[]>([
    {
      id: 'r1',
      name: 'catalogApp',
      primaryUrl: 'https://catalog.example.com/remoteEntry.js',
      fallbackUrl: 'https://catalog-cdn.example.com/remoteEntry.js',
      healthEndpoint: 'https://catalog.example.com/health',
      timeout: 5000,
      priority: 1,
    },
    {
      id: 'r2',
      name: 'cartApp',
      primaryUrl: 'https://cart.example.com/remoteEntry.js',
      fallbackUrl: '',
      healthEndpoint: '',
      timeout: 3000,
      priority: 2,
    },
  ])
  const [showCode, setShowCode] = useState(true)

  const allNames = remotes.map(r => r.name)
  const allErrors: Record<string, ValidationErrors> = {}
  remotes.forEach(r => {
    const e = validateRemote(r, allNames)
    if (Object.keys(e).length > 0) allErrors[r.id] = e
  })
  const isValid = Object.keys(allErrors).length === 0

  function updateRemote(id: string, patch: Partial<RemoteEntry>) {
    setRemotes(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r))
  }

  function addRemote() {
    setRemotes(rs => [...rs, newRemote()])
  }

  function removeRemote(id: string) {
    setRemotes(rs => rs.filter(r => r.id !== id))
  }

  const cellStyle: React.CSSProperties = {
    padding: '4px 6px',
    verticalAlign: 'middle',
  }

  const inputStyle = (error?: string): React.CSSProperties => ({
    padding: '5px 8px',
    border: `1px solid ${error ? '#f44336' : '#ddd'}`,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: 'monospace',
    width: '100%',
    boxSizing: 'border-box',
  })

  return (
    <div className="exercise-container" style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900 }}>
      <h3 style={{ marginTop: 0, fontSize: 18, color: '#1a1a2e' }}>
        Конструктор динамического реестра remote
      </h3>

      {/* Table */}
      <div style={{ overflowX: 'auto', marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
              {['Имя', 'Primary URL', 'Fallback URL', 'Health endpoint', 'Timeout (мс)', 'Priority', ''].map(h => (
                <th key={h} style={{ ...cellStyle, textAlign: 'left', fontWeight: 600, fontSize: 11, color: '#555', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {remotes.map((r) => {
              const errs = allErrors[r.id] || {}
              return (
                <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={cellStyle}>
                    <input
                      style={inputStyle(errs.name)}
                      value={r.name}
                      onChange={e => updateRemote(r.id, { name: e.target.value })}
                      placeholder="catalogApp"
                    />
                    {errs.name && <div style={{ color: '#f44336', fontSize: 10, marginTop: 2 }}>{errs.name}</div>}
                  </td>
                  <td style={cellStyle}>
                    <input
                      style={inputStyle(errs.primaryUrl)}
                      value={r.primaryUrl}
                      onChange={e => updateRemote(r.id, { primaryUrl: e.target.value })}
                      placeholder="https://..."
                    />
                    {errs.primaryUrl && <div style={{ color: '#f44336', fontSize: 10, marginTop: 2 }}>{errs.primaryUrl}</div>}
                  </td>
                  <td style={cellStyle}>
                    <input
                      style={inputStyle(errs.fallbackUrl)}
                      value={r.fallbackUrl}
                      onChange={e => updateRemote(r.id, { fallbackUrl: e.target.value })}
                      placeholder="https://... (опц.)"
                    />
                    {errs.fallbackUrl && <div style={{ color: '#f44336', fontSize: 10, marginTop: 2 }}>{errs.fallbackUrl}</div>}
                  </td>
                  <td style={cellStyle}>
                    <input
                      style={inputStyle()}
                      value={r.healthEndpoint}
                      onChange={e => updateRemote(r.id, { healthEndpoint: e.target.value })}
                      placeholder="/health (опц.)"
                    />
                  </td>
                  <td style={cellStyle}>
                    <input
                      type="number"
                      style={{ ...inputStyle(errs.timeout), width: 90 }}
                      value={r.timeout}
                      min={1000}
                      max={30000}
                      onChange={e => updateRemote(r.id, { timeout: Number(e.target.value) })}
                    />
                    {errs.timeout && <div style={{ color: '#f44336', fontSize: 10, marginTop: 2 }}>{errs.timeout}</div>}
                  </td>
                  <td style={cellStyle}>
                    <input
                      type="number"
                      style={{ ...inputStyle(errs.priority), width: 60 }}
                      value={r.priority}
                      min={1}
                      max={10}
                      onChange={e => updateRemote(r.id, { priority: Number(e.target.value) })}
                    />
                    {errs.priority && <div style={{ color: '#f44336', fontSize: 10, marginTop: 2 }}>{errs.priority}</div>}
                  </td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => removeRemote(r.id)}
                      style={{
                        padding: '4px 10px',
                        background: '#ffebee',
                        color: '#c62828',
                        border: '1px solid #ef9a9a',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                    >
                      удалить
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
        <button
          onClick={addRemote}
          style={{
            padding: '7px 16px',
            background: '#e8f5e9',
            color: '#2e7d32',
            border: '1px solid #a5d6a7',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          + Добавить remote
        </button>
        <button
          onClick={() => setShowCode(v => !v)}
          style={{
            padding: '7px 16px',
            background: '#e3f2fd',
            color: '#1565c0',
            border: '1px solid #90caf9',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {showCode ? 'Скрыть код' : 'Показать код'}
        </button>
        {!isValid && (
          <span style={{ fontSize: 12, color: '#f44336', fontWeight: 600 }}>
            Исправьте ошибки перед генерацией кода
          </span>
        )}
        {isValid && remotes.length > 0 && (
          <span style={{ fontSize: 12, color: '#2e7d32', fontWeight: 600 }}>
            {remotes.length} remote{remotes.length > 1 ? '' : ''} — код готов
          </span>
        )}
      </div>

      {/* Code preview */}
      {showCode && (
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6, fontWeight: 600 }}>
            СГЕНЕРИРОВАННЫЙ КОД — dynamic-remote-loader.ts
          </div>
          <div style={{
            background: '#1a1a2e',
            borderRadius: 8,
            padding: '14px 16px',
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#e0e0e0',
            overflowX: 'auto',
            lineHeight: 1.6,
            maxHeight: 420,
            overflowY: 'auto',
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', opacity: isValid ? 1 : 0.5 }}>
              {generateCode(remotes)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
