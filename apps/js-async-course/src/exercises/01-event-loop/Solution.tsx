import { useState, useCallback, useRef, useEffect } from 'react'

// ============================================
// Task 1.1 Solution: Event Loop Simulator
// ============================================

// Пример кода который симулируем:
// console.log('1')
// setTimeout(() => console.log('2'), 0)
// Promise.resolve().then(() => console.log('3'))
// console.log('4')

type AreaId = 'callStack' | 'webApis' | 'macroQueue' | 'microQueue' | 'done'

interface EventLoopItem {
  id: string
  label: string
  color: string
  area: AreaId
}

interface EventLoopStep {
  description: string
  highlight: string // which code line to highlight
  items: EventLoopItem[]
  output: string[]
}

const EL_CODE_LINES = [
  "console.log('1')",
  "setTimeout(() => console.log('2'), 0)",
  "Promise.resolve().then(() => console.log('3'))",
  "console.log('4')",
]

const EL_STEPS: EventLoopStep[] = [
  {
    description: 'Начало. Call Stack пустой. Все очереди пусты.',
    highlight: '',
    items: [],
    output: [],
  },
  {
    description: "Шаг 1: console.log('1') попадает в Call Stack и немедленно выполняется — синхронный код.",
    highlight: EL_CODE_LINES[0],
    items: [{ id: 'log1', label: "log('1')", color: '#3b82f6', area: 'callStack' }],
    output: ['1'],
  },
  {
    description: "Шаг 2: setTimeout(..., 0) регистрируется в Web APIs. Callback помещается в Macrotask Queue после 0ms.",
    highlight: EL_CODE_LINES[1],
    items: [
      { id: 'settimeout', label: 'setTimeout', color: '#f59e0b', area: 'callStack' },
      { id: 'cb2', label: "cb: log('2')", color: '#f59e0b', area: 'macroQueue' },
    ],
    output: ['1'],
  },
  {
    description: "Шаг 3: Promise.resolve().then() регистрирует callback в Microtask Queue — это случается синхронно при создании resolved Promise.",
    highlight: EL_CODE_LINES[2],
    items: [
      { id: 'promise', label: 'Promise.then', color: '#8b5cf6', area: 'callStack' },
      { id: 'cb2q', label: "cb: log('2')", color: '#f59e0b', area: 'macroQueue' },
      { id: 'cb3', label: "cb: log('3')", color: '#8b5cf6', area: 'microQueue' },
    ],
    output: ['1'],
  },
  {
    description: "Шаг 4: console.log('4') выполняется — Call Stack ещё занят синхронным кодом.",
    highlight: EL_CODE_LINES[3],
    items: [
      { id: 'log4', label: "log('4')", color: '#3b82f6', area: 'callStack' },
      { id: 'cb2q2', label: "cb: log('2')", color: '#f59e0b', area: 'macroQueue' },
      { id: 'cb3q', label: "cb: log('3')", color: '#8b5cf6', area: 'microQueue' },
    ],
    output: ['1', '4'],
  },
  {
    description: "Шаг 5: Call Stack пуст! Event Loop сначала проверяет Microtask Queue. Находит log('3') и выполняет его.",
    highlight: '',
    items: [
      { id: 'cb3exec', label: "log('3')", color: '#8b5cf6', area: 'callStack' },
      { id: 'cb2q3', label: "cb: log('2')", color: '#f59e0b', area: 'macroQueue' },
    ],
    output: ['1', '4', '3'],
  },
  {
    description: "Шаг 6: Microtask Queue пуст. Теперь Event Loop берёт одну задачу из Macrotask Queue — log('2').",
    highlight: '',
    items: [
      { id: 'cb2exec', label: "log('2')", color: '#f59e0b', area: 'callStack' },
    ],
    output: ['1', '4', '3', '2'],
  },
  {
    description: "Готово! Итог: 1 → 4 → 3 → 2. Микротаски (Promise) выполняются раньше макротасок (setTimeout), даже если setTimeout(fn, 0).",
    highlight: '',
    items: [],
    output: ['1', '4', '3', '2'],
  },
]

const containerStyle: React.CSSProperties = {
  background: '#0f172a',
  color: '#e2e8f0',
  padding: '1.5rem',
  borderRadius: '12px',
  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
  fontSize: '0.9rem',
}

const areaStyle = (color: string): React.CSSProperties => ({
  background: '#1e293b',
  border: `1px solid ${color}40`,
  borderRadius: '8px',
  padding: '0.75rem',
  minHeight: '80px',
  flex: 1,
})

