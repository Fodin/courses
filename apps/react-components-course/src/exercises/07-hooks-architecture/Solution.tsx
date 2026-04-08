import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

// ============================================
// Task 7.1 Solution: useAsync → useApi → UserSearch
// ============================================

// --- Types ---

interface AsyncState<T> {
  loading: boolean
  data: T | null
  error: string | null
}

interface JsonPlaceholderUser {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: { name: string }
}

// --- useAsync: base hook for any async operation ---

function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    loading: false,
    data: null,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    setState({ loading: true, data: null, error: null })

    fn()
      .then(data => {
        if (!cancelled) setState({ loading: false, data, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
          setState({ loading: false, data: null, error: message })
        }
      })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}

// --- useApi: specialised hook with AbortController ---

function useApi<T>(url: string): AsyncState<T> & { refetch: () => void } {
  const [revision, setRevision] = useState(0)
  const abortRef = useRef<AbortController | null>(null)

  const state = useAsync<T>(() => {
    if (!url) return Promise.resolve(null as unknown as T)

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    return fetch(url, { signal: abortRef.current.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`)
        return r.json() as Promise<T>
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') {
          return new Promise<T>(() => {}) // pending — don't update state
        }
        throw err
      })
  }, [url, revision])

  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  const refetch = useCallback(() => setRevision(r => r + 1), [])

  return { ...state, refetch }
}

// --- UserSearch component ---

export function Task7_1_Solution() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  const url = submittedQuery
    ? `https://jsonplaceholder.typicode.com/users?_limit=10`
    : 'https://jsonplaceholder.typicode.com/users'

  const { loading, data: users, error, refetch } = useApi<JsonPlaceholderUser[]>(url)

  const filteredUsers = useMemo(() => {
    if (!users) return []
    if (!submittedQuery) return users
    const q = submittedQuery.toLowerCase()
    return users.filter(
      u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    )
  }, [users, submittedQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedQuery(query)
    refetch()
  }

  return (
    <div className="exercise-container">
      <h2>Решение 7.1: useAsync → useApi → UserSearch</h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Хук <code>useAsync&lt;T&gt;</code> защищён от race condition через флаг cancelled.
        Хук <code>useApi&lt;T&gt;</code> добавляет <code>AbortController</code> для отмены предыдущих запросов.
        Компонент только рендерит.
      </p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск по имени или email..."
          style={{
            flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ddd',
            borderRadius: '6px', fontSize: '0.9rem',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem', background: '#1976d2', color: '#fff',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
          }}
        >
          Найти
        </button>
        <button
          type="button"
          onClick={() => { setQuery(''); setSubmittedQuery(''); refetch() }}
          style={{
            padding: '0.5rem 1rem', background: '#f5f5f5', color: '#555',
            border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer',
          }}
        >
          Сбросить
        </button>
      </form>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          Загрузка...
        </div>
      )}

      {error && (
        <div style={{
          padding: '0.75rem 1rem', background: '#ffebee', border: '1px solid #ef9a9a',
          borderRadius: '6px', color: '#c62828', marginBottom: '1rem',
        }}>
          Ошибка: {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          {filteredUsers.length === 0 && submittedQuery && (
            <p style={{ color: '#999', textAlign: 'center', padding: '1rem' }}>
              Ничего не найдено по запросу «{submittedQuery}»
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredUsers.map(user => (
              <div
                key={user.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.75rem 1rem', border: '1px solid #eee',
                  borderRadius: '8px', background: '#fafafa',
                }}
              >
                <div
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: '#1976d2', color: '#fff', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0,
                  }}
                >
                  {user.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>{user.email}</div>
                </div>
                <div style={{ color: '#999', fontSize: '0.75rem' }}>{user.company.name}</div>
              </div>
            ))}
          </div>
          {filteredUsers.length > 0 && (
            <div style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.75rem', textAlign: 'right' }}>
              {filteredUsers.length} пользователей
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 7.2 Solution: useForm — форма как состояние
// ============================================

// --- useForm types ---

type Validator<T> = (values: T) => Partial<Record<keyof T, string>>

interface FormReturn<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  handleChange: (field: keyof T, value: unknown) => void
  handleBlur: (field: keyof T) => void
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e: React.FormEvent) => void
  reset: () => void
}

// --- useForm hook ---

function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validate?: Validator<T>
): FormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const runValidation = useCallback((vals: T): Partial<Record<keyof T, string>> => {
    return validate ? validate(vals) : {}
  }, [validate])

  const handleChange = useCallback((field: keyof T, value: unknown) => {
    setValues(prev => {
      const next = { ...prev, [field]: value }
      // Validate the changed field if it's already been touched
      setTouched(t => {
        if (t[field]) {
          const errs = validate ? validate(next) : {}
          setErrors(e => ({ ...e, [field]: (errs as Partial<Record<keyof T, string>>)[field] }))
        }
        return t
      })
      return next
    })
  }, [validate])

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    setValues(vals => {
      const errs = runValidation(vals)
      setErrors(prev => ({ ...prev, [field]: errs[field] }))
      return vals
    })
  }, [runValidation])

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) =>
    (e: React.FormEvent) => {
      e.preventDefault()

      setValues(currentValues => {
        // Mark all fields as touched
        const allTouched = (Object.keys(currentValues) as Array<keyof T>).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {} as Partial<Record<keyof T, boolean>>
        )
        setTouched(allTouched)

        const validationErrors = runValidation(currentValues)
        setErrors(validationErrors)

        const hasErrors = Object.values(validationErrors).some(Boolean)
        if (!hasErrors) {
          setIsSubmitting(true)
          Promise.resolve(onSubmit(currentValues)).finally(() => setIsSubmitting(false))
        }

        return currentValues
      })
    },
    [runValidation]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset }
}

