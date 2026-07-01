// Level 6: install and update commands — reference card

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
  fontFamily: 'monospace',
  fontSize: '12px',
  background: 'rgba(0,0,0,0.3)',
  padding: '2px 6px',
  borderRadius: '3px',
}

const CONCEPTS = [
  {
    label: 'npm install vs npm ci',
    body: 'npm install — устанавливает/обновляет, может менять lockfile. npm ci — строгая установка по lockfile, удаляет node_modules перед установкой, lockfile не меняет. В CI/CD всегда npm ci.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'npm update — граница мажора',
    body: 'npm update обновляет пакеты в пределах semver-диапазона из package.json. ^1.x не перейдёт на 2.x. Для мажорных обновлений: npm install pkg@latest или npx npm-check-updates -u.',
    bg: '#1a3a2e',
    accent: '#34d399',
  },
  {
    label: 'npm outdated — три столбца',
    body: 'Current — установлено. Wanted — максимум по диапазону (даст npm update). Latest — последняя в реестре (может выходить за диапазон). Если Wanted < Latest — нужно менять диапазон в package.json.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'npm prune — extraneous пакеты',
    body: 'Удаляет пакеты, присутствующие в node_modules, но отсутствующие в package.json. npm prune --omit=dev убирает devDependencies (для production). Запускать после ручных изменений package.json.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
  {
    label: 'Ключевые флаги',
    body: '--save-dev (-D): в devDependencies. --save-exact (-E): без каретки, точная версия. --omit=dev: пропустить devDeps. --global (-g): глобально. --no-save: не менять package.json.',
    bg: '#3b2a0f',
    accent: '#fbbf24',
  },
]

export function Task6_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 6: Команды установки и обновления</h2>
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
      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#111827',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#9ca3af',
        }}
      >
        <div
          style={{
            color: '#6b7280',
            marginBottom: '8px',
            fontFamily: 'sans-serif',
            fontSize: '11px',
          }}
        >
          ШПАРГАЛКА ПО КОМАНДАМ
        </div>
        <div>
          <span style={CODE_STYLE}>npm install</span> — по package.json, обновляет lockfile
        </div>
        <div>
          <span style={CODE_STYLE}>npm ci</span> — строго по lockfile, чистая установка
        </div>
        <div>
          <span style={CODE_STYLE}>npm update [pkg]</span> — обновить в пределах диапазона
        </div>
        <div>
          <span style={CODE_STYLE}>npm outdated</span> — таблица Current / Wanted / Latest
        </div>
        <div>
          <span style={CODE_STYLE}>npm prune</span> — удалить extraneous пакеты
        </div>
        <div>
          <span style={CODE_STYLE}>npm dedupe</span> — устранить лишние вложенные копии
        </div>
      </div>
    </div>
  )
}
