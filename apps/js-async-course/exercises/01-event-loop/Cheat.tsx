import { useState, useCallback } from 'react'

// ============================================
// Cheat.tsx — Полное решение Level 1: Event Loop
// Full solution for Level 1: Event Loop
// ============================================

// -----------------------------------------------
// Shared styles
// -----------------------------------------------

const containerS: React.CSSProperties = {
  background: '#0f172a',
  color: '#e2e8f0',
  padding: '1.5rem',
  borderRadius: '12px',
  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
  fontSize: '0.9rem',
  marginBottom: '1.5rem',
}

const innerS: React.CSSProperties = {
  background: '#1e293b',
  borderRadius: '8px',
  padding: '1.25rem',
}

function btn(disabled: boolean, color = '#3b82f6'): React.CSSProperties {
  return {
    padding: '0.5rem 1.2rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : color,
    color: disabled ? '#475569' : '#fff',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
  }
}

function tab(active: boolean): React.CSSProperties {
  return {
    padding: '0.4rem 0.9rem',
    borderRadius: '6px 6px 0 0',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.78rem',
    background: active ? '#1e293b' : '#0f172a',
    color: active ? '#60a5fa' : '#64748b',
    borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
  }
}

// -----------------------------------------------
// Task 1.1: Event Loop Simulator
// -----------------------------------------------

type AreaId = 'callStack' | 'webApis' | 'macroQueue' | 'microQueue'

interface ELItem {
  id: string
  label: string
  color: string
  area: AreaId
}

interface ELStep {
  description: string
  highlight: string
  items: ELItem[]
  output: string[]
}

const EL_CODE = [
  "console.log('1')",
  "setTimeout(() => console.log('2'), 0)",
  "Promise.resolve().then(() => console.log('3'))",
  "console.log('4')",
]

const EL_STEPS: ELStep[] = [
  { description: 'Начало. Call Stack пустой. Все очереди пусты.', highlight: '', items: [], output: [] },
  {
    description: "Шаг 1: console.log('1') — синхронно, сразу выполняется.",
    highlight: EL_CODE[0],
    items: [{ id: 'l1', label: "log('1')", color: '#3b82f6', area: 'callStack' }],
    output: ['1'],
  },
  {
    description: "Шаг 2: setTimeout регистрирует колбэк. Он уйдёт в Macrotask Queue через 0ms.",
    highlight: EL_CODE[1],
    items: [
      { id: 'st', label: 'setTimeout', color: '#f59e0b', area: 'callStack' },
      { id: 'cb2', label: "cb: log('2')", color: '#f59e0b', area: 'macroQueue' },
    ],
    output: ['1'],
  },
  {
    description: "Шаг 3: Promise.resolve().then() — колбэк сразу попадает в Microtask Queue.",
    highlight: EL_CODE[2],
    items: [
      { id: 'pr', label: 'Promise.then', color: '#8b5cf6', area: 'callStack' },
      { id: 'cb2m', label: "cb: log('2')", color: '#f59e0b', area: 'macroQueue' },
      { id: 'cb3', label: "cb: log('3')", color: '#8b5cf6', area: 'microQueue' },
    ],
    output: ['1'],
  },
  {
    description: "Шаг 4: console.log('4') — синхронно. Выводится '4'.",
    highlight: EL_CODE[3],
    items: [
      { id: 'l4', label: "log('4')", color: '#3b82f6', area: 'callStack' },
      { id: 'cb2m2', label: "cb: log('2')", color: '#f59e0b', area: 'macroQueue' },
      { id: 'cb3q', label: "cb: log('3')", color: '#8b5cf6', area: 'microQueue' },
    ],
    output: ['1', '4'],
  },
  {
    description: "Шаг 5: Call Stack пуст! Event Loop берёт микротаску — log('3') из Microtask Queue.",
    highlight: '',
    items: [
      { id: 'cb3e', label: "log('3')", color: '#8b5cf6', area: 'callStack' },
      { id: 'cb2m3', label: "cb: log('2')", color: '#f59e0b', area: 'macroQueue' },
    ],
    output: ['1', '4', '3'],
  },
  {
    description: "Шаг 6: Microtask Queue пуст. Event Loop берёт макротаску — log('2').",
    highlight: '',
    items: [{ id: 'cb2e', label: "log('2')", color: '#f59e0b', area: 'callStack' }],
    output: ['1', '4', '3', '2'],
  },
  {
    description: "Готово! Итог: 1 → 4 → 3 → 2. Promise (микро) всегда раньше setTimeout (макро).",
    highlight: '',
    items: [],
    output: ['1', '4', '3', '2'],
  },
]

