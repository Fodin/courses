import { useState, useEffect, useLayoutEffect, useRef } from 'react'

// ─── Task 5.1 ────────────────────────────────────────────────────────────────

type TimelineEvent = {
  id: number
  type: 'render' | 'layoutEffect' | 'layoutCleanup' | 'paint' | 'effect' | 'cleanup'
  label: string
  ts: number
  color: string
}

const EVENT_COLORS: Record<TimelineEvent['type'], string> = {
  render: '#3b82f6',
  layoutEffect: '#f59e0b',
  layoutCleanup: '#d97706',
  paint: '#6b7280',
  effect: '#10b981',
  cleanup: '#059669',
}

const EVENT_LABELS: Record<TimelineEvent['type'], string> = {
  render: 'render()',
  layoutEffect: 'useLayoutEffect callback',
  layoutCleanup: 'useLayoutEffect cleanup',
  paint: 'browser paint (rAF)',
  effect: 'useEffect callback',
  cleanup: 'useEffect cleanup',
}

let globalEventId = 0
let seriesStart = 0

export function Task5_1_Solution() {
  const [tick, setTick] = useState(0)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const eventsRef = useRef<TimelineEvent[]>([])

  const addEvent = (type: TimelineEvent['type']) => {
    const ev: TimelineEvent = {
      id: ++globalEventId,
      type,
      label: EVENT_LABELS[type],
      ts: Date.now() - seriesStart,
      color: EVENT_COLORS[type],
    }
    eventsRef.current = [...eventsRef.current, ev]
    setEvents([...eventsRef.current])
  }

  // Log render phase (during render, not in an effect)
  if (tick > 0) {
    // This runs during render — we push via ref to avoid triggering re-render
    const renderEv: TimelineEvent = {
      id: ++globalEventId,
      type: 'render',
      label: EVENT_LABELS.render,
      ts: Date.now() - seriesStart,
      color: EVENT_COLORS.render,
    }
    // Check if already logged for this tick
    const lastEv = eventsRef.current[eventsRef.current.length - 1]
    if (!lastEv || lastEv.type !== 'render' || lastEv.ts !== renderEv.ts) {
      eventsRef.current = [...eventsRef.current, renderEv]
    }
  }

  useLayoutEffect(() => {
    if (tick === 0) return
    addEvent('layoutEffect')

    // Schedule rAF inside layoutEffect — fires after paint
    const rafId = requestAnimationFrame(() => {
      addEvent('paint')
    })

    return () => {
      cancelAnimationFrame(rafId)
      addEvent('layoutCleanup')
    }
  }) // no deps — runs every render

  useEffect(() => {
    if (tick === 0) return
    addEvent('effect')
    return () => {
      addEvent('cleanup')
    }
  }) // no deps — runs every render

  function handleRun() {
    seriesStart = Date.now()
    eventsRef.current = []
    setEvents([])
    globalEventId = 0
    setTick(t => t + 1)
  }

  function handleClear() {
    eventsRef.current = []
    setEvents([])
    setTick(0)
    globalEventId = 0
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Effect Timeline</h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={handleRun}
          style={{
            padding: '10px 24px',
            borderRadius: '6px',
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {tick === 0 ? 'Запустить' : 'Запустить снова'}
        </button>
        <button
          onClick={handleClear}
          style={{
            padding: '10px 24px',
            borderRadius: '6px',
            border: 'none',
            background: '#374151',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Очистить
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        {(Object.keys(EVENT_COLORS) as TimelineEvent['type'][]).map(type => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: EVENT_COLORS[type],
              }}
            />
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{EVENT_LABELS[type]}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: '#4b5563',
            fontSize: '14px',
            border: '1px dashed #374151',
            borderRadius: '8px',
          }}
        >
          Нажми "Запустить" чтобы увидеть временную шкалу
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '32px' }}>
          {/* Vertical line */}
          <div
            style={{
              position: 'absolute',
              left: '14px',
              top: '8px',
              bottom: '8px',
              width: '2px',
              background: '#374151',
            }}
          />

          {events.map((ev, idx) => (
            <div
              key={ev.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                position: 'relative',
              }}
            >
              {/* Circle on timeline */}
              <div
                style={{
                  position: 'absolute',
                  left: '-24px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: ev.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#fff',
                  zIndex: 1,
                }}
              >
                {idx + 1}
              </div>

              {/* Event card */}
              <div
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '6px',
                  background: '#1f2937',
                  border: `1px solid ${ev.color}33`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: ev.color, fontWeight: 600, fontSize: '13px' }}>
                  {ev.label}
                </span>
                <span
                  style={{
                    color: '#4b5563',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                >
                  +{ev.ts}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: '24px',
          padding: '14px 16px',
          borderRadius: '8px',
          background: '#111827',
          fontSize: '13px',
          color: '#6b7280',
          lineHeight: 1.7,
        }}
      >
        <strong style={{ color: '#e5e7eb' }}>Ожидаемый порядок:</strong> render →
        useLayoutEffect callback → browser paint (rAF) → useLayoutEffect cleanup →
        useEffect cleanup → useEffect callback
      </div>
    </div>
  )
}

