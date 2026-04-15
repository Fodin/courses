import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================
// Task 0.1 Solution: Call Stack Visualizer
// ============================================

// The call chain we visualize: main → a → b → c → d
// Each step shows push (call) and pop (return) of frames

interface StackFrame {
  name: string
  line: string
  color: string
}

interface Step {
  action: 'push' | 'pop' | 'info'
  frame?: StackFrame
  description: string
  highlightLine: number
}

const FRAME_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

const CODE_LINES = [
  'function d() {',
  '  return 42',
  '}',
  'function c() {',
  '  return d()',
  '}',
  'function b() {',
  '  return c()',
  '}',
  'function a() {',
  '  return b()',
  '}',
  'a() // start',
]

const STEPS: Step[] = [
  {
    action: 'info',
    description: 'Начало программы. Call Stack пустой.',
    highlightLine: 12,
  },
  {
    action: 'push',
    frame: { name: 'a()', line: 'строка 13', color: FRAME_COLORS[0] },
    description: 'Вызов a() — движок создаёт фрейм и кладёт его на стек.',
    highlightLine: 9,
  },
  {
    action: 'push',
    frame: { name: 'b()', line: 'строка 11', color: FRAME_COLORS[1] },
    description: 'a() вызывает b() — новый фрейм поверх a().',
    highlightLine: 6,
  },
  {
    action: 'push',
    frame: { name: 'c()', line: 'строка 8', color: FRAME_COLORS[2] },
    description: 'b() вызывает c() — стек растёт.',
    highlightLine: 3,
  },
  {
    action: 'push',
    frame: { name: 'd()', line: 'строка 5', color: FRAME_COLORS[3] },
    description: 'c() вызывает d() — самый верхний фрейм.',
    highlightLine: 0,
  },
  {
    action: 'pop',
    description: 'd() выполнен, возвращает 42. Фрейм снимается со стека.',
    highlightLine: 1,
  },
  {
    action: 'pop',
    description: 'c() получила результат и возвращает его. Фрейм снят.',
    highlightLine: 4,
  },
  {
    action: 'pop',
    description: 'b() возвращает значение. Фрейм снят.',
    highlightLine: 7,
  },
  {
    action: 'pop',
    description: 'a() завершена. Фрейм снят. Стек пустой.',
    highlightLine: 10,
  },
]

