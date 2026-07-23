// Level 11: FSD boundary linters — reference card

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

const TOOLS = [
  {
    label: 'eslint-plugin-boundaries',
    body: 'Конструктор: вы описываете element-types (слои) и матрицу allow/disallow между ними. Правило entry-point запрещает обход public API. Максимальная гибкость, конфиг пишете сами.',
    example: `settings: { 'boundaries/elements': [...] }
rules: { 'boundaries/element-types': ['error', {
  default: 'disallow',
  rules: [{ from: 'features', allow: ['entities', 'shared'] }],
}]}`,
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: '@feature-sliced/eslint-config',
    body: 'Официальный готовый пресет под FSD. Проверяет направление слоёв, изоляцию слайсов (запрет cross-import) и обход public API — без ручного описания матрицы.',
    example: `import fsd from '@feature-sliced/eslint-config'
export default [...fsd.configs.recommended]`,
    bg: '#1a3a2e',
    accent: '#34d399',
  },
  {
    label: 'Steiger',
    body: 'Отдельный CLI, не ESLint-плагин. Проверяет структуру FSD целиком: состав слайсов, public-api, insignificant-slice и т.п. Смотрит на дерево src/ "сверху".',
    example: `npx steiger ./src

src/entities/order
  ⚠  insignificant-slice`,
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
]

const COMPARISON = [
  {
    tool: 'Линтеры границ (boundaries / FSD-config / Steiger)',
    catches: 'Причину — нарушение направления импорта, до того как он замкнётся в цикл',
    misses: 'Цикл внутри одного разрешённого слоя (напр. два файла в shared/lib)',
  },
  {
    tool: 'import/no-cycle (уровень 6)',
    catches: 'Сам факт цикла в графе импортов, независимо от архитектуры',
    misses: 'Архитектурно неверный, но пока не зацикленный импорт',
  },
]

export function Task11_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 11: FSD — линтеры границ</h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>
        Автоматизация правил слоёв и слайсов
      </p>
      {TOOLS.map(t => (
        <div
          key={t.label}
          style={{ ...CARD_STYLE, background: t.bg, borderLeft: `4px solid ${t.accent}` }}
        >
          <div style={{ ...LABEL_STYLE, color: t.accent }}>{t.label}</div>
          <div style={{ marginBottom: '8px' }}>{t.body}</div>
          <pre
            style={{
              margin: 0,
              padding: '10px 12px',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '6px',
              fontSize: '12px',
              overflowX: 'auto',
              fontFamily: 'monospace',
            }}
          >
            {t.example}
          </pre>
        </div>
      ))}
      <div style={{ ...CARD_STYLE, background: '#1f2937', borderLeft: '4px solid #9ca3af' }}>
        <div style={{ ...LABEL_STYLE, color: '#9ca3af' }}>
          Связка с import/no-cycle: два эшелона защиты
        </div>
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <th style={TH_STYLE}>Инструмент</th>
              <th style={TH_STYLE}>Ловит</th>
              <th style={TH_STYLE}>Не ловит</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map(row => (
              <tr key={row.tool}>
                <td style={TD_STYLE}>{row.tool}</td>
                <td style={TD_STYLE}>{row.catches}</td>
                <td style={{ ...TD_STYLE, color: '#f87171' }}>{row.misses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
