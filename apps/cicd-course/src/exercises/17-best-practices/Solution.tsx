// ============================================
// Level 17: Best Practices — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 17.1: Pipeline Performance Profiler
// ============================================

type PipelineMode = 'sequential' | 'optimized'

interface Job {
  id: string
  label: string
  stage: string
  color: string
  bg: string
  border: string
  baseDuration: number // seconds
  needs: string[]
}

const JOBS: Job[] = [
  { id: 'install', label: 'install', stage: 'prepare', color: '#5C35CC', bg: '#EDE7F6', border: '#B39DDB', baseDuration: 60, needs: [] },
  { id: 'lint', label: 'lint', stage: 'test', color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9', baseDuration: 30, needs: ['install'] },
  { id: 'test:unit', label: 'test:unit', stage: 'test', color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7', baseDuration: 120, needs: ['install'] },
  { id: 'test:e2e', label: 'test:e2e', stage: 'test', color: '#E65100', bg: '#FFF3E0', border: '#FFCC80', baseDuration: 180, needs: ['install'] },
  { id: 'build', label: 'build', stage: 'build', color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9', baseDuration: 90, needs: ['lint', 'test:unit', 'test:e2e'] },
  { id: 'deploy', label: 'deploy', stage: 'deploy', color: '#880E4F', bg: '#FCE4EC', border: '#F48FB1', baseDuration: 45, needs: ['build'] },
]

const JOB_YAML: Record<string, string> = {
  install: `install:
  stage: prepare
  script:
    - npm ci
  cache:
    key:
      files: [package-lock.json]
    paths: [node_modules/]
    policy: push`,
  lint: `lint:
  stage: test
  needs: [install]     # DAG: не ждёт весь stage
  dependencies: []
  script:
    - npm run lint`,
  'test:unit': `test:unit:
  stage: test
  needs: [install]     # параллельно с lint и test:e2e
  script:
    - npm test -- --coverage`,
  'test:e2e': `test:e2e:
  stage: test
  needs: [install]
  rules:
    - changes:
        - src/frontend/**/*
      when: on_success
    - when: never      # пропустить если frontend не менялся
  script:
    - npm run e2e`,
  build: `build:
  stage: build
  needs: [lint, test:unit, test:e2e]   # ждёт все три
  script:
    - npm run build
  artifacts:
    paths: [dist/]`,
  deploy: `deploy:
  stage: deploy
  needs: [build]
  script:
    - helm upgrade --install myapp ./chart
        --set image.tag=$CI_COMMIT_SHORT_SHA`,
}

function calcTimes(jobs: Job[], mode: PipelineMode, useGitDepth: boolean, frontendChanged: boolean) {
  const gitSaving = useGitDepth ? 30 : 0
  const activeJobs = jobs.filter(j => {
    if (j.id === 'test:e2e' && !frontendChanged) return false
    return true
  })

  const duration: Record<string, number> = {}
  activeJobs.forEach(j => { duration[j.id] = j.baseDuration - gitSaving })

  const startTimes: Record<string, number> = {}
  const endTimes: Record<string, number> = {}

  if (mode === 'sequential') {
    let cursor = 0
    activeJobs.forEach(j => {
      startTimes[j.id] = cursor
      endTimes[j.id] = cursor + duration[j.id]
      cursor += duration[j.id]
    })
  } else {
    // DAG: start = max(endTime of dependencies)
    activeJobs.forEach(j => {
      const depEnd = j.needs
        .filter(dep => activeJobs.find(aj => aj.id === dep))
        .map(dep => endTimes[dep] ?? 0)
      const start = depEnd.length > 0 ? Math.max(...depEnd) : 0
      startTimes[j.id] = start
      endTimes[j.id] = start + duration[j.id]
    })
  }

  const totalTime = Math.max(...activeJobs.map(j => endTimes[j.id]))
  return { startTimes, endTimes, duration, totalTime, activeJobs }
}

function formatTime(seconds: number) {
  if (seconds < 60) return `${seconds}с`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}м ${s}с` : `${m}м`
}

export function Task17_1_Solution() {
  const [mode, setMode] = useState<PipelineMode>('sequential')
  const [useGitDepth, setUseGitDepth] = useState(false)
  const [frontendChanged, setFrontendChanged] = useState(true)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  const seqData = calcTimes(JOBS, 'sequential', useGitDepth, frontendChanged)
  const optData = calcTimes(JOBS, 'optimized', useGitDepth, frontendChanged)
  const data = mode === 'sequential' ? seqData : optData

  const saving = Math.round((1 - optData.totalTime / seqData.totalTime) * 100)
  const maxTime = data.totalTime

  const btnStyle = (active: boolean, color = '#1565C0') => ({
    padding: '6px 16px',
    borderRadius: '6px',
    border: `2px solid ${active ? color : '#ddd'}`,
    background: active ? color : '#fff',
    color: active ? '#fff' : '#555',
    cursor: 'pointer',
    fontWeight: active ? 700 : 400,
    fontSize: '13px',
  })

  const toggleStyle = (active: boolean) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    border: `1px solid ${active ? '#2E7D32' : '#ddd'}`,
    background: active ? '#E8F5E9' : '#f5f5f5',
    color: active ? '#2E7D32' : '#888',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: active ? 700 : 400,
  })

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Pipeline Performance: оптимизация скорости</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Сравни последовательный и оптимизированный (DAG) пайплайны
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={btnStyle(mode === 'sequential', '#C62828')} onClick={() => setMode('sequential')}>Sequential</button>
          <button style={btnStyle(mode === 'optimized', '#2E7D32')} onClick={() => setMode('optimized')}>Optimized (DAG)</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button style={toggleStyle(useGitDepth)} onClick={() => setUseGitDepth(v => !v)}>
            {useGitDepth ? 'GIT_DEPTH: 1 ✓' : 'GIT_DEPTH: 1'}
          </button>
          <button style={toggleStyle(frontendChanged)} onClick={() => setFrontendChanged(v => !v)}>
            {frontendChanged ? 'Frontend changed ✓' : 'Frontend changed'}
          </button>
        </div>
      </div>

      {/* Time summary */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{
          padding: '12px 20px', borderRadius: '10px',
          background: mode === 'sequential' ? '#FFEBEE' : '#E8F5E9',
          border: `2px solid ${mode === 'sequential' ? '#E57373' : '#81C784'}`,
        }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Текущий режим</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: mode === 'sequential' ? '#C62828' : '#2E7D32' }}>
            {formatTime(data.totalTime)}
          </div>
        </div>
        <div style={{ padding: '12px 20px', borderRadius: '10px', background: '#E3F2FD', border: '2px solid #90CAF9' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Экономия (DAG vs Sequential)</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1565C0' }}>-{saving}%</div>
        </div>
        {!frontendChanged && (
          <div style={{ padding: '12px 20px', borderRadius: '10px', background: '#FFF3E0', border: '2px solid #FFCC80' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>test:e2e</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#E65100' }}>пропущен (rules:changes)</div>
          </div>
        )}
      </div>

      {/* Gantt chart */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>Временная шкала</div>
        <div style={{ background: '#f8f8f8', borderRadius: '8px', padding: '12px', overflowX: 'auto' }}>
          {data.activeJobs.map(job => {
            const start = data.startTimes[job.id]
            const dur = data.duration[job.id]
            const leftPct = (start / maxTime) * 100
            const widthPct = (dur / maxTime) * 100
            const isSelected = selectedJob === job.id
            return (
              <div key={job.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', gap: '8px' }}>
                <div style={{ width: '90px', fontSize: '12px', textAlign: 'right', color: '#555', flexShrink: 0 }}>
                  {job.label}
                </div>
                <div style={{ flex: 1, position: 'relative', height: '28px', background: '#e9e9e9', borderRadius: '4px' }}>
                  <div
                    onClick={() => setSelectedJob(isSelected ? null : job.id)}
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      height: '100%',
                      background: job.bg,
                      border: `2px solid ${isSelected ? '#1565C0' : job.border}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: job.color,
                      boxShadow: isSelected ? '0 0 0 2px #1565C0' : 'none',
                      minWidth: '40px',
                      overflow: 'hidden',
                    }}
                  >
                    {formatTime(dur)}
                  </div>
                </div>
              </div>
            )
          })}
          {/* Time axis */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', gap: '8px' }}>
            <div style={{ width: '90px', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999' }}>
              <span>0</span>
              <span>{formatTime(Math.round(maxTime / 2))}</span>
              <span>{formatTime(maxTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* YAML for selected job */}
      {selectedJob && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
            Конфигурация: {selectedJob}
          </div>
          <pre style={{
            background: '#1e1e2e',
            color: '#cdd6f4',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '12px',
            lineHeight: 1.6,
            margin: 0,
            overflowX: 'auto',
          }}>
            {JOB_YAML[selectedJob]}
          </pre>
        </div>
      )}
      {!selectedJob && (
        <div style={{ color: '#999', fontSize: '13px', textAlign: 'center', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
          Нажми на блок джоба чтобы увидеть его YAML-конфиг
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 17.2: Pipeline as Code — структура
// ============================================

const BAD_CONFIG = `lint:
  image: node:20-alpine
  tags: [docker]
  cache:
    key:
      files: [package-lock.json]
    paths: [node_modules/]
    policy: pull
  script:
    - npm run lint

test:unit:
  image: node:20-alpine
  tags: [docker]
  cache:
    key:
      files: [package-lock.json]
    paths: [node_modules/]
    policy: pull
  script:
    - npm test

test:e2e:
  image: node:20-alpine
  tags: [docker]
  cache:
    key:
      files: [package-lock.json]
    paths: [node_modules/]
    policy: pull
  script:
    - npm run e2e

build:
  image: node:20-alpine
  tags: [docker]
  cache:
    key:
      files: [package-lock.json]
    paths: [node_modules/]
    policy: pull
  script:
    - npm run build`

const GOOD_CONFIG = `.node-job:         # базовый шаблон
  image: node:20-alpine
  tags: [docker]
  cache:
    key:
      files: [package-lock.json]
    paths: [node_modules/]
    policy: pull

lint:
  extends: .node-job
  script:
    - npm run lint

test:unit:
  extends: .node-job
  script:
    - npm test

test:e2e:
  extends: .node-job
  script:
    - npm run e2e

build:
  extends: .node-job
  script:
    - npm run build`

const FILE_CONFIGS: Record<string, string> = {
  'main.yml': `# .gitlab-ci.yml — только структура
include:
  - local: '.gitlab/ci/test.yml'
  - local: '.gitlab/ci/build.yml'
  - local: '.gitlab/ci/deploy.yml'
  - local: '.gitlab/ci/templates.yml'

stages:
  - prepare
  - test
  - build
  - deploy

variables:
  NODE_VERSION: '20'
  DOCKER_REGISTRY: registry.gitlab.com/org/app`,
  'test.yml': `# .gitlab/ci/test.yml
lint:
  extends: .node-job
  stage: test
  needs: [install]
  script:
    - npm run lint

test:unit:
  extends: .node-job
  stage: test
  needs: [install]
  script:
    - npm test -- --coverage

test:e2e:
  extends: .node-job
  stage: test
  needs: [install]
  script:
    - npm run e2e`,
  'build.yml': `# .gitlab/ci/build.yml
build:
  extends: .node-job
  stage: build
  needs: [lint, test:unit, test:e2e]
  script:
    - npm run build
  artifacts:
    paths: [dist/]
    expire_in: 1 week`,
}

const DOC_WITHOUT = `deploy:production:
  image: bitnami/kubectl:latest
  script:
    - kubectl set image deployment/app
        app=$DOCKER_REGISTRY:$CI_COMMIT_SHORT_SHA
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+$/
  environment:
    name: production
    url: https://myapp.com
  when: manual`

const DOC_WITH = `deploy:production:
  image: bitnami/kubectl:latest
  # Деплоит в production только теги вида v1.2.3.
  # Запуск ручной (when: manual) — нужно нажать кнопку в UI.
  # Образ берём из registry по хэшу коммита — не 'latest'.
  # После деплоя GitLab обновляет environment.url в UI.
  script:
    - kubectl set image deployment/app
        app=$DOCKER_REGISTRY:$CI_COMMIT_SHORT_SHA
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+$/
  environment:
    name: production
    url: https://myapp.com
  when: manual`

const DUPLICATE_HINT = 'Дублирование: этот блок есть в 4 джобах'

export function Task17_2_Solution() {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [activeTab, setActiveTab] = useState('main.yml')
  const [docMode, setDocMode] = useState<'without' | 'with'>('without')
  const [hovered, setHovered] = useState<string | null>(null)

  const badLines = BAD_CONFIG.split('\n').length
  const goodLines = GOOD_CONFIG.split('\n').length
  const saving = Math.round((1 - goodLines / badLines) * 100)

  const DUPLICATE_BLOCKS = ['image: node:20-alpine', 'tags: [docker]', 'cache:']

  function renderBadConfig() {
    return BAD_CONFIG.split('\n').map((line, i) => {
      const trimmed = line.trim()
      const isDuplicate = DUPLICATE_BLOCKS.some(b => trimmed.startsWith(b.split(':')[0]))
      return (
        <div
          key={i}
          title={isDuplicate ? DUPLICATE_HINT : undefined}
          style={{
            background: isDuplicate && hovered === String(i)
              ? 'rgba(198,40,40,0.18)'
              : isDuplicate ? 'rgba(198,40,40,0.08)' : 'transparent',
            cursor: isDuplicate ? 'help' : 'default',
            borderLeft: isDuplicate ? '3px solid #E57373' : '3px solid transparent',
            paddingLeft: '4px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={() => isDuplicate && setHovered(String(i))}
          onMouseLeave={() => setHovered(null)}
        >
          {line || ' '}
        </div>
      )
    })
  }

  const btnStyle = (active: boolean) => ({
    padding: '6px 14px',
    borderRadius: '6px',
    border: `1.5px solid ${active ? '#1565C0' : '#ddd'}`,
    background: active ? '#E3F2FD' : '#fff',
    color: active ? '#1565C0' : '#555',
    cursor: 'pointer',
    fontWeight: active ? 700 : 400,
    fontSize: '12px',
  })

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Pipeline as Code: DRY и структура</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Наведи на красные строки, чтобы увидеть дублирование. Нажимай кнопки для рефакторинга.
      </p>

      {/* Step buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button style={btnStyle(step === 0)} onClick={() => setStep(0)}>1. Исходный конфиг</button>
        <button style={btnStyle(step === 1)} onClick={() => setStep(1)}>2. Применить extends</button>
        <button style={btnStyle(step === 2)} onClick={() => setStep(2)}>3. Разбить на файлы</button>
      </div>

      {step === 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', color: '#C62828', fontWeight: 600 }}>
              Дублирование: наведи на красные строки
            </span>
            <span style={{ fontSize: '12px', color: '#888' }}>{badLines} строк</span>
          </div>
          <pre style={{
            background: '#1e1e2e', color: '#cdd6f4',
            padding: '14px', borderRadius: '8px', fontSize: '12px',
            lineHeight: 1.6, margin: 0, overflowX: 'auto',
          }}>
            {renderBadConfig()}
          </pre>
          <div style={{ marginTop: '12px', padding: '10px 14px', background: '#FFF3E0', borderRadius: '8px', fontSize: '13px', color: '#E65100' }}>
            Блоки image, tags и cache повторяются в каждом из 4 джобов. При обновлении Node.js придётся менять в 4 местах.
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', color: '#2E7D32', fontWeight: 600 }}>
              После рефакторинга через extends
            </span>
            <span style={{ fontSize: '12px', color: '#888' }}>
              {goodLines} строк (было {badLines}) — -{saving}%
            </span>
          </div>
          <pre style={{
            background: '#1e1e2e', color: '#cdd6f4',
            padding: '14px', borderRadius: '8px', fontSize: '12px',
            lineHeight: 1.6, margin: 0, overflowX: 'auto',
          }}>
            {GOOD_CONFIG}
          </pre>
          <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E8F5E9', borderRadius: '8px', fontSize: '13px', color: '#2E7D32' }}>
            Один шаблон <code>.node-job</code>. Изменить image — одна правка. Добавить новый джоб — 3 строки.
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>
            Структура по файлам через include
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {Object.keys(FILE_CONFIGS).map(tab => (
              <button key={tab} style={btnStyle(activeTab === tab)} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <pre style={{
            background: '#1e1e2e', color: '#cdd6f4',
            padding: '14px', borderRadius: '8px', fontSize: '12px',
            lineHeight: 1.6, margin: 0, overflowX: 'auto',
          }}>
            {FILE_CONFIGS[activeTab]}
          </pre>
          <div style={{ marginTop: '12px', padding: '10px 14px', background: '#E3F2FD', borderRadius: '8px', fontSize: '13px', color: '#1565C0' }}>
            Главный файл содержит только структуру. Каждый файл — одна ответственность. Команды работают параллельно без конфликтов.
          </div>
        </div>
      )}

      {/* Documentation section */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '8px' }}>
          Документирование пайплайна
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button style={btnStyle(docMode === 'without')} onClick={() => setDocMode('without')}>Без комментариев</button>
          <button style={btnStyle(docMode === 'with')} onClick={() => setDocMode('with')}>С комментариями</button>
        </div>
        <pre style={{
          background: '#1e1e2e', color: '#cdd6f4',
          padding: '14px', borderRadius: '8px', fontSize: '12px',
          lineHeight: 1.6, margin: 0, overflowX: 'auto',
        }}>
          {docMode === 'without' ? DOC_WITHOUT : DOC_WITH}
        </pre>
        {docMode === 'with' && (
          <div style={{ marginTop: '8px', padding: '10px 14px', background: '#E8F5E9', borderRadius: '8px', fontSize: '13px', color: '#2E7D32' }}>
            Комментарии объясняют «почему», а не «что». Новый разработчик понимает логику без погружения в документацию.
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Task 17.3: DORA Metrics Dashboard
// ============================================

type DoraLevel = 'elite' | 'high' | 'medium' | 'low'

interface DoraMetric {
  id: string
  label: string
  unit: string
  options: { label: string; level: DoraLevel }[]
  recommendations: Partial<Record<DoraLevel, string>>
}

const DORA_METRICS: DoraMetric[] = [
  {
    id: 'deploy_freq',
    label: 'Deployment Frequency',
    unit: 'частота',
    options: [
      { label: 'Несколько раз в день', level: 'elite' },
      { label: 'Раз в день', level: 'high' },
      { label: 'Раз в неделю', level: 'medium' },
      { label: 'Раз в месяц', level: 'low' },
    ],
    recommendations: {
      medium: 'Внедри trunk-based development — коммиты в main каждый день, feature flags для незавершённого кода.',
      low: 'Критически: деплой раз в месяц — слишком большие батчи изменений. Начни с автоматизации деплоя на staging.',
    },
  },
  {
    id: 'lead_time',
    label: 'Lead Time for Changes',
    unit: 'коммит → прод',
    options: [
      { label: 'Меньше 1 часа', level: 'elite' },
      { label: 'Меньше 1 дня', level: 'high' },
      { label: '1–7 дней', level: 'medium' },
      { label: 'Больше недели', level: 'low' },
    ],
    recommendations: {
      medium: 'Проверь: где теряется время? MR ждут ревью? Пайплайн медленный? Оптимизируй самый долгий этап.',
      low: 'Больше недели — критично. Скорее всего: долгоживущие ветки + медленный ревью + медленный пайплайн.',
    },
  },
  {
    id: 'cfr',
    label: 'Change Failure Rate',
    unit: 'деплоев с инцидентами',
    options: [
      { label: 'Меньше 5%', level: 'elite' },
      { label: 'Меньше 10%', level: 'high' },
      { label: '15–45%', level: 'medium' },
      { label: 'Больше 45%', level: 'low' },
    ],
    recommendations: {
      medium: 'Каждый третий деплой вызывает проблемы. Добавь интеграционные тесты и staging с production-like данными.',
      low: 'Критично: деплоить страшно. Внедри канареечные деплои, автоматический rollback и smoke-тесты после деплоя.',
    },
  },
  {
    id: 'ttr',
    label: 'Time to Restore',
    unit: 'восстановление',
    options: [
      { label: 'Меньше 1 часа', level: 'elite' },
      { label: 'Меньше 1 дня', level: 'high' },
      { label: 'Меньше недели', level: 'medium' },
      { label: 'Больше недели', level: 'low' },
    ],
    recommendations: {
      medium: 'Настрой автоматический rollback в пайплайне. Инцидент не должен требовать ручных действий для отката.',
      low: 'Больше недели на восстановление — нет runbook, нет мониторинга, нет rollback. Это системная проблема.',
    },
  },
]

const LEVEL_CONFIG: Record<DoraLevel, { label: string; color: string; bg: string; border: string }> = {
  elite: { label: 'Elite', color: '#1B5E20', bg: '#E8F5E9', border: '#81C784' },
  high: { label: 'High', color: '#1565C0', bg: '#E3F2FD', border: '#90CAF9' },
  medium: { label: 'Medium', color: '#E65100', bg: '#FFF3E0', border: '#FFCC80' },
  low: { label: 'Low', color: '#B71C1C', bg: '#FFEBEE', border: '#E57373' },
}

const LEVEL_ORDER: DoraLevel[] = ['elite', 'high', 'medium', 'low']

function worstLevel(levels: DoraLevel[]): DoraLevel {
  return levels.reduce((worst, l) =>
    LEVEL_ORDER.indexOf(l) > LEVEL_ORDER.indexOf(worst) ? l : worst
  )
}

export function Task17_3_Solution() {
  const [values, setValues] = useState<Record<string, number>>({
    deploy_freq: 1,
    lead_time: 1,
    cfr: 1,
    ttr: 1,
  })
  const [deployHistory, setDeployHistory] = useState<boolean[]>([true, true, true, false, true])
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)

  function setValue(id: string, idx: number) {
    setValues(v => ({ ...v, [id]: idx }))
  }

  function simulateDeploy() {
    const success = Math.random() > 0.3
    setDeployHistory(h => [...h.slice(-9), success])
  }

  const allLevels = DORA_METRICS.map(m => m.options[values[m.id]].level)
  const teamLevel = worstLevel(allLevels)
  const teamCfg = LEVEL_CONFIG[teamLevel]

  const historyCFR = deployHistory.length > 0
    ? Math.round((deployHistory.filter(v => !v).length / deployHistory.length) * 100)
    : 0

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>DORA Metrics Dashboard</h2>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '1.5rem' }}>
        Выбери значения метрик и узнай уровень зрелости DevOps-процессов команды
      </p>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '14px', marginBottom: '1.5rem' }}>
        {DORA_METRICS.map(metric => {
          const selectedIdx = values[metric.id]
          const selectedOpt = metric.options[selectedIdx]
          const level = selectedOpt.level
          const cfg = LEVEL_CONFIG[level]
          const recommendation = metric.recommendations[level]
          const isExpanded = expandedMetric === metric.id

          return (
            <div key={metric.id} style={{
              border: `2px solid ${cfg.border}`,
              borderRadius: '10px',
              background: cfg.bg,
              padding: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#333' }}>{metric.label}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{metric.unit}</div>
                </div>
                <div style={{
                  padding: '3px 10px', borderRadius: '20px',
                  background: cfg.color, color: '#fff',
                  fontSize: '12px', fontWeight: 700,
                }}>
                  {cfg.label}
                </div>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {metric.options.map((opt, idx) => {
                  const optCfg = LEVEL_CONFIG[opt.level]
                  const isSelected = idx === selectedIdx
                  return (
                    <button
                      key={idx}
                      onClick={() => setValue(metric.id, idx)}
                      style={{
                        textAlign: 'left',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: `1.5px solid ${isSelected ? optCfg.color : '#ddd'}`,
                        background: isSelected ? optCfg.bg : '#fff',
                        color: isSelected ? optCfg.color : '#555',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: isSelected ? 700 : 400,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>{opt.label}</span>
                      <span style={{ fontSize: '11px', opacity: 0.7 }}>{optCfg.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Recommendation */}
              {recommendation && (
                <div
                  onClick={() => setExpandedMetric(isExpanded ? null : metric.id)}
                  style={{
                    marginTop: '10px', cursor: 'pointer',
                    padding: '8px 10px', borderRadius: '6px',
                    background: 'rgba(0,0,0,0.05)',
                    fontSize: '12px', color: cfg.color,
                  }}
                >
                  {isExpanded ? recommendation : 'Рекомендация — нажми, чтобы развернуть'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Team level summary */}
      <div style={{
        padding: '16px 20px', borderRadius: '12px',
        border: `2px solid ${teamCfg.border}`,
        background: teamCfg.bg,
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
          Итоговый уровень команды (определяется по наихудшей метрике)
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: teamCfg.color }}>
          {teamCfg.label}
        </div>
        {teamLevel !== 'elite' && (
          <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
            Слабое место: {DORA_METRICS.find(m => m.options[values[m.id]].level === teamLevel)?.label}
          </div>
        )}
        {teamLevel === 'elite' && (
          <div style={{ fontSize: '13px', color: teamCfg.color, marginTop: '4px' }}>
            Все метрики на уровне Elite — отличный результат!
          </div>
        )}
      </div>

      {/* Deploy history */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#333' }}>История деплоев</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#666' }}>
              CFR: <strong style={{ color: historyCFR > 10 ? '#C62828' : '#2E7D32' }}>{historyCFR}%</strong>
            </span>
            <button
              onClick={simulateDeploy}
              style={{
                padding: '6px 14px', borderRadius: '6px',
                border: '1.5px solid #1565C0', background: '#E3F2FD',
                color: '#1565C0', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              }}
            >
              Симуляция деплоя
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {deployHistory.map((success, i) => (
            <div
              key={i}
              title={success ? 'Успешный деплой' : 'Провальный деплой'}
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: success ? '#E8F5E9' : '#FFEBEE',
                border: `2px solid ${success ? '#81C784' : '#E57373'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px',
              }}
            >
              {success ? '✓' : '✗'}
            </div>
          ))}
        </div>
        {historyCFR > 10 && (
          <div style={{ marginTop: '10px', padding: '10px 14px', background: '#FFEBEE', borderRadius: '8px', fontSize: '13px', color: '#C62828' }}>
            CFR выше 10% — рекомендуется: усилить тестирование, внедрить канареечные деплои и автоматический rollback.
          </div>
        )}
      </div>
    </div>
  )
}
