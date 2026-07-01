import { memo, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useLanguage } from 'src/hooks'

// Task 13.3: Performance Audit (Capstone)
//
// Перед вами дашборд с ПЯТЬЮ намеренно внедрёнными проблемами производительности.
// Найдите и исправьте каждую. Используйте render counters для подтверждения.
//
// ПРОБЛЕМА 1: Effect Chain (строки ~90-110)
//   rawData → useEffect → setFilteredData → useEffect → setSortedData
//   Два лишних рендера на каждое изменение фильтра.
//   ИСПРАВЛЕНИЕ: заменить на useMemo для filteredData и sortedData.
//
// ПРОБЛЕМА 2: Inline objects ломают React.memo (строки ~130-145)
//   DataTable обёрнут в memo, но columns={['Название', ...]} и style={{ width: '100%' }}
//   создаются заново при каждом рендере родителя.
//   ИСПРАВЛЕНИЕ: вынести columns и style за пределы компонента (константы).
//
// ПРОБЛЕМА 3: State слишком высоко (строки ~155-170)
//   selectedRowId хранится в Dashboard, но нужен только в SelectionSection.
//   При выборе строки ре-рендерится весь Dashboard.
//   ИСПРАВЛЕНИЕ: переместить selectedRowId в SelectionSection (State Colocation).
//
// ПРОБЛЕМА 4: Нет key при рендере списка (строки ~195-205)
//   MetricCards рендерит metrics.map без key.
//   React не может корректно обновлять список при изменении порядка.
//   ИСПРАВЛЕНИЕ: добавить key={metric.id}.
//
// ПРОБЛЕМА 5: useEffect вместо useSyncExternalStore (строки ~215-235)
//   LiveStatusIndicator использует useEffect + useState для подписки на внешний store.
//   В Concurrent Mode это создаёт tearing.
//   ИСПРАВЛЕНИЕ: использовать useSyncExternalStore.

// ─── External store (не трогайте) ─────────────────────────────────────────────

type ConnectionStatus = 'online' | 'offline' | 'reconnecting'

const connectionStore = {
  _status: 'online' as ConnectionStatus,
  _listeners: new Set<() => void>(),
  subscribe(cb: () => void): () => void {
    connectionStore._listeners.add(cb)
    return () => { connectionStore._listeners.delete(cb) }
  },
  getSnapshot(): ConnectionStatus {
    return connectionStore._status
  },
}

// Автоматическое изменение статуса для демонстрации
const statuses: ConnectionStatus[] = ['online', 'reconnecting', 'offline', 'online']
let _simIdx = 0
setInterval(() => {
  _simIdx = (_simIdx + 1) % statuses.length
  connectionStore._status = statuses[_simIdx]
  connectionStore._listeners.forEach(cb => cb())
}, 2500)

// ─── Types ────────────────────────────────────────────────────────────────────

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
}

// ─── Static data ──────────────────────────────────────────────────────────────

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
  { id: 'm1', label: 'Frontend', value: 3 },
  { id: 'm2', label: 'Backend', value: 3 },
  { id: 'm3', label: 'DevOps', value: 2 },
  { id: 'm4', label: 'Active', value: 6 },
]

// ─── DataTable (с намеренной проблемой 2) ─────────────────────────────────────

// TODO: вынести columns и style сюда (за пределы компонента)

