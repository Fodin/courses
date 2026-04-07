// ============================================
// Level 6: GitLab Runners — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 6.1: Executor catalog
// ============================================

interface Executor {
  id: string
  name: string
  description: string
  pros: string[]
  cons: string[]
  useCases: string[]
  isolation: 'full' | 'partial' | 'none'
  speed: 'fast' | 'medium' | 'slow'
  complexity: 'low' | 'medium' | 'high'
  needsDocker: boolean
  configExample: string
}

const EXECUTORS: Executor[] = [
  {
    id: 'docker',
    name: 'Docker',
    description: 'Каждый job запускается в свежем Docker-контейнере. Золотой стандарт для большинства проектов.',
    pros: [
      'Полная изоляция — каждый job получает чистую среду',
      'Любой образ: Node, Python, Go, Ruby — всё из Docker Hub',
      'Нет конфликтов между джобами',
      'Воспроизводимые результаты',
    ],
    cons: [
      'Нужен Docker на машине раннера',
      'Медленнее Shell из-за запуска контейнера (~5-10 сек)',
      'Требует места на диске для образов',
    ],
    useCases: [
      'Большинство CI/CD пайплайнов',
      'Проекты на разных языках на одном раннере',
      'Когда важна чистота среды',
      'Команды без специфического железа',
    ],
    isolation: 'full',
    speed: 'medium',
    complexity: 'low',
    needsDocker: true,
    configExample: `[[runners]]
  name = "docker-runner"
  executor = "docker"

  [runners.docker]
    image = "alpine:latest"
    privileged = false
    volumes = ["/cache"]`,
  },
  {
    id: 'shell',
    name: 'Shell',
    description: 'Job выполняется напрямую в оболочке хост-машины. Максимальная скорость, минимальная изоляция.',
    pros: [
      'Самый быстрый старт — нет оверхеда контейнера',
      'Прямой доступ к ресурсам хоста (GPU, USB, сеть)',
      'Работает на любой ОС без Docker',
      'Полезен для специфического железа',
    ],
    cons: [
      'Нет изоляции между джобами',
      'Нужно вручную поддерживать зависимости',
      'Один job может сломать среду для другого',
      'Безопасность: вредоносный job = доступ к хосту',
    ],
    useCases: [
      'Сборка нативных приложений (embedded, IoT)',
      'Работа с GPU (ML-обучение)',
      'Legacy-системы без Docker',
      'Специфическое оборудование',
    ],
    isolation: 'none',
    speed: 'fast',
    complexity: 'low',
    needsDocker: false,
    configExample: `[[runners]]
  name = "shell-runner"
  executor = "shell"
  shell = "bash"`,
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    description: 'Каждый job — отдельный Pod в k8s кластере. Идеально для масштабируемых облачных окружений.',
    pros: [
      'Автомасштабирование из коробки',
      'Точный контроль CPU и Memory (requests/limits)',
      'Полная изоляция через Pod',
      'Интеграция с k8s RBAC и secrets',
    ],
    cons: [
      'Требует настроенный Kubernetes кластер',
      'Самый медленный старт (создание Pod)',
      'Сложнее в отладке',
      'Требует k8s экспертизу в команде',
    ],
    useCases: [
      'Команды с готовым k8s кластером',
      'Высокие нагрузки с автомасштабированием',
      'Облачная инфраструктура (GKE, EKS, AKS)',
      'Строгие требования к ресурсам',
    ],
    isolation: 'full',
    speed: 'slow',
    complexity: 'high',
    needsDocker: false,
    configExample: `[[runners]]
  name = "k8s-runner"
  executor = "kubernetes"

  [runners.kubernetes]
    namespace = "gitlab-runners"
    image = "alpine:latest"
    cpu_request = "100m"
    memory_request = "128Mi"
    cpu_limit = "1"
    memory_limit = "1Gi"`,
  },
  {
    id: 'docker-machine',
    name: 'Docker Machine',
    description: 'Раннер автоматически создаёт VM при нагрузке и удаляет при простое. Autoscaling для облака.',
    pros: [
      'Платишь только за реальное использование',
      'Нет ограничений на параллельные джобы',
      'Каждая VM — чистая среда',
      'Работает с GCP, AWS, Azure',
    ],
    cons: [
      'Холодный старт: создание VM занимает ~30-60 сек',
      'Сложная конфигурация',
      'Устаревает в пользу Kubernetes',
      'Зависит от облачного провайдера',
    ],
    useCases: [
      'Непредсказуемая нагрузка на CI',
      'Экономия на облачных ресурсах',
      'Нет своего k8s кластера',
      'Команды на GCP или AWS',
    ],
    isolation: 'full',
    speed: 'slow',
    complexity: 'high',
    needsDocker: true,
    configExample: `[[runners]]
  name = "autoscale-runner"
  executor = "docker+machine"

  [runners.machine]
    IdleCount = 1
    IdleTime = 1800
    MachineDriver = "google"
    MachineName = "runner-%s"
    MachineOptions = [
      "google-project=my-project",
      "google-zone=us-central1-a",
    ]`,
  },
]

