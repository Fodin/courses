import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from 'src/hooks'

// Task 8.3: Hook Composition — useDataTable
//
// Implement 3 hooks and compose them into useDataTable.
//
// Hook 1: usePagination(total, pageSize)
//   Returns: { page, totalPages, hasNext, hasPrev, next, prev, goTo, reset }
//
// Hook 2: useSort<T>(data, initialKey, initialDir?)
//   Returns: { sorted, key, dir, toggle }
//   - toggle(key): same key → flip dir; new key → set key, dir='asc'
//   - sorted: useMemo over [...data].sort(...)
//
// Hook 3: useFilter<T>(data, fields)
//   Returns: { filtered, query, setQuery }
//   - filtered: useMemo, case-insensitive search across `fields`
//
// Hook 4: useDataTable<T>(data, fields, pageSize?)
//   Composes all three. On query change → reset pagination to page 1.
//   Returns: { data (current page), total, filter, sort, pagination }

// ─── TODO: implement hooks ────────────────────────────────────────────────────

function usePagination(total: number, pageSize: number) {
  const [page, setPage] = useState(1)
  // TODO: implement
  void total
  void pageSize

  return {
    page,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    next: () => {},
    prev: () => {},
    goTo: (_p: number) => {},
    reset: () => setPage(1),
  }
}

function useSort<T extends Record<string, unknown>>(
  data: T[],
  initialKey: keyof T,
  _initialDir: 'asc' | 'desc' = 'asc'
) {
  const [key, setKey] = useState<keyof T>(initialKey)
  const [dir, setDir] = useState<'asc' | 'desc'>('asc')

  // TODO: compute sorted via useMemo
  const sorted = data

  const toggle = (_newKey: keyof T) => {
    // TODO: implement toggle logic
    void setKey; void setDir
  }

  return { sorted, key, dir, toggle }
}

function useFilter<T extends Record<string, unknown>>(data: T[], fields: (keyof T)[]) {
  const [query, setQuery] = useState('')

  // TODO: compute filtered via useMemo (case-insensitive search)
  const filtered = data

  void fields

  return { filtered, query, setQuery }
}

function useDataTable<T extends Record<string, unknown>>(
  data: T[],
  fields: (keyof T)[],
  pageSize = 10
) {
  const { filtered, query, setQuery } = useFilter(data, fields)
  const { sorted, key, dir, toggle } = useSort(filtered, fields[0])
  const pagination = usePagination(sorted.length, pageSize)

  // TODO: reset pagination when query changes
  useEffect(() => {
    // pagination.reset()
  }, [query])

  // TODO: compute pageData (slice of sorted)
  const pageData = sorted

  return {
    data: pageData,
    total: sorted.length,
    filter: { query, setQuery },
    sort: { key, dir, toggle },
    pagination,
  }
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

type User = {
  id: number
  name: string
  city: string
  age: number
}

const NAMES = ['Алексей', 'Мария', 'Дмитрий', 'Анна', 'Сергей', 'Елена', 'Андрей', 'Ольга', 'Иван', 'Наталья']
const CITIES = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Уфа', 'Самара', 'Краснодар', 'Пермь']

const USERS: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `${NAMES[i % NAMES.length]} ${String.fromCharCode(65 + (i % 26))}.`,
  city: CITIES[i % CITIES.length],
  age: 22 + (i * 7 % 40),
}))

// ─── Main Component ───────────────────────────────────────────────────────────

export function Task8_3() {
  const { t } = useLanguage()
  const fields = useMemo(() => ['name', 'city'] as (keyof User)[], [])
  const { data, total, filter, sort, pagination } = useDataTable(USERS, fields, 8)

  const offset = (pagination.page - 1) * 8

  return (
    <div className="exercise-container">
      <h2>{t('task.8.3')}</h2>

      {/* Search */}
      <div style={{ marginBottom: 12 }}>
        <input
          value={filter.query}
          onChange={e => filter.setQuery(e.target.value)}
          placeholder="Поиск по имени или городу..."
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 8,
            border: '1px solid #d1d5db', fontSize: 14,
            boxSizing: 'border-box', outline: 'none',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', width: 40, color: '#94a3b8' }}>#</th>
              {(['name', 'city', 'age'] as (keyof User)[]).map(col => (
                <th
                  key={col}
                  onClick={() => sort.toggle(col)}
                  style={{
                    padding: '8px 12px', textAlign: 'left', cursor: 'pointer',
                    userSelect: 'none',
                    color: sort.key === col ? '#3b82f6' : '#475569',
                    fontWeight: 700,
                    borderBottom: sort.key === col ? '2px solid #3b82f6' : '2px solid transparent',
                  }}
                >
                  {col === 'name' ? 'Имя' : col === 'city' ? 'Город' : 'Возраст'}
                  {sort.key === col && <span style={{ marginLeft: 4 }}>{sort.dir === 'asc' ? '▲' : '▼'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                  Ничего не найдено
                </td>
              </tr>
            ) : (
              data.map((user, i) => (
                <tr key={user.id} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '7px 12px', color: '#94a3b8', fontSize: 12 }}>{offset + i + 1}</td>
                  <td style={{ padding: '7px 12px', fontWeight: 600 }}>{user.name}</td>
                  <td style={{ padding: '7px 12px', color: '#475569' }}>{user.city}</td>
                  <td style={{ padding: '7px 12px', color: '#64748b' }}>{user.age}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
        <span style={{ color: '#6b7280' }}>
          {total === 0 ? 'Нет записей' : `${offset + 1}–${Math.min(offset + 8, total)} из ${total}`}
          {filter.query && ` (из ${USERS.length})`}
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={pagination.prev}
            disabled={!pagination.hasPrev}
            style={{
              padding: '5px 12px', borderRadius: 6, border: '1px solid #d1d5db',
              background: pagination.hasPrev ? 'white' : '#f3f4f6',
              color: pagination.hasPrev ? '#374151' : '#9ca3af',
              cursor: pagination.hasPrev ? 'pointer' : 'default', fontWeight: 600,
            }}
          >←</button>
          <span style={{ fontWeight: 600 }}>{pagination.page} / {pagination.totalPages}</span>
          <button
            onClick={pagination.next}
            disabled={!pagination.hasNext}
            style={{
              padding: '5px 12px', borderRadius: 6, border: '1px solid #d1d5db',
              background: pagination.hasNext ? 'white' : '#f3f4f6',
              color: pagination.hasNext ? '#374151' : '#9ca3af',
              cursor: pagination.hasNext ? 'pointer' : 'default', fontWeight: 600,
            }}
          >→</button>
        </div>
      </div>

      {/* TODO: implement the 4 hooks above and verify:
          1. Filtering — results narrow down, pagination resets to page 1
          2. Sorting — click column header toggles asc/desc
          3. Pagination — prev/next buttons navigate correctly
          4. Composition — filter → sort → paginate in that order */}
    </div>
  )
}
