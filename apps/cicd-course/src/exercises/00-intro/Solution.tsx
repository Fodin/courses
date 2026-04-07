// ============================================
// Level 0: Introduction to CI/CD — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 0.1: CI vs CD vs CD
// ============================================

type PhaseId = 'ci' | 'delivery' | 'deployment'

interface PhaseInfo {
  id: PhaseId
  title: string
  shortName: string
  goal: string
  automatedSteps: string[]
  manualStep: string | null
  frequency: string
  color: string
  bgColor: string
  borderColor: string
}

const phases: PhaseInfo[] = [
  {
    id: 'ci',
    title: 'Continuous Integration',
    shortName: 'CI',
    goal: 'Как можно чаще объединять код всех разработчиков и проверять, что он работает вместе',
    automatedSteps: [
      'Checkout кода из репозитория',
      'Установка зависимостей',
      'Запуск линтера и статического анализа',
      'Запуск unit-тестов',
      'Сборка артефакта',
      'Публикация отчёта о тестах',
    ],
    manualStep: null,
    frequency: 'При каждом push / pull request',
    color: '#1565C0',
    bgColor: '#E3F2FD',
    borderColor: '#90CAF9',
  },
  {
    id: 'delivery',
    title: 'Continuous Delivery',
    shortName: 'C. Delivery',
    goal: 'Код всегда готов к деплою. Но само решение о деплое в продакшн принимает человек',
    automatedSteps: [
      'Всё из CI',
      'Деплой на staging-окружение',
      'Запуск интеграционных тестов',
      'Запуск smoke-тестов на staging',
      'Уведомление команды о готовности к релизу',
    ],
    manualStep: 'Нажать кнопку "Deploy to Production"',
    frequency: 'Автоматически до staging; в прод — по решению команды',
    color: '#E65100',
    bgColor: '#FFF3E0',
    borderColor: '#FFCC80',
  },
  {
    id: 'deployment',
    title: 'Continuous Deployment',
    shortName: 'C. Deployment',
    goal: 'Каждый коммит, прошедший все проверки, автоматически попадает в продакшн без участия человека',
    automatedSteps: [
      'Всё из CI и Continuous Delivery',
      'Автоматический деплой на production',
      'Canary/blue-green деплой',
      'Автоматический rollback при аномалиях',
      'Уведомление о завершении деплоя',
    ],
    manualStep: null,
    frequency: 'При каждом коммите в main (если тесты зелёные)',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
]

interface Activity {
  text: string
  correctPhase: PhaseId
}

const activities: Activity[] = [
  { text: 'Запустить unit-тесты', correctPhase: 'ci' },
  { text: 'Задеплоить на prod автоматически', correctPhase: 'deployment' },
  { text: 'Собрать Docker-образ', correctPhase: 'ci' },
  { text: 'Нажать кнопку "Release to production"', correctPhase: 'delivery' },
  { text: 'Запустить smoke-тесты на staging', correctPhase: 'delivery' },
  { text: 'Выполнить автоматический rollback', correctPhase: 'deployment' },
  { text: 'Проверить линтером стиль кода', correctPhase: 'ci' },
  { text: 'Уведомить команду: "готово к релизу"', correctPhase: 'delivery' },
]

export function Task0_1_Solution() {
  const [selectedPhase, setSelectedPhase] = useState<PhaseId | null>(null)
  const [answers, setAnswers] = useState<Record<number, PhaseId | null>>({})
  const [showResults, setShowResults] = useState(false)

  const handleActivityAssign = (activityIndex: number, phaseId: PhaseId) => {
    setAnswers(prev => ({ ...prev, [activityIndex]: phaseId }))
    setShowResults(false)
  }

  const correctCount = Object.entries(answers).filter(
    ([idx, ans]) => ans === activities[Number(idx)].correctPhase
  ).length

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>CI vs CD vs CD: разбираемся в терминах</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Кликни на карточку, чтобы увидеть детали каждой фазы
      </p>

      {/* Phase cards */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {phases.map(phase => (
          <div
            key={phase.id}
            onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
            style={{
              flex: '1 1 200px',
              border: `2px solid ${selectedPhase === phase.id ? phase.color : phase.borderColor}`,
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              background: selectedPhase === phase.id ? phase.bgColor : '#fff',
              transition: 'all 0.2s',
              boxShadow: selectedPhase === phase.id ? `0 2px 8px ${phase.borderColor}` : 'none',
            }}
          >
            <div style={{
              display: 'inline-block',
              background: phase.color,
              color: '#fff',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}>
              {phase.shortName}
            </div>
            <div style={{ fontWeight: 600, color: phase.color, marginBottom: '0.5rem' }}>
              {phase.title}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#555' }}>{phase.goal}</div>
            <div style={{
              marginTop: '0.75rem',
              fontSize: '0.8rem',
              color: '#888',
              fontStyle: 'italic',
            }}>
              {selectedPhase === phase.id ? '▲ Свернуть' : '▼ Подробнее'}
            </div>
          </div>
        ))}
      </div>

      {/* Phase detail panel */}
      {selectedPhase && (() => {
        const phase = phases.find(p => p.id === selectedPhase)!
        return (
          <div style={{
            border: `1px solid ${phase.borderColor}`,
            borderRadius: '8px',
            padding: '1.25rem',
            background: phase.bgColor,
            marginBottom: '1.5rem',
          }}>
            <h3 style={{ color: phase.color, marginTop: 0 }}>{phase.title} — детали</h3>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <strong>Автоматические шаги:</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                  {phase.automatedSteps.map((step, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                      <span style={{ color: '#388E3C', marginRight: '0.25rem' }}>✅</span> {step}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <strong>Ручной шаг:</strong>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  {phase.manualStep ? (
                    <span>
                      <span style={{ marginRight: '0.25rem' }}>⚠️</span>
                      {phase.manualStep}
                    </span>
                  ) : (
                    <span>
                      <span style={{ color: '#388E3C', marginRight: '0.25rem' }}>✅</span>
                      Полностью автоматизировано
                    </span>
                  )}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <strong>Частота:</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.25rem', color: '#555' }}>
                    {phase.frequency}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Activity classifier */}
      <div style={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1.25rem',
        background: '#fafafa',
      }}>
        <h3 style={{ marginTop: 0 }}>Классифицируй активности</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Для каждой активности выбери, к какой фазе она относится
        </p>
        {activities.map((activity, idx) => {
          const userAnswer = answers[idx] ?? null
          const isCorrect = userAnswer === activity.correctPhase
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem',
                padding: '0.5rem',
                borderRadius: '6px',
                background: showResults
                  ? isCorrect ? '#E8F5E9' : userAnswer ? '#FFEBEE' : '#fff'
                  : '#fff',
                border: '1px solid #e0e0e0',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ flex: '1 1 200px', fontSize: '0.9rem' }}>{activity.text}</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {phases.map(phase => (
                  <button
                    key={phase.id}
                    onClick={() => handleActivityAssign(idx, phase.id)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '4px',
                      border: `1px solid ${userAnswer === phase.id ? phase.color : '#ccc'}`,
                      background: userAnswer === phase.id ? phase.bgColor : '#fff',
                      color: userAnswer === phase.id ? phase.color : '#666',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: userAnswer === phase.id ? 600 : 400,
                    }}
                  >
                    {phase.shortName}
                  </button>
                ))}
              </div>
              {showResults && userAnswer && (
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {isCorrect ? '✅' : `❌ → ${phases.find(p => p.id === activity.correctPhase)!.shortName}`}
                </span>
              )}
            </div>
          )
        })}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => setShowResults(true)}
            style={{
              padding: '8px 16px',
              background: '#1565C0',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Проверить ответы
          </button>
          <button
            onClick={() => { setAnswers({}); setShowResults(false) }}
            style={{
              padding: '8px 16px',
              background: '#fff',
              color: '#555',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Сбросить
          </button>
          {showResults && (
            <span style={{ fontWeight: 600, color: correctCount === activities.length ? '#2E7D32' : '#C62828' }}>
              {correctCount} / {activities.length} правильно
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 0.2: Pipeline Anatomy
// ============================================

type JobStatus = 'pending' | 'running' | 'success' | 'failed'

interface PipelineJob {
  id: string
  name: string
  duration: string
  status: JobStatus
}

interface PipelineStage {
  id: string
  name: string
  color: string
  bgColor: string
  jobs: PipelineJob[]
}

const initialStages: PipelineStage[] = [
  {
    id: 'source',
    name: 'Source',
    color: '#5C6BC0',
    bgColor: '#E8EAF6',
    jobs: [
      { id: 'checkout', name: 'git checkout', duration: '~5 сек', status: 'pending' },
      { id: 'install', name: 'npm install', duration: '~30 сек', status: 'pending' },
    ],
  },
  {
    id: 'build',
    name: 'Build',
    color: '#0277BD',
    bgColor: '#E1F5FE',
    jobs: [
      { id: 'compile', name: 'tsc compile', duration: '~40 сек', status: 'pending' },
      { id: 'docker', name: 'docker build', duration: '~2 мин', status: 'pending' },
    ],
  },
  {
    id: 'test',
    name: 'Test',
    color: '#00695C',
    bgColor: '#E0F2F1',
    jobs: [
      { id: 'unit', name: 'unit tests', duration: '~1 мин', status: 'pending' },
      { id: 'integration', name: 'integration tests', duration: '~3 мин', status: 'pending' },
      { id: 'lint', name: 'eslint', duration: '~20 сек', status: 'pending' },
    ],
  },
  {
    id: 'deploy',
    name: 'Deploy',
    color: '#558B2F',
    bgColor: '#F1F8E9',
    jobs: [
      { id: 'staging', name: 'deploy staging', duration: '~1.5 мин', status: 'pending' },
      { id: 'smoke', name: 'smoke tests', duration: '~30 сек', status: 'pending' },
      { id: 'prod', name: 'deploy prod', duration: '~2 мин', status: 'pending' },
    ],
  },
]

const statusIcon: Record<JobStatus, string> = {
  pending: '○',
  running: '⟳',
  success: '✅',
  failed: '❌',
}

const statusColor: Record<JobStatus, string> = {
  pending: '#9E9E9E',
  running: '#1565C0',
  success: '#2E7D32',
  failed: '#C62828',
}

export function Task0_2_Solution() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null)
  const [stages, setStages] = useState<PipelineStage[]>(initialStages)
  const [isRunning, setIsRunning] = useState(false)

  const getStageOverallStatus = (stage: PipelineStage): JobStatus => {
    const statuses = stage.jobs.map(j => j.status)
    if (statuses.every(s => s === 'success')) return 'success'
    if (statuses.some(s => s === 'failed')) return 'failed'
    if (statuses.some(s => s === 'running')) return 'running'
    return 'pending'
  }

  const runPipeline = () => {
    if (isRunning) return
    setIsRunning(true)
    // Reset all to pending
    setStages(initialStages.map(s => ({
      ...s,
      jobs: s.jobs.map(j => ({ ...j, status: 'pending' as JobStatus })),
    })))

    let delay = 0
    initialStages.forEach((stage, stageIdx) => {
      // All jobs in a stage start running simultaneously
      delay += 400
      const runDelay = delay
      setTimeout(() => {
        setStages(prev => prev.map((s, si) =>
          si === stageIdx
            ? { ...s, jobs: s.jobs.map(j => ({ ...j, status: 'running' as JobStatus })) }
            : s
        ))
        setSelectedStage(stage.id)
      }, runDelay)

      // All jobs finish after their max duration
      delay += 800
      const doneDelay = delay
      setTimeout(() => {
        setStages(prev => prev.map((s, si) =>
          si === stageIdx
            ? { ...s, jobs: s.jobs.map(j => ({ ...j, status: 'success' as JobStatus })) }
            : s
        ))
      }, doneDelay)
    })

    setTimeout(() => {
      setIsRunning(false)
    }, delay + 200)
  }

  const resetPipeline = () => {
    setStages(initialStages)
    setSelectedStage(null)
    setIsRunning(false)
  }

  const selected = stages.find(s => s.id === selectedStage)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Анатомия пайплайна</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.25rem' }}>
        Кликни на стадию, чтобы увидеть джобы внутри неё
      </p>

      {/* Pipeline horizontal flow */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        overflowX: 'auto',
        padding: '0.5rem 0',
        marginBottom: '1.25rem',
      }}>
        {stages.map((stage, idx) => {
          const overallStatus = getStageOverallStatus(stage)
          const isSelected = selectedStage === stage.id
          return (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  border: `2px solid ${isSelected ? stage.color : '#ddd'}`,
                  background: isSelected ? stage.bgColor : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  minWidth: '100px',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 2px 8px ${stage.bgColor}` : 'none',
                }}
              >
                <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                  {statusIcon[overallStatus]}
                </div>
                <div style={{ fontWeight: 600, color: stage.color, fontSize: '0.9rem' }}>
                  {stage.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem' }}>
                  {stage.jobs.length} джоб{stage.jobs.length > 1 ? 'а' : ''}
                </div>
              </div>
              {idx < stages.length - 1 && (
                <div style={{
                  fontSize: '1.5rem',
                  color: '#bbb',
                  padding: '0 0.25rem',
                  userSelect: 'none',
                }}>
                  →
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Stage detail panel */}
      {selected && (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1.25rem',
          background: selected.bgColor,
          marginBottom: '1.25rem',
          borderLeft: `4px solid ${selected.color}`,
        }}>
          <h3 style={{ color: selected.color, marginTop: 0, marginBottom: '0.75rem' }}>
            Stage: {selected.name}
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {selected.jobs.map(job => (
              <div
                key={job.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                  minWidth: '140px',
                  borderTop: `3px solid ${statusColor[job.status]}`,
                }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                  {statusIcon[job.status]}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  {job.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{job.duration}</div>
                <div style={{
                  fontSize: '0.75rem',
                  color: statusColor[job.status],
                  fontWeight: 600,
                  marginTop: '0.25rem',
                  textTransform: 'capitalize',
                }}>
                  {job.status}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#555' }}>
            💡 Джобы внутри одной стадии выполняются <strong>параллельно</strong>
          </div>
        </div>
      )}

      {/* Glossary */}
      <div style={{
        background: '#f5f5f5',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.25rem',
        fontSize: '0.85rem',
      }}>
        <strong>Ключевые понятия:</strong>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {[
            { term: 'Pipeline', def: 'весь процесс целиком' },
            { term: 'Stage', def: 'логическая группа джобов' },
            { term: 'Job', def: 'единица работы, запускается в изоляции' },
            { term: 'Artifact', def: 'файл, переданный между стадиями' },
          ].map(item => (
            <div key={item.term}>
              <strong style={{ color: '#333' }}>{item.term}</strong>
              <span style={{ color: '#666' }}> — {item.def}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={runPipeline}
          disabled={isRunning}
          style={{
            padding: '8px 18px',
            background: isRunning ? '#aaa' : '#2E7D32',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {isRunning ? 'Выполняется...' : '▶ Запустить пайплайн'}
        </button>
        <button
          onClick={resetPipeline}
          style={{
            padding: '8px 18px',
            background: '#fff',
            color: '#555',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          ↺ Сбросить
        </button>
      </div>
    </div>
  )
}

// ============================================
// Task 0.3: CI/CD Tools Landscape
// ============================================

type ToolType = 'saas' | 'self-hosted' | 'both'
type EcosystemSize = 'small' | 'medium' | 'large'
type SetupComplexity = 'low' | 'medium' | 'high'

interface CITool {
  id: string
  name: string
  type: ToolType
  free: boolean
  freeDetails: string
  configFile: string
  ecosystem: EcosystemSize
  setupComplexity: SetupComplexity
  bestFor: string[]
  pros: string[]
  cons: string[]
  color: string
  bgColor: string
}

const tools: CITool[] = [
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    type: 'saas',
    free: true,
    freeDetails: 'Бесплатно для публичных репо; 2000 мин/мес для приватных',
    configFile: '.github/workflows/*.yml',
    ecosystem: 'large',
    setupComplexity: 'low',
    bestFor: ['Проекты на GitHub', 'Open source', 'Быстрый старт'],
    pros: [
      'Встроен в GitHub — нет дополнительных регистраций',
      'Огромный маркет готовых actions',
      'Matrix builds из коробки',
      'Простой синтаксис YAML',
    ],
    cons: [
      'Привязан к GitHub экосистеме',
      'Дорого для больших команд с приватными репо',
      'Ограниченный контроль над раннерами (без self-hosted)',
    ],
    color: '#24292F',
    bgColor: '#f6f8fa',
  },
  {
    id: 'gitlab-ci',
    name: 'GitLab CI',
    type: 'both',
    free: true,
    freeDetails: '400 мин/мес на GitLab.com; бесплатно self-hosted',
    configFile: '.gitlab-ci.yml',
    ecosystem: 'large',
    setupComplexity: 'medium',
    bestFor: ['Команды на GitLab', 'Self-hosted инфраструктура', 'Комплексные пайплайны'],
    pros: [
      'Всё в одном: репо + CI + Container Registry',
      'Мощные артефакты и кэширование',
      'Гибкие правила запуска (rules, only/except)',
      'Self-hosted вариант бесплатен',
    ],
    cons: [
      'Более сложная конфигурация',
      'Тяжёлый UI',
      'Self-hosted требует ресурсов для поддержки',
    ],
    color: '#FC6D26',
    bgColor: '#fff5ef',
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    type: 'self-hosted',
    free: true,
    freeDetails: 'Open source, но нужен сервер',
    configFile: 'Jenkinsfile (Groovy)',
    ecosystem: 'large',
    setupComplexity: 'high',
    bestFor: ['Сложные корпоративные пайплайны', 'Полный контроль', 'Большие enterprise-команды'],
    pros: [
      'Огромная экосистема плагинов (1800+)',
      'Полный контроль над инфраструктурой',
      'Гибкость настройки практически без ограничений',
      'Зрелое и проверенное решение',
    ],
    cons: [
      'Устаревший UI',
      'Требует сервера и его обслуживания',
      'Сложная начальная настройка',
      'Groovy DSL — высокий порог входа',
    ],
    color: '#D33833',
    bgColor: '#fdf0ef',
  },
  {
    id: 'circleci',
    name: 'CircleCI',
    type: 'saas',
    free: true,
    freeDetails: '6000 мин/мес на бесплатном плане',
    configFile: '.circleci/config.yml',
    ecosystem: 'medium',
    setupComplexity: 'low',
    bestFor: ['Быстрый старт', 'Docker-ориентированные проекты', 'Команды без DevOps'],
    pros: [
      'Удобный UI и хорошая документация',
      'Быстрые сборки за счёт умного кэширования',
      'Простая интеграция с Docker',
      'Orbs — переиспользуемые конфиги',
    ],
    cons: [
      'Дорого на больших объёмах',
      'Меньше интеграций, чем у GitHub Actions',
      'Меньше контроля над окружением',
    ],
    color: '#343434',
    bgColor: '#f5f5f5',
  },
  {
    id: 'travis-ci',
    name: 'Travis CI',
    type: 'saas',
    free: false,
    freeDetails: 'Платный (был бесплатен для open source до 2020)',
    configFile: '.travis.yml',
    ecosystem: 'medium',
    setupComplexity: 'low',
    bestFor: ['Legacy проекты', 'Команды с историческим выбором'],
    pros: [
      'Простой и понятный синтаксис',
      'Хорошая документация',
      'Долгая история — стабильный',
    ],
    cons: [
      'Платный — нет бесплатного плана',
      'Потерял долю рынка в пользу GitHub Actions',
      'Менее активное развитие',
    ],
    color: '#3EAAAF',
    bgColor: '#f0fafb',
  },
]

const complexityLabel: Record<SetupComplexity, string> = {
  low: 'Низкая',
  medium: 'Средняя',
  high: 'Высокая',
}

const complexityColor: Record<SetupComplexity, string> = {
  low: '#2E7D32',
  medium: '#E65100',
  high: '#C62828',
}

const ecosystemLabel: Record<EcosystemSize, string> = {
  small: 'Небольшая',
  medium: 'Средняя',
  large: 'Большая',
}

type FilterType = 'all' | ToolType

export function Task0_3_Solution() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const filteredTools = tools.filter(tool => {
    if (filter === 'all') return true
    if (filter === 'saas') return tool.type === 'saas' || tool.type === 'both'
    if (filter === 'self-hosted') return tool.type === 'self-hosted' || tool.type === 'both'
    return true
  })

  const selected = tools.find(t => t.id === selectedTool)

  const typeLabel: Record<ToolType, string> = {
    saas: 'SaaS',
    'self-hosted': 'Self-hosted',
    both: 'SaaS + Self-hosted',
  }

  const typeBadgeColor: Record<ToolType, { bg: string; text: string }> = {
    saas: { bg: '#E3F2FD', text: '#1565C0' },
    'self-hosted': { bg: '#FCE4EC', text: '#880E4F' },
    both: { bg: '#F3E5F5', text: '#6A1B9A' },
  }

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Ландшафт CI/CD инструментов</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.25rem' }}>
        Выбери инструмент, чтобы увидеть детальное сравнение
      </p>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(['all', 'saas', 'self-hosted'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: `1px solid ${filter === f ? '#1565C0' : '#ddd'}`,
              background: filter === f ? '#1565C0' : '#fff',
              color: filter === f ? '#fff' : '#555',
              cursor: 'pointer',
              fontWeight: filter === f ? 600 : 400,
              fontSize: '0.9rem',
            }}
          >
            {f === 'all' ? 'Все' : f === 'saas' ? 'SaaS' : 'Self-hosted'}
          </button>
        ))}
        <span style={{ color: '#999', fontSize: '0.85rem', alignSelf: 'center', marginLeft: '0.5rem' }}>
          Найдено: {filteredTools.length}
        </span>
      </div>

      {/* Tool cards grid */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {filteredTools.map(tool => {
          const badge = typeBadgeColor[tool.type]
          const isSelected = selectedTool === tool.id
          return (
            <div
              key={tool.id}
              style={{
                flex: '1 1 180px',
                maxWidth: '220px',
                border: `2px solid ${isSelected ? tool.color : '#e0e0e0'}`,
                borderRadius: '8px',
                padding: '1rem',
                background: isSelected ? tool.bgColor : '#fff',
                transition: 'all 0.2s',
                cursor: 'default',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: tool.color }}>
                  {tool.name}
                </div>
                {tool.free && (
                  <span style={{ fontSize: '0.7rem', background: '#E8F5E9', color: '#2E7D32', padding: '1px 6px', borderRadius: '3px', fontWeight: 600 }}>
                    FREE
                  </span>
                )}
              </div>
              <div style={{
                display: 'inline-block',
                background: badge.bg,
                color: badge.text,
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}>
                {typeLabel[tool.type]}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                Сложность настройки:
              </div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '0.75rem' }}>
                {(['low', 'medium', 'high'] as SetupComplexity[]).map((level, i) => {
                  const levels = ['low', 'medium', 'high']
                  const toolLevel = levels.indexOf(tool.setupComplexity)
                  const isFilled = i <= toolLevel
                  return (
                    <div
                      key={level}
                      style={{
                        width: '20px',
                        height: '6px',
                        borderRadius: '3px',
                        background: isFilled ? complexityColor[tool.setupComplexity] : '#e0e0e0',
                      }}
                    />
                  )
                })}
                <span style={{ fontSize: '0.75rem', color: complexityColor[tool.setupComplexity], marginLeft: '4px', fontWeight: 600 }}>
                  {complexityLabel[tool.setupComplexity]}
                </span>
              </div>
              <button
                onClick={() => setSelectedTool(isSelected ? null : tool.id)}
                style={{
                  width: '100%',
                  padding: '5px',
                  background: isSelected ? tool.color : '#fff',
                  color: isSelected ? '#fff' : tool.color,
                  border: `1px solid ${tool.color}`,
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {isSelected ? '▲ Свернуть' : '▼ Подробнее'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Tool detail panel */}
      {selected && (
        <div style={{
          border: `1px solid #e0e0e0`,
          borderRadius: '8px',
          padding: '1.25rem',
          background: selected.bgColor,
          borderLeft: `4px solid ${selected.color}`,
        }}>
          <h3 style={{ color: selected.color, marginTop: 0 }}>{selected.name} — детали</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Конфигурационный файл:</strong>
              <div style={{
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '6px 12px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                marginTop: '0.35rem',
              }}>
                {selected.configFile}
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <strong>Тип:</strong> {typeLabel[selected.type]}
              </div>
              <div>
                <strong>Бесплатный план:</strong> {selected.free ? `✅ ${selected.freeDetails}` : `❌ ${selected.freeDetails}`}
              </div>
              <div>
                <strong>Экосистема:</strong> {ecosystemLabel[selected.ecosystem]}
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <strong>Лучше всего для:</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                  {selected.bestFor.map((item, i) => (
                    <li key={i} style={{ fontSize: '0.85rem' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <strong style={{ color: '#2E7D32' }}>Плюсы:</strong>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                {selected.pros.map((pro, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#2E7D32' }}>✅</span> {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong style={{ color: '#C62828' }}>Минусы:</strong>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                {selected.cons.map((con, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#C62828' }}>❌</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
