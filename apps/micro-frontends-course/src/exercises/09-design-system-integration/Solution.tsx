import { useState, useEffect, useRef } from 'react'

// =====================================================
// Task 9.1: CSS Isolation Strategy Visualizer
// =====================================================

type IsolationStrategy = 'none' | 'css-modules' | 'shadow-dom' | 'css-layers'

type StrategyInfo = {
  label: string
  description: string
  isolation: 'нет' | 'частичная' | 'полная' | 'управляемая'
  isolationColor: string
  dx: 'отлично' | 'хорошо' | 'сложно' | 'хорошо+'
  runtimeCost: 'нет' | 'минимальный' | 'средний' | 'нет'
  browserSupport: 'все' | 'IE11+' | 'Chrome67+' | 'Chrome99+'
}

const STRATEGIES: Record<IsolationStrategy, StrategyInfo> = {
  'none': {
    label: 'Без изоляции',
    description: 'Глобальные CSS-классы. Стили одного MFE переопределяют другой.',
    isolation: 'нет',
    isolationColor: '#f44336',
    dx: 'отлично',
    runtimeCost: 'нет',
    browserSupport: 'все',
  },
  'css-modules': {
    label: 'CSS Modules',
    description: 'Классы хешируются при сборке: .btn → .btn_abc123. Нет конфликтов.',
    isolation: 'частичная',
    isolationColor: '#ff9800',
    dx: 'хорошо',
    runtimeCost: 'минимальный',
    browserSupport: 'все',
  },
  'shadow-dom': {
    label: 'Shadow DOM',
    description: 'Полная инкапсуляция DOM и CSS. Стили не вытекают наружу и не заходят внутрь.',
    isolation: 'полная',
    isolationColor: '#4caf50',
    dx: 'сложно',
    runtimeCost: 'средний',
    browserSupport: 'Chrome67+',
  },
  'css-layers': {
    label: 'CSS Layers (@layer)',
    description: 'Явный порядок каскада: @layer mfe-a { ... } @layer mfe-b { ... }',
    isolation: 'управляемая',
    isolationColor: '#2196f3',
    dx: 'хорошо+',
    runtimeCost: 'нет',
    browserSupport: 'Chrome99+',
  },
}

type MfeButtonConfig = {
  label: string
  bg: string
  color: string
  border: string
  radius: string
  fontSize: string
  padding: string
  fontWeight: string
  shadow: string
}

const MFE_A_CONFIG: MfeButtonConfig = {
  label: 'MFE A: Добавить',
  bg: '#1976d2',
  color: '#ffffff',
  border: '2px solid #1565c0',
  radius: '4px',
  fontSize: '14px',
  padding: '8px 20px',
  fontWeight: '600',
  shadow: '0 2px 4px rgba(25,118,210,0.4)',
}

const MFE_B_CONFIG: MfeButtonConfig = {
  label: 'MFE B: Купить!',
  bg: '#ff5722',
  color: '#ffffff',
  border: '2px solid #e64a19',
  radius: '24px',
  fontSize: '16px',
  padding: '10px 24px',
  fontWeight: '800',
  shadow: '0 4px 12px rgba(255,87,34,0.5)',
}

function ShadowButton({ config, id }: { config: MfeButtonConfig; id: string }) {
  const hostRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    if (host.shadowRoot) return
    const shadow = host.attachShadow({ mode: 'open' })
    shadow.innerHTML = `
      <style>
        .btn {
          background: ${config.bg};
          color: ${config.color};
          border: ${config.border};
          border-radius: ${config.radius};
          font-size: ${config.fontSize};
          padding: ${config.padding};
          font-weight: ${config.fontWeight};
          box-shadow: ${config.shadow};
          cursor: pointer;
          font-family: inherit;
        }
        .btn:hover { opacity: 0.9; }
      </style>
      <button class="btn">${config.label}</button>
    `
  }, [config, id])

  return <span ref={hostRef} style={{ display: 'inline-block' }} id={id} />
}

