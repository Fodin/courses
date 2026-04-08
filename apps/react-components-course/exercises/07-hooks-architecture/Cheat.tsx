export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 7 — Хуки как архитектурный инструмент</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 7.1: useAsync + useApi</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Флаг cancelled в useAsync:</strong> объявите <code>let cancelled = false</code> внутри useEffect.
            В <code>.then()</code> и <code>.catch()</code> проверяйте <code>if (!cancelled)</code> перед setState.
            В cleanup: <code>return {'() => { cancelled = true }'}</code>
          </li>
          <li>
            <strong>AbortController в useApi:</strong>{' '}
            <code>{'const abortRef = useRef<AbortController | null>(null)'}</code>.
            Перед fetch: <code>abortRef.current?.abort()</code>, затем <code>abortRef.current = new AbortController()</code>.
            Передайте <code>{'{ signal: abortRef.current.signal }'}</code> в fetch
          </li>
          <li>
            <strong>Игнорирование AbortError:</strong>{' '}
            <code>{'if (err instanceof Error && err.name === \'AbortError\') return'}</code> — это не ошибка, а плановая отмена
          </li>
          <li>
            <strong>refetch:</strong> добавьте <code>const [revision, setRevision] = useState(0)</code> и передайте
            в deps useAsync. <code>refetch</code> вызывает <code>setRevision(r =&gt; r + 1)</code>
          </li>
          <li>
            <strong>Пустой url:</strong> проверяйте <code>if (!url) return Promise.resolve(null)</code> перед fetch
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 7.2: useForm</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>handleChange с валидацией:</strong> используйте функциональное обновление setState:
            <code>{'setValues(prev => { const next = {...prev, [field]: value}; /* validate */ return next })'}</code>
          </li>
          <li>
            <strong>handleBlur:</strong> сначала <code>setTouched(prev =&gt; {'({ ...prev, [field]: true })'} )</code>,
            потом получите текущий values и вызовите validate, обновите только ошибку этого поля:
            <code>setErrors(prev =&gt; {'({ ...prev, [field]: errs[field] })'} )</code>
          </li>
          <li>
            <strong>Пометить все touched при submit:</strong>{' '}
            <code>{'Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})'}</code>
          </li>
          <li>
            <strong>isSubmitting через finally:</strong>{' '}
            <code>{'Promise.resolve(onSubmit(values)).finally(() => setIsSubmitting(false))'}</code>
          </li>
          <li>
            <strong>Показ ошибки:</strong>{' '}
            <code>{'{ form.touched.name && form.errors.name && <span>{form.errors.name}</span> }'}</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 7.3: useDataTable</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>offset в usePagination:</strong> <code>const offset = (page - 1) * pageSize</code>.
            <code>totalPages = Math.max(1, Math.ceil(totalItems / pageSize))</code>
          </li>
          <li>
            <strong>Сброс при выходе за пределы:</strong>{' '}
            <code>{'useEffect(() => { if (page > totalPages) setPage(1) }, [page, totalPages])'}</code>
          </li>
          <li>
            <strong>toggleSort:</strong> если <code>field === prev</code> — меняем direction,
            иначе устанавливаем новое поле с <code>'asc'</code>. Используйте функциональный setState
          </li>
          <li>
            <strong>sort без мутации:</strong> <code>return [...items].sort((a, b) =&gt; {'{ ... }'})</code> —
            спред создаёт новый массив перед сортировкой
          </li>
          <li>
            <strong>Порядок в useDataTable:</strong>{' '}
            <code>filtered → sorted → pageData (slice по offset)</code>.
            totalCount = filtered.length (не sorted.length, не data.length)
          </li>
          <li>
            <strong>Сброс пагинации при смене фильтра:</strong>{' '}
            <code>{'useEffect(() => { pagination.goTo(1) }, [filters.values])'}</code> — в useDataTable,
            не в useFilters
          </li>
          <li>
            <strong>Иконки сортировки:</strong> вспомогательная функция{' '}
            <code>{'const sortIcon = (f) => sorting.field !== f ? \'↕\' : direction === \'asc\' ? \'↑\' : \'↓\''}</code>
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#388e3c' }}>Общие советы по уровню</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>useMemo для производных данных:</strong> filtered, sorted, pageData —
            оберните в <code>useMemo</code> с правильными зависимостями, иначе вычисления
            будут происходить при каждом рендере
          </li>
          <li>
            <strong>useCallback для функций хука:</strong> handleChange, handleBlur, handleSubmit, goTo —
            оберните в <code>useCallback</code>, чтобы компоненты, принимающие их как props, не ре-рендерились лишний раз
          </li>
          <li>
            <strong>Хук возвращает объект, не кортеж:</strong> если больше 2 значений —
            предпочтительнее <code>{'return { data, loading, error }'}</code> вместо
            <code>return [data, loading, error]</code>
          </li>
          <li>
            <strong>Зависимости useEffect:</strong> следуйте правилу exhaustive-deps.
            Если функция используется в зависимостях — оберните её в useCallback выше
          </li>
        </ul>
      </section>
    </div>
  )
}
