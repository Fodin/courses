import React, { useState, useRef, useEffect } from 'react'
import { flushSync } from 'react-dom'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTimeMs = (ts: number): string => {
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  const ms = String(d.getMilliseconds()).padStart(3, '0')
  return `${hh}:${mm}:${ss}.${ms}`
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const card = (color: string): React.CSSProperties => ({
  padding: 16,
  borderRadius: 10,
  border: `2px solid ${color}`,
  background: '#fff',
  flex: 1,
})

const badge = (bg: string, text: string): React.CSSProperties => ({
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: 12,
  background: bg,
  color: text,
  fontSize: 12,
  fontWeight: 700,
})

const btn = (bg: string, color = '#fff'): React.CSSProperties => ({
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  background: bg,
  color,
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 14,
})

// ─── Task 9.1: Batching Explorer ─────────────────────────────────────────────

interface RenderLog {
  timestamp: number
  trigger: string
}

export function Task9_1_Solution() {
  const [counterA, setCounterA] = useState(0)
  const [counterB, setCounterB] = useState(0)
  const [counterC, setCounterC] = useState(0)

  const renderCount = useRef(0)
  const renderLog = useRef<RenderLog[]>([])
  const lastTrigger = useRef('—')

  renderCount.current += 1
  renderLog.current = [
    ...renderLog.current.slice(-9),
    { timestamp: Date.now(), trigger: lastTrigger.current },
  ]

  const applyThreeUpdates = () => {
    setCounterA(v => v + 1)
    setCounterB(v => v + 1)
    setCounterC(v => v + 1)
  }

  const handleEventHandler = () => {
    lastTrigger.current = 'Event Handler'
    applyThreeUpdates()
  }

  const handleSetTimeout = () => {
    setTimeout(() => {
      lastTrigger.current = 'setTimeout'
      applyThreeUpdates()
    }, 0)
  }

  const handlePromise = () => {
    Promise.resolve().then(() => {
      lastTrigger.current = 'Promise.then'
      applyThreeUpdates()
    })
  }

  const handleReset = () => {
    lastTrigger.current = 'Reset'
    setCounterA(0)
    setCounterB(0)
    setCounterC(0)
    renderCount.current = 0
    renderLog.current = []
  }

  const counters = [
    { label: 'Counter A', value: counterA, color: '#3b82f6' },
    { label: 'Counter B', value: counterB, color: '#10b981' },
    { label: 'Counter C', value: counterC, color: '#f59e0b' },
  ]

  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: 4 }}>Задание 9.1: Batching Explorer</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
        Три кнопки — три контекста. В React 18 все дают ровно 1 рендер на клик.
      </p>

      {/* Render counter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: '#f0fdf4',
        borderRadius: 10,
        border: '2px solid #86efac',
        marginBottom: 20,
      }}>
        <span style={{ fontSize: 14, color: '#166534', fontWeight: 600 }}>Всего рендеров:</span>
        <span style={{ fontSize: 32, fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>
          {renderCount.current}
        </span>
        <span style={{ fontSize: 13, color: '#6b7280', marginLeft: 'auto' }}>
          Триггер: <strong>{lastTrigger.current}</strong>
        </span>
      </div>

      {/* Counters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {counters.map(({ label, value, color }) => (
          <div key={label} style={{
            flex: 1,
            padding: 14,
            borderRadius: 10,
            border: `2px solid ${color}`,
            background: '#fff',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 12, color, fontWeight: 700, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <button style={btn('#3b82f6')} onClick={handleEventHandler}>
          Event Handler
        </button>
        <button style={btn('#8b5cf6')} onClick={handleSetTimeout}>
          setTimeout
        </button>
        <button style={btn('#ec4899')} onClick={handlePromise}>
          Promise.then
        </button>
        <button style={btn('#e5e7eb', '#374151')} onClick={handleReset}>
          Сбросить
        </button>
      </div>

      {/* Render log */}
      <div style={{ background: '#1e1e2e', borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>
          История рендеров (последние 10):
        </div>
        {renderLog.current.length === 0 ? (
          <div style={{ color: '#475569', fontSize: 13 }}>— нажмите кнопку —</div>
        ) : (
          [...renderLog.current].reverse().map((entry, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '3px 0',
              borderBottom: '1px solid #2d2d3d',
              fontSize: 13,
            }}>
              <span style={{ color: '#7dd3fc', fontFamily: 'monospace' }}>
                {formatTimeMs(entry.timestamp)}
              </span>
              <span style={{ color: '#a78bfa' }}>{entry.trigger}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Task 9.2: flushSync Demo ─────────────────────────────────────────────────

interface Message {
  id: number
  text: string
  author: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, text: 'Привет! Как дела?', author: 'Алиса' },
  { id: 2, text: 'Всё отлично, спасибо!', author: 'Боб' },
  { id: 3, text: 'Чем занимаешься?', author: 'Алиса' },
  { id: 4, text: 'Изучаю React батчинг', author: 'Боб' },
  { id: 5, text: 'О, это интересно! Расскажи подробнее', author: 'Алиса' },
  { id: 6, text: 'Сейчас как раз делаю задание про flushSync', author: 'Боб' },
]

function ChatPane({
  title,
  withFlushSync,
  color,
}: {
  title: string
  withFlushSync: boolean
  color: string
}) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const renderCount = useRef(0)
  const nextId = useRef(INITIAL_MESSAGES.length + 1)

  renderCount.current += 1

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg: Message = { id: nextId.current++, text: input.trim(), author: 'Вы' }

    if (withFlushSync) {
      flushSync(() => {
        setMessages(prev => [...prev, newMsg])
      })
      // DOM уже обновлён — scrollHeight корректный
      scrollToBottom()
    } else {
      setMessages(prev => [...prev, newMsg])
      // DOM ещё не обновлён — новое сообщение не в DOM
      scrollToBottom()
    }

    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div style={card(color)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{title}</span>
        <span style={badge(color + '22', color)}>рендеров: {renderCount.current}</span>
      </div>

      <div style={{
        fontSize: 12,
        padding: '6px 10px',
        borderRadius: 6,
        background: withFlushSync ? '#f0fdf4' : '#fff7ed',
        color: withFlushSync ? '#166534' : '#92400e',
        marginBottom: 10,
        fontFamily: 'monospace',
      }}>
        {withFlushSync
          ? 'flushSync(() => { setMessages(...) })\nscrollToBottom() // DOM уже обновлён ✅'
          : 'setMessages(...)\nscrollToBottom() // DOM ещё старый ⚠️'}
      </div>

      {/* Message list */}
      <div
        ref={listRef}
        style={{
          height: 220,
          overflowY: 'auto',
          padding: '8px 4px',
          marginBottom: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.author === 'Вы' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '6px 10px',
              borderRadius: 10,
              background: msg.author === 'Вы' ? color : '#f1f5f9',
              color: msg.author === 'Вы' ? '#fff' : '#1e293b',
              fontSize: 13,
            }}
          >
            <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>{msg.author}</div>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Введите сообщение..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button style={btn(color)} onClick={sendMessage}>
          Отправить
        </button>
      </div>
    </div>
  )
}

export function Task9_2_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: 4 }}>Задание 9.2: flushSync Demo</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
        Автоскролл чата: без <code>flushSync</code> DOM ещё не обновлён в момент скролла.
        Добавляйте длинные сообщения — разница станет заметной.
      </p>

      <div style={{ display: 'flex', gap: 16 }}>
        <ChatPane title="Без flushSync" withFlushSync={false} color="#f59e0b" />
        <ChatPane title="С flushSync" withFlushSync={true} color="#10b981" />
      </div>

      <div style={{
        marginTop: 16,
        padding: '10px 14px',
        background: '#eff6ff',
        borderRadius: 8,
        border: '1px solid #bfdbfe',
        fontSize: 13,
        color: '#1e40af',
      }}>
        <strong>Совет:</strong> отправьте несколько длинных сообщений подряд. В левом чате прокрутка
        иногда не достигает конца — это видно по полосе прокрутки. В правом всегда точно.
      </div>
    </div>
  )
}

