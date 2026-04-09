import { useState, useEffect, useRef } from 'react'

// ============================================
// Task 2.1: Remote Load Lifecycle Visualizer
// ============================================

interface LoadStep {
  id: string
  label: string
  description: string
  duration: number // ms (simulated)
  files: NetworkFile[]
  color: string
}

interface NetworkFile {
  name: string
  size: string
  type: 'entry' | 'manifest' | 'chunk' | 'shared' | 'render'
  barWidth: number // % of max
  color: string
}

const LOAD_STEPS: LoadStep[] = [
  {
    id: 'fetch-entry',
    label: 'remoteEntry.js',
    description: 'Host запрашивает точку входа remote-приложения — небольшой файл-манифест с метаданными о доступных модулях',
    duration: 120,
    files: [
      { name: 'remoteEntry.js', size: '2.4 KB', type: 'entry', barWidth: 15, color: '#1976d2' },
    ],
    color: '#1976d2',
  },
  {
    id: 'parse-manifest',
    label: 'Манифест',
    description: 'Webpack/Vite парсит remoteEntry и строит граф зависимостей: какие чанки экспортирует remote, какие shared-библиотеки он ожидает',
    duration: 30,
    files: [
      { name: 'remoteEntry.js (parse)', size: '—', type: 'manifest', barWidth: 8, color: '#7b1fa2' },
    ],
    color: '#7b1fa2',
  },
  {
    id: 'fetch-chunks',
    label: 'Чанки',
    description: 'Загружаются JS-чанки самого remote: компоненты, утилиты, роутер. Параллельно, если нет жёстких зависимостей',
    duration: 280,
    files: [
      { name: 'catalog.chunk.js', size: '48 KB', type: 'chunk', barWidth: 70, color: '#388e3c' },
      { name: 'catalog-ui.chunk.js', size: '32 KB', type: 'chunk', barWidth: 50, color: '#388e3c' },
      { name: 'catalog-utils.chunk.js', size: '12 KB', type: 'chunk', barWidth: 22, color: '#388e3c' },
    ],
    color: '#388e3c',
  },
  {
    id: 'shared-resolution',
    label: 'Shared resolution',
    description: 'Module Federation проверяет: есть ли уже загруженная совместимая версия React/ReactDOM? Если да — переиспользует (singleton). Если нет — загружает новую копию',
    duration: 60,
    files: [
      { name: 'react (shared, reuse)', size: '0 KB', type: 'shared', barWidth: 3, color: '#f57c00' },
      { name: 'react-dom (shared, reuse)', size: '0 KB', type: 'shared', barWidth: 3, color: '#f57c00' },
    ],
    color: '#f57c00',
  },
  {
    id: 'render',
    label: 'Рендеринг',
    description: 'Remote-компонент смонтирован в DOM. Shared-контексты (React Context, Router) доступны через singleton. Пользователь видит MFE',
    duration: 45,
    files: [
      { name: 'CatalogApp.render()', size: '—', type: 'render', barWidth: 100, color: '#d32f2f' },
    ],
    color: '#d32f2f',
  },
]

type StepStatus = 'pending' | 'loading' | 'done'

