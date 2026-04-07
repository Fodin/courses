// ============================================
// Level 13: Monorepos in CI/CD — Solutions
// ============================================

import { useState, useEffect } from 'react'

// ============================================
// Task 13.1: rules:changes simulator
// ============================================

type ChangedPaths = {
  auth: boolean
  payments: boolean
  notifications: boolean
  sharedUtils: boolean
}

const SERVICES = [
  {
    id: 'auth',
    label: 'services/auth',
    color: '#1565C0',
    bg: '#E3F2FD',
    border: '#90CAF9',
    tech: 'Node.js',
    dependsOnShared: true,
    changePaths: ['services/auth/**/*', 'packages/shared-utils/**/*'],
  },
  {
    id: 'payments',
    label: 'services/payments',
    color: '#2E7D32',
    bg: '#E8F5E9',
    border: '#A5D6A7',
    tech: 'Go',
    dependsOnShared: false,
    changePaths: ['services/payments/**/*'],
  },
  {
    id: 'notifications',
    label: 'services/notifications',
    color: '#6A1B9A',
    bg: '#F3E5F5',
    border: '#CE93D8',
    tech: 'Python',
    dependsOnShared: true,
    changePaths: ['services/notifications/**/*', 'packages/shared-utils/**/*'],
  },
]

function willRun(
  serviceId: string,
  changed: ChangedPaths
): { runs: boolean; reason: 'direct' | 'dependency' | 'none' } {
  const service = SERVICES.find(s => s.id === serviceId)!
  const direct = changed[serviceId as keyof ChangedPaths]
  const viaDep = service.dependsOnShared && changed.sharedUtils
  if (direct) return { runs: true, reason: 'direct' }
  if (viaDep) return { runs: true, reason: 'dependency' }
  return { runs: false, reason: 'none' }
}

function buildChangesYaml(changed: ChangedPaths): string {
  const lines: string[] = []
  SERVICES.forEach(s => {
    const { runs } = willRun(s.id, changed)
    lines.push(`${s.id}:build:`)
    lines.push(`  stage: build`)
    lines.push(`  script: cd ${s.label} && make build`)
    lines.push(`  rules:`)
    lines.push(`    - if: $CI_PIPELINE_SOURCE == "merge_request_event"`)
    lines.push(`      changes:`)
    s.changePaths.forEach(p => lines.push(`        - ${p}`))
    lines.push(`    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`)
    lines.push(`  # status: ${runs ? 'WILL RUN' : 'skipped'}`)
    lines.push('')
  })
  return lines.join('\n').trim()
}