// ─── Task 9.3: Batching vs Cascade ───────────────────────────────────────────

interface PanelState {
  step: number
  progress: number
  status: 'idle' | 'running' | 'done'
}

interface TimedLog {
  ts: number
  renderNum: number
}

function BatchingPanel() {
  const [state, setState] = useState<PanelState>({ step: 0, progress: 0, status: 'idle' })
  const renderCount = useRef(0)
  const renderLog = useRef<TimedLog[]>([])
  const elapsed = useRef<string>('—')

  renderCount.current += 1
  renderLog.current = [...renderLog.current.slice(-9), { ts: Date.now(), renderNum: renderCount.current }]

  const handleStart = () => {
    const t0 = performance.now()
    // Все три setState батчатся в 1 рендер
    setState({ step: 1, progress: 100, status: 'done' })
    elapsed.current = (performance.now() - t0).toFixed(3) + ' мс'
  }

  const handleReset = () => {
    setState({ step: 0, progress: 0, status: 'idle' })
    renderCount.current = 0
    renderLog.current = []
    elapsed.current = '—'
  }

  return (
    <div style={card('#3b82f6')}>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#1e40af', marginBottom: 6 }}>
        Batching
      </div>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, fontFamily: 'monospace', background: '#f8fafc', padding: 8, borderRadius: 6 }}>
        {'setState({ step: 1 })\nsetState({ progress: 100 })\nsetState({ status: \'done\' })\n// → 1 рендер'}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Рендеров</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#3b82f6' }}>{renderCount.current}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Шаг</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#3b82f6' }}>{state.step}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Время</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', paddingTop: 6 }}>{elapsed.current}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 10, background: '#dbeafe', borderRadius: 5, marginBottom: 6, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${state.progress}%`,
          background: '#3b82f6',
          borderRadius: 5,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        Статус: <strong>{state.status}</strong> | Прогресс: {state.progress}%
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button style={btn('#3b82f6')} onClick={handleStart}>Запустить</button>
        <button style={btn('#e5e7eb', '#374151')} onClick={handleReset}>Сбросить</button>
      </div>

      {/* Log */}
      <div style={{ background: '#1e1e2e', borderRadius: 8, padding: 10 }}>
        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Лог рендеров:</div>
        {renderLog.current.slice().reverse().map((entry, i) => (
          <div key={i} style={{ fontSize: 12, color: '#7dd3fc', fontFamily: 'monospace', padding: '2px 0' }}>
            #{entry.renderNum} &mdash; {formatTimeMs(entry.ts)}
          </div>
        ))}
      </div>
    </div>
  )
}

