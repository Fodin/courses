// ============================================
// Level 8: Hints — Render Optimization
// Подсказки: Level 8 — Оптимизация рендеринга
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Hints: Level 8 — Render Optimization</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Task 8.1: Chat — Diagnose and Fix</h3>
        {/* Задание 8.1: Чат — диагностика и исправление */}
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Render counter:</strong>{' '}
            <code>const renderCount = useRef(0); renderCount.current++</code> — at the start of the component body.
            Display via <code>{'<span>renders: {renderCount.current}</span>'}</code>
          </li>
          <li>
            <strong>State down:</strong> remove <code>inputText</code> and <code>setInputText</code> from <code>Task8_1</code>.
            Move <code>useState('')</code> inside <code>MessageInput</code>. Signature becomes:{' '}
            <code>{'{'} onSend: (text: string) =&gt; void {'}'}</code>
          </li>
          <li>
            <strong>React.memo:</strong>{' '}
            <code>{'const MessageList = memo(function MessageList({ messages }) { ... })'}</code>
            — same for <code>OnlineUsers</code>
          </li>
          <li>
            <strong>useCallback for onSend:</strong>{' '}
            <code>{'const handleSend = useCallback((text: string) => { setMessages(prev => [...prev, ...]) }, [])'}</code>
            — empty dependencies, since we use functional setState
          </li>
          <li>
            <strong>Why empty deps are safe:</strong> <code>setMessages(prev =&gt; ...)</code>
            reads previous state via argument, not from closure — no stale closure
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Task 8.2: State down / Children up</h3>
        {/* Задание 8.2: State down / Children up */}
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>State down — structure:</strong> <code>ColorPicker</code> stores{' '}
            <code>useState(color)</code> itself. In parent: <code>{'<ColorPicker /> <HeavyPreview />'}</code> — side by side,
            not nested
          </li>
          <li>
            <strong>Children up — structure:</strong>{' '}
            <code>{'function ColorWrapper({ children }: { children: React.ReactNode }) { const [color, setColor] = useState(...) ... return <div>...picker... {children}</div> }'}</code>
          </li>
          <li>
            <strong>Using children up:</strong>{' '}
            <code>{'<ColorWrapper><HeavyPreview label="..." /></ColorWrapper>'}</code>{' '}
            — <code>HeavyPreview</code> is created in <code>Task8_2</code>, passed as a prop, does not depend on <code>ColorWrapper</code> state
          </li>
          <li>
            <strong>Key principle:</strong> React does not recreate a JSX element passed as{' '}
            <code>children</code> — it already exists in the parent's scope
          </li>
          <li>
            <strong>Do NOT use React.memo</strong> — this is a learning example of structural optimizations
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Task 8.3: FilterPanel — useCallback + memo</h3>
        {/* Задание 8.3: FilterPanel — useCallback + memo */}
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Order of actions:</strong> first wrap all 5 components in <code>memo</code>,
            then stabilize all <code>onChange</code> via <code>useCallback</code>
          </li>
          <li>
            <strong>useCallback with empty dependencies:</strong>{' '}
            <code>{'const handleCategoryChange = useCallback((value: string) => { setFilters(prev => ({ ...prev, category: value })) }, [])'}</code>
          </li>
          <li>
            <strong>Why [] is safe:</strong> functional <code>setFilters(prev =&gt; ...)</code>
            does not read <code>filters</code> from closure — no stale closure. Setter from{' '}
            <code>useState</code> is stable, no need to add it to dependencies
          </li>
          <li>
            <strong>PriceFilter — two parameters:</strong>{' '}
            <code>{'const handlePriceChange = useCallback((min: number, max: number) => { setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max })) }, [])'}</code>
          </li>
          <li>
            <strong>Memo on SortFilter — type:</strong> the value type{' '}
            <code>Filters['sort']</code> — use it in both places: in component props and in {' '}
            <code>onChange</code>
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#388e3c' }}>General Tips for This Level / Общие советы по уровню</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Diagnosis comes first:</strong> always verify the problem is real first.
            Render counters — the simplest way. React DevTools Profiler — for detailed analysis
          </li>
          <li>
            <strong>Structural solutions are better than memoization:</strong> state down / children up eliminate
            the root cause. memo and useCallback — treat the symptom
          </li>
          <li>
            <strong>memo without useCallback is useless:</strong> if you pass a function as a prop to a memo component
            without <code>useCallback</code> — memo doesn't work (new reference = always "changed")
          </li>
          <li>
            <strong>useCallback without memo is useless:</strong> stabilizing functions is only useful if
            the receiving component is wrapped in <code>memo</code>
          </li>
          <li>
            <strong>Don't wrap everything in memo:</strong> overhead of prop comparison for simple
            components may exceed the benefit
          </li>
        </ul>
      </section>
    </div>
  )
}
