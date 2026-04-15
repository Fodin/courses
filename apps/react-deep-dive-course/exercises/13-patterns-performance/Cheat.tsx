// Cheat sheet for Level 13: Advanced Performance Patterns

// ─── Task 13.1: Context Splitting ────────────────────────────────────────────
//
// Правило: разделяй по ЧАСТОТЕ изменений, не по логической принадлежности.
//
//   const UserContext = createContext<User>({ name: 'Аноним', avatar: '🙂' })
//   const ThemeContext = createContext<Theme>('light')
//   const SearchContext = createContext<SearchCtx>({ query: '', setQuery: () => {} })
//
// Мемоизация значения контекста — ОБЯЗАТЕЛЬНА для объектов:
//   // ❌ Новый объект каждый рендер → все подписчики ре-рендерятся
//   <SearchContext.Provider value={{ query, setQuery }}>
//
//   // ✅ Стабильный объект — ре-рендер только при изменении query
//   const searchValue = useMemo(() => ({ query, setQuery }), [query])
//   <SearchContext.Provider value={searchValue}>
//
// setQuery из useState СТАБИЛЬНА по ссылке — useCallback не нужен.
// useContext(SearchContext) подписывается на весь SearchContext.
//   При изменении query → только потребители SearchContext ре-рендерятся.
//
// Render counter через useRef (не useState — не вызывает ре-рендер):
//   const renders = useRef(0)
//   renders.current++   // каждый раз при вызове компонента
//   return <span>renders: {renders.current}</span>
//
// Три Provider можно вкладывать:
//   <UserContext.Provider value={user}>
//     <ThemeContext.Provider value={theme}>
//       <SearchContext.Provider value={searchValue}>
//         {children}

// ─── Task 13.2: State Colocation + Children as Props ─────────────────────────
//
// State Colocation — переместить state туда, где он используется:
//
//   // ❌ State в корне — всё ре-рендерится
//   function PageRoot() {
//     const [commentText, setCommentText] = useState('')
//     return (
//       <div>
//         <ArticleContent />  {/* ← лишний ре-рендер */}
//         <CommentSection text={commentText} onText={setCommentText} />
//       </div>
//     )
//   }
//
//   // ✅ State в CommentSection — только она и её дети ре-рендерятся
//   function CommentSection({ children }) {
//     const [commentText, setCommentText] = useState('')
//     return (
//       <div>
//         {children}          {/* ArticleContent — из props, не ре-рендерится */}
//         <CommentInput />    {/* внутри, использует state CommentSection */}
//       </div>
//     )
//   }
//   function PageRoot() {
//     return (
//       <CommentSection>
//         <ArticleContent />  {/* создаётся здесь — stable reference */}
//       </CommentSection>
//     )
//   }
//
// Children as Props — механика:
//   <ArticleContent /> в JSX → React.createElement(ArticleContent, {}) → объект { type, props }
//   Этот объект создаётся в PageRoot.
//   CommentSection при ре-рендере получает ТОТЖЕ объект из props.children.
//   React: тот же тип + те же props → bailout → ArticleContent не вызывается.
//
// ВАЖНО: Children as Props не работает если children нужен state из wrapper:
//   function Wrapper({ children }) {
//     const [count, setCount] = useState(0)
//     // Нельзя передать count в children — они созданы снаружи!
//   }
//   → Для таких случаев: render props или context.

// ─── Task 13.3: Performance Audit ────────────────────────────────────────────
//
// Проблема 1: Effect Chain → useMemo
//
//   // ❌ Два рендера на каждый ввод фильтра
//   const [filtered, setFiltered] = useState(data)
//   const [sorted, setSorted] = useState(data)
//   useEffect(() => { setFiltered(data.filter(...)) }, [filter])
//   useEffect(() => { setSorted([...filtered].sort(...)) }, [filtered, sort])
//
//   // ✅ Один проход — computed during render
//   const sorted = useMemo(() => {
//     const filtered = filter === 'all' ? data : data.filter(r => r.category === filter)
//     return [...filtered].sort((a, b) => asc ? a.value - b.value : b.value - a.value)
//   }, [data, filter, asc])
//
// Проблема 2: Inline objects ломают React.memo
//
//   // ❌ Новый объект/массив на каждом рендере — memo бесполезен
//   <DataTable columns={['Имя', 'Значение']} style={{ width: '100%' }} />
//
//   // ✅ Константы вне компонента — стабильные ссылки
//   const COLUMNS = ['Имя', 'Значение']
//   const TABLE_STYLE: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' }
//   <DataTable columns={COLUMNS} style={TABLE_STYLE} />
//
// Проблема 3: State Colocation
//
//   // ❌ selectedRowId в Dashboard → выбор строки ре-рендерит весь дашборд
//   // ✅ selectedRowId в SelectionSection → только она ре-рендерится
//
// Проблема 4: Стабильные key
//
//   // ❌ Нет key или key={index} — React путается при изменении порядка
//   metrics.map(m => <MetricCard ... />)
//   metrics.map((m, i) => <MetricCard key={i} ... />)
//
//   // ✅ Стабильный уникальный ключ
//   metrics.map(m => <MetricCard key={m.id} ... />)
//
// Проблема 5: useSyncExternalStore
//
//   // ❌ useEffect + useState — tearing в Concurrent Mode
//   const [status, setStatus] = useState(store.getSnapshot())
//   useEffect(() => {
//     return store.subscribe(() => setStatus(store.getSnapshot()))
//   }, [])
//
//   // ✅ useSyncExternalStore — React управляет синхронизацией
//   const status = useSyncExternalStore(
//     store.subscribe,      // (callback) => unsubscribe
//     store.getSnapshot,    // () => currentValue
//     () => 'online',       // server snapshot (SSR)
//   )
//
//   // Форма subscribe: принимает callback, возвращает функцию отписки
//   subscribe: (callback: () => void) => () => void

export {}
