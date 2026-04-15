import { useState, useEffect, useRef, useMemo, useCallback, useSyncExternalStore } from 'react'

// ─── Task 8.1 ─────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export function Task8_1_Solution() {
  const [input, setInput] = useState('')
  const [delay, setDelay] = useState(400)
  const debounced = useDebounce(input, delay)
  const setStateCount = useRef(0)
  const prevDebounced = useRef('')

  if (prevDebounced.current !== debounced) {
    setStateCount.current += 1
    prevDebounced.current = debounced
  }

  const isPending = input !== debounced

  return (
    <div className="exercise-container">
      <h2>Задание 8.1: useDebounce</h2>

      <div style={{
        padding: '12px 16px',
        background: '#f0f9ff',
        borderRadius: 8,
        border: '1px solid #bae6fd',
        marginBottom: 20,
        fontSize: 13,
        color: '#0369a1',
        lineHeight: 1.6,
      }}>
        Вводите текст быстро — <strong>debounced значение</strong> обновится только после паузы.
        Счётчик setState растёт только при реальном обновлении, не при каждом keystroke.
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
          Задержка: <span style={{ color: '#3b82f6' }}>{delay}ms</span>
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[200, 400, 800, 1200].map(d => (
            <button
              key={d}
              onClick={() => setDelay(d)}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                background: delay === d ? '#3b82f6' : 'white',
                color: delay === d ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {d}ms
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Введите текст быстро..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            border: `2px solid ${isPending ? '#f59e0b' : '#d1d5db'}`,
            fontSize: 15,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{
          padding: 14,
          borderRadius: 8,
          border: '2px solid #fca5a5',
          background: '#fff5f5',
        }}>
          <div style={{ fontSize: 12, color: '#dc2626', fontWeight: 700, marginBottom: 6 }}>
            Live value (input)
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#374151',
            minHeight: 24,
            wordBreak: 'break-all',
          }}>
            {input || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>пусто</span>}
          </div>
        </div>

        <div style={{
          padding: 14,
          borderRadius: 8,
          border: `2px solid ${isPending ? '#fcd34d' : '#86efac'}`,
          background: isPending ? '#fffbeb' : '#f0fdf4',
          transition: 'all 0.3s',
        }}>
          <div style={{ fontSize: 12, color: isPending ? '#92400e' : '#15803d', fontWeight: 700, marginBottom: 6 }}>
            Debounced value {isPending && <span style={{ color: '#f59e0b' }}>⏳ ожидание...</span>}
          </div>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#374151',
            minHeight: 24,
            wordBreak: 'break-all',
          }}>
            {debounced || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>пусто</span>}
          </div>
        </div>
      </div>

      <div style={{
        padding: '10px 14px',
        background: '#f8fafc',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 13,
      }}>
        <span style={{ color: '#6b7280' }}>
          setState вызовов (debounced):
        </span>
        <span style={{
          fontWeight: 800,
          fontSize: 20,
          color: '#3b82f6',
        }}>
          {setStateCount.current}
        </span>
      </div>

      <div style={{
        marginTop: 16,
        padding: '12px 16px',
        background: '#1e293b',
        borderRadius: 8,
        color: '#e2e8f0',
        fontSize: 12,
        lineHeight: 1.7,
      }}>
        <pre style={{ margin: 0, color: '#a5f3fc' }}>{`function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer) // ← ключевой cleanup!
  }, [value, delay])

  return debounced
}`}</pre>
      </div>
    </div>
  )
}

// ─── Task 8.2 ─────────────────────────────────────────────────────────────────

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }) // нет deps — обновляем после каждого рендера

  return ref.current
}

function useLatestCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(callback: T): T {
  const ref = useRef<T>(callback)

  useEffect(() => {
    ref.current = callback
  })

  return useCallback((...args: Parameters<T>) => ref.current(...args), []) as T
}