export function Task9_1_Solution() {
  const [strategy, setStrategy] = useState<IsolationStrategy>('none')
  const info = STRATEGIES[strategy]

  // Стили для кнопок в зависимости от стратегии
  const getButtonStyles = (cfg: MfeButtonConfig, mfe: 'a' | 'b') => {
    if (strategy === 'none') {
      // Оба MFE используют класс .btn — в реальности они конфликтовали бы
      // Симулируем: MFE B "побеждает" и ломает кнопку MFE A
      if (mfe === 'a') {
        return {
          background: MFE_B_CONFIG.bg,       // взят из MFE B!
          color: MFE_B_CONFIG.color,
          border: MFE_B_CONFIG.border,
          borderRadius: MFE_B_CONFIG.radius,
          fontSize: MFE_B_CONFIG.fontSize,
          padding: MFE_B_CONFIG.padding,
          fontWeight: MFE_B_CONFIG.fontWeight,
          boxShadow: MFE_B_CONFIG.shadow,
          cursor: 'pointer',
        }
      }
    }
    return {
      background: cfg.bg,
      color: cfg.color,
      border: cfg.border,
      borderRadius: cfg.radius,
      fontSize: cfg.fontSize,
      padding: cfg.padding,
      fontWeight: cfg.fontWeight,
      boxShadow: cfg.shadow,
      cursor: 'pointer',
    }
  }

  const getClassLabel = (mfe: 'a' | 'b') => {
    if (strategy === 'none') return '.btn'
    if (strategy === 'css-modules') return mfe === 'a' ? '.btn_a3x9k' : '.btn_b7m2p'
    if (strategy === 'css-layers') return mfe === 'a' ? '@layer mfe-a .btn' : '@layer mfe-b .btn'
    return 'Shadow DOM'
  }

  const getConflictBadge = () => {
    if (strategy === 'none') {
      return (
        <div style={{
          background: '#ffebee',
          border: '2px solid #f44336',
          borderRadius: '8px',
          padding: '10px 16px',
          marginTop: '12px',
          color: '#c62828',
          fontSize: '13px',
          fontWeight: 600,
        }}>
          Конфликт! MFE B загружен позже и переопределил .btn из MFE A.
          Кнопка «Добавить» выглядит как «Купить!»
        </div>
      )
    }
    return (
      <div style={{
        background: '#e8f5e9',
        border: '2px solid #4caf50',
        borderRadius: '8px',
        padding: '10px 16px',
        marginTop: '12px',
        color: '#1b5e20',
        fontSize: '13px',
        fontWeight: 600,
      }}>
        Изоляция работает. Каждый MFE использует свои стили независимо.
      </div>
    )
  }

  return (
    <div className="exercise-container" style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '900px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '4px', color: '#1a1a2e' }}>
        Визуализатор CSS-конфликтов в MFE
      </h2>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        Выберите стратегию изоляции и наблюдайте, как меняется поведение стилей
      </p>

      {/* Переключатель стратегий */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {(Object.keys(STRATEGIES) as IsolationStrategy[]).map(s => (
          <button
            key={s}
            onClick={() => setStrategy(s)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: strategy === s ? '2px solid #1976d2' : '2px solid #ddd',
              background: strategy === s ? '#e3f2fd' : '#f5f5f5',
              color: strategy === s ? '#1565c0' : '#555',
              fontWeight: strategy === s ? 700 : 400,
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.15s',
            }}
          >
            {STRATEGIES[s].label}
          </button>
        ))}
      </div>

      {/* Описание стратегии */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '10px',
        padding: '14px 18px',
        marginBottom: '20px',
        borderLeft: `4px solid ${info.isolationColor}`,
      }}>
        <strong style={{ color: info.isolationColor }}>{info.label}</strong>
        <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#444' }}>{info.description}</p>
      </div>

      {/* MFE блоки */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* MFE A */}
        <div style={{
          border: '2px solid #1976d2',
          borderRadius: '12px',
          padding: '16px',
          background: '#f0f7ff',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#1565c0', marginBottom: '10px' }}>
            MFE A — Каталог (команда Alpha)
          </div>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontFamily: 'monospace' }}>
            selector: {getClassLabel('a')}
          </div>
          {strategy === 'shadow-dom' ? (
            <ShadowButton config={MFE_A_CONFIG} id="shadow-a" />
          ) : (
            <button style={getButtonStyles(MFE_A_CONFIG, 'a')}>
              {strategy === 'none' ? MFE_A_CONFIG.label + ' ⚠️' : MFE_A_CONFIG.label}
            </button>
          )}
          {strategy === 'none' && (
            <div style={{ fontSize: '11px', color: '#f44336', marginTop: '6px' }}>
              Ожидалось: синяя прямоугольная кнопка
            </div>
          )}
        </div>

        {/* MFE B */}
        <div style={{
          border: '2px solid #ff5722',
          borderRadius: '12px',
          padding: '16px',
          background: '#fff8f6',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#e64a19', marginBottom: '10px' }}>
            MFE B — Оформление (команда Beta)
          </div>
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', fontFamily: 'monospace' }}>
            selector: {getClassLabel('b')}
          </div>
          {strategy === 'shadow-dom' ? (
            <ShadowButton config={MFE_B_CONFIG} id="shadow-b" />
          ) : (
            <button style={getButtonStyles(MFE_B_CONFIG, 'b')}>
              {MFE_B_CONFIG.label}
            </button>
          )}
        </div>
      </div>

      {/* Конфликт/ОК badge */}
      {getConflictBadge()}

      {/* CSS код */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px' }}>
          Как это выглядит в коде:
        </div>
        <div style={{
          background: '#1e1e2e',
          borderRadius: '10px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#cdd6f4',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap',
        }}>
          {strategy === 'none' && `/* MFE A — загружается первым */\n.btn {\n  background: #1976d2; /* синий */\n  border-radius: 4px;\n  font-weight: 600;\n}\n\n/* MFE B — загружается после, ПЕРЕЗАПИСЫВАЕТ */\n.btn {\n  background: #ff5722; /* красный */\n  border-radius: 24px;\n  font-weight: 800;\n}`}
          {strategy === 'css-modules' && `/* MFE A — сборщик генерирует уникальный хеш */\n.btn_a3x9k {\n  background: #1976d2;\n  border-radius: 4px;\n}\n\n/* MFE B — другой хеш, конфликта нет */\n.btn_b7m2p {\n  background: #ff5722;\n  border-radius: 24px;\n}`}
          {strategy === 'shadow-dom' && `// MFE A — Web Component с Shadow DOM\nclass CatalogApp extends HTMLElement {\n  connectedCallback() {\n    const shadow = this.attachShadow({ mode: 'open' })\n    shadow.innerHTML = \`\n      <style>\n        /* Стили видны ТОЛЬКО внутри Shadow DOM */\n        .btn { background: #1976d2; }\n      </style>\n      <button class="btn">Добавить</button>\n    \`\n  }\n}`}
          {strategy === 'css-layers' && `/* Явный порядок каскада */\n@layer mfe-base, mfe-a, mfe-b;\n\n@layer mfe-a {\n  .btn { background: #1976d2; border-radius: 4px; }\n}\n\n@layer mfe-b {\n  .btn { background: #ff5722; border-radius: 24px; }\n}\n\n/* mfe-b имеет больший приоритет, но .btn из mfe-a\n   не затрагивает кнопки вне своего контекста */`}
        </div>
      </div>

      {/* Таблица сравнения */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#333', marginBottom: '12px' }}>
          Сравнение стратегий
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f0f4f8' }}>
                <th style={thStyle}>Стратегия</th>
                <th style={thStyle}>Изоляция</th>
                <th style={thStyle}>DX</th>
                <th style={thStyle}>Runtime cost</th>
                <th style={thStyle}>Браузер</th>
              </tr>
            </thead>
            <tbody>
              {(Object.entries(STRATEGIES) as [IsolationStrategy, StrategyInfo][]).map(([key, s]) => (
                <tr
                  key={key}
                  style={{
                    background: key === strategy ? '#e8f4fd' : 'white',
                    borderBottom: '1px solid #eee',
                    fontWeight: key === strategy ? 600 : 400,
                  }}
                >
                  <td style={tdStyle}>{s.label}</td>
                  <td style={{ ...tdStyle, color: s.isolationColor, fontWeight: 700 }}>{s.isolation}</td>
                  <td style={tdStyle}>{s.dx}</td>
                  <td style={tdStyle}>{s.runtimeCost}</td>
                  <td style={tdStyle}>{s.browserSupport}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '10px 14px',
  textAlign: 'left',
  fontWeight: 600,
  color: '#555',
  borderBottom: '2px solid #ddd',
}

const tdStyle: React.CSSProperties = {
  padding: '9px 14px',
  color: '#333',
}

// =====================================================
// Task 9.2: Design Tokens Constructor
// =====================================================

type DistributionStrategy = 'npm' | 'federated' | 'cdn'

type TokenColors = {
  primary: string
  secondary: string
  success: string
  error: string
  background: string
  text: string
}

type TokenSpacing = {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
}

type TokenTypography = {
  fontFamily: string
  h1: number
  h2: number
  h3: number
  h4: number
  body: number
  small: number
}

type TokenBorderRadius = {
  sm: number
  md: number
  lg: number
  full: number
}

type TokenCategory = 'colors' | 'spacing' | 'typography' | 'radius'

const FONT_FAMILIES = [
  'Inter, system-ui, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Nunito, sans-serif',
  '"SF Pro Text", system-ui, sans-serif',
]

const DISTRIBUTION_INFO: Record<DistributionStrategy, { label: string; description: string; pros: string; cons: string }> = {
  npm: {
    label: 'npm-пакет',
    description: '@company/design-tokens',
    pros: 'Версионирование, TypeScript, tree-shaking',
    cons: 'Требует пересборки всех MFE при обновлении',
  },
  federated: {
    label: 'Federated Module',
    description: 'design-system/tokens',
    pros: 'Обновление в runtime без пересборки MFE',
    cons: 'Зависимость от доступности host-приложения',
  },
  cdn: {
    label: 'CDN (CSS/JSON)',
    description: 'cdn.company.com/tokens/v2/tokens.css',
    pros: 'Мгновенное обновление, нет зависимостей от сборки',
    cons: 'Нет TypeScript, сложнее versioning',
  },
}

export function Task9_2_Solution() {
  const [activeCategory, setActiveCategory] = useState<TokenCategory>('colors')
  const [distribution, setDistribution] = useState<DistributionStrategy>('npm')
  const [exportFormat, setExportFormat] = useState<'css' | 'json'>('css')
  const [copied, setCopied] = useState(false)

  const [colors, setColors] = useState<TokenColors>({
    primary: '#1976d2',
    secondary: '#7b1fa2',
    success: '#388e3c',
    error: '#d32f2f',
    background: '#ffffff',
    text: '#212121',
  })

  const [spacing, setSpacing] = useState<TokenSpacing>({
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  })

  const [typography, setTypography] = useState<TokenTypography>({
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 14,
    small: 12,
  })

  const [radius, setRadius] = useState<TokenBorderRadius>({
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  })

  const generateCSS = () => {
    const lines: string[] = [':root {']
    // colors
    Object.entries(colors).forEach(([k, v]) => lines.push(`  --ds-color-${k}: ${v};`))
    // spacing
    Object.entries(spacing).forEach(([k, v]) => lines.push(`  --ds-spacing-${k}: ${v}px;`))
    // typography
    lines.push(`  --ds-font-family: ${typography.fontFamily};`)
    const typoKeys = ['h1', 'h2', 'h3', 'h4', 'body', 'small'] as const
    typoKeys.forEach(k => lines.push(`  --ds-font-size-${k}: ${typography[k]}px;`))
    // border-radius
    Object.entries(radius).forEach(([k, v]) => lines.push(`  --ds-radius-${k}: ${v === 9999 ? '9999px' : v + 'px'};`))
    lines.push('}')
    return lines.join('\n')
  }

  const generateJSON = () => {
    const tokens = {
      color: Object.fromEntries(Object.entries(colors).map(([k, v]) => [k, { value: v, type: 'color' }])),
      spacing: Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, { value: `${v}px`, type: 'dimension' }])),
      typography: {
        fontFamily: { value: typography.fontFamily, type: 'fontFamily' },
        ...Object.fromEntries(
          (['h1', 'h2', 'h3', 'h4', 'body', 'small'] as const).map(k => [k, { value: `${typography[k]}px`, type: 'dimension' }])
        ),
      },
      borderRadius: Object.fromEntries(
        Object.entries(radius).map(([k, v]) => [k, { value: v === 9999 ? '9999px' : `${v}px`, type: 'dimension' }])
      ),
    }
    return JSON.stringify(tokens, null, 2)
  }

  const handleCopy = () => {
    const text = exportFormat === 'css' ? generateCSS() : generateJSON()
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const categories: { key: TokenCategory; label: string }[] = [
    { key: 'colors', label: 'Цвета' },
    { key: 'spacing', label: 'Отступы' },
    { key: 'typography', label: 'Типографика' },
    { key: 'radius', label: 'Скругления' },
  ]

  return (
    <div className="exercise-container" style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '960px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '4px', color: '#1a1a2e' }}>
        Конструктор Design Tokens
      </h2>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        Настройте токены дизайн-системы и сгенерируйте CSS Custom Properties
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px' }}>
        {/* Левая панель — редактор токенов */}
        <div>
          {/* Переключатель категорий */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: activeCategory === c.key ? '2px solid #1976d2' : '2px solid #ddd',
                  background: activeCategory === c.key ? '#1976d2' : 'white',
                  color: activeCategory === c.key ? 'white' : '#555',
                  fontSize: '12px',
                  fontWeight: activeCategory === c.key ? 700 : 400,
                  cursor: 'pointer',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Редактор цветов */}
          {activeCategory === 'colors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(Object.keys(colors) as (keyof TokenColors)[]).map(key => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <input
                    type="color"
                    value={colors[key]}
                    onChange={e => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ width: '40px', height: '32px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', padding: '2px' }}
                  />
                  <span style={{ flex: 1, color: '#555' }}>--ds-color-{key}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#888' }}>{colors[key]}</span>
                </label>
              ))}
            </div>
          )}

          {/* Редактор отступов */}
          {activeCategory === 'spacing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(Object.keys(spacing) as (keyof TokenSpacing)[]).map(key => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <span style={{ width: '80px', color: '#555' }}>--ds-spacing-{key}</span>
                  <input
                    type="range"
                    min={2}
                    max={80}
                    value={spacing[key]}
                    onChange={e => setSpacing(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ width: '40px', textAlign: 'right', fontFamily: 'monospace', color: '#333', fontSize: '12px' }}>
                    {spacing[key]}px
                  </span>
                </label>
              ))}
              {/* Визуализация отступов */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginTop: '8px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                {(Object.entries(spacing) as [keyof TokenSpacing, number][]).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '20px', height: `${Math.min(v * 1.5, 72)}px`, background: '#1976d2', borderRadius: '3px', transition: 'height 0.2s' }} />
                    <span style={{ fontSize: '10px', color: '#888' }}>{k}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Редактор типографики */}
          {activeCategory === 'typography' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '13px', color: '#555' }}>
                Font Family
                <select
                  value={typography.fontFamily}
                  onChange={e => setTypography(prev => ({ ...prev, fontFamily: e.target.value }))}
                  style={{ display: 'block', width: '100%', marginTop: '4px', padding: '6px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '12px' }}
                >
                  {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </label>
              {(['h1', 'h2', 'h3', 'h4', 'body', 'small'] as const).map(key => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <span style={{ width: '60px', color: '#555' }}>{key}</span>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={typography[key]}
                    onChange={e => setTypography(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ width: '40px', textAlign: 'right', fontFamily: 'monospace', color: '#333', fontSize: '12px' }}>
                    {typography[key]}px
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Редактор скруглений */}
          {activeCategory === 'radius' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(['sm', 'md', 'lg'] as const).map(key => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <span style={{ width: '60px', color: '#555' }}>--ds-radius-{key}</span>
                  <input
                    type="range"
                    min={0}
                    max={32}
                    value={radius[key]}
                    onChange={e => setRadius(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ width: '40px', textAlign: 'right', fontFamily: 'monospace', color: '#333', fontSize: '12px' }}>
                    {radius[key]}px
                  </span>
                </label>
              ))}
              {/* Визуализация скруглений */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                {(['sm', 'md', 'lg', 'full'] as const).map(k => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      background: '#1976d2',
                      borderRadius: k === 'full' ? '9999px' : `${radius[k]}px`,
                      transition: 'border-radius 0.2s',
                    }} />
                    <span style={{ fontSize: '10px', color: '#888' }}>{k}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Правая панель — превью + экспорт */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Live preview */}
          <div style={{
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            background: colors.background,
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#999', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Live Preview
            </div>

            {/* Карточка */}
            <div style={{
              border: `1px solid ${colors.primary}33`,
              borderRadius: `${radius.md}px`,
              padding: `${spacing.md}px`,
              background: colors.background,
              boxShadow: `0 2px 8px ${colors.text}11`,
              marginBottom: `${spacing.md}px`,
            }}>
              <h3 style={{
                fontSize: `${typography.h3}px`,
                fontFamily: typography.fontFamily,
                color: colors.text,
                margin: `0 0 ${spacing.sm}px`,
              }}>
                Карточка товара
              </h3>
              <p style={{
                fontSize: `${typography.body}px`,
                fontFamily: typography.fontFamily,
                color: colors.text + 'cc',
                margin: `0 0 ${spacing.md}px`,
                lineHeight: 1.5,
              }}>
                Описание товара с использованием токенов типографики и цветов из дизайн-системы.
              </p>
              <div style={{ display: 'flex', gap: `${spacing.sm}px` }}>
                <button style={{
                  background: colors.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: `${radius.sm}px`,
                  padding: `${spacing.xs}px ${spacing.md}px`,
                  fontSize: `${typography.body}px`,
                  fontFamily: typography.fontFamily,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}>
                  Купить
                </button>
                <button style={{
                  background: 'transparent',
                  color: colors.secondary,
                  border: `2px solid ${colors.secondary}`,
                  borderRadius: `${radius.sm}px`,
                  padding: `${spacing.xs}px ${spacing.md}px`,
                  fontSize: `${typography.body}px`,
                  fontFamily: typography.fontFamily,
                  cursor: 'pointer',
                }}>
                  Подробнее
                </button>
              </div>
            </div>

            {/* Статусные бейджи */}
            <div style={{ display: 'flex', gap: `${spacing.sm}px`, flexWrap: 'wrap' }}>
              {([['success', 'В наличии'], ['error', 'Нет в наличии'], ['secondary', 'Новинка']] as const).map(([color, label]) => (
                <span key={color} style={{
                  background: colors[color] + '22',
                  color: colors[color],
                  border: `1px solid ${colors[color]}66`,
                  borderRadius: `${radius.full}px`,
                  padding: `${spacing.xs}px ${spacing.sm}px`,
                  fontSize: `${typography.small}px`,
                  fontFamily: typography.fontFamily,
                  fontWeight: 600,
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Стратегия распространения */}
          <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#333', marginBottom: '10px' }}>
              Стратегия распространения токенов
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {(Object.keys(DISTRIBUTION_INFO) as DistributionStrategy[]).map(d => (
                <label key={d} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  border: distribution === d ? '2px solid #1976d2' : '2px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: distribution === d ? '#e3f2fd' : 'white',
                  fontSize: '12px',
                  fontWeight: distribution === d ? 700 : 400,
                  color: distribution === d ? '#1565c0' : '#555',
                }}>
                  <input
                    type="radio"
                    name="distribution"
                    checked={distribution === d}
                    onChange={() => setDistribution(d)}
                    style={{ display: 'none' }}
                  />
                  {DISTRIBUTION_INFO[d].label}
                </label>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: '#555' }}>
              <div style={{ fontFamily: 'monospace', color: '#1976d2', marginBottom: '4px' }}>
                {DISTRIBUTION_INFO[distribution].description}
              </div>
              <div style={{ color: '#2e7d32' }}>+ {DISTRIBUTION_INFO[distribution].pros}</div>
              <div style={{ color: '#c62828' }}>– {DISTRIBUTION_INFO[distribution].cons}</div>
            </div>
          </div>

          {/* Генерация кода */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#333' }}>Сгенерированный код</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['css', 'json'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setExportFormat(f)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '4px',
                      border: exportFormat === f ? '1px solid #1976d2' : '1px solid #ddd',
                      background: exportFormat === f ? '#1976d2' : 'white',
                      color: exportFormat === f ? 'white' : '#666',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                style={{
                  marginLeft: 'auto',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  background: copied ? '#e8f5e9' : 'white',
                  color: copied ? '#2e7d32' : '#555',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>
            <div style={{
              background: '#1e1e2e',
              borderRadius: '10px',
              padding: '14px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#cdd6f4',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              maxHeight: '220px',
              overflowY: 'auto',
            }}>
              {exportFormat === 'css' ? generateCSS() : generateJSON()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
