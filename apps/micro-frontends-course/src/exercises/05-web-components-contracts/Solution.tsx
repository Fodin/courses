import { useState, useEffect, useRef, useCallback } from 'react'

// =====================================================
// Task 5.1: Shadow DOM Isolation Visualizer
// =====================================================

type ColorScheme = {
  textColor: string
  bgColor: string
  fontSize: string
  fontFamily: string
}

type EventLogEntry = {
  id: number
  timestamp: string
  source: string
  eventName: string
  detail: string
}

type DomNode = {
  tag: string
  type: 'element' | 'shadow-root' | 'slot' | 'text'
  children?: DomNode[]
  attrs?: Record<string, string>
}

const COLOR_OPTIONS = [
  { label: 'Синий', value: '#1a73e8' },
  { label: 'Красный', value: '#d93025' },
  { label: 'Зелёный', value: '#188038' },
  { label: 'Фиолетовый', value: '#7b1fa2' },
]

const BG_OPTIONS = [
  { label: 'Белый', value: '#ffffff' },
  { label: 'Жёлтый', value: '#fff9c4' },
  { label: 'Голубой', value: '#e3f2fd' },
  { label: 'Розовый', value: '#fce4ec' },
]

const FONT_SIZE_OPTIONS = [
  { label: '12px', value: '12px' },
  { label: '16px', value: '16px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
]

const FONT_FAMILY_OPTIONS = [
  { label: 'Sans-serif', value: 'sans-serif' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Mono', value: 'monospace' },
]

let eventIdCounter = 0

function DomTree({ node, depth = 0 }: { node: DomNode; depth?: number }) {
  const indent = depth * 16
  const typeColors: Record<string, string> = {
    element: '#1a73e8',
    'shadow-root': '#d93025',
    slot: '#188038',
    text: '#666',
  }
  const color = typeColors[node.type] || '#333'

  return (
    <div style={{ marginLeft: indent, fontFamily: 'monospace', fontSize: 12, lineHeight: '1.6' }}>
      <span style={{ color }}>
        {node.type === 'shadow-root' ? (
          <span>
            <span style={{ color: '#d93025', fontWeight: 700 }}>◈ #shadow-root</span>
          </span>
        ) : node.type === 'text' ? (
          <span style={{ color: '#666', fontStyle: 'italic' }}>"{node.tag}"</span>
        ) : node.type === 'slot' ? (
          <span>
            <span style={{ color: '#188038' }}>&lt;</span>
            <span style={{ color: '#188038', fontWeight: 600 }}>slot</span>
            {node.attrs?.name && (
              <span style={{ color: '#e65100' }}> name="{node.attrs.name}"</span>
            )}
            <span style={{ color: '#188038' }}>/&gt;</span>
          </span>
        ) : (
          <span>
            <span style={{ color: '#1a73e8' }}>&lt;</span>
            <span style={{ color: '#1a73e8', fontWeight: 600 }}>{node.tag}</span>
            {node.attrs &&
              Object.entries(node.attrs).map(([k, v]) => (
                <span key={k} style={{ color: '#e65100' }}>
                  {' '}
                  {k}="{v}"
                </span>
              ))}
            <span style={{ color: '#1a73e8' }}>&gt;</span>
          </span>
        )}
      </span>
      {node.children?.map((child, i) => (
        <DomTree key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}

export function Task5_1_Solution() {
  const [scheme, setScheme] = useState<ColorScheme>({
    textColor: '#212121',
    bgColor: '#ffffff',
    fontSize: '16px',
    fontFamily: 'sans-serif',
  })
  const [cssVar, setCssVar] = useState({ primary: '#1a73e8', accent: '#d93025' })
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([])
  const [slotContent, setSlotContent] = useState('Контент из Light DOM')
  const [activeTab, setActiveTab] = useState<'styles' | 'css-vars' | 'slots' | 'events'>('styles')
  const shadowHostRef = useRef<HTMLDivElement>(null)
  const shadowRootRef = useRef<ShadowRoot | null>(null)
  const logRef = useRef<HTMLDivElement>(null)

  // Setup shadow root once
  useEffect(() => {
    if (shadowHostRef.current && !shadowRootRef.current) {
      const shadow = shadowHostRef.current.attachShadow({ mode: 'open' })
      shadowRootRef.current = shadow

      shadow.innerHTML = `
        <style>
          :host {
            display: block;
            padding: 16px;
            border-radius: 8px;
            border: 2px solid #4caf50;
            background: #f9fbe7;
            color: #212121;
            font-size: 14px;
            font-family: sans-serif;
          }
          .shadow-label {
            font-weight: 700;
            color: #388e3c;
            font-size: 13px;
            margin-bottom: 8px;
          }
          .shadow-content {
            padding: 8px;
            background: rgba(0,0,0,0.04);
            border-radius: 4px;
            margin-bottom: 8px;
          }
          .css-var-demo {
            color: var(--mf-primary, #1a73e8);
            font-weight: 600;
          }
          .css-var-accent {
            color: var(--mf-accent, #d93025);
            font-weight: 600;
          }
          slot {
            display: block;
            padding: 8px;
            border: 2px dashed #aed581;
            border-radius: 4px;
            margin-top: 4px;
          }
          ::slotted(*) {
            font-style: italic;
            color: #5d4037;
          }
        </style>
        <div class="shadow-label">Shadow DOM (изолирован)</div>
        <div class="shadow-content">
          <span>Глобальные стили сюда НЕ проникают</span>
        </div>
        <div class="shadow-content">
          CSS Custom Properties:
          <div class="css-var-demo">--mf-primary: применяется</div>
          <div class="css-var-accent">--mf-accent: применяется</div>
        </div>
        <div style="font-size:12px; color:#555; margin-top:4px;">Слот:</div>
        <slot></slot>
        <slot name="footer"></slot>
      `
    }
  }, [])

  // Update CSS vars on host element
  useEffect(() => {
    if (shadowHostRef.current) {
      shadowHostRef.current.style.setProperty('--mf-primary', cssVar.primary)
      shadowHostRef.current.style.setProperty('--mf-accent', cssVar.accent)
    }
  }, [cssVar])

  const addEvent = useCallback((source: string, name: string, detail: string) => {
    const now = new Date()
    const ts = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    setEventLog(prev => [...prev.slice(-29), { id: ++eventIdCounter, timestamp: ts, source, eventName: name, detail }])
  }, [])

  // Dispatch CustomEvent from shadow DOM
  const handleDispatchFromShadow = () => {
    if (shadowHostRef.current) {
      const event = new CustomEvent('mf:action', {
        bubbles: true,
        composed: true, // crosses shadow boundary!
        detail: { action: 'button-click', source: 'shadow-dom-component', ts: Date.now() },
      })
      shadowHostRef.current.dispatchEvent(event)
      addEvent('shadow-dom', 'mf:action', '{ action: "button-click" }')
    }
  }

  const handleDispatchFromLight = () => {
    const event = new CustomEvent('mf:action', {
      bubbles: true,
      composed: false,
      detail: { action: 'light-click', source: 'light-dom', ts: Date.now() },
    })
    document.dispatchEvent(event)
    addEvent('light-dom', 'mf:action', '{ action: "light-click" }')
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent
      addEvent('window-listener', ce.type, JSON.stringify(ce.detail))
    }
    window.addEventListener('mf:action', handler)
    return () => window.removeEventListener('mf:action', handler)
  }, [addEvent])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [eventLog])

  const lightDomStyle: React.CSSProperties = {
    color: scheme.textColor,
    backgroundColor: scheme.bgColor,
    fontSize: scheme.fontSize,
    fontFamily: scheme.fontFamily,
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid #ef9a9a',
    transition: 'all 0.3s',
  }

  const domTreeLight: DomNode = {
    tag: 'div.light-block',
    type: 'element',
    children: [
      { tag: 'span', type: 'element', children: [{ tag: 'Текст компонента', type: 'text' }] },
      { tag: 'button', type: 'element', children: [{ tag: 'Кликни', type: 'text' }] },
    ],
  }

  const domTreeShadow: DomNode = {
    tag: 'div#shadow-host',
    type: 'element',
    children: [
      {
        tag: '#shadow-root',
        type: 'shadow-root',
        children: [
          { tag: 'style', type: 'element', children: [{ tag: ':host { ... }', type: 'text' }] },
          {
            tag: 'div.shadow-content',
            type: 'element',
            children: [{ tag: 'Текст Shadow', type: 'text' }],
          },
          { tag: 'slot', type: 'slot' },
          { tag: 'slot', type: 'slot', attrs: { name: 'footer' } },
        ],
      },
      { tag: 'p (light DOM, проецируется в slot)', type: 'text' },
    ],
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    border: 'none',
    borderRadius: '6px 6px 0 0',
    cursor: 'pointer',
    fontWeight: active ? 700 : 400,
    background: active ? '#1a73e8' : '#e8eaf6',
    color: active ? '#fff' : '#3949ab',
    fontSize: 13,
  })

  const sectionStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '0 8px 8px 8px',
    padding: '16px',
    marginBottom: '20px',
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto', padding: '0 16px 32px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
        Shadow DOM: изоляция стилей и контракт
      </h2>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        Наглядно: как Shadow DOM изолирует стили, но пропускает CSS Custom Properties и события
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 0 }}>
        {(['styles', 'css-vars', 'slots', 'events'] as const).map(tab => (
          <button key={tab} style={tabStyle(activeTab === tab)} onClick={() => setActiveTab(tab)}>
            {tab === 'styles' && 'Стили'}
            {tab === 'css-vars' && 'CSS Custom Properties'}
            {tab === 'slots' && 'Слоты'}
            {tab === 'events' && 'События'}
          </button>
        ))}
      </div>

      {/* === Tab: Styles === */}
      {activeTab === 'styles' && (
        <div style={sectionStyle}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, color: '#1a73e8' }}>
            Глобальные стили: Light DOM vs Shadow DOM
          </h3>

          {/* Controls */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              padding: '12px 16px',
              background: '#f5f5f5',
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>Цвет текста</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {COLOR_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setScheme(s => ({ ...s, textColor: opt.value }))}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: opt.value,
                      border: scheme.textColor === opt.value ? '3px solid #333' : '1px solid #ccc',
                      cursor: 'pointer',
                    }}
                    title={opt.label}
                  />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>Фон</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {BG_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setScheme(s => ({ ...s, bgColor: opt.value }))}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: opt.value,
                      border: scheme.bgColor === opt.value ? '3px solid #333' : '1px solid #ccc',
                      cursor: 'pointer',
                    }}
                    title={opt.label}
                  />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>Размер шрифта</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {FONT_SIZE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setScheme(s => ({ ...s, fontSize: opt.value }))}
                    style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: scheme.fontSize === opt.value ? '2px solid #1a73e8' : '1px solid #ccc',
                      background: scheme.fontSize === opt.value ? '#e3f2fd' : '#fff',
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>Шрифт</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {FONT_FAMILY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setScheme(s => ({ ...s, fontFamily: opt.value }))}
                    style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: scheme.fontFamily === opt.value ? '2px solid #1a73e8' : '1px solid #ccc',
                      background: scheme.fontFamily === opt.value ? '#e3f2fd' : '#fff',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontFamily: opt.value,
                    }}
                  >
                    Aa
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Light DOM */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#d93025',
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#d93025',
                    display: 'inline-block',
                  }}
                />
                Без Shadow DOM (Light DOM)
              </div>
              <div style={lightDomStyle}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Компонент A</div>
                <div>Глобальные стили ПРИМЕНЯЮТСЯ</div>
                <div style={{ fontSize: '0.85em', color: 'inherit', marginTop: 4, opacity: 0.7 }}>
                  Цвет, фон, шрифт — всё наследуется
                </div>
              </div>
            </div>

            {/* Shadow DOM */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#388e3c',
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#388e3c',
                    display: 'inline-block',
                  }}
                />
                С Shadow DOM
              </div>
              <div ref={shadowHostRef} style={{ display: 'block' }} />
            </div>
          </div>

          {/* DOM Tree */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div
              style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 8, padding: 12 }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 8 }}>
                DOM-дерево: Light DOM
              </div>
              <DomTree node={domTreeLight} />
            </div>
            <div
              style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 8, padding: 12 }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 8 }}>
                DOM-дерево: Shadow DOM
              </div>
              <DomTree node={domTreeShadow} />
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              padding: '10px 14px',
              background: '#e8f5e9',
              borderRadius: 8,
              fontSize: 13,
              color: '#1b5e20',
              borderLeft: '4px solid #4caf50',
            }}
          >
            Вывод: глобальные CSS-правила НЕ проникают внутрь Shadow DOM. Каждый Web Component
            стилизует себя сам — это и есть инкапсуляция.
          </div>
        </div>
      )}

      {/* === Tab: CSS Custom Properties === */}
      {activeTab === 'css-vars' && (
        <div style={sectionStyle}>
          <h3 style={{ margin: '0 0 8px', fontSize: 15, color: '#1a73e8' }}>
            CSS Custom Properties проникают в Shadow DOM
          </h3>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
            Это намеренное поведение — CSS-переменные пересекают границу shadow-root. Это основа
            контракта стилизации Web Component.
          </p>

          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Задайте значения CSS Custom Properties:
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>--mf-primary</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {COLOR_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setCssVar(v => ({ ...v, primary: opt.value }))}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: opt.value,
                          border: cssVar.primary === opt.value ? '3px solid #333' : '1px solid #ccc',
                          cursor: 'pointer',
                        }}
                        title={opt.label}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>--mf-accent</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {COLOR_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setCssVar(v => ({ ...v, accent: opt.value }))}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: opt.value,
                          border: cssVar.accent === opt.value ? '3px solid #333' : '1px solid #ccc',
                          cursor: 'pointer',
                        }}
                        title={opt.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 16,
                border: '2px solid #4caf50',
                borderRadius: 8,
                background: '#f9fbe7',
                minWidth: 220,
              }}
            >
              <div style={{ fontSize: 12, color: '#555', marginBottom: 8 }}>
                Внутри Shadow DOM (получает CSS vars):
              </div>
              <div style={{ color: cssVar.primary, fontWeight: 700, marginBottom: 4 }}>
                --mf-primary: {cssVar.primary}
              </div>
              <div style={{ color: cssVar.accent, fontWeight: 700 }}>
                --mf-accent: {cssVar.accent}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              background: '#f5f5f5',
              borderRadius: 8,
              padding: '12px 16px',
              fontFamily: 'monospace',
              fontSize: 13,
            }}
          >
            <div style={{ color: '#555', marginBottom: 6 }}>Контракт в документации:</div>
            <pre style={{ margin: 0, color: '#1a73e8' }}>
              {`/* Снаружи (host-приложение) */
my-widget {
  --mf-primary: ${cssVar.primary};
  --mf-accent: ${cssVar.accent};
}

/* Внутри Shadow DOM */
:host {
  color: var(--mf-primary, #1a73e8);
}
.cta { background: var(--mf-accent, #d93025); }`}
            </pre>
          </div>

          <div
            style={{
              marginTop: 16,
              padding: '10px 14px',
              background: '#fff8e1',
              borderRadius: 8,
              fontSize: 13,
              color: '#e65100',
              borderLeft: '4px solid #ffcc02',
            }}
          >
            CSS Custom Properties — это публичный API стилизации. Документируйте их как часть
            контракта компонента.
          </div>
        </div>
      )}

      {/* === Tab: Slots === */}
      {activeTab === 'slots' && (
        <div style={sectionStyle}>
          <h3 style={{ margin: '0 0 8px', fontSize: 15, color: '#1a73e8' }}>
            Слоты: проекция Light DOM в Shadow DOM
          </h3>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
            Слоты позволяют пользователю компонента вставлять свой контент внутрь Shadow DOM, не
            нарушая инкапсуляцию.
          </p>

          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Контент для слота (Light DOM):
              </div>
              <input
                value={slotContent}
                onChange={e => setSlotContent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: 'border-box',
                }}
                placeholder="Введите контент для слота..."
              />
              <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
                HTML, который вы пишете:
                <pre
                  style={{
                    background: '#f5f5f5',
                    padding: '8px 10px',
                    borderRadius: 6,
                    marginTop: 4,
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: '#333',
                  }}
                >
                  {`<my-widget>
  <p>${slotContent}</p>
  <span slot="footer">
    © Footer
  </span>
</my-widget>`}
                </pre>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Результат:</div>
              <div
                style={{
                  padding: 16,
                  border: '2px solid #4caf50',
                  borderRadius: 8,
                  background: '#f9fbe7',
                }}
              >
                <div style={{ fontSize: 12, color: '#388e3c', fontWeight: 600, marginBottom: 6 }}>
                  Shadow DOM (шаблон компонента)
                </div>
                <div style={{ background: '#fff', padding: 8, borderRadius: 4, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
                    Header (из Shadow DOM)
                  </div>
                  <div
                    style={{
                      border: '2px dashed #aed581',
                      borderRadius: 4,
                      padding: 8,
                      background: '#f1f8e9',
                    }}
                  >
                    <div style={{ fontSize: 11, color: '#689f38', marginBottom: 4 }}>
                      &lt;slot&gt; — default slot
                    </div>
                    <div style={{ fontStyle: 'italic', color: '#5d4037', fontSize: 14 }}>
                      {slotContent || '(пусто)'}
                    </div>
                  </div>
                  <div
                    style={{
                      border: '2px dashed #aed581',
                      borderRadius: 4,
                      padding: 8,
                      background: '#f1f8e9',
                      marginTop: 8,
                    }}
                  >
                    <div style={{ fontSize: 11, color: '#689f38', marginBottom: 4 }}>
                      &lt;slot name="footer"&gt;
                    </div>
                    <div style={{ fontStyle: 'italic', color: '#5d4037', fontSize: 13 }}>
                      © Footer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              padding: '10px 14px',
              background: '#e8f5e9',
              borderRadius: 8,
              fontSize: 13,
              color: '#1b5e20',
              borderLeft: '4px solid #4caf50',
            }}
          >
            Контент в слотах физически остаётся в Light DOM, но визуально отображается в Shadow DOM.
            Слоты — это публичный API для вставки контента.
          </div>
        </div>
      )}

      {/* === Tab: Events === */}
      {activeTab === 'events' && (
        <div style={sectionStyle}>
          <h3 style={{ margin: '0 0 8px', fontSize: 15, color: '#1a73e8' }}>
            CustomEvent: коммуникация через границы
          </h3>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
            <code>composed: true</code> позволяет событию пересечь границу Shadow DOM и всплыть в
            глобальный document.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <button
              onClick={handleDispatchFromShadow}
              style={{
                padding: '10px 20px',
                background: '#388e3c',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Dispatch из Shadow DOM (composed: true)
            </button>
            <button
              onClick={handleDispatchFromLight}
              style={{
                padding: '10px 20px',
                background: '#d93025',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Dispatch из Light DOM (composed: false)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div
              style={{
                background: '#f5f5f5',
                borderRadius: 8,
                padding: '12px 14px',
                fontFamily: 'monospace',
                fontSize: 12,
              }}
            >
              <div style={{ color: '#555', marginBottom: 6, fontFamily: 'sans-serif', fontWeight: 600 }}>
                Shadow DOM → всплывает через composed: true
              </div>
              <pre style={{ margin: 0, color: '#388e3c' }}>
                {`// Внутри Custom Element
this.dispatchEvent(new CustomEvent(
  'mf:action',
  {
    bubbles: true,
    composed: true, // пересекает shadow-root!
    detail: { action: 'click' }
  }
))`}
              </pre>
            </div>
            <div
              style={{
                background: '#f5f5f5',
                borderRadius: 8,
                padding: '12px 14px',
                fontFamily: 'monospace',
                fontSize: 12,
              }}
            >
              <div style={{ color: '#555', marginBottom: 6, fontFamily: 'sans-serif', fontWeight: 600 }}>
                Подписка в host-приложении
              </div>
              <pre style={{ margin: 0, color: '#1a73e8' }}>
                {`// В host (React/Vue/Angular)
element.addEventListener(
  'mf:action',
  (e) => {
    const { action } = e.detail
    handleAction(action)
  }
)`}
              </pre>
            </div>
          </div>

          {/* Event Log */}
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Лог событий ({eventLog.length}):
          </div>
          <div
            ref={logRef}
            style={{
              height: 180,
              overflowY: 'auto',
              background: '#1e1e2e',
              borderRadius: 8,
              padding: '8px 12px',
              fontFamily: 'monospace',
              fontSize: 12,
            }}
          >
            {eventLog.length === 0 ? (
              <div style={{ color: '#666', padding: 8 }}>Нажмите кнопки выше для диспатча событий...</div>
            ) : (
              eventLog.map(e => (
                <div key={e.id} style={{ marginBottom: 4 }}>
                  <span style={{ color: '#666' }}>{e.timestamp} </span>
                  <span style={{ color: '#cba6f7', fontWeight: 600 }}>{e.source} </span>
                  <span style={{ color: '#a6e3a1' }}>{e.eventName} </span>
                  <span style={{ color: '#89dceb' }}>{e.detail}</span>
                </div>
              ))
            )}
          </div>

          <div
            style={{
              marginTop: 16,
              padding: '10px 14px',
              background: '#fff8e1',
              borderRadius: 8,
              fontSize: 13,
              color: '#e65100',
              borderLeft: '4px solid #ffcc02',
            }}
          >
            Используйте namespace в именах событий (mf:action, catalog:item-added) чтобы избежать
            конфликтов в микрофронтендной архитектуре.
          </div>
        </div>
      )}
    </div>
  )
}

// =====================================================
// Task 5.2: Web Component Contract Builder
// =====================================================

type WCAttribute = {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean'
  defaultValue: string
}

type WCProperty = {
  id: string
  name: string
  tsType: string
  description: string
}

type WCEvent = {
  id: string
  name: string
  payloadType: string
}

type WCCSSVar = {
  id: string
  name: string
  defaultValue: string
}

type WCSlot = {
  id: string
  name: string
  description: string
}

type ValidationError = {
  field: string
  message: string
}

let itemIdCounter = 0
const uid = () => `id_${++itemIdCounter}`

function toPascalCase(kebab: string): string {
  return kebab
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join('')
}

function generateTSInterface(
  elementName: string,
  attrs: WCAttribute[],
  props: WCProperty[],
  events: WCEvent[],
  cssVars: WCCSSVar[],
  slots: WCSlot[],
): string {
  const className = toPascalCase(elementName || 'my-element')
  const lines: string[] = []

  if (attrs.length > 0) {
    lines.push(`// Атрибуты (строки из HTML)`)
    lines.push(`interface ${className}Attributes {`)
    for (const a of attrs) {
      const tsType = a.type === 'boolean' ? 'boolean' : a.type === 'number' ? 'number' : 'string'
      const defComment = a.defaultValue ? ` // default: ${a.defaultValue}` : ''
      lines.push(`  ${a.name}?: ${tsType}${defComment}`)
    }
    lines.push(`}`)
    lines.push(``)
  }

  if (props.length > 0) {
    lines.push(`// Свойства (JS объекты)`)
    lines.push(`interface ${className}Properties {`)
    for (const p of props) {
      const comment = p.description ? ` // ${p.description}` : ''
      lines.push(`  ${p.name}: ${p.tsType}${comment}`)
    }
    lines.push(`}`)
    lines.push(``)
  }

  if (events.length > 0) {
    lines.push(`// События`)
    lines.push(`interface ${className}Events {`)
    for (const e of events) {
      lines.push(`  '${e.name}': CustomEvent<${e.payloadType || 'void'}>`)
    }
    lines.push(`}`)
    lines.push(``)
  }

  if (cssVars.length > 0) {
    lines.push(`// CSS Custom Properties`)
    lines.push(`/**`)
    for (const v of cssVars) {
      const defComment = v.defaultValue ? ` (default: ${v.defaultValue})` : ''
      lines.push(` * ${v.name}${defComment}`)
    }
    lines.push(` */`)
    lines.push(``)
  }

  if (slots.length > 0) {
    lines.push(`// Слоты`)
    lines.push(`/**`)
    for (const s of slots) {
      const slotName = s.name || 'default'
      lines.push(` * slot[${slotName}]: ${s.description || 'без описания'}`)
    }
    lines.push(` */`)
  }

  return lines.join('\n') || '// Заполните форму выше для генерации интерфейса'
}

function generateClassSkeleton(
  elementName: string,
  attrs: WCAttribute[],
  props: WCProperty[],
  events: WCEvent[],
  cssVars: WCCSSVar[],
  slots: WCSlot[],
): string {
  const className = toPascalCase(elementName || 'my-element')
  const name = elementName || 'my-element'
  const lines: string[] = []

  lines.push(`class ${className} extends HTMLElement {`)

  if (attrs.length > 0) {
    lines.push(`  static get observedAttributes() {`)
    lines.push(`    return [${attrs.map(a => `'${a.name}'`).join(', ')}]`)
    lines.push(`  }`)
    lines.push(``)
  }

  // Private fields
  for (const p of props) {
    lines.push(`  private _${p.name}: ${p.tsType} | undefined`)
  }
  if (props.length > 0) lines.push(``)

  // Constructor
  lines.push(`  constructor() {`)
  lines.push(`    super()`)
  lines.push(`    this.attachShadow({ mode: 'open' })`)
  lines.push(`  }`)
  lines.push(``)

  // connectedCallback
  lines.push(`  connectedCallback() {`)
  lines.push(`    this.render()`)

  // CSS vars comment
  if (cssVars.length > 0) {
    lines.push(`    // CSS Custom Properties (доступны через var()):`)
    for (const v of cssVars) {
      lines.push(`    // ${v.name}: ${v.defaultValue || 'не задан default'}`)
    }
  }

  // Slots comment
  if (slots.length > 0) {
    lines.push(`    // Слоты:`)
    for (const s of slots) {
      lines.push(`    // ${s.name ? `<slot name="${s.name}">` : '<slot>'} — ${s.description || ''}`)
    }
  }

  lines.push(`  }`)
  lines.push(``)

  // disconnectedCallback
  lines.push(`  disconnectedCallback() {`)
  lines.push(`    // Cleanup listeners, timers, subscriptions`)
  lines.push(`  }`)
  lines.push(``)

  // attributeChangedCallback
  if (attrs.length > 0) {
    lines.push(`  attributeChangedCallback(`)
    lines.push(`    name: string,`)
    lines.push(`    _old: string | null,`)
    lines.push(`    newVal: string | null`)
    lines.push(`  ) {`)
    lines.push(`    this.render()`)
    lines.push(`  }`)
    lines.push(``)
  }

  // Property getters/setters
  for (const p of props) {
    lines.push(`  get ${p.name}(): ${p.tsType} | undefined {`)
    lines.push(`    return this._${p.name}`)
    lines.push(`  }`)
    lines.push(`  set ${p.name}(val: ${p.tsType} | undefined) {`)
    lines.push(`    this._${p.name} = val`)
    lines.push(`    this.render()`)
    lines.push(`  }`)
    lines.push(``)
  }

  // Event dispatch helpers
  for (const e of events) {
    const payloadParam = e.payloadType && e.payloadType !== 'void' ? `detail: ${e.payloadType}` : ''
    const payloadArg = e.payloadType && e.payloadType !== 'void' ? ', detail' : ''
    lines.push(`  private emit_${e.name.replace(/[^a-zA-Z0-9]/g, '_')}(${payloadParam}) {`)
    lines.push(`    this.dispatchEvent(new CustomEvent('${e.name}', {`)
    lines.push(`      bubbles: true,`)
    lines.push(`      composed: true,`)
    if (e.payloadType && e.payloadType !== 'void') {
      lines.push(`      detail${payloadArg},`)
    }
    lines.push(`    }))`)
    lines.push(`  }`)
    lines.push(``)
  }

  // render
  lines.push(`  private render() {`)
  lines.push(`    if (!this.shadowRoot) return`)
  lines.push(`    this.shadowRoot.innerHTML = \``)
  lines.push(`      <style>`)
  lines.push(`        :host { display: block; }`)
  if (cssVars.length > 0) {
    lines.push(`        /* CSS Custom Properties: */`)
    for (const v of cssVars) {
      lines.push(`        /* ${v.name}: var(${v.name}, ${v.defaultValue || '#000'}) */`)
    }
  }
  lines.push(`      </style>`)
  if (slots.length > 0) {
    for (const s of slots) {
      if (s.name) {
        lines.push(`      <slot name="${s.name}"></slot>`)
      } else {
        lines.push(`      <slot></slot>`)
      }
    }
  } else {
    lines.push(`      <slot></slot>`)
  }
  lines.push(`    \``)
  lines.push(`  }`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`customElements.define('${name}', ${className})`)

  return lines.join('\n')
}

function validate(
  elementName: string,
  attrs: WCAttribute[],
  props: WCProperty[],
  cssVars: WCCSSVar[],
): ValidationError[] {
  const errors: ValidationError[] = []

  if (!elementName) {
    errors.push({ field: 'elementName', message: 'Имя элемента обязательно' })
  } else if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(elementName)) {
    errors.push({
      field: 'elementName',
      message: 'Имя должно содержать дефис и быть в lowercase (например: my-widget)',
    })
  }

  const attrNames = attrs.map(a => a.name).filter(Boolean)
  const dupAttrs = attrNames.filter((n, i) => attrNames.indexOf(n) !== i)
  if (dupAttrs.length > 0) {
    errors.push({ field: 'attrs', message: `Дублирующиеся атрибуты: ${dupAttrs.join(', ')}` })
  }

  const propNames = props.map(p => p.name).filter(Boolean)
  const dupProps = propNames.filter((n, i) => propNames.indexOf(n) !== i)
  if (dupProps.length > 0) {
    errors.push({ field: 'props', message: `Дублирующиеся свойства: ${dupProps.join(', ')}` })
  }

  for (const v of cssVars) {
    if (v.name && !v.name.startsWith('--')) {
      errors.push({ field: 'cssVars', message: `CSS Custom Property "${v.name}" должно начинаться с --` })
    }
  }

  return errors
}

type Step = 'name' | 'attrs' | 'props' | 'events' | 'css-vars' | 'slots' | 'result'
const STEPS: Step[] = ['name', 'attrs', 'props', 'events', 'css-vars', 'slots', 'result']

const STEP_LABELS: Record<Step, string> = {
  name: 'Имя',
  attrs: 'Атрибуты',
  props: 'Свойства',
  events: 'События',
  'css-vars': 'CSS Vars',
  slots: 'Слоты',
  result: 'Результат',
}

export function Task5_2_Solution() {
  const [step, setStep] = useState<Step>('name')
  const [elementName, setElementName] = useState('')
  const [attrs, setAttrs] = useState<WCAttribute[]>([])
  const [props, setProps] = useState<WCProperty[]>([])
  const [events, setEvents] = useState<WCEvent[]>([])
  const [cssVars, setCssVars] = useState<WCCSSVar[]>([])
  const [slots, setSlots] = useState<WCSlot[]>([])
  const [activeCode, setActiveCode] = useState<'interface' | 'class'>('interface')

  const errors = validate(elementName, attrs, props, cssVars)

  const stepIndex = STEPS.indexOf(step)

  const addAttr = () =>
    setAttrs(a => [...a, { id: uid(), name: '', type: 'string', defaultValue: '' }])
  const removeAttr = (id: string) => setAttrs(a => a.filter(x => x.id !== id))
  const updateAttr = (id: string, field: keyof WCAttribute, value: string) =>
    setAttrs(a => a.map(x => (x.id === id ? { ...x, [field]: value } : x)))

  const addProp = () =>
    setProps(p => [...p, { id: uid(), name: '', tsType: 'string', description: '' }])
  const removeProp = (id: string) => setProps(p => p.filter(x => x.id !== id))
  const updateProp = (id: string, field: keyof WCProperty, value: string) =>
    setProps(p => p.map(x => (x.id === id ? { ...x, [field]: value } : x)))

  const addEvent = () => setEvents(e => [...e, { id: uid(), name: '', payloadType: '' }])
  const removeEvent = (id: string) => setEvents(e => e.filter(x => x.id !== id))
  const updateEvent = (id: string, field: keyof WCEvent, value: string) =>
    setEvents(e => e.map(x => (x.id === id ? { ...x, [field]: value } : x)))

  const addCssVar = () => setCssVars(v => [...v, { id: uid(), name: '--', defaultValue: '' }])
  const removeCssVar = (id: string) => setCssVars(v => v.filter(x => x.id !== id))
  const updateCssVar = (id: string, field: keyof WCCSSVar, value: string) =>
    setCssVars(v => v.map(x => (x.id === id ? { ...x, [field]: value } : x)))

  const addSlot = () => setSlots(s => [...s, { id: uid(), name: '', description: '' }])
  const removeSlot = (id: string) => setSlots(s => s.filter(x => x.id !== id))
  const updateSlot = (id: string, field: keyof WCSlot, value: string) =>
    setSlots(s => s.map(x => (x.id === id ? { ...x, [field]: value } : x)))

  const tsInterface = generateTSInterface(elementName, attrs, props, events, cssVars, slots)
  const classSkeleton = generateClassSkeleton(elementName, attrs, props, events, cssVars, slots)

  const inputStyle: React.CSSProperties = {
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
  }

  const btnStyle = (variant: 'primary' | 'secondary' | 'danger'): React.CSSProperties => ({
    padding: '6px 14px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    background: variant === 'primary' ? '#1a73e8' : variant === 'danger' ? '#d93025' : '#e8eaf6',
    color: variant === 'secondary' ? '#3949ab' : '#fff',
  })

  const stepBadge = (s: Step): React.CSSProperties => ({
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: s === step ? '#1a73e8' : STEPS.indexOf(s) < stepIndex ? '#c8e6c9' : '#f5f5f5',
    color: s === step ? '#fff' : STEPS.indexOf(s) < stepIndex ? '#2e7d32' : '#757575',
  })

  const fieldRow: React.CSSProperties = {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    padding: '8px 10px',
    background: '#fafafa',
    borderRadius: 8,
    border: '1px solid #eee',
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto', padding: '0 16px 32px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
        Конструктор контракта Web Component
      </h2>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        Опишите публичный API компонента — получите TypeScript-интерфейс и скелет класса
      </p>

      {/* Step Stepper */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
        {STEPS.map(s => (
          <button key={s} style={stepBadge(s)} onClick={() => setStep(s)}>
            {STEP_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Validation errors */}
      {errors.length > 0 && step === 'result' && (
        <div
          style={{
            padding: '10px 14px',
            background: '#ffebee',
            border: '1px solid #ef9a9a',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
            color: '#b71c1c',
          }}
        >
          {errors.map((e, i) => (
            <div key={i}>
              {e.message}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left: Form */}
        <div>
          {/* Step: Name */}
          {step === 'name' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Имя Custom Element</div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>
                  Имя элемента (должно содержать дефис)
                </label>
                <input
                  value={elementName}
                  onChange={e => setElementName(e.target.value.toLowerCase())}
                  placeholder="my-widget"
                  style={{
                    ...inputStyle,
                    width: '100%',
                    boxSizing: 'border-box',
                    borderColor:
                      elementName && !/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(elementName)
                        ? '#d93025'
                        : '#ddd',
                  }}
                />
                {elementName && !/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(elementName) && (
                  <div style={{ color: '#d93025', fontSize: 12, marginTop: 4 }}>
                    Имя должно содержать дефис (например: my-widget, catalog-card)
                  </div>
                )}
                {elementName && /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(elementName) && (
                  <div style={{ color: '#388e3c', fontSize: 12, marginTop: 4 }}>
                    Класс: {toPascalCase(elementName)}
                  </div>
                )}
              </div>
              <button style={btnStyle('primary')} onClick={() => setStep('attrs')}>
                Далее: Атрибуты
              </button>
            </div>
          )}

          {/* Step: Attributes */}
          {step === 'attrs' && (
            <div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
              >
                <span style={{ fontWeight: 600 }}>Атрибуты</span>
                <button style={btnStyle('primary')} onClick={addAttr}>
                  + Добавить
                </button>
              </div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                Атрибуты — строки из HTML. Для передачи объектов используйте свойства.
              </p>
              {attrs.length === 0 && (
                <div style={{ color: '#999', fontSize: 13 }}>Нет атрибутов</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {attrs.map(a => (
                  <div key={a.id} style={fieldRow}>
                    <input
                      value={a.name}
                      onChange={e => updateAttr(a.id, 'name', e.target.value)}
                      placeholder="attr-name"
                      style={{ ...inputStyle, flex: 2 }}
                    />
                    <select
                      value={a.type}
                      onChange={e => updateAttr(a.id, 'type', e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    >
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                    </select>
                    <input
                      value={a.defaultValue}
                      onChange={e => updateAttr(a.id, 'defaultValue', e.target.value)}
                      placeholder="default"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button style={btnStyle('danger')} onClick={() => removeAttr(a.id)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={btnStyle('secondary')} onClick={() => setStep('name')}>
                  Назад
                </button>
                <button style={btnStyle('primary')} onClick={() => setStep('props')}>
                  Далее: Свойства
                </button>
              </div>
            </div>
          )}

          {/* Step: Properties */}
          {step === 'props' && (
            <div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
              >
                <span style={{ fontWeight: 600 }}>Свойства</span>
                <button style={btnStyle('primary')} onClick={addProp}>
                  + Добавить
                </button>
              </div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                Свойства — JS-объекты, массивы, любые типы. Задаются через element.prop = value.
              </p>
              {props.length === 0 && (
                <div style={{ color: '#999', fontSize: 13 }}>Нет свойств</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {props.map(p => (
                  <div key={p.id} style={fieldRow}>
                    <input
                      value={p.name}
                      onChange={e => updateProp(p.id, 'name', e.target.value)}
                      placeholder="propName"
                      style={{ ...inputStyle, flex: 2 }}
                    />
                    <input
                      value={p.tsType}
                      onChange={e => updateProp(p.id, 'tsType', e.target.value)}
                      placeholder="TS тип"
                      style={{ ...inputStyle, flex: 2 }}
                    />
                    <input
                      value={p.description}
                      onChange={e => updateProp(p.id, 'description', e.target.value)}
                      placeholder="описание"
                      style={{ ...inputStyle, flex: 3 }}
                    />
                    <button style={btnStyle('danger')} onClick={() => removeProp(p.id)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={btnStyle('secondary')} onClick={() => setStep('attrs')}>
                  Назад
                </button>
                <button style={btnStyle('primary')} onClick={() => setStep('events')}>
                  Далее: События
                </button>
              </div>
            </div>
          )}

          {/* Step: Events */}
          {step === 'events' && (
            <div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
              >
                <span style={{ fontWeight: 600 }}>События</span>
                <button style={btnStyle('primary')} onClick={addEvent}>
                  + Добавить
                </button>
              </div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                Используйте namespace: mf:action, catalog:item-selected
              </p>
              {events.length === 0 && (
                <div style={{ color: '#999', fontSize: 13 }}>Нет событий</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {events.map(e => (
                  <div key={e.id} style={fieldRow}>
                    <input
                      value={e.name}
                      onChange={ev => updateEvent(e.id, 'name', ev.target.value)}
                      placeholder="mf:event-name"
                      style={{ ...inputStyle, flex: 2 }}
                    />
                    <input
                      value={e.payloadType}
                      onChange={ev => updateEvent(e.id, 'payloadType', ev.target.value)}
                      placeholder="{ id: string }"
                      style={{ ...inputStyle, flex: 3 }}
                    />
                    <button style={btnStyle('danger')} onClick={() => removeEvent(e.id)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={btnStyle('secondary')} onClick={() => setStep('props')}>
                  Назад
                </button>
                <button style={btnStyle('primary')} onClick={() => setStep('css-vars')}>
                  Далее: CSS Vars
                </button>
              </div>
            </div>
          )}

          {/* Step: CSS Vars */}
          {step === 'css-vars' && (
            <div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
              >
                <span style={{ fontWeight: 600 }}>CSS Custom Properties</span>
                <button style={btnStyle('primary')} onClick={addCssVar}>
                  + Добавить
                </button>
              </div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                Должны начинаться с -- и желательно иметь namespace (--my-widget-color)
              </p>
              {cssVars.length === 0 && (
                <div style={{ color: '#999', fontSize: 13 }}>Нет CSS Custom Properties</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cssVars.map(v => (
                  <div key={v.id} style={fieldRow}>
                    <input
                      value={v.name}
                      onChange={e => updateCssVar(v.id, 'name', e.target.value)}
                      placeholder="--my-widget-color"
                      style={{
                        ...inputStyle,
                        flex: 3,
                        borderColor: v.name && !v.name.startsWith('--') ? '#d93025' : '#ddd',
                      }}
                    />
                    <input
                      value={v.defaultValue}
                      onChange={e => updateCssVar(v.id, 'defaultValue', e.target.value)}
                      placeholder="default (#000)"
                      style={{ ...inputStyle, flex: 2 }}
                    />
                    <button style={btnStyle('danger')} onClick={() => removeCssVar(v.id)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={btnStyle('secondary')} onClick={() => setStep('events')}>
                  Назад
                </button>
                <button style={btnStyle('primary')} onClick={() => setStep('slots')}>
                  Далее: Слоты
                </button>
              </div>
            </div>
          )}

          {/* Step: Slots */}
          {step === 'slots' && (
            <div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
              >
                <span style={{ fontWeight: 600 }}>Слоты</span>
                <button style={btnStyle('primary')} onClick={addSlot}>
                  + Добавить
                </button>
              </div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                Оставьте имя пустым для default slot. Named slots: name="footer"
              </p>
              {slots.length === 0 && (
                <div style={{ color: '#999', fontSize: 13 }}>Нет слотов</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {slots.map(s => (
                  <div key={s.id} style={fieldRow}>
                    <input
                      value={s.name}
                      onChange={e => updateSlot(s.id, 'name', e.target.value)}
                      placeholder="(default)"
                      style={{ ...inputStyle, flex: 2 }}
                    />
                    <input
                      value={s.description}
                      onChange={e => updateSlot(s.id, 'description', e.target.value)}
                      placeholder="описание слота"
                      style={{ ...inputStyle, flex: 4 }}
                    />
                    <button style={btnStyle('danger')} onClick={() => removeSlot(s.id)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={btnStyle('secondary')} onClick={() => setStep('css-vars')}>
                  Назад
                </button>
                <button style={btnStyle('primary')} onClick={() => setStep('result')}>
                  Сгенерировать
                </button>
              </div>
            </div>
          )}

          {/* Step: Result — Summary */}
          {step === 'result' && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Сводка контракта</div>
              <div
                style={{
                  padding: '12px 14px',
                  background: '#f5f5f5',
                  borderRadius: 8,
                  fontSize: 13,
                  lineHeight: '1.8',
                }}
              >
                <div>
                  Элемент:{' '}
                  <strong style={{ color: '#1a73e8' }}>{elementName || '(не задано)'}</strong>
                </div>
                <div>
                  Класс: <strong>{toPascalCase(elementName || 'my-element')}</strong>
                </div>
                <div>Атрибуты: {attrs.length}</div>
                <div>Свойства: {props.length}</div>
                <div>События: {events.length}</div>
                <div>CSS Custom Properties: {cssVars.length}</div>
                <div>Слоты: {slots.length}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={btnStyle('secondary')} onClick={() => setStep('slots')}>
                  Назад
                </button>
                <button style={btnStyle('secondary')} onClick={() => setStep('name')}>
                  Начать заново
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Code Preview */}
        <div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 0 }}>
            {(['interface', 'class'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveCode(t)}
                style={{
                  padding: '5px 14px',
                  border: 'none',
                  borderRadius: '6px 6px 0 0',
                  cursor: 'pointer',
                  fontWeight: activeCode === t ? 700 : 400,
                  background: activeCode === t ? '#1e1e2e' : '#e8eaf6',
                  color: activeCode === t ? '#cdd6f4' : '#3949ab',
                  fontSize: 12,
                }}
              >
                {t === 'interface' ? 'TypeScript Interface' : 'Class Skeleton'}
              </button>
            ))}
          </div>
          <div
            style={{
              background: '#1e1e2e',
              borderRadius: '0 8px 8px 8px',
              padding: '14px 16px',
              fontFamily: 'monospace',
              fontSize: 12,
              lineHeight: '1.6',
              color: '#cdd6f4',
              overflowX: 'auto',
              minHeight: 300,
              maxHeight: 520,
              overflowY: 'auto',
            }}
          >
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {activeCode === 'interface' ? (
                <SimpleHighlight code={tsInterface} />
              ) : (
                <SimpleHighlight code={classSkeleton} />
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

// Minimal syntax highlight
function SimpleHighlight({ code }: { code: string }) {
  const lines = code.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trimStart()
        let color = '#cdd6f4'
        if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
          color = '#6c7086'
        } else if (
          trimmed.startsWith('interface') ||
          trimmed.startsWith('class') ||
          trimmed.startsWith('type') ||
          trimmed.startsWith('export')
        ) {
          color = '#cba6f7'
        } else if (
          trimmed.startsWith('constructor') ||
          trimmed.startsWith('connectedCallback') ||
          trimmed.startsWith('disconnectedCallback') ||
          trimmed.startsWith('attributeChangedCallback') ||
          trimmed.startsWith('static') ||
          trimmed.startsWith('private') ||
          trimmed.startsWith('get ') ||
          trimmed.startsWith('set ')
        ) {
          color = '#89b4fa'
        } else if (trimmed.includes('customElements.define')) {
          color = '#a6e3a1'
        }
        return (
          <span key={i} style={{ color, display: 'block' }}>
            {line || ' '}
          </span>
        )
      })}
    </>
  )
}
