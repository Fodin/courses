// ============================================
// Level 1: First .gitlab-ci.yml — Solutions
// ============================================

import { useState, useEffect, useRef } from 'react'

// ============================================
// Task 1.1: .gitlab-ci.yml Structure Builder
// ============================================

interface YamlBlock {
  id: string
  label: string
  content: string
  required: boolean
  description: string
  color: string
}

const availableBlocks: YamlBlock[] = [
  {
    id: 'stages',
    label: 'stages',
    content: 'stages:\n  - build\n  - test\n  - deploy',
    required: false,
    description: 'Объявляет стадии и их порядок выполнения',
    color: '#1565C0',
  },
  {
    id: 'image',
    label: 'image (глобально)',
    content: 'image: node:20-alpine',
    required: false,
    description: 'Docker-образ по умолчанию для всех job\'ов',
    color: '#6A1B9A',
  },
  {
    id: 'job-name',
    label: 'имя job\'а',
    content: 'build-app:',
    required: true,
    description: 'Уникальное имя job\'а — любая строка без пробелов',
    color: '#E65100',
  },
  {
    id: 'stage',
    label: 'stage',
    content: '  stage: build',
    required: false,
    description: 'Указывает, к какой стадии принадлежит job',
    color: '#2E7D32',
  },
  {
    id: 'script',
    label: 'script',
    content: '  script:\n    - npm ci\n    - npm run build',
    required: true,
    description: 'Список команд, которые выполнит job (обязательно!)',
    color: '#C62828',
  },
  {
    id: 'after_script',
    label: 'after_script',
    content: '  after_script:\n    - echo "Job завершён"',
    required: false,
    description: 'Выполняется всегда после script — даже при ошибке',
    color: '#00838F',
  },
]

interface ValidationError {
  message: string
}

function validateConfig(selectedIds: string[]): ValidationError[] {
  const errors: ValidationError[] = []
  if (!selectedIds.includes('job-name')) {
    errors.push({ message: 'Отсутствует имя job\'а — каждый job должен иметь уникальное имя' })
  }
  if (!selectedIds.includes('script')) {
    errors.push({ message: 'Отсутствует ключевое слово script — оно обязательно для каждого job\'а' })
  }
  if (selectedIds.includes('stage') && !selectedIds.includes('stages')) {
    errors.push({ message: 'Указан stage, но секция stages не объявлена — GitLab выдаст ошибку' })
  }
  return errors
}

function buildYamlPreview(selectedIds: string[]): string {
  const blocks = availableBlocks.filter(b => selectedIds.includes(b.id))
  if (blocks.length === 0) return '# Добавь блоки для создания конфига'
  return blocks.map(b => b.content).join('\n\n')
}

