export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 0 — Декомпозиция компонентов</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 0.1: Декомпозиция ProductPage</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>Начните с определения интерфейсов <code>Product</code> и <code>Review</code> — это покажет, какие props нужны каждому компоненту</li>
          <li><strong>ProductCard</strong> — Dumb компонент: принимает <code>product: Product</code>, рендерит только JSX без state</li>
          <li><strong>ReviewsList</strong> — Dumb компонент: принимает <code>reviews: Review[]</code>, используйте <code>'★'.repeat(review.rating)</code> для звёздочек</li>
          <li><strong>AddToCartForm</strong> — может иметь локальный UI-state: <code>quantity</code> и <code>added</code>. Это нормально для Presentational компонента!</li>
          <li><strong>RelatedProducts</strong> — Dumb компонент: принимает <code>products: Product[]</code>, рендерит горизонтальную плитку через <code>display: flex</code></li>
          <li>Компонент <code>Task0_1</code> — оркестратор: хранит данные как константы или в state, рендерит 4 дочерних компонента</li>
          <li>Кнопка "В корзину": <code>setAdded(true)</code> → <code>setTimeout(() =&gt; setAdded(false), 2000)</code></li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 0.2: Container / Presentational</h3>
        <ul style={{ lineHeight: 2 }}>
          <li><strong>UserProfileView</strong> — никакого <code>useState</code>, <code>useEffect</code> или <code>fetch</code>. Только <code>props → JSX</code></li>
          <li>Индикатор онлайн: абсолютно позиционированный <code>span</code> поверх аватара с <code>position: relative</code> на обёртке</li>
          <li><strong>UserProfileContainer</strong>: три переменных state — <code>user</code>, <code>loading</code>, <code>error</code></li>
          <li>Симуляция загрузки: <code>useEffect(() =&gt; {'{'} setLoading(true); const t = setTimeout(..., 1000); return () =&gt; clearTimeout(t) {'}'}, [userId, reloadKey])</code></li>
          <li>Кнопка "Перезагрузить": добавьте state <code>reloadKey</code> и инкрементируйте его при нажатии — это пересработает useEffect</li>
          <li>Порядок render: <code>if (loading) return &lt;Spinner /&gt;</code> → <code>if (error) return &lt;Error /&gt;</code> → <code>if (!user) return null</code> → <code>return &lt;UserProfileView user={'{'}user{'}'} /&gt;</code></li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1976d2' }}>Задание 0.3: Декомпозиция Dashboard</h3>
        <ul style={{ lineHeight: 2 }}>
          <li><strong>FilterPanel</strong> — контролируемые inputs: <code>value={'{'}filters.period{'}'}</code> + <code>onChange={'{'}e =&gt; onChange({'{'} ...filters, period: e.target.value {'}'}{'}'}</code></li>
          <li><strong>StatsCards</strong>: цвет изменения — <code>color: change &gt;= 0 ? '#4caf50' : '#f44336'</code></li>
          <li><strong>SalesChart</strong>: высота столбца — <code>height: `${'$'}{'{'}(value / maxValue) * 100{'}'}px`</code>. Выровняйте по нижнему краю через <code>alignItems: 'flex-end'</code></li>
          <li><strong>DataTable</strong>: локальный state <code>sortField</code> и <code>sortDir</code> — это UI-state, допустимо в Presentational компоненте</li>
          <li>Сортировка: <code>[...rows].sort((a, b) =&gt; ...)</code> — всегда создавайте новый массив перед sort, не мутируйте props</li>
          <li>При клике на тот же заголовок — меняйте только <code>sortDir</code>. При клике на другой — меняйте <code>sortField</code> и сбрасывайте <code>sortDir</code> в <code>'desc'</code></li>
          <li>Компонент <code>Task0_3</code>: хранит <code>filters</code> в state, передаёт в FilterPanel и использует для генерации данных</li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#388e3c' }}>Общие советы</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>Для inline-стилей используйте объекты: <code>style={'{'}{'{'}display: 'flex', gap: '1rem'{'}'}{'}'}  </code></li>
          <li>TypeScript: избегайте <code>any</code>. Если не знаете тип — используйте <code>React.CSSProperties</code> для style-объектов</li>
          <li>Dumb компоненты: никакого import из API, store, context (кроме UI-context как ThemeContext)</li>
          <li>Если компонент описывается одним словом (Card, List, Form, Chart, Table) — он, скорее всего, правильно декомпозирован</li>
        </ul>
      </section>
    </div>
  )
}
