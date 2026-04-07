// ============================================
// Level 5: Cache and Artifacts — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 5.1: Artifacts — pipeline data flow
// ============================================

const ARTIFACT_PATHS = [
  { id: 'dist', label: 'dist/', desc: 'Собранный фронтенд' },
  { id: 'reports', label: 'reports/', desc: 'Отчёты о тестах' },
  { id: 'public', label: 'public/', desc: 'Статические файлы' },
  { id: 'coverage', label: 'coverage/', desc: 'Покрытие кода' },
]

const EXPIRE_OPTIONS = ['1 hour', '1 day', '1 week', 'never']

const WHEN_OPTIONS = [
  { value: 'on_success', label: 'on_success', desc: 'Только при успехе (default)' },
  { value: 'on_failure', label: 'on_failure', desc: 'Только при ошибке — для логов' },
  { value: 'always', label: 'always', desc: 'Всегда — для отчётов и coverage' },
]

const JOBS = [
  { name: 'build', label: 'Build', color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9', icon: '🔨' },
  { name: 'test', label: 'Test', color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7', icon: '🧪' },
  { name: 'deploy', label: 'Deploy', color: '#E65100', bg: '#FFF3E0', border: '#FFCC80', icon: '🚀' },
]

function buildArtifactsYaml(paths: string[], expireIn: string, when: string): string {
  const pathLines = paths.length > 0
    ? paths.map(p => `      - ${p}`).join('\n')
    : '      - dist/'
  return `build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
${pathLines}
    expire_in: ${expireIn}
    when: ${when}`
}

export function Task5_1_Solution() {
  const [selectedPaths, setSelectedPaths] = useState<string[]>(['dist/'])
  const [expireIn, setExpireIn] = useState('1 week')
  const [when, setWhen] = useState('on_success')

  const togglePath = (label: string) => {
    setSelectedPaths(prev =>
      prev.includes(label) ? prev.filter(p => p !== label) : [...prev, label]
    )
  }

  const currentWhen = WHEN_OPTIONS.find(w => w.value === when)!
  const isFailure = when === 'on_failure'

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Artifacts: передача данных между джобами</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Настрой артефакты и посмотри, как данные передаются по пайплайну
      </p>

      {/* Pipeline visualization */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}>
        {JOBS.map((job, i) => (
          <div key={job.name} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              border: `2px solid ${isFailure && job.name === 'build' ? '#D32F2F' : job.border}`,
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              background: isFailure && job.name === 'build' ? '#FFEBEE' : job.bg,
              minWidth: '110px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{job.icon}</div>
              <div style={{ fontWeight: 700, color: job.color, fontSize: '0.9rem' }}>{job.label}</div>
              {job.name === 'build' && (
                <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.25rem' }}>
                  создаёт артефакты
                </div>
              )}
              {(job.name === 'test' || job.name === 'deploy') && (
                <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.25rem' }}>
                  получает артефакты
                </div>
              )}
            </div>
            {i < JOBS.length - 1 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '0 4px',
              }}>
                <div style={{
                  fontSize: '0.65rem',
                  color: '#1565C0',
                  fontFamily: 'monospace',
                  background: '#E3F2FD',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  marginBottom: '2px',
                  whiteSpace: 'nowrap',
                }}>
                  {selectedPaths.length > 0 ? selectedPaths[0] : 'dist/'}
                  {selectedPaths.length > 1 ? ` +${selectedPaths.length - 1}` : ''}
                </div>
                <div style={{ fontSize: '1.2rem', color: '#1565C0' }}>→</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isFailure && (
        <div style={{
          background: '#FFF3E0',
          border: '1px solid #FFB74D',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.875rem',
        }}>
          ⚠️ При <code>when: on_failure</code> артефакты сохраняются только если build упал. Полезно для логов ошибок.
        </div>
      )}

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Settings panel */}
        <div style={{ flex: '1 1 280px' }}>
          {/* Paths */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              artifacts:paths
            </div>
            {ARTIFACT_PATHS.map(path => (
              <label key={path.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.4rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}>
                <input
                  type='checkbox'
                  checked={selectedPaths.includes(path.label)}
                  onChange={() => togglePath(path.label)}
                />
                <code style={{ background: '#f5f5f5', padding: '1px 5px', borderRadius: '3px' }}>
                  {path.label}
                </code>
                <span style={{ color: '#888' }}>{path.desc}</span>
              </label>
            ))}
          </div>

          {/* expire_in */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              artifacts:expire_in
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {EXPIRE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => setExpireIn(opt)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '6px',
                    border: expireIn === opt ? '2px solid #1565C0' : '1px solid #ccc',
                    background: expireIn === opt ? '#E3F2FD' : '#fff',
                    color: expireIn === opt ? '#1565C0' : '#333',
                    fontWeight: expireIn === opt ? 700 : 400,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* when */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              artifacts:when
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {WHEN_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setWhen(opt.value)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    border: when === opt.value ? '2px solid #1565C0' : '1px solid #ccc',
                    background: when === opt.value ? '#E3F2FD' : '#fff',
                    color: when === opt.value ? '#1565C0' : '#333',
                    fontWeight: when === opt.value ? 700 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                  }}
                >
                  <code>{opt.label}</code>
                  <span style={{ color: '#888', marginLeft: '0.5rem', fontWeight: 400 }}>
                    — {opt.desc}
                  </span>
                </button>
              ))}
            </div>
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.8rem',
              color: '#555',
              background: '#f9f9f9',
              borderRadius: '6px',
              padding: '0.5rem',
            }}>
              {currentWhen.desc}
            </div>
          </div>
        </div>

        {/* YAML output */}
        <div style={{ flex: '1 1 280px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Результирующий YAML
          </div>
          <pre style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            overflow: 'auto',
            margin: 0,
          }}>
            {buildArtifactsYaml(selectedPaths, expireIn, when)}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 5.2: Cache — build speed simulation
