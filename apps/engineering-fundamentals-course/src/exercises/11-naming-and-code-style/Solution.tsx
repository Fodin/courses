// ============================================
// Task 11.1 Solution: Naming and Code Style — Reference Card
// ============================================

const cardStyle: React.CSSProperties = {
  padding: '1rem 1.25rem',
  borderRadius: '8px',
  marginBottom: '0.75rem',
}

export function Task11_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '0.5rem' }}>Уровень 11: Именование и стиль кода</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Ключевые концепции уровня — используйте как шпаргалку после квиза.
      </p>

      <div style={{ ...cardStyle, background: '#e8f5e9', borderLeft: '4px solid #388e3c' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#1b5e20' }}>Принципы именования</h3>
        <p style={{ margin: 0, color: '#2e7d32', lineHeight: 1.6 }}>
          Имя должно раскрывать <strong>намерение</strong>: переменная, функция, класс — описывает «что» и «зачем».
          Избегайте сокращений, однобуквенных имён (кроме итераторов), общих слов вроде <code>data</code>, <code>info</code>, <code>manager</code>.
          Булевы переменные: <code>isLoading</code>, <code>hasError</code>, <code>canSubmit</code>.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#0d47a1' }}>Конвенции и соглашения</h3>
        <p style={{ margin: 0, color: '#1565c0', lineHeight: 1.6 }}>
          <strong>camelCase</strong> — переменные и функции. <strong>PascalCase</strong> — классы, компоненты, типы.
          <strong>SCREAMING_SNAKE_CASE</strong> — константы. <strong>kebab-case</strong> — файлы и папки.
          Консистентность внутри проекта важнее персональных предпочтений.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fff3e0', borderLeft: '4px solid #f57c00' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Длина функций и файлов</h3>
        <p style={{ margin: 0, color: '#bf360c', lineHeight: 1.6 }}>
          Функция — одна ответственность, умещается на экране без прокрутки (~20-30 строк).
          Файл — один модуль. Если файл вырос за 300-400 строк — сигнал к декомпозиции.
          Глубина вложенности: не более 3 уровней (используйте early return, guard clauses).
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#f3e5f5', borderLeft: '4px solid #7b1fa2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#6a1b9a' }}>Комментарии и самодокументирование</h3>
        <p style={{ margin: 0, color: '#7b1fa2', lineHeight: 1.6 }}>
          Хороший код объясняет «что» — имена говорят сами за себя.
          Комментарии объясняют «почему» — намерение, контекст, нестандартное решение.
          Избегайте комментариев, дублирующих код: <code>// increment i</code> над <code>i++</code>.
        </p>
      </div>
    </div>
  )
}
