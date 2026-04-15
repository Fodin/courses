// ============================================
// Task 10.1 Solution: IoC and Contracts — Reference Card
// ============================================

const cardStyle: React.CSSProperties = {
  padding: '1rem 1.25rem',
  borderRadius: '8px',
  marginBottom: '0.75rem',
}

export function Task10_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '0.5rem' }}>Уровень 10: Инверсия управления и контракты</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Ключевые концепции уровня — используйте как шпаргалку после квиза.
      </p>

      <div style={{ ...cardStyle, background: '#e8f5e9', borderLeft: '4px solid #388e3c' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#1b5e20' }}>IoC — Инверсия управления</h3>
        <p style={{ margin: 0, color: '#2e7d32', lineHeight: 1.6 }}>
          Компонент не создаёт зависимости сам — он их <strong>получает снаружи</strong>.
          Управление жизненным циклом объектов передаётся контейнеру или вызывающей стороне.
          Принцип Hollywood: «не звони нам — мы позвоним тебе».
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#0d47a1' }}>DI — Внедрение зависимостей</h3>
        <p style={{ margin: 0, color: '#1565c0', lineHeight: 1.6 }}>
          Конкретная реализация IoC: зависимости передаются через конструктор, параметры функции
          или свойства объекта. Код зависит от <strong>абстракции</strong>, а не от конкретного класса.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fff3e0', borderLeft: '4px solid #f57c00' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Контракты и интерфейсы</h3>
        <p style={{ margin: 0, color: '#bf360c', lineHeight: 1.6 }}>
          Интерфейс — это контракт: «что» делает компонент, а не «как».
          Контракт позволяет подменять реализации без изменения потребителя.
          Принцип подстановки Лисков (LSP): любая реализация интерфейса взаимозаменяема.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fce4ec', borderLeft: '4px solid #c62828' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#b71c1c' }}>Dependency Inversion Principle (DIP)</h3>
        <p style={{ margin: 0, color: '#c62828', lineHeight: 1.6 }}>
          Модули высокого уровня не зависят от модулей низкого уровня — оба зависят от <strong>абстракции</strong>.
          Абстракции не зависят от деталей. Детали зависят от абстракций.
        </p>
      </div>
    </div>
  )
}