const chipStyle = (color: string): React.CSSProperties => ({
  background: color,
  borderRadius: '6px',
  padding: '0.3rem 0.6rem',
  fontSize: '0.75rem',
  color: '#fff',
  fontWeight: 'bold',
  marginBottom: '0.3rem',
  boxShadow: `0 0 8px ${color}60`,
  display: 'inline-block',
})

const btnStyle = (disabled: boolean, color = '#3b82f6'): React.CSSProperties => ({
  padding: '0.5rem 1.2rem',
  borderRadius: '6px',
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  background: disabled ? '#1e293b' : color,
  color: disabled ? '#475569' : '#fff',
  fontFamily: 'inherit',
  fontSize: '0.85rem',
})

const areaLabel = (text: string, color: string) => (
  <div style={{ fontSize: '0.7rem', color, fontWeight: 'bold', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
    {text}
  </div>
)

function renderItems(items: EventLoopItem[], area: AreaId) {
  const filtered = items.filter((it) => it.area === area)
  if (filtered.length === 0) {
    return <div style={{ color: '#334155', fontSize: '0.75rem' }}>(пусто)</div>
  }
  return filtered.map((it) => (
    <div key={it.id} style={chipStyle(it.color)}>{it.label}</div>
  ))
}

export function Task1_1_Solution() {
  const [stepIndex, setStepIndex] = useState(0)

  const step = EL_STEPS[stepIndex]
  const isLast = stepIndex === EL_STEPS.length - 1
  const isFirst = stepIndex === 0

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 1.1 — Симулятор Event Loop
      </h2>

      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1.25rem' }}>
        {/* Code panel */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.5rem' }}>КОД</div>
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
            {EL_CODE_LINES.map((line, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  background: step.highlight === line ? 'rgba(59,130,246,0.15)' : 'transparent',
                  borderLeft: step.highlight === line ? '3px solid #3b82f6' : '3px solid transparent',
                  paddingLeft: '0.5rem',
                  borderRadius: '2px',
                  transition: 'background 0.25s',
                  lineHeight: 1.8,
                }}
              >
                <span style={{ color: '#475569', minWidth: '1.5rem', textAlign: 'right', userSelect: 'none' }}>
                  {i + 1}
                </span>
                <span style={{ color: '#cbd5e1' }}>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Areas grid */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div style={areaStyle('#3b82f6')}>
            {areaLabel('CALL STACK', '#3b82f6')}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {renderItems(step.items, 'callStack')}
            </div>
          </div>
          <div style={areaStyle('#f59e0b')}>
            {areaLabel('WEB APIs', '#f59e0b')}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {renderItems(step.items, 'webApis')}
            </div>
          </div>
          <div style={areaStyle('#8b5cf6')}>
            {areaLabel('MICROTASK QUEUE (Promise.then)', '#8b5cf6')}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {renderItems(step.items, 'microQueue')}
            </div>
          </div>
          <div style={areaStyle('#f59e0b')}>
            {areaLabel('MACROTASK QUEUE (setTimeout)', '#f59e0b')}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {renderItems(step.items, 'macroQueue')}
            </div>
          </div>
        </div>

        {/* Output */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.4rem' }}>ВЫВОД В КОНСОЛЬ</div>
          {step.output.length === 0
            ? <span style={{ color: '#334155' }}>(пусто)</span>
            : step.output.map((v, i) => (
              <span
                key={i}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  padding: '0.2rem 0.5rem',
                  marginRight: '0.4rem',
                  color: '#10b981',
                  fontWeight: 'bold',
                }}
              >
                {v}
              </span>
            ))}
        </div>

        {/* Description */}
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem',
          fontSize: '0.82rem',
          color: '#94a3b8',
          lineHeight: 1.6,
          marginBottom: '1rem',
          borderLeft: '3px solid #3b82f6',
        }}>
          <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Шаг {stepIndex}/{EL_STEPS.length - 1}:</span>{' '}
          {step.description}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={btnStyle(isLast)} onClick={() => setStepIndex((i) => i + 1)} disabled={isLast}>
            Шаг вперёд →
          </button>
          <button style={btnStyle(isFirst, '#374151')} onClick={() => setStepIndex(0)} disabled={isFirst}>
            Сброс
          </button>
          <span style={{ color: '#475569', fontSize: '0.8rem', alignSelf: 'center' }}>
            {stepIndex}/{EL_STEPS.length - 1}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 1.2 Solution: Microtasks vs Macrotasks
// ============================================

type QueueItem = {
  id: string
  label: string
  type: 'micro' | 'macro'
  source: string
}

interface Scenario {
  name: string
  description: string
  initialMicro: QueueItem[]
  initialMacro: QueueItem[]
  code: string
  warning?: string
}

const SCENARIOS: Scenario[] = [
  {
    name: 'Базовый приоритет',
    description: 'Одна микротаска и одна макротаска. Что выполнится первым?',
    code: `setTimeout(() => console.log('macro'), 0)
Promise.resolve().then(() => console.log('micro'))`,
    initialMicro: [{ id: 'm1', label: "Promise.then: log('micro')", type: 'micro', source: 'Promise.resolve()' }],
    initialMacro: [{ id: 'M1', label: "setTimeout: log('macro')", type: 'macro', source: 'setTimeout' }],
  },
  {
    name: 'Все микротаски до одной макротаски',
    description: 'Три микротаски и одна макротаска. Event Loop сначала опустошает ВСЮ очередь микротасок.',
    code: `setTimeout(() => console.log('macro 1'), 0)
Promise.resolve().then(() => console.log('micro 1'))
Promise.resolve().then(() => console.log('micro 2'))
queueMicrotask(() => console.log('micro 3'))`,
    initialMicro: [
      { id: 'm1', label: "Promise: log('micro 1')", type: 'micro', source: 'Promise.resolve()' },
      { id: 'm2', label: "Promise: log('micro 2')", type: 'micro', source: 'Promise.resolve()' },
      { id: 'm3', label: "queueMicrotask: log('micro 3')", type: 'micro', source: 'queueMicrotask' },
    ],
    initialMacro: [{ id: 'M1', label: "setTimeout: log('macro 1')", type: 'macro', source: 'setTimeout' }],
  },
  {
    name: 'Microtask Starvation',
    description: 'Бесконечная цепочка микротасок блокирует макротаски навсегда. Это называется "голодание макротасок".',
    code: `setTimeout(() => console.log('НИКОГДА не выполнится'), 0)

function endless() {
  Promise.resolve().then(endless) // бесконечная рекурсия!
}
endless()`,
    initialMicro: [
      { id: 'm1', label: 'endless() → Promise.then(endless)', type: 'micro', source: 'Promise' },
      { id: 'm2', label: 'endless() → Promise.then(endless)', type: 'micro', source: 'Promise' },
      { id: 'm3', label: 'endless() → Promise.then(endless)', type: 'micro', source: 'Promise' },
      { id: 'm4', label: '...и так бесконечно', type: 'micro', source: 'Promise' },
    ],
    initialMacro: [{ id: 'M1', label: "setTimeout: НИКОГДА", type: 'macro', source: 'setTimeout' }],
    warning: 'Microtask Starvation: макротаска никогда не получит управление!',
  },
]

export function Task1_2_Solution() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [phase, setPhase] = useState<'initial' | 'running' | 'done'>('initial')
  const [microDone, setMicroDone] = useState<string[]>([])
  const [macroDone, setMacroDone] = useState<string[]>([])
  const [log, setLog] = useState<string[]>([])
  const [step, setStep] = useState(0)

  const scenario = SCENARIOS[scenarioIdx]

  const reset = useCallback(() => {
    setPhase('initial')
    setMicroDone([])
    setMacroDone([])
    setLog([])
    setStep(0)
  }, [])

  const handleScenario = (idx: number) => {
    setScenarioIdx(idx)
    setPhase('initial')
    setMicroDone([])
    setMacroDone([])
    setLog([])
    setStep(0)
  }

  const handleStep = () => {
    const microLeft = scenario.initialMicro.filter((m) => !microDone.includes(m.id))
    const macroLeft = scenario.initialMacro.filter((m) => !macroDone.includes(m.id))

    if (scenarioIdx === 2) {
      // starvation scenario — just show warning
      setPhase('running')
      setLog(['micro-1 выполнена', 'micro-2 выполнена', 'micro-3 выполнена', '... (бесконечно)'])
      return
    }

    setPhase('running')

    if (microLeft.length > 0) {
      const next = microLeft[0]
      setMicroDone((d) => [...d, next.id])
      setLog((l) => [...l, `[micro] ${next.label}`])
      setStep((s) => s + 1)
    } else if (macroLeft.length > 0) {
      const next = macroLeft[0]
      setMacroDone((d) => [...d, next.id])
      setLog((l) => [...l, `[macro] ${next.label}`])
      setStep((s) => s + 1)
      if (macroLeft.length === 1) {
        setPhase('done')
      }
    }
  }

  const microLeft = scenario.initialMicro.filter((m) => !microDone.includes(m.id))
  const macroLeft = scenario.initialMacro.filter((m) => !macroDone.includes(m.id))
  const isStarvation = scenarioIdx === 2

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 1.2 — Микротаски vs Макротаски
      </h2>

      {/* Scenario tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0', flexWrap: 'wrap' }}>
        {SCENARIOS.map((sc, i) => (
          <button
            key={i}
            onClick={() => handleScenario(i)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '6px 6px 0 0',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.78rem',
              background: scenarioIdx === i ? '#1e293b' : '#0f172a',
              color: scenarioIdx === i ? '#60a5fa' : '#64748b',
              borderBottom: scenarioIdx === i ? '2px solid #3b82f6' : '2px solid transparent',
            }}
          >
            {sc.name}
          </button>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        {/* Description */}
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem',
          marginBottom: '1rem',
          fontSize: '0.82rem',
          color: '#94a3b8',
          borderLeft: isStarvation ? '3px solid #ef4444' : '3px solid #8b5cf6',
        }}>
          {scenario.description}
          {scenario.warning && (
            <div style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '0.4rem' }}>
              {scenario.warning}
            </div>
          )}
        </div>

        {/* Code */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.4rem' }}>КОД</div>
          <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.7 }}>
            {scenario.code}
          </pre>
        </div>

        {/* Queues */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {/* Microtask Queue */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ color: '#8b5cf6', fontSize: '0.72rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              MICROTASK QUEUE (приоритет ВЫСОКИЙ)
            </div>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', minHeight: '80px' }}>
              {scenario.initialMicro.map((m) => {
                const done = microDone.includes(m.id)
                return (
                  <div
                    key={m.id}
                    style={{
                      background: done ? '#1e293b' : '#4c1d95',
                      borderRadius: '6px',
                      padding: '0.4rem 0.7rem',
                      fontSize: '0.75rem',
                      color: done ? '#475569' : '#c4b5fd',
                      marginBottom: '0.3rem',
                      textDecoration: done ? 'line-through' : 'none',
                      border: `1px solid ${done ? '#1e293b' : '#7c3aed'}`,
                    }}
                  >
                    {done ? '✓' : '▶'} {m.label}
                    <span style={{ color: '#6d28d9', fontSize: '0.65rem', marginLeft: '0.5rem' }}>
                      ({m.source})
                    </span>
                  </div>
                )
              })}
              {isStarvation && phase === 'running' && (
                <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '0.4rem' }}>
                  ... новые микротаски добавляются быстрее чем выполняются
                </div>
              )}
            </div>
          </div>

          {/* Macrotask Queue */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ color: '#f59e0b', fontSize: '0.72rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              MACROTASK QUEUE (приоритет НИЖЕ)
            </div>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', minHeight: '80px' }}>
              {scenario.initialMacro.map((m) => {
                const done = macroDone.includes(m.id)
                const blocked = isStarvation
                return (
                  <div
                    key={m.id}
                    style={{
                      background: blocked ? '#3b1400' : done ? '#1e293b' : '#451a03',
                      borderRadius: '6px',
                      padding: '0.4rem 0.7rem',
                      fontSize: '0.75rem',
                      color: blocked ? '#ef4444' : done ? '#475569' : '#fcd34d',
                      marginBottom: '0.3rem',
                      textDecoration: done ? 'line-through' : 'none',
                      border: `1px solid ${blocked ? '#ef4444' : done ? '#1e293b' : '#92400e'}`,
                    }}
                  >
                    {blocked ? '🚫' : done ? '✓' : '⏳'} {m.label}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Log */}
        {log.length > 0 && (
          <div style={{
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem',
            fontSize: '0.78rem',
            lineHeight: 1.8,
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.4rem' }}>
              ПОРЯДОК ВЫПОЛНЕНИЯ
            </div>
            {log.map((entry, i) => (
              <div
                key={i}
                style={{
                  color: entry.startsWith('[micro]') ? '#a78bfa' : '#fbbf24',
                }}
              >
                {i + 1}. {entry}
              </div>
            ))}
          </div>
        )}

        {phase === 'done' && (
          <div style={{
            background: '#052e16',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem',
            fontSize: '0.82rem',
            color: '#6ee7b7',
          }}>
            Все задачи выполнены. Все {microDone.length} микротаск{microDone.length === 1 ? 'а' : 'и'} выполнились
            до того как началась первая макротаска.
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {!isStarvation ? (
            <button
              style={btnStyle(phase === 'done')}
              onClick={handleStep}
              disabled={phase === 'done'}
            >
              {microLeft.length > 0 ? 'Выполнить микротаску →' : 'Выполнить макротаску →'}
            </button>
          ) : (
            <button style={btnStyle(phase === 'running')} onClick={handleStep} disabled={phase === 'running'}>
              Запустить (покажет starvation)
            </button>
          )}
          <button style={btnStyle(false, '#374151')} onClick={reset}>
            Сброс
          </button>
        </div>

        {/* Rule box */}
        <div style={{
          marginTop: '1rem',
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem',
          fontSize: '0.78rem',
          color: '#94a3b8',
          borderLeft: '3px solid #60a5fa',
          lineHeight: 1.7,
        }}>
          <strong style={{ color: '#60a5fa' }}>Правило Event Loop:</strong> после каждого tick — сначала
          выполняются <span style={{ color: '#a78bfa' }}>ВСЕ</span> микротаски, потом
          <span style={{ color: '#fbbf24' }}> ОДНА</span> макротаска, потом снова все микротаски, и т.д.
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 1.3 Solution: Predict Execution Order
// ============================================

interface Puzzle {
  title: string
  code: string
  correctOrder: string[]
  explanations: Record<string, string>
}

const PUZZLES: Puzzle[] = [
  {
    title: 'Базовый: sync + setTimeout + Promise',
    code: `console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
console.log('D')`,
    correctOrder: ['A', 'D', 'C', 'B'],
    explanations: {
      'A': 'Синхронный код — выполняется первым',
      'D': 'Синхронный код — выполняется до завершения стека',
      'C': 'Promise.then — микротаска, выполняется после синхронного кода',
      'B': 'setTimeout — макротаска, выполняется последней',
    },
  },
  {
    title: 'Средний: вложенные .then + setTimeout',
    code: `console.log('start')
setTimeout(() => {
  console.log('timeout')
}, 0)
Promise.resolve()
  .then(() => {
    console.log('then 1')
    return 'x'
  })
  .then(() => console.log('then 2'))
console.log('end')`,
    correctOrder: ['start', 'end', 'then 1', 'then 2', 'timeout'],
    explanations: {
      'start': 'Первый синхронный вызов',
      'end': 'Последний синхронный вызов',
      'then 1': 'Первый .then — микротаска',
      'then 2': 'Второй .then становится задачей только после выполнения then 1',
      'timeout': 'Макротаска — самая последняя',
    },
  },
  {
    title: 'Сложный: queueMicrotask + Promise + setTimeout',
    code: `console.log('1')
queueMicrotask(() => console.log('2'))
Promise.resolve().then(() => console.log('3'))
setTimeout(() => console.log('4'), 0)
queueMicrotask(() => {
  console.log('5')
  Promise.resolve().then(() => console.log('6'))
})
console.log('7')`,
    correctOrder: ['1', '7', '2', '3', '5', '6', '4'],
    explanations: {
      '1': 'Синхронно',
      '7': 'Синхронно',
      '2': 'queueMicrotask — первая микротаска в очереди',
      '3': 'Promise.then — микротаска',
      '5': "Вторая queueMicrotask (внутри неё добавляется '6')",
      '6': "Promise.then добавленный внутри '5' — выполнится до setTimeout",
      '4': 'Макротаска — последний',
    },
  },
]

export function Task1_3_Solution() {
  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [userOrder, setUserOrder] = useState<string[]>([])
  const [checked, setChecked] = useState(false)

  const puzzle = PUZZLES[puzzleIdx]
  const available = puzzle.correctOrder.filter((o) => !userOrder.includes(o))

  const handleSelect = (val: string) => {
    if (checked) return
    setUserOrder((prev) => [...prev, val])
  }

  const handleUndo = () => {
    if (checked) return
    setUserOrder((prev) => prev.slice(0, -1))
  }

  const handleCheck = () => setChecked(true)

  const handleReset = () => {
    setUserOrder([])
    setChecked(false)
  }

  const handlePuzzle = (idx: number) => {
    setPuzzleIdx(idx)
    setUserOrder([])
    setChecked(false)
  }

  const isCorrect = (idx: number) => userOrder[idx] === puzzle.correctOrder[idx]
  const allCorrect = checked && userOrder.length === puzzle.correctOrder.length &&
    puzzle.correctOrder.every((v, i) => userOrder[i] === v)

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 1.3 — Предскажи порядок вывода
      </h2>

      {/* Puzzle tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 0, flexWrap: 'wrap' }}>
        {PUZZLES.map((p, i) => (
          <button
            key={i}
            onClick={() => handlePuzzle(i)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '6px 6px 0 0',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.75rem',
              background: puzzleIdx === i ? '#1e293b' : '#0f172a',
              color: puzzleIdx === i ? '#60a5fa' : '#64748b',
              borderBottom: puzzleIdx === i ? '2px solid #3b82f6' : '2px solid transparent',
            }}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Code */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.4rem' }}>КОД</div>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
              <pre style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.7 }}>
                {puzzle.code}
              </pre>
            </div>
          </div>

          {/* Answer area */}
          <div style={{ minWidth: '220px', flex: 1 }}>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.4rem' }}>
              РАССТАВЬ ВЫВОД В ПРАВИЛЬНОМ ПОРЯДКЕ
            </div>

            {/* Available options */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
              {available.map((val) => (
                <button
                  key={val}
                  onClick={() => handleSelect(val)}
                  disabled={checked}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    cursor: checked ? 'not-allowed' : 'pointer',
                    background: '#0f172a',
                    color: '#f1f5f9',
                    fontFamily: 'inherit',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                  }}
                >
                  "{val}"
                </button>
              ))}
            </div>

            {/* User order */}
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', minHeight: '60px' }}>
              <div style={{ color: '#475569', fontSize: '0.7rem', marginBottom: '0.4rem' }}>
                Ваш порядок:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {userOrder.map((val, i) => {
                  const correct = checked ? isCorrect(i) : null
                  return (
                    <span
                      key={i}
                      style={{
                        background: correct === null ? '#1e293b' : correct ? '#052e16' : '#450a0a',
                        border: `1px solid ${correct === null ? '#334155' : correct ? '#10b981' : '#ef4444'}`,
                        borderRadius: '6px',
                        padding: '0.3rem 0.6rem',
                        color: correct === null ? '#e2e8f0' : correct ? '#6ee7b7' : '#fca5a5',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {i + 1}. "{val}" {checked && (correct ? '✓' : '✗')}
                    </span>
                  )
                })}
                {userOrder.length === 0 && (
                  <span style={{ color: '#334155', fontSize: '0.78rem' }}>
                    Нажимайте кнопки выше...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Explanations after check */}
        {checked && (
          <div style={{
            marginTop: '1rem',
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.75rem',
          }}>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.5rem' }}>
              ПОЯСНЕНИЕ
            </div>
            {puzzle.correctOrder.map((val, i) => (
              <div key={val} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.4rem', fontSize: '0.8rem', lineHeight: 1.6 }}>
                <span style={{ color: '#60a5fa', minWidth: '1.5rem', fontWeight: 'bold' }}>
                  {i + 1}.
                </span>
                <span style={{ color: '#a78bfa', fontWeight: 'bold', minWidth: '2.5rem' }}>
                  "{val}"
                </span>
                <span style={{ color: '#94a3b8' }}>
                  {puzzle.explanations[val]}
                </span>
              </div>
            ))}
          </div>
        )}

        {allCorrect && (
          <div style={{
            marginTop: '0.75rem',
            background: '#052e16',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#6ee7b7',
            fontSize: '0.85rem',
            fontWeight: 'bold',
          }}>
            Отлично! Все правильно. Вы чувствуете Event Loop!
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            style={btnStyle(checked || userOrder.length !== puzzle.correctOrder.length)}
            onClick={handleCheck}
            disabled={checked || userOrder.length !== puzzle.correctOrder.length}
          >
            Проверить
          </button>
          <button style={btnStyle(false, '#374151')} onClick={handleUndo} disabled={userOrder.length === 0 || checked}>
            Отмена последнего
          </button>
          <button style={btnStyle(false, '#374151')} onClick={handleReset}>
            Сброс
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 1.4 Solution: Browser vs Node.js Event Loop
// ============================================

type EnvTab = 'browser' | 'node'

const BROWSER_PHASES = [
  { id: 'sync', label: 'Синхронный код', color: '#3b82f6', desc: 'Выполняется весь синхронный код в Call Stack' },
  { id: 'micro', label: 'Microtask Queue', color: '#8b5cf6', desc: 'Все Promise.then, queueMicrotask, MutationObserver' },
  { id: 'raf', label: 'requestAnimationFrame', color: '#10b981', desc: 'Колбэки перед следующим кадром (60fps = каждые ~16ms)' },
  { id: 'render', label: 'Render Pipeline', color: '#06b6d4', desc: 'Style → Layout → Paint → Composite (браузер рисует кадр)' },
  { id: 'macro', label: 'Macrotask Queue', color: '#f59e0b', desc: 'Один setTimeout/setInterval/I/O callback' },
]

const NODE_PHASES = [
  { id: 'sync', label: 'Синхронный код', color: '#3b82f6', desc: 'Весь синхронный код' },
  { id: 'nexttick', label: 'process.nextTick', color: '#ec4899', desc: 'nextTick-очередь (приоритет выше Promise!)' },
  { id: 'micro', label: 'Promise microtasks', color: '#8b5cf6', desc: 'Promise.then, queueMicrotask' },
  { id: 'timers', label: 'Timers (фаза 1)', color: '#f59e0b', desc: 'libuv: setTimeout, setInterval с истёкшим временем' },
  { id: 'pending', label: 'Pending I/O (фаза 2)', color: '#f97316', desc: 'libuv: отложенные I/O-колбэки из прошлого тика' },
  { id: 'idle', label: 'Idle/Prepare (фаза 3)', color: '#64748b', desc: 'libuv: внутреннее использование Node.js' },
  { id: 'poll', label: 'Poll (фаза 4)', color: '#22c55e', desc: 'libuv: новые I/O события, ожидание если нет таймеров' },
  { id: 'check', label: 'Check (фаза 5)', color: '#6366f1', desc: 'libuv: setImmediate колбэки' },
  { id: 'close', label: 'Close (фаза 6)', color: '#94a3b8', desc: 'libuv: close-события (socket.destroy и пр.)' },
]

const COMPARE_CODE = `// Один и тот же код — разный порядок в Node.js vs Браузер
setTimeout(() => console.log('setTimeout'), 0)
setImmediate(() => console.log('setImmediate'))  // только Node.js!
Promise.resolve().then(() => console.log('Promise'))
process?.nextTick(() => console.log('nextTick')) // только Node.js!
console.log('sync')`

const BROWSER_OUTPUT = ['sync', 'Promise', 'setTimeout']
const NODE_OUTPUT = ['sync', 'nextTick', 'Promise', 'setTimeout или setImmediate*']

export function Task1_4_Solution() {
  const [activeTab, setActiveTab] = useState<EnvTab>('browser')
  const [activePhase, setActivePhase] = useState<string | null>(null)

  const phases = activeTab === 'browser' ? BROWSER_PHASES : NODE_PHASES

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 1.4 — Браузер vs Node.js Event Loop
      </h2>

      {/* Env tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 0 }}>
        <button
          onClick={() => { setActiveTab('browser'); setActivePhase(null) }}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: '6px 6px 0 0',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
            background: activeTab === 'browser' ? '#1e293b' : '#0f172a',
            color: activeTab === 'browser' ? '#60a5fa' : '#64748b',
            borderBottom: activeTab === 'browser' ? '2px solid #3b82f6' : '2px solid transparent',
          }}
        >
          Браузер
        </button>
        <button
          onClick={() => { setActiveTab('node'); setActivePhase(null) }}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: '6px 6px 0 0',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
            background: activeTab === 'node' ? '#1e293b' : '#0f172a',
            color: activeTab === 'node' ? '#60a5fa' : '#64748b',
            borderBottom: activeTab === 'node' ? '2px solid #3b82f6' : '2px solid transparent',
          }}
        >
          Node.js
        </button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        {/* Phase pipeline */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.5rem' }}>
            {activeTab === 'browser' ? 'ЦИКЛ БРАУЗЕРА (нажмите на фазу)' : '6 ФАЗ LIBUV + MICROTASKS (нажмите на фазу)'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            {phases.map((phase, i) => (
              <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    border: `1px solid ${phase.color}80`,
                    cursor: 'pointer',
                    background: activePhase === phase.id ? phase.color : `${phase.color}20`,
                    color: activePhase === phase.id ? '#fff' : phase.color,
                    fontFamily: 'inherit',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                  }}
                >
                  {phase.label}
                </button>
                {i < phases.length - 1 && (
                  <span style={{ color: '#334155', fontSize: '0.8rem' }}>→</span>
                )}
              </div>
            ))}
            {activeTab === 'browser' && (
              <span style={{ color: '#334155', fontSize: '0.8rem' }}>→ (цикл)</span>
            )}
          </div>
        </div>

        {/* Phase description */}
        {activePhase && (
          <div style={{
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem',
            fontSize: '0.82rem',
            color: '#94a3b8',
            lineHeight: 1.6,
          }}>
            {(() => {
              const ph = phases.find((p) => p.id === activePhase)
              return ph ? (
                <>
                  <span style={{ color: ph.color, fontWeight: 'bold' }}>{ph.label}:</span>{' '}
                  {ph.desc}
                </>
              ) : null
            })()}
          </div>
        )}

        {/* Unique APIs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}>
          <div style={{
            flex: 1,
            minWidth: '200px',
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.75rem',
            borderLeft: '3px solid #3b82f6',
          }}>
            <div style={{ color: '#3b82f6', fontSize: '0.72rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              ТОЛЬКО БРАУЗЕР
            </div>
            {[
              { api: 'requestAnimationFrame', desc: 'Колбэк перед отрисовкой кадра' },
              { api: 'requestIdleCallback', desc: 'Колбэк в период простоя' },
              { api: 'MutationObserver', desc: 'Наблюдение за DOM (микротаска)' },
            ].map((item) => (
              <div key={item.api} style={{ marginBottom: '0.3rem', fontSize: '0.78rem' }}>
                <code style={{ color: '#60a5fa' }}>{item.api}</code>
                <span style={{ color: '#64748b', marginLeft: '0.5rem' }}>{item.desc}</span>
              </div>
            ))}
          </div>

          <div style={{
            flex: 1,
            minWidth: '200px',
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.75rem',
            borderLeft: '3px solid #22c55e',
          }}>
            <div style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              ТОЛЬКО NODE.JS
            </div>
            {[
              { api: 'process.nextTick', desc: 'Приоритет выше Promise.then!' },
              { api: 'setImmediate', desc: 'Выполняется в фазе Check (после Poll)' },
              { api: 'libuv', desc: '6 фаз I/O цикла под капотом' },
            ].map((item) => (
              <div key={item.api} style={{ marginBottom: '0.3rem', fontSize: '0.78rem' }}>
                <code style={{ color: '#4ade80' }}>{item.api}</code>
                <span style={{ color: '#64748b', marginLeft: '0.5rem' }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compare code */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.4rem' }}>КОД ДЛЯ СРАВНЕНИЯ</div>
          <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.7 }}>
            {COMPARE_CODE}
          </pre>
        </div>

        {/* Side-by-side output */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ color: '#3b82f6', fontSize: '0.72rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              БРАУЗЕР (вывод)
            </div>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
              {BROWSER_OUTPUT.map((v, i) => (
                <div key={i} style={{ color: '#60a5fa', fontSize: '0.8rem', lineHeight: 1.8 }}>
                  {i + 1}. {v}
                </div>
              ))}
              <div style={{ color: '#475569', fontSize: '0.72rem', marginTop: '0.4rem' }}>
                (setImmediate не существует в браузере)
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              NODE.JS (вывод)
            </div>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
              {NODE_OUTPUT.map((v, i) => (
                <div key={i} style={{ color: '#4ade80', fontSize: '0.8rem', lineHeight: 1.8 }}>
                  {i + 1}. {v}
                </div>
              ))}
              <div style={{ color: '#475569', fontSize: '0.72rem', marginTop: '0.4rem' }}>
                * setTimeout vs setImmediate: порядок зависит от I/O контекста
              </div>
            </div>
          </div>
        </div>

        {/* Key difference */}
        <div style={{
          marginTop: '1rem',
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem',
          fontSize: '0.78rem',
          color: '#94a3b8',
          lineHeight: 1.7,
          borderLeft: '3px solid #ec4899',
        }}>
          <strong style={{ color: '#f472b6' }}>Главное отличие Node.js:</strong> process.nextTick имеет
          приоритет <em>выше</em> Promise.then. Это исторически сложившееся поведение, которое
          отличается от спецификации браузеров. Порядок: nextTick → Promise micro → libuv phases.
        </div>
      </div>
    </div>
  )
}
