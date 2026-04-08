// ============================================
// Level 7: Hints — Hooks as an Architectural Tool
// Подсказки: Level 7 — Хуки как архитектурный инструмент
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Hints: Level 7 — Hooks as an Architectural Tool</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Task 7.1: useAsync + useApi</h3>
        {/* Задание 7.1: useAsync + useApi */}
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Cancelled flag in useAsync:</strong> declare <code>let cancelled = false</code> inside useEffect.
            In <code>.then()</code> and <code>.catch()</code> check <code>if (!cancelled)</code> before setState.
            In cleanup: <code>return {'() => { cancelled = true }'}</code>
          </li>
          <li>
            <strong>AbortController in useApi:</strong>{' '}
            <code>{'const abortRef = useRef<AbortController | null>(null)'}</code>.
            Before fetch: <code>abortRef.current?.abort()</code>, then <code>abortRef.current = new AbortController()</code>.
            Pass <code>{'{ signal: abortRef.current.signal }'}</code> to fetch
          </li>
          <li>
            <strong>Ignore AbortError:</strong>{' '}
            <code>{'if (err instanceof Error && err.name === \'AbortError\') return'}</code> — this is not an error, but a planned cancellation
          </li>
          <li>
            <strong>refetch:</strong> add <code>const [revision, setRevision] = useState(0)</code> and pass
            in useAsync deps. <code>refetch</code> calls <code>setRevision(r =&gt; r + 1)</code>
          </li>
          <li>
            <strong>Empty url:</strong> check <code>if (!url) return Promise.resolve(null)</code> before fetch
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Task 7.2: useForm</h3>
        {/* Задание 7.2: useForm */}
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>handleChange with validation:</strong> use functional setState update:
            <code>{'setValues(prev => { const next = {...prev, [field]: value}; /* validate */ return next })'}</code>
          </li>
          <li>
            <strong>handleBlur:</strong> first <code>setTouched(prev =&gt; {'({ ...prev, [field]: true })'} )</code>,
            then get current values and call validate, update only that field's error:
            <code>setErrors(prev =&gt; {'({ ...prev, [field]: errs[field] })'} )</code>
          </li>
          <li>
            <strong>Mark all touched on submit:</strong>{' '}
            <code>{'Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})'}</code>
          </li>
          <li>
            <strong>isSubmitting via finally:</strong>{' '}
            <code>{'Promise.resolve(onSubmit(values)).finally(() => setIsSubmitting(false))'}</code>
          </li>
          <li>
            <strong>Show error:</strong>{' '}
            <code>{'{ form.touched.name && form.errors.name && <span>{form.errors.name}</span> }'}</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Task 7.3: useDataTable</h3>
        {/* Задание 7.3: useDataTable */}
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>offset in usePagination:</strong> <code>const offset = (page - 1) * pageSize</code>.
            <code>totalPages = Math.max(1, Math.ceil(totalItems / pageSize))</code>
          </li>
          <li>
            <strong>Reset when out of bounds:</strong>{' '}
            <code>{'useEffect(() => { if (page > totalPages) setPage(1) }, [page, totalPages])'}</code>
          </li>
          <li>
            <strong>toggleSort:</strong> if <code>field === prev</code> — change direction,
            otherwise set new field with <code>'asc'</code>. Use functional setState
          </li>
          <li>
            <strong>Sort without mutation:</strong> <code>return [...items].sort((a, b) =&gt; {'{ ... }'})</code> —
            spread creates a new array before sorting
          </li>
          <li>
            <strong>Order in useDataTable:</strong>{' '}
            <code>filtered → sorted → pageData (slice by offset)</code>.
            totalCount = filtered.length (not sorted.length, not data.length)
          </li>
          <li>
            <strong>Reset pagination on filter change:</strong>{' '}
            <code>{'useEffect(() => { pagination.goTo(1) }, [filters.values])'}</code> — in useDataTable,
            not in useFilters
          </li>
          <li>
            <strong>Sort icons:</strong> helper function{' '}
            <code>{'const sortIcon = (f) => sorting.field !== f ? \'↕\' : direction === \'asc\' ? \'↑\' : \'↓\''}</code>
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#388e3c' }}>General Tips for This Level / Общие советы по уровню</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>useMemo for derived data:</strong> filtered, sorted, pageData —
            wrap in <code>useMemo</code> with correct dependencies, otherwise computations
            will run on every render
          </li>
          <li>
            <strong>useCallback for hook functions:</strong> handleChange, handleBlur, handleSubmit, goTo —
            wrap in <code>useCallback</code> so components receiving them as props don't re-render unnecessarily
          </li>
          <li>
            <strong>Hook returns an object, not a tuple:</strong> if more than 2 values —
            prefer <code>{'return { data, loading, error }'}</code> instead of
            <code>return [data, loading, error]</code>
          </li>
          <li>
            <strong>useEffect dependencies:</strong> follow the exhaustive-deps rule.
            If a function is used in dependencies — wrap it in useCallback above
          </li>
        </ul>
      </section>
    </div>
  )
}
