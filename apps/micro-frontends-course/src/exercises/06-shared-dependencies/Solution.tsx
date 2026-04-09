import { useState, useCallback } from 'react'

// =====================================================
// Task 6.1: Dependency Graph Visualizer
// =====================================================

type Library = {
  name: string
  version: string
  sizeKb: number
  color: string
}

type MFE = {
  name: string
  color: string
  deps: string[]
}

const LIBRARIES: Library[] = [
  { name: 'react', version: '18.3.0', sizeKb: 45, color: '#61dafb' },
  { name: 'react-dom', version: '18.3.0', sizeKb: 130, color: '#61dafb' },
  { name: 'react-router', version: '6.22.0', sizeKb: 52, color: '#f44250' },
  { name: 'zustand', version: '4.5.0', sizeKb: 12, color: '#ff6b35' },
  { name: 'lodash', version: '4.17.21', sizeKb: 72, color: '#3492ff' },
  { name: 'axios', version: '1.6.7', sizeKb: 38, color: '#5a29e4' },
  { name: 'date-fns', version: '3.3.0', sizeKb: 88, color: '#770c56' },
]

const MFES: MFE[] = [
  { name: 'Shell', color: '#4caf50', deps: ['react', 'react-dom', 'react-router', 'zustand'] },
  { name: 'Catalog', color: '#2196f3', deps: ['react', 'react-dom', 'react-router', 'axios', 'date-fns'] },
  { name: 'Cart', color: '#ff9800', deps: ['react', 'react-dom', 'zustand', 'axios', 'lodash'] },
  { name: 'Profile', color: '#9c27b0', deps: ['react', 'react-dom', 'react-router', 'axios', 'date-fns', 'lodash'] },
]

// Пресеты
const PRESETS = {
  none: new Set<string>(),
  react: new Set(['react', 'react-dom']),
  all: new Set(LIBRARIES.map(l => l.name)),
}

function getVersionConflicts(libs: Library[]): Map<string, string[]> {
  // Симулируем конфликт версий: добавим что Cart использует react 18.2.0
  const conflicts = new Map<string, string[]>()
  conflicts.set('react', ['18.3.0 (Shell, Catalog, Profile)', '18.2.0 (Cart)'])
  return conflicts
}

