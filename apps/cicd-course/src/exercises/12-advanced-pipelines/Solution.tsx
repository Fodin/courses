// ============================================
// Level 12: Advanced Pipelines — Solutions
// ============================================

import { useState, useEffect } from 'react'

// ============================================
// Task 12.1: Parent-child pipelines
// ============================================

const CHILD_CONFIGS = [
  { id: 'frontend', label: 'frontend', file: 'ci/frontend.yml', dir: 'frontend/', color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9' },
  { id: 'backend', label: 'backend', file: 'ci/backend.yml', dir: 'backend/', color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7' },
  { id: 'infra', label: 'infra', file: 'ci/infra.yml', dir: 'infra/', color: '#6A1B9A', bg: '#F3E5F5', border: '#CE93D8' },
]

function buildParentYaml(strategyDepend: boolean, rulesEnabled: boolean[], children: typeof CHILD_CONFIGS): string {
  const lines = ['stages:', '  - triggers', '']
  children.forEach((child, i) => {
    lines.push(`trigger-${child.id}:`)
    lines.push('  stage: triggers')
    lines.push('  trigger:')
    lines.push(`    include: ${child.file}`)
    if (strategyDepend) lines.push('    strategy: depend')
    if (rulesEnabled[i]) {
      lines.push('  rules:')
      lines.push('    - changes:')
      lines.push(`        - ${child.dir}**/*`)
    }
    lines.push('')
  })
  return lines.join('\n').trim()
}

export function Task12_1_Solution() {
  const [strategyDepend, setStrategyDepend] = useState(true)
  const [rulesEnabled, setRulesEnabled] = useState([false, false, false])
  const [changedDirs, setChangedDirs] = useState<string[]>([])
  const [parentStatus, setParentStatus] = useState<'idle' | 'running' | 'waiting' | 'done'>('idle')
  const [childStatuses, setChildStatuses] = useState<Record<string, 'idle' | 'running' | 'done' | 'skipped'>>({
    frontend: 'idle', backend: 'idle', infra: 'idle',
  })

  const toggleRules = (i: number) => {
    setRulesEnabled(prev => prev.map((v, idx) => idx === i ? !v : v))
  }
  const toggleDir = (dir: string) => {
    setChangedDirs(prev => prev.includes(dir) ? prev.filter(d => d !== dir) : [...prev, dir])
  }

  const getActiveChildren = () => CHILD_CONFIGS.filter((child, i) => {
    if (!rulesEnabled[i]) return true
    return changedDirs.includes(child.dir)
  })

  const simulate = () => {
    setParentStatus('running')
    setChildStatuses({ frontend: 'idle', backend: 'idle', infra: 'idle' })
    const active = getActiveChildren()
    setTimeout(() => {
      setParentStatus(strategyDepend ? 'waiting' : 'done')
      const newStatuses: Record<string, 'idle' | 'running' | 'done' | 'skipped'> = { frontend: 'skipped', backend: 'skipped', infra: 'skipped' }
      active.forEach(c => { newStatuses[c.id] = 'running' })
      setChildStatuses(newStatuses)
      if (strategyDepend) {
        setTimeout(() => {
          const finalStatuses = { ...newStatuses }
          active.forEach(c => { finalStatuses[c.id] = 'done' })
          setChildStatuses(finalStatuses)
          setParentStatus('done')
        }, 1800)
      }
    }, 800)
  }

  const reset = () => {
    setParentStatus('idle')
    setChildStatuses({ frontend: 'idle', backend: 'idle', infra: 'idle' })
  }

  const statusColor: Record<string, string> = {
    idle: '#9E9E9E', running: '#1565C0', done: '#2E7D32', skipped: '#BDBDBD', waiting: '#F57C00',
  }
  const statusLabel: Record<string, string> = {
    idle: 'Ожидание', running: 'Выполняется', done: 'Завершён', skipped: 'Пропущен (rules)', waiting: 'Ожидает child...',
  }

  const yaml = buildParentYaml(strategyDepend, rulesEnabled, CHILD_CONFIGS)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Parent-child pipelines</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Иерархия пайплайнов: parent запускает child через trigger + include
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>strategy:</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[true, false].map(val => (
              <button
                key={String(val)}
                onClick={() => { setStrategyDepend(val); reset() }}
                style={{
                  padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
                  border: strategyDepend === val ? '2px solid #1565C0' : '1px solid #ccc',
                  background: strategyDepend === val ? '#E3F2FD' : '#fff',
                  fontWeight: strategyDepend === val ? 700 : 400,
                }}
              >
                {val ? 'depend' : 'без depend'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>rules:changes для child:</div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {CHILD_CONFIGS.map((c, i) => (
              <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={rulesEnabled[i]} onChange={() => { toggleRules(i); reset() }} />
                {c.dir}**/*
              </label>
            ))}
          </div>
        </div>
        {rulesEnabled.some(Boolean) && (
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Изменённые файлы:</div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {CHILD_CONFIGS.map((c, i) => rulesEnabled[i] && (
                <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={changedDirs.includes(c.dir)} onChange={() => { toggleDir(c.dir); reset() }} />
                  {c.dir}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pipeline visualization */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Parent */}
        <div style={{
          border: `2px solid ${statusColor[parentStatus]}`,
          borderRadius: '10px', padding: '0.75rem 1rem', background: '#FAFAFA',
          minWidth: '160px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>🏗️</div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Parent Pipeline</div>
          <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.25rem' }}>.gitlab-ci.yml</div>
          <div style={{
            marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 600,
            color: statusColor[parentStatus],
          }}>
            {statusLabel[parentStatus]}
            {parentStatus === 'waiting' && ' ⏳'}
          </div>
        </div>

        {/* Arrow + children */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
          {CHILD_CONFIGS.map(child => {
            const status = childStatuses[child.id]
            const isActive = status === 'running' || status === 'done'
            return (
              <div key={child.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '2px',
                  background: isActive ? child.color : '#DDD',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', right: '-6px', top: '-4px',
                    borderLeft: `8px solid ${isActive ? child.color : '#DDD'}`,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                  }} />
                </div>
                <div style={{
                  border: `2px solid ${status === 'skipped' ? '#DDD' : status === 'idle' ? child.border : statusColor[status]}`,
                  borderRadius: '8px', padding: '0.5rem 0.75rem',
                  background: status === 'skipped' ? '#F5F5F5' : child.bg,
                  minWidth: '140px', opacity: status === 'skipped' ? 0.5 : 1,
                }}>
                  <div style={{ fontWeight: 700, color: child.color, fontSize: '0.85rem' }}>{child.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#666' }}>{child.file}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: statusColor[status] || '#999', marginTop: '0.25rem' }}>
                    {statusLabel[status]}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={simulate}
          disabled={parentStatus === 'running' || parentStatus === 'waiting'}
          style={{
            padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer',
            background: '#1565C0', color: '#fff', border: 'none', fontWeight: 600,
            opacity: (parentStatus === 'running' || parentStatus === 'waiting') ? 0.6 : 1,
          }}
        >
          Симулировать запуск
        </button>
        <button
          onClick={reset}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', border: '1px solid #ccc', background: '#fff' }}
        >
          Сброс
        </button>
      </div>

      {!strategyDepend && (
        <div style={{
          background: '#FFF3E0', border: '1px solid #FFB74D', borderRadius: '8px',
          padding: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem',
        }}>
          ⚠️ Без <code>strategy: depend</code> parent pipeline завершится сразу после запуска child, не дожидаясь результатов.
        </div>
      )}

      <pre style={{
        background: '#1E1E1E', color: '#D4D4D4', padding: '1rem', borderRadius: '8px',
        fontSize: '0.8rem', overflowX: 'auto', lineHeight: 1.5,
      }}>
        {yaml}
      </pre>
    </div>
  )
}

// ============================================
// Task 12.2: Multi-project pipelines
// ============================================

type SimStep = 'idle' | 'api-running' | 'downstream-running' | 'done'

const DOWNSTREAM_PROJECTS = [
  { id: 'frontend', defaultPath: 'mygroup/frontend', color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9', icon: '🖥️' },
  { id: 'e2e-tests', defaultPath: 'mygroup/e2e-tests', color: '#6A1B9A', bg: '#F3E5F5', border: '#CE93D8', icon: '🧪' },
]

function buildMultiProjectYaml(projectPath: string, branch: string, strategyDepend: boolean, vars: Record<string, boolean>): string {
  const lines = [
    'trigger-downstream:',
    '  stage: notify',
    '  trigger:',
    `    project: ${projectPath}`,
  ]
  if (branch !== 'main') lines.push(`    branch: ${branch}`)
  if (strategyDepend) lines.push('    strategy: depend')
  const activeVars = Object.entries(vars).filter(([, v]) => v).map(([k]) => k)
  if (activeVars.length > 0) {
    lines.push('  variables:')
    activeVars.forEach(v => {
      const val = v === 'API_VERSION' ? '$CI_COMMIT_TAG' : 'production'
      lines.push(`    ${v}: ${val}`)
    })
  }
  return lines.join('\n')
}

export function Task12_2_Solution() {
  const [projectPath, setProjectPath] = useState('mygroup/frontend')
  const [branch, setBranch] = useState('main')
  const [strategyDepend, setStrategyDepend] = useState(true)
  const [vars, setVars] = useState<Record<string, boolean>>({ API_VERSION: false, DEPLOY_ENV: false })
  const [simStep, setSimStep] = useState<SimStep>('idle')

  const toggleVar = (v: string) => setVars(prev => ({ ...prev, [v]: !prev[v] }))

  const simulate = () => {
    setSimStep('api-running')
    setTimeout(() => {
      setSimStep('downstream-running')
      if (strategyDepend) {
        setTimeout(() => setSimStep('done'), 2000)
      } else {
        setSimStep('done')
      }
    }, 1000)
  }

  const getRepoStyle = (repoId: string) => {
    if (simStep === 'idle') return { border: '2px solid #CCC', bg: '#FAFAFA', color: '#666' }
    if (repoId === 'api') {
      if (simStep === 'api-running') return { border: '2px solid #1565C0', bg: '#E3F2FD', color: '#1565C0' }
      return { border: '2px solid #2E7D32', bg: '#E8F5E9', color: '#2E7D32' }
    }
    if (simStep === 'downstream-running') return { border: '2px solid #F57C00', bg: '#FFF3E0', color: '#F57C00' }
    if (simStep === 'done') return { border: '2px solid #2E7D32', bg: '#E8F5E9', color: '#2E7D32' }
    return { border: '2px solid #CCC', bg: '#FAFAFA', color: '#666' }
  }

  const apiStyle = getRepoStyle('api')
  const yaml = buildMultiProjectYaml(projectPath, branch, strategyDepend, vars)

  const quickPaths = ['mygroup/frontend', 'mygroup/e2e-tests', 'team-b/mobile-app']

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Multi-project pipelines</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Запуск пайплайнов в других репозиториях через trigger: project:
      </p>

      {/* Settings */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>trigger: project:</div>
          <input
            value={projectPath}
            onChange={e => setProjectPath(e.target.value)}
            style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.85rem', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
            {quickPaths.map(p => (
              <button key={p} onClick={() => setProjectPath(p)} style={{
                padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer',
                border: '1px solid #90CAF9', background: projectPath === p ? '#E3F2FD' : '#fff',
              }}>{p}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>branch:</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['main', 'develop', 'release'].map(b => (
              <button key={b} onClick={() => setBranch(b)} style={{
                padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
                border: branch === b ? '2px solid #1565C0' : '1px solid #ccc',
                background: branch === b ? '#E3F2FD' : '#fff',
                fontWeight: branch === b ? 700 : 400,
              }}>{b}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>strategy:</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[true, false].map(val => (
              <button key={String(val)} onClick={() => { setStrategyDepend(val); setSimStep('idle') }} style={{
                padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
                border: strategyDepend === val ? '2px solid #1565C0' : '1px solid #ccc',
                background: strategyDepend === val ? '#E3F2FD' : '#fff',
                fontWeight: strategyDepend === val ? 700 : 400,
              }}>{val ? 'depend' : 'без depend'}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>variables:</div>
          {Object.keys(vars).map(v => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem', cursor: 'pointer', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={vars[v]} onChange={() => toggleVar(v)} />
              {v}
            </label>
          ))}
        </div>
      </div>

      {/* Repos visualization */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{
          border: apiStyle.border, borderRadius: '10px', padding: '0.75rem 1.25rem',
          background: apiStyle.bg, minWidth: '120px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>⚙️</div>
          <div style={{ fontWeight: 700, color: apiStyle.color, fontSize: '0.9rem' }}>api</div>
          <div style={{ fontSize: '0.7rem', color: '#555' }}>mygroup/api</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: apiStyle.color }}>
            {simStep === 'idle' ? 'Ожидание' : simStep === 'api-running' ? 'Выполняется' : 'Завершён ✓'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {DOWNSTREAM_PROJECTS.map(proj => {
            const ds = getRepoStyle(proj.id)
            const statusText = simStep === 'idle' ? 'Ожидание'
              : simStep === 'api-running' ? 'Не запущен'
              : simStep === 'downstream-running' ? '⏳ Выполняется'
              : 'Завершён ✓'
            return (
              <div key={proj.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '32px', height: '2px',
                  background: simStep === 'downstream-running' || simStep === 'done' ? proj.color : '#DDD',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', right: '-6px', top: '-4px',
                    borderLeft: `8px solid ${simStep === 'downstream-running' || simStep === 'done' ? proj.color : '#DDD'}`,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                  }} />
                </div>
                <div style={{
                  border: ds.border, borderRadius: '8px', padding: '0.5rem 0.75rem',
                  background: ds.bg, minWidth: '170px',
                }}>
                  <div style={{ fontWeight: 700, color: proj.color, fontSize: '0.85rem' }}>{proj.icon} {proj.id}</div>
                  <div style={{ fontSize: '0.7rem', color: '#555' }}>{projectPath.includes(proj.id) ? projectPath : `mygroup/${proj.id}`}</div>
                  <div style={{ fontSize: '0.75rem', color: ds.color, marginTop: '0.25rem' }}>{statusText}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={simulate}
          disabled={simStep === 'api-running' || simStep === 'downstream-running'}
          style={{
            padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer',
            background: '#1565C0', color: '#fff', border: 'none', fontWeight: 600,
            opacity: (simStep === 'api-running' || simStep === 'downstream-running') ? 0.6 : 1,
          }}
        >
          Симулировать запуск
        </button>
        <button
          onClick={() => setSimStep('idle')}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', border: '1px solid #ccc', background: '#fff' }}
        >
          Сброс
        </button>
      </div>

      <pre style={{
        background: '#1E1E1E', color: '#D4D4D4', padding: '1rem', borderRadius: '8px',
        fontSize: '0.8rem', overflowX: 'auto', lineHeight: 1.5,
      }}>
        {yaml}
      </pre>
    </div>
  )
}

// ============================================
// Task 12.3: Dynamic child pipelines
// ============================================

function generateChildYaml(services: string[]): string {
  if (services.length === 0) return '# Нет сервисов — пустой конфиг'
  const lines = ['stages:', '  - test', '']
  services.forEach(svc => {
    lines.push(`test-${svc}:`)
    lines.push('  stage: test')
    lines.push('  script:')
    lines.push(`    - cd services/${svc} && npm test`)
    lines.push('  rules:')
    lines.push('    - changes:')
    lines.push(`        - services/${svc}/**/*`)
    lines.push('')
  })
  return lines.join('\n').trim()
}

const PARENT_YAML = `# .gitlab-ci.yml

stages:
  - generate
  - trigger

generate-pipeline:
  stage: generate
  image: python:3.11
  script:
    - python scripts/generate_pipeline.py > generated-pipeline.yml
  artifacts:
    paths:
      - generated-pipeline.yml

trigger-dynamic:
  stage: trigger
  trigger:
    include:
      - artifact: generated-pipeline.yml
        job: generate-pipeline
    strategy: depend`

export function Task12_3_Solution() {
  const [services, setServices] = useState(['frontend', 'backend', 'payments'])
  const [newService, setNewService] = useState('')
  const [activeTab, setActiveTab] = useState<'parent' | 'generated'>('parent')

  const addService = () => {
    const name = newService.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    if (name && !services.includes(name)) {
      setServices(prev => [...prev, name])
      setNewService('')
    }
  }

  const removeService = (svc: string) => setServices(prev => prev.filter(s => s !== svc))

  const generatedYaml = generateChildYaml(services)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Dynamic child pipelines</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Генерация YAML на лету — число джобов определяется составом сервисов
      </p>

      {/* Flow diagram */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'generate-pipeline', sub: 'создаёт YAML', icon: '⚙️', color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9' },
          { label: 'generated-pipeline.yml', sub: 'артефакт', icon: '📄', color: '#E65100', bg: '#FFF3E0', border: '#FFCC80' },
          { label: 'trigger-dynamic', sub: 'include:artifact', icon: '🚀', color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7' },
          { label: 'Dynamic Child', sub: `${services.length} джобов`, icon: '🔀', color: '#6A1B9A', bg: '#F3E5F5', border: '#CE93D8' },
        ].map((step, i, arr) => (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              border: `2px solid ${step.border}`, borderRadius: '10px',
              padding: '0.6rem 0.9rem', background: step.bg,
              minWidth: '120px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.2rem' }}>{step.icon}</div>
              <div style={{ fontWeight: 700, color: step.color, fontSize: '0.8rem', marginTop: '0.2rem' }}>{step.label}</div>
              <div style={{ fontSize: '0.7rem', color: '#666' }}>{step.sub}</div>
            </div>
            {i < arr.length - 1 && (
              <div style={{ padding: '0 0.5rem', color: '#1565C0', fontSize: '1.2rem', fontWeight: 700 }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* Services list */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Сервисы в services/:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {services.map(svc => (
            <div key={svc} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: '#E3F2FD', border: '1px solid #90CAF9',
              borderRadius: '20px', padding: '0.3rem 0.7rem', fontSize: '0.85rem',
            }}>
              <span style={{ color: '#1565C0', fontWeight: 600 }}>{svc}</span>
              <button
                onClick={() => removeService(svc)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#D32F2F', fontWeight: 700, padding: '0', lineHeight: 1, fontSize: '0.9rem',
                }}
              >×</button>
            </div>
          ))}
          {services.length === 0 && (
            <div style={{ color: '#D32F2F', fontSize: '0.85rem', padding: '0.3rem 0' }}>
              ⚠️ Список пустой — сгенерированный конфиг будет пустым
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={newService}
            onChange={e => setNewService(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addService()}
            placeholder="Название сервиса (enter)"
            style={{ padding: '0.4rem 0.7rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.85rem', width: '200px' }}
          />
          <button
            onClick={addService}
            style={{ padding: '0.4rem 0.9rem', borderRadius: '6px', background: '#1565C0', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            + Добавить
          </button>
        </div>
      </div>

      {/* YAML tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '0', borderBottom: '2px solid #E0E0E0' }}>
        {(['parent', 'generated'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1.2rem', cursor: 'pointer', border: 'none',
              background: activeTab === tab ? '#1E1E1E' : '#F5F5F5',
              color: activeTab === tab ? '#D4D4D4' : '#666',
              fontWeight: activeTab === tab ? 700 : 400,
              borderRadius: '6px 6px 0 0',
              fontSize: '0.85rem',
            }}
          >
            {tab === 'parent' ? '.gitlab-ci.yml (parent)' : `generated-pipeline.yml (${services.length} джобов)`}
          </button>
        ))}
      </div>
      <pre style={{
        background: '#1E1E1E', color: '#D4D4D4', padding: '1rem', borderRadius: '0 8px 8px 8px',
        fontSize: '0.8rem', overflowX: 'auto', lineHeight: 1.5, margin: 0,
      }}>
        {activeTab === 'parent' ? PARENT_YAML : generatedYaml}
      </pre>
    </div>
  )
}

// ============================================
// Task 12.4: DAG with needs
// ============================================

type JobName = 'build-frontend' | 'build-backend' | 'test-frontend' | 'test-backend' | 'deploy'

const JOBS_CONFIG: { id: JobName; label: string; stage: string; needs: JobName[]; color: string; bg: string; border: string }[] = [
  { id: 'build-frontend', label: 'build-frontend', stage: 'build', needs: [], color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9' },
  { id: 'build-backend', label: 'build-backend', stage: 'build', needs: [], color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9' },
  { id: 'test-frontend', label: 'test-frontend', stage: 'test', needs: ['build-frontend'], color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7' },
  { id: 'test-backend', label: 'test-backend', stage: 'test', needs: ['build-backend'], color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7' },
  { id: 'deploy', label: 'deploy', stage: 'deploy', needs: ['test-frontend', 'test-backend'], color: '#E65100', bg: '#FFF3E0', border: '#FFCC80' },
]

const DEFAULT_DURATIONS: Record<JobName, number> = {
  'build-frontend': 2,
  'build-backend': 8,
  'test-frontend': 3,
  'test-backend': 4,
  'deploy': 2,
}

function calcLinearTime(durations: Record<JobName, number>): number {
  const buildMax = Math.max(durations['build-frontend'], durations['build-backend'])
  const testMax = Math.max(durations['test-frontend'], durations['test-backend'])
  return buildMax + testMax + durations['deploy']
}

function calcDagTime(durations: Record<JobName, number>): number {
  const pathFrontend = durations['build-frontend'] + durations['test-frontend']
  const pathBackend = durations['build-backend'] + durations['test-backend']
  return Math.max(pathFrontend, pathBackend) + durations['deploy']
}

function getCriticalPath(durations: Record<JobName, number>): JobName[] {
  const pathFrontend = durations['build-frontend'] + durations['test-frontend']
  const pathBackend = durations['build-backend'] + durations['test-backend']
  if (pathFrontend >= pathBackend) {
    return ['build-frontend', 'test-frontend', 'deploy']
  }
  return ['build-backend', 'test-backend', 'deploy']
}

function buildDagYaml(durations: Record<JobName, number>): string {
  return `stages:
  - build
  - test
  - deploy

build-frontend:
  stage: build
  script: npm run build:frontend
  artifacts:
    paths: [dist/frontend/]

build-backend:
  stage: build
  script: go build ./...
  artifacts:
    paths: [bin/server]

test-frontend:
  stage: test
  needs:
    - job: build-frontend
      artifacts: true
  script: npm run test:frontend

test-backend:
  stage: test
  needs:
    - job: build-backend
      artifacts: true
  script: go test ./...

deploy:
  stage: deploy
  needs:
    - job: test-frontend
    - job: test-backend
  script: ./deploy.sh
  # Total time: ${calcDagTime(durations)} min (vs ${calcLinearTime(durations)} min linear)`
}

export function Task12_4_Solution() {
  const [dagMode, setDagMode] = useState(false)
  const [durations, setDurations] = useState<Record<JobName, number>>({ ...DEFAULT_DURATIONS })
  const [showYaml, setShowYaml] = useState(false)

  const linearTime = calcLinearTime(durations)
  const dagTime = calcDagTime(durations)
  const saving = linearTime - dagTime
  const criticalPath = getCriticalPath(durations)

  const setDuration = (job: JobName, val: number) => {
    setDurations(prev => ({ ...prev, [job]: val }))
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>DAG: Directed Acyclic Graph с needs</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Убираем барьеры между stages — каждый джоб стартует сразу после своих зависимостей
      </p>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Режим:</span>
        {[false, true].map(mode => (
          <button
            key={String(mode)}
            onClick={() => setDagMode(mode)}
            style={{
              padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600,
              border: dagMode === mode ? '2px solid #1565C0' : '1px solid #ccc',
              background: dagMode === mode ? '#1565C0' : '#fff',
              color: dagMode === mode ? '#fff' : '#333',
            }}
          >
            {mode ? 'DAG (needs)' : 'Линейный (stages)'}
          </button>
        ))}
      </div>

      {/* Time summary */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap',
      }}>
        {[
          { label: 'Линейный', value: linearTime, color: dagMode ? '#999' : '#D32F2F', bg: dagMode ? '#F5F5F5' : '#FFEBEE' },
          { label: 'DAG', value: dagTime, color: dagMode ? '#2E7D32' : '#999', bg: dagMode ? '#E8F5E9' : '#F5F5F5' },
          { label: 'Экономия', value: saving, color: '#1565C0', bg: '#E3F2FD', suffix: ' мин' },
        ].map(item => (
          <div key={item.label} style={{
            background: item.bg, border: `1px solid ${item.color}33`,
            borderRadius: '8px', padding: '0.75rem 1.25rem', textAlign: 'center', minWidth: '100px',
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: item.color }}>
              {item.value}{item.suffix ?? ' мин'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.25rem' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Pipeline visualization */}
      <div style={{ marginBottom: '1.5rem' }}>
        {dagMode ? (
          // DAG view
          <div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Build column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['build-frontend', 'build-backend'].map(jobId => {
                  const job = JOBS_CONFIG.find(j => j.id === jobId)!
                  const isCritical = criticalPath.includes(jobId as JobName)
                  return (
                    <div key={jobId} style={{
                      border: `2px solid ${isCritical ? '#F57C00' : job.border}`,
                      borderRadius: '8px', padding: '0.6rem 0.8rem',
                      background: isCritical ? '#FFF8E1' : job.bg,
                      minWidth: '140px',
                    }}>
                      <div style={{ fontWeight: 700, color: job.color, fontSize: '0.8rem' }}>{job.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#555' }}>{durations[job.id]} мин</div>
                      {isCritical && <div style={{ fontSize: '0.7rem', color: '#F57C00' }}>🔥 критический путь</div>}
                    </div>
                  )
                })}
              </div>

              <div style={{ color: '#1565C0', fontSize: '1.5rem', alignSelf: 'center' }}>→</div>

              {/* Test column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['test-frontend', 'test-backend'].map(jobId => {
                  const job = JOBS_CONFIG.find(j => j.id === jobId)!
                  const isCritical = criticalPath.includes(jobId as JobName)
                  const needsJob = job.needs[0]
                  const startTime = durations[needsJob as JobName]
                  return (
                    <div key={jobId} style={{
                      border: `2px solid ${isCritical ? '#F57C00' : job.border}`,
                      borderRadius: '8px', padding: '0.6rem 0.8rem',
                      background: isCritical ? '#FFF8E1' : job.bg,
                      minWidth: '140px',
                    }}>
                      <div style={{ fontWeight: 700, color: job.color, fontSize: '0.8rem' }}>{job.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#555' }}>старт: {startTime} мин</div>
                      <div style={{ fontSize: '0.75rem', color: '#555' }}>длит.: {durations[job.id]} мин</div>
                      {isCritical && <div style={{ fontSize: '0.7rem', color: '#F57C00' }}>🔥 критический путь</div>}
                    </div>
                  )
                })}
              </div>

              <div style={{ color: '#1565C0', fontSize: '1.5rem', alignSelf: 'center' }}>→</div>

              {/* Deploy */}
              <div style={{ alignSelf: 'center' }}>
                {(() => {
                  const job = JOBS_CONFIG.find(j => j.id === 'deploy')!
                  return (
                    <div style={{
                      border: `2px solid ${job.border}`, borderRadius: '8px',
                      padding: '0.6rem 0.8rem', background: job.bg, minWidth: '120px',
                    }}>
                      <div style={{ fontWeight: 700, color: job.color, fontSize: '0.8rem' }}>{job.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#555' }}>старт: {dagTime - durations['deploy']} мин</div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        ) : (
          // Linear view
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['build', 'test', 'deploy'].map((stage, si, stages) => {
              const stageJobs = JOBS_CONFIG.filter(j => j.stage === stage)
              const stageMax = Math.max(...stageJobs.map(j => durations[j.id]))
              return (
                <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    border: '2px solid #CCC', borderRadius: '8px', padding: '0.6rem',
                    background: '#FAFAFA', minWidth: '140px',
                  }}>
                    <div style={{ fontWeight: 700, color: '#555', fontSize: '0.75rem', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                      Stage: {stage}
                    </div>
                    {stageJobs.map(job => (
                      <div key={job.id} style={{
                        border: `1px solid ${job.border}`, borderRadius: '6px',
                        padding: '0.35rem 0.5rem', background: job.bg,
                        marginBottom: '0.4rem', fontSize: '0.78rem',
                      }}>
                        <div style={{ fontWeight: 600, color: job.color }}>{job.label}</div>
                        <div style={{ color: '#555' }}>{durations[job.id]} мин</div>
                      </div>
                    ))}
                    <div style={{ fontSize: '0.72rem', color: '#D32F2F', fontWeight: 600 }}>Барьер: {stageMax} мин</div>
                  </div>
                  {si < stages.length - 1 && (
                    <div style={{ color: '#D32F2F', fontSize: '1.3rem' }}>⛔</div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Duration controls */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Длительность джобов (мин):</div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {JOBS_CONFIG.map(job => (
            <div key={job.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '140px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: job.color }}>{job.label}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input
                  type="range" min={1} max={20} value={durations[job.id]}
                  onChange={e => setDuration(job.id, Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '28px' }}>{durations[job.id]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowYaml(v => !v)}
        style={{
          padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer',
          border: '1px solid #90CAF9', background: '#E3F2FD', marginBottom: '0.5rem',
        }}
      >
        {showYaml ? 'Скрыть YAML' : 'Показать YAML с needs'}
      </button>

      {showYaml && (
        <pre style={{
          background: '#1E1E1E', color: '#D4D4D4', padding: '1rem', borderRadius: '8px',
          fontSize: '0.8rem', overflowX: 'auto', lineHeight: 1.5,
        }}>
          {buildDagYaml(durations)}
        </pre>
      )}
    </div>
  )
}
