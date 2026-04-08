# Level 7: Хуки как архитектурный инструмент — Подробное руководство

## Зачем выносить логику в хуки?

Представьте страницу поиска пользователей. Там есть поле ввода, список результатов, индикатор загрузки, сообщение об ошибке. Пишем первый вариант:

```tsx
function UserSearch() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    setError(null)
    fetch(`/api/users?q=${query}`)
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [query])

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading && <span>Загрузка...</span>}
      {error && <span>Ошибка: {error}</span>}
      <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  )
}
```

Выглядит нормально для одного компонента. Но завтра появится `ProductSearch`. И `OrderSearch`. Каждый будет копировать эти четыре `useState` и `useEffect`. А если понадобится отменять предыдущий запрос (AbortController) — нужно обновлять везде.

**Решение:** вынести логику в хук один раз.

---

## useAsync: универсальный хук для асинхронных операций

### Почему три состояния нераздельны?

`loading`, `data` и `error` — не три независимых состояния. Они всегда описывают один процесс. Если `loading: true`, то `data` и `error` неактуальны. Если `error !== null`, то `loading: false`. Они **связаны**, и разрыв этой связи создаёт баги:

```tsx
// ❌ Три независимых useState — возможно рассогласование
const [loading, setLoading] = useState(false)
const [data, setData] = useState(null)
const [error, setError] = useState(null)

// При быстром двойном клике: loading=true, потом снова loading=true,
// первый запрос отвечает: loading=false, data=firstResult
// второй запрос отвечает: loading=false, data=secondResult
// Но что если первый ответит ПОСЛЕ второго? data=firstResult (устаревшие данные!)
```

Правильный подход — хранить состояние как единый объект, описывающий текущую "фазу" загрузки:

```tsx
type AsyncState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: string }

// Или упрощённый вариант для большинства задач:
interface AsyncState<T> {
  loading: boolean
  data: T | null
  error: string | null
}
```

### Реализация useAsync

```tsx
function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList = []) {
  const [state, setState] = useState<AsyncState<T>>({
    loading: false,
    data: null,
    error: null,
  })

  useEffect(() => {
    let cancelled = false  // флаг для защиты от race condition

    setState({ loading: true, data: null, error: null })

    fn()
      .then(data => {
        if (!cancelled) setState({ loading: false, data, error: null })
      })
      .catch(err => {
        if (!cancelled) setState({ loading: false, data: null, error: err.message })
      })

    return () => { cancelled = true }  // cleanup: игнорируем ответ если компонент размонтирован
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
```

Флаг `cancelled` — простое решение race condition. Когда компонент размонтируется (или `deps` изменятся), cleanup-функция устанавливает `cancelled = true`. Старые промисы всё равно выполнятся, но не обновят состояние.

### useApi с AbortController

AbortController позволяет отменить HTTP-запрос на уровне браузера — это эффективнее флага, потому что останавливает реальную передачу данных:

```tsx
function useApi<T>(url: string) {
  const [state, setState] = useState<AsyncState<T>>({
    loading: false,
    data: null,
    error: null,
  })

  const abortRef = useRef<AbortController | null>(null)

  const execute = useCallback(() => {
    // Отменяем предыдущий запрос перед новым
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setState({ loading: true, data: null, error: null })

    fetch(url, { signal: abortRef.current.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<T>
      })
      .then(data => setState({ loading: false, data, error: null }))
      .catch(err => {
        // AbortError — это нормально, не показываем как ошибку
        if (err.name !== 'AbortError') {
          setState({ loading: false, data: null, error: err.message })
        }
      })
  }, [url])

  // Очистка при размонтировании
  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  return { ...state, execute }
}
```

### Компонент UserSearch — тонкий UI-слой

После вынесения логики в хук, компонент сводится к чистому рендерингу:

```tsx
function UserSearch() {
  const [query, setQuery] = useState('')
  const { loading, data: users, error } = useApi<User[]>(
    query ? `/api/users?q=${query}` : ''
  )

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск..." />
      {loading && <Spinner />}
      {error && <ErrorMessage text={error} />}
      {users && <UserList users={users} />}
    </div>
  )
}
```

Компонент не знает о fetch, AbortController, флагах loading. Он знает только: есть строка запроса → есть результат (или загрузка, или ошибка).

---

## useForm: форма как состояние, а не DOM

### Проблема неуправляемых форм

Многие начинают с `ref` или напрямую читают `event.target.value`. Это работает для простых форм, но как только появляется валидация, зависимые поля или программный сброс — всё рассыпается.

Управляемая форма (controlled form) хранит значения в state. Это даёт полный контроль:

```
Пользователь вводит → onChange → setState → React ре-рендерит input с новым value
```

### Структура состояния формы

Форма — это не одно значение, а три группы данных:

```tsx
interface FormState<T> {
  values: T           // текущие значения полей
  errors: Partial<Record<keyof T, string>>   // ошибки валидации
  touched: Partial<Record<keyof T, boolean>> // поля, которых касались
}
```

Зачем `touched`? Чтобы не показывать ошибку сразу при открытии формы. Показываем ошибку поля только если пользователь уже посетил его (touched) или попытался отправить форму.

### Реализация useForm

