// ============================================
// Level 9: Environments and Deploy — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 9.1: Environment lifecycle
// ============================================

type EnvStatus = 'active' | 'stopped'

interface EnvHistoryEntry {
  version: number
  date: string
}

interface EnvState {
  name: string
  url: string
  version: number
  status: EnvStatus
  history: EnvHistoryEntry[]
  color: string
  bg: string
  border: string
}

const ENV_CONFIG: Omit<EnvState, 'version' | 'status' | 'history'>[] = [
  { name: 'dev', url: 'https://dev.myapp.com', color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9' },
  { name: 'staging', url: 'https://staging.myapp.com', color: '#E65100', bg: '#FFF3E0', border: '#FFCC80' },
  { name: 'production', url: 'https://myapp.com', color: '#B71C1C', bg: '#FFEBEE', border: '#EF9A9A' },
]

function nowStr() {
  return new Date().toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
}

const INITIAL_ENVS: EnvState[] = ENV_CONFIG.map((c, i) => ({
  ...c,
  version: i + 1,
  status: 'active',
  history: [{ version: i + 1, date: '01.04, 10:00' }],
}))

export function Task9_1_Solution() {
  const [envs, setEnvs] = useState<EnvState[]>(INITIAL_ENVS)

  const deploy = (idx: number) => {
    setEnvs(prev => prev.map((env, i) => {
      if (i !== idx) return env
      const nextVersion = env.version + 1
      const entry: EnvHistoryEntry = { version: nextVersion, date: nowStr() }
      return {
        ...env,
        version: nextVersion,
        status: 'active',
        history: [entry, ...env.history].slice(0, 3),
      }
    }))
  }

  const stop = (idx: number) => {
    setEnvs(prev => prev.map((env, i) => i === idx ? { ...env, status: 'stopped' } : env))
  }

  const rollback = (idx: number) => {
    setEnvs(prev => prev.map((env, i) => {
      if (i !== idx || env.version <= 1) return env
      const prevVersion = env.version - 1
      const entry: EnvHistoryEntry = { version: prevVersion, date: nowStr() + ' (rollback)' }
      return {
        ...env,
        version: prevVersion,
        history: [entry, ...env.history].slice(0, 3),
      }
    }))
  }

  const btnStyle = (disabled: boolean, color: string): React.CSSProperties => ({
    padding: '0.35rem 0.75rem',
    border: 'none',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#E0E0E0' : color,
    color: disabled ? '#9E9E9E' : '#fff',
    fontSize: '0.8rem',
    fontWeight: 600,
    opacity: disabled ? 0.6 : 1,
  })

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Жизненный цикл окружений</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Симулируй деплой, остановку и rollback для трёх окружений
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {envs.map((env, idx) => {
          const isActive = env.status === 'active'
          const canRollback = isActive && env.version > 1
          return (
            <div key={env.name} style={{
              border: `2px solid ${env.border}`,
              borderRadius: '12px',
              padding: '1rem',
              background: env.bg,
              minWidth: '220px',
              flex: '1',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: env.color }}>{env.name}</span>
                  <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.15rem' }}>{env.url}</div>
                </div>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: isActive ? '#E8F5E9' : '#F5F5F5',
                  color: isActive ? '#2E7D32' : '#757575',
                  border: `1px solid ${isActive ? '#A5D6A7' : '#BDBDBD'}`,
                }}>
                  {isActive ? 'active' : 'stopped'}
                </span>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#555' }}>
                  Версия: <strong style={{ color: env.color }}>v{env.version}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>
                  Последний деплой: {env.history[0]?.date}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <button onClick={() => deploy(idx)} style={btnStyle(false, env.color)}>
                  Deploy
                </button>
                <button onClick={() => rollback(idx)} disabled={!canRollback} style={btnStyle(!canRollback, '#795548')}>
                  Rollback
                </button>
                <button onClick={() => stop(idx)} disabled={!isActive} style={btnStyle(!isActive, '#616161')}>
                  Stop
                </button>
              </div>

              <div style={{ borderTop: `1px solid ${env.border}`, paddingTop: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#888', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                  История деплоев
                </div>
                {env.history.map((h, hi) => (
                  <div key={hi} style={{ fontSize: '0.75rem', color: hi === 0 ? env.color : '#999', marginBottom: '0.15rem' }}>
                    {hi === 0 ? '→ ' : '  '}v{h.version} — {h.date}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// Task 9.2: Deploy strategies
// ============================================

type Strategy = 'rolling' | 'bluegreen' | 'canary'

interface ServerBlock {
  version: 'v1' | 'v2' | 'canary'
  label: string
}

const STRATEGY_YAML: Record<Strategy, string> = {
  rolling: `deploy-rolling:
  stage: deploy
  script:
    - for server in $SERVERS; do
        ssh $server "docker pull myapp:$CI_COMMIT_SHA"
        ssh $server "docker stop myapp"
        ssh $server "docker run -d --name myapp myapp:$CI_COMMIT_SHA"
        sleep 10
        curl -f https://$server/health || exit 1
      done
  environment:
    name: production`,

  bluegreen: `deploy-green:
  stage: deploy
  script:
    - docker tag myapp:$CI_COMMIT_SHA myapp:green
    - docker-compose -f docker-compose.green.yml up -d
    - ./wait-for-healthy.sh green
  environment:
    name: production/green

switch-to-green:
  stage: switch
  script:
    - ./update-nginx.sh green
    - nginx -s reload
    - ./smoke-test.sh https://myapp.com
  environment:
    name: production
  when: manual
  needs: [deploy-green]`,

  canary: `deploy-canary:
  stage: deploy
  script:
    - kubectl set image deployment/myapp-canary \\
        myapp=myapp:$CI_COMMIT_SHA
    - kubectl scale deployment/myapp-canary --replicas=1
  environment:
    name: production/canary
  when: manual

promote-canary:
  stage: promote
  script:
    - kubectl set image deployment/myapp \\
        myapp=myapp:$CI_COMMIT_SHA
    - kubectl scale deployment/myapp-canary --replicas=0
  environment:
    name: production
  when: manual
  needs: [deploy-canary]`,
}

const STRATEGY_INFO: Record<Strategy, { downtime: string; rollback: string; resources: string; desc: string }> = {
  rolling: {
    downtime: 'Нет',
    rollback: 'Медленный (повторный деплой)',
    resources: 'Стандарт (x1)',
    desc: 'Обновляет инстансы по одному. В переходный момент работают обе версии.',
  },
  bluegreen: {
    downtime: 'Нет',
    rollback: 'Мгновенный (переключить LB)',
    resources: 'Удвоенные (x2)',
    desc: 'Два полных окружения. Трафик переключается целиком одной командой.',
  },
  canary: {
    downtime: 'Нет',
    rollback: 'Быстрый (scale canary=0)',
    resources: 'Небольшой overhead',
    desc: 'Малая доля трафика на новую версию. После проверки метрик — полный выкат.',
  },
}

function buildServers(strategy: Strategy, step: number, bgTrafficGreen: boolean, canaryPromoted: boolean): ServerBlock[] {
  if (strategy === 'rolling') {
    return Array.from({ length: 4 }, (_, i) => ({
      label: `Server ${i + 1}`,
      version: i < step ? 'v2' : 'v1',
    }))
  }
  if (strategy === 'bluegreen') {
    return [
      ...Array.from({ length: 4 }, (_, i) => ({
        label: `Blue ${i + 1}`,
        version: bgTrafficGreen ? 'v1' : 'v2' as 'v1' | 'v2',
      })),
      ...Array.from({ length: 4 }, (_, i) => ({
        label: `Green ${i + 1}`,
        version: 'v2' as 'v2',
      })),
    ]
  }
  // canary
  return Array.from({ length: 4 }, (_, i) => ({
    label: `Pod ${i + 1}`,
    version: canaryPromoted ? 'v2' : (i === 0 && step > 0 ? 'canary' : 'v1'),
  }))
}

const VERSION_COLOR: Record<string, { bg: string; color: string; border: string }> = {
  v1: { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' },
  v2: { bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
  canary: { bg: '#FFF9C4', color: '#F57F17', border: '#FFF176' },
}

export function Task9_2_Solution() {
  const [strategy, setStrategy] = useState<Strategy>('rolling')
  const [step, setStep] = useState(0)
  const [bgTrafficGreen, setBgTrafficGreen] = useState(false)
  const [canaryPromoted, setCanaryPromoted] = useState(false)

  const reset = () => { setStep(0); setBgTrafficGreen(false); setCanaryPromoted(false) }

  const handleStrategyChange = (s: Strategy) => { setStrategy(s); reset() }

  const servers = buildServers(strategy, step, bgTrafficGreen, canaryPromoted)
  const info = STRATEGY_INFO[strategy]

  const maxSteps = strategy === 'rolling' ? 4 : 1
  const deployDone = strategy === 'rolling' ? step >= 4 : step >= 1

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.5rem 1.2rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    background: active ? '#1976D2' : '#E3F2FD',
    color: active ? '#fff' : '#1565C0',
    fontWeight: active ? 700 : 400,
    fontSize: '0.9rem',
  })

  const actionBtn = (disabled: boolean): React.CSSProperties => ({
    padding: '0.4rem 1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#E0E0E0' : '#2E7D32',
    color: disabled ? '#9E9E9E' : '#fff',
    fontWeight: 600,
    fontSize: '0.85rem',
  })

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '920px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Стратегии деплоя</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1rem' }}>
        Выбери стратегию и пошагово симулируй процесс обновления
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['rolling', 'bluegreen', 'canary'] as Strategy[]).map(s => (
          <button key={s} onClick={() => handleStrategyChange(s)} style={tabStyle(strategy === s)}>
            {s === 'rolling' ? 'Rolling' : s === 'bluegreen' ? 'Blue-Green' : 'Canary'}
          </button>
        ))}
      </div>

      <div style={{ background: '#F5F5F5', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#555' }}>
        {info.desc}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          <span>Downtime: <strong>{info.downtime}</strong></span>
          <span>Rollback: <strong>{info.rollback}</strong></span>
          <span>Ресурсы: <strong>{info.resources}</strong></span>
        </div>
      </div>

      {/* Servers */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          {strategy === 'bluegreen' ? 'Blue окружение (v1) + Green окружение (v2)' : 'Серверы'}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {servers.map((srv, i) => {
            const vc = VERSION_COLOR[srv.version]
            const isActive = strategy === 'bluegreen' && ((bgTrafficGreen && srv.label.startsWith('Green')) || (!bgTrafficGreen && srv.label.startsWith('Blue')))
            return (
              <div key={i} style={{
                border: `2px solid ${isActive ? '#F57F17' : vc.border}`,
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                background: vc.bg,
                textAlign: 'center',
                minWidth: '80px',
                boxShadow: isActive ? '0 0 0 3px rgba(245,127,23,0.3)' : 'none',
              }}>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>{srv.label}</div>
                <div style={{ fontWeight: 700, color: vc.color, fontSize: '0.9rem' }}>{srv.version}</div>
                {isActive && <div style={{ fontSize: '0.65rem', color: '#E65100' }}>active LB</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {strategy === 'rolling' && (
          <button
            onClick={() => setStep(s => Math.min(s + 1, 4))}
            disabled={deployDone}
            style={actionBtn(deployDone)}
          >
            {deployDone ? 'Деплой завершён' : `Обновить сервер ${step + 1}/4`}
          </button>
        )}
        {strategy === 'bluegreen' && (
          <>
            <button
              onClick={() => setStep(1)}
              disabled={step >= 1}
              style={actionBtn(step >= 1)}
            >
              Deploy Green
            </button>
            <button
              onClick={() => setBgTrafficGreen(true)}
              disabled={step < 1 || bgTrafficGreen}
              style={actionBtn(step < 1 || bgTrafficGreen)}
            >
              Переключить трафик на Green
            </button>
          </>
        )}
        {strategy === 'canary' && (
          <>
            <button
              onClick={() => setStep(1)}
              disabled={step >= 1}
              style={actionBtn(step >= 1)}
            >
              Deploy Canary (10%)
            </button>
            <button
              onClick={() => setCanaryPromoted(true)}
              disabled={step < 1 || canaryPromoted}
              style={actionBtn(step < 1 || canaryPromoted)}
            >
              Promote (100%)
            </button>
          </>
        )}
        <button onClick={reset} style={{
          padding: '0.4rem 1rem', border: '1px solid #BDBDBD', borderRadius: '6px',
          cursor: 'pointer', background: '#fff', color: '#555', fontSize: '0.85rem',
        }}>
          Сбросить
        </button>
      </div>

      {/* YAML */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          GitLab CI конфигурация
        </div>
        <pre style={{
          background: '#1E1E2E', color: '#CDD6F4', padding: '1rem', borderRadius: '8px',
          fontSize: '0.78rem', overflow: 'auto', margin: 0, lineHeight: 1.6,
        }}>
          {STRATEGY_YAML[strategy]}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Task 9.3: Rollback и откат деплоев
// ============================================

const IMAGE_SHAS = ['a1b2c3d', 'e4f5g6h', 'i7j8k9l', 'm0n1o2p', 'q3r4s5t', 'u6v7w8x']

interface RollbackState {
  stableIdx: number
  previousIdx: number | null
  log: string[]
  incident: boolean
}

function addLog(log: string[], msg: string): string[] {
  const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  return [`[${time}] ${msg}`, ...log].slice(0, 6)
}

export function Task9_3_Solution() {
  const [state, setState] = useState<RollbackState>({
    stableIdx: 0,
    previousIdx: null,
    log: ['[10:00] Initial deploy: a1b2c3d → stable'],
    incident: false,
  })

  const deploy = (incidentMode = false) => {
    setState(prev => {
      const nextIdx = (prev.stableIdx + 1) % IMAGE_SHAS.length
      const sha = IMAGE_SHAS[nextIdx]
      const msg = incidentMode
        ? `Deploy FAILED build: ${sha} → stable (INCIDENT!)`
        : `Deploy: ${sha} → stable`
      return {
        stableIdx: nextIdx,
        previousIdx: prev.stableIdx,
        log: addLog(prev.log, msg),
        incident: incidentMode,
      }
    })
  }

  const rollback = () => {
    setState(prev => {
      if (prev.previousIdx === null) return prev
      const sha = IMAGE_SHAS[prev.previousIdx]
      return {
        stableIdx: prev.previousIdx,
        previousIdx: null,
        log: addLog(prev.log, `Rollback → ${sha} (previous)`),
        incident: false,
      }
    })
  }

  const { stableIdx, previousIdx, log, incident } = state
  const canRollback = previousIdx !== null

  const tagStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.72rem',
    fontWeight: 600,
    background: active ? '#E8F5E9' : 'transparent',
    color: active ? '#2E7D32' : 'transparent',
    border: active ? '1px solid #A5D6A7' : '1px solid transparent',
    marginLeft: '0.25rem',
  })

  const prevTagStyle = (active: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.72rem',
    fontWeight: 600,
    background: active ? '#FFF3E0' : 'transparent',
    color: active ? '#E65100' : 'transparent',
    border: active ? '1px solid #FFCC80' : '1px solid transparent',
    marginLeft: '0.25rem',
  })

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '780px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Rollback — система тегов образов</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.25rem' }}>
        Симулятор деплоя с тегами previous / stable. Rollback = переключить stable обратно.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {/* Image registry */}
        <div style={{ flex: '1', minWidth: '280px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Container Registry
          </div>
          {IMAGE_SHAS.map((sha, i) => (
            <div key={sha} style={{
              display: 'flex', alignItems: 'center',
              padding: '0.4rem 0.6rem',
              background: i === stableIdx ? '#E8F5E9' : (i === (previousIdx ?? -1) ? '#FFF3E0' : '#FAFAFA'),
              border: `1px solid ${i === stableIdx ? '#A5D6A7' : (i === (previousIdx ?? -1) ? '#FFCC80' : '#E0E0E0')}`,
              borderRadius: '6px',
              marginBottom: '0.3rem',
              fontFamily: 'monospace',
            }}>
              <span style={{ fontSize: '0.85rem', flex: 1 }}>{sha}</span>
              <span style={tagStyle(i === stableIdx)}>stable</span>
              <span style={prevTagStyle(i === (previousIdx ?? -1))}>previous</span>
            </div>
          ))}
        </div>

        {/* Production + controls */}
        <div style={{ flex: '1', minWidth: '220px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Production
          </div>
          <div style={{
            border: `2px solid ${incident ? '#EF9A9A' : '#A5D6A7'}`,
            borderRadius: '12px',
            padding: '1rem',
            background: incident ? '#FFEBEE' : '#E8F5E9',
            marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>Активный образ (stable)</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.2rem', color: incident ? '#B71C1C' : '#2E7D32', margin: '0.3rem 0' }}>
              {IMAGE_SHAS[stableIdx]}
            </div>
            {incident && (
              <div style={{ fontSize: '0.8rem', color: '#B71C1C', fontWeight: 600 }}>
                INCIDENT: сервис деградировал!
              </div>
            )}
            {previousIdx !== null && (
              <div style={{ fontSize: '0.75rem', color: '#E65100', marginTop: '0.25rem' }}>
                previous: {IMAGE_SHAS[previousIdx]}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => deploy(false)}
              style={{ padding: '0.5rem', background: '#1976D2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              Deploy новой версии
            </button>
            <button
              onClick={() => deploy(true)}
              style={{ padding: '0.5rem', background: '#E65100', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              Simulate Incident
            </button>
            <button
              onClick={rollback}
              disabled={!canRollback}
              style={{
                padding: '0.5rem',
                background: canRollback ? '#795548' : '#E0E0E0',
                color: canRollback ? '#fff' : '#9E9E9E',
                border: 'none', borderRadius: '8px',
                cursor: canRollback ? 'pointer' : 'not-allowed',
                fontWeight: 600,
              }}
            >
              Rollback {!canRollback ? '(нет previous)' : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Event log */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Лог событий
        </div>
        <div style={{ background: '#1E1E2E', borderRadius: '8px', padding: '0.75rem 1rem' }}>
          {log.map((entry, i) => (
            <div key={i} style={{
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: i === 0 ? (entry.includes('INCIDENT') ? '#F38BA8' : '#A6E3A1') : '#6C7086',
              marginBottom: '0.2rem',
            }}>
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 9.4: Review Apps — dynamic environments for MR
// ============================================

type BranchStatus = 'idle' | 'mr_open' | 'merged' | 'closed'

interface BranchState {
  name: string
  status: BranchStatus
  deployStatus: 'none' | 'deploying' | 'active'
}

const BRANCHES: string[] = [
  'feature/user-auth',
  'fix/login-bug',
  'feature/dark-mode',
  'refactor/api-client',
]

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function buildReviewYaml(autoStopIn: string): string {
  return `.review-vars: &review-vars
  KUBE_NAMESPACE: review-$CI_COMMIT_REF_SLUG
  REVIEW_URL: https://$CI_COMMIT_REF_SLUG.review.myapp.com

deploy-review:
  stage: deploy
  variables:
    <<: *review-vars
  script:
    - kubectl create namespace $KUBE_NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
    - envsubst < k8s/review-template.yml | kubectl apply -n $KUBE_NAMESPACE -f -
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    url: $REVIEW_URL
    on_stop: stop-review
    auto_stop_in: ${autoStopIn}
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'

stop-review:
  stage: deploy
  variables:
    <<: *review-vars
    GIT_STRATEGY: none
  script:
    - kubectl delete namespace $KUBE_NAMESPACE --ignore-not-found
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    action: stop
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: manual`
}

export function Task9_4_Solution() {
  const [branches, setBranches] = useState<BranchState[]>(
    BRANCHES.map(name => ({ name, status: 'idle', deployStatus: 'none' }))
  )
  const [autoStopIn, setAutoStopIn] = useState('1 week')
  const [eventLog, setEventLog] = useState<string[]>(['[ready] Review Apps симулятор готов'])

  const logEvent = (msg: string) => {
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    setEventLog(prev => [`[${time}] ${msg}`, ...prev].slice(0, 8))
  }

  const openMR = (idx: number) => {
    const slug = toSlug(branches[idx].name)
    setBranches(prev => prev.map((b, i) => i === idx
      ? { ...b, status: 'mr_open', deployStatus: 'deploying' }
      : b
    ))
    logEvent(`MR открыт: ${branches[idx].name} → deploy-review запущен`)
    setTimeout(() => {
      setBranches(prev => prev.map((b, i) => i === idx && b.deployStatus === 'deploying'
        ? { ...b, deployStatus: 'active' }
        : b
      ))
      logEvent(`Review App активен: https://${slug}.review.myapp.com`)
    }, 800)
  }

  const closeMR = (idx: number, action: 'merge' | 'close') => {
    const slug = toSlug(branches[idx].name)
    const status: BranchStatus = action === 'merge' ? 'merged' : 'closed'
    setBranches(prev => prev.map((b, i) => i === idx
      ? { ...b, status, deployStatus: 'none' }
      : b
    ))
    logEvent(`${action === 'merge' ? 'Merged' : 'Closed'}: ${branches[idx].name} → stop-review: namespace review-${slug} удалён`)
  }

  const reset = () => {
    setBranches(BRANCHES.map(name => ({ name, status: 'idle', deployStatus: 'none' })))
    setEventLog(['[reset] Симулятор сброшен'])
  }

  const activeCount = branches.filter(b => b.deployStatus === 'active').length

  const STATUS_LABEL: Record<BranchStatus, string> = {
    idle: 'Нет MR',
    mr_open: 'MR открыт',
    merged: 'Merged',
    closed: 'Закрыт',
  }

  const STATUS_COLOR: Record<BranchStatus, string> = {
    idle: '#9E9E9E',
    mr_open: '#1976D2',
    merged: '#2E7D32',
    closed: '#757575',
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '920px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Review Apps — динамические окружения для MR</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '0.5rem' }}>
        Открытие MR создаёт окружение, закрытие — удаляет его
      </p>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{
          background: activeCount > 0 ? '#E8F5E9' : '#F5F5F5',
          border: `1px solid ${activeCount > 0 ? '#A5D6A7' : '#E0E0E0'}`,
          borderRadius: '8px',
          padding: '0.4rem 0.9rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: activeCount > 0 ? '#2E7D32' : '#757575',
        }}>
          Активных Review Apps: {activeCount} / 4 pods используется
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#555' }}>auto_stop_in:</span>
          {['1 day', '1 week', '30 days'].map(opt => (
            <button key={opt} onClick={() => setAutoStopIn(opt)} style={{
              padding: '0.3rem 0.6rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              background: autoStopIn === opt ? '#1976D2' : '#E3F2FD',
              color: autoStopIn === opt ? '#fff' : '#1565C0',
              fontWeight: autoStopIn === opt ? 700 : 400,
              fontSize: '0.8rem',
            }}>
              {opt}
            </button>
          ))}
        </div>
        <button onClick={reset} style={{
          padding: '0.3rem 0.8rem', border: '1px solid #BDBDBD', borderRadius: '6px',
          cursor: 'pointer', background: '#fff', color: '#555', fontSize: '0.8rem',
        }}>
          Сбросить
        </button>
      </div>

      {/* Branches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
        {branches.map((branch, idx) => {
          const slug = toSlug(branch.name)
          const url = `https://${slug}.review.myapp.com`
          const isMrOpen = branch.status === 'mr_open'
          const isDone = branch.status === 'merged' || branch.status === 'closed'
          return (
            <div key={branch.name} style={{
              border: `1px solid ${isMrOpen ? '#90CAF9' : '#E0E0E0'}`,
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              background: isMrOpen ? '#F8FBFF' : '#FAFAFA',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}>
              <div style={{ flex: '1', minWidth: '180px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600 }}>{branch.name}</div>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  background: '#F5F5F5',
                  color: STATUS_COLOR[branch.status],
                  fontWeight: 600,
                }}>
                  {STATUS_LABEL[branch.status]}
                </span>
              </div>

              {isMrOpen && (
                <div style={{ flex: '1', minWidth: '200px' }}>
                  {branch.deployStatus === 'deploying' && (
                    <div style={{ fontSize: '0.78rem', color: '#E65100' }}>Деплой...</div>
                  )}
                  {branch.deployStatus === 'active' && (
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#888' }}>Review App:</div>
                      <a href="#" style={{ fontSize: '0.78rem', color: '#1976D2', textDecoration: 'none', fontFamily: 'monospace' }}
                        onClick={e => e.preventDefault()}>
                        {url}
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  onClick={() => openMR(idx)}
                  disabled={isMrOpen || isDone}
                  style={{
                    padding: '0.3rem 0.7rem',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (isMrOpen || isDone) ? 'not-allowed' : 'pointer',
                    background: (isMrOpen || isDone) ? '#E0E0E0' : '#1976D2',
                    color: (isMrOpen || isDone) ? '#9E9E9E' : '#fff',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  Открыть MR
                </button>
                <button
                  onClick={() => closeMR(idx, 'merge')}
                  disabled={!isMrOpen || branch.deployStatus === 'deploying'}
                  style={{
                    padding: '0.3rem 0.7rem',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (!isMrOpen || branch.deployStatus === 'deploying') ? 'not-allowed' : 'pointer',
                    background: (!isMrOpen || branch.deployStatus === 'deploying') ? '#E0E0E0' : '#2E7D32',
                    color: (!isMrOpen || branch.deployStatus === 'deploying') ? '#9E9E9E' : '#fff',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  Merge
                </button>
                <button
                  onClick={() => closeMR(idx, 'close')}
                  disabled={!isMrOpen || branch.deployStatus === 'deploying'}
                  style={{
                    padding: '0.3rem 0.7rem',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (!isMrOpen || branch.deployStatus === 'deploying') ? 'not-allowed' : 'pointer',
                    background: (!isMrOpen || branch.deployStatus === 'deploying') ? '#E0E0E0' : '#757575',
                    color: (!isMrOpen || branch.deployStatus === 'deploying') ? '#9E9E9E' : '#fff',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  Закрыть
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Event log + YAML side by side */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '240px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            CI/CD лог
          </div>
          <div style={{ background: '#1E1E2E', borderRadius: '8px', padding: '0.75rem 1rem', minHeight: '120px' }}>
            {eventLog.map((entry, i) => (
              <div key={i} style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: i === 0 ? '#A6E3A1' : '#6C7086',
                marginBottom: '0.2rem',
              }}>
                {entry}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '2', minWidth: '320px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            GitLab CI — auto_stop_in: {autoStopIn}
          </div>
          <pre style={{
            background: '#1E1E2E', color: '#CDD6F4', padding: '0.75rem 1rem',
            borderRadius: '8px', fontSize: '0.72rem', overflow: 'auto', margin: 0, lineHeight: 1.5,
          }}>
            {buildReviewYaml(autoStopIn)}
          </pre>
        </div>
      </div>
    </div>
  )
}
