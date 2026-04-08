// ============================================
// Level 5: Подсказки
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Level 5: Подсказки — Архитектура Context API</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Hint 5.1 */}
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9' }}>
          <h3 style={{ margin: '0 0 0.75rem', color: '#2e7d32' }}>Задание 5.1: createStrictContext</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>
              Используйте <code>createContext&lt;T | undefined&gt;(undefined)</code> — не <code>null</code>, а именно <code>undefined</code>
            </li>
            <li>
              В хуке: <code>if (value === undefined) {'{'} throw new Error(...) {'}'}</code>
            </li>
            <li>
              В сообщении ошибки укажите <code>displayName</code> — разработчику будет понятно, какой провайдер пропущен
            </li>
            <li>
              Возвращайте <code>[Context, useCtx] as const</code> — <code>as const</code> сохраняет тип кортежа, а не массива
            </li>
            <li>
              В провайдере: <code>const value = useMemo{'('}() =&gt; {'{'} mode, toggleMode {'}'}, [mode]{')'}</code>
            </li>
            <li>
              Для ErrorBoundary нужен class-компонент с <code>static getDerivedStateFromError</code>
            </li>
          </ul>
        </div>

        {/* Hint 5.2 */}
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px', border: '1px solid #bbdefb' }}>
          <h3 style={{ margin: '0 0 0.75rem', color: '#1565c0' }}>Задание 5.2: Разделение контекстов</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>
              Каждый виджет должен вызывать только <strong>один</strong> хук контекста
            </li>
            <li>
              Счётчик рендеров: <code>const ref = useRef(0); ref.current += 1</code> — строго <code>useRef</code>, не <code>useState</code>!
            </li>
            <li>
              <code>ref.current</code> увеличивается при каждом вызове функции компонента = при каждом рендере
            </li>
            <li>
              Если при нажатии "Добавить уведомление" растут все счётчики — значит компоненты подписаны на общий контекст
            </li>
            <li>
              Отображайте счётчик прямо в JSX: <code>{'{renderCount}'}</code> — он обновится вместе с ре-рендером
            </li>
          </ul>
        </div>

        {/* Hint 5.3 */}
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px', border: '1px solid #ffe0b2' }}>
          <h3 style={{ margin: '0 0 0.75rem', color: '#e65100' }}>Задание 5.3: ComposeProviders</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>
              Используйте <code>reduceRight</code>, не <code>reduce</code> — первый в массиве должен быть самым внешним
            </li>
            <li>
              Начальное значение <code>reduceRight</code>: <code>children</code> (тип <code>ReactNode</code>)
            </li>
            <li>
              Результат нужно привести к типу: <code>as React.ReactElement</code>
            </li>
            <li>
              Тип провайдера: <code>ComponentType&lt;{'{'} children: ReactNode {'}'}&gt;</code>
            </li>
            <li>
              <code>[A, B, C].reduceRight((acc, P) =&gt; &lt;P&gt;{'{acc}'}&lt;/P&gt;, children)</code> даёт{' '}
              <code>&lt;A&gt;&lt;B&gt;&lt;C&gt;children&lt;/C&gt;&lt;/B&gt;&lt;/A&gt;</code>
            </li>
          </ul>
        </div>

        {/* Common mistakes */}
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px', border: '1px solid #f8bbd0' }}>
          <h3 style={{ margin: '0 0 0.75rem', color: '#ad1457' }}>Типичные ошибки</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8 }}>
            <li>
              <strong>useMemo забыли</strong> в провайдере → каждый рендер провайдера создаёт новый объект → все подписчики ре-рендерятся без причины
            </li>
            <li>
              <strong>useState для счётчика</strong> → обновление провоцирует лишний рендер, искажая измерение
            </li>
            <li>
              <strong>reduce вместо reduceRight</strong> → первый провайдер оказывается самым внутренним, последний — самым внешним (обратный порядок)
            </li>
            <li>
              <strong>Экспорт Context</strong> вместо хука → потребители обходят проверку на наличие провайдера
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}
