// ============================================
// Level 3: Variables in GitLab CI — Solutions
// ============================================

import { useState } from 'react'

// ============================================
// Task 3.1: Predefined Variables Catalog
// ============================================

type VariableCategory = 'all' | 'commit' | 'pipeline' | 'job' | 'project' | 'runner' | 'merge-request'

interface PredefinedVariable {
  name: string
  category: Exclude<VariableCategory, 'all'>
  description: string
  example: string
}

const PREDEFINED_VARIABLES: PredefinedVariable[] = [
  // Commit
  { name: 'CI_COMMIT_SHA', category: 'commit', description: 'Полный SHA коммита (40 символов)', example: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' },
  { name: 'CI_COMMIT_SHORT_SHA', category: 'commit', description: 'Короткий SHA коммита (8 символов)', example: 'a1b2c3d4' },
  { name: 'CI_COMMIT_REF_NAME', category: 'commit', description: 'Имя ветки или тега, для которого запущен пайплайн', example: 'feature/login' },
  { name: 'CI_COMMIT_REF_SLUG', category: 'commit', description: 'Имя ветки в slug-формате (слеши заменены дефисами)', example: 'feature-login' },
  { name: 'CI_COMMIT_MESSAGE', category: 'commit', description: 'Полное сообщение коммита', example: 'feat: add user authentication' },
  { name: 'CI_COMMIT_AUTHOR', category: 'commit', description: 'Автор коммита в формате "Имя <email>"', example: 'Ivan Petrov <ivan@example.com>' },
  { name: 'CI_COMMIT_TIMESTAMP', category: 'commit', description: 'Время коммита в формате ISO 8601', example: '2024-01-15T10:30:00+03:00' },
  { name: 'CI_COMMIT_TAG', category: 'commit', description: 'Имя тега (доступна только если пайплайн запущен на тег)', example: 'v1.2.3' },
  // Pipeline
  { name: 'CI_PIPELINE_ID', category: 'pipeline', description: 'Уникальный глобальный ID пайплайна', example: '12345' },
  { name: 'CI_PIPELINE_IID', category: 'pipeline', description: 'ID пайплайна внутри проекта (порядковый номер)', example: '42' },
  { name: 'CI_PIPELINE_SOURCE', category: 'pipeline', description: 'Что запустило пайплайн: push, web, schedule, merge_request_event и др.', example: 'push' },
  { name: 'CI_PIPELINE_URL', category: 'pipeline', description: 'Полная URL-ссылка на пайплайн в GitLab UI', example: 'https://gitlab.com/group/project/-/pipelines/12345' },
  // Job
  { name: 'CI_JOB_ID', category: 'job', description: 'Уникальный глобальный ID текущего job\'а', example: '98765' },
  { name: 'CI_JOB_NAME', category: 'job', description: 'Имя текущего job\'а, как задано в .gitlab-ci.yml', example: 'build-app' },
  { name: 'CI_JOB_STAGE', category: 'job', description: 'Стадия, к которой принадлежит текущий job', example: 'build' },
  { name: 'CI_JOB_TOKEN', category: 'job', description: 'Временный токен для аутентификации в GitLab API и Registry', example: 'glrt-xxxxxxxxxxxx' },
  { name: 'CI_JOB_URL', category: 'job', description: 'Полная URL-ссылка на текущий job в GitLab UI', example: 'https://gitlab.com/group/project/-/jobs/98765' },
  // Project
  { name: 'CI_PROJECT_ID', category: 'project', description: 'Числовой ID проекта в GitLab', example: '777' },
  { name: 'CI_PROJECT_NAME', category: 'project', description: 'Имя проекта (последняя часть пути)', example: 'my-app' },
  { name: 'CI_PROJECT_PATH', category: 'project', description: 'Полный путь проекта включая группу', example: 'mygroup/my-app' },
  { name: 'CI_PROJECT_URL', category: 'project', description: 'Полная URL-ссылка на проект', example: 'https://gitlab.com/mygroup/my-app' },
  { name: 'CI_PROJECT_DIR', category: 'project', description: 'Путь к директории с кодом на файловой системе runner\'а', example: '/builds/mygroup/my-app' },
  { name: 'CI_REGISTRY', category: 'project', description: 'Адрес Container Registry GitLab', example: 'registry.gitlab.com' },
  { name: 'CI_REGISTRY_IMAGE', category: 'project', description: 'Адрес образа проекта в Container Registry', example: 'registry.gitlab.com/mygroup/my-app' },
  // Runner
  { name: 'CI_RUNNER_ID', category: 'runner', description: 'Числовой ID runner\'а, выполняющего job', example: '1234' },
  { name: 'CI_RUNNER_DESCRIPTION', category: 'runner', description: 'Описание runner\'а, заданное при регистрации', example: 'shared-runner-linux-01' },
  { name: 'CI_RUNNER_TAGS', category: 'runner', description: 'Список тегов runner\'а через запятую', example: 'docker,linux,shared' },
  { name: 'GITLAB_CI', category: 'runner', description: 'Флаг: всегда true внутри GitLab CI окружения', example: 'true' },
  // Merge Request
  { name: 'CI_MERGE_REQUEST_IID', category: 'merge-request', description: 'ID merge request\'а внутри проекта', example: '15' },
  { name: 'CI_MERGE_REQUEST_TITLE', category: 'merge-request', description: 'Заголовок merge request\'а', example: 'feat: add user login' },
  { name: 'CI_MERGE_REQUEST_SOURCE_BRANCH_NAME', category: 'merge-request', description: 'Исходная ветка MR (откуда мерджим)', example: 'feature/login' },
  { name: 'CI_MERGE_REQUEST_TARGET_BRANCH_NAME', category: 'merge-request', description: 'Целевая ветка MR (куда мерджим)', example: 'main' },
  { name: 'CI_MERGE_REQUEST_LABELS', category: 'merge-request', description: 'Лейблы MR через запятую', example: 'backend,urgent,review' },
]

const CATEGORY_LABELS: Record<VariableCategory, string> = {
  all: 'Все',
  commit: 'Commit',
  pipeline: 'Pipeline',
  job: 'Job',
  project: 'Project',
  runner: 'Runner',
  'merge-request': 'Merge Request',
}

const CATEGORY_COLORS: Record<Exclude<VariableCategory, 'all'>, string> = {
  commit: '#1565C0',
  pipeline: '#6A1B9A',
  job: '#E65100',
  project: '#2E7D32',
  runner: '#00838F',
  'merge-request': '#AD1457',
}

export function Task3_1_Solution() {
  const [activeCategory, setActiveCategory] = useState<VariableCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories: VariableCategory[] = ['all', 'commit', 'pipeline', 'job', 'project', 'runner', 'merge-request']

  const filtered = PREDEFINED_VARIABLES.filter(v => {
    const matchesCategory = activeCategory === 'all' || v.category === activeCategory
    const query = searchQuery.toLowerCase()
    const matchesSearch = !query || v.name.toLowerCase().includes(query) || v.description.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem', color: '#1a1a1a' }}>Предопределённые переменные GitLab CI</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Каталог переменных, доступных в каждом job'е без дополнительной настройки.
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder="Поиск по имени или описанию..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '0.6rem 0.8rem',
          fontSize: '0.95rem',
          border: '1px solid #ccc',
          borderRadius: '6px',
          marginBottom: '1rem',
          boxSizing: 'border-box',
          outline: 'none',
        }}
      />

      {/* Category filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {categories.map(cat => {
          const isActive = activeCategory === cat
          const color = cat === 'all' ? '#424242' : CATEGORY_COLORS[cat]
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '20px',
                border: `2px solid ${color}`,
                background: isActive ? color : 'white',
                color: isActive ? 'white' : color,
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          )
        })}
      </div>

      {/* Count */}
      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>
        Найдено: {filtered.length} переменных
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#999', padding: '2rem', border: '1px dashed #ddd', borderRadius: '8px' }}>
          Переменные не найдены. Попробуй изменить запрос.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map(variable => {
            const color = CATEGORY_COLORS[variable.category]
            return (
              <div
                key={variable.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '260px 1fr 180px',
                  gap: '0.75rem',
                  alignItems: 'start',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e8e8e8',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${color}`,
                  background: '#fafafa',
                }}
              >
                <div>
                  <code style={{
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    background: '#f0f0f0',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '3px',
                    color: '#1a1a1a',
                    wordBreak: 'break-all',
                  }}>
                    {variable.name}
                  </code>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '10px',
                      background: color + '20',
                      color: color,
                      fontWeight: 600,
                    }}>
                      {CATEGORY_LABELS[variable.category]}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.5 }}>
                  {variable.description}
                </div>
                <div>
                  <code style={{
                    fontFamily: 'monospace',
                    fontSize: '0.78rem',
                    color: '#555',
                    background: '#f5f5f5',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '3px',
                    wordBreak: 'break-all',
                  }}>
                    {variable.example}
                  </code>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 3.2: Variable Priority Visualizer
