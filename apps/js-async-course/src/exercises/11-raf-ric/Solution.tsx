import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================
// Task 11.1 Solution: rAF vs setTimeout
// ============================================

export function Task11_1_Solution() {
  const [running, setRunning] = useState(false)
  const [heavyLoad, setHeavyLoad] = useState(false)
  const [rafPos, setRafPos] = useState(0)
  const [setPos, setSetPos] = useState(0)
  const [rafFps, setRafFps] = useState(0)
  const [setFps, setSetFps] = useState(0)

  const rafRef = useRef<number | null>(null)
  const setRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const runningRef = useRef(false)
  const heavyLoadRef = useRef(false)

  // rAF ball state
  const rafPosRef = useRef(0)
  const rafLastFrameRef = useRef(0)
  const rafFrameTimesRef = useRef<number[]>([])

  // setTimeout ball state
  const setPosRef = useRef(0)
  const setLastFrameRef = useRef(0)
  const setFrameTimesRef = useRef<number[]>([])

  // FPS update interval
  const fpsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const doHeavyWork = useCallback(() => {
    if (!heavyLoadRef.current) return
    // Simulate heavy synchronous work (~2ms)
    const end = performance.now() + 2
    while (performance.now() < end) {
      Math.sqrt(Math.random())
    }
  }, [])

  const startRaf = useCallback(() => {
    const WIDTH = 360

    const loop = (now: number) => {
      if (!runningRef.current) return

      if (rafLastFrameRef.current > 0) {
        const delta = now - rafLastFrameRef.current
        rafFrameTimesRef.current.push(delta)
        if (rafFrameTimesRef.current.length > 30) rafFrameTimesRef.current.shift()
      }
      rafLastFrameRef.current = now

      doHeavyWork()

      rafPosRef.current = (rafPosRef.current + 2) % WIDTH
      setRafPos(rafPosRef.current)

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
  }, [doHeavyWork])

  const startSet = useCallback(() => {
    const WIDTH = 360

    const loop = () => {
      if (!runningRef.current) return

      const now = performance.now()
      if (setLastFrameRef.current > 0) {
        const delta = now - setLastFrameRef.current
        setFrameTimesRef.current.push(delta)
        if (setFrameTimesRef.current.length > 30) setFrameTimesRef.current.shift()
      }
      setLastFrameRef.current = now

      doHeavyWork()

      setPosRef.current = (setPosRef.current + 2) % WIDTH
      setSetPos(setPosRef.current)

      setRef.current = setTimeout(loop, 16)
    }

    setRef.current = setTimeout(loop, 16)
  }, [doHeavyWork])

  const start = useCallback(() => {
    runningRef.current = true
    setRunning(true)
    rafPosRef.current = 0
    setPosRef.current = 0
    rafLastFrameRef.current = 0
    setLastFrameRef.current = 0
    rafFrameTimesRef.current = []
    setFrameTimesRef.current = []

    startRaf()
    startSet()

    fpsIntervalRef.current = setInterval(() => {
      const rafTimes = rafFrameTimesRef.current
      const setTimes = setFrameTimesRef.current
      if (rafTimes.length > 1) {
        const avg = rafTimes.reduce((a, b) => a + b, 0) / rafTimes.length
        setRafFps(Math.round(1000 / avg))
      }
      if (setTimes.length > 1) {
        const avg = setTimes.reduce((a, b) => a + b, 0) / setTimes.length
        setSetFps(Math.round(1000 / avg))
      }
    }, 500)
  }, [startRaf, startSet])

  const stop = useCallback(() => {
    runningRef.current = false
    setRunning(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (setRef.current) clearTimeout(setRef.current)
    if (fpsIntervalRef.current) clearInterval(fpsIntervalRef.current)
  }, [])

  const reset = useCallback(() => {
    stop()
    setRafPos(0)
    setSetPos(0)
    setRafFps(0)
    setSetFps(0)
  }, [stop])

  useEffect(() => {
    return () => {
      runningRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (setRef.current) clearTimeout(setRef.current)
      if (fpsIntervalRef.current) clearInterval(fpsIntervalRef.current)
    }
  }, [])

  const toggleLoad = useCallback(() => {
    const next = !heavyLoadRef.current
    heavyLoadRef.current = next
    setHeavyLoad(next)
  }, [])

  const s: Record<string, React.CSSProperties> = {
    container: {
      background: '#0f172a',
      color: '#e2e8f0',
      padding: '1.5rem',
      borderRadius: '12px',
      fontFamily: "'Fira Code', monospace",
      fontSize: '0.9rem',
    },
    track: {
      background: '#1e293b',
      borderRadius: '8px',
      height: '48px',
      position: 'relative',
      marginBottom: '0.5rem',
      overflow: 'hidden',
    },
    label: {
      fontSize: '0.72rem',
      color: '#64748b',
      marginBottom: '0.25rem',
    },
    fps: {
      fontSize: '0.78rem',
      marginBottom: '1rem',
    },
  }

  const btn = (color: string, disabled?: boolean): React.CSSProperties => ({
    padding: '0.45rem 1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : color,
    color: disabled ? '#475569' : '#fff',
    fontFamily: 'inherit',
    fontSize: '0.82rem',
    marginRight: '0.5rem',
  })

  return (
    <div className="exercise-container" style={s.container}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 11.1 — rAF vs setTimeout
      </h2>

      <div style={{ background: '#1e293b', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
        {/* rAF ball */}
        <div style={s.label}>requestAnimationFrame — синхронизация с монитором</div>
        <div style={s.track}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: rafPos,
            transform: 'translateY(-50%)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            boxShadow: '0 0 12px #3b82f6aa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            color: '#fff',
            fontWeight: 'bold',
          }}>rAF</div>
        </div>
        <div style={{ ...s.fps, color: rafFps >= 55 ? '#10b981' : rafFps >= 30 ? '#f59e0b' : '#ef4444' }}>
          FPS: {rafFps || '—'} {rafFps >= 55 ? '(плавно)' : rafFps > 0 ? '(рывки)' : ''}
        </div>

        {/* setTimeout ball */}
        <div style={s.label}>setTimeout(fn, 16) — таймер без гарантий</div>
        <div style={s.track}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: setPos,
            transform: 'translateY(-50%)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            boxShadow: '0 0 12px #f59e0baa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.6rem',
            color: '#fff',
            fontWeight: 'bold',
          }}>set</div>
        </div>
        <div style={{ ...s.fps, color: setFps >= 55 ? '#10b981' : setFps >= 30 ? '#f59e0b' : '#ef4444' }}>
          FPS: {setFps || '—'} {setFps >= 55 ? '(плавно)' : setFps > 0 ? '(рывки)' : ''}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {!running ? (
            <button style={btn('#059669')} onClick={start}>Старт</button>
          ) : (
            <button style={btn('#dc2626')} onClick={stop}>Стоп</button>
          )}
          <button style={btn('#374151', running)} onClick={reset} disabled={running}>Сброс</button>
          <button
            style={{ ...btn(heavyLoad ? '#7c3aed' : '#475569'), border: heavyLoad ? '1px solid #a78bfa' : 'none' }}
            onClick={toggleLoad}
          >
            {heavyLoad ? 'Нагрузка: ВКЛ' : 'Нагрузка: ВЫКЛ'}
          </button>
        </div>

        {heavyLoad && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.5rem 0.75rem',
            background: '#2d1b69',
            borderRadius: '6px',
            fontSize: '0.78rem',
            color: '#a78bfa',
            borderLeft: '3px solid #7c3aed',
          }}>
            Включена тяжёлая нагрузка (~2ms синхронного кода в каждом кадре).
            rAF шарик остаётся плавнее — setTimeout накапливает задержки.
          </div>
        )}
      </div>

      <div style={{
        background: '#0f172a',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        fontSize: '0.8rem',
        color: '#94a3b8',
        lineHeight: 1.6,
        borderLeft: '3px solid #3b82f6',
      }}>
        <strong style={{ color: '#60a5fa' }}>Почему разница?</strong> rAF вызывается браузером строго перед
        отрисовкой кадра — не чаще, чем монитор успевает показать. setTimeout(fn, 16) — лишь пожелание:
        реальный интервал может быть 16, 17, 18, 32ms. При нагрузке разница становится очевидной.
      </div>
    </div>
  )
}