export function Task8_2_Solution() {
  const [count, setCount] = useState(0)
  const prev = usePrevious(count)

  // Для демо closure trap
  const [trapCount, setTrapCount] = useState(0)
  const trapLog = useRef<string[]>([])
  const safeLog = useRef<string[]>([])

  // Версия с closure trap
  useEffect(() => {
    const id = setInterval(() => {
      trapLog.current = [`[closure trap] count=${trapCount}`, ...trapLog.current].slice(0, 5)
    }, 1500)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Версия с latest callback
  const safeInterval = useLatestCallback(() => {
    safeLog.current = [`[latest ref] count=${trapCount}`, ...safeLog.current].slice(0, 5)
  })

  useEffect(() => {
    const id = setInterval(safeInterval, 1500)
    return () => clearInterval(id)
  }, [safeInterval])

  const [, forceRender] = useState(0)

  return (
    <div className="exercise-container">
      <h2>Задание 8.2: usePrevious и useLatestCallback</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* usePrevious demo */}
        <div style={{
          padding: 16,
          borderRadius: 10,
          border: '2px solid #bae6fd',
          background: '#f0f9ff',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 12, color: '#0369a1', fontSize: 14 }}>
            usePrevious(count)
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 16, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>предыдущее</div>
              <div style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#94a3b8',
                minWidth: 60,
                textAlign: 'center',
              }}>
                {prev ?? '—'}
              </div>
            </div>
            <div style={{ fontSize: 24, color: '#cbd5e1', alignSelf: 'center' }}>→</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>текущее</div>
              <div style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#0284c7',
                minWidth: 60,
                textAlign: 'center',
              }}>
                {count}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={() => setCount(c => c - 1)}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: 'none',
                background: '#e0f2fe',
                color: '#0369a1',
                fontWeight: 700,
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              −
            </button>
            <button
              onClick={() => setCount(c => c + 1)}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: 'none',
                background: '#0284c7',
                color: 'white',
                fontWeight: 700,
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>

          <div style={{ marginTop: 12, fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>
            При mount: предыдущее = undefined<br />
            ref обновляется ПОСЛЕ рендера → не триггерит лишний рендер
          </div>
        </div>

        {/* useLatestCallback demo */}
        <div style={{
          padding: 16,
          borderRadius: 10,
          border: '2px solid #d8b4fe',
          background: '#faf5ff',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 12, color: '#7c3aed', fontSize: 14 }}>
            useLatestCallback (vs closure trap)
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#374151' }}>trapCount:</span>
            <strong style={{ fontSize: 18, color: '#7c3aed' }}>{trapCount}</strong>
            <button
              onClick={() => { setTrapCount(c => c + 1); forceRender(c => c + 1) }}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                border: 'none',
                background: '#7c3aed',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                marginLeft: 'auto',
              }}
            >
              +1
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>
                ❌ Closure trap
              </div>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: 8,
                fontSize: 11,
                color: '#fca5a5',
                minHeight: 80,
                fontFamily: 'monospace',
              }}>
                {trapLog.current.length === 0
                  ? <span style={{ color: '#475569' }}>подожди 1.5s...</span>
                  : trapLog.current.map((l, i) => <div key={i}>{l}</div>)
                }
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>
                ✅ Latest ref
              </div>
              <div style={{
                background: '#1e293b',
                borderRadius: 6,
                padding: 8,
                fontSize: 11,
                color: '#86efac',
                minHeight: 80,
                fontFamily: 'monospace',
              }}>
                {safeLog.current.length === 0
                  ? <span style={{ color: '#475569' }}>подожди 1.5s...</span>
                  : safeLog.current.map((l, i) => <div key={i}>{l}</div>)
                }
              </div>
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 11, color: '#6b7280' }}>
            Нажми +1 несколько раз → latest ref видит актуальный count
          </div>
        </div>
      </div>

      <div style={{
        padding: '12px 16px',
        background: '#1e293b',
        borderRadius: 8,
        color: '#e2e8f0',
        fontSize: 12,
        lineHeight: 1.7,
      }}>
        <div style={{ color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>Реализации:</div>
        <pre style={{ margin: 0, color: '#a5f3fc', overflowX: 'auto' }}>{`// usePrevious: ref обновляется после рендера
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  useEffect(() => { ref.current = value }) // нет deps!
  return ref.current
}

// useLatestCallback: стабильная обёртка над актуальным колбэком
function useLatestCallback<T extends Function>(callback: T): T {
  const ref = useRef<T>(callback)
  useEffect(() => { ref.current = callback })
  return useCallback((...args) => ref.current(...args), []) as T
}`}</pre>
      </div>
    </div>
  )
}