// --- Registration form using useForm ---

interface RegistrationValues extends Record<string, unknown> {
  name: string
  email: string
  password: string
}

const registrationInitial: RegistrationValues = { name: '', email: '', password: '' }

function validateRegistration(values: RegistrationValues): Partial<Record<keyof RegistrationValues, string>> {
  const errors: Partial<Record<keyof RegistrationValues, string>> = {}
  if (!values.name.trim()) errors.name = 'Имя обязательно'
  else if (values.name.trim().length < 2) errors.name = 'Минимум 2 символа'
  if (!values.email) errors.email = 'Email обязателен'
  else if (!values.email.includes('@') || !values.email.includes('.')) errors.email = 'Некорректный email'
  if (!values.password) errors.password = 'Пароль обязателен'
  else if (values.password.length < 6) errors.password = 'Минимум 6 символов'
  return errors
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.5rem 0.75rem',
  border: '1px solid #ddd', borderRadius: '6px',
  fontSize: '0.9rem', boxSizing: 'border-box',
}

const errorStyle: React.CSSProperties = {
  color: '#c62828', fontSize: '0.78rem', marginTop: '0.2rem',
}

export function Task7_2_Solution() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm<RegistrationValues>(registrationInitial, validateRegistration)

  const onSubmit = async (values: RegistrationValues) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    setSuccessMessage(`Аккаунт для ${values.name} (${values.email}) создан!`)
    form.reset()
  }

  const fieldBorderColor = (field: keyof RegistrationValues) => {
    if (form.touched[field] && form.errors[field]) return '#e53935'
    if (form.touched[field] && !form.errors[field]) return '#43a047'
    return '#ddd'
  }

  return (
    <div className="exercise-container">
      <h2>Решение 7.2: useForm — форма как состояние</h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Весь <code>useForm</code> знает о валидации, touched и isSubmitting.
        Компонент только связывает поля с хуком и рендерит ошибки.
      </p>

      {successMessage && (
        <div style={{
          padding: '0.75rem 1rem', background: '#e8f5e9', border: '1px solid #a5d6a7',
          borderRadius: '6px', color: '#2e7d32', marginBottom: '1rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '1rem' }}
          >
            ×
          </button>
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <div>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.3rem', fontSize: '0.9rem' }}>
            Имя
          </label>
          <input
            value={form.values.name}
            onChange={e => form.handleChange('name', e.target.value)}
            onBlur={() => form.handleBlur('name')}
            placeholder="Иван Иванов"
            style={{ ...inputStyle, borderColor: fieldBorderColor('name') }}
          />
          {form.touched.name && form.errors.name && (
            <div style={errorStyle}>{form.errors.name}</div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.3rem', fontSize: '0.9rem' }}>
            Email
          </label>
          <input
            type="email"
            value={form.values.email}
            onChange={e => form.handleChange('email', e.target.value)}
            onBlur={() => form.handleBlur('email')}
            placeholder="ivan@example.com"
            style={{ ...inputStyle, borderColor: fieldBorderColor('email') }}
          />
          {form.touched.email && form.errors.email && (
            <div style={errorStyle}>{form.errors.email}</div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.3rem', fontSize: '0.9rem' }}>
            Пароль
          </label>
          <input
            type="password"
            value={form.values.password}
            onChange={e => form.handleChange('password', e.target.value)}
            onBlur={() => form.handleBlur('password')}
            placeholder="Минимум 6 символов"
            style={{ ...inputStyle, borderColor: fieldBorderColor('password') }}
          />
          {form.touched.password && form.errors.password && (
            <div style={errorStyle}>{form.errors.password}</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="submit"
            disabled={form.isSubmitting}
            style={{
              flex: 1, padding: '0.6rem', borderRadius: '6px', border: 'none',
              background: form.isSubmitting ? '#90caf9' : '#1976d2',
              color: '#fff', cursor: form.isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: 500, fontSize: '0.9rem',
            }}
          >
            {form.isSubmitting ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
          </button>
          <button
            type="button"
            onClick={form.reset}
            style={{
              padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #ddd',
              background: '#f5f5f5', color: '#555', cursor: 'pointer', fontSize: '0.9rem',
            }}
          >
            Сброс
          </button>
        </div>
      </form>

      <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#f5f5f5', borderRadius: '6px', fontSize: '0.8rem', color: '#555' }}>
        <strong>Текущее состояние формы:</strong>
        <pre style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', overflow: 'auto' }}>
          {JSON.stringify({ values: form.values, errors: form.errors, touched: form.touched }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Task 7.3 Solution: usePagination + useFilters + useSorting → useDataTable
// ============================================

// --- usePagination ---

interface PaginationState {
  page: number
  totalPages: number
  offset: number
  pageSize: number
  hasPrev: boolean
  hasNext: boolean
  goTo: (page: number) => void
  next: () => void
  prev: () => void
}

function usePagination(totalItems: number, pageSize: number): PaginationState {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // Reset to first page if current page is out of bounds
  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  const goTo = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }, [totalPages])

  const next = useCallback(() => setPage(p => Math.min(p + 1, totalPages)), [totalPages])
  const prev = useCallback(() => setPage(p => Math.max(p - 1, 1)), [])

  const offset = (page - 1) * pageSize

  return { page, totalPages, offset, pageSize, hasPrev: page > 1, hasNext: page < totalPages, goTo, next, prev }
}

// --- useSorting ---

interface SortingState<T> {
  field: keyof T | null
  direction: 'asc' | 'desc'
  toggleSort: (field: keyof T) => void
  sort: (items: T[]) => T[]
}

function useSorting<T>(): SortingState<T> {
  const [field, setField] = useState<keyof T | null>(null)
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc')

  const toggleSort = useCallback((f: keyof T) => {
    setField(prev => {
      if (prev === f) {
        setDirection(d => d === 'asc' ? 'desc' : 'asc')
        return f
      }
      setDirection('asc')
      return f
    })
  }, [])

  const sort = useCallback((items: T[]): T[] => {
    if (!field) return items
    return [...items].sort((a, b) => {
      const av = a[field]
      const bv = b[field]
      let cmp = 0
      if (typeof av === 'string' && typeof bv === 'string') {
        cmp = av.localeCompare(bv, 'ru')
      } else if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv
      }
      return direction === 'asc' ? cmp : -cmp
    })
  }, [field, direction])

  return { field, direction, toggleSort, sort }
}

// --- useFilters ---

interface FiltersState<F> {
  values: F
  setFilter: <K extends keyof F>(key: K, value: F[K]) => void
  resetFilters: () => void
}

function useFilters<F extends Record<string, unknown>>(initialFilters: F): FiltersState<F> {
  const [values, setValues] = useState<F>(initialFilters)

  const setFilter = useCallback(<K extends keyof F>(key: K, value: F[K]) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => setValues(initialFilters), [initialFilters])

  return { values, setFilter, resetFilters }
}

// --- useDataTable ---

interface DataTableOptions<T, F extends Record<string, unknown>> {
  pageSize?: number
  initialFilters: F
  filterFn: (item: T, filters: F) => boolean
}

interface DataTableReturn<T, F extends Record<string, unknown>> {
  pageData: T[]
  pagination: PaginationState
  sorting: SortingState<T>
  filters: FiltersState<F>
  totalCount: number
}

function useDataTable<T, F extends Record<string, unknown>>(
  data: T[],
  options: DataTableOptions<T, F>
): DataTableReturn<T, F> {
  const { pageSize = 10, initialFilters, filterFn } = options

  const sorting = useSorting<T>()
  const filters = useFilters<F>(initialFilters)

  const filtered = useMemo(
    () => data.filter(item => filterFn(item, filters.values)),
    [data, filters.values, filterFn]
  )

  const sorted = useMemo(
    () => sorting.sort(filtered),
    [filtered, sorting.sort]
  )

  const pagination = usePagination(sorted.length, pageSize)

  // Reset to page 1 when filters change
  useEffect(() => {
    pagination.goTo(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.values])

  const pageData = useMemo(
    () => sorted.slice(pagination.offset, pagination.offset + pageSize),
    [sorted, pagination.offset, pageSize]
  )

  return { pageData, pagination, sorting, filters, totalCount: filtered.length }
}

// --- Demo data ---

interface Employee {
  id: number
  name: string
  department: string
  salary: number
  level: string
}

const EMPLOYEES: Employee[] = [
  { id: 1,  name: 'Алексей Волков',     department: 'Разработка', salary: 180000, level: 'Senior' },
  { id: 2,  name: 'Мария Петрова',      department: 'Дизайн',     salary: 130000, level: 'Middle' },
  { id: 3,  name: 'Дмитрий Смирнов',   department: 'Разработка', salary: 220000, level: 'Lead'   },
  { id: 4,  name: 'Елена Козлова',      department: 'Маркетинг',  salary: 110000, level: 'Middle' },
  { id: 5,  name: 'Иван Новиков',       department: 'Разработка', salary: 95000,  level: 'Junior' },
  { id: 6,  name: 'Ольга Соколова',     department: 'HR',         salary: 100000, level: 'Middle' },
  { id: 7,  name: 'Сергей Морозов',     department: 'Дизайн',     salary: 155000, level: 'Senior' },
  { id: 8,  name: 'Анна Лебедева',      department: 'Маркетинг',  salary: 125000, level: 'Senior' },
  { id: 9,  name: 'Павел Орлов',        department: 'Разработка', salary: 160000, level: 'Middle' },
  { id: 10, name: 'Наталья Федорова',   department: 'HR',         salary: 85000,  level: 'Junior' },
  { id: 11, name: 'Максим Зайцев',      department: 'Разработка', salary: 200000, level: 'Senior' },
  { id: 12, name: 'Юлия Белова',        department: 'Дизайн',     salary: 80000,  level: 'Junior' },
  { id: 13, name: 'Андрей Козлов',      department: 'Маркетинг',  salary: 145000, level: 'Senior' },
  { id: 14, name: 'Светлана Горбунова', department: 'HR',         salary: 90000,  level: 'Middle' },
  { id: 15, name: 'Николай Тихонов',    department: 'Разработка', salary: 115000, level: 'Junior' },
  { id: 16, name: 'Ксения Блинова',     department: 'Дизайн',     salary: 165000, level: 'Lead'   },
  { id: 17, name: 'Роман Крылов',       department: 'Маркетинг',  salary: 100000, level: 'Junior' },
  { id: 18, name: 'Виктория Яковлева',  department: 'Разработка', salary: 250000, level: 'Lead'   },
]

const DEPARTMENTS = ['', 'Разработка', 'Дизайн', 'Маркетинг', 'HR']

interface EmployeeFilters extends Record<string, unknown> {
  department: string
  level: string
}

const initialEmployeeFilters: EmployeeFilters = { department: '', level: '' }

function employeeFilterFn(item: Employee, filters: EmployeeFilters): boolean {
  if (filters.department && item.department !== filters.department) return false
  if (filters.level && item.level !== filters.level) return false
  return true
}

const LEVELS = ['', 'Junior', 'Middle', 'Senior', 'Lead']

const thStyle: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  textAlign: 'left',
  background: '#f5f5f5',
  fontWeight: 600,
  fontSize: '0.85rem',
  borderBottom: '2px solid #e0e0e0',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  userSelect: 'none',
}

const tdStyle: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  fontSize: '0.85rem',
  borderBottom: '1px solid #f0f0f0',
}

const LEVEL_COLORS: Record<string, string> = {
  Junior: '#1565c0',
  Middle: '#2e7d32',
  Senior: '#e65100',
  Lead:   '#6a1b9a',
}

export function Task7_3_Solution() {
  const table = useDataTable<Employee, EmployeeFilters>(EMPLOYEES, {
    pageSize: 5,
    initialFilters: initialEmployeeFilters,
    filterFn: employeeFilterFn,
  })

  const sortIcon = (field: keyof Employee) => {
    if (table.sorting.field !== field) return ' ↕'
    return table.sorting.direction === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div className="exercise-container">
      <h2>Решение 7.3: useDataTable = usePagination + useFilters + useSorting</h2>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Три независимых хука скомпозированы в <code>useDataTable</code>.
        Компонент получает готовые данные и управляющие функции — только рендерит.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <select
          value={table.filters.values.department}
          onChange={e => table.filters.setFilter('department', e.target.value)}
          style={{
            padding: '0.4rem 0.75rem', border: '1px solid #ddd',
            borderRadius: '6px', fontSize: '0.85rem', background: '#fff',
          }}
        >
          {DEPARTMENTS.map(d => (
            <option key={d} value={d}>{d || 'Все отделы'}</option>
          ))}
        </select>

        <select
          value={table.filters.values.level}
          onChange={e => table.filters.setFilter('level', e.target.value)}
          style={{
            padding: '0.4rem 0.75rem', border: '1px solid #ddd',
            borderRadius: '6px', fontSize: '0.85rem', background: '#fff',
          }}
        >
          {LEVELS.map(l => (
            <option key={l} value={l}>{l || 'Все уровни'}</option>
          ))}
        </select>

        {(table.filters.values.department || table.filters.values.level) && (
          <button
            onClick={table.filters.resetFilters}
            style={{
              padding: '0.4rem 0.75rem', border: '1px solid #ddd',
              borderRadius: '6px', fontSize: '0.85rem', background: '#fff',
              cursor: 'pointer', color: '#555',
            }}
          >
            Сбросить фильтры
          </button>
        )}

        <span style={{ color: '#999', fontSize: '0.85rem', alignSelf: 'center', marginLeft: 'auto' }}>
          Найдено: {table.totalCount} из {EMPLOYEES.length}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
          <thead>
            <tr>
              <th style={thStyle} onClick={() => table.sorting.toggleSort('name')}>
                Имя{sortIcon('name')}
              </th>
              <th style={thStyle} onClick={() => table.sorting.toggleSort('department')}>
                Отдел{sortIcon('department')}
              </th>
              <th style={thStyle} onClick={() => table.sorting.toggleSort('level')}>
                Уровень{sortIcon('level')}
              </th>
              <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => table.sorting.toggleSort('salary')}>
                Зарплата{sortIcon('salary')}
              </th>
            </tr>
          </thead>
          <tbody>
            {table.pageData.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#999', padding: '2rem' }}>
                  Нет сотрудников по выбранным фильтрам
                </td>
              </tr>
            ) : (
              table.pageData.map(employee => (
                <tr key={employee.id} style={{ background: '#fff' }}>
                  <td style={tdStyle}>{employee.name}</td>
                  <td style={tdStyle}>{employee.department}</td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block', padding: '0.15rem 0.5rem',
                      borderRadius: '20px', fontSize: '0.75rem', fontWeight: 500,
                      background: `${LEVEL_COLORS[employee.level]}22`,
                      color: LEVEL_COLORS[employee.level],
                    }}>
                      {employee.level}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 500 }}>
                    {employee.salary.toLocaleString('ru-RU')} ₽
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
        <span style={{ color: '#666', fontSize: '0.85rem' }}>
          Страница {table.pagination.page} из {table.pagination.totalPages}
        </span>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            onClick={table.pagination.prev}
            disabled={!table.pagination.hasPrev}
            style={{
              padding: '0.3rem 0.7rem', border: '1px solid #ddd', borderRadius: '4px',
              background: table.pagination.hasPrev ? '#fff' : '#f5f5f5',
              color: table.pagination.hasPrev ? '#333' : '#bbb',
              cursor: table.pagination.hasPrev ? 'pointer' : 'not-allowed',
              fontSize: '0.85rem',
            }}
          >
            ‹ Назад
          </button>

          {Array.from({ length: table.pagination.totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => table.pagination.goTo(p)}
              style={{
                padding: '0.3rem 0.6rem', border: '1px solid',
                borderColor: p === table.pagination.page ? '#1976d2' : '#ddd',
                borderRadius: '4px',
                background: p === table.pagination.page ? '#1976d2' : '#fff',
                color: p === table.pagination.page ? '#fff' : '#333',
                cursor: 'pointer', fontSize: '0.85rem', minWidth: 32,
              }}
            >
              {p}
            </button>
          ))}

          <button
            onClick={table.pagination.next}
            disabled={!table.pagination.hasNext}
            style={{
              padding: '0.3rem 0.7rem', border: '1px solid #ddd', borderRadius: '4px',
              background: table.pagination.hasNext ? '#fff' : '#f5f5f5',
              color: table.pagination.hasNext ? '#333' : '#bbb',
              cursor: table.pagination.hasNext ? 'pointer' : 'not-allowed',
              fontSize: '0.85rem',
            }}
          >
            Вперёд ›
          </button>
        </div>
      </div>
    </div>
  )
}
