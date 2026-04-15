// ============================================
// Cheat: Level 18 — AI-assisted Engineering Reference Card
// ============================================

const cardStyle: React.CSSProperties = {
  padding: '1rem 1.25rem',
  borderRadius: '8px',
  marginBottom: '0.75rem',
}

export function Task18_1() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '0.5rem' }}>Уровень 18: AI-assisted инженерия</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Ключевые концепции уровня — используйте как шпаргалку после квиза.
      </p>

      <div style={{ ...cardStyle, background: '#e8f5e9', borderLeft: '4px solid #388e3c' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#1b5e20' }}>AI как инструмент, а не замена инженера</h3>
        <p style={{ margin: 0, color: '#2e7d32', lineHeight: 1.6 }}>
          LLM ускоряет написание кода, но не заменяет проектирование, ревью и понимание.
          Всегда проверяй и понимай сгенерированный код — ты несёшь ответственность.
          AI хорошо: шаблонный код, объяснения, рефакторинг, написание тестов.
          AI плохо: сложные архитектурные решения, специфика вашего домена.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#0d47a1' }}>Prompt Engineering для разработчиков</h3>
        <p style={{ margin: 0, color: '#1565c0', lineHeight: 1.6 }}>
          Давай контекст: язык, фреймворк, версия, ограничения.
          Описывай желаемый результат, а не шаги — «что» а не «как».
          Итерируй: уточняй запрос на основе ответа.
          Используй примеры (few-shot): «вот как я обычно пишу, сделай похоже».
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fff3e0', borderLeft: '4px solid #f57c00' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Hallucinations и верификация</h3>
        <p style={{ margin: 0, color: '#bf360c', lineHeight: 1.6 }}>
          LLM может уверенно генерировать несуществующие API, библиотеки, аргументы функций.
          Всегда проверяй по документации. Запускай и тестируй код.
          Чем новее библиотека или специфичнее домен — тем выше риск галлюцинаций.
          Код-ревью AI-сгенерированного кода — обязательно, не опционально.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fce4ec', borderLeft: '4px solid #c62828' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#b71c1c' }}>Безопасность и приватность</h3>
        <p style={{ margin: 0, color: '#c62828', lineHeight: 1.6 }}>
          Не передавай в AI секреты: API ключи, пароли, персональные данные пользователей, NDA-код.
          AI-сгенерированный код может содержать уязвимости (SQLi, XSS, insecure defaults).
          Security review AI-кода — такой же, как для кода человека, не более доверия.
        </p>
      </div>
    </div>
  )
}