// ─── Task 8.3 ─────────────────────────────────────────────────────────────────

type SortDir = 'asc' | 'desc'

function usePagination(total: number, pageSize: number) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Корректируем страницу если total уменьшился
  const safePage = Math.min(page, totalPages)

  return {
    page: safePage,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
    next: () => setPage(p => Math.min(totalPages, p + 1)),
    prev: () => setPage(p => Math.max(1, p - 1)),
    goTo: (p: number) => setPage(Math.max(1, Math.min(totalPages, p))),
    reset: () => setPage(1),
  }
}

function useSort<T extends Record<string, unknown>>(
  data: T[],
  initialKey: keyof T,
  initialDir: SortDir = 'asc'
) {
  const [key, setKey] = useState<keyof T>(initialKey)
  const [dir, setDir] = useState<SortDir>(initialDir)

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return dir === 'asc' ? cmp : -cmp
    })
  }, [data, key, dir])

  const toggle = (newKey: keyof T) => {
    if (newKey === key) {
      setDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setKey(newKey)
      setDir('asc')
    }
  }

  return { sorted, key, dir, toggle }
}

function useFilter<T extends Record<string, unknown>>(data: T[], fields: (keyof T)[]) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return data
    const q = query.toLowerCase()
    return data.filter(item =>
      fields.some(f => String(item[f]).toLowerCase().includes(q))
    )
  }, [data, query, fields])

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

  // Сброс пагинации при изменении фильтра
  useEffect(() => {
    pagination.reset()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const offset = (pagination.page - 1) * pageSize
  const pageData = sorted.slice(offset, offset + pageSize)

  return {
    data: pageData,
    total: sorted.length,
    filter: { query, setQuery },
    sort: { key, dir, toggle },
    pagination,
  }
}

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

export function Task8_3_Solution() {
  const fields = useMemo(() => ['name', 'city'] as (keyof User)[], [])
  const { data, total, filter, sort, pagination } = useDataTable(USERS, fields, 8)

  const offset = (pagination.page - 1) * 8

  return (
    <div className="exercise-container">
      <h2>Задание 8.3: Hook Composition — useDataTable</h2>

      <div style={{
        padding: '10px 14px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        fontSize: 12,
        color: '#64748b',
        marginBottom: 16,
      }}>
        usePagination + useSort + useFilter → useDataTable. Три независимых хука, скомпозированных в один.
      </div>

      {/* Фильтр */}
      <div style={{ marginBottom: 12 }}>
        <input
          value={filter.query}
          onChange={e => filter.setQuery(e.target.value)}
          placeholder="Поиск по имени или городу..."
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            fontSize: 14,
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
      </div>

      {/* Таблица */}
      <div style={{ overflowX: 'auto', marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', width: 40, color: '#94a3b8', fontWeight: 600 }}>#</th>
              {(['name', 'city', 'age'] as (keyof User)[]).map(col => (
                <th
                  key={col}
                  onClick={() => sort.toggle(col)}
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    userSelect: 'none',
                    color: sort.key === col ? '#3b82f6' : '#475569',
                    fontWeight: 700,
                    borderBottom: sort.key === col ? '2px solid #3b82f6' : '2px solid transparent',
                    transition: 'color 0.15s',
                  }}
                >
                  {col === 'name' ? 'Имя' : col === 'city' ? 'Город' : 'Возраст'}
                  {sort.key === col && (
                    <span style={{ marginLeft: 4 }}>{sort.dir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontStyle: 'italic' }}>
                  Ничего не найдено
                </td>
              </tr>
            ) : (
              data.map((user, i) => (
                <tr
                  key={user.id}
                  style={{
                    background: i % 2 === 0 ? 'white' : '#f8fafc',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <td style={{ padding: '7px 12px', color: '#94a3b8', fontSize: 12 }}>
                    {offset + i + 1}
                  </td>
                  <td style={{ padding: '7px 12px', fontWeight: 600, color: '#1e293b' }}>{user.name}</td>
                  <td style={{ padding: '7px 12px', color: '#475569' }}>{user.city}</td>
                  <td style={{ padding: '7px 12px', color: '#64748b' }}>{user.age}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
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
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: pagination.hasPrev ? 'white' : '#f3f4f6',
              color: pagination.hasPrev ? '#374151' : '#9ca3af',
              cursor: pagination.hasPrev ? 'pointer' : 'default',
              fontWeight: 600,
            }}
          >
            ←
          </button>
          <span style={{ color: '#374151', fontWeight: 600 }}>
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={pagination.next}
            disabled={!pagination.hasNext}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: pagination.hasNext ? 'white' : '#f3f4f6',
              color: pagination.hasNext ? '#374151' : '#9ca3af',
              cursor: pagination.hasNext ? 'pointer' : 'default',
              fontWeight: 600,
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Task 8.4 ─────────────────────────────────────────────────────────────────

type AntiPattern = {
  id: number
  title: string
  badge: string
  color: string
  bg: string
  borderColor: string
  fixed: boolean
}

// --- Antipattern 1: NotifyParent ---

function NotifyParentBefore({ onLog }: { onLog: (msg: string) => void }) {
  const [isOn, setIsOn] = useState(false)

  // ❌ useEffect для уведомления родителя — двойной рендер
  useEffect(() => {
    onLog(`[❌ Effect] onChange(${isOn})`)
  }, [isOn, onLog])

  return (
    <button
      onClick={() => setIsOn(v => !v)}
      style={{
        padding: '6px 16px',
        borderRadius: 6,
        border: 'none',
        background: isOn ? '#ef4444' : '#22c55e',
        color: 'white',
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: 13,
      }}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  )
}

function NotifyParentAfter({ onLog }: { onLog: (msg: string) => void }) {
  const [isOn, setIsOn] = useState(false)

  return (
    <button
      onClick={() => {
        const next = !isOn
        setIsOn(next)
        onLog(`[✅ Handler] onChange(${next})`) // прямо в event handler
      }}
      style={{
        padding: '6px 16px',
        borderRadius: 6,
        border: 'none',
        background: isOn ? '#ef4444' : '#22c55e',
        color: 'white',
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: 13,
      }}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  )
}

// --- Antipattern 2: EffectChain ---

function EffectChainBefore() {
  const [password, setPassword] = useState('')
  const [trimmed, setTrimmed] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)
  const renderCount = useRef(0)
  renderCount.current += 1

  useEffect(() => { setTrimmed(password.trim()) }, [password])
  useEffect(() => { setError(trimmed.length > 0 && trimmed.length < 8 ? 'Слишком короткий' : '') }, [trimmed])
  useEffect(() => { setIsValid(trimmed.length >= 8 && error === '') }, [trimmed, error])

  return (
    <div>
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Введите пароль..."
        style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, width: '100%', boxSizing: 'border-box' }}
      />
      <div style={{ marginTop: 4, fontSize: 12 }}>
        {error && <span style={{ color: '#dc2626' }}>{error}</span>}
        {isValid && <span style={{ color: '#16a34a' }}>Пароль подходит</span>}
      </div>
      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Рендеров: {renderCount.current}</div>
    </div>
  )
}

function EffectChainAfter() {
  const [password, setPassword] = useState('')
  const renderCount = useRef(0)
  renderCount.current += 1

  // Всё вычисляется при рендере — не надо useState/useEffect
  const trimmed = password.trim()
  const error = trimmed.length > 0 && trimmed.length < 8 ? 'Слишком короткий' : ''
  const isValid = trimmed.length >= 8 && error === ''

  return (
    <div>
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Введите пароль..."
        style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, width: '100%', boxSizing: 'border-box' }}
      />
      <div style={{ marginTop: 4, fontSize: 12 }}>
        {error && <span style={{ color: '#dc2626' }}>{error}</span>}
        {isValid && <span style={{ color: '#16a34a' }}>Пароль подходит</span>}
      </div>
      <div style={{ fontSize: 11, color: '#16a34a', marginTop: 2 }}>Рендеров: {renderCount.current}</div>
    </div>
  )
}

// --- Antipattern 3: ManualSubscription ---

function useScrollYBad(): number {
  const [y, setY] = useState(0)
  useEffect(() => {
    const handler = () => setY(window.scrollY)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return y
}

const scrollSubscribe = (cb: () => void) => {
  window.addEventListener('scroll', cb)
  return () => window.removeEventListener('scroll', cb)
}
const scrollSnapshot = () => Math.round(window.scrollY)

function useScrollYGood(): number {
  return useSyncExternalStore(scrollSubscribe, scrollSnapshot, () => 0)
}

function ManualSubBefore() {
  const y = useScrollYBad()
  return (
    <div style={{ fontSize: 13 }}>
      <span style={{ color: '#dc2626' }}>scrollY (useEffect): </span>
      <strong>{y}px</strong>
    </div>
  )
}

function ManualSubAfter() {
  const y = useScrollYGood()
  return (
    <div style={{ fontSize: 13 }}>
      <span style={{ color: '#16a34a' }}>scrollY (useSyncExternalStore): </span>
      <strong>{y}px</strong>
    </div>
  )
}

// --- Antipattern 4: RedundantState ---

const ITEMS = ['React', 'Vue', 'Angular', 'Svelte', 'Preact', 'SolidJS', 'Qwik', 'Ember', 'Backbone', 'Mithril']

function RedundantStateBefore() {
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState(ITEMS)
  const renderCount = useRef(0)
  renderCount.current += 1

  // ❌ filtered — вычислимо, но хранится в state
  useEffect(() => {
    setFiltered(ITEMS.filter(i => i.toLowerCase().includes(query.toLowerCase())))
  }, [query])

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Фильтр..."
        style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, marginBottom: 6, width: '100%', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {filtered.map(item => (
          <span key={item} style={{ padding: '2px 8px', borderRadius: 12, background: '#fee2e2', color: '#991b1b', fontSize: 12, fontWeight: 600 }}>
            {item}
          </span>
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Рендеров: {renderCount.current}</div>
    </div>
  )
}

function RedundantStateAfter() {
  const [query, setQuery] = useState('')
  const renderCount = useRef(0)
  renderCount.current += 1

  // ✅ useMemo — вычисляем при рендере, без лишнего setState
  const filtered = useMemo(
    () => ITEMS.filter(i => i.toLowerCase().includes(query.toLowerCase())),
    [query]
  )

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Фильтр..."
        style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, marginBottom: 6, width: '100%', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {filtered.map(item => (
          <span key={item} style={{ padding: '2px 8px', borderRadius: 12, background: '#dcfce7', color: '#15803d', fontSize: 12, fontWeight: 600 }}>
            {item}
          </span>
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#16a34a', marginTop: 4 }}>Рендеров: {renderCount.current}</div>
    </div>
  )
}

// ─── Main Task8_4_Solution ────────────────────────────────────────────────────

const ANTIPATTERNS = [
  {
    id: 1,
    name: 'NotifyParent',
    badge: 'Уведомление родителя из Effect',
    problem: 'useEffect запускается после рендера → родитель уведомляется с задержкой, происходит лишний рендер',
    fix: 'Вызвать onChange прямо в event handler — одновременно с setIsOn',
    color: '#dc2626',
    bg: '#fff5f5',
    border: '#fca5a5',
  },
  {
    id: 2,
    name: 'EffectChain',
    badge: 'Цепочка эффектов',
    problem: 'A → B → C через useEffect: 3 эффекта = 3 лишних рендера при каждом keystroke',
    fix: 'Вычислить trimmed/error/isValid при рендере — нет useState, нет useEffect',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fcd34d',
  },
  {
    id: 3,
    name: 'ManualSubscription',
    badge: 'Ручная подписка через useEffect',
    problem: 'mount → effect → setState = лишний рендер; tearing риск в Concurrent Mode',
    fix: 'useSyncExternalStore со стабильными subscribe/getSnapshot вне компонента',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#d8b4fe',
  },
  {
    id: 4,
    name: 'RedundantState',
    badge: 'Избыточное состояние',
    problem: 'filtered вычислим из items+query; хранить в state и синхронизировать через useEffect — лишний рендер',
    fix: 'useMemo(() => items.filter(...), [items, query]) или прямое вычисление при рендере',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
]

export function Task8_4_Solution() {
  const [fixed, setFixed] = useState<Set<number>>(new Set())
  const [log, setLog] = useState<string[]>([])

  const addLog = useCallback((msg: string) => {
    setLog(prev => [msg, ...prev].slice(0, 8))
  }, [])

  const toggle = (id: number) => {
    setFixed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const progress = fixed.size

  return (
    <div className="exercise-container">
      <h2>Задание 8.4: Anti-pattern Gallery (YMNAE Capstone)</h2>

      {/* Scoreboard */}
      <div style={{
        padding: '12px 16px',
        background: '#f8fafc',
        borderRadius: 10,
        border: '1px solid #e2e8f0',
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>
            Прогресс рефакторинга
          </span>
          <span style={{ fontWeight: 800, fontSize: 18, color: progress === 4 ? '#16a34a' : '#3b82f6' }}>
            {progress} / 4
          </span>
        </div>
        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(progress / 4) * 100}%`,
            background: progress === 4 ? '#22c55e' : '#3b82f6',
            borderRadius: 4,
            transition: 'width 0.4s ease',
          }} />
        </div>
        {progress === 4 && (
          <div style={{ marginTop: 8, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
            Все антипаттерны отрефакторены!
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {ANTIPATTERNS.map(ap => {
          const isFixed = fixed.has(ap.id)

          return (
            <div
              key={ap.id}
              style={{
                borderRadius: 10,
                border: `2px solid ${ap.border}`,
                background: ap.bg,
                overflow: 'hidden',
              }}
            >
              <div style={{
                padding: '10px 16px',
                borderBottom: `1px solid ${ap.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                <div>
                  <span style={{ fontWeight: 800, color: ap.color, fontSize: 15, marginRight: 8 }}>
                    #{ap.id} {ap.name}
                  </span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: ap.color,
                    color: 'white',
                  }}>
                    {ap.badge}
                  </span>
                </div>
                <button
                  onClick={() => toggle(ap.id)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 6,
                    border: 'none',
                    background: isFixed ? '#22c55e' : '#e2e8f0',
                    color: isFixed ? 'white' : '#374151',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {isFixed ? '✓ Исправлено' : 'Показать исправление'}
                </button>
              </div>

              <div style={{ padding: '10px 16px' }}>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>Проблема: </span>{ap.problem}
                </div>
                {isFixed && (
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, color: '#16a34a' }}>Решение: </span>{ap.fix}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>
                      ❌ Антипаттерн
                    </div>
                    <div style={{
                      padding: 10,
                      borderRadius: 6,
                      border: '1px solid #fca5a5',
                      background: 'white',
                    }}>
                      {ap.id === 1 && <NotifyParentBefore onLog={addLog} />}
                      {ap.id === 2 && <EffectChainBefore />}
                      {ap.id === 3 && <ManualSubBefore />}
                      {ap.id === 4 && <RedundantStateBefore />}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 6 }}>
                      ✅ {isFixed ? 'Исправленный вариант' : '(нажми кнопку выше)'}
                    </div>
                    <div style={{
                      padding: 10,
                      borderRadius: 6,
                      border: `1px solid ${isFixed ? '#86efac' : '#e2e8f0'}`,
                      background: isFixed ? 'white' : '#f8fafc',
                      opacity: isFixed ? 1 : 0.5,
                      filter: isFixed ? 'none' : 'blur(1px)',
                      transition: 'all 0.3s',
                    }}>
                      {ap.id === 1 && <NotifyParentAfter onLog={addLog} />}
                      {ap.id === 2 && <EffectChainAfter />}
                      {ap.id === 3 && <ManualSubAfter />}
                      {ap.id === 4 && <RedundantStateAfter />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Log panel for NotifyParent */}
      {log.length > 0 && (
        <div style={{
          marginTop: 16,
          padding: '10px 14px',
          background: '#1e293b',
          borderRadius: 8,
          color: '#e2e8f0',
          fontSize: 12,
          fontFamily: 'monospace',
        }}>
          <div style={{ color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>
            Лог вызовов onChange:
          </div>
          {log.map((l, i) => (
            <div key={i} style={{ color: l.includes('Handler') ? '#86efac' : '#fca5a5' }}>
              {l}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