// ============================================

interface PriorityLevel {
  id: string
  label: string
  description: string
  priority: number
  color: string
}

const PRIORITY_LEVELS: PriorityLevel[] = [
  {
    id: 'instance',
    label: 'Instance',
    description: 'Настройки GitLab администратором',
    priority: 1,
    color: '#9E9E9E',
  },
  {
    id: 'group',
    label: 'Group',
    description: 'Settings → CI/CD → Variables (уровень группы)',
    priority: 2,
    color: '#78909C',
  },
  {
    id: 'project',
    label: 'Project',
    description: 'Settings → CI/CD → Variables (уровень проекта)',
    priority: 3,
    color: '#42A5F5',
  },
  {
    id: 'global',
    label: '.gitlab-ci.yml (global)',
    description: 'Секция variables: на верхнем уровне файла',
    priority: 4,
    color: '#AB47BC',
  },
  {
    id: 'pipeline',
    label: 'Pipeline (ручной/API)',
    description: 'Переданы при запуске через UI или API',
    priority: 5,
    color: '#FF7043',
  },
  {
    id: 'job',
    label: 'Job',
    description: 'Секция variables: внутри конкретного job\'а',
    priority: 6,
    color: '#2E7D32',
  },
]

type LevelValues = Record<string, string>

export function Task3_2_Solution() {
  const [values, setValues] = useState<LevelValues>({
    instance: '',
    group: '',
    project: '',
    global: '',
    pipeline: '',
    job: '',
  })
  const [winner, setWinner] = useState<string | null>(null)
  const [resolved, setResolved] = useState(false)

  const handleChange = (id: string, value: string) => {
    setValues(prev => ({ ...prev, [id]: value }))
    setResolved(false)
    setWinner(null)
  }

  const handleResolve = () => {
    const candidates = PRIORITY_LEVELS.filter(level => values[level.id].trim() !== '')
    if (candidates.length === 0) {
      setWinner(null)
      setResolved(true)
      return
    }
    const winnerLevel = candidates.reduce((prev, curr) => curr.priority > prev.priority ? curr : prev)
    setWinner(winnerLevel.id)
    setResolved(true)
  }

  const handleReset = () => {
    setValues({ instance: '', group: '', project: '', global: '', pipeline: '', job: '' })
    setWinner(null)
    setResolved(false)
  }

  const winnerLevel = PRIORITY_LEVELS.find(l => l.id === winner)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: '720px' }}>
      <h2 style={{ marginBottom: '0.25rem', color: '#1a1a1a' }}>Приоритет переменных</h2>
      <p style={{ color: '#555', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
        Задай значение переменной <code style={{ background: '#f0f0f0', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>APP_ENV</code> на разных уровнях и узнай, какое значение победит.
      </p>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
        Уровни расположены от наименьшего приоритета (Instance) к наивысшему (Job).
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {PRIORITY_LEVELS.map((level, index) => {
          const isWinner = winner === level.id
          const hasValue = values[level.id].trim() !== ''
          return (
            <div
              key={level.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: isWinner ? `2px solid ${level.color}` : '2px solid #e8e8e8',
                background: isWinner ? level.color + '12' : hasValue ? '#fafafa' : 'white',
                transition: 'all 0.2s',
              }}
            >
              {/* Priority badge */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: level.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.78rem',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {index + 1}
              </div>

              {/* Label + description */}
              <div style={{ flex: '0 0 220px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: level.color }}>
                  {level.label}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#888', marginTop: '0.1rem' }}>
                  {level.description}
                </div>
              </div>

              {/* Input */}
              <input
                type="text"
                placeholder="Значение..."
                value={values[level.id]}
                onChange={e => handleChange(level.id, e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.45rem 0.7rem',
                  fontSize: '0.9rem',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontFamily: 'monospace',
                  outline: 'none',
                  background: 'white',
                }}
              />

              {/* Winner badge */}
              {isWinner && (
                <div style={{
                  padding: '0.25rem 0.6rem',
                  background: level.color,
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  ПОБЕДИТЕЛЬ
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Arrow legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: '#888' }}>
        <span>Наименьший приоритет</span>
        <span style={{ flex: 1, borderTop: '1px dashed #ccc', position: 'relative' }}>
          <span style={{ position: 'absolute', right: 0, top: '-8px', fontSize: '1rem' }}>→</span>
        </span>
        <span>Наивысший приоритет</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button
          onClick={handleResolve}
          style={{
            padding: '0.6rem 1.4rem',
            background: '#1565C0',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Определить победителя
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '0.6rem 1.2rem',
            background: 'white',
            color: '#555',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontWeight: 500,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Сбросить
        </button>
      </div>

      {/* Result */}
      {resolved && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          background: winnerLevel ? winnerLevel.color + '15' : '#fff3e0',
          border: `1px solid ${winnerLevel ? winnerLevel.color + '60' : '#ffb300'}`,
        }}>
          {winnerLevel ? (
            <>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#555', marginBottom: '0.25rem' }}>
                Итоговое значение APP_ENV
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: winnerLevel.color, fontWeight: 700 }}>
                {values[winnerLevel.id]}
              </div>
              <div style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: '#888' }}>
                Источник: <strong style={{ color: winnerLevel.color }}>{winnerLevel.label}</strong> (приоритет {winnerLevel.priority} из 6)
              </div>
            </>
          ) : (
            <div style={{ color: '#E65100', fontWeight: 600 }}>
              Ни одно значение не задано. Переменная APP_ENV будет пустой.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 3.3: Variable Expansion Demonstrator
// ============================================

const DEFAULT_VARIABLES: Record<string, string> = {
  CI_COMMIT_SHA: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
  CI_COMMIT_SHORT_SHA: 'a1b2c3d4',
  CI_COMMIT_REF_NAME: 'feature/login',
  CI_PROJECT_NAME: 'my-service',
  CI_REGISTRY_IMAGE: 'registry.gitlab.com/mygroup/my-service',
}

const DEFAULT_SCRIPT = `# Build and push Docker image
docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA

# Tag as branch name
docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_NAME

# Deploy to environment
DEPLOY_ENV=\${APP_ENV:-development}
echo "Deploying $CI_PROJECT_NAME to $DEPLOY_ENV (commit: $CI_COMMIT_SHORT_SHA)"
`

interface CustomVariable {
  id: string
  name: string
  value: string
}

function resolveVariables(script: string, vars: Record<string, string>): string {
  let result = script

  // Step 1: ${VAR:-default}
  result = result.replace(/\$\{(\w+):-([^}]*)\}/g, (_, name, defaultVal) => {
    return vars[name] !== undefined ? vars[name] : defaultVal
  })

  // Step 2: ${VAR}
  result = result.replace(/\$\{(\w+)\}/g, (_, name) => {
    return vars[name] !== undefined ? vars[name] : `\${${name}}`
  })

  // Step 3: $VAR (greedy: longest match)
  result = result.replace(/\$([A-Z_][A-Z0-9_]*)/g, (_, name) => {
    return vars[name] !== undefined ? vars[name] : `$${name}`
  })

  return result
}

function highlightUnresolved(text: string): string {
  // Highlight remaining unresolved variables
  return text.replace(/\$\{?[A-Z_][A-Z0-9_]*\}?/g, (match) => {
    return `<span style="color: #d32f2f; background: #ffebee; border-radius: 3px; padding: 0 2px; font-weight: 600;">${match}</span>`
  })
}

export function Task3_3_Solution() {
  const [script, setScript] = useState(DEFAULT_SCRIPT)
  const [customVars, setCustomVars] = useState<CustomVariable[]>([])
  const [newVarName, setNewVarName] = useState('')
  const [newVarValue, setNewVarValue] = useState('')
  const [resolved, setResolved] = useState<string | null>(null)

  const allVars: Record<string, string> = {
    ...DEFAULT_VARIABLES,
    ...Object.fromEntries(customVars.filter(v => v.name.trim()).map(v => [v.name.trim(), v.value])),
  }

  const handleAddVar = () => {
    if (!newVarName.trim()) return
    setCustomVars(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: newVarName.trim().toUpperCase(), value: newVarValue },
    ])
    setNewVarName('')
    setNewVarValue('')
    setResolved(null)
  }

  const handleRemoveVar = (id: string) => {
    setCustomVars(prev => prev.filter(v => v.id !== id))
    setResolved(null)
  }

  const handleResolve = () => {
    const result = resolveVariables(script, allVars)
    setResolved(result)
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem', color: '#1a1a1a' }}>Variable Expansion</h2>
      <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Напиши скрипт с переменными, нажми "Resolve" и увидь, как GitLab CI подставит реальные значения.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* Left: editor + actions */}
        <div style={{ flex: '1 1 420px' }}>
          <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Скрипт (Raw)
          </h3>
          <textarea
            value={script}
            onChange={e => { setScript(e.target.value); setResolved(null) }}
            rows={12}
            style={{
              width: '100%',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              resize: 'vertical',
              lineHeight: 1.6,
              boxSizing: 'border-box',
              outline: 'none',
              background: '#1e1e1e',
              color: '#d4d4d4',
            }}
          />

          <button
            onClick={handleResolve}
            style={{
              marginTop: '0.75rem',
              padding: '0.6rem 1.4rem',
              background: '#2E7D32',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Resolve — подставить переменные
          </button>

          {/* Resolved output */}
          {resolved !== null && (
            <div style={{ marginTop: '1.25rem' }}>
              <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Resolved (как видит runner)
              </h3>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  padding: '0.75rem',
                  background: '#1a2733',
                  color: '#a8d8a8',
                  borderRadius: '6px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  border: '1px solid #2d3748',
                }}
                dangerouslySetInnerHTML={{ __html: highlightUnresolved(resolved) }}
              />
              <p style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.4rem' }}>
                Красным выделены нераскрытые переменные (не задано значение).
              </p>
            </div>
          )}
        </div>

        {/* Right: variables panel */}
        <div style={{ flex: '0 0 300px' }}>

          {/* Predefined */}
          <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Предустановленные переменные
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {Object.entries(DEFAULT_VARIABLES).map(([name, value]) => (
              <div key={name} style={{
                padding: '0.45rem 0.7rem',
                background: '#f5f5f5',
                borderRadius: '5px',
                fontSize: '0.78rem',
                borderLeft: '3px solid #1565C0',
              }}>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1565C0' }}>{name}</div>
                <div style={{ color: '#555', marginTop: '0.1rem', wordBreak: 'break-all' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Custom vars */}
          <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Кастомные переменные
          </h3>

          {customVars.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
              {customVars.map(v => (
                <div key={v.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.7rem',
                  background: '#f5f5f5',
                  borderRadius: '5px',
                  fontSize: '0.78rem',
                  borderLeft: '3px solid #E65100',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#E65100' }}>{v.name}</div>
                    <div style={{ color: '#555' }}>{v.value || '(пусто)'}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveVar(v.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#999',
                      fontSize: '1rem',
                      padding: '0 0.2rem',
                      lineHeight: 1,
                    }}
                    title="Удалить"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add variable form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <input
              type="text"
              placeholder="ИМЯ_ПЕРЕМЕННОЙ"
              value={newVarName}
              onChange={e => setNewVarName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleAddVar()}
              style={{
                padding: '0.45rem 0.7rem',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                border: '1px solid #ddd',
                borderRadius: '5px',
                outline: 'none',
              }}
            />
            <input
              type="text"
              placeholder="значение"
              value={newVarValue}
              onChange={e => setNewVarValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddVar()}
              style={{
                padding: '0.45rem 0.7rem',
                fontSize: '0.85rem',
                border: '1px solid #ddd',
                borderRadius: '5px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleAddVar}
              disabled={!newVarName.trim()}
              style={{
                padding: '0.45rem',
                background: newVarName.trim() ? '#E65100' : '#e0e0e0',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: newVarName.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              + Добавить переменную
            </button>
          </div>

          {/* Syntax reference */}
          <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#fffde7', borderRadius: '6px', fontSize: '0.78rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#F57F17' }}>Поддерживаемый синтаксис</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {[
                ['$VAR', 'простая подстановка'],
                ['${VAR}', 'явные границы имени'],
                ['${VAR:-default}', 'значение по умолчанию'],
              ].map(([syntax, desc]) => (
                <div key={syntax} style={{ display: 'flex', gap: '0.5rem' }}>
                  <code style={{ fontFamily: 'monospace', color: '#1565C0', fontWeight: 700, minWidth: '120px' }}>{syntax}</code>
                  <span style={{ color: '#555' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
