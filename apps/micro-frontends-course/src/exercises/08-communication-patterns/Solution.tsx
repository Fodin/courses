import { useState, useCallback, useRef, useEffect } from 'react'

// =====================================================
// Task 8.1: Event Bus Visualizer
// =====================================================

type MFEId = 'catalog' | 'cart' | 'profile'

type EventDef = {
  name: string
  label: string
  payload: string
  color: string
}

type Subscription = {
  event: string
  subscriber: MFEId
}

type EventLogEntry = {
  id: number
  time: string
  sender: MFEId
  event: string
  payload: string
  receivers: MFEId[]
}

type Arrow = {
  id: number
  from: MFEId
  to: MFEId
  visible: boolean
}

const MFE_CONFIG: Record<MFEId, { label: string; color: string; border: string; bg: string }> = {
  catalog: { label: 'Каталог', color: '#1565c0', border: '#2196f3', bg: '#e3f2fd' },
  cart:    { label: 'Корзина', color: '#1b5e20', border: '#4caf50', bg: '#e8f5e9' },
  profile: { label: 'Профиль', color: '#4a148c', border: '#9c27b0', bg: '#f3e5f5' },
}

const MFE_EVENTS: Record<MFEId, EventDef[]> = {
  catalog: [
    { name: 'catalog:add-to-cart', label: 'Добавить в корзину', payload: '{ productId: "p42", qty: 1 }', color: '#1565c0' },
    { name: 'catalog:product-viewed', label: 'Просмотр товара', payload: '{ productId: "p42" }', color: '#1565c0' },
  ],
  cart: [
    { name: 'cart:checkout-started', label: 'Оформить заказ', payload: '{ total: 3200, items: 3 }', color: '#1b5e20' },
    { name: 'cart:item-removed', label: 'Удалить товар', payload: '{ productId: "p42" }', color: '#1b5e20' },
  ],
  profile: [
    { name: 'profile:address-updated', label: 'Обновить адрес', payload: '{ city: "Moscow" }', color: '#4a148c' },
    { name: 'profile:logout', label: 'Выйти из аккаунта', payload: '{}', color: '#4a148c' },
  ],
}

const ALL_EVENTS = [
  'catalog:add-to-cart',
  'catalog:product-viewed',
  'cart:checkout-started',
  'cart:item-removed',
  'profile:address-updated',
  'profile:logout',
]

const MFE_IDS: MFEId[] = ['catalog', 'cart', 'profile']

function getNow() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const INITIAL_SUBS: Subscription[] = [
  { event: 'catalog:add-to-cart', subscriber: 'cart' },
  { event: 'catalog:add-to-cart', subscriber: 'profile' },
  { event: 'cart:checkout-started', subscriber: 'profile' },
  { event: 'profile:logout', subscriber: 'catalog' },
  { event: 'profile:logout', subscriber: 'cart' },
  { event: 'profile:address-updated', subscriber: 'cart' },
]

