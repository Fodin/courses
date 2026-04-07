// ============================================
// Level 4: Rules and Conditional Execution — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 4.1: rules:if — decision tree simulator
// ============================================

interface CIVariables {
  CI_COMMIT_BRANCH: string
  CI_PIPELINE_SOURCE: string
  CI_COMMIT_TAG: string
  CI_MERGE_REQUEST_IID: string
}

interface CIEvent {
  id: string
  label: string
  emoji: string
  variables: CIVariables
}

interface RuleCondition {
  label: string
  when: 'on_success' | 'never' | 'manual' | 'always'
  evaluate: (v: CIVariables) => boolean
}

interface CIJob41 {
  name: string
  rules: RuleCondition[]
}

const ciEvents: CIEvent[] = [
  {
    id: 'push-main',
    label: 'Push в main',
    emoji: '🌿',
    variables: { CI_COMMIT_BRANCH: 'main', CI_PIPELINE_SOURCE: 'push', CI_COMMIT_TAG: '', CI_MERGE_REQUEST_IID: '' },
  },
  {
    id: 'push-feature',
    label: 'Push в feature',
    emoji: '🔀',
    variables: { CI_COMMIT_BRANCH: 'feature/auth', CI_PIPELINE_SOURCE: 'push', CI_COMMIT_TAG: '', CI_MERGE_REQUEST_IID: '' },
  },
  {
    id: 'merge-request',
    label: 'Merge Request',
    emoji: '🔃',
    variables: { CI_COMMIT_BRANCH: '', CI_PIPELINE_SOURCE: 'merge_request_event', CI_COMMIT_TAG: '', CI_MERGE_REQUEST_IID: '42' },
  },
  {
    id: 'tag-release',
    label: 'Тег v1.2.3',
    emoji: '🏷️',
    variables: { CI_COMMIT_BRANCH: '', CI_PIPELINE_SOURCE: 'push', CI_COMMIT_TAG: 'v1.2.3', CI_MERGE_REQUEST_IID: '' },
  },
  {
    id: 'schedule',
    label: 'Расписание',
    emoji: '⏰',
    variables: { CI_COMMIT_BRANCH: 'main', CI_PIPELINE_SOURCE: 'schedule', CI_COMMIT_TAG: '', CI_MERGE_REQUEST_IID: '' },
  },
]

const ciJobs41: CIJob41[] = [
  {
    name: 'deploy-prod',
    rules: [
      { label: '$CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE == "push"', when: 'manual', evaluate: v => v.CI_COMMIT_BRANCH === 'main' && v.CI_PIPELINE_SOURCE === 'push' },
      { label: 'when: never', when: 'never', evaluate: () => true },
    ],
  },
  {
    name: 'test',
    rules: [
      { label: '$CI_COMMIT_BRANCH == "main"', when: 'on_success', evaluate: v => v.CI_COMMIT_BRANCH === 'main' },
      { label: '$CI_PIPELINE_SOURCE == "merge_request_event"', when: 'on_success', evaluate: v => v.CI_PIPELINE_SOURCE === 'merge_request_event' },
      { label: 'when: never', when: 'never', evaluate: () => true },
    ],
  },
  {
    name: 'mr-lint',
    rules: [
      { label: '$CI_PIPELINE_SOURCE == "merge_request_event"', when: 'on_success', evaluate: v => v.CI_PIPELINE_SOURCE === 'merge_request_event' },
      { label: 'when: never', when: 'never', evaluate: () => true },
    ],
  },
  {
    name: 'release-publish',
    rules: [
      { label: '$CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+$/', when: 'on_success', evaluate: v => /^v\d+\.\d+\.\d+$/.test(v.CI_COMMIT_TAG) },
      { label: 'when: never', when: 'never', evaluate: () => true },
    ],
  },
  {
    name: 'nightly-backup',
    rules: [
      { label: '$CI_PIPELINE_SOURCE == "schedule"', when: 'always', evaluate: v => v.CI_PIPELINE_SOURCE === 'schedule' },
      { label: 'when: never', when: 'never', evaluate: () => true },
    ],
  },
]

function evaluateJob(job: CIJob41, vars: CIVariables): { runs: boolean; when: string; matchedRuleIndex: number } {
  for (let i = 0; i < job.rules.length; i++) {
    const rule = job.rules[i]
    if (rule.evaluate(vars)) {
      return { runs: rule.when !== 'never', when: rule.when, matchedRuleIndex: i }
    }
  }
  return { runs: true, when: 'on_success', matchedRuleIndex: -1 }
}

