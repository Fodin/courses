// ============================================
// Level 1: Подсказки — Композиция, children и слоты
// Level 1: Hints — Composition, children and slots
// ============================================

export function Cheat() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 720 }}>
      {/* Подсказки — Level 1: Композиция */}
      {/* Hints — Level 1: Composition */}
      <h2 style={{ marginTop: 0, fontSize: 20 }}>Подсказки — Level 1: Композиция</h2>

      {/* ---- 1.1 ---- */}
      {/* ---- 1.1 ---- */}
      <section style={{ marginBottom: 32 }}>
        {/* Задание 1.1 — Card со слотами */}
        {/* Task 1.1 — Card with slots */}
        <h3 style={{ color: '#667eea', borderBottom: '2px solid #667eea', paddingBottom: 6 }}>
          Задание 1.1 — Card со слотами
        </h3>

        {/* Интерфейс Card: */}
        {/* Card interface: */}
        <p><strong>Интерфейс Card:</strong></p>
        <pre style={codeStyle}>{`interface CardProps {
  header?: React.ReactNode  // опциональный слот
  children: React.ReactNode // обязательный контент
  footer?: React.ReactNode  // опциональный слот
}`}</pre>

        {/* Условный рендеринг слота: */}
        {/* Conditional slot rendering: */}
        <p><strong>Условный рендеринг слота:</strong></p>
        <pre style={codeStyle}>{`// Не рендерит div если header не передан
{header && (
  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0' }}>
    {header}
  </div>
)}`}</pre>

        {/* Несколько кнопок в footer: */}
        {/* Multiple buttons in footer: */}
        <p><strong>Несколько кнопок в footer:</strong></p>
        <pre style={codeStyle}>{`// Оберните в Fragment
<Card footer={
  <>
    <button>Отмена</button>
    <button>Сохранить</button>
  </>
}>
  ...
</Card>`}</pre>
      </section>

      {/* ---- 1.2 ---- */}
      {/* ---- 1.2 ---- */}
      <section style={{ marginBottom: 32 }}>
        {/* Задание 1.2 — PageLayout */}
        {/* Task 1.2 — PageLayout */}
        <h3 style={{ color: '#667eea', borderBottom: '2px solid #667eea', paddingBottom: 6 }}>
          Задание 1.2 — PageLayout
        </h3>

        {/* Структура flexbox-layout: */}
        {/* flexbox-layout structure: */}
        <p><strong>Структура flexbox-layout:</strong></p>
        <pre style={codeStyle}>{`// Внешний контейнер — вертикальный flex
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
  <header>{header}</header>

  {/* Горизонтальный flex для sidebar + main */}
  <div style={{ display: 'flex', flex: 1 }}>
    {sidebar && <aside style={{ width: 220 }}>{sidebar}</aside>}
    <main style={{ flex: 1 }}>{children}</main>
  </div>

  {footer && <footer>{footer}</footer>}
</div>`}</pre>

        {/* Сетка статистических карточек: */}
        {/* Statistics cards grid: */}
        <p><strong>Сетка статистических карточек:</strong></p>
        <pre style={codeStyle}>{`<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 16,
}}>
  <StatCard label="Пользователи" value="12 483" change="+8.2%" />
  ...
</div>`}</pre>
      </section>

      {/* ---- 1.3 ---- */}
      {/* ---- 1.3 ---- */}
      <section style={{ marginBottom: 32 }}>
        {/* Задание 1.3 — Accordion */}
        {/* Task 1.3 — Accordion */}
        <h3 style={{ color: '#667eea', borderBottom: '2px solid #667eea', paddingBottom: 6 }}>
          Задание 1.3 — Accordion
        </h3>

        {/* AccordionItem со state: */}
        {/* AccordionItem with state: */}
        <p><strong>AccordionItem со state:</strong></p>
        <pre style={codeStyle}>{`function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div>
      <button onClick={() => setIsOpen(prev => !prev)}>
        <span>{title}</span>
        {/* Стрелка, которая поворачивается */}
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', display: 'inline-block' }}>
          ▼
        </span>
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  )
}`}</pre>

        {/* Title с JSX (бейдж): */}
        {/* Title with JSX (badge): */}
        <p><strong>Title с JSX (бейдж):</strong></p>
        <pre style={codeStyle}>{`<AccordionItem
  title={
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      Текст вопроса
      <span style={{ background: '#667eea', color: '#fff', padding: '2px 6px', borderRadius: 10, fontSize: 10 }}>
        Важно
      </span>
    </span>
  }
>
  Ответ...
</AccordionItem>`}</pre>
      </section>

      {/* Принцип: компонент не знает о своём содержимом — он только определяет структуру. */}
      {/* Principle: the component doesn't know about its content — it only defines the structure. */}
      {/* Содержимое определяет пользователь компонента. */}
      {/* The component consumer determines the content. */}
      <p style={{ color: '#888', fontSize: 12 }}>
        Принцип: компонент не знает о своём содержимом — он только определяет структуру.
        Содержимое определяет пользователь компонента.
      </p>
    </div>
  )
}

const codeStyle: React.CSSProperties = {
  background: '#1e1e2e',
  color: '#cdd6f4',
  padding: 16,
  borderRadius: 8,
  fontSize: 12,
  overflowX: 'auto',
  lineHeight: 1.6,
}
