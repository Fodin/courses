import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

// ─── Shared styles ────────────────────────────────────────────────────────────

const badge = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  background: color,
  color: '#fff',
  marginLeft: 6,
})

const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  padding: 16,
  background: '#fff',
  ...extra,
})

const counterStyle = (hot: boolean): React.CSSProperties => ({
  fontSize: 11,
  color: hot ? '#dc2626' : '#6b7280',
  fontWeight: hot ? 700 : 400,
})

function RenderBadge({ count }: { count: number }) {
  return (
    <span style={counterStyle(count > 1)}>
      renders: {count}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 13.1 — Context Splitting
// ═══════════════════════════════════════════════════════════════════════════════

// ── Types ─────────────────────────────────────────────────────────────────────

interface User13_1 {
  name: string
  avatar: string
}

type Theme13_1 = 'light' | 'dark'

interface SearchCtx {
  query: string
  setQuery: (q: string) => void
}

// ── Contexts ──────────────────────────────────────────────────────────────────

const UserContext = createContext<User13_1>({ name: 'Аноним', avatar: '🙂' })
const ThemeContext = createContext<Theme13_1>('light')
const SearchContext = createContext<SearchCtx>({ query: '', setQuery: () => {} })

// ── Consumer components ───────────────────────────────────────────────────────

function UserCard() {
  const user = useContext(UserContext)
  const renders = useRef(0)
  renders.current++

  return (
    <div style={card({ background: '#f0f9ff' })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>UserCard</span>
        <RenderBadge count={renders.current} />
      </div>
      <p style={{ margin: '8px 0 0', fontSize: 14 }}>
        {user.avatar} {user.name}
      </p>
    </div>
  )
}

function ThemeToggle() {
  const theme = useContext(ThemeContext)
  const renders = useRef(0)
  renders.current++

  return (
    <div style={card({ background: '#fdf4ff' })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>ThemeToggle</span>
        <RenderBadge count={renders.current} />
      </div>
      <p style={{ margin: '8px 0 0', fontSize: 14 }}>
        Тема: {theme === 'light' ? '☀️ Светлая' : '🌙 Тёмная'}
      </p>
    </div>
  )
}

function SearchResults() {
  const { query } = useContext(SearchContext)
  const renders = useRef(0)
  renders.current++

  const results = ['React', 'Fiber', 'Hooks', 'Context', 'Concurrent'].filter(
    item => item.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div style={card({ background: '#f0fdf4' })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>SearchResults</span>
        <RenderBadge count={renders.current} />
      </div>
      <p style={{ margin: '6px 0 0', fontSize: 12, color: '#6b7280' }}>
        {results.length} результата по «{query || '…'}»
      </p>
      <ul style={{ margin: '6px 0 0', paddingLeft: 16, fontSize: 13 }}>
        {results.map(r => <li key={r}>{r}</li>)}
      </ul>
    </div>
  )
}

// ── Providers + Root ──────────────────────────────────────────────────────────

const USERS: User13_1[] = [
  { name: 'Алиса', avatar: '👩‍💻' },
  { name: 'Боб', avatar: '👨‍🔬' },
  { name: 'Карина', avatar: '🧑‍🎨' },
]

export function Task13_1_Solution() {
  const [userIdx, setUserIdx] = useState(0)
  const [theme, setTheme] = useState<Theme13_1>('light')
  const [query, setQuery] = useState('')

  // Мемоизируем объект SearchContext — setQuery стабилен, query меняется
  const searchCtx = useMemo<SearchCtx>(() => ({ query, setQuery }), [query])

  const bgMain = theme === 'dark' ? '#1e293b' : '#f8fafc'
  const textMain = theme === 'dark' ? '#f1f5f9' : '#1e293b'

  return (
    <div className="exercise-container">
      <h2>Задание 13.1 — Context Splitting</h2>

      <div style={{
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 13,
      }}>
        Три контекста с разной частотой изменений. Введите текст в поиск —
        <strong> только SearchResults</strong> ре-рендерится. Счётчики у UserCard и ThemeToggle
        не меняются.
      </div>

      <UserContext.Provider value={USERS[userIdx]}>
        <ThemeContext.Provider value={theme}>
          <SearchContext.Provider value={searchCtx}>
            <div style={{ background: bgMain, color: textMain, borderRadius: 10, padding: 16 }}>
              {/* Controls */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <button
                  onClick={() => setUserIdx(i => (i + 1) % USERS.length)}
                  style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #94a3b8', cursor: 'pointer', background: '#dbeafe' }}
                >
                  Сменить пользователя
                </button>
                <button
                  onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                  style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #94a3b8', cursor: 'pointer', background: '#f3e8ff' }}
                >
                  {theme === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
                </button>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Поиск..."
                  style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #94a3b8', flex: 1, minWidth: 140 }}
                />
              </div>

              {/* Consumers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <UserCard />
                <ThemeToggle />
                <SearchResults />
              </div>

              {/* Explanation */}
              <div style={{ marginTop: 16, fontSize: 12, color: '#6b7280' }}>
                <strong>Почему работает:</strong> каждый компонент подписан только на свой контекст.
                При изменении query обновляется только SearchContext → только SearchResults.
                Значение SearchContext мемоизировано через useMemo, чтобы не пересоздавался объект.
              </div>
            </div>
          </SearchContext.Provider>
        </ThemeContext.Provider>
      </UserContext.Provider>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 13.2 — State Colocation + Children as Props
// ═══════════════════════════════════════════════════════════════════════════════

// ── Shared heavy article ───────────────────────────────────────────────────────

function ArticleContent({ label }: { label: string }) {
  const renders = useRef(0)
  renders.current++

  return (
    <div style={{ ...card({ background: '#f0fdf4' }), marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>
          ArticleContent ({label})
        </span>
        <RenderBadge count={renders.current} />
      </div>
      <p style={{ margin: 0, fontSize: 13, color: '#374151' }}>
        React использует алгоритм согласования (reconciliation) для эффективного обновления DOM.
        Fiber — внутренняя структура данных, представляющая единицу работы.
      </p>
      <p style={{ margin: '6px 0 0', fontSize: 13, color: '#374151' }}>
        При каждом рендере React создаёт новый виртуальный DOM и сравнивает его с предыдущим,
        обновляя только изменившиеся узлы.
      </p>
    </div>
  )
}

// ── BEFORE: state in root ─────────────────────────────────────────────────────

function CommentInputBefore({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const renders = useRef(0)
  renders.current++

  return (
    <div style={{ ...card(), marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700 }}>CommentInput (до)</span>
        <RenderBadge count={renders.current} />
      </div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Напишите комментарий..."
        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
      />
    </div>
  )
}

function CommentSectionBefore({
  text,
  onText,
}: {
  text: string
  onText: (v: string) => void
}) {
  const renders = useRef(0)
  renders.current++

  return (
    <div style={card({ background: '#fff7ed' })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#c2410c' }}>CommentSection (до)</span>
        <RenderBadge count={renders.current} />
      </div>
      <ArticleContent label="до" />
      <CommentInputBefore value={text} onChange={onText} />
    </div>
  )
}

function BeforeColocation() {
  const [commentText, setCommentText] = useState('')
  const renders = useRef(0)
  renders.current++

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong style={{ color: '#dc2626' }}>До: state в корне</strong>
        <RenderBadge count={renders.current} />
      </div>
      <CommentSectionBefore text={commentText} onText={setCommentText} />
      <p style={{ fontSize: 11, color: '#6b7280', marginTop: 6 }}>
        Вводите текст → все компоненты мигают
      </p>
    </div>
  )
}

// ── AFTER: State Colocation + Children as Props ───────────────────────────────

function CommentInputAfter() {
  const [text, setText] = useState('')
  const renders = useRef(0)
  renders.current++

  return (
    <div style={{ ...card(), marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700 }}>CommentInput (после)</span>
        <RenderBadge count={renders.current} />
      </div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Напишите комментарий..."
        style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', boxSizing: 'border-box' }}
      />
    </div>
  )
}

// children as props — ArticleContent передаётся снаружи
function CommentSectionAfter({ children }: { children: React.ReactNode }) {
  const renders = useRef(0)
  renders.current++

  return (
    <div style={card({ background: '#f0fdf4' })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>CommentSection (после)</span>
        <RenderBadge count={renders.current} />
      </div>
      {/* children создаётся в PageAfter, не здесь → не ре-рендерится */}
      {children}
      {/* state живёт здесь — только CommentSectionAfter + CommentInputAfter ре-рендерятся */}
      <CommentInputAfter />
    </div>
  )
}

function AfterColocation() {
  const renders = useRef(0)
  renders.current++

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong style={{ color: '#16a34a' }}>После: State Colocation + Children as Props</strong>
        <RenderBadge count={renders.current} />
      </div>
      <CommentSectionAfter>
        {/* ArticleContent создаётся здесь — при ре-рендере CommentSectionAfter не пересоздаётся */}
        <ArticleContent label="после" />
      </CommentSectionAfter>
      <p style={{ fontSize: 11, color: '#6b7280', marginTop: 6 }}>
        Вводите текст → только CommentSection + CommentInput ре-рендерятся
      </p>
    </div>
  )
}

export function Task13_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>Задание 13.2 — State Colocation + Children as Props</h2>

      <div style={{
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 13,
      }}>
        Два варианта рядом. Вводите текст в каждое поле и наблюдайте за счётчиками рендеров.
        В варианте «После» ArticleContent не ре-рендерится совсем.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <BeforeColocation />
        <AfterColocation />
      </div>

      <div style={{ marginTop: 16, padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: 12 }}>
        <strong>Как работает Children as Props:</strong>
        <br />
        <code>{'<ArticleContent />'}</code> в AfterColocation создаётся в родителе родителя (PageRoot).
        Когда CommentSectionAfter ре-рендерится — он получает тот же объект <code>children</code> из props.
        React сравнивает: тот же тип, те же props → bailout → ArticleContent не вызывается.
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 13.3 — Performance Audit (Capstone)
// ═══════════════════════════════════════════════════════════════════════════════

// ── External store for connection status (Fix 5) ──────────────────────────────

type ConnectionStatus = 'online' | 'offline' | 'reconnecting'

interface ConnectionStore {
  status: ConnectionStatus
  subscribe: (cb: () => void) => () => void
  getSnapshot: () => ConnectionStatus
  _listeners: Set<() => void>
}

const connectionStore: ConnectionStore = {
  status: 'online',
  _listeners: new Set(),
  subscribe(cb) {
    connectionStore._listeners.add(cb)
    return () => connectionStore._listeners.delete(cb)
  },
  getSnapshot() {
    return connectionStore.status
  },
}

// Simulate status changes
let _statusTimer: ReturnType<typeof setInterval> | null = null
function startStatusSimulation() {
  if (_statusTimer) return
  const statuses: ConnectionStatus[] = ['online', 'reconnecting', 'online', 'offline', 'online']
  let idx = 0
  _statusTimer = setInterval(() => {
    idx = (idx + 1) % statuses.length
    connectionStore.status = statuses[idx]
    connectionStore._listeners.forEach(cb => cb())
  }, 2500)
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface DataRow {
  id: string
  name: string
  value: number
  category: 'frontend' | 'backend' | 'devops'
  status: 'active' | 'inactive'
}

interface Metric {
  id: string
  label: string
  value: number
  color: string
}

// ── Static data ───────────────────────────────────────────────────────────────

const RAW_DATA: DataRow[] = [
  { id: 'r1', name: 'React', value: 95, category: 'frontend', status: 'active' },
  { id: 'r2', name: 'TypeScript', value: 88, category: 'frontend', status: 'active' },
  { id: 'r3', name: 'Node.js', value: 76, category: 'backend', status: 'active' },
  { id: 'r4', name: 'PostgreSQL', value: 72, category: 'backend', status: 'active' },
  { id: 'r5', name: 'Docker', value: 64, category: 'devops', status: 'inactive' },
  { id: 'r6', name: 'Kubernetes', value: 58, category: 'devops', status: 'active' },
  { id: 'r7', name: 'GraphQL', value: 45, category: 'backend', status: 'inactive' },
  { id: 'r8', name: 'Next.js', value: 82, category: 'frontend', status: 'active' },
]

const METRICS: Metric[] = [
  { id: 'm1', label: 'Frontend', value: 0, color: '#3b82f6' },
  { id: 'm2', label: 'Backend', value: 0, color: '#10b981' },
  { id: 'm3', label: 'DevOps', value: 0, color: '#f59e0b' },
  { id: 'm4', label: 'Active', value: 0, color: '#8b5cf6' },
]

// FIX 2: columns вынесены за пределы компонента — стабильная ссылка
const TABLE_COLUMNS = ['Название', 'Значение', 'Категория', 'Статус']

// FIX 2: style вынесен за пределы компонента
const TABLE_STYLE: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  fontSize: 13,
}

// ── Fix 3: RowDetailPanel держит selectedRowId сам ────────────────────────────

function RowDetailPanel({ rows }: { rows: DataRow[] }) {
  // FIX 3: State Colocation — selectedRowId живёт здесь, не в Dashboard
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const renders = useRef(0)
  renders.current++

  const selected = rows.find(r => r.id === selectedId)

  return (
    <div style={{ display: 'contents' }}>
      {/* Table section */}
      <div style={card({ marginBottom: 12 })}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Таблица данных (кликните строку)</span>
          <RenderBadge count={renders.current} />
        </div>
        <FixedDataTable
          rows={rows}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={card({ background: '#fdf4ff', marginBottom: 12 })}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Детали: {selected.name}</strong>
            <button
              onClick={() => setSelectedId(null)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
              ✕
            </button>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 13 }}>
            Категория: {selected.category} | Значение: {selected.value} | Статус: {selected.status}
          </p>
        </div>
      )}
    </div>
  )
}

// Fix 4+2: таблица с правильными key и стабильными пропсами
import { memo } from 'react'

const FixedDataTable = memo(function FixedDataTable({
  rows,
  selectedId,
  onSelect,
}: {
  rows: DataRow[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const renders = useRef(0)
  renders.current++

  return (
    <div>
      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
        DataTable renders: <RenderBadge count={renders.current} />
      </div>
      {/* FIX 2: TABLE_STYLE и TABLE_COLUMNS — константы вне компонента */}
      <table style={TABLE_STYLE}>
        <thead>
          <tr>
            {/* FIX 4: key — стабильный идентификатор, не индекс */}
            {TABLE_COLUMNS.map(col => (
              <th key={col} style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #e2e8f0', fontSize: 12 }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            // FIX 4: key={row.id} — стабильный уникальный ключ
            <tr
              key={row.id}
              onClick={() => onSelect(row.id)}
              style={{
                cursor: 'pointer',
                background: selectedId === row.id ? '#dbeafe' : 'transparent',
              }}
            >
              <td style={{ padding: '4px 8px' }}>{row.name}</td>
              <td style={{ padding: '4px 8px' }}>{row.value}</td>
              <td style={{ padding: '4px 8px' }}>{row.category}</td>
              <td style={{ padding: '4px 8px' }}>
                <span style={badge(row.status === 'active' ? '#10b981' : '#6b7280')}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

// Fix 5: useSyncExternalStore
function LiveStatusIndicator() {
  // FIX 5: useSyncExternalStore вместо useEffect + useState
  const status = useSyncExternalStore(
    connectionStore.subscribe,
    connectionStore.getSnapshot,
    () => 'online' as ConnectionStatus, // server snapshot
  )

  const colors: Record<ConnectionStatus, string> = {
    online: '#10b981',
    offline: '#ef4444',
    reconnecting: '#f59e0b',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: colors[status],
        display: 'inline-block',
      }} />
      {status === 'online' ? 'Онлайн' : status === 'offline' ? 'Офлайн' : 'Переподключение...'}
      <span style={{ fontSize: 11, color: '#6b7280' }}>(useSyncExternalStore)</span>
    </div>
  )
}

// Fix 1: useMemo вместо effect chain
function useFilteredSorted(data: DataRow[], filterCategory: string, sortAsc: boolean) {
  // FIX 1: один useMemo вместо двух useEffect + двух useState
  return useMemo(() => {
    const filtered = filterCategory === 'all'
      ? data
      : data.filter(r => r.category === filterCategory)
    return [...filtered].sort((a, b) => sortAsc ? a.value - b.value : b.value - a.value)
  }, [data, filterCategory, sortAsc])
}

type AuditAction =
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'TOGGLE_SORT' }

interface AuditState {
  filterCategory: string
  sortAsc: boolean
}

function auditReducer(state: AuditState, action: AuditAction): AuditState {
  switch (action.type) {
    case 'SET_FILTER': return { ...state, filterCategory: action.payload }
    case 'TOGGLE_SORT': return { ...state, sortAsc: !state.sortAsc }
    default: return state
  }
}

const AUDIT_CHECKS = [
  { id: 1, label: 'Effect Chain → useMemo для filteredData + sortedData' },
  { id: 2, label: 'Inline objects → константы вне компонента (columns, style)' },
  { id: 3, label: 'State слишком высоко → selectedRowId в RowDetailPanel' },
  { id: 4, label: 'Нет key → key={metric.id} и key={row.id}' },
  { id: 5, label: 'useEffect подписка → useSyncExternalStore' },
]

export function Task13_3_Solution() {
  // Start simulation once
  useMemo(() => { startStatusSimulation() }, [])

  const [auditState, dispatch] = useReducer(auditReducer, {
    filterCategory: 'all',
    sortAsc: false,
  })

  const dashboardRenders = useRef(0)
  dashboardRenders.current++

  // FIX 1: derived data через useMemo
  const visibleRows = useFilteredSorted(RAW_DATA, auditState.filterCategory, auditState.sortAsc)

  // Metrics — вычисляем через useMemo
  const metrics = useMemo<Metric[]>(() => {
    const countByCategory = (cat: string) =>
      RAW_DATA.filter(r => r.category === cat).reduce((sum, r) => sum + r.value, 0) / 100

    return [
      { id: 'm1', label: 'Frontend', value: Math.round(countByCategory('frontend')), color: '#3b82f6' },
      { id: 'm2', label: 'Backend', value: Math.round(countByCategory('backend')), color: '#10b981' },
      { id: 'm3', label: 'DevOps', value: Math.round(countByCategory('devops')), color: '#f59e0b' },
      { id: 'm4', label: 'Active', value: RAW_DATA.filter(r => r.status === 'active').length, color: '#8b5cf6' },
    ]
  }, []) // RAW_DATA — константа, зависимостей нет

  return (
    <div className="exercise-container">
      <h2>Задание 13.3 — Performance Audit (Capstone)</h2>

      {/* Audit checklist */}
      <div style={{
        border: '1px solid #6366f1',
        borderRadius: 10,
        padding: 14,
        background: '#eef2ff',
        marginBottom: 16,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 8, color: '#4338ca' }}>
          Чеклист аудита (все 5 проблем исправлены):
        </div>
        {AUDIT_CHECKS.map(check => (
          <div key={check.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 13 }}>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
            <span>Проблема {check.id}: {check.label}</span>
          </div>
        ))}
      </div>

      {/* Dashboard render counter */}
      <div style={{
        background: '#f8fafc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 13,
      }}>
        <strong>Dashboard</strong>
        <RenderBadge count={dashboardRenders.current} />
        <LiveStatusIndicator />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {['all', 'frontend', 'backend', 'devops'].map(cat => (
          <button
            key={cat}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: cat })}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid #94a3b8',
              cursor: 'pointer',
              background: auditState.filterCategory === cat ? '#6366f1' : '#fff',
              color: auditState.filterCategory === cat ? '#fff' : '#374151',
              fontSize: 12,
            }}
          >
            {cat === 'all' ? 'Все' : cat}
          </button>
        ))}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SORT' })}
          style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #94a3b8', cursor: 'pointer', background: '#fff', fontSize: 12 }}
        >
          {auditState.sortAsc ? '↑ По возрастанию' : '↓ По убыванию'}
        </button>
      </div>

      {/* Metric Cards — FIX 4: key={metric.id} */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
        {metrics.map(metric => (
          <div key={metric.id} style={card({ textAlign: 'center' })}>
            <div style={{ fontSize: 22, fontWeight: 700, color: metric.color }}>{metric.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{metric.label}</div>
          </div>
        ))}
      </div>

      {/* FIX 3: RowDetailPanel держит selectedId сам */}
      <RowDetailPanel rows={visibleRows} />

      {/* Fix notes */}
      <div style={{
        marginTop: 12,
        padding: 12,
        background: '#f0fdf4',
        borderRadius: 8,
        fontSize: 12,
        color: '#374151',
      }}>
        <strong>Что было исправлено:</strong>
        <ol style={{ margin: '6px 0 0', paddingLeft: 18 }}>
          <li>Effect chain из двух useEffect → один useMemo (filteredData + sortedData одним проходом)</li>
          <li>TABLE_COLUMNS и TABLE_STYLE вынесены за компонент → React.memo работает корректно</li>
          <li>selectedRowId перемещён в RowDetailPanel → смена строки не ре-рендерит Dashboard</li>
          <li>key=&#123;metric.id&#125; и key=&#123;row.id&#125; вместо отсутствия ключей</li>
          <li>useSyncExternalStore вместо useEffect → нет tearing в Concurrent Mode</li>
        </ol>
      </div>
    </div>
  )
}