export function Task6_1_Solution() {
  const [sharedLibs, setSharedLibs] = useState<Set<string>>(new Set(['react', 'react-dom']))

  const toggleLib = useCallback((libName: string) => {
    setSharedLibs(prev => {
      const next = new Set(prev)
      if (next.has(libName)) next.delete(libName)
      else next.add(libName)
      return next
    })
  }, [])

  const applyPreset = (preset: keyof typeof PRESETS) => {
    setSharedLibs(new Set(PRESETS[preset]))
  }

  // Подсчёт размеров
  const libSizeMap = new Map(LIBRARIES.map(l => [l.name, l.sizeKb]))

  // Сколько MFE используют каждую библиотеку
  const libUsageCount = new Map<string, number>()
  for (const lib of LIBRARIES) {
    const count = MFES.filter(mfe => mfe.deps.includes(lib.name)).length
    libUsageCount.set(lib.name, count)
  }

  // Размер без шаринга: каждый MFE грузит все свои зависимости
  const totalWithoutSharing = MFES.reduce((sum, mfe) => {
    return sum + mfe.deps.reduce((s, dep) => s + (libSizeMap.get(dep) ?? 0), 0)
  }, 0)

  // Размер с текущими настройками шаринга
  const totalWithSharing = (() => {
    let total = 0
    // Шаренные библиотеки загружаются один раз
    for (const lib of LIBRARIES) {
      const usageCount = libUsageCount.get(lib.name) ?? 0
      if (usageCount === 0) continue
      if (sharedLibs.has(lib.name)) {
        total += lib.sizeKb // один раз
      } else {
        total += lib.sizeKb * usageCount // каждый MFE отдельно
      }
    }
    return total
  })()

  const saved = totalWithoutSharing - totalWithSharing
  const savedPercent = Math.round((saved / totalWithoutSharing) * 100)

  // Дубликаты: non-shared библиотеки, которые используют 2+ MFE
  const duplicateLibs = LIBRARIES.filter(
    lib => !sharedLibs.has(lib.name) && (libUsageCount.get(lib.name) ?? 0) >= 2
  )

  const versionConflicts = getVersionConflicts(LIBRARIES)
  const conflictsCount = Array.from(versionConflicts.keys()).filter(k => sharedLibs.has(k)).length

  const containerStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    padding: 24,
    background: '#0f1117',
    minHeight: 500,
    color: '#e2e8f0',
    borderRadius: 12,
  }

  const cardStyle: React.CSSProperties = {
    background: '#1a1d2e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    border: '1px solid #2d3748',
  }

  const statBadgeStyle = (color: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    background: color,
    color: '#fff',
    marginRight: 8,
  })

  const libBadgeStyle = (isDuplicate: boolean, isShared: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 500,
    marginRight: 4,
    marginBottom: 4,
    background: isDuplicate ? '#7f1d1d' : isShared ? '#14532d' : '#1e3a5f',
    color: isDuplicate ? '#fca5a5' : isShared ? '#86efac' : '#93c5fd',
    border: `1px solid ${isDuplicate ? '#ef4444' : isShared ? '#22c55e' : '#3b82f6'}`,
  })

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    border: `1px solid ${active ? '#22c55e' : '#4b5563'}`,
    background: active ? '#14532d' : '#1f2937',
    color: active ? '#86efac' : '#9ca3af',
    transition: 'all 0.15s',
  })

  const presetBtnStyle: React.CSSProperties = {
    padding: '6px 14px',
    borderRadius: 6,
    border: '1px solid #374151',
    background: '#1f2937',
    color: '#d1d5db',
    cursor: 'pointer',
    fontSize: 12,
    marginRight: 8,
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, color: '#f1f5f9' }}>
        Визуализатор графа зависимостей
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b' }}>
        Управляйте shared-зависимостями и наблюдайте влияние на итоговый bundle size
      </p>

      {/* Статистика */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Итоговый размер</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>{totalWithSharing} KB</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>без шаринга: {totalWithoutSharing} KB</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Экономия</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: saved > 0 ? '#22c55e' : '#64748b' }}>
            {saved > 0 ? `${saved} KB` : '—'}
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            {saved > 0 ? `${savedPercent}% от общего` : 'включите shared'}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Дубликатов</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: duplicateLibs.length > 0 ? '#ef4444' : '#22c55e' }}>
            {duplicateLibs.length}
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            {duplicateLibs.length > 0 ? duplicateLibs.map(l => l.name).join(', ') : 'отлично!'}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Конфликтов версий</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: conflictsCount > 0 ? '#f59e0b' : '#22c55e' }}>
            {conflictsCount}
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            {conflictsCount > 0 ? 'проверьте react' : 'версии совпадают'}
          </div>
        </div>
      </div>

      {/* Конфликты версий */}
      {conflictsCount > 0 && (
        <div style={{
          ...cardStyle,
          border: '1px solid #f59e0b',
          background: '#1c1405',
          marginBottom: 16,
        }}>
          <div style={{ color: '#f59e0b', fontWeight: 600, marginBottom: 8, fontSize: 13 }}>
            ⚠ Конфликты версий (shared библиотеки)
          </div>
          {Array.from(versionConflicts.entries())
            .filter(([k]) => sharedLibs.has(k))
            .map(([lib, versions]) => (
              <div key={lib} style={{ fontSize: 12, color: '#fcd34d', marginBottom: 4 }}>
                <strong>{lib}:</strong> {versions.join(' vs ')}
              </div>
            ))}
          <div style={{ fontSize: 11, color: '#78716c', marginTop: 6 }}>
            При несовпадении версий Module Federation не сможет использовать singleton — будут загружены обе копии
          </div>
        </div>
      )}

      {/* Библиотеки — управление shared */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Библиотеки</div>
          <div>
            <button style={presetBtnStyle} onClick={() => applyPreset('none')}>Ничего не шарить</button>
            <button style={presetBtnStyle} onClick={() => applyPreset('react')}>Только React</button>
            <button style={presetBtnStyle} onClick={() => applyPreset('all')}>Всё shared</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
          {LIBRARIES.map(lib => {
            const isShared = sharedLibs.has(lib.name)
            const usageCount = libUsageCount.get(lib.name) ?? 0
            const isDuplicate = !isShared && usageCount >= 2
            const hasConflict = isShared && versionConflicts.has(lib.name)
            return (
              <div
                key={lib.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: isDuplicate ? '#1c0a0a' : hasConflict ? '#1c1405' : '#0f172a',
                  border: `1px solid ${isDuplicate ? '#7f1d1d' : hasConflict ? '#854d0e' : '#1e293b'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: lib.color, flexShrink: 0,
                  }} />
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{lib.name}</span>
                    <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>{lib.version}</span>
                    {isDuplicate && (
                      <span style={{ fontSize: 10, color: '#ef4444', marginLeft: 6 }}>
                        ✕ дубль ×{usageCount}
                      </span>
                    )}
                    {hasConflict && (
                      <span style={{ fontSize: 10, color: '#f59e0b', marginLeft: 6 }}>
                        ⚠ конфликт
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#475569' }}>{lib.sizeKb} KB</span>
                  <button style={toggleStyle(isShared)} onClick={() => toggleLib(lib.name)}>
                    {isShared ? '● shared' : '○ local'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* MFE — граф зависимостей */}
      <div style={cardStyle}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Микрофронтенды</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {MFES.map(mfe => {
            const mfeSizeTotal = mfe.deps.reduce((s, dep) => {
              if (sharedLibs.has(dep)) return s // shared — не в бандле MFE
              return s + (libSizeMap.get(dep) ?? 0)
            }, 0)
            return (
              <div key={mfe.name} style={{
                padding: 12,
                borderRadius: 6,
                background: '#0f172a',
                border: `1px solid ${mfe.color}33`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: mfe.color }} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{mfe.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    собственный бандл: <strong style={{ color: '#e2e8f0' }}>{mfeSizeTotal} KB</strong>
                  </span>
                </div>
                <div>
                  {mfe.deps.map(dep => {
                    const isShared = sharedLibs.has(dep)
                    const isDuplicate = !isShared && (libUsageCount.get(dep) ?? 0) >= 2
                    return (
                      <span key={dep} style={libBadgeStyle(isDuplicate, isShared)}>
                        {dep}
                      </span>
                    )
                  })}
                </div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 6 }}>
                  <span style={{ color: '#22c55e' }}>■</span> shared&nbsp;
                  <span style={{ color: '#3b82f6' }}>■</span> локальный&nbsp;
                  <span style={{ color: '#ef4444' }}>■</span> дубликат
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Легенда */}
      <div style={{ fontSize: 12, color: '#475569', textAlign: 'center', marginTop: 8 }}>
        Shared-библиотека загружается браузером один раз и используется всеми MFE — как кэшированный ресурс
      </div>
    </div>
  )
}

// =====================================================
// Task 6.2: Import Map Constructor
// =====================================================

type ImportEntry = {
  id: string
  specifier: string
  url: string
}

type ScopeEntry = {
  id: string
  scopePath: string
  mappings: ImportEntry[]
}

const IMPORT_PRESETS: ImportEntry[] = [
  { id: 'p1', specifier: 'react', url: 'https://esm.sh/react@18.3.0' },
  { id: 'p2', specifier: 'react-dom', url: 'https://esm.sh/react-dom@18.3.0' },
  { id: 'p3', specifier: 'react-dom/client', url: 'https://esm.sh/react-dom@18.3.0/client' },
  { id: 'p4', specifier: 'react-router-dom', url: 'https://esm.sh/react-router-dom@6.22.0' },
]

let uid = 100
const nextId = () => String(++uid)

function isValidUrl(s: string): boolean {
  try {
    new URL(s)
    return true
  } catch {
    return false
  }
}

export function Task6_2_Solution() {
  const [imports, setImports] = useState<ImportEntry[]>([])
  const [scopes, setScopes] = useState<ScopeEntry[]>([])
  const [newSpecifier, setNewSpecifier] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newScopePath, setNewScopePath] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [tab, setTab] = useState<'editor' | 'json' | 'html'>('editor')

  const validate = (imps: ImportEntry[], scps: ScopeEntry[]): string[] => {
    const errs: string[] = []
    // Проверяем дубли specifier в imports
    const specs = imps.map(i => i.specifier)
    const dupSpecs = specs.filter((s, i) => specs.indexOf(s) !== i)
    if (dupSpecs.length) errs.push(`Дублирующиеся specifiers: ${[...new Set(dupSpecs)].join(', ')}`)
    // Проверяем URL
    for (const imp of imps) {
      if (!isValidUrl(imp.url)) errs.push(`Некорректный URL для "${imp.specifier}": ${imp.url}`)
    }
    // Проверяем scope paths
    for (const scope of scps) {
      if (!scope.scopePath.startsWith('/')) errs.push(`Scope path должен начинаться с "/": ${scope.scopePath}`)
      const sMappings = scope.mappings.map(m => m.specifier)
      const dupM = sMappings.filter((s, i) => sMappings.indexOf(s) !== i)
      if (dupM.length) errs.push(`Дублирующиеся specifiers в scope "${scope.scopePath}": ${dupM.join(', ')}`)
      for (const m of scope.mappings) {
        if (!isValidUrl(m.url)) errs.push(`Некорректный URL в scope "${scope.scopePath}" для "${m.specifier}"`)
      }
    }
    return errs
  }

  const addImport = () => {
    if (!newSpecifier.trim()) return
    const updated = [...imports, { id: nextId(), specifier: newSpecifier.trim(), url: newUrl.trim() }]
    setImports(updated)
    setErrors(validate(updated, scopes))
    setNewSpecifier('')
    setNewUrl('')
  }

  const removeImport = (id: string) => {
    const updated = imports.filter(i => i.id !== id)
    setImports(updated)
    setErrors(validate(updated, scopes))
  }

  const applyPresets = () => {
    const updated = [...imports]
    for (const preset of IMPORT_PRESETS) {
      if (!updated.find(i => i.specifier === preset.specifier)) {
        updated.push({ ...preset, id: nextId() })
      }
    }
    setImports(updated)
    setErrors(validate(updated, scopes))
  }

  const addScope = () => {
    if (!newScopePath.trim()) return
    const updated = [...scopes, { id: nextId(), scopePath: newScopePath.trim(), mappings: [] }]
    setScopes(updated)
    setErrors(validate(imports, updated))
    setNewScopePath('')
  }

  const removeScope = (id: string) => {
    const updated = scopes.filter(s => s.id !== id)
    setScopes(updated)
    setErrors(validate(imports, updated))
  }

  const addScopeMapping = (scopeId: string, specifier: string, url: string) => {
    if (!specifier.trim()) return
    const updated = scopes.map(s => {
      if (s.id !== scopeId) return s
      return { ...s, mappings: [...s.mappings, { id: nextId(), specifier: specifier.trim(), url: url.trim() }] }
    })
    setScopes(updated)
    setErrors(validate(imports, updated))
  }

  const removeScopeMapping = (scopeId: string, mappingId: string) => {
    const updated = scopes.map(s => {
      if (s.id !== scopeId) return s
      return { ...s, mappings: s.mappings.filter(m => m.id !== mappingId) }
    })
    setScopes(updated)
    setErrors(validate(imports, updated))
  }

  // Генерация importmap объекта
  const buildImportMap = () => {
    const result: Record<string, unknown> = {}
    if (imports.length) {
      result['imports'] = Object.fromEntries(imports.map(i => [i.specifier, i.url]))
    }
    if (scopes.length) {
      result['scopes'] = Object.fromEntries(
        scopes.map(s => [
          s.scopePath,
          Object.fromEntries(s.mappings.map(m => [m.specifier, m.url])),
        ])
      )
    }
    return result
  }

  const importMapJson = JSON.stringify(buildImportMap(), null, 2)
  const htmlTag = `<script type="importmap">\n${importMapJson}\n</script>`

  const containerStyle: React.CSSProperties = {
    fontFamily: 'system-ui, sans-serif',
    padding: 24,
    background: '#0f1117',
    minHeight: 500,
    color: '#e2e8f0',
    borderRadius: 12,
  }

  const cardStyle: React.CSSProperties = {
    background: '#1a1d2e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    border: '1px solid #2d3748',
  }

  const inputStyle: React.CSSProperties = {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #374151',
    background: '#0f172a',
    color: '#e2e8f0',
    fontSize: 12,
    outline: 'none',
  }

  const btnStyle = (color = '#3b82f6'): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: 6,
    border: 'none',
    background: color,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
  })

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 18px',
    borderRadius: '6px 6px 0 0',
    border: 'none',
    background: active ? '#1a1d2e' : 'transparent',
    color: active ? '#f1f5f9' : '#64748b',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
  })

  return (
    <div style={containerStyle}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, color: '#f1f5f9' }}>
        Конструктор Import Map
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b' }}>
        Создайте importmap.json для управления модульными путями в браузере
      </p>

      {/* Ошибки валидации */}
      {errors.length > 0 && (
        <div style={{
          ...cardStyle,
          border: '1px solid #ef4444',
          background: '#1c0a0a',
          marginBottom: 16,
        }}>
          <div style={{ color: '#ef4444', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>
            Ошибки валидации
          </div>
          {errors.map((e, i) => (
            <div key={i} style={{ fontSize: 12, color: '#fca5a5', marginBottom: 2 }}>• {e}</div>
          ))}
        </div>
      )}

      {/* Табы */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2d3748', marginBottom: 16 }}>
        <button style={tabStyle(tab === 'editor')} onClick={() => setTab('editor')}>Редактор</button>
        <button style={tabStyle(tab === 'json')} onClick={() => setTab('json')}>importmap.json</button>
        <button style={tabStyle(tab === 'html')} onClick={() => setTab('html')}>HTML тег</button>
      </div>

      {tab === 'editor' && (
        <>
          {/* Imports */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                imports <span style={{ color: '#64748b', fontWeight: 400 }}>— глобальные маппинги</span>
              </div>
              <button style={btnStyle('#0ea5e9')} onClick={applyPresets}>
                + Пресеты React/Router
              </button>
            </div>

            {imports.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {imports.map(imp => (
                  <div key={imp.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
                    padding: '6px 10px', borderRadius: 6, background: '#0f172a',
                    border: '1px solid #1e293b',
                  }}>
                    <span style={{ fontSize: 12, color: '#a78bfa', minWidth: 120, fontFamily: 'monospace' }}>
                      {imp.specifier}
                    </span>
                    <span style={{ fontSize: 11, color: '#475569' }}>→</span>
                    <span style={{ fontSize: 11, color: '#64748b', flex: 1, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {imp.url || <em style={{ color: '#4b5563' }}>URL не задан</em>}
                    </span>
                    {!isValidUrl(imp.url) && (
                      <span style={{ fontSize: 10, color: '#f59e0b' }}>⚠ URL</span>
                    )}
                    <button
                      style={{ ...btnStyle('#7f1d1d'), padding: '2px 8px', fontSize: 11 }}
                      onClick={() => removeImport(imp.id)}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                style={{ ...inputStyle, width: 140 }}
                placeholder="specifier (напр. react)"
                value={newSpecifier}
                onChange={e => setNewSpecifier(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addImport()}
              />
              <input
                style={{ ...inputStyle, flex: 1, minWidth: 200 }}
                placeholder="URL (напр. https://esm.sh/react@18)"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addImport()}
              />
              <button style={btnStyle()} onClick={addImport}>+ Добавить</button>
            </div>
          </div>

          {/* Scopes */}
          <div style={cardStyle}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
              scopes <span style={{ color: '#64748b', fontWeight: 400 }}>— маппинги для конкретных путей</span>
            </div>
            <p style={{ fontSize: 12, color: '#475569', margin: '0 0 12px' }}>
              Scopes позволяют переопределять маппинги для конкретных приложений — например, /app-cart/ может использовать другую версию lodash
            </p>

            {scopes.map(scope => (
              <ScopeBlock
                key={scope.id}
                scope={scope}
                onRemove={() => removeScope(scope.id)}
                onAddMapping={(spec, url) => addScopeMapping(scope.id, spec, url)}
                onRemoveMapping={(mid) => removeScopeMapping(scope.id, mid)}
                inputStyle={inputStyle}
                btnStyle={btnStyle}
              />
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input
                style={{ ...inputStyle, width: 200 }}
                placeholder="Scope path (напр. /app-cart/)"
                value={newScopePath}
                onChange={e => setNewScopePath(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addScope()}
              />
              <button style={btnStyle()} onClick={addScope}>+ Добавить scope</button>
            </div>
          </div>
        </>
      )}

      {tab === 'json' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>importmap.json</span>
            {errors.length === 0 ? (
              <span style={{ fontSize: 12, color: '#22c55e' }}>✓ Валидный</span>
            ) : (
              <span style={{ fontSize: 12, color: '#ef4444' }}>✕ Есть ошибки</span>
            )}
          </div>
          <pre style={{
            background: '#0f172a',
            padding: 16,
            borderRadius: 6,
            fontSize: 12,
            lineHeight: 1.6,
            color: '#86efac',
            overflow: 'auto',
            margin: 0,
            fontFamily: 'monospace',
          }}>
            {imports.length === 0 && scopes.length === 0
              ? '// Добавьте imports или scopes в редакторе'
              : importMapJson}
          </pre>
        </div>
      )}

      {tab === 'html' && (
        <div style={cardStyle}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
            HTML тег <code style={{ fontFamily: 'monospace', fontSize: 12, color: '#93c5fd' }}>&lt;script type="importmap"&gt;</code>
          </div>
          <p style={{ fontSize: 12, color: '#475569', margin: '0 0 12px' }}>
            Вставьте этот тег в <code style={{ color: '#a78bfa' }}>&lt;head&gt;</code> вашего HTML до любых <code style={{ color: '#a78bfa' }}>import</code> и модульных скриптов
          </p>
          <pre style={{
            background: '#0f172a',
            padding: 16,
            borderRadius: 6,
            fontSize: 12,
            lineHeight: 1.6,
            color: '#fde68a',
            overflow: 'auto',
            margin: 0,
            fontFamily: 'monospace',
          }}>
            {imports.length === 0 && scopes.length === 0
              ? '// Добавьте imports или scopes в редакторе'
              : htmlTag}
          </pre>
          <div style={{ marginTop: 12, padding: 12, background: '#0f2027', borderRadius: 6, border: '1px solid #164e63' }}>
            <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600, marginBottom: 6 }}>Важно знать</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: '#7dd3fc', lineHeight: 1.8 }}>
              <li>Только один <code>&lt;script type="importmap"&gt;</code> на страницу</li>
              <li>Должен идти до первого <code>import</code> и <code>&lt;script type="module"&gt;</code></li>
              <li>Поддерживается во всех современных браузерах (Chrome 89+, Firefox 108+, Safari 16.4+)</li>
              <li>Для старых браузеров используйте полифил <code>es-module-shims</code></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

// Вспомогательный компонент для scope-блока
type ScopeBlockProps = {
  scope: ScopeEntry
  onRemove: () => void
  onAddMapping: (spec: string, url: string) => void
  onRemoveMapping: (id: string) => void
  inputStyle: React.CSSProperties
  btnStyle: (color?: string) => React.CSSProperties
}

function ScopeBlock({ scope, onRemove, onAddMapping, onRemoveMapping, inputStyle, btnStyle }: ScopeBlockProps) {
  const [spec, setSpec] = useState('')
  const [url, setUrl] = useState('')

  const handleAdd = () => {
    if (!spec.trim()) return
    onAddMapping(spec, url)
    setSpec('')
    setUrl('')
  }

  return (
    <div style={{
      padding: 12,
      borderRadius: 6,
      background: '#0f172a',
      border: '1px solid #1e3a5f',
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#93c5fd', fontWeight: 600 }}>
          {scope.scopePath}
        </span>
        <button
          style={{ ...btnStyle('#7f1d1d'), padding: '2px 8px', fontSize: 11 }}
          onClick={onRemove}
        >✕ удалить scope</button>
      </div>

      {scope.mappings.map(m => (
        <div key={m.id} style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
          paddingLeft: 16, fontSize: 12,
        }}>
          <span style={{ color: '#a78bfa', fontFamily: 'monospace', minWidth: 100 }}>{m.specifier}</span>
          <span style={{ color: '#475569' }}>→</span>
          <span style={{ color: '#64748b', flex: 1, fontFamily: 'monospace', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.url}</span>
          <button
            style={{ ...btnStyle('#7f1d1d'), padding: '1px 6px', fontSize: 10 }}
            onClick={() => onRemoveMapping(m.id)}
          >✕</button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 6, marginTop: 8, paddingLeft: 16, flexWrap: 'wrap' }}>
        <input
          style={{ ...inputStyle, width: 120 }}
          placeholder="specifier"
          value={spec}
          onChange={e => setSpec(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <input
          style={{ ...inputStyle, flex: 1, minWidth: 180 }}
          placeholder="URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button style={{ ...btnStyle('#059669'), padding: '4px 10px' }} onClick={handleAdd}>+ маппинг</button>
      </div>
    </div>
  )
}
