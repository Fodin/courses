// ============================================
// Задание 2.1: Последствия циклических зависимостей — Решение
// ============================================

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

const CONSEQUENCES = [
  {
    label: 'Рантайм: TDZ-краши и хрупкий порядок импортов',
    body: 'Один и тот же цикл может годами работать, пока рефакторинг в совершенно другом файле не изменит порядок первого импорта — и тогда возникает ReferenceError (ESM) или тихий undefined (CJS).',
    bg: '#3b1d1d',
    accent: '#f87171',
  },
  {
    label: 'Сборка: сломанный tree-shaking и code-splitting',
    body: 'Бандлер не может доказать безопасность разделения модулей, участвующих в цикле, и вынужден тащить их в бандл целиком — даже если реально нужен маленький кусочек кода.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Разработка: медленный HMR и полная пересборка',
    body: 'Инвалидация модулей не может точно определить границы влияния изменения внутри цикла, из-за чего HMR деградирует до полной перезагрузки страницы.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'Тесты: тяжёлые и хрупкие моки',
    body: 'Чтобы замокать один модуль из цикла, приходится тянуть в тест весь связанный кластер модулей — юнит-тест фактически превращается в интеграционный.',
    bg: '#1a3a2e',
    accent: '#34d399',
  },
  {
    label: 'God graph: невозможность переиспользования',
    body: 'При накоплении множества пересекающихся циклов граф импортов схлопывается в один большой сильно связный компонент — модуль нельзя выдернуть и использовать отдельно.',
    bg: '#3d2817',
    accent: '#fb923c',
  },
]

const SYMPTOM_TABLE = [
  {
    symptom: 'ReferenceError при старте',
    cause: 'TDZ в ESM-цикле',
    danger: 'Краш, зависящий от порядка импортов',
  },
  {
    symptom: 'Тихий undefined',
    cause: 'Partial exports в CJS-цикле',
    danger: 'Баг проявляется позже, в другом месте',
  },
  {
    symptom: 'Бандл больше ожидаемого',
    cause: 'Сломан tree-shaking',
    danger: 'Лишний вес в продакшене',
  },
  {
    symptom: 'Медленный HMR',
    cause: 'Инвалидация не может определить границы',
    danger: 'Замедление разработки',
  },
  {
    symptom: 'Тесты падают непонятно почему',
    cause: 'Моки тянут весь кластер модулей',
    danger: 'Хрупкие, дорогие в поддержке тесты',
  },
  {
    symptom: 'Модуль нельзя переиспользовать',
    cause: 'God graph — сильно связный компонент',
    danger: 'Невозможность модуляризации',
  },
]

export function Task2_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Задание 2.1: Чем грозят циклические зависимости</h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>
        Пять зон риска для запоминания
      </p>
      {CONSEQUENCES.map(c => (
        <div
          key={c.label}
          style={{ ...CARD_STYLE, background: c.bg, borderLeft: `4px solid ${c.accent}` }}
        >
          <div style={{ ...LABEL_STYLE, color: c.accent }}>{c.label}</div>
          <div>{c.body}</div>
        </div>
      ))}
      <div style={{ ...CARD_STYLE, background: '#1f2937', borderLeft: '4px solid #9ca3af' }}>
        <div style={{ ...LABEL_STYLE, color: '#9ca3af' }}>Симптом → причина → опасность</div>
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <th style={TH_STYLE}>Симптом</th>
              <th style={TH_STYLE}>Причина</th>
              <th style={TH_STYLE}>Опасность</th>
            </tr>
          </thead>
          <tbody>
            {SYMPTOM_TABLE.map(row => (
              <tr key={row.symptom}>
                <td style={{ ...TD_STYLE, fontFamily: 'monospace', color: '#f87171' }}>
                  {row.symptom}
                </td>
                <td style={TD_STYLE}>{row.cause}</td>
                <td style={{ ...TD_STYLE, fontSize: '12px', color: '#fbbf24' }}>{row.danger}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
