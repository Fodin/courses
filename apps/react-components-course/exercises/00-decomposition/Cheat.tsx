export function Cheat() {
  return (
    <div className="exercise-container">
      {/* Подсказки: Level 0 — Декомпозиция компонентов */}
      {/* Hints: Level 0 — Component Decomposition */}
      <h2>Подсказки: Level 0 — Декомпозиция компонентов</h2>

      <section style={{ marginBottom: '2rem' }}>
        {/* Задание 0.1: Декомпозиция ProductPage */}
        {/* Task 0.1: ProductPage Decomposition */}
        <h3 style={{ color: '#1976d2' }}>Задание 0.1: Декомпозиция ProductPage</h3>
        <ul style={{ lineHeight: 2 }}>
          {/* Начните с определения интерфейсов Product и Review — это покажет, какие props нужны каждому компоненту */}
          {/* Start by defining the Product and Review interfaces — this will show which props each component needs */}
          <li>Начните с определения интерфейсов <code>Product</code> и <code>Review</code> — это покажет, какие props нужны каждому компоненту</li>
          {/* ProductCard — Dumb компонент: принимает product: Product, рендерит только JSX без state */}
          {/* ProductCard is a Dumb component: accepts product: Product, renders only JSX without state */}
          <li><strong>ProductCard</strong> — Dumb компонент: принимает <code>product: Product</code>, рендерит только JSX без state</li>
          {/* ReviewsList — Dumb компонент: принимает reviews: Review[], используйте '★'.repeat(review.rating) для звёздочек */}
          {/* ReviewsList is a Dumb component: accepts reviews: Review[], use '★'.repeat(review.rating) for stars */}
          <li><strong>ReviewsList</strong> — Dumb компонент: принимает <code>reviews: Review[]</code>, используйте <code>'★'.repeat(review.rating)</code> для звёздочек</li>
          {/* AddToCartForm — может иметь локальный UI-state: quantity и added. Это нормально для Presentational компонента! */}
          {/* AddToCartForm — may have local UI-state: quantity and added. This is fine for a Presentational component! */}
          <li><strong>AddToCartForm</strong> — может иметь локальный UI-state: <code>quantity</code> и <code>added</code>. Это нормально для Presentational компонента!</li>
          {/* RelatedProducts — Dumb компонент: принимает products: Product[], рендерит горизонтальную плитку через display: flex */}
          {/* RelatedProducts is a Dumb component: accepts products: Product[], renders a horizontal tile layout via display: flex */}
          <li><strong>RelatedProducts</strong> — Dumb компонент: принимает <code>products: Product[]</code>, рендерит горизонтальную плитку через <code>display: flex</code></li>
          {/* Компонент Task0_1 — оркестратор: хранит данные как константы или в state, рендерит 4 дочерних компонента */}
          {/* The Task0_1 component is an orchestrator: stores data as constants or in state, renders 4 child components */}
          <li>Компонент <code>Task0_1</code> — оркестратор: хранит данные как константы или в state, рендерит 4 дочерних компонента</li>
          {/* Кнопка "В корзину": setAdded(true) → setTimeout(() => setAdded(false), 2000) */}
          {/* "Add to Cart" button: setAdded(true) → setTimeout(() => setAdded(false), 2000) */}
          <li>Кнопка "В корзину": <code>setAdded(true)</code> → <code>setTimeout(() =&gt; setAdded(false), 2000)</code></li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        {/* Задание 0.2: Container / Presentational разделение */}
        {/* Task 0.2: Container / Presentational separation */}
        <h3 style={{ color: '#1976d2' }}>Задание 0.2: Container / Presentational</h3>
        <ul style={{ lineHeight: 2 }}>
          {/* UserProfileView — никакого useState, useEffect или fetch. Только props → JSX */}
          {/* UserProfileView — no useState, useEffect, or fetch. Only props → JSX */}
          <li><strong>UserProfileView</strong> — никакого <code>useState</code>, <code>useEffect</code> или <code>fetch</code>. Только <code>props → JSX</code></li>
          {/* Индикатор онлайн: абсолютно позиционированный span поверх аватара с position: relative на обёртке */}
          {/* Online indicator: an absolutely positioned span over the avatar with position: relative on the wrapper */}
          <li>Индикатор онлайн: абсолютно позиционированный <code>span</code> поверх аватара с <code>position: relative</code> на обёртке</li>
          {/* UserProfileContainer: три переменных state — user, loading, error */}
          {/* UserProfileContainer: three state variables — user, loading, error */}
          <li><strong>UserProfileContainer</strong>: три переменных state — <code>user</code>, <code>loading</code>, <code>error</code></li>
          {/* Симуляция загрузки: useEffect(() => { setLoading(true); const t = setTimeout(..., 1000); return () => clearTimeout(t) }, [userId, reloadKey]) */}
          {/* Simulate loading: useEffect(() => { setLoading(true); const t = setTimeout(..., 1000); return () => clearTimeout(t) }, [userId, reloadKey]) */}
          <li>Симуляция загрузки: <code>useEffect(() =&gt; {'{'} setLoading(true); const t = setTimeout(..., 1000); return () =&gt; clearTimeout(t) {'}'}, [userId, reloadKey])</code></li>
          {/* Кнопка "Перезагрузить": добавьте state reloadKey и инкрементируйте его при нажатии — это пересработает useEffect */}
          {/* "Reload" button: add a reloadKey state and increment it on click — this will retrigger the useEffect */}
          <li>Кнопка "Перезагрузить": добавьте state <code>reloadKey</code> и инкрементируйте его при нажатии — это пересработает useEffect</li>
          {/* Порядок render: if (loading) return <Spinner /> → if (error) return <Error /> → if (!user) return null → return <UserProfileView user={user} /> */}
          {/* Render order: if (loading) return <Spinner /> → if (error) return <Error /> → if (!user) return null → return <UserProfileView user={user} /> */}
          <li>Порядок render: <code>if (loading) return &lt;Spinner /&gt;</code> → <code>if (error) return &lt;Error /&gt;</code> → <code>if (!user) return null</code> → <code>return &lt;UserProfileView user={'{'}user{'}'} /&gt;</code></li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        {/* Задание 0.3: Декомпозиция Dashboard */}
        {/* Task 0.3: Dashboard Decomposition */}
        <h3 style={{ color: '#1976d2' }}>Задание 0.3: Декомпозиция Dashboard</h3>
        <ul style={{ lineHeight: 2 }}>
          {/* FilterPanel — контролируемые inputs: value={filters.period} + onChange={e => onChange({ ...filters, period: e.target.value })} */}
          {/* FilterPanel — controlled inputs: value={filters.period} + onChange={e => onChange({ ...filters, period: e.target.value })} */}
          <li><strong>FilterPanel</strong> — контролируемые inputs: <code>value={'{'}filters.period{'}'}</code> + <code>onChange={'{'}e =&gt; onChange({'{'} ...filters, period: e.target.value {'}'}{'}'}</code></li>
          {/* StatsCards: цвет изменения — color: change >= 0 ? '#4caf50' : '#f44336' */}
          {/* StatsCards: change color — color: change >= 0 ? '#4caf50' : '#f44336' */}
          <li><strong>StatsCards</strong>: цвет изменения — <code>color: change &gt;= 0 ? '#4caf50' : '#f44336'</code></li>
          {/* SalesChart: высота столбца — height: `${(value / maxValue) * 100}px`. Выровняйте по нижнему краю через alignItems: 'flex-end' */}
          {/* SalesChart: bar height — height: `${(value / maxValue) * 100}px`. Align to bottom via alignItems: 'flex-end' */}
          <li><strong>SalesChart</strong>: высота столбца — <code>height: `${'$'}{'{'}(value / maxValue) * 100{'}'}px`</code>. Выровняйте по нижнему краю через <code>alignItems: 'flex-end'</code></li>
          {/* DataTable: локальный state sortField и sortDir — это UI-state, допустимо в Presentational компоненте */}
          {/* DataTable: local state sortField and sortDir — this is UI-state, acceptable in a Presentational component */}
          <li><strong>DataTable</strong>: локальный state <code>sortField</code> и <code>sortDir</code> — это UI-state, допустимо в Presentational компоненте</li>
          {/* Сортировка: [...rows].sort((a, b) => ...) — всегда создавайте новый массив перед sort, не мутируйте props */}
          {/* Sorting: [...rows].sort((a, b) => ...) — always create a new array before sorting, do not mutate props */}
          <li>Сортировка: <code>[...rows].sort((a, b) =&gt; ...)</code> — всегда создавайте новый массив перед sort, не мутируйте props</li>
          {/* При клике на тот же заголовок — меняйте только sortDir. При клике на другой — меняйте sortField и сбрасывайте sortDir в 'desc' */}
          {/* Clicking the same header — change only sortDir. Clicking a different one — change sortField and reset sortDir to 'desc' */}
          <li>При клике на тот же заголовок — меняйте только <code>sortDir</code>. При клике на другой — меняйте <code>sortField</code> и сбрасывайте <code>sortDir</code> в <code>'desc'</code></li>
          {/* Компонент Task0_3: хранит filters в state, передаёт в FilterPanel и использует для генерации данных */}
          {/* The Task0_3 component: stores filters in state, passes them to FilterPanel and uses them for data generation */}
          <li>Компонент <code>Task0_3</code>: хранит <code>filters</code> в state, передаёт в FilterPanel и использует для генерации данных</li>
        </ul>
      </section>

      <section>
        {/* Общие советы */}
        {/* General tips */}
        <h3 style={{ color: '#388e3c' }}>Общие советы</h3>
        <ul style={{ lineHeight: 2 }}>
          {/* Для inline-стилей используйте объекты: style={{display: 'flex', gap: '1rem'}} */}
          {/* For inline styles, use objects: style={{display: 'flex', gap: '1rem'}} */}
          <li>Для inline-стилей используйте объекты: <code>style={'{'}{'{'}display: 'flex', gap: '1rem'{'}'}{'}'}</code>  </li>
          {/* TypeScript: избегайте any. Если не знаете тип — используйте React.CSSProperties для style-объектов */}
          {/* TypeScript: avoid any. If unsure of the type — use React.CSSProperties for style objects */}
          <li>TypeScript: избегайте <code>any</code>. Если не знаете тип — используйте <code>React.CSSProperties</code> для style-объектов</li>
          {/* Dumb компоненты: никакого import из API, store, context (кроме UI-context как ThemeContext) */}
          {/* Dumb components: no imports from API, store, context (except UI-context like ThemeContext) */}
          <li>Dumb компоненты: никакого import из API, store, context (кроме UI-context как ThemeContext)</li>
          {/* Если компонент описывается одним словом (Card, List, Form, Chart, Table) — он, скорее всего, правильно декомпозирован */}
          {/* If a component can be described in one word (Card, List, Form, Chart, Table) — it is likely well-decomposed */}
          <li>Если компонент описывается одним словом (Card, List, Form, Chart, Table) — он, скорее всего, правильно декомпозирован</li>
        </ul>
      </section>
    </div>
  )
}