export function Task4_1_Solution() {
  const [activeEventId, setActiveEventId] = useState<string>('push-main')
  const [selectedJobName, setSelectedJobName] = useState<string | null>(null)

  const activeEvent = ciEvents.find(e => e.id === activeEventId)!
  const vars = activeEvent.variables

  const whenColor = (when: string) => {
    if (when === 'never') return '#9e9e9e'
    if (when === 'manual') return '#ff9800'
    if (when === 'always') return '#2196f3'
    return '#4caf50'
  }

  const whenLabel = (when: string) => {
    if (when === 'never') return 'Пропущен'
    if (when === 'manual') return 'Ручной запуск'
    if (when === 'always') return 'Запустится'
    return 'Запустится'
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>rules:if — Decision Tree Simulator</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Выбери событие GitLab и посмотри, какие джобы запустятся
      </p>

      {/* Event selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: '#555', letterSpacing: '0.05em' }}>
          Событие пайплайна
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {ciEvents.map(event => (
            <button
              key={event.id}
              onClick={() => setActiveEventId(event.id)}
              style={{
                padding: '0.5rem 1rem',
                border: '2px solid',
                borderColor: activeEventId === event.id ? '#1565C0' : '#ddd',
                borderRadius: '6px',
                background: activeEventId === event.id ? '#1565C0' : '#fff',
                color: activeEventId === event.id ? '#fff' : '#333',
                cursor: 'pointer',
                fontWeight: activeEventId === event.id ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {event.emoji} {event.label}
            </button>
          ))}
        </div>
      </div>

      {/* CI Variables panel */}
      <div style={{ background: '#1e1e1e', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#fff' }}>
        <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Текущие переменные CI
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.4rem' }}>
          {Object.entries(vars).map(([key, value]) => (
            <div key={key} style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              <span style={{ color: '#9cdcfe' }}>${key}</span>
              <span style={{ color: '#888' }}> = </span>
              <span style={{ color: value ? '#ce9178' : '#6a9955' }}>
                {value ? `"${value}"` : '""  ← не задана'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {ciJobs41.map(job => {
          const result = evaluateJob(job, vars)
          const isSelected = selectedJobName === job.name
          return (
            <div
              key={job.name}
              onClick={() => setSelectedJobName(isSelected ? null : job.name)}
              style={{
                border: `2px solid ${isSelected ? '#1565C0' : result.runs ? '#c8e6c9' : '#e0e0e0'}`,
                borderRadius: '8px',
                padding: '0.875rem',
                cursor: 'pointer',
                background: result.runs ? '#f9fff9' : '#fafafa',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <code style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>{job.name}</code>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  background: whenColor(result.when),
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {whenLabel(result.when)}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                Правило #{result.matchedRuleIndex + 1}: <code style={{ color: '#555' }}>{job.rules[result.matchedRuleIndex]?.label ?? 'default'}</code>
              </div>
              {isSelected && (
                <div style={{ marginTop: '0.75rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#555', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Проверка правил по порядку
                  </div>
                  {job.rules.map((rule, idx) => {
                    const matched = result.matchedRuleIndex === idx
                    const wouldRun = rule.when !== 'never'
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.3rem 0.5rem',
                          marginBottom: '0.25rem',
                          borderRadius: '4px',
                          background: matched ? (wouldRun ? '#e8f5e9' : '#f5f5f5') : 'transparent',
                          border: `1px solid ${matched ? (wouldRun ? '#a5d6a7' : '#e0e0e0') : 'transparent'}`,
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', color: '#999', minWidth: '1.2rem' }}>#{idx + 1}</span>
                        <code style={{ fontSize: '0.78rem', color: '#444', flex: 1 }}>{rule.label}</code>
                        {matched && (
                          <span style={{ fontSize: '0.7rem', color: wouldRun ? '#2e7d32' : '#757575', fontWeight: 700 }}>
                            ← СРАБОТАЛО
                          </span>
                        )}
                        {!matched && idx < result.matchedRuleIndex && (
                          <span style={{ fontSize: '0.7rem', color: '#bbb' }}>пропущено</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p style={{ color: '#888', fontSize: '0.8rem' }}>
        Кликни на карточку джоба, чтобы увидеть дерево проверки правил
      </p>
    </div>
  )
}

// ============================================
// Task 4.2: rules:changes — file tree simulator
// ============================================

interface FileNode {
  path: string
  name: string
  isDir: boolean
  depth: number
}

interface CIJob42 {
  name: string
  patterns: string[]
}

const fileTree: FileNode[] = [
  { path: 'frontend', name: 'frontend/', isDir: true, depth: 0 },
  { path: 'frontend/src', name: 'src/', isDir: true, depth: 1 },
  { path: 'frontend/src/App.tsx', name: 'App.tsx', isDir: false, depth: 2 },
  { path: 'frontend/src/components/Button.tsx', name: 'Button.tsx', isDir: false, depth: 2 },
  { path: 'frontend/package.json', name: 'package.json', isDir: false, depth: 1 },
  { path: 'frontend/webpack.config.js', name: 'webpack.config.js', isDir: false, depth: 1 },
  { path: 'backend', name: 'backend/', isDir: true, depth: 0 },
  { path: 'backend/src', name: 'src/', isDir: true, depth: 1 },
  { path: 'backend/src/server.go', name: 'server.go', isDir: false, depth: 2 },
  { path: 'backend/src/handlers/api.go', name: 'api.go', isDir: false, depth: 2 },
  { path: 'backend/go.mod', name: 'go.mod', isDir: false, depth: 1 },
  { path: 'backend/Dockerfile', name: 'Dockerfile', isDir: false, depth: 1 },
  { path: 'docs', name: 'docs/', isDir: true, depth: 0 },
  { path: 'docs/README.md', name: 'README.md', isDir: false, depth: 1 },
  { path: 'docs/api-spec.yaml', name: 'api-spec.yaml', isDir: false, depth: 1 },
  { path: '.gitlab-ci.yml', name: '.gitlab-ci.yml', isDir: false, depth: 0 },
  { path: 'docker-compose.yml', name: 'docker-compose.yml', isDir: false, depth: 0 },
]

const ciJobs42: CIJob42[] = [
  { name: 'frontend-lint', patterns: ['frontend/**/*'] },
  { name: 'frontend-test', patterns: ['frontend/**/*'] },
  { name: 'backend-test', patterns: ['backend/**/*.go', 'backend/go.mod'] },
  { name: 'docker-build', patterns: ['backend/Dockerfile'] },
  { name: 'docs-publish', patterns: ['docs/**/*'] },
  { name: 'full-pipeline', patterns: ['.gitlab-ci.yml'] },
]

const allLeafPaths = fileTree.filter(f => !f.isDir).map(f => f.path)

function matchesGlob(filePath: string, pattern: string): boolean {
  // Simple glob matching for the simulator
  const regexStr = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*\/\*/g, '.+')
    .replace(/\*\*\//g, '(?:.+/)?')
    .replace(/\*/g, '[^/]+')
  try {
    return new RegExp(`^${regexStr}$`).test(filePath)
  } catch {
    return false
  }
}

function jobMatches(job: CIJob42, changedFiles: Set<string>): string[] {
  const matched: string[] = []
  changedFiles.forEach(file => {
    if (job.patterns.some(p => matchesGlob(file, p))) {
      matched.push(file)
    }
  })
  return matched
}

export function Task4_2_Solution() {
  const [changedFiles, setChangedFiles] = useState<Set<string>>(new Set())

  const toggleFile = (path: string) => {
    setChangedFiles(prev => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const randomize = () => {
    const leaves = allLeafPaths
    const shuffled = [...leaves].sort(() => Math.random() - 0.5)
    setChangedFiles(new Set(shuffled.slice(0, 3)))
  }

  const reset = () => setChangedFiles(new Set())

  const activeJobs = ciJobs42.filter(j => jobMatches(j, changedFiles).length > 0)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>rules:changes — File Change Simulator</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1rem' }}>
        Отметь изменённые файлы и посмотри, какие CI-джобы запустятся
      </p>

      {/* Stats + controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ background: '#e3f2fd', borderRadius: '6px', padding: '0.4rem 0.8rem', fontSize: '0.875rem', fontWeight: 600, color: '#1565C0' }}>
          Изменено: {changedFiles.size} файлов | Запустится: {activeJobs.length} джобов
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={randomize} style={{ padding: '0.4rem 0.8rem', border: '1px solid #1565C0', borderRadius: '6px', background: '#fff', color: '#1565C0', cursor: 'pointer', fontSize: '0.85rem' }}>
            Случайные изменения
          </button>
          <button onClick={reset} style={{ padding: '0.4rem 0.8rem', border: '1px solid #e0e0e0', borderRadius: '6px', background: '#fff', color: '#666', cursor: 'pointer', fontSize: '0.85rem' }}>
            Сбросить
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* File tree */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: '#555', letterSpacing: '0.05em' }}>
            Файловое дерево репозитория
          </div>
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '0.75rem', background: '#fafafa' }}>
            {fileTree.map(node => (
              <div
                key={node.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.2rem 0',
                  paddingLeft: `${node.depth * 1.25}rem`,
                }}
              >
                {node.isDir ? (
                  <span style={{ color: '#e8b019', fontSize: '0.85rem' }}>📁</span>
                ) : (
                  <input
                    type='checkbox'
                    checked={changedFiles.has(node.path)}
                    onChange={() => toggleFile(node.path)}
                    style={{ cursor: 'pointer', accentColor: '#1565C0' }}
                  />
                )}
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: node.isDir ? '#555' : changedFiles.has(node.path) ? '#c62828' : '#333',
                  fontWeight: changedFiles.has(node.path) ? 700 : node.isDir ? 600 : 400,
                }}>
                  {node.name}
                  {changedFiles.has(node.path) && <span style={{ marginLeft: '0.4rem', color: '#e53935', fontSize: '0.7rem' }}>● изменён</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs panel */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: '#555', letterSpacing: '0.05em' }}>
            CI-джобы (rules:changes)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ciJobs42.map(job => {
              const matched = jobMatches(job, changedFiles)
              const runs = matched.length > 0
              return (
                <div
                  key={job.name}
                  style={{
                    border: `1px solid ${runs ? '#a5d6a7' : '#e0e0e0'}`,
                    borderRadius: '8px',
                    padding: '0.75rem',
                    background: runs ? '#f1f8f1' : '#fafafa',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <code style={{ fontWeight: 700, fontSize: '0.85rem', color: runs ? '#1b5e20' : '#666' }}>{job.name}</code>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '10px',
                      background: runs ? '#4caf50' : '#e0e0e0',
                      color: runs ? '#fff' : '#888',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}>
                      {runs ? 'Запустится' : 'Пропущен'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: runs ? '0.35rem' : 0 }}>
                    {job.patterns.map(p => <code key={p} style={{ background: '#f0f0f0', padding: '0 0.25rem', borderRadius: '3px', marginRight: '0.25rem' }}>{p}</code>)}
                  </div>
                  {runs && (
                    <div style={{ fontSize: '0.75rem', color: '#2e7d32' }}>
                      Совпало: {matched.map(f => <code key={f} style={{ background: '#e8f5e9', padding: '0 0.25rem', borderRadius: '3px', marginRight: '0.25rem' }}>{f.split('/').pop()}</code>)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 4.3: workflow:rules — deduplication simulator
// ============================================

type PipelineStatus = 'created' | 'blocked'
type PipelineType = 'branch' | 'mr'

interface PipelineEntry {
  id: number
  type: PipelineType
  source: string
  status: PipelineStatus
  reason?: string
  minutes: number
  event: string
}

interface SimState {
  hasPushed: boolean
  hasMR: boolean
  pipelines: PipelineEntry[]
  nextId: number
}

const RUNNER_MINUTES = 5

export function Task4_3_Solution() {
  const [mode, setMode] = useState<'without' | 'with'>('without')
  const [sim, setSim] = useState<SimState>({ hasPushed: false, hasMR: false, pipelines: [], nextId: 1 })

  const reset = () => setSim({ hasPushed: false, hasMR: false, pipelines: [], nextId: 1 })

  const doPush = () => {
    setSim(prev => {
      const pipelines = [...prev.pipelines]
      // branch pipeline always created on push
      pipelines.push({
        id: prev.nextId,
        type: 'branch',
        source: 'push',
        status: 'created',
        minutes: RUNNER_MINUTES,
        event: 'git push feature/auth',
      })
      return { ...prev, hasPushed: true, pipelines, nextId: prev.nextId + 1 }
    })
  }

  const doOpenMR = () => {
    setSim(prev => {
      const pipelines = [...prev.pipelines]
      // MR pipeline always created
      pipelines.push({
        id: prev.nextId,
        type: 'mr',
        source: 'merge_request_event',
        status: 'created',
        minutes: RUNNER_MINUTES,
        event: 'Открыт MR: feature/auth → main',
      })

      // In "without" mode a branch pipeline also triggers again on MR
      if (mode === 'without' && prev.hasPushed) {
        pipelines.push({
          id: prev.nextId + 1,
          type: 'branch',
          source: 'push (дубль)',
          status: 'created',
          minutes: RUNNER_MINUTES,
          event: 'Открыт MR → branch-пайплайн тоже запускается',
        })
        return { ...prev, hasMR: true, pipelines, nextId: prev.nextId + 2 }
      }

      // In "with" mode we also need to block any future branch push
      // Show the blocking effect conceptually: mark a "would-be" pipeline as blocked
      if (mode === 'with' && prev.hasPushed) {
        pipelines.push({
          id: prev.nextId + 1,
          type: 'branch',
          source: 'push',
          status: 'blocked',
          reason: '$CI_COMMIT_BRANCH && $CI_OPEN_MERGE_REQUESTS → when: never',
          minutes: 0,
          event: 'Branch-пайплайн заблокирован workflow:rules',
        })
        return { ...prev, hasMR: true, pipelines, nextId: prev.nextId + 2 }
      }

      return { ...prev, hasMR: true, pipelines, nextId: prev.nextId + 1 }
    })
  }

  const totalMinutes = sim.pipelines.reduce((sum, p) => sum + p.minutes, 0)
  const activePipelines = sim.pipelines.filter(p => p.status === 'created').length

  const workflowYaml = `workflow:
  rules:
    # MR-пайплайн — если есть MR
    - if: $CI_MERGE_REQUEST_IID

    # Блокировать branch, если уже создастся MR-пайплайн
    - if: $CI_COMMIT_BRANCH && $CI_OPEN_MERGE_REQUESTS
      when: never

    # Branch-пайплайн без MR
    - if: $CI_COMMIT_BRANCH`

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>workflow:rules — Pipeline Deduplication</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Симулятор проблемы дублирования пайплайнов и её решения через workflow:rules
      </p>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 0, marginBottom: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', width: 'fit-content' }}>
        {(['without', 'with'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); reset() }}
            style={{
              padding: '0.6rem 1.25rem',
              border: 'none',
              background: mode === m ? '#1565C0' : '#fff',
              color: mode === m ? '#fff' : '#555',
              cursor: 'pointer',
              fontWeight: mode === m ? 700 : 400,
              fontSize: '0.875rem',
              transition: 'all 0.15s',
            }}
          >
            {m === 'without' ? 'Без workflow:rules' : 'С workflow:rules'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Actions */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: '#555', letterSpacing: '0.05em' }}>
            Действия разработчика
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={doPush}
              style={{ padding: '0.6rem 1rem', border: '1px solid #1565C0', borderRadius: '6px', background: '#e3f2fd', color: '#1565C0', cursor: 'pointer', fontWeight: 600, textAlign: 'left' }}
            >
              1. git push feature/auth
            </button>
            <button
              onClick={doOpenMR}
              disabled={!sim.hasPushed}
              style={{
                padding: '0.6rem 1rem', border: '1px solid',
                borderColor: sim.hasPushed ? '#7b1fa2' : '#e0e0e0',
                borderRadius: '6px',
                background: sim.hasPushed ? '#f3e5f5' : '#f5f5f5',
                color: sim.hasPushed ? '#7b1fa2' : '#bbb',
                cursor: sim.hasPushed ? 'pointer' : 'not-allowed',
                fontWeight: 600, textAlign: 'left',
              }}
            >
              2. Открыть MR → main
            </button>
            <button
              onClick={reset}
              style={{ padding: '0.4rem 0.8rem', border: '1px solid #e0e0e0', borderRadius: '6px', background: '#fff', color: '#666', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Сбросить
            </button>
          </div>

          {/* Stats */}
          {sim.pipelines.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: totalMinutes > 5 ? '#fff3e0' : '#e8f5e9', border: `1px solid ${totalMinutes > 5 ? '#ffcc80' : '#a5d6a7'}` }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: totalMinutes > 5 ? '#e65100' : '#2e7d32' }}>
                Потрачено runner-минут: {totalMinutes}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                Активных пайплайнов: {activePipelines}
                {totalMinutes > 5 && ' — дублирование!'}
              </div>
            </div>
          )}
        </div>

        {/* Pipeline log */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: '#555', letterSpacing: '0.05em' }}>
            Созданные пайплайны
          </div>
          {sim.pipelines.length === 0 ? (
            <div style={{ color: '#bbb', fontSize: '0.875rem', padding: '1rem', textAlign: 'center', border: '1px dashed #e0e0e0', borderRadius: '8px' }}>
              Нажми кнопку действия
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sim.pipelines.map(p => (
                <div
                  key={p.id}
                  style={{
                    border: `1px solid ${p.status === 'blocked' ? '#e0e0e0' : p.type === 'mr' ? '#ce93d8' : '#90caf9'}`,
                    borderRadius: '8px',
                    padding: '0.6rem 0.8rem',
                    background: p.status === 'blocked' ? '#f5f5f5' : p.type === 'mr' ? '#fce4ec' : '#e3f2fd',
                    opacity: p.status === 'blocked' ? 0.7 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: p.status === 'blocked' ? '#bbb' : '#333' }}>
                      #{p.id} {p.type === 'mr' ? 'MR Pipeline' : 'Branch Pipeline'}
                    </span>
                    <span style={{
                      padding: '0.15rem 0.45rem',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      background: p.status === 'blocked' ? '#e0e0e0' : '#4caf50',
                      color: p.status === 'blocked' ? '#888' : '#fff',
                    }}>
                      {p.status === 'blocked' ? 'Заблокирован' : `${p.minutes} мин`}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>
                    <code style={{ background: '#f0f0f0', padding: '0 0.25rem', borderRadius: '3px' }}>source: {p.source}</code>
                  </div>
                  {p.reason && (
                    <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.25rem' }}>
                      workflow: <code>{p.reason}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* YAML config */}
      {mode === 'with' && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: '#555', letterSpacing: '0.05em' }}>
            Активная конфигурация workflow:rules
          </div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', borderRadius: '8px', padding: '1rem', fontSize: '0.82rem', overflowX: 'auto', margin: 0 }}>
            {workflowYaml}
          </pre>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 4.4: Rules builder — combining conditions
// ============================================

type WhenValue = 'on_success' | 'never' | 'manual' | 'always'

interface RuleBuilderEntry {
  id: number
  ifCondition: string
  changes: string
  when: WhenValue
}

interface PresetConfig {
  name: string
  description: string
  rules: Omit<RuleBuilderEntry, 'id'>[]
}

const presets: PresetConfig[] = [
  {
    name: 'MR + изменения',
    description: 'На MR запускать только если изменился src/, на main — всегда',
    rules: [
      { ifCondition: '$CI_PIPELINE_SOURCE == "merge_request_event"', changes: 'src/**/*', when: 'on_success' },
      { ifCondition: '$CI_COMMIT_BRANCH == "main"', changes: '', when: 'on_success' },
      { ifCondition: '', changes: '', when: 'never' },
    ],
  },
  {
    name: 'Деплой на прод',
    description: 'На теге — автоматически, на main — ручной запуск',
    rules: [
      { ifCondition: '$CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+$/', changes: '', when: 'on_success' },
      { ifCondition: '$CI_COMMIT_BRANCH == "main"', changes: '', when: 'manual' },
      { ifCondition: '', changes: '', when: 'never' },
    ],
  },
  {
    name: 'Нагрузочные тесты',
    description: 'По расписанию — автоматически, на main через push — вручную',
    rules: [
      { ifCondition: '$CI_PIPELINE_SOURCE == "schedule"', changes: '', when: 'always' },
      { ifCondition: '$CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE == "push"', changes: '', when: 'manual' },
      { ifCondition: '', changes: '', when: 'never' },
    ],
  },
]

interface TestEvent44 {
  id: string
  label: string
  vars: CIVariables
}

const testEvents44: TestEvent44[] = [
  { id: 'push-main', label: 'Push в main', vars: { CI_COMMIT_BRANCH: 'main', CI_PIPELINE_SOURCE: 'push', CI_COMMIT_TAG: '', CI_MERGE_REQUEST_IID: '' } },
  { id: 'push-feature', label: 'Push в feature', vars: { CI_COMMIT_BRANCH: 'feature/x', CI_PIPELINE_SOURCE: 'push', CI_COMMIT_TAG: '', CI_MERGE_REQUEST_IID: '' } },
  { id: 'mr-src', label: 'MR + изменения в src/', vars: { CI_COMMIT_BRANCH: '', CI_PIPELINE_SOURCE: 'merge_request_event', CI_COMMIT_TAG: '', CI_MERGE_REQUEST_IID: '5' } },
  { id: 'tag', label: 'Тег v2.0.0', vars: { CI_COMMIT_BRANCH: '', CI_PIPELINE_SOURCE: 'push', CI_COMMIT_TAG: 'v2.0.0', CI_MERGE_REQUEST_IID: '' } },
  { id: 'schedule', label: 'По расписанию', vars: { CI_COMMIT_BRANCH: 'main', CI_PIPELINE_SOURCE: 'schedule', CI_COMMIT_TAG: '', CI_MERGE_REQUEST_IID: '' } },
]

function evaluateRuleIf(ifCondition: string, vars: CIVariables): boolean {
  if (!ifCondition) return true
  // Evaluate common patterns
  const v = vars
  const cond = ifCondition
  if (cond === '$CI_COMMIT_BRANCH == "main"') return v.CI_COMMIT_BRANCH === 'main'
  if (cond === '$CI_PIPELINE_SOURCE == "merge_request_event"') return v.CI_PIPELINE_SOURCE === 'merge_request_event'
  if (cond === '$CI_PIPELINE_SOURCE == "schedule"') return v.CI_PIPELINE_SOURCE === 'schedule'
  if (cond === '$CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+$/') return /^v\d+\.\d+\.\d+$/.test(v.CI_COMMIT_TAG)
  if (cond === '$CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE == "push"') return v.CI_COMMIT_BRANCH === 'main' && v.CI_PIPELINE_SOURCE === 'push'
  // Generic: try to match variables
  return false
}

function findMatchedRule(rules: RuleBuilderEntry[], eventId: string): number {
  const event = testEvents44.find(e => e.id === eventId)
  if (!event) return -1
  const vars = event.vars
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]
    // if with changes: need to check if MR event has "src" changes
    const ifOk = evaluateRuleIf(rule.ifCondition, vars)
    let changesOk = true
    if (rule.changes) {
      // Simulate: MR src event has src changes
      changesOk = eventId === 'mr-src' && rule.changes.includes('src')
    }
    if (ifOk && changesOk) return i
  }
  return -1
}

function generateYaml(rules: RuleBuilderEntry[]): string {
  if (rules.length === 0) return 'rules: []'
  const lines: string[] = ['rules:']
  rules.forEach(r => {
    if (r.ifCondition) lines.push(`  - if: ${r.ifCondition}`)
    else lines.push(`  - # (без условия)`)
    if (r.changes) {
      lines.push(`    changes:`)
      r.changes.split('\n').filter(Boolean).forEach(p => lines.push(`      - ${p.trim()}`))
    }
    lines.push(`    when: ${r.when}`)
  })
  return lines.join('\n')
}

export function Task4_4_Solution() {
  const [rules, setRules] = useState<RuleBuilderEntry[]>([])
  const [nextId, setNextId] = useState(1)
  const [newIf, setNewIf] = useState('')
  const [newChanges, setNewChanges] = useState('')
  const [newWhen, setNewWhen] = useState<WhenValue>('on_success')
  const [testEventId, setTestEventId] = useState<string>('push-main')
  const [simResult, setSimResult] = useState<number | null>(null)

  const addRule = () => {
    setRules(prev => [...prev, { id: nextId, ifCondition: newIf, changes: newChanges, when: newWhen }])
    setNextId(n => n + 1)
    setNewIf('')
    setNewChanges('')
    setNewWhen('on_success')
    setSimResult(null)
  }

  const removeRule = (id: number) => {
    setRules(prev => prev.filter(r => r.id !== id))
    setSimResult(null)
  }

  const loadPreset = (preset: PresetConfig) => {
    let id = nextId
    const loaded: RuleBuilderEntry[] = preset.rules.map(r => ({ ...r, id: id++ }))
    setRules(loaded)
    setNextId(id)
    setSimResult(null)
  }

  const runSimulation = () => {
    const idx = findMatchedRule(rules, testEventId)
    setSimResult(idx)
  }

  const whenBg = (w: WhenValue) => {
    if (w === 'never') return '#f5f5f5'
    if (w === 'manual') return '#fff8e1'
    if (w === 'always') return '#e3f2fd'
    return '#e8f5e9'
  }
  const whenBorder = (w: WhenValue) => {
    if (w === 'never') return '#e0e0e0'
    if (w === 'manual') return '#ffcc02'
    if (w === 'always') return '#90caf9'
    return '#a5d6a7'
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Конструктор rules — AND/OR логика</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Добавляй правила, симулируй события, смотри итоговый YAML
      </p>

      {/* Presets */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: '#555', letterSpacing: '0.05em' }}>
          Готовые примеры
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset)}
              title={preset.description}
              style={{ padding: '0.4rem 0.8rem', border: '1px solid #1565C0', borderRadius: '6px', background: '#e3f2fd', color: '#1565C0', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add rule form */}
      <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', background: '#fafafa' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>Добавить правило</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px auto', gap: '0.5rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.25rem' }}>if (условие)</label>
            <input
              value={newIf}
              onChange={e => setNewIf(e.target.value)}
              placeholder='$CI_COMMIT_BRANCH == "main"'
              style={{ width: '100%', padding: '0.4rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.25rem' }}>changes паттерны</label>
            <input
              value={newChanges}
              onChange={e => setNewChanges(e.target.value)}
              placeholder='src/**/*'
              style={{ width: '100%', padding: '0.4rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.25rem' }}>when</label>
            <select
              value={newWhen}
              onChange={e => setNewWhen(e.target.value as WhenValue)}
              style={{ width: '100%', padding: '0.4rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.8rem' }}
            >
              <option value='on_success'>on_success</option>
              <option value='never'>never</option>
              <option value='manual'>manual</option>
              <option value='always'>always</option>
            </select>
          </div>
          <button
            onClick={addRule}
            style={{ padding: '0.45rem 0.8rem', border: 'none', borderRadius: '6px', background: '#1565C0', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            Добавить
          </button>
        </div>
      </div>

      {rules.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Rules list with AND/OR visualization */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: '#555', letterSpacing: '0.05em' }}>
              Правила (OR между ними)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {rules.map((rule, idx) => {
                const isMatched = simResult === idx
                return (
                  <div key={rule.id}>
                    {idx > 0 && (
                      <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#ff9800', padding: '0.15rem 0' }}>OR</div>
                    )}
                    <div
                      style={{
                        border: `2px solid ${isMatched ? '#4caf50' : whenBorder(rule.when)}`,
                        borderRadius: '8px',
                        padding: '0.6rem 0.75rem',
                        background: isMatched ? '#e8f5e9' : whenBg(rule.when),
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.2rem' }}>Правило #{idx + 1}</div>
                          {rule.ifCondition && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1565C0', background: '#e3f2fd', padding: '0 0.3rem', borderRadius: '3px' }}>IF</span>
                              <code style={{ fontSize: '0.78rem', color: '#333' }}>{rule.ifCondition}</code>
                            </div>
                          )}
                          {rule.changes && (
                            <>
                              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7b1fa2', marginBottom: '0.1rem', marginLeft: '0.1rem' }}>AND</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7b1fa2', background: '#f3e5f5', padding: '0 0.3rem', borderRadius: '3px' }}>CHANGES</span>
                                <code style={{ fontSize: '0.78rem', color: '#333' }}>{rule.changes}</code>
                              </div>
                            </>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#555', background: '#eee', padding: '0 0.3rem', borderRadius: '3px' }}>WHEN</span>
                            <code style={{ fontSize: '0.78rem', color: '#333' }}>{rule.when}</code>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {isMatched && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2e7d32' }}>СРАБОТАЛО</span>}
                          <button
                            onClick={() => removeRule(rule.id)}
                            style={{ border: 'none', background: 'transparent', color: '#bbb', cursor: 'pointer', fontSize: '1rem', padding: '0 0.2rem', lineHeight: 1 }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Simulator */}
            <div style={{ marginTop: '1rem', padding: '0.75rem', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#fff' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Тестовый симулятор</div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  value={testEventId}
                  onChange={e => { setTestEventId(e.target.value); setSimResult(null) }}
                  style={{ flex: 1, padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.8rem' }}
                >
                  {testEvents44.map(e => (
                    <option key={e.id} value={e.id}>{e.label}</option>
                  ))}
                </select>
                <button
                  onClick={runSimulation}
                  style={{ padding: '0.4rem 0.75rem', border: 'none', borderRadius: '6px', background: '#1565C0', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                >
                  Проверить
                </button>
              </div>
              {simResult !== null && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: simResult >= 0 ? '#2e7d32' : '#c62828', fontWeight: 600 }}>
                  {simResult >= 0
                    ? `Сработало правило #${simResult + 1} (when: ${rules[simResult].when})`
                    : 'Ни одно правило не сработало — джоб не запустится'}
                </div>
              )}
            </div>
          </div>

          {/* YAML preview */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: '#555', letterSpacing: '0.05em' }}>
              YAML предпросмотр
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', borderRadius: '8px', padding: '1rem', fontSize: '0.8rem', overflowX: 'auto', margin: 0, minHeight: '200px', lineHeight: 1.5 }}>
              {generateYaml(rules)}
            </pre>
          </div>
        </div>
      )}

      {rules.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#bbb', border: '1px dashed #e0e0e0', borderRadius: '8px' }}>
          Добавь правило или загрузи готовый пример
        </div>
      )}
    </div>
  )
}
