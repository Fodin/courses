import { useState, useRef } from 'react'

// ============================================
// Task 8.1 Solution: Generator Step-by-Step
// ============================================

// We simulate a generator with a step-index so it works in React
// (real generators can't be reset, so we replay from recorded steps)

interface GenStep {
  phase: 'caller' | 'generator'
  label: string           // what happens at this step
  callerCode: number      // highlight line in caller code
  genCode: number         // highlight line in generator code
  yieldValue?: unknown    // value yielded to caller
  sendValue?: unknown     // value sent into generator via next(value)
  result?: { value: unknown; done: boolean }
  annotation: string
}

const CALLER_LINES = [
  'const gen = pingpong()',    // 0
  "let r1 = gen.next()",       // 1
  "// r1 = { value: 'ping', done: false }", // 2
  "let r2 = gen.next('pong')", // 3
  "// r2 = { value: 'pong', done: false }", // 4
  "let r3 = gen.next('done')", // 5
  "// r3 = { value: undefined, done: true }", // 6
]

const GEN_LINES = [
  'function* pingpong() {',           // 0
  "  const msg1 = yield 'ping'",      // 1
  '  console.log(msg1)',               // 2
  "  const msg2 = yield msg1",        // 3
  '  console.log(msg2)',               // 4
  '  // генератор завершён',          // 5
  '}',                                 // 6
]

const PING_PONG_STEPS: GenStep[] = [
  {
    phase: 'caller',
    label: 'Создаём генератор',
    callerCode: 0,
    genCode: 0,
    annotation: 'gen.next() ещё не вызван — генератор на паузе перед первой строкой тела',
  },
  {
    phase: 'caller',
    label: 'Вызов gen.next()',
    callerCode: 1,
    genCode: 1,
    annotation: 'Caller вызывает .next() → управление передаётся генератору',
  },
  {
    phase: 'generator',
    label: 'yield "ping"',
    callerCode: 1,
    genCode: 1,
    yieldValue: 'ping',
    annotation: 'Генератор достигает yield — возвращает "ping" и ставит себя на паузу',
  },
  {
    phase: 'caller',
    label: 'Получаем { value: "ping", done: false }',
    callerCode: 2,
    genCode: 1,
    result: { value: 'ping', done: false },
    annotation: 'Caller получает результат, генератор заморожен на строке yield',
  },
  {
    phase: 'caller',
    label: 'Вызов gen.next("pong")',
    callerCode: 3,
    genCode: 1,
    sendValue: 'pong',
    annotation: 'Caller передаёт "pong" в генератор через аргумент next()',
  },
  {
    phase: 'generator',
    label: 'msg1 = "pong", продолжаем',
    callerCode: 3,
    genCode: 3,
    sendValue: 'pong',
    annotation: '"pong" становится результатом yield-выражения → msg1 = "pong"',
  },
  {
    phase: 'generator',
    label: 'yield msg1 (= "pong")',
    callerCode: 3,
    genCode: 3,
    yieldValue: 'pong',
    annotation: 'Генератор возвращает "pong" и снова замирает',
  },
  {
    phase: 'caller',
    label: 'Получаем { value: "pong", done: false }',
    callerCode: 4,
    genCode: 3,
    result: { value: 'pong', done: false },
    annotation: 'Второй результат получен, генератор снова на паузе',
  },
  {
    phase: 'caller',
    label: 'Вызов gen.next("done")',
    callerCode: 5,
    genCode: 3,
    sendValue: 'done',
    annotation: 'Передаём "done" — генератор получит его как значение второго yield',
  },
  {
    phase: 'generator',
    label: 'msg2 = "done", генератор завершается',
    callerCode: 5,
    genCode: 5,
    sendValue: 'done',
    annotation: 'Тело генератора заканчивается — функция выходит без явного return',
  },
  {
    phase: 'caller',
    label: 'Получаем { value: undefined, done: true }',
    callerCode: 6,
    genCode: 6,
    result: { value: undefined, done: true },
    annotation: 'done: true означает что генератор исчерпан. Дальнейшие .next() вернут { value: undefined, done: true }',
  },
]

