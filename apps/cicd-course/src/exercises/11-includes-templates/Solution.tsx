// ============================================
// Level 11: Includes and Templates — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 11.1: include — external config types
// ============================================

type IncludeType = 'local' | 'file' | 'remote' | 'template'

interface IncludeItem {
  id: number
  type: IncludeType
  localPath: string
  fileProject: string
  fileRef: string
  filePath: string
  remoteUrl: string
  templateName: string
}

const GITLAB_TEMPLATES = [
  'Security/SAST.gitlab-ci.yml',
  'Security/DAST.gitlab-ci.yml',
  'Security/Dependency-Scanning.gitlab-ci.yml',
  'Security/Container-Scanning.gitlab-ci.yml',
  'Code-Quality.gitlab-ci.yml',
  'Auto-DevOps.gitlab-ci.yml',
]

const TYPE_LABELS: Record<IncludeType, string> = {
  local: 'local',
  file: 'file',
  remote: 'remote',
  template: 'template',
}

const TYPE_DESCRIPTIONS: Record<IncludeType, string> = {
  local: 'Файл в текущем репозитории',
  file: 'Файл из другого проекта GitLab',
  remote: 'Файл по внешнему HTTP/HTTPS URL',
  template: 'Встроенный шаблон GitLab',
}

function makeDefaultInclude(id: number): IncludeItem {
  return {
    id,
    type: 'local',
    localPath: 'ci/lint.yml',
    fileProject: 'company/ci-templates',
    fileRef: 'v2.1.0',
    filePath: '/templates/nodejs.yml',
    remoteUrl: 'https://example.com/template.yml',
    templateName: 'Security/SAST.gitlab-ci.yml',
  }
}

function buildIncludeBlock(item: IncludeItem): string {
  if (item.type === 'local') {
    return `  - local: '${item.localPath || 'ci/template.yml'}'`
  }
  if (item.type === 'file') {
    return `  - project: '${item.fileProject || 'company/ci-templates'}'\n    ref: '${item.fileRef || 'v2.1.0'}'\n    file: '${item.filePath || '/templates/nodejs.yml'}'`
  }
  if (item.type === 'remote') {
    return `  - remote: '${item.remoteUrl || 'https://example.com/template.yml'}'`
  }
  return `  - template: ${item.templateName || 'Security/SAST.gitlab-ci.yml'}`
}

function buildIncludeYaml(items: IncludeItem[]): string {
  if (items.length === 0) return '# Нет подключённых файлов'
  const blocks = items.map(buildIncludeBlock).join('\n')
  return `include:\n${blocks}`
}

function isUrlValid(url: string): boolean {
  return url.startsWith('https://') || url.startsWith('http://')
}

const btnBase: React.CSSProperties = {
  padding: '0.35rem 0.85rem',
  borderRadius: '6px',
  border: '1px solid #ddd',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 600,
  transition: 'background 0.15s',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.4rem 0.6rem',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '0.85rem',
  fontFamily: 'monospace',
  boxSizing: 'border-box',
}