const ISOLATION_LABELS: Record<string, string> = {
  full: 'Полная',
  partial: 'Частичная',
  none: 'Нет',
}

const SPEED_LABELS: Record<string, string> = {
  fast: 'Быстрый',
  medium: 'Средний',
  slow: 'Медленный',
}

const COMPLEXITY_LABELS: Record<string, string> = {
  low: 'Низкая',
  medium: 'Средняя',
  high: 'Высокая',
}

const ISOLATION_COLORS: Record<string, string> = {
  full: '#2E7D32',
  partial: '#E65100',
  none: '#C62828',
}

const SPEED_COLORS: Record<string, string> = {
  fast: '#1565C0',
  medium: '#6A1B9A',
  slow: '#BF360C',
}

const COMPLEXITY_COLORS: Record<string, string> = {
  low: '#2E7D32',
  medium: '#E65100',
  high: '#C62828',
}

export function Task6_1_Solution() {
  const [filter, setFilter] = useState<'all' | 'full' | 'partial' | 'none'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expandedUseCases, setExpandedUseCases] = useState<Set<string>>(new Set())

  const filtered = filter === 'all' ? EXECUTORS : EXECUTORS.filter(e => e.isolation === filter)
  const selected = EXECUTORS.find(e => e.id === selectedId)

  const toggleUseCases = (id: string) => {
    setExpandedUseCases(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const badge = (label: string, color: string) => (
    <span style={{
      background: color + '22',
      color,
      border: `1px solid ${color}44`,
      borderRadius: 4,
      padding: '2px 8px',
      fontSize: 12,
      fontWeight: 600,
    }}>
      {label}
    </span>
  )

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: 900 }}>
      <h2 style={{ marginBottom: 4 }}>Каталог GitLab Runner Executors</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Выбери executor, чтобы увидеть пример config.toml
      </p>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['all', 'full', 'partial', 'none'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: 6,
              border: '1px solid #ddd',
              cursor: 'pointer',
              background: filter === f ? '#1565C0' : '#fff',
              color: filter === f ? '#fff' : '#333',
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f === 'all' ? 'Все' : `Изоляция: ${ISOLATION_LABELS[f]}`}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        {filtered.map(executor => {
          const isSelected = selectedId === executor.id
          const isExpanded = expandedUseCases.has(executor.id)
          return (
            <div
              key={executor.id}
              onClick={() => setSelectedId(isSelected ? null : executor.id)}
              style={{
                border: `2px solid ${isSelected ? '#1565C0' : '#e0e0e0'}`,
                borderRadius: 10,
                padding: 20,
                cursor: 'pointer',
                background: isSelected ? '#E3F2FD' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>{executor.name} Executor</h3>
              </div>
              <p style={{ color: '#555', fontSize: 14, marginBottom: 12 }}>{executor.description}</p>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {badge(`Изоляция: ${ISOLATION_LABELS[executor.isolation]}`, ISOLATION_COLORS[executor.isolation])}
                {badge(`Скорость: ${SPEED_LABELS[executor.speed]}`, SPEED_COLORS[executor.speed])}
                {badge(`Настройка: ${COMPLEXITY_LABELS[executor.complexity]}`, COMPLEXITY_COLORS[executor.complexity])}
                {badge(executor.needsDocker ? 'Нужен Docker' : 'Без Docker', executor.needsDocker ? '#37474F' : '#1B5E20')}
              </div>

              <div style={{ marginBottom: 8 }}>
                {executor.pros.map(p => (
                  <div key={p} style={{ fontSize: 13, color: '#2E7D32', marginBottom: 2 }}>✅ {p}</div>
                ))}
              </div>
              <div style={{ marginBottom: 12 }}>
                {executor.cons.map(c => (
                  <div key={c} style={{ fontSize: 13, color: '#C62828', marginBottom: 2 }}>❌ {c}</div>
                ))}
              </div>

              <button
                onClick={e => { e.stopPropagation(); toggleUseCases(executor.id) }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1565C0',
                  cursor: 'pointer',
                  fontSize: 13,
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                {isExpanded ? 'Скрыть use cases ▲' : 'Показать use cases ▼'}
              </button>

              {isExpanded && (
                <div style={{ marginTop: 8, background: '#F5F5F5', borderRadius: 6, padding: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#555' }}>
                    Когда использовать:
                  </div>
                  {executor.useCases.map(uc => (
                    <div key={uc} style={{ fontSize: 13, color: '#333', marginBottom: 2 }}>• {uc}</div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Config example */}
      {selected && (
        <div style={{ marginBottom: 32, background: '#1e1e1e', borderRadius: 10, padding: 20 }}>
          <div style={{ color: '#9E9E9E', fontSize: 13, marginBottom: 8 }}>
            config.toml для {selected.name} executor:
          </div>
          <pre style={{
            color: '#d4d4d4',
            fontFamily: "'Courier New', monospace",
            fontSize: 13,
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}>
            {selected.configExample}
          </pre>
        </div>
      )}

      {/* Comparison table */}
      <h3 style={{ marginBottom: 12 }}>Сравнительная таблица</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F5F5F5' }}>
            {['Executor', 'Изоляция', 'Скорость', 'Сложность', 'Нужен Docker'].map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #e0e0e0' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EXECUTORS.map((e, i) => (
            <tr key={e.id} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
              <td style={{ padding: '10px 12px', border: '1px solid #e0e0e0', fontWeight: 600 }}>{e.name}</td>
              <td style={{ padding: '10px 12px', border: '1px solid #e0e0e0', color: ISOLATION_COLORS[e.isolation] }}>
                {ISOLATION_LABELS[e.isolation]}
              </td>
              <td style={{ padding: '10px 12px', border: '1px solid #e0e0e0', color: SPEED_COLORS[e.speed] }}>
                {SPEED_LABELS[e.speed]}
              </td>
              <td style={{ padding: '10px 12px', border: '1px solid #e0e0e0', color: COMPLEXITY_COLORS[e.complexity] }}>
                {COMPLEXITY_LABELS[e.complexity]}
              </td>
              <td style={{ padding: '10px 12px', border: '1px solid #e0e0e0' }}>
                {e.needsDocker ? '✅ Да' : '❌ Нет'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================
// Task 6.2: Job routing simulator
// ============================================

interface Runner {
  id: string
  name: string
  tags: string[]
  runUntagged: boolean
  status: 'online' | 'offline'
}

interface CiJob {
  id: string
  name: string
  tags: string[]
  assignedRunnerId: string | null
  status: 'pending' | 'running' | 'matched' | 'no-runner'
  missingTags?: string[]
}

const INITIAL_RUNNERS: Runner[] = [
  { id: 'r1', name: 'docker-runner', tags: ['docker', 'linux'], runUntagged: false, status: 'online' },
  { id: 'r2', name: 'shell-runner', tags: ['shell', 'windows', 'legacy'], runUntagged: false, status: 'online' },
  { id: 'r3', name: 'prod-runner', tags: ['production', 'docker'], runUntagged: false, status: 'online' },
]

const INITIAL_JOBS: CiJob[] = [
  { id: 'j1', name: 'build', tags: [], assignedRunnerId: null, status: 'pending' },
  { id: 'j2', name: 'test', tags: ['docker'], assignedRunnerId: null, status: 'pending' },
  { id: 'j3', name: 'deploy-staging', tags: ['docker', 'linux'], assignedRunnerId: null, status: 'pending' },
  { id: 'j4', name: 'deploy-prod', tags: ['production', 'docker'], assignedRunnerId: null, status: 'pending' },
]

const TAG_COLORS = [
  '#1565C0', '#2E7D32', '#6A1B9A', '#E65100', '#BF360C',
  '#37474F', '#00695C', '#4527A0', '#AD1457', '#558B2F',
]

function getTagColor(tag: string): string {
  let hash = 0
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}

function matchRunner(job: CiJob, runner: Runner): { matched: boolean; missingTags: string[] } {
  if (runner.status === 'offline') return { matched: false, missingTags: [] }
  if (job.tags.length === 0) {
    return { matched: runner.runUntagged, missingTags: [] }
  }
  const missing = job.tags.filter(t => !runner.tags.includes(t))
  return { matched: missing.length === 0, missingTags: missing }
}

export function Task6_2_Solution() {
  const [runners, setRunners] = useState<Runner[]>(INITIAL_RUNNERS)
  const [jobs, setJobs] = useState<CiJob[]>(INITIAL_JOBS.map(j => ({ ...j })))
  const [routed, setRouted] = useState(false)
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({})

  const runRouting = () => {
    const updated = jobs.map(job => {
      for (const runner of runners) {
        const { matched, missingTags } = matchRunner(job, runner)
        if (matched) {
          return { ...job, assignedRunnerId: runner.id, status: 'matched' as const, missingTags: [] }
        }
        // collect missing tags from last runner for reporting
        void missingTags
      }
      // No runner matched — collect all missing tags across all runners
      const allMissing = job.tags.filter(t => !runners.some(r => r.tags.includes(t)))
      return {
        ...job,
        assignedRunnerId: null,
        status: 'no-runner' as const,
        missingTags: allMissing.length > 0 ? allMissing : job.tags.length === 0 ? ['(нет раннера с run_untagged=true)'] : job.tags,
      }
    })
    setJobs(updated)
    setRouted(true)
  }

  const reset = () => {
    setJobs(INITIAL_JOBS.map(j => ({ ...j })))
    setRouted(false)
  }

  const addTag = (runnerId: string) => {
    const tag = (newTagInputs[runnerId] || '').trim().toLowerCase()
    if (!tag) return
    setRunners(prev => prev.map(r => r.id === runnerId && !r.tags.includes(tag)
      ? { ...r, tags: [...r.tags, tag] }
      : r
    ))
    setNewTagInputs(prev => ({ ...prev, [runnerId]: '' }))
    if (routed) {
      setRouted(false)
      setJobs(INITIAL_JOBS.map(j => ({ ...j })))
    }
  }

  const toggleUntagged = (runnerId: string) => {
    setRunners(prev => prev.map(r => r.id === runnerId ? { ...r, runUntagged: !r.runUntagged } : r))
    if (routed) {
      setRouted(false)
      setJobs(INITIAL_JOBS.map(j => ({ ...j })))
    }
  }

  const tagBadge = (tag: string) => {
    const color = getTagColor(tag)
    return (
      <span key={tag} style={{
        background: color + '20',
        color,
        border: `1px solid ${color}40`,
        borderRadius: 4,
        padding: '2px 8px',
        fontSize: 12,
        fontWeight: 600,
        marginRight: 4,
        marginBottom: 4,
        display: 'inline-block',
      }}>
        {tag}
      </span>
    )
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: 900 }}>
      <h2 style={{ marginBottom: 4 }}>Симулятор маршрутизации джобов</h2>
      <p style={{ color: '#666', marginBottom: 20 }}>
        Раннер берёт джоб если имеет ВСЕ его теги. Добавь теги к раннерам и запусти маршрутизацию.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button
          onClick={runRouting}
          style={{
            padding: '10px 24px',
            background: '#2E7D32',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Запустить маршрутизацию
        </button>
        <button
          onClick={reset}
          style={{
            padding: '10px 24px',
            background: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Сбросить
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Runners */}
        <div>
          <h3 style={{ marginBottom: 12, color: '#1565C0' }}>Раннеры</h3>
          {runners.map(runner => (
            <div key={runner.id} style={{
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              background: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{runner.name}</strong>
                <span style={{
                  fontSize: 12,
                  color: runner.status === 'online' ? '#2E7D32' : '#999',
                  fontWeight: 600,
                }}>
                  {runner.status === 'online' ? '● online' : '● offline'}
                </span>
              </div>

              <div style={{ marginBottom: 8 }}>
                {runner.tags.map(tagBadge)}
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type='checkbox'
                    checked={runner.runUntagged}
                    onChange={() => toggleUntagged(runner.id)}
                  />
                  Принимать джобы без тегов
                </label>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  value={newTagInputs[runner.id] || ''}
                  onChange={e => setNewTagInputs(prev => ({ ...prev, [runner.id]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addTag(runner.id)}
                  placeholder='Добавить тег...'
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    fontSize: 13,
                  }}
                />
                <button
                  onClick={() => addTag(runner.id)}
                  style={{
                    padding: '4px 12px',
                    background: '#1565C0',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Jobs */}
        <div>
          <h3 style={{ marginBottom: 12, color: '#6A1B9A' }}>Джобы</h3>
          {jobs.map(job => {
            const assignedRunner = runners.find(r => r.id === job.assignedRunnerId)
            const statusColor = job.status === 'matched' ? '#2E7D32'
              : job.status === 'no-runner' ? '#C62828'
              : '#999'

            return (
              <div key={job.id} style={{
                border: `2px solid ${job.status === 'matched' ? '#A5D6A7' : job.status === 'no-runner' ? '#FFCDD2' : '#e0e0e0'}`,
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                background: job.status === 'matched' ? '#F1F8E9' : job.status === 'no-runner' ? '#FFEBEE' : '#fff',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong>{job.name}</strong>
                  {routed && (
                    <span style={{ fontSize: 12, color: statusColor, fontWeight: 600 }}>
                      {job.status === 'matched' ? '✅ назначен' : '❌ нет раннера'}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: 8 }}>
                  {job.tags.length > 0 ? job.tags.map(tagBadge) : (
                    <span style={{ fontSize: 12, color: '#999', fontStyle: 'italic' }}>без тегов</span>
                  )}
                </div>

                {routed && job.status === 'matched' && assignedRunner && (
                  <div style={{ fontSize: 13, color: '#2E7D32' }}>
                    Выполняет: <strong>{assignedRunner.name}</strong>
                  </div>
                )}

                {routed && job.status === 'no-runner' && (
                  <div style={{ fontSize: 13, color: '#C62828' }}>
                    {job.tags.length === 0
                      ? 'Нет раннера с run_untagged = true'
                      : <>Отсутствующие теги: {job.missingTags?.map(t => tagBadge(t))}</>
                    }
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Rule reminder */}
      <div style={{
        background: '#FFF8E1',
        border: '1px solid #FFD54F',
        borderRadius: 8,
        padding: 16,
        marginTop: 8,
        fontSize: 14,
      }}>
        <strong>Правило маршрутизации:</strong> раннер берёт джоб если имеет ВСЕ теги джоба.
        Дополнительные теги у раннера не мешают. Джоб без тегов — только раннеры с run_untagged = true.
      </div>
    </div>
  )
}

// ============================================
// Task 6.3: Runner registration wizard
// ============================================

type WizardStep = 'url' | 'token' | 'executor' | 'tags' | 'settings' | 'result'
type ExecutorType = 'docker' | 'shell' | 'kubernetes'

interface WizardData {
  url: string
  token: string
  executor: ExecutorType | ''
  tags: string[]
  runUntagged: boolean
  dockerImage: string
  dockerPrivileged: boolean
  k8sNamespace: string
  k8sImage: string
}

const STEP_ORDER: WizardStep[] = ['url', 'token', 'executor', 'tags', 'settings', 'result']

const STEP_LABELS: Record<WizardStep, string> = {
  url: 'GitLab URL',
  token: 'Токен',
  executor: 'Executor',
  tags: 'Теги',
  settings: 'Настройки',
  result: 'Готово',
}

const TAG_SUGGESTIONS = ['docker', 'linux', 'shell', 'windows', 'production', 'staging', 'arm64', 'gpu']

function generateCommand(data: WizardData): string {
  const tags = data.tags.join(',')
  return `sudo gitlab-runner register \\
  --non-interactive \\
  --url "${data.url}" \\
  --registration-token "${data.token}" \\
  --executor "${data.executor}" \\
  --description "my-${data.executor}-runner" \\${tags ? `\n  --tag-list "${tags}" \\` : ''}
  --run-untagged="${data.runUntagged}"${
  data.executor === 'docker' ? ` \\\n  --docker-image "${data.dockerImage || 'alpine:latest'}"` : ''
}`
}

function generateConfig(data: WizardData): string {
  const base = `concurrent = 4
check_interval = 3

[[runners]]
  name = "my-${data.executor}-runner"
  url = "${data.url}"
  token = "RUNNER_TOKEN_AFTER_REGISTRATION"
  executor = "${data.executor}"
  tags = [${data.tags.map(t => `"${t}"`).join(', ')}]
  run_untagged = ${data.runUntagged}`

  if (data.executor === 'docker') {
    return base + `

  [runners.docker]
    image = "${data.dockerImage || 'alpine:latest'}"
    privileged = ${data.dockerPrivileged}
    volumes = ["/cache"]`
  }

  if (data.executor === 'kubernetes') {
    return base + `

  [runners.kubernetes]
    namespace = "${data.k8sNamespace || 'gitlab-runners'}"
    image = "${data.k8sImage || 'alpine:latest'}"
    cpu_request = "100m"
    memory_request = "128Mi"
    cpu_limit = "1"
    memory_limit = "1Gi"`
  }

  return base
}

export function Task6_3_Solution() {
  const [step, setStep] = useState<WizardStep>('url')
  const [data, setData] = useState<WizardData>({
    url: 'https://gitlab.com',
    token: '',
    executor: '',
    tags: [],
    runUntagged: false,
    dockerImage: 'alpine:latest',
    dockerPrivileged: false,
    k8sNamespace: 'gitlab-runners',
    k8sImage: 'alpine:latest',
  })
  const [tagInput, setTagInput] = useState('')
  const [copied, setCopied] = useState<'cmd' | 'cfg' | null>(null)

  const stepIndex = STEP_ORDER.indexOf(step)

  const isStepValid = (): boolean => {
    if (step === 'url') return data.url.startsWith('https://')
    if (step === 'token') return data.token.length >= 20 || data.token.startsWith('glrt-')
    if (step === 'executor') return data.executor !== ''
    if (step === 'tags') return true
    if (step === 'settings') {
      if (data.executor === 'docker') return data.dockerImage.length > 0
      return true
    }
    return true
  }

  const next = () => {
    const nextIndex = stepIndex + 1
    if (nextIndex < STEP_ORDER.length) setStep(STEP_ORDER[nextIndex])
  }

  const prev = () => {
    const prevIndex = stepIndex - 1
    if (prevIndex >= 0) setStep(STEP_ORDER[prevIndex])
  }

  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase()
    if (t && !data.tags.includes(t)) {
      setData(prev => ({ ...prev, tags: [...prev.tags, t] }))
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const simulateCopy = (which: 'cmd' | 'cfg') => {
    setCopied(which)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: 700 }}>
      <h2 style={{ marginBottom: 4 }}>Wizard регистрации GitLab Runner</h2>
      <p style={{ color: '#666', marginBottom: 20 }}>
        Настрой self-hosted раннер пошагово и получи готовую команду регистрации
      </p>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
        {STEP_ORDER.map((s, i) => {
          const isCurrent = s === step
          const isDone = i < stepIndex
          return (
            <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isDone ? '#2E7D32' : isCurrent ? '#1565C0' : '#e0e0e0',
                color: isDone || isCurrent ? '#fff' : '#999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 4,
              }}>
                {isDone ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 11, color: isCurrent ? '#1565C0' : '#999', textAlign: 'center' }}>
                {STEP_LABELS[s]}
              </div>
              {i < STEP_ORDER.length - 1 && (
                <div style={{
                  position: 'absolute',
                  // connector lines drawn via margin trick below
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div style={{
        border: '1px solid #e0e0e0',
        borderRadius: 12,
        padding: 28,
        background: '#fff',
        minHeight: 260,
        marginBottom: 20,
      }}>

        {step === 'url' && (
          <div>
            <h3 style={{ marginBottom: 4 }}>Шаг 1: GitLab Instance URL</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
              Укажи адрес GitLab (облачный или self-hosted). Должен начинаться с https://.
            </p>
            <input
              value={data.url}
              onChange={e => setData(prev => ({ ...prev, url: e.target.value }))}
              placeholder='https://gitlab.com'
              style={{
                width: '100%',
                padding: '10px 14px',
                border: `2px solid ${data.url.startsWith('https://') ? '#A5D6A7' : '#FFCDD2'}`,
                borderRadius: 8,
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
            {!data.url.startsWith('https://') && data.url.length > 0 && (
              <div style={{ color: '#C62828', fontSize: 13, marginTop: 6 }}>
                URL должен начинаться с https://
              </div>
            )}
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              {['https://gitlab.com', 'https://gitlab.mycompany.com'].map(u => (
                <button key={u} onClick={() => setData(prev => ({ ...prev, url: u }))} style={{
                  padding: '4px 12px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  background: data.url === u ? '#E3F2FD' : '#fff',
                  cursor: 'pointer',
                  fontSize: 13,
                }}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'token' && (
          <div>
            <h3 style={{ marginBottom: 4 }}>Шаг 2: Registration Token</h3>
            <div style={{
              background: '#FFF8E1',
              border: '1px solid #FFD54F',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              fontSize: 13,
            }}>
              Где найти токен: Settings {'>'} CI/CD {'>'} Runners {'>'} Registration token
            </div>
            <input
              type='password'
              value={data.token}
              onChange={e => setData(prev => ({ ...prev, token: e.target.value }))}
              placeholder='glrt-xxxxxxxxxxxxxxxxxxxx'
              style={{
                width: '100%',
                padding: '10px 14px',
                border: `2px solid ${isStepValid() ? '#A5D6A7' : '#e0e0e0'}`,
                borderRadius: 8,
                fontSize: 15,
                boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
              Токен начинается с glrt- или длиной более 20 символов
            </div>
          </div>
        )}

        {step === 'executor' && (
          <div>
            <h3 style={{ marginBottom: 4 }}>Шаг 3: Выбор Executor</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
              Executor определяет, как раннер будет запускать джобы.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([
                { id: 'docker', label: 'Docker', desc: 'Каждый job в отдельном контейнере. Рекомендуется для большинства случаев.' },
                { id: 'shell', label: 'Shell', desc: 'Выполнение напрямую на хост-машине. Максимальная скорость, нет изоляции.' },
                { id: 'kubernetes', label: 'Kubernetes', desc: 'Каждый job — Pod в k8s кластере. Для облачных сред с автомасштабированием.' },
              ] as { id: ExecutorType; label: string; desc: string }[]).map(ex => (
                <div
                  key={ex.id}
                  onClick={() => setData(prev => ({ ...prev, executor: ex.id }))}
                  style={{
                    border: `2px solid ${data.executor === ex.id ? '#1565C0' : '#e0e0e0'}`,
                    borderRadius: 8,
                    padding: 16,
                    cursor: 'pointer',
                    background: data.executor === ex.id ? '#E3F2FD' : '#fff',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{ex.label}</div>
                  <div style={{ fontSize: 13, color: '#555' }}>{ex.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'tags' && (
          <div>
            <h3 style={{ marginBottom: 4 }}>Шаг 4: Теги раннера</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
              Теги используются для маршрутизации джобов. Раннер возьмёт job только если имеет все его теги.
            </p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag(tagInput)}
                placeholder='Введи тег и нажми Enter'
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              />
              <button onClick={() => addTag(tagInput)} style={{
                padding: '8px 16px',
                background: '#1565C0',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}>
                Добавить
              </button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>Быстрый выбор:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {TAG_SUGGESTIONS.map(t => (
                  <button key={t} onClick={() => addTag(t)} style={{
                    padding: '3px 10px',
                    border: `1px solid ${data.tags.includes(t) ? '#1565C0' : '#ddd'}`,
                    background: data.tags.includes(t) ? '#E3F2FD' : '#fff',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 13,
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {data.tags.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>Выбранные теги:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {data.tags.map(t => (
                    <span key={t} style={{
                      background: '#E3F2FD',
                      color: '#1565C0',
                      border: '1px solid #90CAF9',
                      borderRadius: 4,
                      padding: '3px 10px',
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      {t}
                      <button onClick={() => removeTag(t)} style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#1565C0',
                        padding: 0,
                        fontSize: 14,
                        lineHeight: 1,
                      }}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <input
                type='checkbox'
                checked={data.runUntagged}
                onChange={e => setData(prev => ({ ...prev, runUntagged: e.target.checked }))}
              />
              Принимать джобы без тегов (run_untagged = true)
            </label>
          </div>
        )}

        {step === 'settings' && (
          <div>
            <h3 style={{ marginBottom: 4 }}>
              Шаг 5: Настройки {data.executor === 'docker' ? 'Docker' : data.executor === 'kubernetes' ? 'Kubernetes' : 'Shell'} executor
            </h3>

            {data.executor === 'docker' && (
              <div>
                <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
                  Настрой параметры Docker executor.
                </p>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
                    Default Docker image
                  </label>
                  <input
                    value={data.dockerImage}
                    onChange={e => setData(prev => ({ ...prev, dockerImage: e.target.value }))}
                    placeholder='alpine:latest'
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
                  />
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    Образ по умолчанию, если job не указал image:
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input
                    type='checkbox'
                    checked={data.dockerPrivileged}
                    onChange={e => setData(prev => ({ ...prev, dockerPrivileged: e.target.checked }))}
                    style={{ marginTop: 2 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>privileged = true</div>
                    <div style={{ color: '#C62828', fontSize: 13 }}>
                      Нужно только для Docker-in-Docker (dind). Даёт полный доступ к хосту — используй с осторожностью!
                    </div>
                  </div>
                </label>
              </div>
            )}

            {data.executor === 'kubernetes' && (
              <div>
                <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
                  Настрой параметры Kubernetes executor.
                </p>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
                    Kubernetes Namespace
                  </label>
                  <input
                    value={data.k8sNamespace}
                    onChange={e => setData(prev => ({ ...prev, k8sNamespace: e.target.value }))}
                    placeholder='gitlab-runners'
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
                    Default image
                  </label>
                  <input
                    value={data.k8sImage}
                    onChange={e => setData(prev => ({ ...prev, k8sImage: e.target.value }))}
                    placeholder='alpine:latest'
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            )}

            {data.executor === 'shell' && (
              <div style={{ background: '#F1F8E9', border: '1px solid #C5E1A5', borderRadius: 8, padding: 16, fontSize: 14 }}>
                Shell executor не требует дополнительных настроек.
                Убедись, что на хост-машине установлены все необходимые зависимости (Node, Python, Git и т.д.).
              </div>
            )}
          </div>
        )}

        {step === 'result' && (
          <div>
            <h3 style={{ marginBottom: 4, color: '#2E7D32' }}>Раннер настроен!</h3>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
              Выполни эту команду на машине, где установлен gitlab-runner.
            </p>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Команда регистрации:</div>
                <button onClick={() => simulateCopy('cmd')} style={{
                  padding: '4px 12px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  background: copied === 'cmd' ? '#E8F5E9' : '#fff',
                  color: copied === 'cmd' ? '#2E7D32' : '#333',
                }}>
                  {copied === 'cmd' ? 'Скопировано!' : 'Скопировать'}
                </button>
              </div>
              <pre style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                borderRadius: 8,
                padding: 16,
                fontSize: 13,
                fontFamily: "'Courier New', monospace",
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}>
                {generateCommand(data)}
              </pre>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>config.toml (после регистрации):</div>
                <button onClick={() => simulateCopy('cfg')} style={{
                  padding: '4px 12px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  background: copied === 'cfg' ? '#E8F5E9' : '#fff',
                  color: copied === 'cfg' ? '#2E7D32' : '#333',
                }}>
                  {copied === 'cfg' ? 'Скопировано!' : 'Скопировать'}
                </button>
              </div>
              <pre style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                borderRadius: 8,
                padding: 16,
                fontSize: 13,
                fontFamily: "'Courier New', monospace",
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}>
                {generateConfig(data)}
              </pre>
            </div>

            <button
              onClick={() => { setStep('url'); setData(prev => ({ ...prev, token: '', executor: '', tags: [] })) }}
              style={{
                marginTop: 16,
                padding: '8px 20px',
                border: '1px solid #ddd',
                borderRadius: 8,
                cursor: 'pointer',
                background: '#fff',
              }}
            >
              Начать заново
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      {step !== 'result' && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={prev}
            disabled={stepIndex === 0}
            style={{
              padding: '10px 24px',
              border: '1px solid #ddd',
              borderRadius: 8,
              cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
              background: '#fff',
              color: stepIndex === 0 ? '#ccc' : '#333',
            }}
          >
            Назад
          </button>
          <div style={{ fontSize: 13, color: '#999', display: 'flex', alignItems: 'center' }}>
            Шаг {stepIndex + 1} из {STEP_ORDER.length}
          </div>
          <button
            onClick={next}
            disabled={!isStepValid()}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: 8,
              cursor: isStepValid() ? 'pointer' : 'not-allowed',
              background: isStepValid() ? '#1565C0' : '#e0e0e0',
              color: isStepValid() ? '#fff' : '#999',
              fontWeight: 600,
            }}
          >
            Далее
          </button>
        </div>
      )}
    </div>
  )
}