```tsx
type Validator<T> = (values: T) => Partial<Record<keyof T, string>>

function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validate?: Validator<T>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Обработчик изменения поля
  const handleChange = useCallback((field: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [field]: value }))
    // Валидируем поле на лету, если оно уже было touched
    if (touched[field] && validate) {
      const newValues = { ...values, [field]: value } as T
      const newErrors = validate(newValues)
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }))
    }
  }, [values, touched, validate])

  // Обработчик потери фокуса — помечаем поле как touched
  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    if (validate) {
      const newErrors = validate(values)
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }))
    }
  }, [values, validate])

  // Обработчик отправки формы
  const handleSubmit = useCallback((
    onSubmit: (values: T) => void | Promise<void>
  ) => (e: React.FormEvent) => {
    e.preventDefault()
    // Помечаем все поля как touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof T, boolean>
    )
    setTouched(allTouched)

    const validationErrors = validate ? validate(values) : {}
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)
      Promise.resolve(onSubmit(values)).finally(() => setIsSubmitting(false))
    }
  }, [values, validate])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset }
}
```

### Компонент = чистый рендеринг

```tsx
function RegistrationForm() {
  const form = useForm(
    { name: '', email: '', password: '' },
    values => {
      const errors: Record<string, string> = {}
      if (!values.name) errors.name = 'Имя обязательно'
      if (!values.email.includes('@')) errors.email = 'Некорректный email'
      if (values.password.length < 8) errors.password = 'Минимум 8 символов'
      return errors
    }
  )

  return (
    <form onSubmit={form.handleSubmit(values => console.log('Submit:', values))}>
      <input
        value={form.values.name}
        onChange={e => form.handleChange('name', e.target.value)}
        onBlur={() => form.handleBlur('name')}
      />
      {form.touched.name && form.errors.name && <span>{form.errors.name}</span>}
      {/* остальные поля аналогично */}
      <button type="submit" disabled={form.isSubmitting}>Зарегистрироваться</button>
    </form>
  )
}
```

Компонент не содержит логики валидации — он просто подключает поля к хуку и рендерит ошибки.

---

## Композиция хуков: useDataTable

### Принцип единственной ответственности

Один хук — одна задача. `usePagination` считает страницы. `useFilters` хранит активные фильтры. `useSorting` управляет сортировкой. Каждый можно переиспользовать отдельно:

```tsx
// На странице пользователей — только пагинация
const pagination = usePagination({ totalItems: users.length, pageSize: 10 })

// На странице товаров — фильтры + пагинация
const filters = useFilters({ category: '', minPrice: 0 })
const pagination = usePagination({ totalItems: filtered.length, pageSize: 20 })
```

### Композиция через useDataTable

Когда нужно всё сразу — создаём хук-композицию:

```tsx
function useDataTable<T>(
  data: T[],
  options: { pageSize?: number; filterFn?: (item: T, filters: Filters) => boolean }
) {
  const sorting = useSorting<T>()
  const filters = useFilters({})
  
  // Применяем фильтрацию
  const filtered = useMemo(
    () => options.filterFn ? data.filter(item => options.filterFn!(item, filters.values)) : data,
    [data, filters.values, options.filterFn]
  )
  
  // Применяем сортировку
  const sorted = useMemo(
    () => sorting.sort(filtered),
    [filtered, sorting.sort]
  )
  
  // Применяем пагинацию
  const pagination = usePagination({ totalItems: sorted.length, pageSize: options.pageSize ?? 10 })
  
  // Возвращаем текущую страницу
  const pageData = useMemo(
    () => sorted.slice(pagination.offset, pagination.offset + pagination.pageSize),
    [sorted, pagination.offset, pagination.pageSize]
  )
  
  return { data: pageData, pagination, sorting, filters, totalCount: filtered.length }
}
```

Компонент таблицы получает готовые данные и управляющие функции — и только рендерит:

```tsx
function DataTable() {
  const table = useDataTable(EMPLOYEES, { pageSize: 5, filterFn: employeeFilter })

  return (
    <div>
      <FilterBar filters={table.filters} />
      <Table data={table.data} sorting={table.sorting} />
      <Pagination pagination={table.pagination} total={table.totalCount} />
    </div>
  )
}
```

---

## Тестирование хуков

Хуки с вынесенной логикой тестировать значительно проще, чем компоненты. Не нужен DOM, не нужен рендеринг — только вызов хука и проверка результата.

С библиотекой `@testing-library/react-hooks` (или `renderHook` из `@testing-library/react` в React 18):

```tsx
import { renderHook, act } from '@testing-library/react'

test('useForm validates email', () => {
  const { result } = renderHook(() =>
    useForm(
      { email: '' },
      values => (values.email.includes('@') ? {} : { email: 'Некорректный email' })
    )
  )

  // Изменяем значение и помечаем поле как touched
  act(() => {
    result.current.handleChange('email', 'not-an-email')
    result.current.handleBlur('email')
  })

  expect(result.current.errors.email).toBe('Некорректный email')

  // Исправляем значение
  act(() => {
    result.current.handleChange('email', 'user@example.com')
  })

  expect(result.current.errors.email).toBeUndefined()
})
```

Логика протестирована без единого `render(<Component />)`.

---

## Лучшие практики

📌 **Хук должен иметь понятный контракт.** Чётко типизируйте входные параметры и возвращаемое значение. Если сложно описать, что возвращает хук — вероятно, он делает слишком много.

💡 **Возвращайте объект, не кортеж, если значений больше двух.** `const { data, loading, error } = useAsync(...)` читается лучше, чем `const [data, loading, error, execute] = useAsync(...)`.

🔥 **Мемоизируйте производные значения внутри хука.** Если хук вычисляет `filtered`, оберните в `useMemo` — иначе компонент будет ре-рендериться при каждом вызове.

⚠️ **Не создавайте хук ради хука.** Если логика нигде не переиспользуется и умещается в 5 строк — можно оставить её в компоненте.

🎯 **Следите за зависимостями useEffect и useCallback.** Инструмент `react-hooks/exhaustive-deps` из ESLint поможет не пропустить зависимости и избежать stale closure.
