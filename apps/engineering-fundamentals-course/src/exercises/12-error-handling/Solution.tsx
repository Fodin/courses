// ============================================
// Task 12.1 Solution: Error Handling — Reference Card
// ============================================

const cardStyle: React.CSSProperties = {
  padding: '1rem 1.25rem',
  borderRadius: '8px',
  marginBottom: '0.75rem',
}

export function Task12_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '0.5rem' }}>Уровень 12: Обработка ошибок</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Ключевые концепции уровня — используйте как шпаргалку после квиза.
      </p>

      <div style={{ ...cardStyle, background: '#e8f5e9', borderLeft: '4px solid #388e3c' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#1b5e20' }}>Ожидаемые vs неожиданные ошибки</h3>
        <p style={{ margin: 0, color: '#2e7d32', lineHeight: 1.6 }}>
          <strong>Ожидаемые</strong> (domain errors): пользователь не найден, нет прав доступа — часть бизнес-логики.
          Возвращайте как значение: <code>Result&lt;T, E&gt;</code>, <code>Either</code>, объект с полем <code>error</code>.
          <strong>Неожиданные</strong> (exceptions): баги, сбои инфраструктуры — бросайте исключения.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#0d47a1' }}>Result-тип и Railway-ориентированное программирование</h3>
        <p style={{ margin: 0, color: '#1565c0', lineHeight: 1.6 }}>
          <code>Result&lt;Ok, Err&gt;</code> — функция возвращает либо успех, либо ошибку.
          Позволяет строить цепочки операций без try/catch: каждый шаг либо продолжает «happy path»,
          либо переходит на «error track». Делает ошибки явными на уровне типов.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fff3e0', borderLeft: '4px solid #f57c00' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Fail Fast и Defence in Depth</h3>
        <p style={{ margin: 0, color: '#bf360c', lineHeight: 1.6 }}>
          <strong>Fail Fast</strong>: проверяй предусловия в начале функции, падай немедленно при нарушении контракта.
          <strong>Defence in Depth</strong>: валидируй данные на каждом уровне — на входе в API, в сервисе, в репозитории.
          Не доверяй данным из внешних источников без проверки.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fce4ec', borderLeft: '4px solid #c62828' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#b71c1c' }}>Граница обработки ошибок</h3>
        <p style={{ margin: 0, color: '#c62828', lineHeight: 1.6 }}>
          Обрабатывай ошибки там, где есть контекст для принятия решения.
          Не глотай ошибки молча (пустой catch). Логируй с достаточным контекстом.
          В UI: Error Boundaries ловят рендер-ошибки. В API: возвращай осмысленные HTTP-статусы.
        </p>
      </div>
    </div>
  )
}