// ============================================

type StepStatus = 'pending' | 'running' | 'done'

interface PipelineStep {
  name: string
  withoutCacheMs: number
  withCacheMs: number
}

const PIPELINE_STEPS: PipelineStep[] = [
  { name: 'Checkout кода', withoutCacheMs: 500, withCacheMs: 500 },
  { name: 'Установка зависимостей', withoutCacheMs: 3000, withCacheMs: 400 },
  { name: 'Компиляция', withoutCacheMs: 1500, withCacheMs: 1500 },
  { name: 'Запуск тестов', withoutCacheMs: 2000, withCacheMs: 2000 },
]

const CACHE_KEY_STRATEGIES = [
  { value: 'static', label: 'Статический', yaml: "key: 'my-project-deps'" },
  { value: 'branch', label: 'По ветке', yaml: "key: '$CI_COMMIT_REF_SLUG'" },
  { value: 'files', label: 'По lock-файлу', yaml: 'key:\n    files:\n      - package-lock.json' },
]

const CACHE_PATHS_OPTIONS = [
  { id: 'node_modules', label: 'node_modules/' },
  { id: 'npm', label: '.npm/' },
  { id: 'cache', label: '.cache/' },
]

function buildCacheYaml(strategy: string, paths: string[]): string {
  const strategyObj = CACHE_KEY_STRATEGIES.find(s => s.value === strategy)!
  const pathLines = paths.length > 0
    ? paths.map(p => `      - ${p}`).join('\n')
    : '      - node_modules/'
  return `build:
  stage: build
  cache:
    ${strategyObj.yaml}
    paths:
${pathLines}
    policy: pull-push
  script:
    - npm ci
    - npm run build`
}

function StatusDot({ status }: { status: StepStatus }) {
  const colors: Record<StepStatus, string> = {
    pending: '#bdbdbd',
    running: '#FFA726',
    done: '#4CAF50',
  }
  return (
    <div style={{
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: colors[status],
      flexShrink: 0,
      transition: 'background 0.3s',
    }} />
  )
}

