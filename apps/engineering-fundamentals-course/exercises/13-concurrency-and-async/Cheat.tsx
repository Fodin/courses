// ============================================
// Cheat: Level 13 — Concurrency and Async Reference Card
// ============================================

const cardStyle: React.CSSProperties = {
  padding: '1rem 1.25rem',
  borderRadius: '8px',
  marginBottom: '0.75rem',
}

export function Task13_1() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '0.5rem' }}>Уровень 13: Конкурентность и асинхронность</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Ключевые концепции уровня — используйте как шпаргалку после квиза.
      </p>

      <div style={{ ...cardStyle, background: '#e8f5e9', borderLeft: '4px solid #388e3c' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#1b5e20' }}>Concurrency vs Parallelism</h3>
        <p style={{ margin: 0, color: '#2e7d32', lineHeight: 1.6 }}>
          <strong>Конкурентность</strong>: несколько задач выполняются в перекрывающихся временных интервалах
          (не обязательно одновременно). <strong>Параллелизм</strong>: задачи выполняются физически одновременно
          на разных ядрах/процессорах. JS — однопоточный, конкурентность через event loop.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#e3f2fd', borderLeft: '4px solid #1976d2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#0d47a1' }}>Event Loop и микрозадачи</h3>
        <p style={{ margin: 0, color: '#1565c0', lineHeight: 1.6 }}>
          Call stack → Web APIs → Task Queue (macrotasks) → Microtask Queue.
          Микрозадачи (Promise.then, queueMicrotask) выполняются <strong>до</strong> следующего макрозадания.
          <code>setTimeout(fn, 0)</code> — макрозадание, выполнится после всех микрозадач текущего тика.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#fff3e0', borderLeft: '4px solid #f57c00' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Promise и async/await паттерны</h3>
        <p style={{ margin: 0, color: '#bf360c', lineHeight: 1.6 }}>
          <code>Promise.all</code> — параллельно, падает при первой ошибке.
          <code>Promise.allSettled</code> — параллельно, ждёт всех независимо от ошибок.
          <code>Promise.race</code> — побеждает первый завершившийся.
          <code>Promise.any</code> — первый успешный. Избегайте <code>await</code> в цикле — используйте <code>Promise.all</code>.
        </p>
      </div>

      <div style={{ ...cardStyle, background: '#f3e5f5', borderLeft: '4px solid #7b1fa2' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#6a1b9a' }}>Гонки и отмена операций</h3>
        <p style={{ margin: 0, color: '#7b1fa2', lineHeight: 1.6 }}>
          Race condition: конкурирующие асинхронные операции могут завершиться в неожиданном порядке.
          Решение: <code>AbortController</code> для отмены fetch, флаг актуальности (<code>let isCurrent = true</code>).
          В React: возвращайте cleanup-функцию из useEffect для отмены устаревших запросов.
        </p>
      </div>
    </div>
  )
}