export function Task0_1_Solution() {
  const [stepIndex, setStepIndex] = useState(0)
  const [stack, setStack] = useState<StackFrame[]>([])
  const [mode, setMode] = useState<'trace' | 'recursion'>('trace')
  const [depth, setDepth] = useState(5)

  const applyStep = useCallback((targetIndex: number) => {
    const newStack: StackFrame[] = []
    for (let i = 1; i <= targetIndex; i++) {
      const s = STEPS[i]
      if (s.action === 'push' && s.frame) {
        newStack.push(s.frame)
      } else if (s.action === 'pop') {
        newStack.pop()
      }
    }
    setStack(newStack)
    setStepIndex(targetIndex)
  }, [])

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) applyStep(stepIndex + 1)
  }

  const handleReset = () => {
    setStack([])
    setStepIndex(0)
  }

  const currentStep = STEPS[stepIndex]
  const isOverflow = mode === 'recursion' && depth > 25

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.4rem 1rem',
    borderRadius: '6px 6px 0 0',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
    background: active ? '#1e293b' : '#0f172a',
    color: active ? '#60a5fa' : '#64748b',
    borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
  })

  const btnStyle = (disabled?: boolean): React.CSSProperties => ({
    padding: '0.5rem 1.2rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : '#3b82f6',
    color: disabled ? '#475569' : '#fff',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
  })

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 0.1 — Визуализатор Call Stack
      </h2>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0' }}>
        <button style={tabStyle(mode === 'trace')} onClick={() => { setMode('trace'); handleReset() }}>
          Трассировка вызовов
        </button>
        <button style={tabStyle(mode === 'recursion')} onClick={() => { setMode('recursion'); handleReset() }}>
          Глубина рекурсии
        </button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>

        {mode === 'trace' && (
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Code panel */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>КОД</div>
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', lineHeight: 1.7 }}>
                {CODE_LINES.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      background: currentStep.highlightLine === i ? 'rgba(59,130,246,0.15)' : 'transparent',
                      borderLeft: currentStep.highlightLine === i ? '3px solid #3b82f6' : '3px solid transparent',
                      paddingLeft: '0.5rem',
                      borderRadius: '2px',
                      transition: 'background 0.2s',
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

            {/* Stack panel */}
            <div style={{ minWidth: '180px' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                CALL STACK ({stack.length} фреймов)
              </div>
              <div style={{
                background: '#0f172a',
                borderRadius: '8px',
                padding: '0.75rem',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: '0.4rem',
              }}>
                {stack.length === 0 && (
                  <div style={{ color: '#475569', textAlign: 'center', fontSize: '0.8rem' }}>
                    (пустой)
                  </div>
                )}
                {stack.map((frame, i) => (
                  <div
                    key={`${frame.name}-${i}`}
                    style={{
                      background: frame.color,
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      opacity: i === stack.length - 1 ? 1 : 0.6,
                      boxShadow: i === stack.length - 1 ? `0 0 12px ${frame.color}60` : 'none',
                      transition: 'all 0.3s',
                    }}
                  >
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{frame.name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>{frame.line}</span>
                  </div>
                ))}
                {/* Stack top indicator */}
                {stack.length > 0 && (
                  <div style={{ fontSize: '0.7rem', color: '#3b82f6', textAlign: 'right' }}>
                    TOP ↑
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{
                marginTop: '0.75rem',
                background: '#0f172a',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.82rem',
                color: '#94a3b8',
                lineHeight: 1.5,
                minHeight: '60px',
              }}>
                <span style={{ color: '#60a5fa' }}>Шаг {stepIndex}/{STEPS.length - 1}:</span>{' '}
                {currentStep.description}
              </div>
            </div>
          </div>
        )}

        {mode === 'recursion' && (
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>
                Глубина рекурсии: <span style={{ color: isOverflow ? '#ef4444' : '#60a5fa', fontWeight: 'bold' }}>{depth}</span>
              </label>
              <input
                type="range"
                min={1}
                max={30}
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#3b82f6' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569' }}>
                <span>1 (безопасно)</span>
                <span style={{ color: '#f59e0b' }}>~25 (опасно)</span>
                <span style={{ color: '#ef4444' }}>30 (overflow)</span>
              </div>
            </div>

            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
              <pre style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>
{`function factorial(n) {
  if (n <= 1) return 1         // базовый случай
  return n * factorial(n - 1)  // рекурсивный вызов
}

factorial(${depth})`}
              </pre>
            </div>

            {/* Stack visualization */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
              {Array.from({ length: Math.min(depth, 26) }).map((_, i) => {
                const isTop = i === Math.min(depth, 26) - 1
                const frameN = depth - i
                return (
                  <div
                    key={i}
                    style={{
                      background: isOverflow && isTop ? '#ef4444' : FRAME_COLORS[i % FRAME_COLORS.length],
                      borderRadius: '4px',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.72rem',
                      color: '#fff',
                      opacity: isTop ? 1 : 0.5 + (i / Math.min(depth, 26)) * 0.5,
                      fontWeight: isTop ? 'bold' : 'normal',
                    }}
                  >
                    {frameN > 0 ? `f(${frameN})` : 'f(0)'}
                  </div>
                )
              })}
              {depth > 26 && (
                <div style={{ color: '#ef4444', fontSize: '0.72rem', alignSelf: 'center' }}>
                  +{depth - 26} фреймов...
                </div>
              )}
            </div>

            {isOverflow ? (
              <div style={{
                background: '#450a0a',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                padding: '1rem',
                color: '#fca5a5',
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.4rem', color: '#ef4444' }}>
                  RangeError: Maximum call stack size exceeded
                </div>
                <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                  Стек переполнен. Каждый рекурсивный вызов занимает память.
                  При глубине &gt;~10 000 (реальный JS) или &gt;25 (упрощённая модель) — движок
                  выбрасывает ошибку Stack Overflow.
                </div>
              </div>
            ) : (
              <div style={{
                background: '#052e16',
                border: '1px solid #10b981',
                borderRadius: '8px',
                padding: '1rem',
                color: '#6ee7b7',
                fontSize: '0.85rem',
              }}>
                Стек в норме. {depth} фрейм{depth === 1 ? '' : depth < 5 ? 'а' : 'ов'} в стеке.
                Результат будет вычислен корректно.
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        {mode === 'trace' && (
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              style={btnStyle(stepIndex >= STEPS.length - 1)}
              onClick={handleNext}
              disabled={stepIndex >= STEPS.length - 1}
            >
              Шаг вперёд →
            </button>
            <button style={btnStyle(stepIndex === 0)} onClick={handleReset} disabled={stepIndex === 0}>
              Сброс
            </button>
            <span style={{ color: '#475569', fontSize: '0.8rem', alignSelf: 'center' }}>
              {stepIndex}/{STEPS.length - 1}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Task 0.2 Solution: Main Thread Blocking Demo
// ============================================

// Slow fibonacci — deliberately unoptimized to block the thread
function fibSlow(n: number): number {
  if (n <= 1) return n
  return fibSlow(n - 1) + fibSlow(n - 2)
}

// Chunked fibonacci via setTimeout — yields control back to event loop
function fibChunked(
  n: number,
  onProgress: (partial: string) => void,
  onDone: (result: number, ms: number) => void
): void {
  const start = performance.now()

  // We compute iteratively in chunks
  const memo: number[] = [0, 1]

  function computeChunk(i: number) {
    const chunkEnd = Math.min(i + 5000, n + 1)
    for (; i < chunkEnd; i++) {
      memo[i] = (memo[i - 1] ?? 0) + (memo[i - 2] ?? 0)
    }
    onProgress(`Вычислено до fib(${Math.min(i, n)}) из fib(${n})...`)

    if (i <= n) {
      setTimeout(() => computeChunk(i), 0)
    } else {
      const elapsed = Math.round(performance.now() - start)
      onDone(memo[n] ?? 0, elapsed)
    }
  }

  if (n < 2) {
    onDone(n, 0)
  } else {
    setTimeout(() => computeChunk(2), 0)
  }
}

export function Task0_2_Solution() {
  const [mode, setMode] = useState<'blocking' | 'chunked'>('blocking')
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [blockTime, setBlockTime] = useState<number | null>(null)
  const [clickCount, setClickCount] = useState(0)
  const [progress, setProgress] = useState<string>('')

  // Spinner frame cycles — will freeze during blocking computation
  const [spinnerFrame, setSpinnerFrame] = useState(0)
  const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  const spinnerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startSpinner = () => {
    if (spinnerRef.current) clearInterval(spinnerRef.current)
    spinnerRef.current = setInterval(() => {
      setSpinnerFrame((f) => (f + 1) % spinnerChars.length)
    }, 80)
  }

  const stopSpinner = () => {
    if (spinnerRef.current) {
      clearInterval(spinnerRef.current)
      spinnerRef.current = null
    }
  }

  useEffect(() => {
    return () => stopSpinner()
  }, [])

  const runBlocking = () => {
    setIsRunning(true)
    setResult(null)
    setBlockTime(null)
    setProgress('Вычисляется...')
    startSpinner()

    // Give React one frame to render the "running" state, then block
    setTimeout(() => {
      const t0 = performance.now()
      const r = fibSlow(42)
      const elapsed = Math.round(performance.now() - t0)
      stopSpinner()
      setBlockTime(elapsed)
      setResult(`fib(42) = ${r}`)
      setProgress('')
      setIsRunning(false)
    }, 16)
  }

  const runChunked = () => {
    setIsRunning(true)
    setResult(null)
    setBlockTime(null)
    startSpinner()
    fibChunked(
      500000,
      (msg) => setProgress(msg),
      (_res, ms) => {
        stopSpinner()
        setResult(`fib(500 000) вычислен за ${ms} мс (результат огромный!)`)
        setProgress('')
        setBlockTime(ms)
        setIsRunning(false)
      }
    )
  }

  const handleRun = () => {
    if (mode === 'blocking') runBlocking()
    else runChunked()
  }

  const handleReset = () => {
    stopSpinner()
    setIsRunning(false)
    setResult(null)
    setBlockTime(null)
    setClickCount(0)
    setProgress('')
    setSpinnerFrame(0)
  }

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.4rem 1rem',
    borderRadius: '6px 6px 0 0',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
    background: active ? '#1e293b' : '#0f172a',
    color: active ? '#60a5fa' : '#64748b',
    borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
  })

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 0.2 — Блокировка главного потока
      </h2>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0' }}>
        <button style={tabStyle(mode === 'blocking')} onClick={() => { setMode('blocking'); handleReset() }}>
          Синхронная блокировка
        </button>
        <button style={tabStyle(mode === 'chunked')} onClick={() => { setMode('chunked'); handleReset() }}>
          Чанкинг через setTimeout
        </button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>

        {/* Explanation */}
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.82rem',
          color: '#94a3b8',
          lineHeight: 1.6,
          borderLeft: `3px solid ${mode === 'blocking' ? '#ef4444' : '#10b981'}`,
        }}>
          {mode === 'blocking' ? (
            <>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Синхронный режим:</span>{' '}
              fibonacci(42) блокирует Call Stack на несколько секунд.
              Пока функция выполняется — браузер не может ничего отрендерить или обработать события.
              Спиннер замёрзнет, кнопка "Кликни меня" не реагирует.
            </>
          ) : (
            <>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>Чанкинг:</span>{' '}
              Вычисление разбивается на небольшие части. Между чанками вызывается setTimeout(fn, 0),
              что позволяет Event Loop обработать другие события. UI остаётся отзывчивым.
            </>
          )}
        </div>

        {/* Code snippet */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
          <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {mode === 'blocking'
              ? `// Блокирует Call Stack на всё время выполнения\nfunction fibSlow(n) {\n  if (n <= 1) return n\n  return fibSlow(n-1) + fibSlow(n-2) // ~3.5 млрд операций\n}\nfibSlow(42) // занимает главный поток`
              : `// Вычисляет итеративно, уступает управление каждые ~5000 шагов\nfunction computeChunk(i) {\n  const end = Math.min(i + 5000, n + 1)\n  for (; i < end; i++) memo[i] = memo[i-1] + memo[i-2]\n  if (i <= n) setTimeout(() => computeChunk(i), 0) // yield!\n  else onDone(memo[n])\n}`}
          </pre>
        </div>

        {/* Spinner / animation indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span style={{
              fontSize: '1.4rem',
              color: isRunning ? '#60a5fa' : '#475569',
              display: 'inline-block',
              transition: 'color 0.2s',
            }}>
              {isRunning ? spinnerChars[spinnerFrame] : '◉'}
            </span>
            <span style={{ fontSize: '0.82rem', color: isRunning ? '#93c5fd' : '#64748b' }}>
              {isRunning
                ? (mode === 'blocking' ? 'Вычисляется... (UI заморожен)' : (progress || 'Вычисляется...'))
                : 'Ожидание...'}
            </span>
          </div>

          {/* Click counter */}
          <button
            onClick={() => setClickCount((c) => c + 1)}
            style={{
              background: '#1e3a5f',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              color: '#93c5fd',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              transition: 'opacity 0.2s',
            }}
          >
            Кликни меня: {clickCount} раз
          </button>
        </div>

        {/* Result */}
        {result && (
          <div style={{
            background: '#052e16',
            border: '1px solid #10b981',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>Готово: </span>
            <span style={{ color: '#6ee7b7' }}>{result}</span>
            {blockTime !== null && (
              <span style={{ marginLeft: '1rem', color: '#94a3b8' }}>
                ({mode === 'blocking' ? '⚠️ заблокировано на' : 'выполнено за'} {blockTime} мс)
              </span>
            )}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleRun}
            disabled={isRunning}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              border: 'none',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              background: isRunning ? '#1e293b' : (mode === 'blocking' ? '#dc2626' : '#059669'),
              color: isRunning ? '#475569' : '#fff',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
            }}
          >
            {isRunning
              ? 'Выполняется...'
              : mode === 'blocking'
              ? 'Запустить fibonacci(42)'
              : 'Запустить fibonacci(500000)'}
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: '#374151',
              color: '#e5e7eb',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
            }}
          >
            Сброс
          </button>
        </div>

        {/* Tip */}
        {mode === 'blocking' && !isRunning && !result && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#475569' }}>
            Совет: нажмите "Кликни меня" несколько раз, затем запустите вычисление и снова кликните.
          </div>
        )}
      </div>
    </div>
  )
}