export function Task5_2_Solution() {
  const [withoutCacheStatuses, setWithoutCacheStatuses] = useState<StepStatus[]>(
    PIPELINE_STEPS.map(() => 'pending')
  )
  const [withCacheStatuses, setWithCacheStatuses] = useState<StepStatus[]>(
    PIPELINE_STEPS.map(() => 'pending')
  )
  const [withoutCacheTime, setWithoutCacheTime] = useState<number | null>(null)
  const [withCacheTime, setWithCacheTime] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const [cacheStrategy, setCacheStrategy] = useState('files')
  const [cachePaths, setCachePaths] = useState<string[]>(['node_modules/'])

  const togglePath = (label: string) => {
    setCachePaths(prev =>
      prev.includes(label) ? prev.filter(p => p !== label) : [...prev, label]
    )
  }

  const runSimulation = async () => {
    if (running) return
    setRunning(true)
    setWithoutCacheStatuses(PIPELINE_STEPS.map(() => 'pending'))
    setWithCacheStatuses(PIPELINE_STEPS.map(() => 'pending'))
    setWithoutCacheTime(null)
    setWithCacheTime(null)

    // Run both pipelines concurrently
    const runPipeline = async (
      durations: number[],
      setStatuses: React.Dispatch<React.SetStateAction<StepStatus[]>>,
      setTime: (t: number) => void
    ) => {
      let total = 0
      for (let i = 0; i < durations.length; i++) {
        setStatuses(prev => prev.map((s, idx) => idx === i ? 'running' : s))
        await new Promise(r => setTimeout(r, durations[i]))
        setStatuses(prev => prev.map((s, idx) => idx === i ? 'done' : s))
        total += durations[i]
      }
      setTime(total)
    }

    await Promise.all([
      runPipeline(
        PIPELINE_STEPS.map(s => s.withoutCacheMs),
        setWithoutCacheStatuses,
        setWithoutCacheTime
      ),
      runPipeline(
        PIPELINE_STEPS.map(s => s.withCacheMs),
        setWithCacheStatuses,
        setWithCacheTime
      ),
    ])

    setRunning(false)
  }

  const totalWithout = PIPELINE_STEPS.reduce((s, step) => s + step.withoutCacheMs, 0)
  const totalWith = PIPELINE_STEPS.reduce((s, step) => s + step.withCacheMs, 0)
  const savings = totalWithout - totalWith
  const savingsPct = Math.round((savings / totalWithout) * 100)

  const renderPipeline = (
    label: string,
    statuses: StepStatus[],
    totalMs: number | null,
    isCache: boolean
  ) => (
    <div style={{
      flex: '1 1 220px',
      border: `2px solid ${isCache ? '#A5D6A7' : '#EF9A9A'}`,
      borderRadius: '10px',
      padding: '1rem',
      background: isCache ? '#F9FBE7' : '#FFF8F8',
    }}>
      <div style={{
        fontWeight: 700,
        marginBottom: '0.75rem',
        color: isCache ? '#2E7D32' : '#C62828',
        fontSize: '0.95rem',
      }}>
        {label}
      </div>
      {PIPELINE_STEPS.map((step, i) => (
        <div key={step.name} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem',
          fontSize: '0.85rem',
        }}>
          <StatusDot status={statuses[i]} />
          <span style={{ flex: 1 }}>{step.name}</span>
          <span style={{ color: '#888', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            {isCache
              ? `${(step.withCacheMs / 1000).toFixed(1)}s`
              : `${(step.withoutCacheMs / 1000).toFixed(1)}s`
            }
          </span>
        </div>
      ))}
      {totalMs !== null && (
        <div style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #e0e0e0',
          fontWeight: 700,
          fontSize: '0.9rem',
          color: isCache ? '#2E7D32' : '#C62828',
        }}>
          Итого: {(totalMs / 1000).toFixed(1)}s
        </div>
      )}
    </div>
  )

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Cache: ускорение сборки</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Симуляция пайплайна с кэшем и без. Главная разница — шаг установки зависимостей.
      </p>

      {/* Simulation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {renderPipeline('Без кэша', withoutCacheStatuses, withoutCacheTime, false)}
        {renderPipeline('С кэшем', withCacheStatuses, withCacheTime, true)}
      </div>

      <button
        onClick={runSimulation}
        disabled={running}
        style={{
          padding: '0.6rem 1.5rem',
          background: running ? '#bdbdbd' : '#1565C0',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: running ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginBottom: '1rem',
        }}
      >
        {running ? 'Симуляция...' : 'Запустить симуляцию'}
      </button>

      {withCacheTime !== null && withoutCacheTime !== null && (
        <div style={{
          background: '#E8F5E9',
          border: '1px solid #A5D6A7',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
        }}>
          Кэш сэкономил <strong>{(savings / 1000).toFixed(1)} сек ({savingsPct}%)</strong>.
          Ожидаемое время без кэша: {(totalWithout / 1000).toFixed(1)}s, с кэшем: {(totalWith / 1000).toFixed(1)}s.
        </div>
      )}

      {/* Cache config */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 250px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            cache:key — стратегия
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
            {CACHE_KEY_STRATEGIES.map(s => (
              <button
                key={s.value}
                onClick={() => setCacheStrategy(s.value)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  border: cacheStrategy === s.value ? '2px solid #1565C0' : '1px solid #ccc',
                  background: cacheStrategy === s.value ? '#E3F2FD' : '#fff',
                  color: cacheStrategy === s.value ? '#1565C0' : '#333',
                  fontWeight: cacheStrategy === s.value ? 700 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            cache:paths
          </div>
          {CACHE_PATHS_OPTIONS.map(opt => (
            <label key={opt.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.4rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}>
              <input
                type='checkbox'
                checked={cachePaths.includes(opt.label)}
                onChange={() => togglePath(opt.label)}
              />
              <code style={{ background: '#f5f5f5', padding: '1px 5px', borderRadius: '3px' }}>
                {opt.label}
              </code>
            </label>
          ))}
        </div>

        <div style={{ flex: '1 1 280px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Результирующий YAML
          </div>
          <pre style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '0.78rem',
            lineHeight: 1.6,
            overflow: 'auto',
            margin: 0,
          }}>
            {buildCacheYaml(cacheStrategy, cachePaths)}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 5.3: Cache vs Artifacts — decision matrix
// ============================================

interface Scenario {
  id: number
  description: string
  detail: string
  correct: 'cache' | 'artifacts'
  explanation: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    description: 'Передать собранный dist/ из build в deploy',
    detail: 'build создал dist/, deploy должен получить именно этот, а не предыдущий',
    correct: 'artifacts',
    explanation: 'Артефакты гарантируют передачу данных между джобами внутри пайплайна. Cache не гарантирует, что deploy получит dist/ именно от этого пайплайна — он может получить старый.',
  },
  {
    id: 2,
    description: 'Ускорить npm install между пайплайнами',
    detail: 'Каждый пайплайн тратит 3 минуты на npm install — хочется сократить до 20 секунд',
    correct: 'cache',
    explanation: 'node_modules/ — типичный кандидат для кэша. Зависимости не меняются между пайплайнами, если package-lock.json не изменился. Cache существует именно для ускорения за счёт переиспользования.',
  },
  {
    id: 3,
    description: 'Сохранить результаты JUnit-тестов для отображения в MR',
    detail: 'Хочется видеть список прошедших и упавших тестов прямо в Merge Request',
    correct: 'artifacts',
    explanation: 'Только artifacts:reports:junit позволяет GitLab распарсить файл и отобразить результаты тестов в UI. Cache для этого не подходит — он не интегрирован с UI GitLab.',
  },
  {
    id: 4,
    description: 'Переиспользовать Maven-зависимости из .m2/',
    detail: 'Каждая сборка скачивает 500MB Maven artifacts заново — очень медленно',
    correct: 'cache',
    explanation: 'Локальный Maven-репозиторий (.m2/repository) — идеальный кандидат для кэша. Зависимости тяжёлые, редко меняются, и их потеря не сломает пайплайн — просто скачаются заново.',
  },
  {
    id: 5,
    description: 'Передать Docker image digest из build в sign-job',
    detail: 'build пушит образ, sign-job должен подписать именно этот образ по его SHA256',
    correct: 'artifacts',
    explanation: 'Digest образа — это конкретное значение, которое должно передаться гарантированно. Если sign-job получит неверный digest из кэша, подпись будет на другой образ.',
  },
  {
    id: 6,
    description: 'Сохранить логи падения для постмортема',
    detail: 'При сбое сборки хочется сохранить детальные логи для анализа',
    correct: 'artifacts',
    explanation: 'Логи — конкретные файлы, привязанные к конкретному запуску. Используй artifacts:when: on_failure. Cache не привязан к конкретному пайплайну и может быть перезаписан.',
  },
  {
    id: 7,
    description: 'Хранить pip-пакеты между запусками Python-пайплайна',
    detail: 'venv/ занимает 1GB и создаётся заново каждый раз',
    correct: 'cache',
    explanation: 'Python venv и pip cache — классический кандидат для кэша. Зависимости стабильны между пайплайнами. При cache miss venv просто пересоздастся — пайплайн не сломается.',
  },
  {
    id: 8,
    description: 'Передать coverage-report из test в report-job',
    detail: 'report-job должен собрать итоговый HTML-отчёт из coverage данных текущего прогона',
    correct: 'artifacts',
    explanation: 'Coverage данные привязаны к конкретному запуску тестов. report-job должен получить именно их, а не coverage от вчерашнего пайплайна из кэша.',
  },
]

interface ScenarioAnswer {
  scenarioId: number
  chosen: 'cache' | 'artifacts'
  isCorrect: boolean
}

export function Task5_3_Solution() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<ScenarioAnswer[]>([])
  const [lastAnswer, setLastAnswer] = useState<ScenarioAnswer | null>(null)
  const [showResults, setShowResults] = useState(false)

  const scenario = SCENARIOS[currentIndex]
  const answered = lastAnswer !== null

  const handleAnswer = (choice: 'cache' | 'artifacts') => {
    if (answered) return
    const isCorrect = choice === scenario.correct
    const answer: ScenarioAnswer = { scenarioId: scenario.id, chosen: choice, isCorrect }
    setLastAnswer(answer)
    setAnswers(prev => [...prev, answer])
  }

  const handleNext = () => {
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setLastAnswer(null)
    } else {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setAnswers([])
    setLastAnswer(null)
    setShowResults(false)
  }

  const correctCount = answers.filter(a => a.isCorrect).length

  if (showResults) {
    return (
      <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '680px' }}>
        <h2 style={{ marginBottom: '0.25rem' }}>Результаты</h2>
        <p style={{ color: '#666', marginTop: 0, marginBottom: '1rem' }}>
          Правильно: <strong>{correctCount}</strong> из {SCENARIOS.length}
        </p>
        <div style={{ marginBottom: '1rem' }}>
          {SCENARIOS.map((s, i) => {
            const ans = answers[i]
            return (
              <div key={s.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                background: ans?.isCorrect ? '#E8F5E9' : '#FFEBEE',
                fontSize: '0.85rem',
              }}>
                <span>{ans?.isCorrect ? '✓' : '✗'}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{s.description}</div>
                  <div style={{ color: '#555' }}>
                    Верный ответ: <strong>{s.correct}</strong>
                    {ans && !ans.isCorrect && <span> (вы выбрали: {ans.chosen})</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <button
          onClick={handleReset}
          style={{
            padding: '0.6rem 1.5rem',
            background: '#1565C0',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Сначала
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '680px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Cache vs Artifacts: выбираем правильно</h2>
      <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Сценарий {currentIndex + 1} из {SCENARIOS.length}
        <div style={{
          height: '4px',
          background: '#e0e0e0',
          borderRadius: '2px',
          marginTop: '0.4rem',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${((currentIndex + 1) / SCENARIOS.length) * 100}%`,
            background: '#1565C0',
            borderRadius: '2px',
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      <div style={{
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '1.25rem',
        marginBottom: '1.25rem',
        background: '#fafafa',
      }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
          {scenario.description}
        </div>
        <div style={{ color: '#555', fontSize: '0.875rem' }}>{scenario.detail}</div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {(['cache', 'artifacts'] as const).map(choice => {
          let bg = '#fff'
          let border = '2px solid #ccc'
          let color = '#333'

          if (answered) {
            if (choice === scenario.correct) {
              bg = '#E8F5E9'; border = '2px solid #4CAF50'; color = '#2E7D32'
            } else if (choice === lastAnswer?.chosen && !lastAnswer.isCorrect) {
              bg = '#FFEBEE'; border = '2px solid #EF5350'; color = '#C62828'
            }
          }

          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={answered}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '10px',
                border,
                background: bg,
                color,
                fontWeight: 700,
                fontSize: '1rem',
                cursor: answered ? 'default' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {choice === 'cache' ? 'Cache' : 'Artifacts'}
            </button>
          )
        })}
      </div>

      {answered && (
        <div style={{
          background: lastAnswer?.isCorrect ? '#E8F5E9' : '#FFEBEE',
          border: `1px solid ${lastAnswer?.isCorrect ? '#A5D6A7' : '#EF9A9A'}`,
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.875rem',
        }}>
          <strong>{lastAnswer?.isCorrect ? 'Верно!' : 'Неверно.'}</strong>{' '}
          {scenario.explanation}
        </div>
      )}

      {answered && (
        <button
          onClick={handleNext}
          style={{
            padding: '0.6rem 1.5rem',
            background: '#1565C0',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {currentIndex < SCENARIOS.length - 1 ? 'Следующий сценарий →' : 'Посмотреть результаты'}
        </button>
      )}
    </div>
  )
}

// ============================================
// Task 5.4: Cache key strategies configurator
// ============================================

type KeyStrategy = 'static' | 'branch' | 'files'

interface KeyStrategyInfo {
  id: KeyStrategy
  name: string
  description: string
  autoInvalidation: boolean
  branchIsolation: boolean
  complexity: 'low' | 'medium' | 'high'
  getKey: (branch: string, lockfileHash: string, prefix: string) => string
  yaml: (prefix: string) => string
}

const KEY_STRATEGIES: KeyStrategyInfo[] = [
  {
    id: 'static',
    name: 'Статический ключ',
    description: 'Один кэш для всех запусков. Прост, но не инвалидируется автоматически. Зависимости могут устаревать.',
    autoInvalidation: false,
    branchIsolation: false,
    complexity: 'low',
    getKey: (_branch, _hash, prefix) => prefix ? `${prefix}-my-project-deps` : 'my-project-deps',
    yaml: (prefix) => prefix
      ? `cache:\n  key: '${prefix}-my-project-deps'\n  paths:\n    - node_modules/`
      : `cache:\n  key: 'my-project-deps'\n  paths:\n    - node_modules/`,
  },
  {
    id: 'branch',
    name: 'По ветке ($CI_COMMIT_REF_SLUG)',
    description: 'Каждая ветка имеет свой кэш. Хорошая изоляция, но не реагирует на изменение зависимостей.',
    autoInvalidation: false,
    branchIsolation: true,
    complexity: 'medium',
    getKey: (branch, _hash, prefix) => prefix ? `${prefix}-${branch}` : branch,
    yaml: (prefix) => prefix
      ? `cache:\n  key: '${prefix}-$CI_COMMIT_REF_SLUG'\n  paths:\n    - node_modules/`
      : `cache:\n  key: '$CI_COMMIT_REF_SLUG'\n  paths:\n    - node_modules/`,
  },
  {
    id: 'files',
    name: 'По lock-файлу (files)',
    description: 'Ключ — хэш package-lock.json. Изменились зависимости — кэш инвалидирован автоматически. Лучшая стратегия.',
    autoInvalidation: true,
    branchIsolation: false,
    complexity: 'medium',
    getKey: (_branch, hash, prefix) => prefix ? `${prefix}-${hash}` : hash,
    yaml: (prefix) => prefix
      ? `cache:\n  key:\n    files:\n      - package-lock.json\n    prefix: '${prefix}'\n  paths:\n    - node_modules/`
      : `cache:\n  key:\n    files:\n      - package-lock.json\n  paths:\n    - node_modules/`,
  },
]

const COMPLEXITY_LABELS: Record<string, string> = {
  low: 'Низкая',
  medium: 'Средняя',
  high: 'Высокая',
}

export function Task5_4_Solution() {
  const [activeStrategy, setActiveStrategy] = useState<KeyStrategy>('files')
  const [currentBranch, setCurrentBranch] = useState('main')
  const [lockfileVersion, setLockfileVersion] = useState(1)
  const [prefix, setPrefix] = useState('')
  const [simHistory, setSimHistory] = useState<Array<{ event: string; results: Record<KeyStrategy, 'hit' | 'miss'> }>>([])

  const lockfileHash = `sha256-lock-v${lockfileVersion}`

  const currentKeys: Record<KeyStrategy, string> = {
    static: KEY_STRATEGIES[0].getKey(currentBranch, lockfileHash, prefix),
    branch: KEY_STRATEGIES[1].getKey(currentBranch, lockfileHash, prefix),
    files: KEY_STRATEGIES[2].getKey(currentBranch, lockfileHash, prefix),
  }

  const simulateEvent = (eventType: 'branch' | 'lockfile') => {
    const prevKeys = { ...currentKeys }

    if (eventType === 'branch') {
      const newBranch = currentBranch === 'main' ? 'feature/auth' : 'main'
      setCurrentBranch(newBranch)
      const newKeys: Record<KeyStrategy, string> = {
        static: KEY_STRATEGIES[0].getKey(newBranch, lockfileHash, prefix),
        branch: KEY_STRATEGIES[1].getKey(newBranch, lockfileHash, prefix),
        files: KEY_STRATEGIES[2].getKey(newBranch, lockfileHash, prefix),
      }
      const results = {} as Record<KeyStrategy, 'hit' | 'miss'>
      for (const s of KEY_STRATEGIES) {
        results[s.id] = newKeys[s.id] === prevKeys[s.id] ? 'hit' : 'miss'
      }
      setSimHistory(prev => [{
        event: `Смена ветки: ${currentBranch} → ${newBranch}`,
        results,
      }, ...prev.slice(0, 4)])
    } else {
      const newVersion = lockfileVersion + 1
      setLockfileVersion(newVersion)
      const newHash = `sha256-lock-v${newVersion}`
      const newKeys: Record<KeyStrategy, string> = {
        static: KEY_STRATEGIES[0].getKey(currentBranch, newHash, prefix),
        branch: KEY_STRATEGIES[1].getKey(currentBranch, newHash, prefix),
        files: KEY_STRATEGIES[2].getKey(currentBranch, newHash, prefix),
      }
      const results = {} as Record<KeyStrategy, 'hit' | 'miss'>
      for (const s of KEY_STRATEGIES) {
        results[s.id] = newKeys[s.id] === prevKeys[s.id] ? 'hit' : 'miss'
      }
      setSimHistory(prev => [{
        event: `Обновление package-lock.json (v${newVersion})`,
        results,
      }, ...prev.slice(0, 4)])
    }
  }

  const activeStrategyInfo = KEY_STRATEGIES.find(s => s.id === activeStrategy)!

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Стратегии cache key</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Выбери стратегию и симулируй события — смотри, где будет cache hit или miss
      </p>

      {/* Strategy cards */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {KEY_STRATEGIES.map(s => (
          <div
            key={s.id}
            onClick={() => setActiveStrategy(s.id)}
            style={{
              flex: '1 1 200px',
              border: activeStrategy === s.id ? '2px solid #1565C0' : '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '0.875rem',
              cursor: 'pointer',
              background: activeStrategy === s.id ? '#E3F2FD' : '#fafafa',
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              fontWeight: 700,
              color: activeStrategy === s.id ? '#1565C0' : '#333',
              marginBottom: '0.4rem',
              fontSize: '0.9rem',
            }}>
              {s.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#666' }}>{s.description}</div>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px',
                background: s.autoInvalidation ? '#E8F5E9' : '#FFEBEE',
                color: s.autoInvalidation ? '#2E7D32' : '#C62828',
              }}>
                {s.autoInvalidation ? 'Авто-инвалидация' : 'Ручная инвалидация'}
              </span>
              <span style={{
                fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px',
                background: s.branchIsolation ? '#E8F5E9' : '#FFF8E1',
                color: s.branchIsolation ? '#2E7D32' : '#F57F17',
              }}>
                {s.branchIsolation ? 'Изоляция веток' : 'Общий кэш'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {/* Simulator */}
        <div style={{ flex: '1 1 280px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            Симулятор событий
          </div>

          <div style={{
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '0.75rem',
            fontSize: '0.85rem',
          }}>
            <div>Ветка: <strong style={{ fontFamily: 'monospace' }}>{currentBranch}</strong></div>
            <div>Lock-файл: <strong style={{ fontFamily: 'monospace' }}>v{lockfileVersion}</strong></div>
            <div style={{ marginTop: '0.4rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#888' }}>
              Текущий ключ: {currentKeys[activeStrategy]}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button
              onClick={() => simulateEvent('branch')}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: '#1565C0',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              Сменить ветку
            </button>
            <button
              onClick={() => simulateEvent('lockfile')}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: '#E65100',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              Обновить lock-файл
            </button>
          </div>

          {/* Sim history */}
          {simHistory.length > 0 && (
            <div>
              {simHistory.map((entry, i) => (
                <div key={i} style={{
                  marginBottom: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  background: '#fafafa',
                  border: '1px solid #e0e0e0',
                  fontSize: '0.78rem',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#555' }}>
                    {entry.event}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {KEY_STRATEGIES.map(s => (
                      <span key={s.id} style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: entry.results[s.id] === 'hit' ? '#E8F5E9' : '#FFEBEE',
                        color: entry.results[s.id] === 'hit' ? '#2E7D32' : '#C62828',
                        fontWeight: 600,
                      }}>
                        {s.name.split(' ')[0]}: {entry.results[s.id] === 'hit' ? 'HIT' : 'MISS'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* YAML + prefix */}
        <div style={{ flex: '1 1 280px' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Prefix (опционально)
          </div>
          <input
            type='text'
            value={prefix}
            onChange={e => setPrefix(e.target.value)}
            placeholder='например: v1 или node18'
            style={{
              width: '100%',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              boxSizing: 'border-box',
            }}
          />

          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Результирующий YAML
          </div>
          <pre style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '0.78rem',
            lineHeight: 1.6,
            overflow: 'auto',
            margin: 0,
          }}>
            {activeStrategyInfo.yaml(prefix)}
          </pre>
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
        Сравнение стратегий
      </div>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.85rem',
      }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', border: '1px solid #e0e0e0' }}>Стратегия</th>
            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', border: '1px solid #e0e0e0' }}>Авто-инвалидация</th>
            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', border: '1px solid #e0e0e0' }}>Изоляция веток</th>
            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', border: '1px solid #e0e0e0' }}>Сложность</th>
          </tr>
        </thead>
        <tbody>
          {KEY_STRATEGIES.map(s => (
            <tr
              key={s.id}
              style={{
                background: activeStrategy === s.id ? '#E3F2FD' : '#fff',
                cursor: 'pointer',
              }}
              onClick={() => setActiveStrategy(s.id)}
            >
              <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', fontWeight: activeStrategy === s.id ? 700 : 400 }}>
                {s.name}
              </td>
              <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', textAlign: 'center' }}>
                {s.autoInvalidation ? '✓' : '✗'}
              </td>
              <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', textAlign: 'center' }}>
                {s.branchIsolation ? '✓' : '✗'}
              </td>
              <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e0e0e0', textAlign: 'center' }}>
                {COMPLEXITY_LABELS[s.complexity]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