function renderItems(items: ELItem[], area: AreaId) {
  const f = items.filter((i) => i.area === area)
  if (f.length === 0) return <div style={{ color: '#334155', fontSize: '0.72rem' }}>(пусто)</div>
  return f.map((it) => (
    <div key={it.id} style={{
      background: it.color,
      borderRadius: '6px',
      padding: '0.25rem 0.5rem',
      fontSize: '0.72rem',
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: '0.25rem',
      boxShadow: `0 0 6px ${it.color}60`,
    }}>
      {it.label}
    </div>
  ))
}

function AreaBox({ label, color, items, area }: { label: string; color: string; items: ELItem[]; area: AreaId }) {
  return (
    <div style={{ flex: 1, minWidth: '140px', background: '#0f172a', borderRadius: '8px', padding: '0.75rem', border: `1px solid ${color}40` }}>
      <div style={{ color, fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>{label}</div>
      {renderItems(items, area)}
    </div>
  )
}

function Task1_1Cheat() {
  const [stepIndex, setStepIndex] = useState(0)
  const step = EL_STEPS[stepIndex]

  return (
    <div style={containerS}>
      <h3 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>Задание 1.1 — Симулятор Event Loop</h3>
      <div style={innerS}>
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.4rem' }}>КОД</div>
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.5rem' }}>
            {EL_CODE.map((line, i) => (
              <div key={i} style={{
                display: 'flex', gap: '0.5rem', lineHeight: 1.8,
                background: step.highlight === line ? 'rgba(59,130,246,0.15)' : 'transparent',
                borderLeft: step.highlight === line ? '3px solid #3b82f6' : '3px solid transparent',
                paddingLeft: '0.4rem', borderRadius: '2px',
              }}>
                <span style={{ color: '#475569', minWidth: '1.2rem', userSelect: 'none' }}>{i + 1}</span>
                <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>{line}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <AreaBox label="CALL STACK" color="#3b82f6" items={step.items} area="callStack" />
          <AreaBox label="WEB APIs" color="#f59e0b" items={step.items} area="webApis" />
          <AreaBox label="MICROTASK QUEUE" color="#8b5cf6" items={step.items} area="microQueue" />
          <AreaBox label="MACROTASK QUEUE" color="#f59e0b" items={step.items} area="macroQueue" />
        </div>
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.3rem' }}>ВЫВОД</div>
          {step.output.length === 0
            ? <span style={{ color: '#334155', fontSize: '0.75rem' }}>(пусто)</span>
            : step.output.map((v, i) => (
              <span key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', padding: '0.15rem 0.4rem', marginRight: '0.3rem', color: '#10b981', fontWeight: 'bold', fontSize: '0.8rem' }}>{v}</span>
            ))}
        </div>
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem', marginBottom: '0.75rem', borderLeft: '3px solid #3b82f6', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
          <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Шаг {stepIndex}/{EL_STEPS.length - 1}:</span> {step.description}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={btn(stepIndex >= EL_STEPS.length - 1)} onClick={() => setStepIndex((i) => i + 1)} disabled={stepIndex >= EL_STEPS.length - 1}>Шаг →</button>
          <button style={btn(stepIndex === 0, '#374151')} onClick={() => setStepIndex(0)} disabled={stepIndex === 0}>Сброс</button>
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------
// Task 1.2: Microtasks vs Macrotasks
// -----------------------------------------------

interface QueueItem { id: string; label: string; type: 'micro' | 'macro'; source: string }

const SCENARIOS = [
  {
    name: 'Базовый приоритет',
    description: 'Одна микротаска и одна макротаска. Что выполнится первым?',
    code: `setTimeout(() => console.log('macro'), 0)\nPromise.resolve().then(() => console.log('micro'))`,
    initialMicro: [{ id: 'm1', label: "Promise.then: log('micro')", type: 'micro' as const, source: 'Promise.resolve()' }],
    initialMacro: [{ id: 'M1', label: "setTimeout: log('macro')", type: 'macro' as const, source: 'setTimeout' }],
    warning: undefined,
    starvation: false,
  },
  {
    name: 'Все микро до одной макро',
    description: 'Три микротаски и одна макротаска.',
    code: `setTimeout(() => console.log('macro'), 0)\nPromise.resolve().then(() => console.log('micro 1'))\nPromise.resolve().then(() => console.log('micro 2'))\nqueueMicrotask(() => console.log('micro 3'))`,
    initialMicro: [
      { id: 'm1', label: "Promise: log('micro 1')", type: 'micro' as const, source: 'Promise' },
      { id: 'm2', label: "Promise: log('micro 2')", type: 'micro' as const, source: 'Promise' },
      { id: 'm3', label: "queueMicrotask: log('micro 3')", type: 'micro' as const, source: 'queueMicrotask' },
    ],
    initialMacro: [{ id: 'M1', label: "setTimeout: log('macro')", type: 'macro' as const, source: 'setTimeout' }],
    warning: undefined,
    starvation: false,
  },
  {
    name: 'Microtask Starvation',
    description: 'Бесконечная цепочка Promise.then блокирует макротаски навсегда.',
    code: `setTimeout(() => console.log('НИКОГДА'), 0)\nfunction endless() {\n  Promise.resolve().then(endless)\n}\nendless()`,
    initialMicro: [
      { id: 'm1', label: 'endless() → Promise.then(endless)', type: 'micro' as const, source: 'Promise' },
      { id: 'm2', label: 'endless() → Promise.then(endless)', type: 'micro' as const, source: 'Promise' },
      { id: 'm3', label: '...и так бесконечно', type: 'micro' as const, source: 'Promise' },
    ],
    initialMacro: [{ id: 'M1', label: "setTimeout: НИКОГДА", type: 'macro' as const, source: 'setTimeout' }],
    warning: 'Microtask Starvation: макротаска никогда не получит управление!',
    starvation: true,
  },
]

function Task1_2Cheat() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [microDone, setMicroDone] = useState<string[]>([])
  const [macroDone, setMacroDone] = useState<string[]>([])
  const [log, setLog] = useState<string[]>([])
  const [starvShown, setStarvShown] = useState(false)

  const sc = SCENARIOS[scenarioIdx]

  const reset = useCallback(() => {
    setMicroDone([]); setMacroDone([]); setLog([]); setStarvShown(false)
  }, [])

  const handleScenario = (idx: number) => { setScenarioIdx(idx); setMicroDone([]); setMacroDone([]); setLog([]); setStarvShown(false) }

  const microLeft = sc.initialMicro.filter((m) => !microDone.includes(m.id))
  const macroLeft = sc.initialMacro.filter((m) => !macroDone.includes(m.id))
  const done = microLeft.length === 0 && macroLeft.length === 0

  const handleStep = () => {
    if (sc.starvation) { setStarvShown(true); return }
    if (microLeft.length > 0) {
      const next = microLeft[0]
      setMicroDone((d) => [...d, next.id])
      setLog((l) => [...l, `[micro] ${next.label}`])
    } else if (macroLeft.length > 0) {
      const next = macroLeft[0]
      setMacroDone((d) => [...d, next.id])
      setLog((l) => [...l, `[macro] ${next.label}`])
    }
  }

  return (
    <div style={containerS}>
      <h3 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>Задание 1.2 — Микротаски vs Макротаски</h3>
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 0, flexWrap: 'wrap' }}>
        {SCENARIOS.map((s, i) => <button key={i} style={tab(scenarioIdx === i)} onClick={() => handleScenario(i)}>{s.name}</button>)}
      </div>
      <div style={{ ...innerS, borderRadius: '0 8px 8px 8px' }}>
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#94a3b8', borderLeft: sc.starvation ? '3px solid #ef4444' : '3px solid #8b5cf6', lineHeight: 1.5 }}>
          {sc.description}
          {sc.warning && <div style={{ color: '#ef4444', fontWeight: 'bold', marginTop: '0.3rem' }}>{sc.warning}</div>}
        </div>
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem', marginBottom: '0.75rem' }}>
          <pre style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.6 }}>{sc.code}</pre>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ color: '#8b5cf6', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>MICROTASK QUEUE</div>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem', minHeight: '60px' }}>
              {sc.initialMicro.map((m) => {
                const d = microDone.includes(m.id)
                return (
                  <div key={m.id} style={{ background: d ? '#1e293b' : '#4c1d95', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.72rem', color: d ? '#475569' : '#c4b5fd', marginBottom: '0.25rem', textDecoration: d ? 'line-through' : 'none' }}>
                    {d ? '✓' : '▶'} {m.label}
                  </div>
                )
              })}
              {sc.starvation && starvShown && <div style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.3rem' }}>...бесконечно добавляются</div>}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ color: '#f59e0b', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>MACROTASK QUEUE</div>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem', minHeight: '60px' }}>
              {sc.initialMacro.map((m) => {
                const d = macroDone.includes(m.id)
                const blocked = sc.starvation
                return (
                  <div key={m.id} style={{ background: blocked ? '#3b1400' : d ? '#1e293b' : '#451a03', borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.72rem', color: blocked ? '#ef4444' : d ? '#475569' : '#fcd34d', marginBottom: '0.25rem', textDecoration: d ? 'line-through' : 'none' }}>
                    {blocked ? '🚫' : d ? '✓' : '⏳'} {m.label}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {log.length > 0 && (
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem', marginBottom: '0.75rem', fontSize: '0.75rem', lineHeight: 1.8 }}>
            {log.map((entry, i) => (
              <div key={i} style={{ color: entry.startsWith('[micro]') ? '#a78bfa' : '#fbbf24' }}>
                {i + 1}. {entry}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!sc.starvation ? (
            <button style={btn(done)} onClick={handleStep} disabled={done}>
              {microLeft.length > 0 ? 'Выполнить микротаску →' : 'Выполнить макротаску →'}
            </button>
          ) : (
            <button style={btn(starvShown)} onClick={handleStep} disabled={starvShown}>Запустить</button>
          )}
          <button style={btn(false, '#374151')} onClick={reset}>Сброс</button>
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------
// Task 1.3: Predict Execution Order
// -----------------------------------------------

interface CheatPuzzle {
  title: string
  code: string
  correctOrder: string[]
  explanations: Record<string, string>
}

const PUZZLES: CheatPuzzle[] = [
  {
    title: 'Базовый',
    code: `console.log('A')\nsetTimeout(() => console.log('B'), 0)\nPromise.resolve().then(() => console.log('C'))\nconsole.log('D')`,
    correctOrder: ['A', 'D', 'C', 'B'],
    explanations: { 'A': 'Синхронно', 'D': 'Синхронно', 'C': 'Promise.then — микротаска', 'B': 'setTimeout — макротаска' },
  },
  {
    title: 'Средний',
    code: `console.log('start')\nsetTimeout(() => console.log('timeout'), 0)\nPromise.resolve()\n  .then(() => { console.log('then 1'); return 'x' })\n  .then(() => console.log('then 2'))\nconsole.log('end')`,
    correctOrder: ['start', 'end', 'then 1', 'then 2', 'timeout'],
    explanations: { 'start': 'Синхронно', 'end': 'Синхронно', 'then 1': 'Первый .then — микротаска', 'then 2': 'Второй .then после выполнения первого', 'timeout': 'Макротаска — последний' },
  },
  {
    title: 'Сложный',
    code: `console.log('1')\nqueueMicrotask(() => console.log('2'))\nPromise.resolve().then(() => console.log('3'))\nsetTimeout(() => console.log('4'), 0)\nqueueMicrotask(() => {\n  console.log('5')\n  Promise.resolve().then(() => console.log('6'))\n})\nconsole.log('7')`,
    correctOrder: ['1', '7', '2', '3', '5', '6', '4'],
    explanations: { '1': 'Синхронно', '7': 'Синхронно', '2': 'queueMicrotask — первый в очереди', '3': 'Promise.then — микротаска', '5': 'Вторая queueMicrotask', '6': 'Promise.then добавленный внутри 5', '4': 'Макротаска — последний' },
  },
]

function Task1_3Cheat() {
  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [userOrder, setUserOrder] = useState<string[]>([])
  const [checked, setChecked] = useState(false)

  const puzzle = PUZZLES[puzzleIdx]
  const available = puzzle.correctOrder.filter((o) => !userOrder.includes(o))

  const handlePuzzle = (idx: number) => { setPuzzleIdx(idx); setUserOrder([]); setChecked(false) }
  const isCorrect = (idx: number) => userOrder[idx] === puzzle.correctOrder[idx]
  const allCorrect = checked && puzzle.correctOrder.every((v, i) => userOrder[i] === v)

  return (
    <div style={containerS}>
      <h3 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>Задание 1.3 — Предскажи порядок</h3>
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 0 }}>
        {PUZZLES.map((p, i) => <button key={i} style={tab(puzzleIdx === i)} onClick={() => handlePuzzle(i)}>{p.title}</button>)}
      </div>
      <div style={{ ...innerS, borderRadius: '0 8px 8px 8px' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.3rem' }}>КОД</div>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem' }}>
              <pre style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.7 }}>{puzzle.code}</pre>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.3rem' }}>РАССТАВЬ ПОРЯДОК</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.6rem' }}>
              {available.map((val) => (
                <button key={val} onClick={() => !checked && setUserOrder((p) => [...p, val])} disabled={checked} style={{ padding: '0.3rem 0.7rem', borderRadius: '6px', border: '1px solid #334155', cursor: checked ? 'not-allowed' : 'pointer', background: '#0f172a', color: '#f1f5f9', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 'bold' }}>
                  "{val}"
                </button>
              ))}
            </div>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem', minHeight: '50px' }}>
              <div style={{ color: '#475569', fontSize: '0.68rem', marginBottom: '0.3rem' }}>Ваш порядок:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {userOrder.map((val, i) => {
                  const ok = checked ? isCorrect(i) : null
                  return (
                    <span key={i} style={{ background: ok === null ? '#1e293b' : ok ? '#052e16' : '#450a0a', border: `1px solid ${ok === null ? '#334155' : ok ? '#10b981' : '#ef4444'}`, borderRadius: '6px', padding: '0.25rem 0.5rem', color: ok === null ? '#e2e8f0' : ok ? '#6ee7b7' : '#fca5a5', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {i + 1}. "{val}" {checked && (ok ? '✓' : '✗')}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        {checked && (
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem', marginTop: '0.75rem' }}>
            {puzzle.correctOrder.map((val, i) => (
              <div key={val} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', lineHeight: 1.7 }}>
                <span style={{ color: '#60a5fa', minWidth: '1.2rem', fontWeight: 'bold' }}>{i + 1}.</span>
                <span style={{ color: '#a78bfa', fontWeight: 'bold', minWidth: '2.5rem' }}>"{val}"</span>
                <span style={{ color: '#94a3b8' }}>{puzzle.explanations[val]}</span>
              </div>
            ))}
          </div>
        )}
        {allCorrect && (
          <div style={{ marginTop: '0.5rem', background: '#052e16', border: '1px solid #10b981', borderRadius: '8px', padding: '0.6rem', color: '#6ee7b7', fontSize: '0.82rem', fontWeight: 'bold' }}>
            Отлично! Все правильно!
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          <button style={btn(checked || userOrder.length !== puzzle.correctOrder.length)} onClick={() => setChecked(true)} disabled={checked || userOrder.length !== puzzle.correctOrder.length}>Проверить</button>
          <button style={btn(userOrder.length === 0 || checked, '#374151')} onClick={() => setUserOrder((p) => p.slice(0, -1))} disabled={userOrder.length === 0 || checked}>Отмена</button>
          <button style={btn(false, '#374151')} onClick={() => { setUserOrder([]); setChecked(false) }}>Сброс</button>
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------
// Task 1.4: Browser vs Node.js Event Loop
// -----------------------------------------------

type EnvTab = 'browser' | 'node'

const BROWSER_PHASES = [
  { id: 'sync', label: 'Sync', color: '#3b82f6', desc: 'Весь синхронный код в Call Stack' },
  { id: 'micro', label: 'Microtasks', color: '#8b5cf6', desc: 'Все Promise.then, queueMicrotask, MutationObserver' },
  { id: 'raf', label: 'rAF', color: '#10b981', desc: 'requestAnimationFrame — перед отрисовкой кадра' },
  { id: 'render', label: 'Render', color: '#06b6d4', desc: 'Style → Layout → Paint → Composite' },
  { id: 'macro', label: 'Macrotask', color: '#f59e0b', desc: 'Одна задача из Task Queue (setTimeout, I/O)' },
]

const NODE_PHASES = [
  { id: 'sync', label: 'Sync', color: '#3b82f6', desc: 'Синхронный код' },
  { id: 'nexttick', label: 'nextTick', color: '#ec4899', desc: 'process.nextTick — приоритет выше Promise!' },
  { id: 'micro', label: 'Microtasks', color: '#8b5cf6', desc: 'Promise.then, queueMicrotask' },
  { id: 'timers', label: 'Timers', color: '#f59e0b', desc: 'libuv фаза 1: setTimeout, setInterval' },
  { id: 'pending', label: 'Pending I/O', color: '#f97316', desc: 'libuv фаза 2: отложенные I/O колбэки' },
  { id: 'idle', label: 'Idle', color: '#64748b', desc: 'libuv фаза 3: внутреннее' },
  { id: 'poll', label: 'Poll', color: '#22c55e', desc: 'libuv фаза 4: новые I/O события, ожидание' },
  { id: 'check', label: 'Check', color: '#6366f1', desc: 'libuv фаза 5: setImmediate' },
  { id: 'close', label: 'Close', color: '#94a3b8', desc: 'libuv фаза 6: close-события' },
]

function Task1_4Cheat() {
  const [activeTab, setActiveTab] = useState<EnvTab>('browser')
  const [activePhase, setActivePhase] = useState<string | null>(null)

  const phases = activeTab === 'browser' ? BROWSER_PHASES : NODE_PHASES

  return (
    <div style={containerS}>
      <h3 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>Задание 1.4 — Браузер vs Node.js Event Loop</h3>
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 0 }}>
        {(['browser', 'node'] as EnvTab[]).map((t) => (
          <button key={t} style={tab(activeTab === t)} onClick={() => { setActiveTab(t); setActivePhase(null) }}>
            {t === 'browser' ? 'Браузер' : 'Node.js'}
          </button>
        ))}
      </div>
      <div style={{ ...innerS, borderRadius: '0 8px 8px 8px' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.4rem' }}>ФАЗЫ (кликните для описания)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
            {phases.map((phase, i) => (
              <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <button
                  onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                  style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: `1px solid ${phase.color}80`, cursor: 'pointer', background: activePhase === phase.id ? phase.color : `${phase.color}20`, color: activePhase === phase.id ? '#fff' : phase.color, fontFamily: 'inherit', fontSize: '0.72rem', fontWeight: 'bold', transition: 'all 0.2s' }}
                >
                  {phase.label}
                </button>
                {i < phases.length - 1 && <span style={{ color: '#334155', fontSize: '0.8rem' }}>→</span>}
              </div>
            ))}
            {activeTab === 'browser' && <span style={{ color: '#334155', fontSize: '0.75rem' }}>→ (цикл)</span>}
          </div>
        </div>
        {activePhase && (() => {
          const ph = phases.find((p) => p.id === activePhase)
          return ph ? (
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              <span style={{ color: ph.color, fontWeight: 'bold' }}>{ph.label}:</span> {ph.desc}
            </div>
          ) : null
        })()}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {[
            { title: 'ТОЛЬКО БРАУЗЕР', color: '#3b82f6', items: [{ api: 'requestAnimationFrame', desc: 'Перед отрисовкой' }, { api: 'MutationObserver', desc: 'Микротаска DOM' }, { api: 'requestIdleCallback', desc: 'В период простоя' }] },
            { title: 'ТОЛЬКО NODE.JS', color: '#22c55e', items: [{ api: 'process.nextTick', desc: 'Выше Promise!' }, { api: 'setImmediate', desc: 'Фаза Check' }, { api: 'libuv', desc: '6 фаз I/O' }] },
          ].map((col) => (
            <div key={col.title} style={{ flex: 1, minWidth: '170px', background: '#0f172a', borderRadius: '8px', padding: '0.6rem', borderLeft: `3px solid ${col.color}` }}>
              <div style={{ color: col.color, fontSize: '0.68rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{col.title}</div>
              {col.items.map((it) => (
                <div key={it.api} style={{ fontSize: '0.72rem', marginBottom: '0.2rem' }}>
                  <code style={{ color: col.color === '#3b82f6' ? '#60a5fa' : '#4ade80' }}>{it.api}</code>
                  <span style={{ color: '#64748b', marginLeft: '0.4rem' }}>{it.desc}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { env: 'БРАУЗЕР', color: '#3b82f6', output: ['sync', 'Promise', 'setTimeout'] },
            { env: 'NODE.JS', color: '#22c55e', output: ['sync', 'nextTick', 'Promise', 'setTimeout / setImmediate*'] },
          ].map((env) => (
            <div key={env.env} style={{ flex: 1, minWidth: '160px' }}>
              <div style={{ color: env.color, fontSize: '0.68rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>{env.env}</div>
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem' }}>
                {env.output.map((v, i) => (
                  <div key={i} style={{ color: env.color === '#3b82f6' ? '#60a5fa' : '#4ade80', fontSize: '0.78rem', lineHeight: 1.8 }}>
                    {i + 1}. {v}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------
// Main Cheat component
// -----------------------------------------------

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 1 — Event Loop</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 1.1: Ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li><strong>Шаги</strong>: храните массив EL_STEPS с полями <code>description</code>, <code>highlight</code>, <code>items</code>, <code>output</code></li>
          <li><strong>Фильтрация по зоне</strong>: <code>items.filter(i =&gt; i.area === area)</code> — для каждой из 4 зон</li>
          <li><strong>Подсветка кода</strong>: сравниваете <code>step.highlight === line</code> для каждой строки</li>
          <li><strong>Вывод</strong>: <code>step.output.map(v =&gt; &lt;badge&gt;{'{v}'}&lt;/badge&gt;)</code></li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 1.2: Ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li><strong>Приоритет</strong>: в handleStep сначала проверяйте <code>microLeft.length &gt; 0</code></li>
          <li><strong>Starvation</strong>: для 3-го сценария просто показывайте предупреждение — не трогайте очереди</li>
          <li><strong>Завершённые</strong>: храните как <code>microDone: string[]</code> (массив id)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 1.3: Ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li><strong>Доступные</strong>: <code>correctOrder.filter(o =&gt; !userOrder.includes(o))</code></li>
          <li><strong>Проверка позиции</strong>: <code>userOrder[idx] === correctOrder[idx]</code></li>
          <li><strong>Undo</strong>: <code>setUserOrder(prev =&gt; prev.slice(0, -1))</code></li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 1.4: Ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li><strong>Активная фаза</strong>: toggle — если <code>activePhase === phase.id</code> то сброс в null, иначе устанавливаем</li>
          <li><strong>Node.js nextTick</strong>: объяснить что это НЕ просто микротаска — это отдельная очередь с высшим приоритетом</li>
          <li><strong>setImmediate vs setTimeout</strong>: непредсказуемы вне I/O, в I/O — всегда setImmediate первым</li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>Живые компоненты</h3>
        <Task1_1Cheat />
        <Task1_2Cheat />
        <Task1_3Cheat />
        <Task1_4Cheat />
      </section>
    </div>
  )
}
