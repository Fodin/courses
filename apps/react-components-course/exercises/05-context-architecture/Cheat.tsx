// ============================================
// Level 5: Hints — Context API Architecture
// Подсказки — Архитектура Context API
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Level 5: Hints — Context API Architecture</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Hint 5.1 */}
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9' }}>
          <h3 style={{ margin: '0 0 0.75rem', color: '#2e7d32' }}>Task 5.1: createStrictContext</h3>
          {/* Задание 5.1: createStrictContext */}
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>
              Use <code>createContext&lt;T | undefined&gt;(undefined)</code> — not <code>null</code>, but exactly <code>undefined</code>
            </li>
            {/* Используйте createContext<T | undefined>(undefined) — не null, а именно undefined */}
            <li>
              In the hook: <code>if (value === undefined) {'{'} throw new Error(...) {'}'}</code>
            </li>
            {/* В хуке: if (value === undefined) { throw new Error(...) } */}
            <li>
              In the error message, specify <code>displayName</code> — the developer will know which provider was missed
            </li>
            {/* В сообщении ошибки укажите displayName — разработчику будет понятно, какой провайдер пропущен */}
            <li>
              Return <code>[Context, useCtx] as const</code> — <code>as const</code> preserves the tuple type, not array
            </li>
            {/* Возвращайте [Context, useCtx] as const — as const сохраняет тип кортежа, а не массива */}
            <li>
              In the provider: <code>const value = useMemo{'('}() =&gt; {'{'} mode, toggleMode {'}'}, [mode]{')'}</code>
            </li>
            {/* В провайдере: const value = useMemo(() => { mode, toggleMode }, [mode]) */}
            <li>
              For ErrorBoundary you need a class component with <code>static getDerivedStateFromError</code>
            </li>
            {/* Для ErrorBoundary нужен class-компонент с static getDerivedStateFromError */}
          </ul>
        </div>

        {/* Hint 5.2 */}
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px', border: '1px solid #bbdefb' }}>
          <h3 style={{ margin: '0 0 0.75rem', color: '#1565c0' }}>Task 5.2: Separating Contexts</h3>
          {/* Задание 5.2: Разделение контекстов */}
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>
              Each widget should call only <strong>one</strong> context hook
            </li>
            {/* Каждый виджет должен вызывать только один хук контекста */}
            <li>
              Render counter: <code>const ref = useRef(0); ref.current += 1</code> — strictly <code>useRef</code>, not <code>useState</code>!
            </li>
            {/* Счётчик рендеров: const ref = useRef(0); ref.current += 1 — строго useRef, не useState! */}
            <li>
              <code>ref.current</code> increases on every component function call = every render
            </li>
            {/* ref.current увеличивается при каждом вызове функции компонента = при каждом рендере */}
            <li>
              If pressing "Add notification" increases all counters — components are subscribed to a shared context
            </li>
            {/* Если при нажатии "Добавить уведомление" растут все счётчики — значит компоненты подписаны на общий контекст */}
            <li>
              Display the counter directly in JSX: <code>{'{renderCount}'}</code> — it updates along with re-render
            </li>
            {/* Отображайте счётчик прямо в JSX: {renderCount} — он обновится вместе с ре-рендером */}
          </ul>
        </div>

        {/* Hint 5.3 */}
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px', border: '1px solid #ffe0b2' }}>
          <h3 style={{ margin: '0 0 0.75rem', color: '#e65100' }}>Task 5.3: ComposeProviders</h3>
          {/* Задание 5.3: ComposeProviders */}
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>
              Use <code>reduceRight</code>, not <code>reduce</code> — the first in the array should be the outermost
            </li>
            {/* Используйте reduceRight, не reduce — первый в массиве должен быть самым внешним */}
            <li>
              Initial value of <code>reduceRight</code>: <code>children</code> (type <code>ReactNode</code>)
            </li>
            {/* Начальное значение reduceRight: children (тип ReactNode) */}
            <li>
              Cast the result to: <code>as React.ReactElement</code>
            </li>
            {/* Результат нужно привести к типу: as React.ReactElement */}
            <li>
              Provider type: <code>ComponentType&lt;{'{'} children: ReactNode {'}'}&gt;</code>
            </li>
            {/* Тип провайдера: ComponentType<{ children: ReactNode }> */}
            <li>
              <code>[A, B, C].reduceRight((acc, P) =&gt; &lt;P&gt;{'{acc}'}&lt;/P&gt;, children)</code> gives{' '}
              <code>&lt;A&gt;&lt;B&gt;&lt;C&gt;children&lt;/C&gt;&lt;/B&gt;&lt;/A&gt;</code>
            </li>
          </ul>
        </div>

        {/* Common mistakes */}
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px', border: '1px solid #f8bbd0' }}>
          <h3 style={{ margin: '0 0 0.75rem', color: '#ad1457' }}>Common Mistakes / Типичные ошибки</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>
              <strong>Forgot useMemo</strong> in provider → every provider render creates a new object → all subscribers re-render for no reason
            </li>
            {/* useMemo забыли в провайдере → каждый рендер провайдера создаёт новый объект → все подписчики ре-рендерятся без причины */}
            <li>
              <strong>useState for counter</strong> → update triggers an extra render, distorting the measurement
            </li>
            {/* useState для счётчика → обновление провоцирует лишний рендер, искажая измерение */}
            <li>
              <strong>reduce instead of reduceRight</strong> → first provider becomes the innermost, last becomes the outermost (reverse order)
            </li>
            {/* reduce вместо reduceRight → первый провайдер оказывается самым внутренним, последний — самым внешним (обратный порядок) */}
            <li>
              <strong>Exporting Context</strong> instead of hook → consumers bypass the provider check
            </li>
            {/* Экспорт Context вместо хука → потребители обходят проверку на наличие провайдера */}
          </ul>
        </div>

      </div>
    </div>
  )
}