export function Task2_1_Solution() {
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    LOAD_STEPS.map(() => 'pending')
  )
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [running, setRunning] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function reset() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStepStatuses(LOAD_STEPS.map(() => 'pending'))
    setCurrentStep(-1)
    setRunning(false)
    setTotalTime(0)
  }

  function start() {
    if (running) return
    reset()
    setRunning(true)
    runStep(0, 0)
  }

  function runStep(index: number, elapsed: number) {
    if (index >= LOAD_STEPS.length) {
      setRunning(false)
      setCurrentStep(-1)
      return
    }
    const step = LOAD_STEPS[index]
    setCurrentStep(index)
    setStepStatuses(prev => prev.map((s, i) => (i === index ? 'loading' : s)))

    timerRef.current = setTimeout(() => {
      const newElapsed = elapsed + step.duration
      setTotalTime(newElapsed)
      setStepStatuses(prev => prev.map((s, i) => (i === index ? 'done' : s)))
      runStep(index + 1, newElapsed)
    }, step.duration * 4) // scale up for visual effect
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const allDone = stepStatuses.every(s => s === 'done')
  const doneCount = stepStatuses.filter(s => s === 'done').length

  const containerStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    padding: '1.5rem',
    maxWidth: '780px',
  }

  const timelineTrackStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ margin: '0 0 0.25rem' }}>Lifecycle загрузки remote-модуля</h2>
      <p style={{ color: '#666', margin: '0 0 1.25rem', fontSize: '0.9rem' }}>
        Пошаговая анимация: от запроса remoteEntry.js до рендеринга компонента
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <button
          onClick={start}
          disabled={running}
          style={{
            padding: '8px 20px',
            borderRadius: '6px',
            border: 'none',
            background: running ? '#ccc' : '#1976d2',
            color: '#fff',
            cursor: running ? 'default' : 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {running ? 'Загрузка...' : 'Загрузить remote'}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: '#fff',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Сбросить
        </button>
        {allDone && (
          <div style={{ display: 'flex', alignItems: 'center', color: '#2e7d32', fontWeight: 600, fontSize: '0.88rem' }}>
            Готово за {totalTime} мс (симуляция)
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#888', marginBottom: '4px' }}>
          <span>Прогресс</span>
          <span>{doneCount} / {LOAD_STEPS.length} шагов</span>
        </div>
        <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(doneCount / LOAD_STEPS.length) * 100}%`,
            background: '#1976d2',
            borderRadius: '3px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Steps timeline */}
      <div style={{ marginBottom: '1.5rem' }}>
        {LOAD_STEPS.map((step, i) => {
          const status = stepStatuses[i]
          const isActive = currentStep === i
          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '6px',
                background: isActive ? step.color + '18' : status === 'done' ? '#f5f5f5' : '#fafafa',
                border: `1.5px solid ${isActive ? step.color : status === 'done' ? '#e0e0e0' : '#ebebeb'}`,
                transition: 'all 0.3s ease',
              }}
            >
              {/* Status icon */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0,
                background: status === 'done' ? '#4caf50' : isActive ? step.color : '#e0e0e0',
                color: status === 'done' || isActive ? '#fff' : '#999',
                transition: 'background 0.3s',
              }}>
                {status === 'done' ? '✓' : isActive ? '⟳' : i + 1}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: step.color }}>{step.label}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: status === 'done' ? '#e8f5e9' : isActive ? step.color + '22' : '#f0f0f0',
                    color: status === 'done' ? '#2e7d32' : isActive ? step.color : '#999',
                    fontWeight: 600,
                  }}>
                    {status === 'done' ? `${step.duration} мс` : status === 'loading' ? 'загрузка...' : 'ожидание'}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.4 }}>{step.description}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Network waterfall */}
      <div>
        <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.75rem', color: '#444' }}>Network Waterfall</h3>
        <div style={{ background: '#1e1e2e', borderRadius: '8px', padding: '14px 16px' }}>
          {/* Header */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '0.72rem', color: '#888', fontFamily: 'monospace' }}>
            <span style={{ width: '180px' }}>Файл</span>
            <span style={{ width: '50px', textAlign: 'right' }}>Размер</span>
            <span style={{ flex: 1 }}>Waterfall (симуляция)</span>
          </div>

          {LOAD_STEPS.flatMap((step, stepIdx) =>
            step.files.map((file, fileIdx) => {
              const stepStatus = stepStatuses[stepIdx]
              const visible = stepStatus === 'loading' || stepStatus === 'done'
              // Compute cumulative offset for waterfall positioning
              const prevDuration = LOAD_STEPS.slice(0, stepIdx).reduce((acc, s) => acc + s.duration, 0)
              const totalDur = LOAD_STEPS.reduce((acc, s) => acc + s.duration, 0)
              const leftPct = (prevDuration / totalDur) * 100

              return (
                <div
                  key={`${step.id}-${fileIdx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '5px',
                    opacity: visible ? 1 : 0.25,
                    transition: 'opacity 0.4s ease',
                  }}
                >
                  <span style={{ width: '180px', fontSize: '0.72rem', color: '#cdd6f4', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                  <span style={{ width: '50px', textAlign: 'right', fontSize: '0.72rem', color: '#a6e3a1', fontFamily: 'monospace' }}>{file.size}</span>
                  <div style={{ flex: 1, height: '14px', background: '#313244', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                    {visible && (
                      <div style={{
                        position: 'absolute',
                        left: `${leftPct}%`,
                        width: `${file.barWidth * (1 - leftPct / 100)}%`,
                        height: '100%',
                        background: file.color,
                        borderRadius: '3px',
                        animation: 'growBar 0.4s ease',
                      }} />
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Legend */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
            {[
              { color: '#1976d2', label: 'Entry' },
              { color: '#7b1fa2', label: 'Manifest' },
              { color: '#388e3c', label: 'Chunks' },
              { color: '#f57c00', label: 'Shared' },
              { color: '#d32f2f', label: 'Render' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#888' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary when done */}
      {allDone && (
        <div style={{ marginTop: '1.25rem', background: '#e8f5e9', border: '1px solid #81c784', borderRadius: '8px', padding: '12px 16px', fontSize: '0.85rem', color: '#2e7d32', lineHeight: 1.6 }}>
          <strong>Итого:</strong> Remote-модуль загружен за ~{totalTime} мс (симуляция).
          Без shared React/ReactDOM было бы +~180 KB и ещё ~150 мс к загрузке.
          Singleton гарантирует единый React-контекст между host и remote.
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 2.2: Host Config Constructor
// ============================================

interface RemoteEntry {
  id: string
  name: string
  url: string
}

interface SharedLib {
  name: string
  singleton: boolean
  requiredVersion: string
  preset: boolean
}

const PRESET_SHARED: SharedLib[] = [
  { name: 'react', singleton: true, requiredVersion: '^18.0.0', preset: true },
  { name: 'react-dom', singleton: true, requiredVersion: '^18.0.0', preset: true },
  { name: 'react-router-dom', singleton: false, requiredVersion: '^6.0.0', preset: true },
  { name: 'zustand', singleton: false, requiredVersion: '^4.0.0', preset: true },
]

function generateHostConfig(name: string, remotes: RemoteEntry[], shared: SharedLib[]): string {
  if (!name && remotes.length === 0 && shared.length === 0) {
    return '// Заполните форму для генерации конфига'
  }

  const remotesStr = remotes.map(r =>
    `      ${r.name || 'remote'}: '${r.name || 'remote'}@${r.url || 'http://localhost:3001/remoteEntry.js'}',`
  ).join('\n')

  const sharedStr = shared.map(s => {
    const lines = [`        singleton: ${s.singleton},`]
    if (s.requiredVersion) lines.push(`        requiredVersion: '${s.requiredVersion}',`)
    return `      '${s.name}': {\n${lines.join('\n')}\n      },`
  }).join('\n')

  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: '${name || 'host'}',
      remotes: {
${remotesStr || '        // добавьте хотя бы один remote'}
      },
      shared: {
${sharedStr || '        // выберите shared-библиотеки'}
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
})`
}

function validateHostConfig(name: string, remotes: RemoteEntry[]): string[] {
  const errors: string[] = []
  if (!name.trim()) errors.push('Поле name обязательно')
  if (remotes.length === 0) errors.push('Добавьте хотя бы один remote')
  remotes.forEach((r, i) => {
    if (!r.name.trim()) errors.push(`Remote #${i + 1}: имя не заполнено`)
    if (!r.url.trim()) {
      errors.push(`Remote #${i + 1}: URL не заполнен`)
    } else if (!r.url.includes('remoteEntry')) {
      errors.push(`Remote #${i + 1}: URL должен указывать на remoteEntry.js`)
    }
  })
  return errors
}

export function Task2_2_Solution() {
  const [name, setName] = useState('host-app')
  const [remotes, setRemotes] = useState<RemoteEntry[]>([
    { id: '1', name: 'catalogApp', url: 'http://localhost:3001/remoteEntry.js' },
  ])
  const [shared, setShared] = useState<SharedLib[]>(PRESET_SHARED.map(s => ({ ...s })))
  const [customLib, setCustomLib] = useState('')

  function addRemote() {
    const id = Date.now().toString()
    setRemotes(prev => [...prev, { id, name: '', url: '' }])
  }

  function removeRemote(id: string) {
    setRemotes(prev => prev.filter(r => r.id !== id))
  }

  function updateRemote(id: string, field: 'name' | 'url', value: string) {
    setRemotes(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  function toggleShared(libName: string) {
    setShared(prev => prev.map(s =>
      s.name === libName ? { ...s, singleton: !s.singleton } : s
    ))
  }

  function updateVersion(libName: string, value: string) {
    setShared(prev => prev.map(s =>
      s.name === libName ? { ...s, requiredVersion: value } : s
    ))
  }

  function removeShared(libName: string) {
    setShared(prev => prev.filter(s => s.name !== libName))
  }

  function addCustomShared() {
    const trimmed = customLib.trim()
    if (!trimmed || shared.some(s => s.name === trimmed)) return
    setShared(prev => [...prev, { name: trimmed, singleton: false, requiredVersion: '', preset: false }])
    setCustomLib('')
  }

  const errors = validateHostConfig(name, remotes)
  const config = generateHostConfig(name, remotes, shared)

  const containerStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    padding: '1.5rem',
    maxWidth: '900px',
  }

  const inputStyle: React.CSSProperties = {
    padding: '7px 10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '0.85rem',
    width: '100%',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.82rem',
    color: '#555',
    marginBottom: '4px',
    display: 'block',
    fontWeight: 600,
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ margin: '0 0 0.25rem' }}>Конструктор конфига Host</h2>
      <p style={{ color: '#666', margin: '0 0 1.25rem', fontSize: '0.9rem' }}>
        Настройте host-приложение и получите готовый vite.config.ts с Module Federation
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Form */}
        <div>
          {/* Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>name — имя host-приложения</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ ...inputStyle, borderColor: !name.trim() ? '#ef5350' : '#ccc' }}
              placeholder="host-app"
            />
          </div>

          {/* Remotes */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ ...labelStyle, marginBottom: 0 }}>remotes — подключаемые приложения</span>
              <button
                onClick={addRemote}
                style={{ padding: '4px 12px', borderRadius: '4px', border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer', fontSize: '0.78rem' }}
              >
                + Remote
              </button>
            </div>
            {remotes.map((r, i) => (
              <div key={r.id} style={{ background: '#f8f9fa', borderRadius: '6px', padding: '10px', marginBottom: '8px', border: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#555' }}>Remote #{i + 1}</span>
                  <button onClick={() => removeRemote(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef5350', fontSize: '0.8rem' }}>✕</button>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <label style={{ ...labelStyle, fontWeight: 400 }}>Имя (в коде: import('remoteName/Component'))</label>
                  <input value={r.name} onChange={e => updateRemote(r.id, 'name', e.target.value)} style={inputStyle} placeholder="catalogApp" />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontWeight: 400 }}>URL remoteEntry.js</label>
                  <input value={r.url} onChange={e => updateRemote(r.id, 'url', e.target.value)} style={{ ...inputStyle, borderColor: r.url && !r.url.includes('remoteEntry') ? '#ef5350' : '#ccc' }} placeholder="http://localhost:3001/remoteEntry.js" />
                </div>
              </div>
            ))}
            {remotes.length === 0 && (
              <div style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>Нет remotes — нажмите "+ Remote"</div>
            )}
          </div>

          {/* Shared */}
          <div>
            <label style={labelStyle}>shared — совместно используемые библиотеки</label>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '8px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ textAlign: 'left', padding: '5px 8px' }}>Пакет</th>
                  <th style={{ textAlign: 'center', padding: '5px 8px' }}>singleton</th>
                  <th style={{ textAlign: 'left', padding: '5px 8px' }}>version</th>
                  <th style={{ padding: '5px 8px' }}></th>
                </tr>
              </thead>
              <tbody>
                {shared.map(s => (
                  <tr key={s.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '5px 8px', fontFamily: 'monospace', color: '#333' }}>
                      {s.name}
                      {(s.name === 'react' || s.name === 'react-dom') && !s.singleton && (
                        <span style={{ color: '#ef5350', marginLeft: '4px', fontSize: '0.72rem' }}>⚠ нужен singleton</span>
                      )}
                    </td>
                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                      <input type="checkbox" checked={s.singleton} onChange={() => toggleShared(s.name)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ padding: '5px 8px' }}>
                      <input value={s.requiredVersion} onChange={e => updateVersion(s.name, e.target.value)} style={{ ...inputStyle, width: '90px', padding: '3px 6px' }} />
                    </td>
                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                      {!s.preset && (
                        <button onClick={() => removeShared(s.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef5350' }}>✕</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input value={customLib} onChange={e => setCustomLib(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomShared()} style={{ ...inputStyle, flex: 1 }} placeholder="добавить пакет (напр. axios)" />
              <button onClick={addCustomShared} style={{ padding: '7px 12px', borderRadius: '5px', border: 'none', background: '#555', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>+ Добавить</button>
            </div>
          </div>

          {/* Validation */}
          {errors.length > 0 && (
            <div style={{ marginTop: '1rem', background: '#ffebee', border: '1px solid #ef9a9a', borderRadius: '6px', padding: '8px 12px' }}>
              {errors.map((e, i) => (
                <div key={i} style={{ fontSize: '0.8rem', color: '#c62828' }}>✕ {e}</div>
              ))}
            </div>
          )}
          {errors.length === 0 && name.trim() && (
            <div style={{ marginTop: '1rem', background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '6px', padding: '8px 12px', fontSize: '0.8rem', color: '#2e7d32' }}>
              Конфигурация валидна
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          <label style={{ ...labelStyle, marginBottom: '8px' }}>Сгенерированный vite.config.ts</label>
          <pre style={{
            background: '#1e1e2e',
            color: '#cdd6f4',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '0.75rem',
            lineHeight: '1.6',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            minHeight: '400px',
            margin: 0,
            fontFamily: 'monospace',
          }}>
            {config}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 2.3: Remote Config Constructor
// ============================================

interface ExposeEntry {
  id: string
  key: string   // e.g. "./Button"
  path: string  // e.g. "./src/components/Button.tsx"
}

function generateRemoteConfig(name: string, filename: string, exposes: ExposeEntry[], shared: SharedLib[]): string {
  if (!name && exposes.length === 0) return '// Заполните форму для генерации конфига'

  const exposesStr = exposes.map(e =>
    `      '${e.key || './Component'}': '${e.path || './src/Component.tsx'}',`
  ).join('\n')

  const sharedStr = shared.map(s => {
    const lines = [`        singleton: ${s.singleton},`]
    if (s.requiredVersion) lines.push(`        requiredVersion: '${s.requiredVersion}',`)
    return `      '${s.name}': {\n${lines.join('\n')}\n      },`
  }).join('\n')

  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: '${name || 'remote-app'}',
      filename: '${filename || 'remoteEntry.js'}',
      exposes: {
${exposesStr || '        // добавьте хотя бы один expose'}
      },
      shared: {
${sharedStr || '        // выберите shared-библиотеки'}
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  preview: {
    port: 3001,
    strictPort: true,
  },
})`
}

interface ValidationWarning {
  type: 'error' | 'warning'
  message: string
}

function validateRemoteConfig(name: string, filename: string, exposes: ExposeEntry[], shared: SharedLib[]): ValidationWarning[] {
  const issues: ValidationWarning[] = []
  if (!name.trim()) issues.push({ type: 'error', message: 'Поле name обязательно' })
  if (!filename.trim()) issues.push({ type: 'error', message: 'Поле filename обязательно' })
  if (exposes.length === 0) issues.push({ type: 'error', message: 'Добавьте хотя бы один expose' })

  exposes.forEach((e, i) => {
    if (!e.key.startsWith('./')) {
      issues.push({ type: 'error', message: `Expose #${i + 1}: ключ должен начинаться с "./"` })
    }
    if (!e.path.trim()) {
      issues.push({ type: 'error', message: `Expose #${i + 1}: путь не заполнен` })
    }
  })

  const reactShared = shared.find(s => s.name === 'react')
  const reactDomShared = shared.find(s => s.name === 'react-dom')
  if (reactShared && !reactShared.singleton) {
    issues.push({ type: 'warning', message: 'react: рекомендуется singleton: true — иначе несколько копий React вызовут ошибки хуков' })
  }
  if (reactDomShared && !reactDomShared.singleton) {
    issues.push({ type: 'warning', message: 'react-dom: рекомендуется singleton: true — иначе несколько React roots' })
  }
  if (shared.length === 0) {
    issues.push({ type: 'warning', message: 'Нет shared: каждый MFE будет тянуть свои копии react, react-dom (~180 KB)' })
  }

  return issues
}

export function Task2_3_Solution() {
  const [name, setName] = useState('catalog-app')
  const [filename, setFilename] = useState('remoteEntry.js')
  const [exposes, setExposes] = useState<ExposeEntry[]>([
    { id: '1', key: './CatalogApp', path: './src/CatalogApp.tsx' },
    { id: '2', key: './ProductCard', path: './src/components/ProductCard.tsx' },
  ])
  const [shared, setShared] = useState<SharedLib[]>(PRESET_SHARED.map(s => ({ ...s })))
  const [customLib, setCustomLib] = useState('')

  function addExpose() {
    setExposes(prev => [...prev, { id: Date.now().toString(), key: './', path: './src/' }])
  }

  function removeExpose(id: string) {
    setExposes(prev => prev.filter(e => e.id !== id))
  }

  function updateExpose(id: string, field: 'key' | 'path', value: string) {
    setExposes(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  function toggleShared(libName: string) {
    setShared(prev => prev.map(s =>
      s.name === libName ? { ...s, singleton: !s.singleton } : s
    ))
  }

  function updateVersion(libName: string, value: string) {
    setShared(prev => prev.map(s =>
      s.name === libName ? { ...s, requiredVersion: value } : s
    ))
  }

  function removeShared(libName: string) {
    setShared(prev => prev.filter(s => s.name !== libName))
  }

  function addCustomShared() {
    const trimmed = customLib.trim()
    if (!trimmed || shared.some(s => s.name === trimmed)) return
    setShared(prev => [...prev, { name: trimmed, singleton: false, requiredVersion: '', preset: false }])
    setCustomLib('')
  }

  const issues = validateRemoteConfig(name, filename, exposes, shared)
  const errors = issues.filter(i => i.type === 'error')
  const warnings = issues.filter(i => i.type === 'warning')
  const config = generateRemoteConfig(name, filename, exposes, shared)

  const containerStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    padding: '1.5rem',
    maxWidth: '900px',
  }

  const inputStyle: React.CSSProperties = {
    padding: '7px 10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '0.85rem',
    width: '100%',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.82rem',
    color: '#555',
    marginBottom: '4px',
    display: 'block',
    fontWeight: 600,
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ margin: '0 0 0.25rem' }}>Конструктор конфига Remote</h2>
      <p style={{ color: '#666', margin: '0 0 1.25rem', fontSize: '0.9rem' }}>
        Настройте remote-приложение: что экспортировать и как разделять зависимости с host
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Form */}
        <div>
          {/* Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>name — идентификатор remote</label>
            <input value={name} onChange={e => setName(e.target.value)} style={{ ...inputStyle, borderColor: !name.trim() ? '#ef5350' : '#ccc' }} placeholder="catalog-app" />
            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '3px' }}>Используется в host как ключ в remotes: {'{ catalogApp: \'...\' }'}</div>
          </div>

          {/* Filename */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>filename — имя файла точки входа</label>
            <input value={filename} onChange={e => setFilename(e.target.value)} style={inputStyle} placeholder="remoteEntry.js" />
            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '3px' }}>По умолчанию: remoteEntry.js. Должен совпадать с URL в host</div>
          </div>

          {/* Exposes */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ ...labelStyle, marginBottom: 0 }}>exposes — экспортируемые модули</span>
              <button
                onClick={addExpose}
                style={{ padding: '4px 12px', borderRadius: '4px', border: 'none', background: '#388e3c', color: '#fff', cursor: 'pointer', fontSize: '0.78rem' }}
              >
                + Expose
              </button>
            </div>
            {exposes.map((e, i) => (
              <div key={e.id} style={{ background: '#f8f9fa', borderRadius: '6px', padding: '10px', marginBottom: '8px', border: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#555' }}>Expose #{i + 1}</span>
                  <button onClick={() => removeExpose(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef5350', fontSize: '0.8rem' }}>✕</button>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <label style={{ ...labelStyle, fontWeight: 400 }}>Ключ (начинается с './')</label>
                  <input
                    value={e.key}
                    onChange={ev => updateExpose(e.id, 'key', ev.target.value)}
                    style={{ ...inputStyle, borderColor: e.key && !e.key.startsWith('./') ? '#ef5350' : '#ccc' }}
                    placeholder="./Component"
                  />
                  {e.key && !e.key.startsWith('./') && (
                    <div style={{ fontSize: '0.72rem', color: '#ef5350', marginTop: '2px' }}>Ключ должен начинаться с "./"</div>
                  )}
                </div>
                <div>
                  <label style={{ ...labelStyle, fontWeight: 400 }}>Путь к файлу</label>
                  <input
                    value={e.path}
                    onChange={ev => updateExpose(e.id, 'path', ev.target.value)}
                    style={inputStyle}
                    placeholder="./src/components/Button.tsx"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Shared */}
          <div>
            <label style={labelStyle}>shared — совместные зависимости</label>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '8px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ textAlign: 'left', padding: '5px 8px' }}>Пакет</th>
                  <th style={{ textAlign: 'center', padding: '5px 8px' }}>singleton</th>
                  <th style={{ textAlign: 'left', padding: '5px 8px' }}>version</th>
                  <th style={{ padding: '5px 8px' }}></th>
                </tr>
              </thead>
              <tbody>
                {shared.map(s => (
                  <tr key={s.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '5px 8px', fontFamily: 'monospace', color: '#333' }}>{s.name}</td>
                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                      <input type="checkbox" checked={s.singleton} onChange={() => toggleShared(s.name)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ padding: '5px 8px' }}>
                      <input value={s.requiredVersion} onChange={e => updateVersion(s.name, e.target.value)} style={{ ...inputStyle, width: '90px', padding: '3px 6px' }} />
                    </td>
                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                      {!s.preset && (
                        <button onClick={() => removeShared(s.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef5350' }}>✕</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input value={customLib} onChange={e => setCustomLib(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomShared()} style={{ ...inputStyle, flex: 1 }} placeholder="добавить пакет" />
              <button onClick={addCustomShared} style={{ padding: '7px 12px', borderRadius: '5px', border: 'none', background: '#555', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>+ Добавить</button>
            </div>
          </div>

          {/* Validation */}
          {(errors.length > 0 || warnings.length > 0) && (
            <div style={{ marginTop: '1rem' }}>
              {errors.length > 0 && (
                <div style={{ background: '#ffebee', border: '1px solid #ef9a9a', borderRadius: '6px', padding: '8px 12px', marginBottom: '6px' }}>
                  {errors.map((e, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: '#c62828' }}>✕ {e.message}</div>
                  ))}
                </div>
              )}
              {warnings.length > 0 && (
                <div style={{ background: '#fff3e0', border: '1px solid #ffcc02', borderRadius: '6px', padding: '8px 12px' }}>
                  {warnings.map((w, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: '#e65100' }}>⚠ {w.message}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          {errors.length === 0 && warnings.length === 0 && name.trim() && (
            <div style={{ marginTop: '1rem', background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '6px', padding: '8px 12px', fontSize: '0.8rem', color: '#2e7d32' }}>
              Конфигурация валидна и оптимальна
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          <label style={{ ...labelStyle, marginBottom: '8px' }}>Сгенерированный vite.config.ts</label>
          <pre style={{
            background: '#1e1e2e',
            color: '#cdd6f4',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '0.75rem',
            lineHeight: '1.6',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            minHeight: '400px',
            margin: 0,
            fontFamily: 'monospace',
          }}>
            {config}
          </pre>

          {/* Diff hint: exposes map */}
          {exposes.length > 0 && (
            <div style={{ marginTop: '10px', background: '#e8f5e9', borderRadius: '6px', padding: '10px 12px', fontSize: '0.78rem', color: '#2e7d32' }}>
              <strong>Как использовать в host:</strong>
              <pre style={{ margin: '4px 0 0', background: 'none', fontSize: '0.75rem', color: '#1b5e20', fontFamily: 'monospace' }}>
                {exposes.map(e =>
                  `const ${e.key.replace('./', '')} = React.lazy(\n  () => import('${name}${e.key}')\n)`
                ).join('\n\n')}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
