// ============================================
// Cheat: Level 15 — Testing Reference Card
// ============================================

const cardStyle: React.CSSProperties = {
  padding: '1rem 1.25rem',
  borderRadius: '8px',
  marginBottom: '0.75rem',
}

export function Task15_1() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '0.5rem' }}>Уровень 15: Тестирование</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Ключевые концепции уровня — используйте как шпаргалку после квиза.
      </p>

      <div style={{ ...cardStyle, background: '#e8f5e9', borderLeft: '4px solid #388e3c' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#1b5e20' }}>Пирамида тестирования</h3>
        <p style={{ margin: 0, color: '#2e7d32', lineHeight: 1.6 }}>
          <strong>Unit</strong>: много, быстрые, изолированные — тестируют одну функцию/модуль.
          <strong>Integration</strong>: меньше, тестируют взаимодействие нескольких модулей.
          <strong>E2E</strong>: мало, медленные, тестируют весь пользовательский сценарий.
          Антипаттерн: «перевёрнутая пирамида» — много E2E, мало unit.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#0d47a1' }}>AAA — Arrange, Act, Assert</h3>
        <p style={{ margin: 0, color: '#1565c0', lineHeight: 1.6 }}>
          <strong>Arrange</strong>: подготовить данные, создать объекты, настроить моки.
          <strong>Act</strong>: вызвать тестируемый код (одна строка).
          <strong>Assert</strong>: проверить результат.
          Одна концепция на один тест. Тест — документация поведения.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fff3e0', borderLeft: '4px solid #f57c00' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Test Doubles: Mock, Stub, Spy, Fake</h3>
        <p style={{ margin: 0, color: '#bf360c', lineHeight: 1.6 }}>
          <strong>Stub</strong>: возвращает заготовленные данные, не проверяет вызовы.
          <strong>Mock</strong>: проверяет, как именно был вызван (количество, аргументы).
          <strong>Spy</strong>: реальная реализация + запись вызовов.
          <strong>Fake</strong>: рабочая упрощённая реализация (in-memory БД).
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#f3e5f5', borderLeft: '4px solid #7b1fa2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#6a1b9a' }}>TDD и Property-based Testing</h3>
        <p style={{ margin: 0, color: '#7b1fa2', lineHeight: 1.6 }}>
          <strong>TDD</strong>: Red → Green → Refactor. Тест пишется до реализации.
          Преимущество: дизайн кода становится тестируемым по определению.
          <strong>Property-based</strong>: задаёшь свойство («сортировка идемпотентна»),
          фреймворк генерирует сотни случайных примеров (fast-check, hypothesis).
        </p>
      </div>
    </div>
  )
}