export function Task8_1_Solution() {
  const [stepIndex, setStepIndex] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('pong')

  const step = PING_PONG_STEPS[stepIndex]
  const isLast = stepIndex >= PING_PONG_STEPS.length - 1

  const handleNext = () => {
    if (isLast) return
    const nextStep = PING_PONG_STEPS[stepIndex + 1]
    const entry = nextStep.result != null
      ? `.next() → { value: ${JSON.stringify(nextStep.result.value)}, done: ${nextStep.result.done} }`
      : nextStep.sendValue != null
      ? `.next(${JSON.stringify(nextStep.sendValue)}) → генератор получает значение`
      : nextStep.yieldValue != null
      ? `yield ${JSON.stringify(nextStep.yieldValue)} → пауза`
      : nextStep.label
    setLog((prev) => [...prev, entry])
    setStepIndex(stepIndex + 1)
  }

  const handleReset = () => {
    setStepIndex(0)
    setLog([])
  }

  const cs: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.88rem',
  }

  const btnStyle = (disabled?: boolean): React.CSSProperties => ({
    padding: '0.45rem 1.1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : '#3b82f6',
    color: disabled ? '#475569' : '#fff',
    fontFamily: 'inherit',
    fontSize: '0.83rem',
  })

  const phaseColor = step.phase === 'caller' ? '#60a5fa' : '#a78bfa'

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 8.1 — Генератор пошагово: пинг-понг caller ↔ generator
      </h2>

      {/* Phase indicator */}
      <div style={{
        display: 'inline-block',
        background: step.phase === 'caller' ? '#1e3a5f' : '#2e1a5f',
        border: `1px solid ${phaseColor}`,
        borderRadius: '20px',
        padding: '0.25rem 0.9rem',
        fontSize: '0.78rem',
        color: phaseColor,
        marginBottom: '1rem',
      }}>
        {step.phase === 'caller' ? 'Активен: CALLER' : 'Активен: GENERATOR'}
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {/* Caller column */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ color: '#60a5fa', fontSize: '0.75rem', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
            CALLER
          </div>
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', lineHeight: 1.8 }}>
            {CALLER_LINES.map((line, i) => (
              <div key={i} style={{
                paddingLeft: '0.5rem',
                borderLeft: step.callerCode === i
                  ? '3px solid #60a5fa'
                  : '3px solid transparent',
                background: step.callerCode === i
                  ? 'rgba(96,165,250,0.1)'
                  : 'transparent',
                borderRadius: '2px',
                color: line.startsWith('//') ? '#475569' : '#cbd5e1',
                transition: 'background 0.2s',
              }}>
                <span style={{ color: '#334155', fontSize: '0.7rem', marginRight: '0.6rem', userSelect: 'none' }}>
                  {i + 1}
                </span>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '80px',
          gap: '0.5rem',
        }}>
          {step.sendValue != null && (
            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#60a5fa' }}>
              <div>.next(</div>
              <div style={{ fontWeight: 'bold' }}>"{String(step.sendValue)}"</div>
              <div>)</div>
              <div style={{ fontSize: '1.2rem' }}>→</div>
            </div>
          )}
          {step.yieldValue != null && (
            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#a78bfa' }}>
              <div style={{ fontSize: '1.2rem' }}>←</div>
              <div>yield</div>
              <div style={{ fontWeight: 'bold' }}>"{String(step.yieldValue)}"</div>
            </div>
          )}
          {step.result != null && (
            <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#10b981' }}>
              <div style={{ fontSize: '1.1rem' }}>←</div>
              <div style={{ color: '#6ee7b7' }}>
                {'{'}value:{JSON.stringify(step.result.value)},
                done:{String(step.result.done)}{'}'}
              </div>
            </div>
          )}
          {step.sendValue == null && step.yieldValue == null && step.result == null && (
            <div style={{ color: '#334155', fontSize: '0.72rem', textAlign: 'center' }}>—</div>
          )}
        </div>

        {/* Generator column */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ color: '#a78bfa', fontSize: '0.75rem', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
            GENERATOR
          </div>
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', lineHeight: 1.8 }}>
            {GEN_LINES.map((line, i) => (
              <div key={i} style={{
                paddingLeft: '0.5rem',
                borderLeft: step.genCode === i
                  ? '3px solid #a78bfa'
                  : '3px solid transparent',
                background: step.genCode === i
                  ? 'rgba(167,139,250,0.1)'
                  : 'transparent',
                borderRadius: '2px',
                color: line.includes('//') ? '#475569' : '#cbd5e1',
                transition: 'background 0.2s',
              }}>
                <span style={{ color: '#334155', fontSize: '0.7rem', marginRight: '0.6rem', userSelect: 'none' }}>
                  {i + 1}
                </span>
                {line}
              </div>
            ))}
          </div>

          {/* Pause indicator */}
          <div style={{
            marginTop: '0.5rem',
            background: step.phase === 'generator' ? '#1a1a3a' : '#1e293b',
            border: `1px solid ${step.phase === 'generator' ? '#a78bfa' : '#334155'}`,
            borderRadius: '6px',
            padding: '0.4rem 0.75rem',
            fontSize: '0.75rem',
            color: step.phase === 'generator' ? '#a78bfa' : '#475569',
          }}>
            {step.phase === 'generator' ? 'ВЫПОЛНЯЕТСЯ' : 'НА ПАУЗЕ (заморожен)'}
          </div>
        </div>
      </div>

      {/* Annotation */}
      <div style={{
        marginTop: '1rem',
        background: '#1e293b',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        borderLeft: `3px solid ${phaseColor}`,
        fontSize: '0.83rem',
        color: '#94a3b8',
        lineHeight: 1.5,
      }}>
        <span style={{ color: phaseColor, fontWeight: 'bold' }}>Шаг {stepIndex + 1}/{PING_PONG_STEPS.length}:</span>{' '}
        {step.annotation}
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div style={{
          marginTop: '0.75rem',
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem',
          fontSize: '0.78rem',
          maxHeight: '120px',
          overflowY: 'auto',
        }}>
          <div style={{ color: '#475569', marginBottom: '0.4rem' }}>ЛОГ ВЫЗОВОВ:</div>
          {log.map((entry, i) => (
            <div key={i} style={{ color: '#64748b' }}>
              <span style={{ color: '#334155' }}>{i + 1}.</span> {entry}
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button style={btnStyle(isLast)} onClick={handleNext} disabled={isLast}>
          Следующий шаг →
        </button>
        <button
          style={{ ...btnStyle(stepIndex === 0), background: stepIndex === 0 ? '#1e293b' : '#374151' }}
          onClick={handleReset}
          disabled={stepIndex === 0}
        >
          Сброс
        </button>
        {isLast && (
          <span style={{ color: '#10b981', fontSize: '0.8rem' }}>
            Генератор исчерпан (done: true)
          </span>
        )}
      </div>

      {/* Tip about return/throw */}
      <div style={{
        marginTop: '1rem',
        background: '#1e293b',
        borderRadius: '8px',
        padding: '0.75rem',
        fontSize: '0.78rem',
        color: '#64748b',
        lineHeight: 1.6,
      }}>
        <span style={{ color: '#f59e0b' }}>Досрочное завершение:</span>{' '}
        <code style={{ color: '#fbbf24' }}>gen.return(value)</code> — завершает генератор, возвращает {'{'}value, done: true{'}'}.{' '}
        <code style={{ color: '#ef4444' }}>gen.throw(err)</code> — бросает исключение внутри генератора в точке паузы.
      </div>
    </div>
  )
}


// ============================================
// Task 8.2 Solution: Lazy Sequences
// ============================================

// Infinite Fibonacci generator — pure JS (no real generator in component state,
// we maintain index + two previous values)

function* fibonacciGen(): Generator<number> {
  let a = 0, b = 1
  while (true) {
    yield a;
    [a, b] = [b, a + b]
  }
}

// take N items from generator
function take<T>(n: number, gen: Generator<T>): T[] {
  const result: T[] = []
  for (let i = 0; i < n; i++) {
    const { value, done } = gen.next()
    if (done) break
    result.push(value)
  }
  return result
}

// Pipeline step labels
type PipelineStage = 'fibonacci' | 'filter' | 'take' | 'result'

export function Task8_2_Solution() {
  // We keep a ref to the generator so it persists between renders
  const genRef = useRef<Generator<number>>(fibonacciGen())
  const [collected, setCollected] = useState<number[]>([])
  const [pipelineDemo, setPipelineDemo] = useState<{
    fib: number[]
    filtered: number[]
    taken: number[]
  } | null>(null)
  const [activeStage, setActiveStage] = useState<PipelineStage | null>(null)

  const handleNextValue = () => {
    const { value, done } = genRef.current.next()
    if (!done) {
      setCollected((prev) => [...prev, value])
    }
  }

  const handleReset = () => {
    genRef.current = fibonacciGen()
    setCollected([])
    setPipelineDemo(null)
    setActiveStage(null)
  }

  const handlePipelineDemo = () => {
    // Show pipeline: fibonacci → filter(isEven) → take(5)
    const gen = fibonacciGen()
    // take first 20 fibonacci numbers to show source
    const fib = take(20, fibonacciGen())
    const filtered = fib.filter((n) => n % 2 === 0)
    const taken = filtered.slice(0, 5)
    setPipelineDemo({ fib, filtered, taken })
    setActiveStage('fibonacci')
  }

  const nextStage = () => {
    setActiveStage((prev) => {
      if (prev === 'fibonacci') return 'filter'
      if (prev === 'filter') return 'take'
      if (prev === 'take') return 'result'
      return 'result'
    })
  }

  const cs: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.88rem',
  }

  const btn = (color: string, disabled?: boolean): React.CSSProperties => ({
    padding: '0.45rem 1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : color,
    color: disabled ? '#475569' : '#fff',
    fontFamily: 'inherit',
    fontSize: '0.83rem',
  })

  const stageActive = (s: PipelineStage) =>
    activeStage === s ||
    (s === 'fibonacci' && ['filter', 'take', 'result'].includes(activeStage ?? '')) ||
    (s === 'filter' && ['take', 'result'].includes(activeStage ?? '')) ||
    (s === 'take' && activeStage === 'result')

  const memoryLabel = collected.length === 0
    ? 'O(1) — только текущее значение в памяти'
    : `O(1) — ${collected.length} значений запрошено, генератор хранит лишь 2 числа`

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 8.2 — Ленивые последовательности: бесконечный Фибоначчи
      </h2>

      {/* Section 1: one by one */}
      <div style={{ background: '#1e293b', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
          ЛЕНИВЫЙ ЗАПРОС — КАЖДЫЙ КЛИК = ОДНО ЗНАЧЕНИЕ
        </div>
        <div style={{ background: '#0f172a', borderRadius: '6px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', fontSize: '0.78rem', color: '#64748b' }}>
          <pre style={{ margin: 0 }}>
{`function* fibonacci() {
  let a = 0, b = 1
  while (true) {
    yield a     // ← пауза здесь до следующего .next()
    ;[a, b] = [b, a + b]
  }
}`}
          </pre>
        </div>

        {/* Number tape */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          minHeight: '40px',
          marginBottom: '0.75rem',
          alignItems: 'center',
        }}>
          {collected.length === 0 && (
            <span style={{ color: '#334155', fontSize: '0.8rem' }}>Нажмите кнопку для первого значения...</span>
          )}
          {collected.map((n, i) => (
            <div
              key={i}
              style={{
                background: i === collected.length - 1 ? '#1d4ed8' : '#1e3a5f',
                border: `1px solid ${i === collected.length - 1 ? '#60a5fa' : '#1e3a5f'}`,
                borderRadius: '6px',
                padding: '0.3rem 0.6rem',
                fontSize: '0.82rem',
                color: i === collected.length - 1 ? '#93c5fd' : '#475569',
                transition: 'all 0.2s',
              }}
            >
              {n}
            </div>
          ))}
        </div>

        <div style={{
          fontSize: '0.75rem',
          color: '#475569',
          marginBottom: '0.75rem',
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}>
          <span>Запрошено: <span style={{ color: '#60a5fa' }}>{collected.length}</span> значений</span>
          <span style={{ color: '#10b981' }}>{memoryLabel}</span>
        </div>

        {/* Memory comparison */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
        }}>
          <div style={{
            flex: 1,
            background: '#052e16',
            border: '1px solid #10b981',
            borderRadius: '6px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
          }}>
            <div style={{ color: '#10b981', marginBottom: '0.25rem' }}>Генератор O(1)</div>
            <div style={{ color: '#6ee7b7' }}>
              Хранит только: a={collected.length > 0 ? collected[collected.length - 1] : 0},{' '}
              b={collected.length > 1 ? collected[collected.length - 1] + (collected[collected.length - 2] ?? 0) : 1}
            </div>
          </div>
          <div style={{
            flex: 1,
            background: '#450a0a',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
          }}>
            <div style={{ color: '#ef4444', marginBottom: '0.25rem' }}>Array O(n) — невозможно</div>
            <div style={{ color: '#fca5a5' }}>
              Array.from(fibonacci()) — бесконечный цикл, памяти не хватит
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button style={btn('#3b82f6')} onClick={handleNextValue}>
            Взять следующее значение
          </button>
          <button style={btn('#374151', collected.length === 0)} onClick={handleReset} disabled={collected.length === 0}>
            Сброс
          </button>
        </div>
      </div>

      {/* Section 2: pipeline */}
      <div style={{ background: '#1e293b', borderRadius: '10px', padding: '1rem' }}>
        <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
          PIPELINE: fibonacci → filter(чётные) → take(5)
        </div>

        <div style={{ background: '#0f172a', borderRadius: '6px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', fontSize: '0.78rem', color: '#64748b' }}>
          <pre style={{ margin: 0 }}>{`// take(5, filter(isEven, fibonacci()))
// Ленивая цепочка — вычисляет только нужное`}</pre>
        </div>

        {pipelineDemo && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {/* fibonacci */}
            <div style={{ opacity: stageActive('fibonacci') ? 1 : 0.3, transition: 'opacity 0.3s' }}>
              <div style={{ fontSize: '0.72rem', color: '#a78bfa', marginBottom: '0.3rem' }}>fibonacci()</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '180px' }}>
                {pipelineDemo.fib.map((n, i) => (
                  <div key={i} style={{
                    background: '#2e1a5f',
                    borderRadius: '4px',
                    padding: '0.2rem 0.4rem',
                    fontSize: '0.72rem',
                    color: '#c4b5fd',
                  }}>{n}</div>
                ))}
                <div style={{ color: '#475569', fontSize: '0.72rem', alignSelf: 'center' }}>...</div>
              </div>
            </div>

            <div style={{ color: '#334155', alignSelf: 'center', fontSize: '1.2rem', opacity: stageActive('filter') ? 1 : 0.2 }}>→</div>

            {/* filter */}
            <div style={{ opacity: stageActive('filter') ? 1 : 0.3, transition: 'opacity 0.3s' }}>
              <div style={{ fontSize: '0.72rem', color: '#60a5fa', marginBottom: '0.3rem' }}>filter(isEven)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '120px' }}>
                {pipelineDemo.filtered.map((n, i) => (
                  <div key={i} style={{
                    background: '#1e3a5f',
                    borderRadius: '4px',
                    padding: '0.2rem 0.4rem',
                    fontSize: '0.72rem',
                    color: '#93c5fd',
                  }}>{n}</div>
                ))}
              </div>
            </div>

            <div style={{ color: '#334155', alignSelf: 'center', fontSize: '1.2rem', opacity: stageActive('take') ? 1 : 0.2 }}>→</div>

            {/* take */}
            <div style={{ opacity: stageActive('take') ? 1 : 0.3, transition: 'opacity 0.3s' }}>
              <div style={{ fontSize: '0.72rem', color: '#f59e0b', marginBottom: '0.3rem' }}>take(5)</div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {pipelineDemo.taken.map((n, i) => (
                  <div key={i} style={{
                    background: '#1c1a0a',
                    border: '1px solid #f59e0b',
                    borderRadius: '4px',
                    padding: '0.2rem 0.4rem',
                    fontSize: '0.72rem',
                    color: '#fbbf24',
                  }}>{n}</div>
                ))}
              </div>
            </div>

            <div style={{ color: '#334155', alignSelf: 'center', fontSize: '1.2rem', opacity: activeStage === 'result' ? 1 : 0.2 }}>→</div>

            {/* result */}
            <div style={{ opacity: activeStage === 'result' ? 1 : 0.3, transition: 'opacity 0.3s' }}>
              <div style={{ fontSize: '0.72rem', color: '#10b981', marginBottom: '0.3rem' }}>результат</div>
              <div style={{
                background: '#052e16',
                border: '1px solid #10b981',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.72rem',
                color: '#6ee7b7',
              }}>
                [{pipelineDemo.taken.join(', ')}]
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {!pipelineDemo ? (
            <button style={btn('#8b5cf6')} onClick={handlePipelineDemo}>
              Запустить pipeline
            </button>
          ) : (
            <button
              style={btn('#8b5cf6', activeStage === 'result')}
              onClick={nextStage}
              disabled={activeStage === 'result'}
            >
              Следующая стадия →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


// ============================================
// Task 8.3 Solution: Generator as State Machine
// ============================================

type TrafficState = 'red' | 'green' | 'yellow'

interface TrafficTransition {
  from: TrafficState
  action: string
  to: TrafficState
}

const TRAFFIC_TRANSITIONS: TrafficTransition[] = [
  { from: 'red', action: 'switch', to: 'green' },
  { from: 'green', action: 'switch', to: 'yellow' },
  { from: 'yellow', action: 'switch', to: 'red' },
]

function* trafficLight(): Generator<TrafficState, void, string> {
  while (true) {
    yield 'red'
    yield 'green'
    yield 'yellow'
  }
}

const STATE_COLORS: Record<TrafficState, { bg: string; glow: string; label: string }> = {
  red: { bg: '#ef4444', glow: '#ef444480', label: 'КРАСНЫЙ — Стоп' },
  green: { bg: '#10b981', glow: '#10b98180', label: 'ЗЕЛЁНЫЙ — Идти' },
  yellow: { bg: '#f59e0b', glow: '#f59e0b80', label: 'ЖЁЛТЫЙ — Внимание' },
}

// Coffee machine state machine
type CoffeeState = 'idle' | 'selecting' | 'brewing' | 'ready'

const COFFEE_TRANSITIONS: Array<{ from: CoffeeState; action: string; to: CoffeeState; btn: string }> = [
  { from: 'idle', action: 'select', to: 'selecting', btn: 'Выбрать напиток' },
  { from: 'selecting', action: 'brew', to: 'brewing', btn: 'Начать варку' },
  { from: 'brewing', action: 'done', to: 'ready', btn: 'Готово (авто)' },
  { from: 'ready', action: 'take', to: 'idle', btn: 'Забрать напиток' },
]

const COFFEE_COLORS: Record<CoffeeState, { bg: string; border: string; icon: string; desc: string }> = {
  idle: { bg: '#1e293b', border: '#334155', icon: 'idle', desc: 'Ожидание' },
  selecting: { bg: '#1c1a0a', border: '#f59e0b', icon: 'selecting', desc: 'Выбор напитка...' },
  brewing: { bg: '#0a1a0a', border: '#10b981', icon: 'brewing', desc: 'Варится кофе...' },
  ready: { bg: '#0f172a', border: '#60a5fa', icon: 'ready', desc: 'Готово! Забирай' },
}

function* coffeeGenerator(): Generator<CoffeeState, void, string> {
  while (true) {
    yield 'idle'
    yield 'selecting'
    yield 'brewing'
    yield 'ready'
  }
}

export function Task8_3_Solution() {
  const [demo, setDemo] = useState<'traffic' | 'coffee'>('traffic')

  // Traffic light state
  const trafficRef = useRef<Generator<TrafficState, void, string>>(trafficLight())
  const [trafficState, setTrafficState] = useState<TrafficState>('red')
  const [trafficLog, setTrafficLog] = useState<string[]>(['red — начальное состояние'])

  // Coffee machine state
  const coffeeRef = useRef<Generator<CoffeeState, void, string>>(coffeeGenerator())
  // advance past initial 'idle' yield
  const [coffeeState, setCoffeeState] = useState<CoffeeState>('idle')
  const [coffeeLog, setCoffeeLog] = useState<string[]>(['idle — машина ожидает'])

  const handleTrafficSwitch = () => {
    const { value } = trafficRef.current.next()
    if (value !== undefined) {
      const nextState = value as TrafficState
      setTrafficLog((prev) => [...prev, `${trafficState} → switch → ${nextState}`])
      setTrafficState(nextState)
    }
  }

  const handleTrafficReset = () => {
    trafficRef.current = trafficLight()
    const first = trafficRef.current.next()
    setTrafficState((first.value as TrafficState) ?? 'red')
    setTrafficLog(['red — начальное состояние'])
  }

  const coffeeTransition = COFFEE_TRANSITIONS.find((t) => t.from === coffeeState)

  const handleCoffeeAction = () => {
    if (!coffeeTransition) return
    const { value } = coffeeRef.current.next()
    if (value !== undefined) {
      const nextState = value as CoffeeState
      setCoffeeLog((prev) => [...prev, `${coffeeState} → ${coffeeTransition.action} → ${nextState}`])
      setCoffeeState(nextState)
    }
  }

  const handleCoffeeReset = () => {
    coffeeRef.current = coffeeGenerator()
    setCoffeeState('idle')
    setCoffeeLog(['idle — машина ожидает'])
  }

  const cs: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.88rem',
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.4rem 1rem',
    borderRadius: '6px 6px 0 0',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.83rem',
    background: active ? '#1e293b' : '#0f172a',
    color: active ? '#60a5fa' : '#64748b',
    borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
  })

  const btn = (color: string, disabled?: boolean): React.CSSProperties => ({
    padding: '0.45rem 1.1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : color,
    color: disabled ? '#475569' : '#fff',
    fontFamily: 'inherit',
    fontSize: '0.83rem',
  })

  const trafficInfo = STATE_COLORS[trafficState]

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 8.3 — Генератор как конечный автомат (State Machine)
      </h2>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0' }}>
        <button style={tabStyle(demo === 'traffic')} onClick={() => setDemo('traffic')}>Светофор</button>
        <button style={tabStyle(demo === 'coffee')} onClick={() => setDemo('coffee')}>Кофемашина</button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>

        {demo === 'traffic' && (
          <div>
            {/* Generator code */}
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.78rem', color: '#64748b' }}>
              <pre style={{ margin: 0 }}>
{`function* trafficLight() {
  while (true) {
    yield 'red'     // пауза → управление caller-у
    yield 'green'
    yield 'yellow'
  }
}

const light = trafficLight()
light.next() // { value: 'red', done: false }
light.next() // { value: 'green', done: false }
light.next() // { value: 'yellow', done: false }
// и снова по кругу...`}
              </pre>
            </div>

            {/* State diagram */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {(['red', 'green', 'yellow'] as TrafficState[]).map((s) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: trafficState === s ? STATE_COLORS[s].bg : '#1e293b',
                    border: `3px solid ${STATE_COLORS[s].bg}`,
                    boxShadow: trafficState === s ? `0 0 16px ${STATE_COLORS[s].glow}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    color: trafficState === s ? '#fff' : STATE_COLORS[s].bg,
                    fontWeight: 'bold',
                    transition: 'all 0.3s',
                    textAlign: 'center',
                    lineHeight: 1.1,
                  }}>
                    {s.toUpperCase().slice(0, 3)}
                  </div>
                  {s !== 'yellow' && (
                    <div style={{ color: '#334155', fontSize: '1.1rem' }}>→</div>
                  )}
                </div>
              ))}
              <div style={{ color: '#334155', fontSize: '0.72rem', alignSelf: 'center' }}>→ (цикл)</div>
            </div>

            {/* Current state label */}
            <div style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              borderLeft: `4px solid ${trafficInfo.bg}`,
            }}>
              <span style={{ color: trafficInfo.bg, fontWeight: 'bold', fontSize: '1rem' }}>
                {trafficInfo.label}
              </span>
              <span style={{ color: '#475569', fontSize: '0.78rem', marginLeft: '0.75rem' }}>
                Текущее состояние: "{trafficState}"
              </span>
            </div>

            {/* Log */}
            <div style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '0.6rem 0.75rem',
              marginBottom: '1rem',
              maxHeight: '100px',
              overflowY: 'auto',
              fontSize: '0.75rem',
            }}>
              {trafficLog.map((entry, i) => (
                <div key={i} style={{ color: i === trafficLog.length - 1 ? '#94a3b8' : '#334155' }}>
                  {entry}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button style={btn('#3b82f6')} onClick={handleTrafficSwitch}>
                Переключить
              </button>
              <button style={btn('#374151')} onClick={handleTrafficReset}>
                Сброс
              </button>
            </div>
          </div>
        )}

        {demo === 'coffee' && (
          <div>
            {/* Code */}
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.78rem', color: '#64748b' }}>
              <pre style={{ margin: 0 }}>
{`function* coffeeMachine() {
  while (true) {
    yield 'idle'       // ожидание
    yield 'selecting'  // выбор напитка
    yield 'brewing'    // варка
    yield 'ready'      // готово
  }
}

const machine = coffeeMachine()
machine.next() // idle
machine.next() // selecting  (action: 'select')
machine.next() // brewing    (action: 'brew')
machine.next() // ready      (action: 'done')
machine.next() // idle       (action: 'take') → цикл`}
              </pre>
            </div>

            {/* State diagram (horizontal) */}
            <div style={{
              display: 'flex',
              gap: '0.4rem',
              alignItems: 'center',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
            }}>
              {(['idle', 'selecting', 'brewing', 'ready'] as CoffeeState[]).map((s, i) => {
                const info = COFFEE_COLORS[s]
                const isActive = coffeeState === s
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{
                      background: isActive ? info.bg : '#0f172a',
                      border: `2px solid ${info.border}`,
                      borderRadius: '8px',
                      padding: '0.4rem 0.7rem',
                      fontSize: '0.72rem',
                      color: isActive ? info.border : '#475569',
                      fontWeight: isActive ? 'bold' : 'normal',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? `0 0 10px ${info.border}50` : 'none',
                    }}>
                      {s}
                    </div>
                    {i < 3 && <div style={{ color: '#334155', fontSize: '1rem' }}>→</div>}
                  </div>
                )
              })}
              <div style={{ color: '#334155', fontSize: '0.72rem' }}>→ (цикл)</div>
            </div>

            {/* Current state */}
            <div style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              borderLeft: `4px solid ${COFFEE_COLORS[coffeeState].border}`,
            }}>
              <span style={{ color: COFFEE_COLORS[coffeeState].border, fontWeight: 'bold' }}>
                {COFFEE_COLORS[coffeeState].desc}
              </span>
              <span style={{ color: '#475569', fontSize: '0.78rem', marginLeft: '0.75rem' }}>
                state: "{coffeeState}"
              </span>
            </div>

            {/* Log */}
            <div style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '0.6rem 0.75rem',
              marginBottom: '1rem',
              maxHeight: '100px',
              overflowY: 'auto',
              fontSize: '0.75rem',
            }}>
              {coffeeLog.map((entry, i) => (
                <div key={i} style={{ color: i === coffeeLog.length - 1 ? '#94a3b8' : '#334155' }}>
                  {entry}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                style={btn('#8b5cf6', !coffeeTransition)}
                onClick={handleCoffeeAction}
                disabled={!coffeeTransition}
              >
                {coffeeTransition?.btn ?? 'Завершено'}
              </button>
              <button style={btn('#374151')} onClick={handleCoffeeReset}>
                Сброс
              </button>
            </div>

            {/* Explanation */}
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
              Генератор — идеальный конечный автомат: каждый{' '}
              <code style={{ color: '#a78bfa' }}>yield</code> — новое состояние,{' '}
              <code style={{ color: '#60a5fa' }}>.next(action)</code> — переход.
              Состояния инкапсулированы, переходы — строго по порядку.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
