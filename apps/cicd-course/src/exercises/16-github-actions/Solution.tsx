// ============================================
// Level 16: GitHub Actions — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 16.1: Workflow basics — events, jobs, steps, runs-on
// ============================================

const TRIGGERS = [
  { id: 'push', label: 'push', desc: 'При пуше в ветку' },
  { id: 'pull_request', label: 'pull_request', desc: 'При открытии PR' },
  { id: 'schedule', label: 'schedule', desc: 'По расписанию (cron)' },
  { id: 'workflow_dispatch', label: 'workflow_dispatch', desc: 'Ручной запуск' },
]

const RUNNERS = ['ubuntu-latest', 'windows-latest', 'macos-latest']

const JOBS_LIST = [
  { id: 'lint', label: 'lint', icon: '🔍', color: '#7B1FA2', bg: '#F3E5F5', border: '#CE93D8' },
  { id: 'test', label: 'test', icon: '🧪', color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9' },
  { id: 'build', label: 'build', icon: '🔨', color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7' },
]

function buildGitHubYaml(triggers: string[], cron: string, runner: string, activeJobs: string[]): string {
  const onBlock = triggers.map(t => {
    if (t === 'schedule') return `  schedule:\n    - cron: '${cron}'`
    if (t === 'workflow_dispatch') return `  workflow_dispatch:`
    if (t === 'push') return `  push:\n    branches: [main, develop]`
    if (t === 'pull_request') return `  pull_request:\n    branches: [main]`
    return `  ${t}:`
  }).join('\n')

  const hasLint = activeJobs.includes('lint')
  const hasTest = activeJobs.includes('test')
  const hasBuild = activeJobs.includes('build')

  const lintJob = hasLint ? `
  lint:
    runs-on: ${runner}
    steps:
      - uses: actions/checkout@v4
      - name: Run linter
        run: npm run lint` : ''

  const testNeeds = hasLint ? '\n    needs: lint' : ''
  const testJob = hasTest ? `
  test:
    runs-on: ${runner}${testNeeds}
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test` : ''

  const buildDeps = [hasLint && 'lint', hasTest && 'test'].filter(Boolean)
  const buildNeeds = buildDeps.length > 0 ? `\n    needs: [${buildDeps.join(', ')}]` : ''
  const buildJob = hasBuild ? `
  build:
    runs-on: ${runner}${buildNeeds}
    steps:
      - uses: actions/checkout@v4
      - name: Build project
        run: npm run build` : ''

  return `name: CI

on:
${onBlock || '  push:'}

jobs:${lintJob}${testJob}${buildJob}`
}

function buildGitLabYaml(triggers: string[], cron: string, activeJobs: string[]): string {
  const hasLint = activeJobs.includes('lint')
  const hasTest = activeJobs.includes('test')
  const hasBuild = activeJobs.includes('build')

  const scheduleComment = triggers.includes('schedule')
    ? `# Расписание настраивается в Settings → CI/CD → Schedules\n# cron: ${cron}\n\n`
    : ''

  const manualHint = triggers.includes('workflow_dispatch')
    ? `# Ручной запуск: when: manual на нужном джобе\n\n`
    : ''

  const stages = activeJobs.map(j => `  - ${j}`).join('\n')

  const lintJob = hasLint ? `
lint:
  stage: lint
  script:
    - npm run lint` : ''

  const testJob = hasTest ? `
test:
  stage: test
  script:
    - npm test` : ''

  const buildJob = hasBuild ? `
build:
  stage: build
  script:
    - npm run build` : ''

  return `${scheduleComment}${manualHint}stages:
${stages}
${lintJob}${testJob}${buildJob}`
}

export function Task16_1_Solution() {
  const [activeTriggers, setActiveTriggers] = useState<string[]>(['push', 'pull_request'])
  const [cron, setCron] = useState('0 2 * * *')
  const [runner, setRunner] = useState('ubuntu-latest')
  const [activeJobs, setActiveJobs] = useState<string[]>(['lint', 'test', 'build'])

  const toggleTrigger = (id: string) => {
    setActiveTriggers(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const toggleJob = (id: string) => {
    setActiveJobs(prev =>
      prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
    )
  }

  const ghYaml = buildGitHubYaml(activeTriggers, cron, runner, activeJobs)
  const glYaml = buildGitLabYaml(activeTriggers, cron, activeJobs)

  const codeStyle: React.CSSProperties = {
    background: '#1e1e2e',
    color: '#cdd6f4',
    padding: '1rem',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '12px',
    whiteSpace: 'pre',
    overflowX: 'auto',
    lineHeight: '1.6',
    flex: 1,
    minWidth: 0,
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>GitHub Actions: Основы Workflow</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Настрой триггеры и джобы — сравни GitHub Actions и GitLab CI
      </p>

      {/* Controls row */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>

        {/* Triggers */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '14px' }}>Триггеры (on:)</div>
          {TRIGGERS.map(t => (
            <div key={t.id} style={{ marginBottom: '0.4rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type='checkbox'
                  checked={activeTriggers.includes(t.id)}
                  onChange={() => toggleTrigger(t.id)}
                />
                <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 500 }}>{t.label}</span>
                <span style={{ color: '#888', fontSize: '12px' }}>{t.desc}</span>
              </label>
              {t.id === 'schedule' && activeTriggers.includes('schedule') && (
                <div style={{ marginLeft: '1.5rem', marginTop: '0.3rem' }}>
                  <input
                    type='text'
                    value={cron}
                    onChange={e => setCron(e.target.value)}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      padding: '3px 8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      width: '150px',
                    }}
                  />
                  <span style={{ marginLeft: '0.5rem', color: '#888', fontSize: '11px' }}>cron</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Runner */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '14px' }}>runs-on</div>
          {RUNNERS.map(r => (
            <button
              key={r}
              onClick={() => setRunner(r)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                marginBottom: '0.4rem',
                padding: '0.4rem 0.75rem',
                fontFamily: 'monospace',
                fontSize: '12px',
                background: runner === r ? '#1565C0' : '#f5f5f5',
                color: runner === r ? '#fff' : '#333',
                border: '1px solid ' + (runner === r ? '#1565C0' : '#ddd'),
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Jobs */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '14px' }}>Джобы</div>
          {JOBS_LIST.map(job => (
            <label
              key={job.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.4rem',
                cursor: 'pointer',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                border: `1px solid ${activeJobs.includes(job.id) ? job.border : '#ddd'}`,
                background: activeJobs.includes(job.id) ? job.bg : '#fafafa',
              }}
            >
              <input
                type='checkbox'
                checked={activeJobs.includes(job.id)}
                onChange={() => toggleJob(job.id)}
              />
              <span>{job.icon}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '13px', color: job.color, fontWeight: 500 }}>
                {job.label}
              </span>
            </label>
          ))}

          {/* Jobs flow */}
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
            {JOBS_LIST.filter(j => activeJobs.includes(j.id)).map((job, i, arr) => (
              <div key={job.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{
                  padding: '2px 8px',
                  background: job.bg,
                  border: `1px solid ${job.border}`,
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: job.color,
                }}>
                  {job.label}
                </span>
                {i < arr.length - 1 && <span style={{ color: '#999' }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key difference notice */}
      <div style={{
        background: '#FFF8E1',
        border: '1px solid #FFD54F',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        fontSize: '13px',
      }}>
        <strong>Ключевое отличие от GitLab CI:</strong> В GitLab код репозитория клонируется автоматически.
        В GitHub Actions нужен явный шаг <code style={{ background: '#ffe', padding: '1px 4px', borderRadius: '3px' }}>uses: actions/checkout@v4</code> в каждом джобе.
      </div>

      {/* YAML comparison */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '13px', color: '#1565C0' }}>
            GitHub Actions
          </div>
          <div style={codeStyle}>{ghYaml}</div>
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '13px', color: '#E65100' }}>
            GitLab CI (эквивалент)
          </div>
          <div style={codeStyle}>{glYaml}</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 16.2: Actions Marketplace — uses, with, secrets
// ============================================

const ACTIONS_CATALOG = [
  {
    id: 'checkout',
    name: 'actions/checkout@v4',
    desc: 'Клонирует код репозитория',
    category: 'Обязательный',
    categoryColor: '#D32F2F',
    icon: '📥',
  },
  {
    id: 'setup-node',
    name: 'actions/setup-node@v4',
    desc: 'Устанавливает Node.js',
    category: 'Runtime',
    categoryColor: '#2E7D32',
    icon: '⬡',
  },
  {
    id: 'setup-python',
    name: 'actions/setup-python@v5',
    desc: 'Устанавливает Python',
    category: 'Runtime',
    categoryColor: '#2E7D32',
    icon: '🐍',
  },
  {
    id: 'upload-artifact',
    name: 'actions/upload-artifact@v4',
    desc: 'Сохраняет артефакты между джобами',
    category: 'Артефакты',
    categoryColor: '#1565C0',
    icon: '📦',
  },
  {
    id: 'cache',
    name: 'actions/cache@v4',
    desc: 'Кэшируёт директории между запусками',
    category: 'Кэш',
    categoryColor: '#7B1FA2',
    icon: '⚡',
  },
]

type SecretEntry = { id: number; envName: string; secretName: string }

function buildStepYaml(
  actionId: string,
  nodeVersion: string,
  useNodeCache: boolean,
  pythonVersion: string,
  artifactName: string,
  artifactPath: string,
  retentionDays: string,
  secrets: SecretEntry[]
): string {
  const secretsBlock = secrets.length > 0
    ? `\n      env:\n${secrets.map(s => `        ${s.envName || 'ENV_VAR'}: \${{ secrets.${s.secretName || 'SECRET_NAME'} }}`).join('\n')}`
    : ''

  if (actionId === 'checkout') {
    return `- uses: actions/checkout@v4${secretsBlock}`
  }
  if (actionId === 'setup-node') {
    const cacheParam = useNodeCache ? `\n        cache: 'npm'` : ''
    return `- uses: actions/setup-node@v4
      with:
        node-version: '${nodeVersion}'${cacheParam}${secretsBlock}`
  }
  if (actionId === 'setup-python') {
    return `- uses: actions/setup-python@v5
      with:
        python-version: '${pythonVersion}'
        cache: 'pip'${secretsBlock}`
  }
  if (actionId === 'upload-artifact') {
    return `- uses: actions/upload-artifact@v4
      with:
        name: ${artifactName || 'build-output'}
        path: ${artifactPath || 'dist/'}
        retention-days: ${retentionDays}${secretsBlock}`
  }
  if (actionId === 'cache') {
    return `- uses: actions/cache@v4
      with:
        path: ~/.npm
        key: \${{ runner.os }}-npm-\${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          \${{ runner.os }}-npm-${secretsBlock}`
  }
  return ''
}

export function Task16_2_Solution() {
  const [selectedAction, setSelectedAction] = useState('setup-node')
  const [nodeVersion, setNodeVersion] = useState('20')
  const [useNodeCache, setUseNodeCache] = useState(true)
  const [pythonVersion, setPythonVersion] = useState('3.11')
  const [artifactName, setArtifactName] = useState('build-output')
  const [artifactPath, setArtifactPath] = useState('dist/')
  const [retentionDays, setRetentionDays] = useState('7')
  const [secrets, setSecrets] = useState<SecretEntry[]>([])
  const [nextId, setNextId] = useState(1)

  const addSecret = () => {
    setSecrets(prev => [...prev, { id: nextId, envName: '', secretName: '' }])
    setNextId(n => n + 1)
  }

  const removeSecret = (id: number) => {
    setSecrets(prev => prev.filter(s => s.id !== id))
  }

  const updateSecret = (id: number, field: 'envName' | 'secretName', value: string) => {
    setSecrets(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const yaml = buildStepYaml(
    selectedAction, nodeVersion, useNodeCache, pythonVersion,
    artifactName, artifactPath, retentionDays, secrets
  )

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Actions Marketplace</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Выбери action, настрой параметры и добавь секреты
      </p>

      {/* Catalog */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {ACTIONS_CATALOG.map(action => (
          <div
            key={action.id}
            onClick={() => setSelectedAction(action.id)}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: selectedAction === action.id ? '2px solid #1565C0' : '2px solid #e0e0e0',
              background: selectedAction === action.id ? '#E3F2FD' : '#fafafa',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '0.3rem' }}>{action.icon}</div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 600, color: '#333', marginBottom: '0.3rem', wordBreak: 'break-all' }}>
              {action.name}
            </div>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: '0.4rem' }}>{action.desc}</div>
            <span style={{
              fontSize: '10px',
              padding: '1px 6px',
              background: action.categoryColor + '20',
              color: action.categoryColor,
              borderRadius: '10px',
              border: `1px solid ${action.categoryColor}40`,
            }}>
              {action.category}
            </span>
          </div>
        ))}
      </div>

      {/* Parameters for selected action */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '14px' }}>Параметры (with:)</div>

          {selectedAction === 'setup-node' && (
            <div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '0.4rem' }}>node-version</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {['18', '20', '22'].map(v => (
                  <button
                    key={v}
                    onClick={() => setNodeVersion(v)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      background: nodeVersion === v ? '#1565C0' : '#f5f5f5',
                      color: nodeVersion === v ? '#fff' : '#333',
                      border: '1px solid ' + (nodeVersion === v ? '#1565C0' : '#ddd'),
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type='checkbox' checked={useNodeCache} onChange={e => setUseNodeCache(e.target.checked)} />
                <span style={{ fontSize: '13px' }}>cache: npm (автокэш зависимостей)</span>
              </label>
            </div>
          )}

          {selectedAction === 'setup-python' && (
            <div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '0.4rem' }}>python-version</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['3.10', '3.11', '3.12'].map(v => (
                  <button
                    key={v}
                    onClick={() => setPythonVersion(v)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      background: pythonVersion === v ? '#2E7D32' : '#f5f5f5',
                      color: pythonVersion === v ? '#fff' : '#333',
                      border: '1px solid ' + (pythonVersion === v ? '#2E7D32' : '#ddd'),
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedAction === 'upload-artifact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '3px' }}>name</div>
                <input
                  type='text'
                  value={artifactName}
                  onChange={e => setArtifactName(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '12px', padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', width: '180px' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '3px' }}>path</div>
                <input
                  type='text'
                  value={artifactPath}
                  onChange={e => setArtifactPath(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '12px', padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', width: '180px' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '3px' }}>retention-days</div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {['1', '7', '30'].map(d => (
                    <button
                      key={d}
                      onClick={() => setRetentionDays(d)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        fontSize: '12px',
                        background: retentionDays === d ? '#1565C0' : '#f5f5f5',
                        color: retentionDays === d ? '#fff' : '#333',
                        border: '1px solid ' + (retentionDays === d ? '#1565C0' : '#ddd'),
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {d} дн.
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(selectedAction === 'checkout' || selectedAction === 'cache') && (
            <div style={{ color: '#888', fontSize: '13px' }}>
              Этот action не требует дополнительных параметров для базового использования.
            </div>
          )}
        </div>

        {/* Secrets */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '14px' }}>Секреты (env:)</div>
          {secrets.map(s => (
            <div key={s.id} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <input
                type='text'
                value={s.envName}
                onChange={e => updateSecret(s.id, 'envName', e.target.value)}
                placeholder='ENV_NAME'
                style={{ fontFamily: 'monospace', fontSize: '11px', padding: '4px 6px', border: '1px solid #ccc', borderRadius: '4px', width: '90px' }}
              />
              <span style={{ color: '#888', fontSize: '11px' }}>←</span>
              <input
                type='text'
                value={s.secretName}
                onChange={e => updateSecret(s.id, 'secretName', e.target.value)}
                placeholder='SECRET_KEY'
                style={{ fontFamily: 'monospace', fontSize: '11px', padding: '4px 6px', border: '1px solid #ccc', borderRadius: '4px', width: '90px' }}
              />
              <button
                onClick={() => removeSecret(s.id)}
                style={{ padding: '2px 8px', fontSize: '12px', background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', borderRadius: '4px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addSecret}
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '12px',
              background: '#E8F5E9',
              color: '#2E7D32',
              border: '1px solid #A5D6A7',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            + Добавить секрет
          </button>

          <div style={{
            marginTop: '0.75rem',
            padding: '0.5rem 0.75rem',
            background: '#FFF3E0',
            border: '1px solid #FFE0B2',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#E65100',
          }}>
            Секреты доступны только как <code>{'${{ secrets.NAME }}'}</code> — GitHub автоматически маскирует их в логах.
          </div>
        </div>
      </div>

      {/* YAML output */}
      <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '13px' }}>Итоговый шаг:</div>
      <div style={{
        background: '#1e1e2e',
        color: '#cdd6f4',
        padding: '1rem',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '13px',
        whiteSpace: 'pre',
        overflowX: 'auto',
      }}>
        {yaml}
      </div>
    </div>
  )
}

// ============================================
// Task 16.3: Matrix Strategy
// ============================================

const OS_OPTIONS = ['ubuntu-latest', 'windows-latest', 'macos-latest']
const NODE_OPTIONS = ['18', '20', '22']

type ExcludedCell = { os: string; node: string }

function buildMatrixYaml(
  selectedOS: string[],
  selectedNode: string[],
  failFast: boolean,
  maxParallel: number,
  excluded: ExcludedCell[]
): string {
  const osLine = `        os: [${selectedOS.join(', ')}]`
  const nodeLine = `        node-version: ['${selectedNode.join("', '")}']`

  const excludeBlock = excluded.length > 0
    ? `\n      exclude:\n${excluded.map(e => `        - os: ${e.os}\n          node-version: '${e.node}'`).join('\n')}`
    : ''

  const failFastLine = failFast ? '' : '\n      fail-fast: false'
  const maxParallelLine = maxParallel < selectedOS.length * selectedNode.length
    ? `\n      max-parallel: ${maxParallel}`
    : ''

  return `jobs:
  test:
    runs-on: \${{ matrix.os }}
    strategy:${failFastLine}${maxParallelLine}
      matrix:
${osLine}
${nodeLine}${excludeBlock}

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
      - run: npm test`
}

export function Task16_3_Solution() {
  const [selectedOS, setSelectedOS] = useState<string[]>(['ubuntu-latest', 'windows-latest'])
  const [selectedNode, setSelectedNode] = useState<string[]>(['18', '20'])
  const [failFast, setFailFast] = useState(true)
  const [maxParallel, setMaxParallel] = useState(6)
  const [excluded, setExcluded] = useState<ExcludedCell[]>([])

  const toggleOS = (os: string) => {
    setSelectedOS(prev => prev.includes(os) ? prev.filter(o => o !== os) : [...prev, os])
  }

  const toggleNode = (n: string) => {
    setSelectedNode(prev => prev.includes(n) ? prev.filter(v => v !== n) : [...prev, n])
  }

  const toggleExclude = (os: string, node: string) => {
    const exists = excluded.some(e => e.os === os && e.node === node)
    if (exists) {
      setExcluded(prev => prev.filter(e => !(e.os === os && e.node === node)))
    } else {
      setExcluded(prev => [...prev, { os, node }])
    }
  }

  const totalJobs = selectedOS.length * selectedNode.length
  const activeJobs = totalJobs - excluded.filter(
    e => selectedOS.includes(e.os) && selectedNode.includes(e.node)
  ).length

  const yaml = buildMatrixYaml(selectedOS, selectedNode, failFast, maxParallel, excluded)

  const chipStyle = (active: boolean, color = '#1565C0'): React.CSSProperties => ({
    padding: '0.35rem 0.75rem',
    fontSize: '12px',
    fontFamily: 'monospace',
    background: active ? color : '#f5f5f5',
    color: active ? '#fff' : '#333',
    border: '1px solid ' + (active ? color : '#ddd'),
    borderRadius: '6px',
    cursor: 'pointer',
  })

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Matrix Strategy</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Выбери оси матрицы — кликни на ячейку, чтобы исключить комбинацию
      </p>

      {/* Config row */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '0.5rem' }}>OS (runs-on)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {OS_OPTIONS.map(os => (
              <button key={os} onClick={() => toggleOS(os)} style={chipStyle(selectedOS.includes(os), '#E65100')}>
                {os}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '0.5rem' }}>node-version</div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {NODE_OPTIONS.map(n => (
              <button key={n} onClick={() => toggleNode(n)} style={chipStyle(selectedNode.includes(n), '#2E7D32')}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '0.5rem' }}>Опции</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', cursor: 'pointer' }}>
            <input type='checkbox' checked={failFast} onChange={e => setFailFast(e.target.checked)} />
            <span style={{ fontSize: '13px' }}>fail-fast</span>
            {failFast && <span style={{ fontSize: '11px', color: '#D32F2F', background: '#FFEBEE', padding: '1px 6px', borderRadius: '10px' }}>первый провал останавливает всё</span>}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '13px' }}>max-parallel:</span>
            <input
              type='number'
              min={1}
              max={Math.max(totalJobs, 1)}
              value={maxParallel}
              onChange={e => setMaxParallel(Number(e.target.value))}
              style={{ width: '50px', fontFamily: 'monospace', fontSize: '13px', padding: '3px 6px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
        </div>
      </div>

      {/* Job counter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.6rem 1rem',
        background: '#E3F2FD',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontSize: '14px',
      }}>
        <span>Всего комбинаций: <strong>{totalJobs}</strong></span>
        {excluded.length > 0 && <span style={{ color: '#888' }}>Исключено: <strong>{excluded.length}</strong></span>}
        <span style={{ color: '#1565C0' }}>Будет запущено джобов: <strong>{activeJobs}</strong></span>
      </div>

      {/* Matrix grid */}
      {selectedOS.length > 0 && selectedNode.length > 0 && (
        <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
          <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '0.5rem' }}>
            Матрица джобов (кликни ячейку — исключить):
          </div>
          <table style={{ borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.4rem 0.75rem', background: '#f5f5f5', border: '1px solid #ddd', fontFamily: 'monospace' }}>OS \ Node</th>
                {selectedNode.map(n => (
                  <th key={n} style={{ padding: '0.4rem 0.75rem', background: '#E8F5E9', border: '1px solid #ddd', fontFamily: 'monospace', color: '#2E7D32' }}>
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedOS.map(os => (
                <tr key={os}>
                  <td style={{ padding: '0.4rem 0.75rem', background: '#FFF3E0', border: '1px solid #ddd', fontFamily: 'monospace', color: '#E65100', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {os}
                  </td>
                  {selectedNode.map(node => {
                    const isExcluded = excluded.some(e => e.os === os && e.node === node)
                    return (
                      <td
                        key={node}
                        onClick={() => toggleExclude(os, node)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          border: '1px solid #ddd',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: isExcluded ? '#FFEBEE' : '#E8F5E9',
                          color: isExcluded ? '#C62828' : '#2E7D32',
                          textDecoration: isExcluded ? 'line-through' : 'none',
                          transition: 'all 0.15s',
                          fontSize: '16px',
                        }}
                        title={isExcluded ? 'Нажми, чтобы включить' : 'Нажми, чтобы исключить'}
                      >
                        {isExcluded ? '✕' : '✓'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* YAML */}
      <div style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '13px' }}>YAML:</div>
      <div style={{
        background: '#1e1e2e',
        color: '#cdd6f4',
        padding: '1rem',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        whiteSpace: 'pre',
        overflowX: 'auto',
      }}>
        {yaml}
      </div>
    </div>
  )
}

// ============================================
// Task 16.4: Reusable Workflows and Composite Actions
// ============================================

type InputDef = { id: number; name: string; type: 'string' | 'boolean' | 'number'; required: boolean; defaultValue: string }
type SecretDef = { id: number; name: string; required: boolean }

const COMPOSITE_STEPS = [
  { id: 'checkout', label: 'actions/checkout@v4', desc: 'Клонировать код' },
  { id: 'setup-node', label: 'actions/setup-node@v4', desc: 'Установить Node.js 20' },
  { id: 'npm-ci', label: 'npm ci', desc: 'Установить зависимости' },
]

function buildReusableWorkflowDef(workflowName: string, inputs: InputDef[], secrets: SecretDef[]): string {
  const inputsBlock = inputs.length > 0
    ? `\n    inputs:\n${inputs.map(i => `      ${i.name || 'input_name'}:\n        type: ${i.type}\n        required: ${i.required}${i.defaultValue ? `\n        default: '${i.defaultValue}'` : ''}`).join('\n')}`
    : ''

  const secretsBlock = secrets.length > 0
    ? `\n    secrets:\n${secrets.map(s => `      ${s.name || 'SECRET'}:\n        required: ${s.required}`).join('\n')}`
    : ''

  const inputsUsage = inputs.length > 0
    ? `\n        env:\n${inputs.map(i => `          ${(i.name || 'input').toUpperCase()}: \${{ inputs.${i.name || 'input_name'} }}`).join('\n')}`
    : ''

  return `# .github/workflows/${workflowName || 'deploy'}.yml
on:
  workflow_call:${inputsBlock}${secretsBlock}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run deployment${inputsUsage}
        run: ./deploy.sh`
}

function buildReusableWorkflowCaller(workflowName: string, inputs: InputDef[], secrets: SecretDef[]): string {
  const withBlock = inputs.length > 0
    ? `\n    with:\n${inputs.map(i => `      ${i.name || 'input_name'}: ${i.defaultValue || `'value-here'`}`).join('\n')}`
    : ''

  const secretsBlock = secrets.length > 0
    ? `\n    secrets:\n${secrets.map(s => `      ${s.name || 'SECRET'}: \${{ secrets.PROD_${s.name || 'SECRET'} }}`).join('\n')}`
    : ''

  return `# .github/workflows/production.yml
jobs:
  deploy-production:
    uses: ./.github/workflows/${workflowName || 'deploy'}.yml${withBlock}${secretsBlock}`
}

function buildCompositeAction(actionName: string, desc: string, inputs: InputDef[], activeSteps: string[]): string {
  const inputsBlock = inputs.length > 0
    ? `\ninputs:\n${inputs.map(i => `  ${i.name || 'input_name'}:\n    description: '${i.defaultValue || 'Description'}'\n    required: ${i.required}`).join('\n')}\n`
    : ''

  const stepsBlock = activeSteps.map(stepId => {
    const step = COMPOSITE_STEPS.find(s => s.id === stepId)
    if (!step) return ''
    if (stepId === 'checkout') return `      - uses: actions/checkout@v4`
    if (stepId === 'setup-node') {
      const nodeVer = inputs.find(i => i.name === 'node-version')
      const ver = nodeVer ? `\${{ inputs.node-version }}` : '20'
      return `      - uses: actions/setup-node@v4
        with:
          node-version: '${ver}'
          cache: 'npm'`
    }
    if (stepId === 'npm-ci') return `      - name: Install dependencies\n        run: npm ci\n        shell: bash`
    return ''
  }).filter(Boolean).join('\n')

  return `# .github/actions/${actionName || 'setup'}/action.yml
name: '${actionName || 'Setup Project'}'
description: '${desc || 'Setup and install dependencies'}'
${inputsBlock}
runs:
  using: composite
  steps:
${stepsBlock || '      # добавь шаги через чекбоксы'}`
}

function buildCompositeActionCaller(actionName: string, inputs: InputDef[]): string {
  const withBlock = inputs.length > 0
    ? `\n        with:\n${inputs.map(i => `          ${i.name || 'input_name'}: '${i.defaultValue || 'value'}'`).join('\n')}`
    : ''

  return `# Использование в любом workflow:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/${actionName || 'setup'}${withBlock}
      - name: Build
        run: npm run build`
}

const GITLAB_COMPARISON = [
  { gh: 'Reusable Workflow', gl: 'include: project:', desc: 'Переиспользование целого пайплайна' },
  { gh: 'Composite Action', gl: 'extends: / !reference []', desc: 'Переиспользование шагов джоба' },
  { gh: 'workflow_call inputs', gl: 'variables в include', desc: 'Параметры для переиспользуемого блока' },
  { gh: 'uses: ./path', gl: 'include: local:', desc: 'Локальный файл в том же репозитории' },
]

export function Task16_4_Solution() {
  const [type, setType] = useState<'workflow' | 'action'>('workflow')
  const [workflowName, setWorkflowName] = useState('deploy')
  const [actionName, setActionName] = useState('setup-project')
  const [actionDesc, setActionDesc] = useState('Checkout, setup Node and install deps')
  const [inputs, setInputs] = useState<InputDef[]>([
    { id: 1, name: 'environment', type: 'string', required: true, defaultValue: 'staging' },
  ])
  const [secrets, setSecrets] = useState<SecretDef[]>([
    { id: 1, name: 'DEPLOY_KEY', required: true },
  ])
  const [activeSteps, setActiveSteps] = useState<string[]>(['checkout', 'setup-node', 'npm-ci'])
  const [nextInputId, setNextInputId] = useState(10)
  const [nextSecretId, setNextSecretId] = useState(10)

  const addInput = () => {
    setInputs(prev => [...prev, { id: nextInputId, name: '', type: 'string', required: false, defaultValue: '' }])
    setNextInputId(n => n + 1)
  }

  const updateInput = (id: number, field: keyof InputDef, value: string | boolean) => {
    setInputs(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const removeInput = (id: number) => setInputs(prev => prev.filter(i => i.id !== id))

  const addSecret = () => {
    setSecrets(prev => [...prev, { id: nextSecretId, name: '', required: true }])
    setNextSecretId(n => n + 1)
  }

  const updateSecret = (id: number, field: keyof SecretDef, value: string | boolean) => {
    setSecrets(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const removeSecret = (id: number) => setSecrets(prev => prev.filter(s => s.id !== id))

  const toggleStep = (id: string) => {
    setActiveSteps(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const defYaml = type === 'workflow'
    ? buildReusableWorkflowDef(workflowName, inputs, secrets)
    : buildCompositeAction(actionName, actionDesc, inputs, activeSteps)

  const callerYaml = type === 'workflow'
    ? buildReusableWorkflowCaller(workflowName, inputs, secrets)
    : buildCompositeActionCaller(actionName, inputs)

  const codeBlock = (code: string, label: string) => (
    <div style={{ flex: 1, minWidth: '280px' }}>
      <div style={{ fontWeight: 600, fontSize: '12px', color: '#888', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{
        background: '#1e1e2e',
        color: '#cdd6f4',
        padding: '0.75rem',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '11px',
        whiteSpace: 'pre',
        overflowX: 'auto',
        lineHeight: 1.6,
      }}>
        {code}
      </div>
    </div>
  )

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Reusable Workflows и Composite Actions</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Построй переиспользуемый компонент и посмотри как выглядит определение и вызов
      </p>

      {/* Type toggle */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {(['workflow', 'action'] as const).map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '14px',
              fontWeight: type === t ? 600 : 400,
              background: type === t ? '#1565C0' : '#f5f5f5',
              color: type === t ? '#fff' : '#333',
              border: '2px solid ' + (type === t ? '#1565C0' : '#ddd'),
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {t === 'workflow' ? 'Reusable Workflow' : 'Composite Action'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {/* Configuration */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          {/* Name */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '0.4rem' }}>
              {type === 'workflow' ? 'Имя файла workflow' : 'Имя action'}
            </div>
            <input
              type='text'
              value={type === 'workflow' ? workflowName : actionName}
              onChange={e => type === 'workflow' ? setWorkflowName(e.target.value) : setActionName(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '13px', padding: '5px 8px', border: '1px solid #ccc', borderRadius: '4px', width: '200px' }}
            />
          </div>

          {type === 'action' && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '0.4rem' }}>description</div>
              <input
                type='text'
                value={actionDesc}
                onChange={e => setActionDesc(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '12px', padding: '5px 8px', border: '1px solid #ccc', borderRadius: '4px', width: '240px' }}
              />
            </div>
          )}

          {/* Inputs */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '0.5rem' }}>inputs</div>
            {inputs.map(inp => (
              <div key={inp.id} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type='text'
                  value={inp.name}
                  onChange={e => updateInput(inp.id, 'name', e.target.value)}
                  placeholder='name'
                  style={{ fontFamily: 'monospace', fontSize: '11px', padding: '3px 6px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                />
                <select
                  value={inp.type}
                  onChange={e => updateInput(inp.id, 'type', e.target.value)}
                  style={{ fontSize: '11px', padding: '3px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option>string</option>
                  <option>boolean</option>
                  <option>number</option>
                </select>
                <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                  <input type='checkbox' checked={inp.required} onChange={e => updateInput(inp.id, 'required', e.target.checked)} />
                  req
                </label>
                <input
                  type='text'
                  value={inp.defaultValue}
                  onChange={e => updateInput(inp.id, 'defaultValue', e.target.value)}
                  placeholder='default'
                  style={{ fontFamily: 'monospace', fontSize: '11px', padding: '3px 6px', border: '1px solid #ccc', borderRadius: '4px', width: '70px' }}
                />
                <button onClick={() => removeInput(inp.id)} style={{ padding: '2px 6px', fontSize: '11px', background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
              </div>
            ))}
            <button onClick={addInput} style={{ padding: '0.3rem 0.6rem', fontSize: '11px', background: '#E3F2FD', color: '#1565C0', border: '1px solid #90CAF9', borderRadius: '4px', cursor: 'pointer' }}>
              + Input
            </button>
          </div>

          {/* Secrets — only for workflow */}
          {type === 'workflow' && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '0.5rem' }}>secrets</div>
              {secrets.map(sec => (
                <div key={sec.id} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                  <input
                    type='text'
                    value={sec.name}
                    onChange={e => updateSecret(sec.id, 'name', e.target.value)}
                    placeholder='SECRET_NAME'
                    style={{ fontFamily: 'monospace', fontSize: '11px', padding: '3px 6px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
                  />
                  <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                    <input type='checkbox' checked={sec.required} onChange={e => updateSecret(sec.id, 'required', e.target.checked)} />
                    req
                  </label>
                  <button onClick={() => removeSecret(sec.id)} style={{ padding: '2px 6px', fontSize: '11px', background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
              <button onClick={addSecret} style={{ padding: '0.3rem 0.6rem', fontSize: '11px', background: '#F3E5F5', color: '#7B1FA2', border: '1px solid #CE93D8', borderRadius: '4px', cursor: 'pointer' }}>
                + Secret
              </button>
            </div>
          )}

          {/* Steps — only for composite action */}
          {type === 'action' && (
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '0.5rem' }}>Шаги (steps)</div>
              {COMPOSITE_STEPS.map(step => (
                <label key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', cursor: 'pointer' }}>
                  <input type='checkbox' checked={activeSteps.includes(step.id)} onChange={() => toggleStep(step.id)} />
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#1565C0' }}>{step.label}</span>
                  <span style={{ fontSize: '11px', color: '#888' }}>{step.desc}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* YAML outputs */}
        <div style={{ flex: 2, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {codeBlock(defYaml, type === 'workflow' ? 'Определение (deploy.yml)' : 'Определение (action.yml)')}
            {codeBlock(callerYaml, 'Вызов')}
          </div>
        </div>
      </div>

      {/* GitLab CI comparison */}
      <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '0.75rem' }}>Сравнение с GitLab CI:</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.6rem' }}>
          {GITLAB_COMPARISON.map((row, i) => (
            <div key={i} style={{ padding: '0.6rem 0.75rem', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ background: '#E3F2FD', color: '#1565C0', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px' }}>{row.gh}</span>
                <span style={{ color: '#999' }}>↔</span>
                <span style={{ background: '#FFF3E0', color: '#E65100', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px' }}>{row.gl}</span>
              </div>
              <div style={{ color: '#666' }}>{row.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
