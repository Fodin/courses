// Level 13: CI gate and prevention — reference card

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

const STEPS = [
  {
    label: '1. Шаг CI: madge --circular',
    body: 'Ненулевой exit code при найденном цикле. Аналог — dependency-cruiser с severity: "error" на правиле no-circular, или import/no-cycle в eslint с --max-warnings=0.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: '2. Required status check',
    body: 'Красный job сам по себе не блокирует merge. Нужно явно добавить его в Branch protection rules → Require status checks to pass.',
    bg: '#1a3a2e',
    accent: '#34d399',
  },
  {
    label: '3. Архитектурная фитнес-функция',
    body: 'Проверка "нет циклов" — один из видов автоматизированных тестов архитектурного свойства системы (термин из Building Evolutionary Architectures), встраивается в pipeline как обычный тест.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: '4. Baseline / бюджет для легаси',
    body: 'Зафиксировать текущее число циклов, запретить рост (правило-храповик), постепенно снижать порог по мере починки — не блокировать весь CI разом.',
    bg: '#3a2a1e',
    accent: '#fb923c',
  },
]

const WORKFLOW_YAML = `jobs:
  circular-deps-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx madge --circular --extensions ts,tsx src/`

const BASELINE_SNIPPET = `const BASELINE = 47
const cycles = JSON.parse(
  execSync('npx madge --circular --json src/').toString()
)
if (cycles.length > BASELINE) {
  console.error('Новые циклы запрещены')
  process.exit(1)
}`

export function Task13_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 13: CI-гейт и предотвращение</h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>
        Чтобы циклы не возвращались после чистки
      </p>
      {STEPS.map(s => (
        <div
          key={s.label}
          style={{ ...CARD_STYLE, background: s.bg, borderLeft: `4px solid ${s.accent}` }}
        >
          <div style={{ ...LABEL_STYLE, color: s.accent }}>{s.label}</div>
          <div>{s.body}</div>
        </div>
      ))}
      <div style={{ ...CARD_STYLE, background: '#1f2937', borderLeft: '4px solid #9ca3af' }}>
        <div style={{ ...LABEL_STYLE, color: '#9ca3af' }}>Пример: GitHub Actions job</div>
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
          {WORKFLOW_YAML}
        </pre>
      </div>
      <div style={{ ...CARD_STYLE, background: '#1f2937', borderLeft: '4px solid #fbbf24' }}>
        <div style={{ ...LABEL_STYLE, color: '#fbbf24' }}>Пример: baseline-скрипт (храповик)</div>
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
          {BASELINE_SNIPPET}
        </pre>
      </div>
    </div>
  )
}
