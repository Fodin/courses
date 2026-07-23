// Level 6: ESLint import/no-cycle — reference card

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

const MESSAGE_PARTS = [
  { part: '3:1', meaning: 'Строка и колонка импорта в текущем файле, где сработало правило' },
  {
    part: 'Dependency cycle via ./order.ts:5',
    meaning: 'Цикл замкнулся через order.ts, конкретно через импорт на строке 5',
  },
  { part: 'import-x/no-cycle', meaning: 'Имя правила — по нему ищутся опции и документация' },
]

const OPTIONS = [
  {
    opt: 'maxDepth',
    desc: 'Глубина обхода графа при поиске цикла',
    tip: 'Меньше → быстрее, но пропускает длинные циклы',
  },
  {
    opt: 'ignoreExternal',
    desc: 'Не учитывать импорты из node_modules',
    tip: 'Обычно включать всегда',
  },
  {
    opt: 'allowUnsafeDynamicCyclicDependency',
    desc: 'Не считать цикл нарушением, если он разорван через import()',
    tip: 'Включать точечно, осознанно',
  },
  { opt: 'disableScc', desc: 'Отключить SCC-оптимизацию обхода графа', tip: 'Обычно не трогать' },
]

const FIX_STEPS = [
  'Открыть файл и строку из "Dependency cycle via ..."',
  'Восстановить полный путь цикла — что импортирует каждый модуль в цепочке',
  'Найти самое "тонкое" звено (импорт ради одного типа/константы)',
  'Применить приём разрыва: import type / вынос в третий модуль / dynamic import (уровень 7)',
]

export function Task6_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 6: ESLint import/no-cycle</h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>
        Разбор сообщения линтера и опций правила
      </p>

      <div style={{ ...CARD_STYLE, background: '#1e3a5f', borderLeft: '4px solid #60a5fa' }}>
        <div style={{ ...LABEL_STYLE, color: '#60a5fa' }}>Подключение в flat config</div>
        <code style={CODE_STYLE}>{`import importX from 'eslint-plugin-import-x'

export default [
  {
    plugins: { 'import-x': importX },
    rules: {
      'import-x/no-cycle': ['error', {
        maxDepth: 10,
        ignoreExternal: true,
      }],
    },
  },
]`}</code>
      </div>

      <div style={{ ...CARD_STYLE, background: '#3a1f1f', borderLeft: '4px solid #f87171' }}>
        <div style={{ ...LABEL_STYLE, color: '#f87171' }}>Реальное сообщение об ошибке</div>
        <code style={CODE_STYLE}>{`src/entities/user/model/user.ts
  3:1  error  Dependency cycle via ./order.ts:5  import-x/no-cycle`}</code>
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <th style={TH_STYLE}>Часть сообщения</th>
              <th style={TH_STYLE}>Что значит</th>
            </tr>
          </thead>
          <tbody>
            {MESSAGE_PARTS.map(p => (
              <tr key={p.part}>
                <td
                  style={{
                    ...TD_STYLE,
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#fbbf24',
                  }}
                >
                  {p.part}
                </td>
                <td style={TD_STYLE}>{p.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ ...CARD_STYLE, background: '#1f2937', borderLeft: '4px solid #9ca3af' }}>
        <div style={{ ...LABEL_STYLE, color: '#9ca3af' }}>Опции правила</div>
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <th style={TH_STYLE}>Опция</th>
              <th style={TH_STYLE}>Назначение</th>
              <th style={TH_STYLE}>Совет</th>
            </tr>
          </thead>
          <tbody>
            {OPTIONS.map(o => (
              <tr key={o.opt}>
                <td
                  style={{
                    ...TD_STYLE,
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#86efac',
                  }}
                >
                  {o.opt}
                </td>
                <td style={TD_STYLE}>{o.desc}</td>
                <td style={TD_STYLE}>{o.tip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ ...CARD_STYLE, background: '#1a3a2e', borderLeft: '4px solid #34d399' }}>
        <div style={{ ...LABEL_STYLE, color: '#34d399' }}>Получил сообщение → как чинить</div>
        <ol style={{ margin: 0, paddingLeft: '18px' }}>
          {FIX_STEPS.map(step => (
            <li key={step} style={{ marginBottom: '4px' }}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