function CascadePanel() {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const renderCount = useRef(0)
  const renderLog = useRef<TimedLog[]>([])
  const elapsed = useRef<string>('—')
  const startTime = useRef<number>(0)

  renderCount.current += 1
  renderLog.current = [...renderLog.current.slice(-9), { ts: Date.now(), renderNum: renderCount.current }]

  // Cascade: каждый useEffect триггерит следующий setState
  useEffect(() => {
    if (step === 1) {
      setProgress(100)
    }
  }, [step])

  useEffect(() => {
    if (progress === 100 && step === 1) {
      setStatus('done')
      elapsed.current = (performance.now() - startTime.current).toFixed(3) + ' мс'
    }
  }, [progress, step])

  const handleStart = () => {
    startTime.current = performance.now()
    setStep(1) // Запускает цепочку: step→progress→status = 3+ рендера
  }

  const handleReset = () => {
    setStep(0)
    setProgress(0)
    setStatus('idle')
    renderCount.current = 0
    renderLog.current = []
    elapsed.current = '—'
  }

  return (
    <div style={card('#ef4444')}>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#b91c1c', marginBottom: 6 }}>
        Cascade (useEffect-цепочка)
      </div>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, fontFamily: 'monospace', background: '#f8fafc', padding: 8, borderRadius: 6 }}>
        {'setStep(1)                    // рендер 1\nuseEffect[step] → setProgress  // рендер 2\nuseEffect[progress] → setStatus // рендер 3'}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Рендеров</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#ef4444' }}>{renderCount.current}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Шаг</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#ef4444' }}>{step}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Время</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', paddingTop: 6 }}>{elapsed.current}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 10, background: '#fee2e2', borderRadius: 5, marginBottom: 6, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: '#ef4444',
          borderRadius: 5,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
        Статус: <strong>{status}</strong> | Прогресс: {progress}%
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button style={btn('#ef4444')} onClick={handleStart}>Запустить</button>
        <button style={btn('#e5e7eb', '#374151')} onClick={handleReset}>Сбросить</button>
      </div>

      {/* Log */}
      <div style={{ background: '#1e1e2e', borderRadius: 8, padding: 10 }}>
        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Лог рендеров:</div>
        {renderLog.current.slice().reverse().map((entry, i) => (
          <div key={i} style={{ fontSize: 12, color: '#fca5a5', fontFamily: 'monospace', padding: '2px 0' }}>
            #{entry.renderNum} &mdash; {formatTimeMs(entry.ts)}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Task9_3_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: 4 }}>Задание 9.3: Batching vs Cascade</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
        Нажмите "Запустить" в обеих панелях и сравните счётчики рендеров.
        Батчинг = 1 рендер, каскад useEffect = 3+ рендеров для той же задачи.
      </p>

      <div style={{ display: 'flex', gap: 16 }}>
        <BatchingPanel />
        <CascadePanel />
      </div>

      <div style={{
        marginTop: 16,
        padding: '10px 14px',
        background: '#fefce8',
        borderRadius: 8,
        border: '1px solid #fde68a',
        fontSize: 13,
        color: '#78350f',
      }}>
        <strong>Когда useEffect-каскад оправдан?</strong> Только когда следующее обновление
        зависит от <em>внешнего эффекта</em> (API-запрос, анимация, измерение DOM) — то есть
        когда его нельзя вычислить синхронно в том же обработчике.
      </div>
    </div>
  )
}
