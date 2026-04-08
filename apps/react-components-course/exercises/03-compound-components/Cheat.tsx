// ============================================
// Level 3: Подсказки — Compound Components
// Level 3: Hints — Compound Components
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container" style={{ fontFamily: 'sans-serif', maxWidth: 720 }}>
      {/* Подсказки — Level 3: Compound Components */}
      {/* Hints — Level 3: Compound Components */}
      <h2>Подсказки — Level 3: Compound Components</h2>

      {/* ---- Задание 3.1 ---- */}
      {/* ---- Task 3.1 ---- */}
      <section style={{ marginBottom: 32 }}>
        {/* Задание 3.1: Tabs */}
        {/* Task 3.1: Tabs */}
        <h3 style={{ color: '#3b82f6', borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
          Задание 3.1: Tabs
        </h3>

        {/* Структура паттерна */}
        {/* Pattern structure */}
        <h4>Структура паттерна</h4>
        <pre
          style={{
            background: '#f8fafc',
            borderRadius: 8,
            padding: 16,
            fontSize: 13,
            overflow: 'auto',
          }}
        >
          {`// 1. Контекст с null как начальным значением
// 1. Context with null as initial value
const TabsContext = createContext<TabsContextValue | null>(null)

// 2. Хук с защитой
// 2. Hook with guard
function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('<Tabs.Tab> must be inside <Tabs>')
  return ctx
}

// 3. Root хранит state
// 3. Root stores state
function TabsRoot({ defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab])
  return (
    <TabsContext.Provider value={value}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

// 4. Сборка через Object.assign
// 4. Assemble via Object.assign
export const Tabs = Object.assign(TabsRoot, { List: TabsList, Tab, Panel })`}
        </pre>

        {/* Как Tab читает контекст */}
        {/* How Tab reads context */}
        <h4>Как Tab читает контекст</h4>
        <pre style={{ background: '#f8fafc', borderRadius: 8, padding: 16, fontSize: 13 }}>
          {`function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === id
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  )
}`}
        </pre>
      </section>

      {/* ---- Задание 3.2 ---- */}
      {/* ---- Task 3.2 ---- */}
      <section style={{ marginBottom: 32 }}>
        {/* Задание 3.2: Select с клавиатурой */}
        {/* Task 3.2: Select with keyboard */}
        <h3 style={{ color: '#3b82f6', borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
          Задание 3.2: Select с клавиатурой
        </h3>

        {/* Клавиатурная навигация */}
        {/* Keyboard navigation */}
        <h4>Клавиатурная навигация</h4>
        <pre style={{ background: '#f8fafc', borderRadius: 8, padding: 16, fontSize: 13 }}>
          {`const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault() // не скроллим страницу! / don't scroll the page!
      if (!isOpen) { setIsOpen(true); setFocusedIndex(0) }
      else setFocusedIndex(i => Math.min(i + 1, options.length - 1))
      break
    case 'ArrowUp':
      e.preventDefault()
      setFocusedIndex(i => Math.max(i - 1, 0))
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (isOpen) select(options[focusedIndex])
      else setIsOpen(true)
      break
    case 'Escape':
      setIsOpen(false)
      break
  }
}`}
        </pre>

        {/* Закрытие при клике вне */}
        {/* Close on click outside */}
        <h4>Закрытие при клике вне</h4>
        <pre style={{ background: '#f8fafc', borderRadius: 8, padding: 16, fontSize: 13 }}>
          {`useEffect(() => {
  const handler = (e: MouseEvent) => {
    if (!rootRef.current?.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }
  document.addEventListener('mousedown', handler)
  return () => document.removeEventListener('mousedown', handler)
}, [])`}
        </pre>

        {/* Извлечение options из children */}
        {/* Extracting options from children */}
        <h4>Извлечение options из children</h4>
        <pre style={{ background: '#f8fafc', borderRadius: 8, padding: 16, fontSize: 13 }}>
          {`function extractOptionValues(children: ReactNode): string[] {
  const values: string[] = []
  const traverse = (nodes: ReactNode) => {
    const arr = Array.isArray(nodes) ? nodes : [nodes]
    for (const child of arr) {
      if (child && typeof child === 'object' && 'props' in child) {
        const el = child as { props: { value?: string; children?: ReactNode } }
        if (el.props.value !== undefined) values.push(el.props.value)
        else if (el.props.children) traverse(el.props.children)
      }
    }
  }
  traverse(children)
  return values
}`}
        </pre>
      </section>

      {/* ---- Задание 3.3 ---- */}
      {/* ---- Task 3.3 ---- */}
      <section>
        {/* Задание 3.3: Stepper */}
        {/* Task 3.3: Stepper */}
        <h3 style={{ color: '#3b82f6', borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
          Задание 3.3: Stepper
        </h3>

        {/* Подсчёт шагов из children */}
        {/* Counting steps from children */}
        <h4>Подсчёт шагов из children</h4>
        <pre style={{ background: '#f8fafc', borderRadius: 8, padding: 16, fontSize: 13 }}>
          {`const totalSteps = useMemo(() => {
  let count = 0
  const arr = Array.isArray(children) ? children : [children]
  for (const child of arr) {
    if (child && typeof child === 'object' && 'type' in child) {
      if ((child as { type: unknown }).type === StepperStep) count++
    }
  }
  return count
}, [children])`}
        </pre>

        {/* Логика next() с завершением */}
        {/* next() logic with completion */}
        <h4>Логика next() с завершением</h4>
        <pre style={{ background: '#f8fafc', borderRadius: 8, padding: 16, fontSize: 13 }}>
          {`const next = () => {
  if (currentStep < totalSteps - 1) {
    setCurrentStep(s => s + 1)
  } else {
    setIsCompleted(true)
    onComplete?.()
  }
}`}
        </pre>

        {/* Индикатор прогресса */}
        {/* Progress indicator */}
        <h4>Индикатор прогресса</h4>
        <pre style={{ background: '#f8fafc', borderRadius: 8, padding: 16, fontSize: 13 }}>
          {`function StepperProgress() {
  const { currentStep, totalSteps, goTo } = useStepperContext()
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <button key={i} onClick={() => goTo(i)}>
          {i < currentStep ? '✓' : i + 1}
        </button>
      ))}
    </div>
  )
}`}
        </pre>
      </section>

      {/* ---- Общие советы ---- */}
      {/* ---- General tips ---- */}
      <section
        style={{
          marginTop: 24,
          padding: 16,
          background: '#fffbeb',
          borderRadius: 8,
          border: '1px solid #fde68a',
        }}
      >
        {/* Общие советы */}
        {/* General tips */}
        <h4 style={{ margin: '0 0 8px', color: '#92400e' }}>Общие советы</h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#78350f' }}>
          {/* Всегда проверяйте контекст на null в хуке — лучше понятная ошибка, чем загадочный TypeError */}
          {/* Always check context for null in the hook — a clear error is better than a mysterious TypeError */}
          <li>
            Всегда проверяйте контекст на null в хуке — лучше понятная ошибка, чем загадочный
            TypeError
          </li>
          {/* Мемоизируйте value контекста через useMemo — иначе каждый рендер создаёт новый объект и перерендерит всех потребителей */}
          {/* Memoize the context value via useMemo — otherwise every render creates a new object and re-renders all consumers */}
          <li>
            Мемоизируйте value контекста через useMemo — иначе каждый рендер создаёт новый объект
            и перерендерит всех потребителей
          </li>
          {/* Устанавливайте displayName у sub-компонентов — в DevTools будет читаемое дерево */}
          {/* Set displayName on sub-components — DevTools will show a readable tree */}
          <li>
            Устанавливайте displayName у sub-компонентов — в DevTools будет читаемое дерево
          </li>
          {/* Object.assign(Root, subComponents) — TypeScript автоматически выводит тип результата */}
          {/* Object.assign(Root, subComponents) — TypeScript automatically infers the result type */}
          <li>
            Object.assign(Root, subComponents) — TypeScript автоматически выводит тип результата
          </li>
        </ul>
      </section>
    </div>
  )
}
