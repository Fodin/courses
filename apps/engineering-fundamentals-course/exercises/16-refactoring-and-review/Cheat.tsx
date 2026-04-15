// ============================================
// Cheat: Level 16 — Refactoring and Code Review Reference Card
// ============================================

const cardStyle: React.CSSProperties = {
  padding: '1rem 1.25rem',
  borderRadius: '8px',
  marginBottom: '0.75rem',
}

export function Task16_1() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '0.5rem' }}>Уровень 16: Рефакторинг и код-ревью</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Ключевые концепции уровня — используйте как шпаргалку после квиза.
      </p>

      <div style={{ ...cardStyle, background: '#e8f5e9', borderLeft: '4px solid #388e3c' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#1b5e20' }}>Рефакторинг без изменения поведения</h3>
        <p style={{ margin: 0, color: '#2e7d32', lineHeight: 1.6 }}>
          Рефакторинг — улучшение внутренней структуры кода <strong>без изменения внешнего поведения</strong>.
          Правило бойскаута: оставь код чище, чем нашёл.
          Обязательное условие: тесты, которые подтверждают сохранение поведения до и после.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#0d47a1' }}>Code Smells</h3>
        <p style={{ margin: 0, color: '#1565c0', lineHeight: 1.6 }}>
          <strong>Long Method</strong>: функция слишком длинная — декомпозируй.
          <strong>God Class</strong>: класс знает слишком много — раздели ответственности.
          <strong>Feature Envy</strong>: метод чаще обращается к данным другого класса, чем своего.
          <strong>Primitive Obsession</strong>: примитивы вместо Value Objects.
          <strong>Shotgun Surgery</strong>: одно изменение затрагивает много мест.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fff3e0', borderLeft: '4px solid #f57c00' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Техники рефакторинга</h3>
        <p style={{ margin: 0, color: '#bf360c', lineHeight: 1.6 }}>
          Extract Function/Method, Inline Function, Rename Variable.
          Replace Magic Number with Constant. Introduce Parameter Object.
          Replace Conditional with Polymorphism. Replace Loop with Pipeline.
          Каждый шаг — маленький и обратимый. Коммитить после каждого шага.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fce4ec', borderLeft: '4px solid #c62828' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#b71c1c' }}>Эффективное код-ревью</h3>
        <p style={{ margin: 0, color: '#c62828', lineHeight: 1.6 }}>
          Ревьюер ищет: корректность, читаемость, безопасность, производительность, тестируемость.
          Комментарии: конкретные, с объяснением «почему», с альтернативой.
          Не «это плохо», а «можно улучшить так, потому что...».
          Малые PR проще ревьюить: до 400 строк оптимально.
        </p>
      </div>
    </div>
  )
}
