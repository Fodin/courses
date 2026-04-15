// ============================================
// Cheat: Level 14 — Metaprogramming and DSL Reference Card
// ============================================

const cardStyle: React.CSSProperties = {
  padding: '1rem 1.25rem',
  borderRadius: '8px',
  marginBottom: '0.75rem',
}

export function Task14_1() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '0.5rem' }}>Уровень 14: Метапрограммирование и DSL</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Ключевые концепции уровня — используйте как шпаргалку после квиза.
      </p>

      <div style={{ ...cardStyle, background: '#e8f5e9', borderLeft: '4px solid #388e3c' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#1b5e20' }}>Метапрограммирование</h3>
        <p style={{ margin: 0, color: '#2e7d32', lineHeight: 1.6 }}>
          Код, который пишет или манипулирует другим кодом во время выполнения.
          Инструменты JS: <code>Proxy</code>, <code>Reflect</code>, <code>Symbol</code>, декораторы.
          <code>Proxy</code> перехватывает операции над объектом (get, set, has, apply).
          Использование: валидация, логирование, реактивность (Vue 3), мемоизация.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#0d47a1' }}>DSL — предметно-ориентированный язык</h3>
        <p style={{ margin: 0, color: '#1565c0', lineHeight: 1.6 }}>
          <strong>Internal DSL</strong>: API поверх хост-языка, читается как «язык предметной области».
          Примеры: цепочки Zod, jQuery, Prisma query builder, jest matchers.
          <strong>External DSL</strong>: отдельный язык с парсером (SQL, GraphQL, регулярные выражения).
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fff3e0', borderLeft: '4px solid #f57c00' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Builder и Fluent Interface</h3>
        <p style={{ margin: 0, color: '#bf360c', lineHeight: 1.6 }}>
          Builder-паттерн: пошаговое построение сложного объекта.
          Fluent Interface: методы возвращают <code>this</code>, позволяя строить цепочки.
          Итог: читаемый, декларативный код. Риск: сложность отладки длинных цепочек.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fce4ec', borderLeft: '4px solid #c62828' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#b71c1c' }}>Декораторы и аннотации</h3>
        <p style={{ margin: 0, color: '#c62828', lineHeight: 1.6 }}>
          Декоратор — функция, оборачивающая класс, метод или свойство для расширения поведения.
          Примеры в TS: <code>@Injectable()</code>, <code>@Controller()</code>, <code>@Column()</code>.
          Декораторы применяются в момент объявления класса (compile-time / class evaluation).
        </p>
      </div>
    </div>
  )
}