// ============================================
// Task 11.2 Solution: rAF и Event Loop
// ============================================

type Phase = 'idle' | 'js' | 'raf' | 'style' | 'layout' | 'paint' | 'composite'

interface FrameRecord {
  id: number
  duration: number
  phases: Phase[]
  rafCount: number
}

export function Task11_2_Solution() {
  const [running, setRunning] = useState(false)
  const [frames, setFrames] = useState<FrameRecord[]>([])
  const [currentPhase, setCurrentPhase] = useState<Phase>('idle')
  const [rafPending, setRafPending] = useState(0)
  const [heavyRaf, setHeavyRaf] = useState(false)

  const runningRef = useRef(false)
  const frameCountRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const frameStartRef = useRef(0)
  const rafPendingCountRef = useRef(1)
  const heavyRafRef = useRef(false)

  useEffect(() => { heavyRafRef.current = heavyRaf }, [heavyRaf])

  const runFrame = useCallback(() => {
    if (!runningRef.current) return

    const frameStart = performance.now()
    frameStartRef.current = frameStart
    frameCountRef.current++
    const frameId = frameCountRef.current
    const count = rafPendingCountRef.current

    setCurrentPhase('js')

    // Simulate JS phase
    setTimeout(() => {
      if (!runningRef.current) return
      setCurrentPhase('raf')

      // Simulate rAF callbacks
      let i = 0
      const runNextRaf = () => {
        i++
        if (i >= count) {
          // Heavy rAF stretches the frame
          if (heavyRafRef.current) {
            const end = performance.now() + 8
            while (performance.now() < end) Math.sqrt(Math.random())
          }

          setTimeout(() => {
            if (!runningRef.current) return
            setCurrentPhase('style')
            setTimeout(() => {
              if (!runningRef.current) return
              setCurrentPhase('layout')
              setTimeout(() => {
                if (!runningRef.current) return
                setCurrentPhase('paint')
                setTimeout(() => {
                  if (!runningRef.current) return
                  setCurrentPhase('composite')

                  const duration = Math.round(performance.now() - frameStart)
                  const allPhases: Phase[] = ['js', 'raf', 'style', 'layout', 'paint', 'composite']
                  setFrames(prev => {
                    const next = [...prev, { id: frameId, duration, phases: allPhases, rafCount: count }]
                    return next.slice(-8)
                  })

                  setTimeout(() => {
                    if (!runningRef.current) return
                    setCurrentPhase('idle')
                    rafRef.current = requestAnimationFrame(runFrame)
                  }, 100)
                }, 40)
              }, 40)
            }, 40)
          }, 40)
        }
      }
      runNextRaf()
    }, 60)
  }, [])

  const start = useCallback(() => {
    runningRef.current = true
    setRunning(true)
    setFrames([])
    frameCountRef.current = 0
    setCurrentPhase('idle')
    rafRef.current = requestAnimationFrame(runFrame)
  }, [runFrame])

  const stop = useCallback(() => {
    runningRef.current = false
    setRunning(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setCurrentPhase('idle')
  }, [])

  useEffect(() => () => {
    runningRef.current = false
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  const PHASES: { key: Phase; label: string; color: string; desc: string }[] = [
    { key: 'js', label: 'JS', color: '#f59e0b', desc: 'Макро/микрозадачи' },
    { key: 'raf', label: 'rAF', color: '#8b5cf6', desc: 'rAF колбэки' },
    { key: 'style', label: 'Style', color: '#3b82f6', desc: 'Вычисление стилей' },
    { key: 'layout', label: 'Layout', color: '#06b6d4', desc: 'Reflow' },
    { key: 'paint', label: 'Paint', color: '#10b981', desc: 'Отрисовка' },
    { key: 'composite', label: 'Comp.', color: '#ec4899', desc: 'Композитинг' },
  ]

  return (
    <div className="exercise-container" style={{
      background: '#0f172a', color: '#e2e8f0', padding: '1.5rem',
      borderRadius: '12px', fontFamily: "'Fira Code', monospace", fontSize: '0.9rem',
    }}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 11.2 — rAF и Event Loop: анатомия кадра
      </h2>

      {/* Frame anatomy legend */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>ФАЗЫ КАДРА (~16.6ms при 60fps)</div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {PHASES.map(p => (
            <div key={p.key} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.6rem',
              borderRadius: '6px',
              background: currentPhase === p.key ? `${p.color}33` : '#0f172a',
              border: `1px solid ${currentPhase === p.key ? p.color : '#334155'}`,
              transition: 'all 0.2s',
              transform: currentPhase === p.key ? 'scale(1.05)' : 'scale(1)',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '2px', background: p.color }} />
              <span style={{ fontSize: '0.75rem', color: currentPhase === p.key ? '#f8fafc' : '#94a3b8' }}>
                {p.label}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#475569' }}>{p.desc}</span>
            </div>
          ))}
        </div>

        {/* Current phase highlight */}
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          background: currentPhase === 'idle' ? '#1e293b' : `${PHASES.find(p => p.key === currentPhase)?.color ?? '#475569'}22`,
          border: `1px solid ${currentPhase === 'idle' ? '#334155' : PHASES.find(p => p.key === currentPhase)?.color ?? '#475569'}`,
          fontSize: '0.82rem',
          color: '#e2e8f0',
          transition: 'all 0.3s',
        }}>
          {currentPhase === 'idle' && 'Ожидание следующего кадра... (Idle)'}
          {currentPhase === 'js' && 'Выполняются задачи Event Loop (макро/микрозадачи)'}
          {currentPhase === 'raf' && `Выполняются rAF колбэки (${rafPendingCountRef.current} шт.) — перед Style/Layout`}
          {currentPhase === 'style' && 'Браузер пересчитывает CSS-стили'}
          {currentPhase === 'layout' && 'Reflow: вычисляются размеры и позиции элементов'}
          {currentPhase === 'paint' && 'Paint: пиксели отрисовываются в буфер'}
          {currentPhase === 'composite' && 'Composite: слои объединяются и выводятся на экран'}
        </div>
      </div>

      {/* Frame history */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>ИСТОРИЯ КАДРОВ</div>
        {frames.length === 0 ? (
          <div style={{ color: '#475569', fontSize: '0.82rem' }}>Нажмите "Старт" для запуска симуляции</div>
        ) : (
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-end', height: '80px' }}>
            {frames.map(f => {
              const bad = f.duration > 24
              return (
                <div key={f.id} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}>
                  <div style={{ fontSize: '0.65rem', color: bad ? '#ef4444' : '#94a3b8' }}>
                    {f.duration}ms
                  </div>
                  <div style={{
                    width: '100%',
                    height: `${Math.min(60, f.duration * 1.5)}px`,
                    borderRadius: '4px',
                    background: bad ? 'linear-gradient(180deg, #ef4444, #dc2626)' : 'linear-gradient(180deg, #3b82f6, #1d4ed8)',
                    border: `1px solid ${bad ? '#f87171' : '#60a5fa'}`,
                  }} />
                  <div style={{ fontSize: '0.6rem', color: '#475569' }}>#{f.id}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        {!running ? (
          <button onClick={start} style={{
            padding: '0.45rem 1rem', borderRadius: '6px', border: 'none',
            cursor: 'pointer', background: '#059669', color: '#fff',
            fontFamily: 'inherit', fontSize: '0.82rem',
          }}>Старт</button>
        ) : (
          <button onClick={stop} style={{
            padding: '0.45rem 1rem', borderRadius: '6px', border: 'none',
            cursor: 'pointer', background: '#dc2626', color: '#fff',
            fontFamily: 'inherit', fontSize: '0.82rem',
          }}>Стоп</button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>rAF в кадре:</span>
          {[1, 3, 5].map(n => (
            <button key={n}
              onClick={() => { rafPendingCountRef.current = n; setRafPending(n) }}
              style={{
                padding: '0.3rem 0.6rem', borderRadius: '4px', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem',
                background: (rafPending === n || (rafPending === 0 && n === 1)) ? '#3b82f6' : '#1e293b',
                color: '#fff',
              }}
            >{n}</button>
          ))}
        </div>

        <button
          onClick={() => setHeavyRaf(h => !h)}
          style={{
            padding: '0.45rem 0.8rem', borderRadius: '6px',
            border: `1px solid ${heavyRaf ? '#ef4444' : '#334155'}`,
            cursor: 'pointer', background: heavyRaf ? '#450a0a' : '#1e293b',
            color: heavyRaf ? '#fca5a5' : '#94a3b8',
            fontFamily: 'inherit', fontSize: '0.78rem',
          }}
        >
          {heavyRaf ? 'Тяжёлый rAF: ВКЛ' : 'Тяжёлый rAF: ВЫКЛ'}
        </button>
      </div>

      <div style={{
        background: '#0f172a', borderRadius: '8px', padding: '0.75rem',
        fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6,
        borderLeft: '3px solid #8b5cf6',
      }}>
        <strong style={{ color: '#a78bfa' }}>Ключевой момент:</strong> rAF колбэки выполняются после
        JS-задач, но до Style/Layout/Paint. Если rAF тяжёлый — кадр "растягивается" (&gt;16.6ms) и FPS падает.
        Несколько rAF в одном кадре — все выполнятся до рендера.
      </div>
    </div>
  )
}

// ============================================
// Task 11.3 Solution: requestIdleCallback
// ============================================

export function Task11_3_Solution() {
  const [mode, setMode] = useState<'sync' | 'ric' | null>(null)
  const [progress, setProgress] = useState(0)
  const [processed, setProcessed] = useState(0)
  const [done, setDone] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [animAngle, setAnimAngle] = useState(0)
  const [idleLog, setIdleLog] = useState<Array<{ id: number; items: number; remaining: number }>>([])

  const animRef = useRef<number | null>(null)
  const ricRef = useRef<number | null>(null)
  const runningRef = useRef(false)
  const startTimeRef = useRef(0)
  const idleChunkIdRef = useRef(0)

  const TOTAL = 10000

  // Spinning animation — runs independently via rAF
  const startAnim = useCallback(() => {
    let angle = 0
    const loop = () => {
      if (!runningRef.current && animRef.current !== null) {
        cancelAnimationFrame(animRef.current)
        animRef.current = null
        return
      }
      angle = (angle + 3) % 360
      setAnimAngle(angle)
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
  }, [])

  const stopAnim = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    }
  }, [])

  // Simulate processing one item (CPU work)
  const processItem = (i: number) => {
    // Simulate some computation
    return Math.sqrt(i * 17 + Math.sin(i) * 100)
  }

  const runSync = useCallback(() => {
    setMode('sync')
    setProgress(0)
    setProcessed(0)
    setDone(false)
    setIdleLog([])
    runningRef.current = true
    startTimeRef.current = performance.now()
    startAnim()

    // Block the thread — animation will freeze
    setTimeout(() => {
      let sum = 0
      for (let i = 0; i < TOTAL; i++) {
        sum += processItem(i)
        // Sort simulation
        if (i % 100 === 0) {
          const arr = Array.from({ length: 100 }, (_, k) => k * Math.random())
          arr.sort()
        }
      }
      void sum
      const elapsed = Math.round(performance.now() - startTimeRef.current)
      setProgress(100)
      setProcessed(TOTAL)
      setTotalTime(elapsed)
      setDone(true)
      runningRef.current = false
      stopAnim()
    }, 0)
  }, [startAnim, stopAnim])

  const runRIC = useCallback(() => {
    setMode('ric')
    setProgress(0)
    setProcessed(0)
    setDone(false)
    setIdleLog([])
    idleChunkIdRef.current = 0
    runningRef.current = true
    startTimeRef.current = performance.now()
    startAnim()

    let cursor = 0

    const idleWork = (deadline: IdleDeadline) => {
      if (!runningRef.current) return

      const chunkId = ++idleChunkIdRef.current
      const chunkStart = cursor
      const remaining = Math.round(deadline.timeRemaining())

      // Work while there's idle time
      while (cursor < TOTAL && deadline.timeRemaining() > 1) {
        processItem(cursor)
        if (cursor % 100 === 0) {
          const arr = Array.from({ length: 100 }, (_, k) => k * Math.random())
          arr.sort()
        }
        cursor++
      }

      const itemsThisChunk = cursor - chunkStart
      setIdleLog(prev => [
        ...prev.slice(-9),
        { id: chunkId, items: itemsThisChunk, remaining },
      ])
      setProcessed(cursor)
      setProgress(Math.round((cursor / TOTAL) * 100))

      if (cursor < TOTAL) {
        ricRef.current = requestIdleCallback(idleWork, { timeout: 2000 })
      } else {
        const elapsed = Math.round(performance.now() - startTimeRef.current)
        setTotalTime(elapsed)
        setDone(true)
        runningRef.current = false
        stopAnim()
      }
    }

    ricRef.current = requestIdleCallback(idleWork, { timeout: 2000 })
  }, [startAnim, stopAnim])

  const reset = useCallback(() => {
    runningRef.current = false
    stopAnim()
    if (ricRef.current) cancelIdleCallback(ricRef.current)
    setMode(null)
    setProgress(0)
    setProcessed(0)
    setDone(false)
    setTotalTime(0)
    setIdleLog([])
    setAnimAngle(0)
  }, [stopAnim])

  useEffect(() => () => {
    runningRef.current = false
    if (animRef.current) cancelAnimationFrame(animRef.current)
    if (ricRef.current) cancelIdleCallback(ricRef.current)
  }, [])

  const isRunning = mode !== null && !done

  return (
    <div className="exercise-container" style={{
      background: '#0f172a', color: '#e2e8f0', padding: '1.5rem',
      borderRadius: '12px', fontFamily: "'Fira Code', monospace", fontSize: '0.9rem',
    }}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 11.3 — requestIdleCallback
      </h2>

      <div style={{ background: '#1e293b', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
        {/* Spinner animation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '4px solid #334155',
              borderTop: `4px solid ${mode === 'sync' && isRunning ? '#ef4444' : mode === 'ric' && isRunning ? '#10b981' : '#3b82f6'}`,
              transform: `rotate(${animAngle}deg)`,
              transition: mode === 'sync' && isRunning ? 'none' : 'border-color 0.3s',
              margin: '0 auto',
            }} />
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.4rem' }}>
              {isRunning ? (mode === 'sync' ? 'замер!' : 'крутится') : 'анимация'}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Прогресс: {processed} / {TOTAL}</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{progress}%</span>
            </div>
            <div style={{ background: '#0f172a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: mode === 'sync' ? '#ef4444' : '#10b981',
                transition: 'width 0.1s',
                borderRadius: '4px',
              }} />
            </div>
            {done && (
              <div style={{ fontSize: '0.78rem', marginTop: '0.4rem', color: '#94a3b8' }}>
                Завершено за <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{totalTime} мс</span>
                {mode === 'sync'
                  ? ' — анимация замерзала всё это время'
                  : ' — анимация работала плавно'}
              </div>
            )}
          </div>
        </div>

        {/* Idle log */}
        {mode === 'ric' && idleLog.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.4rem' }}>
              IDLE ПЕРИОДЫ (timeRemaining при старте → элементов обработано)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {idleLog.map(entry => (
                <div key={entry.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.75rem',
                }}>
                  <span style={{ color: '#475569', minWidth: '2.5rem' }}>#{entry.id}</span>
                  <div style={{
                    flex: 1,
                    background: '#0f172a',
                    borderRadius: '3px',
                    height: '10px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0, top: 0, bottom: 0,
                      width: `${Math.min(100, (entry.remaining / 50) * 100)}%`,
                      background: entry.remaining > 20 ? '#10b981' : entry.remaining > 5 ? '#f59e0b' : '#ef4444',
                      borderRadius: '3px',
                    }} />
                  </div>
                  <span style={{ color: '#60a5fa', minWidth: '4rem' }}>{entry.remaining}ms idle</span>
                  <span style={{ color: '#94a3b8' }}>{entry.items} ел.</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            disabled={isRunning}
            onClick={runSync}
            style={{
              padding: '0.45rem 1rem', borderRadius: '6px', border: 'none',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              background: isRunning ? '#1e293b' : '#dc2626',
              color: isRunning ? '#475569' : '#fff',
              fontFamily: 'inherit', fontSize: '0.82rem',
            }}
          >Синхронно (заморозит UI)</button>

          <button
            disabled={isRunning}
            onClick={runRIC}
            style={{
              padding: '0.45rem 1rem', borderRadius: '6px', border: 'none',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              background: isRunning ? '#1e293b' : '#059669',
              color: isRunning ? '#475569' : '#fff',
              fontFamily: 'inherit', fontSize: '0.82rem',
            }}
          >Через rIC (UI не тормозит)</button>

          <button
            onClick={reset}
            style={{
              padding: '0.45rem 1rem', borderRadius: '6px', border: 'none',
              cursor: 'pointer', background: '#374151', color: '#e5e7eb',
              fontFamily: 'inherit', fontSize: '0.82rem',
            }}
          >Сброс</button>
        </div>
      </div>

      <div style={{
        background: '#0f172a', borderRadius: '8px', padding: '0.75rem',
        fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6,
        borderLeft: '3px solid #10b981',
      }}>
        <strong style={{ color: '#34d399' }}>Аналогия:</strong> requestIdleCallback — уборщик в офисе.
        Он приходит только когда все сотрудники ушли домой (браузер не занят). Метод
        <code style={{ color: '#a5f3fc', margin: '0 0.3rem' }}>deadline.timeRemaining()</code>
        говорит сколько минут до начала рабочего дня — он успеет убрать ещё несколько комнат.
      </div>
    </div>
  )
}

// ============================================
// Task 11.4 Solution: Планировщик задач
// ============================================

type TaskType = 'urgent' | 'animation' | 'background'

interface ScheduledTask {
  id: number
  type: TaskType
  label: string
  status: 'pending' | 'running' | 'done'
  addedAt: number
}

interface TimelineEntry {
  frameId: number
  tasks: Array<{ type: TaskType; label: string }>
}

export function Task11_4_Solution() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([])
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [stats, setStats] = useState({ urgent: 0, animation: 0, background: 0 })
  const [running, setRunning] = useState(false)
  const [frameId, setFrameId] = useState(0)

  const taskIdRef = useRef(0)
  const urgentQueueRef = useRef<ScheduledTask[]>([])
  const animQueueRef = useRef<ScheduledTask[]>([])
  const bgQueueRef = useRef<ScheduledTask[]>([])
  const rafRef = useRef<number | null>(null)
  const ricRef = useRef<number | null>(null)
  const runningRef = useRef(false)
  const frameIdRef = useRef(0)

  const addTask = useCallback((type: TaskType) => {
    const id = ++taskIdRef.current
    const labels: Record<TaskType, string[]> = {
      urgent: ['Обновить DOM', 'Синхр. состояние', 'Критичный рендер', 'Flush буфера'],
      animation: ['Animate sprite', 'Scroll parallax', 'Canvas draw', 'CSS transition'],
      background: ['Prefetch данных', 'Индексировать', 'Сжать изображение', 'Логировать'],
    }
    const label = labels[type][id % labels[type].length]

    const task: ScheduledTask = { id, type, label, status: 'pending', addedAt: performance.now() }

    if (type === 'urgent') urgentQueueRef.current.push(task)
    else if (type === 'animation') animQueueRef.current.push(task)
    else bgQueueRef.current.push(task)

    setTasks(prev => [...prev, task])
  }, [])

  const processFrame = useCallback(() => {
    if (!runningRef.current) return

    frameIdRef.current++
    const fId = frameIdRef.current
    setFrameId(fId)

    const frameTasks: Array<{ type: TaskType; label: string }> = []

    // 1. Urgent tasks via microtask (simulated)
    const urgentBatch = urgentQueueRef.current.splice(0, urgentQueueRef.current.length)
    urgentBatch.forEach(t => {
      frameTasks.push({ type: 'urgent', label: t.label })
      setTasks(prev => prev.map(p => p.id === t.id ? { ...p, status: 'done' } : p))
      setStats(s => ({ ...s, urgent: s.urgent + 1 }))
    })

    // 2. Animation tasks (rAF window)
    const animBatch = animQueueRef.current.splice(0, 2) // max 2 per frame
    animBatch.forEach(t => {
      frameTasks.push({ type: 'animation', label: t.label })
      setTasks(prev => prev.map(p => p.id === t.id ? { ...p, status: 'done' } : p))
      setStats(s => ({ ...s, animation: s.animation + 1 }))
    })

    if (frameTasks.length > 0) {
      setTimeline(prev => [
        { frameId: fId, tasks: frameTasks },
        ...prev.slice(0, 4),
      ])
    }

    rafRef.current = requestAnimationFrame(processFrame)

    // 3. Background tasks in idle time
    if (bgQueueRef.current.length > 0 && ricRef.current === null) {
      ricRef.current = requestIdleCallback((deadline) => {
        ricRef.current = null
        const bgBatch: ScheduledTask[] = []
        while (bgQueueRef.current.length > 0 && deadline.timeRemaining() > 2) {
          bgBatch.push(bgQueueRef.current.shift()!)
        }
        bgBatch.forEach(t => {
          setTasks(prev => prev.map(p => p.id === t.id ? { ...p, status: 'done' } : p))
          setStats(s => ({ ...s, background: s.background + 1 }))
        })
        if (bgBatch.length > 0) {
          setTimeline(prev => [
            { frameId: fId, tasks: bgBatch.map(t => ({ type: 'background' as TaskType, label: t.label })) },
            ...prev.slice(0, 4),
          ])
        }
      }, { timeout: 3000 })
    }
  }, [])

  const start = useCallback(() => {
    runningRef.current = true
    setRunning(true)
    frameIdRef.current = 0
    rafRef.current = requestAnimationFrame(processFrame)
  }, [processFrame])

  const stop = useCallback(() => {
    runningRef.current = false
    setRunning(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (ricRef.current) cancelIdleCallback(ricRef.current)
    rafRef.current = null
    ricRef.current = null
  }, [])

  const reset = useCallback(() => {
    stop()
    urgentQueueRef.current = []
    animQueueRef.current = []
    bgQueueRef.current = []
    taskIdRef.current = 0
    frameIdRef.current = 0
    setTasks([])
    setTimeline([])
    setStats({ urgent: 0, animation: 0, background: 0 })
    setFrameId(0)
  }, [stop])

  useEffect(() => () => {
    runningRef.current = false
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (ricRef.current) cancelIdleCallback(ricRef.current)
  }, [])

  const TYPE_CONFIG: Record<TaskType, { color: string; bg: string; icon: string; label: string; api: string }> = {
    urgent: { color: '#ef4444', bg: '#450a0a', icon: '', label: 'Срочные', api: 'queueMicrotask / sync' },
    animation: { color: '#8b5cf6', bg: '#2e1065', icon: '', label: 'Анимация', api: 'requestAnimationFrame' },
    background: { color: '#10b981', bg: '#052e16', icon: '', label: 'Фоновые', api: 'requestIdleCallback' },
  }

  const pendingCounts = {
    urgent: urgentQueueRef.current.length,
    animation: animQueueRef.current.length,
    background: bgQueueRef.current.length,
  }

  return (
    <div className="exercise-container" style={{
      background: '#0f172a', color: '#e2e8f0', padding: '1.5rem',
      borderRadius: '12px', fontFamily: "'Fira Code', monospace", fontSize: '0.9rem',
    }}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 11.4 — Планировщик задач
      </h2>

      {/* Three queues */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        {(['urgent', 'animation', 'background'] as TaskType[]).map(type => {
          const cfg = TYPE_CONFIG[type]
          const pending = tasks.filter(t => t.type === type && t.status !== 'done')
          return (
            <div key={type} style={{
              background: cfg.bg,
              border: `1px solid ${cfg.color}44`,
              borderRadius: '8px',
              padding: '0.75rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: cfg.color, fontWeight: 'bold' }}>{cfg.label}</span>
                <span style={{
                  background: cfg.color, color: '#fff', borderRadius: '9999px',
                  padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 'bold',
                }}>{pending.length}</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#475569', marginBottom: '0.5rem' }}>{cfg.api}</div>

              <div style={{ minHeight: '60px', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {pending.slice(0, 4).map(t => (
                  <div key={t.id} style={{
                    background: `${cfg.color}22`,
                    border: `1px solid ${cfg.color}44`,
                    borderRadius: '4px',
                    padding: '0.2rem 0.4rem',
                    fontSize: '0.68rem',
                    color: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}>
                    <span style={{ color: '#475569' }}>#{t.id}</span>
                    {t.label}
                  </div>
                ))}
                {pending.length > 4 && (
                  <div style={{ fontSize: '0.65rem', color: '#475569' }}>+{pending.length - 4} ещё...</div>
                )}
              </div>

              <button
                onClick={() => addTask(type)}
                style={{
                  width: '100%', padding: '0.3rem', borderRadius: '4px', border: 'none',
                  cursor: 'pointer', background: cfg.color, color: '#fff',
                  fontFamily: 'inherit', fontSize: '0.75rem',
                }}
              >+ Добавить</button>

              <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: '0.35rem', textAlign: 'center' }}>
                Выполнено: {stats[type]}
              </div>
            </div>
          )
        })}
      </div>

      {/* Timeline */}
      {timeline.length > 0 && (
        <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.5rem' }}>
            ПОСЛЕДНИЕ КАДРЫ (кадр #{frameId})
          </div>
          {timeline.map(entry => (
            <div key={`${entry.frameId}-${entry.tasks.length}`} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '0.3rem', fontSize: '0.72rem',
            }}>
              <span style={{ color: '#475569', minWidth: '3rem' }}>#{entry.frameId}</span>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {entry.tasks.map((t, i) => (
                  <span key={i} style={{
                    padding: '0.15rem 0.4rem',
                    borderRadius: '3px',
                    background: `${TYPE_CONFIG[t.type].color}33`,
                    color: TYPE_CONFIG[t.type].color,
                    border: `1px solid ${TYPE_CONFIG[t.type].color}55`,
                    fontSize: '0.68rem',
                  }}>{t.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Priority explanation */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.5rem' }}>ПРИОРИТЕТ ВЫПОЛНЕНИЯ</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Urgent</span>
          <span style={{ color: '#475569' }}>&gt;</span>
          <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>Animation (rAF)</span>
          <span style={{ color: '#475569' }}>&gt;</span>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>Background (rIC)</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.4rem' }}>
          Срочные: каждый кадр | Анимация: до 2 за кадр | Фоновые: только в idle-время
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {!running ? (
          <button onClick={start} style={{
            padding: '0.45rem 1rem', borderRadius: '6px', border: 'none',
            cursor: 'pointer', background: '#059669', color: '#fff',
            fontFamily: 'inherit', fontSize: '0.82rem',
          }}>Запустить планировщик</button>
        ) : (
          <button onClick={stop} style={{
            padding: '0.45rem 1rem', borderRadius: '6px', border: 'none',
            cursor: 'pointer', background: '#dc2626', color: '#fff',
            fontFamily: 'inherit', fontSize: '0.82rem',
          }}>Остановить</button>
        )}
        <button onClick={reset} style={{
          padding: '0.45rem 1rem', borderRadius: '6px', border: 'none',
          cursor: 'pointer', background: '#374151', color: '#e5e7eb',
          fontFamily: 'inherit', fontSize: '0.82rem',
        }}>Сброс</button>
      </div>

      {!running && tasks.length === 0 && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#475569' }}>
          Добавьте задачи через кнопки в колонках, затем запустите планировщик.
        </div>
      )}
    </div>
  )
}