// ─── Task 5.2 ────────────────────────────────────────────────────────────────

type ScenarioStatus = 'unknown' | 'correct' | 'incorrect'

type Scenario = {
  id: number
  title: string
  description: string
  badCode: string
  goodCode: string
  isCorrect: boolean
  explanation: string
  wrongExplanation: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'Welcome Banner: аналитика при показе',
    description: 'При монтировании компонента отправить analytics.track("banner_shown")',
    badCode: `// Текущая реализация
function WelcomeBanner() {
  useEffect(() => {
    analytics.track('banner_shown')
  }, [])
}`,
    goodCode: `// Та же реализация — это ПРАВИЛЬНО
useEffect(() => {
  analytics.track('banner_shown')
}, [])`,
    isCorrect: true,
    explanation:
      '"Потому что компонент показан" → Effect. Аналитика показа баннера должна срабатывать при mount — это классический use case для useEffect с [].',
    wrongExplanation: '',
  },
  {
    id: 2,
    title: 'Like Button: POST при нажатии',
    description: 'При нажатии кнопки "Лайк" отправить POST /api/likes',
    badCode: `// ❌ Неправильная реализация
function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (liked) {
      fetch(\`/api/likes/\${postId}\`, { method: 'POST' })
    }
  }, [liked, postId])

  return <button onClick={() => setLiked(true)}>Лайк</button>
}`,
    goodCode: `// ✅ Правильная реализация
function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false)

  function handleLike() {
    setLiked(true)
    fetch(\`/api/likes/\${postId}\`, { method: 'POST' })
  }

  return <button onClick={handleLike} disabled={liked}>Лайк</button>
}`,
    isCorrect: false,
    explanation: '',
    wrongExplanation:
      '"Потому что пользователь нажал кнопку" → Event Handler. В StrictMode useEffect запустится дважды — POST-запрос отправится два раза. Плюс если liked сбросится — запрос снова улетит.',
  },
  {
    id: 3,
    title: 'Live Chat: WebSocket подписка',
    description: 'Подключиться к WebSocket при открытии чата, отключиться при закрытии',
    badCode: `// Текущая реализация
function LiveChat({ roomId }) {
  useEffect(() => {
    const ws = new WebSocket(\`wss://chat.example.com/\${roomId}\`)
    ws.onmessage = (e) => addMessage(JSON.parse(e.data))
    return () => ws.close()
  }, [roomId])
}`,
    goodCode: `// Та же реализация — это ПРАВИЛЬНО
useEffect(() => {
  const ws = new WebSocket(\`wss://chat.example.com/\${roomId}\`)
  ws.onmessage = (e) => addMessage(JSON.parse(e.data))
  return () => ws.close() // cleanup при смене roomId или unmount
}, [roomId])`,
    isCorrect: true,
    explanation:
      '"Потому что компонент показан" → Effect. Подписка на внешний источник данных — классический use case для useEffect. Cleanup правильно закрывает соединение.',
    wrongExplanation: '',
  },
  {
    id: 4,
    title: 'Settings Form: сохранение в localStorage',
    description: 'Сохранять настройки темы в localStorage при нажатии кнопки "Сохранить"',
    badCode: `// ❌ Неправильная реализация
function SettingsForm() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="dark">Тёмная</option>
        <option value="light">Светлая</option>
      </select>
      <button>Сохранить</button>
    </div>
  )
}`,
    goodCode: `// ✅ Правильная реализация
function SettingsForm() {
  const [theme, setTheme] = useState('dark')

  function handleSave() {
    localStorage.setItem('theme', theme)
  }

  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="dark">Тёмная</option>
        <option value="light">Светлая</option>
      </select>
      <button onClick={handleSave}>Сохранить</button>
    </div>
  )
}`,
    isCorrect: false,
    explanation: '',
    wrongExplanation:
      '"Потому что пользователь нажал кнопку Сохранить" → Event Handler. Effect сохраняет при каждом изменении select — пользователь ещё не нажал Save. Если передумает — настройки уже сохранены.',
  },
]