export function Task1_1_Solution() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [validationResult, setValidationResult] = useState<{ checked: boolean; errors: ValidationError[] }>({
    checked: false,
    errors: [],
  })

  const toggleBlock = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
    setValidationResult({ checked: false, errors: [] })
  }

  const handleCheck = () => {
    const errors = validateConfig(selectedIds)
    setValidationResult({ checked: true, errors })
  }

  const handleReset = () => {
    setSelectedIds([])
    setValidationResult({ checked: false, errors: [] })
  }

  const yamlPreview = buildYamlPreview(selectedIds)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem', color: '#1a1a1a' }}>Структура .gitlab-ci.yml</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Собери валидный конфиг из блоков. Кликни на блок, чтобы добавить или убрать его.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Left: available blocks */}
        <div style={{ flex: '0 0 280px' }}>
          <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Доступные блоки
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {availableBlocks.map(block => {
              const isSelected = selectedIds.includes(block.id)
              return (
                <button
                  key={block.id}
                  onClick={() => toggleBlock(block.id)}
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem',
                    border: `2px solid ${isSelected ? block.color : '#e0e0e0'}`,
                    borderRadius: '8px',
                    background: isSelected ? block.color + '15' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <code style={{ fontWeight: 700, color: block.color, fontSize: '0.85rem' }}>
                      {block.label}
                    </code>
                    {block.required && (
                      <span style={{ fontSize: '0.65rem', background: '#FFEBEE', color: '#C62828', borderRadius: '4px', padding: '1px 5px' }}>
                        обязательно
                      </span>
                    )}
                    {isSelected && (
                      <span style={{ marginLeft: 'auto', color: block.color, fontSize: '0.8rem' }}>✓ добавлен</span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#666', lineHeight: 1.3 }}>
                    {block.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: yaml preview + validation */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Твой конфиг
          </h3>
          <pre style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            minHeight: '200px',
            overflowX: 'auto',
            margin: '0 0 1rem 0',
            fontFamily: "'Fira Code', 'Courier New', monospace",
          }}>
            {yamlPreview}
          </pre>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <button
              onClick={handleCheck}
              style={{
                padding: '0.6rem 1.25rem',
                background: '#1565C0',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              Проверить конфиг
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '0.6rem 1.25rem',
                background: '#fff',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Сбросить
            </button>
          </div>

          {validationResult.checked && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: validationResult.errors.length === 0 ? '#E8F5E9' : '#FFEBEE',
              border: `1px solid ${validationResult.errors.length === 0 ? '#A5D6A7' : '#EF9A9A'}`,
            }}>
              {validationResult.errors.length === 0 ? (
                <div style={{ color: '#2E7D32', fontWeight: 600 }}>
                  ✅ Конфиг валиден! GitLab сможет запустить этот пайплайн.
                </div>
              ) : (
                <>
                  <div style={{ color: '#C62828', fontWeight: 600, marginBottom: '0.5rem' }}>
                    ❌ Найдены ошибки:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {validationResult.errors.map((err, i) => (
                      <li key={i} style={{ color: '#C62828', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        {err.message}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 1.2: Stages and Execution Order
// ============================================

type JobStatus = 'pending' | 'running' | 'success' | 'failed'

interface PipelineJob {
  id: string
  name: string
  stage: string
  status: JobStatus
  duration: number
}

interface PipelineStage {
  name: string
  jobs: PipelineJob[]
}

const initialStages: PipelineStage[] = [
  {
    name: 'build',
    jobs: [
      { id: 'b1', name: 'compile-backend', stage: 'build', status: 'pending', duration: 1200 },
      { id: 'b2', name: 'compile-frontend', stage: 'build', status: 'pending', duration: 900 },
    ],
  },
  {
    name: 'test',
    jobs: [
      { id: 't1', name: 'unit-tests', stage: 'test', status: 'pending', duration: 1500 },
      { id: 't2', name: 'lint', stage: 'test', status: 'pending', duration: 600 },
      { id: 't3', name: 'security-scan', stage: 'test', status: 'pending', duration: 800 },
    ],
  },
  {
    name: 'deploy',
    jobs: [
      { id: 'd1', name: 'deploy-staging', stage: 'deploy', status: 'pending', duration: 1000 },
    ],
  },
]

const statusColors: Record<JobStatus, { bg: string; text: string; border: string }> = {
  pending: { bg: '#F5F5F5', text: '#757575', border: '#E0E0E0' },
  running: { bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' },
  success: { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  failed: { bg: '#FFEBEE', text: '#C62828', border: '#EF9A9A' },
}

const statusIcon: Record<JobStatus, string> = {
  pending: '○',
  running: '◉',
  success: '✓',
  failed: '✗',
}

export function Task1_2_Solution() {
  const [stages, setStages] = useState<PipelineStage[]>(
    initialStages.map(s => ({ ...s, jobs: s.jobs.map(j => ({ ...j })) }))
  )
  const [running, setRunning] = useState(false)
  const [newJobName, setNewJobName] = useState('')
  const [newJobStage, setNewJobStage] = useState('build')
  const runningRef = useRef(false)

  const resetPipeline = () => {
    setStages(initialStages.map(s => ({ ...s, jobs: s.jobs.map(j => ({ ...j, status: 'pending' as JobStatus })) })))
    setRunning(false)
    runningRef.current = false
  }

  const runPipeline = async () => {
    if (running) return
    resetPipeline()
    await new Promise(r => setTimeout(r, 100))
    setRunning(true)
    runningRef.current = true

    for (let si = 0; si < stages.length; si++) {
      if (!runningRef.current) break
      const stage = stages[si]

      // Set all jobs in stage to running
      setStages(prev => prev.map((s, idx) =>
        idx === si
          ? { ...s, jobs: s.jobs.map(j => ({ ...j, status: 'running' as JobStatus })) }
          : s
      ))

      // Wait for max duration
      const maxDuration = Math.max(...stage.jobs.map(j => j.duration))
      await new Promise(r => setTimeout(r, maxDuration))

      if (!runningRef.current) break

      // Determine outcome: random ~20% chance of failure for demo
      const hasFailed = Math.random() < 0.2
      setStages(prev => prev.map((s, idx) =>
        idx === si
          ? {
              ...s,
              jobs: s.jobs.map((j, ji) => ({
                ...j,
                status: hasFailed && ji === 0 ? 'failed' : 'success' as JobStatus,
              })),
            }
          : s
      ))

      if (hasFailed) break
    }

    setRunning(false)
    runningRef.current = false
  }

  const addJob = () => {
    if (!newJobName.trim()) return
    const newJob: PipelineJob = {
      id: `custom-${Date.now()}`,
      name: newJobName.trim(),
      stage: newJobStage,
      status: 'pending',
      duration: 800,
    }
    setStages(prev => prev.map(s =>
      s.name === newJobStage
        ? { ...s, jobs: [...s.jobs, newJob] }
        : s
    ))
    setNewJobName('')
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem', color: '#1a1a1a' }}>Stages и порядок выполнения</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Job'ы внутри стадии выполняются параллельно. Стадии — последовательно.
      </p>

      {/* Pipeline visualization */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {stages.map((stage, si) => {
          const stageStatus: JobStatus = stage.jobs.some(j => j.status === 'failed')
            ? 'failed'
            : stage.jobs.every(j => j.status === 'success')
            ? 'success'
            : stage.jobs.some(j => j.status === 'running')
            ? 'running'
            : 'pending'
          const sc = statusColors[stageStatus]

          return (
            <div key={stage.name} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '190px' }}>
                {/* Stage header */}
                <div style={{
                  padding: '0.4rem 0.75rem',
                  background: sc.bg,
                  border: `1px solid ${sc.border}`,
                  borderRadius: '6px 6px 0 0',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: sc.text,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {statusIcon[stageStatus]} {stage.name}
                </div>
                {/* Jobs */}
                <div style={{
                  border: `1px solid ${sc.border}`,
                  borderTop: 'none',
                  borderRadius: '0 0 6px 6px',
                  overflow: 'hidden',
                }}>
                  {stage.jobs.map((job, ji) => {
                    const jc = statusColors[job.status]
                    return (
                      <div
                        key={job.id}
                        style={{
                          padding: '0.5rem 0.75rem',
                          background: jc.bg,
                          borderTop: ji > 0 ? `1px solid ${jc.border}` : undefined,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.8rem',
                          color: jc.text,
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>{statusIcon[job.status]}</span>
                        <span>{job.name}</span>
                        {job.status === 'running' && (
                          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', opacity: 0.7 }}>
                            {(job.duration / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Arrow between stages */}
              {si < stages.length - 1 && (
                <div style={{
                  alignSelf: 'center',
                  padding: '0 0.5rem',
                  color: '#BDBDBD',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                }}>
                  →
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Parallel explanation */}
      <div style={{
        padding: '0.75rem 1rem',
        background: '#FFF8E1',
        border: '1px solid #FFE082',
        borderRadius: '8px',
        fontSize: '0.82rem',
        color: '#5D4037',
        marginBottom: '1.5rem',
      }}>
        💡 Job'ы внутри одной стадии запускаются <strong>параллельно</strong>. Следующая стадия
        стартует только когда <strong>все</strong> job'ы текущей стадии завершились успешно.
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={runPipeline}
          disabled={running}
          style={{
            padding: '0.6rem 1.25rem',
            background: running ? '#e0e0e0' : '#2E7D32',
            color: running ? '#999' : '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: running ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          {running ? '⏳ Выполняется...' : '▶ Запустить пайплайн'}
        </button>
        <button
          onClick={resetPipeline}
          style={{
            padding: '0.6rem 1.25rem',
            background: '#fff',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Сбросить
        </button>
      </div>

      {/* Add job form */}
      <div style={{
        padding: '1rem',
        background: '#F5F5F5',
        borderRadius: '8px',
        border: '1px solid #E0E0E0',
      }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: '#333' }}>
          Добавить job в пайплайн
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
              Имя job'а
            </label>
            <input
              value={newJobName}
              onChange={e => setNewJobName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addJob()}
              placeholder='my-custom-job'
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                width: '180px',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
              Стадия
            </label>
            <select
              value={newJobStage}
              onChange={e => setNewJobStage(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.85rem',
                background: '#fff',
              }}
            >
              {stages.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={addJob}
            style={{
              padding: '0.5rem 1rem',
              background: '#1565C0',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            + Добавить
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 1.3: script / before_script / after_script
// ============================================

type ScriptSection = 'before_script' | 'script' | 'after_script'
type ScenarioId = 'success' | 'script-fail' | 'before-fail'

interface ScriptLine {
  command: string
  output: string
  exitCode: number
  section: ScriptSection
}

interface Scenario {
  id: ScenarioId
  label: string
  lines: ScriptLine[]
}

const scenarios: Scenario[] = [
  {
    id: 'success',
    label: 'Успешное выполнение',
    lines: [
      { command: 'node --version', output: 'v20.11.0', exitCode: 0, section: 'before_script' },
      { command: 'npm ci', output: 'added 847 packages in 12s', exitCode: 0, section: 'before_script' },
      { command: 'npm run lint', output: '✔ No lint errors found', exitCode: 0, section: 'script' },
      { command: 'npm test', output: 'Test Suites: 5 passed, 5 total\nTests: 42 passed, 42 total', exitCode: 0, section: 'script' },
      { command: 'echo "Tests passed: $CI_JOB_STATUS"', output: 'Tests passed: success', exitCode: 0, section: 'after_script' },
    ],
  },
  {
    id: 'script-fail',
    label: 'Ошибка в script',
    lines: [
      { command: 'node --version', output: 'v20.11.0', exitCode: 0, section: 'before_script' },
      { command: 'npm ci', output: 'added 847 packages in 12s', exitCode: 0, section: 'before_script' },
      { command: 'npm run lint', output: 'error  Missing semicolon  src/index.ts:42\n✖ 1 problem found', exitCode: 1, section: 'script' },
      { command: 'npm test', output: '(пропущено — предыдущая команда упала)', exitCode: -1, section: 'script' },
      { command: 'echo "Отправка уведомления (job failed)"', output: 'Отправка уведомления (job failed)', exitCode: 0, section: 'after_script' },
    ],
  },
  {
    id: 'before-fail',
    label: 'Ошибка в before_script',
    lines: [
      { command: 'node --version', output: 'v20.11.0', exitCode: 0, section: 'before_script' },
      { command: 'npm ci', output: 'npm ERR! Cannot read properties of undefined\nnpm ERR! A complete log of this run can be found in /root/.npm/_logs/', exitCode: 1, section: 'before_script' },
      { command: 'npm run lint', output: '(пропущено — before_script упал)', exitCode: -1, section: 'script' },
      { command: 'npm test', output: '(пропущено — before_script упал)', exitCode: -1, section: 'script' },
    ],
  },
]

const sectionColors: Record<ScriptSection, { bg: string; label: string; color: string }> = {
  before_script: { bg: '#1A237E', label: '▸ before_script', color: '#82B1FF' },
  script: { bg: '#1B5E20', label: '▸ script', color: '#A5D6A7' },
  after_script: { bg: '#4A148C', label: '▸ after_script', color: '#CE93D8' },
}

interface ConsoleEntry {
  type: 'section-header' | 'command' | 'output' | 'skipped'
  text: string
  section: ScriptSection
  exitCode?: number
}

export function Task1_3_Solution() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>('success')
  const [consoleLines, setConsoleLines] = useState<ConsoleEntry[]>([])
  const [jobResult, setJobResult] = useState<'success' | 'failed' | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const consoleRef = useRef<HTMLDivElement>(null)

  const runScenario = async () => {
    if (isRunning) return
    setConsoleLines([])
    setJobResult(null)
    setIsRunning(true)

    const scenario = scenarios.find(s => s.id === selectedScenario)!
    const entries: ConsoleEntry[] = []
    let currentSection: ScriptSection | null = null
    let jobFailed = false
    let beforeScriptFailed = false

    const addEntry = (entry: ConsoleEntry) => {
      entries.push(entry)
      setConsoleLines([...entries])
    }

    for (const line of scenario.lines) {
      // Add section header when section changes
      if (line.section !== currentSection) {
        currentSection = line.section
        addEntry({ type: 'section-header', text: sectionColors[line.section].label, section: line.section })
        await new Promise(r => setTimeout(r, 200))
      }

      // Skip logic
      if (line.exitCode === -1) {
        addEntry({ type: 'skipped', text: line.command, section: line.section })
        await new Promise(r => setTimeout(r, 300))
        continue
      }

      // Skip script if before_script failed
      if (beforeScriptFailed && line.section === 'script') {
        addEntry({ type: 'skipped', text: line.command, section: line.section })
        await new Promise(r => setTimeout(r, 200))
        continue
      }

      // Skip remaining script commands after failure
      if (jobFailed && line.section === 'script') {
        addEntry({ type: 'skipped', text: line.command, section: line.section })
        await new Promise(r => setTimeout(r, 200))
        continue
      }

      // Show command
      addEntry({ type: 'command', text: line.command, section: line.section, exitCode: line.exitCode })
      await new Promise(r => setTimeout(r, 400))

      // Show output
      if (line.output) {
        addEntry({ type: 'output', text: line.output, section: line.section, exitCode: line.exitCode })
        await new Promise(r => setTimeout(r, 400))
      }

      if (line.exitCode !== 0) {
        if (line.section === 'before_script') {
          beforeScriptFailed = true
          jobFailed = true
          break
        } else if (line.section === 'script') {
          jobFailed = true
        }
      }
    }

    setJobResult(jobFailed ? 'failed' : 'success')
    setIsRunning(false)
  }

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [consoleLines])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: '760px' }}>
      <h2 style={{ marginBottom: '0.25rem', color: '#1a1a1a' }}>Ключевое слово script</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Симуляция выполнения CI job'а. Выбери сценарий и наблюдай за поведением секций.
      </p>

      {/* Scenario selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedScenario(s.id)
              setConsoleLines([])
              setJobResult(null)
            }}
            style={{
              padding: '0.5rem 1rem',
              border: `2px solid ${selectedScenario === s.id ? '#1565C0' : '#e0e0e0'}`,
              background: selectedScenario === s.id ? '#E3F2FD' : '#fff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              color: selectedScenario === s.id ? '#1565C0' : '#555',
              fontWeight: selectedScenario === s.id ? 700 : 400,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Info panels */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['before_script', 'script', 'after_script'] as ScriptSection[]).map(sec => (
          <div
            key={sec}
            style={{
              padding: '0.4rem 0.75rem',
              background: sectionColors[sec].bg + '33',
              border: `1px solid ${sectionColors[sec].bg}`,
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#333',
            }}
          >
            <code style={{ fontWeight: 700 }}>{sec}</code>
          </div>
        ))}
      </div>

      <button
        onClick={runScenario}
        disabled={isRunning}
        style={{
          padding: '0.6rem 1.25rem',
          background: isRunning ? '#e0e0e0' : '#2E7D32',
          color: isRunning ? '#999' : '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          fontSize: '0.85rem',
          marginBottom: '1rem',
        }}
      >
        {isRunning ? '⏳ Выполняется...' : '▶ Запустить job'}
      </button>

      {/* Console output */}
      <div
        ref={consoleRef}
        style={{
          background: '#1e1e1e',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '280px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontFamily: "'Fira Code', 'Courier New', monospace",
          fontSize: '0.8rem',
          lineHeight: 1.7,
        }}
      >
        {consoleLines.length === 0 ? (
          <span style={{ color: '#555' }}>// Нажми "Запустить job" для начала симуляции</span>
        ) : (
          consoleLines.map((entry, i) => {
            if (entry.type === 'section-header') {
              return (
                <div key={i} style={{
                  color: sectionColors[entry.section].color,
                  fontWeight: 700,
                  marginTop: i > 0 ? '0.75rem' : 0,
                  borderBottom: `1px solid ${sectionColors[entry.section].color}33`,
                  paddingBottom: '0.25rem',
                  marginBottom: '0.25rem',
                }}>
                  {entry.text}
                </div>
              )
            }
            if (entry.type === 'skipped') {
              return (
                <div key={i} style={{ color: '#555', fontStyle: 'italic' }}>
                  $ {entry.text} <span style={{ color: '#444' }}>[skipped]</span>
                </div>
              )
            }
            if (entry.type === 'command') {
              const isError = entry.exitCode !== 0
              return (
                <div key={i} style={{ color: isError ? '#EF9A9A' : '#A5D6A7' }}>
                  <span style={{ color: isError ? '#EF9A9A' : '#69F0AE' }}>$</span> {entry.text}
                  {isError && <span style={{ color: '#EF9A9A', marginLeft: '0.5rem' }}>[exit code: {entry.exitCode}]</span>}
                </div>
              )
            }
            if (entry.type === 'output') {
              const isError = entry.exitCode !== 0
              return (
                <div key={i} style={{ color: isError ? '#FFAB91' : '#BDBDBD', paddingLeft: '1rem' }}>
                  {entry.text.split('\n').map((line, li) => (
                    <div key={li}>{line}</div>
                  ))}
                </div>
              )
            }
            return null
          })
        )}

        {/* Job result */}
        {jobResult && (
          <div style={{
            marginTop: '1rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
            background: jobResult === 'success' ? '#1B5E2066' : '#B71C1C66',
            color: jobResult === 'success' ? '#A5D6A7' : '#EF9A9A',
            fontWeight: 700,
            borderLeft: `3px solid ${jobResult === 'success' ? '#4CAF50' : '#F44336'}`,
          }}>
            {jobResult === 'success' ? '✓ Job succeeded' : '✗ Job failed'}
          </div>
        )}
      </div>

      {/* Key insight */}
      {jobResult === 'failed' && selectedScenario === 'script-fail' && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: '#F3E5F5',
          border: '1px solid #CE93D8',
          borderRadius: '8px',
          fontSize: '0.82rem',
          color: '#4A148C',
        }}>
          🔥 <strong>Ключевой момент:</strong> after_script выполнился, хотя script упал!
          Это позволяет всегда отправлять уведомления и очищать ресурсы.
        </div>
      )}
      {jobResult === 'failed' && selectedScenario === 'before-fail' && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: '#FFF3E0',
          border: '1px solid #FFB74D',
          borderRadius: '8px',
          fontSize: '0.82rem',
          color: '#E65100',
        }}>
          ⚠️ <strong>Важно:</strong> При ошибке в before_script ни script, ни after_script не
          выполняются. Job сразу завершается как failed.
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 1.4: Docker image selector
// ============================================

type ImageCategory = 'javascript' | 'python' | 'go' | 'ruby' | 'generic'

interface DockerImage {
  name: string
  category: ImageCategory
  sizeMb: number
  tools: string[]
  useCases: string[]
  pros: string[]
  cons: string[]
}

const dockerImages: DockerImage[] = [
  {
    name: 'node:20-alpine',
    category: 'javascript',
    sizeMb: 170,
    tools: ['Node.js 20', 'npm', 'npx', 'yarn (через npm)'],
    useCases: ['React/Vue/Angular сборка', 'TypeScript проекты', 'Node.js API-сервисы', 'npm-пакеты'],
    pros: ['Оптимальный размер для JS', 'Node.js предустановлен', 'Alpine = быстрое скачивание'],
    cons: ['Нет Python/Ruby', 'Alpine может требовать musl вместо glibc'],
  },
  {
    name: 'python:3.11-slim',
    category: 'python',
    sizeMb: 130,
    tools: ['Python 3.11', 'pip', 'venv'],
    useCases: ['Django/FastAPI проекты', 'ML-пайплайны', 'Скрипты автоматизации', 'pytest'],
    pros: ['Оптимальный размер для Python', 'pip предустановлен', 'slim = меньше лишних пакетов'],
    cons: ['Нет node/npm', 'Некоторые C-расширения требуют build-tools'],
  },
  {
    name: 'golang:1.21-alpine',
    category: 'go',
    sizeMb: 270,
    tools: ['Go 1.21', 'go build', 'go test', 'go mod'],
    useCases: ['Go микросервисы', 'CLI-утилиты на Go', 'Go-модули'],
    pros: ['Полный Go toolchain', 'Статическая компиляция', 'Alpine для лёгкости'],
    cons: ['Относительно большой размер (270 МБ)', 'Кэш модулей не сохраняется без настройки'],
  },
  {
    name: 'ruby:3.2-alpine',
    category: 'ruby',
    sizeMb: 80,
    tools: ['Ruby 3.2', 'gem', 'bundler', 'irb'],
    useCases: ['Ruby on Rails', 'Jekyll статические сайты', 'Ruby gems', 'Fastlane'],
    pros: ['Лёгкий Alpine-образ', 'Ruby предустановлен', 'Bundler доступен'],
    cons: ['Некоторые нативные gem требуют build-essential', 'Alpine может конфликтовать с некоторыми gem'],
  },
  {
    name: 'alpine:3.18',
    category: 'generic',
    sizeMb: 5,
    tools: ['sh/ash', 'wget', 'curl (через apk)', 'базовые Unix-утилиты'],
    useCases: ['Shell-скрипты', 'Простые CI-утилиты', 'Базовые проверки', 'Легковесные задачи'],
    pros: ['Минимальный размер (5 МБ!)', 'Мгновенное скачивание', 'Предсказуемая среда'],
    cons: ['Нет языкового рантайма', 'Многие инструменты нужно устанавливать через apk', 'musl libc'],
  },
  {
    name: 'ubuntu:22.04',
    category: 'generic',
    sizeMb: 70,
    tools: ['bash', 'apt', 'curl', 'wget', 'build-essential'],
    useCases: ['Сложные сборки с нативными зависимостями', 'Легаси проекты', 'Образы, требующие glibc'],
    pros: ['Полноценный Linux-дистрибутив', 'apt для установки всего', 'glibc-совместимость'],
    cons: ['Крупнее Alpine-образов', 'Много лишнего для большинства CI задач', 'Медленнее скачивается'],
  },
]

interface ProjectMatch {
  id: string
  label: string
  description: string
  correctImage: string
  explanation: string
}

const projectMatches: ProjectMatch[] = [
  {
    id: 'react',
    label: 'React-приложение',
    description: 'TypeScript + React, нужно собрать и запустить тесты Jest',
    correctImage: 'node:20-alpine',
    explanation: 'node:20-alpine содержит Node.js и npm — всё необходимое для React/TypeScript. Alpine-версия быстро скачивается.',
  },
  {
    id: 'python-script',
    label: 'Python Data Pipeline',
    description: 'Python-скрипт с pandas, pytest для тестов',
    correctImage: 'python:3.11-slim',
    explanation: 'python:3.11-slim содержит Python и pip. slim-версия меньше full, но больше Alpine (зато стабильнее с C-расширениями).',
  },
  {
    id: 'go-service',
    label: 'Go Микросервис',
    description: 'Go-приложение, нужно скомпилировать и запустить go test',
    correctImage: 'golang:1.21-alpine',
    explanation: 'golang:1.21-alpine содержит полный Go toolchain. Alpine делает его компактнее.',
  },
  {
    id: 'shell-check',
    label: 'Проверка конфигов',
    description: 'Bash-скрипт, который только проверяет YAML-файлы через yq',
    correctImage: 'alpine:3.18',
    explanation: 'alpine:3.18 весит всего 5 МБ. Для простых shell-скриптов не нужен полноценный рантайм — установи yq через apk.',
  },
]

function getSizeColor(sizeMb: number): string {
  if (sizeMb <= 100) return '#2E7D32'
  if (sizeMb <= 300) return '#E65100'
  return '#C62828'
}

function getSizeBg(sizeMb: number): string {
  if (sizeMb <= 100) return '#E8F5E9'
  if (sizeMb <= 300) return '#FFF3E0'
  return '#FFEBEE'
}

export function Task1_4_Solution() {
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)

  const setAnswer = (projectId: string, imageName: string) => {
    setAnswers(prev => ({ ...prev, [projectId]: imageName }))
    setChecked(false)
  }

  const allAnswered = projectMatches.every(p => answers[p.id])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.25rem', color: '#1a1a1a' }}>Ключевое слово image</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Каталог Docker-образов для CI. Выбери правильный образ для каждого проекта.
      </p>

      {/* Image catalog */}
      <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
        Каталог образов
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        {dockerImages.map(img => {
          const isExpanded = expandedImage === img.name
          return (
            <div
              key={img.name}
              onClick={() => setExpandedImage(isExpanded ? null : img.name)}
              style={{
                border: `1px solid ${isExpanded ? '#1565C0' : '#e0e0e0'}`,
                borderRadius: '8px',
                padding: '0.875rem',
                cursor: 'pointer',
                background: isExpanded ? '#F0F7FF' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <code style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a' }}>{img.name}</code>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '12px',
                  background: getSizeBg(img.sizeMb),
                  color: getSizeColor(img.sizeMb),
                  flexShrink: 0,
                  marginLeft: '0.5rem',
                }}>
                  {img.sizeMb} МБ
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '0.5rem' }}>
                {img.tools.slice(0, 3).map(tool => (
                  <span key={tool} style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    background: '#F5F5F5',
                    borderRadius: '4px',
                    color: '#555',
                  }}>
                    {tool}
                  </span>
                ))}
                {img.tools.length > 3 && (
                  <span style={{ fontSize: '0.7rem', color: '#888' }}>+{img.tools.length - 3}</span>
                )}
              </div>

              {isExpanded && (
                <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', marginBottom: '0.25rem' }}>ПРИМЕНЯЕТСЯ ДЛЯ</div>
                    {img.useCases.map(uc => (
                      <div key={uc} style={{ fontSize: '0.78rem', color: '#333', marginBottom: '0.15rem' }}>• {uc}</div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2E7D32', marginBottom: '0.25rem' }}>ПЛЮСЫ</div>
                      {img.pros.map(p => (
                        <div key={p} style={{ fontSize: '0.75rem', color: '#2E7D32', marginBottom: '0.15rem' }}>✓ {p}</div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C62828', marginBottom: '0.25rem' }}>МИНУСЫ</div>
                      {img.cons.map(c => (
                        <div key={c} style={{ fontSize: '0.75rem', color: '#C62828', marginBottom: '0.15rem' }}>✗ {c}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div style={{ fontSize: '0.72rem', color: '#AAA', marginTop: '0.25rem', textAlign: 'right' }}>
                {isExpanded ? '▲ свернуть' : '▼ подробнее'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Matching exercise */}
      <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
        Задание: выбери образ для проекта
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        {projectMatches.map(project => {
          const isCorrect = answers[project.id] === project.correctImage
          const isWrong = checked && answers[project.id] && !isCorrect
          const isRight = checked && isCorrect
          return (
            <div
              key={project.id}
              style={{
                padding: '0.875rem',
                border: `1px solid ${isRight ? '#A5D6A7' : isWrong ? '#EF9A9A' : '#e0e0e0'}`,
                borderRadius: '8px',
                background: isRight ? '#E8F5E9' : isWrong ? '#FFEBEE' : '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.2rem' }}>{project.label}</div>
                  <div style={{ fontSize: '0.78rem', color: '#666' }}>{project.description}</div>
                </div>
                <select
                  value={answers[project.id] || ''}
                  onChange={e => setAnswer(project.id, e.target.value)}
                  style={{
                    padding: '0.4rem 0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    background: '#fff',
                    fontFamily: 'monospace',
                    flexShrink: 0,
                  }}
                >
                  <option value=''>— выбери образ —</option>
                  {dockerImages.map(img => (
                    <option key={img.name} value={img.name}>{img.name}</option>
                  ))}
                </select>
              </div>
              {checked && answers[project.id] && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.78rem',
                  color: isCorrect ? '#2E7D32' : '#C62828',
                  padding: '0.4rem 0.6rem',
                  background: isCorrect ? '#F1F8E9' : '#FFF3E0',
                  borderRadius: '4px',
                }}>
                  {isCorrect ? '✅' : '❌'} {project.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={() => setChecked(true)}
        disabled={!allAnswered}
        style={{
          padding: '0.6rem 1.5rem',
          background: allAnswered ? '#1565C0' : '#e0e0e0',
          color: allAnswered ? '#fff' : '#999',
          border: 'none',
          borderRadius: '6px',
          cursor: allAnswered ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          fontSize: '0.85rem',
        }}
      >
        Проверить выбор
      </button>

      {checked && (
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#F5F5F5', borderRadius: '8px', fontSize: '0.82rem', color: '#555' }}>
          💡 <strong>Совет:</strong> Всегда выбирай наименьший образ, который содержит нужный рантайм.
          Alpine-варианты в 5–15 раз легче полных дистрибутивов — это напрямую влияет на скорость пайплайна.
        </div>
      )}
    </div>
  )
}
