// Level 7: dependency tree diagnostics — reference card

const CARD_STYLE: React.CSSProperties = {
  padding: '16px 20px',
  borderRadius: '8px',
  marginBottom: '12px',
  lineHeight: 1.6,
  fontSize: '14px',
  color: '#e5e7eb',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '6px',
}

const TABLE_STYLE: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13px',
  marginTop: '8px',
}

const TH_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '6px 10px',
  background: 'rgba(255,255,255,0.05)',
  fontWeight: 600,
  fontSize: '11px',
  letterSpacing: '0.05em',
}

const TD_STYLE: React.CSSProperties = {
  padding: '6px 10px',
  borderTop: '1px solid rgba(255,255,255,0.05)',
  verticalAlign: 'top',
}

const CONCEPTS = [
  {
    label: 'npm ls — просмотр дерева',
    body: 'npm ls — прямые зависимости. npm ls --all — полное дерево. npm ls pkg — найти пакет. npm ls --depth=N — ограничить глубину. npm ls --json — машиночитаемый формат.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'npm explain / npm why — «зачем этот пакет?»',
    body: 'Показывает цепочку: кто и почему требует данный пакет. Читается снизу вверх. Пустой вывод = пакет не в дереве. Алиас npm why работает одинаково.',
    bg: '#1a3a2e',
    accent: '#34d399',
  },
  {
    label: 'npm doctor — проверка окружения',
    body: 'Проверяет: ping registry, версии npm/Node, права на кеш и node_modules, git в PATH. Только диагностирует, не исправляет. Каждый WARN нужно устранять вручную.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
]

const MARKERS = [
  { marker: 'INVALID', meaning: 'Версия не удовлетворяет требованию', fix: 'npm install' },
  { marker: 'extraneous', meaning: 'Не указан в package.json', fix: 'npm prune' },
  { marker: 'missing', meaning: 'Требуется, но не установлен', fix: 'npm install' },
  { marker: 'deduped', meaning: 'Используется копия из родителя', fix: 'Норма, не проблема' },
]

export function Task7_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 7: Диагностика дерева зависимостей</h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>
        Ключевые концепции для запоминания
      </p>
      {CONCEPTS.map(c => (
        <div
          key={c.label}
          style={{ ...CARD_STYLE, background: c.bg, borderLeft: `4px solid ${c.accent}` }}
        >
          <div style={{ ...LABEL_STYLE, color: c.accent }}>{c.label}</div>
          <div>{c.body}</div>
        </div>
      ))}
      <div style={{ ...CARD_STYLE, background: '#1f2937', borderLeft: '4px solid #9ca3af' }}>
        <div style={{ ...LABEL_STYLE, color: '#9ca3af' }}>Маркеры npm ls</div>
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <th style={TH_STYLE}>Маркер</th>
              <th style={TH_STYLE}>Значение</th>
              <th style={TH_STYLE}>Действие</th>
            </tr>
          </thead>
          <tbody>
            {MARKERS.map(m => (
              <tr key={m.marker}>
                <td
                  style={{
                    ...TD_STYLE,
                    fontFamily: 'monospace',
                    color: m.marker === 'deduped' ? '#86efac' : '#f87171',
                  }}
                >
                  {m.marker}
                </td>
                <td style={TD_STYLE}>{m.meaning}</td>
                <td
                  style={{
                    ...TD_STYLE,
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#fbbf24',
                  }}
                >
                  {m.fix}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
