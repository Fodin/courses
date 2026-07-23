// Level 5: circular dependency detection tools — reference card

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

const CODE_STYLE: React.CSSProperties = {
  display: 'block',
  fontFamily: 'monospace',
  fontSize: '12px',
  background: 'rgba(0,0,0,0.3)',
  padding: '8px 10px',
  borderRadius: '4px',
  marginTop: '6px',
  whiteSpace: 'pre-wrap',
  color: '#fbbf24',
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

const MADGE_COMMANDS = [
  { cmd: 'npx madge --circular --extensions ts,tsx src', what: 'Найти все циклы в TS/TSX-коде' },
  { cmd: 'npx madge --circular --warning src', what: 'Найти циклы, не завершая процесс ошибкой' },
  {
    cmd: 'npx madge --image graph.svg src',
    what: 'Нарисовать граф всего проекта (нужен Graphviz)',
  },
  { cmd: 'npx madge --orphans src', what: 'Найти файлы, на которые никто не ссылается' },
  { cmd: "npx madge --exclude '^src/generated' --circular src", what: 'Исключить путь из анализа' },
]

const DEPCRUISE_COMMANDS = [
  { cmd: 'npx depcruise --init', what: 'Создать .dependency-cruiser.cjs с базовыми правилами' },
  {
    cmd: 'npx depcruise src --config .dependency-cruiser.cjs',
    what: 'Проверить проект по правилам конфига',
  },
  {
    cmd: 'npx depcruise src --config .dependency-cruiser.cjs --output-type err-long',
    what: 'Человекочитаемый отчёт по нарушениям',
  },
  {
    cmd: 'npx depcruise src --config .dependency-cruiser.cjs --output-type dot | dot -T svg > graph.svg',
    what: 'Граф зависимостей в SVG',
  },
]

const COMPARISON = [
  { aspect: 'Конфигурация', madge: 'Не нужна', depcruise: 'Требуется .dependency-cruiser.cjs' },
  { aspect: 'Поиск циклов', madge: 'Основная функция', depcruise: 'Одно из правил (no-circular)' },
  {
    aspect: 'Кастомные архитектурные правила',
    madge: 'Нет',
    depcruise: 'Да, гибкая система forbidden/allowed',
  },
  {
    aspect: 'Подходит для',
    madge: 'Быстрой разовой диагностики',
    depcruise: 'Долгосрочного гейта в CI',
  },
]

export function Task5_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 5: Обнаружение циклов</h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>
        madge, dependency-cruiser и почему tsc не ловит циклы
      </p>

      <div style={{ ...CARD_STYLE, background: '#1e3a5f', borderLeft: '4px solid #60a5fa' }}>
        <div style={{ ...LABEL_STYLE, color: '#60a5fa' }}>madge — быстрый поиск циклов</div>
        {MADGE_COMMANDS.map(c => (
          <div key={c.cmd} style={{ marginBottom: '6px' }}>
            <code style={CODE_STYLE}>{c.cmd}</code>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{c.what}</div>
          </div>
        ))}
      </div>

      <div style={{ ...CARD_STYLE, background: '#1a3a2e', borderLeft: '4px solid #34d399' }}>
        <div style={{ ...LABEL_STYLE, color: '#34d399' }}>
          dependency-cruiser — архитектурный линтер
        </div>
        {DEPCRUISE_COMMANDS.map(c => (
          <div key={c.cmd} style={{ marginBottom: '6px' }}>
            <code style={CODE_STYLE}>{c.cmd}</code>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{c.what}</div>
          </div>
        ))}
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#9ca3af' }}>
          Правило no-circular:
        </div>
        <code style={CODE_STYLE}>{`{
  name: 'no-circular',
  severity: 'error',
  from: {},
  to: { circular: true },
}`}</code>
      </div>

      <div style={{ ...CARD_STYLE, background: '#2d1f3d', borderLeft: '4px solid #a78bfa' }}>
        <div style={{ ...LABEL_STYLE, color: '#a78bfa' }}>Как читать вывод madge</div>
        <code style={CODE_STYLE}>{`1) src/entities/user/model/user.ts >
   src/entities/order/model/order.ts >
   src/entities/user/model/user.ts`}</code>
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
          Путь читается слева направо: A импортирует B, B импортирует C, ... последний элемент =
          первый (точка замыкания цикла).
        </div>
      </div>

      <div style={{ ...CARD_STYLE, background: '#3a1f1f', borderLeft: '4px solid #f87171' }}>
        <div style={{ ...LABEL_STYLE, color: '#f87171' }}>tsc не ловит циклы</div>
        <div>
          Компилятор проверяет типы, а не порядок инициализации модулей в рантайме. Код с циклом
          компилируется без единой ошибки — обнаружение циклов требует отдельного инструмента.
        </div>
      </div>

      <div style={{ ...CARD_STYLE, background: '#1f2937', borderLeft: '4px solid #9ca3af' }}>
        <div style={{ ...LABEL_STYLE, color: '#9ca3af' }}>madge vs dependency-cruiser</div>
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <th style={TH_STYLE}>Критерий</th>
              <th style={TH_STYLE}>madge</th>
              <th style={TH_STYLE}>dependency-cruiser</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map(row => (
              <tr key={row.aspect}>
                <td style={TD_STYLE}>{row.aspect}</td>
                <td style={TD_STYLE}>{row.madge}</td>
                <td style={TD_STYLE}>{row.depcruise}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
