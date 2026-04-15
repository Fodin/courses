// ============================================
// Task 17.1 Solution: Platform Agnostic — Reference Card
// ============================================

const cardStyle: React.CSSProperties = {
  padding: '1rem 1.25rem',
  borderRadius: '8px',
  marginBottom: '0.75rem',
}

export function Task17_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '0.5rem' }}>Уровень 17: Платформенная независимость</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Ключевые концепции уровня — используйте как шпаргалку после квиза.
      </p>

      <div style={{ ...cardStyle, background: '#e8f5e9', borderLeft: '4px solid #388e3c' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#1b5e20' }}>Разделение бизнес-логики и платформы</h3>
        <p style={{ margin: 0, color: '#2e7d32', lineHeight: 1.6 }}>
          Бизнес-логика не должна знать о браузере, Node.js, React Native или Electron.
          Чистая функция, принимающая данные и возвращающая результат — портабельна по определению.
          Платформенный код: файловая система, DOM, HTTP, нотификации — за интерфейсами/адаптерами.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#0d47a1' }}>Адаптеры и порты (Hexagonal Architecture)</h3>
        <p style={{ margin: 0, color: '#1565c0', lineHeight: 1.6 }}>
          <strong>Порт</strong>: интерфейс, определяемый ядром приложения (что нужно от внешнего мира).
          <strong>Адаптер</strong>: конкретная реализация порта для конкретной платформы.
          Ядро не зависит от адаптеров — только от портов (интерфейсов).
          Тестировать ядро можно с in-memory адаптерами без реальной инфраструктуры.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fff3e0', borderLeft: '4px solid #f57c00' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Universal / Isomorphic код</h3>
        <p style={{ margin: 0, color: '#bf360c', lineHeight: 1.6 }}>
          Код, работающий и в браузере, и в Node.js. Пример: SSR в Next.js, Nuxt.js.
          Опасности: <code>window</code>, <code>document</code>, <code>localStorage</code> — только в браузере.
          <code>fs</code>, <code>process</code> — только в Node.js. Проверяй окружение через feature detection.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#f3e5f5', borderLeft: '4px solid #7b1fa2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#6a1b9a' }}>Переносимость данных и форматов</h3>
        <p style={{ margin: 0, color: '#7b1fa2', lineHeight: 1.6 }}>
          JSON — универсальный формат, но без Date, undefined, BigInt, Map, Set.
          Избегай платформо-специфичных форматов в API: используй ISO 8601 для дат, числа вместо Enum.
          Сериализация/десериализация — за адаптером, ядро работает с доменными типами.
        </p>
      </div>
    </div>
  )
}