const DataTable = memo(function DataTable({
  rows,
  columns,              // ПРОБЛЕМА 2: принимает inline объект — memo бесполезен
  style,                // ПРОБЛЕМА 2: принимает inline объект — memo бесполезен
  selectedId,
  onSelect,
}: {
  rows: DataRow[]
  columns: string[]
  style: React.CSSProperties
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const renders = useRef(0)
  renders.current++

  return (
    <div>
      <span style={{ fontSize: 11, color: '#6b7280' }}>DataTable renders: {renders.current}</span>
      <table style={style}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #e2e8f0' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            // ПРОБЛЕМА 4: нет key! (или i — нестабильный)
            <tr
              onClick={() => onSelect(row.id)}
              style={{ cursor: 'pointer', background: selectedId === row.id ? '#dbeafe' : 'transparent' }}
            >
              <td style={{ padding: '4px 8px' }}>{row.name}</td>
              <td style={{ padding: '4px 8px' }}>{row.value}</td>
              <td style={{ padding: '4px 8px' }}>{row.category}</td>
              <td style={{ padding: '4px 8px' }}>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

// ─── LiveStatusIndicator (с намеренной проблемой 5) ───────────────────────────

function LiveStatusIndicator() {
  // ПРОБЛЕМА 5: useEffect + useState вместо useSyncExternalStore
  const [status, setStatus] = useState<ConnectionStatus>('online')

  useEffect(() => {
    // Ручная подписка через useEffect — tearing в Concurrent Mode!
    const unsubscribe = connectionStore.subscribe(() => {
      setStatus(connectionStore.getSnapshot())
    })
    return unsubscribe
  }, [])

  // TODO: заменить на useSyncExternalStore

  const colors: Record<ConnectionStatus, string> = {
    online: '#10b981',
    offline: '#ef4444',
    reconnecting: '#f59e0b',
  }

  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[status], display: 'inline-block' }} />
      {status}
    </span>
  )
}

// ─── SelectionSection (содержит проблему 3) ───────────────────────────────────

function SelectionSection({
  rows,
  selectedId,            // ПРОБЛЕМА 3: state приходит сверху из Dashboard
  onSelect,
}: {
  rows: DataRow[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  const renders = useRef(0)
  renders.current++

  const selected = rows.find(r => r.id === selectedId)

  return (
    <div>
      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>SelectionSection renders: {renders.current}</div>
      <DataTable
        rows={rows}
        // ПРОБЛЕМА 2: inline объекты — новые ссылки при каждом рендере
        columns={['Название', 'Значение', 'Категория', 'Статус']}
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}
        selectedId={selectedId}
        onSelect={onSelect}
      />
      {selected && (
        <div style={{ marginTop: 8, padding: 10, background: '#fdf4ff', borderRadius: 8, fontSize: 13 }}>
          Выбрано: {selected.name} — {selected.category}, значение: {selected.value}
          <button onClick={() => onSelect(null)} style={{ marginLeft: 8, border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </div>
  )
}

// ─── Dashboard (главный компонент с проблемами 1, 3) ──────────────────────────

export function Task13_3() {
  const { t } = useLanguage()

  const dashRenders = useRef(0)
  dashRenders.current++

  const [filterCategory, setFilterCategory] = useState('all')
  const [sortAsc, setSortAsc] = useState(false)

  // ПРОБЛЕМА 3: selectedRowId слишком высоко — при выборе строки ре-рендерится Dashboard
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)

  // ПРОБЛЕМА 1: Effect chain — два лишних рендера при смене фильтра
  const [filteredData, setFilteredData] = useState<DataRow[]>(RAW_DATA)
  const [sortedData, setSortedData] = useState<DataRow[]>(RAW_DATA)

  useEffect(() => {
    // ПРОБЛЕМА 1: этот эффект вызывает лишний рендер
    setFilteredData(
      filterCategory === 'all'
        ? RAW_DATA
        : RAW_DATA.filter(r => r.category === filterCategory)
    )
  }, [filterCategory])

  useEffect(() => {
    // ПРОБЛЕМА 1: и этот тоже — цепочка из двух рендеров вместо одного
    setSortedData([...filteredData].sort((a, b) => sortAsc ? a.value - b.value : b.value - a.value))
  }, [filteredData, sortAsc])

  // TODO: заменить оба useEffect на один useMemo

  return (
    <div className="exercise-container">
      <h2>{t('task.13.3')}</h2>

      {/* Audit checklist */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13 }}>
        <strong>Найдите и исправьте 5 проблем:</strong>
        <ol style={{ margin: '8px 0 0', paddingLeft: 20 }}>
          <li>[ ] Проблема 1: Effect Chain → useMemo</li>
          <li>[ ] Проблема 2: Inline objects → константы</li>
          <li>[ ] Проблема 3: selectedRowId → State Colocation</li>
          <li>[ ] Проблема 4: нет key → key=&#123;metric.id&#125;</li>
          <li>[ ] Проблема 5: useEffect → useSyncExternalStore</li>
        </ol>
      </div>

      {/* Dashboard render counter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, marginBottom: 12, padding: '6px 12px', background: '#f8fafc', borderRadius: 8 }}>
        <strong>Dashboard renders: {dashRenders.current}</strong>
        <LiveStatusIndicator />
      </div>

      {/* Filter controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {['all', 'frontend', 'backend', 'devops'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #94a3b8', cursor: 'pointer', background: filterCategory === cat ? '#6366f1' : '#fff', color: filterCategory === cat ? '#fff' : '#374151', fontSize: 12 }}
          >
            {cat === 'all' ? 'Все' : cat}
          </button>
        ))}
        <button
          onClick={() => setSortAsc(s => !s)}
          style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #94a3b8', cursor: 'pointer', background: '#fff', fontSize: 12 }}
        >
          {sortAsc ? '↑ Возрастание' : '↓ Убывание'}
        </button>
      </div>

      {/* Metric Cards — ПРОБЛЕМА 4: нет key */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
        {METRICS.map(metric => (
          // TODO: добавить key={metric.id}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{metric.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Selection + Table — ПРОБЛЕМА 3: state слишком высоко */}
      <SelectionSection
        rows={sortedData}
        selectedId={selectedRowId}
        onSelect={setSelectedRowId}
      />
    </div>
  )
}