export function Task8_1_Solution() {
  const [subs, setSubs] = useState<Subscription[]>(INITIAL_SUBS)
  const [log, setLog] = useState<EventLogEntry[]>([])
  const [arrows, setArrows] = useState<Arrow[]>([])
  const [activeArrows, setActiveArrows] = useState<number[]>([])
  const arrowIdRef = useRef(0)
  const logIdRef = useRef(0)
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [log])

  const getSubscribers = useCallback((event: string): MFEId[] => {
    return subs.filter(s => s.event === event).map(s => s.subscriber)
  }, [subs])

  const sendEvent = useCallback((sender: MFEId, evt: EventDef) => {
    const receivers = getSubscribers(evt.name).filter(r => r !== sender)
    const entry: EventLogEntry = {
      id: logIdRef.current++,
      time: getNow(),
      sender,
      event: evt.name,
      payload: evt.payload,
      receivers,
    }
    setLog(prev => [...prev, entry])

    receivers.forEach(receiver => {
      const id = arrowIdRef.current++
      setArrows(prev => [...prev, { id, from: sender, to: receiver, visible: true }])
      setActiveArrows(prev => [...prev, id])
      setTimeout(() => {
        setActiveArrows(prev => prev.filter(a => a !== id))
        setArrows(prev => prev.filter(a => a.id !== id))
      }, 1200)
    })
  }, [getSubscribers])

  const toggleSub = useCallback((event: string, subscriber: MFEId) => {
    setSubs(prev => {
      const exists = prev.some(s => s.event === event && s.subscriber === subscriber)
      if (exists) {
        return prev.filter(s => !(s.event === event && s.subscriber === subscriber))
      }
      return [...prev, { event, subscriber }]
    })
  }, [])

  const isSubscribed = (event: string, subscriber: MFEId) =>
    subs.some(s => s.event === event && s.subscriber === subscriber)

  const mfeOrder: MFEId[] = ['catalog', 'cart', 'profile']

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, padding: 20, maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#1a237e' }}>8.1 Визуализатор Event Bus</h2>

      {/* MFE blocks */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, position: 'relative' }}>
        {mfeOrder.map(mfe => {
          const cfg = MFE_CONFIG[mfe]
          const evts = MFE_EVENTS[mfe]
          const incomingActive = arrows.some(a => a.to === mfe && activeArrows.includes(a.id))
          return (
            <div
              key={mfe}
              style={{
                flex: 1,
                border: `2px solid ${cfg.border}`,
                borderRadius: 12,
                background: cfg.bg,
                padding: '14px 16px',
                transition: 'box-shadow 0.3s',
                boxShadow: incomingActive
                  ? `0 0 16px 4px ${cfg.border}80`
                  : '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ fontWeight: 700, color: cfg.color, fontSize: 15, marginBottom: 10 }}>
                MFE: {cfg.label}
              </div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 8 }}>Отправить событие:</div>
              {evts.map(evt => (
                <button
                  key={evt.name}
                  onClick={() => sendEvent(mfe, evt)}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginBottom: 6,
                    padding: '7px 10px',
                    background: cfg.color,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    textAlign: 'left',
                    lineHeight: 1.3,
                  }}
                >
                  {evt.label}
                  <span style={{ display: 'block', opacity: 0.75, fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>
                    {evt.name}
                  </span>
                </button>
              ))}
              {incomingActive && (
                <div style={{
                  marginTop: 10,
                  padding: '6px 10px',
                  background: cfg.border,
                  color: '#fff',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  animation: 'fadeIn 0.3s',
                }}>
                  Получено событие!
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Arrow indicators */}
      {arrows.filter(a => activeArrows.includes(a.id)).map(a => {
        const fromIdx = mfeOrder.indexOf(a.from)
        const toIdx = mfeOrder.indexOf(a.to)
        const dir = fromIdx < toIdx ? '→' : '←'
        return (
          <div key={a.id} style={{
            textAlign: 'center',
            color: '#ff5722',
            fontWeight: 700,
            fontSize: 18,
            marginBottom: 4,
            animation: 'pulse 0.6s infinite',
          }}>
            {MFE_CONFIG[a.from].label} {dir} {MFE_CONFIG[a.to].label}
          </div>
        )
      })}

      {/* Subscriptions table */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 8, color: '#333' }}>Таблица подписок</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '8px 12px', border: '1px solid #ddd', textAlign: 'left' }}>Событие</th>
                {MFE_IDS.map(mfe => (
                  <th key={mfe} style={{ padding: '8px 12px', border: '1px solid #ddd', color: MFE_CONFIG[mfe].color }}>
                    {MFE_CONFIG[mfe].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_EVENTS.map(event => {
                const senderMFE = event.split(':')[0] as MFEId
                return (
                  <tr key={event}>
                    <td style={{ padding: '6px 12px', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: 11 }}>
                      {event}
                    </td>
                    {MFE_IDS.map(mfe => {
                      const isSender = mfe === senderMFE
                      const subbed = isSubscribed(event, mfe)
                      return (
                        <td key={mfe} style={{ padding: '6px 12px', border: '1px solid #ddd', textAlign: 'center' }}>
                          {isSender ? (
                            <span style={{ color: MFE_CONFIG[mfe].color, fontWeight: 700 }}>emit</span>
                          ) : (
                            <button
                              onClick={() => toggleSub(event, mfe)}
                              style={{
                                padding: '3px 10px',
                                border: `1px solid ${subbed ? MFE_CONFIG[mfe].border : '#ccc'}`,
                                borderRadius: 4,
                                background: subbed ? MFE_CONFIG[mfe].bg : '#fff',
                                color: subbed ? MFE_CONFIG[mfe].color : '#999',
                                cursor: 'pointer',
                                fontSize: 11,
                                fontWeight: subbed ? 600 : 400,
                              }}
                            >
                              {subbed ? 'on' : 'off'}
                            </button>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 6 }}>
          Нажмите on/off чтобы подписать или отписать MFE от события
        </div>
      </div>

      {/* Event log */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontWeight: 700, color: '#333' }}>Лог событий</span>
          <button
            onClick={() => setLog([])}
            style={{ padding: '4px 12px', background: '#fff', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
          >
            Очистить
          </button>
        </div>
        <div style={{
          background: '#1a1a2e',
          borderRadius: 8,
          padding: '10px 14px',
          minHeight: 120,
          maxHeight: 220,
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: 12,
        }}>
          {log.length === 0 && (
            <div style={{ color: '#666' }}>Нажмите кнопку события чтобы отправить его через шину...</div>
          )}
          {log.map(entry => (
            <div key={entry.id} style={{ marginBottom: 5, borderLeft: `3px solid ${MFE_CONFIG[entry.sender].border}`, paddingLeft: 8 }}>
              <span style={{ color: '#666' }}>[{entry.time}]</span>{' '}
              <span style={{ color: MFE_CONFIG[entry.sender].border, fontWeight: 600 }}>{MFE_CONFIG[entry.sender].label}</span>
              {' '}→ emit{' '}
              <span style={{ color: '#ffd54f' }}>{entry.event}</span>{' '}
              <span style={{ color: '#80cbc4' }}>{entry.payload}</span>
              {entry.receivers.length > 0 ? (
                <span style={{ color: '#aaa' }}>
                  {' '}• получили: {entry.receivers.map(r => MFE_CONFIG[r].label).join(', ')}
                </span>
              ) : (
                <span style={{ color: '#666' }}> • нет подписчиков</span>
              )}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
      `}</style>
    </div>
  )
}

// =====================================================
// Task 8.2: Event Contract Constructor
// =====================================================

type Direction = 'emit' | 'listen'

type EventEntry = {
  id: string
  name: string
  direction: Direction
  payloadType: string
}

type StateSlice = {
  id: string
  name: string
  sliceType: string
  owner: string
  readers: string[]
}

type MFEDef = {
  id: string
  name: string
  events: EventEntry[]
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function generateTypeScript(mfes: MFEDef[], slices: StateSlice[]): string {
  const lines: string[] = []

  // Collect all events
  const allEmits: { mfe: string; event: EventEntry }[] = []
  const allListens: { mfe: string; event: EventEntry }[] = []
  mfes.forEach(m => {
    m.events.forEach(e => {
      if (e.name.trim()) {
        if (e.direction === 'emit') allEmits.push({ mfe: m.name, event: e })
        else allListens.push({ mfe: m.name, event: e })
      }
    })
  })

  // EventMap
  lines.push('// Auto-generated event contract')
  lines.push('')
  lines.push('export interface EventMap {')
  allEmits.forEach(({ event }) => {
    if (event.name.trim()) {
      lines.push(`  '${event.name}': ${event.payloadType || 'void'}`)
    }
  })
  lines.push('}')
  lines.push('')

  // EventBus class
  lines.push('export class EventBus {')
  lines.push('  private handlers = new Map<keyof EventMap, Set<Function>>()')
  lines.push('')
  lines.push('  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {')
  lines.push('    this.handlers.get(event)?.forEach(fn => fn(payload))')
  lines.push('  }')
  lines.push('')
  lines.push('  on<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): () => void {')
  lines.push('    if (!this.handlers.has(event)) this.handlers.set(event, new Set())')
  lines.push('    this.handlers.get(event)!.add(handler)')
  lines.push('    return () => this.handlers.get(event)?.delete(handler)')
  lines.push('  }')
  lines.push('}')
  lines.push('')
  lines.push('export const eventBus = new EventBus()')
  lines.push('')

  // SharedState
  if (slices.length > 0) {
    lines.push('export interface SharedState {')
    slices.forEach(s => {
      if (s.name.trim()) {
        lines.push(`  ${s.name}: ${s.sliceType || 'unknown'} // owner: ${s.owner || '?'}`)
      }
    })
    lines.push('}')
  }

  return lines.join('\n')
}

function validateContract(mfes: MFEDef[]): string[] {
  const warnings: string[] = []
  const emitted = new Set<string>()
  const listened = new Set<string>()

  mfes.forEach(m => {
    m.events.forEach(e => {
      if (!e.name.trim()) return
      if (e.direction === 'emit') emitted.add(e.name)
      else listened.add(e.name)
    })
  })

  emitted.forEach(name => {
    if (!listened.has(name)) {
      warnings.push(`"${name}" отправляется, но никто не слушает — orphan emitter`)
    }
  })
  listened.forEach(name => {
    if (!emitted.has(name)) {
      warnings.push(`"${name}" слушается, но никто не отправляет — orphan listener`)
    }
  })

  return warnings
}

export function Task8_2_Solution() {
  const [mfes, setMfes] = useState<MFEDef[]>([
    {
      id: uid(),
      name: 'catalog',
      events: [
        { id: uid(), name: 'catalog:add-to-cart', direction: 'emit', payloadType: '{ productId: string; qty: number }' },
        { id: uid(), name: 'cart:checkout-started', direction: 'listen', payloadType: '{ total: number }' },
      ],
    },
    {
      id: uid(),
      name: 'cart',
      events: [
        { id: uid(), name: 'catalog:add-to-cart', direction: 'listen', payloadType: '{ productId: string; qty: number }' },
        { id: uid(), name: 'cart:checkout-started', direction: 'emit', payloadType: '{ total: number; items: number }' },
      ],
    },
  ])

  const [slices, setSlices] = useState<StateSlice[]>([
    { id: uid(), name: 'cartCount', sliceType: 'number', owner: 'cart', readers: ['catalog', 'profile'] },
  ])

  const [generated, setGenerated] = useState('')
  const [showGenerated, setShowGenerated] = useState(false)
  const warnings = validateContract(mfes)

  const addMfe = () => {
    setMfes(prev => [...prev, { id: uid(), name: 'newMFE', events: [] }])
  }

  const removeMfe = (id: string) => {
    setMfes(prev => prev.filter(m => m.id !== id))
  }

  const updateMfeName = (id: string, name: string) => {
    setMfes(prev => prev.map(m => m.id === id ? { ...m, name } : m))
  }

  const addEvent = (mfeId: string) => {
    setMfes(prev => prev.map(m =>
      m.id === mfeId
        ? { ...m, events: [...m.events, { id: uid(), name: '', direction: 'emit', payloadType: 'void' }] }
        : m
    ))
  }

  const removeEvent = (mfeId: string, evtId: string) => {
    setMfes(prev => prev.map(m =>
      m.id === mfeId ? { ...m, events: m.events.filter(e => e.id !== evtId) } : m
    ))
  }

  const updateEvent = (mfeId: string, evtId: string, field: keyof EventEntry, value: string) => {
    setMfes(prev => prev.map(m =>
      m.id === mfeId
        ? { ...m, events: m.events.map(e => e.id === evtId ? { ...e, [field]: value } : e) }
        : m
    ))
  }

  const addSlice = () => {
    setSlices(prev => [...prev, { id: uid(), name: '', sliceType: 'unknown', owner: '', readers: [] }])
  }

  const removeSlice = (id: string) => {
    setSlices(prev => prev.filter(s => s.id !== id))
  }

  const updateSlice = (id: string, field: keyof StateSlice, value: string) => {
    setSlices(prev => prev.map(s =>
      s.id === id ? { ...s, [field]: field === 'readers' ? value.split(',').map(r => r.trim()) : value } : s
    ))
  }

  const handleGenerate = () => {
    setGenerated(generateTypeScript(mfes, slices))
    setShowGenerated(true)
  }

  const inputStyle: React.CSSProperties = {
    padding: '5px 8px',
    border: '1px solid #ddd',
    borderRadius: 4,
    fontSize: 12,
    fontFamily: 'monospace',
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, padding: 20, maxWidth: 980, margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#1a237e' }}>8.2 Конструктор Event Contract</h2>

      {/* MFE definitions */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>MFE и их события</span>
          <button
            onClick={addMfe}
            style={{ padding: '5px 14px', background: '#1565c0', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
          >
            + Добавить MFE
          </button>
        </div>

        {mfes.map(mfe => (
          <div key={mfe.id} style={{ border: '1px solid #e0e0e0', borderRadius: 10, padding: '14px 16px', marginBottom: 12, background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <input
                value={mfe.name}
                onChange={e => updateMfeName(mfe.id, e.target.value)}
                style={{ ...inputStyle, fontWeight: 700, fontSize: 13, width: 160 }}
                placeholder="Имя MFE"
              />
              <button
                onClick={() => addEvent(mfe.id)}
                style={{ padding: '4px 10px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
              >
                + Событие
              </button>
              <button
                onClick={() => removeMfe(mfe.id)}
                style={{ padding: '4px 10px', background: '#fff', border: '1px solid #f44336', color: '#f44336', borderRadius: 4, cursor: 'pointer', fontSize: 12, marginLeft: 'auto' }}
              >
                Удалить MFE
              </button>
            </div>

            {mfe.events.length === 0 && (
              <div style={{ color: '#999', fontSize: 12, fontStyle: 'italic' }}>Нет событий — нажмите «+ Событие»</div>
            )}

            {mfe.events.map(evt => (
              <div key={evt.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                <input
                  value={evt.name}
                  onChange={e => updateEvent(mfe.id, evt.id, 'name', e.target.value)}
                  style={{ ...inputStyle, width: 220 }}
                  placeholder="mfe:event-name"
                />
                <select
                  value={evt.direction}
                  onChange={e => updateEvent(mfe.id, evt.id, 'direction', e.target.value)}
                  style={{ ...inputStyle, color: evt.direction === 'emit' ? '#1565c0' : '#1b5e20', fontWeight: 600 }}
                >
                  <option value="emit">emit (отправляет)</option>
                  <option value="listen">listen (слушает)</option>
                </select>
                <input
                  value={evt.payloadType}
                  onChange={e => updateEvent(mfe.id, evt.id, 'payloadType', e.target.value)}
                  style={{ ...inputStyle, flex: 1, minWidth: 160 }}
                  placeholder="payload type, напр. { id: string }"
                />
                <button
                  onClick={() => removeEvent(mfe.id, evt.id)}
                  style={{ padding: '4px 8px', background: 'none', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', color: '#999', fontSize: 12 }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Shared state slices */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Shared State Slices</span>
          <button
            onClick={addSlice}
            style={{ padding: '5px 14px', background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
          >
            + Добавить slice
          </button>
        </div>

        {slices.length === 0 && (
          <div style={{ color: '#999', fontSize: 12, fontStyle: 'italic', marginBottom: 8 }}>Нет shared state</div>
        )}

        {slices.map(slice => (
          <div key={slice.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <input
              value={slice.name}
              onChange={e => updateSlice(slice.id, 'name', e.target.value)}
              style={{ ...inputStyle, width: 120 }}
              placeholder="sliceName"
            />
            <input
              value={slice.sliceType}
              onChange={e => updateSlice(slice.id, 'sliceType', e.target.value)}
              style={{ ...inputStyle, width: 140 }}
              placeholder="type"
            />
            <input
              value={slice.owner}
              onChange={e => updateSlice(slice.id, 'owner', e.target.value)}
              style={{ ...inputStyle, width: 100 }}
              placeholder="owner MFE"
            />
            <input
              value={Array.isArray(slice.readers) ? slice.readers.join(', ') : ''}
              onChange={e => updateSlice(slice.id, 'readers', e.target.value)}
              style={{ ...inputStyle, flex: 1, minWidth: 120 }}
              placeholder="readers (через запятую)"
            />
            <button
              onClick={() => removeSlice(slice.id)}
              style={{ padding: '4px 8px', background: 'none', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', color: '#999', fontSize: 12 }}
            >
              ✕
            </button>
          </div>
        ))}
        <div style={{ fontSize: 11, color: '#888' }}>name | type | owner MFE | readers (через запятую)</div>
      </div>

      {/* Validation warnings */}
      {warnings.length > 0 && (
        <div style={{ background: '#fff3e0', border: '1px solid #ff9800', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: '#e65100', marginBottom: 6 }}>Предупреждения контракта:</div>
          {warnings.map((w, i) => (
            <div key={i} style={{ color: '#bf360c', fontSize: 12, marginBottom: 2 }}>• {w}</div>
          ))}
        </div>
      )}

      {warnings.length === 0 && mfes.length > 0 && (
        <div style={{ background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: 8, padding: '8px 14px', marginBottom: 16, fontSize: 12, color: '#1b5e20' }}>
          Контракт валиден: все emit-события имеют listeners
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        style={{ padding: '10px 24px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14, marginBottom: 16 }}
      >
        Сгенерировать TypeScript
      </button>

      {/* Generated code */}
      {showGenerated && (
        <div>
          <div style={{ fontWeight: 700, marginBottom: 8, color: '#333' }}>Сгенерированный код:</div>
          <pre style={{
            background: '#1a1a2e',
            color: '#e0e0e0',
            borderRadius: 8,
            padding: '14px 16px',
            fontSize: 12,
            overflowX: 'auto',
            lineHeight: 1.6,
            fontFamily: 'monospace',
          }}>
            {generated}
          </pre>
        </div>
      )}
    </div>
  )
}

// =====================================================
// Task 8.3: Communication Pattern Selector
// =====================================================

type PatternId = 'custom-events' | 'shared-state' | 'url-storage' | 'props-shell' | 'orchestrator'

type Pattern = {
  id: PatternId
  label: string
  color: string
}

type Scenario = {
  id: number
  title: string
  description: string
  correct: PatternId
  correctExplanation: string
  badPattern: PatternId
  badExplanation: string
}

const PATTERNS: Pattern[] = [
  { id: 'custom-events', label: 'Custom Events (pub/sub)', color: '#1565c0' },
  { id: 'shared-state', label: 'Shared State (Zustand/Redux)', color: '#2e7d32' },
  { id: 'url-storage', label: 'URL / localStorage', color: '#6a1b9a' },
  { id: 'props-shell', label: 'Props через Shell', color: '#e65100' },
  { id: 'orchestrator', label: 'Orchestrator Pattern', color: '#880e4f' },
]

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'Каталог добавляет товар в корзину',
    description: 'Пользователь нажимает "Добавить в корзину" в Catalog MFE. Cart MFE должен обновить счётчик товаров. Catalog не ожидает ответа — только сигнализирует о событии.',
    correct: 'custom-events',
    correctExplanation: 'Идеальный случай для Custom Events: fire-and-forget, Catalog не знает о Cart, минимальная связность. Catalog эмитит событие catalog:add-to-cart, Cart подписывается и реагирует независимо.',
    badPattern: 'shared-state',
    badExplanation: 'Shared State здесь избыточен — Cart должен владеть своим состоянием корзины. Если Catalog пишет напрямую в store Cart, нарушается принцип ownership: один MFE не должен мутировать данные другого.',
  },
  {
    id: 2,
    title: 'Корзина отображает счётчик товаров в шапке',
    description: 'Shell показывает badge с количеством товаров в корзине. Этот badge должен обновляться в реальном времени при добавлении/удалении товаров в Cart MFE.',
    correct: 'shared-state',
    correctExplanation: 'Классический случай для Shared State: данные нужны нескольким компонентам одновременно (Shell + Cart), обновления должны синхронизироваться. Zustand store с cartCount — чистое решение без дублирования.',
    badPattern: 'custom-events',
    badExplanation: 'Custom Events для синхронизации UI-состояния создаёт проблему: Shell должен слушать все события и поддерживать локальный счётчик. При перезагрузке или позднем монтировании Shell потеряет актуальное состояние.',
  },
  {
    id: 3,
    title: 'Профиль обновляет язык интерфейса для всех MFE',
    description: 'Пользователь меняет язык в Profile MFE. Все MFE должны немедленно переключить язык и сохранить выбор между сессиями.',
    correct: 'url-storage',
    correctExplanation: 'localStorage + синхронизация через window storage event — правильный выбор для глобальных пользовательских настроек. Язык сохраняется между сессиями, все вкладки синхронизируются через стандартный браузерный механизм.',
    badPattern: 'props-shell',
    badExplanation: 'Props через Shell работает, но требует явной передачи lang-пропа каждому MFE. При добавлении нового MFE нужно помнить подключить проп. localStorage даёт автоматическую синхронизацию без изменений Shell.',
  },
  {
    id: 4,
    title: 'Shell передаёт токен авторизации всем MFE',
    description: 'После логина Shell получает JWT-токен. Каждый MFE должен использовать этот токен для API-запросов. Токен может обновляться (refresh).',
    correct: 'props-shell',
    correctExplanation: 'Токен — это данные сессии, которыми Shell управляет централизованно. Передача через props/mount-параметры — явный и безопасный контракт. Shell отвечает за refresh и передаёт актуальный токен при перемонтировании.',
    badPattern: 'url-storage',
    badExplanation: 'JWT в localStorage — риск XSS-атаки. Токен авторизации не должен лежать в localStorage без дополнительной защиты. Управление токеном — ответственность Shell, не браузерного хранилища.',
  },
  {
    id: 5,
    title: 'Checkout и Payment координируют многошаговый процесс',
    description: 'Оформление заказа проходит через несколько шагов: Checkout MFE собирает данные → Payment MFE обрабатывает оплату → Checkout MFE подтверждает заказ. Нужна строгая последовательность.',
    correct: 'orchestrator',
    correctExplanation: 'Многошаговый процесс с чёткой последовательностью — идеальный кейс для Orchestrator. Shell (или отдельный service) управляет state machine: step1→step2→step3. Каждый MFE получает только свои данные и сигнализирует о завершении шага.',
    badPattern: 'custom-events',
    badExplanation: 'Custom Events для координации многошагового флоу создаёт "сагу из событий" — сложную цепочку emit/listen между MFE. Такой код тяжело отлаживать: при сбое на шаге 3 непонятно, кто виноват и в каком состоянии система.',
  },
  {
    id: 6,
    title: 'Аналитика: трекинг событий из всех MFE',
    description: 'Analytics MFE должен собирать пользовательские события из всех частей приложения: просмотры товаров, клики, оформление заказов — без того чтобы MFE знали об Analytics.',
    correct: 'custom-events',
    correctExplanation: 'Custom Events — идеальный паттерн для аналитики: все MFE просто эмитят бизнес-события (catalog:product-viewed, cart:checkout-started), Analytics MFE подписывается на все нужные события. Полная развязка: MFE не импортируют Analytics.',
    badPattern: 'props-shell',
    badExplanation: 'Передача analytics-коллбеков через props от Shell ко всем MFE создаёт сильную связность: Shell должен знать о каждом MFE и передавать одинаковые пропы. При добавлении нового MFE нужно менять Shell.',
  },
]

export function Task8_3_Solution() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0])
  const [userChoice, setUserChoice] = useState<PatternId | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleScenarioChange = (id: number) => {
    const s = SCENARIOS.find(s => s.id === id)
    if (s) {
      setSelectedScenario(s)
      setUserChoice(null)
      setShowResult(false)
    }
  }

  const handleCheck = () => {
    if (userChoice) setShowResult(true)
  }

  const handleNext = () => {
    const idx = SCENARIOS.findIndex(s => s.id === selectedScenario.id)
    const next = SCENARIOS[(idx + 1) % SCENARIOS.length]
    setSelectedScenario(next)
    setUserChoice(null)
    setShowResult(false)
  }

  const isCorrect = userChoice === selectedScenario.correct

  const getPatternColor = (id: PatternId) => PATTERNS.find(p => p.id === id)?.color ?? '#333'
  const getPatternLabel = (id: PatternId) => PATTERNS.find(p => p.id === id)?.label ?? id

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, padding: 20, maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, color: '#1a237e' }}>8.3 Выбор паттерна коммуникации</h2>

      {/* Scenario selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#555' }}>Выберите сценарий:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => handleScenarioChange(s.id)}
              style={{
                padding: '7px 14px',
                border: `2px solid ${selectedScenario.id === s.id ? '#1a237e' : '#ddd'}`,
                borderRadius: 8,
                background: selectedScenario.id === s.id ? '#e8eaf6' : '#fff',
                color: selectedScenario.id === s.id ? '#1a237e' : '#555',
                cursor: 'pointer',
                fontWeight: selectedScenario.id === s.id ? 700 : 400,
                fontSize: 13,
              }}
            >
              {s.id}. {s.title.split(' ').slice(0, 3).join(' ')}...
            </button>
          ))}
        </div>
      </div>

      {/* Scenario card */}
      <div style={{ border: '2px solid #3f51b5', borderRadius: 12, padding: '20px 24px', marginBottom: 20, background: '#e8eaf6' }}>
        <div style={{ fontWeight: 700, fontSize: 17, color: '#1a237e', marginBottom: 10 }}>
          Сценарий {selectedScenario.id}: {selectedScenario.title}
        </div>
        <div style={{ color: '#333', lineHeight: 1.7 }}>
          {selectedScenario.description}
        </div>
      </div>

      {/* Pattern selection */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 10, color: '#555' }}>Какой паттерн коммуникации вы выберете?</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {PATTERNS.map(p => (
            <button
              key={p.id}
              onClick={() => { setUserChoice(p.id); setShowResult(false) }}
              style={{
                padding: '10px 18px',
                border: `2px solid ${userChoice === p.id ? p.color : '#ddd'}`,
                borderRadius: 8,
                background: userChoice === p.id ? p.color + '18' : '#fff',
                color: userChoice === p.id ? p.color : '#555',
                cursor: 'pointer',
                fontWeight: userChoice === p.id ? 700 : 400,
                fontSize: 13,
                transition: 'all 0.15s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Check button */}
      {userChoice && !showResult && (
        <button
          onClick={handleCheck}
          style={{ padding: '10px 28px', background: '#1a237e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14, marginBottom: 20 }}
        >
          Проверить
        </button>
      )}

      {/* Result */}
      {showResult && (
        <div style={{ marginBottom: 20 }}>
          {/* Verdict */}
          <div style={{
            padding: '14px 18px',
            borderRadius: 10,
            background: isCorrect ? '#e8f5e9' : '#fce4ec',
            border: `2px solid ${isCorrect ? '#4caf50' : '#f44336'}`,
            marginBottom: 14,
            fontWeight: 700,
            fontSize: 15,
            color: isCorrect ? '#1b5e20' : '#b71c1c',
          }}>
            {isCorrect ? 'Верно!' : `Неверно. Правильный ответ: ${getPatternLabel(selectedScenario.correct)}`}
          </div>

          {/* Correct explanation */}
          <div style={{ border: '1px solid #4caf50', borderRadius: 10, padding: '14px 18px', marginBottom: 12, background: '#f9fbe7' }}>
            <div style={{ fontWeight: 700, color: '#1b5e20', marginBottom: 8 }}>
              Почему {getPatternLabel(selectedScenario.correct)}?
            </div>
            <div style={{ color: '#2e7d32', lineHeight: 1.7 }}>
              {selectedScenario.correctExplanation}
            </div>
          </div>

          {/* Bad pattern explanation */}
          <div style={{ border: '1px solid #ff9800', borderRadius: 10, padding: '14px 18px', marginBottom: 16, background: '#fff8e1' }}>
            <div style={{ fontWeight: 700, color: '#e65100', marginBottom: 8 }}>
              Почему не стоит использовать {getPatternLabel(selectedScenario.badPattern)}?
            </div>
            <div style={{ color: '#bf360c', lineHeight: 1.7 }}>
              {selectedScenario.badExplanation}
            </div>
          </div>

          {/* Pattern quick reference */}
          <div style={{ background: '#f5f5f5', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: '#333' }}>Шпаргалка по паттернам:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
              {[
                { id: 'custom-events' as PatternId, when: 'Fire-and-forget, минимальная связность, аналитика' },
                { id: 'shared-state' as PatternId, when: 'Данные нужны нескольким компонентам одновременно' },
                { id: 'url-storage' as PatternId, when: 'Глобальные настройки, сохранение между сессиями' },
                { id: 'props-shell' as PatternId, when: 'Auth-данные, конфиг из Shell в MFE при монтировании' },
                { id: 'orchestrator' as PatternId, when: 'Многошаговый флоу, строгая последовательность' },
              ].map(item => (
                <div key={item.id} style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: '#fff',
                  borderLeft: `3px solid ${getPatternColor(item.id)}`,
                }}>
                  <div style={{ fontWeight: 600, color: getPatternColor(item.id), marginBottom: 2 }}>
                    {getPatternLabel(item.id)}
                  </div>
                  <div style={{ color: '#555' }}>{item.when}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            style={{ padding: '9px 22px', background: '#3f51b5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
          >
            Следующий сценарий →
          </button>
        </div>
      )}
    </div>
  )
}
