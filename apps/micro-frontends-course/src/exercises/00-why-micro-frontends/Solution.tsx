import { useState } from 'react'

// ============================================
// Task 0.1: Monolith vs Micro-frontends visualizer
// ============================================

interface Team {
  id: number
  name: string
  color: string
  feature: string
}

interface Change {
  id: number
  teamId: number
  description: string
  timestamp: number
  hasConflict: boolean
}

const TEAM_COLORS = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c62828', '#00838f']
const TEAM_NAMES = ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon', 'Team Zeta']
const TEAM_FEATURES = ['Корзина', 'Каталог', 'Профиль', 'Поиск', 'Оплата', 'Аналитика']
const CHANGE_DESCRIPTIONS = [
  'Fix: null pointer в компоненте',
  'Feat: новая кнопка CTA',
  'Refactor: переименование переменных',
  'Fix: баг с датами',
  'Feat: A/B тест',
  'Chore: обновление зависимостей',
  'Fix: проблема с отображением',
  'Feat: новый виджет',
]

function getDeployTime(teamsCount: number, conflictsCount: number, isMfe: boolean): number {
  if (isMfe) return 3 + Math.floor(Math.random() * 2)
  return 5 + teamsCount * 4 + conflictsCount * 8
}

export function Task0_1_Solution() {
  const [activeTab, setActiveTab] = useState<'monolith' | 'mfe'>('monolith')
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: 'Team Alpha', color: TEAM_COLORS[0], feature: TEAM_FEATURES[0] },
  ])
  const [changes, setChanges] = useState<Change[]>([])
  const [deployLog, setDeployLog] = useState<{ time: number; isMfe: boolean; label: string }[]>([])
  const [isDeploying, setIsDeploying] = useState(false)

  const conflictsCount = changes.filter(c => c.hasConflict).length

  function addTeam() {
    if (teams.length >= 6) return
    const idx = teams.length
    setTeams(prev => [
      ...prev,
      { id: idx + 1, name: TEAM_NAMES[idx], color: TEAM_COLORS[idx], feature: TEAM_FEATURES[idx] },
    ])
  }

  function addChange() {
    const teamIdx = Math.floor(Math.random() * teams.length)
    const descIdx = Math.floor(Math.random() * CHANGE_DESCRIPTIONS.length)
    // conflict probability grows with team count
    const conflictChance = teams.length > 2 ? 0.3 + teams.length * 0.07 : 0.1
    const hasConflict = Math.random() < conflictChance
    setChanges(prev => [
      ...prev,
      {
        id: prev.length + 1,
        teamId: teams[teamIdx].id,
        description: CHANGE_DESCRIPTIONS[descIdx],
        timestamp: Date.now(),
        hasConflict,
      },
    ])
  }

  function simulateDeploy() {
    setIsDeploying(true)
    const time = getDeployTime(teams.length, conflictsCount, activeTab === 'mfe')
    setTimeout(() => {
      setDeployLog(prev => [
        { time, isMfe: activeTab === 'mfe', label: activeTab === 'mfe' ? 'MFE' : 'Монолит' },
        ...prev.slice(0, 9),
      ])
      setIsDeploying(false)
    }, 1000)
  }

  function reset() {
    setTeams([{ id: 1, name: 'Team Alpha', color: TEAM_COLORS[0], feature: TEAM_FEATURES[0] }])
    setChanges([])
    setDeployLog([])
  }

  const maxDeployTime = 60
  const monolithDeployTime = getDeployTime(teams.length, conflictsCount, false)
  const mfeDeployTime = getDeployTime(teams.length, conflictsCount, true)

  const tabStyle = (tab: 'monolith' | 'mfe'): React.CSSProperties => ({
    padding: '0.5rem 1.5rem',
    border: 'none',
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    background: activeTab === tab ? (tab === 'monolith' ? '#c62828' : '#1976d2') : '#e0e0e0',
    color: activeTab === tab ? '#fff' : '#555',
    transition: 'all 0.2s',
  })

  return (
    <div className="exercise-container" style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: 800 }}>
      <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.3rem', color: '#1a1a2e' }}>
        Визуализатор: монолит vs микрофронтенды
      </h2>
      <p style={{ color: '#666', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
        Добавляйте команды и изменения — смотрите, как растёт сложность деплоя в монолите и остаётся стабильной в MFE.
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={addTeam}
          disabled={teams.length >= 6}
          style={{
            padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: teams.length >= 6 ? 'not-allowed' : 'pointer',
            background: teams.length >= 6 ? '#e0e0e0' : '#1976d2', color: teams.length >= 6 ? '#aaa' : '#fff', fontWeight: 600,
          }}
        >
          + Добавить команду ({teams.length}/6)
        </button>
        <button
          onClick={addChange}
          style={{ padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#388e3c', color: '#fff', fontWeight: 600 }}
        >
          Внести изменение
        </button>
        <button
          onClick={simulateDeploy}
          disabled={isDeploying}
          style={{ padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: isDeploying ? 'wait' : 'pointer', background: '#f57c00', color: '#fff', fontWeight: 600 }}
        >
          {isDeploying ? 'Деплой...' : 'Задеплоить'}
        </button>
        <button
          onClick={reset}
          style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer', background: '#fff', color: '#555', fontWeight: 600 }}
        >
          Сбросить
        </button>
      </div>

      {/* Teams */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Команды</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {teams.map(team => (
            <div key={team.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: 20, background: team.color + '18', border: `1px solid ${team.color}40` }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: team.color }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: team.color }}>{team.name}</span>
              <span style={{ fontSize: '0.75rem', color: '#888' }}>/ {team.feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Изменений', value: changes.length, color: '#1976d2' },
          { label: 'Merge-конфликтов', value: conflictsCount, color: '#c62828' },
          { label: 'Команд', value: teams.length, color: '#388e3c' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#f5f5f5', borderRadius: 12, padding: '0.75rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#777' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 0 }}>
        <button style={tabStyle('monolith')} onClick={() => setActiveTab('monolith')}>Монолит</button>
        <button style={tabStyle('mfe')} onClick={() => setActiveTab('mfe')}>Микрофронтенды</button>
      </div>
      <div style={{ border: `2px solid ${activeTab === 'monolith' ? '#c62828' : '#1976d2'}`, borderRadius: '0 8px 8px 8px', padding: '1.25rem', background: '#fff', marginBottom: '1.5rem' }}>
        {activeTab === 'monolith' ? (
          <MonolithView teams={teams} changes={changes} conflictsCount={conflictsCount} deployTime={monolithDeployTime} maxDeployTime={maxDeployTime} />
        ) : (
          <MfeView teams={teams} changes={changes} deployTime={mfeDeployTime} maxDeployTime={maxDeployTime} />
        )}
      </div>

      {/* Deploy comparison bar chart */}
      <div style={{ background: '#f9f9f9', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Сравнение времени деплоя</div>
        <DeployBar label="Монолит" time={monolithDeployTime} maxTime={maxDeployTime} color="#c62828" />
        <DeployBar label="MFE" time={mfeDeployTime} maxTime={maxDeployTime} color="#1976d2" />
      </div>

      {/* Changes feed */}
      {changes.length > 0 && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Лента изменений</div>
          <div style={{ maxHeight: 160, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[...changes].reverse().map(change => {
              const team = teams.find(t => t.id === change.teamId)!
              return (
                <div key={change.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0.75rem', borderRadius: 8, background: change.hasConflict ? '#fff3f3' : '#f5f5f5', border: change.hasConflict ? '1px solid #ffcdd2' : '1px solid #e0e0e0' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: team?.color || '#ccc', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: team?.color || '#666', minWidth: 90 }}>{team?.name}</span>
                  <span style={{ fontSize: '0.8rem', color: '#555', flex: 1 }}>{change.description}</span>
                  {change.hasConflict && <span style={{ fontSize: '0.75rem', color: '#c62828', fontWeight: 600 }}>КОНФЛИКТ</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Deploy history */}
      {deployLog.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>История деплоев</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {deployLog.map((entry, i) => (
              <div key={i} style={{ padding: '0.3rem 0.6rem', borderRadius: 8, background: entry.isMfe ? '#e3f2fd' : '#ffebee', fontSize: '0.8rem', fontWeight: 600, color: entry.isMfe ? '#1976d2' : '#c62828' }}>
                {entry.label}: {entry.time} мин
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DeployBar({ label, time, maxTime, color }: { label: string; time: number; maxTime: number; color: string }) {
  const pct = Math.min((time / maxTime) * 100, 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
      <div style={{ minWidth: 90, fontSize: '0.85rem', fontWeight: 600, color }}>{label}</div>
      <div style={{ flex: 1, height: 20, background: '#e0e0e0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 10, transition: 'width 0.5s' }} />
      </div>
      <div style={{ minWidth: 60, fontSize: '0.85rem', color: '#555', textAlign: 'right' }}>{time} мин</div>
    </div>
  )
}

function MonolithView({ teams, changes, conflictsCount, deployTime, maxDeployTime }: {
  teams: Team[]; changes: Change[]; conflictsCount: number; deployTime: number; maxDeployTime: number
}) {
  const ciTime = 5 + teams.length * 3 + changes.length * 0.5
  const blockRisk = Math.min(conflictsCount * 20 + teams.length * 10, 100)

  return (
    <div>
      <div style={{ fontWeight: 700, color: '#c62828', marginBottom: '1rem', fontSize: '1rem' }}>
        Монолитный фронтенд
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {teams.map(team => (
          <div key={team.id} style={{ padding: '0.4rem 0.75rem', borderRadius: 8, background: team.color, color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>
            {team.name}
          </div>
        ))}
        {teams.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '0.4rem 0.75rem', borderRadius: 8, background: '#ffebee', color: '#c62828', fontSize: '0.8rem', fontWeight: 600, border: '1px dashed #c62828' }}>
            Один репозиторий
          </div>
        )}
      </div>
      <Metric label="Время CI/CD" value={`${ciTime.toFixed(0)} мин`} pct={Math.min((ciTime / 40) * 100, 100)} color="#f57c00" />
      <Metric label="Риск блокировки деплоя" value={`${blockRisk}%`} pct={blockRisk} color="#c62828" />
      <Metric label="Merge-конфликты" value={`${conflictsCount} шт`} pct={Math.min((conflictsCount / 10) * 100, 100)} color="#7b1fa2" />
      {teams.length > 2 && (
        <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: 8, background: '#fff3e0', border: '1px solid #ffe0b2', fontSize: '0.85rem', color: '#e65100' }}>
          ⚠️ {teams.length} команды работают в одном репозитории — merge-конфликты нарастают, один сломанный PR блокирует всех.
        </div>
      )}
      {conflictsCount > 3 && (
        <div style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: 8, background: '#ffebee', border: '1px solid #ffcdd2', fontSize: '0.85rem', color: '#c62828' }}>
          Деплой заблокирован: {conflictsCount} нерешённых конфликта. Все команды ждут.
        </div>
      )}
    </div>
  )
}

function MfeView({ teams, changes, deployTime, maxDeployTime }: {
  teams: Team[]; changes: Change[]; deployTime: number; maxDeployTime: number
}) {
  return (
    <div>
      <div style={{ fontWeight: 700, color: '#1976d2', marginBottom: '1rem', fontSize: '1rem' }}>
        Микрофронтенды
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
        {teams.map(team => (
          <div key={team.id} style={{ padding: '0.6rem 0.75rem', borderRadius: 10, background: team.color + '15', border: `1px solid ${team.color}40` }}>
            <div style={{ fontWeight: 700, color: team.color, fontSize: '0.85rem' }}>{team.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>{team.feature}</div>
            <div style={{ marginTop: '0.4rem', height: 4, borderRadius: 2, background: team.color, opacity: 0.6 }} />
            <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.25rem' }}>Независимый pipeline</div>
          </div>
        ))}
      </div>
      <Metric label="Время деплоя одного MFE" value={`${deployTime} мин`} pct={Math.min((deployTime / 20) * 100, 100)} color="#1976d2" />
      <Metric label="Параллельных pipeline" value={`${teams.length}`} pct={(teams.length / 6) * 100} color="#388e3c" />
      <Metric label="Блокировок деплоя" value="0" pct={0} color="#388e3c" />
      {changes.length > 0 && (
        <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: 8, background: '#e8f5e9', border: '1px solid #c8e6c9', fontSize: '0.85rem', color: '#2e7d32' }}>
          Каждая команда деплоит независимо. Изменений: {changes.length} — ни одно не блокирует других.
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div style={{ marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
        <span style={{ color: '#555' }}>{label}</span>
        <span style={{ fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 8, background: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.4s' }} />
      </div>
    </div>
  )
}

// ============================================
// Task 0.2: MFE readiness audit
// ============================================

interface AuditQuestion {
  id: string
  text: string
  hint: string
  category: string
  options: { label: string; value: number; explanation: string }[]
}

const AUDIT_QUESTIONS: AuditQuestion[] = [
  {
    id: 'teams',
    text: 'Сколько команд работает над фронтендом?',
    hint: 'MFE начинают давать ощутимую выгоду от 3+ независимых команд',
    category: 'Организация',
    options: [
      { label: '1 команда', value: 0, explanation: '1 команда — MFE добавит overhead без пользы' },
      { label: '2 команды', value: 1, explanation: '2 команды — пограничный случай, стоит присмотреться' },
      { label: '3-5 команд', value: 2, explanation: '3-5 команд — хорошая почва для MFE' },
      { label: '6+ команд', value: 3, explanation: '6+ команд — MFE почти обязателен' },
    ],
  },
  {
    id: 'deploys',
    text: 'Как часто команды хотят деплоить?',
    hint: 'Если команды вынуждены синхронизировать релизы — это боль',
    category: 'Деплой',
    options: [
      { label: 'Раз в месяц или реже', value: 0, explanation: 'Редкий деплой — смысл в MFE минимален' },
      { label: 'Раз в неделю', value: 1, explanation: 'Раз в неделю — уже есть потребность в независимости' },
      { label: 'Несколько раз в неделю', value: 2, explanation: 'Частый деплой — монолит тормозит разработку' },
      { label: 'Несколько раз в день', value: 3, explanation: 'Continuous delivery — MFE даёт максимальную пользу' },
    ],
  },
  {
    id: 'conflicts',
    text: 'Как часто возникают merge-конфликты между командами?',
    hint: 'Конфликты — симптом того, что команды мешают друг другу',
    category: 'Разработка',
    options: [
      { label: 'Почти никогда', value: 0, explanation: 'Нет конфликтов — значит, команды и так хорошо разделены' },
      { label: 'Иногда (раз в спринт)', value: 1, explanation: 'Редкие конфликты — небольшая проблема' },
      { label: 'Регулярно', value: 2, explanation: 'Регулярные конфликты — команды мешают друг другу' },
      { label: 'Постоянно, тормозят работу', value: 3, explanation: 'Постоянные конфликты — сильный аргумент за MFE' },
    ],
  },
  {
    id: 'bundleSize',
    text: 'Какой текущий размер JS-бандла (main bundle)?',
    hint: 'Большой бандл замедляет первую загрузку, MFE позволяет грузить только нужное',
    category: 'Производительность',
    options: [
      { label: 'До 200 КБ', value: 0, explanation: 'Маленький бандл — проблем с производительностью нет' },
      { label: '200-500 КБ', value: 1, explanation: 'Средний бандл — стоит следить за динамикой роста' },
      { label: '500 КБ — 1 МБ', value: 2, explanation: 'Большой бандл — MFE поможет с lazy loading' },
      { label: 'Больше 1 МБ', value: 3, explanation: 'Критически большой бандл — сильный аргумент за разделение' },
    ],
  },
  {
    id: 'ciTime',
    text: 'Сколько занимает полный прогон CI?',
    hint: 'Долгий CI мешает всем командам получать обратную связь быстро',
    category: 'Деплой',
    options: [
      { label: 'До 5 минут', value: 0, explanation: 'Быстрый CI — нет проблем' },
      { label: '5-15 минут', value: 1, explanation: 'Терпимо, но можно лучше' },
      { label: '15-30 минут', value: 2, explanation: 'Долго — разработчики теряют фокус' },
      { label: 'Более 30 минут', value: 3, explanation: 'Критически долго — MFE даст независимые пайплайны' },
    ],
  },
  {
    id: 'sharedState',
    text: 'Насколько сильно переплетён shared state между фичами?',
    hint: 'Сильная связность state делает разделение болезненным',
    category: 'Архитектура',
    options: [
      { label: 'Всё через один глобальный стор', value: 0, explanation: 'Сильная связность — разделение будет очень сложным' },
      { label: 'Общий стор, но есть локальный state', value: 1, explanation: 'Средняя связность — нужна подготовка к MFE' },
      { label: 'Минимальный shared state', value: 2, explanation: 'Слабая связность — хорошая база для MFE' },
      { label: 'Фичи изолированы, обмен через события', value: 3, explanation: 'Отличная изоляция — MFE уже в логике' },
    ],
  },
  {
    id: 'techStack',
    text: 'Нужно ли использовать разные технологии в разных частях приложения?',
    hint: 'MFE позволяет разным командам использовать разные стеки',
    category: 'Архитектура',
    options: [
      { label: 'Нет, один стек везде', value: 0, explanation: 'Единый стек — веский аргумент против MFE' },
      { label: 'Хотелось бы для новых фич', value: 1, explanation: 'Частичный переход — MFE может быть полезен' },
      { label: 'Есть legacy части на другом стеке', value: 2, explanation: 'Legacy migration — классический use case для MFE' },
      { label: 'Команды требуют свободу выбора', value: 3, explanation: 'Технологическая гетерогенность — сильный аргумент за MFE' },
    ],
  },
  {
    id: 'teamAutonomy',
    text: 'Насколько команды независимы в принятии технических решений?',
    hint: 'MFE лучше работает с автономными командами (Conway\'s Law)',
    category: 'Организация',
    options: [
      { label: 'Один архитектор решает за всех', value: 0, explanation: 'Централизованные решения — MFE не добавит пользы' },
      { label: 'Есть RFC-процесс, обсуждения', value: 1, explanation: 'Умеренная автономия — потенциал для MFE есть' },
      { label: 'Команды автономны в своей области', value: 2, explanation: 'Хорошая автономия — MFE усилит её' },
      { label: 'Полная автономия, свои roadmap', value: 3, explanation: 'Полная автономия — идеальная почва для MFE' },
    ],
  },
]

export function Task0_2_Solution() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState(false)

  const answeredCount = Object.keys(answers).length
  const totalQuestions = AUDIT_QUESTIONS.length
  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0)
  const maxScore = totalQuestions * 3
  const readinessIndex = Math.round((totalScore / maxScore) * 100)

  function getRecommendation(index: number): { level: string; color: string; bg: string; text: string; icon: string } {
    if (index < 30) return {
      level: 'Монолит подходит',
      color: '#2e7d32',
      bg: '#e8f5e9',
      icon: '✅',
      text: 'Ваша ситуация не требует MFE. Монолит даст меньше overhead и будет проще в поддержке. Сосредоточьтесь на модульности внутри монолита — выделите чёткие bounded contexts, настройте ESLint-правила для изоляции модулей.',
    }
    if (index < 60) return {
      level: 'Рассмотрите Partial Decomposition',
      color: '#e65100',
      bg: '#fff3e0',
      icon: '⚠️',
      text: 'Есть предпосылки для проблем. Начните с выделения 1-2 независимых MFE для наиболее автономных фич (например, новая фича или legacy часть). Проверьте гипотезу на реальном проекте, прежде чем переходить полностью.',
    }
    return {
      level: 'Пора переходить на MFE',
      color: '#1976d2',
      bg: '#e3f2fd',
      icon: '🚀',
      text: 'Ваш контекст сильно выигрывает от MFE. Начните с выбора архитектурного подхода (Module Federation vs Single-SPA vs iframe), определите team topology и договоритесь о контрактах между MFE. Планируйте поэтапную миграцию.',
    }
  }

  const recommendation = getRecommendation(readinessIndex)

  const categoryScores = AUDIT_QUESTIONS.reduce<Record<string, { total: number; max: number }>>((acc, q) => {
    if (!acc[q.category]) acc[q.category] = { total: 0, max: 0 }
    acc[q.category].max += 3
    if (answers[q.id] !== undefined) acc[q.category].total += answers[q.id]
    return acc
  }, {})

  return (
    <div className="exercise-container" style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: 700 }}>
      <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.3rem', color: '#1a1a2e' }}>
        Аудит готовности к MFE
      </h2>
      <p style={{ color: '#666', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
        Ответьте на {totalQuestions} вопросов — получите индекс готовности с персональными рекомендациями.
      </p>

      {/* Progress */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
          <span style={{ color: '#666' }}>Прогресс</span>
          <span style={{ fontWeight: 600, color: '#1976d2' }}>{answeredCount} / {totalQuestions}</span>
        </div>
        <div style={{ height: 8, background: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${(answeredCount / totalQuestions) * 100}%`, height: '100%', background: '#1976d2', borderRadius: 4, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {AUDIT_QUESTIONS.map((q, idx) => (
          <div key={q.id} style={{ borderRadius: 12, border: '1px solid #e0e0e0', padding: '1rem', background: answers[q.id] !== undefined ? '#fafffe' : '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{q.category}</span>
                <div style={{ fontWeight: 600, color: '#1a1a2e', marginTop: '0.2rem', fontSize: '0.95rem' }}>
                  {idx + 1}. {q.text}
                </div>
              </div>
              {answers[q.id] !== undefined && (
                <span style={{ fontSize: '1.1rem', marginLeft: '0.5rem' }}>✓</span>
              )}
            </div>
            <p style={{ fontSize: '0.82rem', color: '#888', margin: '0 0 0.75rem', fontStyle: 'italic' }}>{q.hint}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {q.options.map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', padding: '0.4rem 0.6rem', borderRadius: 8, background: answers[q.id] === opt.value ? '#e3f2fd' : 'transparent', border: answers[q.id] === opt.value ? '1px solid #90caf9' : '1px solid transparent', transition: 'all 0.15s' }}>
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.value}
                    checked={answers[q.id] === opt.value}
                    onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                    style={{ marginTop: 3, accentColor: '#1976d2' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.88rem', color: '#333' }}>{opt.label}</span>
                    {answers[q.id] === opt.value && showResult && (
                      <div style={{ fontSize: '0.78rem', color: '#555', marginTop: '0.2rem', fontStyle: 'italic' }}>{opt.explanation}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={() => setShowResult(true)}
        disabled={answeredCount < totalQuestions}
        style={{
          width: '100%', padding: '0.75rem', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: '1rem', cursor: answeredCount < totalQuestions ? 'not-allowed' : 'pointer',
          background: answeredCount < totalQuestions ? '#e0e0e0' : '#1976d2', color: answeredCount < totalQuestions ? '#aaa' : '#fff', transition: 'all 0.2s', marginBottom: '1.5rem',
        }}
      >
        {answeredCount < totalQuestions ? `Ответьте на все вопросы (осталось ${totalQuestions - answeredCount})` : 'Получить результат'}
      </button>

      {/* Result */}
      {showResult && answeredCount === totalQuestions && (
        <div style={{ borderRadius: 16, border: `2px solid ${recommendation.color}`, padding: '1.5rem', background: recommendation.bg }}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '2.5rem' }}>{recommendation.icon}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: recommendation.color }}>{readinessIndex}%</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: recommendation.color, marginTop: '0.25rem' }}>
              {recommendation.level}
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.6, marginBottom: '1.25rem' }}>{recommendation.text}</p>

          {/* Category breakdown */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#555', marginBottom: '0.75rem' }}>По категориям:</div>
            {Object.entries(categoryScores).map(([cat, score]) => {
              const catPct = Math.round((score.total / score.max) * 100)
              return (
                <div key={cat} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#555' }}>{cat}</span>
                    <span style={{ fontWeight: 600, color: recommendation.color }}>{catPct}%</span>
                  </div>
                  <div style={{ height: 6, background: '#e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${catPct}%`, height: '100%', background: recommendation.color, borderRadius: 3, transition: 'width 0.4s' }} />
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => { setAnswers({}); setShowResult(false) }}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer', background: '#fff', color: '#555', fontWeight: 600, fontSize: '0.88rem' }}
          >
            Пройти снова
          </button>
        </div>
      )}
    </div>
  )
}