export function Task5_2_Solution() {
  const [statuses, setStatuses] = useState<Record<number, ScenarioStatus>>({
    1: 'unknown',
    2: 'unknown',
    3: 'unknown',
    4: 'unknown',
  })
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  function handleCheck(id: number, guess: boolean) {
    const scenario = SCENARIOS.find(s => s.id === id)!
    setStatuses(prev => ({
      ...prev,
      [id]: guess === scenario.isCorrect ? 'correct' : 'incorrect',
    }))
  }

  function handleReveal(id: number) {
    setRevealed(prev => ({ ...prev, [id]: true }))
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: Event Handler vs Effect</h2>

      <div
        style={{
          padding: '14px 16px',
          borderRadius: '8px',
          background: '#1e3a5f',
          border: '1px solid #1d4ed8',
          marginBottom: '24px',
          fontSize: '13px',
          color: '#93c5fd',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: '#dbeafe' }}>Golden Rule:</strong> "Потому что компонент показан" →{' '}
        <code style={{ color: '#60a5fa' }}>useEffect</code>. "Потому что пользователь нажал кнопку" →{' '}
        <code style={{ color: '#60a5fa' }}>Event Handler</code>.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {SCENARIOS.map(scenario => {
          const status = statuses[scenario.id]
          const isRevealed = revealed[scenario.id]

          const borderColor =
            status === 'correct' ? '#16a34a' : status === 'incorrect' ? '#dc2626' : '#374151'
          const bgColor =
            status === 'correct' ? '#0a1f10' : status === 'incorrect' ? '#1a0f0f' : '#1f2937'

          return (
            <div
              key={scenario.id}
              style={{
                borderRadius: '10px',
                border: `2px solid ${borderColor}`,
                background: bgColor,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '14px 16px',
                  background: '#111827',
                  borderBottom: `1px solid ${borderColor}44`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#e5e7eb', marginBottom: '2px' }}>
                    Сценарий {scenario.id}: {scenario.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{scenario.description}</div>
                </div>
                {status !== 'unknown' && (
                  <div
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: status === 'correct' ? '#14532d' : '#7f1d1d',
                      color: status === 'correct' ? '#4ade80' : '#f87171',
                    }}
                  >
                    {status === 'correct' ? 'Верно' : 'Неверно'}
                  </div>
                )}
              </div>

              {/* Code */}
              <pre
                style={{
                  margin: 0,
                  padding: '16px',
                  fontSize: '12px',
                  color: '#e5e7eb',
                  background: '#0f172a',
                  overflowX: 'auto',
                  fontFamily: 'monospace',
                  lineHeight: 1.6,
                  borderBottom: '1px solid #1f2937',
                }}
              >
                {isRevealed && !scenario.isCorrect ? scenario.goodCode : scenario.badCode}
              </pre>

              {/* Controls */}
              <div style={{ padding: '14px 16px' }}>
                {status === 'unknown' ? (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280', marginRight: '4px' }}>
                      Эта реализация правильная?
                    </span>
                    <button
                      onClick={() => handleCheck(scenario.id, true)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#14532d',
                        color: '#4ade80',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      Да
                    </button>
                    <button
                      onClick={() => handleCheck(scenario.id, false)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#7f1d1d',
                        color: '#f87171',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      Нет
                    </button>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#9ca3af',
                        lineHeight: 1.6,
                        marginBottom: scenario.isCorrect ? 0 : '10px',
                      }}
                    >
                      {scenario.isCorrect ? scenario.explanation : scenario.wrongExplanation}
                    </div>
                    {!scenario.isCorrect && !isRevealed && (
                      <button
                        onClick={() => handleReveal(scenario.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: '1px solid #374151',
                          background: 'transparent',
                          color: '#60a5fa',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Показать правильный код
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Task 5.3 ────────────────────────────────────────────────────────────────

type Card = { id: number; isGold: boolean }

// ---- Variant with Effect Chain ----
function CardGameWithEffects() {
  const [card, setCard] = useState<Card | null>(null)
  const [goldCardCount, setGoldCardCount] = useState(0)
  const [round, setRound] = useState(1)
  const [isGameOver, setIsGameOver] = useState(false)
  const renderCount = useRef(0)
  renderCount.current++

  useEffect(() => {
    if (card !== null && card.isGold) {
      setGoldCardCount(c => c + 1)
    }
  }, [card])

  useEffect(() => {
    if (goldCardCount > 0 && goldCardCount % 3 === 0) {
      setRound(r => r + 1)
      setGoldCardCount(0)
    }
  }, [goldCardCount])

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true)
    }
  }, [round])

  function handleDraw() {
    const isGold = Math.random() < 0.4
    setCard({ id: Date.now(), isGold })
  }

  function handleReset() {
    setCard(null)
    setGoldCardCount(0)
    setRound(1)
    setIsGameOver(false)
    renderCount.current = 0
  }

  return (
    <GameUI
      title="Effect Chain"
      titleColor="#ef4444"
      subtitle="3 useEffect в цепочке"
      card={card}
      goldCardCount={goldCardCount}
      round={round}
      isGameOver={isGameOver}
      renderCount={renderCount.current}
      isCorrect={false}
      onDraw={handleDraw}
      onReset={handleReset}
    />
  )
}

// ---- Variant with single Event Handler ----
function CardGameWithHandler() {
  const [card, setCard] = useState<Card | null>(null)
  const [goldCardCount, setGoldCardCount] = useState(0)
  const [round, setRound] = useState(1)
  const [isGameOver, setIsGameOver] = useState(false)
  const renderCount = useRef(0)
  renderCount.current++

  function handleDraw() {
    const isGold = Math.random() < 0.4
    const newCard: Card = { id: Date.now(), isGold }
    setCard(newCard)

    let newGold = goldCardCount
    if (isGold) newGold = goldCardCount + 1

    let newRound = round
    if (newGold > 0 && newGold % 3 === 0) {
      newRound = round + 1
      newGold = 0
    }

    const newGameOver = newRound > 5

    setGoldCardCount(newGold)
    setRound(newRound)
    setIsGameOver(newGameOver)
  }

  function handleReset() {
    setCard(null)
    setGoldCardCount(0)
    setRound(1)
    setIsGameOver(false)
    renderCount.current = 0
  }

  return (
    <GameUI
      title="Event Handler"
      titleColor="#10b981"
      subtitle="Один обработчик"
      card={card}
      goldCardCount={goldCardCount}
      round={round}
      isGameOver={isGameOver}
      renderCount={renderCount.current}
      isCorrect={true}
      onDraw={handleDraw}
      onReset={handleReset}
    />
  )
}

type GameUIProps = {
  title: string
  titleColor: string
  subtitle: string
  card: Card | null
  goldCardCount: number
  round: number
  isGameOver: boolean
  renderCount: number
  isCorrect: boolean
  onDraw: () => void
  onReset: () => void
}

function GameUI({
  title,
  titleColor,
  subtitle,
  card,
  goldCardCount,
  round,
  isGameOver,
  renderCount,
  isCorrect,
  onDraw,
  onReset,
}: GameUIProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: '260px',
        padding: '20px',
        borderRadius: '10px',
        background: '#1f2937',
        border: `2px solid ${titleColor}44`,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div>
        <div style={{ fontWeight: 700, color: titleColor, fontSize: '15px' }}>{title}</div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>{subtitle}</div>
      </div>

      {/* Render counter */}
      <div
        style={{
          padding: '12px',
          borderRadius: '8px',
          background: isCorrect ? '#0a1f10' : '#1a0f0f',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Рендеров</div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: isCorrect ? '#4ade80' : '#f87171',
            lineHeight: 1,
          }}
        >
          {renderCount}
        </div>
        <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px' }}>
          {isCorrect ? '+1 за клик' : '+2-4 за клик'}
        </div>
      </div>

      {/* Card display */}
      <div
        style={{
          height: '80px',
          borderRadius: '8px',
          background: card === null ? '#111827' : card.isGold ? '#92400e' : '#1f2937',
          border: `2px solid ${card === null ? '#374151' : card.isGold ? '#f59e0b' : '#4b5563'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'all 0.2s',
        }}
      >
        {card === null ? (
          <span style={{ color: '#4b5563', fontSize: '13px' }}>Нет карты</span>
        ) : card.isGold ? (
          '⭐ Золотая'
        ) : (
          '▢ Обычная'
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            background: '#111827',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '11px', color: '#6b7280' }}>Раунд</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#e5e7eb' }}>
            {Math.min(round, 5)}/5
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            background: '#111827',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '11px', color: '#6b7280' }}>Золотых</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>
            {goldCardCount}/3
          </div>
        </div>
      </div>

      {isGameOver && (
        <div
          style={{
            padding: '12px',
            borderRadius: '8px',
            background: '#1e3a5f',
            textAlign: 'center',
            color: '#60a5fa',
            fontWeight: 700,
          }}
        >
          Игра окончена!
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onDraw}
          disabled={isGameOver}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            background: isGameOver ? '#374151' : titleColor,
            color: '#fff',
            cursor: isGameOver ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            opacity: isGameOver ? 0.5 : 1,
          }}
        >
          Вытянуть карту
        </button>
        <button
          onClick={onReset}
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            border: 'none',
            background: '#374151',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Сброс
        </button>
      </div>
    </div>
  )
}

export function Task5_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Effect Chains Refactor</h2>

      <div
        style={{
          padding: '12px 16px',
          borderRadius: '8px',
          background: '#1e3a5f',
          border: '1px solid #1d4ed8',
          marginBottom: '20px',
          fontSize: '13px',
          color: '#93c5fd',
        }}
      >
        Сравни счётчик рендеров: при выпадении золотой карты Effect-версия даёт +2-4 рендера,
        Handler-версия всегда +1.
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <CardGameWithEffects />
        <CardGameWithHandler />
      </div>
    </div>
  )
}

// ─── Task 5.4 ────────────────────────────────────────────────────────────────

const MOCK_FRUITS = [
  'Apple',
  'Apricot',
  'Avocado',
  'Banana',
  'Blueberry',
  'Blackberry',
  'Cherry',
  'Coconut',
  'Cranberry',
  'Dragon fruit',
  'Elderberry',
  'Fig',
  'Grape',
  'Guava',
  'Kiwi',
  'Lemon',
  'Lime',
  'Lychee',
  'Mango',
  'Melon',
  'Orange',
  'Papaya',
  'Peach',
  'Pear',
  'Pineapple',
  'Plum',
  'Pomegranate',
  'Raspberry',
  'Strawberry',
  'Tangerine',
  'Watermelon',
]

type FetchLog = {
  id: number
  query: string
  status: 'pending' | 'done' | 'ignored' | 'aborted'
  delay: number
  ts: number
}

let reqId = 0

// Simulated fetch with random delay
async function fakeFetch(
  query: string,
  options?: { signal?: AbortSignal }
): Promise<string[]> {
  const delay = Math.random() * 1400 + 300
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, delay)
    if (options?.signal) {
      options.signal.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    }
  })
  if (options?.signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError')
  }
  return MOCK_FRUITS.filter(f => f.toLowerCase().includes(query.toLowerCase()))
}

// ---- Bug variant ----
function RaceBugSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [log, setLog] = useState<FetchLog[]>([])
  const [lastResultQuery, setLastResultQuery] = useState('')

  useEffect(() => {
    if (!query) {
      setResults([])
      setLoading(false)
      return
    }

    const id = ++reqId
    const startTs = Date.now()
    setLoading(true)

    fakeFetch(query).then(data => {
      const delay = Date.now() - startTs
      setLog(prev => [
        ...prev,
        { id, query, status: 'done', delay, ts: Date.now() },
      ])
      setResults(data)
      setLastResultQuery(query)
      setLoading(false)
    })
  }, [query])

  const hasMismatch = lastResultQuery !== '' && lastResultQuery !== query && results.length > 0

  return (
    <SearchColumn
      title="Баг: Race Condition"
      titleColor="#ef4444"
      query={query}
      results={results}
      loading={loading}
      log={log}
      hasMismatch={hasMismatch}
      lastResultQuery={lastResultQuery}
      onQueryChange={setQuery}
      onClearLog={() => setLog([])}
    />
  )
}

// ---- ignore flag variant ----
function IgnoreFlagSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [log, setLog] = useState<FetchLog[]>([])

  useEffect(() => {
    if (!query) {
      setResults([])
      setLoading(false)
      return
    }

    let ignore = false
    const id = ++reqId
    const startTs = Date.now()
    setLoading(true)

    fakeFetch(query).then(data => {
      const delay = Date.now() - startTs
      if (ignore) {
        setLog(prev => [
          ...prev,
          { id, query, status: 'ignored', delay, ts: Date.now() },
        ])
        return
      }
      setLog(prev => [
        ...prev,
        { id, query, status: 'done', delay, ts: Date.now() },
      ])
      setResults(data)
      setLoading(false)
    })

    return () => {
      ignore = true
    }
  }, [query])

  return (
    <SearchColumn
      title="Фикс: ignore flag"
      titleColor="#10b981"
      query={query}
      results={results}
      loading={loading}
      log={log}
      hasMismatch={false}
      lastResultQuery={query}
      onQueryChange={setQuery}
      onClearLog={() => setLog([])}
    />
  )
}

// ---- AbortController variant ----
function AbortSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [log, setLog] = useState<FetchLog[]>([])

  useEffect(() => {
    if (!query) {
      setResults([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const id = ++reqId
    const startTs = Date.now()
    setLoading(true)

    fakeFetch(query, { signal: controller.signal })
      .then(data => {
        const delay = Date.now() - startTs
        setLog(prev => [
          ...prev,
          { id, query, status: 'done', delay, ts: Date.now() },
        ])
        setResults(data)
        setLoading(false)
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          const delay = Date.now() - startTs
          setLog(prev => [
            ...prev,
            { id, query, status: 'aborted', delay, ts: Date.now() },
          ])
        }
      })

    return () => controller.abort()
  }, [query])

  return (
    <SearchColumn
      title="Фикс: AbortController"
      titleColor="#3b82f6"
      query={query}
      results={results}
      loading={loading}
      log={log}
      hasMismatch={false}
      lastResultQuery={query}
      onQueryChange={setQuery}
      onClearLog={() => setLog([])}
    />
  )
}

type SearchColumnProps = {
  title: string
  titleColor: string
  query: string
  results: string[]
  loading: boolean
  log: FetchLog[]
  hasMismatch: boolean
  lastResultQuery: string
  onQueryChange: (q: string) => void
  onClearLog: () => void
}

const STATUS_COLORS: Record<FetchLog['status'], string> = {
  pending: '#6b7280',
  done: '#10b981',
  ignored: '#f59e0b',
  aborted: '#ef4444',
}

const STATUS_LABELS: Record<FetchLog['status'], string> = {
  pending: 'в полёте',
  done: 'готово',
  ignored: 'проигнорирован',
  aborted: 'отменён',
}

function SearchColumn({
  title,
  titleColor,
  query,
  results,
  loading,
  log,
  hasMismatch,
  lastResultQuery,
  onQueryChange,
  onClearLog,
}: SearchColumnProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: '260px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ fontWeight: 700, color: titleColor, fontSize: '14px' }}>{title}</div>

      <input
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        placeholder="Поиск фрукта..."
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: `1px solid ${titleColor}66`,
          background: '#1f2937',
          color: '#e5e7eb',
          fontSize: '14px',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />

      {hasMismatch && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            background: '#1a0f0f',
            border: '1px solid #ef4444',
            fontSize: '12px',
            color: '#f87171',
          }}
        >
          Race condition! Показываются результаты для "{lastResultQuery}", а в поле "{query}"
        </div>
      )}

      {/* Results */}
      <div
        style={{
          minHeight: '120px',
          padding: '10px',
          borderRadius: '6px',
          background: '#111827',
          border: '1px solid #1f2937',
        }}
      >
        {loading ? (
          <div style={{ color: '#4b5563', fontSize: '13px' }}>Загрузка...</div>
        ) : results.length === 0 ? (
          <div style={{ color: '#374151', fontSize: '13px' }}>
            {query ? 'Ничего не найдено' : 'Введите запрос'}
          </div>
        ) : (
          results.slice(0, 8).map(r => (
            <div key={r} style={{ fontSize: '13px', color: '#e5e7eb', padding: '2px 0' }}>
              {r}
            </div>
          ))
        )}
      </div>

      {/* Log */}
      <div
        style={{
          borderRadius: '6px',
          background: '#0f172a',
          border: '1px solid #1f2937',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '6px 10px',
            background: '#1f2937',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '11px', color: '#6b7280' }}>Лог запросов</span>
          <button
            onClick={onClearLog}
            style={{
              fontSize: '10px',
              color: '#4b5563',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            очистить
          </button>
        </div>
        <div style={{ maxHeight: '140px', overflowY: 'auto', padding: '6px 10px' }}>
          {log.length === 0 ? (
            <div style={{ fontSize: '11px', color: '#374151' }}>пусто</div>
          ) : (
            log
              .slice()
              .reverse()
              .map(entry => (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                    marginBottom: '4px',
                    fontSize: '11px',
                  }}
                >
                  <span
                    style={{
                      color: STATUS_COLORS[entry.status],
                      minWidth: '70px',
                    }}
                  >
                    {STATUS_LABELS[entry.status]}
                  </span>
                  <span style={{ color: '#6b7280' }}>"{entry.query}"</span>
                  <span style={{ color: '#374151', marginLeft: 'auto' }}>
                    {Math.round(entry.delay)}ms
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}

export function Task5_4_Solution() {
  return (
    <div className="exercise-container">
      <h2>Задание 5.4: Race Condition Fix</h2>

      <div
        style={{
          padding: '12px 16px',
          borderRadius: '8px',
          background: '#1e3a5f',
          border: '1px solid #1d4ed8',
          marginBottom: '20px',
          fontSize: '13px',
          color: '#93c5fd',
          lineHeight: 1.5,
        }}
      >
        Набери быстро несколько букв в поле "Баг" — может появиться красная плашка race condition.
        В колонках с фиксами результаты всегда соответствуют текущему запросу.
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <RaceBugSearch />
        <IgnoreFlagSearch />
        <AbortSearch />
      </div>
    </div>
  )
}