export function Task11_1_Solution() {
  const [includes, setIncludes] = useState<IncludeItem[]>([makeDefaultInclude(1)])
  const [nextId, setNextId] = useState(2)

  const addInclude = () => {
    setIncludes(prev => [...prev, makeDefaultInclude(nextId)])
    setNextId(n => n + 1)
  }

  const removeInclude = (id: number) => {
    setIncludes(prev => prev.filter(i => i.id !== id))
  }

  const updateInclude = (id: number, patch: Partial<IncludeItem>) => {
    setIncludes(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
  }

  const yaml = buildIncludeYaml(includes)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>include: подключение внешних конфигов</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Настрой `include` блоки и посмотри итоговый YAML
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left: include editor */}
        <div>
          {includes.map((item, idx) => {
            const showMainWarning = item.type === 'file' && item.fileRef === 'main'
            const showUrlWarning = item.type === 'remote' && item.remoteUrl && !isUrlValid(item.remoteUrl)

            return (
              <div key={item.id} style={{
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem',
                background: '#fafafa',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#333' }}>
                    include #{idx + 1}
                  </span>
                  {includes.length > 1 && (
                    <button
                      onClick={() => removeInclude(item.id)}
                      style={{ ...btnBase, background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2' }}
                    >
                      Удалить
                    </button>
                  )}
                </div>

                {/* Type selector */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  {(['local', 'file', 'remote', 'template'] as IncludeType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => updateInclude(item.id, { type: t })}
                      style={{
                        ...btnBase,
                        background: item.type === t ? '#1565C0' : '#fff',
                        color: item.type === t ? '#fff' : '#555',
                        border: item.type === t ? '1px solid #1565C0' : '1px solid #ddd',
                      }}
                    >
                      {TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.75rem' }}>
                  {TYPE_DESCRIPTIONS[item.type]}
                </div>

                {/* Fields by type */}
                {item.type === 'local' && (
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#555', display: 'block', marginBottom: '0.3rem' }}>Путь к файлу</label>
                    <input
                      style={inputStyle}
                      value={item.localPath}
                      onChange={e => updateInclude(item.id, { localPath: e.target.value })}
                      placeholder="ci/lint.yml"
                    />
                  </div>
                )}

                {item.type === 'file' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#555', display: 'block', marginBottom: '0.3rem' }}>project</label>
                      <input style={inputStyle} value={item.fileProject} onChange={e => updateInclude(item.id, { fileProject: e.target.value })} placeholder="company/ci-templates" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#555', display: 'block', marginBottom: '0.3rem' }}>ref (ветка / тег)</label>
                      <input style={inputStyle} value={item.fileRef} onChange={e => updateInclude(item.id, { fileRef: e.target.value })} placeholder="v2.1.0" />
                    </div>
                    {showMainWarning && (
                      <div style={{ background: '#FFF8E1', border: '1px solid #FFD54F', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#E65100' }}>
                        Антипаттерн: ref: 'main' означает что любой push в репозиторий шаблонов сломает все пайплайны. Используй тег версии, например v2.1.0.
                      </div>
                    )}
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#555', display: 'block', marginBottom: '0.3rem' }}>file</label>
                      <input style={inputStyle} value={item.filePath} onChange={e => updateInclude(item.id, { filePath: e.target.value })} placeholder="/templates/nodejs.yml" />
                    </div>
                  </div>
                )}

                {item.type === 'remote' && (
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#555', display: 'block', marginBottom: '0.3rem' }}>URL</label>
                    <input
                      style={{ ...inputStyle, borderColor: showUrlWarning ? '#E53935' : '#ddd' }}
                      value={item.remoteUrl}
                      onChange={e => updateInclude(item.id, { remoteUrl: e.target.value })}
                      placeholder="https://example.com/template.yml"
                    />
                    {showUrlWarning && (
                      <div style={{ fontSize: '0.78rem', color: '#E53935', marginTop: '0.3rem' }}>
                        URL должен начинаться с https://
                      </div>
                    )}
                    <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#F57F17', background: '#FFFDE7', border: '1px solid #FFF176', borderRadius: '6px', padding: '0.4rem 0.6rem' }}>
                      Риск: внешний URL может стать недоступен или измениться без предупреждения
                    </div>
                  </div>
                )}

                {item.type === 'template' && (
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#555', display: 'block', marginBottom: '0.3rem' }}>Встроенный шаблон GitLab</label>
                    <select
                      style={{ ...inputStyle, background: '#fff' }}
                      value={item.templateName}
                      onChange={e => updateInclude(item.id, { templateName: e.target.value })}
                    >
                      {GITLAB_TEMPLATES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )
          })}

          <button
            onClick={addInclude}
            style={{ ...btnBase, background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7', width: '100%', padding: '0.6rem' }}
          >
            + Добавить include
          </button>
        </div>

        {/* Right: YAML output */}
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333', marginBottom: '0.5rem' }}>
            Итоговый YAML
          </div>
          <pre style={{
            background: '#1E1E1E',
            color: '#D4D4D4',
            padding: '1rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            overflow: 'auto',
            minHeight: '200px',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}>
            {yaml}
          </pre>

          <div style={{ marginTop: '1rem', background: '#E3F2FD', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#1565C0' }}>
            <strong>Порядок слияния:</strong> GitLab обрабатывает include файлы по очереди. Определения в основном `.gitlab-ci.yml` имеют наибольший приоритет.
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 11.2: extends and !reference
// ============================================

interface JobVariables {
  [key: string]: string
}

interface JobConfig {
  image: string
  variables: JobVariables
  beforeScript: string[]
  script: string[]
}

function deepMergeJobs(parent: JobConfig, child: JobConfig): { result: JobConfig; sources: Record<string, 'inherited' | 'overridden' | 'added'> } {
  const result: JobConfig = {
    image: child.image || parent.image,
    variables: { ...parent.variables, ...child.variables },
    beforeScript: child.beforeScript.length > 0 ? child.beforeScript : parent.beforeScript,
    script: child.script.length > 0 ? child.script : parent.script,
  }

  const sources: Record<string, 'inherited' | 'overridden' | 'added'> = {}

  // image
  sources['image'] = child.image && child.image !== parent.image ? 'overridden' : 'inherited'
  if (!parent.image && child.image) sources['image'] = 'added'

  // variables
  Object.keys(result.variables).forEach(k => {
    if (k in parent.variables && k in child.variables && parent.variables[k] !== child.variables[k]) {
      sources[`var.${k}`] = 'overridden'
    } else if (!(k in parent.variables)) {
      sources[`var.${k}`] = 'added'
    } else {
      sources[`var.${k}`] = 'inherited'
    }
  })

  // before_script
  sources['beforeScript'] = child.beforeScript.length > 0 ? (parent.beforeScript.length > 0 ? 'overridden' : 'added') : 'inherited'

  // script
  sources['script'] = child.script.length > 0 ? (parent.script.length > 0 ? 'overridden' : 'added') : 'inherited'

  return { result, sources }
}

function buildJobYaml(name: string, job: JobConfig): string {
  const lines: string[] = [`${name}:`]
  if (job.image) lines.push(`  image: ${job.image}`)
  if (Object.keys(job.variables).length > 0) {
    lines.push('  variables:')
    Object.entries(job.variables).forEach(([k, v]) => lines.push(`    ${k}: '${v}'`))
  }
  if (job.beforeScript.length > 0) {
    lines.push('  before_script:')
    job.beforeScript.forEach(s => lines.push(`    - ${s}`))
  }
  if (job.script.length > 0) {
    lines.push('  script:')
    job.script.forEach(s => lines.push(`    - ${s}`))
  }
  return lines.join('\n')
}

const SOURCE_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  inherited: { bg: '#E3F2FD', color: '#1565C0', label: 'Унаследовано' },
  overridden: { bg: '#FFF3E0', color: '#E65100', label: 'Переопределено' },
  added: { bg: '#E8F5E9', color: '#2E7D32', label: 'Добавлено' },
}

type TabType = 'extends' | 'reference'

export function Task11_2_Solution() {
  const [activeTab, setActiveTab] = useState<TabType>('extends')

  const [parent, setParent] = useState<JobConfig>({
    image: 'node:20-alpine',
    variables: { NODE_ENV: 'test', LOG_LEVEL: 'info' },
    beforeScript: ['npm ci'],
    script: ['npm run build'],
  })

  const [child, setChild] = useState<JobConfig>({
    image: '',
    variables: { NODE_ENV: 'production' },
    beforeScript: [],
    script: ['npm run build:prod', 'npm run compress'],
  })

  const { result, sources } = deepMergeJobs(parent, child)

  const addParentVar = () => {
    const key = `VAR_${Object.keys(parent.variables).length + 1}`
    setParent(p => ({ ...p, variables: { ...p.variables, [key]: 'value' } }))
  }

  const addChildVar = () => {
    const key = `CHILD_VAR_${Object.keys(child.variables).length + 1}`
    setChild(c => ({ ...c, variables: { ...c.variables, [key]: 'child-value' } }))
  }

  const updateParentVar = (key: string, val: string) => {
    setParent(p => ({ ...p, variables: { ...p.variables, [key]: val } }))
  }

  const updateChildVar = (key: string, val: string) => {
    setChild(c => ({ ...c, variables: { ...c.variables, [key]: val } }))
  }

  const removeChildVar = (key: string) => {
    setChild(c => {
      const vars = { ...c.variables }
      delete vars[key]
      return { ...c, variables: vars }
    })
  }

  const ResultField = ({ label, value, sourceKey }: { label: string; value: string | string[]; sourceKey: string }) => {
    const src = sources[sourceKey] || 'inherited'
    const { bg, color, label: srcLabel } = SOURCE_COLORS[src]
    const displayVal = Array.isArray(value) ? value.join(', ') : value
    if (!displayVal) return null
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#888', minWidth: '110px' }}>{label}:</span>
        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', background: bg, color, borderRadius: '4px', padding: '0.15rem 0.4rem', flex: 1 }}>
          {Array.isArray(value) ? value.join(' && ') : value}
        </span>
        <span style={{ fontSize: '0.72rem', color, background: bg, borderRadius: '4px', padding: '0.1rem 0.35rem', whiteSpace: 'nowrap' }}>{srcLabel}</span>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>extends и !reference — наследование джобов</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1rem' }}>
        Настрой шаблон и дочерний джоб — смотри результат deep merge в реальном времени
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['extends', 'reference'] as TabType[]).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{ ...btnBase, background: activeTab === t ? '#1565C0' : '#fff', color: activeTab === t ? '#fff' : '#555', border: activeTab === t ? '1px solid #1565C0' : '1px solid #ddd' }}
          >
            {t === 'extends' ? 'extends: deep merge' : '!reference: точечный'}
          </button>
        ))}
      </div>

      {activeTab === 'extends' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          {/* Parent */}
          <div style={{ border: '2px solid #90CAF9', borderRadius: '10px', padding: '1rem', background: '#F8FBFF' }}>
            <div style={{ fontWeight: 700, color: '#1565C0', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              .base-job (шаблон)
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#555' }}>image</label>
              <input style={{ ...inputStyle, marginTop: '0.2rem' }} value={parent.image} onChange={e => setParent(p => ({ ...p, image: e.target.value }))} />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.78rem', color: '#555' }}>variables</label>
                <button onClick={addParentVar} style={{ ...btnBase, fontSize: '0.72rem', padding: '0.15rem 0.4rem', background: '#E3F2FD', color: '#1565C0', border: '1px solid #90CAF9' }}>+ добавить</button>
              </div>
              {Object.entries(parent.variables).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={k} readOnly />
                  <input style={{ ...inputStyle, flex: 1 }} value={v} onChange={e => updateParentVar(k, e.target.value)} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#555' }}>before_script</label>
              <input style={{ ...inputStyle, marginTop: '0.2rem' }} value={parent.beforeScript.join('; ')} onChange={e => setParent(p => ({ ...p, beforeScript: e.target.value ? e.target.value.split('; ') : [] }))} placeholder="команда1; команда2" />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#555' }}>script</label>
              <input style={{ ...inputStyle, marginTop: '0.2rem' }} value={parent.script.join('; ')} onChange={e => setParent(p => ({ ...p, script: e.target.value ? e.target.value.split('; ') : [] }))} placeholder="команда1; команда2" />
            </div>
          </div>

          {/* Child */}
          <div style={{ border: '2px solid #A5D6A7', borderRadius: '10px', padding: '1rem', background: '#F8FFF9' }}>
            <div style={{ fontWeight: 700, color: '#2E7D32', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              my-job (дочерний)
            </div>
            <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.5rem' }}>
              extends: .base-job
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#555' }}>image (пустое = наследовать)</label>
              <input style={{ ...inputStyle, marginTop: '0.2rem' }} value={child.image} onChange={e => setChild(c => ({ ...c, image: e.target.value }))} placeholder="оставь пустым для наследования" />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.78rem', color: '#555' }}>variables (добавить / переопределить)</label>
                <button onClick={addChildVar} style={{ ...btnBase, fontSize: '0.72rem', padding: '0.15rem 0.4rem', background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}>+ добавить</button>
              </div>
              {Object.entries(child.variables).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={k} readOnly />
                  <input style={{ ...inputStyle, flex: 1 }} value={v} onChange={e => updateChildVar(k, e.target.value)} />
                  <button onClick={() => removeChildVar(k)} style={{ ...btnBase, padding: '0.2rem 0.5rem', background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2' }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.78rem', color: '#555' }}>before_script (пустое = наследовать)</label>
              <input style={{ ...inputStyle, marginTop: '0.2rem' }} value={child.beforeScript.join('; ')} onChange={e => setChild(c => ({ ...c, beforeScript: e.target.value ? e.target.value.split('; ') : [] }))} placeholder="оставь пустым для наследования" />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#555' }}>script (пустое = наследовать)</label>
              <input style={{ ...inputStyle, marginTop: '0.2rem' }} value={child.script.join('; ')} onChange={e => setChild(c => ({ ...c, script: e.target.value ? e.target.value.split('; ') : [] }))} placeholder="оставь пустым для наследования" />
            </div>
          </div>

          {/* Result */}
          <div style={{ border: '2px solid #CE93D8', borderRadius: '10px', padding: '1rem', background: '#FDF4FF' }}>
            <div style={{ fontWeight: 700, color: '#6A1B9A', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              Результат (my-job)
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {Object.entries(SOURCE_COLORS).map(([key, val]) => (
                <span key={key} style={{ fontSize: '0.72rem', background: val.bg, color: val.color, borderRadius: '4px', padding: '0.1rem 0.4rem' }}>{val.label}</span>
              ))}
            </div>

            <ResultField label="image" value={result.image} sourceKey="image" />
            {Object.entries(result.variables).map(([k, v]) => (
              <ResultField key={k} label={`vars.${k}`} value={v} sourceKey={`var.${k}`} />
            ))}
            {result.beforeScript.length > 0 && <ResultField label="before_script" value={result.beforeScript} sourceKey="beforeScript" />}
            {result.script.length > 0 && <ResultField label="script" value={result.script} sourceKey="script" />}

            <div style={{ marginTop: '1rem', background: '#1E1E1E', color: '#D4D4D4', borderRadius: '8px', padding: '0.75rem', fontSize: '0.78rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {buildJobYaml('my-job', result)}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reference' && (
        <div style={{ maxWidth: '700px' }}>
          <div style={{ background: '#F3F4F6', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#333' }}>Сценарий: джобу нужны before_script из двух шаблонов</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.4rem', fontWeight: 600 }}>Шаблон 1: .setup-db</div>
                <pre style={{ background: '#1E1E1E', color: '#D4D4D4', borderRadius: '8px', padding: '0.75rem', fontSize: '0.78rem', margin: 0 }}>{`.setup-db:
  before_script:
    - docker-compose up -d postgres
    - sleep 5
    - echo "DB ready"`}</pre>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.4rem', fontWeight: 600 }}>Шаблон 2: .install-deps</div>
                <pre style={{ background: '#1E1E1E', color: '#D4D4D4', borderRadius: '8px', padding: '0.75rem', fontSize: '0.78rem', margin: 0 }}>{`.install-deps:
  before_script:
    - npm ci
    - echo "Deps installed"`}</pre>
              </div>
            </div>

            <div style={{ background: '#FFF8E1', border: '1px solid #FFD54F', borderRadius: '8px', padding: '0.6rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#E65100' }}>
              <strong>extends не поможет</strong> — можно наследовать только от одного родителя. Нужно взять before_script из обоих шаблонов.
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.4rem', fontWeight: 600 }}>Решение: !reference</div>
              <pre style={{ background: '#1E1E1E', color: '#D4D4D4', borderRadius: '8px', padding: '0.75rem', fontSize: '0.82rem', margin: 0 }}>{`integration-test:
  before_script:
    - !reference [.setup-db, before_script]
    - !reference [.install-deps, before_script]
  script:
    - npm run test:integration`}</pre>
            </div>

            <div style={{ marginTop: '0.75rem', background: '#E8F5E9', borderRadius: '8px', padding: '0.6rem 0.75rem', fontSize: '0.8rem', color: '#2E7D32' }}>
              Результат: before_script содержит ВСЕ команды из обоих шаблонов в нужном порядке. !reference вставляет список как элементы массива.
            </div>
          </div>

          <div style={{ background: '#E3F2FD', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#1565C0', fontSize: '0.9rem' }}>Итоговый before_script</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { cmd: 'docker-compose up -d postgres', src: '.setup-db' },
                { cmd: 'sleep 5', src: '.setup-db' },
                { cmd: 'echo "DB ready"', src: '.setup-db' },
                { cmd: 'npm ci', src: '.install-deps' },
                { cmd: 'echo "Deps installed"', src: '.install-deps' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <code style={{ flex: 1, background: '#1E1E1E', color: '#D4D4D4', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{item.cmd}</code>
                  <span style={{ fontSize: '0.75rem', background: item.src === '.setup-db' ? '#E3F2FD' : '#E8F5E9', color: item.src === '.setup-db' ? '#1565C0' : '#2E7D32', borderRadius: '4px', padding: '0.2rem 0.5rem', whiteSpace: 'nowrap' }}>
                    из {item.src}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 11.3: Corporate CI Templates Library
// ============================================

type ProjectType = 'nodejs' | 'python' | 'golang'
type TemplateModule = 'docker' | 'security' | 'deploy-k8s'
type TemplateVersion = 'v1.0.0' | 'v2.0.0' | 'v2.1.0'

const LATEST_VERSION: TemplateVersion = 'v2.1.0'

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  nodejs: 'Node.js',
  python: 'Python',
  golang: 'Go',
}

const PROJECT_TYPE_ICONS: Record<ProjectType, string> = {
  nodejs: 'JS',
  python: 'Py',
  golang: 'Go',
}

const MODULE_LABELS: Record<TemplateModule, string> = {
  docker: 'Docker Build',
  security: 'Security Scan',
  'deploy-k8s': 'Deploy to K8s',
}

const MODULE_FILES: Record<TemplateModule, string> = {
  docker: 'docker.yml',
  security: 'security.yml',
  'deploy-k8s': 'deploy-k8s.yml',
}

const MODULE_JOBS: Record<TemplateModule, string[]> = {
  docker: ['docker-build', 'docker-push'],
  security: ['sast-scan', 'dependency-scan'],
  'deploy-k8s': ['deploy-staging', 'deploy-production'],
}

const BASE_JOBS: Record<ProjectType, string[]> = {
  nodejs: ['lint', 'test', 'build'],
  python: ['lint', 'test'],
  golang: ['lint', 'test', 'build'],
}

const TEMPLATE_FILES_BY_TYPE: Record<ProjectType, string> = {
  nodejs: 'nodejs.yml',
  python: 'python.yml',
  golang: 'golang.yml',
}

interface FileTreeNode {
  name: string
  type: 'dir' | 'file'
  children?: FileTreeNode[]
}

const REPO_TREE: FileTreeNode[] = [
  {
    name: 'templates',
    type: 'dir',
    children: [
      { name: 'nodejs.yml', type: 'file' },
      { name: 'python.yml', type: 'file' },
      { name: 'golang.yml', type: 'file' },
      { name: 'docker.yml', type: 'file' },
      { name: 'security.yml', type: 'file' },
      { name: 'deploy-k8s.yml', type: 'file' },
    ],
  },
  { name: 'CHANGELOG.md', type: 'file' },
  { name: 'README.md', type: 'file' },
]

function renderTree(nodes: FileTreeNode[], depth = 0): React.ReactNode {
  return nodes.map(node => (
    <div key={node.name} style={{ paddingLeft: `${depth * 16}px`, lineHeight: 1.7 }}>
      <span style={{ fontSize: '0.82rem', color: node.type === 'dir' ? '#1565C0' : '#555' }}>
        {node.type === 'dir' ? '📁' : '📄'} {node.name}
      </span>
      {node.children && renderTree(node.children, depth + 1)}
    </div>
  ))
}

function buildCorporateYaml(projectType: ProjectType, modules: TemplateModule[], version: TemplateVersion): string {
  const lines: string[] = []

  lines.push('include:')
  lines.push(`  - project: 'company/ci-templates'`)
  lines.push(`    ref: '${version}'`)
  lines.push(`    file: '/templates/${TEMPLATE_FILES_BY_TYPE[projectType]}'`)

  modules.forEach(mod => {
    lines.push(`  - project: 'company/ci-templates'`)
    lines.push(`    ref: '${version}'`)
    lines.push(`    file: '/templates/${MODULE_FILES[mod]}'`)
  })

  lines.push('')
  lines.push('stages:')
  lines.push('  - lint')
  lines.push('  - test')
  lines.push('  - build')
  if (modules.includes('docker')) lines.push('  - docker')
  if (modules.includes('security')) lines.push('  - security')
  if (modules.includes('deploy-k8s')) lines.push('  - deploy')

  lines.push('')

  const baseJobMap: Record<ProjectType, Record<string, string>> = {
    nodejs: {
      lint: '.nodejs-lint',
      test: '.nodejs-test',
      build: '.nodejs-build',
    },
    python: {
      lint: '.python-lint',
      test: '.python-test',
    },
    golang: {
      lint: '.golang-lint',
      test: '.golang-test',
      build: '.golang-build',
    },
  }

  const baseJobs = BASE_JOBS[projectType]
  baseJobs.forEach(job => {
    const tmpl = baseJobMap[projectType][job]
    lines.push(`${job}:`)
    lines.push(`  extends: ${tmpl}`)
    lines.push('')
  })

  if (modules.includes('docker')) {
    lines.push('docker-build:')
    lines.push('  extends: .docker-build')
    lines.push(`  variables:`)
    lines.push(`    IMAGE_NAME: 'my-project'`)
    lines.push('')
  }

  if (modules.includes('security')) {
    lines.push('security-scan:')
    lines.push('  extends: .security-scan')
    lines.push('')
  }

  if (modules.includes('deploy-k8s')) {
    lines.push('deploy-staging:')
    lines.push('  extends: .deploy-k8s')
    lines.push('  variables:')
    lines.push(`    KUBE_NAMESPACE: staging`)
    lines.push('  environment: staging')
    lines.push('')
    lines.push('deploy-production:')
    lines.push('  extends: .deploy-k8s')
    lines.push('  variables:')
    lines.push(`    KUBE_NAMESPACE: production`)
    lines.push('  environment: production')
    lines.push('  when: manual')
    lines.push('')
  }

  return lines.join('\n')
}

export function Task11_3_Solution() {
  const [projectType, setProjectType] = useState<ProjectType>('nodejs')
  const [selectedModules, setSelectedModules] = useState<TemplateModule[]>(['docker'])
  const [templateVersion, setTemplateVersion] = useState<TemplateVersion>('v2.1.0')
  const [copied, setCopied] = useState(false)

  const toggleModule = (mod: TemplateModule) => {
    setSelectedModules(prev =>
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    )
  }

  const yaml = buildCorporateYaml(projectType, selectedModules, templateVersion)

  const allJobs = [
    ...BASE_JOBS[projectType],
    ...selectedModules.flatMap(mod => MODULE_JOBS[mod]),
  ]

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Корпоративные CI-шаблоны</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Выбери тип проекта и модули — получи готовый `.gitlab-ci.yml`
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        {/* Left: config panel */}
        <div>
          {/* Repo tree */}
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', background: '#fafafa' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1565C0', marginBottom: '0.5rem' }}>
              company/ci-templates
            </div>
            {renderTree(REPO_TREE)}
          </div>

          {/* Project type */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#333', marginBottom: '0.5rem' }}>Тип проекта</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {(['nodejs', 'python', 'golang'] as ProjectType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setProjectType(t)}
                  style={{
                    ...btnBase,
                    background: projectType === t ? '#1565C0' : '#fff',
                    color: projectType === t ? '#fff' : '#555',
                    border: projectType === t ? '1px solid #1565C0' : '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textAlign: 'left',
                  }}
                >
                  <span style={{
                    background: projectType === t ? 'rgba(255,255,255,0.2)' : '#E3F2FD',
                    color: projectType === t ? '#fff' : '#1565C0',
                    borderRadius: '4px',
                    padding: '0.1rem 0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}>
                    {PROJECT_TYPE_ICONS[t]}
                  </span>
                  {PROJECT_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#333', marginBottom: '0.5rem' }}>Дополнительные модули</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {(['docker', 'security', 'deploy-k8s'] as TemplateModule[]).map(mod => {
                const active = selectedModules.includes(mod)
                return (
                  <label key={mod} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: '6px', background: active ? '#E8F5E9' : '#fff', border: `1px solid ${active ? '#A5D6A7' : '#ddd'}`, fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={active} onChange={() => toggleModule(mod)} style={{ accentColor: '#2E7D32' }} />
                    <span style={{ color: active ? '#2E7D32' : '#555', fontWeight: active ? 600 : 400 }}>{MODULE_LABELS[mod]}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Version */}
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#333', marginBottom: '0.5rem' }}>Версия шаблонов</div>
            <select
              style={{ ...inputStyle, background: '#fff' }}
              value={templateVersion}
              onChange={e => setTemplateVersion(e.target.value as TemplateVersion)}
            >
              <option value="v1.0.0">v1.0.0</option>
              <option value="v2.0.0">v2.0.0</option>
              <option value="v2.1.0">v2.1.0 (latest)</option>
            </select>
            {templateVersion !== LATEST_VERSION && (
              <div style={{ marginTop: '0.5rem', background: '#FFF8E1', border: '1px solid #FFD54F', borderRadius: '6px', padding: '0.5rem 0.6rem', fontSize: '0.78rem', color: '#E65100' }}>
                Доступна новая версия: {LATEST_VERSION}. Рекомендуется обновиться.
              </div>
            )}
          </div>
        </div>

        {/* Right: output */}
        <div>
          {/* Pipeline jobs list */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#333', marginBottom: '0.5rem' }}>
              Джобы пайплайна ({allJobs.length})
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {allJobs.map((job, i) => {
                const isBase = BASE_JOBS[projectType].includes(job)
                return (
                  <span key={`${job}-${i}`} style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    background: isBase ? '#E3F2FD' : '#E8F5E9',
                    color: isBase ? '#1565C0' : '#2E7D32',
                    border: `1px solid ${isBase ? '#90CAF9' : '#A5D6A7'}`,
                  }}>
                    {job}
                  </span>
                )
              })}
            </div>
          </div>

          {/* YAML output */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#333' }}>.gitlab-ci.yml</span>
              <button
                onClick={handleCopy}
                style={{
                  ...btnBase,
                  background: copied ? '#E8F5E9' : '#fff',
                  color: copied ? '#2E7D32' : '#555',
                  border: copied ? '1px solid #A5D6A7' : '1px solid #ddd',
                }}
              >
                {copied ? 'Скопировано!' : 'Скопировать YAML'}
              </button>
            </div>
            <pre style={{
              background: '#1E1E1E',
              color: '#D4D4D4',
              padding: '1rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              overflow: 'auto',
              maxHeight: '480px',
              margin: 0,
              whiteSpace: 'pre',
            }}>
              {yaml}
            </pre>
          </div>

          <div style={{ marginTop: '1rem', background: '#E3F2FD', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#1565C0' }}>
            <strong>Принцип:</strong> один репозиторий `company/ci-templates` — источник правды. Все проекты подключают нужные шаблоны через `include: file` с зафиксированной версией.
          </div>
        </div>
      </div>
    </div>
  )
}