export function Task13_1_Solution() {
  const [changed, setChanged] = useState<ChangedPaths>({
    auth: false,
    payments: false,
    notifications: false,
    sharedUtils: false,
  })

  const toggle = (key: keyof ChangedPaths) => {
    setChanged(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const runningCount = SERVICES.filter(s => willRun(s.id, changed).runs).length

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>rules:changes — умный запуск в монорепо</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Отметь изменённые пути и посмотри, какие джобы запустятся
      </p>

      {/* Changed paths selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#333' }}>
          Изменённые файлы в этом MR:
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {SERVICES.map(s => (
            <button
              key={s.id}
              onClick={() => toggle(s.id as keyof ChangedPaths)}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${changed[s.id as keyof ChangedPaths] ? s.color : '#ccc'}`,
                borderRadius: '8px',
                background: changed[s.id as keyof ChangedPaths] ? s.bg : '#fff',
                color: changed[s.id as keyof ChangedPaths] ? s.color : '#666',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all 0.15s',
              }}
            >
              {changed[s.id as keyof ChangedPaths] ? '✓ ' : ''}{s.label}
            </button>
          ))}
          <button
            onClick={() => toggle('sharedUtils')}
            style={{
              padding: '0.5rem 1rem',
              border: `2px solid ${changed.sharedUtils ? '#E65100' : '#ccc'}`,
              borderRadius: '8px',
              background: changed.sharedUtils ? '#FFF3E0' : '#fff',
              color: changed.sharedUtils ? '#E65100' : '#666',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.15s',
            }}
          >
            {changed.sharedUtils ? '✓ ' : ''}packages/shared-utils
          </button>
        </div>
      </div>

      {/* Jobs status */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}>
          <div style={{ fontWeight: 600, color: '#333' }}>Статус джобов:</div>
          <div style={{
            padding: '0.3rem 0.75rem',
            borderRadius: '20px',
            background: runningCount > 0 ? '#E8F5E9' : '#F5F5F5',
            color: runningCount > 0 ? '#2E7D32' : '#999',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}>
            Запустится {runningCount} из {SERVICES.length} джобов
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {SERVICES.map(s => {
            const { runs, reason } = willRun(s.id, changed)
            return (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `1px solid ${runs ? (reason === 'dependency' ? '#FFB74D' : s.border) : '#E0E0E0'}`,
                  background: runs ? (reason === 'dependency' ? '#FFF8E1' : s.bg) : '#FAFAFA',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: runs ? (reason === 'dependency' ? '#FF9800' : '#4CAF50') : '#BDBDBD',
                  flexShrink: 0,
                }} />
                <div style={{ fontWeight: 600, color: runs ? s.color : '#999', minWidth: '200px' }}>
                  {s.id}:build
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                  {s.tech}
                  {s.dependsOnShared && (
                    <span style={{
                      marginLeft: '0.5rem',
                      padding: '0.1rem 0.4rem',
                      background: '#E3F2FD',
                      color: '#1565C0',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                    }}>
                      uses shared-utils
                    </span>
                  )}
                </div>
                <div style={{
                  marginLeft: 'auto',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: runs ? (reason === 'dependency' ? '#E65100' : '#2E7D32') : '#9E9E9E',
                }}>
                  {runs
                    ? reason === 'dependency'
                      ? 'WILL RUN (via dependency)'
                      : 'WILL RUN'
                    : 'skipped'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* YAML */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
          Сгенерированный .gitlab-ci.yml:
        </div>
        <pre style={{
          background: '#1E1E2E',
          color: '#CDD6F4',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.78rem',
          overflowX: 'auto',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {buildChangesYaml(changed)}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Task 13.2: Dynamic child pipelines simulator
// ============================================

type PipelinePhase = 'idle' | 'generating' | 'generated' | 'running' | 'done'
type StageStatus = 'pending' | 'running' | 'success' | 'failed'

type ChildPipeline = {
  service: string
  stages: { name: string; status: StageStatus }[]
}

const SERVICE_YAMLS: Record<string, string> = {
  auth: `# generated-pipelines/auth.yml
auth:build:
  stage: build
  image: node:20
  script:
    - cd services/auth
    - npm ci
    - npm run build

auth:test:
  stage: test
  needs: [auth:build]
  script:
    - cd services/auth
    - npm test

auth:deploy:
  stage: deploy
  needs: [auth:test]
  script:
    - docker build -t auth:$CI_COMMIT_SHA .
    - kubectl set image deployment/auth app=auth:$CI_COMMIT_SHA`,

  payments: `# generated-pipelines/payments.yml
payments:build:
  stage: build
  image: golang:1.21
  script:
    - cd services/payments
    - go build ./...

payments:test:
  stage: test
  needs: [payments:build]
  script:
    - cd services/payments
    - go test ./...

payments:deploy:
  stage: deploy
  needs: [payments:test]
  script:
    - docker build -t payments:$CI_COMMIT_SHA .
    - kubectl set image deployment/payments app=payments:$CI_COMMIT_SHA`,

  notifications: `# generated-pipelines/notifications.yml
notifications:build:
  stage: build
  image: python:3.11
  script:
    - cd services/notifications
    - pip install -r requirements.txt
    - python -m py_compile app.py

notifications:test:
  stage: test
  needs: [notifications:build]
  script:
    - cd services/notifications
    - pytest

notifications:deploy:
  stage: deploy
  needs: [notifications:test]
  script:
    - docker build -t notifications:$CI_COMMIT_SHA .
    - kubectl set image deployment/notifications app=notifications:$CI_COMMIT_SHA`,
}

const SERVICE_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  auth: { color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9' },
  payments: { color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7' },
  notifications: { color: '#6A1B9A', bg: '#F3E5F5', border: '#CE93D8' },
}

const STAGE_COLORS: Record<StageStatus, { text: string; bg: string }> = {
  pending: { text: '#888', bg: '#F5F5F5' },
  running: { text: '#E65100', bg: '#FFF3E0' },
  success: { text: '#2E7D32', bg: '#E8F5E9' },
  failed: { text: '#C62828', bg: '#FFEBEE' },
}

export function Task13_2_Solution() {
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({
    auth: true,
    payments: false,
    notifications: true,
  })
  const [phase, setPhase] = useState<PipelinePhase>('idle')
  const [pipelines, setPipelines] = useState<ChildPipeline[]>([])
  const [selectedYaml, setSelectedYaml] = useState<string | null>(null)
  const [parentStatus, setParentStatus] = useState<'idle' | 'waiting' | 'done'>('idle')

  const changedServices = Object.entries(selectedServices)
    .filter(([, v]) => v)
    .map(([k]) => k)

  const toggleService = (svc: string) => {
    if (phase !== 'idle') return
    setSelectedServices(prev => ({ ...prev, [svc]: !prev[svc] }))
  }

  const runSimulation = () => {
    if (changedServices.length === 0) return
    setPhase('generating')
    setParentStatus('waiting')
    setPipelines([])
    setSelectedYaml(null)

    setTimeout(() => {
      const generated: ChildPipeline[] = changedServices.map(svc => ({
        service: svc,
        stages: [
          { name: 'build', status: 'pending' },
          { name: 'test', status: 'pending' },
          { name: 'deploy', status: 'pending' },
        ],
      }))
      setPipelines(generated)
      setPhase('generated')

      // Start running after a short pause
      setTimeout(() => {
        setPhase('running')
        generated.forEach((pipeline, pi) => {
          pipeline.stages.forEach((_, si) => {
            // Start stage
            setTimeout(() => {
              setPipelines(prev =>
                prev.map((p, pIdx) =>
                  pIdx !== pi
                    ? p
                    : {
                        ...p,
                        stages: p.stages.map((s, sIdx) =>
                          sIdx === si ? { ...s, status: 'running' as StageStatus } : s
                        ),
                      }
                )
              )
              // Finish stage
              setTimeout(() => {
                setPipelines(prev => {
                  const updated: ChildPipeline[] = prev.map((p, pIdx) =>
                    pIdx !== pi
                      ? p
                      : {
                          ...p,
                          stages: p.stages.map((s, sIdx) =>
                            sIdx === si ? { ...s, status: 'success' as StageStatus } : s
                          ),
                        }
                  )
                  // Check if all done
                  const allDone = updated.every(p => p.stages.every(s => s.status === 'success'))
                  if (allDone) {
                    setTimeout(() => {
                      setPhase('done')
                      setParentStatus('done')
                    }, 300)
                  }
                  return updated
                })
              }, 900)
            }, pi * 400 + si * 1200)
          })
        })
      }, 600)
    }, 1800)
  }

  const reset = () => {
    setPhase('idle')
    setPipelines([])
    setSelectedYaml(null)
    setParentStatus('idle')
    setSelectedServices({ auth: false, payments: false, notifications: false })
  }

  const getParentStatusLabel = () => {
    if (parentStatus === 'idle') return { label: 'idle', color: '#888', bg: '#F5F5F5' }
    if (parentStatus === 'waiting') return { label: 'waiting (strategy: depend)', color: '#E65100', bg: '#FFF3E0' }
    return { label: 'success', color: '#2E7D32', bg: '#E8F5E9' }
  }

  const ps = getParentStatusLabel()

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '950px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Dynamic child pipelines для монорепо</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Выбери изменённые сервисы и запусти симуляцию генерации child pipelines
      </p>

      {/* Service selector */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
          Изменённые сервисы:
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {Object.keys(selectedServices).map(svc => {
            const c = SERVICE_COLORS[svc]
            const active = selectedServices[svc]
            return (
              <button
                key={svc}
                onClick={() => toggleService(svc)}
                disabled={phase !== 'idle'}
                style={{
                  padding: '0.5rem 1.25rem',
                  border: `2px solid ${active ? c.color : '#ccc'}`,
                  borderRadius: '8px',
                  background: active ? c.bg : '#fff',
                  color: active ? c.color : '#999',
                  cursor: phase === 'idle' ? 'pointer' : 'default',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  opacity: phase !== 'idle' ? 0.7 : 1,
                }}
              >
                {active ? '✓ ' : ''}{svc}
              </button>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={runSimulation}
          disabled={phase !== 'idle' || changedServices.length === 0}
          style={{
            padding: '0.6rem 1.5rem',
            background: phase === 'idle' && changedServices.length > 0 ? '#1565C0' : '#BDBDBD',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: phase === 'idle' && changedServices.length > 0 ? 'pointer' : 'default',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          {phase === 'generating' ? 'Генерация...' : 'Запустить пайплайн'}
        </button>
        {phase !== 'idle' && (
          <button
            onClick={reset}
            style={{
              padding: '0.6rem 1.5rem',
              background: '#fff',
              color: '#555',
              border: '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Сбросить
          </button>
        )}
      </div>

      {/* Parent pipeline status */}
      <div style={{
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: `1px solid ${ps.bg === '#FFF3E0' ? '#FFB74D' : '#E0E0E0'}`,
        background: ps.bg,
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        {parentStatus === 'waiting' && (
          <span style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: '2px solid #E65100',
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }} />
        )}
        {parentStatus === 'done' && <span style={{ color: '#2E7D32' }}>✓</span>}
        <div style={{ fontWeight: 600, color: ps.color }}>
          Родительский пайплайн: <span style={{ fontFamily: 'monospace' }}>{ps.label}</span>
        </div>
        {parentStatus === 'waiting' && (
          <div style={{ fontSize: '0.8rem', color: '#BF360C', marginLeft: 'auto' }}>
            ожидает завершения всех child pipelines
          </div>
        )}
      </div>

      {/* Generated pipelines */}
      {pipelines.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#333' }}>
            Сгенерированные child pipelines:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pipelines.map(pipeline => {
              const c = SERVICE_COLORS[pipeline.service]
              return (
                <div
                  key={pipeline.service}
                  style={{
                    border: `1px solid ${c.border}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    background: c.bg,
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}>
                    <span style={{ fontWeight: 700, color: c.color, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      pipeline-{pipeline.service}.yml
                    </span>
                    <button
                      onClick={() => setSelectedYaml(
                        selectedYaml === pipeline.service ? null : pipeline.service
                      )}
                      style={{
                        marginLeft: 'auto',
                        padding: '0.25rem 0.75rem',
                        border: `1px solid ${c.border}`,
                        borderRadius: '6px',
                        background: '#fff',
                        color: c.color,
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {selectedYaml === pipeline.service ? 'Скрыть YAML' : 'Смотреть YAML'}
                    </button>
                  </div>
                  {/* Stages */}
                  <div style={{
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    background: '#fff',
                  }}>
                    {pipeline.stages.map((stage, idx) => {
                      const sc = STAGE_COLORS[stage.status]
                      return (
                        <div key={stage.name} style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{
                            padding: '0.3rem 0.75rem',
                            borderRadius: '6px',
                            background: sc.bg,
                            color: sc.text,
                            fontWeight: 600,
                            fontSize: '0.78rem',
                            border: `1px solid ${sc.bg === '#F5F5F5' ? '#E0E0E0' : sc.bg}`,
                          }}>
                            {stage.status === 'running' ? '▶ ' : stage.status === 'success' ? '✓ ' : ''}
                            {stage.name}
                          </div>
                          {idx < pipeline.stages.length - 1 && (
                            <span style={{ color: '#BDBDBD', margin: '0 0.25rem', fontSize: '0.8rem' }}>→</span>
                          )}
                        </div>
                      )
                    })}
                    <div style={{
                      marginLeft: 'auto',
                      fontSize: '0.75rem',
                      color: pipeline.stages.every(s => s.status === 'success')
                        ? '#2E7D32'
                        : pipeline.stages.some(s => s.status === 'running')
                          ? '#E65100'
                          : '#999',
                      fontWeight: 600,
                    }}>
                      {pipeline.stages.every(s => s.status === 'success')
                        ? 'passed'
                        : pipeline.stages.some(s => s.status === 'running')
                          ? 'running'
                          : 'pending'}
                    </div>
                  </div>
                  {/* YAML */}
                  {selectedYaml === pipeline.service && (
                    <pre style={{
                      background: '#1E1E2E',
                      color: '#CDD6F4',
                      margin: 0,
                      padding: '0.75rem',
                      fontSize: '0.73rem',
                      overflowX: 'auto',
                      lineHeight: 1.5,
                    }}>
                      {SERVICE_YAMLS[pipeline.service]}
                    </pre>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {phase === 'generating' && (
        <div style={{
          padding: '1.5rem',
          textAlign: 'center',
          color: '#666',
          background: '#F9FBE7',
          borderRadius: '8px',
          border: '1px solid #F0F4C3',
        }}>
          Скрипт analyze-changes.py анализирует git diff и генерирует pipeline YAML файлы...
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ============================================
// Task 13.3: Cache strategy configurator
// ============================================

type CachePolicy = 'pull-push' | 'pull' | 'push'

type ServiceConfig = {
  id: string
  label: string
  tech: string
  techColor: string
  lockFile: string
  policy: CachePolicy
  branchIsolation: boolean
}

const POLICY_DESCRIPTIONS: Record<CachePolicy, string> = {
  'pull-push': 'Читает и обновляет кэш',
  'pull': 'Только читает (не обновляет)',
  'push': 'Только записывает (не читает)',
}

const POLICY_COLORS: Record<CachePolicy, { color: string; bg: string }> = {
  'pull-push': { color: '#1565C0', bg: '#E3F2FD' },
  'pull': { color: '#2E7D32', bg: '#E8F5E9' },
  'push': { color: '#E65100', bg: '#FFF3E0' },
}

const nextPolicy = (p: CachePolicy): CachePolicy => {
  const order: CachePolicy[] = ['pull-push', 'pull', 'push']
  return order[(order.indexOf(p) + 1) % order.length]
}

function buildCacheYaml(configs: ServiceConfig[]): string {
  return configs.map(c => {
    const keyPrefix = c.branchIsolation
      ? `${c.id}-$CI_COMMIT_REF_SLUG`
      : c.id
    return `${c.id}:build:
  cache:
    key:
      files:
        - ${c.lockFile}
      prefix: "${keyPrefix}"
    paths:
      - ${c.id === 'payments' ? '$GOPATH/pkg/mod/' : c.id === 'notifications' ? 'services/${c.id}/venv/' : `services/${c.id}/node_modules/`}
    policy: ${c.policy}`
  }).join('\n\n')
}

function getCacheKey(config: ServiceConfig): string {
  const prefix = config.branchIsolation
    ? `${config.id}-$CI_COMMIT_REF_SLUG`
    : config.id
  return `"${prefix}-$HASH(${config.lockFile})"`
}

function analyzeConfig(configs: ServiceConfig[]): { ok: boolean; issues: string[] } {
  const issues: string[] = []

  // Check for cache key conflicts (same prefix = same key = conflict)
  const prefixes = configs.map(c => c.id) // simplified: prefix without branch isolation
  const noIsolation = configs.filter(c => !c.branchIsolation)
  if (noIsolation.length > 1) {
    // Check if different services without isolation would conflict
    // (they won't actually conflict since prefix includes service id, but warn about cross-branch pollution)
  }

  // Check that at least one job writes cache
  const hasWriter = configs.some(c => c.policy === 'pull-push' || c.policy === 'push')
  if (!hasWriter) {
    issues.push('Никто не создаёт кэш (нет политики pull-push или push) — все джобы будут работать без кэша')
  }

  // Warn about push-only (no reader)
  const pushOnly = configs.filter(c => c.policy === 'push')
  if (pushOnly.length === configs.length) {
    issues.push('Все джобы только пишут кэш, но никто его не читает — это бессмысленно')
  }

  // Check for missing branch isolation when multiple services share the same base key
  const sharedKeyWithoutIsolation = configs.filter(c => !c.branchIsolation)
  if (sharedKeyWithoutIsolation.length > 0) {
    issues.push(`${sharedKeyWithoutIsolation.map(c => c.id).join(', ')}: без изоляции по ветке кэш будет общим для всех веток — возможно загрязнение feature-ветки кэшем main`)
  }

  return { ok: issues.length === 0, issues }
}

export function Task13_3_Solution() {
  const [configs, setConfigs] = useState<ServiceConfig[]>([
    {
      id: 'auth',
      label: 'Auth Service',
      tech: 'Node.js',
      techColor: '#1565C0',
      lockFile: 'services/auth/package-lock.json',
      policy: 'pull-push',
      branchIsolation: true,
    },
    {
      id: 'payments',
      label: 'Payments Service',
      tech: 'Go',
      techColor: '#2E7D32',
      lockFile: 'services/payments/go.sum',
      policy: 'pull',
      branchIsolation: true,
    },
    {
      id: 'notifications',
      label: 'Notifications Service',
      tech: 'Python',
      techColor: '#6A1B9A',
      lockFile: 'services/notifications/requirements.txt',
      policy: 'pull-push',
      branchIsolation: false,
    },
  ])

  const updateConfig = (id: string, update: Partial<ServiceConfig>) => {
    setConfigs(prev => prev.map(c => (c.id === id ? { ...c, ...update } : c)))
  }

  const { ok, issues } = analyzeConfig(configs)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '950px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Конструктор стратегии кэширования</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Настрой параметры кэша для каждого сервиса и посмотри итоговую конфигурацию
      </p>

      {/* Service cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {configs.map(config => {
          const pc = POLICY_COLORS[config.policy]
          return (
            <div
              key={config.id}
              style={{
                border: '1px solid #E0E0E0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '0.75rem 1rem',
                background: '#F9F9F9',
                borderBottom: '1px solid #E0E0E0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: config.techColor,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                }}>
                  {config.tech[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#222' }}>{config.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{config.tech}</div>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '0.75rem 1rem' }}>
                {/* Lock file */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: '0.3rem', fontWeight: 600 }}>
                    Lock-файл:
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    background: '#F5F5F5',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    color: '#333',
                  }}>
                    {config.lockFile}
                  </div>
                </div>

                {/* Policy */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#555', marginBottom: '0.3rem', fontWeight: 600 }}>
                    Политика кэша:
                  </div>
                  <button
                    onClick={() => updateConfig(config.id, { policy: nextPolicy(config.policy) })}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.75rem',
                      border: `2px solid ${pc.bg}`,
                      borderRadius: '6px',
                      background: pc.bg,
                      color: pc.color,
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textAlign: 'left',
                    }}
                  >
                    {config.policy}
                  </button>
                  <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.25rem' }}>
                    {POLICY_DESCRIPTIONS[config.policy]}
                  </div>
                </div>

                {/* Branch isolation */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type='checkbox'
                      checked={config.branchIsolation}
                      onChange={e => updateConfig(config.id, { branchIsolation: e.target.checked })}
                      style={{ width: '14px', height: '14px' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: '#555', fontWeight: 600 }}>
                      Изолировать по ветке
                    </span>
                  </label>
                  <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.2rem', paddingLeft: '1.5rem' }}>
                    Добавляет $CI_COMMIT_REF_SLUG в ключ
                  </div>
                </div>
              </div>

              {/* Cache key preview */}
              <div style={{
                padding: '0.5rem 1rem',
                background: '#F0F4FF',
                borderTop: '1px solid #E0E0E0',
                fontSize: '0.72rem',
              }}>
                <span style={{ color: '#888' }}>Ключ: </span>
                <span style={{ fontFamily: 'monospace', color: '#1565C0', wordBreak: 'break-all' }}>
                  {getCacheKey(config)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Analysis */}
      <div style={{
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: `1px solid ${ok ? '#A5D6A7' : '#FFCC02'}`,
        background: ok ? '#E8F5E9' : '#FFFDE7',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontWeight: 700, color: ok ? '#2E7D32' : '#F57F17', marginBottom: issues.length > 0 ? '0.5rem' : 0 }}>
          {ok ? 'Конфигурация оптимальна' : `Обнаружены проблемы (${issues.length})`}
        </div>
        {issues.map((issue, i) => (
          <div key={i} style={{ fontSize: '0.82rem', color: '#555', marginTop: '0.25rem' }}>
            ⚠ {issue}
          </div>
        ))}
      </div>

      {/* YAML */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
          Итоговая конфигурация .gitlab-ci.yml:
        </div>
        <pre style={{
          background: '#1E1E2E',
          color: '#CDD6F4',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.78rem',
          overflowX: 'auto',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {buildCacheYaml(configs)}
        </pre>
      </div>
    </div>
  )
}
